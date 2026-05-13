import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const DOC_DATE = "13 мая 2026 г.";
const DOC_NUM = "ДК-МФК-ЖУКОВА-001/2026";

const MILESTONES = [
  { code: "M1", title: "Завершение разработки всех трёх томов",                  day: "День 30 (от начала P2)",   color: "bg-blue-600" },
  { code: "M2", title: "Получение протокола НТС с замечаниями или одобрением",   day: "День 45 (от подачи P4)",   color: "bg-orange-500" },
  { code: "M3", title: "Получение положительного заключения МЧС с печатью",      day: "День 60 (от подачи P4)",   color: "bg-red-600" },
  { code: "M4", title: "Проект завершён — документация передана Заказчику",      day: "День 3 (финализации P5)",  color: "bg-emerald-600" },
];

interface SubTask {
  code: string;
  title: string;
  duration: string;
  responsible: string;
  isMilestone?: boolean;
}

interface Phase {
  code: string;
  title: string;
  duration: string;
  responsible: string;
  color: string;
  headBg: string;
  subtasks: SubTask[];
}

const PHASES: Phase[] = [
  {
    code: "P1",
    title: "Подготовительный этап",
    duration: "3 раб. дня",
    responsible: "Заказчик + Подрядчик",
    color: "border-slate-400",
    headBg: "bg-slate-700",
    subtasks: [
      { code: "P1.1", title: "Заключение Договора и выставление счёта",              duration: "1 день",                          responsible: "ООО «Высотжилстрой» / Подрядчик" },
      { code: "P1.2", title: "Внесение предоплаты 50% (700 000 руб.)",               duration: "2 дня",                           responsible: "ООО «Высотжилстрой»" },
      { code: "P1.3", title: "Передача полного комплекта исходных данных",            duration: "3 дня (одновременно с P1.2)",     responsible: "ООО «Высотжилстрой»" },
    ],
  },
  {
    code: "P2",
    title: "Разработка документации",
    duration: "30 раб. дней",
    responsible: "Подрядчик",
    color: "border-blue-400",
    headBg: "bg-blue-700",
    subtasks: [
      { code: "P2.1", title: "Разработка СТУ — том А",                               duration: "25 дней (внутри P2)",             responsible: "Подрядчик" },
      { code: "P2.2", title: "Расчёт пожарного риска — том Б",                        duration: "20 дней (параллельно P2.1)",      responsible: "Подрядчик" },
      { code: "P2.3", title: "Подготовка отчёта по проездам — том В",                 duration: "10 дней (в конце P2)",            responsible: "Подрядчик" },
      { code: "⚑ M1", title: "Завершение разработки всех трёх томов",                duration: "День 30",                         responsible: "Подрядчик", isMilestone: true },
    ],
  },
  {
    code: "P3",
    title: "Предварительное согласование с Заказчиком",
    duration: "2 раб. дня",
    responsible: "Заказчик + Подрядчик",
    color: "border-violet-400",
    headBg: "bg-violet-700",
    subtasks: [
      { code: "P3.1", title: "Передача электронных версий томов Заказчику",           duration: "0,5 дня",                        responsible: "Подрядчик" },
      { code: "P3.2", title: "Внутреннее рецензирование документации Заказчиком",     duration: "1,5 дня",                        responsible: "ООО «Высотжилстрой»" },
      { code: "P3.3", title: "Внесение корректировок (при наличии замечаний)",        duration: "1 день (при необходимости)",      responsible: "Подрядчик" },
    ],
  },
  {
    code: "P4",
    title: "Подача и согласование в МЧС",
    duration: "45–60 календ. дней",
    responsible: "Подрядчик",
    color: "border-red-400",
    headBg: "bg-red-700",
    subtasks: [
      { code: "P4.1", title: "Подача документов в территориальный орган МЧС",        duration: "1 день",                         responsible: "Подрядчик" },
      { code: "P4.2", title: "Регистрация заявления и первичная проверка комплектности", duration: "до 5 дней",                   responsible: "МЧС России" },
      { code: "P4.3", title: "НТС — рассмотрение по существу",                        duration: "30 календ. дней",                responsible: "МЧС России" },
      { code: "⚑ M2", title: "Получение протокола НТС (замечания или одобрение)",    duration: "День 45 (от подачи)",            responsible: "МЧС России", isMilestone: true },
      { code: "P4.4", title: "Отработка замечаний МЧС — внесение правок",             duration: "до 10 раб. дней",                responsible: "Подрядчик" },
      { code: "P4.5", title: "Повторная подача доработанной документации",            duration: "1 день",                         responsible: "Подрядчик" },
      { code: "P4.6", title: "Повторное рассмотрение (ускоренное)",                   duration: "до 15 календ. дней",             responsible: "МЧС России" },
      { code: "⚑ M3", title: "Получение положительного заключения и СТУ с печатью МЧС", duration: "День 60 (от подачи)",         responsible: "Подрядчик", isMilestone: true },
    ],
  },
  {
    code: "P5",
    title: "Финализация и закрытие проекта",
    duration: "3 раб. дня",
    responsible: "Подрядчик",
    color: "border-emerald-400",
    headBg: "bg-emerald-700",
    subtasks: [
      { code: "P5.1", title: "Передача 2 бумажных экземпляров СТУ с печатью МЧС",    duration: "2 дня",                          responsible: "Подрядчик" },
      { code: "P5.2", title: "Передача всех томов в электронном виде (PDF)",           duration: "1 день",                         responsible: "Подрядчик" },
      { code: "P5.3", title: "Выставление окончательного счёта (оставшиеся 50%)",     duration: "1 день",                         responsible: "Подрядчик" },
      { code: "⚑ M4", title: "Проект завершён — документация передана",              duration: "День 3 (финализации)",           responsible: "ООО «Высотжилстрой»", isMilestone: true },
    ],
  },
];

const CHECKLIST_CUSTOMER = [
  "Предоставить выписку ЕГРН на земельный участок (к.н. 50:20:0030116:303)",
  "Передать в электронном виде: генплан М 1:500, поэтажные планы (раздел АР), топосъёмку с подъездными путями, разделы ПБ (при наличии)",
  "Назначить ответственного за оперативное согласование исходных данных и внутреннее рецензирование томов (срок — не более 2 рабочих дней)",
  "Внести предоплату 50% (700 000 руб.) после подписания Договора",
  "Внести окончательный платёж 50% (700 000 руб.) после получения положительного заключения МЧС",
];

const CHECKLIST_CONTRACTOR = [
  "Разработать и передать на внутреннее рецензирование полные тома А, Б, В в течение 30 рабочих дней с момента получения исходных данных",
  "Подать документы в МЧС в течение 2 дней после финализации томов",
  "Обеспечить явку представителя на НТС и полную защиту разработанной документации",
  "Отработать все замечания МЧС в установленные сроки (до 10 рабочих дней на один цикл)",
  "Получить итоговое положительное заключение и передать Заказчику 2 оригинальных экземпляра СТУ с печатью «Согласовано письмом МЧС России», а также электронные версии всех томов в формате PDF",
];

const GANTT = [
  { phase: "P1: Подготовка", bars: [{ start: 0, len: 3, color: "bg-slate-400", label: "3 р.д." }] },
  { phase: "P2: Разработка", bars: [{ start: 3, len: 30, color: "bg-blue-500", label: "30 р.д." }] },
  { phase: "P3: Согласование с Заказчиком", bars: [{ start: 33, len: 2, color: "bg-violet-500", label: "2 р.д." }] },
  { phase: "P4: МЧС согласование", bars: [{ start: 35, len: 25, color: "bg-red-500", label: "45–60 к.д." }] },
  { phase: "P5: Финализация", bars: [{ start: 60, len: 3, color: "bg-emerald-500", label: "3 р.д." }] },
];

const TOTAL_UNITS = 65;

export default function DTCodin() {
  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Sticky nav */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 print:hidden">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Капстрой-Инжиниринг" className="h-8 object-contain" />
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <div className="font-bold text-sm text-slate-900">ООО «Капстрой-Инжиниринг»</div>
              <div className="text-[10px] text-slate-400">Дорожная карта · МФК г. Одинцово, ул. Маршала Жукова, д. 26</div>
            </div>
          </div>
          <Button
            onClick={() => window.print()}
            className="bg-red-600 hover:bg-red-700 text-white gap-2 text-sm"
          >
            <Icon name="Printer" size={15} />
            Печать / PDF
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">

          {/* ── ШАПКА ── */}
          <div className="flex">
            <div className="w-1.5 bg-red-600 shrink-0" />
            <div className="flex-1 px-8 py-7 border-b border-slate-100">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <img src={LOGO_URL} alt="Капстрой-Инжиниринг" className="h-10 object-contain mb-4 hidden print:block" />
                  <div className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-red-600 border border-red-200 bg-red-50 px-2.5 py-1 rounded-full mb-3">
                    <Icon name="Map" size={9} />
                    Дорожная карта проекта
                  </div>
                  <h1 className="text-[22px] font-black text-slate-900 leading-snug mb-3">
                    Разработка и согласование документации<br />
                    в области <span className="text-red-600">пожарной безопасности</span> (СТУ)
                  </h1>
                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex items-start gap-1.5">
                      <Icon name="MapPin" size={11} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>МФК, Московская область, Одинцовский г.о., г. Одинцово, ул. Маршала Жукова, д. 26</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Icon name="Users" size={11} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>Заказчик: <strong className="text-slate-700">ООО «Высотжилстрой»</strong></span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Icon name="FileCheck" size={11} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>Основание: Техническое задание (Приложение № 2 к Договору)</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Icon name="Hash" size={11} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>Документ: {DOC_NUM}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-3">
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">Дата</div>
                    <div className="text-sm font-bold text-slate-800">{DOC_DATE}</div>
                    <div className="text-[10px] text-slate-400">г. Санкт-Петербург</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                      <div className="text-[9px] text-blue-500 uppercase tracking-wider mb-1">Разработка</div>
                      <div className="text-xl font-black text-slate-900">30</div>
                      <div className="text-[10px] text-slate-500">рабочих дней</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <div className="text-[9px] text-red-500 uppercase tracking-wider mb-1">Согласование</div>
                      <div className="text-xl font-black text-slate-900">45–60</div>
                      <div className="text-[10px] text-slate-500">календ. дней</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-7 space-y-8">

            {/* ── СТОРОНЫ ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Стороны</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-2">Исполнитель (Подрядчик)</div>
                  <div className="text-sm font-black text-slate-900 mb-0.5">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                  <div className="text-[10px] text-slate-500 space-y-0.5 mt-2">
                    <div>ИНН 7814795454 · КПП 781401001</div>
                    <div>ОГРН 1217800122649</div>
                    <div>197341, г. Санкт-Петербург,</div>
                    <div>Фермское шоссе, д. 12, лит. Ж, пом. 310-Н к3</div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-medium">
                    Ген. директор: Шумов Иван Викторович
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-2">Заказчик</div>
                  <div className="text-sm font-black text-slate-900 mb-0.5">ООО «Высотжилстрой»</div>
                  <div className="text-[10px] text-slate-500 mt-2 space-y-0.5">
                    <div>Объект: МФК по адресу:</div>
                    <div>Московская область, Одинцовский г.о.,</div>
                    <div>г. Одинцово, ул. Маршала Жукова, д. 26</div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-medium">
                    Основание: ТЗ (Приложение № 2 к Договору)
                  </div>
                </div>
              </div>
            </div>

            {/* ── ВЕХИ ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Ключевые вехи</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {MILESTONES.map((m) => (
                  <div key={m.code} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className={`w-8 h-8 rounded-full ${m.color} text-white text-[10px] font-black flex items-center justify-center shrink-0`}>
                      {m.code}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{m.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{m.day}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── ДИАГРАММА ГАНТА ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Диаграмма Ганта (укрупнённая)</div>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-800 px-4 py-2.5 grid grid-cols-[180px_1fr] gap-4">
                  <div className="text-[9px] font-bold text-white uppercase tracking-wider">Этап</div>
                  <div className="flex justify-between text-[8px] text-slate-400">
                    {["Нач.", "10", "20", "30", "40", "50", "60", "Кон."].map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                {GANTT.map((row, i) => (
                  <div key={i} className={`grid grid-cols-[180px_1fr] gap-4 px-4 py-2 border-b border-slate-100 items-center ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}>
                    <div className="text-[10px] text-slate-700 font-medium leading-tight">{row.phase}</div>
                    <div className="relative h-6">
                      {row.bars.map((bar, j) => (
                        <div
                          key={j}
                          className={`absolute top-0.5 h-5 rounded ${bar.color} flex items-center justify-center`}
                          style={{
                            left: `${(bar.start / TOTAL_UNITS) * 100}%`,
                            width: `${(bar.len / TOTAL_UNITS) * 100}%`,
                          }}
                        >
                          <span className="text-[8px] text-white font-bold px-1 truncate">{bar.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {/* Milestone markers */}
                <div className="grid grid-cols-[180px_1fr] gap-4 px-4 py-2 bg-slate-50 items-center border-t border-slate-200">
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Вехи</div>
                  <div className="relative h-6">
                    {[
                      { pos: 33 / TOTAL_UNITS, label: "M1", color: "bg-blue-600" },
                      { pos: (35 + 10) / TOTAL_UNITS, label: "M2", color: "bg-orange-500" },
                      { pos: (35 + 25) / TOTAL_UNITS, label: "M3", color: "bg-red-600" },
                      { pos: (63) / TOTAL_UNITS, label: "M4", color: "bg-emerald-600" },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="absolute top-0 flex flex-col items-center"
                        style={{ left: `${m.pos * 100}%`, transform: "translateX(-50%)" }}
                      >
                        <div className={`w-5 h-5 rounded-full ${m.color} text-white text-[8px] font-black flex items-center justify-center`}>
                          {m.label.replace("M", "")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── ЭТАПЫ ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Детальный план работ</div>
              </div>
              <div className="space-y-3">
                {PHASES.map((phase) => (
                  <div key={phase.code} className={`rounded-xl border-l-4 ${phase.color} border border-slate-200 overflow-hidden`}>
                    {/* Phase header */}
                    <div className={`${phase.headBg} px-5 py-3 flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <div className="text-[10px] font-black text-white bg-white/20 px-2 py-0.5 rounded">{phase.code}</div>
                        <div className="text-sm font-bold text-white">{phase.title}</div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <div className="text-[8px] text-white/60 uppercase tracking-wider">Срок</div>
                          <div className="text-[10px] font-bold text-white">{phase.duration}</div>
                        </div>
                        <div>
                          <div className="text-[8px] text-white/60 uppercase tracking-wider">Ответственный</div>
                          <div className="text-[10px] font-bold text-white">{phase.responsible}</div>
                        </div>
                      </div>
                    </div>
                    {/* Subtasks */}
                    <div className="bg-white">
                      <div className="grid grid-cols-[80px_1fr_180px_220px] text-[8px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 px-4 py-1.5">
                        <div>Код</div>
                        <div>Задача</div>
                        <div className="text-center">Длительность</div>
                        <div>Ответственный</div>
                      </div>
                      {phase.subtasks.map((task, i) => (
                        <div
                          key={task.code}
                          className={`grid grid-cols-[80px_1fr_180px_220px] px-4 py-2.5 border-b border-slate-50 items-start ${
                            task.isMilestone
                              ? "bg-amber-50 border-amber-100"
                              : i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                          }`}
                        >
                          <div className={`text-[10px] font-black ${task.isMilestone ? "text-amber-600" : "text-slate-400"}`}>
                            {task.code}
                          </div>
                          <div className={`text-[11px] leading-snug pr-4 ${task.isMilestone ? "font-bold text-amber-800" : "text-slate-700"}`}>
                            {task.isMilestone && <span className="mr-1">⚑</span>}
                            {task.title}
                          </div>
                          <div className={`text-[10px] text-center ${task.isMilestone ? "text-amber-600 font-bold" : "text-slate-500"}`}>
                            {task.duration}
                          </div>
                          <div className={`text-[10px] ${task.isMilestone ? "text-amber-700 font-semibold" : "text-slate-500"}`}>
                            {task.responsible}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── ЧЕКЛИСТ ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Контрольный перечень обязательств</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="Building2" size={13} className="text-blue-600" />
                    <div className="text-[10px] font-black uppercase tracking-wider text-blue-700">Заказчик — ООО «Высотжилстрой»</div>
                  </div>
                  <div className="space-y-2">
                    {CHECKLIST_CUSTOMER.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded border border-blue-300 bg-white shrink-0 mt-0.5 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-sm bg-blue-200" />
                        </div>
                        <div className="text-[11px] text-slate-700 leading-snug">{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="HardHat" size={13} className="text-red-600" />
                    <div className="text-[10px] font-black uppercase tracking-wider text-red-700">Подрядчик — ООО «Капстрой-Инжиниринг»</div>
                  </div>
                  <div className="space-y-2">
                    {CHECKLIST_CONTRACTOR.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded border border-red-300 bg-white shrink-0 mt-0.5 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-sm bg-red-200" />
                        </div>
                        <div className="text-[11px] text-slate-700 leading-snug">{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── ПОДПИСЬ И ПЕЧАТЬ ── */}
            <div className="border-t-2 border-slate-800 pt-7">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-xs text-slate-500 mb-2">С уважением,</p>
                  <p className="text-xs text-slate-600">Генеральный директор</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</p>
                  <p className="text-xs text-slate-700 mt-1">Шумов Иван Викторович</p>
                  <div className="text-[10px] text-slate-400 mt-1 space-y-0.5">
                    <div>ИНН 7814795454 · КПП 781401001 · ОГРН 1217800122649</div>
                    <div>197341, г. Санкт-Петербург, Фермское шоссе, д. 12, лит. Ж, пом. 310-Н к3</div>
                  </div>
                  <div className="mt-5 flex items-end gap-6">
                    <div>
                      <div className="border-b border-slate-400 w-36 mb-1" />
                      <div className="text-[9px] text-slate-400">(подпись)</div>
                    </div>
                    <div>
                      <div className="border-b border-slate-400 w-32 mb-1" />
                      <div className="text-[9px] text-slate-400">(дата)</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img src={LOGO_URL} alt="Логотип" className="h-12 object-contain opacity-80" />
                  <img src={STAMP_URL} alt="Печать" className="h-32 w-32 object-contain opacity-90" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>ООО «КАПСТРОЙ-ИНЖИНИРИНГ» · ИНН 7814795454</span>
                <span>{DOC_NUM} · {DOC_DATE}</span>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-4 text-center text-[10px] text-slate-400 print:hidden">
          Для сохранения в PDF: нажмите «Печать / PDF» → выберите «Сохранить как PDF»
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .sticky { position: static !important; }
        }
      `}</style>
    </div>
  );
}
