import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const KP_NUM = "02/2026";
const KP_DATE = "07 мая 2026 г.";

const TOTAL = 4_636_000;
const VAT = 836_000;
const P1 = 1_390_800;
const P2 = 1_390_800;
const P3 = 1_854_400;

const API_URL = "https://functions.poehali.dev/48de52d9-7a27-4110-b87b-d00e64ff6c66";

async function imgToBase64(url: string): Promise<string> {
  const res = await fetch(`${API_URL}?action=image-proxy&url=${encodeURIComponent(url)}`);
  const data = await res.json();
  if (data.dataUrl) return data.dataUrl;
  throw new Error("image-proxy: no dataUrl");
}

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
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

const WORK_PARAMS = [
  { param: "Вид работ", value: "Реконструкция (ГрК РФ, ст.1)" },
  { param: "Целевая вместимость (рекомендуемая)", value: "100 детей (гарантия экспертизы)" },
  { param: "Состав ПД", value: "Полный по Постановлению №87 + ПОС + сметы" },
  { param: "Изыскания и обследование", value: "Геология, геодезия, техобследование (ГОСТ 31937-2024)" },
  { param: "Экспертиза", value: "Негосударственная (включена)" },
  { param: "НДС", value: "22% (ФЗ №425-ФЗ)" },
  { param: "Срок", value: "120 календарных дней" },
];

const PAYMENTS = [
  { num: "Платёж 1 (аванс)", share: "30%", amount: P1, basis: "В течение 5 банковских дней после подписания договора" },
  { num: "Платёж 2", share: "30%", amount: P2, basis: "После подписания акта приёмки этапа «Концепция + инженерные изыскания и техобследование»" },
  { num: "Платёж 3", share: "40%", amount: P3, basis: "После подписания итогового акта сдачи-приёмки всей ПД, положительного заключения экспертизы и всех согласований" },
];

const EXTRA_CONDITIONS = [
  {
    title: "Приоритетный старт",
    text: "Аванс 30% фиксирует очередь за вами и цену контракта.",
  },
  {
    title: "Бонус",
    text: "При перечислении первого аванса в течение 5 дней – бесплатный раздел «Энергоэффективность» (рыночная стоимость от 180 000 ₽ без НДС).",
  },
  {
    title: "Гарантия прохождения негосударственной экспертизы",
    text: "При условии утверждённой вместимости до 100 детей и полного предоставления исходных данных.",
  },
];

const RESULTS = [
  "ПД в бумаге (4 экз.) и электронно (PDF + DWG + DOCX + XLSX)",
  "Положительное заключение негосударственной экспертизы (оригинал)",
  "Санитарно-эпидемиологическое заключение Роспотребнадзора (оригинал)",
];

export default function KpSochi() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [logoB64, setLogoB64] = useState<string>(LOGO_URL);
  const [stampB64, setStampB64] = useState<string>(STAMP_URL);

  const handleExport = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const [logo, stamp] = await Promise.all([
        imgToBase64(LOGO_URL),
        imgToBase64(STAMP_URL),
      ]);
      setLogoB64(logo);
      setStampB64(stamp);
      await new Promise((r) => setTimeout(r, 200));

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: false,
        allowTaint: false,
        backgroundColor: "#ffffff",
        windowWidth: 1200,
        logging: false,
      });

      const pageW = 210;
      const pageH = 297;
      const imgW = pageW;
      const imgH = (canvas.height / canvas.width) * imgW;
      const bgData = canvas.toDataURL("image/jpeg", 0.95);

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      let remaining = imgH;
      let page = 0;

      while (remaining > 0) {
        if (page > 0) pdf.addPage();
        pdf.addImage(bgData, "JPEG", 0, -page * pageH, imgW, imgH, undefined, "FAST");
        if (remaining > pageH) {
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, pageH, pageW, imgH + 10, "F");
        }
        remaining -= pageH;
        page++;
      }

      pdf.save(`КП_${KP_NUM}_КапстройИнжиниринг_Сочи.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setLogoB64(LOGO_URL);
      setStampB64(STAMP_URL);
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-[900px] mx-auto mb-4 flex justify-end">
        <Button onClick={handleExport} disabled={exporting} className="gap-2">
          <Icon name="Download" size={16} />
          {exporting ? "Формируется PDF..." : "Скачать КП в PDF"}
        </Button>
      </div>

      <div
        ref={reportRef}
        className="max-w-[900px] mx-auto bg-white text-gray-900 p-10 shadow-lg"
        style={{ fontFamily: "Arial, sans-serif", fontSize: "13px", lineHeight: "1.5" }}
      >
        {/* ШАПКА */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <img src={logoB64} alt="Логотип" style={{ height: 64, objectFit: "contain" }} />
          </div>
          <div className="text-right text-xs text-gray-500">
            <div className="font-bold text-base text-gray-800">КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ</div>
            <div className="text-sm">№ {KP_NUM}</div>
            <div>от {KP_DATE}</div>
          </div>
        </div>

        <div className="h-[2px] bg-gray-800 mb-4" />

        {/* РЕКВИЗИТЫ */}
        <div className="mb-4 text-sm">
          <div><span className="font-semibold">От:</span> ООО «Капстрой Инжиниринг»</div>
          <div><span className="font-semibold">ИНН/КПП:</span> __________________</div>
        </div>

        {/* КОМУ */}
        <div className="mb-4 text-sm">
          <div><span className="font-semibold">Кому:</span> ООО «Обер Хутор» КЭЦ «Моя Россия»</div>
          <div className="mt-1">Уважаемая <span className="font-semibold">Елена Сергеевна!</span></div>
        </div>

        {/* ВВОДНЫЙ ТЕКСТ */}
        <div className="mb-2 text-sm leading-relaxed">
          На основании согласованных корректировок Технического задания предлагаем выполнить
          разработку проектной документации для <span className="font-semibold">реконструкции двух нежилых зданий под детский сад
          полного дня</span> (объект по адресу: <span className="font-semibold">г. Сочи, с. Эстосадок, Набережная лаванда, 8</span>).
        </div>

        {/* 1. УСЛОВИЯ РАБОТ */}
        <SectionTitle num="1" title="УСЛОВИЯ РАБОТ" />
        <table className="w-full text-sm border-collapse mb-2">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2 text-left font-semibold w-[45%] border border-gray-300">Параметр</th>
              <th className="p-2 text-left font-semibold border border-gray-300">Значение</th>
            </tr>
          </thead>
          <tbody>
            {WORK_PARAMS.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-2 border border-gray-200 font-medium">{row.param}</td>
                <td className="p-2 border border-gray-200">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 2. СТОИМОСТЬ */}
        <SectionTitle num="2" title="СТОИМОСТЬ И ПОРЯДОК ОПЛАТЫ (три платежа: 30% – 30% – 40%)" />
        <div className="mb-3 text-sm">
          <div className="font-bold text-base">Общая цена контракта: {fmt(TOTAL)}</div>
          <div className="text-gray-600">(Четыре миллиона шестьсот тридцать шесть тысяч рублей)</div>
          <div className="text-gray-600">(в том числе НДС 22% – {fmt(VAT)})</div>
        </div>
        <table className="w-full text-sm border-collapse mb-2">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2 text-left font-semibold border border-gray-300">№ платежа</th>
              <th className="p-2 text-center font-semibold border border-gray-300">Доля</th>
              <th className="p-2 text-center font-semibold border border-gray-300">Сумма</th>
              <th className="p-2 text-left font-semibold border border-gray-300">Основание для оплаты</th>
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="p-2 border border-gray-200 font-medium">{row.num}</td>
                <td className="p-2 border border-gray-200 text-center font-bold">{row.share}</td>
                <td className="p-2 border border-gray-200 text-center font-bold text-gray-800 whitespace-nowrap">{fmt(row.amount)}</td>
                <td className="p-2 border border-gray-200 text-gray-700">{row.basis}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold">
              <td className="p-2 border border-gray-300" colSpan={2}>Итого:</td>
              <td className="p-2 border border-gray-300 text-center whitespace-nowrap">{fmt(TOTAL)}</td>
              <td className="p-2 border border-gray-300 text-gray-600">
                {fmt(P1)} + {fmt(P2)} + {fmt(P3)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* 3. ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ */}
        <SectionTitle num="3" title="ДОПОЛНИТЕЛЬНЫЕ УСЛОВИЯ" />
        <div className="space-y-2 mb-2">
          {EXTRA_CONDITIONS.map((c, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-gray-800 flex-shrink-0 mt-2" />
              <div>
                <span className="font-semibold">{c.title}</span> — {c.text}
              </div>
            </div>
          ))}
        </div>

        {/* 4. РЕЗУЛЬТАТ РАБОТ */}
        <SectionTitle num="4" title="РЕЗУЛЬТАТ РАБОТ" />
        <div className="space-y-1 mb-4">
          {RESULTS.map((r, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-bold mt-0.5">{i + 1}</div>
              <div>{r}</div>
            </div>
          ))}
        </div>

        {/* ПОДПИСЬ */}
        <div className="mt-8 border-t border-gray-200 pt-4">
          <div className="flex justify-between items-end">
            <div className="text-sm">
              <div className="font-bold mb-1">ООО «Капстрой Инжиниринг»</div>
              <div className="text-gray-600">Руководитель: ______________________ / ______________</div>
              <div className="text-gray-600 mt-1">М.П.</div>
              <div className="text-gray-500 text-xs mt-2">Дата: {KP_DATE}</div>
            </div>
            <div>
              <img
                src={stampB64}
                alt="Печать"
                style={{ height: 90, width: 90, objectFit: "contain", opacity: 0.85 }}
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 pt-3 border-t border-gray-100 text-center text-xs text-gray-400">
          ООО «Капстрой Инжиниринг» · КП № {KP_NUM} · {KP_DATE}
        </div>
      </div>
    </div>
  );
}
