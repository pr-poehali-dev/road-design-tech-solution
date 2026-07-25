import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';

const StarComLauncher = ({ unread, flashing, onClick }: { unread: number; flashing: boolean; onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      title="Межзвездная связь"
      className={`fixed right-4 bottom-24 z-50 w-14 h-14 rounded-full flex items-center justify-center border-2 transition-colors ${
        flashing
          ? 'border-[#FF6600] bg-[#FF6600]/20 shadow-[0_0_28px_rgba(255,102,0,0.6)] animate-pulse'
          : 'border-[#66FCF1]/50 bg-[#1F2833] shadow-[0_0_22px_rgba(102,252,241,0.35)]'
      }`}
    >
      <Icon name="Radio" size={24} className={flashing ? 'text-[#FF6600]' : 'text-[#66FCF1]'} />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#FF4D4D] text-white text-[11px] font-bold flex items-center justify-center border-2 border-[#0B0C10]">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </motion.button>
  );
};

export default StarComLauncher;
