import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { exportElementToPdf } from "@/lib/exportPdf";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const KP_NUM = "КП-014-2026";
const KP_DATE = "05 мая 2026 г.";
const TOTAL = 480_000;
const VAT_RATE = 22;
const VAT = Math.round(TOTAL - TOTAL / (1 + VAT_RATE / 100));
const ADV_PCT = 70;
const ADV = Math.round((TOTAL * ADV_PCT) / 100);
const REST = TOTAL - ADV;

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <div className="mt-8 mb-3">
      <span className="font-bold text-sm text-gray-800 uppercase tracking-wide">
        {num}. {title}
      </span>
      <div className="h-[2px] bg-gray-800 mt-1" />
    </div>
  );
}

const RD_SECTIONS = [
  { n: 1, title: "Пояснительная записка" },
  { n: 2, title: "Схема электроснабжения принципиальная (распределение по группам)" },
  { n: 3, title: "План силовых сетей (питание приточных/вытяжных установок, ККБ, кондиционеров, серверной 15 кВА, медоборудования)" },
  { n: 4, title: "План освещения (рабочее, аварийное, эвакуационное)" },
  { n: 5, title: "План заземления и уравнивания потенциалов (на базе существующей TN-C)" },
  { n: 6, title: "Спецификация оборудования и материалов" },
  { n: 7, title: "Ведомость нагрузок (свод по всем системам из файла Нагрузки.xlsx)" },
  { n: 8, title: "Ведомость объёмов работ" },
];

const ROADMAP = [
  { days: "1–3",   stage: "Анализ исходных данных",               result: "План работ утверждён" },
  { days: "4–8",   stage: "Расчёт электрических нагрузок (свод по приточным П1–П2.9, вытяжным В1–В2.11, ККБ, кондиционерам К1–К6, серверной)", result: "Таблица нагрузок, схема принципиальная" },
  { days: "9–14",  stage: "Разработка плана силовых сетей (трассы кабелей, щиты, питание оборудования) с учётом высоты 6 м", result: "План силовых сетей" },
  { days: "15–20", stage: "Разработка плана освещения (расчёт по СанПиН, рабочее + аварийное освещение)", result: "План освещения" },
  { days: "21–23", stage: "Разработка схемы заземления и уравнивания потенциалов (на базе существующей TN-C)", result: "Схема заземления" },
  { days: "24–26", stage: "Составление спецификации оборудования и ведомости объёмов работ", result: "Спецификация, ведомость" },
  { days: "27–28", stage: "Комплектация полного пакета РД, внутренняя проверка", result: "Полный комплект" },
  { days: "29",    stage: "Передача документации Заказчику", result: "Акт сдачи-приёмки" },
  { days: "30",    stage: "Корректировка по замечаниям (при наличии), подписание акта выполненных работ", result: "Акт выполненных работ" },
];

const INCLUDED = [
  "Проектирование ЭОМ в полном объёме",
  "Учёт всего оборудования из файла Нагрузки.xlsx",
  "Линии прокладки сетей (за исполнителем ЭОМ)",
  "Расчёт освещения по СанПиН",
  "Корректировка по замечаниям Заказчика",
  "Работа по предоставленным исходным данным",
];

const EXCLUDED = [
  "Молниезащита",
  "Слаботочные системы (видеонаблюдение, СКУД, СОУЭ, интернет, телефония, часофикация)",
  "Согласование в надзорных органах",
  "Проектирование ОВиК, ВК, теплоснабжения",
  "Авторский надзор (отдельным договором)",
  "Выезд на объект (не требуется)",
];

const NEEDED = [
  "Подписанный договор (ваша форма прилагается)",
  "Аванс 70% (336 000 ₽)",
  "Планы помещений (формат DWG или PDF)",
  "Таблица нагрузок (предоставлена)",
  "Разъяснения (предоставлены)",
  "При необходимости — фото текущего состояния ввода/щитов",
];

export default function KpSm() {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      await exportElementToPdf(
        reportRef.current,
        `КП_ЭОМ_${KP_NUM}_КапстройИнжиниринг.pdf`,
        1200,
      );
    } catch (e) {
      console.error(e);
    }
    setExporting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Логотип" className="h-9 object-contain" />
            <div>
              <div className="font-bold text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
              <div className="text-xs text-gray-500">КП на проектирование ЭОМ · {KP_NUM}</div>
            </div>
          </div>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="bg-blue-700 hover:bg-blue-800 text-white gap-2"
          >
            {exporting ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin" />
                Формируем PDF...
              </>
            ) : (
              <>
                <Icon name="Download" size={16} />
                Скачать PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Document */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div
          ref={reportRef}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
          style={{ fontFamily: "Arial, sans-serif", color: "#1a1a1a" }}
        >
          {/* Header */}
          <div className="bg-[#0d2158] px-10 py-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-white/60 text-xs uppercase tracking-widest mb-1">Коммерческое предложение</div>
                <div className="text-white text-2xl font-bold leading-tight mb-2">
                  ООО «КАПСТРОЙ-ИНЖИНИРИНГ»
                </div>
                <div className="text-blue-200 text-sm">
                  Проектирование ЭОМ — электроснабжение, электрооборудование, освещение
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <img src={LOGO_URL} alt="Логотип" className="h-14 object-contain mb-3 ml-auto" />
                <div className="text-white/70 text-xs">{KP_NUM}</div>
                <div className="text-white/70 text-xs">{KP_DATE}</div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-10 pb-10">
            {/* Объект */}
            <div className="mt-8 mb-6 bg-blue-50 border border-blue-200 rounded-lg p-5 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div><span className="text-gray-500">Объект:</span> <span className="font-semibold">Москва, ул. Жукова, 30</span></div>
              <div><span className="text-gray-500">Площадь:</span> <span className="font-semibold">1 200 м²</span></div>
              <div><span className="text-gray-500">Высота потолков:</span> <span className="font-semibold">6 м</span></div>
              <div><span className="text-gray-500">Стадия проектирования:</span> <span className="font-semibold">РД (рабочая документация)</span></div>
              <div><span className="text-gray-500">Категория надёжности:</span> <span className="font-semibold">2-я</span></div>
              <div><span className="text-gray-500">Система заземления:</span> <span className="font-semibold">существующая TN-C (без перехода на TN-S)</span></div>
              <div><span className="text-gray-500">Согласование:</span> <span className="font-semibold">только с Заказчиком</span></div>
              <div><span className="text-gray-500">Молниезащита / слаботочные:</span> <span className="font-semibold text-gray-400">не требуются</span></div>
            </div>

            {/* 1. Состав РД */}
            <SectionTitle num="1" title="Состав рабочей документации (РД) ЭОМ" />
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left w-10">№</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Раздел</th>
                </tr>
              </thead>
              <tbody>
                {RD_SECTIONS.map((s) => (
                  <tr key={s.n} className={s.n % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="border border-gray-300 px-3 py-2 text-center font-semibold text-gray-600">{s.n}</td>
                    <td className="border border-gray-300 px-3 py-2">{s.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 text-xs text-gray-500">
              Форматы выдачи: <span className="font-semibold">PDF, DWG (AutoCAD), XLS</span>
            </div>

            {/* 2. Стоимость */}
            <SectionTitle num="2" title="Стоимость работ" />
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Наименование</th>
                  <th className="border border-gray-300 px-3 py-2 text-right w-48">Сумма, ₽</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-semibold">Разработка РД ЭОМ (полный цикл)</td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-bold text-blue-800 text-base">{fmt(TOTAL)}</td>
                </tr>
                <tr className="bg-gray-50 text-gray-500">
                  <td className="border border-gray-300 px-3 py-2 pl-6">в т.ч. НДС {VAT_RATE}%</td>
                  <td className="border border-gray-300 px-3 py-2 text-right">{fmt(VAT)}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[
                "Фиксированная цена",
                "Корректировка по замечаниям Заказчика — включена",
                "Выезд на объект не требуется",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800">
                  <span className="text-green-600 mt-0.5">✅</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>

            {/* 3. Условия оплаты */}
            <SectionTitle num="3" title="Условия оплаты" />
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Платёж</th>
                  <th className="border border-gray-300 px-3 py-2 text-center">%</th>
                  <th className="border border-gray-300 px-3 py-2 text-right">Сумма, ₽</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Условие</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-3 py-2 font-semibold">Аванс</td>
                  <td className="border border-gray-300 px-3 py-2 text-center font-bold text-blue-700">70%</td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-semibold">{fmt(ADV)}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-600">после подписания договора</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 font-semibold">Окончательный платёж</td>
                  <td className="border border-gray-300 px-3 py-2 text-center font-bold text-blue-700">30%</td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-semibold">{fmt(REST)}</td>
                  <td className="border border-gray-300 px-3 py-2 text-gray-600">после подписания акта выполненных работ</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-2 text-sm text-gray-600 flex gap-6">
              <span>Форма оплаты: <strong>безналичная</strong></span>
              <span>Гарантия: <strong>1 год</strong> с момента подписания акта</span>
            </div>

            {/* 4. Дорожная карта */}
            <SectionTitle num="4" title="Дорожная карта — 30 календарных дней" />
            <div className="mb-3 text-sm text-gray-600">
              Срок выполнения: <strong>Май 2026 г.</strong> · Отсчёт: с момента заключения договора и получения аванса
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#0d2158] text-white">
                  <th className="border border-blue-900 px-3 py-2 text-center w-20">День</th>
                  <th className="border border-blue-900 px-3 py-2 text-left">Этап</th>
                  <th className="border border-blue-900 px-3 py-2 text-left w-64">Результат</th>
                </tr>
              </thead>
              <tbody>
                {ROADMAP.map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                    <td className="border border-gray-300 px-3 py-2 text-center font-bold text-blue-800 whitespace-nowrap">{r.days}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-700">{r.stage}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-600 text-xs">{r.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 5. Ответственность и допущения */}
            <SectionTitle num="5" title="Ответственность и допущения" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-semibold text-sm text-green-700 mb-2">Что входит</div>
                <div className="space-y-1">
                  {INCLUDED.map((t, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 mt-0.5 flex-shrink-0">✅</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-semibold text-sm text-red-600 mb-2">Что не входит</div>
                <div className="space-y-1">
                  {EXCLUDED.map((t, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 6. Что необходимо от Заказчика */}
            <SectionTitle num="6" title="Что необходимо от Заказчика для старта" />
            <div className="space-y-2">
              {NEEDED.map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center font-bold mt-0.5">{i + 1}</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>

            {/* Итог */}
            <div className="mt-8 bg-[#0d2158] rounded-xl px-8 py-6 text-white">
              <div className="text-lg font-bold mb-4">Итого по коммерческому предложению</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">{fmt(TOTAL)}</div>
                  <div className="text-blue-200 text-xs mt-1">Бюджет с НДС {VAT_RATE}%</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">30 дней</div>
                  <div className="text-blue-200 text-xs mt-1">Срок выполнения</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">70% / 30%</div>
                  <div className="text-blue-200 text-xs mt-1">Аванс / постоплата</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-blue-200 text-center">
                КП действительно 30 дней с даты выдачи · {KP_DATE}
              </div>
            </div>

            {/* Реквизиты */}
            <div className="mt-8 border border-gray-200 rounded-lg p-5 bg-gray-50 text-xs text-gray-600">
              <div className="font-bold text-gray-800 text-sm mb-3">Реквизиты исполнителя</div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                <div><span className="text-gray-400">Полное наименование:</span> ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                <div><span className="text-gray-400">ОГРН:</span> 1217800122649</div>
                <div><span className="text-gray-400">ИНН:</span> 7814795454</div>
                <div><span className="text-gray-400">КПП:</span> 781401001</div>
                <div className="col-span-2"><span className="text-gray-400">Юридический адрес:</span> 197341, г. Санкт-Петербург, Фермское шоссе, д. 12, лит. Ж, пом. 310-Н к3</div>
                <div><span className="text-gray-400">Банк:</span> ПАО «Сбербанк»</div>
                <div><span className="text-gray-400">БИК:</span> 044030653</div>
                <div><span className="text-gray-400">Расч. счёт:</span> 40702810655040010501</div>
                <div><span className="text-gray-400">Корр. счёт:</span> 30101810500000000653</div>
              </div>
            </div>

            {/* Подпись и печать */}
            <div className="mt-8 border-t-2 border-gray-800 pt-6 flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-2">С уважением,</p>
                <p className="text-sm text-gray-700">Генеральный директор</p>
                <p className="text-sm font-bold text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</p>
                <p className="text-sm text-gray-700 mt-1">Шумов Иван Викторович</p>
                <div className="mt-8 text-xs text-gray-400">
                  <div className="w-48 border-b border-gray-400" />
                  <div className="mt-1">(подпись)</div>
                </div>
              </div>
              <div className="text-center">
                <img src={STAMP_URL} alt="Печать" className="h-36 w-36 object-contain opacity-90" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-2">Заказчик подтверждает:</p>
                <p className="text-sm text-gray-700">Должность, ФИО</p>
                <div className="mt-8 text-xs text-gray-400">
                  <div className="w-48 border-b border-gray-400 ml-auto" />
                  <div className="mt-1 text-right">(подпись / дата)</div>
                </div>
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