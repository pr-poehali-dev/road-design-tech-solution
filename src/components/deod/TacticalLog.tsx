import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { crewApi, taskApi, CrewMember, CrewTask, PRIORITY_LABELS, STATUS_LABELS } from '@/lib/crewApi';
import { useCrewAuth } from './CrewAuthContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

const STATUS_COLUMNS: { key: string; label: string; icon: string; color: string }[] = [
  { key: 'planned', label: 'На старте', icon: 'Rocket', color: '#66FCF1' },
  { key: 'in_progress', label: 'В зоне поражения', icon: 'Crosshair', color: '#FF6600' },
  { key: 'review', label: 'На подтверждении', icon: 'ShieldQuestion', color: '#45A29E' },
  { key: 'done', label: 'Миссия выполнена', icon: 'CheckCircle2', color: '#4ADE80' },
  { key: 'failed', label: 'Провалено', icon: 'XCircle', color: '#FF4D4D' },
];

const PRIORITY_COLORS: Record<string, string> = {
  critical: '#FF4D4D',
  high: '#FF6600',
  medium: '#66FCF1',
  low: '#8B98A5',
};

const TacticalLog = ({ open, onClose }: Props) => {
  const { me } = useCrewAuth();
  const [tasks, setTasks] = useState<CrewTask[]>([]);
  const [members, setMembers] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<CrewTask | null>(null);
  const [filterMine, setFilterMine] = useState(false);

  const load = useCallback(async () => {
    if (!me) return;
    setLoading(true);
    try {
      const res = await taskApi.list(filterMine ? me.id : undefined);
      setTasks(res.tasks);
    } finally {
      setLoading(false);
    }
  }, [me, filterMine]);

  useEffect(() => {
    if (open && me) {
      load();
      crewApi.list().then((r) => setMembers(r.members)).catch(() => {});
    }
  }, [open, me, load]);

  if (!open || !me) return null;

  const moveTask = async (task: CrewTask, status: string) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status, status_label: STATUS_LABELS[status] } : t)));
    await taskApi.update(task.id, { status });
    load();
  };

  const grouped = STATUS_COLUMNS.map((col) => ({
    ...col,
    tasks: tasks.filter((t) => t.status === col.key),
  }));

  const criticalCount = tasks.filter((t) => t.priority === 'critical' && t.status !== 'done' && t.status !== 'failed').length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-[#0B0C10]/95 backdrop-blur-xl overflow-y-auto"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
          {/* header */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <div className="w-11 h-11 rounded-xl bg-[#45A29E]/15 border border-[#45A29E]/40 flex items-center justify-center">
              <Icon name="ClipboardList" size={22} className="text-[#66FCF1]" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white">Бортовой журнал</h1>
              <p className="text-[11px] text-[#6B7684] uppercase tracking-widest">тактическая карта манёвров станции</p>
            </div>
            {criticalCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FF4D4D]/15 border border-[#FF4D4D]/40 text-[#FF9B9B] text-xs font-bold">
                <Icon name="AlertTriangle" size={13} /> {criticalCount} критических
              </div>
            )}
            <button onClick={onClose} className="ml-auto text-[#6B7684] hover:text-white p-2"><Icon name="X" size={22} /></button>
          </div>

          {/* actions */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <button onClick={() => setFilterMine(false)}
              className={`text-[12px] px-3 py-1.5 rounded-lg border ${!filterMine ? 'bg-[#45A29E] text-[#0B0C10] border-[#45A29E] font-bold' : 'border-[#45A29E]/30 text-[#8B98A5] hover:text-white'}`}>
              Все манёвры
            </button>
            <button onClick={() => setFilterMine(true)}
              className={`text-[12px] px-3 py-1.5 rounded-lg border ${filterMine ? 'bg-[#45A29E] text-[#0B0C10] border-[#45A29E] font-bold' : 'border-[#45A29E]/30 text-[#8B98A5] hover:text-white'}`}>
              Мои манёвры
            </button>
            <div className="flex-1" />
            <button onClick={() => setCreateOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FF6600] text-[#0B0C10] font-bold text-sm hover:opacity-90">
              <Icon name="Plus" size={15} /> Новый манёвр
            </button>
          </div>

          {loading ? (
            <div className="py-16 text-center"><Icon name="Loader2" size={28} className="animate-spin text-[#66FCF1] mx-auto" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
              {grouped.map((col) => (
                <div key={col.key} className="rounded-xl border border-[#45A29E]/20 bg-[#1F2833]/30 flex flex-col min-h-[200px]">
                  <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-[#45A29E]/15">
                    <Icon name={col.icon as any} size={14} style={{ color: col.color }} />
                    <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: col.color }}>{col.label}</span>
                    <span className="ml-auto text-[10px] text-[#6B7684] font-mono">{col.tasks.length}</span>
                  </div>
                  <div className="flex-1 p-2 space-y-2">
                    {col.tasks.length === 0 && (
                      <div className="text-center text-[10px] text-[#6B7684] py-6">Пусто</div>
                    )}
                    {col.tasks.map((t, i) => (
                      <motion.button
                        key={t.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        onClick={() => setActiveTask(t)}
                        className="w-full text-left rounded-lg border border-[#45A29E]/20 bg-[#0B0C10]/60 p-2.5 hover:border-[#66FCF1]/50 transition-colors"
                      >
                        <div className="flex items-start gap-1.5 mb-1.5">
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: PRIORITY_COLORS[t.priority] }} />
                          <span className="text-[12px] text-white font-medium leading-snug line-clamp-2">{t.title}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#8B98A5]">
                          <span className="truncate">{t.assignee_callsign || 'не назначен'}</span>
                          {t.deadline && <span className="shrink-0 font-mono">{new Date(t.deadline).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}</span>}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {createOpen && (
        <TaskCreateModal
          members={members}
          onClose={() => setCreateOpen(false)}
          onCreated={() => { setCreateOpen(false); load(); }}
        />
      )}

      {activeTask && (
        <TaskDetailModal
          task={activeTask}
          members={members}
          onClose={() => setActiveTask(null)}
          onMove={(status) => { moveTask(activeTask, status); setActiveTask({ ...activeTask, status, status_label: STATUS_LABELS[status] }); }}
          onUpdated={(t) => { setActiveTask(t); load(); }}
          onDeleted={() => { setActiveTask(null); load(); }}
        />
      )}
    </AnimatePresence>
  );
};

const TaskCreateModal = ({ members, onClose, onCreated }: { members: CrewMember[]; onClose: () => void; onCreated: () => void }) => {
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assigneeId, setAssigneeId] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  const create = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await taskApi.create({
        title: title.trim(),
        comment: comment.trim() || undefined,
        deadline: deadline || null,
        priority,
        assignee_id: assigneeId || null,
      });
      onCreated();
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[76] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#45A29E]/40 bg-[#0B0C10]/95 backdrop-blur-xl p-5 shadow-[0_0_50px_rgba(69,162,158,0.2)]"
      >
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Rocket" size={20} className="text-[#FF6600]" />
          <h2 className="font-heading font-bold text-lg text-white">Новый манёвр</h2>
          <button onClick={onClose} className="ml-auto text-[#6B7684] hover:text-white"><Icon name="X" size={18} /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-[#8B98A5] mb-1 block">Название манёвра</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Что нужно сделать?"
              className="w-full bg-[#1F2833]/70 border border-[#45A29E]/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#6B7684] focus:outline-none focus:border-[#66FCF1]/60" />
          </div>
          <div>
            <label className="text-[11px] text-[#8B98A5] mb-1 block">Бортовой журнал манёвра (комментарий)</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Детали, контекст, ссылки..."
              className="w-full bg-[#1F2833]/70 border border-[#45A29E]/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#6B7684] focus:outline-none focus:border-[#66FCF1]/60 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-[#8B98A5] mb-1 block">Точка невозврата</label>
              <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-[#1F2833]/70 border border-[#45A29E]/30 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-[#66FCF1]/60" />
            </div>
            <div>
              <label className="text-[11px] text-[#8B98A5] mb-1 block">Экипаж, ответственный за сектор</label>
              <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-[#1F2833]/70 border border-[#45A29E]/30 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-[#66FCF1]/60">
                <option value="">Не назначен</option>
                {members.map((m) => <option key={m.id} value={m.id}>{m.callsign}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[11px] text-[#8B98A5] mb-1 block">Уровень угрозы / важность для миссии</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(PRIORITY_LABELS).map(([k, v]) => (
                <button key={k} onClick={() => setPriority(k)}
                  className={`text-[11px] px-2.5 py-1.5 rounded-md border ${priority === k ? 'bg-[#45A29E] text-[#0B0C10] border-[#45A29E] font-bold' : 'border-[#45A29E]/30 text-[#8B98A5] hover:text-white'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <button onClick={create} disabled={saving || !title.trim()}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#45A29E] to-[#66FCF1] text-[#0B0C10] font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="Rocket" size={16} />}
            Запустить манёвр
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TaskDetailModal = ({
  task, members, onClose, onMove, onUpdated, onDeleted,
}: {
  task: CrewTask;
  members: CrewMember[];
  onClose: () => void;
  onMove: (status: string) => void;
  onUpdated: (t: CrewTask) => void;
  onDeleted: () => void;
}) => {
  const { me } = useCrewAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const canManage = !!me?.is_admin || task.created_by === me?.id;

  const runAi = async () => {
    setAnalyzing(true);
    setAiError('');
    try {
      const res = await taskApi.aiAnalyze(task.id);
      onUpdated({ ...task, ai_analysis: res.ai_analysis });
    } catch (e: any) {
      setAiError(e?.message || 'ИИ-советник временно недоступен');
    } finally {
      setAnalyzing(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await taskApi.remove(task.id);
      onDeleted();
    } finally {
      setDeleting(false);
    }
  };

  const reassign = async (assigneeId: string) => {
    const id = assigneeId ? Number(assigneeId) : null;
    const found = members.find((m) => m.id === id);
    onUpdated({ ...task, assignee_id: id, assignee_callsign: found?.callsign || null });
    await taskApi.update(task.id, { assignee_id: id });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[76] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#45A29E]/40 bg-[#0B0C10]/95 backdrop-blur-xl p-5 shadow-[0_0_50px_rgba(69,162,158,0.2)]"
      >
        <div className="flex items-start gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: PRIORITY_COLORS[task.priority] }} />
          <div className="flex-1 min-w-0">
            <h2 className="font-heading font-bold text-lg text-white leading-snug">{task.title}</h2>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-[#8B98A5] flex-wrap">
              <span style={{ color: PRIORITY_COLORS[task.priority] }} className="font-bold">{task.priority_label}</span>
              {task.creator_callsign && <><span>·</span><span>от {task.creator_callsign}</span></>}
            </div>
          </div>
          <button onClick={onClose} className="text-[#6B7684] hover:text-white shrink-0"><Icon name="X" size={18} /></button>
        </div>

        <div className="mb-3">
          <label className="text-[10px] uppercase tracking-widest text-[#6B7684] mb-1 block">Экипаж, ответственный за сектор</label>
          <select value={task.assignee_id ?? ''} onChange={(e) => reassign(e.target.value)}
            className="w-full bg-[#1F2833]/70 border border-[#45A29E]/30 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-[#66FCF1]/60">
            <option value="">Не назначен</option>
            {members.map((m) => <option key={m.id} value={m.id}>{m.callsign}</option>)}
          </select>
        </div>

        {task.deadline && (
          <div className="flex items-center gap-1.5 text-[12px] text-[#FF9B9B] mb-3">
            <Icon name="Timer" size={14} /> Точка невозврата: {new Date(task.deadline).toLocaleString('ru-RU')}
          </div>
        )}

        {task.comment && (
          <div className="rounded-xl border border-[#45A29E]/20 bg-[#1F2833]/40 p-3 mb-3">
            <div className="text-[10px] uppercase tracking-widest text-[#6B7684] mb-1">Бортовой журнал манёвра</div>
            <div className="text-sm text-[#C5C6C7] whitespace-pre-wrap">{task.comment}</div>
          </div>
        )}

        {/* status switcher */}
        <div className="mb-4">
          <div className="text-[10px] uppercase tracking-widest text-[#6B7684] mb-1.5">Манёвр выполнен / провален / статус</div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_COLUMNS.map((s) => (
              <button key={s.key} onClick={() => onMove(s.key)}
                className={`text-[11px] px-2.5 py-1.5 rounded-md border flex items-center gap-1 ${task.status === s.key ? 'font-bold' : 'border-[#45A29E]/30 text-[#8B98A5] hover:text-white'}`}
                style={task.status === s.key ? { backgroundColor: s.color, borderColor: s.color, color: '#0B0C10' } : undefined}>
                <Icon name={s.icon as any} size={12} /> {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI advisor */}
        <div className="rounded-xl border border-[#FF6600]/25 bg-[#FF6600]/5 p-3 mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Icon name="Sparkles" size={14} className="text-[#FF6600]" />
            <span className="text-[11px] uppercase tracking-widest text-[#FF6600] font-bold">ИИ-советник</span>
            <button onClick={runAi} disabled={analyzing}
              className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF6600] text-[#0B0C10] font-bold text-[11px] hover:opacity-90 disabled:opacity-50">
              {analyzing ? <Icon name="Loader2" size={12} className="animate-spin" /> : <Icon name="Sparkles" size={12} />}
              {task.ai_analysis ? 'Обновить анализ' : 'Анализ манёвра'}
            </button>
          </div>
          {aiError && <p className="text-[11px] text-[#FF9B9B]">{aiError}</p>}
          {task.ai_analysis ? (
            <p className="text-[12px] text-[#C5C6C7] whitespace-pre-wrap leading-relaxed">{task.ai_analysis}</p>
          ) : !aiError && (
            <p className="text-[11px] text-[#8B98A5]">Нажмите «Анализ манёвра» — ИИ оценит сложность, риски и подскажет ноу-хау.</p>
          )}
        </div>

        {canManage && (
          <button onClick={remove} disabled={deleting}
            className="w-full py-2 rounded-lg border border-[#FF4D4D]/30 text-[#FF9B9B] text-sm hover:bg-[#FF4D4D]/10 disabled:opacity-50 flex items-center justify-center gap-2">
            {deleting ? <Icon name="Loader2" size={14} className="animate-spin" /> : <Icon name="Trash2" size={14} />}
            Отменить манёвр
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TacticalLog;