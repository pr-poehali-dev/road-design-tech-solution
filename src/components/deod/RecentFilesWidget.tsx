import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { depoApi, DepoFile } from '@/lib/crewApi';
import { fileIcon, formatSize, isImage } from '@/lib/fileUtils';
import FilePreviewModal, { PreviewFile } from './FilePreviewModal';

const RecentFilesWidget = ({ onOpenDepo }: { onOpenDepo: () => void }) => {
  const [files, setFiles] = useState<DepoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<PreviewFile | null>(null);

  useEffect(() => {
    depoApi.recent(8)
      .then((r) => setFiles(r.files))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openFile = (f: DepoFile) => setPreview({ url: f.url, name: f.name, mime: f.mime, size: f.size_bytes, path: f.path });

  return (
    <div className="rounded-2xl border border-[#45A29E]/25 bg-[#1F2833]/30 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-[#45A29E]/15 border border-[#45A29E]/40 flex items-center justify-center">
          <Icon name="Clock" size={18} className="text-[#66FCF1]" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-white tracking-wide">Последние файлы</h2>
          <p className="text-[10px] text-[#6B7684] uppercase tracking-widest">свежее в депозитарии</p>
        </div>
        <button onClick={onOpenDepo} className="ml-auto flex items-center gap-1 text-[12px] text-[#66FCF1] hover:text-white transition-colors">
          Открыть хранилище <Icon name="ArrowRight" size={14} />
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center"><Icon name="Loader2" size={22} className="animate-spin text-[#66FCF1] mx-auto" /></div>
      ) : files.length === 0 ? (
        <div className="py-8 text-center text-[#6B7684] text-sm">
          <Icon name="FolderOpen" size={28} className="mx-auto mb-2 opacity-50" />
          Пока нет файлов. Загрузите первые документы в депозитарий.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {files.map((f, i) => (
            <motion.button
              key={f.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              onClick={() => openFile(f)}
              className="group flex flex-col rounded-xl border border-[#45A29E]/20 bg-[#0B0C10]/40 overflow-hidden hover:border-[#66FCF1]/50 transition-colors text-left"
            >
              <div className="h-20 bg-[#050608] flex items-center justify-center overflow-hidden">
                {isImage(f.name, f.mime) ? (
                  <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                ) : (
                  <Icon name={fileIcon(f.name, f.mime) as any} size={28} className="text-[#45A29E] group-hover:text-[#66FCF1] transition-colors" />
                )}
              </div>
              <div className="p-2">
                <div className="text-[11px] font-medium text-white truncate">{f.name}</div>
                <div className="text-[9px] text-[#6B7684] truncate">{formatSize(f.size_bytes)}{f.path ? ` · ${f.path}` : ''}</div>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <FilePreviewModal file={preview} onClose={() => setPreview(null)} />
    </div>
  );
};

export default RecentFilesWidget;
