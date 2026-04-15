import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { exportElementToPdf } from "@/lib/exportPdf";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const DOC_DATE = "апрель 2026 г.";
const DOC_NUM = "ДК-ПАДЕЛ-001/2026";

interface Task {
  id: string;
  title: string;
  result: string;
  days: number;
}

interface Stage {
  num: number;
  code: string;
  title: string;
  totalDays: number;
  color: string;
  headColor: string;
  bgLight: string;
  sections?: Section[];
  tasks?: Task[];
}

interface Section {
  code: string;
  title: string;
  days: number;
  color: string;
  tasks: Task[];
}

const stages: Stage[] = [
  {
    num: 0,
    code: "ЭТ-0",
    title: "Получение и анализ исходных данных",
    totalDays: 5,
    color: "border-slate-400",
    headColor: "bg-slate-700",
    bgLight: "bg-slate-50",
    tasks: [
      { id: "0.1", title: "Заключить договор с Заказчиком, получить аванс 40%", result: "Подписанный договор", days: 1 },
      { id: "0.2", title: "Передача Заказчиком исходных данных: ИТТ, план помещения в DWG, правила арендодателя, фото/видео ОКН", result: "Акт приёма-передачи исходных данных", days: 1 },
      { id: "0.3", title: "Анализ ограничений ОКН (запрет на изменение несущих конструкций, витражей, системы отопления)", result: "Служебная записка ГИПа для всех проектировщиков", days: 1 },
      { id: "0.4", title: "Проверка технического задания (ТЗ) от Заказчика на соответствие Приложению №4 правил арендодателя", result: "Замечания к ТЗ (при наличии)", days: 1 },
      { id: "0.5", title: "Разработка внутреннего календарного плана проектирования с вехами и контрольными точками", result: "Утверждённый план", days: 1 },
    ],
  },
  {
    num: 1,
    code: "ЭТ-1",
    title: "Разработка дизайн-проекта (концепция, эскизы)",
    totalDays: 12,
    color: "border-violet-400",
    headColor: "bg-violet-700",
    bgLight: "bg-violet-50",
    tasks: [
      { id: "1.1", title: "Функциональное зонирование: ресепшен, зона отдыха, 3 корта 20×10 и 1 корт 20×6", result: "План зонирования с размерами", days: 2 },
      { id: "1.2", title: "Две цветные концептуальные перспективы интерьера (аксонометрия)", result: "2 изображения JPEG/PDF", days: 4 },
      { id: "1.3", title: "План расстановки оборудования и мебели с габаритными размерами", result: "Чертёж М1:100", days: 2 },
      { id: "1.4", title: "Эскизные планы потолков, полов, ведомость отделочных материалов (покрытие 12 мм PADEL BASIC)", result: "Эскиз + ведомость", days: 2 },
      { id: "1.5", title: "Эскиз вывески и фасадного оформления с учётом архитектуры ТРК", result: "Цветная вывеска, схема крепления", days: 2 },
    ],
  },
  {
    num: 2,
    code: "ЭТ-2",
    title: "Разработка проектной документации (стадия «Проект»)",
    totalDays: 30,
    color: "border-blue-400",
    headColor: "bg-blue-700",
    bgLight: "bg-blue-50",
    sections: [
      {
        code: "АР",
        title: "Архитектурные решения",
        days: 8,
        color: "bg-blue-100",
        tasks: [
          { id: "2.1.1", title: "План помещений с экспликацией, ведомость отделки", result: "Лист АР-01", days: 2 },
          { id: "2.1.2", title: "План расстановки кортов, оборудования, мебели (детализированный)", result: "Лист АР-02", days: 2 },
          { id: "2.1.3", title: "План потолков с высотами, материалом, местами установки люков для доступа к коммуникациям ТРЦ", result: "Лист АР-03", days: 2 },
          { id: "2.1.4", title: "Разрезы и фасады с привязкой к существующим конструкциям ОКН", result: "Лист АР-04", days: 2 },
        ],
      },
      {
        code: "КР",
        title: "Конструктивные решения (некапитальные)",
        days: 4,
        color: "bg-indigo-100",
        tasks: [
          { id: "2.2.1", title: "Схема некапитальных перегородок (на 300–500 мм ниже подвесного потолка)", result: "Лист КР-01", days: 2 },
          { id: "2.2.2", title: "Узлы крепления вывески и навесного оборудования с расчётом закладных", result: "Лист КР-02", days: 2 },
        ],
      },
      {
        code: "ЭОМ",
        title: "Электроснабжение и освещение",
        days: 7,
        color: "bg-yellow-50",
        tasks: [
          { id: "2.3.1", title: "Расчёт электрических нагрузок (корты, освещение 400 лк, розетки)", result: "Таблица нагрузок", days: 1 },
          { id: "2.3.2", title: "Схема питания, однолинейная схема, ВРУ/щиты", result: "Лист ЭОМ-01", days: 2 },
          { id: "2.3.3", title: "План освещения: рабочее (400 лк на кортах), дежурное, аварийное", result: "Лист ЭОМ-02", days: 2 },
          { id: "2.3.4", title: "План силовых сетей и розеточных групп", result: "Лист ЭОМ-03", days: 2 },
        ],
      },
      {
        code: "ОВиК",
        title: "Отопление, вентиляция, кондиционирование",
        days: 8,
        color: "bg-cyan-50",
        tasks: [
          { id: "2.4.1", title: "Расчёт теплопотерь и воздухообмена для круглогодичной комфортной игры", result: "Расчётная таблица", days: 2 },
          { id: "2.4.2", title: "Выбор системы: ПВВ + сплит-системы/фанкойлы (с учётом запрета на изменение центральной системы отопления)", result: "Принципиальная схема", days: 2 },
          { id: "2.4.3", title: "План вентиляции с воздуховодами, решётками, диффузорами", result: "Лист ОВ-01", days: 2 },
          { id: "2.4.4", title: "План кондиционирования с размещением наружных блоков (согласование с арендодателем)", result: "Лист ОВ-02", days: 2 },
        ],
      },
      {
        code: "ВК",
        title: "Водоснабжение и канализация",
        days: 5,
        color: "bg-teal-50",
        tasks: [
          { id: "2.5.1", title: "Схема подключения к точкам ввода арендодателя (ХВС, ГВС, канализация)", result: "Лист ВК-01", days: 1 },
          { id: "2.5.2", title: "План санузлов, душевых, раковин, унитазов", result: "Лист ВК-02", days: 2 },
          { id: "2.5.3", title: "Спецификация оборудования и аксессуаров", result: "Спецификация", days: 2 },
        ],
      },
      {
        code: "СС",
        title: "Слаботочные системы",
        days: 3,
        color: "bg-green-50",
        tasks: [
          { id: "2.6.1", title: "Сеть интернет и телефония (точки доступа)", result: "Лист СС-01", days: 1 },
          { id: "2.6.2", title: "Видеонаблюдение (по требованию Заказчика)", result: "Лист СС-02", days: 1 },
          { id: "2.6.3", title: "Музыкальное оформление (зона ресепшен и кортов)", result: "Лист СС-03", days: 1 },
        ],
      },
      {
        code: "ПД",
        title: "Сводные документы",
        days: 5,
        color: "bg-gray-100",
        tasks: [
          { id: "2.7.1", title: "Пояснительная записка с описанием решений, обоснованием безопасности, учётом ОКН", result: "Текстовая часть тома ПД", days: 2 },
          { id: "2.7.2", title: "Сводные ведомости объёмов работ и локальная смета", result: "Смета", days: 2 },
          { id: "2.7.3", title: "Комплектование томов ПД: Т.1 – ПЗ, Т.2 – АР+КР, Т.3 – ЭОМ, Т.4 – ОВиК+ВК, Т.5 – СС", result: "Готовая структура папок", days: 1 },
        ],
      },
    ],
  },
  {
    num: 3,
    code: "ЭТ-3",
    title: "Внутренний контроль качества и нормоконтроль",
    totalDays: 5,
    color: "border-orange-400",
    headColor: "bg-orange-600",
    bgLight: "bg-orange-50",
    tasks: [
      { id: "3.1", title: "Проверка на соответствие СП, ГОСТ, правилам арендодателя (нормоконтроль)", result: "Список замечаний", days: 2 },
      { id: "3.2", title: "Исправление замечаний, доработка чертежей", result: "Исправленные листы", days: 2 },
      { id: "3.3", title: "Подпись документации у ГИПа, печать СРО", result: "Готовый комплект ПД", days: 1 },
    ],
  },
  {
    num: 4,
    code: "ЭТ-4",
    title: "Подготовка комплекта для согласования с арендодателем",
    totalDays: 3,
    color: "border-amber-400",
    headColor: "bg-amber-600",
    bgLight: "bg-amber-50",
    tasks: [
      { id: "4.1", title: "Формирование выписки из ПД: дизайн-проект, ТЗ, инженерные схемы (ЭОМ, ОВиК, ВК)", result: "Папка «На согласование»", days: 1 },
      { id: "4.2", title: "Проверка наличия сертификатов (пожарная безопасность, гигиенические) на материалы", result: "Реестр сертификатов", days: 1 },
      { id: "4.3", title: "Оформление сопроводительного письма и описи документов", result: "Письмо + опись", days: 1 },
    ],
  },
  {
    num: 5,
    code: "ЭТ-5",
    title: "Передача документации Заказчику и сопровождение согласования",
    totalDays: 13,
    color: "border-emerald-400",
    headColor: "bg-emerald-700",
    bgLight: "bg-emerald-50",
    tasks: [
      { id: "5.1", title: "Передача полного комплекта ПД и дизайн-проекта Заказчику по накладной", result: "Акт сдачи-приёмки этапа", days: 1 },
      { id: "5.2", title: "Сопровождение Заказчика при подаче документов арендодателю (консультации)", result: "Письмо с замечаниями (при наличии)", days: 10 },
      { id: "5.3", title: "Устранение замечаний арендодателя (доработка чертежей, пояснений)", result: "Доработанные листы", days: 3 },
      { id: "5.4", title: "Повторная передача доработанного комплекта", result: "Акт повторной сдачи", days: 1 },
      { id: "5.5", title: "Подписание итогового акта выполненных работ, выставление счёта на оставшиеся 30%", result: "Закрытие договора", days: 1 },
    ],
  },
];

const milestones = [
  { num: 1, day: "День 1", title: "Подписание договора и получение аванса 40%", color: "bg-slate-700" },
  { num: 2, day: "День 18 (кал.)", title: "Сдача дизайн-проекта Заказчику", color: "bg-violet-700" },
  { num: 3, day: "День 66 (кал.)", title: "Завершение всех разделов ПД (внутренний выпуск)", color: "bg-blue-700" },
  { num: 4, day: "День 78 (кал.)", title: "Передача полного комплекта Заказчику", color: "bg-orange-600" },
  { num: 5, day: "День 92 (кал.)", title: "Получение замечаний от арендодателя (если есть)", color: "bg-amber-600" },
  { num: 6, day: "День 96 (кал.)", title: "Утверждение документации и итоговый акт", color: "bg-emerald-700" },
];

const normDocs = [
  { code: "ПП РФ №87", title: "Состав разделов проектной документации (16.02.2008)" },
  { code: "ГОСТ Р 21.1101-2023", title: "Требования к оформлению чертежей и текстовых документов" },
  { code: "СП 255.1325800.2016", title: "Эксплуатация и приспособление объектов культурного наследия (ОКН)" },
  { code: "СП 118.13330.2022", title: "Общественные здания и сооружения" },
  { code: "СП 52.13330.2016", title: "Естественное и искусственное освещение" },
  { code: "СП 60.13330.2020", title: "Отопление, вентиляция и кондиционирование" },
  { code: "СП 30.13330.2020", title: "Внутренний водопровод и канализация" },
  { code: "СП 31-110-2003", title: "Проектирование и монтаж электроустановок" },
  { code: "Правила арендодателя", title: "Приложения №4, №5, №6, №11 – дополнительные требования к дизайн-проекту и согласованию" },
];

const restrictions = [
  "Запрещено изменять несущие конструкции ОКН, каркасы витражей и стёкла",
  "Запрещено переносить воздуховоды и решётки центральной системы вентиляции",
  "Запрещено переделывать систему отопления здания (допускается только добавление своего оборудования с согласованием)",
  "Запрещено закрывать двери помещения на время строительно-монтажных работ",
  "Запрещено использовать теплоноситель из систем отопления ТРЦ не по назначению",
];

// Gantt data: [stageLabel, startDay, endDay, color]
const ganttRows: Array<{ label: string; start: number; end: number; color: string }> = [
  { label: "Эт. 0: Исходные данные", start: 0, end: 5, color: "bg-slate-500" },
  { label: "Эт. 1: Дизайн-проект", start: 5, end: 17, color: "bg-violet-500" },
  { label: "Эт. 2 АР: Архитектура", start: 17, end: 25, color: "bg-blue-600" },
  { label: "Эт. 2 КР: Конструктив", start: 21, end: 25, color: "bg-indigo-500" },
  { label: "Эт. 2 ЭОМ: Электрика", start: 17, end: 24, color: "bg-yellow-500" },
  { label: "Эт. 2 ОВиК: Вентиляция", start: 20, end: 28, color: "bg-cyan-500" },
  { label: "Эт. 2 ВК: Водоснабжение", start: 22, end: 27, color: "bg-teal-500" },
  { label: "Эт. 2 СС: Слаботочка", start: 24, end: 27, color: "bg-green-500" },
  { label: "Эт. 2 ПД: Сводные", start: 27, end: 32, color: "bg-gray-500" },
  { label: "Эт. 3: Нормоконтроль", start: 32, end: 37, color: "bg-orange-500" },
  { label: "Эт. 4: Подготовка к согл.", start: 37, end: 40, color: "bg-amber-500" },
  { label: "Эт. 5: Согласование", start: 40, end: 55, color: "bg-emerald-500" },
];

const TOTAL_GANTT = 55;

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <div className="mt-7 mb-2">
      <span className="font-bold text-sm text-gray-800 uppercase tracking-wide">
        {num}. {title}
      </span>
      <div className="h-[2px] bg-gray-800 mt-1" />
    </div>
  );
}

export default function PadlDk() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      await exportElementToPdf(reportRef.current, "Дорожная_карта_СППИ_Падел-центр.pdf", 1200);
    } catch (e) {
      console.error(e);
    }
    setExporting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Логотип" className="h-9 object-contain" />
            <div>
              <div className="font-bold text-sm text-gray-900">ООО «СППИ»</div>
              <div className="text-xs text-gray-500">Дорожная карта проектирования · Падел-центр в ТРК (ОКН)</div>
            </div>
          </div>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm gap-2"
          >
            <Icon name="FileDown" size={16} />
            {exporting ? "Экспорт..." : "Скачать PDF"}
          </Button>
        </div>
      </div>

      {/* Document */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div
          ref={reportRef}
          className="bg-white shadow-lg text-gray-900"
          style={{ fontFamily: "Times New Roman, serif", padding: "20mm 20mm 18mm 25mm" }}
        >
          {/* ── HEADER ── */}
          <div className="flex items-start justify-between mb-5 pb-4 border-b-2 border-blue-700">
            <div className="flex items-center gap-4">
              <img src={LOGO_URL} alt="Логотип" className="h-16 object-contain" />
              <div>
                <div className="font-bold text-base text-gray-900">ООО «СППИ»</div>
                <div className="text-xs text-gray-600 mt-1">Специализированный проектный институт</div>
                <div className="text-xs text-gray-500">Член СРО в области архитектурно-строительного проектирования</div>
              </div>
            </div>
            <div className="text-right text-xs text-gray-700">
              <div className="font-bold text-blue-700 text-sm">№ {DOC_NUM}</div>
              <div className="mt-0.5">{DOC_DATE}</div>
            </div>
          </div>

          {/* ── TITLE ── */}
          <div className="text-center mb-5">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Дорожная карта проектирования</p>
            <h1 className="text-sm font-bold text-gray-900 uppercase leading-tight">
              Объект: «Падел-центр в помещении торгово-развлекательного<br />комплекса (объект культурного наследия)»
            </h1>
            <p className="text-xs text-gray-500 mt-1.5">Исполнитель: ООО «СППИ» · {DOC_DATE}</p>
          </div>

          {/* ── SUMMARY ── */}
          <div className="flex flex-wrap gap-3 bg-blue-700 text-white rounded p-4 mb-5 justify-center">
            <div className="text-center px-4">
              <div className="text-3xl font-black">55</div>
              <div className="text-xs mt-0.5">рабочих дней</div>
              <div className="text-[10px] opacity-70">(активные работы)</div>
            </div>
            <div className="w-px bg-white/30 self-stretch" />
            <div className="text-center px-4">
              <div className="text-3xl font-black">96</div>
              <div className="text-xs mt-0.5">календарных дней</div>
              <div className="text-[10px] opacity-70">(с учётом согласования)</div>
            </div>
            <div className="w-px bg-white/30 self-stretch" />
            <div className="text-center px-4">
              <div className="text-3xl font-black">6</div>
              <div className="text-xs mt-0.5">этапов</div>
              <div className="text-[10px] opacity-70">(Эт. 0 – Эт. 5)</div>
            </div>
            <div className="w-px bg-white/30 self-stretch" />
            <div className="text-center px-4">
              <div className="text-base font-bold">~3,5</div>
              <div className="text-xs mt-0.5">месяца</div>
              <div className="text-[10px] opacity-70">(полный цикл)</div>
            </div>
          </div>

          {/* ── SECTION 1: MILESTONES ── */}
          <SectionTitle num="1" title="Ключевые вехи" />
          <div className="grid grid-cols-2 gap-2 mb-4">
            {milestones.map((m) => (
              <div key={m.num} className="flex items-start gap-2 border border-blue-200 rounded p-2 bg-blue-50">
                <div className={`${m.color} text-white text-[10px] font-bold rounded px-2 py-1 shrink-0 min-w-[20px] text-center`}>
                  В{m.num}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-blue-700">{m.day}</div>
                  <div className="text-xs text-gray-800 leading-tight">{m.title}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── SECTION 2: GANTT ── */}
          <SectionTitle num="2" title="Диаграмма Ганта (рабочие дни)" />
          {(() => {
            const colW = (1 / TOTAL_GANTT) * 100;
            const weekMarks = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
            return (
              <div className="mb-5">
                {/* Week marks */}
                <div className="flex ml-44">
                  <div className="flex-1 relative" style={{ height: 16 }}>
                    {weekMarks.map((d) => (
                      <div
                        key={d}
                        className="absolute top-0 text-[8px] text-gray-400"
                        style={{ left: `${(d / TOTAL_GANTT) * 100}%`, transform: "translateX(-50%)" }}
                      >
                        {d > 0 ? `д.${d}` : ""}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Day header */}
                <div className="flex ml-44 mb-1">
                  <div className="flex-1 relative" style={{ height: 14 }}>
                    {Array.from({ length: TOTAL_GANTT }, (_, i) => (
                      <div
                        key={i}
                        className="absolute top-0 h-full border-l border-gray-200 flex items-center justify-center text-[7px] text-gray-400"
                        style={{ left: `${(i / TOTAL_GANTT) * 100}%`, width: `${colW}%` }}
                      >
                        {(i + 1) % 5 === 0 ? i + 1 : ""}
                      </div>
                    ))}
                  </div>
                </div>
                {ganttRows.map((row, idx) => (
                  <div key={idx} className="flex items-center mb-1">
                    <div className="w-44 shrink-0 text-[9px] text-gray-700 pr-2 text-right leading-tight">
                      {row.label}
                    </div>
                    <div className="flex-1 h-5 bg-gray-100 rounded relative">
                      {Array.from({ length: TOTAL_GANTT }, (_, i) => (
                        <div
                          key={i}
                          className="absolute top-0 h-full border-l border-gray-200"
                          style={{ left: `${(i / TOTAL_GANTT) * 100}%` }}
                        />
                      ))}
                      <div
                        className={`absolute top-0 h-full rounded ${row.color} flex items-center justify-center`}
                        style={{
                          left: `${(row.start / TOTAL_GANTT) * 100}%`,
                          width: `${((row.end - row.start) / TOTAL_GANTT) * 100}%`,
                        }}
                      >
                        <span className="text-[8px] text-white font-bold px-1">{row.end - row.start} р.д.</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* ── SECTION 3: STAGES DETAIL ── */}
          <SectionTitle num="3" title="Детальное описание этапов" />

          {stages.map((stage) => (
            <div key={stage.num} className={`mb-4 border rounded overflow-hidden ${stage.color}`}>
              {/* Stage header */}
              <div className={`${stage.headColor} text-white px-3 py-2 flex items-center justify-between`}>
                <span className="text-xs font-bold">
                  Этап {stage.num}. {stage.title}
                </span>
                <span className="text-[10px] opacity-80 font-semibold shrink-0 ml-2">
                  {stage.totalDays} р.д.
                </span>
              </div>

              {/* Simple tasks */}
              {stage.tasks && (
                <div className={`${stage.bgLight} p-3`}>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-1 pr-2 text-[10px] font-bold text-gray-600 uppercase w-8">№</th>
                        <th className="text-left py-1 pr-2 text-[10px] font-bold text-gray-600 uppercase">Задача</th>
                        <th className="text-left py-1 pr-2 text-[10px] font-bold text-gray-600 uppercase">Результат</th>
                        <th className="text-right py-1 text-[10px] font-bold text-gray-600 uppercase w-12">Срок</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stage.tasks.map((t) => (
                        <tr key={t.id} className="border-b border-gray-200 last:border-0">
                          <td className="py-1 pr-2 text-gray-500 font-mono text-[10px]">{t.id}</td>
                          <td className="py-1 pr-2 text-gray-800 leading-snug">{t.title}</td>
                          <td className="py-1 pr-2 text-gray-600 leading-snug">{t.result}</td>
                          <td className="py-1 text-right font-semibold text-gray-700 whitespace-nowrap">{t.days} р.д.</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Sections with tasks (stage 2) */}
              {stage.sections && stage.sections.map((sec) => (
                <div key={sec.code} className="border-t border-gray-200">
                  <div className={`${sec.color} px-3 py-1.5 flex items-center justify-between`}>
                    <span className="text-[11px] font-bold text-gray-800">Раздел {sec.code} — {sec.title}</span>
                    <span className="text-[10px] text-gray-600 font-semibold">{sec.days} р.д.</span>
                  </div>
                  <div className="bg-white px-3 pb-2">
                    <table className="w-full text-xs border-collapse">
                      <tbody>
                        {sec.tasks.map((t) => (
                          <tr key={t.id} className="border-b border-gray-100 last:border-0">
                            <td className="py-0.5 pr-2 text-gray-500 font-mono text-[10px] w-10">{t.id}</td>
                            <td className="py-0.5 pr-2 text-gray-800 leading-snug">{t.title}</td>
                            <td className="py-0.5 pr-2 text-gray-600 leading-snug">{t.result}</td>
                            <td className="py-0.5 text-right font-semibold text-gray-700 whitespace-nowrap text-[11px] w-12">{t.days} р.д.</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* ── SECTION 4: TIMELINE SUMMARY ── */}
          <SectionTitle num="4" title="Итоговые сроки" />
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="border border-blue-200 rounded p-3 bg-blue-50 text-center">
              <div className="text-2xl font-black text-blue-800">55</div>
              <div className="text-xs font-bold text-blue-700 mt-0.5">рабочих дней</div>
              <div className="text-[10px] text-gray-600 mt-1">Активные проектные работы (Этапы 0–4)</div>
            </div>
            <div className="border border-amber-200 rounded p-3 bg-amber-50 text-center">
              <div className="text-2xl font-black text-amber-700">+13</div>
              <div className="text-xs font-bold text-amber-600 mt-0.5">рабочих дней</div>
              <div className="text-[10px] text-gray-600 mt-1">Согласование и доработки (Этап 5)</div>
            </div>
            <div className="border border-emerald-200 rounded p-3 bg-emerald-50 text-center">
              <div className="text-2xl font-black text-emerald-700">96</div>
              <div className="text-xs font-bold text-emerald-600 mt-0.5">календарных дней</div>
              <div className="text-[10px] text-gray-600 mt-1">Полный цикл от старта до итогового акта</div>
            </div>
          </div>

          {/* ── SECTION 5: NORMS ── */}
          <SectionTitle num="5" title="Применяемая нормативная база" />
          <div className="mb-4 border border-gray-200 rounded overflow-hidden">
            {normDocs.map((doc, i) => (
              <div key={i} className={`flex gap-3 px-3 py-1.5 text-xs ${i % 2 === 0 ? "bg-white" : "bg-gray-50"} ${i < normDocs.length - 1 ? "border-b border-gray-100" : ""}`}>
                <span className="font-bold text-blue-700 shrink-0 w-40">{doc.code}</span>
                <span className="text-gray-700">{doc.title}</span>
              </div>
            ))}
          </div>

          {/* ── SECTION 6: RESTRICTIONS ── */}
          <SectionTitle num="6" title="Ключевые ограничения объекта (ОКН)" />
          <div className="mb-4 bg-red-50 border border-red-300 rounded p-3">
            <ul className="space-y-1.5">
              {restrictions.map((r, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-800">
                  <span className="shrink-0 text-red-600 font-bold">✗</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── SIGNATURE ── */}
          <div className="border-t-2 border-gray-800 pt-5 mt-4 flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-2">С уважением,</p>
              <p className="text-xs text-gray-700">Главный инженер проекта</p>
              <p className="text-xs font-bold text-gray-900">ООО «СППИ»</p>
              <div className="mt-5 text-xs text-gray-400">
                <div>________________</div>
                <div className="mt-0.5">(подпись)</div>
              </div>
            </div>
            <div className="text-center">
              <img src={STAMP_URL} alt="Печать" className="h-28 w-28 object-contain opacity-90" />
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
            <span>ООО «СППИ» · Проектный институт</span>
            <span>№ {DOC_NUM} · {DOC_DATE}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
