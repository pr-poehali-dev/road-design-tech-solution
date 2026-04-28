import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";

const GOLD = "#b8860b";

const STAGES = [
  {
    n: 1,
    title: "Предпроектные работы",
    detail: "Обследование, 3D-скан, геодезия, фотофиксация, историческая справка",
    sum: 1_180_000,
    result: "Заключение о конструкциях + обмерные чертежи",
  },
  {
    n: 2,
    title: "Эскизный проект (АР) + ПБЭБ для КГИОП/КГА",
    detail: "",
    sum: 1_320_000,
    result: "Согласованный эскиз с цветовым паспортом",
  },
  {
    n: 3,
    title: "Проектная документация стадия П",
    detail: "АР, КР, ОВ, ВК, ЭО, СС, ПОКР, ПБ, МГН",
    sum: 3_520_000,
    result: "Комплект ПД в 5 экз. + электронная модель",
  },
  {
    n: 4,
    title: "ГИКЭ (историко-культурная экспертиза)",
    detail: "С актом",
    sum: 580_000,
    result: "Положительное заключение ГИКЭ",
  },
  {
    n: 5,
    title: "Госэкспертиза проектной документации",
    detail: "Достоверность сметы",
    sum: 540_000,
    result: "Положительное заключение госэкспертизы",
  },
  {
    n: 6,
    title: "Сопровождение согласований",
    detail: "КГА, ГАТИ, КГИОП, ордер + авторский надзор до 40 ч.",
    sum: 860_000,
    result: 'Полный пакет штампов и разрешений "под ключ"',
  },
];

const TOTAL = 8_500_000;

const PAYMENTS = [
  { label: "Аванс (мобилизация)", pct: 25, sum: 2_125_000, moment: "подписание договора" },
  { label: "2-й платёж", pct: 25, sum: 2_125_000, moment: "после утверждения эскиза в КГИОП" },
  { label: "3-й платёж", pct: 25, sum: 2_125_000, moment: "сдача ПД на экспертизу" },
  { label: "Финальный", pct: 25, sum: 2_125_000, moment: "подписание акта + ордер ГАТИ" },
];

const ROADMAP = [
  { weeks: "1–2", step: "Выездное обследование + 3D-лазерное сканирование", detail: "Бурение кернов, оценка исторической кладки, карнизы, тяги, стропила 1905 г." },
  { weeks: "3–4", step: "Техническое заключение + обмерные чертежи", detail: "Фиксация дефектов, фотофиксация, архивная справка для будущего эскиза" },
  { weeks: "5–8", step: "Разработка эскизного проекта (АР) и ПБЭБ", detail: "Колерный паспорт, материалы, концепция, предварительная оценка воздействия" },
  { weeks: "9–14", step: "Согласование в КГИОП и получение задания КГА", detail: "Сопровождение лично, доработка замечаний (3 цикла — в цене)" },
  { weeks: "11–20", step: "Стадия П: архитектура, конструкции, инженерные системы", detail: "Усиление без потери историчности, скрытая проводка, пожарный компромисс" },
  { weeks: "21–24", step: "ГИКЭ + госэкспертиза сметы", detail: "Подготовка пакета, защита в экспертной комиссии, получение заключений" },
  { weeks: "25–26", step: "Финальные штампы: ордер ГАТИ, акты КГА", detail: "Передача ПД + сопровождение при начале ремонта" },
];

const COST_ITEMS = [
  "Обследование с бурением (лаборатория кладки) — 420 т.р.",
  "3D-сканирование + историческая справка — 210 т.р.",
  "Эскиз / ПБЭБ / сопровождение КГИОП (3 итерации) — 1,1 млн",
  "Раздел АР+КР (усиление исторических балок) — 1,4 млн",
  "ГИКЭ + госэкспертиза (защита) — 950 т.р.",
  "Резерв непредвиденных (30% времени) — 1,8 млн",
];

const PIE_DATA = [
  { label: "Стадия П", value: 3_520_000, hex: "#1e3a5f" },
  { label: "Эскиз + ПБЭБ", value: 1_320_000, hex: "#b8860b" },
  { label: "Предпроектика", value: 1_180_000, hex: "#2c5282" },
  { label: "Согласования", value: 860_000, hex: "#d4a017" },
  { label: "ГИКЭ", value: 580_000, hex: "#4a7abf" },
  { label: "Госэкспертиза", value: 540_000, hex: "#8b6914" },
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

function GanttFerm() {
  const rows = [
    { label: "Обследование", start: 0, span: 2, hex: "#1e3a5f" },
    { label: "3D + обмеры", start: 1, span: 2, hex: "#2c5282" },
    { label: "Ист. справка", start: 2, span: 1, hex: "#4a7abf" },
    { label: "Эскиз + ПБЭБ", start: 4, span: 4, hex: "#b8860b" },
    { label: "КГИОП/КГА", start: 8, span: 6, hex: "#d4a017" },
    { label: "АР / КР / Инж.", start: 10, span: 10, hex: "#1e3a5f" },
    { label: "ГИКЭ + госэксп.", start: 19, span: 5, hex: "#8b6914" },
    { label: "ГАТИ / ордер", start: 23, span: 3, hex: "#2c5282" },
  ];

  const labelW = 120;
  const rowH = 22;
  const rowGap = 5;
  const headerH = 20;
  const footerH = 20;
  const totalCols = 26;
  const svgW = 680;
  const chartW = svgW - labelW;
  const colW = chartW / totalCols;
  const totalH = headerH + rows.length * (rowH + rowGap) + footerH + 8;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${svgW} ${totalH}`}
        width="100%"
        style={{ display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: totalCols }, (_, i) => {
          const x = labelW + i * colW + colW / 2;
          const w = i + 1;
          const show = w % 2 === 0;
          const bold = w % 4 === 0;
          return show ? (
            <text key={i} x={x} y={headerH - 4} textAnchor="middle"
              fontSize="7" fontWeight={bold ? "700" : "400"}
              fill={bold ? GOLD : "#9ca3af"}>
              {w}
            </text>
          ) : null;
        })}

        {rows.map((row, i) => {
          const y = headerH + i * (rowH + rowGap);
          const barX = labelW + row.start * colW + 1;
          const barW = row.span * colW - 2;
          const r = rowH / 2;
          return (
            <g key={i}>
              {Array.from({ length: totalCols }, (_, ci) => (
                <rect key={ci}
                  x={labelW + ci * colW + 1} y={y}
                  width={colW - 2} height={rowH}
                  rx="2" fill="#f3f4f6" />
              ))}
              <text x={labelW - 6} y={y + rowH / 2 + 1} textAnchor="end"
                dominantBaseline="middle" fontSize="9" fontWeight="600" fill="#374151">
                {row.label}
              </text>
              <rect x={barX} y={y} width={barW} height={rowH}
                rx={r} fill={row.hex} opacity="0.92" />
              {row.span >= 2 && (
                <text x={barX + barW / 2} y={y + rowH / 2 + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="7" fontWeight="700" fill="white">
                  {row.span}н
                </text>
              )}
            </g>
          );
        })}

        {Array.from({ length: totalCols }, (_, i) => {
          if ((i + 1) % 4 !== 0) return null;
          const x = labelW + i * colW + colW / 2;
          const footerY = headerH + rows.length * (rowH + rowGap) + 14;
          return (
            <text key={i} x={x} y={footerY} textAnchor="middle"
              fontSize="7" fontWeight="700" fill={GOLD}>
              {i + 1}н
            </text>
          );
        })}

        <text x={labelW} y={totalH - 2} fontSize="7" fill="#9ca3af">
          Нед. 1 = май 2026 · Нед. 26 ≈ октябрь 2026 · Общий срок: ~130 дней
        </text>
      </svg>
    </div>
  );
}

function PieChartWide() {
  const total = PIE_DATA.reduce((s, d) => s + d.value, 0);
  let cum = -90;
  const cx = 100, cy = 100, r = 88;
  const toRad = (a: number) => (a * Math.PI) / 180;
  const segments = PIE_DATA.map(d => {
    const angle = (d.value / total) * 360;
    const s = cum;
    cum += angle;
    const x1 = cx + r * Math.cos(toRad(s));
    const y1 = cy + r * Math.sin(toRad(s));
    const x2 = cx + r * Math.cos(toRad(cum));
    const y2 = cy + r * Math.sin(toRad(cum));
    return { ...d, path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${angle > 180 ? 1 : 0} 1 ${x2},${y2} Z` };
  });
  return (
    <div className="flex flex-row items-center gap-8">
      <svg viewBox="0 0 200 200" style={{ width: "180px", height: "180px", flexShrink: 0 }}>
        {segments.map((s, i) => (
          <path key={i} d={s.path} fill={s.hex} stroke="white" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2">
        {PIE_DATA.map(d => (
          <div key={d.label} className="flex items-center gap-2 text-[10px] text-gray-700">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: d.hex }} />
            <span className="font-semibold">{d.label}</span>
            <span className="text-gray-400 ml-auto pl-2 whitespace-nowrap">{fmt(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function KpFerm() {
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-[#f0f4f8] py-8 px-4">
      <style>{`
        @media print {
          @page { margin: 10mm 10mm; size: A4; }
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          .print-avoid { page-break-inside: avoid; }
          .print-header { margin-bottom: 4px !important; }
          .print-header h1 { font-size: 14px !important; margin-bottom: 2px !important; }
          .print-header p { font-size: 8px !important; line-height: 1.3 !important; }
          .print-badges { display: none !important; }
          .print-price { padding: 6px 16px !important; font-size: 13px !important; border-radius: 8px !important; }
          .print-price-note { display: none !important; }
          .print-logo { height: 28px !important; }
          .print-gold-bar { margin-bottom: 4px !important; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8 print:shadow-none print:rounded-none print:p-0">

        {/* Header */}
        <div className="flex items-start justify-between mb-4 print-header">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <img src={LOGO_URL} alt="Логотип" className="h-10 object-contain print-logo" />
            </div>
            <div className="h-1 w-12 rounded-full mb-3 print-gold-bar" style={{ background: GOLD }} />
            <h1 className="text-xl font-black text-[#1e3a5f] leading-tight mb-2">
              Коммерческое предложение & Дорожная карта
            </h1>
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong className="text-gray-700">Объект:</strong> г. Санкт-Петербург, Фермское шоссе 35-37, лит. А<br />
              <strong className="text-gray-700">Площадь:</strong> 333,5 м² &nbsp;·&nbsp;
              <strong className="text-gray-700">Год постройки:</strong> 1905 &nbsp;·&nbsp;
              <strong className="text-gray-700">Зона:</strong> ЗРЗ<br />
              <strong className="text-gray-700">Статус:</strong> не ОКН, но историческое &nbsp;·&nbsp;
              <strong className="text-gray-700">Стадия:</strong> П (без РД)
            </p>
          </div>
          <div className="no-print ml-4">
            <Button onClick={handlePrint} className="flex items-center gap-2 text-white" style={{ background: GOLD }}>
              <Icon name="Download" size={16} />
              Выгрузить PDF
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4 print-badges">
          {["ОКН-подход", "Фиксированная цена", "Сопровождение КГИОП/КГА/ГАТИ", "ГИКЭ + экспертиза"].map(b => (
            <span key={b} className="text-[10px] font-bold px-3 py-1 rounded-full border"
              style={{ color: "#7b4a0e", borderColor: "#b8860b40", background: "#b8860b10" }}>
              {b}
            </span>
          ))}
        </div>

        {/* Price badge */}
        <div className="mb-4">
          <div className="inline-block text-white font-black px-8 py-4 rounded-full shadow-md mb-1 text-xl print-price"
            style={{ background: "#1e3a5f" }}>
            8 500 000 ₽ — фиксированная цена, всё включено
          </div>
          <p className="text-[10px] text-gray-400 ml-2 print-price-note">Без скрытых платежей и доплат за замечания</p>
        </div>

        {/* Section 1 — КП по этапам + структура стоимости */}
        <SectionTitle num={1}>Детализированное КП (по этапам)</SectionTitle>
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] border-collapse">
              <thead>
                <tr style={{ background: "#eef2ff" }}>
                  <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700 w-6">№</th>
                  <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Этап / Услуга</th>
                  <th className="border border-slate-200 px-2 py-2 text-right font-bold text-gray-700 whitespace-nowrap">Стоимость</th>
                  <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Результат</th>
                </tr>
              </thead>
              <tbody>
                {STAGES.map(s => (
                  <tr key={s.n} className="hover:bg-slate-50">
                    <td className="border border-slate-200 px-2 py-2 text-gray-500 font-bold">{s.n}</td>
                    <td className="border border-slate-200 px-2 py-2 text-gray-700">
                      <span className="font-semibold">{s.title}</span>
                      {s.detail && <span className="text-gray-400 block">{s.detail}</span>}
                    </td>
                    <td className="border border-slate-200 px-2 py-2 text-right font-bold text-[#1e3a5f] whitespace-nowrap">
                      {fmt(s.sum)}
                    </td>
                    <td className="border border-slate-200 px-2 py-2 text-gray-600">{s.result}</td>
                  </tr>
                ))}
                <tr style={{ background: "#f0f9ff" }}>
                  <td colSpan={2} className="border border-slate-200 px-2 py-2 font-black text-gray-800">
                    ИТОГО — фиксированная цена
                  </td>
                  <td className="border border-slate-200 px-2 py-2 text-right font-black text-lg whitespace-nowrap" style={{ color: "#1e3a5f" }}>
                    {fmt(TOTAL)}
                  </td>
                  <td className="border border-slate-200 px-2 py-2 text-[#1e3a5f] font-semibold">
                    Без доплат за замечания / доработки
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pie — на одном листе с таблицей */}
          <div className="mt-4 p-4 rounded-2xl border border-[#e2edf2] bg-[#f8fafc]">
            <p className="text-[10px] font-bold text-gray-600 mb-3 uppercase tracking-wide">Структура стоимости</p>
            <PieChartWide />
          </div>
        </div>

        {/* Section 3 — Диаграмма Ганта */}
        <div className="print-break" />
        <SectionTitle num={3}>Дорожная карта — диаграмма Ганта</SectionTitle>
        <div className="p-4 rounded-2xl border border-[#e2edf2] bg-[#fef9e6] print-avoid">
          <p className="text-[10px] text-gray-500 mb-3">
            Общая длительность: <strong>~5,5 месяцев (130 календарных дней)</strong> &nbsp;·&nbsp;
            Параллельное ведение ГИКЭ и госэкспертизы экономит 1,5 месяца
          </p>
          <GanttFerm />
        </div>

        {/* Roadmap table */}
        <SectionTitle>Пошаговая дорожная карта (с вехами)</SectionTitle>
        <div className="print-avoid overflow-x-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr style={{ background: "#eef2ff" }}>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700 whitespace-nowrap">Неделя</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Шаг</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Детали ОКН-компетенции</th>
              </tr>
            </thead>
            <tbody>
              {ROADMAP.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="border border-slate-200 px-2 py-2 font-bold whitespace-nowrap" style={{ color: GOLD }}>{r.weeks}</td>
                  <td className="border border-slate-200 px-2 py-2 font-semibold text-gray-800">{r.step}</td>
                  <td className="border border-slate-200 px-2 py-2 text-gray-600">{r.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4 — График финансирования */}
        <SectionTitle num={4}>График финансирования (гибкая схема)</SectionTitle>
        <div className="print-avoid overflow-x-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr style={{ background: "#eef2ff" }}>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Платёж</th>
                <th className="border border-slate-200 px-2 py-2 text-center font-bold text-gray-700">%</th>
                <th className="border border-slate-200 px-2 py-2 text-right font-bold text-gray-700">Сумма</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Момент</th>
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.map((p, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="border border-slate-200 px-2 py-2 font-semibold text-gray-800">{p.label}</td>
                  <td className="border border-slate-200 px-2 py-2 text-center font-bold" style={{ color: GOLD }}>{p.pct}%</td>
                  <td className="border border-slate-200 px-2 py-2 text-right font-bold text-[#1e3a5f] whitespace-nowrap">{fmt(p.sum)}</td>
                  <td className="border border-slate-200 px-2 py-2 text-gray-600">{p.moment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 5 — Почему мы */}
        <SectionTitle num={5}>Почему ОКН-эксперты стоят 8,5 млн?</SectionTitle>
        <div className="grid md:grid-cols-2 gap-4 print-avoid">
          <div className="bg-[#f8fafc] border border-[#e2edf2] rounded-2xl p-4">
            <p className="text-[11px] font-bold text-gray-700 mb-2">Реальные риски ЗРЗ + 1905 год</p>
            <ul className="text-[10px] text-gray-600 space-y-1.5">
              <li>• Геологии нет / архивные данные — запрос + полевая доработка</li>
              <li>• КГИОП может потребовать дополнительные обмеры (мы несём затраты)</li>
              <li className="font-semibold text-[#1e3a5f]">• Фикс-цена убирает сюрпризы: вы не платите за повторные согласования</li>
            </ul>
          </div>
          <div className="bg-[#f8fafc] border border-[#e2edf2] rounded-2xl p-4">
            <p className="text-[11px] font-bold text-gray-700 mb-2">Экономия заказчика = 40% времени</p>
            <ul className="text-[10px] text-gray-600 space-y-1.5">
              <li>• Параллельные процессы (проектирование + ГИКЭ)</li>
              <li>• Прямые переговоры с экспертами КГИОП</li>
              <li className="font-semibold text-[#1e3a5f]">• Быстрый ордер ГАТИ — без задержек на 3+ месяца</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-gray-200 print-avoid">
          <p className="text-[10px] text-gray-500 leading-relaxed">
            КП действительно <strong>45 календарных дней</strong>. После подписания предоставляем детальный WBS-график в MS Project / Mermaid.<br />
            По вопросам корректировки состава работ — готовы уточнить за 1 рабочий день.
          </p>
          <p className="text-[10px] text-gray-400 mt-2">
            <strong>Организация:</strong> [Капстрой] &nbsp;·&nbsp; Лицензия МК РФ на ОКН &nbsp;·&nbsp; Член СРО П &nbsp;·&nbsp; Опыт 18+ исторических объектов в ЗРЗ
          </p>
        </div>

      </div>
    </div>
  );
}