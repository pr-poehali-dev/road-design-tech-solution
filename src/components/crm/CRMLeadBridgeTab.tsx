import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { bridgeApi, BridgeMessage, BridgeChannel } from '@/lib/bridgeApi';

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

interface CRMLeadBridgeTabProps {
  clientId: number;
  clientEmail?: string;
}

export const CRMLeadBridgeTab = ({ clientId, clientEmail }: CRMLeadBridgeTabProps) => {
  const [messages, setMessages] = useState<BridgeMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyChannel, setReplyChannel] = useState<BridgeChannel>('email');
  const [replySubject, setReplySubject] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await bridgeApi.getMessages(clientId);
      setMessages(res.messages);
      await bridgeApi.markRead(clientId);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      if (replyChannel === 'email') {
        if (!clientEmail) {
          alert('У клиента не указан email');
          setSending(false);
          return;
        }
        await bridgeApi.sendEmail({ client_id: clientId, subject: replySubject || undefined, body: replyText.trim() });
      } else if (replyChannel === 'telegram') {
        await bridgeApi.sendTelegram({ client_id: clientId, body: replyText.trim() });
      } else {
        alert('Канал MAX пока не подключён');
        setSending(false);
        return;
      }
      setReplyText('');
      setReplySubject('');
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось отправить сообщение');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[420px] bg-[#1F2833]/70 rounded-lg border border-[#45A29E]/20 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className="text-center py-8">
            <Icon name="Loader2" size={20} className="animate-spin text-[#66FCF1] mx-auto" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-[#6B7684] py-8">Сообщений пока нет</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.direction === 'out' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-3 py-2 ${m.direction === 'out' ? 'bg-[#45A29E]/20 text-white' : 'bg-[#0B0C10]/50 text-[#C5C6C7]'}`}>
                <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#8B98A5]">
                  <Icon name={CHANNEL_ICON[m.channel]} size={10} style={{ color: CHANNEL_COLOR[m.channel] }} />
                  {m.direction === 'out' ? 'Вы' : m.sender_name || 'Клиент'}
                  <span className="ml-auto">{fmtTime(m.created_at)}</span>
                </div>
                {m.subject && <div className="text-xs font-semibold mb-1 text-[#66FCF1]">{m.subject}</div>}
                <div className="text-sm whitespace-pre-wrap break-words">{m.body}</div>
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
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
    </div>
  );
};

export default CRMLeadBridgeTab;
