import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

const channels = [
  { icon: 'Mail', label: 'Почта', color: 'text-sky-400', count: 12 },
  { icon: 'Send', label: 'Telegram', color: 'text-cyan-400', count: 8 },
  { icon: 'MessageCircle', label: 'Max', color: 'text-blue-400', count: 5 },
];

const comments = [
  { author: 'Клиент', text: 'Когда будет готова смета по геологии?', tone: 'neutral', time: '10:14' },
  { author: 'Менеджер', text: 'Отправили предварительный расчёт, ждём согласования', tone: 'positive', time: '10:20' },
  { author: 'Клиент', text: 'Сроки снова сдвигаются, это уже третий раз', tone: 'negative', time: '11:02' },
];

const toneColor: Record<string, string> = {
  positive: 'border-emerald-500/40 bg-emerald-500/5',
  neutral: 'border-slate-600/40 bg-slate-800/40',
  negative: 'border-red-500/40 bg-red-500/5',
};

const toneIcon: Record<string, { icon: string; color: string }> = {
  positive: { icon: 'Smile', color: 'text-emerald-400' },
  neutral: { icon: 'Meh', color: 'text-slate-400' },
  negative: { icon: 'Frown', color: 'text-red-400' },
};

export const DealCardDemo = () => {
  const [tab, setTab] = useState<'comm' | 'analytics'>('comm');

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-slate-900/60 backdrop-blur-md overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold">ТЦ «Меридиан» — инженерные изыскания</h3>
            <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30">Стыковка</Badge>
          </div>
          <div className="text-xs text-slate-400">Заказчик: ООО «СтройИнвест» · Ответственный: А. Петрова</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs text-slate-400">Здоровье сделки</div>
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              Требует внимания
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-700/40">
        <button
          onClick={() => setTab('comm')}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === 'comm' ? 'text-amber-300 border-b-2 border-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Единый инбокс
        </button>
        <button
          onClick={() => setTab('analytics')}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === 'analytics' ? 'text-amber-300 border-b-2 border-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ИИ-анализ комментариев
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <AnimatePresence mode="wait">
          {tab === 'comm' ? (
            <motion.div key="comm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex gap-2 mb-4">
                {channels.map((c) => (
                  <div key={c.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/40 text-xs">
                    <Icon name={c.icon as any} size={13} className={c.color} />
                    <span className="text-slate-300">{c.label}</span>
                    <span className="text-slate-500">{c.count}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {comments.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`rounded-xl border p-3 ${toneColor[c.tone]}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-300">{c.author}</span>
                      <div className="flex items-center gap-2">
                        <Icon name={toneIcon[c.tone].icon as any} size={13} className={toneIcon[c.tone].color} />
                        <span className="text-[11px] text-slate-500">{c.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-200">{c.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5">
                <div className="flex items-center gap-2 mb-1.5 text-amber-300 text-sm font-medium">
                  <Icon name="Sparkles" size={15} />
                  Резюме от ИИ
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  Клиент трижды упомянул задержку сроков — рекомендуем предложить компенсирующие мероприятия
                  и зафиксировать новую дату в письменном виде.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-400 mb-2">Тональность переписки</div>
                  <div className="space-y-1.5">
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5"><span className="text-emerald-400">Позитив</span><span className="text-slate-400">42%</span></div>
                      <Progress value={42} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5"><span className="text-slate-400">Нейтрально</span><span className="text-slate-400">33%</span></div>
                      <Progress value={33} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5"><span className="text-red-400">Негатив</span><span className="text-slate-400">25%</span></div>
                      <Progress value={25} className="h-1.5" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-2">Прогноз ИИ</div>
                  <div className="rounded-lg bg-slate-800/50 border border-slate-700/40 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Вероятность закрытия</span>
                      <span className="text-emerald-400 font-semibold text-sm">68%</span>
                    </div>
                    <Progress value={68} className="h-1.5 mb-2" />
                    <div className="text-[11px] text-slate-400">Ожидаемая дата подписания: <span className="text-slate-200">через 6 дней</span></div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 p-3">
                <div className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                  <Icon name="ListChecks" size={14} className="text-amber-400" />
                  Авто-созданные «Импульсы» из комментариев
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Icon name="Zap" size={12} className="text-amber-400" />
                    Подготовить компенсирующие мероприятия по срокам
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Icon name="Zap" size={12} className="text-amber-400" />
                    Отправить обновлённый график клиенту
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DealCardDemo;
