import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  bridgeApi,
  BridgeConversation,
  BridgeMessage,
  BridgeChannel,
  BridgeAttachment,
  BridgeFolder,
} from '@/lib/bridgeApi';
import { fileIcon, formatSize } from '@/lib/fileUtils';
import FilePreviewModal, { PreviewFile } from '@/components/deod/FilePreviewModal';
import BridgeComposer from './BridgeComposer';
import BridgeFoldersPanel from './BridgeFoldersPanel';
import { useNotificationSound } from '@/components/deod/useNotificationSound';
import { toast } from 'sonner';

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

type ViewTab = 'chat' | 'inbox' | 'sent' | 'folders';

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
  const [replyTo, setReplyTo] = useState<BridgeMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [preview, setPreview] = useState<PreviewFile | null>(null);

  const [flatList, setFlatList] = useState<BridgeMessage[]>([]);
  const [flatLoading, setFlatLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [folders, setFolders] = useState<BridgeFolder[]>([]);
  const [folderFilter, setFolderFilter] = useState<number | 'none' | null>(null);
  const [moveMenuFor, setMoveMenuFor] = useState<number | null>(null);

  const [listWidth, setListWidth] = useState(320);
  const [composeNew, setComposeNew] = useState(false);
  const [contactCardCollapsed, setContactCardCollapsed] = useState(false);
  const resizingRef = useRef(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const prevClientIdRef = useRef<number | null>(null);
  const playSound = useNotificationSound();

  useEffect(() => {
    bridgeApi.getMailboxes().then((res) => {
      setMailboxes(res.mailboxes.map((m) => m.address));
    }).catch(() => {});
  }, []);

  const loadFolders = useCallback(async () => {
    try {
      const res = await bridgeApi.getFolders(partnerId);
      setFolders(res.folders);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  }, [partnerId]);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  const loadConversations = useCallback(async () => {
    try {
      const res = await bridgeApi.getConversations(
        filterChannel === 'all' ? undefined : filterChannel,
        mailboxFilter || undefined,
        partnerId,
      );
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

  useEffect(() => {
    if (tab !== 'chat') return;
    const interval = setInterval(loadConversations, 15_000);
    return () => clearInterval(interval);
  }, [tab, loadConversations]);

  // Уведомления о новых письмах: показываем название папки, если письмо в неё отсортировано
  useEffect(() => {
    const check = async () => {
      try {
        const res = await bridgeApi.getNotifications(partnerId);
        res.notifications.forEach((n) => {
          const title = n.folder_name ? `Новое письмо · ${n.folder_name}` : 'Новое письмо';
          toast(title, {
            description: `${n.sender_name || n.email_from || 'Отправитель'} — ${n.subject || 'без темы'}`,
          });
        });
        if (res.notifications.length) playSound();
      } catch {
        /* уведомления не критичны */
      }
    };
    check();
    const interval = setInterval(check, 20_000);
    return () => clearInterval(interval);
  }, [partnerId, playSound]);

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

  useEffect(() => {
    if (!selectedClientId || tab !== 'chat') return;
    const interval = setInterval(() => loadMessages(selectedClientId), 15_000);
    return () => clearInterval(interval);
  }, [selectedClientId, loadMessages, tab]);

  // Самые новые письма показываются сверху списка, поэтому "актуальная" позиция — верх контейнера.
  // Прокручиваем наверх только при открытии диалога или если пользователь и так читает верхние письма —
  // иначе автообновление сбрасывало бы чтение более старой переписки наверх
  useEffect(() => {
    const isNewConversation = prevClientIdRef.current !== selectedClientId;
    prevClientIdRef.current = selectedClientId;
    if (isNewConversation) shouldAutoScrollRef.current = true;
    if (shouldAutoScrollRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  }, [messages, selectedClientId]);

  const handleMessagesScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    shouldAutoScrollRef.current = el.scrollTop < 80;
  };

  const loadFlatList = useCallback(async (direction: 'in' | 'out') => {
    setFlatLoading(true);
    try {
      const res = await bridgeApi.getEmailList(direction, mailboxFilter || undefined, undefined, partnerId, folderFilter);
      setFlatList(res.messages);
    } catch (error) {
      console.error('Error loading email list:', error);
    } finally {
      setFlatLoading(false);
    }
  }, [mailboxFilter, partnerId, folderFilter]);

  useEffect(() => {
    if (tab === 'inbox') loadFlatList('in');
    if (tab === 'sent') loadFlatList('out');
  }, [tab, loadFlatList]);

  const selectedConversation = conversations.find((c) => c.client_id === selectedClientId) || null;

  const handleSync = async () => {
    setSyncing(true);
    try {
      await bridgeApi.syncEmail(partnerId);
      await loadConversations();
      await loadFolders();
      if (selectedClientId) await loadMessages(selectedClientId);
      if (tab !== 'chat') await loadFlatList(tab === 'inbox' ? 'in' : 'out');
    } catch (error) {
      console.error('Sync error:', error);
      alert('Не удалось синхронизировать почту. Проверьте настройки подключения.');
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt('Название новой папки');
    if (!name?.trim()) return;
    try {
      await bridgeApi.saveFolder({ name: name.trim() }, partnerId);
      await loadFolders();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось создать папку');
    }
  };

  const handleMoveToFolder = async (messageId: number, folderId: number | null) => {
    try {
      await bridgeApi.moveMessage({ message_id: messageId, folder_id: folderId, apply_rule: true }, partnerId);
      setMoveMenuFor(null);
      await loadFolders();
      if (tab !== 'chat') await loadFlatList(tab === 'inbox' ? 'in' : 'out');
      if (selectedClientId) await loadMessages(selectedClientId);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось переместить письмо');
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('Удалить это письмо? Действие необратимо.')) return;
    try {
      await bridgeApi.deleteMessage(messageId, partnerId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      setFlatList((prev) => prev.filter((m) => m.id !== messageId));
      await loadFolders();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось удалить письмо');
    }
  };

  const handleDeleteConversation = async () => {
    if (!selectedClientId || !selectedConversation) return;
    const name = selectedConversation.contact_person || selectedConversation.company_name || 'этим клиентом';
    if (!confirm(`Удалить всю переписку с ${name}? Все письма и вложения будут стёрты без возможности восстановления.`)) return;
    try {
      await bridgeApi.deleteConversation(selectedClientId, partnerId);
      setSelectedClientId(null);
      setMessages([]);
      await loadConversations();
      await loadFolders();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось удалить переписку');
    }
  };

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current = true;
    const startX = e.clientX;
    const startWidth = listWidth;

    const onMove = (ev: MouseEvent) => {
      if (!resizingRef.current) return;
      const next = Math.min(Math.max(startWidth + (ev.clientX - startX), 220), 640);
      setListWidth(next);
    };
    const onUp = () => {
      resizingRef.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = '';
    };

    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
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
            className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md bg-[#0B0C10]/50 border border-[#45A29E]/30 text-[#8B98A5] hover:text-white hover:border-[#45A29E]/60 transition-colors max-w-[220px]"
          >
            <Icon name={fileIcon(a.file_name, a.mime || '')} size={12} className="shrink-0" />
            <span className="truncate">{a.file_name}</span>
            {a.size_bytes ? <span className="shrink-0 opacity-60">{formatSize(a.size_bytes)}</span> : null}
          </button>
        ))}
      </div>
    );
  };

  const renderFolderMenu = (messageId: number) => (
    <div className="absolute right-0 top-6 z-20 w-48 rounded-md bg-[#1F2833] border border-[#45A29E]/30 shadow-xl py-1">
      <div className="px-2 py-1 text-[10px] text-[#6B7684] uppercase tracking-wide">Переместить в папку</div>
      {folders.map((f) => (
        <button
          key={f.id}
          onClick={() => handleMoveToFolder(messageId, f.id)}
          className="w-full text-left px-2 py-1.5 text-xs text-[#C5C6C7] hover:bg-[#45A29E]/10 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: f.color }} />
          <span className="truncate">{f.name}</span>
        </button>
      ))}
      <button
        onClick={() => handleMoveToFolder(messageId, null)}
        className="w-full text-left px-2 py-1.5 text-xs text-[#8B98A5] hover:bg-[#45A29E]/10 border-t border-[#45A29E]/20 mt-1"
      >
        Убрать из папки
      </button>
      <button
        onClick={handleCreateFolder}
        className="w-full text-left px-2 py-1.5 text-xs text-[#66FCF1] hover:bg-[#45A29E]/10"
      >
        + Новая папка
      </button>
    </div>
  );

  const mailboxOptions = mailboxes.length ? mailboxes : ['sale@sppi.ooo'];

  return (
    <div
      className={
        fullscreen
          ? 'fixed inset-0 z-[100] flex flex-col bg-[#0B0C10] p-4 gap-3'
          : 'flex flex-col h-[calc(100vh-220px)] p-4 gap-3'
      }
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1 bg-[#0B0C10]/40 rounded-lg p-1">
          {([
            { id: 'chat', label: 'Диалоги', icon: 'MessagesSquare' },
            { id: 'inbox', label: 'Входящие', icon: 'Inbox' },
            { id: 'sent', label: 'Отправленные', icon: 'SendHorizontal' },
            { id: 'folders', label: 'Папки', icon: 'FolderKanban' },
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
            onClick={() => { setComposeNew(true); setSelectedClientId(null); setReplyTo(null); setTab('chat'); }}
            className="h-8 px-3 text-xs bg-[#45A29E] hover:bg-[#3d8f8b] text-[#0B0C10] font-bold"
          >
            <Icon name="PenSquare" size={13} className="mr-1" />
            Написать
          </Button>
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

      {(tab === 'inbox' || tab === 'sent') && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFolderFilter(null)}
            className={`text-[10px] px-2 py-1 rounded-md ${
              folderFilter === null ? 'bg-[#45A29E] text-[#0B0C10] font-bold' : 'bg-[#0B0C10]/40 text-[#8B98A5]'
            }`}
          >
            Все письма
          </button>
          <button
            onClick={() => setFolderFilter('none')}
            className={`text-[10px] px-2 py-1 rounded-md ${
              folderFilter === 'none' ? 'bg-[#45A29E] text-[#0B0C10] font-bold' : 'bg-[#0B0C10]/40 text-[#8B98A5]'
            }`}
          >
            Без папки
          </button>
          {folders.map((f) => (
            <button
              key={f.id}
              onClick={() => setFolderFilter(f.id)}
              className={`text-[10px] px-2 py-1 rounded-md flex items-center gap-1 ${
                folderFilter === f.id ? 'bg-[#45A29E] text-[#0B0C10] font-bold' : 'bg-[#0B0C10]/40 text-[#8B98A5]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: f.color }} />
              {f.name}
              <span className="opacity-60">{f.messages_count}</span>
            </button>
          ))}
          <button
            onClick={handleCreateFolder}
            className="text-[10px] px-2 py-1 rounded-md text-[#66FCF1] hover:bg-[#45A29E]/10 flex items-center gap-1"
          >
            <Icon name="FolderPlus" size={11} />
            Новая папка
          </button>
        </div>
      )}

      {tab === 'folders' ? (
        <BridgeFoldersPanel
          partnerId={partnerId}
          folders={folders}
          onFoldersChanged={loadFolders}
          onOpenConversation={(clientId) => { setSelectedClientId(clientId); setTab('chat'); }}
        />
      ) : tab !== 'chat' ? (
        <div className="flex-1 bg-[#1F2833]/40 rounded-lg border border-[#45A29E]/20 overflow-y-auto">
          {flatLoading ? (
            <div className="p-6 text-center"><Icon name="Loader2" size={22} className="animate-spin text-[#66FCF1] mx-auto" /></div>
          ) : flatList.length === 0 ? (
            <div className="p-6 text-center text-sm text-[#6B7684]">Писем пока нет</div>
          ) : (
            flatList.map((m) => (
              <div key={m.id} className="relative border-b border-[#45A29E]/10 hover:bg-[#45A29E]/5 transition-colors">
                <button
                  onClick={() => openFromFlatList(m)}
                  disabled={!m.client_id}
                  className="w-full text-left p-3 disabled:cursor-default"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-white truncate">
                      {m.company_name || m.contact_person || (tab === 'inbox' ? m.email_from : m.email_to) || '—'}
                    </span>
                    <span className="shrink-0 flex items-center gap-1.5">
                      {m.folder_name && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                          style={{ background: `${m.folder_color}22`, color: m.folder_color || '#45A29E' }}
                        >
                          {m.folder_name}
                        </span>
                      )}
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
                <div className="absolute right-2 bottom-2 flex items-center gap-1">
                  <button
                    onClick={() => setMoveMenuFor(moveMenuFor === m.id ? null : m.id)}
                    className="text-[#6B7684] hover:text-[#66FCF1] p-1"
                    title="Переместить в папку"
                  >
                    <Icon name="FolderInput" size={13} />
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(m.id)}
                    className="text-[#6B7684] hover:text-[#EF476F] p-1"
                    title="Удалить письмо"
                  >
                    <Icon name="Trash2" size={13} />
                  </button>
                </div>
                {moveMenuFor === m.id && (
                  <div className="absolute right-2 bottom-8">{renderFolderMenu(m.id)}</div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="flex-1 flex min-h-0">
          <div
            className="shrink-0 flex flex-col bg-[#1F2833]/40 rounded-lg border border-[#45A29E]/20 overflow-hidden"
            style={{ width: listWidth }}
          >
            <div className="p-3 border-b border-[#45A29E]/20">
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
                    onClick={() => { setSelectedClientId(c.client_id); setReplyTo(null); }}
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

          <div
            onMouseDown={startResize}
            className="w-2 mx-1 shrink-0 cursor-col-resize rounded-full hover:bg-[#45A29E]/40 transition-colors flex items-center justify-center group"
            title="Потяните, чтобы изменить ширину"
          >
            <div className="w-0.5 h-10 rounded-full bg-[#45A29E]/30 group-hover:bg-[#66FCF1]" />
          </div>

          <div className="flex-1 flex flex-col bg-[#1F2833]/40 rounded-lg border border-[#45A29E]/20 overflow-hidden min-w-0">
            {composeNew && !selectedConversation ? (
              <>
                <div className="p-3 border-b border-[#45A29E]/20 flex items-center justify-between">
                  <div className="text-sm font-medium text-white flex items-center gap-2">
                    <Icon name="PenSquare" size={14} className="text-[#66FCF1]" />
                    Новое письмо
                  </div>
                  <button onClick={() => setComposeNew(false)} className="text-[#8B98A5] hover:text-white">
                    <Icon name="X" size={16} />
                  </button>
                </div>
                <div className="flex-1 flex items-center justify-center text-[#6B7684] text-sm px-6 text-center">
                  Укажите адрес получателя ниже. Можно перечислить несколько адресов через запятую
                  и поставить галочку «Создать новый лид».
                </div>
                <BridgeComposer
                  mailboxes={mailboxOptions}
                  partnerId={partnerId}
                  onSent={(newClientId) => {
                    setComposeNew(false);
                    loadConversations();
                    if (newClientId) setSelectedClientId(newClientId);
                  }}
                />
              </>
            ) : !selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-[#6B7684] text-sm">
                Выберите диалог слева
              </div>
            ) : (
              <>
                {!contactCardCollapsed && (
                  <div className="p-3 border-b border-[#45A29E]/20 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-white">{selectedConversation.contact_person || selectedConversation.company_name}</div>
                      <div className="text-xs text-[#8B98A5] flex items-center gap-2">
                        {selectedConversation.email && <span className="flex items-center gap-1"><Icon name="Mail" size={11} />{selectedConversation.email}</span>}
                        {selectedConversation.phone && <span className="flex items-center gap-1"><Icon name="Phone" size={11} />{selectedConversation.phone}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={handleDeleteConversation}
                        className="text-[#6B7684] hover:text-[#EF476F] p-1.5"
                        title="Удалить всю переписку с этим клиентом"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                      <button
                        onClick={() => setContactCardCollapsed(true)}
                        className="text-[#6B7684] hover:text-[#66FCF1] p-1.5"
                        title="Скрыть карточку, расширить переписку"
                      >
                        <Icon name="ChevronUp" size={14} />
                      </button>
                    </div>
                  </div>
                )}
                {contactCardCollapsed && (
                  <button
                    onClick={() => setContactCardCollapsed(false)}
                    className="w-full flex items-center justify-center gap-1 py-1 border-b border-[#45A29E]/20 text-[#6B7684] hover:text-[#66FCF1] hover:bg-[#45A29E]/5 transition-colors"
                    title="Показать карточку клиента"
                  >
                    <Icon name="ChevronDown" size={14} />
                  </button>
                )}

                <div ref={messagesContainerRef} onScroll={handleMessagesScroll} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.direction === 'out' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`relative group max-w-[75%] rounded-lg px-3 py-2 ${
                          m.direction === 'out' ? 'bg-[#45A29E]/20 text-white' : 'bg-[#0B0C10]/50 text-[#C5C6C7]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[10px] text-[#8B98A5]">
                          <Icon name={CHANNEL_ICON[m.channel]} size={10} style={{ color: CHANNEL_COLOR[m.channel] }} />
                          {m.direction === 'out' ? 'Вы' : m.sender_name || 'Клиент'}
                          {m.mailbox && <span className="text-[#45A29E] font-mono">· {m.mailbox}</span>}
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
                        {m.email_cc && (
                          <div className="text-[10px] text-[#6B7684] mb-1">Копия: {m.email_cc}</div>
                        )}
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
                          {m.channel === 'email' && (
                            <button
                              onClick={() => setMoveMenuFor(moveMenuFor === m.id ? null : m.id)}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-[#1F2833] border border-[#45A29E]/40 text-[#8B98A5] hover:text-white"
                              title="Переместить в папку"
                            >
                              <Icon name="FolderInput" size={11} />
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
                        {moveMenuFor === m.id && renderFolderMenu(m.id)}
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <div className="text-center text-sm text-[#6B7684] py-8">Сообщений пока нет</div>
                  )}
                </div>

                <BridgeComposer
                  clientId={selectedClientId}
                  clientEmail={selectedConversation.email}
                  mailboxes={mailboxOptions}
                  partnerId={partnerId}
                  replyTo={replyTo}
                  onCancelReply={() => setReplyTo(null)}
                  onSent={() => {
                    if (selectedClientId) loadMessages(selectedClientId);
                    loadConversations();
                  }}
                />
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