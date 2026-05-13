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
    days: "4–30 к.д.",
    items: ["Геодезия, геология, экология, гидромет", "Лабораторные анализы", "Сдача акта изысканий"],
  },
  {
    n: 3,
    title: "Проектная документация",
    days: "31–95 к.д.",
    items: ["Обследование объекта", "ПОС / ПОД (снос)", "Технология демонтажа", "Сети, охрана труда, ПБ", "Проект рекультивации", "Сметная документация"],
  },
  {
    n: 4,
    title: "ОВОС и общественные обсуждения",
    days: "31–105 к.д.",
    items: ["Разработка тома ОВОС", "Подготовка материалов для обсуждений", "Проведение общественных обсуждений", "Получение протокола"],
  },
  {
    n: 5,
    title: "Согласования",
    days: "106–128 к.д.",
    items: ["Согласование с Верхнеобским ТУ Росрыболовства (г. Новосибирск)", "Получение согласования"],
  },
  {
    n: 6,
    title: "Государственная экологическая экспертиза",
    days: "129–145 к.д.",
    items: ["Подача документов в ГЭЭ", "Рассмотрение экспертизой", "Устранение замечаний (при наличии)"],
  },
  {
    n: 7,
    title: "Передача документации",
    days: "146–150 к.д.",
    items: ["Печать 3 экземпляров", "Запись на диск", "Подписание итогового акта", "Финальный платёж (40%)"],
  },
];

const PAYMENTS = [
  { n: 1, pct: "30%", stage: "Аванс", sum: "1 950 000", basis: "Подписание договора" },
  { n: 2, pct: "30%", stage: "Промежуточный платёж", sum: "1 950 000", basis: "Акт сдачи инженерных изысканий" },
  { n: 3, pct: "40%", stage: "Финальный платёж", sum: "2 600 000", basis: "Подписание итогового акта + передача документации" },
];

export default function CSTKkyz() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Sticky nav */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-emerald-500 rounded-full" />
            <div>
              <div className="font-bold text-sm text-slate-900">ООО «ЦТЭСК»</div>
              <div className="text-[10px] text-slate-400">Коммерческое предложение · ГЛД Топкинская кв-л №43</div>
            </div>
          </div>
          <Button
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-sm"
          >
            <Icon name="Printer" size={15} />
            Печать / PDF
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg overflow-hidden border border-slate-200">

          {/* ЛЕВАЯ ПОЛОСА + ШАПКА */}
          <div className="flex">
            <div className="w-2 bg-emerald-500 shrink-0" />
            <div className="flex-1 px-8 py-7 border-b border-slate-200">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="inline-block text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-600 border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded mb-2">
                    Коммерческое предложение
                  </div>
                  <h1 className="text-xl font-black text-slate-900 leading-tight mb-2">
                    Разработка проектной документации<br />
                    <span className="text-emerald-600">для ликвидации объекта</span>
                  </h1>
                  <div className="text-xs text-slate-500 mb-1">
                    ГЛД Топкинская кв-л №43 · Кемеровская ГРЭС, Очистные сооружения
                  </div>
                  <div className="text-xs text-slate-600">
                    Заказчик: <span className="font-semibold text-slate-800">МКП «Тепло»</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider">Дата</div>
                  <div className="text-xs font-semibold text-slate-700 mb-0.5">13 мая 2026 г.</div>
                  <div className="text-[9px] text-slate-400">г. Санкт-Петербург</div>
                  <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg px-5 py-3 text-center">
                    <div className="text-[9px] text-emerald-600 uppercase tracking-wider">Стоимость (с НДС 20%)</div>
                    <div className="text-2xl font-black text-slate-900">6 500 000 ₽</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">без НДС: 5 416 667 ₽</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-7">

            {/* SUMMARY */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {[
                { icon: "Banknote", label: "Стоимость (с НДС)", value: "6 500 000 ₽", accent: "text-emerald-600" },
                { icon: "Calendar", label: "Срок выполнения", value: "150 к.д.", accent: "text-slate-700" },
                { icon: "Lock",     label: "Тип цены", value: "Фиксированная", accent: "text-slate-700" },
                { icon: "MapPin",   label: "Объект", value: "г. Кемерово", accent: "text-slate-700" },
              ].map(({ icon, label, value, accent }) => (
                <div key={label} className="bg-slate-50 rounded-lg border border-slate-200 px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon name={icon} size={11} className="text-slate-400" />
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider">{label}</div>
                  </div>
                  <div className={`text-sm font-black ${accent}`}>{value}</div>
                </div>
              ))}
            </div>

            {/* СТОРОНЫ */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-emerald-400" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Стороны договора</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1.5">Заказчик</div>
                  <div className="font-bold text-sm text-slate-900">МКП «Тепло»</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Объект: ГЛД Топкинская кв-л №43<br />
                    Кемеровская ГРЭС, Очистные сооружения
                  </div>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-[9px] text-emerald-500 uppercase tracking-wider mb-1.5">Исполнитель</div>
                  <div className="font-bold text-sm text-slate-900">ООО «Центр Технической экспертизы и строительного контроля»</div>
                  <div className="text-[10px] text-slate-500 mt-1 space-y-0.5">
                    <div>ИНН 4703175805 · КПП 781401001</div>
                    <div>197341, г. Санкт-Петербург, Фермское шоссе, д. 12, литер Ж, пом. 307-Н</div>
                  </div>
                </div>
              </div>
            </div>

            {/* СТОИМОСТЬ */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-emerald-400" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Стоимость работ</div>
              </div>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-[1fr_200px] bg-slate-700 text-[9px] font-bold text-white uppercase tracking-wider">
                  <div className="px-4 py-2">Показатель</div>
                  <div className="px-4 py-2 text-right">Сумма (руб.)</div>
                </div>
                {[
                  { label: "Стоимость без НДС", value: "5 416 667" },
                  { label: "НДС 20%", value: "1 083 333" },
                ].map(({ label, value }, i) => (
                  <div key={label} className={`grid grid-cols-[1fr_200px] border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                    <div className="px-4 py-3 text-xs text-slate-600">{label}</div>
                    <div className="px-4 py-3 text-sm font-semibold text-slate-800 text-right tabular-nums">{value}</div>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_200px] bg-emerald-600">
                  <div className="px-4 py-3 text-sm font-black text-white">ИТОГО К ОПЛАТЕ (с НДС)</div>
                  <div className="px-4 py-3 text-right text-lg font-black text-white tabular-nums">6 500 000</div>
                </div>
              </div>
              <div className="mt-2 flex items-start gap-1.5 text-[10px] text-slate-400">
                <Icon name="Lock" size={10} className="shrink-0 mt-0.5" />
                Цена фиксированная. Изменению не подлежит на весь срок действия договора.
              </div>
            </div>

            {/* ОПЛАТА */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-emerald-400" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">График оплаты (30 / 30 / 40)</div>
              </div>
              <div className="space-y-2">
                {PAYMENTS.map((p) => (
                  <div key={p.n} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center shrink-0">
                      <span className="text-sm font-black text-emerald-700">{p.pct}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800">{p.stage}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{p.basis}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-black text-slate-900 tabular-nums">{p.sum}</div>
                      <div className="text-[9px] text-slate-400">руб. (с НДС)</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ЭТАПЫ РАБОТ */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-emerald-400" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Этапы выполнения работ</div>
              </div>
              <div className="relative pl-6">
                {/* Вертикальная линия */}
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-emerald-100" />
                <div className="space-y-3">
                  {STAGES.map((stage) => (
                    <div key={stage.n} className="relative">
                      <div className="absolute -left-6 top-3 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center z-10">
                        <span className="text-[8px] font-black text-white">{stage.n}</span>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <div className="text-sm font-bold text-slate-800">{stage.title}</div>
                          <div className="text-[10px] text-emerald-600 font-semibold shrink-0">{stage.days}</div>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                          {stage.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-1 text-[10px] text-slate-500">
                              <div className="w-1 h-1 rounded-full bg-emerald-300 shrink-0" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* СОСТАВ РАБОТ */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-emerald-400" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Полный состав работ</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SCOPE_SECTIONS.map((s) => (
                  <div key={s.title} className="rounded-lg border border-slate-200 overflow-hidden bg-white">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                      <Icon name={s.icon} size={12} className="text-emerald-500 shrink-0" />
                      <span className="text-xs font-bold text-slate-700">{s.title}</span>
                    </div>
                    <ul className="px-4 py-3 space-y-1.5">
                      {s.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[10px] text-slate-600 leading-snug">
                          <div className="w-1 h-1 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* СРОКИ */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-0.5 bg-emerald-400" />
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Сроки выполнения</div>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 flex items-center gap-5">
                <div className="shrink-0 w-16 h-16 rounded-full bg-emerald-600 flex flex-col items-center justify-center">
                  <div className="text-2xl font-black text-white leading-none">150</div>
                  <div className="text-[9px] text-emerald-200 uppercase">к.д.</div>
                </div>
                <div className="text-[10px] text-slate-700 leading-relaxed">
                  <div className="mb-1"><strong>Общая продолжительность:</strong> 150 календарных дней от даты старта</div>
                  <div className="mb-1"><strong>Старт:</strong> следующий рабочий день после подписания договора, получения аванса (30%) и передачи исходных данных.</div>
                  <div><strong>Финиш:</strong> подписание итогового акта и передача документации (3 экз. + электронный носитель).</div>
                </div>
              </div>
            </div>

            {/* ПОДПИСИ */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">С уважением,</p>
                  <p className="text-xs font-black text-slate-900">ООО «Центр Технической экспертизы и строительного контроля»</p>
                  <p className="text-[10px] text-slate-400">ИНН 4703175805 · КПП 781401001</p>
                  <p className="text-[10px] text-slate-400">197341, г. Санкт-Петербург, Фермское шоссе, д. 12, литер Ж, пом. 307-Н</p>
                </div>
                <div className="w-20 h-20 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-[9px] text-slate-300 uppercase tracking-wider text-center">
                  М.П.
                </div>
              </div>
              <div className="grid grid-cols-2 gap-10 mt-8">
                {["Руководитель / _______________", "Заказчик / _______________"].map((label) => (
                  <div key={label}>
                    <div className="border-b border-slate-300 pb-5 mb-1" />
                    <div className="text-[9px] text-slate-400">{label}</div>
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
