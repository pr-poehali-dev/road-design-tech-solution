import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const stages = [
  {
    id: 1,
    code: "АК",
    name: "Архитектурная концепция",
    duration: 30,
    weeks: [1, 7],
    noVat: 500000,
    withVat: 610000,
    advance: 610000,
    advancePct: 100,
    color: "#6366f1",
    lightColor: "#eef2ff",
  },
  {
    id: 2,
    code: "АГР",
    name: "Архитектурно-градостроительное решение",
    duration: 40,
    weeks: [5, 12],
    noVat: 1500000,
    withVat: 1830000,
    advance: 1830000,
    advancePct: 100,
    color: "#8b5cf6",
    lightColor: "#f5f3ff",
  },
  {
    id: 3,
    code: "ПД",
    name: "Проектная документация",
    duration: 45,
    weeks: [7, 22],
    noVat: 3992153,
    withVat: 4870427,
    advance: 974085,
    advancePct: 20,
    color: "#0ea5e9",
    lightColor: "#f0f9ff",
  },
  {
    id: 4,
    code: "РД",
    name: "Рабочая документация",
    duration: 60,
    weeks: [12, 30],
    noVat: 4879297,
    withVat: 5952742,
    advance: 0,
    advancePct: 0,
    color: "#10b981",
    lightColor: "#ecfdf5",
  },
];

const fmt = (n: number) =>
  n.toLocaleString("ru-RU", { maximumFractionDigits: 0 }) + " руб.";

const milestones = [
  { week: 2, text: "Утверждение исходных данных", color: "#6366f1" },
  { week: 7, text: "Утверждение АК Заказчиком", color: "#8b5cf6" },
  { week: 12, text: "Свидетельство АГР", color: "#0ea5e9" },
  { week: 15, text: "Тендерная документация", color: "#10b981" },
  { week: 22, text: "Заключение экспертизы ПД", color: "#f59e0b" },
  { week: 30, text: "Сдача полного комплекта РД", color: "#ef4444" },
];

const stageWorks: Record<number, { phase: string; items: string[] }[]> = {
  1: [
    {
      phase: "Недели 1–4",
      items: [
        "Разработка эскизных предложений (2–3 варианта)",
        "Создание 3D-визуализаций фасадов и основных видов",
        "Разработка поэтажных планов",
        "Разработка фасадов с указанием материалов",
        "Разработка схемы генерального плана",
      ],
    },
    {
      phase: "Неделя 5",
      items: [
        "Презентация материалов Заказчику",
        "Сбор замечаний и предложений",
        "Фиксация утверждённого варианта",
      ],
    },
    {
      phase: "Неделя 6",
      items: [
        "Доработка концепции по замечаниям",
        "Подготовка комплекта для Архитектурной комиссии",
        "Формирование альбома АК",
      ],
    },
    {
      phase: "Неделя 7",
      items: [
        "Подача материалов в Архитектурную комиссию",
        "Участие в заседании комиссии",
        "Получение протокола согласования",
      ],
    },
  ],
  2: [
    {
      phase: "Недели 5–8",
      items: [
        "Сбор исходных для АГР, актуализированный ГПЗУ",
        "Разработка ситуационного плана и схемы ПЗОЗУ",
        "Разработка фасадов, цветового решения, благоустройства",
        "Подготовка НПМ и ВПМ",
        "Создание IFC-модели объекта",
      ],
    },
    {
      phase: "Недели 9–10",
      items: [
        "Согласование материалов АГР с Заказчиком",
        "Внесение корректировок",
      ],
    },
    {
      phase: "Недели 11–12",
      items: [
        "Подача комплекта АГР в Москомархитектуру",
        "Сопровождение рассмотрения, ответы на запросы",
        "Получение Свидетельства об утверждении АГР",
      ],
    },
  ],
  3: [
    {
      phase: "Недели 7–10",
      items: [
        "Формирование задания на проектирование для смежников",
        "Разработка раздела ПЗ (пояснительная записка)",
        "Разработка раздела ПЗУ",
      ],
    },
    {
      phase: "Недели 11–14",
      items: [
        "Разработка раздела АР (архитектурные решения)",
        "Разработка раздела КР: обследование, расчёты, узлы",
      ],
    },
    {
      phase: "Недели 15–18",
      items: [
        "Разработка раздела ИОС: электроснабжение, ВК, ОВ, связь, АПС",
      ],
    },
    {
      phase: "Недели 19–21",
      items: [
        "Разделы ПОС, ООС, ПБ, сметная документация",
        "Внутренний нормоконтроль, увязка разделов",
      ],
    },
    {
      phase: "Неделя 22",
      items: [
        "Передача ПД на негосударственную экспертизу",
        "Сопровождение, ответы на замечания",
        "Получение положительного заключения",
      ],
    },
  ],
  4: [
    {
      phase: "Подэтап 4.1 (нед. 12–15)",
      items: [
        "Стройгенплан, опалубочные схемы, кладочные планы",
        "Компоновочные схемы металлоконструкций",
        "ВОР по демонтажным, строительным и инженерным работам",
        "Свод ВОР в единую форму для тендера",
      ],
    },
    {
      phase: "Подэтап 4.2 (нед. 16–28)",
      items: [
        "Разделы АР, КЖ, КМ с армированием и спецификациями",
        "Разделы ЭОМ, ВК, ОВ, СС, АПС",
        "Спецификации по ГОСТ 21.110-2013",
      ],
    },
    {
      phase: "Подэтап 4.3 (нед. 20–30)",
      items: [
        "Чертежи под дизайн-проект: перегородки, сантехника, детали",
        "Увязка с основным комплектом РД",
        "Комплектация, выпуск, передача Заказчику",
      ],
    },
  ],
};

const TOTAL_WEEKS = 30;

export default function KP1() {
  const [activeTab, setActiveTab] = useState("kp");
  const kpRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const exportPDF = async () => {
    const ref = activeTab === "kp" ? kpRef : roadmapRef;
    if (!ref.current) return;
    setExporting(true);
    try {
      const el = ref.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        windowWidth: 1123,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageW = 210;
      const pageH = 297;
      const canvasW = canvas.width;
      const canvasH = canvas.height;
      const imgW = pageW;
      const imgH = (canvasH / canvasW) * imgW;
      let y = 0;
      let remaining = imgH;
      let page = 0;
      while (remaining > 0) {
        if (page > 0) pdf.addPage();
        const sliceH = Math.min(pageH, remaining);
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          -page * pageH,
          imgW,
          imgH,
          undefined,
          "FAST"
        );
        // clip to page — use white rect to hide overflow
        if (remaining > pageH) {
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, pageH, pageW, imgH, "F");
        }
        y += sliceH;
        remaining -= pageH;
        page++;
      }
      pdf.save(
        activeTab === "kp" ? "КП_КапстройИнжиниринг.pdf" : "Дорожная_карта.pdf"
      );
    } catch (e) {
      console.error(e);
    }
    setExporting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Логотип" className="h-10 object-contain" />
            <div>
              <div className="font-bold text-gray-800 text-sm leading-tight">
                ООО «КАПСТРОЙ-ИНЖИНИРИНГ»
              </div>
              <div className="text-xs text-gray-500">
                Проектирование и инжиниринг
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-gray-100">
                <TabsTrigger value="kp" className="text-sm">
                  Коммерческое предложение
                </TabsTrigger>
                <TabsTrigger value="roadmap" className="text-sm">
                  Дорожная карта
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              onClick={exportPDF}
              disabled={exporting}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              <Icon name="Download" size={14} />
              {exporting ? "Экспорт..." : "Скачать PDF"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === "kp" && (
          <div ref={kpRef} className="bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
            <KPContent />
          </div>
        )}
        {activeTab === "roadmap" && (
          <div ref={roadmapRef} className="bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
            <RoadmapContent />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   КП
───────────────────────────────────────────── */
function KPContent() {
  return (
    <div className="p-10 text-gray-800">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-indigo-600">
        <div className="flex items-center gap-4">
          <img src={LOGO_URL} alt="Логотип" className="h-20 object-contain" />
          <div>
            <div className="font-bold text-lg text-gray-900 leading-tight">
              ООО «КАПСТРОЙ-ИНЖИНИРИНГ»
            </div>
            <div className="text-xs text-gray-500 mt-1">
              197341, г. Санкт-Петербург, Фермское шоссе, д. 12, лит. Ж, пом. 310-Н к3
            </div>
            <div className="text-xs text-gray-500">
              ИНН 7814795454 · КПП 781401001 · ОГРН 1217800122649
            </div>
          </div>
        </div>
        <div className="text-right text-sm text-gray-600">
          <div className="font-semibold text-indigo-700">Исх. №: КП-03/ЭПС-2026</div>
          <div>Дата: 26 февраля 2026 г.</div>
          <div className="mt-2 text-xs">Заказчик: ООО «Траяна»</div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-block bg-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full mb-3 tracking-widest uppercase">
          Коммерческое предложение (сводное)
        </div>
        <h1 className="text-xl font-bold text-gray-900 leading-tight">
          Выполнение проектных работ по объекту:
        </h1>
        <h2 className="text-lg font-semibold text-indigo-700 mt-1">
          «Реконструкция офисного здания по адресу: г. Москва, пер. Калошин, д. 8»
        </h2>
        <div className="flex items-center justify-center gap-6 mt-3 text-sm text-gray-600">
          <span>Вид работ: Реконструкция</span>
          <span className="w-px h-4 bg-gray-300" />
          <span>Стадийность: АК · АГР · ПД · РД</span>
        </div>
      </div>

      {/* Section 1 — Cost Table */}
      <SectionTitle number="1" title="Общая стоимость работ" />
      <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="px-4 py-3 text-left font-semibold">Этап</th>
              <th className="px-4 py-3 text-left font-semibold">Наименование</th>
              <th className="px-4 py-3 text-right font-semibold">Без НДС</th>
              <th className="px-4 py-3 text-right font-semibold">С НДС 22%</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((s, i) => (
              <tr
                key={s.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-3">
                  <span
                    className="inline-block px-2 py-0.5 rounded font-bold text-white text-xs"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.code}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">{s.name}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-700">
                  {fmt(s.noVat)}
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-gray-900">
                  {fmt(s.withVat)}
                </td>
              </tr>
            ))}
            <tr className="bg-indigo-50 border-t-2 border-indigo-600">
              <td colSpan={2} className="px-4 py-3 font-bold text-indigo-900">
                ИТОГО ПО ДОГОВОРУ
              </td>
              <td className="px-4 py-3 text-right font-bold font-mono text-indigo-900">
                {fmt(10871450)}
              </td>
              <td className="px-4 py-3 text-right font-bold font-mono text-indigo-900 text-base">
                {fmt(13263169)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cost Bar Chart */}
      <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-sm font-semibold text-gray-700 mb-4">
          Структура стоимости по этапам (с НДС)
        </div>
        <div className="space-y-3">
          {stages.map((s) => {
            const pct = Math.round((s.withVat / 13263169) * 100);
            return (
              <div key={s.id} className="flex items-center gap-3">
                <div className="w-10 text-xs font-bold text-right" style={{ color: s.color }}>
                  {s.code}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-7 overflow-hidden">
                  <div
                    className="h-full rounded-full flex items-center px-3"
                    style={{ width: `${pct}%`, backgroundColor: s.color }}
                  >
                    <span className="text-white text-xs font-semibold">{pct}%</span>
                  </div>
                </div>
                <div className="w-36 text-xs text-right font-mono text-gray-700">
                  {fmt(s.withVat)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2 — Payment */}
      <SectionTitle number="2" title="Условия оплаты" />
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stages.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: s.color + "40" }}
          >
            <div
              className="px-4 py-2 flex items-center gap-2"
              style={{ backgroundColor: s.color }}
            >
              <span className="text-white font-bold text-sm">{s.code}</span>
              <span className="text-white text-xs opacity-90">{s.name}</span>
            </div>
            <div className="p-4 space-y-2" style={{ backgroundColor: s.lightColor }}>
              <PayRow label="Стоимость с НДС" value={fmt(s.withVat)} />
              <PayRow
                label={`Аванс (${s.advancePct}%)`}
                value={fmt(s.advance)}
                accent
              />
              <PayRow
                label="Остаток"
                value={fmt(s.withVat - s.advance)}
              />
              {s.id === 1 && (
                <p className="text-xs text-gray-500 pt-1">
                  100% предоплата. Оплата после подписания договора.
                </p>
              )}
              {s.id === 2 && (
                <p className="text-xs text-gray-500 pt-1">
                  100% предоплата. Оплата после завершения этапа 1.
                </p>
              )}
              {s.id === 3 && (
                <p className="text-xs text-gray-500 pt-1">
                  Остаток — после положительного заключения экспертизы ПД.
                </p>
              )}
              {s.id === 4 && (
                <div className="text-xs text-gray-500 pt-1 space-y-0.5">
                  <p>Оплата поэтапно:</p>
                  <p>· 4.1 Тендерная документация — 1 220 000 руб.</p>
                  <p>· 4.2 Основной комплект РД — 3 512 742 руб.</p>
                  <p>· 4.3 Доп. комплект (дизайн) — 1 220 000 руб.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Section 3 — Advance calc */}
      <SectionTitle number="3" title="Расчёт общего аванса" />
      <div className="mb-6 p-5 bg-indigo-50 rounded-xl border border-indigo-200">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <AdvCard label="Аванс АК" value="610 000 руб." color="#6366f1" />
          <AdvCard label="Аванс АГР" value="1 830 000 руб." color="#8b5cf6" />
          <AdvCard label="Аванс ПД" value="974 085 руб." color="#0ea5e9" />
        </div>
        <div className="flex items-center justify-between bg-white rounded-lg px-5 py-3 border border-indigo-300">
          <div>
            <div className="text-sm text-gray-600">Итого авансов</div>
            <div className="text-xl font-bold text-indigo-700">
              3 414 085 руб.
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Доля в договоре</div>
            <div className="text-3xl font-black text-indigo-600">25,7%</div>
          </div>
          <div className="text-right text-xs text-gray-500 max-w-xs">
            Для достижения 30% рекомендуется увеличить аванс по ПД до 30%{" "}
            <span className="font-semibold">(1 461 128 руб.)</span>, итого
            авансов — 3 901 128 руб. (29,4%)
          </div>
        </div>
      </div>

      {/* Section 4 — Scope */}
      <SectionTitle number="4" title="Состав работ по этапам" />
      <div className="mb-6 space-y-4">
        {stages.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: s.color + "40" }}
          >
            <div
              className="px-4 py-2.5 flex items-center justify-between"
              style={{ backgroundColor: s.color }}
            >
              <span className="text-white font-bold">
                Этап {s.id}. {s.code} — {s.name}
              </span>
              <span className="text-white text-xs opacity-80">
                {s.duration} рабочих дней
              </span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-1" style={{ backgroundColor: s.lightColor }}>
              {stageWorks[s.id]?.flatMap((phase) =>
                phase.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                    <span
                      className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: s.color }}
                    />
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Section 5 — Timeline */}
      <SectionTitle number="5" title="Сроки выполнения работ" />
      <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-3 text-left">Этап</th>
              <th className="px-4 py-3 text-center">Продолжительность</th>
              <th className="px-4 py-3 text-left">Условие старта</th>
              <th className="px-4 py-3 text-left">Результат</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b border-gray-100">
              <td className="px-4 py-3 font-semibold" style={{ color: "#6366f1" }}>
                АК
              </td>
              <td className="px-4 py-3 text-center">30 р/дн.</td>
              <td className="px-4 py-3 text-gray-600">После подписания договора</td>
              <td className="px-4 py-3 text-gray-600">Протокол Архит. комиссии</td>
            </tr>
            <tr className="bg-gray-50 border-b border-gray-100">
              <td className="px-4 py-3 font-semibold" style={{ color: "#8b5cf6" }}>
                АГР
              </td>
              <td className="px-4 py-3 text-center">40 р/дн.</td>
              <td className="px-4 py-3 text-gray-600">После утверждения АК</td>
              <td className="px-4 py-3 text-gray-600">Свидетельство АГР</td>
            </tr>
            <tr className="bg-white border-b border-gray-100">
              <td className="px-4 py-3 font-semibold" style={{ color: "#0ea5e9" }}>
                ПД
              </td>
              <td className="px-4 py-3 text-center">45 р/дн.</td>
              <td className="px-4 py-3 text-gray-600">Параллельно с АГР</td>
              <td className="px-4 py-3 text-gray-600">Заключение экспертизы</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-4 py-3 font-semibold" style={{ color: "#10b981" }}>
                РД
              </td>
              <td className="px-4 py-3 text-center">60 р/дн.</td>
              <td className="px-4 py-3 text-gray-600">
                После принципиальных решений ПД
              </td>
              <td className="px-4 py-3 text-gray-600">Полный комплект РД</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-indigo-600 text-white">
              <td colSpan={2} className="px-4 py-3 font-bold">
                Общая продолжительность
              </td>
              <td colSpan={2} className="px-4 py-3 font-bold">
                120–130 рабочих дней (~5,5–6 месяцев)
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Section 6 — Special conditions */}
      <SectionTitle number="6" title="Особые условия" />
      <div className="mb-6 grid grid-cols-2 gap-3">
        {[
          "Стоимость определена на основании ОКСПРОМТ (линейная регрессия по площади здания)",
          "Строительный объём принят расчётным (8 925 м³) и подлежит уточнению",
          "Авторский надзор не включён в стоимость и оплачивается по отдельному договору",
          "НДС начисляется по ставке 22% на общую стоимость работ",
        ].map((cond, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200"
          >
            <span className="text-amber-600 font-bold text-lg leading-none mt-0.5">
              !
            </span>
            <span className="text-sm text-gray-700">{cond}</span>
          </div>
        ))}
      </div>

      {/* Reference list */}
      <SectionTitle number="7" title="Референс-лист" />
      <div className="mb-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <div className="text-gray-400 text-sm">
          Раздел будет дополнен реализованными объектами компании
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs"
            >
              Объект {i}
            </div>
          ))}
        </div>
      </div>

      {/* Signature */}
      <div className="border-t border-gray-200 pt-6 flex items-end justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-3">С уважением,</p>
          <p className="text-sm text-gray-700">Директор</p>
          <p className="text-sm font-semibold text-gray-900">
            ООО «КАПСТРОЙ-ИНЖИНИРИНГ»
          </p>
          <p className="text-sm text-gray-700 mt-2">Шумов Иван Викторович</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right text-xs text-gray-400">
            <div>________________</div>
            <div className="mt-1">(подпись)</div>
          </div>
          <img
            src={STAMP_URL}
            alt="Печать"
            className="h-28 w-28 object-contain opacity-90"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <span>ООО «КАПСТРОЙ-ИНЖИНИРИНГ» · ИНН 7814795454</span>
        <span>КП-03/ЭПС-2026 · 26.02.2026</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROADMAP
───────────────────────────────────────────── */
function RoadmapContent() {
  const weekLabels = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);

  return (
    <div className="p-10 text-gray-800">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-indigo-600">
        <div className="flex items-center gap-4">
          <img src={LOGO_URL} alt="Логотип" className="h-16 object-contain" />
          <div>
            <div className="font-bold text-lg text-gray-900 leading-tight">
              ООО «КАПСТРОЙ-ИНЖИНИРИНГ»
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              Дорожная карта проекта
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-indigo-700">
            Реконструкция офисного здания
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            г. Москва, пер. Калошин, д. 8
          </div>
          <div className="text-xs text-gray-400 mt-1">ООО «Траяна»</div>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block bg-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full tracking-widest uppercase">
          Дорожная карта проекта
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Предварительный план · Подлежит уточнению при заключении договора
        </p>
      </div>

      {/* Gantt Chart */}
      <SectionTitle number="1" title="График выполнения работ (недели)" />
      <div className="mb-8 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-xs" style={{ minWidth: 900 }}>
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-3 py-2 text-left w-48 font-semibold">Этап</th>
              {weekLabels.map((w) => (
                <th
                  key={w}
                  className="py-2 text-center font-medium"
                  style={{ width: 28, minWidth: 28 }}
                >
                  {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stages.map((s, si) => {
              const [startW, endW] = s.weeks;
              return (
                <tr
                  key={s.id}
                  className={si % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  style={{ borderBottom: "1px solid #f0f0f0" }}
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-1.5 h-6 rounded-full flex-shrink-0"
                        style={{ backgroundColor: s.color }}
                      />
                      <div>
                        <div className="font-bold" style={{ color: s.color }}>
                          {s.code}
                        </div>
                        <div className="text-gray-500 text-xs leading-tight">
                          {s.name.split(" ").slice(0, 2).join(" ")}
                        </div>
                      </div>
                    </div>
                  </td>
                  {weekLabels.map((w) => {
                    const isStart = w === startW;
                    const isEnd = w === endW;
                    const inRange = w >= startW && w <= endW;
                    const milestone = milestones.find((m) => m.week === w);
                    return (
                      <td
                        key={w}
                        className="p-0"
                        style={{ height: 36 }}
                      >
                        {inRange ? (
                          <div
                            className="h-6 mx-0.5 relative"
                            style={{
                              backgroundColor: s.color + "33",
                              borderLeft: isStart
                                ? `3px solid ${s.color}`
                                : "none",
                              borderRight: isEnd
                                ? `3px solid ${s.color}`
                                : "none",
                              borderTop: `2px solid ${s.color}50`,
                              borderBottom: `2px solid ${s.color}50`,
                              borderRadius: isStart && isEnd
                                ? 6
                                : isStart
                                ? "6px 0 0 6px"
                                : isEnd
                                ? "0 6px 6px 0"
                                : 0,
                            }}
                          >
                            {milestone && (
                              <div
                                className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full z-10"
                                style={{ backgroundColor: milestone.color }}
                                title={milestone.text}
                              />
                            )}
                          </div>
                        ) : (
                          <div className="h-6 mx-0.5 relative">
                            {milestone && si === 0 && (
                              <div
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6"
                                style={{ backgroundColor: milestone.color + "60" }}
                              />
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Milestones */}
      <SectionTitle number="2" title="Ключевые вехи проекта" />
      <div className="mb-8 grid grid-cols-3 gap-3">
        {milestones.map((m) => (
          <div
            key={m.week}
            className="flex items-center gap-3 p-3 rounded-xl border"
            style={{
              borderColor: m.color + "40",
              backgroundColor: m.color + "08",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ backgroundColor: m.color }}
            >
              {m.week}
            </div>
            <div>
              <div className="text-xs text-gray-500">Неделя {m.week}</div>
              <div className="text-sm font-semibold text-gray-800">{m.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stage detail cards */}
      <SectionTitle number="3" title="Детальный план по этапам" />
      <div className="space-y-5 mb-8">
        {stages.map((s) => (
          <div
            key={s.id}
            className="rounded-xl overflow-hidden border"
            style={{ borderColor: s.color + "40" }}
          >
            {/* Stage header */}
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ backgroundColor: s.color }}
            >
              <div className="flex items-center gap-3">
                <span className="text-white font-black text-lg">{s.code}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{s.name}</div>
                  <div className="text-white text-xs opacity-80">
                    Нед. {s.weeks[0]}–{s.weeks[1]} · {s.duration} рабочих дней
                  </div>
                </div>
              </div>
              <div className="text-right text-white">
                <div className="text-xs opacity-80">Стоимость с НДС</div>
                <div className="font-bold">{fmt(s.withVat)}</div>
              </div>
            </div>
            {/* Phases */}
            <div className="p-4 grid grid-cols-2 gap-4" style={{ backgroundColor: s.lightColor }}>
              {stageWorks[s.id]?.map((phase, pi) => (
                <div key={pi}>
                  <div
                    className="text-xs font-bold mb-2 uppercase tracking-wide"
                    style={{ color: s.color }}
                  >
                    {phase.phase}
                  </div>
                  <ul className="space-y-1">
                    {phase.items.map((item, ii) => (
                      <li
                        key={ii}
                        className="flex items-start gap-1.5 text-xs text-gray-700"
                      >
                        <span
                          className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                          style={{ backgroundColor: s.color }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Risks */}
      <SectionTitle number="4" title="Риски и меры минимизации" />
      <div className="mb-8 grid grid-cols-2 gap-4">
        {[
          {
            risk: "Изменения в АК после старта АГР",
            measures: [
              "Фиксировать утверждённый вариант протоколом",
              "Минимизировать правки на этапе АГР",
            ],
            level: "Средний",
            color: "#f59e0b",
          },
          {
            risk: "Задержки согласований в Москомархитектуре",
            measures: [
              "Подавать документы строго по регламенту",
              "Вести предварительные консультации",
              "Резерв 1–2 недели",
            ],
            level: "Высокий",
            color: "#ef4444",
          },
          {
            risk: "Замечания экспертизы по ПД",
            measures: [
              "Внутренний нормоконтроль перед подачей",
              "Оперативная подготовка ответов",
              "Ответственные по каждому разделу",
            ],
            level: "Средний",
            color: "#f59e0b",
          },
          {
            risk: "Неполнота исходных данных",
            measures: [
              "Детальный запрос исходных на старте",
              "Еженедельный контроль статуса",
              "Альтернативные решения при отсутствии данных",
            ],
            level: "Низкий",
            color: "#10b981",
          },
        ].map((r, i) => (
          <div
            key={i}
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: r.color + "40" }}
          >
            <div
              className="px-4 py-2 flex items-center justify-between"
              style={{ backgroundColor: r.color + "15" }}
            >
              <span className="text-sm font-semibold text-gray-800">
                {r.risk}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold text-white"
                style={{ backgroundColor: r.color }}
              >
                {r.level}
              </span>
            </div>
            <div className="p-3 space-y-1">
              {r.measures.map((m, mi) => (
                <div
                  key={mi}
                  className="flex items-start gap-2 text-xs text-gray-700"
                >
                  <span
                    className="mt-1 w-1 h-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: r.color }}
                  />
                  {m}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Optional stage */}
      <div className="mb-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-gray-700 text-white text-xs font-bold px-2 py-0.5 rounded">
            ЭТАП 5
          </span>
          <span className="font-semibold text-gray-700">
            Авторский надзор (опционально)
          </span>
          <span className="text-xs text-gray-500">· Срок: весь период строительства</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Выезды на объект по графику или вызову",
            "Контроль соответствия СМР проектной документации",
            "Решение технических вопросов в процессе строительства",
            "Ведение журнала авторского надзора",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <span className="mt-1 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Signature */}
      <div className="border-t border-gray-200 pt-6 flex items-end justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-3">С уважением,</p>
          <p className="text-sm text-gray-700">Директор</p>
          <p className="text-sm font-semibold text-gray-900">
            ООО «КАПСТРОЙ-ИНЖИНИРИНГ»
          </p>
          <p className="text-sm text-gray-700 mt-2">Шумов Иван Викторович</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right text-xs text-gray-400">
            <div>________________</div>
            <div className="mt-1">(подпись)</div>
          </div>
          <img
            src={STAMP_URL}
            alt="Печать"
            className="h-28 w-28 object-contain opacity-90"
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <span>ООО «КАПСТРОЙ-ИНЖИНИРИНГ» · ИНН 7814795454</span>
        <span>Дорожная карта предварительная · 26.02.2026</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
        {number}
      </div>
      <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">
        {title}
      </h3>
      <div className="flex-1 h-px bg-indigo-100" />
    </div>
  );
}

function PayRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-600">{label}</span>
      <span
        className={
          accent ? "font-bold text-indigo-700" : "font-mono text-gray-800"
        }
      >
        {value}
      </span>
    </div>
  );
}

function AdvCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg p-3 border border-indigo-200 text-center">
      <div
        className="text-xs font-semibold mb-1"
        style={{ color }}
      >
        {label}
      </div>
      <div className="font-bold text-gray-900 text-sm">{value}</div>
    </div>
  );
}
