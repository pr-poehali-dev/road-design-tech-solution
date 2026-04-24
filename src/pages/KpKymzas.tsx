import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";

const WORKS = [
  { n: 1, stage: "Инженерные изыскания", content: "Геодезия, геология, гидрометеорология, экология, геотехника", result: "Технический отчёт", weeks: 20 },
  { n: 2, stage: "Археология", content: "Полевая разведка + отчёт", result: "Справка / отчёт", weeks: 6 },
  { n: 3, stage: "Геомеханика", content: "Обоснование устойчивости бортов, уступов, отвалов", result: "Заключение", weeks: 20 },
  { n: 4, stage: "Проект СЗЗ", content: "Расчёт санитарно-защитной зоны + получение СЭЗ", result: "Том + заключение", weeks: 15 },
  { n: 5, stage: "ПД (стадия «Проект»)", content: "По ПП 87, Приказу 218, Пост. 2127", result: "8 томов", weeks: 23 },
  { n: 6, stage: "ОВОС", content: "Полная оценка воздействия на окружающую среду", result: "Том", weeks: 12 },
  { n: 7, stage: "Общественные обсуждения", content: "Организация, презентация, протокол", result: "Протокол", weeks: 7 },
  { n: 8, stage: "Проект рекультивации", content: "Отдельный том под ГЭЭ", result: "Том", weeks: 16 },
  { n: 9, stage: "Проект горного отвода", content: "Границы + разрешение", result: "Том", weeks: 10 },
  { n: 10, stage: "ГЭЭ", content: "Подача и получение заключения государственной экологической экспертизы", result: "Заключение", weeks: 5 },
  { n: 11, stage: "ГГЭ", content: "Главгосэкспертиза (ПД + изыскания)", result: "Заключение", weeks: 6 },
  { n: 12, stage: "РД (стадия «Рабочка»)", content: "12 томов рабочей документации", result: "Комплект РД", weeks: 6 },
  { n: 13, stage: "Сметная документация", content: "ГРАНД-Смета, Excel, РДЦ по шаблону ООО «РУК»", result: "4 экз. + флешка", weeks: null },
];

const PAYMENT_ROWS = [
  { label: "Аванс", value: "25% от стоимости этапа" },
  { label: "Промежуточные платежи", value: "Ежемесячно по КС‑2, КС‑3" },
  { label: "Окончательный расчёт", value: "В течение 10 рабочих дней после подписания итогового акта" },
  { label: "Форма оплаты", value: "Безналичный рублёвый перевод" },
];

const NOT_INCLUDED = [
  "Государственные пошлины за ГЭЭ и ГГЭ",
  "Сборы за получение решения о предоставлении водного объекта",
  "Нотариальные доверенности (при необходимости)",
];

const CONDITIONS = [
  "Передача исходных данных в полном объёме (геология, ТЭО, лицензия)",
  "Отсутствие форс-мажоров, меняющих нормативную базу более чем на 20% трудозатрат",
  "Своевременное согласование промежуточных результатов",
];

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

function Tag({ children, color = "bg-blue-100 text-blue-800" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${color}`}>{children}</span>
  );
}

export default function KpKymzas() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Лого" className="h-9 object-contain" />
            <div>
              <div className="font-bold text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
              <div className="text-xs text-gray-500">Коммерческое предложение · КП‑КУМЗАС‑2026</div>
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
                <h1 className="text-xl font-black leading-snug mb-3 max-w-xl">
                  Разработка полного комплекта проектной документации для отработки запасов участка недр «Кумзасский 1‑2»
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Tag color="bg-white/15 text-white border border-white/20">Лицензия КЕМ 02209 ТЭ</Tag>
                  <Tag color="bg-white/15 text-white border border-white/20">ОГР Кумзасский 04‑РУК‑0197</Tag>
                  <Tag color="bg-blue-400/30 text-blue-100 border border-blue-300/30">52 недели · 13 этапов</Tag>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[9px] text-blue-300 uppercase tracking-wider mb-0.5">Номер КП</div>
                <div className="font-black text-base text-white">КП‑КУМЗАС‑2026</div>
                <div className="text-[10px] text-blue-300 mt-2">24 апреля 2026 г.</div>
                <div className="text-[10px] text-blue-300 mt-0.5">Действ. до: 31.10.2026</div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">

            {/* ── PARTIES ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Заказчик</div>
                <div className="font-black text-sm text-gray-900">АО «Разрез Распадский»</div>
                <div className="text-xs text-gray-500 mt-1.5 space-y-0.5">
                  <div>Основание: Лицензия КЕМ 02209 ТЭ</div>
                  <div>Проект: Инвестиционный «Участок ОГР Кумзасский 04‑РУК‑0197»</div>
                  <div>Основа: Утверждённое ТЭО постоянных разведочных кондиций</div>
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

            {/* ── SUMMARY CARDS ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { icon: "FileStack", value: "13 этапов", label: "полный комплекс", color: "bg-blue-700" },
                { icon: "Calendar", value: "52 нед.", label: "12 месяцев", color: "bg-slate-700" },
                { icon: "Banknote", value: "182,1 млн", label: "итого с НДС 22%", color: "bg-emerald-600" },
                { icon: "ShieldCheck", value: "ГЭЭ + ГГЭ", label: "с 1-й попытки", color: "bg-violet-700" },
              ].map(({ icon, value, label, color }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center shadow-sm">
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center mb-2`}>
                    <Icon name={icon} size={18} className="text-white" />
                  </div>
                  <div className="text-base font-black text-gray-900 leading-tight">{value}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* ── SUBJECT ── */}
            <SectionTitle icon="Target">1. Цель и предмет коммерческого предложения</SectionTitle>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-2">
              <p className="text-sm text-gray-800 leading-relaxed mb-3">
                Разработка <strong>полного комплекта документации</strong> для отработки запасов участка недр «Кумзасский 1‑2» в границах первоочередной отработки в рамках лицензии КЕМ 02209 ТЭ.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  "Инженерные изыскания (все виды)",
                  "Геомеханическое обоснование",
                  "Проект СЗЗ",
                  "ПД + РД + Сметы",
                  "ОВОС + общественные обсуждения",
                  "Проект рекультивации",
                  "Горный отвод",
                  "Сопровождение ГЭЭ и ГГЭ",
                ].map((item) => (
                  <div key={item} className="flex gap-1.5 items-start">
                    <Icon name="CheckCircle" size={13} className="text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── WORKS ── */}
            <SectionTitle icon="ClipboardList">2. Состав работ — 13 этапов</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-2">
              <div className="grid grid-cols-[32px_130px_1fr_100px_60px] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div>№</div>
                <div>Этап</div>
                <div>Содержание</div>
                <div>Результат</div>
                <div>Нед.</div>
              </div>
              {WORKS.map((w, i) => (
                <div
                  key={w.n}
                  className={`grid grid-cols-[32px_130px_1fr_100px_60px] px-4 py-3 border-b border-gray-100 last:border-0 items-start ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
                >
                  <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-white text-[9px] font-black mt-0.5">{w.n}</div>
                  <div className="text-xs font-bold text-gray-800 leading-snug pr-2">{w.stage}</div>
                  <div className="text-xs text-gray-600 leading-snug pr-2">{w.content}</div>
                  <div className="text-xs font-semibold text-gray-700 leading-snug">{w.result}</div>
                  <div className="text-xs font-bold text-blue-700">{w.weeks ? `${w.weeks}` : "в составе РД"}</div>
                </div>
              ))}
            </div>

            {/* ── PRICE ── */}
            <SectionTitle icon="Banknote">3. Финансовые условия (НДС 22%)</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-3">
              {[
                { label: "Стоимость работ без НДС", value: "149 296 000 руб.", highlight: false },
                { label: "НДС (22%)", value: "32 845 120 руб.", highlight: false },
                { label: "ИТОГО С НДС 22%", value: "182 141 120 руб.", highlight: true },
              ].map(({ label, value, highlight }) => (
                <div
                  key={label}
                  className={`flex items-center justify-between px-5 py-4 border-b border-gray-100 last:border-0 ${highlight ? "bg-blue-700" : "bg-white"}`}
                >
                  <div className={`text-sm ${highlight ? "font-black text-white" : "text-gray-700"}`}>{label}</div>
                  <div className={`text-sm font-black ${highlight ? "text-white text-lg" : "text-gray-900"}`}>{value}</div>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-2">
              <div className="text-[10px] font-black text-amber-700 uppercase tracking-wider mb-1.5">Дополнительно оплачивается Заказчиком</div>
              {NOT_INCLUDED.map((item, i) => (
                <div key={i} className="flex gap-2 items-start text-xs text-amber-900 mb-1 last:mb-0">
                  <Icon name="Info" size={12} className="text-amber-600 shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>

            {/* ── PAYMENT ── */}
            <SectionTitle icon="CreditCard">4. Порядок оплаты</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-2">
              <div className="grid grid-cols-[180px_1fr] text-[9px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div>Условие</div>
                <div>Значение</div>
              </div>
              {PAYMENT_ROWS.map((r, i) => (
                <div key={i} className={`grid grid-cols-[180px_1fr] px-4 py-3 border-b border-gray-100 last:border-0 items-start ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                  <div className="text-xs font-bold text-gray-800 pr-3">{r.label}</div>
                  <div className="text-xs text-gray-600">{r.value}</div>
                </div>
              ))}
            </div>

            {/* ── TIMELINE ── */}
            <SectionTitle icon="Clock">5. Сроки реализации</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-2">
              {[
                { icon: "Timer", label: "Общая продолжительность", value: "52 недели (12 месяцев)", color: "text-blue-700" },
                { icon: "Play", label: "Начало работ", value: "Через 10 рабочих дней после поступления аванса", color: "text-gray-900" },
                { icon: "FlagTriangleRight", label: "Финиш", value: "Передача полного комплекта РД + заключений ГЭЭ и ГГЭ", color: "text-emerald-700" },
              ].map(({ icon, label, value, color }, i) => (
                <div key={i} className={`grid grid-cols-[180px_1fr] px-5 py-3.5 border-b border-gray-100 last:border-0 items-center ${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    <Icon name={icon} size={13} className="text-blue-600 shrink-0" />
                    {label}
                  </div>
                  <div className={`text-sm font-bold ${color}`}>{value}</div>
                </div>
              ))}
            </div>

            {/* ── CONDITIONS ── */}
            <SectionTitle icon="FileCheck">6. Условия действительности предложения</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-3">Предложение действительно при условии</div>
                <div className="space-y-2">
                  {CONDITIONS.map((c, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[9px] font-black shrink-0 mt-0.5">{i + 1}</div>
                      <span className="text-xs text-gray-700 leading-snug">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                    <Icon name="ShieldCheck" size={16} className="text-white" />
                  </div>
                  <div className="text-sm font-black text-emerald-800">Гарантия качества</div>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Исполнитель гарантирует прохождение <strong>ГЭЭ и ГГЭ с 1-й попытки</strong> при полном соблюдении сроков согласования со стороны Заказчика.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Tag color="bg-emerald-100 text-emerald-800">ГЭЭ с 1-й попытки</Tag>
                  <Tag color="bg-emerald-100 text-emerald-800">ГГЭ с 1-й попытки</Tag>
                </div>
              </div>
            </div>

            {/* ── VALIDITY ── */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mt-6 mb-8 text-[10px] text-gray-600 leading-relaxed">
              Настоящее коммерческое предложение является офертой и действительно до <strong>31 октября 2026 г.</strong>
              Все параметры, указанные в данном документе, являются окончательными. Государственные пошлины за ГЭЭ и ГГЭ оплачиваются Заказчиком дополнительно.
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
                  <Tag color="bg-gray-100 text-gray-600">КП‑КУМЗАС‑2026</Tag>
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
