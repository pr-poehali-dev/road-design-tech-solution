import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { exportElementToPdf } from "@/lib/exportPdf";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const KP_NUM = "КП-011-2026";
const KP_DATE = "09 апреля 2026 г.";
const TOTAL = 1_980_000;
const ADV_PCT = 30;
const ADV = Math.round(TOTAL * ADV_PCT / 100);      // 594 000
const REST = TOTAL - ADV;                            // 1 386 000

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " руб.";
}

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

export default function KpDepo() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      await exportElementToPdf(reportRef.current, `КП_${KP_NUM}_КапстройИнжиниринг.pdf`);
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
              <div className="font-bold text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
              <div className="text-xs text-gray-500">Коммерческое предложение · {KP_NUM}</div>
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
          className="bg-white shadow-lg"
          style={{ fontFamily: "Times New Roman, serif", padding: "25mm 25mm 20mm 30mm" }}
        >
          {/* ── HEADER ── */}
          <div className="flex items-start justify-between mb-6 pb-5 border-b-2 border-indigo-700">
            <div className="flex items-center gap-4">
              <img src={LOGO_URL} alt="Логотип" className="h-20 object-contain" />
              <div>
                <div className="font-bold text-base text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                <div className="text-xs text-gray-600 mt-1">197341, г. Санкт-Петербург, Фермское шоссе, д. 12, лит. Ж, пом. 310-Н к3</div>
                <div className="text-xs text-gray-600">ИНН 7814795454 · КПП 781401001 · ОГРН 1217800122649</div>
              </div>
            </div>
            <div className="text-right text-xs text-gray-700">
              <div className="font-bold text-indigo-700 text-sm">№ {KP_NUM}</div>
              <div>от {KP_DATE}</div>
            </div>
          </div>

          {/* ── TITLE ── */}
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Коммерческое предложение</p>
            <h1 className="text-base font-bold text-gray-900 uppercase">
              № {KP_NUM} от {KP_DATE}
            </h1>
          </div>

          {/* ── PARTIES ── */}
          <div className="mb-5 grid grid-cols-2 gap-6 text-xs">
            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <p className="font-bold text-gray-700 mb-1 uppercase text-[10px] tracking-wide">Кому (Заказчик)</p>
              <p className="font-semibold text-gray-900">ООО «ТМХ-ПТР»</p>
              <p>Обособленное подразделение депо Лобня</p>
              <p className="mt-1">В лице начальника депо <strong>Сухинина И.Г.</strong></p>
            </div>
            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <p className="font-bold text-gray-700 mb-1 uppercase text-[10px] tracking-wide">От (Исполнитель)</p>
              <p className="font-semibold text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</p>
              <p>ИНН 7814795454 · КПП 781401001</p>
              <p>197341, г. Санкт-Петербург, Фермское шоссе, д. 12, лит. Ж, пом. 310-Н к3</p>
            </div>
          </div>

          {/* ── SECTION 1. SUBJECT ── */}
          <SectionTitle num="1" title="Предмет предложения" />
          <p className="text-xs text-gray-800 text-justify leading-relaxed">
            Выполнение работ по определению расчётной тепловой нагрузки на систему отопления помещений
            производственных цехов обособленного подразделения депо Лобня и определению возможных источников
            тепловой энергии в соответствии с Техническим заданием №011, редакция №ТЗ.011.002.ПТР/2026.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            <strong>Основание:</strong> Техническое задание Заказчика, изучение предварительных данных по объектам.
          </p>

          {/* ── SECTION 2. COST ── */}
          <SectionTitle num="2" title="Стоимость услуг" />
          <div className="bg-indigo-50 border border-indigo-200 rounded p-4 mb-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-gray-700">Твёрдая цена договора:</span>
              <span className="text-xl font-bold text-indigo-800">{fmt(TOTAL)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              (Один миллион девятьсот восемьдесят тысяч рублей 00 копеек)
            </p>
            <p className="text-xs text-indigo-700 font-semibold mt-2">
              НДС не облагается — Исполнитель применяет упрощённую систему налогообложения (УСН).
            </p>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            Цена включает все расходы Исполнителя: оплату труда специалистов, командировочные расходы,
            натурное обследование с тепловизионной съёмкой, камеральную обработку, подготовку технического
            отчёта в 3 (трёх) бумажных экземплярах и в электронном виде (PDF), согласование отчёта с Заказчиком,
            членство в СРО, все налоги, сборы и обязательные платежи.
          </p>

          {/* ── SECTION 3. PAYMENT ── */}
          <SectionTitle num="3" title="Условия оплаты" />
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="border border-gray-300 rounded p-3">
              <p className="text-xs font-bold text-gray-700 mb-2 border-b pb-1">Вариант 1 — Без аванса</p>
              <p className="text-xs text-gray-800">
                100% стоимости — <strong>{fmt(TOTAL)}</strong> — в течение 10 (десяти) рабочих дней
                после подписания сторонами акта выполненных работ.
              </p>
            </div>
            <div className="border-2 border-indigo-400 rounded p-3 bg-indigo-50">
              <p className="text-xs font-bold text-indigo-800 mb-2 border-b border-indigo-300 pb-1">
                Вариант 2 — С авансом {ADV_PCT}% ✓ (рекомендуемый)
              </p>
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="py-0.5 text-gray-700">Аванс {ADV_PCT}% при подписании договора:</td>
                    <td className="py-0.5 text-right font-bold text-indigo-800">{fmt(ADV)}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 text-gray-500 text-[10px]">Срок оплаты аванса:</td>
                    <td className="py-0.5 text-right text-gray-500 text-[10px]">5 рабочих дней</td>
                  </tr>
                  <tr className="border-t border-indigo-200 mt-1">
                    <td className="py-0.5 text-gray-700 pt-1">Остаток 70% после подписания акта:</td>
                    <td className="py-0.5 text-right font-bold text-indigo-800">{fmt(REST)}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 text-gray-500 text-[10px]">Срок оплаты остатка:</td>
                    <td className="py-0.5 text-right text-gray-500 text-[10px]">10 рабочих дней</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── SECTION 4. TIMELINE ── */}
          <SectionTitle num="4" title="Срок выполнения работ" />
          <div className="flex items-center gap-4 bg-green-50 border border-green-300 rounded p-3 mb-3">
            <div className="text-3xl font-black text-green-700">20</div>
            <div>
              <p className="text-xs font-bold text-green-800">рабочих дней</p>
              <p className="text-xs text-gray-700 mt-0.5">
                С даты подписания договора <strong>и</strong> предоставления Заказчиком:
              </p>
              <ul className="text-xs text-gray-700 mt-1 list-none space-y-0.5">
                {["доступа на объект (возможность проведения обмеров и обследования)",
                  "поэтажных планов и сведений о существующей котельной",
                  "паспортов систем отопления"].map((t, i) => (
                  <li key={i} className="flex gap-1"><span>—</span><span>{t}</span></li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── SECTION 5. ACCEPTANCE ── */}
          <SectionTitle num="5" title="Порядок сдачи и приёмки работ" />
          <ul className="text-xs text-gray-800 space-y-1">
            {[
              "По окончании работ Исполнитель передаёт Заказчику технический отчёт в 3 экземплярах на бумажном носителе и один экземпляр в электронном виде.",
              "Заказчик в течение 5 рабочих дней рассматривает отчёт и подписывает акт выполненных работ либо направляет мотивированный отказ.",
              "При наличии замечаний Исполнитель устраняет их за свой счёт в согласованные сроки (не более 3 рабочих дней).",
            ].map((t, i) => (
              <li key={i} className="flex gap-2"><span>—</span><span>{t}</span></li>
            ))}
          </ul>

          {/* ── SECTION 6. REQUIREMENTS ── */}
          <SectionTitle num="6" title="Квалификация исполнителя" />
          <ul className="text-xs text-gray-800 space-y-1">
            {[
              "Исполнитель является членом саморегулируемой организации в области архитектурно-строительного проектирования (выписка из реестра СРО прилагается к договору).",
              "Исполнитель имеет опыт выполнения аналогичных работ для промышленных предприятий (по запросу предоставляются референсы).",
              "Ответственность Исполнителя застрахована на сумму 5 000 000 (Пять миллионов) рублей.",
            ].map((t, i) => (
              <li key={i} className="flex gap-2"><span>—</span><span>{t}</span></li>
            ))}
          </ul>

          {/* ── SECTION 7. VALIDITY ── */}
          <SectionTitle num="7" title="Срок действия предложения" />
          <div className="bg-yellow-50 border border-yellow-300 rounded p-3 text-xs text-yellow-900">
            Настоящее коммерческое предложение действительно до <strong>30 апреля 2026 года</strong>.
            По истечении срока стоимость и условия могут быть пересмотрены.
          </div>

          {/* ── SIGNATURE ── */}
          <div style={{ pageBreakBefore: "always", breakBefore: "page" }}>
            <div className="border-t-2 border-gray-800 pt-6 mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-3">С уважением,</p>
                <p className="text-xs text-gray-700">Генеральный директор</p>
                <p className="text-xs font-bold text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</p>
                <p className="text-xs text-gray-700 mt-2">Шумов Иван Викторович</p>
                <div className="mt-6 text-xs text-gray-400">
                  <div>________________</div>
                  <div className="mt-1">(подпись)</div>
                </div>
              </div>
              <div className="text-center">
                <img src={STAMP_URL} alt="Печать" className="h-32 w-32 object-contain opacity-90" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
              <span>ООО «КАПСТРОЙ-ИНЖИНИРИНГ» · ИНН 7814795454</span>
              <span>{KP_NUM} · {KP_DATE}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
