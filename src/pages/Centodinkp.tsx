import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const KP_DATE = "13 мая 2026 г.";

const SCOPE_SECTIONS = [
  {
    icon: "FileText",
    title: "Разработка СТУ «Специальные технические условия» (том А)",
    items: [
      "Общие положения и нормативная база (Приказ МЧС № 710 от 28.11.2011)",
      "Требования к генеральному плану и противопожарным разрывам",
      "Требования к конструктивным и объёмно-планировочным решениям",
      "Требования к эвакуационным путям и выходам",
      "Требования к системам противопожарной защиты и электроснабжения",
      "Требования к аварийному освещению и организационно-техническим мероприятиям",
    ],
  },
  {
    icon: "BarChart2",
    title: "Расчётное обоснование безопасной эвакуации — расчёт пожарного риска (том Б)",
    items: [
      "Общая часть и характеристика Объекта",
      "Методика проведения исследований",
      "Анализ архитектурно-планировочных решений",
      "Расчёт времени блокирования путей эвакуации",
      "Определение расчётного времени эвакуации",
      "Определение индивидуального пожарного риска",
      "Выводы и рекомендации",
    ],
  },
  {
    icon: "Truck",
    title: "Отчёт по планированию действий пожарных подразделений (том В)",
    items: [
      "Анализ пожарных проездов, подъездов и доступа для пожарной техники",
      "Предварительное планирование тушения пожара и АСР",
      "Рекомендации по устройству площадок для установки пожарной техники",
      "Выводы и рекомендации",
    ],
  },
  {
    icon: "Shield",
    title: "Полное сопровождение согласования СТУ в МЧС России",
    items: [
      "Подготовка и подача полного комплекта документов (СТУ + расчёт риска + отчёт по проездам)",
      "Участие в рассмотрении документации на научно-техническом совете (НТС) МЧС",
      "Отработка всех замечаний согласующих органов, внесение изменений",
      "Повторное согласование при необходимости (до 2 циклов включено в стоимость)",
      "Получение итогового положительного заключения с печатью надзорного органа",
      "Регистрация СТУ",
    ],
  },
  {
    icon: "Archive",
    title: "Итоговая документация",
    items: [
      "2 экземпляра СТУ ПБ в бумажном виде, прошнурованных и заверенных штампом «Согласовано письмом МЧС России» с приложением Заключения",
      "Электронные версии всех томов (СТУ, расчёт риска, отчёт по проездам) в формате PDF",
    ],
  },
];

const STAGES = [
  {
    n: 1,
    title: "Подписание договора и аванс",
    days: "Шаг 1",
    items: ["Подписание Договора", "Выставление счёта на предоплату 50%", "Получение аванса"],
  },
  {
    n: 2,
    title: "Передача исходных данных",
    days: "Шаг 2",
    items: [
      "Выписка из ЕГРН на земельный участок (к.н. 50:20:0030116:303)",
      "Генеральный план с существующими и проектными проездами",
      "Поэтажные планы здания (раздел АР) с экспликацией",
      "Архитектурно-планировочные решения зон МФЦ, офисов, кровли, паркинга",
      "Топографическая съёмка с подъездными путями",
    ],
  },
  {
    n: 3,
    title: "Разработка томов А, Б, В",
    days: "Шаг 3 · 30 р.д.",
    items: ["Разработка СТУ ПБ (том А)", "Расчёт пожарного риска (том Б)", "Отчёт по проездам (том В)", "Согласование промежуточных версий с Заказчиком"],
  },
  {
    n: 4,
    title: "Подача СТУ в МЧС",
    days: "Шаг 4",
    items: ["Подача через портал Госуслуг или лично в территориальный орган МЧС", "Комплект: СТУ + обосновывающие материалы"],
  },
  {
    n: 5,
    title: "Рассмотрение на НТС МЧС",
    days: "Шаг 5 · 30 к.д.",
    items: ["Рассмотрение СТУ на научно-техническом совете МЧС", "Срок — 30 календарных дней с момента поступления"],
  },
  {
    n: 6,
    title: "Отработка замечаний (при наличии)",
    days: "Шаг 6",
    items: ["Устранение замечаний МЧС", "Повторная подача документов", "До 2 циклов включено в стоимость"],
  },
  {
    n: 7,
    title: "Получение заключения и финальный расчёт",
    days: "Шаг 7",
    items: [
      "Получение положительного заключения МЧС",
      "Передача 2 экземпляров СТУ Заказчику",
      "Передача электронных версий всех томов",
      "Окончательный платёж 50% (700 000 руб.)",
    ],
  },
];

const COST_TABLE = [
  { n: 1, name: "Разработка СТУ (том А)", sum: "650 000" },
  { n: 2, name: "Расчёт пожарного риска (том Б)", sum: "300 000" },
  { n: 3, name: "Отчёт по проездам (том В)", sum: "200 000" },
  { n: 4, name: "Полное сопровождение согласования в МЧС", sum: "250 000" },
];

const PAYMENTS = [
  { n: 1, pct: "50%", stage: "Предоплата", sum: "700 000", basis: "Подписание договора" },
  { n: 2, pct: "50%", stage: "Окончательный расчёт", sum: "700 000", basis: "Получение положительного заключения МЧС России на СТУ" },
];

const SOURCE_DATA = [
  "Выписка из ЕГРН на земельный участок (включая к.н. 50:20:0030116:303)",
  "Генеральный план участка с нанесёнными существующими и проектными проездами",
  "Поэтажные планы здания (раздел АР) с экспликацией помещений",
  "Архитектурно-планировочные решения в части зон МФЦ, офисов, эксплуатируемой кровли и паркинга",
  "Топографическая съёмка с нанесёнными подъездными путями (для отчёта по проездам)",
];

export default function Centodinkp() {
  return (
    <div className="bg-slate-100 min-h-screen">
      {/* Sticky nav */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Капстрой-Инжиниринг" className="h-8 object-contain" />
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <div className="font-bold text-sm text-slate-900">ООО «Капстрой-Инжиниринг»</div>
              <div className="text-[10px] text-slate-400">Коммерческое предложение · Пожарная безопасность МФК</div>
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">

          {/* ── ШАПКА ── */}
          <div className="flex">
            <div className="w-1.5 bg-red-600 shrink-0" />
            <div className="flex-1 px-8 py-7 border-b border-slate-100">
              <div className="flex items-start justify-between gap-6">

                {/* Левая часть: логотип + заголовок */}
                <div className="flex-1">
                  <img src={LOGO_URL} alt="Капстрой-Инжиниринг" className="h-10 object-contain mb-4 print:block hidden" />
                  <div className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-red-600 border border-red-200 bg-red-50 px-2.5 py-1 rounded-full mb-3">
                    <Icon name="Flame" size={9} />
                    Коммерческое предложение
                  </div>
                  <h1 className="text-[22px] font-black text-slate-900 leading-snug mb-3">
                    Разработка документации<br />
                    в области <span className="text-red-600">пожарной безопасности</span><br />
                    и согласование СТУ в МЧС
                  </h1>
                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex items-start gap-1.5">
                      <Icon name="MapPin" size={11} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>МФК, Московская область, Одинцовский г.о., г. Одинцово, ул. Маршала Жукова, д. 26</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Icon name="Building2" size={11} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>Общая площадь 20 770 кв. м · 9 надземных + 1 подземный этаж</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Icon name="Car" size={11} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>Подземная автостоянка 109 м/м · Наземная автостоянка 42 м/м</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Icon name="Users" size={11} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>Заказчик: <strong className="text-slate-700">ООО «Высотжилстрой»</strong></span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Icon name="FileCheck" size={11} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>Основание: Техническое задание (Приложение № 2 к Договору)</span>
                    </div>
                  </div>
                </div>

                {/* Правая часть: дата + сумма */}
                <div className="text-right shrink-0 flex flex-col items-end gap-3">
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">Дата</div>
                    <div className="text-sm font-bold text-slate-800">{KP_DATE}</div>
                    <div className="text-[10px] text-slate-400">г. Санкт-Петербург</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl px-5 py-4 text-center min-w-[160px]">
                    <div className="text-[9px] text-red-500 uppercase tracking-wider mb-1">Стоимость с НДС 20%</div>
                    <div className="text-3xl font-black text-slate-900 tabular-nums">1 400 000</div>
                    <div className="text-sm font-semibold text-slate-500">рублей</div>
                    <div className="text-[9px] text-slate-400 mt-1 border-t border-red-100 pt-1">без НДС: 1 147 540,98 ₽</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-7 space-y-8">

            {/* ── КЛЮЧЕВЫЕ ПОКАЗАТЕЛИ ── */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: "Banknote",   label: "Стоимость с НДС",   value: "1 400 000 ₽",  accent: "text-red-600" },
                { icon: "Calendar",   label: "Разработка томов",   value: "30 р.д.",       accent: "text-slate-800" },
                { icon: "Clock",      label: "Согласование МЧС",   value: "30–45 к.д.",   accent: "text-slate-800" },
                { icon: "Building2",  label: "Площадь объекта",    value: "20 770 кв. м", accent: "text-slate-800" },
              ].map(({ icon, label, value, accent }) => (
                <div key={label} className="bg-slate-50 rounded-lg border border-slate-200 px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon name={icon} size={11} className="text-slate-400" />
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">{label}</div>
                  </div>
                  <div className={`text-sm font-black ${accent}`}>{value}</div>
                </div>
              ))}
            </div>

            {/* ── СТОРОНЫ ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Стороны договора</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-2">Исполнитель</div>
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
                  <div className="text-[10px] text-slate-500 mt-2">
                    <div>Объект: МФК по адресу:</div>
                    <div className="mt-0.5">Московская область, Одинцовский г.о.,</div>
                    <div>г. Одинцово, ул. Маршала Жукова, д. 26</div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-medium">
                    Основание: ТЗ (Приложение № 2 к Договору)
                  </div>
                </div>
              </div>
            </div>

            {/* ── ОБЪЕКТ ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Краткое описание объекта защиты</div>
              </div>
              <div className="rounded-xl border border-red-100 bg-gradient-to-r from-red-50 to-rose-50 px-5 py-4 text-xs text-slate-700 leading-relaxed">
                Многофункциональное здание общественно-делового назначения (общая площадь <strong>20 770 кв. м</strong>, наземная часть <strong>15 758 кв. м</strong>) с подземной автостоянкой на <strong>109 машино-мест</strong> и плоскостной наземной автостоянкой на <strong>42 машино-места</strong>. Здание этажностью <strong>9 надземных + 1 подземный этаж</strong>. На 3–9 этажах размещаются офисы класса В+ (<strong>8 491 кв. м</strong> арендопригодной площади). Основные пространства 1-го и 2-го этажей занимает МФЦ (<strong>2 216 кв. м</strong>). Проектом предусмотрена эксплуатируемая кровля 3-го этажа (<strong>1 211 кв. м</strong>).
              </div>
            </div>

            {/* ── СОСТАВ РАБОТ ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Состав работ — полный объём согласно ТЗ</div>
              </div>
              <div className="space-y-2.5">
                {SCOPE_SECTIONS.map((section, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center gap-2.5 bg-slate-800 px-4 py-2.5">
                      <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[9px] font-black shrink-0">{i + 1}</div>
                      <Icon name={section.icon} size={11} className="text-red-300 shrink-0" />
                      <div className="text-[10px] font-bold text-white">{section.title}</div>
                    </div>
                    <div className="bg-white px-4 py-3 grid grid-cols-1 gap-1.5">
                      {section.items.map((item, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                          <div className="text-[11px] text-slate-600">{item}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── СТОИМОСТЬ ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Стоимость работ</div>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-[44px_1fr_160px] bg-slate-800 text-[9px] font-bold text-white uppercase tracking-wider">
                  <div className="px-3 py-2.5 text-center">№</div>
                  <div className="px-4 py-2.5">Наименование этапа</div>
                  <div className="px-4 py-2.5 text-right">Сумма с НДС, ₽</div>
                </div>
                {COST_TABLE.map(({ n, name, sum }, i) => (
                  <div key={n} className={`grid grid-cols-[44px_1fr_160px] border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}>
                    <div className="px-3 py-3 text-xs text-slate-400 text-center font-bold">{n}</div>
                    <div className="px-4 py-3 text-xs text-slate-700">{name}</div>
                    <div className="px-4 py-3 text-sm font-bold text-slate-800 text-right tabular-nums">{sum}</div>
                  </div>
                ))}
                <div className="grid grid-cols-[44px_1fr_160px] bg-red-600">
                  <div className="px-3 py-3" />
                  <div className="px-4 py-3 text-sm font-black text-white">ИТОГО К ОПЛАТЕ (с НДС 20%)</div>
                  <div className="px-4 py-3 text-right text-lg font-black text-white tabular-nums">1 400 000</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Стоимость без НДС</div>
                  <div className="text-base font-black text-slate-800 tabular-nums">1 147 540,98 ₽</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">НДС 20%</div>
                  <div className="text-base font-black text-slate-800 tabular-nums">252 459,02 ₽</div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                <Icon name="Lock" size={10} className="shrink-0" />
                Цена фиксированная. Изменению не подлежит на весь срок действия договора.
              </div>
            </div>

            {/* ── УСЛОВИЯ ОПЛАТЫ ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Условия и порядок оплаты</div>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-[44px_60px_1fr_160px_200px] bg-slate-800 text-[9px] font-bold text-white uppercase tracking-wider">
                  <div className="px-3 py-2.5 text-center">№</div>
                  <div className="px-2 py-2.5 text-center">Доля</div>
                  <div className="px-4 py-2.5">Этап</div>
                  <div className="px-4 py-2.5 text-right">Сумма, ₽</div>
                  <div className="px-4 py-2.5">Основание</div>
                </div>
                {PAYMENTS.map(({ n, pct, stage, sum, basis }, i) => (
                  <div key={n} className={`grid grid-cols-[44px_60px_1fr_160px_200px] border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}>
                    <div className="px-3 py-3 text-xs text-slate-400 text-center font-bold">{n}</div>
                    <div className="px-2 py-3 flex items-center justify-center">
                      <span className="inline-block bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full">{pct}</span>
                    </div>
                    <div className="px-4 py-3 text-xs font-bold text-slate-800">{stage}</div>
                    <div className="px-4 py-3 text-sm font-black text-slate-900 tabular-nums text-right">{sum}</div>
                    <div className="px-4 py-3 text-[10px] text-slate-500 leading-relaxed">{basis}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── СРОКИ ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Сроки выполнения</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon name="FileText" size={12} className="text-red-500" />
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">Разработка документации (тома А, Б, В)</div>
                  </div>
                  <div className="text-xl font-black text-slate-900">30 рабочих дней</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">с момента предоставления исходных данных и подписания договора</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon name="Shield" size={12} className="text-red-500" />
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">Согласование в МЧС России</div>
                  </div>
                  <div className="text-xl font-black text-slate-900">30–45 календарных дней</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">с учётом возможных доработок (по регламенту — 30 к.д.)</div>
                </div>
              </div>
            </div>

            {/* ── ПОРЯДОК ВЗАИМОДЕЙСТВИЯ ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Порядок взаимодействия</div>
              </div>
              <div className="space-y-2">
                {STAGES.map((stage, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">{stage.n}</div>
                      {i < STAGES.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-xs font-bold text-slate-800">{stage.title}</div>
                        <div className="text-[9px] text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">{stage.days}</div>
                      </div>
                      <div className="space-y-0.5">
                        {stage.items.map((item, j) => (
                          <div key={j} className="flex items-start gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                            <div className="text-[11px] text-slate-500">{item}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── ИСХОДНЫЕ ДАННЫЕ ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Исходные данные для начала работ</div>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 space-y-2.5">
                {SOURCE_DATA.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Icon name="Paperclip" size={12} className="text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-700">{item}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── ПОДПИСЬ И ПЕЧАТЬ ── */}
            <div className="border-t-2 border-slate-800 pt-7">
              <div className="flex items-end justify-between gap-6">
                {/* Левая: реквизиты + подпись */}
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

                {/* Правая: логотип + печать */}
                <div className="flex flex-col items-center gap-2">
                  <img src={LOGO_URL} alt="Логотип" className="h-12 object-contain opacity-80" />
                  <img src={STAMP_URL} alt="Печать" className="h-32 w-32 object-contain opacity-90" />
                </div>
              </div>

              {/* Нижняя полоска */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>ООО «КАПСТРОЙ-ИНЖИНИРИНГ» · ИНН 7814795454</span>
                <span>Коммерческое предложение · {KP_DATE}</span>
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
