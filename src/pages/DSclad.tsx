import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL = "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL = "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

// ── Milestones ──
const MILESTONES = [
  { id: "M1", date: "12.05.2026", label: "Отчёт по изысканиям", payment: "9 300 000", pct: "30%", color: "#0369a1" },
  { id: "M2", date: "19.05.2026", label: "Утверждение концепции", payment: "", pct: "", color: "#7c3aed" },
  { id: "M3", date: "07.07.2026", label: "Сдача ПД в экспертизу", payment: "12 400 000", pct: "40%", color: "#dc2626" },
  { id: "M4", date: "11.08.2026", label: "Положительное заключение", payment: "", pct: "", color: "#059669" },
  { id: "M5", date: "08.09.2026", label: "РД готова", payment: "", pct: "", color: "#b45309" },
  { id: "M6", date: "15.09.2026", label: "Передача + Акт КС-3", payment: "9 300 000", pct: "30%", color: "#374151" },
];

// ── Gantt ──
// weeks 1-24 from 28 Apr 2026
// start/end in week numbers (1-based)
const GANTT_SECTIONS = [
  {
    id: "s1", label: "1. Изыскания", color: "#0369a1",
    tasks: [
      { label: "Геодезия М 1:500", start: 1, end: 2 },
      { label: "Геология (7 скважин)", start: 1, end: 2.4 },
      { label: "Экология (почвы, вода)", start: 1, end: 2.2 },
      { label: "Камеральная обработка + отчёт", start: 1.5, end: 2 },
    ],
    milestone: "M1", milestoneWeek: 2,
  },
  {
    id: "s2", label: "2. Концепция", color: "#7c3aed",
    tasks: [
      { label: "Генплан + СЗЗ", start: 2, end: 3 },
      { label: "Выбор оборудования", start: 2, end: 4 },
      { label: "Эскиз АБК / гараж", start: 3, end: 4 },
    ],
    milestone: "M2", milestoneWeek: 4,
  },
  {
    id: "s3", label: "3. Проектная документация", color: "#dc2626",
    tasks: [
      { label: "Технология (ТХ) + ПАЗ", start: 4, end: 9 },
      { label: "Конструктивные решения (КР)", start: 4, end: 9 },
      { label: "Электрика (ЭС, ЭО) + УЗА", start: 4, end: 8.5 },
      { label: "ИТСО + СКУД + видеонаблюдение", start: 4, end: 9 },
      { label: "АСУ ТП + интеграция АИС КУТиП", start: 4.5, end: 9.5 },
      { label: "Водоснабжение / водоотведение", start: 5, end: 9 },
      { label: "ООС + проект СЗЗ", start: 5.5, end: 9.5 },
      { label: "ПОС + стройгенплан", start: 6, end: 9 },
      { label: "Сметы (Гранд-Смета, ТЕР-2001)", start: 6.5, end: 10.5 },
    ],
    milestone: "M3", milestoneWeek: 11,
  },
  {
    id: "s4", label: "4. Экспертиза и согласования", color: "#b45309",
    tasks: [
      { label: "Негосударственная экспертиза ПД", start: 11, end: 14 },
      { label: "Устранение замечаний", start: 13, end: 15 },
      { label: "СЭЗ + Росрыболовство", start: 11, end: 15 },
      { label: "Разработка ПЛАРН", start: 12, end: 15 },
    ],
    milestone: "M4", milestoneWeek: 16,
  },
  {
    id: "s5", label: "5. Рабочая документация", color: "#1d4ed8",
    tasks: [
      { label: "РД-Технология (аксонометрия)", start: 16, end: 19 },
      { label: "РД-КМД (металлоконструкции)", start: 16, end: 19 },
      { label: "РД-Электрика (кабельные трассы)", start: 16.5, end: 19 },
      { label: "РД-ИТСО (монтажные схемы)", start: 17, end: 19 },
      { label: "РД-АР (АБК, лаборатория, КПП)", start: 17, end: 19 },
    ],
    milestone: "M5", milestoneWeek: 19,
  },
  {
    id: "s6", label: "6. Финализация и передача", color: "#374151",
    tasks: [
      { label: "Формирование 4 томов на бумаге", start: 19, end: 20 },
      { label: "Конвертация PDF + DWG (2 экз.)", start: 19.5, end: 20 },
      { label: "Подписание акта КС-3", start: 20, end: 20.5 },
    ],
    milestone: "M6", milestoneWeek: 20.5,
  },
];

const TOTAL_WEEKS = 21;

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-8 first:mt-0">
      <div className="h-5 w-1 rounded-full bg-blue-700 shrink-0" />
      <h2 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
        {icon && <Icon name={icon} size={14} className="text-blue-600" />}
        {children}
      </h2>
    </div>
  );
}

function GanttChart() {
  const ticks = Array.from({ length: TOTAL_WEEKS + 1 }, (_, i) => i);
  const colW = 100 / TOTAL_WEEKS;

  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: 820 }}>
        {/* Week axis */}
        <div className="flex mb-0.5" style={{ paddingLeft: 164 }}>
          {ticks.map((w) => (
            w % 2 === 0 ? (
              <div key={w} style={{ width: `${colW * 2}%` }}
                className="text-[8px] text-gray-400 font-bold border-l border-gray-200 pl-0.5">
                {w > 0 ? `Нед.${w}` : ""}
              </div>
            ) : null
          ))}
        </div>

        {/* Sections */}
        {GANTT_SECTIONS.map((section) => (
          <div key={section.id} className="mb-1.5">
            {/* Section header */}
            <div className="flex items-center mb-0.5">
              <div className="text-[9px] font-black uppercase tracking-wider shrink-0 pr-2 text-right"
                style={{ width: 164, color: section.color }}>{section.label}</div>
              <div className="flex-1 h-px" style={{ backgroundColor: section.color + "40" }} />
            </div>
            {/* Tasks */}
            {section.tasks.map((task, ti) => (
              <div key={ti} className="flex items-center mb-0.5">
                <div className="text-[8px] text-gray-500 shrink-0 pr-2 text-right truncate" style={{ width: 164 }}>
                  {task.label}
                </div>
                <div className="flex-1 relative h-4">
                  {ticks.map((w) => (
                    <div key={w} className="absolute top-0 bottom-0 border-l border-gray-100"
                      style={{ left: `${(w / TOTAL_WEEKS) * 100}%` }} />
                  ))}
                  <div className="absolute top-0.5 bottom-0.5 rounded-sm"
                    style={{
                      left: `${((task.start) / TOTAL_WEEKS) * 100}%`,
                      width: `${((task.end - task.start) / TOTAL_WEEKS) * 100}%`,
                      backgroundColor: section.color,
                      opacity: 0.85,
                    }} />
                </div>
              </div>
            ))}
            {/* Milestone */}
            {section.milestone && (
              <div className="flex items-center mb-0.5">
                <div className="text-[8px] font-black shrink-0 pr-2 text-right" style={{ width: 164, color: section.color }}>
                  ◆ {section.milestone}
                </div>
                <div className="flex-1 relative h-4">
                  <div className="absolute top-0 bottom-0 flex items-center"
                    style={{ left: `${(section.milestoneWeek / TOTAL_WEEKS) * 100}%` }}>
                    <div className="w-3 h-3 rotate-45 border-2 shrink-0 -ml-1.5"
                      style={{ backgroundColor: "#fbbf24", borderColor: section.color }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Payment row */}
        <div className="flex items-center mt-2">
          <div className="text-[8px] font-black text-emerald-700 uppercase tracking-wider shrink-0 pr-2 text-right" style={{ width: 164 }}>
            💰 Оплаты
          </div>
          <div className="flex-1 relative h-5">
            {ticks.map((w) => (
              <div key={w} className="absolute top-0 bottom-0 border-l border-gray-100"
                style={{ left: `${(w / TOTAL_WEEKS) * 100}%` }} />
            ))}
            {MILESTONES.filter(m => m.payment).map((m, i) => {
              const weekMap: Record<string, number> = { M1: 2, M3: 11, M6: 20.5 };
              const w = weekMap[m.id] ?? 0;
              return (
                <div key={i} className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${(w / TOTAL_WEEKS) * 100}%` }}>
                  <div className="w-3 h-3 rotate-45 bg-emerald-500 border-2 border-emerald-700" />
                  <div className="text-[7px] font-black text-emerald-700 whitespace-nowrap">{m.pct}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2 text-[8px] text-gray-500" style={{ paddingLeft: 164 }}>
          <div className="flex items-center gap-1"><div className="w-4 h-3 rounded-sm bg-gray-400" /><span>Работа</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rotate-45 bg-amber-400 border border-amber-600" /><span>Веха</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rotate-45 bg-emerald-500 border border-emerald-700" /><span>Оплата</span></div>
        </div>
      </div>
    </div>
  );
}

// Stage detail card
function StageCard({ n, title, color, icon, period, milestone, milestoneText, payment, children }: {
  n: number; title: string; color: string; icon: string; period: string;
  milestone: string; milestoneText: string; payment?: string; children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-5 py-3 text-white" style={{ backgroundColor: color }}>
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <Icon name={icon} size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-[9px] font-bold opacity-70 uppercase tracking-wider">Этап {n} · {period}</div>
          <div className="font-black text-sm">{title}</div>
        </div>
        <div className="bg-white/20 border border-white/30 rounded-lg px-2.5 py-1.5 text-right shrink-0">
          <div className="text-[8px] text-white/70">Веха</div>
          <div className="text-xs font-black text-white">{milestone}</div>
        </div>
      </div>
      <div className="p-4">
        {children}
        <div className={`flex items-start gap-2 mt-3 rounded-xl px-4 py-2.5 ${payment ? "bg-emerald-50 border border-emerald-200" : "bg-blue-50 border border-blue-200"}`}>
          <Icon name={payment ? "Banknote" : "CheckCircle"} size={13} className={payment ? "text-emerald-600 shrink-0 mt-0.5" : "text-blue-600 shrink-0 mt-0.5"} />
          <span className={`text-[10px] font-semibold leading-snug ${payment ? "text-emerald-900" : "text-blue-900"}`}>
            <span className="font-black">{milestone}:</span> {milestoneText}
            {payment && <span className="ml-1 font-black">→ оплата {payment} руб.</span>}
          </span>
        </div>
      </div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className={`grid text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-1.5 border-b border-gray-200`}
        style={{ gridTemplateColumns: headers.map(() => "1fr").join(" ") }}>
        {headers.map((h, i) => <div key={i}>{h}</div>)}
      </div>
      {rows.map((row, ri) => (
        <div key={ri} className={`grid px-4 py-2 border-b border-gray-100 last:border-0 items-start ${ri % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
          style={{ gridTemplateColumns: headers.map(() => "1fr").join(" ") }}>
          {row.map((cell, ci) => <div key={ci} className="text-xs text-gray-800 leading-snug pr-2">{cell}</div>)}
        </div>
      ))}
    </div>
  );
}

export default function DSclad() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Лого" className="h-9 object-contain" />
            <div>
              <div className="font-bold text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
              <div className="text-xs text-gray-500">Дорожная карта · Склад ГСМ · 24 недели</div>
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
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white px-8 py-7">
            <div className="text-[10px] uppercase tracking-widest text-blue-300 mb-1">Дорожная карта проекта</div>
            <h1 className="text-xl font-black leading-snug mb-3">
              Склад ГСМ Краснобродский угольный разрез
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-xs">
              {[
                { label: "Заказчик", value: "АО «УК «Кузбассразрезуголь»" },
                { label: "Объём работ", value: "ПИР (изыскания + ПД + РД + экспертиза)" },
                { label: "Бюджет", value: "31 000 000 руб. (с НДС 22%)" },
                { label: "Срок", value: "24 недели (~6 месяцев)" },
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
                { icon: "Layers", value: "6 этапов", label: "полный цикл ПИР", color: "bg-blue-700" },
                { icon: "Flag", value: "6 вех", label: "контрольных точек", color: "bg-amber-600" },
                { icon: "Banknote", value: "31 млн", label: "фиксированная цена", color: "bg-emerald-600" },
                { icon: "Calendar", value: "24 нед.", label: "Апр — Сен 2026", color: "bg-slate-700" },
              ].map(({ icon, value, label, color }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center shadow-sm">
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center mb-2`}>
                    <Icon name={icon} size={18} className="text-white" />
                  </div>
                  <div className="text-base font-black text-gray-900 leading-tight">{value}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* ── MILESTONE STRIP ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-8">
              {MILESTONES.map((m) => (
                <div key={m.id} className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="px-3 py-2 text-white" style={{ backgroundColor: m.color }}>
                    <div className="flex items-center justify-between">
                      <div className="font-black text-sm">{m.id}</div>
                      {m.payment && <div className="text-[9px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full">{m.pct}</div>}
                    </div>
                    <div className="text-[9px] font-bold opacity-80 mt-0.5">{m.date}</div>
                  </div>
                  <div className="px-3 py-2 bg-white">
                    <div className="text-[10px] font-semibold text-gray-800 leading-snug">{m.label}</div>
                    {m.payment
                      ? <div className="text-[9px] font-black text-emerald-700 mt-0.5">{m.payment} руб.</div>
                      : <div className="text-[9px] text-gray-400 mt-0.5">без оплаты</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* ── GANTT ── */}
            <SectionTitle icon="BarChart2">Диаграмма Ганта — понедельный план</SectionTitle>
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-2 overflow-hidden">
              <GanttChart />
            </div>

            {/* ── PAYMENT SCHEDULE ── */}
            <SectionTitle icon="Banknote">График платежей</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-2">
              <div className="grid grid-cols-[60px_1fr_140px_80px_180px] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div>Веха</div><div>Событие</div><div>Дата</div><div>Доля</div><div>Сумма (руб.)</div>
              </div>
              {MILESTONES.map((m, i) => (
                <div key={i} className={`grid grid-cols-[60px_1fr_140px_80px_180px] px-4 py-3 border-b border-gray-100 last:border-0 items-center ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                  <div className="font-black text-sm" style={{ color: m.color }}>{m.id}</div>
                  <div className="text-xs text-gray-800 leading-snug pr-2">{m.label}</div>
                  <div className="text-xs text-gray-600">{m.date}</div>
                  <div className="text-xs font-bold text-gray-700">{m.pct || "—"}</div>
                  <div className={`text-sm font-black ${m.payment ? "text-emerald-700" : "text-gray-400"}`}>
                    {m.payment ? `${m.payment}` : "—"}
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-[60px_1fr_140px_80px_180px] px-4 py-3 bg-blue-700 items-center">
                <div /><div className="text-xs font-black text-white">ИТОГО</div>
                <div /><div className="text-xs font-black text-blue-200">100%</div>
                <div className="text-base font-black text-white">31 000 000</div>
              </div>
            </div>

            {/* ── STAGE DETAILS ── */}
            <SectionTitle icon="ClipboardList">Детальный план по этапам</SectionTitle>
            <div className="space-y-4">

              {/* Stage 1 */}
              <StageCard n={1} title="Инженерные изыскания" color="#0369a1" icon="Compass"
                period="Недели 1–2" milestone="M1" milestoneText="Отчёт по изысканиям" payment="9 300 000">
                <Table
                  headers={["Задача", "Срок", "Результат"]}
                  rows={[
                    ["Геодезическая съёмка М 1:500", "1–2 нед", "Цифровая модель рельефа"],
                    ["Бурение 7 скважин (геология)", "1–2 нед", "Разрезы грунтов"],
                    ["Экология (почвы, вода)", "1–2 нед", "Протоколы ХЛА"],
                    ["Камеральная обработка + отчёт", "2 нед", "Готовый отчёт по изысканиям"],
                  ]}
                />
              </StageCard>

              {/* Stage 2 */}
              <StageCard n={2} title="Концепция и предпроект" color="#7c3aed" icon="Lightbulb"
                period="Недели 2–4" milestone="M2" milestoneText="Утверждение концепции у Технического директора">
                <Table
                  headers={["Задача", "Срок", "Результат"]}
                  rows={[
                    ["Генплан с учётом СЗЗ и водоохранных зон", "2–3 нед", "Ситуационная схема"],
                    ["Выбор оборудования (РВС-700, РГСН-100, насосы)", "2–4 нед", "Спецификация"],
                    ["Эскиз АБК / гаража (быстровозводимые конструкции)", "3–4 нед", "Планировочные решения"],
                  ]}
                />
              </StageCard>

              {/* Stage 3 */}
              <StageCard n={3} title="Проектная документация (ПД)" color="#dc2626" icon="FileStack"
                period="Недели 4–13" milestone="M3" milestoneText="Полный комплект ПД сдан в экспертизу" payment="12 400 000">
                <Table
                  headers={["Раздел", "Длительность"]}
                  rows={[
                    ["Технология (ТХ) + ПАЗ", "5 нед"],
                    ["Конструктивные решения (КР)", "5 нед"],
                    ["Электрообеспечение (ЭС, ЭО) + заземление (УЗА)", "4,5 нед"],
                    ["ИТСО (Орион Про) + СКУД + видеонаблюдение", "5 нед"],
                    ["АСУ ТП + интеграция с АИС КУТиП", "5 нед"],
                    ["Водоснабжение / водоотведение (ливневка + очистные)", "4 нед"],
                    ["Охрана среды (ООС) + проект СЗЗ", "4 нед"],
                    ["ПОС + стройгенплан", "3 нед"],
                    ["Сметы (Гранд-Смета, ТЕР-2001, 42 регион)", "4 нед"],
                  ]}
                />
              </StageCard>

              {/* Stage 4 */}
              <StageCard n={4} title="Экспертиза и согласования" color="#b45309" icon="Stamp"
                period="Недели 13–18" milestone="M4" milestoneText="Положительное заключение экспертизы">
                <Table
                  headers={["Задача", "Срок"]}
                  rows={[
                    ["Негосударственная экспертиза ПД", "3 нед"],
                    ["Сбор и устранение замечаний", "2 нед"],
                    ["Санэпидэкспертиза (СЗЗ)", "4 нед"],
                    ["Согласование с Росрыболовством", "3 нед"],
                    ["Разработка ПЛАРН", "3 нед"],
                  ]}
                />
              </StageCard>

              {/* Stage 5 */}
              <StageCard n={5} title="Рабочая документация (РД)" color="#1d4ed8" icon="FileText"
                period="Недели 18–23" milestone="M5" milestoneText="РД полностью готова">
                <Table
                  headers={["Раздел", "Длительность"]}
                  rows={[
                    ["РД-Технология (аксонометрия трубопроводов)", "3 нед"],
                    ["РД-КМД (металлоконструкции эстакад, опоры)", "3 нед"],
                    ["РД-Электрика (кабельные трассы, щиты)", "2,5 нед"],
                    ["РД-ИТСО (монтажные схемы)", "2 нед"],
                    ["РД-АР (АБК, лаборатория, КПП)", "2 нед"],
                  ]}
                />
              </StageCard>

              {/* Stage 6 */}
              <StageCard n={6} title="Финализация и передача документации" color="#374151" icon="Package"
                period="Неделя 24" milestone="M6" milestoneText="Передача документации + Акт КС-3" payment="9 300 000">
                <Table
                  headers={["Задача", "Результат"]}
                  rows={[
                    ["Формирование 4 томов на бумаге", "4 экз. ПД и РД"],
                    ["Конвертация в PDF + DWG", "2 экз. в электронном виде"],
                    ["Подписание акта КС-3", "Финальный акт, закрытие договора"],
                  ]}
                />
              </StageCard>
            </div>

            {/* ── SCOPE ── */}
            <SectionTitle icon="CheckSquare">Что входит в стоимость 31 000 000 руб.</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
              {[
                "Инженерные изыскания (геодезия, геология, экология)",
                "Проектная документация — полный комплект (ПД)",
                "Рабочая документация — полный комплект (РД)",
                "Негосударственная экспертиза ПД, смет и изысканий",
                "Согласование санитарно-защитной зоны (СЗЗ)",
                "Разработка ПЛАРН",
                "Согласование с Росрыболовством",
                "Интеграция АСУ ТП с АИС КУТиП",
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                  <Icon name="CheckCircle" size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-800 leading-snug">{item}</span>
                </div>
              ))}
            </div>

            {/* ── SIGNATURE ── */}
            <div className="border-t-2 border-gray-800 pt-6 flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Главный инженер проекта (ГИП):</p>
                <div className="border-b border-gray-400 w-52 mb-1" />
                <p className="text-[10px] text-gray-500">(ФИО, подпись)</p>
                <p className="text-xs text-gray-600 mt-3">Дата: ______________________</p>
                <p className="text-xs font-black text-gray-900 mt-4">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</p>
                <p className="text-[10px] text-gray-500">ИНН 7814795454 · КПП 781401001 · ОГРН 1217800122649</p>
                <p className="text-[10px] text-gray-500">197341, г. Санкт-Петербург, Фермское шоссе, д. 12</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <img src={LOGO_URL} alt="Лого" className="h-10 object-contain opacity-60" />
                <img src={STAMP_URL} alt="Печать" className="h-20 object-contain opacity-80" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}