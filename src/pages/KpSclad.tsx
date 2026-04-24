import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL = "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL = "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const WORKS = [
  { n: 1, title: "Инженерные изыскания (геология, геодезия, экология)", price: "3 200 000" },
  { n: 2, title: "Проектная документация (ПД) + Рабочая документация (РД)", price: "22 800 000" },
  { n: 3, title: "Негосударственная экспертиза (ПД, сметы, изыскания)", price: "1 500 000" },
  { n: 4, title: "Согласование СЗЗ + ПЛАРН + Росрыболовство*", price: "3 500 000" },
];

const PAYMENTS = [
  { stage: "Аванс (на геологию и запуск)", pct: "30%", sum: "9 300 000", deadline: "3 рабочих дня после договора", color: "bg-blue-50 border-blue-200" },
  { stage: "Промежуточный (сдача ПД в экспертизу)", pct: "40%", sum: "12 400 000", deadline: "По акту сдачи ПД", color: "bg-gray-50 border-gray-200" },
  { stage: "Финал (положительное заключение + РД)", pct: "30%", sum: "9 300 000", deadline: "По акту сдачи РД", color: "bg-emerald-50 border-emerald-200" },
];

const RESULTS = [
  { icon: "FileText", text: "4 (четыре) экземпляра ПД и РД на бумаге" },
  { icon: "HardDrive", text: "2 (два) экземпляра в электронном виде (.pdf, .dwg, .doc, .xlsx для смет)" },
  { icon: "CheckCircle", text: "Положительное заключение негосударственной экспертизы" },
  { icon: "ShieldCheck", text: "Утверждённая санитарно-защитная зона (СЗЗ)" },
];

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

export default function KpSclad() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Лого" className="h-9 object-contain" />
            <div>
              <div className="font-bold text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
              <div className="text-xs text-gray-500">Коммерческое предложение · КП-ГСМ-2026-02</div>
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
                  Склад ГСМ Краснобродский угольный разрез
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Tag color="bg-white/15 text-white border border-white/20">ОПО III класса</Tag>
                  <Tag color="bg-white/15 text-white border border-white/20">Сейсмичность 7 баллов</Tag>
                  <Tag color="bg-white/15 text-white border border-white/20">Новая очередь строительства</Tag>
                  <Tag color="bg-amber-400/30 text-amber-100 border border-amber-300/30">УСН · без НДС</Tag>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[9px] text-blue-300 uppercase tracking-wider mb-0.5">Номер КП</div>
                <div className="font-black text-base text-white">КП-ГСМ-2026-02</div>
                <div className="text-[10px] text-blue-300 mt-2">г. Кемерово</div>
                <div className="text-[10px] text-blue-300">24 апреля 2026 г.</div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">

            {/* ── SUMMARY CARDS ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { icon: "Banknote", value: "31 млн руб.", label: "фиксированная цена", color: "bg-emerald-600" },
                { icon: "FileStack", value: "4 вида работ", label: "полный комплекс ПИР", color: "bg-blue-700" },
                { icon: "ShieldCheck", value: "Экспертиза", label: "входит в стоимость", color: "bg-violet-700" },
                { icon: "Percent", value: "УСН", label: "НДС не облагается", color: "bg-slate-700" },
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
                <div className="font-black text-sm text-gray-900">АО «УК «Кузбассразрезуголь»</div>
                <div className="font-semibold text-xs text-gray-700 mt-0.5">Филиал «Краснобродский угольный разрез»</div>
                <div className="text-[10px] text-gray-500 mt-2 space-y-0.5">
                  <div>Основание: ТЗ на проектирование от 21.11.2025 г.</div>
                  <div>Лимит финансирования ПИР: 31 000 000 руб.</div>
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
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-2">
              <p className="text-sm text-gray-800 leading-relaxed mb-3">
                Выполнение <strong>полного комплекса проектно-изыскательских работ (ПИР)</strong> по объекту:
              </p>
              <div className="text-base font-black text-blue-800 mb-3">«Склад ГСМ Краснобродский угольный разрез»</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Новая очередь строительства", sub: "1 и 2 очередь" },
                  { label: "Опасный производственный объект", sub: "ОПО III класса" },
                  { label: "Сейсмичность", sub: "7 баллов" },
                ].map(({ label, sub }) => (
                  <div key={label} className="bg-white border border-blue-200 rounded-lg px-3 py-2">
                    <div className="text-[9px] text-blue-400 uppercase tracking-wider">{label}</div>
                    <div className="text-xs font-black text-blue-800">{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── PRICE ── */}
            <SectionTitle icon="Banknote">Стоимость работ — фиксированная</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-3">
              <div className="grid grid-cols-[32px_1fr_140px] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div>№</div><div>Вид работ</div><div className="text-right">Стоимость (руб.)</div>
              </div>
              {WORKS.map((w, i) => (
                <div key={w.n} className={`grid grid-cols-[32px_1fr_140px] px-4 py-3.5 border-b border-gray-100 items-center ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                  <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-white text-[9px] font-black">{w.n}</div>
                  <div className="text-xs text-gray-800 leading-snug pr-3">{w.title}</div>
                  <div className="text-sm font-black text-gray-900 text-right tabular-nums">{w.price}</div>
                </div>
              ))}
              {/* Total */}
              <div className="grid grid-cols-[32px_1fr_140px] px-4 py-4 bg-blue-700 items-center">
                <div />
                <div className="text-sm font-black text-white">Итого (без НДС, УСН)</div>
                <div className="text-xl font-black text-white text-right tabular-nums">31 000 000</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-2">
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-amber-900">
                <Icon name="Info" size={13} className="text-amber-600 shrink-0" />
                <span><strong>НДС не облагается</strong> — упрощённая система налогообложения (УСН).</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-emerald-900">
                <Icon name="CheckCircle" size={13} className="text-emerald-600 shrink-0" />
                <span>Получение положительных заключений <strong>входит в стоимость</strong>.</span>
              </div>
            </div>

            {/* ── PAYMENTS ── */}
            <SectionTitle icon="CreditCard">График платежей</SectionTitle>
            <div className="space-y-3 mb-2">
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
                    <div className="text-[10px] text-gray-500">руб.</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── RESULTS ── */}
            <SectionTitle icon="Package">Результат по окончании работ</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {RESULTS.map((r, i) => (
                <div key={i} className="flex gap-3 items-start bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center shrink-0">
                    <Icon name={r.icon} size={16} className="text-white" />
                  </div>
                  <span className="text-sm text-gray-800 leading-snug pt-1">{r.text}</span>
                </div>
              ))}
            </div>

            {/* ── VALIDITY ── */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-8 text-[10px] text-gray-600 leading-relaxed">
              Настоящее коммерческое предложение является офертой. Стоимость работ <strong>фиксированная</strong> и не подлежит одностороннему изменению. Цена указана без НДС в соответствии с применяемой Исполнителем упрощённой системой налогообложения (УСН).
            </div>

            {/* ── SIGNATURE ── */}
            <div className="border-t-2 border-gray-800 pt-6 flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">С уважением,</p>
                <p className="text-xs font-black text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</p>
                <p className="text-[10px] text-gray-500">ИНН 7814795454 · КПП 781401001 · ОГРН 1217800122649</p>
                <p className="text-[10px] text-gray-500">197341, г. Санкт-Петербург, Фермское шоссе, д. 12</p>
                <div className="mt-4">
                  <div className="border-b border-gray-400 w-44 mb-1" />
                  <div className="text-[10px] text-gray-500">Подпись / М.П.</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <img src={LOGO_URL} alt="Лого" className="h-10 object-contain opacity-60" />
                <img src={STAMP_URL} alt="Печать" className="h-20 object-contain opacity-80" />
                <div className="flex gap-2">
                  <Tag color="bg-gray-100 text-gray-600">КП-ГСМ-2026-02</Tag>
                  <Tag color="bg-gray-100 text-gray-600">24.04.2026</Tag>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
