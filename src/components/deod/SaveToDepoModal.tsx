import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { ChatMessage, depoApi, DepoFolder } from '@/lib/crewApi';
import { fileIcon, formatSize } from '@/lib/fileUtils';

interface Props {
  msg: ChatMessage | null;
  onClose: () => void;
  onSaved: (path: string) => void;
}

interface Crumb { id: number | null; name: string; }

const SaveToDepoModal = ({ msg, onClose, onSaved }: Props) => {
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ id: null, name: 'Хранилище' }]);
  const [folders, setFolders] = useState<DepoFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const current = crumbs[crumbs.length - 1];

  const loadFolders = async (parentId: number | null) => {
    setLoading(true);
    try {
      const r = await depoApi.folders(parentId);
      setFolders(r.folders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (msg) {
      setCrumbs([{ id: null, name: 'Хранилище' }]);
      loadFolders(null);
    }
  }, [msg]);

  const enter = (f: DepoFolder) => {
    setCrumbs((c) => [...c, { id: f.id, name: f.name }]);
    loadFolders(f.id);
  };

  const goTo = (idx: number) => {
    const target = crumbs[idx];
    setCrumbs((c) => c.slice(0, idx + 1));
    loadFolders(target.id);
  };

  const save = async () => {
    if (!msg?.file_url) return;
    setSaving(true);
    try {
      const r = await depoApi.saveFromChat({
        name: msg.file_name || 'Файл',
        url: msg.file_url,
        mime: msg.file_mime || 'application/octet-stream',
        size: msg.file_size || 0,
        folder_id: current.id,
      });
      onSaved(r.file.path || '/');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {msg && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[97] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[85vh] flex flex-col rounded-2xl border border-[#45A29E]/40 bg-[#0B0C10]/95 shadow-[0_0_50px_rgba(69,162,158,0.2)] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#45A29E]/20">
              <Icon name="FolderPlus" size={18} className="text-[#66FCF1]" />
              <h3 className="font-heading font-bold text-white flex-1">Сохранить в депозитарий</h3>
              <button onClick={onClose} className="text-[#6B7684] hover:text-white"><Icon name="X" size={18} /></button>
            </div>

            {/* file info */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#45A29E]/15 bg-[#1F2833]/30">
              <Icon name={fileIcon(msg.file_name, msg.file_mime) as any} size={16} className="text-[#66FCF1]" />
              <span className="text-sm text-white truncate flex-1">{msg.file_name}</span>
              <span className="text-[10px] text-[#8B98A5]">{formatSize(msg.file_size)}</span>
            </div>

            {/* breadcrumbs */}
            <div className="flex items-center gap-1 px-4 py-2 flex-wrap text-[11px]">
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <Icon name="ChevronRight" size={11} className="text-[#6B7684]" />}
                  <button onClick={() => goTo(i)} className={i === crumbs.length - 1 ? 'text-[#66FCF1] font-semibold' : 'text-[#8B98A5] hover:text-white'}>
                    {c.name}
                  </button>
                </span>
              ))}
            </div>

            {/* folders */}
            <div className="flex-1 overflow-y-auto px-3 pb-2 min-h-[120px]">
              {loading ? (
                <div className="py-8 text-center"><Icon name="Loader2" size={22} className="animate-spin text-[#66FCF1] mx-auto" /></div>
              ) : folders.length === 0 ? (
                <div className="py-8 text-center text-[#6B7684] text-sm">Здесь нет вложенных папок</div>
              ) : (
                folders.map((f) => (
                  <button key={f.id} onClick={() => enter(f)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1F2833]/60 text-left">
                    <Icon name={f.kind === 'department' ? 'Building2' : f.kind === 'project' ? 'FolderKanban' : 'Folder'} size={16} className="text-[#45A29E]" />
                    <span className="text-sm text-[#C5C6C7] flex-1 truncate">{f.name}</span>
                    <Icon name="ChevronRight" size={14} className="text-[#6B7684]" />
                  </button>
                ))
              )}
            </div>

            <div className="p-3 border-t border-[#45A29E]/20">
              <button onClick={save} disabled={saving}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#45A29E] to-[#66FCF1] text-[#0B0C10] font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="Check" size={16} />}
                Сохранить сюда: {current.name}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaveToDepoModal;
