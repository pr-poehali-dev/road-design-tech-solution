import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/icon";

// ─── ДАННЫЕ ──────────────────────────────────────────────────────────────────

const STATS = [
  { value: "500+", label: "реализованных проектов" },
  { value: "18", label: "лет на рынке" },
  { value: "ИИ", label: "платформа проектирования" },
  { value: "мин", label: "вместо недель на КП" },
];

const DIRECTIONS = [
  { icon: "Road", title: "Дороги и транспорт", desc: "Автомобильные дороги, развязки, мосты, тоннели" },
  { icon: "Building2", title: "Жилые комплексы", desc: "Многоквартирные дома, коттеджные посёлки, апарт-отели" },
  { icon: "Factory", title: "Промышленность", desc: "Производственные цеха, склады, логистические центры" },
  { icon: "GraduationCap", title: "Социальные объекты", desc: "Школы, детские сады, университеты, интернаты" },
  { icon: "HeartPulse", title: "Медицина", desc: "Поликлиники, больницы, лабораторные корпуса" },
  { icon: "Dumbbell", title: "Спорт и культура", desc: "Спортивные комплексы, театры, объекты наследия" },
  { icon: "Zap", title: "Инженерные сети", desc: "ТЭЦ, водоканал, теплоснабжение, электросети" },
  { icon: "Trees", title: "Благоустройство", desc: "Городские парки, набережные, общественные пространства" },
];

const STAGES = [
  { id: 1, short: "ТЗ", title: "Техническое задание", desc: "Анализ вводных, формирование ТЗ, предварительный бюджет", days: "1–2 дня", color: "#3b82f6" },
  { id: 2, short: "ПД", title: "Предпроектная документация", desc: "Концепция, эскизный проект, согласование с заказчиком", days: "5–14 дней", color: "#8b5cf6" },
  { id: 3, short: "П", title: "Проект (стадия П)", desc: "Архитектурные, конструктивные, инженерные решения", days: "30–90 дней", color: "#06b6d4" },
  { id: 4, short: "РД", title: "Рабочая документация", desc: "Комплект чертежей и спецификаций для строительства", days: "20–60 дней", color: "#10b981" },
  { id: 5, short: "ГЭ", title: "Государственная экспертиза", desc: "Прохождение экспертизы, устранение замечаний", days: "45–90 дней", color: "#f59e0b" },
  { id: 6, short: "АН", title: "Авторский надзор", desc: "Сопровождение строительства, контроль качества", days: "весь период", color: "#ef4444" },
];

const CASES = [
  {
    id: 1,
    title: "Дошкольная образовательная организация",
    type: "Социальные объекты",
    works: "Разработка архитектурно-градостроительного облика",
    client: "ООО «АРТ «СОЗИДАНИЕ»",
    location: "Санкт-Петербург, Пулковское шоссе, д. 103, лит. Р, уч. 72",
    year: 2020,
    img: "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/2c9c9541-0b94-4935-bc1e-5a195bfdf8aa.png",
    tags: ["Экологичность", "220 мест", "АГО"],
    items: [
      "Создание экологически сбалансированного и функционально насыщенного пространства",
      "Учёт современных требований и стандартов дошкольного образования",
      "Гармоничное вписывание в окружающий архитектурный облик",
      "Проектирование учреждения на 220 мест",
    ],
  },
  {
    id: 2,
    title: "Начальная школа с дошкольным отделением",
    type: "Социальные объекты",
    works: "Инженерные изыскания и проектная документация",
    client: "МКУ «УС ГМР» — Управление строительства Гатчинского района",
    location: "Ленинградская обл., г. Гатчина, ул. К. Подрядчикова, д. 9",
    year: 2024,
    img: "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/c6721bbc-8a48-4365-9c93-dd3220543588.png",
    tags: ["Муниципальный заказ", "Изыскания", "ПД"],
    items: [
      "Подготовка договора на проведение инженерных изысканий",
      "Разработка документации для образовательного комплекса",
      "Создание начальной школы и дошкольного отделения",
      "Соответствие современным требованиям к инфраструктуре и безопасности",
    ],
  },
  {
    id: 3,
    title: "Стоматологическая поликлиника №32",
    type: "Медицина",
    works: "ПСД по капитальному ремонту здания",
    client: "СПб ГБУЗ «Стоматологическая поликлиника №32»",
    location: "Санкт-Петербург, пр. Наставников, д. 22",
    year: 2023,
    img: "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/895b6cbf-5ed4-40ce-9961-9c0430008a88.png",
    tags: ["Капремонт", "Медицина", "ПСД"],
    items: [
      "Разработка проектно-сметной документации",
      "Обследование существующих конструкций здания",
      "Соответствие санитарным нормам для медучреждений",
      "Согласование с государственными органами надзора",
    ],
  },
  {
    id: 4,
    title: "Детский сад №52 Колпинского района",
    type: "Социальные объекты",
    works: "Проектная документация на ремонт фасадов",
    client: "ГБДОУ Детский сад №52 Колпинского района Санкт-Петербурга",
    location: "Санкт-Петербург, Колпинский район",
    year: 2023,
    img: "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/43f3c4e0-7a5e-4f57-82f0-8e4d1cb1015d.png",
    tags: ["Фасады", "Госзаказ", "2023"],
    items: [
      "Разработка проектной документации на ремонт фасадов",
      "Обследование существующего состояния ограждающих конструкций",
      "Подбор современных фасадных систем",
      "Сметная документация для государственного контракта",
    ],
  },
  {
    id: 5,
    title: "ГБОУ СОШ №427",
    type: "Социальные объекты",
    works: "Обмерные работы и ПСД капитального ремонта",
    client: "ГБОУ СОШ №427",
    location: "Санкт-Петербург",
    year: 2023,
    img: "https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/e37b8dcd-128d-4521-8930-e7f5192d5ef3.png",
    tags: ["Обмеры", "ПСД", "Школа"],
    items: [
      "Выполнение обмерных работ существующего здания",
      "Разработка проектно-сметной документации капитального ремонта",
      "Анализ конструктивных элементов здания",
      "Подготовка комплекта рабочей документации",
    ],
  },
];

const ADVANTAGES = [
  {
    icon: "Zap",
    title: "Скорость реакции",
    desc: "КП и дорожная карта за минуты — пока конкуренты только собирают исходные данные.",
  },
  {
    icon: "Target",
    title: "Точность прогноза",
    desc: "ИИ, обученный на 500+ проектах, исключает «человеческий фактор» на ранних этапах.",
  },
  {
    icon: "Eye",
    title: "Прозрачность",
    desc: "Не просто цифра, а понятная дорожная карта с этапами и обоснованиями.",
  },
  {
    icon: "Brain",
    title: "ИИ-платформа",
    desc: "Автоматизация рутины высвобождает ресурсы для сложных инженерных задач.",
  },
];

// ─── ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ──────────────────────────────────────────────

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const num = parseInt(value.replace(/\D/g, ""));
    if (isNaN(num)) { setDisplay(value); return; }
    let start = 0;
    const step = Math.ceil(num / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start + (value.includes("+") ? "+" : ""));
    }, 30);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{display}</span>;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── ДИАГРАММА ГАНТА (анимированная) ─────────────────────────────────────────

const GANTT = [
  { stage: "ТЗ", start: 0, dur: 4, color: "#3b82f6" },
  { stage: "ПД", start: 3, dur: 14, color: "#8b5cf6" },
  { stage: "П", start: 14, dur: 45, color: "#06b6d4" },
  { stage: "РД", start: 40, dur: 35, color: "#10b981" },
  { stage: "ГЭ", start: 55, dur: 45, color: "#f59e0b" },
  { stage: "АН", start: 85, dur: 30, color: "#ef4444" },
];
const TOTAL = 115;

function GanttChart() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeBar, setActiveBar] = useState<number | null>(null);

  return (
    <div ref={ref} className="w-full">
      {/* timeline header */}
      <div className="flex items-center gap-2 mb-3 ml-12">
        {[0, 20, 40, 60, 80, 100].map((d) => (
          <div key={d} style={{ left: `${d / TOTAL * 100}%` }} className="text-xs text-slate-500 relative" >
            {d === 0 ? "Старт" : `+${d} дн`}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {GANTT.map((bar, i) => {
          const leftPct = (bar.start / TOTAL) * 100;
          const widthPct = (bar.dur / TOTAL) * 100;
          return (
            <div key={bar.stage} className="flex items-center gap-3">
              <div className="w-8 text-right text-xs font-bold text-slate-400 shrink-0">{bar.stage}</div>
              <div className="flex-1 relative h-7 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={isInView ? { width: `${widthPct}%`, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: "easeOut" }}
                  style={{ left: `${leftPct}%`, backgroundColor: bar.color }}
                  className="absolute top-0 h-full rounded-full cursor-pointer flex items-center px-2"
                  onMouseEnter={() => setActiveBar(i)}
                  onMouseLeave={() => setActiveBar(null)}
                >
                  <span className="text-white text-xs font-semibold whitespace-nowrap drop-shadow">{bar.stage}</span>
                </motion.div>
              </div>
              <div className="w-16 text-xs text-slate-400 shrink-0">
                {bar.stage === "АН" ? "строит." : `${bar.dur} дн`}
              </div>
            </div>
          );
        })}
      </div>

      {/* подсказка */}
      <AnimatePresence>
        {activeBar !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-4 p-3 rounded-xl border border-slate-700 bg-slate-800/80 text-sm text-slate-300"
          >
            <span className="font-bold" style={{ color: GANTT[activeBar].color }}>{STAGES[activeBar].short} — {STAGES[activeBar].title}:</span>{" "}
            {STAGES[activeBar].desc}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── КАК СОЗДАЁТСЯ ДОРОЖНАЯ КАРТА (анимация потока) ──────────────────────────

const FLOW_STEPS = [
  { icon: "FileText", label: "Заказчик даёт вводные", color: "#3b82f6" },
  { icon: "Brain", label: "ИИ анализирует 500+ проектов", color: "#8b5cf6" },
  { icon: "Search", label: "Выявляются риски и сложности", color: "#ef4444" },
  { icon: "LayoutList", label: "Формируется структура работ", color: "#06b6d4" },
  { icon: "Clock", label: "Рассчитываются сроки", color: "#10b981" },
  { icon: "Wallet", label: "Формируется бюджет", color: "#f59e0b" },
  { icon: "Send", label: "КП готово — за минуты", color: "#22c55e" },
];

function FlowDiagram() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="flex flex-wrap justify-center gap-3 items-center">
      {FLOW_STEPS.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.15 }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: step.color + "22", border: `1.5px solid ${step.color}66` }}
            >
              <Icon name={step.icon as never} size={24} style={{ color: step.color }} />
            </div>
            <span className="text-xs text-slate-400 text-center max-w-[72px] leading-tight">{step.label}</span>
          </motion.div>
          {i < FLOW_STEPS.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.3, delay: i * 0.15 + 0.3 }}
              className="mb-5"
            >
              <Icon name="ChevronRight" size={18} className="text-slate-600" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── ОСНОВНАЯ СТРАНИЦА ────────────────────────────────────────────────────────

export default function Ref() {
  const [activeCase, setActiveCase] = useState(0);
  const [activeFilter, setActiveFilter] = useState("Все");

  const filters = ["Все", "Социальные объекты", "Медицина"];
  const filtered = activeFilter === "Все" ? CASES : CASES.filter((c) => c.type === activeFilter);

  return (
    <div className="min-h-screen bg-[#060d1a] text-white font-sans">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-screen flex flex-col justify-center px-6 py-24">
        {/* фон-сетка */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* градиент */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-400 text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Проектный институт нового поколения
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            <span className="text-white">DEOD</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              проектируем будущее
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Инжиниринговый холдинг полного цикла с 2007 года.
            Синергия 18-летнего опыта и ИИ-платформы проектирования.
          </motion.p>

          {/* STATS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {STATS.map((s, i) => (
              <div key={i} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl px-5 py-6 backdrop-blur">
                <div className="text-4xl font-black text-blue-400 mb-1">
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="text-xs text-slate-400 leading-tight">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex justify-center"
          >
            <div className="flex flex-col items-center gap-2 text-slate-500 text-sm">
              <span>Листайте вниз</span>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Icon name="ChevronDown" size={20} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ЧТО МЫ ПРОЕКТИРУЕМ ────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-900/40">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">Полный цикл</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Мы проектируем всё</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                От автомобильных дорог до объектов культурного наследия — любая сложность и масштаб
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DIRECTIONS.map((d, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="group bg-slate-800/50 hover:bg-slate-700/60 border border-slate-700/60 hover:border-blue-500/40 rounded-2xl p-5 transition-all duration-300 cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/15 flex items-center justify-center mb-3 group-hover:bg-blue-600/25 transition-colors">
                    <Icon name={d.icon as never} size={20} className="text-blue-400" />
                  </div>
                  <div className="font-bold text-sm mb-1">{d.title}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{d.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЭТАПЫ ПРОЕКТИРОВАНИЯ ──────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-3">Методология</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Все этапы проектирования</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Полное сопровождение — от технического задания до авторского надзора на стройплощадке
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-4 mb-16">
            {STAGES.map((s, i) => (
              <FadeIn key={s.id} delay={i * 0.08}>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
                      style={{ backgroundColor: s.color + "22", color: s.color, border: `1.5px solid ${s.color}55` }}
                    >
                      {s.short}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{s.title}</div>
                      <div className="text-xs text-slate-500">{s.days}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Ганта */}
          <FadeIn>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <Icon name="BarChart2" size={20} className="text-cyan-400" />
                <h3 className="font-bold text-lg">Пример дорожной карты проекта</h3>
                <span className="ml-auto text-xs text-slate-500 bg-slate-700/50 px-3 py-1 rounded-full">Наведите на этап</span>
              </div>
              <GanttChart />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── КАК СОЗДАЁТСЯ КП ──────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-br from-slate-900/60 to-blue-950/30">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3">Наша технология</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                КП и дорожная карта —{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  за минуты
                </span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Обычное бюро тратит дни и недели. Наша ИИ-платформа, обученная на базе 500+ проектов,
                анализирует вводные и мгновенно формирует структуру, сроки и бюджет.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 mb-10">
              <FlowDiagram />
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-4">
            {ADVANTAGES.map((a, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex gap-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 hover:border-blue-500/30 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-blue-600/15 flex items-center justify-center shrink-0">
                    <Icon name={a.icon as never} size={22} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">{a.title}</div>
                    <div className="text-sm text-slate-400 leading-relaxed">{a.desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── КЕЙСЫ ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">Портфолио</div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Реализованные проекты</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                500+ объектов по всей России — школы, больницы, промышленность, инфраструктура
              </p>
            </div>
          </FadeIn>

          {/* фильтры */}
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    activeFilter === f
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* grid кейсов */}
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="wait">
              {filtered.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group bg-slate-800/50 border border-slate-700/60 rounded-3xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/20 cursor-pointer"
                  onClick={() => setActiveCase(c.id - 1)}
                >
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={c.img}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-black/50 backdrop-blur text-slate-300 border border-slate-600/50">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="absolute bottom-3 right-3 text-xs font-bold text-blue-400 bg-black/60 backdrop-blur px-2 py-1 rounded-full">
                      {c.year}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="text-xs text-blue-400 font-semibold mb-1 uppercase tracking-wide">{c.type}</div>
                    <h3 className="font-bold text-base mb-1 leading-snug">{c.title}</h3>
                    <p className="text-xs text-slate-500 mb-3">{c.location}</p>
                    <ul className="space-y-1">
                      {c.items.slice(0, 3).map((item, j) => (
                        <li key={j} className="flex gap-2 text-xs text-slate-400">
                          <span className="text-blue-500 mt-0.5">›</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-slate-700/50 text-xs text-slate-500">
                      <span className="font-medium text-slate-400">Заказчик:</span> {c.client}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 p-12 text-center">
              <div className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-black mb-4">Готовы начать проект?</h2>
                <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                  Получите детальное КП и дорожную карту за несколько минут.
                  DEOD — синергия 18-летнего опыта и передовых технологий.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-sm font-medium">
                    <Icon name="CheckCircle" size={16} />
                    500+ реализованных проектов
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-sm font-medium">
                    <Icon name="CheckCircle" size={16} />
                    ИИ-платформа проектирования
                  </div>
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur rounded-2xl px-5 py-3 text-sm font-medium">
                    <Icon name="CheckCircle" size={16} />
                    С нами с 2007 года
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}