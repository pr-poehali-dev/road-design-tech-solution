import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import func2url from '../../../backend/func2url.json';

const API_URL = func2url['generate-kp'];

const LOGO_KI = 'https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png';
const STAMP_KI = 'https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png';

interface Company {
  id: string;
  short: string;
  full: string;
  color: string;
  vat: string;
  details: string;
  logo?: string;
  stamp?: string;
}

const COMPANIES: Company[] = [
  {
    id: 'kapstroy',
    short: 'Капстрой-Инжиниринг',
    full: 'ООО «КАПСТРОЙ-ИНЖИНИРИНГ»',
    color: 'border-red-500 bg-red-500/10 text-red-300',
    vat: 'НДС 22%',
    logo: LOGO_KI,
    stamp: STAMP_KI,
    details: `Исполнитель: ООО «КАПСТРОЙ-ИНЖИНИРИНГ»
ИНН: 7814795454 | КПП: 781401001 | ОГРН: 1217800122649
Адрес: 197341, г. Санкт-Петербург, Фермское шоссе, д. 12, литер Ж, пом. 310-Н к3
Генеральный директор: Шумов Иван Викторович
НДС: 22% (включается в стоимость)
Условия оплаты: 50% предоплата, 50% по результату`,
  },
  {
    id: 'sppi',
    short: 'СППИ',
    full: 'ООО «СППИ»',
    color: 'border-blue-500 bg-blue-500/10 text-blue-300',
    vat: 'УСН, без НДС',
    details: `Исполнитель: ООО «СППИ» (Общество с ограниченной ответственностью «СППИ»)
ИНН: 7817120160 | КПП: 781701001 | ОГРН: 1227800038707
Адрес: 190005, г. Санкт-Петербург, наб. реки Фонтанки, д. 136, лит. А, пом. 1-Н, офис 4, р.м. 6
Генеральный директор: Демидов Дмитрий Николаевич (на основании Устава)
Банк: ООО «Банк Точка», БИК 044525104
Р/с: 40702810101500123505 | К/с: 30101810745374525104
Коммерческий директор: Зленко Денис, тел.: +7 911 530-20-20
Email: info@sppi.ooo
ОКВЭД: 71.11 (Деятельность в области архитектуры)
Налогообложение: УСН — НДС не облагается, цены указываются без НДС`,
  },
  {
    id: 'ctesc',
    short: 'ЦТЭ и СК',
    full: 'ООО «Центр Технической экспертизы и строительного контроля»',
    color: 'border-emerald-500 bg-emerald-500/10 text-emerald-300',
    vat: 'НДС 5%',
    details: `Исполнитель: ООО «Центр Технической экспертизы и строительного контроля»
ИНН: 4703175805 | КПП: 781401001
Адрес: 197341, г. Санкт-Петербург, Фермское шоссе, д. 12, литер Ж, пом. 307-Н
НДС: 5% (включается в стоимость)`,
  },
];

const LS_COMPANY = 'aikp_company';

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

interface RoadmapTask { code: string; title: string; duration: string; responsible?: string; items?: string[]; milestone?: boolean; }
interface RoadmapPhase { code: string; title: string; duration: string; responsible?: string; tasks: RoadmapTask[]; color?: string; }
interface RoadmapData {
  title?: string;
  client?: string;
  phases?: RoadmapPhase[];
  milestones?: { code: string; title: string; day: string }[];
  notes?: string;
}

interface AttachedFile {
  name: string;
  type: string;
  size: number;
  b64: string;         // только для изображений
  text?: string;       // извлечённый текст (для PDF/Word/Excel/CSV)
  parsed: boolean;     // уже обработан на backend
  parsing?: boolean;   // идёт парсинг
  error?: boolean;
}

const NAVY = '#1e3a5f';
const GOLD = '#b8860b';

function formatMoney(n: number) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' Б';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
  return (bytes / 1024 / 1024).toFixed(1) + ' МБ';
}

function fileIcon(type: string) {
  if (type.includes('pdf')) return 'FileText';
  if (type.includes('word') || type.includes('document')) return 'FileType2';
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return 'Table2';
  if (type.includes('image')) return 'Image';
  return 'Paperclip';
}

function fileColor(type: string) {
  if (type.includes('pdf')) return 'text-red-400';
  if (type.includes('word') || type.includes('document')) return 'text-blue-400';
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return 'text-green-400';
  if (type.includes('image')) return 'text-purple-400';
  return 'text-gray-400';
}

function KPPreview({ kp, company, printRef }: { kp: KpData; company: Company; printRef: React.RefObject<HTMLDivElement> }) {
  const vatRate = company.id === 'kapstroy' ? 22 : company.id === 'ctesc' ? 5 : 0;
  const total = (kp.stages || []).reduce((s, st) => s + st.sum, 0);
  const vatAmount = vatRate > 0 ? Math.round(total * vatRate / (100 + vatRate)) : 0;
  const exVat = total - vatAmount;
  const p30 = Math.round(total * 0.30);
  const p30b = Math.round(total * 0.30);
  const p40 = total - p30 - p30b;
  const today = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });

  const directorLine = company.details.split('\n').find(l => l.toLowerCase().includes('директор') || l.toLowerCase().includes('генеральный'));
  const innLine = company.details.split('\n').find(l => l.includes('ИНН'));

  return (
    <div ref={printRef} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden text-sm font-sans">
      {/* Шапка с красной полосой */}
      <div className="flex">
        <div className="w-1.5 shrink-0" style={{ background: '#c0392b' }} />
        <div className="flex-1 px-6 py-5" style={{ background: NAVY }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {company.logo
                ? <img src={company.logo} alt={company.short} className="h-8 object-contain mb-3" style={{ filter: 'brightness(0) invert(1)' }} />
                : <p className="text-white font-black text-base mb-3">{company.short}</p>
              }
              <div className="inline-block text-[9px] font-bold uppercase tracking-[0.15em] text-white/50 border border-white/20 px-2 py-0.5 rounded mb-2">
                Коммерческое предложение
              </div>
              <h2 className="text-white text-lg font-black leading-snug mb-1">{kp.project || 'Проект'}</h2>
              {kp.client && (
                <p className="text-cyan-300 text-xs">Заказчик: <span className="font-semibold">{kp.client}</span></p>
              )}
            </div>
            <div className="text-right shrink-0">
              <div className="text-white/50 text-[9px] uppercase tracking-wider mb-0.5">Дата</div>
              <div className="text-white text-xs font-semibold">{today}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Стороны */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-1.5">Исполнитель</p>
            <p className="font-black text-gray-800 text-xs leading-snug">{company.full}</p>
            {innLine && <p className="text-[10px] text-gray-500 mt-1">{innLine}</p>}
            {vatRate === 0 && <p className="text-[10px] text-green-600 font-semibold mt-0.5">УСН — без НДС</p>}
            {vatRate > 0 && <p className="text-[10px] text-blue-600 font-semibold mt-0.5">НДС {vatRate}%</p>}
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-1.5">Заказчик</p>
            <p className="font-black text-gray-800 text-xs">{kp.client || 'Заказчик'}</p>
            <p className="text-[10px] text-gray-500 mt-1">Основание: Технического задания</p>
          </div>
        </div>

        {/* Состав работ */}
        {(kp.stages || []).length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-0.5 bg-red-500 rounded" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">Состав работ</p>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <div className="grid text-[9px] font-bold uppercase tracking-wider text-white bg-gray-700 px-3 py-2" style={{ gridTemplateColumns: '32px 1fr 100px' }}>
                <div>№</div><div>Наименование</div><div className="text-right">Сумма, ₽</div>
              </div>
              {kp.stages!.map((st, i) => (
                <div key={st.n} className={`grid px-3 py-2 border-b border-gray-100 items-start ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`} style={{ gridTemplateColumns: '32px 1fr 100px' }}>
                  <span className="text-xs text-gray-400 font-bold">{st.n}</span>
                  <span className="text-xs text-gray-700 pr-2">{st.title}</span>
                  <span className="text-xs font-bold text-right tabular-nums" style={{ color: NAVY }}>{formatMoney(st.sum)}</span>
                </div>
              ))}
              <div className="grid px-3 py-2.5 items-center" style={{ gridTemplateColumns: '32px 1fr 100px', background: NAVY }}>
                <div />
                <span className="text-xs font-black text-white">ИТОГО{vatRate > 0 ? ` с НДС ${vatRate}%` : ' (без НДС)'}</span>
                <span className="text-sm font-black text-white text-right tabular-nums">{formatMoney(total)}</span>
              </div>
            </div>
            {vatRate > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 flex justify-between text-xs">
                  <span className="text-gray-400">Без НДС</span>
                  <span className="font-semibold text-gray-700 tabular-nums">{formatMoney(exVat)}</span>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 flex justify-between text-xs">
                  <span className="text-gray-400">НДС {vatRate}%</span>
                  <span className="font-semibold text-gray-700 tabular-nums">{formatMoney(vatAmount)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Оплата 30/30/40 */}
        {total > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-0.5 bg-red-500 rounded" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">Условия оплаты</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { pct: '30%', label: 'Аванс', sub: 'при подписании договора', amt: p30, color: NAVY },
                { pct: '30%', label: 'Промежуточный', sub: 'по факту выполнения 1-го этапа', amt: p30b, color: '#7c3aed' },
                { pct: '40%', label: 'Окончательный', sub: 'после сдачи всех работ', amt: p40, color: '#059669' },
              ].map(({ pct, label, sub, amt, color }) => (
                <div key={label} className="rounded-xl border border-gray-200 p-3 text-center">
                  <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-black" style={{ background: color }}>{pct}</div>
                  <p className="text-xs font-bold text-gray-700">{label}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5 leading-snug">{sub}</p>
                  <p className="text-sm font-black mt-1.5 tabular-nums" style={{ color }}>{formatMoney(amt)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Результаты */}
        {(kp.results || []).length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-0.5 bg-red-500 rounded" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">Результаты</p>
            </div>
            <div className="space-y-1.5">
              {kp.results!.map((r, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg bg-green-50 border border-green-100 px-3 py-2">
                  <span className="text-green-500 mt-0.5 text-sm shrink-0">✓</span>
                  <span className="text-xs text-gray-700">{r.what} <span className="text-gray-400 italic">{r.fmt}</span> — {r.qty}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Сроки / Примечания */}
        {(kp.timeline || kp.notes) && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            {kp.timeline && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                <p className="text-[9px] text-blue-400 uppercase tracking-wider mb-1">Срок выполнения</p>
                <p className="font-bold text-gray-700">{kp.timeline}</p>
              </div>
            )}
            {kp.notes && (
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                <p className="text-[9px] text-amber-500 uppercase tracking-wider mb-1">Примечания</p>
                <p className="text-gray-600 leading-snug">{kp.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Подпись и печать — всегда внизу */}
        <div className="border-t-2 border-gray-700 pt-5 mt-2">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">С уважением,</p>
              <p className="text-xs text-gray-600">{directorLine?.replace(/^(Генеральный\s)?[Дд]иректор[:,]?\s*/i, '') ? 'Генеральный директор' : 'Руководитель'}</p>
              <p className="text-sm font-black text-gray-900">{company.full}</p>
              {directorLine && <p className="text-xs text-gray-600">{directorLine}</p>}
              {innLine && <p className="text-[10px] text-gray-400">{innLine}</p>}
              <div className="mt-4 flex items-end gap-6">
                <div>
                  <div className="border-b border-gray-400 w-36 mb-1" />
                  <div className="text-[9px] text-gray-400">(подпись)</div>
                </div>
                <div>
                  <div className="border-b border-gray-400 w-28 mb-1" />
                  <div className="text-[9px] text-gray-400">(дата)</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 shrink-0">
              {company.logo && (
                <img src={company.logo} alt="Логотип" className="h-10 object-contain opacity-70" />
              )}
              {company.stamp && (
                <img src={company.stamp} alt="Печать" className="h-20 w-20 object-contain opacity-85" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PHASE_BG = ['#1e3a5f','#2563eb','#7c3aed','#0891b2','#d97706','#dc2626','#059669','#ea580c'];
const PHASE_LIGHT = ['#eff6ff','#eff6ff','#f5f3ff','#ecfeff','#fffbeb','#fff1f2','#f0fdf4','#fff7ed'];
const PHASE_BORDER = ['#bfdbfe','#bfdbfe','#ddd6fe','#a5f3fc','#fde68a','#fecaca','#bbf7d0','#fed7aa'];

function RoadmapPreview({ rm, company, printRef }: { rm: RoadmapData; company: Company; printRef: React.RefObject<HTMLDivElement> }) {
  const phases = rm.phases || [];
  const today = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
  const directorLine = company.details.split('\n').find(l => l.toLowerCase().includes('директор'));
  const innLine = company.details.split('\n').find(l => l.includes('ИНН'));

  // Вычисляем суммарную длину для Ганта
  const parseDays = (s: string) => { const m = s.match(/(\d+)/); return m ? parseInt(m[1]) : 10; };
  const totalDays = phases.reduce((s, ph) => s + parseDays(ph.duration), 0) || 1;
  let cumDays = 0;

  return (
    <div ref={printRef} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden text-sm font-sans">
      {/* Шапка */}
      <div className="flex">
        <div className="w-1.5 shrink-0" style={{ background: '#7c3aed' }} />
        <div className="flex-1 px-6 py-5" style={{ background: NAVY }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {company.logo
                ? <img src={company.logo} alt="" className="h-8 object-contain mb-3" style={{ filter: 'brightness(0) invert(1)' }} />
                : <p className="text-white font-black text-base mb-3">{company.short}</p>
              }
              <div className="inline-block text-[9px] font-bold uppercase tracking-[0.15em] text-white/50 border border-white/20 px-2 py-0.5 rounded mb-2">
                Дорожная карта проекта · ГОСТ 34.601-90
              </div>
              <h2 className="text-white text-lg font-black leading-snug mb-1">{rm.title || 'Дорожная карта'}</h2>
              {rm.client && <p className="text-cyan-300 text-xs">Заказчик: <span className="font-semibold">{rm.client}</span></p>}
            </div>
            <div className="text-right shrink-0">
              <div className="text-white/50 text-[9px] uppercase tracking-wider mb-0.5">Дата</div>
              <div className="text-white text-xs font-semibold">{today}</div>
              {company.stamp && <img src={company.stamp} alt="" className="h-16 w-16 object-contain opacity-85 mt-2 ml-auto" />}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">

        {/* Ключевые вехи */}
        {(rm.milestones || []).length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-0.5 rounded" style={{ background: '#d97706' }} />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">Ключевые вехи</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {rm.milestones!.map((m, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">{m.code}</div>
                  <div>
                    <div className="text-xs font-bold text-gray-800 leading-snug">{m.title}</div>
                    <div className="text-[10px] text-amber-600 font-medium">{m.day}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Диаграмма Ганта */}
        {phases.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-0.5 rounded bg-blue-500" />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">Диаграмма Ганта</p>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <div className="grid text-[9px] font-bold text-white uppercase tracking-wider px-3 py-2" style={{ gridTemplateColumns: '140px 1fr 80px', background: NAVY }}>
                <div>Этап</div><div className="text-center">График выполнения</div><div className="text-right">Срок</div>
              </div>
              {phases.map((ph, i) => {
                const days = parseDays(ph.duration);
                const startPct = (cumDays / totalDays) * 100;
                const widthPct = (days / totalDays) * 100;
                cumDays += days;
                return (
                  <div key={i} className={`grid items-center px-3 py-2 border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`} style={{ gridTemplateColumns: '140px 1fr 80px' }}>
                    <div className="flex items-center gap-1.5 pr-2">
                      <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: PHASE_BG[i % PHASE_BG.length] }} />
                      <span className="text-[10px] text-gray-700 font-medium truncate">{ph.code} {ph.title}</span>
                    </div>
                    <div className="relative h-5 bg-gray-100 rounded mx-2 overflow-hidden">
                      <div
                        className="absolute top-0 h-full rounded flex items-center justify-center"
                        style={{ left: `${startPct}%`, width: `${Math.max(widthPct, 8)}%`, background: PHASE_BG[i % PHASE_BG.length] }}
                      >
                        <span className="text-[8px] text-white font-bold px-1 truncate">{ph.code}</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-500 text-right">{ph.duration}</div>
                  </div>
                );
              })}
              {/* Временная шкала */}
              <div className="grid px-3 py-1.5 bg-gray-50 border-t border-gray-200" style={{ gridTemplateColumns: '140px 1fr 80px' }}>
                <div />
                <div className="mx-2 flex justify-between text-[8px] text-gray-400">
                  <span>Начало</span>
                  <span>{Math.round(totalDays / 4)} д.</span>
                  <span>{Math.round(totalDays / 2)} д.</span>
                  <span>{Math.round(totalDays * 3 / 4)} д.</span>
                  <span>{totalDays} д.</span>
                </div>
                <div />
              </div>
            </div>
          </div>
        )}

        {/* Этапы — детальные карточки */}
        {phases.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-0.5 rounded" style={{ background: '#7c3aed' }} />
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">Детальный план работ</p>
            </div>
            <div className="space-y-3">
              {phases.map((ph, i) => (
                <div key={i} className="rounded-xl overflow-hidden border" style={{ borderColor: PHASE_BORDER[i % PHASE_BORDER.length] }}>
                  {/* Заголовок этапа */}
                  <div className="px-4 py-3 flex items-center justify-between" style={{ background: PHASE_BG[i % PHASE_BG.length] }}>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-black text-white bg-white/20 px-2 py-0.5 rounded">{ph.code}</span>
                      <span className="text-sm font-bold text-white">{ph.title}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-white/80">{ph.duration}</span>
                      {ph.responsible && <div className="text-[9px] text-white/60">{ph.responsible}</div>}
                    </div>
                  </div>
                  {/* Задачи */}
                  {(ph.tasks || []).length > 0 && (
                    <div style={{ background: PHASE_LIGHT[i % PHASE_LIGHT.length] }}>
                      {ph.tasks.map((t, j) => (
                        <div key={j} className={`px-4 py-2.5 border-b ${t.milestone ? 'bg-amber-50 border-amber-100' : j % 2 === 0 ? 'bg-white border-gray-100' : 'border-gray-50'}`}>
                          <div className="flex items-start gap-2.5">
                            {t.milestone
                              ? <div className="w-5 h-5 rounded-full bg-amber-400 text-white flex items-center justify-center shrink-0 mt-0.5">⚑</div>
                              : <div className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">{j + 1}</div>
                            }
                            <div className="flex-1 min-w-0">
                              <div className={`text-xs leading-snug ${t.milestone ? 'font-bold text-amber-800' : 'text-gray-700'}`}>
                                {t.title}
                              </div>
                              {t.responsible && <div className="text-[9px] text-gray-400 mt-0.5">{t.responsible}</div>}
                              {(t.items || []).length > 0 && (
                                <ul className="mt-1.5 space-y-0.5">
                                  {t.items!.map((item, k) => (
                                    <li key={k} className="flex items-start gap-1.5">
                                      <div className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                                      <span className="text-[10px] text-gray-500 leading-snug">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">{t.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {rm.notes && (
          <div className="rounded-xl p-3 bg-amber-50 border border-amber-200 flex gap-2">
            <span className="text-amber-500 text-base shrink-0">⚠</span>
            <p className="text-xs text-amber-800 leading-relaxed">{rm.notes}</p>
          </div>
        )}

        {/* Подпись */}
        <div className="border-t-2 border-gray-700 pt-5 mt-2">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">С уважением,</p>
              <p className="text-xs text-gray-600">Генеральный директор</p>
              <p className="text-sm font-black text-gray-900">{company.full}</p>
              {directorLine && <p className="text-xs text-gray-600">{directorLine}</p>}
              {innLine && <p className="text-[10px] text-gray-400">{innLine}</p>}
              <div className="mt-4 flex items-end gap-6">
                <div>
                  <div className="border-b border-gray-400 w-36 mb-1" />
                  <div className="text-[9px] text-gray-400">(подпись)</div>
                </div>
                <div>
                  <div className="border-b border-gray-400 w-28 mb-1" />
                  <div className="text-[9px] text-gray-400">(дата)</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 shrink-0">
              {company.logo && <img src={company.logo} alt="" className="h-10 object-contain opacity-70" />}
              {company.stamp && <img src={company.stamp} alt="Печать" className="h-20 w-20 object-contain opacity-85" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const LS_MESSAGES = 'aikp_messages';
const LS_KPDATA = 'aikp_kpdata';
const LS_RMDATA = 'aikp_rmdata';
const LS_MODE = 'aikp_mode';

export function AIKPGenerator() {
  const [selectedCompany, setSelectedCompany] = useState<string>(() =>
    localStorage.getItem(LS_COMPANY) || 'kapstroy'
  );
  const company = COMPANIES.find(c => c.id === selectedCompany) || COMPANIES[0];

  const [mode, setMode] = useState<'kp' | 'roadmap'>(() =>
    (localStorage.getItem(LS_MODE) as 'kp' | 'roadmap') || 'kp'
  );

  const [messages, setMessages] = useState<Message[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_MESSAGES) || '[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [kpData, setKpData] = useState<KpData | null>(() => {
    try { return JSON.parse(localStorage.getItem(LS_KPDATA) || 'null'); } catch { return null; }
  });
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(() => {
    try { return JSON.parse(localStorage.getItem(LS_RMDATA) || 'null'); } catch { return null; }
  });
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const dragCounterRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try { localStorage.setItem(LS_MESSAGES, JSON.stringify(messages)); } catch (e) { void e; }
  }, [messages]);
  useEffect(() => {
    try { localStorage.setItem(LS_KPDATA, JSON.stringify(kpData)); } catch (e) { void e; }
  }, [kpData]);
  useEffect(() => {
    try { localStorage.setItem(LS_RMDATA, JSON.stringify(roadmapData)); } catch (e) { void e; }
  }, [roadmapData]);
  useEffect(() => {
    try { localStorage.setItem(LS_MODE, mode); } catch (e) { void e; }
  }, [mode]);

  const printDocument = () => {
    const el = printRef.current;
    if (!el) return;
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    // Копируем все inline styles и Tailwind через computed styles
    const css = Array.from(document.styleSheets)
      .flatMap(s => { try { return Array.from(s.cssRules).map(r => r.cssText); } catch { return []; } })
      .join('\n');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
      <title>${mode === 'kp' ? 'КП' : 'Дорожная карта'}</title>
      <style>
        ${css}
        @page { size: A4; margin: 10mm 12mm; }
        body { background: white !important; font-family: Arial, sans-serif; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      </style></head><body>${el.outerHTML}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 600);
  };

  const regenerateDoc = async () => {
    if (loading) return;
    const prompt = mode === 'kp'
      ? 'Сформируй полное коммерческое предложение на основе нашего обсуждения. Включи все этапы работ с суммами, сроки и результаты.'
      : 'Сформируй подробную дорожную карту на основе нашего обсуждения. Все этапы, подэтапы, сроки, ответственные, вехи.';

    const newMessages: Message[] = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);
    setLoading(true);
    setLoadingSeconds(0);
    timerRef.current = setInterval(() => setLoadingSeconds(s => s + 1), 1000);

    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deepseek_chat',
          messages: newMessages,
          company_details: company.details,
          company_vat: company.vat,
          mode,
        }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const startData = await resp.json();
      if (startData.error) throw new Error(startData.error);

      const jobId = startData.job_id;
      if (!jobId) throw new Error('Не получен job_id');

      const deadline = Date.now() + 90000;
      while (Date.now() < deadline) {
        await new Promise(r => setTimeout(r, 2000));
        const pollResp = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'check_job', job_id: jobId }),
        });
        if (!pollResp.ok) continue;
        const poll = await pollResp.json();
        if (poll.status === 'done' && poll.data) {
          const data = poll.data;
          setMessages(prev => [...prev, { role: 'assistant', content: data.message || 'Готово.' }]);
          if (data.kp_json) setKpData(data.kp_json as KpData);
          if (data.roadmap_json) setRoadmapData(data.roadmap_json as RoadmapData);
          break;
        }
        if (poll.status === 'error') throw new Error(poll.error || 'Ошибка генерации');
      }
      if (Date.now() >= deadline) throw new Error('Время ожидания истекло');
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Ошибка: ${err instanceof Error ? err.message : 'неизвестная'}` }]);
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
      setLoadingSeconds(0);
      setLoading(false);
      abortRef.current = null;
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Лимиты размеров файлов перед отправкой на backend
  const MAX_FILE_BYTES = 4 * 1024 * 1024;   // 4 MB для документов
  const MAX_IMG_BYTES  = 2 * 1024 * 1024;   // 2 MB для изображений (OCR)

  const processFiles = async (files: File[]) => {
    if (!files.length) return;
    setUploadingFiles(true);

    const pending: AttachedFile[] = [];
    for (const file of files) {
      const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp|tiff)$/i.test(file.name || '');
      const limit = isImage ? MAX_IMG_BYTES : MAX_FILE_BYTES;
      const truncated = file.size > limit;

      let b64 = '';
      try {
        b64 = await new Promise<string>((resolve, reject) => {
          const slice = truncated ? file.slice(0, limit) : file;
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const idx = result.indexOf(',');
            resolve(idx !== -1 ? result.slice(idx + 1) : '');
          };
          reader.onerror = () => reject(new Error('Ошибка чтения файла'));
          reader.readAsDataURL(slice);
        });
      } catch (e) { void e; }

      if (!b64 || b64.length < 10) continue;

      const name = file.name || `скриншот_${Date.now()}.png`;
      const mime = file.type || (isImage ? 'image/png' : 'application/octet-stream');
      pending.push({
        name: name + (truncated ? ` (сжато до ${formatSize(limit)})` : ''),
        type: mime,
        size: file.size,
        b64,
        parsed: false,
        parsing: true,
      });
    }
    setAttachedFiles(prev => [...prev, ...pending]);

    // Парсим текстовые файлы на backend по одному
    for (const f of pending) {
      if (f.parsed) continue;
      try {
        const resp = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'parse_files',
            files_b64: [{ name: f.name, type: f.type, data: f.b64 }],
          }),
        });
        if (!resp.ok) {
          const errBody = await resp.text().catch(() => '');
          throw new Error(`HTTP ${resp.status}: ${errBody.slice(0, 150)}`);
        }
        const data = await resp.json();
        const parsed = data.files?.[0];
        const hasText = parsed?.text && !parsed.text.startsWith('[OCR ошибка') && !parsed.text.startsWith('[Ошибка');
        setAttachedFiles(prev => prev.map(af =>
          af.name === f.name && af.parsing
            ? {
                ...af,
                text: parsed?.text || '[Не удалось извлечь текст]',
                parsed: true,
                parsing: false,
                error: !hasText,
              }
            : af
        ));
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'неизвестная ошибка';
        setAttachedFiles(prev => prev.map(af =>
          af.name === f.name && af.parsing
            ? { ...af, text: `[Ошибка: ${msg}]`, parsed: true, parsing: false, error: true }
            : af
        ));
      }
    }

    setUploadingFiles(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (idx: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const sendMessage = async () => {
    const text = input.trim();
    const stillParsing = attachedFiles.some(f => f.parsing);
    if ((!text && attachedFiles.length === 0) || loading || stillParsing) return;

    const fileNames = attachedFiles.map(f => f.name).join(', ');
    const userText = text
      ? (attachedFiles.length > 0 ? `${text}\n\n📎 Прикреплены файлы: ${fileNames}` : text)
      : `📎 Загружены файлы для анализа: ${fileNames}`;

    const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    const filesToSend = [...attachedFiles];
    setAttachedFiles([]);
    setLoading(true);

    // Собираем извлечённый текст (без base64!) и изображения отдельно
    const extractedTexts: string[] = [];

    for (const f of filesToSend) {
      if (f.text) {
        // Для изображений — OCR текст уже получен при парсинге
        const label = f.type.startsWith('image/') ? `ИЗОБРАЖЕНИЕ (OCR): ${f.name}` : f.name;
        extractedTexts.push(`=== ${label} ===\n${f.text}`);
      }
    }

    // Запускаем таймер
    setLoadingSeconds(0);
    timerRef.current = setInterval(() => setLoadingSeconds(s => s + 1), 1000);

    try {
      // Шаг 1: запускаем job (backend сразу отвечает job_id, не ждёт DeepSeek)
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deepseek_chat',
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          files_text: extractedTexts.join('\n\n'),
          company_details: company.details,
          company_vat: company.vat,
          mode,
        }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const startData = await resp.json();
      if (startData.error) throw new Error(startData.error);

      const jobId = startData.job_id;
      if (!jobId) throw new Error('Не получен job_id от сервера');

      // Шаг 2: поллинг каждые 2 сек до готовности (макс 90 сек)
      const deadline = Date.now() + 90000;
      while (Date.now() < deadline) {
        await new Promise(r => setTimeout(r, 2000));

        const pollResp = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'check_job', job_id: jobId }),
        });
        if (!pollResp.ok) continue;
        const poll = await pollResp.json();

        if (poll.status === 'done' && poll.data) {
          const data = poll.data;
          setMessages(prev => [...prev, { role: 'assistant', content: data.message || 'Готово.' }]);
          // Всегда обновляем — пользователь мог запросить изменения
          if (data.kp_json) setKpData(data.kp_json as KpData);
          if (data.roadmap_json) setRoadmapData(data.roadmap_json as RoadmapData);
          break;
        }
        if (poll.status === 'error') throw new Error(poll.error || 'Ошибка генерации');
      }
      if (Date.now() >= deadline) throw new Error('Время ожидания истекло (90 сек). Попробуйте ещё раз.');

    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Ошибка: ${err instanceof Error ? err.message : 'неизвестная'}` }]);
    } finally {
      if (timerRef.current) clearInterval(timerRef.current);
      setLoadingSeconds(0);
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    // Останавливаем всплытие чтобы Tabs не перехватил событие
    if (e.key === 'Enter' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.stopPropagation();
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setKpData(null);
    setRoadmapData(null);
    setInput('');
    setAttachedFiles([]);
    try {
      localStorage.removeItem(LS_MESSAGES);
      localStorage.removeItem(LS_KPDATA);
      localStorage.removeItem(LS_RMDATA);
    } catch (e) { void e; }
  };

  // Обработка вставки из буфера (Ctrl+V / скриншоты)
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);
    const fileItems = items.filter(it => it.kind === 'file');
    if (!fileItems.length) return;
    e.preventDefault();
    const files = fileItems.map(it => it.getAsFile()).filter(Boolean) as File[];
    processFiles(files);
  };

  // Drag-and-drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.types.includes('Files')) setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) processFiles(files);
  };

  const ACCEPTED = '.pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp';

  return (
    <div className="space-y-4">

    {/* ── ВЫБОР КОМПАНИИ ── */}
    <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="Building2" size={14} className="text-cyan-400" />
        <span className="text-sm font-semibold text-cyan-300">От кого формируется КП</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {COMPANIES.map((c) => {
          const active = selectedCompany === c.id;
          return (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCompany(c.id);
                try { localStorage.setItem(LS_COMPANY, c.id); } catch (e) { void e; }
              }}
              className={`relative rounded-xl border-2 px-4 py-3 text-left transition-all ${
                active
                  ? c.color + ' shadow-lg'
                  : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-500'
              }`}
            >
              {active && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-current flex items-center justify-center">
                  <Icon name="Check" size={10} className="text-slate-900" />
                </div>
              )}
              {c.logo && (
                <img src={c.logo} alt={c.short} className="h-6 object-contain mb-2 opacity-80" />
              )}
              {!c.logo && (
                <div className="text-[10px] font-black uppercase tracking-wider mb-1 opacity-60">{c.id.toUpperCase()}</div>
              )}
              <div className="text-xs font-bold leading-snug">{c.short}</div>
              <div className={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded ${
                active ? 'bg-white/20' : 'bg-slate-700'
              }`}>{c.vat}</div>
            </button>
          );
        })}
      </div>
      {/* Реквизиты выбранной компании */}
      <div className="mt-3 pt-3 border-t border-slate-700/50">
        <div className="flex items-start gap-3">
          {company.stamp && (
            <img src={company.stamp} alt="Печать" className="h-12 w-12 object-contain opacity-70 shrink-0" />
          )}
          <div className="text-[10px] text-slate-400 leading-relaxed whitespace-pre-line flex-1">
            {company.details}
          </div>
        </div>
      </div>
    </div>

    <div className="flex gap-6 items-start" style={{ minHeight: '600px' }}>
      {/* Левая панель — чат с фиксированной высотой */}
      <div
        style={{ height: 'calc(100vh - 260px)', minHeight: '550px' }}
        className={`flex flex-col flex-1 bg-slate-900/60 border rounded-2xl overflow-hidden relative transition-colors ${
          isDragging ? 'border-cyan-400 bg-cyan-950/40' : 'border-cyan-500/20'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-2xl pointer-events-none">
            <div className="w-20 h-20 rounded-2xl bg-cyan-500/20 border-2 border-dashed border-cyan-400 flex items-center justify-center mb-3">
              <Icon name="Upload" size={32} className="text-cyan-400" />
            </div>
            <p className="text-lg font-bold text-cyan-300">Отпустите файлы</p>
            <p className="text-sm text-cyan-500 mt-1">PDF, Word, Excel, изображения</p>
          </div>
        )}
        {/* Хедер */}
        <div className="flex flex-col border-b border-cyan-500/20 bg-slate-900/80">
          {/* Строка 1: режим + очистить */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2 gap-2">
            {/* Переключатель режима */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-xl p-1">
              <button
                onClick={() => setMode('kp')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'kp' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon name="FileText" size={12} />
                КП
              </button>
              <button
                onClick={() => setMode('roadmap')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === 'roadmap' ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon name="Map" size={12} />
                Дорожная карта
              </button>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-cyan-400 font-medium">DeepSeek</span>
              <Button variant="ghost" size="sm" onClick={clearChat} className="text-gray-500 hover:text-white h-7 px-2 ml-1">
                <Icon name="Trash2" size={13} />
              </Button>
            </div>
          </div>
          {/* Строка 2: кнопка сформировать */}
          <div className="px-4 pb-2">
            <button
              onClick={regenerateDoc}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'roadmap'
                  ? 'bg-violet-600/20 border border-violet-500/40 text-violet-300 hover:bg-violet-600/40'
                  : 'bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/40'
              }`}
            >
              <Icon name="Sparkles" size={13} />
              {mode === 'kp' ? 'Сформировать КП' : 'Сформировать дорожную карту'}
            </button>
          </div>
        </div>

        {/* Сообщения */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-gray-500">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center border border-cyan-500/20">
                <Icon name="BrainCircuit" size={28} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Опишите проект или загрузите файлы</p>
                <p className="text-xs text-gray-600 mt-1">DeepSeek проанализирует ТЗ, чертежи, таблицы<br />и автоматически сформирует КП с суммами</p>
              </div>
              {/* Подсказки */}
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
              {/* Drag-and-drop зона */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-sm mt-1 rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/50 p-4 flex flex-col items-center gap-1.5 transition-all group"
              >
                <Icon name="Upload" size={20} className="text-slate-600 group-hover:text-cyan-500 transition-colors" />
                <p className="text-xs text-slate-600 group-hover:text-cyan-400 transition-colors">Загрузить ТЗ, PDF, Word, Excel, фото</p>
                <p className="text-[10px] text-slate-700">pdf · doc · docx · xls · xlsx · csv · jpg · png</p>
              </button>
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
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 min-w-[200px]">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-1.5 text-cyan-400 text-xs">
                    <Icon name="Sparkles" size={12} />
                    DeepSeek думает...
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 tabular-nums">{loadingSeconds}с</span>
                    <button
                      onClick={() => abortRef.current?.abort()}
                      className="text-[10px] text-slate-600 hover:text-red-400 transition-colors border border-slate-700 rounded px-1.5 py-0.5"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
                <div className="flex gap-1 mb-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                {loadingSeconds > 15 && (
                  <p className="text-[10px] text-slate-600 mt-1">Анализирую документы, чуть подождите...</p>
                )}
                {loadingSeconds > 30 && (
                  <p className="text-[10px] text-amber-600 mt-0.5">Запрос сложный, ещё немного...</p>
                )}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Прикреплённые файлы */}
        {attachedFiles.length > 0 && (
          <div className="px-4 py-2 border-t border-cyan-500/10 bg-slate-900/60">
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((f, i) => (
                <div key={i} className={`flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 text-xs max-w-[220px] transition-colors ${
                  f.error ? 'bg-red-900/30 border-red-700/50' :
                  f.parsing ? 'bg-slate-800 border-cyan-700/50 animate-pulse' :
                  'bg-slate-800 border-slate-700'
                }`}>
                  {f.parsing
                    ? <Icon name="Loader2" size={12} className="text-cyan-400 animate-spin shrink-0" />
                    : <Icon name={fileIcon(f.type)} size={12} className={f.error ? 'text-red-400' : fileColor(f.type)} />
                  }
                  <span className="text-gray-300 truncate flex-1">{f.name}</span>
                  {f.parsing
                    ? <span className="text-cyan-600 shrink-0 text-[9px]">
                        {f.type.startsWith('image/') ? 'OCR...' : 'читаю...'}
                      </span>
                    : f.error
                      ? <span className="text-red-500 shrink-0 text-[9px]" title={f.text}>ошибка</span>
                      : f.text
                        ? <span className="text-green-600 shrink-0 text-[9px]">
                            {f.type.startsWith('image/') ? '✓OCR' : ''}
                            {(f.text.length / 1000).toFixed(0)}к
                          </span>
                        : <span className="text-gray-600 shrink-0">{formatSize(f.size)}</span>
                  }
                  <button onClick={() => removeFile(i)} className="text-gray-600 hover:text-red-400 transition-colors shrink-0 ml-0.5">
                    <Icon name="X" size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Инпут */}
        <div className="px-4 py-3 border-t border-cyan-500/20 bg-slate-900/80">
          <div className="flex gap-2 items-end">
            {/* Кнопка прикрепить файл */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED}
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFiles || loading}
              className="text-gray-400 hover:text-cyan-300 hover:bg-slate-800 h-[60px] px-3 border border-slate-700 rounded-xl relative"
              title="Прикрепить файл (PDF, Word, Excel, изображение)"
            >
              {uploadingFiles
                ? <Icon name="Loader2" size={18} className="animate-spin" />
                : <Icon name="Paperclip" size={18} />
              }
              {attachedFiles.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[9px] text-white font-bold flex items-center justify-center">
                  {attachedFiles.length}
                </span>
              )}
            </Button>

            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              onPaste={handlePaste}
              placeholder="Опишите проект… или перетащите / вставьте файлы (Ctrl+V)"
              className="flex-1 resize-none bg-slate-800/80 border-slate-700 text-gray-200 placeholder:text-gray-600 focus:border-cyan-500/50 min-h-[60px] max-h-[120px]"
              rows={2}
            />
            <Button
              onClick={sendMessage}
              disabled={loading || (!input.trim() && attachedFiles.length === 0) || attachedFiles.some(f => f.parsing)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white h-[60px] px-4 disabled:opacity-40"
              title={attachedFiles.some(f => f.parsing) ? 'Подождите — файлы ещё обрабатываются...' : 'Отправить'}
            >
              <Icon name={loading ? 'Loader2' : 'Send'} size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-1.5 flex items-center gap-2">
            {attachedFiles.some(f => f.parsing) ? (
              <span className="text-cyan-600 flex items-center gap-1">
                <Icon name="Loader2" size={10} className="animate-spin" />
                Извлекаю текст из файлов, подождите...
              </span>
            ) : (
              <>
                <span>Ctrl+Enter — отправить</span>
                <span className="text-slate-700">·</span>
                <span className="flex items-center gap-1">
                  <Icon name="Upload" size={10} className="text-slate-600" />
                  Перетащи или вставь Ctrl+V
                </span>
                <span className="text-slate-700">·</span>
                <span className="text-slate-600">PDF · Word · Excel · Фото</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Правая панель — полный скролл без обрезания */}
      <div className="w-[420px] flex-shrink-0 flex flex-col gap-3" style={{ maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
        {/* Шапка правой панели */}
        {(kpData || roadmapData) && (
          <div className="flex items-center justify-between">
            <Badge className={`text-xs ${mode === 'roadmap' ? 'bg-violet-500/20 text-violet-400 border-violet-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
              <Icon name="CheckCircle" size={12} className="mr-1" />
              {mode === 'roadmap' ? 'Дорожная карта готова' : 'КП сформировано'}
            </Badge>
            <Button
              size="sm"
              onClick={printDocument}
              className="bg-slate-700 hover:bg-slate-600 text-white gap-1.5 text-xs h-7"
            >
              <Icon name="Printer" size={12} />
              Скачать PDF
            </Button>
          </div>
        )}

        {/* Содержимое */}
        {mode === 'kp' && kpData && (
          <KPPreview kp={kpData} company={company} printRef={printRef} />
        )}
        {mode === 'roadmap' && roadmapData && (
          <RoadmapPreview rm={roadmapData} company={company} printRef={printRef} />
        )}
        {mode === 'kp' && !kpData && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 bg-slate-900/40 rounded-2xl border border-dashed border-slate-700 p-8 min-h-[300px]">
            <Icon name="FileText" size={36} className="text-slate-600" />
            <div>
              <p className="text-sm font-medium text-slate-500">Превью КП</p>
              <p className="text-xs text-slate-600 mt-1">Нажми «Сформировать КП» или опиши проект в чате</p>
            </div>
          </div>
        )}
        {mode === 'roadmap' && !roadmapData && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 bg-slate-900/40 rounded-2xl border border-dashed border-violet-700/30 p-8 min-h-[300px]">
            <Icon name="Map" size={36} className="text-violet-700" />
            <div>
              <p className="text-sm font-medium text-slate-500">Дорожная карта</p>
              <p className="text-xs text-slate-600 mt-1">Нажми «Сформировать дорожную карту»</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>

  );
}