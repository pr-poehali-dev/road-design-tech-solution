import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { evdenApi, Impulse } from '@/lib/evden2Api';

type ImpulseWithDeal = Impulse & { deal_name: string };

const priorityMeta: Record<string, { label: string; color: string }> = {
  critical: { label: 'Критично', color: 'bg-red-500/15 text-red-300 border-red-500/30' },
  high: { label: 'Высокий', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
  medium: { label: 'Средний', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  low: { label: 'Низкий', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
};

const columns: { key: Impulse['status']; title: string; color: string }[] = [
  { key: 'open', title: 'Открыт', color: 'border-sky-500/30' },
  { key: 'progress', title: 'В работе', color: 'border-amber-500/30' },
  { key: 'review', title: 'На проверке', color: 'border-violet-500/30' },
  { key: 'done', title: 'Закрыт', color: 'border-emerald-500/30' },
];

export const ImpulsesKanban = ({ refreshKey }: { refreshKey?: number }) => {
  const { toast } = useToast();
  const [impulses, setImpulses] = useState<ImpulseWithDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await evdenApi.getAllImpulses();
      setImpulses(res.impulses);
    } catch (e: any) {
      toast({ title: 'Не удалось загрузить импульсы', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const moveTo = async (id: number, status: Impulse['status']) => {
    const prev = impulses;
    setImpulses((cur) => cur.map((imp) => (imp.id === id ? { ...imp, status } : imp)));
    try {
      await evdenApi.updateImpulse(id, { status });
    } catch (e: any) {
      setImpulses(prev);
      toast({ title: 'Не удалось переместить импульс', description: e.message, variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-10 text-center text-slate-400">
        <Icon name="Loader2" size={28} className="animate-spin mx-auto mb-2 text-amber-400" />
        Загрузка импульсов...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {columns.map((col) => {
        const items = impulses.filter((i) => i.status === col.key);
        return (
          <div
            key={col.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => dragId && moveTo(dragId, col.key)}
            className={`rounded-2xl border ${col.color} bg-slate-900/50 p-3 min-h-[220px]`}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-medium text-slate-200">{col.title}</span>
              <span className="text-xs text-slate-500 bg-slate-800/60 rounded-full px-2 py-0.5">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map((imp) => (
                <motion.div
                  key={imp.id}
                  layout
                  draggable
                  onDragStart={() => setDragId(imp.id)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -2 }}
                  className="rounded-xl bg-slate-800/70 border border-slate-700/50 p-2.5 cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-xs font-medium text-slate-100 leading-snug">{imp.title}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={`text-[10px] px-1.5 py-0 border ${priorityMeta[imp.priority]?.color || priorityMeta.medium.color}`}>
                      {priorityMeta[imp.priority]?.label || imp.priority}
                    </Badge>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Icon name="User" size={11} />
                      {imp.assignee}
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-500">
                    <Icon name="Briefcase" size={10} />
                    {imp.deal_name}
                  </div>
                  {imp.source !== 'manual' && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-400/70">
                      <Icon name="Sparkles" size={10} />
                      {imp.source === 'ai_comment' ? 'создано ИИ из комментария' : imp.source === 'voice' ? 'создано голосом' : imp.source === 'bidzaar' ? 'из BIDZAAR' : imp.source}
                    </div>
                  )}
                </motion.div>
              ))}
              {items.length === 0 && (
                <div className="text-center text-xs text-slate-600 py-6 border border-dashed border-slate-700/40 rounded-xl">
                  Перетащите сюда
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImpulsesKanban;
