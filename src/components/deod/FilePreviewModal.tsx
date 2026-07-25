import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { formatSize, fileIcon, isImage, isVideo, isPdf, isAudio } from '@/lib/fileUtils';

export interface PreviewFile {
  url: string;
  name: string;
  mime?: string | null;
  size?: number | null;
  path?: string | null;
}

interface Props {
  file: PreviewFile | null;
  onClose: () => void;
}

const FilePreviewModal = ({ file, onClose }: Props) => {
  return (
    <AnimatePresence>
      {file && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-[#45A29E]/40 bg-[#0B0C10]/95 overflow-hidden shadow-[0_0_50px_rgba(69,162,158,0.2)]"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#45A29E]/20 shrink-0">
              <Icon name={fileIcon(file.name, file.mime) as any} size={18} className="text-[#66FCF1]" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{file.name}</div>
                {file.path && <div className="text-[10px] text-[#45A29E] truncate">📁 {file.path}</div>}
              </div>
              <span className="text-[11px] text-[#8B98A5]">{formatSize(file.size)}</span>
              <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold text-xs hover:opacity-90">
                <Icon name="Download" size={13} /> Скачать
              </a>
              <button onClick={onClose} className="text-[#6B7684] hover:text-white p-1"><Icon name="X" size={18} /></button>
            </div>

            <div className="flex-1 overflow-auto bg-[#050608] flex items-center justify-center min-h-[300px]">
              {isImage(file.name, file.mime) ? (
                <img src={file.url} alt={file.name} className="max-w-full max-h-[75vh] object-contain" />
              ) : isVideo(file.name, file.mime) ? (
                <video src={file.url} controls className="max-w-full max-h-[75vh]" />
              ) : isAudio(file.name, file.mime) ? (
                <div className="p-10 text-center">
                  <Icon name="Music" size={48} className="text-[#66FCF1] mx-auto mb-4" />
                  <audio src={file.url} controls className="mx-auto" />
                </div>
              ) : isPdf(file.name, file.mime) ? (
                <div className="w-full h-[75vh] flex flex-col">
                  <iframe
                    src={`https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(file.url)}`}
                    title={file.name}
                    className="w-full flex-1 bg-white"
                  />
                  <div className="flex items-center justify-center gap-2 py-2 bg-[#0B0C10] border-t border-[#45A29E]/20 text-[11px] text-[#6B7684]">
                    <span>Не отображается?</span>
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-[#66FCF1] hover:text-white inline-flex items-center gap-1">
                      <Icon name="ExternalLink" size={12} /> Открыть в новой вкладке
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Icon name={fileIcon(file.name, file.mime) as any} size={56} className="text-[#45A29E] mx-auto mb-4" />
                  <p className="text-[#8B98A5] mb-4">Предпросмотр для этого формата недоступен</p>
                  <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold hover:opacity-90">
                    <Icon name="Download" size={16} /> Скачать файл
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilePreviewModal;