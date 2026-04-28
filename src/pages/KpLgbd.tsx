import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";

const WORKS = [
  { n: 1, title: "Организационный старт", sum: 30_000, weeks: 1 },
  { n: 2, title: "Сбор исходных данных", sum: 70_000, weeks: 2 },
  { n: 3, title: "Инженерные изыскания", sum: 120_000, weeks: 2 },
  { n: 4, title: "Транспортные расчеты (ИД КТ)", sum: 250_000, weeks: 4 },
  { n: 5, title: "Разработка ППТ", sum: 180_000, weeks: 3 },
  { n: 6, title: "Разработка ПМТ", sum: 100_000, weeks: 2 },
  { n: 7, title: "Сводка и оформление ДПТЛО", sum: 60_000, weeks: 1 },
  { n: 8, title: "Согласование с органами власти", sum: 90_000, weeks: 4 },
  { n: 9, title: "Общественные обсуждения", sum: 80_000, weeks: 3 },
  { n: 10, title: "Утверждение", sum: 50_000, weeks: 2 },
];

const WORKS4 = [
  { n: "4.1", title: "Определение узлов и сечений", sum: 15_000 },
  { n: "4.2", title: "Натурные замеры интенсивности", sum: 70_000 },
  { n: "4.3", title: "Обработка замеров", sum: 20_000 },
  { n: "4.4", title: "Прогноз на 20 лет (2028, 2046)", sum: 50_000 },
  { n: "4.5", title: "Расчет по 6 узлам/сечениям", sum: 45_000 },
  { n: "4.6", title: "Схемы в .dwg", sum: 30_000 },
  { n: "4.7", title: "Пояснительная записка", sum: 20_000 },
];

const APPROVALS = [
  { n: 1, name: "Комитет по транспорту", days: 10 },
  { n: 2, name: "Комитет по строительству", days: 10 },
  { n: 3, name: "Комитет по развитию транспортной инфраструктуры", days: 10 },
  { n: 4, name: "Комитет по благоустройству", days: 5 },
  { n: 5, name: "Комитет имущественных отношений", days: 10 },
  { n: 6, name: "КГИОП", days: 14 },
  { n: 7, name: "Комитет по природопользованию", days: 10 },
  { n: 8, name: "Невско-Ладожское БВУ", days: 14 },
  { n: 9, name: "АО «Западный скоростной диаметр»", days: 10 },
  { n: 10, name: "Комитет по вопросам законности", days: 10 },
  { n: 11, name: "Комитет по энергетике", days: 10 },
];

const TOTAL_WEEKS = 24;
const GANTT_COLORS = [
  "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500",
  "bg-pink-500", "bg-rose-500", "bg-orange-500", "bg-amber-500", "bg-teal-500",
];

const PIE_DATA = [
  { label: "Транспортные расчёты", value: 250_000, color: "bg-blue-500", hex: "#3b82f6" },
  { label: "ППТ", value: 180_000, color: "bg-indigo-500", hex: "#6366f1" },
  { label: "Инженерные изыскания", value: 120_000, color: "bg-violet-500", hex: "#8b5cf6" },
  { label: "ПМТ", value: 100_000, color: "bg-purple-500", hex: "#a855f7" },
  { label: "Согласования", value: 90_000, color: "bg-fuchsia-500", hex: "#d946ef" },
  { label: "Обществ. обсуждения", value: 80_000, color: "bg-pink-500", hex: "#ec4899" },
  { label: "Сбор данных", value: 70_000, color: "bg-rose-500", hex: "#f43f5e" },
  { label: "Сводка ДПТЛО", value: 60_000, color: "bg-orange-500", hex: "#f97316" },
  { label: "Оргстарт + Утверждение", value: 80_000, color: "bg-amber-500", hex: "#f59e0b" },
];

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " руб.";
}

function SectionTitle({ num, children }: { num?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-8">
      <div className="h-5 w-1 rounded-full bg-blue-700 shrink-0" />
      <h2 className="text-sm font-black uppercase tracking-widest text-gray-800">
        {num && <span className="text-blue-700 mr-1">{num}.</span>}
        {children}
      </h2>
    </div>
  );
}

function GanttChart() {
  const ganttData = [
    { label: "1. Оргстарт", start: 0, span: 1, color: GANTT_COLORS[0] },
    { label: "2. Сбор данных", start: 1, span: 2, color: GANTT_COLORS[1] },
    { label: "3. Изыскания", start: 3, span: 2, color: GANTT_COLORS[2] },
    { label: "4. Транспорт. расчёты", start: 5, span: 4, color: GANTT_COLORS[3] },
    { label: "5. ППТ", start: 9, span: 3, color: GANTT_COLORS[4] },
    { label: "6. ПМТ", start: 12, span: 2, color: GANTT_COLORS[5] },
    { label: "7. Сводка ДПТЛО", start: 14, span: 1, color: GANTT_COLORS[6] },
    { label: "8. Согласования", start: 15, span: 4, color: GANTT_COLORS[7] },
    { label: "9. Обсуждения", start: 19, span: 3, color: GANTT_COLORS[8] },
    { label: "10. Утверждение", start: 22, span: 2, color: GANTT_COLORS[9] },
  ];
  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);
  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: "700px" }}>
        <div className="grid mb-1" style={{ gridTemplateColumns: "160px repeat(24, 1fr)" }}>
          <div className="text-[8px] font-bold text-gray-400 uppercase px-1">Этап</div>
          {weeks.map(w => (
            <div key={w} className={`text-center text-[8px] font-bold ${w % 4 === 0 ? "text-blue-500" : "text-gray-400"}`}>
              {w % 2 === 0 ? w : ""}
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          {ganttData.map((row, i) => (
            <div key={i} className="grid items-center" style={{ gridTemplateColumns: "160px repeat(24, 1fr)" }}>
              <div className="text-[10px] text-gray-700 font-semibold pr-1 truncate leading-tight" title={row.label}>{row.label}</div>
              {weeks.map((_, wi) => {
                const active = wi >= row.start && wi < row.start + row.span;
                const isFirst = wi === row.start;
                const isLast = wi === row.start + row.span - 1;
                return (
                  <div key={wi} className="h-4 px-px">
                    {active ? (
                      <div className={`h-full ${row.color} opacity-90 ${isFirst ? "rounded-l-full" : ""} ${isLast ? "rounded-r-full" : ""} flex items-center justify-center`}>
                        {isFirst && row.span >= 2 && <span className="text-[7px] text-white font-bold px-0.5 truncate">{row.span}н</span>}
                      </div>
                    ) : (
                      <div className="h-full bg-gray-100 rounded-sm" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="grid mt-2" style={{ gridTemplateColumns: "160px repeat(24, 1fr)" }}>
          <div />
          {weeks.map(w => (
            <div key={w} className={`text-center text-[7px] ${w % 4 === 0 ? "text-blue-400 font-bold" : "text-gray-300"}`}>
              {w % 4 === 0 ? `${w}н` : ""}
            </div>
          ))}
        </div>
        <div className="text-[9px] text-gray-400 mt-1">Нед. 1 = май 2026 · Нед. 24 = октябрь 2026 · Предельный срок: 12.01.2027</div>
      </div>
    </div>
  );
}

function PieChart() {
  const total = PIE_DATA.reduce((s, d) => s + d.value, 0);
  let cumAngle = -90;
  const cx = 80, cy = 80, r = 70;
  const segments = PIE_DATA.map(d => {
    const angle = (d.value / total) * 360;
    const startAngle = cumAngle;
    cumAngle += angle;
    const toRad = (a: number) => (a * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(cumAngle));
    const y2 = cy + r * Math.sin(toRad(cumAngle));
    const large = angle > 180 ? 1 : 0;
    const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
    return { ...d, path };
  });
  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <svg viewBox="0 0 160 160" className="w-36 h-36 shrink-0">
        {segments.map((s, i) => (
          <path key={i} d={s.path} fill={s.hex} stroke="white" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {PIE_DATA.map(d => (
          <div key={d.label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${d.color}`} />
            <div className="text-[10px] text-gray-600 leading-tight">
              <span className="font-semibold">{d.label}</span>
              <span className="text-gray-400 ml-1">{(d.value / 1000).toFixed(0)} т.р.</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart() {
  const max = Math.max(...WORKS.map(w => w.weeks));
  return (
    <div className="flex items-end gap-1.5 h-28">
      {WORKS.map((w, i) => (
        <div key={w.n} className="flex flex-col items-center gap-0.5 flex-1">
          <div className="text-[8px] font-bold text-gray-600">{w.weeks}н</div>
          <div
            className={`w-full ${GANTT_COLORS[i]} rounded-t opacity-90`}
            style={{ height: `${(w.weeks / max) * 72}px` }}
          />
          <div className="text-[8px] text-gray-400 font-bold">{w.n}</div>
        </div>
      ))}
    </div>
  );
}

function FlowDiagram() {
  const steps = [
    { label: "Этапы 1–3\nПодготовка\n5 недель", color: "bg-blue-100 border-blue-300 text-blue-800" },
    { label: "Этап 4\nТрансп. расчёты\n4 недели", color: "bg-yellow-100 border-yellow-400 text-yellow-900 font-black" },
    { label: "Этапы 5–7\nППТ+ПМТ+Сводка\n6 недель", color: "bg-violet-100 border-violet-300 text-violet-800" },
    { label: "Этап 8\nСогласования\n4 недели", color: "bg-pink-100 border-pink-300 text-pink-800" },
    { label: "Этап 9\nОбсуждения\n3 недели", color: "bg-orange-100 border-orange-300 text-orange-800" },
    { label: "Этап 10\nУтверждение\n2 недели", color: "bg-teal-100 border-teal-300 text-teal-800" },
    { label: "ДПТЛО\nУТВЕРЖДЕНА", color: "bg-green-200 border-green-500 text-green-900 font-black" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-1">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className={`border-2 rounded-lg px-2 py-1.5 text-center text-[10px] leading-snug whitespace-pre-line ${s.color}`}
            style={{ minWidth: "70px" }}>
            {s.label}
          </div>
          {i < steps.length - 1 && <div className="text-gray-400 font-bold text-xs">→</div>}
        </div>
      ))}
    </div>
  );
}

export default function KpLgbd() {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .shadow-lg, .shadow-xl { box-shadow: none !important; }
          @page { margin: 12mm; size: A4; }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-50 bg-white border-b shadow-sm no-print">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Лого" className="h-9 object-contain" />
              <div>
                <div className="font-bold text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                <div className="text-xs text-gray-500">КП · ДПТЛО ул. Вадима Шефнера · 28.04.2026</div>
              </div>
            </div>
            <Button
              onClick={() => window.print()}
              className="bg-blue-700 hover:bg-blue-800 text-white gap-2 text-sm"
            >
              <Icon name="Printer" size={16} />
              Печать / PDF
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            {/* HEADER */}
            <div className="bg-blue-800 px-8 py-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-blue-200 mb-1">Коммерческое предложение</div>
                  <h1 className="text-lg font-black leading-snug mb-2">
                    Разработка документации по планировке территории<br />
                    и линейных объектов (ДПТЛО)
                  </h1>
                  <div className="text-blue-200 text-xs leading-relaxed">
                    Ул. Вадима Шефнера · ул. Лисянского · ул. Виктора Конецкого · пл. Европы · Морская наб. · бул. Головнина<br />
                    Василеостровский район · СПб
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-blue-300 uppercase tracking-wider mb-0.5">Дата КП</div>
                  <div className="font-black text-sm text-white">28 апреля 2026 г.</div>
                  <div className="text-[10px] text-blue-300 mt-2 uppercase tracking-wider">Срок по распоряжению</div>
                  <div className="font-bold text-sm text-white">12.01.2027</div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">

              {/* СТОРОНЫ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Заказчик</div>
                  <div className="font-black text-sm text-gray-900">СПб ГКУ «Дирекция транспортного строительства»</div>
                  <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                    <div><span className="font-semibold">Основание:</span> Распоряжение КГА № 1-20-18 от 04.02.2026</div>
                    <div>Письмо КТ № 01-26-29423/26-0-1 от 19.02.2026</div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Исполнитель</div>
                  <img src={LOGO_URL} alt="Лого" className="h-7 object-contain mb-1" />
                  <div className="font-black text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                  <div className="text-[10px] text-gray-600 mt-1">
                    ИНН 7814795454 · ОГРН 1217800122649<br />
                    197341, г. Санкт-Петербург, Фермское шоссе, д. 12
                  </div>
                </div>
              </div>

              {/* ОБЪЕКТ */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Объект</div>
                <p className="text-sm text-gray-800 font-semibold leading-relaxed">
                  Ул. Вадима Шефнера от Мичманской ул. и ул. Лисянского до ул. Виктора Конецкого, пл. Европы,
                  проезды от ул. Вадима Шефнера до Морской наб. в районе пл. Беллинсгаузена,
                  Морская наб. в районе Прибалтийской пл., ул. Виктора Конецкого от ул. Вадима Шефнера
                  до бульвара Головнина с подходами
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Район: Василеостровский</span>
                  <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">24 недели (~6 мес.)</span>
                  <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full">11 согласующих органов</span>
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">6 расчётных узлов и сечений</span>
                </div>
              </div>

              {/* ── ДИАГРАММЫ В САМОМ НАЧАЛЕ ── */}

              {/* Диаграмма Ганта */}
              <div className="border border-gray-200 rounded-xl p-5 mb-4">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  Диаграмма Ганта — дорожная карта (24 недели · май–октябрь 2026)
                </div>
                <GanttChart />
              </div>

              {/* Блок-схема + Диаграмма длительности */}
              <div className="border border-gray-200 rounded-xl p-5 mb-4">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Блок-схема процесса</div>
                <FlowDiagram />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-xl p-5">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Распределение стоимости (без НДС)</div>
                  <PieChart />
                </div>
                <div className="border border-gray-200 rounded-xl p-5">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Длительность этапов (нед.)</div>
                  <BarChart />
                  <div className="flex justify-between mt-1">
                    <span className="text-[8px] text-gray-400">Этап 1</span>
                    <span className="text-[8px] text-gray-400">Этап 10</span>
                  </div>
                  <div className="text-[9px] text-gray-400 mt-1">Макс. длительность — Этапы 4 и 8 (по 4 недели)</div>
                </div>
              </div>

              {/* Итоговая таблица KPI */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Стоимость с НДС", value: "1 256 600 ₽", color: "bg-blue-700 text-white" },
                  { label: "Длительность", value: "24 недели", color: "bg-indigo-100 text-indigo-800" },
                  { label: "Согласующих органов", value: "11", color: "bg-violet-100 text-violet-800" },
                  { label: "Расчётных узлов", value: "6", color: "bg-purple-100 text-purple-800" },
                ].map(p => (
                  <div key={p.label} className={`rounded-xl p-4 text-center ${p.color}`}>
                    <div className="text-xl font-black">{p.value}</div>
                    <div className="text-[10px] mt-0.5 opacity-75 uppercase tracking-wider">{p.label}</div>
                  </div>
                ))}
              </div>

              {/* 1. СОСТАВ РАБОТ */}
              <SectionTitle num="1">Состав работ и стоимость</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
                <div className="grid bg-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-wider" style={{ gridTemplateColumns: "44px 1fr 110px 70px" }}>
                  <div className="px-3 py-2 text-center">№</div>
                  <div className="px-3 py-2">Этап</div>
                  <div className="px-3 py-2 text-right">Стоимость</div>
                  <div className="px-3 py-2 text-center">Недель</div>
                </div>
                {WORKS.map((w, i) => (
                  <div key={w.n} className={`grid text-xs border-t border-gray-100 ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                    style={{ gridTemplateColumns: "44px 1fr 110px 70px" }}>
                    <div className="px-3 py-2.5 text-center font-bold text-gray-400">{w.n}</div>
                    <div className="px-3 py-2.5 text-gray-800">{w.title}</div>
                    <div className="px-3 py-2.5 text-right font-bold text-gray-700">{fmt(w.sum)}</div>
                    <div className="px-3 py-2.5 text-center font-black text-blue-700">{w.weeks}</div>
                  </div>
                ))}
              </div>

              {/* Детализация этапа 4 */}
              <div className="ml-4 mb-6">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Детализация этапа 4 — Транспортные расчёты</div>
                <div className="border border-blue-200 rounded-xl overflow-hidden bg-blue-50">
                  {WORKS4.map((w, i) => (
                    <div key={w.n} className={`flex items-center justify-between px-4 py-2 text-xs ${i > 0 ? "border-t border-blue-100" : ""}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500 font-bold">{w.n}</span>
                        <span className="text-gray-700">{w.title}</span>
                      </div>
                      <span className="font-bold text-gray-700 shrink-0 ml-4">{fmt(w.sum)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-4 py-2 border-t border-blue-300 bg-blue-100">
                    <span className="text-xs font-black text-blue-800">Итого этап 4</span>
                    <span className="text-xs font-black text-blue-700">250 000 руб.</span>
                  </div>
                </div>
              </div>

              {/* 2. СТОИМОСТЬ */}
              <SectionTitle num="2">Стоимость работ</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-sm">
                {[
                  { label: "Итого без НДС", value: "1 030 000,00 руб." },
                  { label: "НДС (22%)", value: "226 600,00 руб." },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white">
                    <div className="text-sm text-gray-600">{label}</div>
                    <div className="text-sm font-bold text-gray-800">{value}</div>
                  </div>
                ))}
                <div className="bg-blue-700 text-white px-5 py-4 flex items-center justify-between">
                  <div className="font-bold text-sm">ИТОГО С НДС</div>
                  <div className="font-black text-xl">1 256 600,00 <span className="text-sm font-normal">руб.</span></div>
                </div>
                <div className="bg-gray-50 px-5 py-3 text-xs text-gray-500 italic">
                  В т.ч. транспортные расчёты (этап 4): 305 000 руб. с НДС
                </div>
              </div>

              {/* 3. УСЛОВИЯ ОПЛАТЫ */}
              <SectionTitle num="3">Условия оплаты</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 text-[10px] font-black text-blue-700 uppercase tracking-widest">
                  Вариант A — Рекомендуемый (для госзаказчика)
                </div>
                <div className="px-5 py-4 bg-white text-sm text-gray-700">
                  <span className="font-bold">Постоплата 100%</span> — в течение 15 рабочих дней после утверждения ДПТЛО
                </div>
                <div className="bg-amber-50 border-t border-b border-amber-200 px-4 py-2 text-[10px] font-black text-amber-700 uppercase tracking-widest">
                  Вариант Б — Альтернативный (аванс 30% + 70%)
                </div>
                <div className="grid text-xs" style={{ gridTemplateColumns: "1fr 70px 160px 1fr" }}>
                  <div className="px-4 py-2 font-black text-[10px] text-gray-500 uppercase bg-gray-50">Платёж</div>
                  <div className="px-3 py-2 font-black text-[10px] text-gray-500 uppercase bg-gray-50 text-center">%</div>
                  <div className="px-3 py-2 font-black text-[10px] text-gray-500 uppercase bg-gray-50 text-right">Сумма (с НДС)</div>
                  <div className="px-4 py-2 font-black text-[10px] text-gray-500 uppercase bg-gray-50">Срок</div>
                </div>
                {[
                  { name: "Аванс", pct: "30%", sum: "376 980,00", term: "В течение 5 рабочих дней после подписания договора", color: "bg-blue-50" },
                  { name: "Окончательный расчёт", pct: "70%", sum: "879 620,00", term: "В течение 15 рабочих дней после подписания акта сдачи-приёмки", color: "bg-emerald-50" },
                ].map(row => (
                  <div
                    key={row.name}
                    className={`grid text-xs border-t border-gray-100 ${row.color}`}
                    style={{ gridTemplateColumns: "1fr 70px 160px 1fr" }}
                  >
                    <div className="px-4 py-3 font-semibold text-gray-800">{row.name}</div>
                    <div className="px-3 py-3 text-center font-black text-blue-700">{row.pct}</div>
                    <div className="px-3 py-3 text-right font-bold text-gray-800">{row.sum} ₽</div>
                    <div className="px-4 py-3 text-gray-600">{row.term}</div>
                  </div>
                ))}
              </div>

              {/* 4. РЕЗУЛЬТАТЫ */}
              <SectionTitle num="4">Результаты работ</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                {[
                  { what: "ППТ", fmt: "Бумага 2 экз. + .dwg + .pdf" },
                  { what: "ПМТ", fmt: "Бумага 2 экз. + .dwg + .pdf" },
                  { what: "Транспортные расчёты (разделы 3 и 4 ППТ)", fmt: "В составе ППТ" },
                  { what: "Постановление Правительства СПб об утверждении", fmt: "Оригинал" },
                ].map((r, i) => (
                  <div key={i} className={`flex items-center justify-between px-5 py-3 text-sm ${i > 0 ? "border-t border-gray-100" : ""} ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}>
                    <div className="text-gray-800 font-semibold">{r.what}</div>
                    <span className="ml-4 px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full shrink-0">{r.fmt}</span>
                  </div>
                ))}
              </div>

              {/* 5. СРОК ДЕЙСТВИЯ */}
              <SectionTitle num="5">Срок действия предложения</SectionTitle>
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-4 text-sm text-gray-800">
                <span className="font-bold">10 (десять) рабочих дней</span> с момента получения.
              </div>

              {/* ═══════════════════════════════ */}
              {/* ДОРОЖНАЯ КАРТА */}
              {/* ═══════════════════════════════ */}
              <div className="mt-10 mb-4 border-t-2 border-blue-700 pt-8">
                <div className="text-[10px] uppercase tracking-widest text-blue-500 font-black mb-1">Приложение</div>
                <h2 className="text-2xl font-black text-gray-900">Итоговая дорожная карта</h2>
                <div className="text-sm text-gray-500 mt-1">ДПТЛО · Василеостровский район · 24 недели · май–октябрь 2026</div>
              </div>

              {/* ДК-1: Общие параметры */}
              <SectionTitle num="1">Общие параметры</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Старт", value: "Май 2026" },
                  { label: "Финиш", value: "Окт. 2026" },
                  { label: "Длительность", value: "24 недели" },
                  { label: "Предельный срок", value: "12.01.2027" },
                ].map(p => (
                  <div key={p.label} className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                    <div className="text-base font-black text-blue-700">{p.value}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">{p.label}</div>
                  </div>
                ))}
              </div>

              {/* ДК-2: Пошаговый план */}
              <SectionTitle num="2">Пошаговый план</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                <div className="grid bg-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-wider" style={{ gridTemplateColumns: "44px 1fr 70px 110px" }}>
                  <div className="px-3 py-2 text-center">№</div>
                  <div className="px-3 py-2">Этап</div>
                  <div className="px-3 py-2 text-center">Недель</div>
                  <div className="px-3 py-2 text-right">Стоимость</div>
                </div>
                {WORKS.map((w, i) => (
                  <div key={w.n} className={`grid text-xs border-t border-gray-100 ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                    style={{ gridTemplateColumns: "44px 1fr 70px 110px" }}>
                    <div className="px-3 py-2.5 text-center font-bold text-gray-400">{w.n}</div>
                    <div className="px-3 py-2.5 font-semibold text-gray-800">{w.title}</div>
                    <div className="px-3 py-2.5 text-center font-black text-blue-700">{w.weeks}</div>
                    <div className="px-3 py-2.5 text-right font-bold text-gray-700">{fmt(w.sum)}</div>
                  </div>
                ))}
                <div className="grid border-t border-gray-300 bg-blue-50 text-xs" style={{ gridTemplateColumns: "44px 1fr 70px 110px" }}>
                  <div />
                  <div className="px-3 py-2.5 font-black text-gray-800">ИТОГО</div>
                  <div className="px-3 py-2.5 text-center font-black text-blue-700">24</div>
                  <div className="px-3 py-2.5 text-right font-black text-blue-700">1 030 000 руб.</div>
                </div>
              </div>

              {/* ДК-4: Детализация этапа 4 */}
              <SectionTitle num="4">Детализация этапа 4 — Транспортные расчёты (ИД КТ)</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                {[
                  { sub: "4.1", label: "Подготовка", days: 3, desc: "Анализ границ, определение 6 узлов и сечений, подготовка бланков замеров" },
                  { sub: "4.2", label: "Натурные замеры", days: 3, desc: "Утренний/вечерний час пик (8:00–10:00 / 17:00–19:00), состав потока, резервный день" },
                  { sub: "4.3", label: "Обработка замеров", days: 3, desc: "Проверка аномалий, статистическая обработка, сводные таблицы фона 2026" },
                  { sub: "4.4", label: "Прогноз на 20 лет", days: 7, desc: "Коэффициенты роста (СП 34.13330.2021), прогноз 2028 г. и 2046 г." },
                  { sub: "4.5", label: "Расчёт узлов и сечений", days: 5, desc: "6 узлов: Шефнера/Мичманская, Шефнера/Лисянского, Шефнера/Конецкого, пл. Европы, Морская наб., Конецкого/Головнина" },
                  { sub: "4.6", label: "Оформление схем .dwg", days: 5, desc: "Схемы интенсивности 2028 и 2046 г., схема загрузки УДС" },
                  { sub: "4.7", label: "Пояснительная записка", days: 5, desc: "Методика, таблицы интенсивности, таблицы загрузки, выводы и рекомендации" },
                ].map((r, i) => (
                  <div key={r.sub} className={`grid text-xs border-t border-gray-100 ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                    style={{ gridTemplateColumns: "48px 130px 50px 1fr" }}>
                    <div className="px-3 py-2.5 font-bold text-blue-600 text-center">{r.sub}</div>
                    <div className="px-2 py-2.5 font-semibold text-gray-800">{r.label}</div>
                    <div className="px-2 py-2.5 text-center font-black text-gray-600">{r.days} д.</div>
                    <div className="px-3 py-2.5 text-gray-500">{r.desc}</div>
                  </div>
                ))}
                <div className="grid border-t border-gray-300 bg-blue-50 text-xs" style={{ gridTemplateColumns: "48px 130px 50px 1fr" }}>
                  <div />
                  <div className="px-2 py-2.5 font-black text-blue-800">Итого этап 4</div>
                  <div className="px-2 py-2.5 text-center font-black text-blue-700">31 д.</div>
                  <div className="px-3 py-2.5 font-black text-blue-700">250 000 руб. (305 000 с НДС)</div>
                </div>
              </div>

              {/* ДК-5: Согласования */}
              <SectionTitle num="5">Согласование с органами власти (11 ведомств)</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-8">
                <div className="grid bg-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-wider" style={{ gridTemplateColumns: "44px 1fr 80px" }}>
                  <div className="px-3 py-2 text-center">№</div>
                  <div className="px-3 py-2">Ведомство</div>
                  <div className="px-3 py-2 text-center">Срок (дн.)</div>
                </div>
                {APPROVALS.map((a, i) => (
                  <div key={a.n} className={`grid text-xs border-t border-gray-100 ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                    style={{ gridTemplateColumns: "44px 1fr 80px" }}>
                    <div className="px-3 py-2.5 text-center font-bold text-gray-400">{a.n}</div>
                    <div className="px-3 py-2.5 text-gray-800">{a.name}</div>
                    <div className={`px-3 py-2.5 text-center font-black ${a.days >= 14 ? "text-orange-600" : "text-blue-700"}`}>{a.days}</div>
                  </div>
                ))}
                <div className="grid border-t border-gray-300 bg-blue-50 text-xs" style={{ gridTemplateColumns: "44px 1fr 80px" }}>
                  <div />
                  <div className="px-3 py-2.5 font-black text-gray-800">Итого (параллельно)</div>
                  <div className="px-3 py-2.5 text-center font-black text-blue-700">~28</div>
                </div>
              </div>

              {/* ПОДПИСИ */}
              <SectionTitle num="6">Подписи сторон</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 mb-2">
                <div className="border border-gray-200 rounded-xl p-5">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Заказчик</div>
                  <div className="text-xs text-gray-700 mb-1 font-semibold">СПб ГКУ «Дирекция транспортного строительства»</div>
                  <div className="text-xs text-gray-600 mb-5">Руководитель</div>
                  <div className="border-b border-gray-400 border-dashed w-48 mb-1" />
                  <div className="text-[10px] text-gray-400">подпись / дата</div>
                  <div className="mt-3 text-[10px] text-gray-400 italic">М.П.</div>
                </div>
                <div className="border border-blue-200 rounded-xl p-5 bg-blue-50">
                  <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-3">Исполнитель</div>
                  <div className="text-xs text-gray-700 mb-1 font-semibold">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                  <div className="text-xs text-gray-600 mb-5">Генеральный директор</div>
                  <div className="border-b border-gray-400 border-dashed w-48 mb-1" />
                  <div className="text-[10px] text-gray-400">подпись / дата</div>
                  <div className="mt-3 text-[10px] text-gray-400 italic">М.П.</div>
                </div>
              </div>

              {/* ИТОГ */}
              <div className="mt-8 bg-blue-800 rounded-xl p-5 text-white">
                <div className="text-[10px] uppercase tracking-widest text-blue-200 mb-3 font-black">Итоговый пакет</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Стоимость с НДС", value: "1 256 600 ₽" },
                    { label: "Длительность", value: "24 недели" },
                    { label: "Старт/Финиш", value: "Май/Окт 2026" },
                    { label: "Срок действия КП", value: "10 раб. дней" },
                  ].map(p => (
                    <div key={p.label} className="bg-blue-700 rounded-lg p-3 text-center">
                      <div className="font-black text-base text-white">{p.value}</div>
                      <div className="text-[10px] text-blue-200 mt-0.5">{p.label}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}