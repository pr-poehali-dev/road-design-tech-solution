import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";

const GOLD = "#b8860b";

const STAGES = [
  {
    n: 1,
    title: "Предпроектные работы",
    detail: "Обследование с бурением + 3D-скан",
    sum: 1_250_000,
    result: "Точные данные по конструкциям",
  },
  {
    n: 2,
    title: "Эскизный проект + ПБЭБ + согласование КГИОП",
    detail: "3 цикла согласования включены",
    sum: 1_780_000,
    result: "Письменное согласование КГИОП",
  },
  {
    n: 3,
    title: "Проектная документация стадия П",
    detail: "АР, КР, ОВ, ВК, ЭО, ПОКР, ПБ, МГН и др.",
    sum: 3_850_000,
    result: "Комплект ПД в 5 экз. + электронная модель",
  },
  {
    n: 4,
    title: "ГИКЭ + госэкспертиза",
    detail: "Подготовка, защита, получение актов",
    sum: 920_000,
    result: "Положительные заключения",
  },
  {
    n: 5,
    title: "Сопровождение, ордер ГАТИ, авторский надзор",
    detail: "40 ч. авторского надзора включено",
    sum: 700_000,
    result: 'Ордер ГАТИ "под ключ"',
  },
];

const TOTAL = 8_500_000;

const PAYMENTS = [
  { label: "Аванс", pct: 30, sum: 2_550_000, moment: "Подписание договора" },
  { label: "2-й платёж", pct: 25, sum: 2_125_000, moment: "Письменное согласование эскиза в КГИОП" },
  { label: "3-й платёж", pct: 25, sum: 2_125_000, moment: "Сдача ПД на экспертизу" },
  { label: "Финал", pct: 20, sum: 1_700_000, moment: "Получение ордера ГАТИ + акт сдачи-приёмки" },
];

const ROADMAP = [
  { weeks: "1–2", step: "Выезд, обследование, бурение, 3D-скан, замер до дороги", action: "Инженеры + геодезист", result: "Точные данные по конструкциям и расстоянию до проезжей части" },
  { weeks: "3", step: "Лаборатория, обмерные чертежи, историческая справка", action: "Анализ проб, векторные чертежи", result: "Техническое заключение" },
  { weeks: "4–5", step: "Запрос ТУ в сетевые организации + при необх. в КРТИ", action: "Юристы, параллельно с обмерами", result: "ТУ (если требуются) — бесплатно" },
  { weeks: "6–8", step: "Эскизный проект + ПБЭБ", action: "Архитекторы", result: "Пакет для КГИОП" },
  { weeks: "9–13", step: "Согласование в КГИОП (3 цикла)", action: "Сопровождение, защиты", result: "Письменное согласование КГИОП" },
  { weeks: "10–14", step: "Задание КГА (при необходимости)", action: "Регистрация", result: "Штамп КГА" },
  { weeks: "11–18", step: "Стадия П (АР, КР, ОВ, ВК, ЭО, СС, ТХ)", action: "Проектирование", result: "Комплект чертежей" },
  { weeks: "19–20", step: "ПОКР + ПБ + МГН + Схема ОДД", action: "Проектировщик + транспортник", result: "Документация для ГИБДД и ГАТИ" },
  { weeks: "21–23", step: "Согласование Схемы ОДД с ГИБДД и ГАТИ", action: "Сопровождение", result: "Разрешение на занятие полосы/тротуара (если нужно)" },
  { weeks: "21–25", step: "ГИКЭ и госэкспертиза (параллельно)", action: "Подача, защита", result: "Положительные заключения" },
  { weeks: "24–26", step: "Получение ордера ГАТИ (с учётом всех сетей и дороги)", action: "Регистрация", result: "Ордер — основание для начала ремонта" },
  { weeks: "26", step: "Передача ПД заказчику + авторский надзор (старт)", action: "Сдача по акту", result: "Готовый пакет" },
];

const PIE_DATA = [
  { label: "Стадия П", value: 3_850_000, hex: "#1e3a5f" },
  { label: "Эскиз + ПБЭБ", value: 1_780_000, hex: "#b8860b" },
  { label: "Предпроектика", value: 1_250_000, hex: "#2c5282" },
  { label: "ГИКЭ + госэксп.", value: 920_000, hex: "#8b6914" },
  { label: "Сопровождение", value: 700_000, hex: "#d4a017" },
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

function SubSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-black uppercase tracking-wide text-[#1e3a5f] mt-5 mb-2 flex items-center gap-2">
      <span className="inline-block w-2 h-2 rounded-full" style={{ background: GOLD }} />
      {children}
    </p>
  );
}

function GanttFerm() {
  const rows = [
    { label: "Обследование", start: 0, span: 2, hex: "#1e3a5f" },
    { label: "3D + обмеры", start: 1, span: 2, hex: "#2c5282" },
    { label: "Ист. справка", start: 2, span: 1, hex: "#4a7abf" },
    { label: "Запрос ТУ сети", start: 2, span: 3, hex: "#b8860b" },
    { label: "ТУ КРТИ (дорога)", start: 2, span: 2, hex: "#d4a017" },
    { label: "Эскиз + ПБЭБ", start: 5, span: 3, hex: "#b8860b" },
    { label: "КГИОП/КГА", start: 8, span: 5, hex: "#d4a017" },
    { label: "АР / КР / Инж.", start: 10, span: 8, hex: "#1e3a5f" },
    { label: "ПОКР + ОДД", start: 18, span: 2, hex: "#2c5282" },
    { label: "ГИБДД + ГАТИ", start: 20, span: 3, hex: "#4a7abf" },
    { label: "ГИКЭ + госэксп.", start: 20, span: 5, hex: "#8b6914" },
    { label: "Ордер ГАТИ", start: 23, span: 3, hex: "#2c5282" },
  ];

  const labelW = 130;
  const rowH = 20;
  const rowGap = 4;
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
                dominantBaseline="middle" fontSize="8.5" fontWeight="600" fill="#374151">
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
          Нед. 1 = июнь 2026 · Нед. 26 ≈ ноябрь 2026 · Общий срок: ~6 месяцев
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
      <svg viewBox="0 0 200 200" style={{ width: "160px", height: "160px", flexShrink: 0 }}>
        {segments.map((s, i) => (
          <path key={i} d={s.path} fill={s.hex} stroke="white" strokeWidth="1.5" />
        ))}
      </svg>
      <div className="flex flex-col gap-2 flex-1">
        {PIE_DATA.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.hex }} />
            <span className="text-[10px] text-gray-700 flex-1">{d.label}</span>
            <span className="text-[10px] font-bold text-[#1e3a5f] whitespace-nowrap">{fmt(d.value)}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
          <span className="inline-block w-2.5 h-2.5 shrink-0" />
          <span className="text-[10px] font-black text-gray-800 flex-1">ИТОГО</span>
          <span className="text-[10px] font-black text-[#1e3a5f] whitespace-nowrap">{fmt(TOTAL)}</span>
        </div>
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
            <h1 className="text-xl font-black text-[#1e3a5f] leading-tight mb-3">
              Коммерческое предложение & Дорожная карта
            </h1>
            <div className="text-xs text-gray-600 leading-relaxed space-y-0.5">
              <p><strong className="text-gray-800">Объект:</strong> г. Санкт-Петербург, Фермское шоссе 35-37, лит. А</p>
              <p>
                <strong className="text-gray-800">Площадь:</strong> 333,5 м² &nbsp;|&nbsp;
                <strong className="text-gray-800">2 этажа</strong> &nbsp;|&nbsp;
                <strong className="text-gray-800">Год постройки:</strong> 1905
              </p>
              <p><strong className="text-gray-800">Статус:</strong> не ОКН, историческое здание в зоне ЗРЗ</p>
              <p><strong className="text-gray-800">Характер работ:</strong> капитальный ремонт</p>
              <p><strong className="text-gray-800">Стадия проектирования:</strong> П (рабочая документация не требуется)</p>
            </div>
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

        {/* Price + условия */}
        <div className="mb-5 p-4 rounded-2xl border-2 border-[#1e3a5f20] bg-[#f8fafc]">
          <div className="inline-block text-white font-black px-8 py-3 rounded-full shadow-md mb-3 text-xl print-price"
            style={{ background: "#1e3a5f" }}>
            8 500 000 ₽ — фиксированная цена, всё включено
          </div>
          <div className="text-[11px] text-gray-700 space-y-1">
            <p>✅ <strong>Цена:</strong> 8 500 000 (Восемь миллионов пятьсот тысяч) рублей</p>
            <p>✅ <strong>Срок:</strong> 6 месяцев (с учётом возможных согласований по магистралям)</p>
            <p>✅ <strong>Условия:</strong> фиксированная цена, полное сопровождение, ГИКЭ + госэкспертиза (при необходимости), ордер ГАТИ «под ключ»</p>
          </div>
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

        {/* Section 2 — Обоснование по магистралям */}
        <SectionTitle num={2}>Обоснование по магистралям (два типа)</SectionTitle>

        <SubSectionTitle>2.1. Подземные инженерные коммуникации (газ, теплотрасса, кабели, водопровод)</SubSectionTitle>
        <div className="bg-[#f8fafc] border border-[#e2edf2] rounded-2xl p-4 mb-4">
          <p className="text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-wide">
            Опасения: потребуются ли допсогласования, не остановят ли работы, не вырастет ли бюджет
          </p>
          <p className="text-[10px] font-black text-[#1e3a5f] mb-2">Наша экспертная позиция (ОКН + инженерные сети):</p>
          <ul className="text-[10px] text-gray-700 space-y-2">
            <li>• На старте проекта запрашиваем технические условия (ТУ) у собственников коммуникаций (ГУП ТЭК, Ленэнерго, Водоканал и др.). Это стандартная процедура, которую мы выполняем параллельно проектированию — без увеличения общих сроков.</li>
            <li>• Большинство магистралей имеют охранные зоны, но капитальный ремонт здания (фасады, кровля, внутренние инженерные системы) не требует вскрытия подземных сетей под дорогой. Исключение — новое подключение к коммуникациям, но оно не входит в ТЗ.</li>
            <li>• Если по результатам обследования потребуются щадящие работы у фундаментов (инъецирование, микросваи), мы проектируем их так, чтобы исключить динамические нагрузки на трубы. Это стандарт для исторической застройки Санкт-Петербурга.</li>
            <li>• ГАТИ проверяет пересечение с сетями. При правильном оформлении ордер выдаётся за 10–15 дней. Мы проходили эту процедуру более чем на 20 объектах в ЗРЗ.</li>
            <li className="font-semibold text-[#1e3a5f]">• Вероятность задержки из-за подземных магистралей — менее 5%. В случае выявления особых условий (редко: газ высокого давления без ТУ) — уведомляем Ростехнадзор, что добавляет 14–20 дней, но не останавливает проект и не увеличивает нашу стоимость.</li>
          </ul>
        </div>

        <SubSectionTitle>2.2. Автомобильная дорога (магистраль общего пользования)</SubSectionTitle>
        <div className="bg-[#f8fafc] border border-[#e2edf2] rounded-2xl p-4 mb-4">
          <p className="text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-wide">
            Опасения: согласование с ГИБДД / КРТИ, закрытие движения, установка лесов, штрафы, увеличение сроков
          </p>
          <p className="text-[10px] font-black text-[#1e3a5f] mb-2">Наша экспертная позиция (проектирование вблизи дорог):</p>
          <ul className="text-[10px] text-gray-700 space-y-2">
            <li>• Замеряем расстояние от здания до проезжей части на старте (входит в 3D-сканирование).</li>
            <li>• Если здание находится в придорожной полосе (обычно 15–30 м от края дороги), запрашиваем технические условия КРТИ — это бесплатно и занимает 10–14 дней.</li>
            <li>• Разрабатываем Схему организации дорожного движения (СОДД) в составе раздела ПОКР. Это обязательное требование ГАТИ при занятии полосы или тротуара.</li>
            <li>• Для ремонта фасада/кровли полное перекрытие дороги не требуется. Достаточно временного ограничения одной полосы с установкой ограждений и перенаправлением потока — это согласовывается с ГИБДД и ГАТИ в течение 10–15 дней.</li>
            <li>• Если здание стоит вплотную к проезжей части (&lt;3 м) — оформляем временное занятие полосы. Это рутинная практика для 70% исторических зданий в центре Санкт-Петербурга (Невский пр., Литейный и др.).</li>
            <li className="font-semibold text-[#1e3a5f]">• Наличие дороги — не отказное обстоятельство. Мы берём на себя все согласования (ГИБДД, КРТИ, ГАТИ). Дополнительный срок — не более 20 календарных дней — уже учтён в итоговой дорожной карте. Цена 8,5 млн не меняется.</li>
          </ul>
        </div>

        {/* Section 3 — Диаграмма Ганта */}
        <div className="print-break" />
        <SectionTitle num={3}>Итоговая дорожная карта (с учётом магистралей)</SectionTitle>
        <div className="p-4 rounded-2xl border border-[#e2edf2] bg-[#fef9e6]">
          <p className="text-[10px] text-gray-500 mb-3">
            Общая длительность: <strong>~6 месяцев (26 недель)</strong> &nbsp;·&nbsp;
            Параллельное ведение ГИКЭ и госэкспертизы экономит 1,5 месяца &nbsp;·&nbsp;
            Буфер по дорожным согласованиям (+20 дней) уже учтён
          </p>
          <GanttFerm />
        </div>

        {/* 3.2 Пошаговая таблица */}
        <SubSectionTitle>3.2. Пошаговая таблица (с контрольными точками)</SubSectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr style={{ background: "#eef2ff" }}>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700 whitespace-nowrap">Неделя</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Этап</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Действие</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Результат</th>
              </tr>
            </thead>
            <tbody>
              {ROADMAP.map((r, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="border border-slate-200 px-2 py-2 font-bold whitespace-nowrap" style={{ color: GOLD }}>{r.weeks}</td>
                  <td className="border border-slate-200 px-2 py-2 font-semibold text-gray-800">{r.step}</td>
                  <td className="border border-slate-200 px-2 py-2 text-gray-500">{r.action}</td>
                  <td className="border border-slate-200 px-2 py-2 text-gray-600">{r.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4 — График финансирования */}
        <SectionTitle num={4}>График финансирования (гибкий, без переплат)</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr style={{ background: "#eef2ff" }}>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Платёж</th>
                <th className="border border-slate-200 px-2 py-2 text-center font-bold text-gray-700">%</th>
                <th className="border border-slate-200 px-2 py-2 text-right font-bold text-gray-700 whitespace-nowrap">Сумма</th>
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

        {/* Section 5 — За рамками цены */}
        <SectionTitle num={5}>Что остаётся за рамками нашей фиксированной цены (прозрачно)</SectionTitle>
        <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-4 space-y-2">
          <p className="text-[10px] text-gray-700">
            <strong>Физическая установка дорожных знаков / ограждений</strong> (если потребуется) — это работа строительного подрядчика, ориентир 100–150 тыс. руб. Мы предоставляем схему расстановки.
          </p>
          <p className="text-[10px] text-gray-700">
            <strong>Платежи в госэкспертизу</strong> (если по закону они должны вноситься заказчиком) — мы включали их в свою цену как организацию подачи, но в некоторых случаях требуется прямой платёж. Уточним по факту. Обычно это 100–200 тыс. руб.
          </p>
          <p className="text-[10px] text-gray-700">
            <strong>Непредвиденные работы, не связанные с проектированием</strong> (например, перенос сетей за пределами здания) — не наш профиль.
          </p>
        </div>

        {/* Section 6 — Резюме */}
        <SectionTitle num={6}>Резюме для заказчика</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr style={{ background: "#eef2ff" }}>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Фактор</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Ответ</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Магистрали (подземные сети)", "Получение ТУ, щадящие технологии, сопровождение в ГАТИ — всё включено. Задержка <5%, стоимость неизменна"],
                ["Магистральная дорога", "Схема ОДД, согласование с ГИБДД и КРТИ, ордер — всё включено. Буфер +20 дней учтён"],
                ["Общая цена", "8 500 000 ₽ фикс"],
                ["Общий срок", "6 месяцев (с учётом дорожных и сетевых согласований)"],
                ["Результат", "Полный пакет ПД + положительные экспертизы + ордер ГАТИ для начала ремонта"],
              ].map(([factor, answer], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="border border-slate-200 px-2 py-2 font-semibold text-gray-800 whitespace-nowrap">{factor}</td>
                  <td className="border border-slate-200 px-2 py-2 text-gray-700">{answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
