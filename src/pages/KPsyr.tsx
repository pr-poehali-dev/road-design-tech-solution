import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL = "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL = "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const PRICE = {
  base: "480 000,00",
  vat: "105 600,00",
  total: "585 600,00",
  totalText: "Пятьсот восемьдесят пять тысяч шестьсот рублей 00 копеек",
};

const PAYMENTS = [
  { stage: "Аванс", pct: "30%", sum: "175 680,00", deadline: "В течение 3 дней после подписания договора", color: "bg-blue-50 border-blue-200" },
  { stage: "Окончательный расчёт", pct: "70%", sum: "409 920,00", deadline: "В течение 5 дней после подписания акта", color: "bg-emerald-50 border-emerald-200" },
];

const RESULTS = [
  { icon: "FileText", text: 'Том «Экономические изыскания» (актуализированный)', fmt: "PDF" },
  { icon: "Table", text: "Исходные редактируемые файлы (расчёты, таблицы, сметы)", fmt: "Excel / .docx" },
  { icon: "ClipboardList", text: "Справка об изменениях с пояснениями", fmt: "PDF" },
];

const GANTT_TASKS = [
  { id: 1, title: "Анализ исходного тома ЭИ",           start: 0, days: 2, result: "План актуализации",          color: "bg-blue-500" },
  { id: 2, title: "Сбор экономических показателей",      start: 2, days: 3, result: "База данных коэффициентов",  color: "bg-violet-500" },
  { id: 3, title: "Актуализация сметной части",          start: 5, days: 2, result: "Пересчитанные сметы",        color: "bg-amber-500" },
  { id: 4, title: "Обновление экон. эффективности",      start: 7, days: 1, result: "Обновлённые расчёты ЧДД",   color: "bg-orange-500" },
  { id: 5, title: "Оформление тома ЭИ",                  start: 8, days: 1, result: "Черновой том",               color: "bg-teal-500" },
  { id: 6, title: "Внутренняя проверка",                 start: 9, days: 1, result: "Итоговый том",               color: "bg-slate-500" },
  { id: 7, title: "Сдача заказчику",                     start: 9, days: 2, result: "Передача тома, акт",         color: "bg-emerald-600" },
];

const TOTAL_DAYS = 11;
const DAY_LABELS = ["28.04", "29.04", "30.04", "01.05", "02.05", "03.05", "04.05", "05.05", "06.05", "07.05", "08.05"];

function Tag({ children, color = "bg-blue-100 text-blue-800" }: { children: React.ReactNode; color?: string }) {
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${color}`}>{children}</span>;
}

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-7 first:mt-0">
      <div className="h-5 w-1 rounded-full bg-blue-700 shrink-0" />
      <h2 className="text-sm font-black uppercase tracking-widest text-gray-800 flex items-center gap-2">
        {icon && <Icon name={icon} size={14} className="text-blue-600" />}
        {children}
      </h2>
    </div>
  );
}

export default function KPsyr() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Лого" className="h-9 object-contain" />
            <div>
              <div className="font-bold text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
              <div className="text-xs text-gray-500">Коммерческое предложение · КП-ЭИ-2026-04</div>
            </div>
          </div>
          <Button onClick={() => window.print()} className="bg-blue-700 hover:bg-blue-800 text-white gap-2 text-sm">
            <Icon name="Printer" size={16} />
            Печать / PDF
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* ── HEADER ── */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white px-8 py-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-widest text-blue-300 mb-1">Коммерческое предложение</div>
                <h1 className="text-xl font-black leading-snug mb-3">
                  Актуализация раздела «Экономические изыскания»
                </h1>
                <div className="text-xs text-blue-200 mb-3 leading-snug max-w-xl">
                  Реконструкция автомобильной дороги Сургут – Салехард,<br />
                  участок Губкинский – Пурпе
                </div>
                <div className="flex flex-wrap gap-2">
                  <Tag color="bg-white/15 text-white border border-white/20">Экономические изыскания</Tag>
                  <Tag color="bg-white/15 text-white border border-white/20">11 рабочих дней</Tag>
                  <Tag color="bg-emerald-400/30 text-emerald-100 border border-emerald-300/30">НДС 22% включён</Tag>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[9px] text-blue-300 uppercase tracking-wider mb-0.5">Номер КП</div>
                <div className="font-black text-base text-white">КП-ЭИ-2026-04</div>
                <div className="text-[10px] text-blue-300 mt-2">г. Санкт-Петербург</div>
                <div className="text-[10px] text-blue-300">24 апреля 2026 г.</div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">

            {/* ── SUMMARY CARDS ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { icon: "Banknote",   value: "585 600 ₽",    label: "итого с НДС",       color: "bg-emerald-600" },
                { icon: "Calendar",   value: "11 дней",       label: "срок выполнения",   color: "bg-blue-700" },
                { icon: "Receipt",    value: "НДС 22%",       label: "включён в цену",    color: "bg-slate-700" },
                { icon: "Clock",      value: "до 08.05",      label: "срок сдачи",        color: "bg-violet-700" },
              ].map(({ icon, value, label, color }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center shadow-sm">
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center mb-2`}>
                    <Icon name={icon} size={18} className="text-white" />
                  </div>
                  <div className="text-sm font-black text-gray-900 leading-tight">{value}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* ── PARTIES ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Получатель (Заказчик)</div>
                <div className="font-black text-sm text-gray-900">ООО «НИИПРИИ «Севзапинжтехнология»</div>
                <div className="text-[10px] text-gray-500 mt-2 space-y-0.5">
                  <div>Генеральный директор: А.А. Кабанов</div>
                  <div>Основание: Запрос № исх-2026-1G48 от 24.04.2026 г.</div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Исполнитель</div>
                <img src={LOGO_URL} alt="Лого" className="h-7 object-contain mb-1.5" />
                <div className="font-black text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                <div className="text-[10px] text-gray-500 mt-1 space-y-0.5">
                  <div>ИНН 7814795454 · КПП 781401001</div>
                  <div>ОГРН 1217800122649</div>
                  <div>197341, г. Санкт-Петербург, Фермское шоссе, д. 12</div>
                </div>
              </div>
            </div>

            {/* ── SUBJECT ── */}
            <SectionTitle icon="Target">Предмет предложения</SectionTitle>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
              <p className="text-sm text-gray-800 leading-relaxed mb-3">
                Актуализация раздела <strong>«Экономические изыскания»</strong> проектной документации по объекту:
              </p>
              <div className="text-base font-black text-blue-800 mb-3">
                «Реконструкция автомобильной дороги Сургут – Салехард, участок Губкинский – Пурпе»
              </div>
              <div className="text-[10px] text-blue-700 bg-blue-100 rounded-lg px-3 py-1.5 inline-block">
                Срок сдачи: <strong>до 08.05.2026 г.</strong>
              </div>
            </div>

            {/* ── PRICE ── */}
            <SectionTitle icon="Banknote">Стоимость работ</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-3">
              <div className="grid grid-cols-[1fr_180px] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-5 py-2 border-b border-gray-200">
                <div>Показатель</div>
                <div className="text-right">Сумма (руб.)</div>
              </div>
              {[
                { label: "Стоимость без НДС", value: PRICE.base, bold: false },
                { label: "НДС (22%)",          value: PRICE.vat,  bold: false },
              ].map(({ label, value }) => (
                <div key={label} className="grid grid-cols-[1fr_180px] px-5 py-3 border-b border-gray-100 items-center bg-white">
                  <div className="text-xs text-gray-700">{label}</div>
                  <div className="text-sm font-semibold text-gray-900 text-right tabular-nums">{value}</div>
                </div>
              ))}
              <div className="grid grid-cols-[1fr_180px] px-5 py-4 bg-blue-700 items-center">
                <div className="text-sm font-black text-white">Итого с НДС 22%</div>
                <div className="text-xl font-black text-white text-right tabular-nums">{PRICE.total}</div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-start gap-2 text-xs text-blue-900 mb-6">
              <Icon name="Info" size={13} className="text-blue-600 shrink-0 mt-0.5" />
              <span>
                Прописью: <strong>{PRICE.totalText}</strong>
              </span>
            </div>

            {/* ── PAYMENTS ── */}
            <SectionTitle icon="CreditCard">Условия оплаты</SectionTitle>
            <div className="space-y-3 mb-6">
              {PAYMENTS.map((p, i) => (
                <div key={i} className={`border ${p.color} rounded-xl p-4 flex items-center gap-4`}>
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex flex-col items-center justify-center shrink-0 shadow-sm">
                    <div className="text-base font-black text-blue-700 leading-none">{p.pct}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-black text-gray-900 leading-snug">{p.stage}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
                      <Icon name="Clock" size={11} className="text-gray-400" />
                      {p.deadline}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-gray-900 tabular-nums">{p.sum}</div>
                    <div className="text-[10px] text-gray-500">руб. с НДС</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── RESULTS ── */}
            <SectionTitle icon="Package">Результаты работ</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {RESULTS.map((r, i) => (
                <div key={i} className="flex flex-col gap-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center shrink-0">
                    <Icon name={r.icon} size={16} className="text-white" />
                  </div>
                  <div className="text-xs text-gray-800 leading-snug flex-1">{r.text}</div>
                  <div className="text-[10px] font-black text-blue-600 bg-blue-50 rounded-md px-2 py-0.5 self-start">{r.fmt}</div>
                </div>
              ))}
            </div>

            {/* ── VALIDITY ── */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8 text-[10px] text-gray-700 leading-relaxed flex items-start gap-2">
              <Icon name="AlertCircle" size={13} className="text-amber-500 shrink-0 mt-0.5" />
              <span>
                Срок действия предложения: <strong>10 (десять) рабочих дней</strong> с момента получения.
                Цена <strong>585 600,00 руб. включает НДС 22%</strong>.
              </span>
            </div>

            {/* ── SIGNATURE ── */}
            <div className="border-t-2 border-gray-800 pt-6 flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">С уважением,</p>
                <p className="text-xs font-black text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</p>
                <p className="text-[10px] text-gray-500">ИНН 7814795454 · КПП 781401001 · ОГРН 1217800122649</p>
                <p className="text-[10px] text-gray-500">197341, г. Санкт-Петербург, Фермское шоссе, д. 12</p>
              </div>
              <div className="relative">
                <img src={STAMP_URL} alt="Печать" className="h-20 w-20 object-contain opacity-90" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 mt-6 pt-4 border-t border-dashed border-gray-300">
              {["Руководитель / _______________", "Заказчик / _______________"].map((label) => (
                <div key={label}>
                  <div className="border-b border-gray-400 pb-5 mb-1" />
                  <div className="text-[9px] text-gray-400">{label}</div>
                </div>
              ))}
            </div>

            {/* ══════════════════════════════════════════
                ── ДОРОЖНАЯ КАРТА ──
            ══════════════════════════════════════════ */}
            <div className="mt-14 pt-10 border-t-4 border-blue-700 print:mt-8 print:pt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-blue-500 mb-1">Дорожная карта проекта</div>
                  <h2 className="text-lg font-black text-gray-900">График выполнения работ</h2>
                  <div className="text-xs text-gray-500 mt-0.5">Актуализация ЭИ · 28.04.2026 — 08.05.2026 · 11 рабочих дней</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Заказчик", value: "НИИПРИИ Севзапинжтехнология" },
                    { label: "Сумма",    value: "585 600 руб. (с НДС 22%)" },
                    { label: "Срок",     value: "11 рабочих дней" },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-center">
                      <div className="text-[8px] text-gray-400 uppercase tracking-wider">{label}</div>
                      <div className="text-[10px] font-black text-gray-800 leading-snug mt-0.5">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gantt chart */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {/* Day labels header */}
                <div
                  className="grid bg-gray-800 text-white"
                  style={{ gridTemplateColumns: `200px repeat(${TOTAL_DAYS}, 1fr)` }}
                >
                  <div className="px-3 py-2 text-[9px] font-black uppercase tracking-wider text-gray-300">Этап</div>
                  {DAY_LABELS.map((d) => (
                    <div key={d} className="py-2 text-center text-[8px] font-bold text-gray-300 border-l border-gray-700">{d}</div>
                  ))}
                </div>

                {/* Weekend stripe: 01.05 = col index 3, 02.05 = 4 */}
                {GANTT_TASKS.map((task, i) => (
                  <div
                    key={task.id}
                    className={`grid items-center ${i % 2 === 0 ? "bg-white" : "bg-gray-50/60"} border-b border-gray-100 last:border-b-0`}
                    style={{ gridTemplateColumns: `200px repeat(${TOTAL_DAYS}, 1fr)` }}
                  >
                    {/* Task name */}
                    <div className="px-3 py-3 flex items-center gap-2 border-r border-gray-200">
                      <div className={`w-4 h-4 rounded-sm ${task.color} shrink-0 flex items-center justify-center`}>
                        <span className="text-white text-[7px] font-black">{task.id}</span>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-gray-800 leading-tight">{task.title}</div>
                        <div className="text-[8px] text-gray-400 leading-tight">{task.result}</div>
                      </div>
                    </div>

                    {/* Day cells */}
                    {Array.from({ length: TOTAL_DAYS }).map((_, di) => {
                      const inRange = di >= task.start && di < task.start + task.days;
                      const isFirst = di === task.start;
                      const isLast = di === task.start + task.days - 1;
                      const isWeekend = di === 3 || di === 4; // 01.05 и 02.05
                      return (
                        <div
                          key={di}
                          className={`h-full border-l border-gray-100 py-3 relative ${isWeekend ? "bg-red-50/50" : ""}`}
                        >
                          {inRange && (
                            <div
                              className={`mx-0.5 h-5 ${task.color} opacity-90 ${isFirst ? "rounded-l-md" : ""} ${isLast ? "rounded-r-md" : ""}`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Legend row */}
                <div className="bg-gray-50 px-4 py-2.5 flex items-center gap-4 border-t border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-red-100 border border-red-200" />
                    <span className="text-[9px] text-gray-500">Праздничные дни (01–02.05)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon name="CheckCircle" size={10} className="text-emerald-600" />
                    <span className="text-[9px] text-gray-500">Срок сдачи: 08.05.2026</span>
                  </div>
                </div>
              </div>

              {/* Milestone payments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
                    <Icon name="Banknote" size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] text-blue-400 uppercase tracking-wider font-black">Платёж 1 — Аванс 30%</div>
                    <div className="text-sm font-black text-gray-900">175 680,00 руб.</div>
                    <div className="text-[10px] text-gray-500">в течение 3 дней после договора</div>
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                    <Icon name="CircleCheck" size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] text-emerald-500 uppercase tracking-wider font-black">Платёж 2 — Финал 70%</div>
                    <div className="text-sm font-black text-gray-900">409 920,00 руб.</div>
                    <div className="text-[10px] text-gray-500">в течение 5 дней после акта (≈ 08.05)</div>
                  </div>
                </div>
              </div>

              {/* Validity / footer */}
              <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[10px] text-gray-500 leading-relaxed">
                Настоящая дорожная карта является приложением к КП-ЭИ-2026-04 от 24.04.2026 г.
                Сроки рассчитаны с учётом праздничных дней 01–02 мая 2026 г.
                Итоговая стоимость <strong>585 600,00 руб. включает НДС 22%</strong>.
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>
    </div>
  );
}
