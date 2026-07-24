import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';

interface Phase {
  key: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  count: number;
  aiAction: string;
}

const phases: Phase[] = [
  {
    key: 'ether',
    title: 'Эфир',
    subtitle: 'Сбор лидов',
    icon: 'Radio',
    color: 'from-sky-500 to-cyan-400',
    count: 42,
    aiAction: 'ИИ сканирует BIDZAAR, почту и Telegram — создано 6 карточек за сегодня',
  },
  {
    key: 'gravity',
    title: 'Гравитация',
    subtitle: 'Интерес клиента',
    icon: 'Magnet',
    color: 'from-violet-500 to-purple-400',
    count: 27,
    aiAction: 'Собран цифровой двойник объекта, смета готова автоматически',
  },
  {
    key: 'docking',
    title: 'Стыковка',
    subtitle: 'Переговоры',
    icon: 'Link2',
    color: 'from-amber-500 to-orange-400',
    count: 15,
    aiAction: 'Анализ тональности переписки — риск снижения цены у 3 сделок',
  },
  {
    key: 'foundation',
    title: 'Заливка фундамента',
    subtitle: 'В производстве',
    icon: 'HardHat',
    color: 'from-emerald-500 to-teal-400',
    count: 9,
    aiAction: 'Создано 34 «Импульса» по этапам работ, календарь синхронизирован',
  },
];

export const PhaseFunnel = ({ active, onSelect }: { active: string; onSelect: (k: string) => void }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {phases.map((p, i) => (
        <motion.button
          key={p.key}
          onClick={() => onSelect(p.key)}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ y: -4 }}
          className={`text-left rounded-2xl border p-4 relative overflow-hidden transition-all ${
            active === p.key
              ? 'border-amber-400/60 bg-slate-900/80 shadow-[0_0_30px_rgba(251,191,36,0.15)]'
              : 'border-slate-700/50 bg-slate-900/40 hover:border-amber-500/30'
          }`}
        >
          <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${p.color} opacity-10 blur-xl`} />
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center shadow-lg`}>
              <Icon name={p.icon as any} size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{p.count}</span>
          </div>
          <div className="font-semibold text-white text-sm">{p.title}</div>
          <div className="text-xs text-slate-400 mb-2">{p.subtitle}</div>
          <div className="flex items-start gap-1.5 text-[11px] text-amber-300/70 leading-snug">
            <Icon name="Sparkles" size={12} className="mt-0.5 shrink-0" />
            <span>{p.aiAction}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default PhaseFunnel;
