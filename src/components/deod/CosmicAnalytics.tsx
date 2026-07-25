import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '@/components/ui/icon';

const antimatterData = [
  { v: 30 }, { v: 45 }, { v: 38 }, { v: 60 }, { v: 52 }, { v: 78 }, { v: 65 }, { v: 90 },
];

const departments = [
  { name: 'Реестр', load: 82 },
  { name: 'DEAD SPACE', load: 95 },
  { name: 'Альянс', load: 47 },
  { name: 'Казначейство', load: 63 },
  { name: 'Инженерный', load: 88 },
  { name: 'Мостик', load: 34 },
  { name: 'Связь', load: 71 },
  { name: 'Вещатель', load: 55 },
];

const heatColor = (load: number) => {
  if (load >= 85) return 'bg-[#FF4D4D]';
  if (load >= 65) return 'bg-[#FF6600]';
  if (load >= 45) return 'bg-[#66FCF1]';
  return 'bg-[#45A29E]';
};

const CosmicAnalytics = () => {
  return (
    <div className="rounded-2xl border border-[#45A29E]/30 bg-gradient-to-br from-[#1F2833]/60 to-[#0B0C10]/80 backdrop-blur-md p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute -top-16 left-1/3 w-40 h-40 rounded-full bg-[#66FCF1]/10 blur-3xl" />

      <div className="relative flex items-center gap-2 mb-5">
        <Icon name="Atom" size={20} className="text-[#66FCF1] animate-orbit-spin" />
        <h2 className="font-heading font-bold text-lg sm:text-xl text-white tracking-wide">Космическая аналитика</h2>
        <span className="ml-auto text-[10px] font-mono text-[#45A29E] uppercase tracking-widest">агрегация всех систем</span>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Гравитационная карта */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 rounded-xl border border-white/5 bg-[#0B0C10]/50 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Grid3x3" size={15} className="text-[#45A29E]" />
            <span className="text-xs font-heading font-semibold text-[#C5C6C7] uppercase tracking-wider">Гравитационная карта</span>
            <span className="text-[10px] text-[#6B7684] ml-auto">загрузка отделов</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {departments.map((d) => (
              <div key={d.name} className="rounded-lg bg-[#1F2833]/60 border border-white/5 p-2">
                <div className="flex items-end justify-between mb-1.5">
                  <span className="text-[9px] text-[#8B98A5] truncate">{d.name}</span>
                  <span className="text-[10px] font-mono font-bold text-white">{d.load}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#0B0C10] overflow-hidden">
                  <div className={`h-full rounded-full ${heatColor(d.load)}`} style={{ width: `${d.load}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Скорость света */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl border border-[#66FCF1]/20 bg-[#0B0C10]/50 p-4 flex flex-col items-center justify-center text-center"
        >
          <div className="flex items-center gap-1.5 mb-2 self-start">
            <Icon name="Gauge" size={15} className="text-[#66FCF1]" />
            <span className="text-xs font-heading font-semibold text-[#C5C6C7] uppercase tracking-wider">Скорость света</span>
          </div>
          <div className="relative w-24 h-24 my-1">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1F2833" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="#66FCF1" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - 0.68)}
                style={{ filter: 'drop-shadow(0 0 6px rgba(102,252,241,0.6))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono font-bold text-2xl text-[#66FCF1]">68%</span>
            </div>
          </div>
          <span className="text-[10px] text-[#6B7684]">выполнение общего плана</span>
        </motion.div>

        {/* Красное смещение */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-[#FF4D4D]/30 bg-[#FF4D4D]/5 p-4 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-[#FF4D4D]/15 border border-[#FF4D4D]/40 flex items-center justify-center shadow-[0_0_18px_rgba(255,77,77,0.4)] shrink-0">
            <Icon name="AlertTriangle" size={24} className="text-[#FF4D4D] animate-pulse-glow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-heading font-semibold text-[#FF9B9B] uppercase tracking-wider">Красное смещение</span>
            </div>
            <div className="font-mono font-bold text-3xl text-[#FF4D4D]">14</div>
            <span className="text-[10px] text-[#B57070]">просроченных задач</span>
          </div>
        </motion.div>

        {/* Сигнатуры жизни */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border border-[#45A29E]/20 bg-[#0B0C10]/50 p-4 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-[#45A29E]/15 border border-[#45A29E]/40 flex items-center justify-center shrink-0">
            <Icon name="Activity" size={24} className="text-[#66FCF1]" />
          </div>
          <div>
            <span className="text-xs font-heading font-semibold text-[#C5C6C7] uppercase tracking-wider">Сигнатуры жизни</span>
            <div className="font-mono font-bold text-3xl text-[#66FCF1]">1 285</div>
            <span className="text-[10px] text-[#6B7684]">активных клиентов / сделок</span>
          </div>
        </motion.div>

        {/* Расход антиматерии */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-[#FF6600]/25 bg-[#0B0C10]/50 p-4"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Icon name="Flame" size={15} className="text-[#FF6600]" />
            <span className="text-xs font-heading font-semibold text-[#C5C6C7] uppercase tracking-wider">Расход антиматерии</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-mono font-bold text-xl text-[#FF6600]">420K ₽</span>
            <span className="text-[10px] text-[#FF4D4D]">+12% за месяц</span>
          </div>
          <ResponsiveContainer width="100%" height={54}>
            <AreaChart data={antimatterData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="antimatterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6600" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#FF6600" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ background: '#0B0C10', border: '1px solid rgba(255,102,0,0.4)', borderRadius: 8, fontSize: 11 }}
                labelStyle={{ display: 'none' }}
                formatter={(v: number) => [`${v}K ₽`, 'Затраты']}
              />
              <Area type="monotone" dataKey="v" stroke="#FF6600" strokeWidth={2} fill="url(#antimatterGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default CosmicAnalytics;
