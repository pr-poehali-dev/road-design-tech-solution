import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Impulse {
  id: string;
  title: string;
  deal: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee: string;
  status: 'open' | 'progress' | 'review' | 'done';
}

const priorityMeta: Record<string, { label: string; color: string }> = {
  critical: { label: 'Критично', color: 'bg-red-500/15 text-red-300 border-red-500/30' },
  high: { label: 'Высокий', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
  medium: { label: 'Средний', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  low: { label: 'Низкий', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' },
};

const initialImpulses: Impulse[] = [
  { id: '1', title: 'Расчёт фундамента ТЦ «Меридиан»', deal: 'ТЦ Меридиан', priority: 'critical', assignee: 'Иванов И.', status: 'open' },
  { id: '2', title: 'Подготовить геологию до пятницы', deal: 'Складской комплекс', priority: 'high', assignee: 'Петров С.', status: 'open' },
  { id: '3', title: 'Изучить ТЗ и задать уточняющие вопросы', deal: 'Жилой квартал', priority: 'medium', assignee: 'Сидорова А.', status: 'progress' },
  { id: '4', title: 'Смета по экологическим изысканиям', deal: 'Логистический парк', priority: 'high', assignee: 'Иванов И.', status: 'progress' },
  { id: '5', title: 'Протокол разногласий', deal: 'ТЦ Меридиан', priority: 'medium', assignee: 'Петрова А.', status: 'review' },
  { id: '6', title: 'Договор по тендеру №4521', deal: 'Мост через реку', priority: 'critical', assignee: 'Сидорова А.', status: 'done' },
];

const columns: { key: Impulse['status']; title: string; color: string }[] = [
  { key: 'open', title: 'Открыт', color: 'border-sky-500/30' },
  { key: 'progress', title: 'В работе', color: 'border-amber-500/30' },
  { key: 'review', title: 'На проверке', color: 'border-violet-500/30' },
  { key: 'done', title: 'Закрыт', color: 'border-emerald-500/30' },
];

export const ImpulsesKanban = () => {
  const [impulses, setImpulses] = useState(initialImpulses);
  const [dragId, setDragId] = useState<string | null>(null);

  const moveTo = (id: string, status: Impulse['status']) => {
    setImpulses((prev) => prev.map((imp) => (imp.id === id ? { ...imp, status } : imp)));
  };

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
                    <Badge className={`text-[10px] px-1.5 py-0 border ${priorityMeta[imp.priority].color}`}>
                      {priorityMeta[imp.priority].label}
                    </Badge>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Icon name="User" size={11} />
                      {imp.assignee}
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-500">
                    <Icon name="Briefcase" size={10} />
                    {imp.deal}
                  </div>
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
