import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { bridgeApi, BridgeFolder, BridgeMessage } from '@/lib/bridgeApi';

const FOLDER_COLORS = ['#45A29E', '#66FCF1', '#FF6600', '#C89BFF', '#FFD166', '#EF476F', '#06D6A0', '#8B98A5'];

const fmtTime = (d?: string) =>
  d ? new Date(d).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';

interface BridgeFoldersPanelProps {
  partnerId?: number;
  folders: BridgeFolder[];
  onFoldersChanged: () => void;
  onOpenConversation: (clientId: number) => void;
}

export const BridgeFoldersPanel = ({ partnerId, folders, onFoldersChanged, onOpenConversation }: BridgeFoldersPanelProps) => {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [folderMessages, setFolderMessages] = useState<BridgeMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(FOLDER_COLORS[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedFolderId && folders.length) setSelectedFolderId(folders[0].id);
    if (selectedFolderId && !folders.some((f) => f.id === selectedFolderId)) {
      setSelectedFolderId(folders[0]?.id ?? null);
    }
  }, [folders, selectedFolderId]);

  const loadFolderMessages = useCallback(async (folderId: number) => {
    setLoading(true);
    try {
      const res = await bridgeApi.getFolderMessages(folderId, partnerId);
      setFolderMessages(res.messages);
    } catch (error) {
      console.error('Error loading folder messages:', error);
    } finally {
      setLoading(false);
    }
  }, [partnerId]);

  useEffect(() => {
    if (selectedFolderId) loadFolderMessages(selectedFolderId);
    else setFolderMessages([]);
  }, [selectedFolderId, loadFolderMessages]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await bridgeApi.saveFolder({ name: newName.trim(), color: newColor }, partnerId);
      setCreating(false);
      setNewName('');
      setNewColor(FOLDER_COLORS[0]);
      onFoldersChanged();
      if (res.folder) setSelectedFolderId(res.folder.id);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось создать папку');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFolder = async (folderId: number, name: string) => {
    if (!confirm(`Удалить папку «${name}»? Письма из неё не удалятся, просто станут без папки.`)) return;
    try {
      await bridgeApi.deleteFolder(folderId, partnerId);
      if (selectedFolderId === folderId) setSelectedFolderId(null);
      onFoldersChanged();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось удалить папку');
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('Удалить это письмо?')) return;
    try {
      await bridgeApi.deleteMessage(messageId, partnerId);
      setFolderMessages((prev) => prev.filter((m) => m.id !== messageId));
      onFoldersChanged();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Не удалось удалить письмо');
    }
  };

  const selectedFolder = folders.find((f) => f.id === selectedFolderId) || null;

  return (
    <div className="flex-1 flex min-h-0 gap-3">
      <div className="w-64 shrink-0 flex flex-col bg-[#1F2833]/40 rounded-lg border border-[#45A29E]/20 overflow-hidden">
        <div className="p-3 border-b border-[#45A29E]/20 flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Icon name="FolderKanban" size={14} className="text-[#66FCF1]" />
            Папки
          </span>
          <button
            onClick={() => setCreating((v) => !v)}
            className="text-[#66FCF1] hover:bg-[#45A29E]/10 p-1 rounded-md"
            title="Создать папку"
          >
            <Icon name="FolderPlus" size={15} />
          </button>
        </div>

        {creating && (
          <div className="p-3 border-b border-[#45A29E]/20 space-y-2 bg-[#0B0C10]/30">
            <Input
              placeholder="Название папки"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
              className="h-8 text-xs bg-[#0B0C10]/40 border-[#45A29E]/30 text-white placeholder:text-[#6B7684]"
            />
            <div className="flex items-center gap-1.5 flex-wrap">
              {FOLDER_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  className={`w-5 h-5 rounded-full transition-transform ${newColor === c ? 'ring-2 ring-white scale-110' : ''}`}
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={saving || !newName.trim()}
                className="h-7 text-xs bg-[#45A29E] hover:bg-[#3d8f8b] text-[#0B0C10] font-bold disabled:opacity-40 flex-1"
              >
                {saving ? <Icon name="Loader2" size={12} className="animate-spin" /> : 'Создать'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCreating(false)}
                className="h-7 text-xs text-[#8B98A5] hover:text-white"
              >
                Отмена
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {folders.length === 0 && !creating ? (
            <div className="p-4 text-center text-xs text-[#6B7684]">
              Папок пока нет.
              <br />
              Нажмите на «+», чтобы создать первую.
            </div>
          ) : (
            folders.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFolderId(f.id)}
                className={`w-full text-left px-3 py-2.5 flex items-center gap-2 border-b border-[#45A29E]/10 transition-colors group ${
                  selectedFolderId === f.id ? 'bg-[#45A29E]/15' : 'hover:bg-[#45A29E]/5'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: f.color }} />
                <span className={`text-sm truncate flex-1 ${selectedFolderId === f.id ? 'text-white font-medium' : 'text-[#C5C6C7]'}`}>
                  {f.name}
                </span>
                <span className="text-[10px] text-[#6B7684] shrink-0">{f.messages_count}</span>
                <span
                  onClick={(e) => { e.stopPropagation(); handleDeleteFolder(f.id, f.name); }}
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-[#6B7684] hover:text-[#EF476F] p-0.5"
                  title="Удалить папку"
                >
                  <Icon name="Trash2" size={12} />
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#1F2833]/40 rounded-lg border border-[#45A29E]/20 overflow-hidden min-w-0">
        {!selectedFolder ? (
          <div className="flex-1 flex items-center justify-center text-[#6B7684] text-sm">
            Выберите папку слева или создайте новую
          </div>
        ) : (
          <>
            <div className="p-3 border-b border-[#45A29E]/20 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: selectedFolder.color }} />
              <span className="text-sm font-medium text-white">{selectedFolder.name}</span>
              <span className="text-xs text-[#6B7684]">· {selectedFolder.messages_count} писем</span>
              {selectedFolder.rule_addresses.length > 0 && (
                <span className="text-[10px] text-[#8B98A5] ml-auto truncate max-w-[240px]" title={selectedFolder.rule_addresses.join(', ')}>
                  Авто: {selectedFolder.rule_addresses.join(', ')}
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center"><Icon name="Loader2" size={22} className="animate-spin text-[#66FCF1] mx-auto" /></div>
              ) : folderMessages.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#6B7684]">В этой папке пока нет писем</div>
              ) : (
                folderMessages.map((m) => (
                  <div key={m.id} className="group relative border-b border-[#45A29E]/10 hover:bg-[#45A29E]/5 transition-colors">
                    <button
                      onClick={() => m.client_id && onOpenConversation(m.client_id)}
                      disabled={!m.client_id}
                      className="w-full text-left p-3 disabled:cursor-default"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-white truncate">
                          {m.company_name || m.contact_person || (m.direction === 'in' ? m.email_from : m.email_to) || '—'}
                        </span>
                        <span className="text-[10px] text-[#6B7684] shrink-0">{fmtTime(m.created_at)}</span>
                      </div>
                      {m.subject && <div className="text-xs font-semibold text-[#66FCF1] mt-0.5 truncate">{m.subject}</div>}
                      <div className="text-xs text-[#8B98A5] truncate mt-0.5 pr-6">{m.body}</div>
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(m.id)}
                      className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 text-[#6B7684] hover:text-[#EF476F] p-1"
                      title="Удалить письмо"
                    >
                      <Icon name="Trash2" size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BridgeFoldersPanel;
