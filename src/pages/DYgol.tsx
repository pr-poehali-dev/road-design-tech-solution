import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

// ── Gantt data ──
const GANTT_STAGES = [
  { id: 0, label: "Этап 0\nСтарт", color: "#1e40af", start: 0, end: 1, milestones: [{ w: 1, label: "Договор", payment: "7.5 млн (30%)" }] },
  { id: 1, label: "Этап 1\nПланирование", color: "#1d4ed8", start: 1, end: 3, milestones: [{ w: 3, label: "Программы согласованы", payment: "5.0 млн (20%)" }] },
  { id: 2, label: "Этап 2\nИзыскания", color: "#0369a1", start: 3, end: 7, milestones: [] },
  { id: 3, label: "Этап 3\nЛаборатория", color: "#0891b2", start: 3, end: 11, milestones: [{ w: 11, label: "Лаборатории готовы", payment: "3.75 млн (15%)" }] },
  { id: 4, label: "Этап 4\nТР, ТУ, схемы", color: "#4f46e5", start: 7, end: 13, milestones: [] },
  { id: 5, label: "Этап 5\nОВОС", color: "#7c3aed", start: 11, end: 19, milestones: [] },
  { id: 6, label: "Этап 6\nСметы", color: "#6d28d9", start: 19, end: 22, milestones: [] },
  { id: 7, label: "Этап 7\nАпробация", color: "#059669", start: 13, end: 25, milestones: [{ w: 25, label: "Апробация завершена", payment: "3.75 млн (15%)" }] },
  { id: 8, label: "Этап 8\nКорректировка", color: "#0f766e", start: 25, end: 28, milestones: [] },
  { id: 9, label: "Этап 9\nОбщ.обсуждения", color: "#b45309", start: 28, end: 34, milestones: [] },
  { id: 10, label: "Этап 10\nРосрыболовство", color: "#92400e", start: 28, end: 36, milestones: [] },
  { id: 11, label: "Этап 11\nПередача в ГЭЭ", color: "#dc2626", start: 34, end: 35, milestones: [{ w: 35, label: "Передача в ГЭЭ", payment: "2.5 млн (10%)" }] },
  { id: 12, label: "Этап 12\nГЭЭ", color: "#b91c1c", start: 35, end: 47, milestones: [{ w: 47, label: "Положит. заключение ГЭЭ", payment: "2.5 млн (10%)" }] },
  { id: 13, label: "Этап 13\nПередача", color: "#374151", start: 47, end: 48, milestones: [{ w: 48, label: "Акт сдачи-приёмки", payment: "" }] },
];

const TOTAL_WEEKS = 48;

// ── Deliverables ──
const DELIVERABLES = [
  { n: 1, result: "Программа инженерных изысканий", form: "PDF + Word", to: "Заказчик", week: "Нед.2" },
  { n: 2, result: "Программа лабораторных исследований", form: "PDF + Word", to: "Заказчик", week: "Нед.2" },
  { n: 3, result: "Программа апробации", form: "PDF + Word", to: "Заказчик", week: "Нед.3" },
  { n: 4, result: "Технический отчёт по изысканиям", form: "PDF + DWG", to: "Заказчик", week: "Нед.7" },
  { n: 5, result: "Протоколы лабораторных испытаний (аккред.)", form: "PDF (скан)", to: "Заказчик", week: "Нед.11" },
  { n: 6, result: "Черновики ТР, ТУ, технологической схемы", form: "PDF + Word", to: "Заказчик", week: "Нед.13" },
  { n: 7, result: "Том ОВОС", form: "PDF + Word", to: "Заказчик", week: "Нед.19" },
  { n: 8, result: "Сметная документация (ГРАНД + Excel)", form: ".xlsx, .grd", to: "Заказчик", week: "Нед.22" },
  { n: 9, result: "Отчёт по апробации + рекомендации по биоэтапу", form: "PDF + Word", to: "Заказчик", week: "Нед.25" },
  { n: 10, result: "Финальные версии ТР, ТУ, ОВОС (скорректированные)", form: "PDF + Word", to: "Заказчик → ГЭЭ", week: "Нед.28" },
  { n: 11, result: "Протокол общественных обсуждений", form: "PDF (скан)", to: "Заказчик → ГЭЭ", week: "Нед.34" },
  { n: 12, result: "Заключение Росрыболовства", form: "PDF (скан)", to: "Заказчик → ГЭЭ", week: "Нед.36" },
  { n: 13, result: "Положительное заключение ГЭЭ", form: "Оригинал", to: "Заказчик", week: "15.11.2026" },
  { n: 14, result: "Полный комплект документации (4 бум. + эл.)", form: "Акт приёма-передачи", to: "Заказчик", week: "Нед.48" },
];

// ── Milestones ──
const MILESTONES = [
  { week: 1, label: "Договор", payment: "7 500 000 руб.", pct: "30%" },
  { week: 3, label: "Программы согласованы", payment: "5 000 000 руб.", pct: "20%" },
  { week: 11, label: "Лаборатории готовы", payment: "3 750 000 руб.", pct: "15%" },
  { week: 25, label: "Апробация завершена", payment: "3 750 000 руб.", pct: "15%" },
  { week: 35, label: "Передача в ГЭЭ", payment: "2 500 000 руб.", pct: "10%" },
  { week: 47, label: "Положительное заключение ГЭЭ", payment: "2 500 000 руб.", pct: "10%" },
  { week: 48, label: "Акт сдачи-приёмки", payment: "", pct: "" },
];

// ── KPI ──
const KPIS = [
  { label: "Соблюдение финального срока (15.11.2026)", target: "Достигнуто", control: "Акт приёмки" },
  { label: "Положительное заключение ГЭЭ", target: "Получено", control: "Оригинал на руках" },
  { label: "Качество документации (замечания ГЭЭ)", target: "Не более 10 замечаний", control: "Протоколы ГЭЭ" },
  { label: "Своевременность ежемесячных отчётов", target: "100%", control: "Реестр переданных документов" },
  { label: "Участие в ВКС", target: "100% (без пропусков)", control: "Журнал совещаний" },
];

// ── Risks ──
const RISKS = [
  { risk: "Несоответствие отходов требованиям", prob: "Средняя", prob_color: "bg-yellow-100 text-yellow-800", action: "Заложены 3 альтернативных состава", buffer: "2 нед." },
  { risk: "Задержка выдачи разрешения на изыскания", prob: "Низкая", prob_color: "bg-green-100 text-green-800", action: "Параллельная подача документов", buffer: "1 нед." },
  { risk: "Неблагоприятные погодные условия для апробации", prob: "Средняя", prob_color: "bg-yellow-100 text-yellow-800", action: "Окно в графике 2 недели", buffer: "2 нед." },
  { risk: "Общественные слушания сорваны (явка менее 50%)", prob: "Низкая", prob_color: "bg-green-100 text-green-800", action: "Информирование через СМИ, админ. ресурс", buffer: "2 нед." },
  { risk: "Эксперты ГЭЭ запросили доработку", prob: "Высокая", prob_color: "bg-red-100 text-red-800", action: "Предварительная негосударственная экспертиза", buffer: "4 нед." },
  { risk: "Смена ключевого персонала Исполнителя", prob: "Низкая", prob_color: "bg-green-100 text-green-800", action: "Назначение заместителя с самого старта", buffer: "1 нед." },
];

// ── Management ──
const MGMT = [
  { el: "Руководитель проекта (Исполнитель)", desc: "Одно лицо с правом подписи, несёт полную ответственность за сроки и качество" },
  { el: "Куратор (Заказчик)", desc: "П.А. Подосинников (согласно ТЗ п.24)" },
  { el: "Периодичность отчётности", desc: "Еженедельно — краткий отчёт (Excel), ежемесячно — развёрнутый отчёт (Word/PDF)" },
  { el: "Совещания", desc: "Еженедельные ВКС (п.10.4 ТЗ) с протоколом и фиксацией решений" },
  { el: "Система контроля", desc: "8 контрольных точек (вех) с подтверждением приёмки" },
  { el: "Документооборот", desc: "ЭДО / сканы с ЭЦП / оригиналы по требованию" },
];

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 mt-8 first:mt-0">
      <div className="h-5 w-1 rounded-full bg-blue-700 shrink-0" />
      <h2 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
        {icon && <Icon name={icon} size={15} className="text-blue-600" />}
        {children}
      </h2>
    </div>
  );
}

function GanttChart() {
  const colW = 100 / TOTAL_WEEKS;

  // week ticks every 4 weeks
  const ticks = Array.from({ length: Math.floor(TOTAL_WEEKS / 4) + 1 }, (_, i) => i * 4);

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: 900 }}>
        {/* Week axis */}
        <div className="flex items-end mb-1" style={{ paddingLeft: 140 }}>
          {ticks.map((w) => (
            <div
              key={w}
              style={{ width: `${colW * 4 * 100}%`, minWidth: 0 }}
              className="text-[9px] text-gray-400 font-bold border-l border-gray-200 pl-0.5"
            >
              Нед.{w}
            </div>
          ))}
        </div>

        {/* Rows */}
        {GANTT_STAGES.map((stage) => {
          const leftPct = (stage.start / TOTAL_WEEKS) * 100;
          const widthPct = ((stage.end - stage.start) / TOTAL_WEEKS) * 100;
          return (
            <div key={stage.id} className="flex items-center mb-1.5">
              {/* Label */}
              <div
                className="text-[9px] font-bold text-gray-700 leading-tight shrink-0 pr-2 text-right whitespace-pre-line"
                style={{ width: 140 }}
              >
                {stage.label}
              </div>
              {/* Track */}
              <div className="flex-1 relative h-5">
                {/* bg grid lines */}
                {ticks.map((w) => (
                  <div
                    key={w}
                    className="absolute top-0 bottom-0 border-l border-gray-100"
                    style={{ left: `${(w / TOTAL_WEEKS) * 100}%` }}
                  />
                ))}
                {/* Bar */}
                <div
                  className="absolute top-0.5 bottom-0.5 rounded-sm flex items-center px-1.5"
                  style={{
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    backgroundColor: stage.color,
                    minWidth: 4,
                  }}
                >
                  <span className="text-white text-[8px] font-bold truncate">
                    {stage.end - stage.start > 2 ? `${stage.end - stage.start} нед.` : ""}
                  </span>
                </div>
                {/* Milestones */}
                {stage.milestones.map((m) => (
                  <div
                    key={m.w}
                    className="absolute top-0 bottom-0 flex items-center"
                    style={{ left: `${(m.w / TOTAL_WEEKS) * 100}%` }}
                  >
                    <div className="w-3 h-3 rotate-45 bg-amber-400 border-2 border-amber-600 shrink-0 -ml-1.5" title={m.label} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Payment milestones row */}
        <div className="flex items-center mt-3 mb-1">
          <div className="text-[9px] font-black text-gray-500 uppercase tracking-wider shrink-0 pr-2 text-right" style={{ width: 140 }}>
            Оплаты 💰
          </div>
          <div className="flex-1 relative h-6">
            {ticks.map((w) => (
              <div key={w} className="absolute top-0 bottom-0 border-l border-gray-100" style={{ left: `${(w / TOTAL_WEEKS) * 100}%` }} />
            ))}
            {MILESTONES.filter((m) => m.payment).map((m) => (
              <div
                key={m.week}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${(m.week / TOTAL_WEEKS) * 100}%` }}
              >
                <div className="w-3 h-3 rotate-45 bg-emerald-500 border-2 border-emerald-700 shrink-0" />
                <div className="text-[7px] font-bold text-emerald-700 whitespace-nowrap mt-0.5">{m.pct}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 pl-36 text-[9px] text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rotate-45 bg-amber-400 border border-amber-600" />
            <span>Веха</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rotate-45 bg-emerald-500 border border-emerald-700" />
            <span>Оплата</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DYgol() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Лого" className="h-9 object-contain" />
            <div>
              <div className="font-bold text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
              <div className="text-xs text-gray-500">Дорожная карта · ТЗ 7032_УООС · 48 недель</div>
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
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-8 py-7">
            <div className="text-[10px] uppercase tracking-widest text-blue-300 mb-1">Дорожная карта проекта</div>
            <h1 className="text-xl font-black leading-snug mb-3 max-w-3xl">
              Разработка технологии производства и применения материала из отходов обогащения угля для благоустройства нарушенных земель
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 text-xs">
              {[
                { label: "Номер ТЗ", value: "7032_УООС" },
                { label: "Заказчик", value: "АО «ЦОФ Кузнецкая» / «Распадская угольная компания»" },
                { label: "Исполнитель", value: "ООО «Капстрой-Инжиниринг»" },
                { label: "Общая стоимость", value: "25 000 000 руб. (с НДС 22%)" },
                { label: "Срок финиша", value: "15.11.2026 (жёсткий)" },
                { label: "Длительность", value: "48 недель (11 месяцев)" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[9px] text-blue-300 uppercase tracking-wider">{label}</div>
                  <div className="font-semibold text-white leading-snug">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">

            {/* ── SUMMARY CARDS ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { icon: "LayoutList", value: "14 этапов", label: "реализации", color: "bg-blue-700" },
                { icon: "Flag", value: "8 вех", label: "контрольных точек", color: "bg-amber-600" },
                { icon: "Banknote", value: "6 платежей", label: "поэтапная оплата", color: "bg-emerald-600" },
                { icon: "Calendar", value: "48 недель", label: "до 15.11.2026", color: "bg-violet-700" },
              ].map(({ icon, value, label, color }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center shadow-sm">
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center mb-2`}>
                    <Icon name={icon} size={18} className="text-white" />
                  </div>
                  <div className="text-lg font-black text-gray-900">{value}</div>
                  <div className="text-[10px] text-gray-500">{label}</div>
                </div>
              ))}
            </div>

            {/* ── GANTT ── */}
            <SectionTitle icon="BarChart2">Диаграмма Ганта — понедельный план</SectionTitle>
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-4 overflow-hidden">
              <GanttChart />
            </div>

            {/* ── PAYMENT SCHEDULE ── */}
            <SectionTitle icon="Banknote">График платежей</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-2">
              <div className="grid grid-cols-[60px_1fr_160px_100px] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div>Неделя</div>
                <div>Событие / Веха</div>
                <div>Сумма</div>
                <div>% договора</div>
              </div>
              {MILESTONES.map((m, i) => (
                <div key={i} className={`grid grid-cols-[60px_1fr_160px_100px] px-4 py-3 border-b border-gray-100 last:border-0 items-center ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[9px] font-black">{m.week}</div>
                  </div>
                  <div className="text-xs text-gray-800 font-medium leading-snug">{m.label}</div>
                  <div className={`text-xs font-black ${m.payment ? "text-emerald-700" : "text-gray-400"}`}>{m.payment || "—"}</div>
                  <div className="text-xs font-bold text-gray-600">{m.pct || "—"}</div>
                </div>
              ))}
              <div className="grid grid-cols-[60px_1fr_160px_100px] px-4 py-3 bg-blue-700 items-center">
                <div />
                <div className="text-xs font-black text-white">ИТОГО</div>
                <div className="text-sm font-black text-white">25 000 000 руб.</div>
                <div className="text-xs font-black text-blue-200">100%</div>
              </div>
            </div>

            {/* ── MANAGEMENT ── */}
            <SectionTitle icon="Users">Раздел 1. Структура управления и отчётности</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-2">
              <div className="grid grid-cols-[220px_1fr] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div>Элемент</div>
                <div>Описание</div>
              </div>
              {MGMT.map((r, i) => (
                <div key={i} className={`grid grid-cols-[220px_1fr] px-4 py-3 border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <div className="text-xs font-bold text-gray-800 leading-snug pr-3">{r.el}</div>
                  <div className="text-xs text-gray-600 leading-snug">{r.desc}</div>
                </div>
              ))}
            </div>

            {/* ── DELIVERABLES ── */}
            <SectionTitle icon="FileCheck">Раздел 2. Поставляемые результаты</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-2">
              <div className="grid grid-cols-[32px_1fr_100px_140px_72px] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div>№</div>
                <div>Результат</div>
                <div>Форма</div>
                <div>Кому</div>
                <div>Срок</div>
              </div>
              {DELIVERABLES.map((d, i) => (
                <div key={d.n} className={`grid grid-cols-[32px_1fr_100px_140px_72px] px-4 py-2.5 border-b border-gray-100 last:border-0 items-center ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-white text-[9px] font-black">{d.n}</div>
                  <div className="text-xs text-gray-800 leading-snug pr-2">{d.result}</div>
                  <div className="text-[10px] text-gray-500 font-mono">{d.form}</div>
                  <div className="text-[10px] text-gray-600">{d.to}</div>
                  <div className="text-[10px] font-bold text-blue-700">{d.week}</div>
                </div>
              ))}
            </div>

            {/* ── STAGE DETAILS ── */}
            <SectionTitle icon="ClipboardList">Раздел 3. Детальный план по этапам</SectionTitle>

            {/* Stages grid */}
            <div className="space-y-4 mb-2">

              {/* Stage 0 */}
              <StageCard color="#1e40af" stage="Этап 0" title="Организационный старт" weeks="Недели 0–1" items={[
                { w: "0", action: "Подписание договора, выставление счёта на аванс 30%", resp: "Юристы, Менеджер", result: "Договор, счёт" },
                { w: "0,5", action: "Оплата аванса (7 500 000 руб.)", resp: "Заказчик", result: "Платёж" },
                { w: "1", action: "Назначение руководителя проекта, техдиректора, эколога, лаборантов", resp: "Исполнитель", result: "Приказы" },
                { w: "1", action: "Стартовое совещание с Заказчиком", resp: "Руководитель проекта", result: "Протокол" },
                { w: "1", action: "Передача исходных данных (результаты анализов отходов по п.19 ТЗ)", resp: "Заказчик", result: "Акт приёма-передачи" },
              ]} />

              {/* Stage 1 */}
              <StageCard color="#1d4ed8" stage="Этап 1" title="Аналитика и планирование" weeks="Недели 1–3" items={[
                { w: "1", action: "Анализ ТЗ, исходных данных, ограничений (реестр: Красные книги, ОКН, водные объекты)", resp: "Технический директор", result: "Реестр ограничений" },
                { w: "1", action: "Анализ применимых НДТ (справочники ИТС)", resp: "Эколог", result: "Перечень НДТ" },
                { w: "2", action: "Разработка программы инженерных изысканий", resp: "Геодезист/геолог", result: "Программа изысканий" },
                { w: "2", action: "Разработка программы лабораторных исследований", resp: "Лаборатория", result: "Программа испытаний" },
                { w: "2–3", action: "Разработка программы апробации (выбор модельной площадки)", resp: "Технический директор", result: "Программа апробации" },
                { w: "3", action: "Согласование всех трёх программ с Заказчиком + оплата 20% (5 000 000 руб.)", resp: "Руководитель проекта", result: "Протокол согласования" },
              ]} />

              {/* Stage 2 */}
              <StageCard color="#0369a1" stage="Этап 2" title="Инженерные изыскания" weeks="Недели 3–7" items={[
                { w: "3", action: "Получение разрешений на производство изысканий", resp: "Геодезист", result: "Разрешения администрации" },
                { w: "4", action: "Геодезическая съёмка модельной площадки (М 1:500)", resp: "Геодезист", result: "Цифровая модель рельефа" },
                { w: "4–5", action: "Бурение скважин (3–5 скважин глубиной до 5 м)", resp: "Геолог", result: "Колонки грунта" },
                { w: "5", action: "Лабораторные определения грунтов (аккред.)", resp: "Лаборатория", result: "Физико-механические свойства" },
                { w: "6", action: "Экологические изыскания (фоновые пробы почв, вод, атмосферы)", resp: "Эколог", result: "Протоколы фоновых концентраций" },
                { w: "6–7", action: "Камеральная обработка, подготовка технического отчёта", resp: "Геодезист/геолог", result: "Технический отчёт по изысканиям" },
              ]} />

              {/* Stage 3 */}
              <StageCard color="#0891b2" stage="Этап 3" title="Лабораторные исследования" weeks="Недели 3–11" items={[
                { w: "3", action: "Отбор проб отходов на ЦОФ «Кузнецкая»", resp: "Лаборант/технолог", result: "Акт отбора, фотофиксация" },
                { w: "4", action: "Химический анализ (валовый состав, тяжёлые металлы Pb, Cd, Hg, As, Cr, Cu, Zn, Ni)", resp: "Аккред. лаборатория", result: "Протоколы" },
                { w: "4–5", action: "Радиологический анализ (удельная активность радионуклидов)", resp: "Аккред. лаборатория", result: "Радиологический паспорт" },
                { w: "5", action: "Токсикологический анализ (биотестирование, класс опасности)", resp: "Аккред. лаборатория", result: "Класс опасности" },
                { w: "6", action: "Производство экспериментальных партий материала (3–5 рецептур)", resp: "Технолог", result: "Образцы материала" },
                { w: "6–9", action: "Физико-механические, фильтрационные, экотоксикологические испытания материала", resp: "Аккред. лаборатория", result: "Протоколы испытаний" },
                { w: "10–11", action: "Сводный отчёт по лабораторным испытаниям + оплата 15% (3 750 000 руб.)", resp: "Технический директор", result: "Том лабораторных испытаний" },
              ]} />

              {/* Stage 4 */}
              <StageCard color="#4f46e5" stage="Этап 4" title="Разработка технической документации" weeks="Недели 7–13" items={[
                { w: "7–8", action: "Технические условия (ТУ): область применения, техтребования, методы контроля", resp: "Технолог", result: "ТУ (черновик)" },
                { w: "8–9", action: "Технологический регламент (ТР): пооперационное описание, расходные нормы, ППК", resp: "Технолог", result: "ТР (черновик)" },
                { w: "9–10", action: "Технологическая схема производства (DWG — расположение оборудования, потоки сырья)", resp: "Технолог/проектировщик", result: "Схема DWG" },
                { w: "10–11", action: "Технологическая карта применения на объекте (укладка, уплотнение, планировка)", resp: "Технолог", result: "Техкарта" },
                { w: "11–12", action: "ВМТР: перечень материалов, оборудования, машин для производства и применения", resp: "Сметчик", result: "ВМТР" },
                { w: "12–13", action: "Расчёт себестоимости производства материала (1 т / 1 м³)", resp: "Сметчик", result: "Расчёт себестоимости" },
                { w: "13", action: "Передача черновиков ТР, ТУ, схем Заказчику для предварительного согласования", resp: "Руководитель проекта", result: "Комплект для согласования" },
              ]} />

              {/* Stage 5 */}
              <StageCard color="#7c3aed" stage="Этап 5" title="ОВОС и природоохранные мероприятия" weeks="Недели 11–19" items={[
                { w: "11–12", action: "Сбор исходных данных по компонентам ОС (климат, фоновые концентрации, ООПТ)", resp: "Эколог", result: "Исходные данные" },
                { w: "12–13", action: "Анализ альтернатив: 3 сценария (с материалом / без материала / отказ)", resp: "Эколог", result: "Таблица альтернатив" },
                { w: "13–15", action: "Оценка воздействия на атмосферный воздух (УПРЗА «Эколог», приземные концентрации)", resp: "Эколог", result: "Расчёт рассеивания" },
                { w: "14–16", action: "Оценка воздействия на водные объекты (р. Есаулка, Щедруха, Томь)", resp: "Эколог", result: "Расчёт водного баланса" },
                { w: "15–17", action: "Оценка воздействия на почвы, геологическую среду, отходы производства", resp: "Эколог", result: "Расчёты воздействия" },
                { w: "17–19", action: "Разработка НДТ-мероприятий, оформление тома ОВОС, передача Заказчику", resp: "Эколог", result: "Том ОВОС" },
              ]} />

              {/* Stage 6 */}
              <StageCard color="#6d28d9" stage="Этап 6" title="Сметная документация" weeks="Недели 19–22" items={[
                { w: "19", action: "Сбор сметно-нормативной базы (ФЕР-2021, текущие индексы Минстроя)", resp: "Сметчик", result: "НСБ актуализирована" },
                { w: "20", action: "Локальные сметы на производство материала (ГРАНД-Смета + Excel)", resp: "Сметчик", result: "Локальные сметы" },
                { w: "20–21", action: "Локальные сметы на благоустройство (вертикальная планировка 39,7971 га)", resp: "Сметчик", result: "Локальные сметы" },
                { w: "21–22", action: "Объектные сметы, внутренняя проверка, корректировка", resp: "Сметчик", result: "Объектные сметы" },
                { w: "22", action: "Передача сметной документации Заказчику", resp: "Руководитель проекта", result: "Акт приёмки" },
              ]} />

              {/* Stage 7 */}
              <StageCard color="#059669" stage="Этап 7" title="Апробация на модельной площадке" weeks="Недели 13–25" items={[
                { w: "13–14", action: "Подготовка площадки + фоновый мониторинг (почва, вода, воздух, шум)", resp: "Технолог/эколог", result: "Пробы фона" },
                { w: "14", action: "Производство опытно-промышленной партии материала (50–100 т)", resp: "Технолог", result: "Партия материала" },
                { w: "15–17", action: "Укладка материала послойно с уплотнением, формирование поверхности", resp: "Технолог", result: "Уложенный слой" },
                { w: "18–22", action: "Постаперационный мониторинг (каждые 2 недели, 3 цикла): почва, вода, воздух", resp: "Эколог/лаборатория", result: "Протоколы мониторинга" },
                { w: "23–24", action: "Визуальное обследование, финальный отбор проб (через 8+ недель)", resp: "Эколог/лаборатория", result: "Финальные протоколы" },
                { w: "24–25", action: "Обработка результатов, написание отчёта + оплата 15% (3 750 000 руб.)", resp: "Технический директор", result: "Отчёт по апробации" },
              ]} />

              {/* Stage 8 */}
              <StageCard color="#0f766e" stage="Этап 8" title="Корректировка документации" weeks="Недели 25–28" items={[
                { w: "25–26", action: "Анализ расхождений лабораторных и натурных данных", resp: "Технолог", result: "Протокол расхождений" },
                { w: "26", action: "Корректировка ТУ (уточнение показателей качества)", resp: "Технолог", result: "ТУ финальные" },
                { w: "26–27", action: "Корректировка ТР (изменение режимов, добавление операций)", resp: "Технолог", result: "ТР финальный" },
                { w: "27", action: "Корректировка ОВОС (уточнение воздействия по данным мониторинга)", resp: "Эколог", result: "ОВОС финальный" },
                { w: "27–28", action: "Разработка рекомендаций по биологическому этапу рекультивации (п.18.2 ТЗ)", resp: "Эколог", result: "Рекомендации" },
                { w: "28", action: "Финальные версии ТР, ТУ, ОВОС — готовность к экспертизам", resp: "Руководитель проекта", result: "Комплект для ГЭЭ" },
              ]} />

              {/* Stage 9 */}
              <StageCard color="#b45309" stage="Этап 9" title="Общественные обсуждения" weeks="Недели 28–34" items={[
                { w: "28", action: "Подготовка материалов для общественных обсуждений (ООС)", resp: "Эколог", result: "Материалы ООС" },
                { w: "28–29", action: "Размещение на площадках (сайт, администрация, СМИ)", resp: "Эколог", result: "Публикации" },
                { w: "30–31", action: "Период приёма замечаний (не менее 30 дней согласно 1644 ПП РФ)", resp: "Администрация", result: "Замечания" },
                { w: "32", action: "Обработка замечаний, подготовка ответов", resp: "Эколог", result: "Сводка ответов" },
                { w: "33–34", action: "Публичные слушания / общественные обсуждения (выездное мероприятие)", resp: "Руководитель проекта", result: "Протокол слушаний" },
              ]} />

              {/* Stage 10 */}
              <StageCard color="#92400e" stage="Этап 10" title="Согласование с Росрыболовством" weeks="Недели 28–36" items={[
                { w: "28", action: "Подготовка пакета документов (заявление, ОВОС, материалы обсуждений)", resp: "Эколог", result: "Пакет документов" },
                { w: "29", action: "Подача в Росрыболовство (Верхнеобское БВУ)", resp: "Руководитель проекта", result: "Входящий номер" },
                { w: "30–35", action: "Рассмотрение, ответы на запросы дополнительных материалов", resp: "Эколог", result: "Ответы на запросы" },
                { w: "35–36", action: "Получение заключения Росрыболовства, передача Заказчику", resp: "Руководитель проекта", result: "Заключение" },
              ]} />

              {/* Stage 11 */}
              <StageCard color="#dc2626" stage="Этап 11" title="Передача комплекта в ГЭЭ" weeks="Недели 34–35" items={[
                { w: "34", action: "Комплектация полного тома документации для ГЭЭ (состав по 174-ФЗ)", resp: "Технический директор", result: "Том документации" },
                { w: "34–35", action: "Подача заявления и документов в Росприроднадзор / орган ГЭЭ", resp: "Руководитель проекта", result: "Акт передачи" },
                { w: "35", action: "Акт передачи в ГЭЭ + оплата 10% (2 500 000 руб.)", resp: "Заказчик", result: "Платёж" },
              ]} />

              {/* Stage 12 */}
              <StageCard color="#b91c1c" stage="Этап 12" title="Сопровождение ГЭЭ" weeks="Недели 35–47" items={[
                { w: "35–36", action: "Регистрация заявления, назначение экспертной комиссии", resp: "Росприроднадзор", result: "Регистрация" },
                { w: "37–40", action: "Рассмотрение, промежуточные замечания экспертов", resp: "Эксперты ГЭЭ", result: "Замечания" },
                { w: "41–43", action: "Устранение замечаний (дополнительные расчёты, обоснования)", resp: "Технический директор", result: "Ответы" },
                { w: "44–46", action: "Повторная проверка, подготовка итогового заключения", resp: "Эксперты ГЭЭ", result: "Проект заключения" },
                { w: "47", action: "Получение положительного заключения ГЭЭ + оплата 10% (2 500 000 руб.)", resp: "Руководитель проекта", result: "Оригинал заключения ГЭЭ" },
              ]} />

              {/* Stage 13 */}
              <StageCard color="#374151" stage="Этап 13" title="Финальная передача документации" weeks="Недели 47–48" items={[
                { w: "47", action: "Печать документации (4 экз.), брошюровка, нумерация", resp: "Исполнитель", result: "4 экземпляра" },
                { w: "47–48", action: "Формирование электронного тома (PDF с оглавлением и закладками, DWG, XLSX)", resp: "Исполнитель", result: "Носитель" },
                { w: "48", action: "Подписание акта приёма-передачи", resp: "Руководитель проекта", result: "Акт подписан" },
                { w: "48", action: "Закрытие договора", resp: "Юристы", result: "Договор закрыт" },
              ]} />
            </div>

            {/* ── KPI ── */}
            <SectionTitle icon="Target">Раздел 5. Ключевые показатели (KPI)</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-2">
              <div className="grid grid-cols-[1fr_160px_200px] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div>Показатель</div>
                <div>Целевое значение</div>
                <div>Способ контроля</div>
              </div>
              {KPIS.map((k, i) => (
                <div key={i} className={`grid grid-cols-[1fr_160px_200px] px-4 py-3 border-b border-gray-100 last:border-0 items-center ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <div className="text-xs text-gray-800 leading-snug pr-3">{k.label}</div>
                  <div className="text-xs font-bold text-emerald-700">{k.target}</div>
                  <div className="text-xs text-gray-600">{k.control}</div>
                </div>
              ))}
            </div>

            {/* ── RISKS ── */}
            <SectionTitle icon="AlertTriangle">Раздел 6. Риски и упреждающие действия</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-2">
              <div className="grid grid-cols-[1fr_80px_1fr_60px] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div>Риск</div>
                <div>Вероятность</div>
                <div>Упреждающее действие</div>
                <div>Буфер</div>
              </div>
              {RISKS.map((r, i) => (
                <div key={i} className={`grid grid-cols-[1fr_80px_1fr_60px] px-4 py-3 border-b border-gray-100 last:border-0 items-start ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <div className="text-xs text-gray-800 leading-snug pr-2">{r.risk}</div>
                  <div><span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${r.prob_color}`}>{r.prob}</span></div>
                  <div className="text-xs text-gray-600 leading-snug pr-2">{r.action}</div>
                  <div className="text-xs font-bold text-blue-700">{r.buffer}</div>
                </div>
              ))}
            </div>

            {/* ── REPORT TEMPLATE ── */}
            <SectionTitle icon="FileText">Раздел 7. Шаблон еженедельного отчёта</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-2">
              {[
                { field: "Номер отчёта", fill: "№XX от ДД.ММ.ГГ" },
                { field: "Этап (согласно дорожной карте)", fill: "Этап X" },
                { field: "Выполненные работы за неделю", fill: "Список (пункты)" },
                { field: "Планируемые работы на следующую неделю", fill: "Список" },
                { field: "Процент завершения этапа", fill: "XX%" },
                { field: "Отклонения от календарного плана", fill: "+/- дней, причина" },
                { field: "Риски, возникшие за неделю", fill: "Описание" },
                { field: "Запросы к Заказчику", fill: "Уточнения, данные, доступы" },
                { field: "Вложения (фото, протоколы, документы)", fill: "Ссылки / файлы" },
              ].map((r, i) => (
                <div key={i} className={`grid grid-cols-[220px_1fr] px-4 py-3 border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <div className="text-xs font-bold text-gray-800 pr-3 leading-snug">{r.field}</div>
                  <div className="text-xs text-gray-500 italic">{r.fill}</div>
                </div>
              ))}
            </div>

            {/* ── DISCLAIMER ── */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-xs text-gray-700 leading-relaxed">
              <div className="font-black text-blue-800 mb-2 uppercase tracking-wide text-[10px]">Гарантии Исполнителя</div>
              <div className="space-y-1">
                <div className="flex gap-2"><Icon name="CheckCircle" size={14} className="text-blue-600 shrink-0 mt-0.5" /><span>Жёсткое соблюдение сроков (с возможными сдвигами только по вине Заказчика)</span></div>
                <div className="flex gap-2"><Icon name="CheckCircle" size={14} className="text-blue-600 shrink-0 mt-0.5" /><span>Полное юридическое и техническое сопровождение до получения положительного заключения ГЭЭ</span></div>
                <div className="flex gap-2"><Icon name="CheckCircle" size={14} className="text-blue-600 shrink-0 mt-0.5" /><span>Единое окно ответственности — все субподрядчики под контролем Исполнителя</span></div>
              </div>
              <p className="mt-3 text-[10px] text-gray-500">
                Настоящая дорожная карта является неотъемлемой частью Коммерческого предложения и вшивается в договор.
              </p>
            </div>

            {/* ── SIGNATURE ── */}
            <div className="border-t-2 border-gray-800 pt-6 flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Руководитель проекта:</p>
                <div className="border-b border-gray-400 w-52 mb-1" />
                <p className="text-[10px] text-gray-500">(ФИО, подпись)</p>
                <p className="text-xs text-gray-600 mt-3">Дата: ______________________</p>
                <p className="text-xs text-gray-800 font-bold mt-4">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</p>
                <p className="text-[10px] text-gray-500">ИНН 7814795454 · КПП 781401001 · ОГРН 1217800122649</p>
                <p className="text-[10px] text-gray-500">197341, г. Санкт-Петербург, Фермское шоссе, д. 12</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <img src={LOGO_URL} alt="Лого" className="h-12 object-contain opacity-60" />
                <img src={STAMP_URL} alt="Печать" className="h-20 object-contain opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stage card component ──
function StageCard({
  color, stage, title, weeks, items,
}: {
  color: string;
  stage: string;
  title: string;
  weeks: string;
  items: { w: string; action: string; resp: string; result: string }[];
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-5 py-3 text-white" style={{ backgroundColor: color }}>
        <div>
          <div className="text-[9px] font-bold opacity-70 uppercase tracking-wider">{stage} · {weeks}</div>
          <div className="font-black text-sm leading-snug">{title}</div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-[48px_1fr_120px_140px] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-1.5 border-b border-gray-200">
          <div>Нед.</div>
          <div>Действие</div>
          <div>Ответственный</div>
          <div>Результат</div>
        </div>
        {items.map((item, i) => (
          <div key={i} className={`grid grid-cols-[48px_1fr_120px_140px] px-4 py-2.5 border-b border-gray-100 last:border-0 items-start ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
            <div className="text-[10px] font-bold text-gray-500">{item.w}</div>
            <div className="text-xs text-gray-800 leading-snug pr-2">{item.action}</div>
            <div className="text-[10px] text-gray-500 leading-snug pr-2">{item.resp}</div>
            <div className="text-[10px] font-semibold text-gray-700 leading-snug">{item.result}</div>
          </div>
        ))}
      </div>
    </div>
  );
}