import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { useNotificationSound } from './useNotificationSound';
import { useCrewAuth } from './CrewAuthContext';
import { crewApi, ChatMessage, ChatChannel } from '@/lib/crewApi';

interface Props {
  open: boolean;
  onClose: () => void;
  onRequireAuth: () => void;
  onUnreadChange?: (count: number) => void;
}

const StarComWidget = ({ open, onClose, onRequireAuth, onUnreadChange }: Props) => {
  const { me } = useCrewAuth();
  const [fullscreen, setFullscreen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState(false);
  const [unread, setUnread] = useState(0);
  const [online, setOnline] = useState(0);
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef(0);
  const playSound = useNotificationSound();

  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  }, []);

  useEffect(() => {
    onUnreadChange?.(unread);
  }, [unread, onUnreadChange]);

  useEffect(() => {
    if (!me) return;
    crewApi.getChannels().then((r) => {
      setChannels(r.channels);
      setOnline(r.online);
    }).catch(() => {});
  }, [me]);

  useEffect(() => {
    if (!me) return;
    lastIdRef.current = 0;
    setMessages([]);
    crewApi.getMessages(activeChannel, 0).then((r) => {
      setMessages(r.messages);
      if (r.messages.length) lastIdRef.current = r.messages[r.messages.length - 1].id;
      scrollBottom();
    }).catch(() => {});
  }, [activeChannel, me, scrollBottom]);

  useEffect(() => {
    if (!me) return;
    const poll = async () => {
      try {
        const r = await crewApi.getMessages(activeChannel, lastIdRef.current);
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
      } catch { /* ignore */ }
    };
    const timer = setInterval(poll, 3000);
    return () => clearInterval(timer);
  }, [activeChannel, me, open, minimized, playSound, scrollBottom]);

  useEffect(() => {
    if (open && !minimized) {
      setUnread(0);
      scrollBottom();
    }
  }, [open, minimized, activeChannel, scrollBottom]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      const r = await crewApi.sendMessage(activeChannel, text);
      setMessages((prev) => [...prev, r.message]);
      lastIdRef.current = Math.max(lastIdRef.current, r.message.id);
      setInput('');
      scrollBottom();
    } catch { /* ignore */ } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  if (!me) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ left: 16, top: 96 }}
        className="fixed z-[60] w-[340px] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-[#45A29E]/40 bg-[#0B0C10]/95 backdrop-blur-xl p-6 text-center shadow-[0_0_40px_rgba(0,0,0,0.6)]"
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-[#6B7684] hover:text-white"><Icon name="X" size={18} /></button>
        <Icon name="Lock" size={30} className="text-[#66FCF1] mx-auto mb-3" />
        <h3 className="font-heading font-bold text-white mb-1">Межзвездная связь</h3>
        <p className="text-sm text-[#8B98A5] mb-4">Войдите в экипаж, чтобы общаться с коллегами</p>
        <button onClick={onRequireAuth} className="w-full py-2 rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold hover:opacity-90">
          Пристыковаться
        </button>
      </motion.div>
    );
  }

  const containerClass = fullscreen
    ? 'fixed inset-0 z-[60] w-screen h-screen rounded-none'
    : 'fixed z-[60] w-[380px] max-w-[calc(100vw-1.5rem)] h-[520px] max-h-[calc(100vh-6rem)] rounded-2xl';

  const activeCh = channels.find((c) => c.slug === activeChannel);
  const dragConstraints = {
    left: 0,
    right: typeof window !== 'undefined' ? window.innerWidth - 400 : 800,
    top: -20,
    bottom: typeof window !== 'undefined' ? window.innerHeight - 200 : 400,
  };

  return (
    <motion.div
      drag={!fullscreen}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={dragConstraints}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={fullscreen ? {} : { left: 16, top: 96 }}
      className={`${containerClass} border ${flash ? 'border-[#FF6600] shadow-[0_0_40px_rgba(255,102,0,0.5)]' : 'border-[#45A29E]/40 shadow-[0_0_40px_rgba(0,0,0,0.6)]'} bg-[#0B0C10]/95 backdrop-blur-xl overflow-hidden flex flex-col transition-colors`}
    >
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.25, 0, 0.25, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="pointer-events-none absolute inset-0 bg-[#FF6600] z-20"
          />
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
        <div className="flex flex-1 min-h-0">
          <div className={`${fullscreen ? 'w-56 flex' : 'hidden'} flex-col border-r border-[#45A29E]/20 bg-[#0B0C10]/60 shrink-0`}>
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#6B7684]">Каналы</div>
            {channels.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveChannel(c.slug)}
                className={`flex items-center gap-2 px-3 py-2.5 text-left transition-colors ${
                  activeChannel === c.slug ? 'bg-[#45A29E]/15 border-l-2 border-[#66FCF1]' : 'hover:bg-[#1F2833]/60 border-l-2 border-transparent'
                }`}
              >
                <Icon name={c.icon as any} size={15} className="text-[#45A29E] shrink-0" />
                <span className="text-sm text-[#C5C6C7] flex-1 truncate">{c.name}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            {!fullscreen && (
              <div className="flex gap-1 px-2 py-1.5 border-b border-[#45A29E]/15 overflow-x-auto scrollbar-hide shrink-0">
                {channels.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => setActiveChannel(c.slug)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
                      activeChannel === c.slug ? 'bg-[#45A29E]/20 text-[#66FCF1]' : 'text-[#8B98A5] hover:text-white'
                    }`}
                  >
                    <Icon name={c.icon as any} size={12} />
                    {c.name}
                  </button>
                ))}
              </div>
            )}

            {fullscreen && activeCh && (
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#45A29E]/15 shrink-0">
                <Icon name={activeCh.icon as any} size={16} className="text-[#66FCF1]" />
                <span className="font-heading font-semibold text-white">{activeCh.name}</span>
              </div>
            )}

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
              {messages.length === 0 && (
                <div className="text-center text-xs text-[#6B7684] py-8">Сообщений пока нет. Начните разговор!</div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${fullscreen ? 'max-w-[60%]' : 'max-w-[85%]'}`}>
                    {!m.mine && <div className="text-[10px] text-[#45A29E] mb-0.5 ml-1">{m.callsign}</div>}
                    <div className={`rounded-xl px-3 py-2 text-sm ${m.mine ? 'bg-[#45A29E]/25 text-white rounded-br-none' : 'bg-[#1F2833] text-[#C5C6C7] rounded-bl-none'}`}>
                      {m.text}
                    </div>
                    <div className={`text-[9px] text-[#6B7684] mt-0.5 ${m.mine ? 'text-right mr-1' : 'ml-1'}`}>
                      {new Date(m.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 border-t border-[#45A29E]/20 flex gap-2 shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={`Сообщение в «${activeCh?.name || 'канал'}»...`}
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
  );
};

export default StarComWidget;
