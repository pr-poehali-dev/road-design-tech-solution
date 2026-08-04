import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { depoApi, DepoFile, DepoFolder } from '@/lib/crewApi';
import { fileIcon, formatSize } from '@/lib/fileUtils';
import { BridgeDepoFileInput } from '@/lib/bridgeApi';

interface BridgeDepoPickerProps {
  open: boolean;
  onClose: () => void;
  onPick: (files: BridgeDepoFileInput[]) => void;
}

export const BridgeDepoPicker = ({ open, onClose, onPick }: BridgeDepoPickerProps) => {
  const [folders, setFolders] = useState<DepoFolder[]>([]);
  const [files, setFiles] = useState<DepoFile[]>([]);
  const [currentFolder, setCurrentFolder] = useState<number | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: number | null; name: string }[]>([{ id: null, name: 'Депозитарий' }]);
  const [selected, setSelected] = useState<Record<number, DepoFile>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (folderId: number | null) => {
    setLoading(true);
    try {
      const [foldersRes, filesRes] = await Promise.all([
        depoApi.folders(folderId),
        depoApi.files(folderId),
      ]);
      setFolders(foldersRes.folders || []);
      setFiles(filesRes.files || []);
    } catch (error) {
      console.error('Error loading depository:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setSelected({});
      setSearch('');
      setCurrentFolder(null);
      setBreadcrumbs([{ id: null, name: 'Депозитарий' }]);
      load(null);
    }
  }, [open, load]);

  const openFolder = (folder: DepoFolder) => {
    setCurrentFolder(folder.id);
    setBreadcrumbs((prev) => [...prev, { id: folder.id, name: folder.name }]);
    load(folder.id);
  };

  const goToCrumb = (index: number) => {
    const crumb = breadcrumbs[index];
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    setCurrentFolder(crumb.id);
    load(crumb.id);
  };

  const runSearch = async () => {
    if (!search.trim()) {
      load(currentFolder);
      return;
    }
    setLoading(true);
    try {
      const res = await depoApi.search(search.trim());
      setFolders([]);
      setFiles(res.files || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFile = (file: DepoFile) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[file.id]) delete next[file.id];
      else next[file.id] = file;
      return next;
    });
  };

  const confirm = () => {
    const picked = Object.values(selected).map((f) => ({
      name: f.name,
      mime: f.mime || 'application/octet-stream',
      url: f.url,
    }));
    onPick(picked);
    onClose();
  };

  if (!open) return null;

  const selectedCount = Object.keys(selected).length;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#1F2833] rounded-lg border border-[#45A29E]/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#45A29E]/20 flex items-center justify-between">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <Icon name="FolderOpen" size={16} className="text-[#66FCF1]" />
            Файлы из депозитария
          </div>
          <button onClick={onClose} className="text-[#8B98A5] hover:text-white">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="p-3 border-b border-[#45A29E]/20 space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Поиск файла..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSearch()}
              className="h-8 text-xs bg-[#0B0C10]/40 border-[#45A29E]/30 text-white placeholder:text-[#6B7684]"
            />
            <Button size="sm" onClick={runSearch} variant="ghost" className="h-8 text-[#66FCF1] hover:bg-[#45A29E]/10">
              <Icon name="Search" size={14} />
            </Button>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#8B98A5] flex-wrap">
            {breadcrumbs.map((crumb, i) => (
              <span key={`${crumb.id}-${i}`} className="flex items-center gap-1">
                {i > 0 && <Icon name="ChevronRight" size={11} />}
                <button
                  onClick={() => goToCrumb(i)}
                  className={i === breadcrumbs.length - 1 ? 'text-[#66FCF1]' : 'hover:text-white'}
                >
                  {crumb.name}
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="p-8 text-center">
              <Icon name="Loader2" size={22} className="animate-spin text-[#66FCF1] mx-auto" />
            </div>
          ) : (
            <>
              {folders.map((folder) => (
                <button
                  key={`f-${folder.id}`}
                  onClick={() => openFolder(folder)}
                  className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-[#45A29E]/5 text-left"
                >
                  <Icon name="Folder" size={16} className="text-[#45A29E] shrink-0" />
                  <span className="text-sm text-white truncate">{folder.name}</span>
                </button>
              ))}
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => toggleFile(file)}
                  className={`w-full flex items-center gap-2 p-2 rounded-md text-left transition-colors ${
                    selected[file.id] ? 'bg-[#45A29E]/15' : 'hover:bg-[#45A29E]/5'
                  }`}
                >
                  <Icon
                    name={selected[file.id] ? 'CheckSquare' : 'Square'}
                    size={15}
                    className={selected[file.id] ? 'text-[#66FCF1] shrink-0' : 'text-[#6B7684] shrink-0'}
                  />
                  <Icon name={fileIcon(file.name, file.mime || '')} size={15} className="text-[#8B98A5] shrink-0" />
                  <span className="text-sm text-white truncate flex-1">{file.name}</span>
                  <span className="text-[10px] text-[#6B7684] shrink-0">{formatSize(file.size_bytes)}</span>
                </button>
              ))}
              {folders.length === 0 && files.length === 0 && (
                <div className="p-8 text-center text-sm text-[#6B7684]">Здесь пусто</div>
              )}
            </>
          )}
        </div>

        <div className="p-3 border-t border-[#45A29E]/20 flex items-center justify-between">
          <span className="text-xs text-[#8B98A5]">
            {selectedCount > 0 ? `Выбрано: ${selectedCount}` : 'Отметьте нужные файлы'}
          </span>
          <Button
            onClick={confirm}
            disabled={selectedCount === 0}
            className="bg-[#45A29E] hover:bg-[#3d8f8b] text-[#0B0C10] font-bold disabled:opacity-40"
            size="sm"
          >
            Прикрепить
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BridgeDepoPicker;
