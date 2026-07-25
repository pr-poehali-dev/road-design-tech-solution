import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { sections } from './sectionsData';

const QuickNav = ({ onOpenChat }: { onOpenChat: () => void }) => {
  const go = (route: string) => {
    window.location.href = route;
  };

  return (
    <div className="sticky top-0 z-30 border-b border-[#45A29E]/20 bg-[#0B0C10]/80 backdrop-blur-lg">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6">
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-hide">
          <span className="hidden md:flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-[#45A29E] shrink-0 pr-2 border-r border-[#45A29E]/20 mr-1">
            <Icon name="Compass" size={13} />
            Быстрый вход
          </span>
          {sections.map((s) => {
            const isOrange = s.accent === 'orange';
            const isComms = s.id === 'comms';
            return (
              <motion.button
                key={s.id}
                onClick={() => (isComms ? onOpenChat() : go(s.route))}
                whileHover={{ y: -2 }}
                title={s.title}
                className={`group flex items-center gap-1.5 shrink-0 rounded-lg border px-2.5 py-1.5 transition-colors ${
                  isOrange
                    ? 'border-[#FF6600]/40 bg-[#FF6600]/10 hover:bg-[#FF6600]/20'
                    : 'border-[#45A29E]/25 bg-[#1F2833]/40 hover:border-[#66FCF1]/60 hover:bg-[#45A29E]/10'
                }`}
              >
                <Icon
                  name={s.icon as any}
                  size={15}
                  className={isOrange ? 'text-[#FF6600]' : 'text-[#66FCF1]'}
                />
                <span className="text-[11px] font-medium text-[#C5C6C7] whitespace-nowrap group-hover:text-white max-w-[130px] truncate">
                  {s.title}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickNav;
