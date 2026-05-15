import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const DOC_DATE = "13 мая 2026 г.";
const DOC_NUM = "ДК-МФК-ЖУКОВА-001/2026";

const MILESTONES = [
  { code: "M1", title: "Проект СТУ готов — все три тома завершены и проверены",      day: "~День 40 (от старта)",       color: "bg-blue-600" },
  { code: "M2", title: "Получение протокола НТС МЧС (замечания или одобрение)",      day: "~День 45 (от подачи)",       color: "bg-orange-500" },
  { code: "M3", title: "Официальное письмо МЧС о согласовании СТУ",                  day: "~День 60 (от подачи)",       color: "bg-red-600" },
  { code: "M4", title: "Передача оригиналов СТУ с отметкой МЧС Заказчику",           day: "День 3 (после письма МЧС)",  color: "bg-emerald-600" },
];

interface WorkItem {
  text: string;
  sub?: string;
}

interface SubTask {
  code: string;
  title: string;
  duration: string;
  responsible: string;
  isMilestone?: boolean;
  parallel?: string;
  items?: WorkItem[];
}

interface Phase {
  code: string;
  title: string;
  duration: string;
  responsible: string;
  color: string;
  headBg: string;
  note?: string;
  subtasks: SubTask[];
}

const PHASES: Phase[] = [
  {
    code: "Эт.0",
    title: "Входной анализ и планирование",
    duration: "3–5 раб. дней",
    responsible: "Подрядчик + Заказчик",
    color: "border-slate-400",
    headBg: "bg-slate-700",
    subtasks: [
      {
        code: "0.1",
        title: "Получение и проверка исходных данных",
        duration: "1–2 дня",
        responsible: "Подрядчик / Заказчик",
        items: [
          { text: "Генплан М 1:500 (электронный формат)" },
          { text: "Поэтажные планы раздела АР с экспликацией" },
          { text: "Разделы ОВ, АУПТ, СОУЭ, ЭОМ, АД — при наличии" },
          { text: "Топографическая съёмка с подъездными путями" },
          { text: "Выписка ЕГРН (к.н. 50:20:0030116:303)" },
        ],
      },
      {
        code: "0.2",
        title: "Определение перечня отступлений от требований ПБ",
        duration: "1 день",
        responsible: "Подрядчик",
        items: [
          { text: "Анализ по каждому разделу норм (СП, ФЗ-123)" },
          { text: "Составление реестра отступлений с указанием конкретных пунктов" },
        ],
      },
      {
        code: "0.3",
        title: "Формирование внутреннего ТЗ на расчёты",
        duration: "1 день",
        responsible: "Подрядчик",
        items: [
          { text: "Определение расчётных сценариев пожара (не менее 4–5)" },
          { text: "Выбор зон моделирования и ПО (FDS/PyroSim, Pathfinder/AnyLogic)" },
        ],
      },
      {
        code: "0.4",
        title: "Согласование с Заказчиком графика предоставления недостающих данных",
        duration: "1 день",
        responsible: "Заказчик + Подрядчик",
        items: [],
      },
    ],
  },
  {
    code: "Эт.1",
    title: "Разработка концептуальной части СТУ (Раздел 1 — «Общие положения»)",
    duration: "2 раб. дня",
    responsible: "Подрядчик",
    color: "border-violet-400",
    headBg: "bg-violet-700",
    subtasks: [
      {
        code: "1.1",
        title: "Обоснование необходимости разработки СТУ",
        duration: "0,5 дня",
        responsible: "Подрядчик",
        items: [],
      },
      {
        code: "1.2",
        title: "Перечень нормативных документов",
        duration: "0,5 дня",
        responsible: "Подрядчик",
        items: [{ text: "Указание конкретных пунктов, которые не выполняются" }],
      },
      {
        code: "1.3",
        title: "Формулировка компенсирующих мероприятий (общая концепция)",
        duration: "1 день",
        responsible: "Подрядчик",
        items: [],
      },
    ],
  },
  {
    code: "Эт.2",
    title: "Разработка разделов СТУ: генплан, конструктивные и ОПР (Разделы 2, 3, 4)",
    duration: "5 раб. дней",
    responsible: "Подрядчик",
    color: "border-blue-400",
    headBg: "bg-blue-700",
    subtasks: [
      {
        code: "2.1",
        title: "Анализ генерального плана",
        duration: "2 дня",
        responsible: "Подрядчик",
        items: [
          { text: "Требования к пожарным проездам и разрывам" },
          { text: "Размещение пожарных гидрантов" },
        ],
      },
      {
        code: "2.2",
        title: "Конструктивные решения",
        duration: "2 дня",
        responsible: "Подрядчик",
        items: [
          { text: "Классы функциональной пожарной опасности (Ф1–Ф5)" },
          { text: "Требуемые пределы огнестойкости несущих и ограждающих конструкций" },
        ],
      },
      {
        code: "2.3",
        title: "Объёмно-планировочные решения",
        duration: "1 день",
        responsible: "Подрядчик",
        items: [
          { text: "Разделение здания на пожарные отсеки" },
          { text: "Определение эвакуационных зон и коридоров" },
        ],
      },
    ],
  },
  {
    code: "Эт.3",
    title: "Разработка требований к эвакуационным путям и выходам (Раздел 5 СТУ)",
    duration: "3 раб. дня",
    responsible: "Подрядчик",
    color: "border-cyan-400",
    headBg: "bg-cyan-700",
    subtasks: [
      {
        code: "3.1",
        title: "Предварительное определение схем эвакуации",
        duration: "1,5 дня",
        responsible: "Подрядчик",
        items: [
          { text: "МФЦ (1–2 этажи), офисные этажи (3–9), эксплуатируемая кровля, подземный паркинг" },
        ],
      },
      {
        code: "3.2",
        title: "Установление требований к путям эвакуации",
        duration: "1,5 дня",
        responsible: "Подрядчик",
        items: [
          { text: "Ширина и длина путей эвакуации" },
          { text: "Количество выходов по каждой зоне" },
          { text: "На основании анализа планировок разделов АР" },
        ],
      },
    ],
  },
  {
    code: "Эт.4",
    title: "Параллельный запуск расчётов (этапы 4А и 4Б выполняются одновременно)",
    duration: "12–15 раб. дней",
    responsible: "Подрядчик",
    color: "border-red-400",
    headBg: "bg-red-700",
    note: "Этапы 4А и 4Б выполняются параллельно, одновременно с Эт.5",
    subtasks: [
      {
        code: "4А.1",
        title: "Расчёт пожарного риска (Том Б) — Выбор расчётных сценариев",
        duration: "2 дня",
        responsible: "Подрядчик",
        parallel: "Том Б",
        items: [
          { text: "Сценарий 1: МФЦ, зал приёма посетителей (1 этаж)" },
          { text: "Сценарий 2: МФЦ, коридорная зона (2 этаж)" },
          { text: "Сценарий 3: Офисный этаж (типовой, 4–9 эт.)" },
          { text: "Сценарий 4: Эксплуатируемая кровля (3 этаж)" },
          { text: "Сценарий 5: Подземный паркинг (–1 этаж, 109 м/м)" },
        ],
      },
      {
        code: "4А.2",
        title: "Моделирование динамики опасных факторов пожара (ОФП)",
        duration: "8 дней",
        responsible: "Подрядчик",
        parallel: "Том Б",
        items: [
          { text: "ПО: FDS, PyroSim или отечественные программные комплексы" },
          { text: "Расчёт времени блокирования путей эвакуации (t_бл) по каждому сценарию" },
        ],
      },
      {
        code: "4А.3",
        title: "Моделирование эвакуации людей",
        duration: "8 дней (параллельно с 4А.2)",
        responsible: "Подрядчик",
        parallel: "Том Б",
        items: [
          { text: "ПО: Pathfinder, AnyLogic или аналоги" },
          { text: "Расчётное время эвакуации (t_э) для каждого сценария" },
        ],
      },
      {
        code: "4А.4",
        title: "Сравнение t_бл и t_э, расчёт индивидуального пожарного риска",
        duration: "3 дня",
        responsible: "Подрядчик",
        parallel: "Том Б",
        items: [
          { text: "При превышении нормативного риска — корректировка СТУ: ширина проходов, доп. выходы, усиление ПДВ" },
          { text: "Повторный расчёт (итерация) до достижения нормативных значений" },
        ],
      },
      {
        code: "4Б.1",
        title: "Отчёт по пожарным проездам и доступу ПО (Том В) — Анализ подъездных путей",
        duration: "4 дня",
        responsible: "Подрядчик",
        parallel: "Том В",
        items: [
          { text: "Ширина, высота, радиусы поворота, тупики, разворотные площадки" },
          { text: "Существующие и проектируемые подъезды к объекту" },
        ],
      },
      {
        code: "4Б.2",
        title: "Проверка возможности установки пожарной техники",
        duration: "2 дня",
        responsible: "Подрядчик",
        parallel: "Том В",
        items: [
          { text: "Автолестницы и пожарные машины у каждой пожарной зоны" },
          { text: "Зоны подъёма, доступа к оконным проёмам и кровле" },
        ],
      },
      {
        code: "4Б.3",
        title: "Рекомендации по генплану и подготовка тома В",
        duration: "4 дня",
        responsible: "Подрядчик",
        parallel: "Том В",
        items: [
          { text: "Карманы, площадки, одностороннее движение — рекомендации по доработке" },
          { text: "Схемы и графические приложения (план подъездов, таблицы)" },
          { text: "Формирование и верстка тома В" },
        ],
      },
    ],
  },
  {
    code: "Эт.5",
    title: "Разработка разделов СТУ: системы ПБ и электроснабжение (Разделы 6 и 7)",
    duration: "5 раб. дней (частично параллельно с Эт.4)",
    responsible: "Подрядчик",
    color: "border-amber-400",
    headBg: "bg-amber-600",
    subtasks: [
      {
        code: "5.1",
        title: "Требования к системам противопожарной защиты",
        duration: "3 дня",
        responsible: "Подрядчик",
        items: [
          { text: "АПС (автоматическая пожарная сигнализация)" },
          { text: "СОУЭ (система оповещения и управления эвакуацией)" },
          { text: "АУПТ (автоматическое пожаротушение)" },
          { text: "ПДВ (противодымная вентиляция)" },
          { text: "Аварийное освещение" },
        ],
      },
      {
        code: "5.2",
        title: "Таблица соответствия: отступление → компенсирующее мероприятие",
        duration: "2 дня",
        responsible: "Подрядчик",
        items: [
          { text: "Каждое отступление подтверждено расчётом пожарного риска (том Б)" },
          { text: "Раздел 7: требования к электроснабжению и категории надёжности" },
        ],
      },
    ],
  },
  {
    code: "Эт.6",
    title: "Разработка организационно-технических мероприятий (Раздел 8 СТУ)",
    duration: "2 раб. дня",
    responsible: "Подрядчик",
    color: "border-orange-400",
    headBg: "bg-orange-600",
    subtasks: [
      {
        code: "6.1",
        title: "Инструкции по пожарной безопасности и планы эвакуации",
        duration: "1 день",
        responsible: "Подрядчик",
        items: [],
      },
      {
        code: "6.2",
        title: "Обучение персонала и регламенты технического обслуживания",
        duration: "1 день",
        responsible: "Подрядчик",
        items: [
          { text: "Периодичность обслуживания систем ПБ" },
          { text: "Программа противопожарного инструктажа" },
        ],
      },
    ],
  },
  {
    code: "Эт.7",
    title: "Интеграция, проверка и финализация СТУ",
    duration: "5 раб. дней",
    responsible: "Подрядчик",
    color: "border-indigo-400",
    headBg: "bg-indigo-700",
    subtasks: [
      {
        code: "7.1",
        title: "Сборка всех разделов в единый том",
        duration: "1 день",
        responsible: "Подрядчик",
        items: [{ text: "Вёрстка, титульные листы, подписи, штампы" }],
      },
      {
        code: "7.2",
        title: "Перекрёстная проверка документации",
        duration: "2 дня",
        responsible: "Подрядчик",
        items: [
          { text: "Соответствие требований СТУ результатам расчёта риска (том Б)" },
          { text: "Соответствие требований СТУ данным отчёта по проездам (том В)" },
        ],
      },
      {
        code: "7.3",
        title: "Внутреннее рецензирование Заказчиком",
        duration: "2 дня",
        responsible: "ООО «Высотжилстрой»",
        items: [{ text: "Направление электронных версий всех томов Заказчику" }],
      },
      {
        code: "7.4",
        title: "Учёт замечаний Заказчика и корректировка",
        duration: "в пределах Эт.7",
        responsible: "Подрядчик",
        items: [],
      },
      {
        code: "⚑ M1",
        title: "Проект СТУ готов — все три тома завершены, проверены и согласованы с Заказчиком",
        duration: "~День 40",
        responsible: "Подрядчик",
        isMilestone: true,
      },
    ],
  },
  {
    code: "Эт.8",
    title: "Согласование в МЧС России",
    duration: "30–60 календарных дней",
    responsible: "Подрядчик",
    color: "border-red-600",
    headBg: "bg-red-800",
    subtasks: [
      {
        code: "8.1",
        title: "Подача заявления и пакета документов",
        duration: "1 день",
        responsible: "Подрядчик",
        items: [
          { text: "Подача через портал Госуслуг или в территориальный орган МЧС" },
          { text: "Пакет: СТУ (том А) + расчёт риска (том Б) + отчёт по проездам (том В)" },
        ],
      },
      {
        code: "8.2",
        title: "Регистрация и первичная проверка комплектности",
        duration: "до 5 дней",
        responsible: "МЧС России",
        items: [],
      },
      {
        code: "8.3",
        title: "Научно-технический совет (НТС) — рассмотрение по существу",
        duration: "30 календ. дней",
        responsible: "МЧС России",
        items: [{ text: "Участие разработчика в заседании НТС, защита документации" }],
      },
      {
        code: "⚑ M2",
        title: "Получение протокола НТС — замечания или одобрение",
        duration: "~День 45 (от подачи)",
        responsible: "МЧС России",
        isMilestone: true,
      },
      {
        code: "8.4",
        title: "Отработка замечаний МЧС — доработка СТУ и/или расчётов",
        duration: "до 10 раб. дней",
        responsible: "Подрядчик",
        items: [{ text: "До 10 рабочих дней на один цикл доработки" }],
      },
      {
        code: "8.5",
        title: "Повторная подача доработанной документации",
        duration: "1 день",
        responsible: "Подрядчик",
        items: [],
      },
      {
        code: "8.6",
        title: "Повторное рассмотрение (ускоренное)",
        duration: "до 15 дней",
        responsible: "МЧС России",
        items: [],
      },
      {
        code: "⚑ M3",
        title: "Получение официального письма МЧС о согласовании с регистрационным номером",
        duration: "~День 60 (от подачи)",
        responsible: "Подрядчик",
        isMilestone: true,
      },
      {
        code: "8.7",
        title: "Изготовление и передача оригиналов СТУ Заказчику",
        duration: "3 раб. дня",
        responsible: "Подрядчик",
        items: [
          { text: "2 бумажных экземпляра СТУ с отметкой «Согласовано письмом МЧС России»" },
          { text: "Электронные версии всех томов (PDF)" },
        ],
      },
      {
        code: "⚑ M4",
        title: "Проект завершён — документация передана Заказчику",
        duration: "День 3 (после письма МЧС)",
        responsible: "ООО «Высотжилстрой»",
        isMilestone: true,
      },
    ],
  },
];

const GANTT_ROWS = [
  { label: "Эт.0 · Анализ",                  start: 0,  len: 5,  color: "bg-slate-500",  note: "5 р.д." },
  { label: "Эт.1 · Концепция (р.1)",          start: 5,  len: 2,  color: "bg-violet-500", note: "2 р.д." },
  { label: "Эт.2 · Генплан, констр. (р.2-4)", start: 7,  len: 5,  color: "bg-blue-500",   note: "5 р.д." },
  { label: "Эт.3 · Эвакуация (р.5)",          start: 12, len: 3,  color: "bg-cyan-500",   note: "3 р.д." },
  { label: "Эт.4А · Расчёт риска (Том Б)",    start: 12, len: 13, color: "bg-red-400",    note: "13 р.д. ║" },
  { label: "Эт.4Б · Проезды (Том В)",         start: 12, len: 10, color: "bg-pink-400",   note: "10 р.д. ║" },
  { label: "Эт.5 · Сист. ПБ (р.6-7)",        start: 15, len: 5,  color: "bg-amber-500",  note: "5 р.д. ║" },
  { label: "Эт.6 · Орг. меропр. (р.8)",      start: 20, len: 2,  color: "bg-orange-500", note: "2 р.д." },
  { label: "Эт.7 · Финализация СТУ",          start: 25, len: 5,  color: "bg-indigo-500", note: "5 р.д." },
  { label: "Эт.8 · Согл. МЧС",               start: 30, len: 25, color: "bg-red-700",    note: "~55 к.д." },
];
const TOTAL_UNITS = 57;

const SOURCE_DATA = [
  "Выписка ЕГРН на земельный участок (к.н. 50:20:0030116:303)",
  "Генеральный план М 1:500 в электронном виде (DWG/PDF)",
  "Поэтажные планы здания (раздел АР) с экспликацией помещений",
  "Топографическая съёмка с нанесёнными дорогами и подъездными путями",
  "Разделы проектной документации: ЭОМ, АУПТ, СОУЭ, АД (противодымная вентиляция) — при наличии",
];

const COST_ROWS = [
  { n: 1, name: "Разработка тома А — Специальные технические условия (СТУ)",                                                        duration: "25 раб. дней",                     sum: "650 000" },
  { n: 2, name: "Разработка тома Б — Расчётное обоснование безопасной эвакуации, оценка индивидуального пожарного риска",          duration: "15 раб. дней (параллельно)",        sum: "300 000" },
  { n: 3, name: "Разработка тома В — Отчёт о предварительном планировании действий подразделений пожарной охраны (проезды, доступ)", duration: "10 раб. дней (параллельно)",        sum: "200 000" },
  { n: 4, name: "Полное сопровождение согласования СТУ в МЧС (подача, защита, замечания, получение заключения)",                   duration: "по регламенту МЧС 30–60 к.д.",       sum: "250 000" },
  { n: 5, name: "Передача 2 бумажных экз. СТУ с отметкой МЧС + электронные версии PDF всех томов",                                 duration: "3 раб. дня после письма МЧС",       sum: "—" },
];

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
          <Button onClick={() => window.print()} className="bg-red-600 hover:bg-red-700 text-white gap-2 text-sm">
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
                  <h1 className="text-[21px] font-black text-slate-900 leading-snug mb-3">
                    Разработка СТУ, расчёта пожарного риска<br />
                    и отчёта по проездам. <span className="text-red-600">Согласование в МЧС.</span>
                  </h1>
                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex items-start gap-1.5">
                      <Icon name="MapPin" size={11} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>МФК — Московская область, Одинцовский г.о., г. Одинцово, ул. Маршала Жукова, д. 26 (к.н. 50:20:0030116:303)</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Icon name="Building2" size={11} className="text-slate-400 shrink-0 mt-0.5" />
                      <span>Площадь 20 770 м² (наземная 15 758 м²) · 9 надземных + 1 подземный этаж · Паркинг 109 м/м</span>
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
                <div className="shrink-0 flex flex-col items-end gap-3">
                  <div className="text-right">
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">Дата</div>
                    <div className="text-sm font-bold text-slate-800">{DOC_DATE}</div>
                    <div className="text-[10px] text-slate-400">г. Санкт-Петербург</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-3">
                      <div className="text-[8px] text-blue-500 uppercase tracking-wider mb-1">Разработка</div>
                      <div className="text-xl font-black text-slate-900">~40</div>
                      <div className="text-[9px] text-slate-500">рабочих дней</div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-3">
                      <div className="text-[8px] text-red-500 uppercase tracking-wider mb-1">МЧС</div>
                      <div className="text-xl font-black text-slate-900">30–60</div>
                      <div className="text-[9px] text-slate-500">календ. дней</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl px-4 py-3 text-center w-full">
                    <div className="text-[8px] text-red-500 uppercase tracking-wider mb-0.5">Стоимость с НДС 20%</div>
                    <div className="text-2xl font-black text-slate-900">1 400 000 ₽</div>
                    <div className="text-[9px] text-slate-400">без НДС: 1 147 540,98 ₽</div>
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
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Ключевые вехи проекта</div>
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
                <div className="bg-slate-800 grid gap-3 px-4 py-2.5" style={{ gridTemplateColumns: "220px 1fr" }}>
                  <div className="text-[9px] font-bold text-white uppercase tracking-wider">Этап</div>
                  <div className="flex justify-between text-[8px] text-slate-400">
                    {["0", "10", "20", "30", "40 (→МЧС)", "50", "~57"].map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                {GANTT_ROWS.map((row, i) => (
                  <div
                    key={i}
                    className={`grid gap-3 px-4 py-2 border-b border-slate-100 items-center ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
                    style={{ gridTemplateColumns: "220px 1fr" }}
                  >
                    <div className="text-[10px] text-slate-700 font-medium leading-tight">{row.label}</div>
                    <div className="relative h-6">
                      <div
                        className={`absolute top-0.5 h-5 rounded ${row.color} flex items-center justify-center`}
                        style={{
                          left: `${(row.start / TOTAL_UNITS) * 100}%`,
                          width: `${Math.max((row.len / TOTAL_UNITS) * 100, 4)}%`,
                        }}
                      >
                        <span className="text-[8px] text-white font-bold px-1 truncate">{row.note}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="grid gap-3 px-4 py-2 bg-slate-50 border-t border-slate-200 items-center" style={{ gridTemplateColumns: "220px 1fr" }}>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Вехи</div>
                  <div className="relative h-6">
                    {[
                      { pos: 30 / TOTAL_UNITS, label: "M1", color: "bg-blue-600" },
                      { pos: 42 / TOTAL_UNITS, label: "M2", color: "bg-orange-500" },
                      { pos: 52 / TOTAL_UNITS, label: "M3", color: "bg-red-600" },
                      { pos: 56 / TOTAL_UNITS, label: "M4", color: "bg-emerald-600" },
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
              <div className="mt-2 text-[9px] text-slate-400">
                ║ — выполняется параллельно с другими этапами
              </div>
            </div>

            {/* ── ДЕТАЛЬНЫЙ ПЛАН ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Детальный план работ</div>
              </div>
              <div className="space-y-3">
                {PHASES.map((phase) => (
                  <div key={phase.code} className={`rounded-xl border-l-4 ${phase.color} border border-slate-200 overflow-hidden`}>
                    <div className={`${phase.headBg} px-5 py-3`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-[10px] font-black text-white bg-white/20 px-2 py-0.5 rounded shrink-0">{phase.code}</div>
                          <div className="text-sm font-bold text-white leading-snug">{phase.title}</div>
                        </div>
                        <div className="flex items-center gap-4 text-right shrink-0">
                          <div>
                            <div className="text-[8px] text-white/60 uppercase tracking-wider">Срок</div>
                            <div className="text-[10px] font-bold text-white whitespace-nowrap">{phase.duration}</div>
                          </div>
                          <div>
                            <div className="text-[8px] text-white/60 uppercase tracking-wider">Ответственный</div>
                            <div className="text-[10px] font-bold text-white whitespace-nowrap">{phase.responsible}</div>
                          </div>
                        </div>
                      </div>
                      {phase.note && (
                        <div className="mt-1.5 text-[9px] text-white/70 italic">{phase.note}</div>
                      )}
                    </div>
                    <div className="bg-white">
                      <div className="grid text-[8px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 px-4 py-1.5" style={{ gridTemplateColumns: "70px 1fr 170px 190px" }}>
                        <div>Код</div>
                        <div>Задача и состав работ</div>
                        <div className="text-center">Длительность</div>
                        <div>Ответственный</div>
                      </div>
                      {phase.subtasks.map((task, i) => (
                        <div
                          key={task.code}
                          className={`grid px-4 py-2.5 border-b border-slate-50 items-start ${
                            task.isMilestone ? "bg-amber-50 border-amber-100" : i % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                          }`}
                          style={{ gridTemplateColumns: "70px 1fr 170px 190px" }}
                        >
                          <div className={`text-[10px] font-black pt-0.5 ${task.isMilestone ? "text-amber-600" : task.parallel === "Том Б" ? "text-red-500" : task.parallel === "Том В" ? "text-pink-500" : "text-slate-400"}`}>
                            {task.code}
                          </div>
                          <div className="pr-4">
                            <div className={`text-[11px] leading-snug ${task.isMilestone ? "font-bold text-amber-800" : "text-slate-700"}`}>
                              {task.isMilestone && <span className="mr-1">⚑</span>}
                              {task.parallel && (
                                <span className={`mr-1.5 text-[8px] font-black px-1.5 py-0.5 rounded ${task.parallel === "Том Б" ? "bg-red-100 text-red-600" : "bg-pink-100 text-pink-600"}`}>
                                  {task.parallel}
                                </span>
                              )}
                              {task.title}
                            </div>
                            {task.items && task.items.length > 0 && (
                              <div className="mt-1.5 space-y-1">
                                {task.items.map((item, j) => (
                                  <div key={j} className="flex items-start gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                                    <div className="text-[10px] text-slate-500 leading-snug">{item.text}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className={`text-[10px] text-center pt-0.5 ${task.isMilestone ? "text-amber-600 font-bold" : "text-slate-500"}`}>
                            {task.duration}
                          </div>
                          <div className={`text-[10px] pt-0.5 ${task.isMilestone ? "text-amber-700 font-semibold" : "text-slate-500"}`}>
                            {task.responsible}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── СОСТАВ И СТОИМОСТЬ РАБОТ ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Состав и стоимость работ</div>
              </div>
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="grid bg-slate-800 text-[9px] font-bold text-white uppercase tracking-wider" style={{ gridTemplateColumns: "44px 1fr 220px 130px" }}>
                  <div className="px-3 py-2.5 text-center">№</div>
                  <div className="px-4 py-2.5">Этап / состав работ</div>
                  <div className="px-4 py-2.5 text-center">Срок</div>
                  <div className="px-4 py-2.5 text-right">Сумма с НДС, ₽</div>
                </div>
                {COST_ROWS.map(({ n, name, duration, sum }, i) => (
                  <div key={n} className={`grid border-b border-slate-100 items-start ${i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`} style={{ gridTemplateColumns: "44px 1fr 220px 130px" }}>
                    <div className="px-3 py-3 text-xs text-slate-400 text-center font-bold">{n}</div>
                    <div className="px-4 py-3 text-xs text-slate-700 leading-snug">{name}</div>
                    <div className="px-4 py-3 text-[10px] text-slate-500 text-center">{duration}</div>
                    <div className="px-4 py-3 text-sm font-bold text-slate-800 text-right tabular-nums">{sum}</div>
                  </div>
                ))}
                <div className="grid bg-red-600" style={{ gridTemplateColumns: "44px 1fr 220px 130px" }}>
                  <div className="px-3 py-3" />
                  <div className="px-4 py-3 text-sm font-black text-white">ИТОГО К ОПЛАТЕ (с НДС 20%)</div>
                  <div className="px-4 py-3 text-[10px] text-red-200 text-center">Один миллион четыреста тысяч рублей</div>
                  <div className="px-4 py-3 text-right text-lg font-black text-white tabular-nums">1 400 000</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Сумма без НДС</div>
                  <div className="text-base font-black text-slate-800 tabular-nums">1 147 540,98 ₽</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">НДС 20%</div>
                  <div className="text-base font-black text-slate-800 tabular-nums">252 459,02 ₽</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Условия оплаты</div>
                  <div className="text-[10px] font-bold text-slate-700">50% аванс · 50% по результату МЧС</div>
                </div>
              </div>
            </div>

            {/* ── ОПЛАТА ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Порядок оплаты</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">50%</span>
                    <div className="text-xs font-bold text-slate-800">Предоплата — 700 000 ₽</div>
                  </div>
                  <div className="text-[10px] text-slate-500">После подписания Договора</div>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">50%</span>
                    <div className="text-xs font-bold text-slate-800">Окончательный расчёт — 700 000 ₽</div>
                  </div>
                  <div className="text-[10px] text-slate-500">После получения положительного заключения МЧС России</div>
                </div>
              </div>
            </div>

            {/* ── ИСХОДНЫЕ ДАННЫЕ ── */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-red-500" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Исходные данные от Заказчика (обязательно)</div>
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
