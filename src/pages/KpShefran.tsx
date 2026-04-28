import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";

const NAVY = "#1e3a5f";
const GOLD = "#b8860b";

const STAGES = [
  { n: 1, title: "Социально-экономическая характеристика района", sum: 40_000 },
  { n: 2, title: "Сбор данных о существующем транспорте", sum: 55_000 },
  { n: 3, title: "Натурное транспортное обследование", sum: 90_000 },
  { n: 4, title: "Прогноз интенсивности на 20 лет (2028, 2046)", sum: 95_000 },
  { n: 5, title: "Расчёт по узлам и сечениям (6 точек)", sum: 90_000 },
  { n: 6, title: "Определение категории дороги", sum: 40_000 },
  { n: 7, title: "Расчёт экономической эффективности", sum: 50_000 },
  { n: 8, title: "Оформление отчёта", sum: 30_000 },
];

const TOTAL_EX_VAT = 489_344;
const VAT = 107_656;
const TOTAL = 597_000;

const RESULTS = [
  { what: "Отчёт об экономических изысканиях", fmt: "Бумага", qty: "2 экз." },
  { what: "Отчёт об экономических изысканиях", fmt: ".pdf / .doc", qty: "1 экз." },
  { what: "Схемы грузо- и пассажиропотоков", fmt: ".dwg", qty: "в составе" },
  { what: "Схемы интенсивности движения (2028, 2046)", fmt: ".dwg", qty: "в составе" },
  { what: "Расчёты по узлам и сечениям (таблицы)", fmt: ".xlsx", qty: "в составе" },
  { what: "Технико-экономическое обоснование", fmt: ".doc", qty: "в составе" },
];

const NODES = [
  "1. ул. Вадима Шефнера / ул. Мичманская",
  "2. ул. Вадима Шефнера / ул. Лисянского",
  "3. ул. Вадима Шефнера / ул. Виктора Конецкого",
  "4. пл. Европы / проезды",
  "5. Морская наб. / Прибалтийская пл.",
  "6. ул. Виктора Конецкого / бульвар Головнина",
  "+ примыкания к ЗСД",
];

const NORMS = [
  { doc: "ГОСТ Р 70092-2022", desc: "Экономические изыскания для автомобильных дорог" },
  { doc: "ВСН 42-87", desc: "Инструкция по экономическим изысканиям" },
  { doc: "СП 34.13330.2021", desc: "Прогнозный период 20 лет" },
  { doc: "СП 396.1325800.2018", desc: "Загрузка УДС не более 100%" },
];

const ROADMAP = [
  { weeks: "1–2", period: "Май 2026", step: "Социально-экономическая характеристика района", action: "Аналитики", result: "Описание района, транспортная ситуация" },
  { weeks: "1–2", period: "Май 2026", step: "Сбор данных о существующем транспорте", action: "Аналитики", result: "База данных транспортных потоков" },
  { weeks: "3–4", period: "Июнь 2026", step: "Натурное транспортное обследование (6 точек)", action: "Полевая бригада", result: "Замеры интенсивности, состава потока" },
  { weeks: "5–6", period: "Июнь 2026", step: "Прогноз интенсивности на 20 лет (2028, 2046)", action: "Транспортные моделисты", result: "Прогнозные матрицы, схемы потоков" },
  { weeks: "7–8", period: "Июль 2026", step: "Расчёт по узлам и сечениям (6 точек)", action: "Инженеры-транспортники", result: "Таблицы V/C, LOS, загрузки" },
  { weeks: "9–10", period: "Июль–Август 2026", step: "Определение категории дороги + экономика + отчёт", action: "ГИП, оформители", result: "Финальный отчёт, ТЭО" },
  { weeks: "10", period: "Август 2026", step: "Сдача заказчику", action: "Акт приёма-передачи", result: "Полный пакет документации" },
];

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

function SectionTitle({ num, children }: { num?: string | number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-8">
      <div className="h-5 w-1 rounded-full shrink-0" style={{ background: GOLD }} />
      <h2 className="text-sm font-black uppercase tracking-widest text-gray-800">
        {num && <span className="mr-1" style={{ color: GOLD }}>{num}.</span>}
        {children}
      </h2>
    </div>
  );
}

function GanttShefran() {
  const rows = [
    { label: "Соц.-эконом. хар-ка", start: 0, span: 2, hex: NAVY },
    { label: "Сбор трансп. данных", start: 0, span: 2, hex: "#2c5282" },
    { label: "Натурное обследование", start: 2, span: 2, hex: GOLD },
    { label: "Прогноз 20 лет", start: 4, span: 2, hex: "#d4a017" },
    { label: "Узлы и сечения", start: 6, span: 2, hex: "#2c5282" },
    { label: "Категория + экономика", start: 8, span: 1, hex: NAVY },
    { label: "Оформление отчёта", start: 9, span: 1, hex: "#4a7abf" },
  ];

  const months = ["Май", "Июнь", "Июль", "Август"];
  const labelW = 150;
  const rowH = 22;
  const rowGap = 5;
  const headerH = 28;
  const footerH = 22;
  const totalCols = 10;
  const svgW = 680;
  const chartW = svgW - labelW;
  const colW = chartW / totalCols;
  const totalH = headerH + rows.length * (rowH + rowGap) + footerH + 8;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${svgW} ${totalH}`} width="100%" style={{ display: "block" }} xmlns="http://www.w3.org/2000/svg">
        {/* Month labels */}
        {months.map((m, i) => {
          const colIdx = i * 2.5;
          const x = labelW + colIdx * colW;
          return (
            <text key={i} x={x + 2} y={14} fontSize="8" fontWeight="700" fill={GOLD}>{m} 2026</text>
          );
        })}

        {/* Week numbers */}
        {Array.from({ length: totalCols }, (_, i) => {
          const x = labelW + i * colW + colW / 2;
          return (
            <text key={i} x={x} y={headerH - 4} textAnchor="middle" fontSize="7" fontWeight="600" fill="#9ca3af">
              н{i + 1}
            </text>
          );
        })}

        {rows.map((row, i) => {
          const y = headerH + i * (rowH + rowGap);
          const barX = labelW + row.start * colW + 1;
          const barW = row.span * colW - 2;
          const r = rowH / 2;
          return (
            <g key={i}>
              {Array.from({ length: totalCols }, (_, ci) => (
                <rect key={ci} x={labelW + ci * colW + 1} y={y} width={colW - 2} height={rowH} rx="2" fill="#f3f4f6" />
              ))}
              <text x={labelW - 6} y={y + rowH / 2 + 1} textAnchor="end" dominantBaseline="middle" fontSize="8.5" fontWeight="600" fill="#374151">
                {row.label}
              </text>
              <rect x={barX} y={y} width={barW} height={rowH} rx={r} fill={row.hex} opacity="0.93" />
              <text x={barX + barW / 2} y={y + rowH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize="7" fontWeight="700" fill="white">
                {row.span}н
              </text>
            </g>
          );
        })}

        {/* Milestone — сдача */}
        {(() => {
          const mX = labelW + 10 * colW - 6;
          const mY = headerH + rows.length * (rowH + rowGap) + 4;
          return (
            <g>
              <polygon points={`${mX},${mY} ${mX + 8},${mY + 8} ${mX},${mY + 16} ${mX - 8},${mY + 8}`} fill={GOLD} />
              <text x={mX + 14} y={mY + 10} fontSize="8" fontWeight="700" fill={GOLD}>Сдача заказчику — Август 2026</text>
            </g>
          );
        })()}

        <text x={labelW} y={totalH - 2} fontSize="7" fill="#9ca3af">
          Старт: май 2026 · Финиш: август 2026 · Общий срок: 8–10 недель
        </text>
      </svg>
    </div>
  );
}

export default function KpShefran() {
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-[#f0f4f8] py-8 px-4">
      <style>{`
        @media print {
          @page { margin: 12mm 12mm; size: A4; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; break-before: page; }
          .print-avoid { page-break-inside: avoid; break-inside: avoid; }
          .print-header h1 { font-size: 13px !important; margin-bottom: 2px !important; }
          .print-header p, .print-header div { font-size: 8px !important; line-height: 1.3 !important; }
          .print-logo { height: 26px !important; }
          table { border-collapse: collapse !important; }
          td, th { border: 1px solid #cbd5e1 !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8 print:shadow-none print:rounded-none print:p-0">

        {/* ===== ЧАСТЬ 1: КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ ===== */}

        {/* Header */}
        <div className="flex items-start justify-between mb-5 print-header">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <img src={LOGO_URL} alt="Логотип" className="h-10 object-contain print-logo" />
            </div>
            <div className="h-1 w-12 rounded-full mb-3" style={{ background: GOLD }} />
            <h1 className="text-xl font-black leading-tight mb-1" style={{ color: NAVY }}>
              Коммерческое предложение
            </h1>
            <p className="text-[11px] text-gray-500 mb-3">
              на выполнение экономических изысканий для подготовки ДПТЛО
            </p>
            <div className="text-[10px] text-gray-600 space-y-0.5 leading-relaxed">
              <p><strong className="text-gray-800">Кому:</strong> СПб ГКУ «Дирекция транспортного строительства»</p>
              <p><strong className="text-gray-800">Исх. №:</strong> 280426 от 28.04.2026</p>
            </div>
          </div>
          <div className="no-print ml-4 flex-shrink-0">
            <Button onClick={handlePrint} className="flex items-center gap-2 text-white" style={{ background: GOLD }}>
              <Icon name="Download" size={16} />
              Выгрузить PDF
            </Button>
          </div>
        </div>

        {/* Объект */}
        <div className="p-4 rounded-2xl border border-[#e2edf2] bg-[#f8fafc] mb-5">
          <p className="text-[10px] font-black uppercase tracking-wide text-gray-500 mb-1">Объект изысканий</p>
          <p className="text-[11px] text-gray-800 leading-relaxed font-medium">
            «ул. Вадима Шефнера от Мичманской ул. и ул. Лисянского до ул. Виктора Конецкого, пл. Европы, проезды от ул. Вадима Шефнера до Морской наб. в районе пл. Беллинсгаузена, Морская наб. в районе Прибалтийской пл., ул. Виктора Конецкого от ул. Вадима Шефнера до бульвара Головнина с подходами»
          </p>
          <p className="text-[10px] text-gray-500 mt-1"><strong className="text-gray-700">Административный район:</strong> Василеостровский район Санкт-Петербурга</p>
        </div>

        {/* Основание */}
        <SectionTitle>Основание для выполнения работ</SectionTitle>
        <div className="text-[10px] text-gray-700 space-y-1 mb-2">
          <p>• Распоряжение КГА № 1-20-18 от 04.02.2026</p>
          <p>• Задание на подготовку ППТ и ПМТ (Приложение № 2)</p>
          <p>• Письмо Комитета по транспорту № 01-26-29423/26-0-1 от 19.02.2026</p>
        </div>

        {/* Нормативная база */}
        <SectionTitle>Нормативная база</SectionTitle>
        <div className="overflow-x-auto mb-2">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr style={{ background: "#eef2ff" }}>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700 whitespace-nowrap">Документ</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Содержание</th>
              </tr>
            </thead>
            <tbody>
              {NORMS.map((n, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="border border-slate-200 px-2 py-2 font-bold whitespace-nowrap" style={{ color: NAVY }}>{n.doc}</td>
                  <td className="border border-slate-200 px-2 py-2 text-gray-600">{n.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Состав и стоимость */}
        <SectionTitle num={1}>Состав и стоимость работ</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr style={{ background: "#eef2ff" }}>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700 w-6">№</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Этап работ</th>
                <th className="border border-slate-200 px-2 py-2 text-right font-bold text-gray-700 whitespace-nowrap">Стоимость</th>
              </tr>
            </thead>
            <tbody>
              {STAGES.map(s => (
                <tr key={s.n} className="hover:bg-slate-50">
                  <td className="border border-slate-200 px-2 py-2 text-gray-500 font-bold">{s.n}</td>
                  <td className="border border-slate-200 px-2 py-2 font-semibold text-gray-800">{s.title}</td>
                  <td className="border border-slate-200 px-2 py-2 text-right font-bold text-[#1e3a5f] whitespace-nowrap">{fmt(s.sum)}</td>
                </tr>
              ))}
              <tr className="bg-slate-50">
                <td colSpan={2} className="border border-slate-200 px-2 py-2 font-semibold text-gray-700">Итого без НДС</td>
                <td className="border border-slate-200 px-2 py-2 text-right font-bold text-gray-700 whitespace-nowrap">{fmt(TOTAL_EX_VAT)}</td>
              </tr>
              <tr className="bg-slate-50">
                <td colSpan={2} className="border border-slate-200 px-2 py-2 font-semibold text-gray-700">НДС 22%</td>
                <td className="border border-slate-200 px-2 py-2 text-right font-bold text-gray-700 whitespace-nowrap">{fmt(VAT)}</td>
              </tr>
              <tr style={{ background: "#f0f9ff" }}>
                <td colSpan={2} className="border border-slate-200 px-2 py-2 font-black text-gray-800">ИТОГО С НДС</td>
                <td className="border border-slate-200 px-2 py-2 text-right font-black text-lg whitespace-nowrap" style={{ color: NAVY }}>{fmt(TOTAL)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Итоговая цена */}
        <div className="mt-4 mb-5 p-4 rounded-2xl border-2 border-[#1e3a5f20] bg-[#f8fafc]">
          <div className="inline-block text-white font-black px-8 py-3 rounded-full shadow-md mb-2 text-base"
            style={{ background: NAVY }}>
            597 000 ₽ — итоговая цена с НДС 22%
          </div>
          <p className="text-[10px] text-gray-600">
            <strong>Пятьсот девяносто семь тысяч рублей</strong>, в том числе НДС 22% — 107 656 руб.
          </p>
        </div>

        {/* Результаты */}
        <SectionTitle num={2}>Результаты работ</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr style={{ background: "#eef2ff" }}>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Что передаётся</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Формат</th>
                <th className="border border-slate-200 px-2 py-2 text-center font-bold text-gray-700">Кол-во</th>
              </tr>
            </thead>
            <tbody>
              {RESULTS.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="border border-slate-200 px-2 py-2 text-gray-800">{r.what}</td>
                  <td className="border border-slate-200 px-2 py-2 font-mono text-gray-600">{r.fmt}</td>
                  <td className="border border-slate-200 px-2 py-2 text-center text-gray-600">{r.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Сроки */}
        <SectionTitle num={3}>Сроки выполнения</SectionTitle>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Общий срок", value: "8–10 недель" },
            { label: "Старт", value: "Май 2026" },
            { label: "Финиш", value: "Август 2026" },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl border border-[#e2edf2] bg-[#f8fafc] text-center">
              <p className="text-[9px] uppercase tracking-wide text-gray-500 font-bold mb-1">{item.label}</p>
              <p className="text-[13px] font-black" style={{ color: NAVY }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* ===== ЧАСТЬ 2: ДОРОЖНАЯ КАРТА ===== */}
        <div className="print-break" />

        <div className="flex items-start justify-between mb-5 print-header">
          <div>
            <img src={LOGO_URL} alt="Логотип" className="h-8 object-contain print-logo mb-2" />
            <div className="h-1 w-12 rounded-full mb-3" style={{ background: GOLD }} />
            <h1 className="text-xl font-black leading-tight mb-1" style={{ color: NAVY }}>
              Дорожная карта
            </h1>
            <p className="text-[11px] text-gray-500">выполнения экономических изысканий · 8–10 недель · 597 000 ₽ с НДС</p>
          </div>
        </div>

        {/* Диаграмма Ганта */}
        <SectionTitle num={1}>Диаграмма Ганта</SectionTitle>
        <div className="p-4 rounded-2xl border border-[#e2edf2] bg-[#fef9e6]">
          <GanttShefran />
        </div>

        {/* Пошаговая таблица */}
        <SectionTitle num={2}>Пошаговая таблица (с контрольными точками)</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr style={{ background: "#eef2ff" }}>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700 whitespace-nowrap">Неделя</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700 whitespace-nowrap">Период</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Этап</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Исполнитель</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Результат</th>
              </tr>
            </thead>
            <tbody>
              {ROADMAP.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="border border-slate-200 px-2 py-2 font-bold whitespace-nowrap" style={{ color: GOLD }}>{r.weeks}</td>
                  <td className="border border-slate-200 px-2 py-2 text-gray-500 whitespace-nowrap">{r.period}</td>
                  <td className="border border-slate-200 px-2 py-2 font-semibold text-gray-800">{r.step}</td>
                  <td className="border border-slate-200 px-2 py-2 text-gray-500">{r.action}</td>
                  <td className="border border-slate-200 px-2 py-2 text-gray-600">{r.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Узлы и сечения */}
        <SectionTitle num={3}>6 узлов и сечений для расчёта</SectionTitle>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl border border-[#e2edf2] bg-[#f8fafc]">
            <p className="text-[10px] font-black uppercase tracking-wide mb-2" style={{ color: NAVY }}>Точки замеров</p>
            <ul className="space-y-1">
              {NODES.map((n, i) => (
                <li key={i} className="text-[10px] text-gray-700 flex items-start gap-1.5">
                  <span className="font-bold mt-0.5" style={{ color: GOLD }}>•</span>
                  {n}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-[#e2edf2] bg-white">
              <p className="text-[9px] uppercase tracking-wide text-gray-500 font-bold mb-1">Что рассчитывается по узлам</p>
              <p className="text-[10px] text-gray-700">V/C, LOS, загрузка УДС (не более 100% по СП 396)</p>
            </div>
            <div className="p-3 rounded-xl border border-[#e2edf2] bg-white">
              <p className="text-[9px] uppercase tracking-wide text-gray-500 font-bold mb-1">Горизонт прогноза</p>
              <p className="text-[10px] text-gray-700">20 лет: расчётные годы 2028 и 2046</p>
            </div>
            <div className="p-3 rounded-xl border border-[#e2edf2] bg-white">
              <p className="text-[9px] uppercase tracking-wide text-gray-500 font-bold mb-1">Нормативная база</p>
              <p className="text-[10px] text-gray-700">ГОСТ Р 70092-2022, ВСН 42-87, СП 34.13330.2021</p>
            </div>
          </div>
        </div>

        {/* Итоговая сводка */}
        <SectionTitle num={4}>Итоговая сводка</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr style={{ background: "#eef2ff" }}>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Показатель</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Значение</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Итоговая цена (с НДС 22%)", "597 000 руб."],
                ["Длительность работ", "8–10 недель"],
                ["Количество узлов и сечений", "6 + примыкания к ЗСД"],
                ["Горизонт прогноза", "20 лет (2028, 2046)"],
                ["Административный район", "Василеостровский р-н, Санкт-Петербург"],
                ["Основание", "Распоряжение КГА № 1-20-18 от 04.02.2026"],
              ].map(([k, v], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="border border-slate-200 px-2 py-2 font-semibold text-gray-800 whitespace-nowrap">{k}</td>
                  <td className="border border-slate-200 px-2 py-2 text-gray-700">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Условия оплаты */}
        <div className="mt-8 pt-5 border-t border-gray-200">
          <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wide mb-3">Условия оплаты</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#f0f4f8] rounded-xl p-4 flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-[14px]">30%</span>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-800">Предоплата</p>
                <p className="text-[13px] font-bold text-[#1e3a5f] mt-0.5">179 100 ₽</p>
                <p className="text-[9px] text-gray-500">При подписании договора</p>
              </div>
            </div>
            <div className="bg-[#f0f4f8] rounded-xl p-4 flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#b8860b] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-[14px]">70%</span>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-800">По факту</p>
                <p className="text-[13px] font-bold text-[#b8860b] mt-0.5">417 900 ₽</p>
                <p className="text-[9px] text-gray-500">После сдачи и приёмки работ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-[10px] text-gray-500 leading-relaxed">
            КП действительно <strong>30 календарных дней</strong> с даты направления. После подписания договора предоставляем детальный WBS-план.
          </p>
          <p className="text-[10px] text-gray-400 mt-2">
            <strong>Организация:</strong> Капстрой Инжиниринг &nbsp;·&nbsp; Опыт транспортных изысканий в Санкт-Петербурге
          </p>
        </div>

        {/* Подписи и печать */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <div className="grid grid-cols-2 gap-12">

            {/* Исполнитель */}
            <div>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-4">Исполнитель</p>
              <div className="flex items-start gap-4">
                {/* Печать Капстрой */}
                <div className="relative flex-shrink-0 w-24 h-24">
                  <svg viewBox="0 0 100 100" width="96" height="96" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="#1e3a5f" strokeWidth="2.5"/>
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#1e3a5f" strokeWidth="1"/>
                    <path id="topArc" d="M 12,50 A 38,38 0 0,1 88,50" fill="none" stroke="none"/>
                    <path id="botArc" d="M 88,50 A 38,38 0 0,1 12,50" fill="none" stroke="none"/>
                    <text fontSize="8.5" fontWeight="700" fill="#1e3a5f" letterSpacing="1.5">
                      <textPath href="#topArc" startOffset="50%" textAnchor="middle">КАПСТРОЙ ИНЖИНИРИНГ</textPath>
                    </text>
                    <text fontSize="7" fill="#1e3a5f" letterSpacing="0.5">
                      <textPath href="#botArc" startOffset="50%" textAnchor="middle">Санкт-Петербург</textPath>
                    </text>
                    <text x="50" y="46" textAnchor="middle" fontSize="9" fontWeight="900" fill="#1e3a5f">КАПСТРОЙ</text>
                    <text x="50" y="57" textAnchor="middle" fontSize="7" fontWeight="700" fill="#b8860b">ИНЖИНИРИНГ</text>
                    <text x="50" y="68" textAnchor="middle" fontSize="6" fill="#1e3a5f">М.П.</text>
                  </svg>
                </div>
                <div className="flex-1 pt-1">
                  <div className="space-y-5">
                    <div>
                      <div className="border-b border-gray-400 mb-1 w-full" style={{ minWidth: "140px" }}/>
                      <p className="text-[8px] text-gray-500">Подпись</p>
                    </div>
                    <div>
                      <div className="border-b border-gray-400 mb-1 w-full"/>
                      <p className="text-[8px] text-gray-500">ФИО / Должность</p>
                    </div>
                    <div>
                      <div className="border-b border-gray-400 mb-1 w-full"/>
                      <p className="text-[8px] text-gray-500">Дата</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-[9px] text-gray-500 leading-relaxed">
                <p><strong className="text-gray-700">ООО «Капстрой Инжиниринг»</strong></p>
                <p>г. Санкт-Петербург</p>
              </div>
            </div>

            {/* Заказчик */}
            <div>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-4">Заказчик</p>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 flex-shrink-0 border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center">
                  <p className="text-[8px] text-gray-300 font-bold text-center leading-tight">М.П.<br/>заказчика</p>
                </div>
                <div className="flex-1 pt-1">
                  <div className="space-y-5">
                    <div>
                      <div className="border-b border-gray-400 mb-1 w-full"/>
                      <p className="text-[8px] text-gray-500">Подпись</p>
                    </div>
                    <div>
                      <div className="border-b border-gray-400 mb-1 w-full"/>
                      <p className="text-[8px] text-gray-500">ФИО / Должность</p>
                    </div>
                    <div>
                      <div className="border-b border-gray-400 mb-1 w-full"/>
                      <p className="text-[8px] text-gray-500">Дата</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-[9px] text-gray-500 leading-relaxed">
                <p><strong className="text-gray-700">СПб ГКУ «Дирекция транспортного строительства»</strong></p>
                <p>г. Санкт-Петербург</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}