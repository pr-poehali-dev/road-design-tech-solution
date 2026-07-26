import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { crmApi, Analytics } from '@/lib/crmApi';

const formatMoney = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M ₽`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K ₽`;
  return `${v} ₽`;
};

export const CRMAnalytics = () => {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    crmApi.getAnalytics().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Icon name="Loader2" size={28} className="animate-spin text-[#66FCF1] mx-auto" />
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-center text-[#6B7684]">Не удалось загрузить аналитику</div>;
  }

  const maxCount = Math.max(1, ...data.funnel.map((f) => f.count));

  return (
    <div className="p-4 space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#45A29E]/20 bg-[#1F2833]/40 p-3">
          <div className="text-[10px] text-[#8B98A5] uppercase tracking-wider">Общая конверсия</div>
          <div className="text-2xl font-mono font-bold text-[#66FCF1]">{data.overall_conversion}%</div>
        </div>
        <div className="rounded-xl border border-[#FF4D4D]/20 bg-[#1F2833]/40 p-3">
          <div className="text-[10px] text-[#8B98A5] uppercase tracking-wider">Просроченные задачи</div>
          <div className="text-2xl font-mono font-bold text-[#FF9B9B]">{data.task_stats.overdue}</div>
        </div>
        <div className="rounded-xl border border-[#FF6600]/20 bg-[#1F2833]/40 p-3">
          <div className="text-[10px] text-[#8B98A5] uppercase tracking-wider">Скоро дедлайн</div>
          <div className="text-2xl font-mono font-bold text-[#FF9B4D]">{data.task_stats.upcoming}</div>
        </div>
        <div className="rounded-xl border border-[#C89BFF]/20 bg-[#1F2833]/40 p-3">
          <div className="text-[10px] text-[#8B98A5] uppercase tracking-wider">Сделки без движения (7д+)</div>
          <div className="text-2xl font-mono font-bold text-[#C89BFF]">{data.stale_deals}</div>
        </div>
      </div>

      <div className="rounded-xl border border-[#45A29E]/20 bg-[#1F2833]/40 p-4">
        <div className="text-sm font-medium text-[#66FCF1] mb-3 flex items-center gap-1.5">
          <Icon name="Filter" size={14} /> Воронка по этапам
        </div>
        <div className="space-y-2">
          {data.funnel.map((f) => (
            <div key={f.stage_key} className="flex items-center gap-2">
              <div className="w-40 text-xs text-[#C5C6C7] truncate">{f.label}</div>
              <div className="flex-1 h-6 bg-[#0B0C10]/50 rounded-md overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#45A29E] to-[#66FCF1] flex items-center justify-end px-2 transition-all"
                  style={{ width: `${(f.count / maxCount) * 100}%`, minWidth: f.count > 0 ? '24px' : '0' }}
                >
                  {f.count > 0 && <span className="text-[10px] font-bold text-[#0B0C10]">{f.count}</span>}
                </div>
              </div>
              <div className="w-20 text-right text-[10px] text-[#8B98A5] font-mono">{formatMoney(f.total_amount)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#45A29E]/20 bg-[#1F2833]/40 p-4">
        <div className="text-sm font-medium text-[#66FCF1] mb-3 flex items-center gap-1.5">
          <Icon name="TrendingUp" size={14} /> Конверсия между этапами
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {data.conversions.map((c, i) => (
            <div key={i} className="flex items-center justify-between text-xs bg-[#0B0C10]/40 rounded-md px-3 py-2">
              <span className="text-[#8B98A5] truncate">{c.from} → {c.to}</span>
              <span className={`font-mono font-bold ${c.rate >= 50 ? 'text-[#5eead4]' : c.rate >= 20 ? 'text-[#FF9B4D]' : 'text-[#FF9B9B]'}`}>{c.rate}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#FF6600]/25 bg-[#FF6600]/5 p-4">
        <div className="text-sm font-medium text-[#FF6600] mb-2 flex items-center gap-1.5">
          <Icon name="Lightbulb" size={14} /> Рекомендации
        </div>
        <ul className="space-y-1.5">
          {data.recommendations.map((r, i) => (
            <li key={i} className="text-xs text-[#C5C6C7] flex items-start gap-1.5">
              <Icon name="ArrowRight" size={12} className="text-[#FF9B4D] mt-0.5 shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CRMAnalytics;
