import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

/* ──────────────────────────────────────────
   ГАНТА: 120 к.д., старт 1 мая 2026
   Отрисовка: 4 строки-раздела, 120 ячеек
────────────────────────────────────────── */
const TOTAL_DAYS = 120;

interface GTask {
  id: string;
  label: string;
  start: number; // 0-based day index
  len: number;
  color: string;
  milestone?: boolean;
}

interface GSection {
  title: string;
  accent: string;
  tasks: GTask[];
}

const SECTIONS: GSection[] = [
  {
    title: "1. Организация",
    accent: "bg-slate-600",
    tasks: [
      { id: "o1", label: "Подписание договора + аванс", start: 0, len: 1, color: "bg-slate-500" },
      { id: "o2", label: "Передача ИД от Заказчика",     start: 1, len: 2, color: "bg-slate-400" },
    ],
  },
  {
    title: "2. Инженерные изыскания",
    accent: "bg-blue-700",
    tasks: [
      { id: "iz", label: "Геодезия, геология, экология, гидромет", start: 3, len: 20, color: "bg-blue-500" },
      { id: "iz_m", label: "Акт сдачи изысканий", start: 22, len: 1, color: "bg-blue-800", milestone: true },
    ],
  },
  {
    title: "3. Проектная документация",
    accent: "bg-violet-700",
    tasks: [
      { id: "p1", label: "Обследование объекта",         start: 23, len: 4,  color: "bg-violet-400" },
      { id: "p2", label: "ПОС / ПОД (снос)",              start: 27, len: 12, color: "bg-violet-500" },
      { id: "p3", label: "Технология демонтажа",          start: 39, len: 10, color: "bg-violet-600" },
      { id: "p4", label: "Сети, охрана труда, ПБ",        start: 49, len: 9,  color: "bg-violet-700" },
      { id: "p5", label: "Проект рекультивации",          start: 58, len: 8,  color: "bg-purple-600" },
      { id: "p6", label: "Сметная документация",          start: 66, len: 7,  color: "bg-purple-700" },
    ],
  },
  {
    title: "4. ОВОС",
    accent: "bg-teal-700",
    tasks: [
      { id: "e1", label: "Разработка тома ОВОС",          start: 23, len: 30, color: "bg-teal-500" },
      { id: "e2", label: "Подготовка к обсуждениям",      start: 53, len: 3,  color: "bg-teal-600" },
      { id: "e3", label: "Общественные обсуждения",       start: 56, len: 3,  color: "bg-teal-700" },
      { id: "e3m", label: "Протокол обсуждений",          start: 58, len: 1,  color: "bg-teal-900", milestone: true },
    ],
  },
  {
    title: "5. Согласования",
    accent: "bg-amber-600",
    tasks: [
      { id: "r1", label: "Росрыболовство (Новосибирск)",  start: 73, len: 15, color: "bg-amber-500" },
      { id: "r1m", label: "Согласование получено",        start: 87, len: 1,  color: "bg-amber-700", milestone: true },
    ],
  },
  {
    title: "6. Госэкспертиза",
    accent: "bg-orange-700",
    tasks: [
      { id: "exp1", label: "Подача документов",           start: 88, len: 2,  color: "bg-orange-400" },
      { id: "exp2", label: "Рассмотрение экспертизой",    start: 90, len: 21, color: "bg-orange-500" },
      { id: "exp3", label: "Устранение замечаний",        start: 111,len: 7,  color: "bg-orange-600" },
    ],
  },
  {
    title: "7. Финал",
    accent: "bg-emerald-700",
    tasks: [
      { id: "fin",  label: "Печать 3 экз + диск",         start: 118,len: 2,  color: "bg-emerald-500" },
      { id: "finm", label: "Итоговый акт + финал 40%",    start: 119,len: 1,  color: "bg-emerald-800", milestone: true },
    ],
  },
];

/* Маркеры месяцев (col index) */
const MONTH_MARKS = [
  { col: 0,  label: "Май" },
  { col: 30, label: "Июн" },
  { col: 61, label: "Июл" },
  { col: 91, label: "Авг" },
];

/* Ключевые точки */
const MILESTONES = [
  { day: 0,   label: "Старт. Аванс 30%",                     pct: "30%",  color: "bg-blue-700" },
  { day: 22,  label: "Акт изысканий. Платёж 30%",            pct: "30%",  color: "bg-violet-700" },
  { day: 73,  label: "Готовность ПД + ОВОС к согласованиям", pct: "—",    color: "bg-teal-700" },
  { day: 88,  label: "Согласование Росрыболовства",          pct: "—",    color: "bg-amber-600" },
  { day: 119, label: "Заключение госэкспертизы",             pct: "—",    color: "bg-orange-600" },
  { day: 120, label: "Передача документации. Финал 40%",     pct: "40%",  color: "bg-emerald-700" },
];

/* Состав работ */
const SCOPE_SECTIONS = [
  {
    icon: "Ruler",
    title: "Инженерные изыскания",
    color: "bg-blue-700",
    items: [
      "Инженерно-геодезические изыскания (топоплан М 1:500, инженерные сети, границы участка)",
      "Инженерно-геологические изыскания (бурение, физико-механические свойства грунтов)",
      "Инженерно-экологические изыскания (отбор проб грунта, анализ загрязнений)",
      "Инженерно-гидрометеорологические изыскания (влияние на р. Большая Камышная)",
    ],
  },
  {
    icon: "FileText",
    title: "Проектная документация (87-ПП, 509-ПП)",
    color: "bg-violet-700",
    items: [
      "Раздел 1: Пояснительная записка",
      "Раздел 2: Схема планировочной организации земельного участка",
      "Раздел 3: Архитектурные и конструктивные решения (обследование + демонтаж)",
      "Раздел 4: Сведения о сетях инженерно-технического обеспечения",
      "Раздел 5: Проект организации работ по сносу (ПОР)",
      "Раздел 6: Перечень мероприятий по охране окружающей среды",
      "Раздел 7: Мероприятия по обеспечению пожарной безопасности",
      "Раздел 8: Сметная документация (ТЕР Кемерово, текущий уровень цен)",
    ],
  },
  {
    icon: "Leaf",
    title: "ОВОС и экологическое сопровождение",
    color: "bg-teal-700",
    items: [
      "Оценка воздействия на окружающую среду (полный том)",
      "Презентация и материалы для общественных обсуждений",
      "Сопровождение на общественных обсуждениях",
    ],
  },
  {
    icon: "Shield",
    title: "Специальные разделы",
    color: "bg-amber-600",
    items: [
      "Проект рекультивации земель",
      "Оценка воздействия на гидрофауну р. Большая Камышная (для Верхнеобского управления)",
      "Мероприятия по обращению с отходами (классификация, утилизация)",
    ],
  },
  {
    icon: "CheckSquare",
    title: "Согласования и экспертиза",
    color: "bg-orange-600",
    items: [
      "Согласование с Верхнеобским территориальным управлением Росрыболовства (г. Новосибирск)",
      "Подготовка полного пакета для государственной экологической экспертизы",
      "Устранение замечаний госэкспертизы, допущенных по вине Исполнителя (1 цикл бесплатно)",
    ],
  },
  {
    icon: "Archive",
    title: "Итоговая документация",
    color: "bg-emerald-700",
    items: [
      "3 (три) экземпляра на бумажном носителе, сброшюрованных в тома",
      "Электронная версия: PDF, Word, dwg (AutoCAD) на оптическом диске или по эл. почте",
    ],
  },
];

const EXCLUSIONS = [
  { n: 1, text: "Публикации в СМИ (местные, региональные, федеральные)",                     ref: "п.15 ТЗ" },
  { n: 2, text: "Государственная пошлина за проведение экологической экспертизы",             ref: "п.17 ТЗ" },
  { n: 3, text: "Плата за согласования (если взимается сторонними организациями)",            ref: "п.17 ТЗ" },
  { n: 4, text: "Дополнительные циклы госэкспертизы (если вызваны изменением ТЗ или ИД)",    ref: "п.17 ТЗ" },
  { n: 5, text: "Работы, не предусмотренные разделом «Что входит»",                           ref: "—" },
];

const PAYMENTS = [
  { n: 1, stage: "Аванс",                pct: "30%", sum: "1 950 000", basis: "Подписание договора",                                                    color: "border-blue-300 bg-blue-50" },
  { n: 2, stage: "Промежуточный платёж", pct: "30%", sum: "1 950 000", basis: "Подписание акта сдачи изысканий и раздела ПД (ПОС + ПОД)",               color: "border-violet-300 bg-violet-50" },
  { n: 3, stage: "Финальный платёж",     pct: "40%", sum: "2 600 000", basis: "Подписание итогового акта + передача документации",                       color: "border-emerald-300 bg-emerald-50" },
];

function SectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mt-10 mb-4">
      <div className="w-1 h-6 rounded-full bg-blue-700 shrink-0" />
      <Icon name={icon} size={16} className="text-blue-700 shrink-0" />
      <h2 className="text-xs font-black uppercase tracking-widest text-gray-800">{children}</h2>
    </div>
  );
}

/* Ганта: ширина сетки = 100% минус колонка названий (200px).
   Каждый день = (100% / TOTAL_DAYS). Всё через left/width в % → нет горизонтального скролла. */
function GanttChart() {
  const pct = (days: number) => `${(days / TOTAL_DAYS) * 100}%`;

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm bg-white w-full">
      {/* Month header */}
      <div className="flex bg-gray-800 text-white">
        <div className="w-[200px] shrink-0 px-3 py-2 text-[9px] font-black uppercase tracking-wider text-gray-300 border-r border-gray-700">
          Этап / Работа
        </div>
        <div className="relative flex-1" style={{ height: 28 }}>
          {MONTH_MARKS.map((m) => (
            <div
              key={m.col}
              className="absolute top-0 h-full flex items-center justify-start pl-1.5 border-l border-gray-600 text-[9px] font-bold text-gray-300"
              style={{ left: pct(m.col) }}
            >
              {m.label}
            </div>
          ))}
          {/* Финальный маркер — день 120 */}
          <div
            className="absolute top-0 h-full border-l-2 border-emerald-400 border-dashed"
            style={{ left: "99.5%" }}
          />
        </div>
      </div>

      {/* Rows */}
      {SECTIONS.map((sec, si) => (
        <div key={sec.title}>
          {/* Section header */}
          <div className="flex border-b border-gray-100 bg-gray-50">
            <div className="w-[200px] shrink-0 px-3 py-1.5 flex items-center gap-2 border-r border-gray-200">
              <div className={`w-2 h-2 rounded-full ${sec.accent} shrink-0`} />
              <span className="text-[9px] font-black uppercase tracking-wider text-gray-600">{sec.title}</span>
            </div>
            <div className="relative flex-1" style={{ height: 22 }}>
              {MONTH_MARKS.map((m) => (
                <div key={m.col} className="absolute top-0 h-full border-l border-gray-100" style={{ left: pct(m.col) }} />
              ))}
            </div>
          </div>

          {/* Task rows */}
          {sec.tasks.map((task) => (
            <div key={task.id} className={`flex border-b border-gray-50 ${si % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
              <div className="w-[200px] shrink-0 px-3 py-1 flex items-center gap-1.5 border-r border-gray-100">
                {task.milestone ? (
                  <Icon name="Flag" size={9} className="text-gray-500 shrink-0" />
                ) : (
                  <div className={`w-1.5 h-1.5 rounded-sm ${task.color} shrink-0`} />
                )}
                <span className="text-[8.5px] text-gray-700 leading-tight">{task.label}</span>
              </div>
              <div className="relative flex-1" style={{ height: 22 }}>
                {MONTH_MARKS.map((m) => (
                  <div key={m.col} className="absolute top-0 h-full border-l border-gray-100" style={{ left: pct(m.col) }} />
                ))}
                {task.milestone ? (
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 ${task.color} opacity-90 z-10`}
                    style={{ left: `calc(${pct(task.start + task.len / 2)} - 5px)` }}
                  />
                ) : (
                  <div
                    className={`absolute top-1 bottom-1 ${task.color} opacity-90 rounded-sm`}
                    style={{ left: pct(task.start), width: `calc(${pct(task.len)} - 1px)` }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 border-t border-gray-200 flex-wrap">
        {[
          { color: "bg-blue-500",    label: "Изыскания" },
          { color: "bg-violet-600",  label: "Проектирование" },
          { color: "bg-teal-500",    label: "ОВОС" },
          { color: "bg-amber-500",   label: "Согласования" },
          { color: "bg-orange-500",  label: "Экспертиза" },
          { color: "bg-emerald-600", label: "Финал" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className={`w-3 h-2 rounded-sm ${color}`} />
            <span className="text-[8px] text-gray-500">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 ml-auto">
          <div className="w-2 h-2 rotate-45 bg-gray-700" />
          <span className="text-[8px] text-gray-500">Контрольная точка</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 border-t-2 border-dashed border-emerald-500" />
          <span className="text-[8px] text-gray-500">День 120 — финал</span>
        </div>
      </div>
    </div>
  );
}

export default function KPkyzbass() {
  return (
    <div className="bg-gray-50">
      {/* Sticky nav */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Лого" className="h-9 object-contain" />
            <div>
              <div className="font-black text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
              <div className="text-[10px] text-gray-500">КП № 43-ТП/2026 от 27.04.2026 · МКП «Тепло»</div>
            </div>
          </div>
          <Button onClick={() => window.print()} className="bg-blue-700 hover:bg-blue-800 text-white gap-2 text-sm">
            <Icon name="Printer" size={16} />
            Печать / PDF
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* ── HEADER ── */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white px-8 py-8">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="text-[9px] uppercase tracking-widest text-blue-300 mb-2">Коммерческое предложение</div>
                <h1 className="text-2xl font-black leading-tight mb-3">
                  Разработка проектной документации<br />
                  <span className="text-blue-300">для ликвидации объекта</span>
                </h1>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed max-w-xl">
                  ГЛД Топкинская кв-л №43 (Кемеровская ГРЭС, Очистные сооружения)<br />
                  Заказчик: <span className="font-bold text-white">МКП «Тепло»</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Проектная документация", "ОВОС", "Госэкспертиза", "120 к.д."].map((t) => (
                    <span key={t} className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white">{t}</span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[8px] text-blue-300 uppercase tracking-wider">Номер КП</div>
                <div className="font-black text-lg">43-ТП/2026</div>
                <div className="text-[10px] text-slate-400 mt-1">27 апреля 2026 г.</div>
                <div className="text-[10px] text-slate-400">г. Санкт-Петербург</div>
                <div className="mt-3 bg-emerald-600 rounded-xl px-4 py-2 text-center">
                  <div className="text-[9px] text-emerald-200">Итого с НДС 22%</div>
                  <div className="text-xl font-black text-white">6 500 000 ₽</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">

            {/* ── SUMMARY CARDS ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { icon: "Banknote",   value: "6 500 000 ₽",    label: "итого с НДС 22%",   color: "bg-emerald-600" },
                { icon: "Calendar",  value: "120 к.д.",         label: "срок выполнения",   color: "bg-blue-700" },
                { icon: "Lock",      value: "Фиксированная",    label: "цена (не меняется)", color: "bg-slate-700" },
                { icon: "MapPin",    value: "Кемерово",         label: "Кемеровская ГРЭС",  color: "bg-orange-600" },
              ].map(({ icon, value, label, color }) => (
                <div key={label} className="border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center shadow-sm bg-white">
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center mb-2`}>
                    <Icon name={icon} size={18} className="text-white" />
                  </div>
                  <div className="text-sm font-black text-gray-900 leading-tight">{value}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* ══════════════════════════════════════
                ── ДИАГРАММА ГАНТА (в самом начале) ──
            ══════════════════════════════════════ */}
            <SectionTitle icon="BarChart2">Дорожная карта — Диаграмма Ганта (120 к.д.)</SectionTitle>

            {/* Ганта */}
            <div className="gantt-print-wrapper">
              <GanttChart />
            </div>

            {/* Ключевые точки под диаграммой */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {MILESTONES.map((m) => (
                <div key={m.day} className="border border-gray-200 rounded-xl p-3 bg-white shadow-sm flex gap-3 items-start">
                  <div className={`w-8 h-8 rounded-full ${m.color} flex items-center justify-center shrink-0`}>
                    <span className="text-white text-[9px] font-black">{m.day === 0 ? "0" : m.day}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black text-gray-900 leading-tight">{m.label}</div>
                    {m.pct !== "—" && (
                      <div className="text-[9px] text-white font-bold px-1.5 py-0.5 rounded-md mt-1 inline-block bg-blue-700">{m.pct}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ── СТОРОНЫ ── */}
            <SectionTitle icon="Users">Стороны договора</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Заказчик</div>
                <div className="font-black text-sm text-gray-900">МКП «Тепло»</div>
                <div className="text-[10px] text-gray-500 mt-1 space-y-0.5">
                  <div>Объект: ГЛД Топкинская кв-л №43</div>
                  <div>Кемеровская ГРЭС, Очистные сооружения</div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Исполнитель</div>
                <img src={LOGO_URL} alt="Лого" className="h-7 object-contain mb-1.5" />
                <div className="font-black text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                <div className="text-[10px] text-gray-500 mt-1 space-y-0.5">
                  <div>ИНН 7814795454 · КПП 781401001</div>
                  <div>ОГРН 1217800122649</div>
                  <div>197341, г. Санкт-Петербург, Фермское шоссе, д. 12</div>
                </div>
              </div>
            </div>

            {/* ── СТОИМОСТЬ ── */}
            <SectionTitle icon="Banknote">Стоимость работ</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-3">
              <div className="grid grid-cols-[1fr_220px] bg-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-wider px-5 py-2 border-b border-gray-200">
                <div>Показатель</div>
                <div className="text-right">Сумма (руб.)</div>
              </div>
              {[
                { label: "Стоимость работ (без НДС)", value: "5 327 868" },
                { label: "НДС 22%",                   value: "1 172 132" },
              ].map(({ label, value }) => (
                <div key={label} className="grid grid-cols-[1fr_220px] px-5 py-3 border-b border-gray-100 bg-white">
                  <div className="text-xs text-gray-700">{label}</div>
                  <div className="text-sm font-semibold text-gray-900 text-right tabular-nums">{value}</div>
                </div>
              ))}
              <div className="grid grid-cols-[1fr_220px] px-5 py-4 bg-blue-700">
                <div className="text-sm font-black text-white">ИТОГО К ОПЛАТЕ</div>
                <div className="text-xl font-black text-white text-right tabular-nums">6 500 000</div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-start gap-2 text-[10px] text-amber-900 mb-6">
              <Icon name="Lock" size={12} className="text-amber-600 shrink-0 mt-0.5" />
              Цена фиксированная, включает все работы по ТЗ. <strong>&nbsp;Изменению не подлежит</strong> на весь срок действия договора.
            </div>

            {/* ── ОПЛАТА ── */}
            <SectionTitle icon="CreditCard">График оплаты (30 / 30 / 40)</SectionTitle>
            <div className="space-y-3 mb-4">
              {PAYMENTS.map((p) => (
                <div key={p.n} className={`border ${p.color} rounded-xl p-4 flex items-center gap-4`}>
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex flex-col items-center justify-center shrink-0 shadow-sm">
                    <div className="text-base font-black text-blue-700 leading-none">{p.pct}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-black text-gray-900">{p.stage}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1 leading-snug">
                      <Icon name="FileCheck" size={10} className="text-gray-400 shrink-0" />
                      {p.basis}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-gray-900 tabular-nums">{p.sum}</div>
                    <div className="text-[9px] text-gray-500">руб. (с НДС)</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-gray-500 mb-6 px-1">
              Все платежи — с НДС 22%. Возможна корректировка календаря платежей по согласованию с Заказчиком.
            </div>

            {/* ── СОСТАВ РАБОТ ── */}
            <SectionTitle icon="Package">Полный состав работ</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {SCOPE_SECTIONS.map((s) => (
                <div key={s.title} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className={`${s.color} px-4 py-2.5 flex items-center gap-2`}>
                    <Icon name={s.icon} size={14} className="text-white" />
                    <span className="text-xs font-black text-white">{s.title}</span>
                  </div>
                  <ul className="px-4 py-3 space-y-1.5 bg-white">
                    {s.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[10px] text-gray-700 leading-snug">
                        <Icon name="Check" size={10} className="text-emerald-600 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* ── НЕ ВХОДИТ ── */}
            <SectionTitle icon="XCircle">Что не входит в стоимость</SectionTitle>
            <div className="border border-red-200 rounded-xl overflow-hidden shadow-sm mb-8">
              <div className="bg-red-50 px-4 py-2 border-b border-red-200">
                <span className="text-[9px] font-black text-red-600 uppercase tracking-wider">Оплачивается Заказчиком отдельно</span>
              </div>
              {EXCLUSIONS.map((e, i) => (
                <div key={e.n} className={`flex items-start gap-3 px-4 py-2.5 ${i % 2 === 0 ? "bg-white" : "bg-red-50/30"} border-b border-red-100 last:border-b-0`}>
                  <Icon name="X" size={12} className="text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1 text-[10px] text-gray-700 leading-snug">{e.text}</div>
                  <div className="text-[9px] font-bold text-red-500 shrink-0">{e.ref}</div>
                </div>
              ))}
            </div>

            {/* ── СРОКИ ── */}
            <SectionTitle icon="Clock">Сроки выполнения</SectionTitle>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
                  <div className="text-center">
                    <div className="text-xl font-black text-white leading-none">120</div>
                    <div className="text-[8px] text-blue-200">к.д.</div>
                  </div>
                </div>
                <div>
                  <div className="font-black text-sm text-gray-900">Общая продолжительность</div>
                  <div className="text-xs text-gray-600 mt-0.5">от даты старта до подписания итогового акта</div>
                </div>
              </div>
              <div className="text-[10px] text-gray-700 leading-relaxed">
                <strong>Старт:</strong> следующий день после подписания договора, получения аванса (30%) и передачи исходных данных по п.8 ТЗ.<br />
                <strong>Финиш:</strong> подписание итогового акта и передача документации (3 экз. + диск).
              </div>
            </div>

            {/* ── ПОДПИСИ ── */}
            <div className="border-t-2 border-gray-800 pt-6 flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">С уважением,</p>
                <p className="text-xs font-black text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</p>
                <p className="text-[10px] text-gray-500">ИНН 7814795454 · КПП 781401001 · ОГРН 1217800122649</p>
                <p className="text-[10px] text-gray-500">197341, г. Санкт-Петербург, Фермское шоссе, д. 12</p>
              </div>
              <img src={STAMP_URL} alt="Печать" className="h-20 w-20 object-contain opacity-90" />
            </div>
            <div className="grid grid-cols-2 gap-10 mt-6 pt-4 border-t border-dashed border-gray-300">
              {["Руководитель / _______________", "Заказчик / _______________"].map((label) => (
                <div key={label}>
                  <div className="border-b border-gray-400 pb-5 mb-1" />
                  <div className="text-[9px] text-gray-400">{label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; }
          .print\\:hidden { display: none !important; }
          @page { margin: 8mm; size: A4 landscape; }

          /* Нет пустого листа в конце */
          html, body { height: auto !important; overflow: visible !important; }

          /* Диаграмма Ганта — резиновая, занимает всю ширину */
          .gantt-print-wrapper {
            width: 100% !important;
          }
          .gantt-print-wrapper > div {
            width: 100% !important;
          }

          /* Убираем тени и скругления для экономии места */
          .shadow-lg, .shadow-sm, .shadow { box-shadow: none !important; }
          .rounded-2xl, .rounded-xl { border-radius: 4px !important; }

          /* Переносы страниц */
          .page-break-before { page-break-before: always; }
        }
      `}</style>
    </div>
  );
}