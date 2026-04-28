import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import func2url from '../../../backend/func2url.json';

const API_URL = func2url['generate-kp'];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface KpStage {
  n: number;
  title: string;
  sum: number;
}

interface KpResult {
  what: string;
  fmt: string;
  qty: string;
}

interface KpData {
  client?: string;
  project?: string;
  stages?: KpStage[];
  results?: KpResult[];
  timeline?: string;
  notes?: string;
}

const NAVY = '#1e3a5f';
const GOLD = '#b8860b';

function formatMoney(n: number) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

function KPPreview({ kp }: { kp: KpData }) {
  const total = (kp.stages || []).reduce((s, st) => s + st.sum, 0);
  const vat = Math.round(total * 20 / 120);
  const exVat = total - vat;
  const p30 = Math.round(total * 0.3);
  const p70 = total - p30;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden text-sm font-sans">
      {/* Шапка */}
      <div className="px-6 py-4" style={{ background: NAVY }}>
        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Коммерческое предложение</p>
        <h2 className="text-white text-lg font-bold leading-tight">{kp.project || 'Проект'}</h2>
        {kp.client && <p className="text-cyan-300 text-xs mt-1">{kp.client}</p>}
      </div>

      <div className="px-6 py-4 space-y-4">
        {/* Этапы */}
        {(kp.stages || []).length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Состав работ</p>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1 text-gray-400 font-medium w-6">№</th>
                  <th className="text-left py-1 text-gray-400 font-medium">Наименование</th>
                  <th className="text-right py-1 text-gray-400 font-medium">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {kp.stages!.map((st) => (
                  <tr key={st.n} className="border-b border-gray-100">
                    <td className="py-1.5 text-gray-400">{st.n}</td>
                    <td className="py-1.5 text-gray-700">{st.title}</td>
                    <td className="py-1.5 text-right font-semibold" style={{ color: NAVY }}>{formatMoney(st.sum)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Итого */}
        {total > 0 && (
          <div className="rounded-xl p-3 space-y-1" style={{ background: '#f0f4f8' }}>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Без НДС</span><span>{formatMoney(exVat)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>НДС 20%</span><span>{formatMoney(vat)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-1 border-t border-gray-300">
              <span style={{ color: NAVY }}>Итого</span>
              <span style={{ color: NAVY }}>{formatMoney(total)}</span>
            </div>
          </div>
        )}

        {/* Оплата */}
        {total > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ background: '#f0f4f8' }}>
              <div className="w-10 h-10 rounded-full mx-auto mb-1.5 flex items-center justify-center text-white text-xs font-bold" style={{ background: NAVY }}>30%</div>
              <p className="text-xs font-semibold text-gray-700">Предоплата</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: NAVY }}>{formatMoney(p30)}</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: '#f0f4f8' }}>
              <div className="w-10 h-10 rounded-full mx-auto mb-1.5 flex items-center justify-center text-white text-xs font-bold" style={{ background: GOLD }}>70%</div>
              <p className="text-xs font-semibold text-gray-700">По факту</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: GOLD }}>{formatMoney(p70)}</p>
            </div>
          </div>
        )}

        {/* Результаты */}
        {(kp.results || []).length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Результаты</p>
            <ul className="space-y-1">
              {kp.results!.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="mt-0.5 text-green-500 flex-shrink-0">✓</span>
                  <span>{r.what} <span className="text-gray-400">{r.fmt}</span> — {r.qty}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Сроки и примечания */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {kp.timeline && (
            <div className="rounded-lg p-2.5" style={{ background: '#f0f4f8' }}>
              <p className="text-gray-400 mb-0.5">Срок</p>
              <p className="font-semibold text-gray-700">{kp.timeline}</p>
            </div>
          )}
          {kp.notes && (
            <div className="rounded-lg p-2.5" style={{ background: '#f0f4f8' }}>
              <p className="text-gray-400 mb-0.5">Примечания</p>
              <p className="text-gray-600">{kp.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AIKPGenerator() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [kpData, setKpData] = useState<KpData | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deepseek_chat',
          messages: newMessages,
        }),
      });
      const data = await resp.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message || '...' }]);
      if (data.kp_json) {
        setKpData(data.kp_json);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ошибка соединения. Попробуйте ещё раз.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) sendMessage();
  };

  const clearChat = () => {
    setMessages([]);
    setKpData(null);
    setInput('');
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)] min-h-[600px]">
      {/* Левая панель — чат */}
      <div className="flex flex-col flex-1 bg-slate-900/60 border border-cyan-500/20 rounded-2xl overflow-hidden">
        {/* Хедер чата */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-cyan-500/20 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold text-cyan-300">DeepSeek R1</span>
            <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">AI-КП</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={clearChat} className="text-gray-400 hover:text-white">
            <Icon name="Trash2" size={14} className="mr-1" />
            Очистить
          </Button>
        </div>

        {/* Сообщения */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-gray-500">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center border border-cyan-500/20">
                <Icon name="MessageSquare" size={28} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Опишите проект</p>
                <p className="text-xs text-gray-600 mt-1">DeepSeek задаст уточняющие вопросы<br />и сформирует структуру КП</p>
              </div>
              <div className="grid grid-cols-1 gap-2 mt-2 w-full max-w-sm">
                {[
                  'Нужно КП на транспортное обследование перекрёстка',
                  'КП на проектирование склада 5000 м²',
                  'Инженерные изыскания для жилого дома',
                ].map((hint) => (
                  <button
                    key={hint}
                    onClick={() => setInput(hint)}
                    className="text-left text-xs px-3 py-2 rounded-lg border border-cyan-500/20 text-cyan-400/70 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-br-sm'
                    : 'bg-slate-800 text-gray-200 border border-slate-700 rounded-bl-sm'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-2 text-cyan-400 text-xs font-medium">
                    <Icon name="Sparkles" size={12} />
                    DeepSeek R1
                  </div>
                )}
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs mb-2">
                  <Icon name="Sparkles" size={12} />
                  DeepSeek R1
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Инпут */}
        <div className="px-4 py-3 border-t border-cyan-500/20 bg-slate-900/80">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Опишите проект или задайте вопрос... (Ctrl+Enter — отправить)"
              className="flex-1 resize-none bg-slate-800/80 border-slate-700 text-gray-200 placeholder:text-gray-600 focus:border-cyan-500/50 min-h-[60px] max-h-[120px]"
              rows={2}
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white h-[60px] px-4"
            >
              <Icon name={loading ? 'Loader2' : 'Send'} size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-1.5">Ctrl+Enter для отправки</p>
        </div>
      </div>

      {/* Правая панель — превью КП */}
      <div className="w-[380px] flex-shrink-0 overflow-y-auto">
        {kpData ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                <Icon name="CheckCircle" size={12} className="mr-1" />
                КП сформировано
              </Badge>
            </div>
            <KPPreview kp={kpData} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 p-8">
            <Icon name="FileText" size={40} className="text-slate-600" />
            <div>
              <p className="text-sm font-medium text-slate-500">Превью КП</p>
              <p className="text-xs text-slate-600 mt-1">Появится автоматически<br />когда DeepSeek соберёт данные</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
