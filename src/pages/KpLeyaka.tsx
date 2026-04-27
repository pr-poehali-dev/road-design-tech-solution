import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";

const WORKS = [
  { n: 1, title: "Сбор и анализ исходных данных", days: 1, who: "Экономист" },
  { n: 2, title: "Расчёт интенсивности движения", days: 1, who: "Экономист" },
  { n: 3, title: "Сметно-финансовый расчёт", days: 2, who: "Сметчик" },
  { n: 4, title: "Оценка экономической эффективности (ЧДД, ИД, окупаемость)", days: 1, who: "Экономист" },
  { n: 5, title: "Оформление тома «Экономические изыскания»", days: 2, who: "Экономист + верстальщик" },
  { n: 6, title: "Внутренняя проверка (нормоконтроль)", days: 1, who: "ГИП" },
  { n: 7, title: "Сдача заказчику, подписание акта", days: 1, who: "Экономист" },
];

const ROADMAP = [
  { day: "День 1", stage: "Сбор и анализ исходных данных", hd: 1, content: "Изучение ТЭПов, ПД, схем ОДД, выявление ключевых параметров", start: 0, span: 1 },
  { day: "День 2", stage: "Расчёт интенсивности движения", hd: 1, content: "Моделирование трафика на 4 перекрёстках, 2 карманах, 2 переходах", start: 1, span: 1 },
  { day: "День 2–3", stage: "Сметно-финансовый расчёт", hd: 2, content: "Расчёт стоимости строительства 370 м дороги, 4 полос, карманов", start: 1, span: 2 },
  { day: "День 3", stage: "Оценка экономической эффективности", hd: 1, content: "Расчёт ЧДД, ИД, срока окупаемости, точки безубыточности", start: 2, span: 1 },
  { day: "День 4–5", stage: "Оформление тома «Экономические изыскания»", hd: 2, content: "Верстка, таблицы, графики, соответствие структуре ПД", start: 3, span: 2 },
  { day: "День 6", stage: "Внутренняя проверка", hd: 1, content: "Нормоконтроль, проверка расчётов, устранение замечаний", start: 5, span: 1 },
  { day: "День 7", stage: "Сдача заказчику", hd: 1, content: "Передача тома, подписание акта сдачи-приёмки", start: 6, span: 1 },
];

const GANTT_COLORS = [
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500",
];

const TOTAL_DAYS = 7;

function SectionTitle({ num, children }: { num?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-8">
      <div className="h-5 w-1 rounded-full bg-blue-700 shrink-0" />
      <h2 className="text-sm font-black uppercase tracking-widest text-gray-800">
        {num && <span className="text-blue-700 mr-1">{num}.</span>}
        {children}
      </h2>
    </div>
  );
}

function GanttChart() {
  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1);
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px]">
        <div className="grid mb-2" style={{ gridTemplateColumns: "200px repeat(7, 1fr)" }}>
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Этап</div>
          {days.map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-500">Д{d}</div>
          ))}
        </div>
        <div className="space-y-1.5">
          {ROADMAP.map((row, i) => (
            <div key={i} className="grid items-center" style={{ gridTemplateColumns: "200px repeat(7, 1fr)" }}>
              <div className="text-[10px] text-gray-700 font-semibold pr-2 leading-tight truncate" title={row.stage}>
                {row.stage}
              </div>
              {Array.from({ length: TOTAL_DAYS }, (_, di) => {
                const active = di >= row.start && di < row.start + row.span;
                const isFirst = di === row.start;
                const isLast = di === row.start + row.span - 1;
                return (
                  <div key={di} className="h-5 px-0.5">
                    {active ? (
                      <div
                        className={`h-full ${GANTT_COLORS[i]} opacity-90 flex items-center justify-center
                          ${isFirst ? "rounded-l-full" : ""}
                          ${isLast ? "rounded-r-full" : ""}
                        `}
                      >
                        {isFirst && (
                          <span className="text-[8px] text-white font-bold px-1 truncate">{row.hd} чд</span>
                        )}
                      </div>
                    ) : (
                      <div className="h-full bg-gray-100 rounded-sm" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-3 flex-wrap">
          {ROADMAP.map((row, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-full ${GANTT_COLORS[i]}`} />
              <span className="text-[9px] text-gray-500">{row.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PaymentChart() {
  return (
    <div className="flex items-end gap-6 h-28 mt-2">
      <div className="flex flex-col items-center gap-1 flex-1">
        <div className="text-xs font-black text-blue-700">30%</div>
        <div className="w-full bg-blue-500 rounded-t-md" style={{ height: "44px" }} />
        <div className="text-[10px] text-gray-500 text-center leading-tight">Аванс</div>
        <div className="text-[11px] font-bold text-gray-700">105 408 ₽</div>
      </div>
      <div className="flex flex-col items-center gap-1 flex-1">
        <div className="text-xs font-black text-emerald-700">70%</div>
        <div className="w-full bg-emerald-500 rounded-t-md" style={{ height: "88px" }} />
        <div className="text-[10px] text-gray-500 text-center leading-tight">Окончат. расчёт</div>
        <div className="text-[11px] font-bold text-gray-700">245 952 ₽</div>
      </div>
    </div>
  );
}

export default function KpLeyaka() {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .shadow-lg, .shadow-xl { box-shadow: none !important; }
          @page { margin: 15mm; size: A4; }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">

        {/* Шапка с кнопкой печати */}
        <div className="sticky top-0 z-50 bg-white border-b shadow-sm no-print">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Лого" className="h-9 object-contain" />
              <div>
                <div className="font-bold text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                <div className="text-xs text-gray-500">КП · Экономические изыскания · 27.04.2026</div>
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

            {/* ── HEADER ── */}
            <div className="bg-blue-700 px-8 py-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-blue-200 mb-1">Коммерческое предложение</div>
                  <h1 className="text-xl font-black leading-snug mb-2">
                    Разработка / актуализация раздела «Экономические изыскания»
                  </h1>
                  <div className="text-blue-200 text-xs">
                    Автомобильная дорога общего пользования · 370 м · 4 полосы + 2 кармана · 4 перекрёстка · 2 пешеходных перехода
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-blue-300 uppercase tracking-wider mb-0.5">Дата</div>
                  <div className="font-black text-sm text-white">27 апреля 2026 г.</div>
                  <div className="text-[10px] text-blue-300 mt-2 uppercase tracking-wider">Срок выполнения</div>
                  <div className="font-bold text-sm text-white">7 календарных дней</div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">

              {/* ── СТОРОНЫ ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Заказчик</div>
                  <div className="font-black text-sm text-gray-900">ООО «НIIПРИИ «Севзапинжтехнология»</div>
                  <div className="text-xs text-gray-600 mt-1">Генеральный директор: А.А. Кабанов</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Исполнитель</div>
                  <img src={LOGO_URL} alt="Лого" className="h-7 object-contain mb-1" />
                  <div className="font-black text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                  <div className="text-[10px] text-gray-600 mt-1">
                    ИНН 7814795454 · ОГРН 1217800122649<br />
                    197341, г. Санкт-Петербург, Фермское шоссе, д. 12
                  </div>
                </div>
              </div>

              {/* ── ОБЪЕКТ ── */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Объект</div>
                <p className="text-sm text-gray-800 font-semibold leading-relaxed">
                  «Автомобильная дорога общего пользования. 4 полосы движения + 2 кармана, 4 перекрёстка,
                  2 пешеходных перехода. Протяжённость 370 метров»
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  <span className="font-semibold">Основание:</span> Технико-экономические показатели (ТЭПы) объекта
                </div>
              </div>

              {/* ── ДИАГРАММЫ В НАЧАЛЕ ── */}
              <div className="border border-gray-200 rounded-xl p-5 mb-4">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  Диаграмма Ганта — дорожная карта (7 календарных дней)
                </div>
                <GanttChart />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="border border-gray-200 rounded-xl p-5">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Трудоёмкость по этапам</div>
                  <div className="space-y-2">
                    {WORKS.map(w => (
                      <div key={w.n} className="flex items-center gap-2">
                        <div className="text-[9px] text-gray-400 w-4 shrink-0 text-right">{w.n}</div>
                        <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(w.days / 2) * 100}%` }} />
                        </div>
                        <div className="text-[10px] font-bold text-gray-700 w-8 text-right shrink-0">{w.days} чд</div>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
                      <div className="w-4" />
                      <div className="flex-1 text-xs font-black text-gray-700">Итого</div>
                      <div className="text-xs font-black text-blue-700 w-8 text-right">9 чд</div>
                    </div>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-xl p-5">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">График платежей</div>
                  <PaymentChart />
                  <div className="mt-2 text-center">
                    <div className="text-xl font-black text-gray-900">351 360 <span className="text-sm font-normal text-gray-500">₽</span></div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Итого с НДС</div>
                  </div>
                </div>
              </div>

              {/* 1. СОСТАВ РАБОТ */}
              <SectionTitle num="1">Состав работ и трудоёмкость</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                <div className="grid bg-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-wider" style={{ gridTemplateColumns: "40px 1fr 100px 160px" }}>
                  <div className="px-3 py-2 text-center">№</div>
                  <div className="px-3 py-2">Этап</div>
                  <div className="px-3 py-2 text-center">Чел.-дней</div>
                  <div className="px-3 py-2">Исполнитель</div>
                </div>
                {WORKS.map((w, i) => (
                  <div
                    key={w.n}
                    className={`grid text-xs border-t border-gray-100 ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                    style={{ gridTemplateColumns: "40px 1fr 100px 160px" }}
                  >
                    <div className="px-3 py-2.5 text-center text-gray-400 font-bold">{w.n}</div>
                    <div className="px-3 py-2.5 text-gray-800">{w.title}</div>
                    <div className="px-3 py-2.5 text-center font-black text-blue-700">{w.days}</div>
                    <div className="px-3 py-2.5 text-gray-600">{w.who}</div>
                  </div>
                ))}
                <div className="grid border-t border-gray-300 bg-blue-50" style={{ gridTemplateColumns: "40px 1fr 100px 160px" }}>
                  <div />
                  <div className="px-3 py-2.5 text-xs font-black text-gray-800">Итого</div>
                  <div className="px-3 py-2.5 text-center font-black text-blue-700 text-sm">9</div>
                  <div />
                </div>
              </div>

              {/* 2. СТОИМОСТЬ */}
              <SectionTitle num="2">Стоимость работ</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6 shadow-sm">
                {[
                  { label: "Стоимость без НДС", value: "288 000,00 руб." },
                  { label: "НДС 22%", value: "63 360,00 руб." },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white">
                    <div className="text-sm text-gray-600">{label}</div>
                    <div className="text-sm font-bold text-gray-800">{value}</div>
                  </div>
                ))}
                <div className="bg-blue-700 text-white px-5 py-4 flex items-center justify-between">
                  <div className="font-bold text-sm">Итого с НДС</div>
                  <div className="font-black text-xl">351 360,00 <span className="text-sm font-normal">руб.</span></div>
                </div>
                <div className="bg-gray-50 px-5 py-3 text-xs text-gray-500 italic">
                  Прописью: Триста пятьдесят одна тысяча триста шестьдесят рублей 00 копеек
                </div>
              </div>

              {/* 3. УСЛОВИЯ ОПЛАТЫ */}
              <SectionTitle num="3">Условия оплаты</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                <div className="grid bg-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-wider" style={{ gridTemplateColumns: "1fr 60px 150px 1fr" }}>
                  <div className="px-4 py-2">Платёж</div>
                  <div className="px-3 py-2 text-center">%</div>
                  <div className="px-3 py-2 text-right">Сумма (₽ с НДС)</div>
                  <div className="px-4 py-2">Срок</div>
                </div>
                {[
                  { name: "Аванс", pct: "30%", sum: "105 408,00", term: "В течение 3 дней после подписания договора", color: "bg-blue-50" },
                  { name: "Окончательный расчёт", pct: "70%", sum: "245 952,00", term: "В течение 5 дней после подписания акта сдачи-приёмки", color: "bg-emerald-50" },
                ].map(row => (
                  <div
                    key={row.name}
                    className={`grid text-xs border-t border-gray-100 ${row.color}`}
                    style={{ gridTemplateColumns: "1fr 60px 150px 1fr" }}
                  >
                    <div className="px-4 py-3 font-semibold text-gray-800">{row.name}</div>
                    <div className="px-3 py-3 text-center font-black text-blue-700">{row.pct}</div>
                    <div className="px-3 py-3 text-right font-bold text-gray-800">{row.sum} ₽</div>
                    <div className="px-4 py-3 text-gray-600">{row.term}</div>
                  </div>
                ))}
              </div>

              {/* 4. РЕЗУЛЬТАТЫ */}
              <SectionTitle num="4">Результаты работ</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                {[
                  { what: "Раздел «Экономические изыскания» (том)", fmt: "PDF" },
                  { what: "Исходные расчёты (сметы, таблицы, графики)", fmt: "Excel / .docx" },
                  { what: "Краткая пояснительная записка", fmt: "PDF" },
                ].map((r, i) => (
                  <div key={i} className={`flex items-center justify-between px-5 py-3 text-sm ${i > 0 ? "border-t border-gray-100" : ""} ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}>
                    <div className="text-gray-800">{r.what}</div>
                    <span className="ml-4 px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full shrink-0">{r.fmt}</span>
                  </div>
                ))}
              </div>

              {/* 5. СРОК ДЕЙСТВИЯ */}
              <SectionTitle num="5">Срок действия предложения</SectionTitle>
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-4 text-sm text-gray-800">
                <span className="font-bold">10 (десять) рабочих дней</span> с момента получения.
              </div>

              {/* ══════════════════════════════════════ */}
              {/* ДОРОЖНАЯ КАРТА */}
              {/* ══════════════════════════════════════ */}
              <div className="mt-10 mb-4 border-t-2 border-blue-700 pt-8">
                <div className="text-[10px] uppercase tracking-widest text-blue-500 font-black mb-1">Приложение</div>
                <h2 className="text-2xl font-black text-gray-900">Итоговая дорожная карта</h2>
                <div className="text-sm text-gray-500 mt-1">Экономические изыскания · объект 370 м · 7 календарных дней</div>
              </div>

              {/* ДК-1: Общие параметры */}
              <SectionTitle num="1">Общие параметры</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Трудоёмкость", value: "9 чел.-дней" },
                  { label: "Длительность", value: "7 дней" },
                  { label: "Параллельность", value: "×1,5" },
                  { label: "Резерв", value: "0,5 дня" },
                ].map(p => (
                  <div key={p.label} className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                    <div className="text-xl font-black text-blue-700">{p.value}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">{p.label}</div>
                  </div>
                ))}
              </div>

              {/* ДК-2: Диаграмма Ганта */}
              <SectionTitle num="2">Диаграмма Ганта</SectionTitle>
              <div className="border border-gray-200 rounded-xl p-5 mb-6">
                <GanttChart />
              </div>

              {/* ДК-3: Пошаговый план */}
              <SectionTitle num="3">Пошаговый план (по календарным дням)</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                <div className="grid bg-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-wider" style={{ gridTemplateColumns: "90px 1fr 60px 1fr" }}>
                  <div className="px-3 py-2">День</div>
                  <div className="px-3 py-2">Этап</div>
                  <div className="px-3 py-2 text-center">Чел.-дн</div>
                  <div className="px-3 py-2">Содержание работ</div>
                </div>
                {ROADMAP.map((r, i) => (
                  <div
                    key={i}
                    className={`grid text-xs border-t border-gray-100 ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                    style={{ gridTemplateColumns: "90px 1fr 60px 1fr" }}
                  >
                    <div className="px-3 py-2.5 font-bold text-blue-700 whitespace-nowrap">{r.day}</div>
                    <div className="px-3 py-2.5 font-semibold text-gray-800">{r.stage}</div>
                    <div className="px-3 py-2.5 text-center font-black text-gray-700">{r.hd}</div>
                    <div className="px-3 py-2.5 text-gray-600">{r.content}</div>
                  </div>
                ))}
                <div className="grid border-t border-gray-300 bg-blue-50 text-xs" style={{ gridTemplateColumns: "90px 1fr 60px 1fr" }}>
                  <div className="px-3 py-2.5 col-span-2 font-black text-gray-800">Итого человеко-дней: 1+1+2+1+2+1+1 =</div>
                  <div className="px-3 py-2.5 text-center font-black text-blue-700">9</div>
                  <div className="px-3 py-2.5 text-gray-500">Календарных дней: 7</div>
                </div>
              </div>

              {/* ДК-4: Сводная таблица */}
              <SectionTitle num="4">Сводная таблица: человеко-дни vs календарные дни</SectionTitle>
              <div className="border border-gray-200 rounded-xl overflow-hidden mb-8">
                {[
                  { param: "Человеко-дни", val: "9", note: "Суммарное рабочее время всех специалистов" },
                  { param: "Календарные дни", val: "7", note: "Реальное время от старта до сдачи" },
                  { param: "Соотношение", val: "9 / 7 = 1,3", note: "Параллельная работа 1–2 специалистов" },
                ].map((r, i) => (
                  <div key={i} className={`flex items-center gap-4 px-5 py-3 text-sm ${i > 0 ? "border-t border-gray-100" : ""} ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}>
                    <div className="w-44 font-semibold text-gray-800 shrink-0">{r.param}</div>
                    <div className="w-28 font-black text-blue-700 shrink-0">{r.val}</div>
                    <div className="text-gray-500">{r.note}</div>
                  </div>
                ))}
              </div>

              {/* ПОДПИСИ */}
              <SectionTitle num="6">Подписи сторон</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 mb-2">
                <div className="border border-gray-200 rounded-xl p-5">
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Заказчик</div>
                  <div className="text-xs text-gray-700 mb-1 font-semibold">ООО «НIIПРИИ «Севзапинжтехнология»</div>
                  <div className="text-xs text-gray-600 mb-5">Генеральный директор А.А. Кабанов</div>
                  <div className="border-b border-gray-400 border-dashed w-48 mb-1" />
                  <div className="text-[10px] text-gray-400">подпись / дата</div>
                  <div className="mt-3 text-[10px] text-gray-400 italic">М.П. (при наличии)</div>
                </div>
                <div className="border border-blue-200 rounded-xl p-5 bg-blue-50">
                  <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-3">Исполнитель</div>
                  <div className="text-xs text-gray-700 mb-1 font-semibold">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                  <div className="text-xs text-gray-600 mb-5">Генеральный директор</div>
                  <div className="border-b border-gray-400 border-dashed w-48 mb-1" />
                  <div className="text-[10px] text-gray-400">подпись / дата</div>
                  <div className="mt-3 text-[10px] text-gray-400 italic">М.П. (при наличии)</div>
                </div>
              </div>

              {/* ИТОГ */}
              <div className="mt-8 bg-blue-700 rounded-xl p-5 text-white">
                <div className="text-[10px] uppercase tracking-widest text-blue-200 mb-3 font-black">Итоговый пакет</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Стоимость с НДС", value: "351 360 ₽" },
                    { label: "Срок выполнения", value: "7 дней" },
                    { label: "Трудоёмкость", value: "9 чел.-дней" },
                    { label: "Срок действия КП", value: "10 раб. дней" },
                  ].map(p => (
                    <div key={p.label} className="bg-blue-600 rounded-lg p-3 text-center">
                      <div className="font-black text-base text-white">{p.value}</div>
                      <div className="text-[10px] text-blue-200 mt-0.5">{p.label}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
