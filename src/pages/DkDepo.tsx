import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { exportElementToPdf } from "@/lib/exportPdf";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const DOC_DATE = "09 апреля 2026 г.";

const stages = [
  {
    num: 1,
    title: "Подготовительный и организационный",
    days: "1 р.д.",
    dayRange: "День 1",
    color: "bg-blue-100 border-blue-400",
    headColor: "bg-blue-600",
    executor: [
      "Подписание договора, получение аванса (если предусмотрено)",
      "Формирование рабочей группы",
      "Согласование графика выезда на объект",
    ],
    customer: [
      "Предоставление доступа в цеха",
      "Назначение ответственного представителя",
      "Передача документации (планы БТИ, данные о котельной, паспорта систем отопления)",
    ],
    result: "Подписанный договор, утверждённый календарный план",
  },
  {
    num: 2,
    title: "Натурное обследование объектов",
    days: "3 р.д.",
    dayRange: "Дни 2–4",
    color: "bg-amber-50 border-amber-400",
    headColor: "bg-amber-500",
    executor: [
      "Выезд двух инженеров-теплотехников на территорию депо Лобня",
      "Обмеры помещений: фактические геометрические размеры каждого цеха, высоты, площади ворот и окон",
      "Осмотр существующих систем отопления: тип приборов, схема разводки, состояние трубопроводов, параметры воздушно-отопительных агрегатов",
      "Фотографирование, составление акта обследования",
    ],
    customer: [
      "Обеспечение беспрепятственного доступа в цеха во время обследования",
      "Присутствие ответственного представителя Заказчика",
    ],
    result: "Журнал обмеров, акт обследования, фотофиксация",
  },
  {
    num: 3,
    title: "Расчёт теплопотерь и тепловой нагрузки",
    days: "5 р.д.",
    dayRange: "Дни 5–9",
    color: "bg-green-50 border-green-400",
    headColor: "bg-green-600",
    executor: [
      "Обработка результатов обмеров, уточнение площадей ограждающих конструкций",
      "Определение фактических сопротивлений теплопередаче на основе справочных материалов и результатов обследования",
      "Расчёт теплопотерь через стены, покрытие, окна, ворота, пол для каждого цеха (по СП 50.13330)",
      "Расчёт теплопотерь на инфильтрацию с учётом реальной кратности воздухообмена",
      "Определение суммарной часовой тепловой нагрузки по каждому цеху и по объекту в целом, среднемесячных и среднегодовых нагрузок",
    ],
    customer: ["Предоставление дополнительных материалов по запросу Исполнителя"],
    result: "Ведомость теплопотерь, сводная таблица нагрузок в кВт и Гкал/ч, акт расчёта",
  },
  {
    num: 4,
    title: "Анализ источников тепловой энергии",
    days: "5 р.д.",
    dayRange: "Дни 10–14",
    color: "bg-purple-50 border-purple-400",
    headColor: "bg-purple-600",
    executor: [
      "Сбор данных о существующей котельной (вид топлива, мощность, резерв, режим работы)",
      "Запрос/имитация технических условий на подключение к централизованным тепловым сетям",
      "Проработка альтернативных вариантов: модульная газовая котельная, крышная котельная, тепловые насосы, электрокотлы",
      "Технико-экономическое сравнение по критериям: CAPEX, OPEX, срок окупаемости, надёжность, экологичность",
      "Формирование рекомендаций по выбору оптимального источника",
    ],
    customer: ["Предоставление данных о существующей котельной, режимных картах"],
    result: "Раздел технического отчёта с анализом ≥4 вариантов, ТЭО, итоговая рекомендация",
  },
  {
    num: 5,
    title: "Составление технического отчёта",
    days: "3 р.д.",
    dayRange: "Дни 15–17",
    color: "bg-cyan-50 border-cyan-400",
    headColor: "bg-cyan-600",
    executor: [
      "Оформление отчёта по ГОСТ 2.105-95, ГОСТ Р 21.1101-2013: титульный лист, задание, исходные данные, методика, результаты, анализ источников, выводы, список литературы",
      "Подготовка графических материалов: схемы цехов, эпюры теплопотерь, графики изменения нагрузки по месяцам",
      "Формирование 3 бумажных экземпляров и одного электронного (PDF с защитой от несанкционированного изменения)",
    ],
    customer: [],
    result: "Проект технического отчёта",
  },
  {
    num: 6,
    title: "Согласование отчёта с Заказчиком",
    days: "2 р.д.",
    dayRange: "Дни 18–19",
    color: "bg-orange-50 border-orange-400",
    headColor: "bg-orange-500",
    executor: [
      "Передача проекта отчёта Заказчику на рассмотрение",
      "Получение замечаний (при наличии) — допускается до двух итераций",
      "Внесение правок, корректировка расчётов (если замечания обоснованы)",
      "Подписание акта выполненных работ и финальной версии отчёта",
    ],
    customer: [
      "Рассмотрение отчёта в течение 5 рабочих дней",
      "Подписание акта выполненных работ или направление мотивированного отказа",
    ],
    result: "Подписанный акт сдачи-приёмки, финальный отчёт, готовый к передаче",
  },
  {
    num: 7,
    title: "Передача документов и закрытие договора",
    days: "1 р.д.",
    dayRange: "День 20",
    color: "bg-gray-50 border-gray-400",
    headColor: "bg-gray-600",
    executor: [
      "Передача Заказчику 3 экземпляров отчёта на бумаге и одного в электронном виде",
      "Выставление счёта на оплату (или окончательного счёта при наличии аванса)",
      "Получение оплаты в течение 10 рабочих дней после подписания акта",
    ],
    customer: ["Оплата оставшейся части стоимости в установленные договором сроки"],
    result: "Закрытый договор, оплаченные услуги",
  },
];

const milestones = [
  { day: "0", title: "Подписание договора" },
  { day: "1", title: "Предоставление доступа на объект" },
  { day: "10–12", title: "Согласование промежуточных результатов (при необходимости)" },
  { day: "19–20", title: "Подписание акта выполненных работ" },
];

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

export default function DkDepo() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      await exportElementToPdf(reportRef.current, "Дорожная_карта_ТМХ_депо_Лобня.pdf");
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
              <div className="text-xs text-gray-500">Дорожная карта · ТЗ №011 · депо Лобня</div>
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
              <img src={LOGO_URL} alt="Логотип" className="h-20 object-contain" />
              <div>
                <div className="font-bold text-base text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                <div className="text-xs text-gray-600 mt-1">197341, г. Санкт-Петербург, Фермское шоссе, д. 12, лит. Ж, пом. 310-Н к3</div>
                <div className="text-xs text-gray-600">ИНН 7814795454 · КПП 781401001 · ОГРН 1217800122649</div>
              </div>
            </div>
            <div className="text-right text-xs text-gray-700">
              <div className="font-bold text-indigo-700 text-sm">ТЗ №011 · ред. ТЗ.011.002.ПТР/2026</div>
              <div>от {DOC_DATE}</div>
            </div>
          </div>

          {/* ── TITLE ── */}
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Дорожная карта</p>
            <h1 className="text-base font-bold text-gray-900 uppercase">
              Выполнения работ по договору № ________ от «___» _______ 2026 г.
            </h1>
            <p className="text-sm text-gray-600 mt-1">в рамках Технического задания №011</p>
            <p className="text-xs text-gray-500 mt-1">ООО «ТМХ-ПТР», обособленное подразделение депо Лобня</p>
          </div>

          {/* ── SUMMARY BAR ── */}
          <div className="flex items-center gap-6 bg-indigo-700 text-white rounded p-4 mb-6 justify-center">
            <div className="text-center">
              <div className="text-3xl font-black">20</div>
              <div className="text-xs">рабочих дней</div>
            </div>
            <div className="w-px h-10 bg-white/30" />
            <div className="text-center">
              <div className="text-3xl font-black">7</div>
              <div className="text-xs">этапов</div>
            </div>
          </div>

          {/* ── GANTT ── */}
          <SectionTitle num="1" title="Календарный план (диаграмма Ганта)" />
          <div className="mb-4 overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header */}
              <div className="flex text-[10px] text-gray-500 mb-1 ml-40">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i} className="flex-1 text-center border-l border-gray-200">{i + 1}</div>
                ))}
              </div>
              <div className="flex text-[10px] text-gray-400 mb-2 ml-40">
                {["Нед. 1", "", "", "", "Нед. 2", "", "", "", "Нед. 3", "", "", "", "Нед. 4", "", "", "", "", "", "", ""].map((w, i) => (
                  <div key={i} className="flex-1 text-center">{w}</div>
                ))}
              </div>
              {stages.map((s) => {
                const startDay = parseInt(s.dayRange.replace("День ", "").replace("Дни ", "").split("–")[0]) - 1;
                const endStr = s.dayRange.includes("–") ? s.dayRange.split("–")[1] : s.dayRange.replace("День ", "");
                const endDay = parseInt(endStr);
                const width = ((endDay - startDay) / 20) * 100;
                const left = (startDay / 20) * 100;
                const colors = ["bg-blue-500", "bg-amber-500", "bg-green-500", "bg-purple-500", "bg-cyan-500", "bg-orange-500", "bg-gray-500"];
                return (
                  <div key={s.num} className="flex items-center mb-1">
                    <div className="w-40 shrink-0 text-[10px] text-gray-700 pr-2 text-right leading-tight">
                      Эт. {s.num}: {s.title.length > 22 ? s.title.slice(0, 22) + "…" : s.title}
                    </div>
                    <div className="flex-1 h-5 bg-gray-100 rounded relative">
                      <div
                        className={`absolute top-0 h-full rounded ${colors[s.num - 1]} flex items-center justify-center`}
                        style={{ left: `${left}%`, width: `${width}%` }}
                      >
                        <span className="text-[9px] text-white font-bold px-1 truncate">{s.days}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── MILESTONES ── */}
          <SectionTitle num="2" title="Контрольные точки для Заказчика" />
          <div className="grid grid-cols-2 gap-3 mb-4">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-3 border border-indigo-200 rounded p-2 bg-indigo-50">
                <div className="bg-indigo-600 text-white text-xs font-bold rounded px-2 py-1 shrink-0 min-w-[52px] text-center">
                  День {m.day}
                </div>
                <p className="text-xs text-gray-800">{m.title}</p>
              </div>
            ))}
          </div>

          {/* ── STAGES DETAIL ── */}
          <SectionTitle num="3" title="Детальное описание этапов" />
          {stages.map((s) => (
            <div key={s.num} className={`mb-4 border rounded overflow-hidden ${s.color}`}>
              <div className={`${s.headColor} text-white px-3 py-1.5 flex items-center justify-between`}>
                <span className="text-xs font-bold">Этап {s.num}. {s.title}</span>
                <span className="text-[10px] opacity-80">{s.dayRange} · {s.days}</span>
              </div>
              <div className="p-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-1">Исполнитель</p>
                  <ul className="space-y-0.5">
                    {s.executor.map((t, i) => (
                      <li key={i} className="flex gap-1 text-xs text-gray-800">
                        <span className="shrink-0">•</span><span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  {s.customer.length > 0 && (
                    <>
                      <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-1">Заказчик</p>
                      <ul className="space-y-0.5">
                        {s.customer.map((t, i) => (
                          <li key={i} className="flex gap-1 text-xs text-gray-800">
                            <span className="shrink-0">•</span><span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wide mt-2 mb-0.5">Результат</p>
                  <p className="text-xs text-gray-900 font-medium">{s.result}</p>
                </div>
              </div>
            </div>
          ))}

          {/* ── CONTACTS ── */}
          <SectionTitle num="4" title="Ответственные лица" />
          <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <p className="font-bold text-gray-700 mb-1 text-[10px] uppercase tracking-wide">Со стороны Исполнителя</p>
              <p className="font-semibold text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</p>
              <p className="text-gray-600 mt-1">Шумов Иван Викторович, Генеральный директор</p>
            </div>
            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <p className="font-bold text-gray-700 mb-1 text-[10px] uppercase tracking-wide">Со стороны Заказчика</p>
              <p className="font-semibold text-gray-900">Иванов Александр Николаевич</p>
              <p className="text-gray-600">Ведущий технолог</p>
              <p className="text-gray-600 mt-1">Тел.: +7 495 744 70 93, доб. 6397</p>
              <p className="text-gray-600">E-mail: an.ivanov@tmholding.ru</p>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-300 rounded p-3 text-xs text-gray-600">
            <strong>Примечание:</strong> Дорожная карта может быть скорректирована по взаимному соглашению
            сторон в случае возникновения непредвиденных обстоятельств (отсутствие доступа,
            непредоставление документации и т.п.).
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
              <span>ТЗ №011 · {DOC_DATE}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}