import { useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Icon from "@/components/ui/icon";

const COLORS = {
  green: "#22c55e",
  yellow: "#eab308",
  blue: "#3b82f6",
  red: "#ef4444",
  gray: "#6b7280",
  orange: "#f97316",
};

const phases = [
  {
    id: 0,
    label: "Фаза 0",
    title: "Старт",
    date: "04.05.2026",
    color: COLORS.green,
    bg: "bg-green-950/40",
    border: "border-green-500/40",
    accent: "text-green-400",
    status: "done",
    items: [
      { icon: "CheckCircle", color: COLORS.green, text: "Аванс 40% — 700 000 руб. перечислен" },
      { icon: "CheckCircle", color: COLORS.green, text: "Исходные данные переданы в полном объёме" },
      { icon: "CheckCircle", color: COLORS.green, text: "Подрядчик подтвердил данные. Работы начаты." },
    ],
  },
  {
    id: 1,
    label: "Фаза 1",
    title: "Этап 1 — Планировка и дизайн-концепция",
    date: "04.05 – 19.05.2026",
    color: COLORS.blue,
    bg: "bg-blue-950/40",
    border: "border-blue-500/40",
    accent: "text-blue-400",
    status: "active",
    items: [
      { icon: "Clock", color: COLORS.blue, text: "К 13.05 — мудборды и планировочное решение" },
      { icon: "Send", color: COLORS.blue, text: "13.05 — направить на согласование" },
      { icon: "FileCheck", color: COLORS.yellow, text: "До 14.05 — письменное согласование Заказчика" },
      { icon: "PenTool", color: COLORS.blue, text: "14–18.05 — разработка концепции интерьера" },
      { icon: "Package", color: COLORS.blue, text: "18–19.05 — формирование результата и акта" },
      { icon: "CheckCircle", color: COLORS.blue, text: "19.05 — передача Заказчику" },
      { icon: "Clock", color: COLORS.yellow, text: "20–22.05 — приёмка (3 рабочих дня)" },
      { icon: "CreditCard", color: COLORS.green, text: "До 27.05 — оплата 30% (525 000 руб.)" },
    ],
  },
  {
    id: 2,
    label: "Фаза 2",
    title: "Этап 2 — Полный комплект проектной документации",
    date: "23.05 – 11.06.2026",
    color: COLORS.orange,
    bg: "bg-orange-950/40",
    border: "border-orange-500/40",
    accent: "text-orange-400",
    status: "pending",
    items: [
      { icon: "FileText", color: COLORS.orange, text: "Техническое задание на проектирование (ТЗ)" },
      { icon: "LayoutDashboard", color: COLORS.orange, text: "Архитектурные решения (АР)" },
      { icon: "Zap", color: COLORS.orange, text: "Электроснабжение и освещение (ЭОМ)" },
      { icon: "Droplets", color: COLORS.orange, text: "Водоснабжение и канализация (ВК)" },
      { icon: "Wind", color: COLORS.orange, text: "Отопление, вентиляция, кондиционирование (ОВиК)" },
      { icon: "Wifi", color: COLORS.orange, text: "Слаботочные системы (по необходимости)" },
      { icon: "Lightbulb", color: COLORS.orange, text: "Проект световой вывески и фасада" },
      { icon: "Wrench", color: COLORS.orange, text: "Проект механизации строительства (если применимо)" },
      { icon: "FolderOpen", color: COLORS.orange, text: "Сборка полного комплекта (бумага + PDF/DWG)" },
      { icon: "Clock", color: COLORS.yellow, text: "12–14.06 — приёмка (3 рабочих дня)" },
      { icon: "CreditCard", color: COLORS.green, text: "До 17.06 — окончательная оплата 30% (525 000 руб.)" },
    ],
  },
  {
    id: 3,
    label: "Фаза 3",
    title: "Согласование с арендодателем",
    date: "После 14.06.2026",
    color: COLORS.gray,
    bg: "bg-gray-800/40",
    border: "border-gray-500/40",
    accent: "text-gray-400",
    status: "future",
    items: [
      { icon: "Building2", color: COLORS.gray, text: "Заказчик подаёт документацию в администрацию МТК" },
      { icon: "RefreshCw", color: COLORS.gray, text: "При замечаниях — устранение в 10 рабочих дней" },
      { icon: "AlertTriangle", color: COLORS.yellow, text: "Новые требования арендодателя — оплачиваются отдельно" },
    ],
  },
  {
    id: 4,
    label: "Фаза 4",
    title: "Передача в строительство",
    date: "По завершении согласования",
    color: COLORS.gray,
    bg: "bg-gray-800/40",
    border: "border-gray-500/40",
    accent: "text-gray-400",
    status: "future",
    items: [
      { icon: "HardHat", color: COLORS.gray, text: "Заказчик использует готовую документацию" },
      { icon: "Info", color: COLORS.gray, text: "Подрядчик не отвечает за СМР (п. 1.4 договора)" },
    ],
  },
];

const ganttData = [
  { name: "Мудборды и планировка", start: 0, duration: 9, phase: 1, color: COLORS.blue },
  { name: "Согласование Заказчика", start: 9, duration: 1, phase: 1, color: COLORS.yellow },
  { name: "Концепция интерьера", start: 10, duration: 4, phase: 1, color: COLORS.blue },
  { name: "Результат Этапа 1 + акт", start: 14, duration: 2, phase: 1, color: COLORS.blue },
  { name: "Приёмка Этапа 1", start: 16, duration: 3, phase: 1, color: COLORS.yellow },
  { name: "Этап 2 — Проектирование", start: 19, duration: 20, phase: 2, color: COLORS.orange },
  { name: "Приёмка Этапа 2", start: 39, duration: 3, phase: 2, color: COLORS.yellow },
];

const paymentData = [
  { name: "Аванс 40%\n(оплачен 04.05)", value: 700000, color: COLORS.green },
  { name: "Этап 1 — 30%\n(до 27.05)", value: 525000, color: COLORS.blue },
  { name: "Этап 2 — 30%\n(до 17.06)", value: 525000, color: COLORS.orange },
];

const milestones = [
  { date: "04.05", label: "Старт работ", color: COLORS.green, done: true },
  { date: "13.05", label: "Мудборды на согласование", color: COLORS.blue, done: false },
  { date: "14.05", label: "Крайний срок согласования мудбордов", color: COLORS.yellow, done: false },
  { date: "19.05", label: "Сдача Этапа 1", color: COLORS.blue, done: false },
  { date: "22.05", label: "Крайний срок подписания акта Этапа 1", color: COLORS.yellow, done: false },
  { date: "27.05", label: "Оплата 30% по Этапу 1 (525 000 руб.)", color: COLORS.green, done: false },
  { date: "23.05", label: "Старт Этапа 2", color: COLORS.orange, done: false },
  { date: "11.06", label: "Сдача Этапа 2", color: COLORS.orange, done: false },
  { date: "14.06", label: "Крайний срок приёмки Этапа 2", color: COLORS.yellow, done: false },
  { date: "17.06", label: "Окончательная оплата (525 000 руб.)", color: COLORS.green, done: false },
];

const risks = [
  {
    icon: "FileSearch",
    color: COLORS.red,
    bg: "bg-red-950/40",
    border: "border-red-500/40",
    title: "Акт обследования точек",
    text: "Если не получен до 19.05 — работы останавливаются, сроки сдвигаются.",
    level: "Критично",
    levelColor: "text-red-400",
  },
  {
    icon: "Landmark",
    color: COLORS.red,
    bg: "bg-red-950/40",
    border: "border-red-500/40",
    title: "КГИОП",
    text: "Пункт 6.5 опасен. Любое упоминание — немедленно к руководителю.",
    level: "Критично",
    levelColor: "text-red-400",
  },
  {
    icon: "Clock",
    color: COLORS.yellow,
    bg: "bg-yellow-950/40",
    border: "border-yellow-500/40",
    title: "Автоматическая приёмка",
    text: "Если Заказчик не подписал акт и не дал замечания в течение 3 рабочих дней — результат считается принятым.",
    level: "Важно",
    levelColor: "text-yellow-400",
  },
];

const CustomGanttBar = (props: { x?: number; y?: number; width?: number; height?: number; fill?: string }) => {
  const { x, y, width, height, fill } = props;
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} />;
};

export default function Dpadel() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm 10mm; }
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-page { background: white !important; color: black !important; }
          .print-card { border: 1px solid #e5e7eb !important; background: #f9fafb !important; color: black !important; }
          .print-text { color: black !important; }
          .print-muted { color: #374151 !important; }
        }
      `}</style>

      <div ref={printRef} className="max-w-5xl mx-auto px-4 py-8 print-page">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎾</span>
              <span className="text-xs uppercase tracking-widest text-gray-500 print-muted">Проектная документация</span>
            </div>
            <h1 className="text-3xl font-bold text-white print-text">Дорожная карта проекта</h1>
            <h2 className="text-xl text-blue-400 font-semibold mt-1">Падел-теннис — ООО «Невский Падел»</h2>
            <p className="text-sm text-gray-400 mt-2 print-muted">
              Исполнитель: ООО «ЦТЭСК» &nbsp;·&nbsp; Арендодатель: ООО «ГМ «СПЛАВ»
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="no-print flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            <Icon name="Download" size={16} />
            Скачать PDF
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Общая стоимость", value: "1 750 000 ₽", icon: "Wallet", color: "text-green-400" },
            { label: "Этап 1", value: "15 к.д.", icon: "Calendar", color: "text-blue-400" },
            { label: "Этап 2", value: "20 к.д.", icon: "Calendar", color: "text-orange-400" },
            { label: "Завершение", value: "17.06.2026", icon: "Flag", color: "text-yellow-400" },
          ].map((card) => (
            <div key={card.label} className="bg-gray-900 border border-gray-700 rounded-xl p-4 print-card">
              <div className="flex items-center gap-2 mb-1">
                <Icon name={card.icon} size={16} className={card.color} />
                <span className="text-xs text-gray-400 print-muted">{card.label}</span>
              </div>
              <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Payment chart */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6 print-card">
          <h3 className="text-base font-semibold text-white print-text mb-4 flex items-center gap-2">
            <Icon name="PieChart" size={18} className="text-green-400" />
            График платежей
          </h3>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-72 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value.toLocaleString("ru-RU")} руб.`}
                    contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: "#9ca3af", fontSize: 12 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {paymentData.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-gray-300 print-muted">{p.name.replace("\n", " ")}</span>
                      <span className="text-sm font-semibold text-white print-text">{p.value.toLocaleString("ru-RU")} ₽</span>
                    </div>
                    <div className="mt-1 h-1.5 bg-gray-800 rounded-full">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: `${(p.value / 1750000) * 100}%`, backgroundColor: p.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-700 flex justify-between">
                <span className="text-xs text-gray-400 print-muted">Итого</span>
                <span className="text-sm font-bold text-white print-text">1 750 000 ₽</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gantt */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6 print-card">
          <h3 className="text-base font-semibold text-white print-text mb-4 flex items-center gap-2">
            <Icon name="BarChart2" size={18} className="text-blue-400" />
            Диаграмма Ганта
          </h3>
          <div className="space-y-2">
            {ganttData.map((item, i) => {
              const total = 42;
              const leftPct = (item.start / total) * 100;
              const widthPct = (item.duration / total) * 100;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="text-xs text-gray-400 print-muted w-44 shrink-0 text-right leading-tight">{item.name}</div>
                  <div className="flex-1 h-7 bg-gray-800 rounded-lg relative overflow-hidden">
                    <div
                      className="absolute top-1 bottom-1 rounded"
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                        backgroundColor: item.color,
                        opacity: 0.85,
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="flex gap-3 mt-2">
              <div className="w-44 shrink-0" />
              <div className="flex-1 flex justify-between text-xs text-gray-500 print-muted px-1">
                <span>04.05</span>
                <span>13.05</span>
                <span>22.05</span>
                <span>01.06</span>
                <span>11.06</span>
                <span>14.06</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.blue }} /><span className="text-xs text-gray-400 print-muted">Этап 1</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.yellow }} /><span className="text-xs text-gray-400 print-muted">Согласование / приёмка</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS.orange }} /><span className="text-xs text-gray-400 print-muted">Этап 2</span></div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6 print-card">
          <h3 className="text-base font-semibold text-white print-text mb-4 flex items-center gap-2">
            <Icon name="Flag" size={18} className="text-yellow-400" />
            Контрольные даты
          </h3>
          <div className="space-y-3">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="mt-0.5 w-16 text-xs font-mono font-semibold shrink-0 text-right"
                  style={{ color: m.color }}
                >
                  {m.date}
                </div>
                <div className="flex items-start gap-2 flex-1">
                  <div className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  <span className="text-sm text-gray-300 print-muted leading-snug">{m.label}</span>
                  {m.done && (
                    <span className="ml-auto text-xs text-green-400 font-medium whitespace-nowrap">✓ выполнено</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-4 mb-6">
          {phases.map((phase) => (
            <div key={phase.id} className={`${phase.bg} border ${phase.border} rounded-xl p-5 print-card`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className={`text-xs font-semibold uppercase tracking-widest ${phase.accent}`}>{phase.label}</span>
                  <h4 className="text-base font-semibold text-white print-text mt-0.5">{phase.title}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 print-muted">{phase.date}</span>
                  {phase.status === "done" && (
                    <div className="mt-1 text-xs font-medium text-green-400">✓ Завершено</div>
                  )}
                  {phase.status === "active" && (
                    <div className="mt-1 text-xs font-medium text-blue-400">● В работе</div>
                  )}
                  {phase.status === "pending" && (
                    <div className="mt-1 text-xs font-medium text-gray-500">○ Ожидание</div>
                  )}
                  {phase.status === "future" && (
                    <div className="mt-1 text-xs font-medium text-gray-600">◇ Будущее</div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {phase.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Icon name={item.icon} size={14} className="mt-0.5 shrink-0" style={{ color: item.color }} />
                    <span className="text-xs text-gray-300 print-muted leading-snug">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Risks */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-white print-text mb-3 flex items-center gap-2">
            <Icon name="AlertTriangle" size={18} className="text-red-400" />
            Риски и предупреждения
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {risks.map((r, i) => (
              <div key={i} className={`${r.bg} border ${r.border} rounded-xl p-4 print-card`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={r.icon} size={16} style={{ color: r.color }} />
                  <span className={`text-xs font-bold uppercase tracking-wide ${r.levelColor}`}>{r.level}</span>
                </div>
                <div className="text-sm font-semibold text-white print-text mb-1">{r.title}</div>
                <div className="text-xs text-gray-400 print-muted leading-relaxed">{r.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-600 print-muted pt-4 border-t border-gray-800">
          Карта сформирована: 12.05.2026 &nbsp;·&nbsp; ООО «ЦТЭСК» × ООО «Невский Падел»
        </div>
      </div>
    </div>
  );
}