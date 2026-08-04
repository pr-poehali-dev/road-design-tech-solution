import { useEffect, useState, useRef, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { bridgeApi, BridgeMessage, BridgeChannel, BridgeAttachment } from '@/lib/bridgeApi';
import { fileIcon, formatSize } from '@/lib/fileUtils';
import FilePreviewModal, { PreviewFile } from '@/components/deod/FilePreviewModal';
import BridgeComposer from './BridgeComposer';

const CHANNEL_ICON: Record<BridgeChannel, string> = {
  email: 'Mail',
  telegram: 'Send',
  max: 'MessageCircle',
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
  const [fullscreen, setFullscreen] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const [replyTo, setReplyTo] = useState<BridgeMessage | null>(null);
  const [mailboxes, setMailboxes] = useState<string[]>([]);
  const [preview, setPreview] = useState<PreviewFile | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  useEffect(() => {
    bridgeApi.getMailboxes().then((res) => {
      setMailboxes(res.mailboxes.map((m) => m.address));
    }).catch(() => {});
  }, []);

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
    shouldAutoScrollRef.current = true;
    load();
  }, [load]);

  // Автообновление переписки прямо в карточке клиента, пока она открыта
  useEffect(() => {
    const interval = setInterval(load, 15_000);
    return () => clearInterval(interval);
  }, [load]);

  // Самое новое письмо теперь сверху, поэтому "актуальная" позиция — верх списка.
  // Прокручиваем наверх только если пользователь и так читает свежие письма —
  // иначе автообновление сбрасывало бы чтение старой переписки
  useEffect(() => {
    if (shouldAutoScrollRef.current && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [messages]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    shouldAutoScrollRef.current = el.scrollTop < 80;
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('Удалить это письмо? Действие необратимо.')) return;
    try {
      await bridgeApi.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось удалить письмо');
    }
  };

  const handleDeleteConversation = async () => {
    if (!confirm('Удалить всю переписку с этим клиентом? Все письма и вложения будут стёрты без возможности восстановления.')) return;
    try {
      await bridgeApi.deleteConversation(clientId);
      setMessages([]);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось удалить переписку');
    }
  };

  const renderAttachments = (attachments: BridgeAttachment[]) => {
    if (!attachments?.length) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {attachments.map((a) => (
          <button
            key={a.id}
            onClick={() => setPreview({ url: a.url, name: a.file_name, mime: a.mime, size: a.size_bytes })}
            className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md bg-[#0B0C10]/50 border border-[#45A29E]/30 text-[#8B98A5] hover:text-white transition-colors max-w-[200px]"
          >
            <Icon name={fileIcon(a.file_name, a.mime || '')} size={12} className="shrink-0" />
            <span className="truncate">{a.file_name}</span>
            {a.size_bytes ? <span className="shrink-0 opacity-60">{formatSize(a.size_bytes)}</span> : null}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      className={
        fullscreen
          ? 'fixed inset-0 z-[110] flex flex-col bg-[#0B0C10] p-4'
          : 'flex flex-col h-[420px] bg-[#1F2833]/70 rounded-lg border border-[#45A29E]/20 overflow-hidden'
      }
    >
      {!headerCollapsed && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#45A29E]/20 shrink-0">
          <span className="text-xs text-[#8B98A5] flex items-center gap-1.5">
            <Icon name="MessagesSquare" size={13} className="text-[#66FCF1]" />
            Переписка
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleDeleteConversation}
              className="text-[#8B98A5] hover:text-[#EF476F] p-1"
              title="Удалить всю переписку"
            >
              <Icon name="Trash2" size={13} />
            </button>
            <button
              onClick={() => setFullscreen((v) => !v)}
              className="text-[#8B98A5] hover:text-[#66FCF1] p-1"
              title={fullscreen ? 'Свернуть' : 'Развернуть на весь экран'}
            >
              <Icon name={fullscreen ? 'Minimize2' : 'Maximize2'} size={14} />
            </button>
            <button
              onClick={() => setHeaderCollapsed(true)}
              className="text-[#8B98A5] hover:text-[#66FCF1] p-1"
              title="Скрыть шапку, расширить переписку"
            >
              <Icon name="ChevronUp" size={14} />
            </button>
          </div>
        </div>
      )}
      {headerCollapsed && (
        <button
          onClick={() => setHeaderCollapsed(false)}
          className="w-full flex items-center justify-center gap-1 py-1 border-b border-[#45A29E]/20 text-[#6B7684] hover:text-[#66FCF1] hover:bg-[#45A29E]/5 transition-colors shrink-0"
          title="Показать шапку"
        >
          <Icon name="ChevronDown" size={14} />
        </button>
      )}

      <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {loading ? (
          <div className="text-center py-8">
            <Icon name="Loader2" size={20} className="animate-spin text-[#66FCF1] mx-auto" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-[#6B7684] py-8">Сообщений пока нет</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.direction === 'out' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`relative group max-w-[80%] rounded-lg px-3 py-2 ${
                  m.direction === 'out' ? 'bg-[#45A29E]/20 text-white' : 'bg-[#0B0C10]/50 text-[#C5C6C7]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#8B98A5]">
                  <Icon name={CHANNEL_ICON[m.channel]} size={10} style={{ color: CHANNEL_COLOR[m.channel] }} />
                  {m.direction === 'out' ? 'Вы' : m.sender_name || 'Клиент'}
                  {m.folder_name && (
                    <span
                      className="px-1.5 rounded-full"
                      style={{ background: `${m.folder_color}22`, color: m.folder_color || '#45A29E' }}
                    >
                      {m.folder_name}
                    </span>
                  )}
                  <span className="ml-auto">{fmtTime(m.created_at)}</span>
                </div>
                {m.subject && <div className="text-xs font-semibold mb-1 text-[#66FCF1]">{m.subject}</div>}
                {m.email_cc && <div className="text-[10px] text-[#6B7684] mb-1">Копия: {m.email_cc}</div>}
                <div className="text-sm whitespace-pre-wrap break-words">{m.body}</div>
                {renderAttachments(m.attachments)}

                <div className="absolute -top-2 right-2 hidden group-hover:flex items-center gap-1">
                  {m.channel === 'email' && (
                    <button
                      onClick={() => setReplyTo(m)}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-[#1F2833] border border-[#45A29E]/40 text-[#66FCF1] hover:bg-[#45A29E]/20"
                      title="Ответить с сохранением цепочки"
                    >
                      Ответить
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMessage(m.id)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-[#1F2833] border border-[#45A29E]/40 text-[#8B98A5] hover:text-[#EF476F]"
                    title="Удалить письмо"
                  >
                    <Icon name="Trash2" size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BridgeComposer
        clientId={clientId}
        clientEmail={clientEmail}
        mailboxes={mailboxes.length ? mailboxes : ['sale@sppi.ooo']}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        onSent={load}
        allowNewLead={false}
        compact={!fullscreen}
      />

      <FilePreviewModal file={preview} onClose={() => setPreview(null)} />
    </div>
  );
};

export default CRMLeadBridgeTab;
