import Icon from '@/components/ui/icon';
import { ChatMessage } from '@/lib/crewApi';
import { formatSize, fileIcon, isImage } from '@/lib/fileUtils';

interface Props {
  msg: ChatMessage;
  mine: boolean;
  onPreview: (msg: ChatMessage) => void;
  onSaveToDepo: (msg: ChatMessage) => void;
}

const ChatFileCard = ({ msg, mine, onPreview, onSaveToDepo }: Props) => {
  const img = isImage(msg.file_name, msg.file_mime);

  if (img && msg.file_url) {
    return (
      <div>
        <button onClick={() => onPreview(msg)} className="block rounded-lg overflow-hidden border border-[#45A29E]/30 max-w-[220px]">
          <img src={msg.file_url} alt={msg.file_name || ''} className="w-full h-auto object-cover max-h-[180px]" />
        </button>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-[#8B98A5] truncate flex-1">{msg.file_name}</span>
          {!mine && (
            <button onClick={() => onSaveToDepo(msg)} title="Сохранить в депозитарий" className="text-[#66FCF1] hover:text-white shrink-0">
              <Icon name="FolderPlus" size={13} />
            </button>
          )}
        </div>
        {msg.depo_path && <div className="text-[9px] text-[#45A29E] mt-0.5 truncate">📁 {msg.depo_path}</div>}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#45A29E]/30 bg-[#0B0C10]/40 p-2 min-w-[200px] max-w-[260px]">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-[#45A29E]/15 border border-[#45A29E]/30 flex items-center justify-center shrink-0">
          <Icon name={fileIcon(msg.file_name, msg.file_mime) as any} size={18} className="text-[#66FCF1]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-white truncate">{msg.file_name || 'Файл'}</div>
          <div className="text-[10px] text-[#8B98A5]">{formatSize(msg.file_size)}</div>
        </div>
      </div>
      {msg.depo_path && <div className="text-[9px] text-[#45A29E] mt-1 truncate">📁 {msg.depo_path}</div>}
      <div className="flex gap-1.5 mt-2">
        <button onClick={() => onPreview(msg)}
          className="flex-1 flex items-center justify-center gap-1 py-1 rounded-md bg-[#45A29E]/20 text-[#66FCF1] text-[11px] hover:bg-[#45A29E]/30">
          <Icon name="Eye" size={12} /> Открыть
        </button>
        <a href={msg.file_url || '#'} download={msg.file_name || undefined} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 px-2 py-1 rounded-md border border-[#45A29E]/30 text-[#66FCF1] text-[11px] hover:bg-[#45A29E]/10">
          <Icon name="Download" size={12} />
        </a>
        {!mine && !msg.depo_path && (
          <button onClick={() => onSaveToDepo(msg)} title="Сохранить в депозитарий"
            className="flex items-center justify-center px-2 py-1 rounded-md border border-[#45A29E]/30 text-[#66FCF1] text-[11px] hover:bg-[#45A29E]/10">
            <Icon name="FolderPlus" size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatFileCard;
