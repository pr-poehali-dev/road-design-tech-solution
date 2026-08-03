import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { bridgeApi, BridgeConversation, BridgeMessage, BridgeChannel } from '@/lib/bridgeApi';

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

export const CRMBridge = () => {
  const [conversations, setConversations] = useState<BridgeConversation[]>([]);
  const [filterChannel, setFilterChannel] = useState<BridgeChannel | 'all'>('all');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [messages, setMessages] = useState<BridgeMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [replyChannel, setReplyChannel] = useState<BridgeChannel>('email');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    try {
      const res = await bridgeApi.getConversations(filterChannel === 'all' ? undefined : filterChannel);
      setConversations(res.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [filterChannel]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Тихое автообновление списка диалогов — почта синхронизируется фоном на уровне CRM,
  // здесь просто периодически подтягиваем актуальный список без индикатора загрузки
  useEffect(() => {
    const interval = setInterval(() => {
      loadConversations();
    }, 15_000);
    return () => clearInterval(interval);
  }, [loadConversations]);

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
    if (!selectedClientId) return;
    const interval = setInterval(() => {
      loadMessages(selectedClientId);
    }, 15_000);
    return () => clearInterval(interval);
  }, [selectedClientId, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedConversation = conversations.find((c) => c.client_id === selectedClientId) || null;

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await bridgeApi.syncEmail();
      await loadConversations();
      if (selectedClientId) await loadMessages(selectedClientId);
      if (res.imported === 0) {
        // тихо, чтобы не мешать пользователю лишними алертами
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('Не удалось синхронизировать почту. Проверьте настройки подключения.');
    } finally {
      setSyncing(false);
    }
  };

  const handleSend = async () => {
    if (!selectedClientId || !replyText.trim()) return;
    setSending(true);
    try {
      if (replyChannel === 'email') {
        await bridgeApi.sendEmail({ client_id: selectedClientId, subject: replySubject || undefined, body: replyText.trim() });
      } else if (replyChannel === 'telegram') {
        await bridgeApi.sendTelegram({ client_id: selectedClientId, body: replyText.trim() });
      } else {
        alert('Канал MAX пока не подключён');
        setSending(false);
        return;
      }
      setReplyText('');
      setReplySubject('');
      await loadMessages(selectedClientId);
      await loadConversations();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations;

  return (
    <div className="flex h-[calc(100vh-220px)] gap-4 p-4">
      {/* ---- LEFT: conversation list ---- */}
      <div className="w-full sm:w-80 shrink-0 flex flex-col bg-[#1F2833]/40 rounded-lg border border-[#45A29E]/20 overflow-hidden">
        <div className="p-3 border-b border-[#45A29E]/20 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-[#66FCF1] flex items-center gap-1.5">
              <Icon name="MessagesSquare" size={15} />
              Радужный мост
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSync}
              disabled={syncing}
              className="h-7 w-7 p-0 text-[#66FCF1] hover:bg-[#45A29E]/10"
              title="Проверить новые письма"
            >
              <Icon name={syncing ? 'Loader2' : 'RefreshCw'} size={14} className={syncing ? 'animate-spin' : ''} />
            </Button>
          </div>
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
          ) : filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-sm text-[#6B7684]">
              Пока нет переписки.
              <br />
              Нажмите на значок обновления, чтобы проверить почту.
            </div>
          ) : (
            filteredConversations.map((c) => (
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
                <div className="text-[10px] text-[#6B7684] mt-0.5">{fmtTime(c.last_message_created_at)}</div>
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

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                      <span className="ml-auto">{fmtTime(m.created_at)}</span>
                    </div>
                    {m.subject && <div className="text-xs font-semibold mb-1 text-[#66FCF1]">{m.subject}</div>}
                    <div className="text-sm whitespace-pre-wrap break-words">{m.body}</div>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center text-sm text-[#6B7684] py-8">Сообщений пока нет</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-[#45A29E]/20 space-y-2">
              <div className="flex gap-1">
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
              </div>
              {replyChannel === 'email' && (
                <Input
                  placeholder="Тема письма"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="h-8 text-xs bg-[#0B0C10]/40 border-[#45A29E]/30 text-white placeholder:text-[#6B7684]"
                />
              )}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Сообщение..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={2}
                  className="text-sm bg-[#0B0C10]/40 border-[#45A29E]/30 text-white placeholder:text-[#6B7684] resize-none"
                />
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
  );
};

export default CRMBridge;