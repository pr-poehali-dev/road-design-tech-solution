import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Icon from '@/components/ui/icon';

const revenueData = [
  { month: 'Фев', plan: 8.2, fact: 7.6 },
  { month: 'Мар', plan: 9.1, fact: 9.8 },
  { month: 'Апр', plan: 10.4, fact: 9.9 },
  { month: 'Май', plan: 11.2, fact: 12.1 },
  { month: 'Июн', plan: 12.0, fact: 12.4 },
  { month: 'Июл', plan: 13.5, fact: 14.2 },
];

const skillsData = [
  { subject: 'Скорость ответа', current: 92 },
  { subject: 'Конверсия', current: 76 },
  { subject: 'Точность смет', current: 88 },
  { subject: 'Удержание клиентов', current: 81 },
  { subject: 'Соблюдение сроков', current: 68 },
];

export const LiveAnalytics = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="TrendingUp" size={16} className="text-emerald-400" />
          <span className="text-sm font-medium text-white">Оборот: план vs факт</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={revenueData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="planGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="factGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => [`${v}M ₽`, '']}
            />
            <Area type="monotone" dataKey="plan" stroke="#f59e0b" fill="url(#planGrad)" strokeWidth={2} name="План" />
            <Area type="monotone" dataKey="fact" stroke="#10b981" fill="url(#factGrad)" strokeWidth={2} name="Факт" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Gauge" size={16} className="text-amber-400" />
          <span className="text-sm font-medium text-white">Индекс эффективности</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={skillsData}>
            <PolarGrid stroke="rgba(148,163,184,0.15)" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#94a3b8' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: '#64748b' }} />
            <Radar dataKey="current" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.25} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LiveAnalytics;
