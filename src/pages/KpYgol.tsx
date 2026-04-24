import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const WORKS = [
  { n: 1, title: "Разработка основных технических решений технологии производства и применения материала" },
  { n: 2, title: "Определение необходимости / выполнение инженерных изысканий на модельной площадке" },
  { n: 3, title: "Исследования отходов с целью производства материала (аккредитованная лаборатория)" },
  { n: 4, title: "Исследования материала для возможности благоустройства" },
  { n: 5, title: "Разработка проекта технической документации (ТР, ТУ, ВМТР)" },
  { n: 6, title: "Выполнение апробации технологии на модельной площадке" },
  { n: 7, title: "Оценка воздействия на окружающую среду (ОВОС)" },
  { n: 8, title: "Сметная документация (ГРАНД-Смета, Excel) + расчёт себестоимости" },
  { n: 9, title: "Сопровождение общественных обсуждений" },
  { n: 10, title: "Сопровождение получения заключения Росрыболовства" },
  { n: 11, title: "Сопровождение получения положительного заключения ГЭЭ" },
  { n: 12, title: "Корректировка документации по итогам апробации и экспертиз" },
  { n: 13, title: "НДС 22% (полностью включён)" },
];

const NOT_INCLUDED = [
  "Государственные пошлины за проведение ГЭЭ (оплачиваются Заказчиком отдельно)",
  "Государственные пошлины за регистрацию ТУ / сертификатов",
  "Строительно-монтажные работы на участках благоустройства (39,7971 га)",
  "Приобретение оборудования для производства материала",
];

const RESULTS_PAPER = [
  "Технический регламент (ТР)",
  "Технические условия (ТУ)",
  "ОВОС",
  "Материалы апробации",
  "Сметная документация",
];

const RESULTS_DIGITAL = [
  "PDF (текстовый слой, поиск, копирование, закладки)",
  "DWG (NanoCad)",
  "XLSX (сметы, спецификации, таблицы)",
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="h-5 w-1 rounded-full bg-blue-700 shrink-0" />
      <h2 className="text-sm font-black uppercase tracking-widest text-gray-800">{children}</h2>
    </div>
  );
}

function Tag({ children, color = "bg-blue-100 text-blue-800" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${color}`}>{children}</span>
  );
}

export default function KpYgol() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Лого" className="h-9 object-contain" />
            <div>
              <div className="font-bold text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
              <div className="text-xs text-gray-500">Коммерческое предложение · КП-2026-04-24 / ТЗ 7032</div>
            </div>
          </div>
          <Button
            onClick={() => window.print()}
            className="bg-blue-700 hover:bg-blue-800 text-white gap-2 text-sm"
          >
            <Icon name="Printer" size={16} />
            Печать / PDF
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* ── HEADER STRIPE ── */}
          <div className="bg-blue-700 px-8 py-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-widest text-blue-200 mb-1">Коммерческое предложение</div>
                <h1 className="text-xl font-black leading-snug mb-2">
                  Разработка проекта технической документации на «Технологию производства и применения материала для проведения работ по благоустройству территории нарушенных земель»
                </h1>
                <div className="text-blue-200 text-xs">в полном соответствии с ТЗ № 7032_УООС</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-blue-300 uppercase tracking-wider mb-0.5">Номер КП</div>
                <div className="font-black text-sm text-white">КП-2026-04-24</div>
                <div className="font-bold text-xs text-blue-200">ТЗ 7032</div>
                <div className="text-[10px] text-blue-300 mt-2">24 апреля 2026 г.</div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">

            {/* ── PARTIES ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Заказчик */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Заказчик</div>
                <div className="font-black text-sm text-gray-900 mb-0.5">АО «ЦОФ Кузнецкая»</div>
                <div className="font-semibold text-xs text-gray-700">«Распадская угольная компания»</div>
              </div>

              {/* Исполнитель */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Исполнитель</div>
                <div className="flex items-center gap-3 mb-2">
                  <img src={LOGO_URL} alt="Лого" className="h-8 object-contain" />
                </div>
                <div className="font-black text-sm text-gray-900 mb-1">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                <div className="text-[10px] text-gray-600 space-y-0.5">
                  <div>ИНН 7814795454 · КПП 781401001</div>
                  <div>ОГРН 1217800122649</div>
                  <div className="mt-1">197341, г. Санкт-Петербург,<br />Фермское шоссе, д. 12</div>
                </div>
              </div>
            </div>

            {/* ── SUBJECT ── */}
            <div className="mb-8">
              <SectionTitle>1. Предмет коммерческого предложения</SectionTitle>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <p className="text-sm text-gray-800 leading-relaxed">
                  Разработка проекта технической документации на{" "}
                  <strong>«Технологию производства и применения материала для проведения работ
                  по благоустройству территории нарушенных земель»</strong>{" "}
                  в полном соответствии с Техническим заданием № 7032_УООС, включая все этапы
                  изысканий, исследований, апробации, оценки воздействия на окружающую среду и
                  сопровождения экспертиз.
                </p>
              </div>
            </div>

            {/* ── PRICE ── */}
            <div className="mb-8">
              <SectionTitle>2. Стоимость работ</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {/* Total row */}
                <div className="bg-blue-700 text-white px-5 py-4 flex items-center justify-between">
                  <div className="font-bold text-sm">Общая стоимость комплекса работ (включая НДС 22%)</div>
                  <div className="font-black text-xl whitespace-nowrap ml-4">25 000 000 <span className="text-sm font-normal">руб.</span></div>
                </div>
                {/* Breakdown */}
                <div className="divide-y divide-gray-100">
                  {[
                    { label: "Стоимость без НДС", value: "≈ 20 491 803 руб.", muted: true },
                    { label: "НДС 22%", value: "≈ 4 508 197 руб.", muted: true },
                    { label: "Итого с НДС", value: "25 000 000 руб.", muted: false },
                  ].map(({ label, value, muted }) => (
                    <div key={label} className={`flex items-center justify-between px-5 py-3 ${muted ? "bg-white" : "bg-emerald-50"}`}>
                      <div className={`text-sm ${muted ? "text-gray-600" : "font-black text-gray-900"}`}>{label}</div>
                      <div className={`text-sm font-bold ${muted ? "text-gray-700" : "text-emerald-700 font-black"}`}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 leading-relaxed">
                <strong>Итоговая цена окончательная</strong> и включает все налоги, сборы, лабораторные исследования, апробацию, сопровождение экспертиз (кроме государственных пошлин ГЭЭ).
              </div>
            </div>

            {/* ── SCOPE ── */}
            <div className="mb-8">
              <SectionTitle>3. Что входит в стоимость 25 млн руб. (с НДС 22%)</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-[40px_1fr] text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <div>№</div>
                  <div>Вид работ</div>
                </div>
                {WORKS.map(({ n, title }, i) => (
                  <div
                    key={n}
                    className={`grid grid-cols-[40px_1fr] px-4 py-3 border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center text-white text-[10px] font-black">{n}</div>
                    </div>
                    <div className="text-sm text-gray-800 leading-snug py-0.5">{title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── NOT INCLUDED ── */}
            <div className="mb-8">
              <SectionTitle>4. Что НЕ входит в стоимость</SectionTitle>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
                {NOT_INCLUDED.map((item, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <Icon name="X" size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── DELIVERABLES ── */}
            <div className="mb-8">
              <SectionTitle>5. Результат, передаваемый Заказчику</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Бумажный вид */}
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gray-800 text-white px-4 py-3 flex items-center gap-2">
                    <Icon name="FileText" size={15} className="text-gray-300" />
                    <div className="text-xs font-bold">Бумажный вид</div>
                    <span className="ml-auto text-[10px] text-gray-400">4 экз.</span>
                  </div>
                  <ul className="p-3 space-y-2">
                    {RESULTS_PAPER.map((item, i) => (
                      <li key={i} className="flex gap-2 items-start text-xs text-gray-700">
                        <Icon name="CheckCircle" size={13} className="text-blue-600 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Электронный вид */}
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gray-800 text-white px-4 py-3 flex items-center gap-2">
                    <Icon name="HardDrive" size={15} className="text-gray-300" />
                    <div className="text-xs font-bold">Электронный вид</div>
                    <span className="ml-auto text-[10px] text-gray-400">1 экз., носитель</span>
                  </div>
                  <ul className="p-3 space-y-2">
                    {RESULTS_DIGITAL.map((item, i) => (
                      <li key={i} className="flex gap-2 items-start text-xs text-gray-700">
                        <Icon name="CheckCircle" size={13} className="text-teal-600 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Отдельные тома */}
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gray-800 text-white px-4 py-3 flex items-center gap-2">
                    <Icon name="BookOpen" size={15} className="text-gray-300" />
                    <div className="text-xs font-bold">Отдельные документы</div>
                  </div>
                  <ul className="p-3 space-y-2">
                    <li className="flex gap-2 items-start text-xs text-gray-700">
                      <Icon name="CheckCircle" size={13} className="text-violet-600 shrink-0 mt-0.5" />
                      Техническая документация на производство материала (отдельный том)
                    </li>
                    <li className="flex gap-2 items-start text-xs text-gray-700">
                      <Icon name="CheckCircle" size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                      Положительное заключение ГЭЭ (оригинал)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ── TIMELINE ── */}
            <div className="mb-8">
              <SectionTitle>6. Сроки выполнения работ</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-5 py-2 border-b border-gray-200">
                  <div>Показатель</div>
                  <div>Значение</div>
                </div>
                {[
                  { label: "Начало работ", value: "дата подписания договора", icon: "Play" },
                  { label: "Завершение всех работ", value: "15.11.2026", icon: "FlagTriangleRight" },
                  { label: "Получение положительного заключения ГЭЭ", value: "15.11.2026", icon: "ShieldCheck" },
                ].map(({ label, value, icon }, i) => (
                  <div key={i} className={`grid grid-cols-2 px-5 py-3.5 border-b border-gray-100 last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Icon name={icon} size={14} className="text-blue-600 shrink-0" />
                      {label}
                    </div>
                    <div className="text-sm font-bold text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SIGNATURE ── */}
            <div className="border-t-2 border-gray-800 pt-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">С уважением,</p>
                  <p className="text-xs text-gray-800 font-bold">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</p>
                  <p className="text-xs text-gray-600 mt-0.5">ИНН 7814795454 · КПП 781401001 · ОГРН 1217800122649</p>
                  <p className="text-xs text-gray-600">197341, г. Санкт-Петербург, Фермское шоссе, д. 12</p>
                  <div className="mt-4 text-xs text-gray-700">
                    <div className="border-b border-gray-400 w-40 mb-1" />
                    <div>Подпись / М.П.</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <img src={LOGO_URL} alt="Лого" className="h-12 object-contain opacity-60" />
                  <img src={STAMP_URL} alt="Печать" className="h-20 object-contain opacity-80" />
                  <div className="flex gap-2 mt-1">
                    <Tag color="bg-blue-100 text-blue-800">РЕФ-ИЗ-2026</Tag>
                    <Tag color="bg-gray-100 text-gray-700">24.04.2026</Tag>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[10px] text-gray-500 leading-relaxed">
                Настоящее коммерческое предложение является офертой и действительно в течение <strong>30 календарных дней</strong> с даты составления.
                Все параметры, указанные в данном документе, являются окончательными и не подлежат одностороннему изменению.
                Государственные пошлины за проведение ГЭЭ оплачиваются Заказчиком дополнительно.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
