import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, CartesianGrid } from 'recharts';
import Icon from '@/components/ui/icon';
import { Deal, Stats, PHASE_LABELS } from '@/lib/evden2Api';

export const LiveAnalytics = ({ deals, stats }: { deals: Deal[]; stats: Stats | null }) => {
  const budgetByPhase = Object.keys(PHASE_LABELS).map((key) => ({
    phase: PHASE_LABELS[key].title,
    budget: Math.round(deals.filter((d) => d.phase === key).reduce((s, d) => s + (d.budget || 0), 0) / 1_000_000 * 10) / 10,
  }));

  const avgProbability = deals.length ? Math.round(deals.reduce((s, d) => s + (d.probability || 0), 0) / deals.length) : 0;
  const greenShare = deals.length ? Math.round((deals.filter((d) => d.health === 'green').length / deals.length) * 100) : 0;
  const withTelegram = deals.length ? Math.round((deals.filter((d) => d.telegram_chat_id).length / deals.length) * 100) : 0;
  const closedRatio = stats && stats.open_impulses + stats.closed_impulses > 0
    ? Math.round((stats.closed_impulses / (stats.open_impulses + stats.closed_impulses)) * 100)
    : 0;

  const radarData = [
    { subject: 'Вероятность закрытия', current: avgProbability },
    { subject: 'Здоровые сделки', current: greenShare },
    { subject: 'Подключён Telegram', current: withTelegram },
    { subject: 'Импульсы закрыты', current: closedRatio },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="TrendingUp" size={16} className="text-emerald-400" />
          <span className="text-sm font-medium text-white">Бюджет сделок по фазам воронки</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={budgetByPhase} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="phase" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => [`${v}M ₽`, 'Бюджет']}
            />
            <Bar dataKey="budget" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Gauge" size={16} className="text-amber-400" />
          <span className="text-sm font-medium text-white">Индекс эффективности</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
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
