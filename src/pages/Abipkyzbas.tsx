import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const SCOPE_SECTIONS = [
  {
    icon: "Ruler",
    title: "Инженерные изыскания",
    items: [
      "Инженерно-геодезические изыскания (топоплан М 1:500, инженерные сети, границы участка)",
      "Инженерно-геологические изыскания (бурение, физико-механические свойства грунтов)",
      "Инженерно-экологические изыскания (отбор проб грунта, анализ загрязнений)",
      "Инженерно-гидрометеорологические изыскания (влияние на р. Большая Камышная)",
    ],
  },
  {
    icon: "FileText",
    title: "Проектная документация (87-ПП, 509-ПП)",
    items: [
      "Раздел 1: Пояснительная записка",
      "Раздел 2: Схема планировочной организации земельного участка",
      "Раздел 3: Архитектурные и конструктивные решения (обследование + демонтаж)",
      "Раздел 4: Сведения о сетях инженерно-технического обеспечения",
      "Раздел 5: Проект организации работ по сносу (ПОР)",
      "Раздел 6: Перечень мероприятий по охране окружающей среды",
      "Раздел 7: Мероприятия по обеспечению пожарной безопасности",
      "Раздел 8: Сметная документация (ТЕР Кемерово, текущий уровень цен)",
    ],
  },
  {
    icon: "Leaf",
    title: "ОВОС и экологическое сопровождение",
    items: [
      "Оценка воздействия на окружающую среду (полный том)",
      "Презентация и материалы для общественных обсуждений",
      "Сопровождение на общественных обсуждениях",
    ],
  },
  {
    icon: "Shield",
    title: "Специальные разделы",
    items: [
      "Проект рекультивации земель",
      "Оценка воздействия на гидрофауну р. Большая Камышная (для Верхнеобского управления)",
      "Мероприятия по обращению с отходами (классификация, утилизация)",
    ],
  },
  {
    icon: "CheckSquare",
    title: "Согласования и экспертиза",
    items: [
      "Согласование с Верхнеобским территориальным управлением Росрыболовства (г. Новосибирск)",
      "Подготовка полного пакета для государственной экологической экспертизы",
      "Устранение замечаний госэкспертизы, допущенных по вине Исполнителя (1 цикл бесплатно)",
    ],
  },
  {
    icon: "Archive",
    title: "Итоговая документация",
    items: [
      "3 (три) экземпляра на бумажном носителе, сброшюрованных в тома",
      "Электронная версия: PDF, Word, dwg (AutoCAD) на оптическом диске или по эл. почте",
    ],
  },
];

const STAGES = [
  {
    n: 1,
    title: "Организация и передача исходных данных",
    days: "0–3 к.д.",
    items: ["Подписание договора", "Получение аванса (30%)", "Передача исходных данных от Заказчика"],
  },
  {
    n: 2,
    title: "Инженерные изыскания",
    days: "4–40 к.д.",
    items: ["Геодезия, геология, экология, гидромет", "Лабораторные анализы", "Сдача акта изысканий"],
  },
  {
    n: 3,
    title: "Проектная документация",
    days: "41–130 к.д.",
    items: ["Обследование объекта", "ПОС / ПОД (снос)", "Технология демонтажа", "Сети, охрана труда, ПБ", "Проект рекультивации", "Сметная документация"],
  },
  {
    n: 4,
    title: "ОВОС и общественные обсуждения",
    days: "41–140 к.д.",
    items: ["Разработка тома ОВОС", "Подготовка материалов для обсуждений", "Проведение общественных обсуждений", "Получение протокола"],
  },
  {
    n: 5,
    title: "Согласования",
    days: "141–170 к.д.",
    items: ["Согласование с Верхнеобским ТУ Росрыболовства (г. Новосибирск)", "Получение согласования"],
  },
  {
    n: 6,
    title: "Государственная экологическая экспертиза",
    days: "171–195 к.д.",
    items: ["Подача документов в ГЭЭ", "Рассмотрение экспертизой", "Устранение замечаний (при наличии)"],
  },
  {
    n: 7,
    title: "Передача документации",
    days: "196–200 к.д.",
    items: ["Печать 3 экземпляров", "Запись на диск", "Подписание итогового акта", "Финальный платёж (40%)"],
  },
];

const PAYMENTS = [
  { n: 1, stage: "Аванс (30%)", sum: "2 190 000", basis: "Подписание договора" },
  { n: 2, stage: "Промежуточный платёж (30%)", sum: "2 190 000", basis: "Акт сдачи инженерных изысканий" },
  { n: 3, stage: "Финальный платёж (40%)", sum: "2 920 000", basis: "Подписание итогового акта + передача документации" },
];

export default function Abipkyzbas() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Sticky nav */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-300 shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <div className="font-bold text-sm text-gray-900">ООО «АБИП»</div>
            <div className="text-[10px] text-gray-500">Коммерческое предложение · ГЛД Топкинская кв-л №43</div>
          </div>
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="border-gray-400 text-gray-700 gap-2 text-sm hover:bg-gray-50"
          >
            <Icon name="Printer" size={15} />
            Печать / PDF
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white border border-gray-300 shadow-sm">

          {/* HEADER */}
          <div className="border-b-4 border-gray-800 px-8 py-7">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1">Коммерческое предложение</div>
                <h1 className="text-xl font-black text-gray-900 leading-tight mb-1">
                  Разработка проектной документации<br />для ликвидации объекта
                </h1>
                <div className="text-xs text-gray-500 mb-3">
                  ГЛД Топкинская кв-л №43 (Кемеровская ГРЭС, Очистные сооружения)
                </div>
                <div className="text-xs text-gray-700">
                  Заказчик: <span className="font-bold">МКП «Тепло»</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">Дата составления</div>
                <div className="text-xs font-bold text-gray-800">13 мая 2026 г.</div>
                <div className="text-[9px] text-gray-400 mt-0.5">г. Апшеронск</div>
                <div className="mt-4 border-2 border-gray-800 px-5 py-3 text-center">
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider">Стоимость (без НДС)</div>
                  <div className="text-2xl font-black text-gray-900">7 300 000 ₽</div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-7">

            {/* SUMMARY */}
            <div className="grid grid-cols-4 gap-0 border border-gray-300 mb-8">
              {[
                { label: "Стоимость (без НДС)", value: "7 300 000 ₽" },
                { label: "Срок выполнения", value: "200 к.д." },
                { label: "Тип цены", value: "Фиксированная" },
                { label: "Объект", value: "г. Кемерово" },
              ].map(({ label, value }, i) => (
                <div key={label} className={`px-4 py-4 ${i < 3 ? "border-r border-gray-300" : ""}`}>
                  <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">{label}</div>
                  <div className="text-sm font-black text-gray-900">{value}</div>
                </div>
              ))}
            </div>

            {/* СТОРОНЫ */}
            <div className="mb-2">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 border-b border-gray-200 pb-2">
                Стороны договора
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 p-4">
                  <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">Заказчик</div>
                  <div className="font-bold text-sm text-gray-900">МКП «Тепло»</div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    Объект: ГЛД Топкинская кв-л №43<br />
                    Кемеровская ГРЭС, Очистные сооружения
                  </div>
                </div>
                <div className="border border-gray-300 bg-gray-50 p-4">
                  <div className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">Исполнитель</div>
                  <div className="font-bold text-sm text-gray-900">ООО «АБИП»</div>
                  <div className="text-[10px] text-gray-500 mt-1 space-y-0.5">
                    <div>ИНН 2365031611 · КПП 236501001</div>
                    <div>ОГРН 1232300036902</div>
                    <div>352685, Краснодарский Край, Апшеронский р-н, пт Нефтегорск, ул. Водосевича, д. 9</div>
                  </div>
                </div>
              </div>
            </div>

            {/* СТОИМОСТЬ */}
            <div className="mt-7 mb-2">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 border-b border-gray-200 pb-2">
                Стоимость работ
              </div>
              <table className="w-full border border-gray-300 text-xs">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="text-left px-4 py-2 font-bold text-[9px] uppercase tracking-wider">Показатель</th>
                    <th className="text-right px-4 py-2 font-bold text-[9px] uppercase tracking-wider w-48">Сумма (руб.)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-3 text-gray-700">Стоимость работ (без НДС)</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900 tabular-nums">7 300 000</td>
                  </tr>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 text-[10px]">НДС — исполнитель применяет УСН, НДС не предъявляется</td>
                    <td className="px-4 py-3 text-right text-gray-400 text-[10px]">—</td>
                  </tr>
                  <tr className="bg-gray-800">
                    <td className="px-4 py-3 font-black text-white">ИТОГО К ОПЛАТЕ</td>
                    <td className="px-4 py-3 text-right font-black text-white text-base tabular-nums">7 300 000</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-2 flex items-start gap-2 text-[10px] text-gray-500">
                <Icon name="Lock" size={11} className="shrink-0 mt-0.5 text-gray-400" />
                Цена фиксированная, включает все работы по ТЗ. Изменению не подлежит на весь срок договора.
              </div>
            </div>

            {/* ОПЛАТА */}
            <div className="mt-7 mb-2">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 border-b border-gray-200 pb-2">
                График оплаты (30 / 30 / 40)
              </div>
              <table className="w-full border border-gray-300 text-xs">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300">
                    <th className="text-left px-4 py-2 font-bold text-[9px] uppercase tracking-wider text-gray-500 w-8">№</th>
                    <th className="text-left px-4 py-2 font-bold text-[9px] uppercase tracking-wider text-gray-500">Этап</th>
                    <th className="text-left px-4 py-2 font-bold text-[9px] uppercase tracking-wider text-gray-500">Основание</th>
                    <th className="text-right px-4 py-2 font-bold text-[9px] uppercase tracking-wider text-gray-500 w-40">Сумма (руб.)</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENTS.map((p, i) => (
                    <tr key={p.n} className={`border-b border-gray-200 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                      <td className="px-4 py-2.5 text-gray-400">{p.n}</td>
                      <td className="px-4 py-2.5 font-semibold text-gray-800">{p.stage}</td>
                      <td className="px-4 py-2.5 text-gray-600 text-[10px]">{p.basis}</td>
                      <td className="px-4 py-2.5 text-right font-bold text-gray-900 tabular-nums">{p.sum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-1.5 text-[10px] text-gray-400 px-1">
                Все платежи — без НДС (УСН). Корректировка календаря платежей по согласованию сторон.
              </div>
            </div>

            {/* ЭТАПЫ РАБОТ */}
            <div className="mt-7 mb-2">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 border-b border-gray-200 pb-2">
                Этапы выполнения работ
              </div>
              <div className="space-y-3">
                {STAGES.map((stage) => (
                  <div key={stage.n} className="flex gap-4 border border-gray-200 p-4">
                    <div className="shrink-0 w-8 h-8 bg-gray-800 text-white flex items-center justify-center font-black text-sm">
                      {stage.n}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 mb-1.5">
                        <div className="font-bold text-sm text-gray-900">{stage.title}</div>
                        <div className="text-[10px] text-gray-400 shrink-0 border border-gray-200 px-2 py-0.5">{stage.days}</div>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5">
                        {stage.items.map((item, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[10px] text-gray-600">
                            <span className="text-gray-300 mt-0.5">—</span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* СОСТАВ РАБОТ */}
            <div className="mt-7 mb-2">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 border-b border-gray-200 pb-2">
                Полный состав работ
              </div>
              <div className="space-y-3">
                {SCOPE_SECTIONS.map((s) => (
                  <div key={s.title} className="border border-gray-200">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <Icon name={s.icon} size={12} className="text-gray-500 shrink-0" />
                      <span className="text-xs font-bold text-gray-800">{s.title}</span>
                    </div>
                    <ul className="px-4 py-3 space-y-1.5">
                      {s.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[10px] text-gray-700 leading-snug">
                          <span className="text-gray-400 shrink-0 mt-0.5">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* СРОКИ */}
            <div className="mt-7 mb-2">
              <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 border-b border-gray-200 pb-2">
                Сроки выполнения
              </div>
              <div className="border border-gray-300 p-5 flex items-center gap-5">
                <div className="shrink-0 w-16 h-16 border-2 border-gray-800 flex flex-col items-center justify-center">
                  <div className="text-2xl font-black text-gray-900 leading-none">200</div>
                  <div className="text-[9px] text-gray-500 uppercase">к.д.</div>
                </div>
                <div className="text-[10px] text-gray-700 leading-relaxed">
                  <div className="mb-1"><strong>Общая продолжительность:</strong> 200 календарных дней от даты старта</div>
                  <div className="mb-1"><strong>Старт:</strong> следующий рабочий день после подписания договора, получения аванса (30%) и передачи исходных данных.</div>
                  <div><strong>Финиш:</strong> подписание итогового акта и передача документации (3 экз. + электронный носитель).</div>
                </div>
              </div>
            </div>

            {/* ПОДПИСИ */}
            <div className="mt-10 pt-6 border-t-2 border-gray-800">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">С уважением,</p>
                  <p className="text-xs font-black text-gray-900">ООО «АБИП»</p>
                  <p className="text-[10px] text-gray-500">ИНН 2365031611 · КПП 236501001 · ОГРН 1232300036902</p>
                  <p className="text-[10px] text-gray-500">352685, Краснодарский Край, Апшеронский р-н, пт Нефтегорск, ул. Водосевича, д. 9</p>
                </div>
                <div className="w-24 h-24 border border-dashed border-gray-300 flex items-center justify-center text-[9px] text-gray-300 uppercase tracking-wider text-center">
                  М.П.
                </div>
              </div>
              <div className="grid grid-cols-2 gap-10 mt-8">
                {["Руководитель / _______________", "Заказчик / _______________"].map((label) => (
                  <div key={label}>
                    <div className="border-b border-gray-400 pb-5 mb-1" />
                    <div className="text-[9px] text-gray-400">{label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; }
          .print\\:hidden { display: none !important; }
          @page { margin: 10mm; size: A4 portrait; }
          html, body { height: auto !important; overflow: visible !important; }
          .shadow-sm, .shadow { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
