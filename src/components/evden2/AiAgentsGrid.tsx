import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';

const agents = [
  { name: 'Лид-хантер', icon: 'Radar', desc: 'Собирает лиды из BIDZAAR, почты, Telegram и Max, создаёт карточки сделок', color: 'from-sky-500 to-cyan-400', active: true },
  { name: 'Сметчик', icon: 'Calculator', desc: 'Формирует предварительную смету по ТЗ и базе расценок', color: 'from-emerald-500 to-teal-400', active: true },
  { name: 'Диспетчер', icon: 'Users', desc: 'Назначает исполнителей на импульсы с учётом загрузки', color: 'from-violet-500 to-purple-400', active: true },
  { name: 'Психолог', icon: 'HeartHandshake', desc: 'Анализирует тон переписки, советует, как снять напряжение', color: 'from-pink-500 to-rose-400', active: false },
  { name: 'Прогнозист', icon: 'LineChart', desc: 'Ежедневно пересчитывает вероятность закрытия сделок', color: 'from-amber-500 to-orange-400', active: true },
];

export const AiAgentsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {agents.map((a, i) => (
        <motion.div
          key={a.name}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ y: -3 }}
          className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-3.5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center`}>
              <Icon name={a.icon as any} size={17} className="text-white" />
            </div>
            <span className={`flex items-center gap-1 text-[10px] ${a.active ? 'text-emerald-400' : 'text-slate-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${a.active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              {a.active ? 'Активен' : 'В ожидании'}
            </span>
          </div>
          <div className="text-sm font-semibold text-white mb-1">{a.name}</div>
          <p className="text-[11px] text-slate-400 leading-snug">{a.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default AiAgentsGrid;
