import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { exportElementToPdf } from "@/lib/exportPdf";
import { useBlobUrl } from "@/hooks/useBlobUrl";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const KP_NUM = "КП-001/2026";
const KP_DATE = "22 апреля 2026 г.";
const VAT_RATE = 22;
const TOTAL = 8_000_000;
const TOTAL_EX_VAT = 6_557_377.05;
const VAT_SUM = 1_442_622.95;

function fmt(n: number, decimals = 0) {
  return n.toLocaleString("ru-RU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + " ₽";
}

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <div className="mt-6 mb-2">
      <span className="font-bold text-sm text-gray-800 uppercase tracking-wide">
        {num}. {title}
      </span>
      <div className="h-[2px] bg-gray-800 mt-1" />
    </div>
  );
}

const works = [
  { num: 1, name: "Инженерно-геодезические изыскания", volume: "124 га" },
  { num: 2, name: "Инженерно-геологические изыскания", volume: "44 скважины" },
  { num: 3, name: "Съёмка дорог и троп", volume: "Весь остров" },
  { num: 4, name: "Камеральные работы и отчёт", volume: "1 комплект" },
  { num: 5, name: "Логистика, проживание, питание", volume: "Полностью включено" },
];

const tranches = [
  { num: 1, stage: "Аванс (предоплата)", pct: 30, sum: 2_400_000, basis: "Подписание договора" },
  { num: 2, stage: "Завершение полевых работ", pct: 30, sum: 2_400_000, basis: "Подписание акта полевых работ" },
  { num: 3, stage: "Сдача итогового отчёта", pct: 40, sum: 3_200_000, basis: "Подписание итогового акта" },
];

const included = [
  "Доставка персонала и оборудования на остров и обратно",
  "Проживание и питание полевой бригады (8 чел.)",
  "Бурение 44 скважин (глубина 4–6 м)",
  "Лабораторные испытания грунтов (полный комплекс)",
  "Подеревная съёмка (d ≥ 20 см)",
  "Топографический план М 1:500",
  "Геологический план и разрезы",
  "Технический отчёт (ГОСТ) — 2 экз. бумага + цифра",
  "Рекультивация мест бурения",
  `НДС ${VAT_RATE}%`,
];

const excluded = [
  "Экологическое обследование",
  "Проектные работы",
  "Получение разрешений (оформляется Заказчиком)",
];

export default function Ostrov() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const logoSrc = useBlobUrl(LOGO_URL);
  const stampSrc = useBlobUrl(STAMP_URL);

  const handleExport = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      await exportElementToPdf(reportRef.current, `КП_${KP_NUM}_КапстройИнжиниринг_Остров.pdf`, 1123);
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
            <img src={logoSrc} alt="Логотип" className="h-9 object-contain" />
            <div>
              <div className="font-bold text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
              <div className="text-xs text-gray-500">Коммерческое предложение · № {KP_NUM}</div>
            </div>
          </div>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm gap-2"
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
          style={{ fontFamily: "Times New Roman, serif", padding: "25mm 25mm 20mm 30mm" }}
        >
          {/* ── HEADER ── */}
          <div className="flex items-start justify-between mb-6 pb-5 border-b-2 border-indigo-700">
            <div className="flex items-center gap-4">
              <img src={logoSrc} alt="Логотип" className="h-20 object-contain" />
              <div>
                <div className="font-bold text-base text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                <div className="text-xs text-gray-600 mt-1">197341, г. Санкт-Петербург, Фермское шоссе, д. 12, лит. Ж, пом. 310-Н к3</div>
                <div className="text-xs text-gray-600">ИНН 7814795454 · КПП 781401001 · ОГРН 1217800122649</div>
                <div className="text-xs text-gray-500 mt-0.5">info@capstroyeng.ru · +7 (812) 999-00-00</div>
              </div>
            </div>
            <div className="text-right text-xs text-gray-700">
              <div className="font-bold text-indigo-700 text-sm">№ {KP_NUM}</div>
              <div>от {KP_DATE}</div>
            </div>
          </div>

          {/* ── TITLE ── */}
          <div className="text-center mb-5">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Документ №1</p>
            <h1 className="text-base font-bold text-gray-900 uppercase leading-snug">
              Коммерческое предложение № {KP_NUM}
            </h1>
            <p className="text-xs text-gray-500 mt-1">от {KP_DATE}</p>
          </div>

          {/* ── META ── */}
          <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <p className="font-bold text-gray-500 mb-1 uppercase text-[10px] tracking-wide">Заказчик</p>
              <p className="font-semibold text-gray-900">ООО «Карельская сказка»</p>
            </div>
            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <p className="font-bold text-gray-500 mb-1 uppercase text-[10px] tracking-wide">Исполнитель</p>
              <p className="font-semibold text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</p>
            </div>
            <div className="border border-gray-200 rounded p-3 bg-indigo-50 col-span-2">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-bold text-gray-500 mb-0.5 uppercase text-[10px] tracking-wide">Объект</p>
                  <p className="font-semibold text-gray-900">Остров в Ладожском озере, 124 га</p>
                </div>
                <div>
                  <p className="font-bold text-gray-500 mb-0.5 uppercase text-[10px] tracking-wide">Цель</p>
                  <p className="text-gray-800">Строительство базы отдыха (22 участка)</p>
                </div>
                <div>
                  <p className="font-bold text-gray-500 mb-0.5 uppercase text-[10px] tracking-wide">Масштаб</p>
                  <p className="text-gray-800">1:500</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 1. WORKS ── */}
          <SectionTitle num="1" title="Состав работ" />
          <table className="w-full text-xs border-collapse mb-4">
            <thead>
              <tr className="bg-indigo-700 text-white">
                <th className="border border-indigo-600 px-3 py-2 text-left w-8">№</th>
                <th className="border border-indigo-600 px-3 py-2 text-left">Вид работ</th>
                <th className="border border-indigo-600 px-3 py-2 text-center w-36">Объём</th>
              </tr>
            </thead>
            <tbody>
              {works.map((w, i) => (
                <tr key={w.num} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-200 px-3 py-1.5 text-center text-gray-500">{w.num}</td>
                  <td className="border border-gray-200 px-3 py-1.5 text-gray-800">{w.name}</td>
                  <td className="border border-gray-200 px-3 py-1.5 text-center font-semibold text-gray-800">{w.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── SECTION 2. COST ── */}
          <SectionTitle num="2" title="Стоимость работ" />
          <div className="bg-indigo-50 border border-indigo-200 rounded p-4 mb-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-indigo-300">
                  <th className="text-left py-1 font-bold text-gray-700 uppercase text-[10px] tracking-wide">Наименование</th>
                  <th className="text-right py-1 font-bold text-gray-700 uppercase text-[10px] tracking-wide">Сумма</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-indigo-100">
                  <td className="py-1.5 text-gray-700">Стоимость работ (без НДС)</td>
                  <td className="py-1.5 text-right font-semibold text-gray-900">{fmt(TOTAL_EX_VAT, 2)}</td>
                </tr>
                <tr className="border-b border-indigo-100">
                  <td className="py-1.5 text-gray-700">НДС {VAT_RATE}%</td>
                  <td className="py-1.5 text-right font-semibold text-gray-900">{fmt(VAT_SUM, 2)}</td>
                </tr>
                <tr className="bg-indigo-100 rounded">
                  <td className="py-2 font-bold text-indigo-900 text-sm">ИТОГО с НДС</td>
                  <td className="py-2 text-right font-black text-indigo-900 text-xl">{fmt(TOTAL)}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[10px] text-gray-500 mt-2 text-center">
              Восемь миллионов рублей 00 копеек (включая НДС {VAT_RATE}%)
            </p>
            <p className="text-[10px] text-gray-400 mt-1 text-center italic">
              * НДС: {TOTAL_EX_VAT.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} × 0,22 = {VAT_SUM.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
            </p>
          </div>

          {/* ── SECTION 3. PAYMENT ── */}
          <SectionTitle num="3" title="Условия оплаты (30/30/40)" />
          <div className="mb-4">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-indigo-700 text-white">
                  <th className="border border-indigo-600 px-3 py-2 text-left w-16">Транш</th>
                  <th className="border border-indigo-600 px-3 py-2 text-left">Этап</th>
                  <th className="border border-indigo-600 px-3 py-2 text-center w-10">%</th>
                  <th className="border border-indigo-600 px-3 py-2 text-right w-28">Сумма с НДС</th>
                  <th className="border border-indigo-600 px-3 py-2 text-left">Основание</th>
                </tr>
              </thead>
              <tbody>
                {tranches.map((t, i) => (
                  <tr key={t.num} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-200 px-3 py-2 font-bold text-indigo-700 text-center">Транш {t.num}</td>
                    <td className="border border-gray-200 px-3 py-2 text-gray-800">{t.stage}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center font-semibold text-gray-700">{t.pct}%</td>
                    <td className="border border-gray-200 px-3 py-2 text-right font-bold text-gray-900">{t.sum.toLocaleString("ru-RU")} ₽</td>
                    <td className="border border-gray-200 px-3 py-2 text-gray-600">{t.basis}</td>
                  </tr>
                ))}
                <tr className="bg-indigo-50 font-bold">
                  <td colSpan={3} className="border border-indigo-200 px-3 py-2 text-indigo-900">Итого</td>
                  <td className="border border-indigo-200 px-3 py-2 text-right text-indigo-900 text-sm">{fmt(TOTAL)}</td>
                  <td className="border border-indigo-200 px-3 py-2" />
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── SECTION 4. TIMELINE ── */}
          <SectionTitle num="4" title="Сроки выполнения работ" />
          <div className="flex items-stretch gap-3 mb-4">
            <div className="flex-1 bg-green-50 border border-green-300 rounded p-3 text-center">
              <div className="text-4xl font-black text-green-700">44</div>
              <div className="text-xs font-bold text-green-800 mt-0.5">календарных дня</div>
              <div className="text-[10px] text-gray-600 mt-1">Общая продолжительность</div>
            </div>
            <div className="flex-1 bg-blue-50 border border-blue-200 rounded p-3 text-center">
              <div className="text-4xl font-black text-blue-700">24</div>
              <div className="text-xs font-bold text-blue-700 mt-0.5">календарных дня</div>
              <div className="text-[10px] text-gray-600 mt-1">Полевые работы</div>
            </div>
            <div className="flex-1 bg-violet-50 border border-violet-200 rounded p-3 text-center">
              <div className="text-4xl font-black text-violet-700">20</div>
              <div className="text-xs font-bold text-violet-700 mt-0.5">календарных дней</div>
              <div className="text-[10px] text-gray-600 mt-1">Камеральные работы</div>
            </div>
          </div>

          {/* ── SECTION 5. INCLUDED / EXCLUDED ── */}
          <SectionTitle num="5" title="Состав включённых и исключённых работ" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border border-green-300 rounded overflow-hidden">
              <div className="bg-green-600 text-white text-xs font-bold px-3 py-1.5">ВКЛЮЧЕНО В ЦЕНУ</div>
              <ul className="p-3 space-y-1.5">
                {included.map((item, i) => (
                  <li key={i} className="flex gap-2 text-xs text-gray-800">
                    <span className="text-green-600 font-bold shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-red-300 rounded overflow-hidden">
              <div className="bg-red-600 text-white text-xs font-bold px-3 py-1.5">НЕ ВКЛЮЧЕНО</div>
              <ul className="p-3 space-y-1.5">
                {excluded.map((item, i) => (
                  <li key={i} className="flex gap-2 text-xs text-gray-800">
                    <span className="text-red-600 font-bold shrink-0">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── SIGNATURE ── */}
          <div className="border-t-2 border-gray-800 pt-5 mt-6 flex items-end justify-between">
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
              <img src={stampSrc} alt="Печать" className="h-28 w-28 object-contain opacity-90" />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
            <span>ООО «КАПСТРОЙ-ИНЖИНИРИНГ» · ИНН 7814795454</span>
            <span>№ {KP_NUM} · {KP_DATE}</span>
          </div>
        </div>
      </div>
    </div>
  );
}