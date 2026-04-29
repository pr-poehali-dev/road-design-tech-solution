import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const NAVY = "#1e3c72";
const RED = "#e31e24";
const GOLD = "#b8860b";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

function SectionTitle({ num, children }: { num?: string | number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-8">
      <div className="h-5 w-1 rounded-full shrink-0" style={{ background: RED }} />
      <h2 className="text-sm font-black uppercase tracking-widest text-gray-800">
        {num && <span className="mr-1" style={{ color: RED }}>{num}.</span>}
        {children}
      </h2>
    </div>
  );
}

const PRICING = [
  {
    period: "3 мес.",
    rows: [
      { label: "Помесячно", coef: "1,00", total: 1_463_700, perMonth: 487_900 },
      { label: "50% предоплата", coef: "0,95", total: 1_390_515, perMonth: 463_505 },
      { label: "70% предоплата", coef: "0,92", total: 1_346_604, perMonth: 448_868 },
      { label: "100% предоплата", coef: "0,85", total: 1_244_145, perMonth: 414_715, highlight: true },
    ],
  },
  {
    period: "6 мес.",
    rows: [
      { label: "Помесячно", coef: "1,00", total: 2_509_200, perMonth: 418_200 },
      { label: "50% предоплата", coef: "0,90", total: 2_258_280, perMonth: 376_380 },
      { label: "70% предоплата", coef: "0,85", total: 2_132_820, perMonth: 355_470 },
      { label: "100% предоплата", coef: "0,75", total: 1_881_900, perMonth: 313_650, highlight: true },
    ],
  },
  {
    period: "12 мес.",
    rows: [
      { label: "Помесячно", coef: "1,00", total: 4_182_000, perMonth: 348_500 },
      { label: "50% предоплата", coef: "0,80", total: 3_345_600, perMonth: 278_800 },
      { label: "70% предоплата", coef: "0,70", total: 2_927_400, perMonth: 243_950 },
      { label: "100% предоплата", coef: "0,60", total: 2_509_200, perMonth: 209_100, highlight: true },
    ],
  },
];

const COMPARISON = [
  { criterion: "Работа с ТЗ №04-ПК", once: "Выполняется 1 раз", sub: "Систематически, с корректировкой" },
  { criterion: "Регистрация ХОПО в Госреестре", once: "После завершения — поддержка заканчивается", sub: "Сопровождение до полной регистрации и после" },
  { criterion: "Изменения в законодательстве", once: "Не учитываются", sub: "Мониторинг и адаптация" },
  { criterion: "Проверки Ростехнадзора", once: "Не включены", sub: "Консультации и участие эксперта" },
  { criterion: "Идентификация признаков опасности", once: "1 итерация", sub: "Несколько итераций с уточнением данных" },
  { criterion: "Расчёт класса опасности", once: "Статичный", sub: "Динамический, с оптимизацией" },
  { criterion: "Оптимизация для снижения класса", once: "Рекомендации «на бумаге»", sub: "Пошаговое внедрение и сопровождение" },
];

const EXTRA_SERVICES = [
  { name: "Выезд на предприятие (1 сутки)", noVat: 10_000, vat: 2_200, withVat: 12_200 },
  { name: "Проживание (гостиница, 1 сутки)", noVat: "по факту (чеки)", vat: "—", withVat: "по факту" },
  { name: "Проезд (туда-обратно)", noVat: "по факту (билеты)", vat: "—", withVat: "по факту" },
];

const PAYMENT_CONDITIONS = [
  { label: "Помесячно", desc: "50% в начале месяца + 50% в конце месяца." },
  { label: "50% предоплата", desc: "50% при заключении договора, 50% по окончании срока." },
  { label: "70% предоплата", desc: "70% при заключении договора, 30% по окончании срока." },
  { label: "100% предоплата", desc: "100% при заключении договора." },
];

const ROADMAP = [
  {
    month: "МАЙ 2026",
    color: NAVY,
    steps: [
      { dates: "1–5 мая", title: "Стартовая консультация", desc: "Онлайн-встреча, сбор исходных данных, анализ ТЗ №04-ПК", who: "Главный эксперт" },
      { dates: "6–15 мая", title: "Первичная идентификация ХОПО", desc: "Анализ опасных веществ, выявление признаков опасности, предварительный класс", who: "Эксперт по ПБ" },
      { dates: "16–31 мая", title: "Расчёт класса опасности", desc: "Количественный расчёт, анализ сценариев для снижения класса", who: "Инженер-расчётчик" },
    ],
  },
  {
    month: "ИЮНЬ 2026",
    color: "#2563eb",
    steps: [
      { dates: "1–15 июня", title: "Оптимизация показателей", desc: "Разработка рекомендаций по снижению класса опасности ХОПО, согласование с технологическим отделом", who: "Эксперт + технолог" },
      { dates: "16–30 июня", title: "Подготовка документации для Госреестра", desc: "Комплект документов для регистрации ХОПО, итерационная проверка", who: "Эксперт по ПБ, юрист" },
    ],
  },
  {
    month: "ИЮЛЬ 2026",
    color: "#059669",
    steps: [
      { dates: "1–15 июля", title: "Подача в Ростехнадзор", desc: "Сопровождение подачи документов, оперативные ответы на замечания", who: "Главный эксперт" },
      { dates: "16–31 июля", title: "Мониторинг и корректировка", desc: "Отслеживание статуса, доработка документации по замечаниям РТН", who: "Команда Капстрой" },
    ],
  },
  {
    month: "АВГ–ОКТ 2026",
    color: "#7c3aed",
    steps: [
      { dates: "Ежемесячно", title: "Сопровождение до регистрации", desc: "Неограниченные консультации (тел., ВКС), помощь с документами, расчётами, изменениями законодательства", who: "Эксперт на связи" },
      { dates: "По завершении", title: "Акт сдачи-приёмки + гарантия 12 мес.", desc: "Бесплатная доработка документации по замечаниям РТН в течение гарантийного периода", who: "Капстрой Инжиниринг" },
    ],
  },
];

const APPENDICES = [
  "Паспорт контрагента (по форме Заказчика)",
  "Копия лицензии Ростехнадзора",
  "Выписка из СРО",
  "Референс-лист (ЧКПЗ, ММК, ЧТЗ)",
];

export default function KpAbonement() {
  const pageRef = useRef<HTMLDivElement>(null);

  const handlePdf = async () => {
    const el = pageRef.current;
    if (!el) return;

    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf()
      .set({
        margin: [8, 8, 8, 8],
        filename: "КП_Абонемент_ХОПО_Капстрой.pdf",
        image: { type: "jpeg", quality: 0.97 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      })
      .from(el)
      .save();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#dde8f5] py-6 px-4">
      {/* Кнопка печати — вне pdf-блока */}
      <div className="max-w-3xl mx-auto mb-4 flex justify-end gap-2 print:hidden">
        <Button onClick={handlePdf} style={{ background: RED, color: "white" }} className="gap-2 font-bold shadow-md">
          <Icon name="Download" size={16} />
          Скачать PDF
        </Button>
      </div>

      {/* PDF-блок */}
      <div
        ref={pageRef}
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl px-8 py-8 text-[11px] leading-relaxed text-gray-800"
        style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}
      >
        {/* Шапка */}
        <div className="flex items-start justify-between mb-6 border-b-2 pb-5" style={{ borderColor: RED }}>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src={LOGO_URL} alt="Капстрой" className="h-10 object-contain" />
              <div>
                <div className="text-base font-black" style={{ color: NAVY }}>КАПСТРОЙ ИНЖИНИРИНГ</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest">Промышленная безопасность</div>
              </div>
            </div>
            <div className="text-[9px] text-gray-500 space-y-0.5">
              <div>ООО «Промышленная безопасность — Урал»</div>
              <div>454080, г. Челябинск, ул. Энгельса, д. 32, оф. 405</div>
              <div>ИНН 7447301234 / КПП 744701001</div>
              <div>р/с 40702810400000012345 в АО «Челябинвестбанк» · БИК 047501678</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-gray-500 mb-1">Дата</div>
            <div className="font-bold text-gray-700">29.04.2026</div>
            <div className="mt-3 text-[9px] text-gray-500">По ТЗ №04-ПК от 13.04.2026</div>
            <div className="mt-2">
              <span className="text-[9px] font-bold px-2 py-1 rounded-full text-white" style={{ background: RED }}>
                ХОПО · Госреестр
              </span>
            </div>
          </div>
        </div>

        {/* Заголовок */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-black uppercase tracking-wide mb-1" style={{ color: NAVY }}>
            Коммерческое предложение
          </h1>
          <p className="text-[11px] text-gray-600 font-semibold">
            Абонентское консультационное сопровождение регистрации ХОПО в Госреестре
          </p>
          <p className="text-[10px] text-gray-500 mt-1">
            К закупочной процедуре ООО «Промышленная безопасность — Урал»
          </p>
        </div>

        {/* Раздел 1 — Предмет */}
        <SectionTitle num={1}>Предмет договора</SectionTitle>
        <div className="bg-[#f0f5ff] rounded-xl p-4 mb-4 border border-[#c7d9f5]">
          <p className="text-[11px] font-semibold text-gray-700 mb-2">
            Абонентское консультационное сопровождение регистрации химически опасного производственного объекта (ХОПО) в Государственном реестре в соответствии с Техническим заданием №04-ПК от 13.04.2026.
          </p>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {[
              { icon: "Phone", label: "Консультации (тел., ВКС)", note: "Неограниченно · включено" },
              { icon: "FileText", label: "Помощь с документами и расчётами", note: "Удалённо · включено" },
              { icon: "Car", label: "Выезды на предприятие", note: "Оплачиваются отдельно (п. 2.3)" },
            ].map((f) => (
              <div key={f.label} className="bg-white rounded-lg p-3 border border-[#dde8f5] text-center">
                <Icon name={f.icon as "Phone"} size={18} className="mx-auto mb-1" style={{ color: NAVY }} />
                <div className="font-semibold text-[10px] text-gray-800 mb-0.5">{f.label}</div>
                <div className="text-[9px] text-gray-500">{f.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Почему абонемент */}
        <SectionTitle num="1.1">Почему абонемент, а не разовый контракт?</SectionTitle>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-[9.5px] border-collapse">
            <thead>
              <tr style={{ background: NAVY }}>
                <th className="px-2 py-2 text-left text-white font-bold border border-[#3a5a8f]">Критерий</th>
                <th className="px-2 py-2 text-center text-white font-bold border border-[#3a5a8f]">Разовый контракт (1 мес.)</th>
                <th className="px-2 py-2 text-center text-white font-bold border border-[#3a5a8f]" style={{ background: RED }}>Абонемент (3–12 мес.)</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-2 py-2 font-semibold text-gray-800 border border-slate-200">{row.criterion}</td>
                  <td className="px-2 py-2 text-gray-500 border border-slate-200 text-center">{row.once}</td>
                  <td className="px-2 py-2 font-semibold border border-slate-200 text-center" style={{ color: RED }}>{row.sub}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#fff8f0] border border-[#f5d28a] rounded-xl p-3 mb-4">
          <p className="text-[10px] font-bold text-gray-700 mb-1">📌 Прямая цитата из ТЗ №04-ПК, которую закрывает абонемент:</p>
          <p className="text-[10px] text-gray-700 italic mb-2">
            «Оказание консультационной помощи в идентификации признаков опасности ХОПО и расчёте его класса» — при разовом контракте это одна консультация. При абонементе — систематическая помощь по мере поступления новых данных.
          </p>
          <p className="text-[10px] text-gray-700 italic">
            «Разработка рекомендаций по оптимизации... для обоснования возможности понижения класса опасности» — оптимизация это итеративный процесс: анализ сценариев → согласование → корректировка. Невозможно за 1 месяц.
          </p>
        </div>

        {/* Экономическая эффективность */}
        <SectionTitle num="1.2">Экономическая эффективность</SectionTitle>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Без абонемента (разовый)", total: "697 000 ₽", per: "697 000 ₽/мес.", risk: "Высокий риск ошибки", highlight: false },
            { label: "Абонемент 6 мес. · 100% предоплата", total: "1 881 900 ₽", per: "313 650 ₽/мес.", risk: "Экономия 55% в месяц", highlight: true },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-xl p-4 border"
              style={c.highlight ? { background: "#fff0f0", borderColor: RED } : { background: "#f8fafc", borderColor: "#d1dae6" }}
            >
              <div className="text-[9px] uppercase tracking-wide text-gray-500 mb-1">{c.label}</div>
              <div className="text-base font-black mb-1" style={{ color: c.highlight ? RED : NAVY }}>{c.total}</div>
              <div className="text-[10px] font-semibold text-gray-700">{c.per}</div>
              <div className="text-[9px] mt-1" style={{ color: c.highlight ? RED : "gray" }}>{c.risk}</div>
            </div>
          ))}
        </div>

        {/* Раздел 2 — Стоимость */}
        <SectionTitle num={2}>Стоимость и сроки</SectionTitle>
        <p className="text-[10px] text-gray-600 mb-3">
          База: разовый контракт (1 месяц плотной работы) = <strong>697 000 руб. с НДС 22%</strong>
        </p>

        {PRICING.map((block) => (
          <div key={block.period} className="mb-5">
            <div
              className="text-[10px] font-black uppercase tracking-widest text-white px-3 py-1.5 rounded-t-lg"
              style={{ background: NAVY }}
            >
              Срок: {block.period}
            </div>
            <table className="w-full text-[9.5px] border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-200 px-2 py-1.5 text-left font-bold text-gray-700">Вариант оплаты</th>
                  <th className="border border-slate-200 px-2 py-1.5 text-center font-bold text-gray-700">Коэф.</th>
                  <th className="border border-slate-200 px-2 py-1.5 text-right font-bold text-gray-700">Общая стоимость (с НДС)</th>
                  <th className="border border-slate-200 px-2 py-1.5 text-right font-bold text-gray-700">В пересчёте / мес.</th>
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr
                    key={i}
                    style={row.highlight ? { background: "#fff0f0" } : i % 2 === 0 ? { background: "white" } : { background: "#f8fafc" }}
                  >
                    <td className="border border-slate-200 px-2 py-1.5 font-semibold" style={row.highlight ? { color: RED } : {}}>
                      {row.highlight && "⭐ "}{row.label}
                    </td>
                    <td className="border border-slate-200 px-2 py-1.5 text-center text-gray-600">{row.coef}</td>
                    <td className="border border-slate-200 px-2 py-1.5 text-right font-bold" style={row.highlight ? { color: RED } : {}}>
                      {typeof row.total === "number" ? fmt(row.total) : row.total}
                    </td>
                    <td className="border border-slate-200 px-2 py-1.5 text-right text-gray-700">
                      {typeof row.perMonth === "number" ? fmt(row.perMonth) : row.perMonth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* Расшифровка НДС */}
        <div className="bg-[#f0f5ff] rounded-xl p-3 mb-4 border border-[#c7d9f5]">
          <p className="text-[10px] font-bold text-gray-700 mb-2">2.2. Расшифровка НДС (пример: 3 мес., помесячно)</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Стоимость без НДС", value: "1 199 754 ₽" },
              { label: "НДС 22%", value: "263 946 ₽" },
              { label: "Итого с НДС", value: "1 463 700 ₽" },
            ].map((r) => (
              <div key={r.label} className="text-center">
                <div className="text-[9px] text-gray-500">{r.label}</div>
                <div className="font-black text-[11px]" style={{ color: NAVY }}>{r.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Доп. услуги */}
        <p className="text-[10px] font-bold text-gray-700 mb-2">2.3. Дополнительные услуги (оплачиваются отдельно)</p>
        <table className="w-full text-[9.5px] border-collapse mb-2">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-200 px-2 py-1.5 text-left font-bold">Услуга</th>
              <th className="border border-slate-200 px-2 py-1.5 text-right font-bold">Без НДС</th>
              <th className="border border-slate-200 px-2 py-1.5 text-right font-bold">НДС 22%</th>
              <th className="border border-slate-200 px-2 py-1.5 text-right font-bold">С НДС</th>
            </tr>
          </thead>
          <tbody>
            {EXTRA_SERVICES.map((s, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="border border-slate-200 px-2 py-1.5 text-gray-800">{s.name}</td>
                <td className="border border-slate-200 px-2 py-1.5 text-right">{typeof s.noVat === "number" ? fmt(s.noVat) : s.noVat}</td>
                <td className="border border-slate-200 px-2 py-1.5 text-right">{typeof s.vat === "number" ? fmt(s.vat) : s.vat}</td>
                <td className="border border-slate-200 px-2 py-1.5 text-right font-semibold">{typeof s.withVat === "number" ? fmt(s.withVat) : s.withVat}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[9px] text-gray-500 mb-4">Выезды согласовываются минимум за 5 рабочих дней. Количество не ограничено.</p>

        {/* Раздел 3 — Готовность */}
        <SectionTitle num={3}>Готовность приступить по гарантийному письму</SectionTitle>
        <div className="flex items-center gap-3 bg-[#f0fff8] rounded-xl p-3 border border-[#a7f3d0] mb-4">
          <Icon name="CheckCircle" size={24} style={{ color: "#059669" }} className="shrink-0" />
          <p className="text-[10px] text-gray-700">
            <strong>Да.</strong> Готовы приступить к исполнению обязательств по гарантийному письму Заказчика до подписания договора.
            Посещение объекта выполнено — <strong>выезд 17.04.2026</strong>.
          </p>
        </div>

        {/* Раздел 4 — Условия оплаты */}
        <SectionTitle num={4}>Условия оплаты</SectionTitle>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {PAYMENT_CONDITIONS.map((p, i) => (
            <div key={i} className="bg-[#f8fafc] rounded-lg p-3 border border-slate-200">
              <div className="text-[10px] font-bold mb-1" style={{ color: NAVY }}>{p.label}</div>
              <div className="text-[9.5px] text-gray-600">{p.desc}</div>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-gray-500 mb-4">
          Дополнительные услуги (выезды): оплачиваются в течение 10 дней после подписания акта.
        </p>

        {/* Раздел 5 — Дорожная карта */}
        <SectionTitle num={5}>Дорожная карта (Roadmap)</SectionTitle>
        <p className="text-[10px] text-gray-600 mb-4">Пример для 6-месячного абонемента с апреля по октябрь 2026.</p>

        <div className="space-y-4 mb-6">
          {ROADMAP.map((block) => (
            <div key={block.month} className="rounded-xl overflow-hidden border border-slate-200">
              <div
                className="px-4 py-2 text-white text-[10px] font-black uppercase tracking-widest"
                style={{ background: block.color }}
              >
                {block.month}
              </div>
              <div className="divide-y divide-slate-100">
                {block.steps.map((step, si) => (
                  <div key={si} className="flex items-start gap-3 px-4 py-3 bg-white">
                    <div
                      className="text-[8px] font-bold text-white rounded px-1.5 py-0.5 shrink-0 mt-0.5"
                      style={{ background: block.color }}
                    >
                      {step.dates}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[10px] text-gray-800">{step.title}</div>
                      <div className="text-[9px] text-gray-500 mt-0.5">{step.desc}</div>
                    </div>
                    <div className="text-[8.5px] text-gray-400 shrink-0 text-right mt-0.5">{step.who}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Раздел 6 — Требования */}
        <SectionTitle num={6}>Требования к подрядчику</SectionTitle>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { icon: "BadgeCheck", title: "Посещение объекта", desc: "Выполнено · Выезд 17.04.2026" },
            { icon: "Award", title: "Лицензия Ростехнадзора", desc: "Действующая, копия в приложении" },
            { icon: "Users", title: "СРО", desc: "Выписка в приложении" },
            { icon: "Building2", title: "Референсы", desc: "ЧКПЗ, ММК, ЧТЗ" },
          ].map((r) => (
            <div key={r.title} className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 bg-[#f8fafc]">
              <Icon name={r.icon as "Award"} size={16} style={{ color: NAVY }} className="shrink-0 mt-0.5" />
              <div>
                <div className="text-[10px] font-bold text-gray-800">{r.title}</div>
                <div className="text-[9px] text-gray-500">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] font-bold text-gray-700 mb-2">Приложения к КП:</p>
        <ul className="space-y-1 mb-4">
          {APPENDICES.map((a, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[10px] text-gray-700">
              <span className="font-bold mt-0.5" style={{ color: RED }}>•</span>
              {a}
            </li>
          ))}
        </ul>

        {/* Раздел 7 — Гарантия */}
        <SectionTitle num={7}>Гарантийный период</SectionTitle>
        <div className="flex items-start gap-3 bg-[#fffbeb] rounded-xl p-3 border border-[#fde68a] mb-6">
          <Icon name="Shield" size={20} style={{ color: GOLD }} className="shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-gray-800 mb-1">12 месяцев с даты подписания акта сдачи-приёмки</p>
            <p className="text-[9.5px] text-gray-600">
              Бесплатная доработка документации по замечаниям Ростехнадзора (кроме случаев изменения законодательства или исходных данных Заказчика).
            </p>
          </div>
        </div>

        {/* Итоговая сводка */}
        <SectionTitle num={8}>Итоговая сводка</SectionTitle>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-[10px] border-collapse">
            <thead>
              <tr style={{ background: "#eef2ff" }}>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Показатель</th>
                <th className="border border-slate-200 px-2 py-2 text-left font-bold text-gray-700">Значение</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Предмет", "Абонентское сопровождение регистрации ХОПО в Госреестре"],
                ["Основание", "ТЗ №04-ПК от 13.04.2026"],
                ["База (1 мес., разовый)", "697 000 руб. с НДС 22%"],
                ["Рекомендуемый вариант", "6 мес. · 100% предоплата · 1 881 900 руб."],
                ["Экономия (к помесячной)", "627 300 руб."],
                ["Гарантия", "12 месяцев"],
                ["Готовность по гар. письму", "Да"],
                ["Выезд на предприятие", "Выполнен 17.04.2026"],
              ].map(([k, v], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="border border-slate-200 px-2 py-2 font-semibold text-gray-800 whitespace-nowrap">{k}</td>
                  <td className="border border-slate-200 px-2 py-2 text-gray-700">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Подписи */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-4">Исполнитель</p>
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0 w-24 h-24">
                  <svg viewBox="0 0 100 100" width="96" height="96" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="46" fill="none" stroke={NAVY} strokeWidth="2.5" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke={NAVY} strokeWidth="1" />
                    <path id="topArc2" d="M 12,50 A 38,38 0 0,1 88,50" fill="none" stroke="none" />
                    <path id="botArc2" d="M 88,50 A 38,38 0 0,1 12,50" fill="none" stroke="none" />
                    <text fontSize="8.5" fontWeight="700" fill={NAVY} letterSpacing="1.5">
                      <textPath href="#topArc2" startOffset="50%" textAnchor="middle">КАПСТРОЙ ИНЖИНИРИНГ</textPath>
                    </text>
                    <text fontSize="7" fill={NAVY} letterSpacing="0.5">
                      <textPath href="#botArc2" startOffset="50%" textAnchor="middle">Санкт-Петербург</textPath>
                    </text>
                    <text x="50" y="46" textAnchor="middle" fontSize="9" fontWeight="900" fill={NAVY}>КАПСТРОЙ</text>
                    <text x="50" y="57" textAnchor="middle" fontSize="7" fontWeight="700" fill={GOLD}>ИНЖИНИРИНГ</text>
                    <text x="50" y="68" textAnchor="middle" fontSize="6" fill={NAVY}>М.П.</text>
                  </svg>
                </div>
                <div className="flex-1 pt-1 space-y-5">
                  <div>
                    <div className="border-b border-gray-400 mb-1" style={{ minWidth: 140 }} />
                    <p className="text-[8px] text-gray-500">Подпись</p>
                  </div>
                  <div>
                    <div className="border-b border-gray-400 mb-1" style={{ minWidth: 140 }} />
                    <p className="text-[8px] text-gray-500">ФИО / Должность</p>
                  </div>
                  <div>
                    <div className="border-b border-gray-400 mb-1" style={{ minWidth: 140 }} />
                    <p className="text-[8px] text-gray-500">Дата</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-4">Заказчик</p>
              <div className="space-y-5 pt-1">
                {["Подпись", "ФИО / Должность", "Дата"].map((l) => (
                  <div key={l}>
                    <div className="border-b border-gray-400 mb-1" style={{ minWidth: 160 }} />
                    <p className="text-[8px] text-gray-500">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-[9.5px] text-gray-500 leading-relaxed">
            КП действительно <strong>30 календарных дней</strong> с даты направления. После подписания договора предоставляем детальный WBS-план.
          </p>
          <p className="text-[9px] text-gray-400 mt-1">
            <strong>Организация:</strong> Капстрой Инжиниринг &nbsp;·&nbsp; Опыт в области промышленной безопасности, Ростехнадзор, ХОПО
          </p>
        </div>
      </div>
    </div>
  );
}
