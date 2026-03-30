import { useRef } from "react";

/* ─────────────────────────── ЦВЕТА ─────────────────────────── */
const C = {
  navy:   "#0f172a",
  blue:   "#1e40af",
  blue2:  "#3b82f6",
  cyan:   "#0891b2",
  green:  "#15803d",
  purple: "#7c3aed",
  amber:  "#b45309",
  red:    "#dc2626",
  slate:  "#475569",
  light:  "#f1f5f9",
  white:  "#ffffff",
  border: "#e2e8f0",
};

const PHASE_COLORS = ["#1e40af","#0891b2","#15803d","#7c3aed","#b45309","#dc2626","#0f766e"];

/* ──────────────────── ДАННЫЕ ГАНТА ──────────────────────────── */
// start/end — рабочие дни от 0
const TOTAL = 210;
const ganttSections: { label: string; color: string; tasks: { id: string; label: string; start: number; end: number; milestone?: boolean }[] }[] = [
  {
    label: "0. Подготовка", color: PHASE_COLORS[0],
    tasks: [
      { id:"0.1", label:"Заключение договора, ИРД, обеспечение", start:0, end:5 },
      { id:"КТ0", label:"КТ0: Оргготовность", start:5, end:5, milestone:true },
    ],
  },
  {
    label: "1. Обследование (ТО)", color: PHASE_COLORS[1],
    tasks: [
      { id:"1.1", label:"ТО зданий, фундаментов, сетей", start:0, end:10 },
      { id:"КТ1", label:"КТ1: ТО завершено", start:10, end:10, milestone:true },
    ],
  },
  {
    label: "2.1 Этап 1 — ИДК, ВГК-РФ, Здание ТО", color: PHASE_COLORS[2],
    tasks: [
      { id:"2.1a", label:"Поз.1.12 (ИДК): ПД + РД + смета", start:5, end:30 },
      { id:"2.1b", label:"Поз.2.38 (ВГК Россия): ПД + РД", start:5, end:30 },
      { id:"2.1c", label:"Поз.1.10 (здание таможни): ПД + РД", start:5, end:30 },
      { id:"КТ2.1", label:"КТ2.1: ПД Этап 1 сдана", start:30, end:30, milestone:true },
    ],
  },
  {
    label: "2.2 Этап 2 — ВГК Латвия", color: PHASE_COLORS[3],
    tasks: [
      { id:"2.2a", label:"Поз.2.37 (ВГК Латвия): ПД + РД", start:30, end:45 },
      { id:"КТ2.2", label:"КТ2.2: ПД Этап 2 сдана", start:45, end:45, milestone:true },
    ],
  },
  {
    label: "2.3 Этап 3 — ПИДК, КНС", color: PHASE_COLORS[1],
    tasks: [
      { id:"2.3a", label:"Исключение ПИДК (поз.2.29, 2.30)", start:45, end:55 },
      { id:"2.3b", label:"КНС поз.2.43 + резервуар 2.21", start:45, end:55 },
      { id:"КТ2.3", label:"КТ2.3: ПД Этап 3 сдана", start:55, end:55, milestone:true },
    ],
  },
  {
    label: "2.4 Этап 4 — Навесы, Автодосмотр, МИДК, Инсинератор", color: PHASE_COLORS[4],
    tasks: [
      { id:"2.4a", label:"Навесы №10–13 (поз.1.13–1.16): КР, АР, ЭОМ, СС", start:55, end:85 },
      { id:"2.4b", label:"Автодосмотр поз.2.39–2.40: ЭС, ЭОМ", start:55, end:85 },
      { id:"2.4c", label:"Инсинератор поз.2.36: ПЗУ, ЭС, ЭН, ГП", start:55, end:85 },
      { id:"2.4d", label:"МИДК поз.2.7: ТО, КР, КЖ", start:55, end:85 },
      { id:"КТ2.4", label:"КТ2.4: ПД Этап 4 сдана", start:85, end:85, milestone:true },
    ],
  },
  {
    label: "2.5 Этап 5 — ПЗУ, ГП, ИОС, Мачта, ЭЭ", color: PHASE_COLORS[5],
    tasks: [
      { id:"2.5a", label:"Разделы ПЗУ / ГП (планировка, дороги, ворота)", start:85, end:115 },
      { id:"2.5b", label:"ИОС: НВК, ТС, ЭС/ЭН, СС (внутриплощадочные)", start:85, end:115 },
      { id:"2.5c", label:"Поз.1.23 (Мачта): ТО, усиление фундамента, КЖ/КМ", start:85, end:115 },
      { id:"2.5d", label:"Раздел ЭЭ (энергоэффективность)", start:85, end:115 },
      { id:"КТ2.5", label:"КТ2.5: Полный комплект ПД готов", start:115, end:115, milestone:true },
    ],
  },
  {
    label: "4. Сметы (параллельно)", color: PHASE_COLORS[6],
    tasks: [
      { id:"4a", label:"ЛСР, ВОР, ССР — все этапы (ресурсно-индексный метод)", start:0, end:115 },
    ],
  },
  {
    label: "5. Экспертиза (ГГЭ)", color: PHASE_COLORS[0],
    tasks: [
      { id:"5a", label:"Подача в ФАУ «Главгосэкспертиза России»", start:115, end:116 },
      { id:"5b", label:"Рассмотрение ПД (до 60 дн.)", start:116, end:176 },
      { id:"5c", label:"Проверка смет (до 30 дн., параллельно)", start:116, end:176 },
      { id:"5d", label:"Устранение замечаний ГГЭ", start:176, end:200 },
      { id:"КТ3", label:"КТ3: Положительное заключение ГГЭ", start:200, end:200, milestone:true },
    ],
  },
  {
    label: "7. Сдача-приёмка", color: PHASE_COLORS[4],
    tasks: [
      { id:"7a", label:"Подписание актов, передача комплекта ПСД", start:200, end:210 },
      { id:"КТ4", label:"КТ4: Итоговый акт подписан", start:210, end:210, milestone:true },
    ],
  },
];

/* ──────────────── ТАБЛИЦЫ / ДАННЫЕ ──────────────────────────── */
const normBase = [
  ["1","ГрК РФ, ст. 49","Экспертиза ПД, экспертное сопровождение"],
  ["2","Постановление № 87 от 16.02.2008 (ред. 21.10.2025)","Состав разделов ПД"],
  ["3","ГОСТ Р 21.1101-2013 (СПДС)","Требования к ПД и РД"],
  ["4","ГОСТ Р 21.101-2020","Правила внесения изменений в ПД"],
  ["5","СП 246.1325800.2023","Авторский надзор при строительстве"],
  ["6","Приказ Минстроя № 421/пр от 04.08.2020","Методика определения сметной стоимости"],
  ["7","Приказ Минстроя № 515/пр от 26.08.2025","Требования к заключению ГГЭ (с 07.03.2026)"],
  ["8","Федеральный закон № 384-ФЗ","Техрегламент о безопасности зданий"],
];

const capacity = [
  ["Легковые автомобили","1 620 ед./сутки","1 620 ед./сутки"],
  ["Автобусы","80 ед./сутки","80 ед./сутки"],
  ["Грузовые автомобили","300 ед./сутки","700 ед./сутки"],
  ["ИТОГО","2 000 ед./сутки","2 400 ед./сутки"],
];

const milestones = [
  ["КТ0","5","Договор, ИРД, ответственные назначены"],
  ["КТ1","10","ТО всех позиций завершено"],
  ["КТ2.1","30","ПД Этап 1 (ИДК, ВГК-РФ, здание ТО)"],
  ["КТ2.2","45","ПД Этап 2 (ВГК Латвия)"],
  ["КТ2.3","55","ПД Этап 3 (ПИДК исключён, КНС)"],
  ["КТ2.4","85","ПД Этап 4 (навесы, автодосмотр, МИДК)"],
  ["КТ2.5","115","Полный комплект ПД готов"],
  ["КТ3","~200","Положительное заключение ГГЭ"],
  ["КТ4","~210","Итоговый акт подписан, ПСД передана"],
];

const risks = [
  ["Несоответствие КР согласованным изменениям ТС","Высокая","Критическое","Доп. ТО + согласование до начала разработки"],
  ["Отсутствие электрической части в «Автодосмотре»","Высокая","Высокое","Разработка ЭОМ с нуля по ТЗ производителя"],
  ["Отсутствие фундаментов 4 постов у навесов","Высокая","Критическое","Детальное ТО, новые КР"],
  ["Неточности расположения объектов на ГП","Средняя","Среднее","Исполнительная съёмка, сверка с натурой"],
  ["Несогласование дорожной одежды","Средняя","Высокое","Расчёт лицензированной организацией"],
  ["Отказ ГГЭ в положительном заключении","Низкая","Критическое","Экспертное сопровождение с самого начала"],
  ["Просрочка этапов","Низкая","Высокое","10-дн. запас на каждый этап, параллельность"],
];

const errors = [
  ["КР не соответствует изменениям ТС","2.38","Корректировка с учётом глубины котлована"],
  ["Отсутствие фундаментов 4 постов","Навесы 1.13–1.16","Разработка новых фундаментов по ТО"],
  ["Отсутствие электрической части","2.39, 2.40","Разработка ЭОМ с нуля"],
  ["Отсутствие освещения, контура заземления","2.36","Разработка ЭС, ЭН"],
  ["Неверная привязка нового фундамента","2.38","Детальная разработка КЖ"],
];

const etaps = [
  { num:"0", name:"Подготовительный", days:"5", result:"Договор, ИРД, ответственные" },
  { num:"1", name:"Инженерно-техническое обследование", days:"7 (парал.)", result:"ТО по всем позициям" },
  { num:"2.1", name:"ПД Этап 1 — ИДК, ВГК-РФ, здание ТО", days:"25", result:"ПД+РД по поз. 1.12, 2.38, 1.10" },
  { num:"2.2", name:"ПД Этап 2 — ВГК Латвия", days:"15", result:"ПД+РД по поз. 2.37" },
  { num:"2.3", name:"ПД Этап 3 — ПИДК, КНС", days:"10", result:"Исключение ПИДК, ПД КНС" },
  { num:"2.4", name:"ПД Этап 4 — Навесы, Автодосмотр, МИДК", days:"30", result:"ПД по 8 объектам" },
  { num:"2.5", name:"ПД Этап 5 — ПЗУ, ГП, ИОС, Мачта, ЭЭ", days:"30", result:"ПД разделы 2, 5, 11" },
  { num:"3", name:"Рабочая документация (РД)", days:"После ГГЭ", result:"КЖ, КМ, КМД, АР, ЭОМ, ВК, ОВиК, СС, ГП" },
  { num:"4", name:"Сметная документация", days:"Парал. с ПД", result:"ЛСР, ССР — Excel, gsfx, gge" },
  { num:"5", name:"Экспертное сопровождение и ГГЭ", days:"60–90", result:"Положительное заключение ФАУ ГГЭ" },
  { num:"6", name:"Авторский надзор", days:"На период СМР", result:"Журнал авторского надзора" },
  { num:"7", name:"Сдача-приёмка", days:"После ГГЭ", result:"Подписанные Акты, ПСД передана" },
];

/* ─────────────────── HTML ДИАГРАММА ГАНТА ──────────────────── */
const TOTAL = 210;
const TICKS = [0,10,20,30,45,55,85,115,130,150,176,200,210];

function pct(d: number) { return `${(d / TOTAL * 100).toFixed(2)}%`; }

function GanttChart() {
  const rows: { type: "section"|"task"; label: string; color: string; start?: number; end?: number; milestone?: boolean }[] = [];
  ganttSections.forEach(sec => {
    rows.push({ type:"section", label:sec.label, color:sec.color });
    sec.tasks.forEach(t => rows.push({ type:"task", label:t.label, color:sec.color, start:t.start, end:t.end, milestone:t.milestone }));
  });

  const LABEL_PCT = "28%";
  const CHART_PCT = "72%";

  return (
    <div style={{ width:"100%", fontFamily:"'Segoe UI',Arial,sans-serif", fontSize:9, border:"1px solid #e2e8f0", borderRadius:8, overflow:"hidden" }}>
      {/* Header */}
      <div style={{ display:"flex", background:"#0f172a" }}>
        <div style={{ width:LABEL_PCT, flexShrink:0, padding:"5px 8px", color:"#94a3b8", fontWeight:700, fontSize:8.5, borderRight:"1px solid #1e293b" }}>ЗАДАЧА / ПОДЭТАП</div>
        <div style={{ flex:1, position:"relative", height:28 }}>
          {TICKS.map(d => (
            <div key={d} style={{ position:"absolute", left:pct(d), top:0, height:"100%", display:"flex", flexDirection:"column", alignItems:"center" }}>
              <div style={{ width:1, height:8, background:"#334155" }}/>
              <span style={{ fontSize:7, color:"#60a5fa", fontWeight:700, whiteSpace:"nowrap", marginTop:1 }}>Д{d}</span>
            </div>
          ))}
          <div style={{ position:"absolute", left:pct(115), top:0, bottom:0, width:1.5, background:"#f59e0b", opacity:0.8 }}/>
          <div style={{ position:"absolute", left:pct(200), top:0, bottom:0, width:1.5, background:"#22c55e", opacity:0.8 }}/>
        </div>
      </div>

      {/* Rows */}
      {rows.map((row, i) => {
        if (row.type === "section") {
          return (
            <div key={i} style={{ display:"flex", background:row.color+"2e", borderTop:"1px solid "+row.color+"44" }}>
              <div style={{ width:LABEL_PCT, flexShrink:0, padding:"4px 8px 4px 10px", borderLeft:`3px solid ${row.color}`, borderRight:"1px solid #e2e8f0" }}>
                <span style={{ fontSize:8, fontWeight:800, color:row.color, letterSpacing:0.3 }}>{row.label.toUpperCase()}</span>
              </div>
              <div style={{ flex:1, position:"relative" }}/>
            </div>
          );
        }

        const bg = i % 2 === 0 ? "#f8fafc" : "#fff";
        const left = pct(row.start!);
        const w = pct(Math.max(row.end! - row.start!, 0.5));

        return (
          <div key={i} style={{ display:"flex", background:bg, borderTop:"1px solid #f1f5f9", minHeight:18 }}>
            <div style={{ width:LABEL_PCT, flexShrink:0, padding:"3px 8px", borderRight:"1px solid #e2e8f0", color:"#334155", fontSize:8.5, lineHeight:1.3, display:"flex", alignItems:"center" }}>
              {row.label.length > 52 ? row.label.slice(0,52)+"…" : row.label}
            </div>
            <div style={{ flex:1, position:"relative", minHeight:18 }}>
              {/* grid lines */}
              {TICKS.map(d => (
                <div key={d} style={{ position:"absolute", left:pct(d), top:0, bottom:0, width:1, background:"#e2e8f0", opacity:0.6 }}/>
              ))}
              <div style={{ position:"absolute", left:pct(115), top:0, bottom:0, width:1.5, background:"#f59e0b", opacity:0.5 }}/>
              <div style={{ position:"absolute", left:pct(200), top:0, bottom:0, width:1.5, background:"#22c55e", opacity:0.5 }}/>

              {row.milestone ? (
                <div style={{ position:"absolute", left:left, top:"50%", transform:"translate(-50%,-50%) rotate(45deg)", width:8, height:8, background:row.color, border:"1.5px solid #fff" }}/>
              ) : (
                <div style={{ position:"absolute", left, top:"20%", width:w, height:"60%", background:row.color, borderRadius:3, opacity:0.85, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:6.5, color:"#fff", fontWeight:700, whiteSpace:"nowrap", padding:"0 3px" }}>
                    {row.start === row.end ? `Д${row.start}` : `${row.start}–${row.end}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Footer ticks */}
      <div style={{ display:"flex", background:"#f8fafc", borderTop:"1px solid #e2e8f0" }}>
        <div style={{ width:LABEL_PCT, flexShrink:0, padding:"3px 8px", borderRight:"1px solid #e2e8f0", fontSize:7.5, color:"#64748b" }}>
          ← 110 дн. (ПД) ··· ← 90 дн. (ГГЭ) ··· ← сдача →
        </div>
        <div style={{ flex:1, position:"relative", height:16 }}>
          {TICKS.map(d => (
            <div key={d} style={{ position:"absolute", left:pct(d), top:2, fontSize:7, color:"#64748b", transform:"translateX(-50%)", whiteSpace:"nowrap" }}>Д{d}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────── СТРАТЕГИЧЕСКАЯ БЛОК-СХЕМА (SVG) ─────────────── */
function StrategyFlow() {
  const phases = [
    { label:"ФАЗА 1\nСТАРТ ПРОЕКТА", sub:"Договор → ИРД → Назначение", color:"#1e40af" },
    { label:"ФАЗА 2\nКОРРЕКТИРОВКА\nЭТАПЫ 1–3", sub:"ИДК, ВГК-РФ, ВГК-ЛТ, ПИДК, КНС", color:"#0891b2" },
    { label:"ФАЗА 3\nМАСШТАБНЫЕ\nРАЗДЕЛЫ", sub:"Навесы, МИДК, ПЗУ, ГП, ИОС, Мачта", color:"#15803d" },
    { label:"ФАЗА 4\nЭКСПЕРТИЗА", sub:"ТС → ГГЭ → Замечания", color:"#7c3aed" },
    { label:"ФАЗА 5\nЗАВЕРШЕНИЕ", sub:"Заключение ГГЭ → Передача", color:"#b45309" },
  ];
  const W = 860, H = 110;
  const boxW = 140, boxH = 72, gap = 18;
  const totalUsed = phases.length * boxW + (phases.length-1) * gap;
  const startX = (W - totalUsed) / 2;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ display:"block", fontFamily:"'Segoe UI',Arial,sans-serif", maxWidth:"100%", height:"auto" }}>
      {phases.map((p, i) => {
        const x = startX + i * (boxW + gap);
        const y = (H - boxH) / 2;
        const lines = p.label.split("\n");
        const subLines = p.sub.split(", ");
        return (
          <g key={i}>
            <rect x={x} y={y} width={boxW} height={boxH} rx={8} fill={p.color} opacity={0.12} stroke={p.color} strokeWidth={1.5}/>
            {lines.map((l, li) => (
              <text key={li} x={x + boxW/2} y={y + 16 + li*13} textAnchor="middle" fontSize={9} fontWeight={800} fill={p.color}>{l}</text>
            ))}
            <text x={x + boxW/2} y={y + boxH - 18} textAnchor="middle" fontSize={7} fill="#475569">{subLines[0]}</text>
            {subLines[1] && <text x={x + boxW/2} y={y + boxH - 8} textAnchor="middle" fontSize={7} fill="#475569">{subLines[1]}</text>}
            {i < phases.length-1 && (
              <g>
                <line x1={x+boxW+2} y1={H/2} x2={x+boxW+gap-2} y2={H/2} stroke={p.color} strokeWidth={1.5} markerEnd="url(#arr)"/>
              </g>
            )}
          </g>
        );
      })}
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#64748b"/>
        </marker>
      </defs>
    </svg>
  );
}

/* ──────────── ПОЛНЫЙ ЦИКЛ (SVG) ─────────────────────────────── */
function CycleFlow() {
  const blocks = [
    { label:"Инженерно-техническое\nобследование (ТО)", norm:"СП 13-102\nГОСТ 31937", color:"#0891b2" },
    { label:"Проектная документация\n(стадия «П»)", norm:"Постановление № 87", color:"#1e40af" },
    { label:"Рабочая документация\n(стадия «Р»)", norm:"ГОСТ Р 21.1101", color:"#15803d" },
    { label:"Сметная\nдокументация", norm:"Минстрой № 421/пр\nФСНБ-2022", color:"#7c3aed" },
    { label:"Авторский надзор\n(по СП 246)", norm:"СП 246.1325800.2023", color:"#b45309" },
  ];
  const W = 860, H = 100;
  const boxW = 138, boxH = 68, gap = 18;
  const totalUsed = blocks.length * boxW + (blocks.length-1) * gap;
  const sx = (W - totalUsed) / 2;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ display:"block", fontFamily:"'Segoe UI',Arial,sans-serif", maxWidth:"100%", height:"auto" }}>
      <defs>
        <marker id="arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#94a3b8"/>
        </marker>
      </defs>
      {blocks.map((b, i) => {
        const x = sx + i * (boxW + gap);
        const y = (H - boxH) / 2;
        const ls = b.label.split("\n");
        const ns = b.norm.split("\n");
        return (
          <g key={i}>
            <rect x={x} y={y} width={boxW} height={boxH} rx={7} fill={b.color} opacity={0.1} stroke={b.color} strokeWidth={1.5}/>
            {ls.map((l,li)=> <text key={li} x={x+boxW/2} y={y+16+li*13} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={b.color}>{l}</text>)}
            {ns.map((n,ni)=> <text key={ni} x={x+boxW/2} y={y+boxH-14+ni*10} textAnchor="middle" fontSize={7} fill="#64748b">{n}</text>)}
            {i < blocks.length-1 && (
              <line x1={x+boxW+2} y1={H/2} x2={x+boxW+gap-2} y2={H/2} stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#arr2)"/>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ──────────── СХЕМА СДАЧИ-ПРИЁМКИ (SVG) ────────────────────── */
function AcceptFlow() {
  const W = 860, H = 130;
  const nodes = [
    { x:30, y:50, w:100, label:"Завершение\nэтапа", color:"#1e40af" },
    { x:155, y:50, w:110, label:"Уведомление\nЗаказчика", color:"#0891b2" },
    { x:292, y:50, w:120, label:"Предоставление\nдокументации", color:"#15803d" },
    { x:442, y:50, w:110, label:"Подписание\nАкта", color:"#7c3aed" },
    { x:582, y:50, w:90, label:"Есть\nзамечания?", color:"#b45309", diamond:true },
    { x:698, y:50, w:100, label:"Оплата\nэтапа ✓", color:"#15803d" },
  ];

  const dh = 36;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ display:"block", fontFamily:"'Segoe UI',Arial,sans-serif", maxWidth:"100%", height:"auto" }}>
      <defs>
        <marker id="arr3" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#94a3b8"/>
        </marker>
      </defs>
      {nodes.map((n, i) => {
        const cx = n.x + n.w/2;
        const cy = n.y + dh/2;
        const ls = n.label.split("\n");
        if (n.diamond) {
          return (
            <g key={i}>
              <polygon points={`${cx},${n.y} ${n.x+n.w},${cy} ${cx},${n.y+dh} ${n.x},${cy}`} fill={n.color} opacity={0.15} stroke={n.color} strokeWidth={1.5}/>
              {ls.map((l,li)=> <text key={li} x={cx} y={cy+li*11-4} textAnchor="middle" fontSize={8} fontWeight={700} fill={n.color}>{l}</text>)}
            </g>
          );
        }
        return (
          <g key={i}>
            <rect x={n.x} y={n.y} width={n.w} height={dh} rx={6} fill={n.color} opacity={0.12} stroke={n.color} strokeWidth={1.5}/>
            {ls.map((l,li)=> <text key={li} x={cx} y={cy+li*11-4} textAnchor="middle" fontSize={8} fontWeight={700} fill={n.color}>{l}</text>)}
          </g>
        );
      })}
      {/* Arrows between nodes */}
      {[0,1,2,3,4].map(i => {
        const a = nodes[i], b = nodes[i+1];
        return <line key={i} x1={a.x+a.w+1} y1={a.y+dh/2} x2={b.x-1} y2={b.y+dh/2} stroke="#94a3b8" strokeWidth={1.5} markerEnd="url(#arr3)"/>;
      })}
      {/* No → end */}
      <text x={nodes[4].x + nodes[4].w/2 + 16} y={nodes[4].y - 6} fontSize={8} fill="#15803d" fontWeight={700}>Нет</text>
      {/* Yes → back */}
      <text x={nodes[4].x + nodes[4].w/2} y={nodes[4].y + dh + 14} fontSize={8} fill="#dc2626" fontWeight={700}>Да → Рекламационный акт → Устранение → возврат</text>
    </svg>
  );
}

/* ──────────── ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ──────────────────── */
function SectionTitle({ children, color = C.blue }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, marginTop:28 }}>
      <div style={{ width:4, height:20, background:color, borderRadius:2, flexShrink:0 }}/>
      <h2 style={{ fontSize:14, fontWeight:800, color:C.navy, margin:0, letterSpacing:-0.3 }}>{children}</h2>
    </div>
  );
}

function Table({ cols, rows, headerBg = C.navy }: { cols: string[]; rows: string[][]; headerBg?: string }) {
  return (
    <div style={{ borderRadius:8, border:`1px solid ${C.border}`, overflow:"hidden", marginBottom:14 }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10.5 }}>
        <thead>
          <tr style={{ background:headerBg }}>
            {cols.map((c,i)=> <th key={i} style={{ padding:"7px 10px", color:"#fff", fontWeight:700, textAlign:"left", whiteSpace:"nowrap" }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,ri)=>(
            <tr key={ri} style={{ background: ri%2===0?"#f8fafc":"#fff", borderTop:`1px solid ${C.border}` }}>
              {row.map((cell,ci)=>(
                <td key={ci} style={{ padding:"6px 10px", color:C.slate, lineHeight:1.4, verticalAlign:"top" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  const light = color + "22";
  return <span style={{ background:light, color:color, borderRadius:4, padding:"1px 8px", fontSize:9.5, fontWeight:700 }}>{text}</span>;
}

function RiskBadge({ text }: { text: string }) {
  const c = text==="Высокая"||text==="Критическое" ? "#dc2626" : text==="Средняя"||text==="Высокое" ? "#d97706" : "#16a34a";
  return <Badge text={text} color={c}/>;
}

/* ══════════════════════ ГЛАВНЫЙ КОМПОНЕНТ ══════════════════════ */
export default function KPApp1() {
  const printRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <style>{`
        @media print {
          body { margin:0; padding:0; background:#fff; }
          .no-print { display:none !important; }
          * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
          @page { size:A4 landscape; margin:6mm 6mm 6mm 6mm; }
          html,body { font-size:8.5px; }
          .page-break { page-break-before: always; break-before: page; }
          .avoid-break { page-break-inside: avoid; break-inside: avoid; }
          svg { overflow: visible !important; max-width: 100% !important; height: auto !important; }
          div { box-sizing: border-box; }
        }
        body { margin:0; }
        table { border-collapse:collapse; }
      `}</style>

      {/* PRINT BUTTON */}
      <div className="no-print" style={{
        position:"fixed", top:16, right:16, zIndex:100,
        display:"flex", gap:10
      }}>
        <button onClick={()=>window.print()} style={{
          background:C.blue, color:"#fff", border:"none", borderRadius:8,
          padding:"10px 22px", fontSize:13, fontWeight:700, cursor:"pointer",
          boxShadow:"0 2px 12px rgba(30,64,175,0.35)", display:"flex", alignItems:"center", gap:8
        }}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Печать / PDF
        </button>
      </div>

      <div ref={printRef} style={{ background:"#f8fafc", minHeight:"100vh", fontFamily:"'Segoe UI',Arial,sans-serif", color:C.navy }}>

        {/* ═══════════════ СТРАНИЦА 1: ОБЛОЖКА + ВВОДНАЯ ЧАСТЬ ════════════ */}
        <div className="avoid-break" style={{
          background:`linear-gradient(135deg, ${C.navy} 0%, #1e3a8a 55%, ${C.blue} 100%)`,
          color:"#fff", padding:"36px 48px 28px", position:"relative", overflow:"hidden"
        }}>
          <div style={{ position:"absolute", top:-60, right:-60, width:280, height:280, borderRadius:"50%", background:"rgba(59,130,246,0.1)" }}/>
          <div style={{ position:"absolute", bottom:-40, left:"35%", width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:24, position:"relative" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:9, letterSpacing:3, color:"#93c5fd", fontWeight:700, marginBottom:6, textTransform:"uppercase" }}>
                Дорожная карта · Коммерческое предложение № 1114КП от 30.03.2026
              </div>
              <h1 style={{ fontSize:20, fontWeight:900, lineHeight:1.2, margin:"0 0 10px", letterSpacing:-0.5 }}>
                РАЗРАБОТКА И КОРРЕКТИРОВКА ПСД<br/>
                <span style={{ color:"#93c5fd", fontSize:16 }}>«Реконструкция АПП Бурачки», Псковская область</span>
              </h1>
              <div style={{ fontSize:11, color:"#cbd5e1", lineHeight:1.9 }}>
                <div><span style={{ color:"#fff", fontWeight:700 }}>Заказчик:</span> АО «Росэлектроника» (в интересах ФГКУ Росгранстрой)</div>
                <div><span style={{ color:"#fff", fontWeight:700 }}>Исполнитель:</span> ООО «ЦТЭСК» · Батырев М.В. · +7 910 436 35 53 · sale@sppi.ooo</div>
                <div><span style={{ color:"#fff", fontWeight:700 }}>Предмет:</span> Корректировка ПД + РД + сметы → Положительное заключение ФАУ «Главгосэкспертиза»</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:12, flexShrink:0 }}>
              {[
                { val:"110", unit:"дней", sub:"корректировка ПД" },
                { val:"~210", unit:"дней", sub:"до заключения ГГЭ" },
                { val:"7", unit:"этапов", sub:"структура работ" },
                { val:"9", unit:"КТ", sub:"контрольных точек" },
              ].map((s,i) => (
                <div key={i} style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.14)", borderRadius:10, padding:"12px 16px", textAlign:"center", minWidth:80 }}>
                  <div style={{ fontSize:26, fontWeight:900, color:"#60a5fa", lineHeight:1 }}>{s.val}</div>
                  <div style={{ fontSize:9, color:"#93c5fd", marginTop:2 }}>{s.unit}</div>
                  <div style={{ fontSize:8, color:"#64748b", marginTop:3 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding:"24px 48px 32px", maxWidth:1200, margin:"0 auto" }}>

          {/* ─── СТРАТЕГИЧЕСКАЯ БЛОК-СХЕМА ─── */}
          <SectionTitle color={C.blue}>1. Стратегическая дорожная карта</SectionTitle>
          <div className="avoid-break" style={{ background:"#fff", borderRadius:10, border:`1px solid ${C.border}`, padding:"16px 12px", overflowX:"auto", boxShadow:"0 1px 6px rgba(0,0,0,0.05)", marginBottom:20 }}>
            <StrategyFlow/>
          </div>

          {/* ─── НОРМАТИВНАЯ БАЗА + ПРОПУСКНАЯ СПОСОБНОСТЬ ─── */}
          <div className="avoid-break" style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:20, marginBottom:4 }}>
            <div>
              <SectionTitle color={C.cyan}>1.1. Нормативно-правовая база</SectionTitle>
              <Table
                cols={["№","Нормативный документ","Область регулирования"]}
                rows={normBase}
                headerBg={C.cyan}
              />
            </div>
            <div>
              <SectionTitle color={C.green}>1.2. Пропускная способность АПП</SectionTitle>
              <Table
                cols={["Категория ТС","Существующая","Планируемая"]}
                rows={capacity}
                headerBg={C.green}
              />
              <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8, padding:"8px 12px", fontSize:10, color:"#14532d" }}>
                <b>Режим работы:</b> круглосуточный, 365 дней в году.<br/>
                <b>Срок службы объекта:</b> не менее 50 лет.
              </div>
            </div>
          </div>

          {/* ═══ СТРАНИЦА 2: ДИАГРАММА ГАНТА ══════════════════════════════ */}
          <div className="page-break">
            <SectionTitle color={C.blue}>2. Диаграмма Ганта · 210 календарных дней</SectionTitle>
            <div style={{ borderRadius:10, overflow:"hidden", boxShadow:"0 1px 8px rgba(0,0,0,0.06)" }}>
              <GanttChart/>
            </div>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginTop:8, fontSize:9 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:20, height:10, background:C.blue, borderRadius:2, opacity:0.85 }}/> Корр. ПД (Этапы 1–5)
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:0, height:0, borderLeft:"7px solid transparent", borderRight:"7px solid transparent", borderBottom:"12px solid #dc2626" }}/>  Контрольная точка (КТ)
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:20, height:2, background:"#f59e0b", borderTop:"2px dashed #f59e0b" }}/> Д115: полный комплект ПД
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:20, height:2, borderTop:"2px dashed #22c55e" }}/> Д200: заключение ГГЭ
              </div>
            </div>
          </div>

          {/* ═══ СТРАНИЦА 3: СВОДНЫЙ ПЛАН + КОНТРОЛЬНЫЕ ТОЧКИ ════════════ */}
          <div className="page-break">
            <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:20 }}>
              <div className="avoid-break">
                <SectionTitle color={C.purple}>3. Сводный календарный план</SectionTitle>
                <div style={{ borderRadius:8, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10 }}>
                    <thead>
                      <tr style={{ background:C.purple }}>
                        <th style={{ padding:"7px 8px", color:"#fff", textAlign:"left", width:36 }}>Этап</th>
                        <th style={{ padding:"7px 8px", color:"#fff", textAlign:"left" }}>Наименование</th>
                        <th style={{ padding:"7px 8px", color:"#fff", textAlign:"center", width:80 }}>Срок</th>
                        <th style={{ padding:"7px 8px", color:"#fff", textAlign:"left" }}>Результат</th>
                      </tr>
                    </thead>
                    <tbody>
                      {etaps.map((e,i)=>(
                        <tr key={i} style={{ background:i%2===0?"#f8fafc":"#fff", borderTop:`1px solid ${C.border}` }}>
                          <td style={{ padding:"5px 8px", fontWeight:700, color:C.purple, fontSize:9.5 }}>{e.num}</td>
                          <td style={{ padding:"5px 8px", color:C.slate, lineHeight:1.4 }}>{e.name}</td>
                          <td style={{ padding:"5px 8px", textAlign:"center" }}>
                            <span style={{ background:"#f3e8ff", color:C.purple, borderRadius:4, padding:"1px 6px", fontSize:9, fontWeight:700 }}>{e.days}</span>
                          </td>
                          <td style={{ padding:"5px 8px", color:C.slate, fontSize:9.5, lineHeight:1.4 }}>{e.result}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:8, padding:"8px 12px", fontSize:10, color:"#1e3a8a", marginTop:8 }}>
                  <b>Общий срок:</b> 110 к.д. (корректировка ПД) + время на ГГЭ (~90 дн.)
                </div>
              </div>

              <div className="avoid-break">
                <SectionTitle color={C.red}>Контрольные точки (КТ)</SectionTitle>
                <div style={{ borderRadius:8, border:`1px solid ${C.border}`, overflow:"hidden" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10 }}>
                    <thead>
                      <tr style={{ background:C.red }}>
                        <th style={{ padding:"7px 8px", color:"#fff", textAlign:"left" }}>КТ</th>
                        <th style={{ padding:"7px 8px", color:"#fff", textAlign:"center" }}>День</th>
                        <th style={{ padding:"7px 8px", color:"#fff", textAlign:"left" }}>Результат</th>
                      </tr>
                    </thead>
                    <tbody>
                      {milestones.map((m,i)=>(
                        <tr key={i} style={{ background:i%2===0?"#fff5f5":"#fff", borderTop:`1px solid ${C.border}` }}>
                          <td style={{ padding:"5px 8px", fontWeight:800, color:C.red, fontSize:10 }}>{m[0]}</td>
                          <td style={{ padding:"5px 8px", textAlign:"center" }}>
                            <span style={{ background:"#fee2e2", color:C.red, borderRadius:4, padding:"1px 8px", fontSize:9.5, fontWeight:700 }}>{m[1]}</span>
                          </td>
                          <td style={{ padding:"5px 8px", color:C.slate, lineHeight:1.4, fontSize:9.5 }}>{m[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ─── ОШИБКИ ПРЕДЫДУЩЕГО ПРОЕКТИРОВАНИЯ ─── */}
            <div className="avoid-break" style={{ marginTop:20 }}>
              <SectionTitle color={C.red}>4. Ошибки предыдущего проектирования (ООО «ИС проект»)</SectionTitle>
              <Table
                cols={["Выявленная проблема","Позиция","Предлагаемое решение"]}
                rows={errors}
                headerBg={C.red}
              />
            </div>
          </div>

          {/* ═══ СТРАНИЦА 4: УПРАВЛЕНИЕ РИСКАМИ ══════════════════════════ */}
          <div className="page-break avoid-break">
            <SectionTitle color={C.amber}>5. Управление рисками</SectionTitle>
            <div style={{ borderRadius:8, border:`1px solid ${C.border}`, overflow:"hidden", marginBottom:20 }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10 }}>
                <thead>
                  <tr style={{ background:C.amber }}>
                    <th style={{ padding:"7px 10px", color:"#fff", textAlign:"left" }}>Риск</th>
                    <th style={{ padding:"7px 10px", color:"#fff", textAlign:"center", width:80 }}>Вероятность</th>
                    <th style={{ padding:"7px 10px", color:"#fff", textAlign:"center", width:80 }}>Влияние</th>
                    <th style={{ padding:"7px 10px", color:"#fff", textAlign:"left" }}>Стратегия минимизации</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map((r,i)=>(
                    <tr key={i} style={{ background:i%2===0?"#fafafa":"#fff", borderTop:`1px solid ${C.border}` }}>
                      <td style={{ padding:"6px 10px", color:C.slate, lineHeight:1.45 }}>{r[0]}</td>
                      <td style={{ padding:"6px 10px", textAlign:"center" }}><RiskBadge text={r[1]}/></td>
                      <td style={{ padding:"6px 10px", textAlign:"center" }}><RiskBadge text={r[2]}/></td>
                      <td style={{ padding:"6px 10px", color:C.slate, lineHeight:1.45, fontSize:9.5 }}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ─── СХЕМА СДАЧИ-ПРИЁМКИ ─── */}
            <SectionTitle color={C.green}>6. Процедура сдачи-приёмки работ по этапу</SectionTitle>
            <div style={{ background:"#fff", borderRadius:10, border:`1px solid ${C.border}`, padding:"16px 12px", overflowX:"auto", boxShadow:"0 1px 6px rgba(0,0,0,0.05)", marginBottom:20 }}>
              <AcceptFlow/>
            </div>

            {/* ─── СМЕТНЫЕ ФОРМАТЫ ─── */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
              <div>
                <SectionTitle color={C.cyan}>7. Выходные форматы сметной документации</SectionTitle>
                <Table
                  cols={["Формат","Программа","Назначение"]}
                  rows={[
                    ["Excel (.xls)","Microsoft Excel","Для работы Заказчика"],
                    ["gsfx","Гранд Смета","Для экспертизы"],
                    ["gge","Гранд Смета (ГГЭ)","Загрузка в АС «Госэкспертиза»"],
                  ]}
                  headerBg={C.cyan}
                />
              </div>
              <div>
                <SectionTitle color={C.green}>8. Состав рабочей документации (РД)</SectionTitle>
                <Table
                  cols={["Раздел","Содержание"]}
                  rows={[
                    ["КЖ","Конструкции железобетонные (фундаменты, плиты, приямки)"],
                    ["КМ / КМД","Конструкции металлические и деталировочные"],
                    ["АР","Архитектурные решения (планы, фасады, узлы)"],
                    ["ЭОМ","Электрооборудование и электроосвещение"],
                    ["ВК","Водоснабжение и канализация"],
                    ["ОВиК","Отопление, вентиляция, кондиционирование"],
                    ["СС","Сети связи"],
                    ["ГП / ТХ","Генеральный план, технологические решения"],
                  ]}
                  headerBg={C.green}
                />
              </div>
            </div>
          </div>

          {/* ═══ СТРАНИЦА 5: ПОЛНЫЙ ЦИКЛ + КЛЮЧЕВЫЕ ПРЕИМУЩЕСТВА ════════ */}
          <div className="page-break">
            <SectionTitle color={C.blue}>9. Полный цикл проектирования «под ключ»</SectionTitle>
            <div className="avoid-break" style={{ background:"#fff", borderRadius:10, border:`1px solid ${C.border}`, padding:"16px 12px", overflowX:"auto", boxShadow:"0 1px 6px rgba(0,0,0,0.05)", marginBottom:20 }}>
              <CycleFlow/>
            </div>

            <div className="avoid-break">
              <SectionTitle color={C.purple}>10. Ключевые преимущества ООО «ЦТЭСК»</SectionTitle>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:14 }}>
                {[
                  { num:"1", title:"Комплексное ТО", color:C.blue, text:"Полный цикл обследования: строительные конструкции, фундаменты, инженерные сети — по СП 13-102-2003, ГОСТ 31937-2011, включая мониторинг мачты связи (поз.1.23) и исполнительную съёмку." },
                  { num:"2", title:"Устранение ошибок предыдущего проектирования", color:C.red, text:"Выявлено 5 системных ошибок ООО «ИС проект»: отсутствие фундаментов, электрической части, неверная привязка фундаментов. Все устраняются в рамках КП." },
                  { num:"3", title:"Экспертное сопровождение ГГЭ (проактивно)", color:C.green, text:"Рамочный договор с ФАУ ГГЭ до начала разработки. Подача изменений по ч. 3.8 ст. 49 ГрК РФ — получение заключений в процессе, минимизация риска отказа." },
                  { num:"4", title:"Актуальная нормативная база 2026", color:C.purple, text:"ПД по Постановлению № 87 (ред. 21.10.2025), заключение ГГЭ по Приказу № 515/пр (с 07.03.2026), сметы по ФСНБ-2022 / ФГИС ЦС, авторский надзор по СП 246.1325800.2023." },
                  { num:"5", title:"Гарантия результата", color:C.amber, text:'Результат имеет ценность ТОЛЬКО при получении положительного заключения ГГЭ (п. 1.4 Договора). Гарантийный срок на результат — 5 лет (п. 8.4 Договора). Страхование ответственности.' },
                  { num:"6", title:"Конфиденциальность и лицензия ФСБ", color:C.cyan, text:"Наличие лицензии ФСБ России на работу со сведениями, составляющими государственную тайну. Соблюдение режима конфиденциальности в соответствии с условиями Договора." },
                ].map(a => (
                  <div key={a.num} className="avoid-break" style={{ background:"#fff", border:`1.5px solid ${a.color}22`, borderRadius:10, padding:"12px 14px", boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                      <div style={{ minWidth:26, height:26, background:a.color, color:"#fff", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, flexShrink:0 }}>{a.num}</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:11, color:a.color, marginBottom:4 }}>{a.title}</div>
                        <div style={{ fontSize:10, color:C.slate, lineHeight:1.55 }}>{a.text}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── УСЛОВИЯ ОПЛАТЫ ─── */}
            <div className="avoid-break" style={{ marginTop:20 }}>
              <SectionTitle color={C.green}>11. Условия оплаты и передачи результатов</SectionTitle>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div>
                  <Table
                    cols={["Носитель","Количество / Формат"]}
                    rows={[
                      ["Бумажный носитель","3 (три) экземпляра"],
                      ["Электронный (CD / USB)","1 экземпляр"],
                      ["Чертежи","DWG, PDF (AutoCAD)"],
                      ["Текст","DOC, PDF (Word)"],
                      ["Расчёты","XLS, PDF (Excel)"],
                      ["Сметы","XLS, gsfx, gge (Гранд Смета)"],
                    ]}
                    headerBg={C.green}
                  />
                </div>
                <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"14px 16px", fontSize:10.5, color:"#14532d", lineHeight:1.8 }}>
                  <div style={{ fontWeight:800, fontSize:12, marginBottom:8, color:C.green }}>Условия оплаты (п. 4.2 Договора)</div>
                  <div>Оплата этапа — в течение <b>7 рабочих дней</b> с даты подписания Сторонами последнего документа по этапу.</div>
                  <br/>
                  <div style={{ fontWeight:700, marginBottom:4 }}>Состав передаваемых документов по каждому этапу:</div>
                  <div>• Акт сдачи-приёмки (Приложение № 3 к Договору)</div>
                  <div>• Счёт на оплату</div>
                  <div>• Комплект ПД / РД / сметной документации</div>
                  <div>• Положительное заключение ГГЭ (финальный этап)</div>
                </div>
              </div>
            </div>

            {/* ─── ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ ─── */}
            <div className="avoid-break" style={{ marginTop:20, background:`linear-gradient(135deg, ${C.navy}, #1e3a8a)`, borderRadius:12, padding:"18px 24px", color:"#fff" }}>
              <div style={{ fontWeight:800, fontSize:13, color:"#93c5fd", marginBottom:10 }}>Заключительные положения</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div style={{ fontSize:10, color:"#cbd5e1", lineHeight:1.7 }}>
                  {[
                    "Получение положительного заключения ГГЭ — условие sine qua non (п. 1.4 Договора)",
                    "Соблюдение требований Постановления № 87 (ред. 21.10.2025) и актуальной нормативной базы",
                    "Конфиденциальность, в т.ч. сведений, составляющих государственную тайну",
                    "Гарантийный срок — 5 лет на результат (п. 8.4 Договора)",
                    "Страхование профессиональной ответственности проектировщика",
                  ].map((t,i) => <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}><span style={{ color:"#60a5fa" }}>✓</span><span>{t}</span></div>)}
                </div>
                <div style={{ fontSize:10, color:"#cbd5e1", lineHeight:1.7 }}>
                  <div style={{ fontWeight:700, color:"#93c5fd", marginBottom:6 }}>Контакты ООО «ЦТЭСК»</div>
                  <div>Генеральный директор: <b style={{ color:"#fff" }}>Батырев М.В.</b></div>
                  <div>Тел.: <b style={{ color:"#fff" }}>+7 910 436 35 53</b></div>
                  <div>Email: <b style={{ color:"#fff" }}>sale@sppi.ooo</b></div>
                  <br/>
                  <div style={{ fontSize:9, color:"#64748b" }}>
                    Настоящая Дорожная карта разработана на основе Договора № [номер] от 24.03.2026, ТЗ (Приложение № 1), Календарного плана (Приложение № 2) и КП № 1114КП от 30.03.2026.
                  </div>
                  <div style={{ fontSize:9, color:"#64748b", marginTop:4 }}>Дата: 30 марта 2026 г.</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}