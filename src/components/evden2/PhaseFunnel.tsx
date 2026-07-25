import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { Deal, PHASE_LABELS } from '@/lib/evden2Api';

const phaseKeys = ['ether', 'gravity', 'docking', 'foundation'];

export const PhaseFunnel = ({
  deals,
  active,
  onSelect,
}: {
  deals: Deal[];
  active: string;
  onSelect: (k: string) => void;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {phaseKeys.map((key, i) => {
        const meta = PHASE_LABELS[key];
        const inPhase = deals.filter((d) => d.phase === key);
        const budget = inPhase.reduce((s, d) => s + (d.budget || 0), 0);
        return (
          <motion.button
            key={key}
            onClick={() => onSelect(key)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className={`text-left rounded-2xl border p-4 relative overflow-hidden transition-all ${
              active === key
                ? 'border-amber-400/60 bg-slate-900/80 shadow-[0_0_30px_rgba(251,191,36,0.15)]'
                : 'border-slate-700/50 bg-slate-900/40 hover:border-amber-500/30'
            }`}
          >
            <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${meta.color} opacity-10 blur-xl`} />
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-lg`}>
                <Icon name={meta.icon as any} size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-white">{inPhase.length}</span>
            </div>
            <div className="font-semibold text-white text-sm">{meta.title}</div>
            <div className="text-xs text-slate-400 mb-2">{meta.subtitle}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-300/70">
              <Icon name="Wallet" size={12} className="shrink-0" />
              <span>{(budget / 1_000_000).toFixed(1)}M ₽ в фазе</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default PhaseFunnel;
