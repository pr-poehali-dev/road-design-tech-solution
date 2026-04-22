import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { exportElementToPdf } from "@/lib/exportPdf";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const DOC_NUM = "ДК-ОСТРОВ-001/2026";
const DOC_DATE = "22 апреля 2026 г.";

/* ─── helpers ─── */
function SectionTitle({ num, title, color = "bg-gray-800" }: { num: string; title: string; color?: string }) {
  return (
    <div className={`${color} text-white px-4 py-2 rounded-t flex items-center gap-3 mt-6`}>
      <span className="font-black text-sm opacity-60">{num}</span>
      <span className="font-bold text-sm uppercase tracking-wide">{title}</span>
    </div>
  );
}

function DayBlock({ day, tasks }: { day: string; tasks: string[] }) {
  return (
    <div className="mb-2">
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">{day}</div>
      <ul className="space-y-0.5">
        {tasks.map((t, i) => (
          <li key={i} className="flex gap-1.5 text-xs text-gray-800 leading-snug">
            <span className="text-gray-400 shrink-0 mt-0.5">•</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Badge({ children, color = "bg-blue-100 text-blue-800" }: { children: React.ReactNode; color?: string }) {
  return <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{children}</span>;
}

/* ─── DATA ─── */
const projectParams = [
  ["Площадь территории", "124 га"],
  ["Количество участков застройки", "22"],
  ["Скважин всего", "44 (по 2 на участок)"],
  ["Глубина скважин", "4–6 м (до первого водоносного горизонта)"],
  ["Масштаб отчёта", "1:500"],
  ["Полевая партия", "8 человек"],
  ["Водный транспорт", "2 единицы (основной + резерв)"],
  ["Длительность", "44 календарных дня"],
  ["НДС", "22%"],
  ["Оплата", "30% / 30% / 40%"],
];

const milestones = [
  { day: "Д1", event: "Договор подписан", result: "Юридическая основа", payment: "30% · 2 400 000 ₽", color: "bg-emerald-600" },
  { day: "Д8", event: "Лагерь + геосеть", result: "Готовность к работам", payment: "—", color: "bg-blue-600" },
  { day: "Д23", event: "Геодезия (поле) завершена", result: "124 га + подеревка", payment: "—", color: "bg-violet-600" },
  { day: "Д25", event: "Бурение 44 скважин завершено", result: "Все пробы отобраны", payment: "—", color: "bg-orange-600" },
  { day: "Д27", event: "Контроль пройден", result: "Акт контроля", payment: "—", color: "bg-amber-600" },
  { day: "Д29", event: "Акт полевых работ", result: "Полевые работы приняты", payment: "30% · 2 400 000 ₽", color: "bg-emerald-600" },
  { day: "Д42", event: "Отчёт сформирован", result: "Полный комплект", payment: "—", color: "bg-cyan-600" },
  { day: "Д44", event: "Итоговый акт", result: "Проект закрыт", payment: "40% · 3 200 000 ₽", color: "bg-emerald-700" },
];

const ganttRows: Array<{ label: string; start: number; end: number; color: string; isMilestone?: boolean }> = [
  { label: "Эт.0 Организация", start: 0, end: 5, color: "bg-slate-500" },
  { label: "Эт.1 Логистика", start: 5, end: 8, color: "bg-teal-500" },
  { label: "Эт.2 Геодезия (поле)", start: 8, end: 23, color: "bg-blue-500" },
  { label: "Эт.2 Камералка геодезии", start: 14, end: 23, color: "bg-blue-300" },
  { label: "Эт.3 Бурение 44 скв.", start: 8, end: 22, color: "bg-orange-500" },
  { label: "Эт.3 Полевая лаборат.", start: 14, end: 25, color: "bg-amber-400" },
  { label: "Эт.4 Контроль кач-ва", start: 25, end: 27, color: "bg-red-500" },
  { label: "Эт.5 Эвакуация", start: 27, end: 29, color: "bg-gray-500" },
  { label: "Эт.6 Стац. лаборат.", start: 29, end: 37, color: "bg-violet-500" },
  { label: "Эт.6 Отчёт (ГОСТ)", start: 32, end: 42, color: "bg-purple-600" },
  { label: "Эт.7 Передача", start: 42, end: 44, color: "bg-emerald-600" },
];
const TOTAL_DAYS = 44;

const personnel = [
  { role: "Руководитель проекта", count: 1, tasks: "Общее руководство, контроль, связь с заказчиком" },
  { role: "Вед. инженер-геодезист", count: 1, tasks: "Организация геодезических работ, постобработка" },
  { role: "Инженер-геодезист", count: 1, tasks: "Полевая съёмка, работа с тахеометром" },
  { role: "Вед. инженер-геолог", count: 1, tasks: "Организация бурения, описание грунтов, лаборатория" },
  { role: "Инженер-геолог", count: 1, tasks: "Бурение, отбор проб, полевая лаборатория" },
  { role: "Бурильщик", count: 2, tasks: "Работа с мотобуром, ручное бурение" },
  { role: "Водитель катера / разнорабочий", count: 1, tasks: "Транспорт, помощь в лагере" },
  { role: "Повар / хозяйственник", count: 1, tasks: "Питание, хозчасть" },
];

const geodesyEquipment = [
  ["GNSS-приёмник (RTK)", "2", "L1/L2, постобработка"],
  ["Электронный тахеометр", "1", "Точность 2″"],
  ["Нивелир оптический", "1", "Для геосети"],
  ["Штативы, вехи, отражатели", "комплект", "—"],
  ["Квадрокоптер (обзорный)", "1", "Контроль полноты"],
  ["Фотокамера с GPS", "1", "Привязка фото"],
];

const drillingEquipment = [
  ["Мотобур (бензиновый)", "2", "Диаметр шнека 100 мм"],
  ["Ручной бур", "2", "Для валунных участков"],
  ["Запасные штанги", "10", "—"],
  ["Запасные коронки", "5", "На случай валунов"],
  ["Монолитоотборник", "2", "Ненарушенная структура"],
  ["Контейнеры для проб", "100 шт", "—"],
];

const commEquipment = [
  ["Спутниковый телефон (Iridium)", "1"],
  ["УКВ-радиостанции", "4"],
  ["Навигатор GPS (ручной)", "2"],
  ["Power bank (большой)", "5"],
  ["Катер основной (1,5 т)", "1"],
  ["Катер резервный", "1"],
];

const risks = [
  { id: "R1", risk: "Шторм на Ладоге (волна >1,5 м)", prob: "Средняя", impact: "Высокое", measure: "Резерв 3 дня; два окна для заброски; спутниковый прогноз" },
  { id: "R2", risk: "Валунные грунты (отказ мотобура)", prob: "Высокая", impact: "Высокое", measure: "2 ручных бура; запасные коронки (5 шт); резерв +2 дня" },
  { id: "R3", risk: "Медленная подеревная съёмка в густом лесу", prob: "Средняя", impact: "Среднее", measure: "3 геодезиста; квадрокоптер для контроля; уплотнение графика" },
  { id: "R4", risk: "Отсутствие питьевой воды на острове", prob: "Низкая", impact: "Критическое", measure: "Завоз 500 л + запас 200 л; система фильтрации" },
  { id: "R5", risk: "Поломка генератора", prob: "Низкая", impact: "Среднее", measure: "Запасной генератор 1 кВт или запас аккумуляторов" },
  { id: "R6", risk: "Травма в полевых условиях", prob: "Низкая", impact: "Высокое", measure: "Аптечка; спутниковый телефон для эвакуации; страховка" },
  { id: "R7", risk: "Замечания заказчика по отчёту", prob: "Низкая", impact: "Низкое", measure: "Нормоконтроль до сдачи; внутренняя проверка" },
  { id: "R8", risk: "Претензии по рекультивации", prob: "Низкая", impact: "Среднее", measure: "Фотофиксация ДО/ПОСЛЕ каждой скважины" },
];

const probColor = (p: string) =>
  p === "Высокая" ? "bg-red-100 text-red-700" : p === "Средняя" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700";
const impColor = (i: string) =>
  i === "Критическое" || i === "Высокое" ? "bg-red-100 text-red-700" : i === "Среднее" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700";

export default function DOstrov() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      await exportElementToPdf(
        reportRef.current,
        "Дорожная_карта_ОСТРОВ_КапстройИнжиниринг.pdf",
        1200,
      );
    } catch (e) {
      console.error(e);
    }
    setExporting(false);
  };

  const colW = (1 / TOTAL_DAYS) * 100;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Лого" className="h-9 object-contain" />
            <div>
              <div className="font-bold text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
              <div className="text-xs text-gray-500">Дорожная карта · Остров в Ладожском озере</div>
            </div>
          </div>
          <Button onClick={handleExport} disabled={exporting} className="bg-blue-700 hover:bg-blue-800 text-white gap-2 text-sm">
            <Icon name="FileDown" size={16} />
            {exporting ? "Экспорт..." : "Скачать PDF"}
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div
          ref={reportRef}
          className="bg-white shadow-lg text-gray-900"
          style={{ fontFamily: "Arial, sans-serif", padding: "20mm 20mm 18mm 25mm" }}
        >
          {/* ── HEADER ── */}
          <div className="flex items-start justify-between mb-5 pb-4 border-b-2 border-blue-700">
            <div className="flex items-center gap-4">
              <img src={LOGO_URL} alt="Лого" className="h-16 object-contain" />
              <div>
                <div className="font-bold text-base text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                <div className="text-xs text-gray-600 mt-0.5">197341, г. Санкт-Петербург, Фермское шоссе, д. 12, лит. Ж, пом. 310-Н к3</div>
                <div className="text-xs text-gray-600">ИНН 7814795454 · КПП 781401001 · ОГРН 1217800122649</div>
              </div>
            </div>
            <div className="text-right text-xs text-gray-700">
              <div className="font-bold text-blue-700 text-sm">№ {DOC_NUM}</div>
              <div>{DOC_DATE}</div>
            </div>
          </div>

          {/* ── TITLE ── */}
          <div className="text-center mb-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Детализированная дорожная карта проекта</p>
            <h1 className="text-sm font-black text-gray-900 uppercase leading-snug">
              Инженерные изыскания на острове (Ладожское озеро)
            </h1>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {["124 га", "44 скважины", "22 участка", "44 дня", "НДС 22%", "Оплата 30/30/40"].map((t) => (
                <Badge key={t} color="bg-blue-700 text-white">{t}</Badge>
              ))}
            </div>
            <div className="flex gap-4 justify-center mt-2 text-xs text-gray-600">
              <span><strong>Заказчик:</strong> ООО «Карельская сказка»</span>
              <span><strong>Исполнитель:</strong> ООО «Капстрой-Инжиниринг»</span>
            </div>
          </div>

          {/* ── PARAMS ── */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="border border-blue-200 rounded overflow-hidden">
              <div className="bg-blue-700 text-white text-xs font-bold px-3 py-1.5">Параметры проекта</div>
              <table className="w-full text-xs">
                <tbody>
                  {projectParams.map(([k, v], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                      <td className="px-3 py-1 text-gray-600">{k}</td>
                      <td className="px-3 py-1 font-semibold text-gray-900 text-right">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment calendar */}
            <div className="border border-emerald-200 rounded overflow-hidden">
              <div className="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5">Платёжный календарь</div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-emerald-50">
                    <th className="px-3 py-1 text-left text-gray-600 font-semibold">Событие</th>
                    <th className="px-3 py-1 text-center text-gray-600 font-semibold">День</th>
                    <th className="px-3 py-1 text-right text-gray-600 font-semibold">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Подписание договора", "Д1", "2 400 000 ₽"],
                    ["Акт полевых работ", "Д29", "2 400 000 ₽"],
                    ["Итоговый акт", "Д44", "3 200 000 ₽"],
                  ].map(([ev, day, sum], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-emerald-50"}>
                      <td className="px-3 py-1.5 text-gray-800">{ev}</td>
                      <td className="px-3 py-1.5 text-center font-bold text-emerald-700">{day}</td>
                      <td className="px-3 py-1.5 text-right font-bold text-gray-900">{sum}</td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-100 font-black">
                    <td className="px-3 py-1.5 text-emerald-900">ИТОГО</td>
                    <td className="px-3 py-1.5 text-center text-emerald-900">100%</td>
                    <td className="px-3 py-1.5 text-right text-emerald-900">8 000 000 ₽</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── MILESTONES ── */}
          <div className="bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-t mt-6 uppercase tracking-wide">
            Ключевые контрольные точки
          </div>
          <div className="border border-gray-300 rounded-b mb-4">
            <div className="grid grid-cols-4 gap-0">
              {milestones.map((m, i) => (
                <div key={i} className={`p-2 border-r border-b border-gray-200 last:border-r-0 ${i >= milestones.length - 4 ? "border-b-0" : ""}`}>
                  <div className={`${m.color} text-white text-[10px] font-black rounded px-1.5 py-0.5 inline-block mb-1`}>{m.day}</div>
                  <div className="text-xs font-bold text-gray-900 leading-tight">{m.event}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{m.result}</div>
                  {m.payment !== "—" && (
                    <div className="text-[10px] font-bold text-emerald-700 mt-1">{m.payment}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── GANTT ── */}
          <div className="bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-t mt-6 uppercase tracking-wide">
            Диаграмма Ганта · 44 рабочих дня
          </div>
          <div className="border border-gray-300 rounded-b p-3 mb-4">
            {/* Day header */}
            <div className="flex ml-40 mb-1">
              <div className="flex-1 relative" style={{ height: 16 }}>
                {Array.from({ length: TOTAL_DAYS }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 h-full border-l border-gray-200 flex items-center justify-center text-[7px] text-gray-400"
                    style={{ left: `${(i / TOTAL_DAYS) * 100}%`, width: `${colW}%` }}
                  >
                    {(i + 1) % 5 === 0 || i === 0 ? i + 1 : ""}
                  </div>
                ))}
              </div>
            </div>
            {/* payment markers */}
            <div className="flex ml-40 mb-2 relative" style={{ height: 10 }}>
              <div className="flex-1 relative">
                {[{ d: 1, label: "30%", color: "text-emerald-700" }, { d: 29, label: "30%", color: "text-emerald-700" }, { d: 44, label: "40%", color: "text-emerald-700" }].map(({ d, label, color }) => (
                  <div key={d} className={`absolute text-[8px] font-black ${color}`} style={{ left: `${((d - 1) / TOTAL_DAYS) * 100}%`, transform: "translateX(-50%)" }}>
                    ▲{label}
                  </div>
                ))}
              </div>
            </div>
            {ganttRows.map((row, idx) => (
              <div key={idx} className="flex items-center mb-1">
                <div className="w-40 shrink-0 text-[9px] text-gray-700 pr-2 text-right leading-tight">{row.label}</div>
                <div className="flex-1 h-5 bg-gray-100 rounded relative">
                  {Array.from({ length: TOTAL_DAYS }, (_, i) => (
                    <div key={i} className="absolute top-0 h-full border-l border-gray-200" style={{ left: `${(i / TOTAL_DAYS) * 100}%` }} />
                  ))}
                  <div
                    className={`absolute top-0 h-full rounded ${row.color} flex items-center justify-center`}
                    style={{ left: `${(row.start / TOTAL_DAYS) * 100}%`, width: `${((row.end - row.start) / TOTAL_DAYS) * 100}%` }}
                  >
                    <span className="text-[8px] text-white font-bold px-1 truncate">д.{row.start + 1}–{row.end}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── STAGE 0 ── */}
          <SectionTitle num="ЭТАП 0" title="Организационно-договорной · Дни 1–5" color="bg-slate-700" />
          <div className="border border-slate-200 rounded-b p-3 mb-2 bg-slate-50 grid grid-cols-2 gap-4">
            <DayBlock day="День 1" tasks={[
              "0.1.1 Подписание договора подряда",
              "0.1.2 Подписание NDA",
              "0.1.3 Счёт на аванс 30% (2 400 000 ₽)",
              "0.1.4 Назначение руководителя проекта",
            ]} />
            <DayBlock day="День 2" tasks={[
              "0.2.1 Карта 22 участков с границами",
              "0.2.2 Система координат, высотная основа",
              "0.2.3 Анализ расстояний — маршруты",
            ]} />
            <DayBlock day="День 3 · Разрешения" tasks={[
              "0.3.1 Запрос в Лесничество (лесной фонд)",
              "0.3.2 Уведомление МЧС (водный объект)",
              "0.3.3 ООПТ (если особо охраняемый)",
              "0.3.4 Орган местного самоуправления",
              "0.3.5 Оформление пропусков на персонал",
            ]} />
            <DayBlock day="День 4 · Комплектация" tasks={[
              "0.4.1 Ведущий геодезист + инженер-геодезист",
              "0.4.2 Ведущий геолог + инженер-геолог",
              "0.4.3 2 бурильщика + водитель + повар",
              "0.4.4 Распределение зон ответственности",
            ]} />
            <DayBlock day="День 5 · Поверка оборудования" tasks={[
              "0.5.1 GNSS-приёмники (2 шт) — аккред. лаборатория",
              "0.5.2 Тахеометр (1 шт) + нивелир (1 шт)",
              "0.5.3 Мотобуры (2 шт): масло, свечи, ножи",
              "0.5.4 Ручные буры (2), запасные штанги",
              "0.5.5 Генератор, телефон спутниковый, радиостанции (4), квадрокоптер",
            ]} />
          </div>

          {/* ── STAGE 1 ── */}
          <SectionTitle num="ЭТАП 1" title="Логистика и развёртывание · Дни 6–8" color="bg-teal-700" />
          <div className="border border-teal-200 rounded-b p-3 mb-2 bg-teal-50 grid grid-cols-3 gap-4">
            <DayBlock day="День 6 · Перебазирование" tasks={[
              "1.1.1 Выдвижение к берегу Ладоги",
              "1.1.2 Согласование загрузки у причала",
              "1.1.3 Погрузка: геодезия (40 кг), буровое (150 кг), лагерь (200 кг), провизия (250 кг на 17 дней), вода (500 л), ГСМ (200 л), аптечка",
            ]} />
            <DayBlock day="День 7 · Высадка" tasks={[
              "1.2.1 Выход на остров (время по погоде)",
              "1.2.2 Рекогносцировка с воды",
              "1.2.3 Выгрузка на берег",
              "1.2.4 Обход периметра, оценка дорог, заболоченностей, скал",
              "1.2.5 Фиксация ключевых ориентиров",
            ]} />
            <DayBlock day="День 8 · Лагерь + геосеть" tasks={[
              "1.3.1 Выбор места под базовый лагерь",
              "1.3.2 Палатки жилые (3), кухня, склад, туалет, генератор",
              "1.3.3 Закладка 2–3 базовых пунктов",
              "1.3.4 GNSS-наблюдения ≥2 ч на точку",
              "1.3.5 Нивелирный ход между пунктами",
            ]} />
          </div>

          {/* ── STAGE 2 geodesy ── */}
          <SectionTitle num="ЭТАП 2" title="Инженерно-геодезические изыскания · Дни 9–23" color="bg-blue-700" />
          <div className="border border-blue-200 rounded-b p-3 mb-2 bg-blue-50">
            <div className="text-[10px] font-bold text-blue-700 uppercase mb-2">2.1. Полевые геодезические работы (Дни 9–20)</div>
            <div className="grid grid-cols-3 gap-3">
              <DayBlock day="Дни 9–10 · Участки 1–5" tasks={[
                "2.1.1 Тахеометрическая съёмка рельефа и контуров (шаг 15–20 м / 10 м в лесу)",
                "2.1.2 Гидрография: ручьи, заболоченности",
                "2.1.3 Начало подеревной съёмки: порода, диаметр (мерная вилка), координаты, маркировка",
              ]} />
              <DayBlock day="Дни 11–12 · Участки 6–10" tasks={[
                "2.1.3 Продолжение тахеометрической съёмки",
                "2.1.4 Продолжение подеревной съёмки",
                "2.1.5 Съёмка дорог и троп: ширина, покрытие, проходимость, уклоны",
              ]} />
              <DayBlock day="Дни 13–14 · Участки 11–15" tasks={[
                "2.1.6 Продолжение тахеометрической съёмки",
                "2.1.7 Продолжение подеревной съёмки",
                "2.1.8 Аэрофиксация с квадрокоптера (контроль полноты)",
              ]} />
              <DayBlock day="Дни 15–16 · Участки 16–20" tasks={[
                "2.1.9 Продолжение тахеометрической съёмки",
                "2.1.10 Продолжение подеревной съёмки",
                "2.1.11 Фиксация особых точек: скалы, фундаменты, обрывы, родники",
              ]} />
              <DayBlock day="Дни 17–18 · Участки 21–22" tasks={[
                "2.1.12 Завершение тахеометрической съёмки 124 га",
                "2.1.13 Завершение подеревной съёмки (все d ≥ 20 см)",
                "2.1.14 Завершение съёмки дорог/троп",
              ]} />
              <DayBlock day="Дни 19–20 · Контроль" tasks={[
                "2.1.15 Выборочная пересъёмка 5% пикетов",
                "2.1.16 Контрольный подсчёт деревьев на 2 участках",
                "2.1.17 Сверка с аэрофиксацией квадрокоптера",
              ]} />
            </div>
            <div className="text-[10px] font-bold text-blue-700 uppercase mb-2 mt-3">2.2. Камеральная обработка геодезии (Дни 15–23, параллельно)</div>
            <div className="grid grid-cols-3 gap-3">
              <DayBlock day="Дни 15–16" tasks={["2.2.1 Выгрузка данных GNSS", "2.2.2 Постобработка GNSS (уравнивание)"]} />
              <DayBlock day="Дни 17–18" tasks={["2.2.3 ЦМР в AutoCAD / Credo", "2.2.4 Горизонтали с сечением 1 м"]} />
              <DayBlock day="Дни 19–20" tasks={["2.2.5 Подеревный план (векторный слой)", "2.2.6 Укрупнённые контуры насаждений"]} />
              <DayBlock day="Дни 21–22" tasks={["2.2.7 Сводка всех слоёв в единый проект", "2.2.8 Промежуточный отчёт по геодезии"]} />
              <DayBlock day="День 23" tasks={["2.2.9 Внутренняя проверка геодезики", "2.2.10 Экспорт в DWG, DXF, SHP"]} />
            </div>
          </div>

          {/* ── STAGE 3 geology ── */}
          <SectionTitle num="ЭТАП 3" title="Инженерно-геологические изыскания · Дни 9–25" color="bg-orange-700" />
          <div className="border border-orange-200 rounded-b p-3 mb-2 bg-orange-50">
            <div className="text-[10px] font-bold text-orange-700 uppercase mb-2">3.1. Полевое бурение 44 скважин (Дни 9–22)</div>
            <div className="grid grid-cols-3 gap-3">
              <DayBlock day="Дни 9–10 · Скв. 1–8 (уч. 1–4)" tasks={[
                "3.1.1 Разбивка точек (навигатор + рулетка)",
                "3.1.2 Бурение мотобуром (шнек 100 мм)",
                "3.1.3 Валун > 20 см → ручное бурение",
                "3.1.4 Монолиты через 0,5–1,0 м",
                "3.1.5 Пробы нарушенной структуры",
              ]} />
              <DayBlock day="Дни 11–12 · Скв. 9–16 (уч. 5–8)" tasks={[
                "3.1.6 Продолжение бурения",
                "3.1.7 Замер УГВ через 24 ч после бурения",
              ]} />
              <DayBlock day="Дни 13–14 · Скв. 17–24 (уч. 9–12)" tasks={[
                "3.1.8 Продолжение бурения",
                "3.1.9 Полевое описание: цвет (Манселл), влажность, консистенция, включения",
              ]} />
              <DayBlock day="Дни 15–16 · Скв. 25–32 (уч. 13–16)" tasks={[
                "3.1.10 Продолжение бурения",
                "3.1.11 Упаковка проб (этикетка: № скв, глубина, дата)",
              ]} />
              <DayBlock day="Дни 17–18 · Скв. 33–40 (уч. 17–20)" tasks={[
                "3.1.12 Продолжение бурения",
                "3.1.13 Фиксация керна (с масштабной линейкой)",
              ]} />
              <DayBlock day="Дни 19–22 · Скв. 41–44 (уч. 21–22)" tasks={[
                "3.1.14 Завершение всех 44 скважин",
                "3.1.15 Финальный замер УГВ по всем скважинам",
                "3.1.16 Проверка полноты отбора проб",
                "3.1.17 Повторное описание спорных образцов",
              ]} />
            </div>
            <div className="text-[10px] font-bold text-orange-700 uppercase mb-2 mt-3">3.2. Полевая лаборатория (Дни 15–25)</div>
            <div className="grid grid-cols-3 gap-3">
              <DayBlock day="Дни 15–17" tasks={["3.2.1 Влажность (весовой метод)", "3.2.2 Плотность (режущее кольцо)"]} />
              <DayBlock day="Дни 18–20" tasks={["3.2.3 Гранулометрия (ситовой — полевая версия)", "3.2.4 Тип грунта: песок / супесь / суглинок / глина"]} />
              <DayBlock day="Дни 21–25" tasks={["3.2.5 Консервация проб для стационара", "3.2.6 Заполнение полевых журналов", "3.2.7 Упаковка в ящики с амортизацией", "3.2.8 Сводка полевых геологических данных"]} />
            </div>
          </div>

          {/* ── STAGE 4 ── */}
          <SectionTitle num="ЭТАП 4" title="Контроль качества · Дни 26–27" color="bg-red-700" />
          <div className="border border-red-200 rounded-b p-3 mb-2 bg-red-50 grid grid-cols-2 gap-4">
            <DayBlock day="День 26" tasks={[
              "4.1.1 Выезд руководителя проекта на остров",
              "4.1.2 Визуальный контроль 10% пикетов (случайная выборка)",
              "4.1.3 Контрольное бурение 2 скважин",
              "4.1.4 Сравнение с полевыми данными",
            ]} />
            <DayBlock day="День 27" tasks={[
              "4.2.1 Проверка подеревной съёмки на 3 участках",
              "4.2.2 Проверка полноты съёмки дорог/троп",
              "4.2.3 Акт контроля качества",
              "4.2.4 Устранение выявленных замечаний",
            ]} />
          </div>

          {/* ── STAGE 5 ── */}
          <SectionTitle num="ЭТАП 5" title="Сворачивание и эвакуация · Дни 28–29" color="bg-gray-700" />
          <div className="border border-gray-300 rounded-b p-3 mb-2 bg-gray-50 grid grid-cols-2 gap-4">
            <DayBlock day="День 28" tasks={[
              "5.1.1 Упаковка проб (термоконтейнеры, защита от ударов)",
              "5.1.2 Упаковка геодезического и бурового оборудования",
              "5.1.3 Сбор лагеря: палатки, кухня, генератор",
              "5.1.4 Сбор всех отходов (пищевые + технические)",
            ]} />
            <DayBlock day="День 29 · ⭐ Акт полевых" tasks={[
              "5.2.1 Рекультивация: засыпка скважин, утрамбовка, восстановление слоя",
              "5.2.2 Фиксация ДО/ПОСЛЕ каждой скважины",
              "5.2.3 Погрузка на катер, эвакуация бригады",
              "5.2.4 Разгрузка, складирование проб",
              "5.2.5 ⭐ Подписание акта полевых → счёт 30% (2 400 000 ₽)",
            ]} />
          </div>

          {/* ── STAGE 6 ── */}
          <SectionTitle num="ЭТАП 6" title="Камеральные работы · Дни 30–42" color="bg-violet-700" />
          <div className="border border-violet-200 rounded-b p-3 mb-2 bg-violet-50">
            <div className="text-[10px] font-bold text-violet-700 uppercase mb-2">6.1. Лабораторные испытания (Дни 30–37)</div>
            <div className="grid grid-cols-4 gap-2">
              <DayBlock day="Дни 30–31" tasks={["6.1.1 Приёмка проб в лаборатории", "6.1.2 Влажность (ГОСТ 5180)"]} />
              <DayBlock day="Дни 32–33" tasks={["6.1.3 Плотность грунта (режущее кольцо)", "6.1.4 Плотность тв. частиц (пикнометр)"]} />
              <DayBlock day="Дни 34–35" tasks={["6.1.5 Гранулометрия (ГОСТ 12536)", "6.1.6 Границы текучести/раскатывания"]} />
              <DayBlock day="Дни 36–37" tasks={["6.1.7 Угол трения, сцепление (сдвиговые)", "6.1.8 Модуль деформации (компрессия)", "6.1.9 Хим. анализ (агрессивность к бетону/стали)"]} />
            </div>
            <div className="text-[10px] font-bold text-violet-700 uppercase mb-2 mt-3">6.2. Сводка и формирование отчёта (Дни 33–42)</div>
            <div className="grid grid-cols-3 gap-3">
              <DayBlock day="Дни 33–34" tasks={["6.2.1 Сводка лабораторных данных", "6.2.2 22 геологических разреза по участкам"]} />
              <DayBlock day="Дни 35–36" tasks={["6.2.3 Сведение геодезии + геологии", "6.2.4 Единая цифровая модель (AutoCAD/GIS)"]} />
              <DayBlock day="Дни 37–38" tasks={["6.2.5 Топографический план 1:500", "6.2.6 Подеревный план 1:500", "6.2.7 Геологическая карта 1:500", "6.2.8 Схема дорог/троп 1:500"]} />
              <DayBlock day="Дни 39–40" tasks={["6.2.9 Отчёт по ГОСТ 21.301-2023", "6.2.10 Характеристика, методика, результаты, заключение"]} />
              <DayBlock day="Дни 41–42" tasks={["6.3.1 Нормоконтроль (проверка ГОСТ)", "6.3.2 Финальная версия: 2 экз. бумага + PDF", "6.3.3 Экспорт DWG, DXF, SHP"]} />
            </div>
          </div>

          {/* ── STAGE 7 ── */}
          <SectionTitle num="ЭТАП 7" title="Передача отчёта Заказчику · Дни 43–44" color="bg-emerald-700" />
          <div className="border border-emerald-200 rounded-b p-3 mb-4 bg-emerald-50 grid grid-cols-2 gap-4">
            <DayBlock day="День 43" tasks={[
              "7.1.1 Передача черновика отчёта (PDF) на согласование",
              "7.1.2 Приёмка замечаний (до 24 ч при срочности)",
            ]} />
            <DayBlock day="День 44 · ⭐ Итоговый акт" tasks={[
              "7.2.1 Внесение правок (при наличии)",
              "7.2.2 Передача: 2 экз. на бумаге + флеш PDF + флеш DWG/DXF/SHP + фотоматериалы",
              "7.2.3 ⭐ Подписание итогового акта сдачи-приёмки",
              "7.2.4 ⭐ Счёт на 40% (3 200 000 ₽)",
            ]} />
          </div>

          {/* ── RESOURCES ── */}
          <div className="bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-t mt-6 uppercase tracking-wide">
            Ресурсы проекта
          </div>
          <div className="border border-gray-300 rounded-b p-3 mb-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Personnel */}
              <div>
                <div className="text-[10px] font-bold text-gray-600 uppercase mb-1">Персонал · 8 чел.</div>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    {personnel.map((p, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="py-0.5 pr-1 text-gray-800 font-semibold leading-tight">{p.role}</td>
                        <td className="py-0.5 text-center font-black text-blue-700 text-sm w-5">{p.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Geodesy equip */}
              <div>
                <div className="text-[10px] font-bold text-gray-600 uppercase mb-1">Геодезия</div>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    {geodesyEquipment.map(([name, qty, note], i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="py-0.5 pr-1 text-gray-800 leading-tight">{name}</td>
                        <td className="py-0.5 text-right font-bold text-blue-700 w-10">{qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-[10px] font-bold text-gray-600 uppercase mb-1 mt-2">Буровое</div>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    {drillingEquipment.map(([name, qty], i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="py-0.5 pr-1 text-gray-800 leading-tight">{name}</td>
                        <td className="py-0.5 text-right font-bold text-orange-600 w-10">{qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Comm + transport */}
              <div>
                <div className="text-[10px] font-bold text-gray-600 uppercase mb-1">Связь, навигация, транспорт</div>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    {commEquipment.map(([name, qty], i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="py-0.5 pr-1 text-gray-800 leading-tight">{name}</td>
                        <td className="py-0.5 text-right font-bold text-teal-700 w-10">{qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-[10px] font-bold text-gray-600 uppercase mb-1 mt-2">Лагерь</div>
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    {[["Палатка 4-сезонная (4 чел)", "2"], ["Палатка-кухня", "1"], ["Палатка складская", "1"], ["Спальники (зимние)", "8"], ["Бензогенератор 2 кВт", "1"], ["Питьевая вода", "500 л"], ["Аптечка (расширенная)", "1"]].map(([name, qty], i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="py-0.5 pr-1 text-gray-800 leading-tight">{name}</td>
                        <td className="py-0.5 text-right font-bold text-gray-600 w-10">{qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── RISKS ── */}
          <div className="bg-red-800 text-white text-xs font-bold px-4 py-2 rounded-t mt-6 uppercase tracking-wide">
            Риски и меры митигации
          </div>
          <div className="border border-red-200 rounded-b mb-4 overflow-hidden">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-red-50">
                  <th className="px-2 py-1 text-left text-gray-600 font-bold w-6">№</th>
                  <th className="px-2 py-1 text-left text-gray-600 font-bold">Риск</th>
                  <th className="px-2 py-1 text-center text-gray-600 font-bold w-16">Вероятн.</th>
                  <th className="px-2 py-1 text-center text-gray-600 font-bold w-16">Влияние</th>
                  <th className="px-2 py-1 text-left text-gray-600 font-bold">Мера</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-red-50"}>
                    <td className="px-2 py-1 font-bold text-red-700">{r.id}</td>
                    <td className="px-2 py-1 text-gray-800 leading-snug">{r.risk}</td>
                    <td className="px-2 py-1 text-center"><Badge color={probColor(r.prob)}>{r.prob}</Badge></td>
                    <td className="px-2 py-1 text-center"><Badge color={impColor(r.impact)}>{r.impact}</Badge></td>
                    <td className="px-2 py-1 text-gray-700 leading-snug">{r.measure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── DELIVERABLES ── */}
          <div className="bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-t mt-6 uppercase tracking-wide">
            Что получает заказчик на выходе
          </div>
          <div className="border border-gray-300 rounded-b p-3 mb-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-bold text-gray-600 uppercase mb-1">Бумажный отчёт (2 экземпляра)</div>
              <ul className="space-y-0.5 text-xs text-gray-800">
                {["Титульный лист (подписи, печати)", "Состав исполнителей", "Программа работ (утверждённая)", "Текстовая часть 50–80 стр.: характеристика объекта, изученность, методика, результаты, заключение и рекомендации", "Ведомость деревьев (координаты, порода, диаметр)", "Сводная таблица свойств грунтов по скважинам", "Каталог координат опорных пунктов"].map((item, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-emerald-600 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-600 uppercase mb-1">Графические приложения (А3+)</div>
              <ul className="space-y-0.5 text-xs text-gray-800 mb-2">
                {["Топографический план М 1:500", "Подеревный план М 1:500", "Геологическая карта М 1:500", "Схема дорог и троп М 1:500", "Геологические разрезы (22 шт, по участкам)", "Фототаблица (ключевые точки)"].map((item, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-blue-600 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="text-[10px] font-bold text-gray-600 uppercase mb-1">Цифровая часть (флеш-накопитель)</div>
              <ul className="space-y-0.5 text-xs text-gray-800">
                {["Технический отчёт (PDF)", "Планы М 1:500 (DWG, DXF, PDF, SHP)", "Фотоматериалы с GPS-метками", "Лабораторные протоколы (сканы)"].map((item, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-violet-600 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── SIGNATURE ── */}
          <div className="border-t-2 border-gray-800 pt-5 mt-4 flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-2">С уважением,</p>
              <p className="text-xs text-gray-700">Генеральный директор</p>
              <p className="text-xs font-bold text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</p>
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
            <span>ООО «КАПСТРОЙ-ИНЖИНИРИНГ» · ИНН 7814795454</span>
            <span>№ {DOC_NUM} · {DOC_DATE}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
