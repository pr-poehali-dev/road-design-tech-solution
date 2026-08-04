import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { bridgeApi, BridgeConversation, BridgeMessage, BridgeChannel, BridgeAttachment } from '@/lib/bridgeApi';
import { fileToDataUrl, fileIcon, formatSize } from '@/lib/fileUtils';
import FilePreviewModal, { PreviewFile } from '@/components/deod/FilePreviewModal';

const CHANNEL_ICON: Record<BridgeChannel, string> = {
  email: 'Mail',
  telegram: 'Send',
  max: 'MessageCircle',
};

const CHANNEL_LABEL: Record<BridgeChannel, string> = {
  email: 'Почта',
  telegram: 'Telegram',
  max: 'MAX',
};

const CHANNEL_COLOR: Record<BridgeChannel, string> = {
  email: '#66FCF1',
  telegram: '#45A29E',
  max: '#C89BFF',
};

const fmtTime = (d?: string) =>
  d ? new Date(d).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';

type ViewTab = 'chat' | 'inbox' | 'sent';

interface PendingAttachment {
  name: string;
  mime: string;
  size: number;
  dataUrl: string;
}

interface CRMBridgeProps {
  partnerId?: number;
  initialClientId?: number | null;
}

export const CRMBridge = ({ partnerId, initialClientId }: CRMBridgeProps = {}) => {
  const [tab, setTab] = useState<ViewTab>('chat');
  const [mailboxes, setMailboxes] = useState<string[]>([]);
  const [mailboxFilter, setMailboxFilter] = useState<string>('');

  const [conversations, setConversations] = useState<BridgeConversation[]>([]);
  const [filterChannel, setFilterChannel] = useState<BridgeChannel | 'all'>('all');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(initialClientId ?? null);
  const [messages, setMessages] = useState<BridgeMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [replyChannel, setReplyChannel] = useState<BridgeChannel>('email');
  const [replyMailbox, setReplyMailbox] = useState<string>('');
  const [pendingAttachments, setPendingAttachments] = useState<PendingAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState<PreviewFile | null>(null);

  const [flatList, setFlatList] = useState<BridgeMessage[]>([]);
  const [flatLoading, setFlatLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const prevClientIdRef = useRef<number | null>(null);

  useEffect(() => {
    bridgeApi.getMailboxes().then((res) => {
      const addrs = res.mailboxes.map((m) => m.address);
      setMailboxes(addrs);
      if (addrs.length) setReplyMailbox(addrs[0]);
    }).catch(() => {});
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      const res = await bridgeApi.getConversations(filterChannel === 'all' ? undefined : filterChannel, mailboxFilter || undefined, partnerId);
      setConversations(res.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [filterChannel, mailboxFilter, partnerId]);

  useEffect(() => {
    if (tab === 'chat') loadConversations();
  }, [tab, loadConversations]);

  // Тихое автообновление списка диалогов — почта синхронизируется фоном на уровне CRM,
  // здесь просто периодически подтягиваем актуальный список без индикатора загрузки
  useEffect(() => {
    if (tab !== 'chat') return;
    const interval = setInterval(() => {
      loadConversations();
    }, 15_000);
    return () => clearInterval(interval);
  }, [tab, loadConversations]);

  const loadMessages = useCallback(async (clientId: number) => {
    try {
      const res = await bridgeApi.getMessages(clientId);
      setMessages(res.messages);
      await bridgeApi.markRead(clientId);
      setConversations((prev) => prev.map((c) => (c.client_id === clientId ? { ...c, unread_messages_count: 0 } : c)));
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  useEffect(() => {
    if (selectedClientId) loadMessages(selectedClientId);
  }, [selectedClientId, loadMessages]);

  // Автообновление открытого диалога — новые ответы клиента появляются без ручного обновления
  useEffect(() => {
    if (!selectedClientId || tab !== 'chat') return;
    const interval = setInterval(() => {
      loadMessages(selectedClientId);
    }, 15_000);
    return () => clearInterval(interval);
  }, [selectedClientId, loadMessages, tab]);

  // Скроллим к последнему сообщению только при открытии диалога или если пользователь и так
  // находится внизу переписки — иначе автообновление каждые 15с будет сбрасывать чтение истории вниз
  useEffect(() => {
    const isNewConversation = prevClientIdRef.current !== selectedClientId;
    prevClientIdRef.current = selectedClientId;
    if (isNewConversation) {
      shouldAutoScrollRef.current = true;
    }
    if (shouldAutoScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: isNewConversation ? 'auto' : 'smooth' });
    }
  }, [messages, selectedClientId]);

  const handleMessagesScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < 80;
  };

  const loadFlatList = useCallback(async (direction: 'in' | 'out') => {
    setFlatLoading(true);
    try {
      const res = await bridgeApi.getEmailList(direction, mailboxFilter || undefined, undefined, partnerId);
      setFlatList(res.messages);
    } catch (error) {
      console.error('Error loading email list:', error);
    } finally {
      setFlatLoading(false);
    }
  }, [mailboxFilter, partnerId]);

  useEffect(() => {
    if (tab === 'inbox') loadFlatList('in');
    if (tab === 'sent') loadFlatList('out');
  }, [tab, loadFlatList]);

  const selectedConversation = conversations.find((c) => c.client_id === selectedClientId) || null;

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await bridgeApi.syncEmail(partnerId);
      await loadConversations();
      if (selectedClientId) await loadMessages(selectedClientId);
      if (res.created_leads > 0) {
        // тихо — новые лиды видны в разделе CRM автоматически
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('Не удалось синхронизировать почту. Проверьте настройки подключения.');
    } finally {
      setSyncing(false);
    }
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const added: PendingAttachment[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 25 * 1024 * 1024) {
        alert(`Файл "${file.name}" превышает 25 МБ и не будет прикреплён`);
        continue;
      }
      const dataUrl = await fileToDataUrl(file);
      added.push({ name: file.name, mime: file.type || 'application/octet-stream', size: file.size, dataUrl });
    }
    setPendingAttachments((prev) => [...prev, ...added]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePendingAttachment = (idx: number) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSend = async () => {
    if (!selectedClientId || !replyText.trim()) return;
    setSending(true);
    try {
      if (replyChannel === 'email') {
        await bridgeApi.sendEmail({
          client_id: selectedClientId,
          subject: replySubject || undefined,
          body: replyText.trim(),
          mailbox: replyMailbox || undefined,
          attachments: pendingAttachments.map((a) => ({ name: a.name, mime: a.mime, data: a.dataUrl })),
        }, partnerId);
      } else if (replyChannel === 'telegram') {
        await bridgeApi.sendTelegram({ client_id: selectedClientId, body: replyText.trim() }, partnerId);
      } else {
        alert('Канал MAX пока не подключён');
        setSending(false);
        return;
      }
      setReplyText('');
      setReplySubject('');
      setPendingAttachments([]);
      await loadMessages(selectedClientId);
      await loadConversations();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  const openFromFlatList = (m: BridgeMessage) => {
    if (!m.client_id) return;
    setSelectedClientId(m.client_id);
    setTab('chat');
  };

  const renderAttachments = (attachments: BridgeAttachment[]) => {
    if (!attachments?.length) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {attachments.map((a) => (
          <button
            key={a.id}
            onClick={() => setPreview({ url: a.url, name: a.file_name, mime: a.mime, size: a.size_bytes })}
            className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md bg-[#0B0C10]/50 border border-[#45A29E]/20 text-[#8B98A5] hover:text-[#66FCF1] hover:border-[#45A29E]/50 transition-colors max-w-[220px]"
            title={a.file_name}
          >
            <Icon name={fileIcon(a.file_name, a.mime)} size={12} className="shrink-0" />
            <span className="truncate">{a.file_name}</span>
            {a.size_bytes ? <span className="shrink-0 opacity-60">{formatSize(a.size_bytes)}</span> : null}
          </button>
        ))}
      </div>
    );
  };

  const mailboxOptions = mailboxes.length ? mailboxes : ['sale@sppi.ooo'];

  return (
    <div
      className={
        fullscreen
          ? 'fixed inset-0 z-[100] flex flex-col bg-[#0B0C10] p-4 gap-3'
          : 'flex flex-col h-[calc(100vh-220px)] p-4 gap-3'
      }
    >
      {/* ---- Tabs + mailbox filter ---- */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1 bg-[#0B0C10]/40 rounded-lg p-1">
          {([
            { id: 'chat', label: 'Диалоги', icon: 'MessagesSquare' },
            { id: 'inbox', label: 'Входящие', icon: 'Inbox' },
            { id: 'sent', label: 'Отправленные', icon: 'SendHorizontal' },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                tab === t.id ? 'bg-[#45A29E] text-[#0B0C10] font-bold' : 'text-[#8B98A5] hover:text-white'
              }`}
            >
              <Icon name={t.icon} size={13} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {mailboxes.length > 1 && (
            <select
              value={mailboxFilter}
              onChange={(e) => setMailboxFilter(e.target.value)}
              className="text-xs h-8 rounded-md bg-[#0B0C10]/40 border border-[#45A29E]/30 text-white px-2"
            >
              <option value="">Все почты</option>
              {mailboxOptions.map((mb) => (
                <option key={mb} value={mb}>{mb}</option>
              ))}
            </select>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSync}
            disabled={syncing}
            className="h-8 px-2 text-[#66FCF1] hover:bg-[#45A29E]/10"
            title="Проверить новые письма"
          >
            <Icon name={syncing ? 'Loader2' : 'RefreshCw'} size={14} className={syncing ? 'animate-spin' : ''} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setFullscreen((v) => !v)}
            className="h-8 px-2 text-[#66FCF1] hover:bg-[#45A29E]/10"
            title={fullscreen ? 'Свернуть' : 'Развернуть на весь экран'}
          >
            <Icon name={fullscreen ? 'Minimize2' : 'Maximize2'} size={14} />
          </Button>
        </div>
      </div>

      {tab !== 'chat' ? (
        <div className="flex-1 bg-[#1F2833]/40 rounded-lg border border-[#45A29E]/20 overflow-y-auto">
          {flatLoading ? (
            <div className="p-6 text-center"><Icon name="Loader2" size={22} className="animate-spin text-[#66FCF1] mx-auto" /></div>
          ) : flatList.length === 0 ? (
            <div className="p-6 text-center text-sm text-[#6B7684]">Писем пока нет</div>
          ) : (
            flatList.map((m) => (
              <button
                key={m.id}
                onClick={() => openFromFlatList(m)}
                disabled={!m.client_id}
                className="w-full text-left p-3 border-b border-[#45A29E]/10 hover:bg-[#45A29E]/5 transition-colors disabled:cursor-default disabled:hover:bg-transparent"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-white truncate">
                    {m.company_name || m.contact_person || (tab === 'inbox' ? m.email_from : m.email_to) || '—'}
                  </span>
                  <span className="shrink-0 flex items-center gap-1.5">
                    {m.mailbox && <span className="text-[10px] text-[#45A29E] font-mono">{m.mailbox}</span>}
                    <span className="text-[10px] text-[#6B7684]">{fmtTime(m.created_at)}</span>
                  </span>
                </div>
                {m.subject && <div className="text-xs font-semibold text-[#66FCF1] mt-0.5 truncate">{m.subject}</div>}
                <div className="text-xs text-[#8B98A5] truncate mt-0.5">{m.body}</div>
                {m.attachments?.length > 0 && (
                  <div className="text-[10px] text-[#6B7684] mt-1 flex items-center gap-1">
                    <Icon name="Paperclip" size={10} /> {m.attachments.length} вложение(й)
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="flex-1 flex gap-4 min-h-0">
          {/* ---- LEFT: conversation list ---- */}
          <div className="w-full sm:w-80 shrink-0 flex flex-col bg-[#1F2833]/40 rounded-lg border border-[#45A29E]/20 overflow-hidden">
            <div className="p-3 border-b border-[#45A29E]/20 space-y-2">
              <div className="flex gap-1">
                {(['all', 'email', 'telegram', 'max'] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setFilterChannel(ch)}
                    className={`text-[10px] px-2 py-1 rounded-md flex items-center gap-1 ${
                      filterChannel === ch ? 'bg-[#45A29E] text-[#0B0C10] font-bold' : 'bg-[#0B0C10]/40 text-[#8B98A5]'
                    }`}
                  >
                    {ch !== 'all' && <Icon name={CHANNEL_ICON[ch]} size={10} />}
                    {ch === 'all' ? 'Все' : CHANNEL_LABEL[ch]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center">
                  <Icon name="Loader2" size={22} className="animate-spin text-[#66FCF1] mx-auto" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-sm text-[#6B7684]">
                  Пока нет переписки.
                  <br />
                  Нажмите на значок обновления, чтобы проверить почту.
                </div>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.client_id}
                    onClick={() => setSelectedClientId(c.client_id)}
                    className={`w-full text-left p-3 border-b border-[#45A29E]/10 hover:bg-[#45A29E]/5 transition-colors ${
                      selectedClientId === c.client_id ? 'bg-[#45A29E]/10' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Icon name={CHANNEL_ICON[c.last_channel]} size={12} style={{ color: CHANNEL_COLOR[c.last_channel] }} className="shrink-0" />
                        <span className="text-sm font-medium text-white truncate">{c.contact_person || c.company_name || '—'}</span>
                        {c.auto_created && (
                          <span className="shrink-0 text-[9px] px-1 py-0.5 rounded bg-[#FF6600]/20 text-[#FF9B4D] font-bold">новый лид</span>
                        )}
                      </div>
                      {c.unread_messages_count > 0 && (
                        <span className="shrink-0 text-[10px] font-bold bg-[#FF6600] text-[#0B0C10] rounded-full px-1.5 py-0.5">
                          {c.unread_messages_count}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#8B98A5] truncate mt-0.5">
                      {c.last_direction === 'out' ? 'Вы: ' : ''}
                      {c.last_message || ''}
                    </div>
                    <div className="text-[10px] text-[#6B7684] mt-0.5 flex items-center gap-1.5">
                      {fmtTime(c.last_message_created_at)}
                      {c.last_mailbox && <span className="text-[#45A29E] font-mono">{c.last_mailbox}</span>}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ---- RIGHT: conversation window ---- */}
          <div className="flex-1 flex flex-col bg-[#1F2833]/40 rounded-lg border border-[#45A29E]/20 overflow-hidden">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-[#6B7684] text-sm">
                Выберите диалог слева
              </div>
            ) : (
              <>
                <div className="p-3 border-b border-[#45A29E]/20 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">{selectedConversation.contact_person || selectedConversation.company_name}</div>
                    <div className="text-xs text-[#8B98A5] flex items-center gap-2">
                      {selectedConversation.email && <span className="flex items-center gap-1"><Icon name="Mail" size={11} />{selectedConversation.email}</span>}
                      {selectedConversation.phone && <span className="flex items-center gap-1"><Icon name="Phone" size={11} />{selectedConversation.phone}</span>}
                    </div>
                  </div>
                </div>

                <div ref={messagesContainerRef} onScroll={handleMessagesScroll} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.direction === 'out' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[75%] rounded-lg px-3 py-2 ${
                          m.direction === 'out' ? 'bg-[#45A29E]/20 text-white' : 'bg-[#0B0C10]/50 text-[#C5C6C7]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#8B98A5]">
                          <Icon name={CHANNEL_ICON[m.channel]} size={10} style={{ color: CHANNEL_COLOR[m.channel] }} />
                          {m.direction === 'out' ? 'Вы' : m.sender_name || 'Клиент'}
                          {m.mailbox && <span className="text-[#45A29E] font-mono">· {m.mailbox}</span>}
                          <span className="ml-auto">{fmtTime(m.created_at)}</span>
                        </div>
                        {m.subject && <div className="text-xs font-semibold mb-1 text-[#66FCF1]">{m.subject}</div>}
                        <div className="text-sm whitespace-pre-wrap break-words">{m.body}</div>
                        {renderAttachments(m.attachments)}
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="text-center text-sm text-[#6B7684] py-8">Сообщений пока нет</div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t border-[#45A29E]/20 space-y-2">
                  <div className="flex gap-1 items-center flex-wrap">
                    {(['email', 'telegram', 'max'] as const).map((ch) => (
                      <button
                        key={ch}
                        onClick={() => setReplyChannel(ch)}
                        disabled={ch === 'max'}
                        className={`text-[10px] px-2 py-1 rounded-md flex items-center gap-1 disabled:opacity-30 ${
                          replyChannel === ch ? 'bg-[#45A29E] text-[#0B0C10] font-bold' : 'bg-[#0B0C10]/40 text-[#8B98A5]'
                        }`}
                      >
                        <Icon name={CHANNEL_ICON[ch]} size={10} />
                        {CHANNEL_LABEL[ch]}
                      </button>
                    ))}
                    {replyChannel === 'email' && mailboxOptions.length > 1 && (
                      <select
                        value={replyMailbox}
                        onChange={(e) => setReplyMailbox(e.target.value)}
                        className="text-[10px] h-6 rounded-md bg-[#0B0C10]/40 border border-[#45A29E]/30 text-white px-1.5 ml-auto"
                        title="С какой почты отправить"
                      >
                        {mailboxOptions.map((mb) => (
                          <option key={mb} value={mb}>{mb}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  {replyChannel === 'email' && (
                    <Input
                      placeholder="Тема письма"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      className="h-8 text-xs bg-[#0B0C10]/40 border-[#45A29E]/30 text-white placeholder:text-[#6B7684]"
                    />
                  )}
                  {pendingAttachments.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {pendingAttachments.map((a, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-[#0B0C10]/50 border border-[#45A29E]/30 text-[#8B98A5] max-w-[180px]">
                          <Icon name={fileIcon(a.name, a.mime)} size={11} className="shrink-0" />
                          <span className="truncate">{a.name}</span>
                          <button onClick={() => removePendingAttachment(idx)} className="shrink-0 hover:text-[#FF6600]">
                            <Icon name="X" size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Сообщение..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={2}
                      className="text-sm bg-[#0B0C10]/40 border-[#45A29E]/30 text-white placeholder:text-[#6B7684] resize-none"
                    />
                    {replyChannel === 'email' && (
                      <>
                        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleFilesSelected(e.target.files)} />
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-auto px-3 text-[#8B98A5] hover:text-[#66FCF1] shrink-0"
                          title="Прикрепить файл"
                        >
                          <Icon name="Paperclip" size={16} />
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={handleSend}
                      disabled={sending || !replyText.trim()}
                      className="h-auto px-4 bg-[#45A29E] hover:bg-[#3d8f8b] text-[#0B0C10] font-bold shrink-0 disabled:opacity-40"
                    >
                      <Icon name={sending ? 'Loader2' : 'Send'} size={16} className={sending ? 'animate-spin' : ''} />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <FilePreviewModal file={preview} onClose={() => setPreview(null)} />
    </div>
  );
};

export default CRMBridge;