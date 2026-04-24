import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL = "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL = "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

// ─── Milestones ───────────────────────────────────────────────────────────────
const MILESTONES = [
  { id: "M1", date: "25.06.2026", label: "Техотчёт по изысканиям", act: "Акт №1", color: "#0369a1" },
  { id: "M2", date: "07.08.2026", label: "Заключение по геомеханике", act: "Акт №2", color: "#0891b2" },
  { id: "M3", date: "17.09.2026", label: "Положительное СЭЗ по СЗЗ", act: "Акт №3", color: "#7c3aed" },
  { id: "M4", date: "29.01.2027", label: "Полный комплект ПД", act: "Акт №4", color: "#dc2626" },
  { id: "M5", date: "15.09.2026", label: "Протокол общественных обсуждений", act: "Акт №5", color: "#059669" },
  { id: "M6", date: "12.03.2027", label: "Положительное заключение ГЭЭ", act: "Акт №6", color: "#b91c1c" },
  { id: "M7", date: "16.04.2027", label: "Положительное заключение ГГЭ", act: "Акт №7", color: "#92400e" },
  { id: "M8", date: "14.05.2027", label: "Комплект РД + сметы", act: "Итоговый акт", color: "#374151" },
];

// ─── Gantt data ───────────────────────────────────────────────────────────────
// months: 0=Apr, 1=May, 2=Jun, 3=Jul, 4=Aug, 5=Sep, 6=Oct, 7=Nov, 8=Dec, 9=Jan, 10=Feb, 11=Mar, 12=Apr, 13=May
const GANTT = [
  { id: "01", label: "ОПР", color: "#1e40af", start: 0.5, end: 1.0 },
  { id: "02", label: "Геодезические изыскания", color: "#0369a1", start: 1.0, end: 2.5 },
  { id: "03", label: "Геологические изыскания", color: "#0369a1", start: 1.0, end: 3.0 },
  { id: "04", label: "Гидрометеорологические", color: "#0369a1", start: 1.25, end: 3.0 },
  { id: "05", label: "Экологические изыскания", color: "#0369a1", start: 1.75, end: 4.0 },
  { id: "06", label: "Геотехнические изыскания", color: "#0369a1", start: 1.75, end: 3.0 },
  { id: "07", label: "Археология", color: "#92400e", start: 1.25, end: 2.0 },
  { id: "08", label: "Геомеханика", color: "#7c3aed", start: 2.0, end: 5.25, milestone: "M2" },
  { id: "09", label: "Проект СЗЗ", color: "#059669", start: 3.5, end: 6.0, milestone: "M3" },
  { id: "10", label: "ОВОС + общ. обсуждения", color: "#b45309", start: 2.25, end: 6.0, milestone: "M5" },
  { id: "11", label: "ПД (стадия Проект)", color: "#dc2626", start: 5.75, end: 10.0, milestone: "M4", critical: true },
  { id: "12", label: "Проект рекультивации", color: "#b91c1c", start: 5.75, end: 8.0 },
  { id: "13", label: "Защита от затопления", color: "#b91c1c", start: 6.0, end: 8.5 },
  { id: "14", label: "Горный отвод", color: "#374151", start: 8.5, end: 10.75 },
  { id: "15", label: "ГЭЭ", color: "#b91c1c", start: 10.25, end: 12.0, milestone: "M6" },
  { id: "16", label: "ГГЭ", color: "#92400e", start: 10.75, end: 13.0, milestone: "M7" },
  { id: "17", label: "Корректировка ПД (резерв)", color: "#6b7280", start: 12.5, end: 13.25 },
  { id: "18", label: "РД + Сметы", color: "#1d4ed8", start: 11.5, end: 14.0, milestone: "M8" },
];

const TOTAL_MONTHS = 14; // Apr 2026 → May 2027
const MONTH_LABELS = ["Апр'26", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек", "Янв'27", "Фев", "Мар", "Апр", "Май"];

// ─── Resource table ───────────────────────────────────────────────────────────
const RESOURCES = [
  { month: "Май 2026", gip: 12, geolog: 80, geodezist: 60, ecolog: 40, smetchik: 0, total: 192 },
  { month: "Июнь 2026", gip: 15, geolog: 100, geodezist: 20, ecolog: 80, smetchik: 0, total: 215 },
  { month: "Июль 2026", gip: 15, geolog: 60, geodezist: 0, ecolog: 100, smetchik: 0, total: 175 },
  { month: "Август 2026", gip: 18, geolog: 40, geodezist: 0, ecolog: 60, smetchik: 0, total: 118 },
  { month: "Сентябрь 2026", gip: 20, geolog: 20, geodezist: 0, ecolog: 40, smetchik: 0, total: 80 },
  { month: "Октябрь 2026", gip: 22, geolog: 10, geodezist: 0, ecolog: 20, smetchik: 0, total: 52 },
  { month: "Ноябрь 2026", gip: 20, geolog: 5, geodezist: 0, ecolog: 10, smetchik: 5, total: 40 },
  { month: "Декабрь 2026", gip: 18, geolog: 5, geodezist: 0, ecolog: 5, smetchik: 10, total: 38 },
  { month: "Январь 2027", gip: 15, geolog: 5, geodezist: 0, ecolog: 5, smetchik: 15, total: 40 },
  { month: "Февраль 2027", gip: 10, geolog: 0, geodezist: 0, ecolog: 0, smetchik: 20, total: 30 },
  { month: "Март 2027", gip: 8, geolog: 0, geodezist: 0, ecolog: 0, smetchik: 30, total: 38 },
  { month: "Апрель 2027", gip: 5, geolog: 0, geodezist: 0, ecolog: 0, smetchik: 25, total: 30 },
  { month: "Май 2027", gip: 3, geolog: 0, geodezist: 0, ecolog: 0, smetchik: 15, total: 18 },
];

// ─── Initial data registry ────────────────────────────────────────────────────
const INITIAL_DATA = [
  { n: 1, doc: "Лицензия КЕМ 02209 ТЭ", form: "Копия", deadline: "+0 дн." },
  { n: 2, doc: "Геологический отчёт с подсчётом запасов", form: "PDF + бумага", deadline: "+5 дн." },
  { n: 3, doc: "Протоколы утверждения запасов", form: "Копия", deadline: "+5 дн." },
  { n: 4, doc: "ТЭО постоянных разведочных кондиций", form: "PDF", deadline: "+10 дн." },
  { n: 5, doc: "Топоплан М 1:5000 на район работ", form: ".dwg + .pdf", deadline: "+5 дн." },
  { n: 6, doc: "Шаблон сметы ООО «РУК»", form: ".xls", deadline: "+5 дн." },
];

// ─── Approvals ────────────────────────────────────────────────────────────────
const APPROVALS = [
  { n: 1, label: "Справка об ООПТ (Красная книга)", organ: "Минприроды РФ", days: 14 },
  { n: 2, label: "Согласование рекультивации", organ: "Правообладатели земли", days: 20 },
  { n: 3, label: "Согласование с Росрыболовством", organ: "ТУ Росрыболовства", days: 30 },
  { n: 4, label: "Решение на водный объект (спрямление русла)", organ: "Минприроды Кузбасса", days: 45 },
  { n: 5, label: "Положительное СЭЗ (СЗЗ)", organ: "Роспотребнадзор", days: 25 },
  { n: 6, label: "Разрешение на застройку (ГОЗ)", organ: "Роснедра", days: 30 },
];

// ─── QC plan ─────────────────────────────────────────────────────────────────
const QC = [
  { n: 1, stage: "После завершения каждого этапа изысканий", checker: "ГИП", format: "Акт проверки" },
  { n: 2, stage: "Геомеханическое заключение", checker: "Внешний эксперт (д.т.н.)", format: "Рецензия" },
  { n: 3, stage: "ПД (30% готовности)", checker: "ГИП + Заказчик", format: "Совещание" },
  { n: 4, stage: "ПД (70% готовности)", checker: "НТС", format: "Протокол НТС" },
  { n: 5, stage: "ПД (100% готовности)", checker: "Главный инженер проекта", format: "Штамп «В работу»" },
];

// ─── Stage details ────────────────────────────────────────────────────────────
const STAGES = [
  {
    n: 1, title: "Организационно-подготовительные работы", period: "10 р.д. · 11.05 – 22.05.2026", color: "#1e40af",
    icon: "Settings",
    output: "Приказ о начале работ, программа изысканий, реестр субподрядчиков",
    rows: [
      { n: "1.1", work: "Изучение ТЗ, лицензии, геологических отчётов", note: "ГИП", labor: "8 р.д." },
      { n: "1.2", work: "Разработка программы инженерных изысканий", note: "ГИП", labor: "4 р.д." },
      { n: "1.3", work: "Получение разрешительных документов на полевые работы", note: "ГИП", labor: "2 р.д." },
      { n: "1.4", work: "Заключение субподрядных договоров (археология, геотехника)", note: "Менеджер проекта", labor: "6 р.д." },
      { n: "1.5", work: "Разработка календарного плана ПИР (уровень 2)", note: "ГИП + планёр", labor: "3 р.д." },
    ],
  },
  {
    n: 2, title: "Инженерно-геодезические изыскания", period: "25 р.д. · 11.05 – 12.06.2026", color: "#0369a1",
    icon: "Compass",
    output: "Топоплан М 1:2000, ЦММ, каталог координат",
    rows: [
      { n: "2.1", work: "Создание планово-высотного обоснования", note: "СП 47.13330", labor: "5 р.д." },
      { n: "2.2", work: "Топографическая съёмка М 1:2000 (участок 12 км²)", note: "п.12 ТЗ", labor: "10 р.д." },
      { n: "2.3", work: "Съёмка существующих коммуникаций и дорог", note: "п.20 ТЗ", labor: "4 р.д." },
      { n: "2.4", work: "Съёмка русла р. Кумзас (участок 2,3 км)", note: "п.22(3) ТЗ", labor: "3 р.д." },
      { n: "2.5", work: "Камеральная обработка, построение ЦММ", note: "—", labor: "3 р.д." },
    ],
  },
  {
    n: 3, title: "Инженерно-геологические изыскания", period: "35 р.д. · 11.05 – 26.06.2026", color: "#0891b2",
    icon: "Mountain",
    output: "Инженерно-геологический отчёт с разрезами и таблицами свойств",
    rows: [
      { n: "3.1", work: "Бурение скважин (СП 446.1325800.2019) — 18 скв. × 25 м", note: "П.12(в) ТЗ", labor: "15 р.д." },
      { n: "3.2", work: "Отбор монолитов и проб воды — 54 монолита", note: "ГОСТ 12071-2014", labor: "5 р.д." },
      { n: "3.3", work: "Лабораторные определения (физ.-мех. свойства) — 54 образца", note: "ГОСТ 12248-2010", labor: "10 р.д." },
      { n: "3.4", work: "Определение гранулометрического состава вскрыши — 18 проб", note: "ГОСТ 12536-2014", labor: "3 р.д." },
      { n: "3.5", work: "Камералка, построение геологических разрезов — 6 разрезов", note: "—", labor: "2 р.д." },
    ],
  },
  {
    n: 4, title: "Инженерно-гидрометеорологические изыскания", period: "30 р.д. · 18.05 – 26.06.2026", color: "#0284c7",
    icon: "Waves",
    output: "Гидрологический отчёт, карты затопления",
    rows: [
      { n: "4.1", work: "Гидрологические наблюдения на р. Кумзас (5 постов)", note: "п.22(3) ТЗ", labor: "12 р.д." },
      { n: "4.2", work: "Расчёт максимальных расходов воды (1%, 2%, 10%)", note: "СП 33-101-2003", labor: "5 р.д." },
      { n: "4.3", work: "Оценка подтопления территории", note: "п.12(в) ТЗ", labor: "6 р.д." },
      { n: "4.4", work: "Гидрохимический анализ проб воды", note: "СанПиН 1.2.3685-21", labor: "4 р.д." },
      { n: "4.5", work: "Метеорологическая характеристика района", note: "СП 131.13330", labor: "3 р.д." },
    ],
  },
  {
    n: 5, title: "Инженерно-экологические изыскания", period: "45 р.д. · 25.05 – 24.07.2026", color: "#059669",
    icon: "Leaf",
    output: "Отчёт по инженерно-экологическим изысканиям, расчёт фона",
    rows: [
      { n: "5.1", work: "Отбор проб почв (46 проб)", note: "СанПиН 1.2.3685-21", labor: "8 р.д." },
      { n: "5.2", work: "Отбор проб поверхностных вод (12 створов)", note: "п.22(3) ТЗ", labor: "6 р.д." },
      { n: "5.3", work: "Отбор проб донных отложений (12 проб)", note: "—", labor: "4 р.д." },
      { n: "5.4", work: "Газохимический анализ атмосферного воздуха (7 постов)", note: "ФЗ №96-ФЗ", labor: "10 р.д." },
      { n: "5.5", work: "Шумовой мониторинг (5 точек)", note: "СН 2.2.4/2.1.8.562-96", labor: "4 р.д." },
      { n: "5.6", work: "Радиологическое обследование", note: "СанПиН 2.6.1.2523-09", labor: "3 р.д." },
      { n: "5.7", work: "Лабораторные анализы (аккредитованная лаборатория)", note: "—", labor: "10 р.д." },
    ],
  },
  {
    n: 6, title: "Геотехнические изыскания (устойчивость бортов)", period: "20 р.д. · 01.06 – 26.06.2026", color: "#4f46e5",
    icon: "Drill",
    output: "Таблица физико-механических свойств для геомеханики",
    rows: [
      { n: "6.1", work: "Определение прочности пород на сдвиг", note: "ГОСТ 21153.4-88", labor: "8 р.д." },
      { n: "6.2", work: "Определение угла внутреннего трения", note: "ГОСТ 12248-2010", labor: "5 р.д." },
      { n: "6.3", work: "Оценка трещиноватости массива", note: "ПБ 05-619-03", labor: "4 р.д." },
      { n: "6.4", work: "Оценка фильтрационных свойств", note: "—", labor: "3 р.д." },
    ],
  },
  {
    n: 7, title: "Археологические исследования", period: "15 р.д. · 18.05 – 05.06.2026", color: "#92400e",
    icon: "Landmark",
    output: "Акт историко-культурной экспертизы или справка об отсутствии ОКН",
    rows: [
      { n: "7.1", work: "Кабинетные исследования (архивы, музеи)", note: "—", labor: "3 р.д." },
      { n: "7.2", work: "Полевая разведка (визуальная + шурфовка)", note: "—", labor: "8 р.д." },
      { n: "7.3", work: "Фотофиксация, GPS-привязка", note: "—", labor: "2 р.д." },
      { n: "7.4", work: "Камералка + акт ГИКЭ (при наличии)", note: "—", labor: "2 р.д." },
    ],
  },
  {
    n: 8, title: "Геомеханическое обоснование параметров устойчивости", period: "50 р.д. · 01.06 – 07.08.2026", color: "#7c3aed",
    icon: "BarChart3",
    output: "Заключение «Параметры устойчивости откосов бортов, уступов и отвалов»",
    milestone: "M2",
    rows: [
      { n: "8.1", work: "Сбор исходных данных (геология, гидрогеология)", note: "—", labor: "3 р.д." },
      { n: "8.2", work: "Выбор расчётных сечений (7 профилей)", note: "п.26 ТЗ", labor: "4 р.д." },
      { n: "8.3", work: "Расчёт устойчивости бортов (метод касательных)", note: "ФНиП №436", labor: "10 р.д." },
      { n: "8.4", work: "Численное моделирование (Plaxis / RS2)", note: "—", labor: "15 р.д." },
      { n: "8.5", work: "Расчёт устойчивости отвалов (5 отвалов)", note: "ПБ 05-619-03", labor: "8 р.д." },
      { n: "8.6", work: "Обоснование углов откосов (борта, уступы, отвалы)", note: "—", labor: "5 р.д." },
      { n: "8.7", work: "Разработка рекомендаций по бортам", note: "—", labor: "3 р.д." },
      { n: "8.8", work: "Оформление заключения", note: "—", labor: "2 р.д." },
    ],
  },
  {
    n: 9, title: "Проект санитарно-защитной зоны (СЗЗ)", period: "40 р.д. · 27.07 – 17.09.2026", color: "#0f766e",
    icon: "ShieldAlert",
    output: "Положительное санитарно-эпидемиологическое заключение",
    milestone: "M3",
    rows: [
      { n: "9.1", work: "Расчёт рассеивания выбросов (УПРЗА «Эколог»)", note: "п.22(6) ТЗ", labor: "10 р.д." },
      { n: "9.2", work: "Расчёт шумового воздействия", note: "СН 2.2.4/2.1.8.562-96", labor: "5 р.д." },
      { n: "9.3", work: "Обоснование размера СЗЗ (500/1000 м)", note: "СанПиН 2.2.1/2.1.1.1200-03", labor: "5 р.д." },
      { n: "9.4", work: "Разработка мероприятий по СЗЗ", note: "—", labor: "4 р.д." },
      { n: "9.5", work: "Картографический материал (М 1:5000)", note: "—", labor: "6 р.д." },
      { n: "9.6", work: "Согласование с аккредитованной организацией", note: "п.22(6) ТЗ", labor: "6 р.д." },
      { n: "9.7", work: "Получение СЭЗ в Роспотребнадзоре", note: "—", labor: "4 р.д." },
    ],
  },
  {
    n: 10, title: "ОВОС + Организация общественных обсуждений", period: "65 р.д. · 15.06 – 15.09.2026", color: "#b45309",
    icon: "Users",
    output: "Том ОВОС, протокол общественных обсуждений",
    milestone: "M5",
    rows: [
      { n: "10.1", work: "Анализ альтернативных вариантов", note: "Пост. №1644", labor: "5 р.д." },
      { n: "10.2", work: "Оценка воздействия на атмосферу", note: "ФЗ №96-ФЗ", labor: "8 р.д." },
      { n: "10.3", work: "Оценка воздействия на водные объекты", note: "ВК РФ", labor: "10 р.д." },
      { n: "10.4", work: "Оценка воздействия на недра", note: "ФЗ «О недрах»", labor: "5 р.д." },
      { n: "10.5", work: "Оценка воздействия на отходы", note: "ФЗ №89-ФЗ", labor: "4 р.д." },
      { n: "10.6", work: "Оценка воздействия на растительный / животный мир", note: "ФЗ №7-ФЗ", labor: "6 р.д." },
      { n: "10.7", work: "Оценка воздействия на социальную сферу", note: "—", labor: "3 р.д." },
      { n: "10.8", work: "Подготовка тома ОВОС", note: "—", labor: "8 р.д." },
      { n: "10.9", work: "Разработка презентационных материалов", note: "п.22(8) ТЗ", labor: "3 р.д." },
      { n: "10.10", work: "Уведомление администрации и СМИ", note: "—", labor: "3 р.д." },
      { n: "10.11", work: "Проведение слушаний (не менее 1 собрания)", note: "—", labor: "3 р.д." },
      { n: "10.12", work: "Составление протокола и заключения", note: "—", labor: "2 р.д." },
    ],
  },
  {
    n: 11, title: "Проектная документация (стадия «Проект») — КРИТИЧЕСКИЙ ПУТЬ", period: "90 р.д. · 28.09.2026 – 29.01.2027", color: "#dc2626",
    icon: "FileStack",
    output: "Полный комплект ПД — 14 томов + 4 спецтома (бумага + электронно)",
    milestone: "M4",
    critical: true,
    rows: [
      { n: "Том 1", work: "ПОЗ — Пояснительная записка", note: "п.14 ТЗ", labor: "5 чел.-дн." },
      { n: "Том 2", work: "СХР — Схема карьера, отвалов, дорог", note: "п.12(а) ТЗ", labor: "15 чел.-дн." },
      { n: "Том 3", work: "АР — Архитектурные решения (АБК существующий)", note: "п.23 ТЗ", labor: "3 чел.-дн." },
      { n: "Том 4", work: "КР — Конструктивные решения", note: "п.28 ТЗ", labor: "8 чел.-дн." },
      { n: "Том 5а", work: "ИОС — Электроснабжение (ДГУ → внешние сети)", note: "п.19 ТЗ", labor: "12 чел.-дн." },
      { n: "Том 5б", work: "ИОС — Связь", note: "п.19 ТЗ", labor: "4 чел.-дн." },
      { n: "Том 5в", work: "ИОС — Водоснабжение и водоотведение", note: "п.19 ТЗ", labor: "8 чел.-дн." },
      { n: "Том 6", work: "ПОС — Проект организации строительства", note: "п.14 ТЗ", labor: "10 чел.-дн." },
      { n: "Том 7", work: "ПБ — Промышленная безопасность (ОПО)", note: "п.12(г) ТЗ", labor: "10 чел.-дн." },
      { n: "Том 8", work: "ПБ — Пожарная безопасность", note: "п.29 ТЗ", labor: "6 чел.-дн." },
      { n: "Том 9", work: "ПЭЭ — Энергоэффективность", note: "п.13 ТЗ", labor: "4 чел.-дн." },
      { n: "Том 10", work: "СМ — Смета (стадия ПД)", note: "п.31 ТЗ", labor: "8 чел.-дн." },
      { n: "Том 11", work: "ГОЧС — Гражданская оборона", note: "—", labor: "4 чел.-дн." },
      { n: "Спец 1", work: "Проект рекультивации (отдельный том)", note: "28.09–30.10", labor: "35 чел.-дн." },
      { n: "Спец 2", work: "Инженерная защита от затопления (спрямление русла)", note: "28.09–06.11", labor: "25 чел.-дн." },
      { n: "Спец 3", work: "Склонность углей к самовозгоранию (субподряд)", note: "28.09–09.10", labor: "10 чел.-дн." },
      { n: "Спец 4", work: "Автоматизированная ТЗС контейнерного типа", note: "28.09–02.10", labor: "6 чел.-дн." },
    ],
  },
  {
    n: 12, title: "Проект горного отвода", period: "30 р.д. · 18.01 – 26.02.2027", color: "#374151",
    icon: "Map",
    output: "Удостоверение горного отвода",
    rows: [
      { n: "12.1", work: "Подготовка координатного описания границ", note: "—", labor: "6 р.д." },
      { n: "12.2", work: "Согласование с территориальным органом Роснедр", note: "—", labor: "10 р.д." },
      { n: "12.3", work: "Подготовка пакета документов на утверждение", note: "—", labor: "5 р.д." },
      { n: "12.4", work: "Получение удостоверения горного отвода", note: "—", labor: "9 р.д." },
    ],
  },
  {
    n: 13, title: "Государственная экологическая экспертиза (ГЭЭ)", period: "30 р.д. · 01.02 – 12.03.2027", color: "#b91c1c",
    icon: "Leaf",
    output: "Положительное заключение ГЭЭ",
    milestone: "M6",
    rows: [
      { n: "13.1", work: "Подача заявления + ПД + ОВОС", note: "ФЗ №174-ФЗ", labor: "2 р.д." },
      { n: "13.2", work: "Проверка комплектности (5 дней)", note: "п.8 Приказа №502", labor: "—" },
      { n: "13.3", work: "Экспертиза (30 дней)", note: "ФЗ №174-ФЗ", labor: "—" },
      { n: "13.4", work: "Сопровождение, ответы на замечания", note: "—", labor: "10 р.д." },
      { n: "13.5", work: "Получение положительного заключения", note: "—", labor: "1 р.д." },
    ],
  },
  {
    n: 14, title: "Государственная экспертиза ПД (Главгосэкспертиза — ГГЭ)", period: "45 р.д. · 15.02 – 16.04.2027", color: "#92400e",
    icon: "CheckSquare",
    output: "Положительное заключение ГГЭ (ПД + изыскания)",
    milestone: "M7",
    rows: [
      { n: "14.1", work: "Подача документов через ЕЦПЭ", note: "—", labor: "2 р.д." },
      { n: "14.2", work: "Проверка комплектности (10 дней)", note: "—", labor: "—" },
      { n: "14.3", work: "Экспертиза (35 дней)", note: "—", labor: "—" },
      { n: "14.4", work: "Сопровождение, ответы на замечания", note: "—", labor: "15 р.д." },
      { n: "14.5", work: "Получение положительного заключения", note: "—", labor: "1 р.д." },
    ],
  },
  {
    n: 15, title: "Корректировка ПД по замечаниям (РЕЗЕРВ)", period: "15 р.д. · 19.04 – 07.05.2027", color: "#6b7280",
    icon: "RefreshCw",
    output: "Скорректированная ПД с устранёнными замечаниями",
    rows: [
      { n: "15.1", work: "Анализ замечаний ГГЭ/ГЭЭ", note: "—", labor: "2 р.д." },
      { n: "15.2", work: "Внесение правок в текстовую часть", note: "—", labor: "6 р.д." },
      { n: "15.3", work: "Внесение правок в графику", note: "—", labor: "4 р.д." },
      { n: "15.4", work: "Переутверждение замечаний", note: "—", labor: "3 р.д." },
    ],
  },
  {
    n: 16, title: "Рабочая документация (РД) + Сметы", period: "45 р.д. · 15.03 – 14.05.2027", color: "#1d4ed8",
    icon: "FileText",
    output: "12 томов РД, 4 экз. бумага + флешка с исходниками",
    milestone: "M8",
    rows: [
      { n: "16.1", work: "Чертежи карьера (КР, ТХ) — 40 листов", note: "—", labor: "12 р.д." },
      { n: "16.2", work: "Чертежи отвалов — 15 листов", note: "—", labor: "4 р.д." },
      { n: "16.3", work: "Чертежи автодорог — 20 листов", note: "—", labor: "6 р.д." },
      { n: "16.4", work: "Чертежи очистных сооружений — 25 листов", note: "—", labor: "5 р.д." },
      { n: "16.5", work: "Чертежи спрямления русла — 15 листов", note: "—", labor: "4 р.д." },
      { n: "16.6", work: "Электротехнические чертежи — 30 листов", note: "—", labor: "8 р.д." },
      { n: "16.7", work: "Локальные сметы (30 шт.) — ГРАНД + Excel", note: "—", labor: "6 р.д." },
      { n: "16.8", work: "Объектные сметы (5 шт.) — ГРАНД + Excel", note: "—", labor: "3 р.д." },
      { n: "16.9", work: "Сводный сметный расчёт (по шаблону ООО «РУК»)", note: "Excel", labor: "2 р.д." },
      { n: "16.10", work: "Расчёт договорной цены (РДЦ)", note: "Excel", labor: "2 р.д." },
    ],
  },
];

// ─── Components ───────────────────────────────────────────────────────────────
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

function StageCard({ stage }: { stage: typeof STAGES[0] }) {
  const ms = stage.milestone ? MILESTONES.find(m => m.id === stage.milestone) : null;
  return (
    <div className={`border rounded-xl overflow-hidden shadow-sm ${stage.critical ? "ring-2 ring-red-400" : "border-gray-200"}`}>
      <div className="flex items-center gap-3 px-5 py-3 text-white" style={{ backgroundColor: stage.color }}>
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
          <Icon name={stage.icon} size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-bold opacity-70 uppercase tracking-wider">Этап {stage.n} · {stage.period}</div>
          <div className="font-black text-sm leading-snug">{stage.title}</div>
        </div>
        {ms && (
          <div className="bg-white/20 border border-white/30 rounded-lg px-2 py-1 text-right shrink-0">
            <div className="text-[8px] font-bold text-white/70">Веха</div>
            <div className="text-xs font-black text-white">{ms.id}</div>
          </div>
        )}
      </div>
      <div>
        <div className="grid grid-cols-[48px_1fr_120px_72px] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-1.5 border-b border-gray-200">
          <div>№</div><div>Работа</div><div>Основание</div><div>Срок</div>
        </div>
        {stage.rows.map((r, i) => (
          <div key={i} className={`grid grid-cols-[48px_1fr_120px_72px] px-4 py-2 border-b border-gray-100 last:border-0 items-start ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
            <div className="text-[10px] font-bold text-gray-500 pt-0.5">{r.n}</div>
            <div className="text-xs text-gray-800 leading-snug pr-2">{r.work}</div>
            <div className="text-[10px] text-gray-500 leading-snug pr-2">{r.note}</div>
            <div className="text-[10px] font-bold text-blue-700">{r.labor}</div>
          </div>
        ))}
        <div className="flex items-start gap-2 px-4 py-2.5 bg-emerald-50 border-t border-emerald-200">
          <Icon name="ArrowRight" size={13} className="text-emerald-600 shrink-0 mt-0.5" />
          <span className="text-[10px] font-semibold text-emerald-800 leading-snug"><span className="font-black">Выход:</span> {stage.output}</span>
        </div>
      </div>
    </div>
  );
}

function GanttChart() {
  const colW = 100 / TOTAL_MONTHS;
  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: 860 }}>
        {/* Month labels */}
        <div className="flex mb-1" style={{ paddingLeft: 148 }}>
          {MONTH_LABELS.map((m, i) => (
            <div key={i} style={{ width: `${colW}%` }}
              className="text-[8px] text-gray-500 font-bold border-l border-gray-200 pl-0.5 truncate">{m}</div>
          ))}
        </div>
        {/* Rows */}
        {GANTT.map((g) => {
          const ms = g.milestone ? MILESTONES.find(m => m.id === g.milestone) : null;
          return (
            <div key={g.id} className="flex items-center mb-1">
              <div className="text-[9px] font-bold text-gray-700 shrink-0 pr-2 text-right truncate" style={{ width: 148 }}>
                {g.label}
              </div>
              <div className="flex-1 relative h-5">
                {MONTH_LABELS.map((_, i) => (
                  <div key={i} className="absolute top-0 bottom-0 border-l border-gray-100" style={{ left: `${(i / TOTAL_MONTHS) * 100}%` }} />
                ))}
                <div className={`absolute top-0.5 bottom-0.5 rounded-sm flex items-center px-1 ${g.critical ? "ring-1 ring-red-400" : ""}`}
                  style={{ left: `${(g.start / TOTAL_MONTHS) * 100}%`, width: `${((g.end - g.start) / TOTAL_MONTHS) * 100}%`, backgroundColor: g.color, minWidth: 4 }}>
                  <span className="text-white text-[7px] font-bold truncate opacity-90">{g.critical ? "КРИТИЧЕСКИЙ" : ""}</span>
                </div>
                {ms && (
                  <div className="absolute top-0 bottom-0 flex items-center" style={{ left: `${(g.end / TOTAL_MONTHS) * 100}%` }}>
                    <div className="w-3 h-3 rotate-45 border-2 border-amber-600 shrink-0 -ml-1.5" style={{ backgroundColor: "#fbbf24" }} title={ms.id} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-[9px] text-gray-500" style={{ paddingLeft: 148 }}>
          <div className="flex items-center gap-1"><div className="w-4 h-3 rounded-sm bg-gray-400" /><span>Работа</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rotate-45 bg-amber-400 border border-amber-600" /><span>Веха</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-3 rounded-sm bg-red-600 ring-1 ring-red-400" /><span>Критический путь</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DKymzas() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Лого" className="h-9 object-contain" />
            <div>
              <div className="font-bold text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
              <div className="text-xs text-gray-500">Дорожная карта · КЗС-01-2026 · 52 недели</div>
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
            <div className="text-[10px] uppercase tracking-widest text-blue-300 mb-1">Инженерная дорожная карта проекта</div>
            <h1 className="text-xl font-black leading-snug mb-3 max-w-3xl">
              Проект разработки Кумзасского каменноугольного месторождения. Отработка запасов участка недр «Кумзасский 1‑2»
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-xs">
              {[
                { label: "Шифр объекта", value: "КЗС-01-2026" },
                { label: "Заказчик", value: "АО «Разрез Распадский»" },
                { label: "Категория сложности", value: "II (особо сложные ГГУ)" },
                { label: "Проектная мощность", value: "2,5 млн т/год (min)" },
                { label: "Рабочих дней", value: "336 р.д. (48 недель)" },
                { label: "Календарных дней", value: "364 дня (52 недели)" },
                { label: "Метод отработки", value: "Открытый, автотранспортная система" },
                { label: "Код ОКС", value: "12456789" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[9px] text-blue-300 uppercase tracking-wider">{label}</div>
                  <div className="font-semibold text-white leading-snug text-xs">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8">

            {/* ── SUMMARY CARDS ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { icon: "Layers", value: "16 этапов", label: "полный комплекс ПИР", color: "bg-blue-700" },
                { icon: "Flag", value: "8 вех", label: "контрольных точек", color: "bg-amber-600" },
                { icon: "Calendar", value: "52 нед.", label: "Май 2026 – Май 2027", color: "bg-slate-700" },
                { icon: "Route", value: "336 р.д.", label: "критический путь", color: "bg-red-700" },
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

            {/* ── MILESTONES STRIP ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
              {MILESTONES.map((m) => (
                <div key={m.id} className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="px-3 py-2 text-white text-center" style={{ backgroundColor: m.color }}>
                    <div className="font-black text-base">{m.id}</div>
                    <div className="text-[9px] font-bold opacity-80">{m.date}</div>
                  </div>
                  <div className="px-3 py-2 bg-white">
                    <div className="text-[10px] font-semibold text-gray-800 leading-snug text-center">{m.label}</div>
                    <div className="text-[9px] text-gray-400 text-center mt-0.5">{m.act}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── GANTT ── */}
            <SectionTitle icon="BarChart2">Диаграмма Ганта (масштаб — месяцы)</SectionTitle>
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-2 overflow-hidden">
              <GanttChart />
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-6 flex items-center gap-2">
              <Icon name="AlertTriangle" size={14} className="text-red-600 shrink-0" />
              <span className="text-xs text-red-800"><strong>Критический путь:</strong> Изыскания геологич. → Геомеханика → ПД → ГГЭ → Корректировка → РД. Длина: 336 р.д. = 48 недель. Резерв времени: 14 р.д.</span>
            </div>

            {/* ── PROJECT PARAMS ── */}
            <SectionTitle icon="Settings">Часть 1. Общие параметры проекта</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-2">
              {[
                { p: "Полное наименование", v: "Проект разработки Кумзасского каменноугольного месторождения. Отработка запасов участка недр «Кумзасский 1-2» в границах первоочередной отработки" },
                { p: "Шифр объекта", v: "КЗС-01-2026" },
                { p: "Код ОКС", v: "12456789" },
                { p: "Категория сложности", v: "II (особо сложные горно-геологические условия + спрямление русла)" },
                { p: "Метод отработки", v: "Открытый, автотранспортная система" },
                { p: "Проектная мощность", v: "2,5 млн т/год (min)" },
                { p: "Режим работ проектировщика", v: "5-дневная неделя, 8-часовой рабочий день" },
                { p: "Единица планирования", v: "Рабочий день (р.д.)" },
                { p: "Всего рабочих дней", v: "336 р.д. (48 недель)" },
                { p: "Календарных дней", v: "364 дня (52 недели)" },
              ].map((r, i) => (
                <div key={i} className={`grid grid-cols-[220px_1fr] px-4 py-2.5 border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                  <div className="text-xs font-bold text-gray-700 pr-3">{r.p}</div>
                  <div className="text-xs text-gray-800">{r.v}</div>
                </div>
              ))}
            </div>

            {/* ── RESOURCE TABLE ── */}
            <SectionTitle icon="Users">Ресурсная диаграмма (загрузка по месяцам)</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-2">
              <div className="grid grid-cols-[130px_60px_70px_80px_100px_90px_70px] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-3 py-2 border-b border-gray-200">
                <div>Месяц</div><div>ГИП</div><div>Геолог</div><div>Геодезист</div><div>Эколог</div><div>Сметчик</div><div className="text-right">Итого</div>
              </div>
              {RESOURCES.map((r, i) => {
                const maxTotal = 215;
                const pct = Math.round((r.total / maxTotal) * 100);
                return (
                  <div key={i} className={`grid grid-cols-[130px_60px_70px_80px_100px_90px_70px] px-3 py-2 border-b border-gray-100 last:border-0 items-center ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                    <div className="text-xs font-semibold text-gray-800">{r.month}</div>
                    <div className="text-xs text-gray-600">{r.gip}</div>
                    <div className="text-xs text-gray-600">{r.geolog || "—"}</div>
                    <div className="text-xs text-gray-600">{r.geodezist || "—"}</div>
                    <div className="text-xs text-gray-600">{r.ecolog || "—"}</div>
                    <div className="text-xs text-gray-600">{r.smetchik || "—"}</div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-black text-blue-700">{r.total}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── STAGE DETAILS ── */}
            <SectionTitle icon="ClipboardList">Часть 2. Детальный план по этапам</SectionTitle>
            <div className="space-y-4 mb-2">
              {STAGES.map((stage) => <StageCard key={stage.n} stage={stage} />)}
            </div>

            {/* ── INITIAL DATA ── */}
            <SectionTitle icon="Inbox">Реестр исходных данных (предоставляет Заказчик)</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-2">
              <div className="grid grid-cols-[32px_1fr_100px_80px] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div>№</div><div>Документ</div><div>Форма</div><div>Срок</div>
              </div>
              {INITIAL_DATA.map((r, i) => (
                <div key={r.n} className={`grid grid-cols-[32px_1fr_100px_80px] px-4 py-2.5 border-b border-gray-100 last:border-0 items-center ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[9px] font-black">{r.n}</div>
                  <div className="text-xs text-gray-800 leading-snug pr-2">{r.doc}</div>
                  <div className="text-[10px] font-mono text-gray-500">{r.form}</div>
                  <div className="text-[10px] font-bold text-blue-700">{r.deadline}</div>
                </div>
              ))}
            </div>

            {/* ── APPROVALS ── */}
            <SectionTitle icon="Stamp">Реестр согласований (ответственность Исполнителя)</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-2">
              <div className="grid grid-cols-[32px_1fr_160px_60px] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div>№</div><div>Согласование</div><div>Орган</div><div>р.д.</div>
              </div>
              {APPROVALS.map((r, i) => (
                <div key={r.n} className={`grid grid-cols-[32px_1fr_160px_60px] px-4 py-2.5 border-b border-gray-100 last:border-0 items-center ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                  <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-[9px] font-black">{r.n}</div>
                  <div className="text-xs text-gray-800 leading-snug pr-2">{r.label}</div>
                  <div className="text-xs text-gray-600">{r.organ}</div>
                  <div className="text-xs font-bold text-amber-700">{r.days}</div>
                </div>
              ))}
            </div>

            {/* ── QC ── */}
            <SectionTitle icon="ShieldCheck">План контроля качества (внутренние вехи)</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-8">
              <div className="grid grid-cols-[32px_1fr_160px_140px] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div>№</div><div>Этап</div><div>Проверяющий</div><div>Формат</div>
              </div>
              {QC.map((r, i) => (
                <div key={r.n} className={`grid grid-cols-[32px_1fr_160px_140px] px-4 py-2.5 border-b border-gray-100 last:border-0 items-center ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-[9px] font-black">{r.n}</div>
                  <div className="text-xs text-gray-800 leading-snug pr-2">{r.stage}</div>
                  <div className="text-xs text-gray-600">{r.checker}</div>
                  <div className="text-xs font-semibold text-gray-700">{r.format}</div>
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
