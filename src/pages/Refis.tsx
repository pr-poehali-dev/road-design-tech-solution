
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/7b630b71-f92c-4f6d-8d53-ab2b00971f22.png";
const STAMP_URL =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/28ef465a-8d37-462f-9a36-4d59c5b0a662.png";
const VOLHOV_IMG =
  "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/faead16a-9154-4ab7-893c-d713dace2b38.png";

function StatCard({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <div className="bg-white border border-blue-100 rounded-xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="w-11 h-11 rounded-full bg-blue-700 flex items-center justify-center mb-3">
        <Icon name={icon} size={20} className="text-white" />
      </div>
      <div className="text-2xl font-black text-blue-700 leading-none mb-1">{value}</div>
      <div className="text-xs text-gray-500 leading-snug">{label}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-5 w-1 rounded-full bg-blue-700 shrink-0" />
      <h2 className="text-sm font-black uppercase tracking-widest text-gray-800">{children}</h2>
    </div>
  );
}

function WorkItem({ icon, title, items }: { icon: string; title: string; items: string[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center shrink-0">
          <Icon name={icon} size={16} className="text-white" />
        </div>
        <span className="text-sm font-bold text-gray-900">{title}</span>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex gap-1.5 text-xs text-gray-700 leading-snug">
            <span className="text-blue-600 shrink-0 mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Tag({ children, color = "bg-blue-100 text-blue-800" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${color}`}>{children}</span>
  );
}

export default function Refis() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Лого" className="h-9 object-contain" />
            <div>
              <div className="font-bold text-sm text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
              <div className="text-xs text-gray-500">Референс · Инженерные изыскания</div>
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

          {/* ── HERO ── */}
          <div className="relative h-52 overflow-hidden">
            <img
              src={VOLHOV_IMG}
              alt="Волховское водохранилище"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/50 to-blue-900/80" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-8 text-center">
              <div className="text-[10px] uppercase tracking-widest text-blue-200 mb-2">Референс · Инженерные изыскания</div>
              <h1 className="text-xl font-black leading-tight mb-2 max-w-lg">
                Опыт проведения инженерных изысканий
              </h1>
              <div className="flex flex-wrap justify-center gap-2">
                {["Геодезия", "Геология", "Гидрология", "Экология", "Акватории", "ГОСТ/СП"].map((t) => (
                  <span key={t} className="bg-white/20 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-semibold border border-white/30">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* ── COMPANY HEADER ── */}
            <div className="flex items-start justify-between mb-6 pb-5 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <img src={LOGO_URL} alt="Лого" className="h-14 object-contain" />
                <div>
                  <div className="font-black text-base text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</div>
                  <div className="text-xs text-gray-500 mt-0.5">ИНН 7814795454 · ОГРН 1217800122649</div>
                  <div className="text-xs text-gray-500">197341, г. Санкт-Петербург, Фермское шоссе, д. 12</div>
                </div>
              </div>
              <div className="text-right text-xs text-gray-500">
                <div className="font-bold text-blue-700 text-sm">РЕФ-ИЗ-2026</div>
                <div>Апрель 2026 г.</div>
              </div>
            </div>

            {/* ── STATS ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <StatCard value="100+ га" label="топографической съёмки" icon="Map" />
              <StatCard value="100+ км" label="бурения скважин" icon="Drill" />
              <StatCard value="4 вида" label="комплексных изысканий" icon="ClipboardList" />
              <StatCard value="3 года" label="гарантия результатов" icon="ShieldCheck" />
            </div>

            {/* ── INTRO ── */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
              <p className="text-sm text-gray-800 leading-relaxed">
                ООО «Капстрой-Инжиниринг» обладает подтверждённым опытом выполнения полного комплекса
                инженерных изысканий на сложных объектах — водных акваториях, охраняемых территориях,
                труднодоступных и удалённых участках. Накопленная экспертиза позволяет нам уверенно
                браться за уникальные задачи, в том числе проведение изысканий на островах Ладожского
                озера в условиях отсутствия инфраструктуры.
              </p>
              <p className="text-sm text-gray-800 leading-relaxed mt-2">
                В активе компании — <strong>более 100 га</strong> выполненной топографической съёмки
                и <strong>более 100 км</strong> пробурённых скважин по всей стране, включая проекты
                для федеральных заказчиков и объекты в зонах природного и историко-культурного наследия.
              </p>
            </div>

            {/* ── PROJECT CARD ── */}
            <SectionTitle>Реализованный проект</SectionTitle>

            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-8">
              {/* Project title bar */}
              <div className="bg-blue-700 text-white px-5 py-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Tag color="bg-white/20 text-white border border-white/30">Водные объекты</Tag>
                  <Tag color="bg-white/20 text-white border border-white/30">Историческая зона</Tag>
                  <Tag color="bg-white/20 text-white border border-white/30">Федеральный заказчик</Tag>
                  <Tag color="bg-emerald-400/30 text-emerald-100 border border-emerald-300/30">Экспертиза: положительная</Tag>
                </div>
                <h3 className="font-black text-base leading-snug">
                  Инженерные изыскания для расчистки Волховского водохранилища
                </h3>
                <div className="text-blue-200 text-xs mt-1">г. Великий Новгород, р. Волхов — участок «Гребной канал», квартал 151</div>
              </div>

              <div className="p-5">
                {/* Project meta */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: "Заказчик", value: "ФГБВУ «Центррегионводхоз»", icon: "Building" },
                    { label: "Срок выполнения", value: "90 календарных дней", icon: "Calendar" },
                    { label: "Площадь съёмки", value: "21,6 га · М 1:1000", icon: "Layers" },
                    { label: "Протяжённость", value: "2,1 км по оси объекта", icon: "Ruler" },
                  ].map(({ label, value, icon }, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon name={icon} size={12} className="text-blue-600" />
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">{label}</span>
                      </div>
                      <div className="text-xs font-bold text-gray-900 leading-snug">{value}</div>
                    </div>
                  ))}
                </div>

                {/* Goal */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
                  <div className="text-[10px] font-bold text-amber-700 uppercase mb-1">Цель работ</div>
                  <p className="text-xs text-gray-800 leading-relaxed">
                    Комплексное инженерно-изыскательское обеспечение для разработки проектно-сметной документации
                    по расчистке акватории: определение объёмов донных отложений, выбор технологии работ
                    и обоснование размещения грунта (карты намыва).
                  </p>
                </div>

                {/* Works grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                  <WorkItem
                    icon="Compass"
                    title="Инженерно-геодезические изыскания"
                    items={[
                      "Создание планово-высотной съёмочной сети (МСК-53, Балтийская 1977)",
                      "Топосъёмка складирования грунта: 21,6 га, М 1:1000, сечение 0,5 м",
                      "Продольные (М 1:1000/1:100) и поперечные профили (М 1:500/1:100) на 2,1 км",
                      "Классификация растительности, временные геодезические репёры",
                    ]}
                  />
                  <WorkItem
                    icon="Mountain"
                    title="Инженерно-геологические изыскания"
                    items={[
                      "Рекогносцировка акватории и площадок складирования",
                      "Скважины и шурфы: мощность донных отложений, плодородный слой",
                      "Лабораторные испытания (физико-механические свойства, ГЭСН 81-02-01-2022)",
                      "Класс опасности грунтов, гидрогеологические условия",
                    ]}
                  />
                  <WorkItem
                    icon="Waves"
                    title="Инженерно-гидрометеорологические изыскания"
                    items={[
                      "Анализ режима водохранилища: уровни, сток, ледовый и термический режим",
                      "Расчёт расходов и уровней (1–10% обеспеченность, среднемеженные, минимальные)",
                      "Оценка скоростного режима, твёрдого стока, русловых процессов",
                      "Влияние сверхнормативных расходов на безопасность ГТС",
                    ]}
                  />
                  <WorkItem
                    icon="Leaf"
                    title="Инженерно-экологические изыскания"
                    items={[
                      "Оценка почв, поверхностных и подземных вод, донных отложений",
                      "Лабораторный анализ (нефтепродукты, pH, Eh, биологическое загрязнение)",
                      "Класс опасности донных отложений",
                      "Предложения по утилизации грунтов и рекультивации карт намыва",
                      "Археологическая разведка (шурфовка + геофизика) — зона Новгородского Кремля",
                    ]}
                  />
                </div>

                {/* Special conditions */}
                <div className="bg-gray-800 text-white rounded-xl p-4 mb-4">
                  <div className="text-[10px] font-bold text-gray-300 uppercase mb-2">Ключевые особенности проекта</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { icon: "Landmark", title: "Зона наследия", desc: "Работы в непосредственной близости от Новгородского Кремля — объекта ЮНЕСКО" },
                      { icon: "ListOrdered", title: "Двухэтапный подход", desc: "Сначала геодезия для утверждения трассы расчистки — затем остальные виды изысканий" },
                      { icon: "AlertTriangle", title: "Сложность II кат.", desc: "Категория сложности инженерно-геологических условий II — нестандартные грунты и УГВ" },
                    ].map(({ icon, title, desc }, i) => (
                      <div key={i} className="flex gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon name={icon} size={14} className="text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white mb-0.5">{title}</div>
                          <div className="text-[10px] text-gray-400 leading-snug">{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase mb-2">Результаты, переданные заказчику</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {[
                      { icon: "FileText", text: "Технические отчёты по всем 4 видам изысканий (4 экз. бумага + PDF + DWG)" },
                      { icon: "CheckCircle", text: "Положительное заключение негосударственной экспертизы результатов изысканий" },
                      { icon: "ShieldCheck", text: "Гарантийные обязательства на результаты работ — 3 года" },
                    ].map(({ icon, text }, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <Icon name={icon} size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-700 leading-snug">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RELEVANCE ── */}
            <SectionTitle>Почему этот опыт релевантен для Ладоги</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {[
                {
                  icon: "Waves",
                  title: "Водные объекты — наша специализация",
                  desc: "Волховское водохранилище — крупнейший водный объект, работы на нём сопоставимы по сложности с акваторией Ладожского озера: нестабильный уровень воды, плавающий грунт, сложная логистика.",
                  color: "bg-blue-700",
                },
                {
                  icon: "MapPin",
                  title: "Опыт работы на труднодоступных участках",
                  desc: "Остров в Ладожском озере и участок в пойме Волхова объединяет одно — отсутствие прямого доступа, потребность в водном транспорте и автономной организации полевого лагеря.",
                  color: "bg-teal-600",
                },
                {
                  icon: "Compass",
                  title: "100+ га геодезической съёмки",
                  desc: "Планируемый объём на острове (124 га) полностью покрывается нашим накопленным опытом в части масштабов топографической съёмки в сложных природных условиях.",
                  color: "bg-violet-700",
                },
                {
                  icon: "Drill",
                  title: "100+ км бурения скважин",
                  desc: "Бурение в условиях смешанных грунтов, валунной составляющей и близости грунтовых вод — стандартная практика для наших полевых партий.",
                  color: "bg-orange-600",
                },
                {
                  icon: "Landmark",
                  title: "Работа в охраняемых зонах",
                  desc: "Опыт получения разрешений и проведения изысканий в зоне ЮНЕСКО (Новгородский Кремль) подтверждает нашу компетенцию для объектов с ограничениями (ООПТ, лесной фонд, заповедная зона).",
                  color: "bg-red-700",
                },
                {
                  icon: "ClipboardList",
                  title: "Комплексный подход — 4 вида изысканий",
                  desc: "Геодезия, геология, гидрология и экология — все четыре вида изысканий выполнены в рамках одного контракта, что снижает риски несогласованности и ускоряет работу.",
                  color: "bg-slate-700",
                },
              ].map(({ icon, title, desc, color }, i) => (
                <div key={i} className="flex gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon name={icon} size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 mb-1 leading-snug">{title}</div>
                    <div className="text-xs text-gray-600 leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── STANDARDS ── */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
              <SectionTitle>Нормативная база</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {[
                  "СП 47.13330.2016", "СП 11-104-97", "СП 11-105-97",
                  "СП 11-102-97", "СП 33-101-2003", "СП 446.1325800.2019",
                  "ГОСТ 21.301-2023", "ГОСТ 5180", "ГОСТ 12536", "ГЭСН 81-02-01-2022",
                ].map((s) => (
                  <Tag key={s} color="bg-blue-100 text-blue-800">{s}</Tag>
                ))}
              </div>
            </div>

            {/* ── SIGNATURE ── */}
            <div className="border-t-2 border-gray-800 pt-6 flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-2">С уважением,</p>
                <p className="text-xs text-gray-700">Генеральный директор</p>
                <p className="text-xs font-bold text-gray-900">ООО «КАПСТРОЙ-ИНЖИНИРИНГ»</p>
                <div className="mt-5 text-xs text-gray-400">
                  <div>________________</div>
                  <div className="mt-0.5">(подпись)</div>
                </div>
              </div>
              <div className="text-center">
                <img src={STAMP_URL} alt="Печать" className="h-28 w-28 object-contain opacity-90" />
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
              <span>ООО «КАПСТРОЙ-ИНЖИНИРИНГ» · ИНН 7814795454</span>
              <span>РЕФ-ИЗ-2026 · Апрель 2026 г.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}