import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { useNotificationSound } from './useNotificationSound';
import { useCrewAuth } from './CrewAuthContext';
import { crewApi, ChatMessage, ChatChannel, Recipient } from '@/lib/crewApi';
import { generateRoom, roomToUrl, detectMeetingLink } from '@/lib/videoCall';
import { fileToDataUrl } from '@/lib/fileUtils';
import VideoCallModal from './VideoCallModal';
import ChatFileCard from './ChatFileCard';
import FilePreviewModal, { PreviewFile } from './FilePreviewModal';
import SaveToDepoModal from './SaveToDepoModal';

interface Props {
  open: boolean;
  recipientId: number | null;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
}

type Target = { kind: 'channel'; slug: string; name: string; icon: string } | { kind: 'dm'; id: number; name: string; avatar: string | null };

const StarComWidget = ({ open, recipientId, onClose, onUnreadChange }: Props) => {
  const { me } = useCrewAuth();
  const [fullscreen, setFullscreen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [target, setTarget] = useState<Target>({ kind: 'channel', slug: 'general', name: 'Общий канал', icon: 'Hash' });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState(false);
  const [unread, setUnread] = useState(0);
  const [online, setOnline] = useState(0);
  const [sending, setSending] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [callRoom, setCallRoom] = useState<string | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [externalLink, setExternalLink] = useState('');
  const [previewFile, setPreviewFile] = useState<PreviewFile | null>(null);
  const [saveMsg, setSaveMsg] = useState<ChatMessage | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastIdRef = useRef(0);
  const playSound = useNotificationSound();

  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  }, []);

  useEffect(() => { onUnreadChange?.(unread); }, [unread, onUnreadChange]);

  // load channels + recipients
  const loadDirectory = useCallback(() => {
    if (!me) return;
    crewApi.getChannels().then((r) => { setChannels(r.channels); setOnline(r.online); }).catch(() => {});
    crewApi.getRecipients().then((r) => setRecipients(r.recipients)).catch(() => {});
  }, [me]);

  useEffect(() => { loadDirectory(); }, [loadDirectory]);

  // switch to DM when recipientId provided
  useEffect(() => {
    if (recipientId && open) {
      const person = recipients.find((r) => r.id === recipientId);
      setTarget({ kind: 'dm', id: recipientId, name: person?.callsign || 'Сотрудник', avatar: person?.avatar_url || null });
    }
  }, [recipientId, open, recipients]);

  const fetchMessages = useCallback((after: number) => {
    if (target.kind === 'channel') return crewApi.getMessages(target.slug, after);
    return crewApi.getDM(target.id, after);
  }, [target]);

  // load history on target change
  useEffect(() => {
    if (!me || !open) return;
    lastIdRef.current = 0;
    setMessages([]);
    fetchMessages(0).then((r) => {
      setMessages(r.messages);
      if (r.messages.length) lastIdRef.current = r.messages[r.messages.length - 1].id;
      scrollBottom();
    }).catch(() => {});
  }, [target, me, open, fetchMessages, scrollBottom]);

  // polling
  useEffect(() => {
    if (!me) return;
    const poll = async () => {
      try {
        const r = await fetchMessages(lastIdRef.current);
        if (r.messages.length) {
          const fresh: ChatMessage[] = r.messages;
          lastIdRef.current = fresh[fresh.length - 1].id;
          setMessages((prev) => [...prev, ...fresh]);
          const incoming = fresh.filter((m) => !m.mine);
          if (incoming.length) {
            playSound();
            setFlash(true);
            setTimeout(() => setFlash(false), 1600);
            if (!open || minimized) setUnread((u) => u + incoming.length);
          }
          if (open && !minimized) scrollBottom();
        }
        // refresh unread badges on DM list periodically
      } catch { /* ignore */ }
    };
    const timer = setInterval(poll, 3000);
    return () => clearInterval(timer);
  }, [fetchMessages, me, open, minimized, playSound, scrollBottom]);

  // refresh recipients unread every 8s
  useEffect(() => {
    if (!me || !open) return;
    const t = setInterval(() => {
      crewApi.getRecipients().then((r) => setRecipients(r.recipients)).catch(() => {});
    }, 8000);
    return () => clearInterval(t);
  }, [me, open]);

  useEffect(() => {
    if (open && !minimized) { setUnread(0); scrollBottom(); }
  }, [open, minimized, target, scrollBottom]);

  const sendText = async (text: string) => {
    const body = text.trim();
    if (!body) return;
    const r = target.kind === 'channel'
      ? await crewApi.sendMessage(target.slug, body)
      : await crewApi.sendDM(target.id, body);
    setMessages((prev) => [...prev, r.message]);
    lastIdRef.current = Math.max(lastIdRef.current, r.message.id);
    scrollBottom();
  };

  const send = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      await sendText(input);
      setInput('');
    } catch { /* ignore */ } finally {
      setSending(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (uploadingFile) return;
    if (file.size > 30 * 1024 * 1024) {
      alert('Файл превышает 30 МБ');
      return;
    }
    setUploadingFile(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const payload = {
        file_data: dataUrl,
        file_name: file.name,
        file_mime: file.type || 'application/octet-stream',
      };
      const r = target.kind === 'channel'
        ? await crewApi.sendMessage(target.slug, input.trim(), payload)
        : await crewApi.sendDM(target.id, input.trim(), payload);
      setMessages((prev) => [...prev, r.message]);
      lastIdRef.current = Math.max(lastIdRef.current, r.message.id);
      setInput('');
      scrollBottom();
    } catch (e: any) {
      alert(e.message || 'Не удалось загрузить файл');
    } finally {
      setUploadingFile(false);
    }
  };

  const openPreview = (m: ChatMessage) => {
    if (!m.file_url) return;
    setPreviewFile({ url: m.file_url, name: m.file_name || 'Файл', mime: m.file_mime, size: m.file_size, path: m.depo_path });
  };

  const startVideoCall = async () => {
    if (sending) return;
    setSending(true);
    try {
      const room = generateRoom();
      const url = roomToUrl(room);
      await sendText(`📹 Приглашение на видеовстречу DEOD: ${url}`);
      setCallRoom(room);
    } catch { /* ignore */ } finally {
      setSending(false);
    }
  };

  const sendExternalLink = async () => {
    const link = externalLink.trim();
    if (!link) return;
    const normalized = /^https?:\/\//i.test(link) ? link : `https://${link}`;
    setSending(true);
    try {
      await sendText(`📹 Ссылка на видеовстречу: ${normalized}`);
      setExternalLink('');
      setLinkOpen(false);
    } catch { /* ignore */ } finally {
      setSending(false);
    }
  };

  const joinMeeting = (link: { url: string; room: string | null }) => {
    if (link.room) setCallRoom(link.room);
    else window.open(link.url, '_blank', 'noopener');
  };

  const pickChannel = (c: ChatChannel) => {
    setTarget({ kind: 'channel', slug: c.slug, name: c.name, icon: c.icon });
    setShowSidebar(false);
  };
  const pickPerson = (p: Recipient) => {
    setTarget({ kind: 'dm', id: p.id, name: p.callsign, avatar: p.avatar_url });
    setShowSidebar(false);
  };

  if (!open) return null;

  const containerClass = fullscreen
    ? 'fixed inset-0 z-[60] w-screen h-screen rounded-none'
    : 'fixed z-[60] w-[400px] max-w-[calc(100vw-1.5rem)] h-[540px] max-h-[calc(100vh-6rem)] rounded-2xl';

  const dragConstraints = {
    left: -(typeof window !== 'undefined' ? window.innerWidth - 440 : 800),
    right: 0,
    top: -20,
    bottom: typeof window !== 'undefined' ? window.innerHeight - 200 : 400,
  };

  const Sidebar = (
    <div className={`${fullscreen ? 'w-64 flex' : (showSidebar ? 'absolute inset-0 z-30 flex bg-[#0B0C10]/98' : 'hidden')} flex-col border-r border-[#45A29E]/20 bg-[#0B0C10]/80 shrink-0`}>
      {!fullscreen && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#45A29E]/15">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B7684]">Куда писать</span>
          <button onClick={() => setShowSidebar(false)} className="text-[#6B7684] hover:text-white"><Icon name="X" size={15} /></button>
        </div>
      )}
      <div className="overflow-y-auto flex-1">
        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#6B7684]">Каналы</div>
        {channels.map((c) => (
          <button key={c.slug} onClick={() => pickChannel(c)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${target.kind === 'channel' && target.slug === c.slug ? 'bg-[#45A29E]/15 border-l-2 border-[#66FCF1]' : 'hover:bg-[#1F2833]/60 border-l-2 border-transparent'}`}>
            <Icon name={c.icon as any} size={15} className="text-[#45A29E] shrink-0" />
            <span className="text-sm text-[#C5C6C7] flex-1 truncate">{c.name}</span>
          </button>
        ))}
        <div className="px-3 py-2 mt-1 text-[10px] font-mono uppercase tracking-widest text-[#6B7684]">Личные сообщения</div>
        {recipients.length === 0 && <div className="px-3 py-2 text-[11px] text-[#6B7684]">Нет других сотрудников</div>}
        {recipients.map((p) => (
          <button key={p.id} onClick={() => pickPerson(p)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${target.kind === 'dm' && target.id === p.id ? 'bg-[#45A29E]/15 border-l-2 border-[#66FCF1]' : 'hover:bg-[#1F2833]/60 border-l-2 border-transparent'}`}>
            <div className="relative w-7 h-7 rounded-full overflow-hidden bg-[#1F2833] border border-[#45A29E]/30 flex items-center justify-center shrink-0">
              {p.avatar_url ? <img src={p.avatar_url} alt={p.callsign} className="w-full h-full object-cover" /> : <Icon name="UserRound" size={14} className="text-[#45A29E]" />}
              {p.is_online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#45A29E] border border-[#0B0C10]" />}
            </div>
            <span className="text-sm text-[#C5C6C7] flex-1 truncate">{p.callsign}</span>
            {p.unread > 0 && <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF4D4D] text-white text-[10px] font-bold flex items-center justify-center">{p.unread}</span>}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
    <motion.div
      drag={!fullscreen}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={dragConstraints}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={fullscreen ? {} : { right: 16, top: 96 }}
      className={`${containerClass} border ${flash ? 'border-[#FF6600] shadow-[0_0_40px_rgba(255,102,0,0.5)]' : 'border-[#45A29E]/40 shadow-[0_0_40px_rgba(0,0,0,0.6)]'} bg-[#0B0C10]/95 backdrop-blur-xl overflow-hidden flex flex-col transition-colors`}
    >
      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.25, 0, 0.25, 0] }} exit={{ opacity: 0 }} transition={{ duration: 1.4 }}
            className="pointer-events-none absolute inset-0 bg-[#FF6600] z-20" />
        )}
      </AnimatePresence>

      <div className={`relative flex items-center gap-2 px-3 py-2.5 border-b border-[#45A29E]/30 bg-gradient-to-r from-[#45A29E]/15 to-transparent shrink-0 ${fullscreen ? '' : 'cursor-move'}`}>
        <div className="w-8 h-8 rounded-lg bg-[#45A29E]/15 border border-[#45A29E]/40 flex items-center justify-center shrink-0">
          <Icon name="Radio" size={16} className="text-[#66FCF1]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-heading font-bold text-sm text-white truncate">Межзвездная связь</div>
          <div className="text-[10px] text-[#45A29E] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#45A29E] animate-pulse" /> {online} на связи
          </div>
        </div>
        <button onClick={() => setMinimized((v) => !v)} title="Свернуть" className="text-[#6B7684] hover:text-[#66FCF1] transition-colors p-1">
          <Icon name={minimized ? 'ChevronUp' : 'Minus'} size={16} />
        </button>
        <button onClick={() => setFullscreen((v) => !v)} title="Во весь экран" className="text-[#6B7684] hover:text-[#66FCF1] transition-colors p-1">
          <Icon name={fullscreen ? 'Minimize2' : 'Maximize2'} size={15} />
        </button>
        <button onClick={onClose} title="Закрыть" className="text-[#6B7684] hover:text-[#FF4D4D] transition-colors p-1">
          <Icon name="X" size={16} />
        </button>
      </div>

      {!minimized && (
        <div className="flex flex-1 min-h-0 relative">
          {Sidebar}

          <div className="flex flex-col flex-1 min-w-0">
            {/* target bar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[#45A29E]/15 shrink-0">
              {!fullscreen && (
                <button onClick={() => setShowSidebar(true)} title="Выбрать получателя"
                  className="w-7 h-7 rounded-lg border border-[#45A29E]/30 text-[#66FCF1] hover:bg-[#45A29E]/10 flex items-center justify-center shrink-0">
                  <Icon name="Users" size={15} />
                </button>
              )}
              {target.kind === 'channel' ? (
                <><Icon name={target.icon as any} size={16} className="text-[#66FCF1]" /><span className="font-heading font-semibold text-white text-sm truncate">{target.name}</span></>
              ) : (
                <>
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-[#1F2833] border border-[#45A29E]/30 flex items-center justify-center shrink-0">
                    {target.avatar ? <img src={target.avatar} alt="" className="w-full h-full object-cover" /> : <Icon name="UserRound" size={12} className="text-[#45A29E]" />}
                  </div>
                  <span className="font-heading font-semibold text-white text-sm truncate">{target.name}</span>
                  <span className="text-[10px] text-[#6B7684]">· личное</span>
                </>
              )}
              <div className="flex-1" />
              <button onClick={startVideoCall} disabled={sending} title="Начать видеозвонок"
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold text-[11px] hover:opacity-90 disabled:opacity-50 shrink-0">
                <Icon name="Video" size={14} /> <span className="hidden sm:inline">Звонок</span>
              </button>
              <button onClick={() => setLinkOpen((v) => !v)} title="Отправить ссылку на встречу"
                className="w-7 h-7 rounded-lg border border-[#45A29E]/30 text-[#66FCF1] hover:bg-[#45A29E]/10 flex items-center justify-center shrink-0">
                <Icon name="Link" size={14} />
              </button>
            </div>

            {linkOpen && (
              <div className="flex items-center gap-2 px-3 py-2 border-b border-[#45A29E]/15 bg-[#1F2833]/40 shrink-0">
                <Icon name="Link" size={15} className="text-[#45A29E] shrink-0" />
                <input
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendExternalLink()}
                  placeholder="Вставьте ссылку Zoom / Google Meet / Яндекс..."
                  className="flex-1 bg-[#0B0C10]/60 border border-[#45A29E]/30 rounded-lg px-2 py-1.5 text-sm text-white placeholder:text-[#6B7684] focus:outline-none focus:border-[#66FCF1]/60"
                />
                <button onClick={sendExternalLink} disabled={sending || !externalLink.trim()}
                  className="px-3 py-1.5 rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold text-sm hover:opacity-90 disabled:opacity-50 shrink-0">
                  Отправить
                </button>
              </div>
            )}

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
              {messages.length === 0 && (
                <div className="text-center text-xs text-[#6B7684] py-8">Сообщений пока нет. Начните разговор!</div>
              )}
              {messages.map((m) => {
                const meeting = m.text ? detectMeetingLink(m.text) : null;
                const hasFile = !!m.file_url;
                return (
                  <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${fullscreen ? 'max-w-[60%]' : 'max-w-[85%]'}`}>
                      {!m.mine && <div className="text-[10px] text-[#45A29E] mb-0.5 ml-1">{m.callsign}</div>}
                      {hasFile && (
                        <div className="mb-1">
                          <ChatFileCard msg={m} mine={m.mine} onPreview={openPreview} onSaveToDepo={setSaveMsg} />
                        </div>
                      )}
                      {(m.text || (!hasFile && !meeting)) && (
                        <div className={`rounded-xl px-3 py-2 text-sm ${m.mine ? 'bg-[#45A29E]/25 text-white rounded-br-none' : 'bg-[#1F2833] text-[#C5C6C7] rounded-bl-none'}`}>
                          {meeting ? (
                            <div>
                              <div className="flex items-center gap-1.5 font-semibold text-white mb-1">
                                <Icon name="Video" size={15} className="text-[#66FCF1]" /> Видеовстреча
                              </div>
                              <div className="text-[11px] text-[#8B98A5] mb-2 break-all">{meeting.label}</div>
                              <button onClick={() => joinMeeting(meeting)}
                                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-bold text-sm hover:opacity-90">
                                <Icon name="PhoneCall" size={15} /> Присоединиться
                              </button>
                            </div>
                          ) : (
                            m.text
                          )}
                        </div>
                      )}
                      <div className={`text-[9px] text-[#6B7684] mt-0.5 ${m.mine ? 'text-right mr-1' : 'ml-1'}`}>
                        {new Date(m.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-2.5 border-t border-[#45A29E]/20 flex gap-2 shrink-0 items-center">
              <input ref={fileInputRef} type="file" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ''; }} />
              <button onClick={() => fileInputRef.current?.click()} disabled={uploadingFile} title="Прикрепить файл"
                className="w-9 h-9 rounded-lg border border-[#45A29E]/30 text-[#66FCF1] hover:bg-[#45A29E]/10 flex items-center justify-center shrink-0 disabled:opacity-50">
                <Icon name={uploadingFile ? 'Loader2' : 'Paperclip'} size={16} className={uploadingFile ? 'animate-spin' : ''} />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={target.kind === 'dm' ? `Написать ${target.name}...` : `Сообщение в «${target.name}»...`}
                className="flex-1 bg-[#1F2833]/70 border border-[#45A29E]/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#6B7684] focus:outline-none focus:border-[#66FCF1]/60"
              />
              <button onClick={send} disabled={sending} className="w-9 h-9 rounded-lg bg-[#45A29E] hover:bg-[#3d8f8b] flex items-center justify-center shrink-0 transition-colors disabled:opacity-50">
                <Icon name={sending ? 'Loader2' : 'Send'} size={16} className={`text-[#0B0C10] ${sending ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>

    <VideoCallModal
      room={callRoom}
      displayName={me?.callsign || 'Экипаж DEOD'}
      onClose={() => setCallRoom(null)}
    />
    <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
    <SaveToDepoModal msg={saveMsg} onClose={() => setSaveMsg(null)} onSaved={(path) => {
      setMessages((prev) => prev.map((mm) => mm.id === saveMsg?.id ? { ...mm, depo_path: path } : mm));
      setSaveMsg(null);
    }} />
    </>
  );
};

export default StarComWidget;