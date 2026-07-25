import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { DeodSection } from './sectionsData';

const SectionCard = ({ section, index, onSpecial }: { section: DeodSection; index: number; onSpecial?: (kind: 'crew' | 'chat' | 'depository') => void }) => {
  const isOrange = section.accent === 'orange';

  const go = () => {
    if (section.special && onSpecial) {
      onSpecial(section.special);
      return;
    }
    window.location.href = section.route;
  };

  return (
    <motion.button
      onClick={go}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -6, scale: 1.015 }}
      className={`group relative text-left rounded-xl border p-4 sm:p-5 overflow-hidden backdrop-blur-md transition-colors ${
        isOrange
          ? 'border-[#FF6600]/50 bg-gradient-to-br from-[#FF6600]/10 via-[#1F2833]/60 to-[#0B0C10]/80 hover:border-[#FF6600]'
          : 'border-[#45A29E]/30 bg-gradient-to-br from-[#1F2833]/70 to-[#0B0C10]/80 hover:border-[#66FCF1]/70'
      }`}
    >
      {/* corner glow */}
      <div
        className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl transition-opacity opacity-40 group-hover:opacity-70 ${
          isOrange ? 'bg-[#FF6600]/40' : 'bg-[#45A29E]/30'
        }`}
      />
      {/* scan line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#66FCF1]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex items-start justify-between mb-3">
        <div
          className={`w-11 h-11 rounded-lg flex items-center justify-center border ${
            isOrange
              ? 'bg-[#FF6600]/15 border-[#FF6600]/40 shadow-[0_0_18px_rgba(255,102,0,0.35)]'
              : 'bg-[#45A29E]/10 border-[#45A29E]/40 shadow-[0_0_14px_rgba(69,162,158,0.25)]'
          }`}
        >
          <Icon name={section.icon as any} size={22} className={isOrange ? 'text-[#FF6600]' : 'text-[#66FCF1]'} />
        </div>
        {section.featured && (
          <span className="text-[9px] font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF6600]/20 text-[#FF6600] border border-[#FF6600]/40">
            Ключевой модуль
          </span>
        )}
        <Icon
          name="ArrowUpRight"
          size={16}
          className={`${section.featured ? 'hidden' : ''} text-[#45A29E] opacity-0 group-hover:opacity-100 transition-opacity`}
        />
      </div>

      <h3 className={`relative font-heading font-bold text-base sm:text-lg mb-0.5 ${isOrange ? 'text-[#FF8533]' : 'text-white'}`}>
        {section.title}
      </h3>
      <p className="relative text-[11px] text-[#8B98A5] mb-4 leading-snug">{section.subtitle}</p>

      <div className="relative grid grid-cols-3 gap-2">
        {section.metrics.map((m) => (
          <div key={m.label} className="rounded-md bg-[#0B0C10]/50 border border-white/5 px-2 py-1.5">
            <div className={`font-mono font-bold text-sm ${isOrange ? 'text-[#FF6600]' : 'text-[#66FCF1]'}`}>{m.value}</div>
            <div className="text-[9px] text-[#6B7684] leading-tight mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>
    </motion.button>
  );
};

export default SectionCard;