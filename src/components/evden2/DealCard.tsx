import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { evdenApi, Deal, Impulse, Comment, Message, PHASE_LABELS } from '@/lib/evden2Api';

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

const healthMeta: Record<string, { label: string; dot: string; text: string }> = {
  green: { label: 'Всё хорошо', dot: 'bg-emerald-400 shadow-emerald-500/60', text: 'text-emerald-400' },
  yellow: { label: 'Требует внимания', dot: 'bg-amber-400 shadow-amber-500/60', text: 'text-amber-400' },
  red: { label: 'Критично', dot: 'bg-red-400 shadow-red-500/60', text: 'text-red-400' },
};

export const DealCard = ({ dealId, onChanged }: { dealId: number; onChanged?: () => void }) => {
  const { toast } = useToast();
  const [tab, setTab] = useState<'comm' | 'analytics' | 'impulses'>('comm');
  const [deal, setDeal] = useState<Deal | null>(null);
  const [impulses, setImpulses] = useState<Impulse[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await evdenApi.getDeal(dealId);
      setDeal(res.deal);
      setImpulses(res.impulses);
      setComments(res.comments);
      setMessages(res.messages);
    } catch (e: any) {
      toast({ title: 'Ошибка загрузки сделки', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [dealId, toast]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  const submitComment = async () => {
    if (!commentText.trim()) return;
    setSendingComment(true);
    try {
      const res = await evdenApi.createComment(dealId, commentText.trim());
      setComments((prev) => [res.comment, ...prev]);
      setCommentText('');
      if (res.created_impulses?.length) {
        setImpulses((prev) => [...res.created_impulses, ...prev]);
        toast({ title: `ИИ создал ${res.created_impulses.length} импульс(а) из комментария` });
      }
      if (res.ai_analysis?.risk_detected) {
        setDeal((d) => (d ? { ...d, health: 'yellow' } : d));
        toast({ title: 'ИИ обнаружил риск в комментарии', description: res.ai_analysis.summary, variant: 'destructive' });
      }
      onChanged?.();
    } catch (e: any) {
      toast({ title: 'Не удалось добавить комментарий', description: e.message, variant: 'destructive' });
    } finally {
      setSendingComment(false);
    }
  };

  const submitMessage = async () => {
    if (!messageText.trim()) return;
    setSendingMessage(true);
    try {
      const res = await evdenApi.sendTelegramMessage(dealId, messageText.trim());
      setMessages((prev) => [...prev, res.message]);
      setMessageText('');
      toast({ title: 'Сообщение отправлено в Telegram' });
    } catch (e: any) {
      toast({ title: 'Не удалось отправить', description: e.message, variant: 'destructive' });
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading || !deal) {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-slate-900/60 p-10 text-center text-slate-400">
        <Icon name="Loader2" size={28} className="animate-spin mx-auto mb-2 text-amber-400" />
        Загрузка сделки...
      </div>
    );
  }

  const health = healthMeta[deal.health] || healthMeta.green;
  const toneCounts = comments.reduce(
    (acc, c) => {
      acc[c.tone || 'neutral'] = (acc[c.tone || 'neutral'] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const totalTone = comments.length || 1;

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-slate-900/60 backdrop-blur-md overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-white font-semibold">{deal.company_name}</h3>
            <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30">
              {PHASE_LABELS[deal.phase]?.title || deal.phase}
            </Badge>
            {deal.source === 'bidzaar' && (
              <Badge className="bg-sky-500/15 text-sky-300 border-sky-500/30">
                <Icon name="Gavel" size={11} className="mr-1" />
                BIDZAAR
              </Badge>
            )}
          </div>
          <div className="text-xs text-slate-400">
            {deal.contact_person || 'Контакт не указан'} · {deal.work_type || 'Тип работ не указан'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Здоровье сделки</div>
          <div className={`flex items-center gap-1.5 font-semibold text-sm ${health.text}`}>
            <span className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${health.dot}`} />
            {health.label}
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
          onClick={() => setTab('impulses')}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === 'impulses' ? 'text-amber-300 border-b-2 border-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Импульсы ({impulses.filter((i) => i.status !== 'done').length})
        </button>
        <button
          onClick={() => setTab('analytics')}
          className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === 'analytics' ? 'text-amber-300 border-b-2 border-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ИИ-анализ
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <AnimatePresence mode="wait">
          {tab === 'comm' && (
            <motion.div key="comm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex gap-2 mb-3 text-xs">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/40">
                  <Icon name="Send" size={13} className={deal.telegram_chat_id ? 'text-cyan-400' : 'text-slate-500'} />
                  <span className="text-slate-300">Telegram</span>
                  <span className="text-slate-500">{messages.length}</span>
                  {!deal.telegram_chat_id && <span className="text-slate-600">· не подключён</span>}
                </div>
              </div>

              <div className="space-y-2 mb-3 max-h-72 overflow-y-auto pr-1">
                {messages.length === 0 && comments.length === 0 && (
                  <div className="text-center text-xs text-slate-500 py-6 border border-dashed border-slate-700/40 rounded-xl">
                    Пока нет ни сообщений, ни комментариев
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    key={`msg-${m.id}`}
                    className={`rounded-xl border p-3 ${m.direction === 'in' ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-slate-700/40 bg-slate-800/40'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
                        <Icon name="Send" size={11} className="text-cyan-400" />
                        {m.direction === 'in' ? m.sender_name : 'Вы (Telegram)'}
                      </span>
                      <span className="text-[11px] text-slate-500">{new Date(m.created_at).toLocaleString('ru-RU')}</span>
                    </div>
                    <p className="text-sm text-slate-200">{m.text}</p>
                  </div>
                ))}
                {comments.map((c) => (
                  <div key={`c-${c.id}`} className={`rounded-xl border p-3 ${toneColor[c.tone] || toneColor.neutral}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-300">{c.author}</span>
                      <div className="flex items-center gap-2">
                        <Icon name={(toneIcon[c.tone] || toneIcon.neutral).icon as any} size={13} className={(toneIcon[c.tone] || toneIcon.neutral).color} />
                        <span className="text-[11px] text-slate-500">{new Date(c.created_at).toLocaleString('ru-RU')}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-200">{c.text}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                    placeholder="Добавить комментарий (ИИ проанализирует тон)..."
                    className="bg-slate-800/60 border-slate-700/50 text-sm"
                  />
                  <Button onClick={submitComment} disabled={sendingComment} size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-900 shrink-0">
                    {sendingComment ? <Icon name="Loader2" size={14} className="animate-spin" /> : <Icon name="Send" size={14} />}
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitMessage()}
                    placeholder={deal.telegram_chat_id ? 'Написать клиенту в Telegram...' : 'Клиент ещё не писал боту в Telegram'}
                    disabled={!deal.telegram_chat_id}
                    className="bg-slate-800/60 border-slate-700/50 text-sm"
                  />
                  <Button
                    onClick={submitMessage}
                    disabled={sendingMessage || !deal.telegram_chat_id}
                    size="sm"
                    variant="outline"
                    className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 shrink-0"
                  >
                    {sendingMessage ? <Icon name="Loader2" size={14} className="animate-spin" /> : <Icon name="Send" size={14} />}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'impulses' && (
            <motion.div key="impulses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2 max-h-96 overflow-y-auto">
              {impulses.length === 0 && (
                <div className="text-center text-xs text-slate-500 py-6 border border-dashed border-slate-700/40 rounded-xl">
                  У этой сделки пока нет импульсов
                </div>
              )}
              {impulses.map((imp) => (
                <div key={imp.id} className="rounded-xl bg-slate-800/50 border border-slate-700/40 p-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm text-slate-100">{imp.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <Icon name="User" size={11} />
                      {imp.assignee}
                      {imp.source !== 'manual' && (
                        <Badge className="text-[9px] px-1 py-0 bg-amber-500/10 text-amber-300 border-amber-500/20">
                          {imp.source === 'ai_comment' ? 'из комментария' : imp.source === 'voice' ? 'голосом' : imp.source}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge className={imp.status === 'done' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-slate-700/40 text-slate-300 border-slate-600/40'}>
                    {imp.status === 'done' ? 'Закрыт' : imp.status === 'open' ? 'Открыт' : imp.status}
                  </Badge>
                </div>
              ))}
            </motion.div>
          )}

          {tab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-400 mb-2">Тональность комментариев ({comments.length})</div>
                  <div className="space-y-1.5">
                    {['positive', 'neutral', 'negative'].map((t) => (
                      <div key={t}>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className={toneIcon[t].color}>{t === 'positive' ? 'Позитив' : t === 'negative' ? 'Негатив' : 'Нейтрально'}</span>
                          <span className="text-slate-400">{Math.round(((toneCounts[t] || 0) / totalTone) * 100)}%</span>
                        </div>
                        <Progress value={((toneCounts[t] || 0) / totalTone) * 100} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-2">Прогноз</div>
                  <div className="rounded-lg bg-slate-800/50 border border-slate-700/40 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Вероятность закрытия</span>
                      <span className="text-emerald-400 font-semibold text-sm">{deal.probability}%</span>
                    </div>
                    <Progress value={deal.probability} className="h-1.5 mb-2" />
                    <div className="text-[11px] text-slate-400">
                      Бюджет: <span className="text-slate-200">{(deal.budget / 1_000_000).toFixed(1)}M ₽</span>
                    </div>
                  </div>
                </div>
              </div>

              {comments.filter((c) => c.ai_summary).length > 0 && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5">
                  <div className="flex items-center gap-2 mb-1.5 text-amber-300 text-sm font-medium">
                    <Icon name="Sparkles" size={15} />
                    Последние резюме от ИИ
                  </div>
                  <ul className="space-y-1.5">
                    {comments
                      .filter((c) => c.ai_summary)
                      .slice(0, 3)
                      .map((c) => (
                        <li key={c.id} className="text-sm text-slate-200 leading-relaxed">
                          {c.ai_summary}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DealCard;
