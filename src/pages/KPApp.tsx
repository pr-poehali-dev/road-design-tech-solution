import { useRef } from 'react';

const STAGE_COLORS = {
  stage1: { bg: '#1e40af', light: '#dbeafe', border: '#3b82f6', text: '#1e3a8a' },
  stage2: { bg: '#15803d', light: '#dcfce7', border: '#22c55e', text: '#14532d' },
  stage3: { bg: '#9333ea', light: '#f3e8ff', border: '#a855f7', text: '#6b21a8' },
  stage4: { bg: '#b45309', light: '#fef3c7', border: '#f59e0b', text: '#78350f' },
  milestone: { bg: '#dc2626', light: '#fee2e2', border: '#ef4444', text: '#991b1b' },
};

const TOTAL_DAYS = 110;

const ganttTasks = [
  // Этап 1
  { id: '1.1', label: '1.1 Анализ исходных данных', start: 1, end: 5, stage: 'stage1' },
  { id: '1.2', label: '1.2 Корректировка КР (поз.1.12)', start: 3, end: 20, stage: 'stage1' },
  { id: '1.3', label: '1.3 ОВ, ВК, ЭОМ (поз.1.12)', start: 5, end: 22, stage: 'stage1' },
  { id: '1.4', label: '1.4 Корректировка НВК (п.3 ТЗ)', start: 5, end: 30, stage: 'stage1' },
  { id: '1.5', label: '1.5 Корректировка ПЗУ (поз.7.1–7.8)', start: 5, end: 35, stage: 'stage1' },
  { id: '1.6', label: '1.6 Навес весов поз.2.37', start: 10, end: 30, stage: 'stage1' },
  { id: '1.7', label: '1.7 Пандус поз.2.38', start: 10, end: 32, stage: 'stage1' },
  { id: '1.8', label: '1.8 Формирование комплекта ПД/РД', start: 30, end: 38, stage: 'stage1' },
  { id: '1.9', label: '1.9 Согласование с Заказчиком', start: 35, end: 40, stage: 'stage1' },
  { id: '1.10', label: '1.10 Подача в ГГЭ (Этап 1)', start: 38, end: 38, stage: 'stage1', isMilestone: true },
  { id: '1.11', label: '1.11 Получение заключения ГГЭ', start: 45, end: 45, stage: 'stage1', isMilestone: true },
  // Этап 2
  { id: '2.1', label: '2.1 КР кровли 1.13, 1.14', start: 36, end: 50, stage: 'stage2' },
  { id: '2.2', label: '2.2 АР кровли', start: 38, end: 52, stage: 'stage2' },
  { id: '2.3', label: '2.3 Колесоотбойники (досм. ямы)', start: 40, end: 55, stage: 'stage2' },
  { id: '2.4', label: '2.4 Заземление оборудования СС', start: 40, end: 55, stage: 'stage2' },
  { id: '2.5', label: '2.5 ИБП и выключатели (навесы)', start: 42, end: 58, stage: 'stage2' },
  { id: '2.6', label: '2.6 Фундаменты постов (1.14)', start: 45, end: 60, stage: 'stage2' },
  { id: '2.7', label: '2.7 Теплосети (перенос КТ.3)', start: 50, end: 65, stage: 'stage2' },
  { id: '2.8', label: '2.8 Сети 10кВ (смещение ТП-96)', start: 50, end: 65, stage: 'stage2' },
  { id: '2.9', label: '2.9 Приямки, цоколь (поз.1.7)', start: 55, end: 70, stage: 'stage2' },
  { id: '2.10', label: '2.10 Приямки (поз.1.9)', start: 55, end: 70, stage: 'stage2' },
  { id: '2.11', label: '2.11 Кабельная трасса СС / лоток', start: 60, end: 75, stage: 'stage2' },
  { id: '2.12', label: '2.12 Гидроизоляция поз.2.32', start: 60, end: 75, stage: 'stage2' },
  { id: '2.13', label: '2.13 Шкаф СС на стене 2.14', start: 65, end: 80, stage: 'stage2' },
  { id: '2.14', label: '2.14 Перегородки, узлы примыкания', start: 65, end: 80, stage: 'stage2' },
  { id: '2.15', label: '2.15 Доработки 1.13/1.14 (комплекс)', start: 68, end: 80, stage: 'stage2' },
  { id: '2.16', label: '2.16 Формирование комплекта ПД+РД', start: 75, end: 80, stage: 'stage2' },
  { id: '2.17', label: '2.17 Подача в ГГЭ (Этап 2)', start: 78, end: 78, stage: 'stage2', isMilestone: true },
  { id: '2.18', label: '2.18 Получение заключения ГГЭ', start: 80, end: 80, stage: 'stage2', isMilestone: true },
  // Этап 3
  { id: '3.1', label: '3.1 Обследование мачты связи (1.23)', start: 81, end: 90, stage: 'stage3' },
  { id: '3.2', label: '3.2 Раздел «Энергоэффективность»', start: 85, end: 95, stage: 'stage3' },
  { id: '3.3', label: '3.3 Пояснительная записка (ПЗ)', start: 88, end: 98, stage: 'stage3' },
  { id: '3.4', label: '3.4 Свод и проверка всех разделов', start: 90, end: 98, stage: 'stage3' },
  { id: '3.5', label: '3.5 Подача в ГГЭ (Этап 3)', start: 95, end: 95, stage: 'stage3', isMilestone: true },
  { id: '3.6', label: '3.6 Получение заключения ГГЭ', start: 100, end: 100, stage: 'stage3', isMilestone: true },
  // Этап 4
  { id: '4.1', label: '4.1 Корректировка всех смет (xls, gsfx)', start: 101, end: 106, stage: 'stage4' },
  { id: '4.2', label: '4.2 Проверка достоверности смет (ГГЭ)', start: 106, end: 110, stage: 'stage4' },
  { id: '4.3', label: '4.3 Передача полного комплекта Заказчику', start: 110, end: 110, stage: 'stage4', isMilestone: true },
];

const milestones = [
  { day: 45, label: 'КТ 1: ГГЭ Этап 1', color: STAGE_COLORS.stage1.bg },
  { day: 80, label: 'КТ 2: ГГЭ Этап 2', color: STAGE_COLORS.stage2.bg },
  { day: 100, label: 'КТ 3: ГГЭ Этап 3', color: STAGE_COLORS.stage3.bg },
  { day: 110, label: 'КТ 4: Финал', color: STAGE_COLORS.stage4.bg },
];

const risks = [
  { risk: 'Задержка исходных данных от Заказчика (исполнительная съемка, ТУ)', prob: 'Средняя', impact: 'Высокое', measure: 'В договоре (п.4.2) — передача в течение 5 дней. ЦТЭСК запрашивает на 2-й день' },
  { risk: 'Длительное прохождение ГГЭ (свыше регламента)', prob: 'Средняя', impact: 'Среднее', measure: 'Пункт 6.2 КП: срок ГГЭ не зависит от Подрядчика. Закладываем параллельную работу' },
  { risk: 'Новые замечания ГКО (ФСБ, таможня) после подачи', prob: 'Низкая', impact: 'Высокое', measure: 'Пункт 4.3 КП — стоимость и сроки корректируются. Экспертное сопровождение минимизирует риск' },
  { risk: 'Несовместимость форматов (РД от Петроградпроекта)', prob: 'Низкая', impact: 'Среднее', measure: 'Используем исходные файлы из ГГЭ, при необходимости — реверс-инжиниринг (учтено в стоимости)' },
  { risk: 'Срыв сроков из-за погоды (Псковская область)', prob: 'Низкая', impact: 'Низкое', measure: 'Работы камеральные, полевые только обследования — закладываем запас 2–3 дня' },
];

const probColor = (prob: string) => {
  if (prob === 'Высокая') return '#dc2626';
  if (prob === 'Средняя') return '#d97706';
  return '#16a34a';
};

const impactBg = (impact: string) => {
  if (impact === 'Высокое') return '#fee2e2';
  if (impact === 'Среднее') return '#fef3c7';
  return '#dcfce7';
};

const stageLabels = [
  { stage: 'stage1', label: 'Этап 1', color: STAGE_COLORS.stage1 },
  { stage: 'stage2', label: 'Этап 2', color: STAGE_COLORS.stage2 },
  { stage: 'stage3', label: 'Этап 3', color: STAGE_COLORS.stage3 },
  { stage: 'stage4', label: 'Этап 4', color: STAGE_COLORS.stage4 },
];

const etapeSummary = [
  {
    num: '01',
    title: 'Корректировка КР, НВК, ПЗУ, 2.37/2.38',
    days: '1–45',
    color: STAGE_COLORS.stage1,
    tasks: 'КР по поз.1.12 (плита пола, фундаменты), разделы ОВ/ВК/ЭОМ, внутриплощадочные сети НВК (пп.3.1–3.6 КП), ПЗУ (пп.7.1–7.8 КП), навес весов 2.37, пандус 2.38',
    result: 'Положительное заключение ГГЭ (Этап 1)',
    payment: '30%',
  },
  {
    num: '02',
    title: 'Навесы, теплосети, 10кВ, приямки, СС',
    days: '1–80 (активная фаза: 36–80)',
    color: STAGE_COLORS.stage2,
    tasks: 'КР/АР кровли 1.13/1.14, колесоотбойники, заземление СС, ИБП, фундаменты постов 1.14, теплосети (перенос КТ.3), сети 10кВ, приямки, шкаф СС, перегородки',
    result: 'Положительное заключение ГГЭ (Этап 2)',
    payment: '30%',
  },
  {
    num: '03',
    title: 'Мачта связи, Энергоэффективность, ПЗ',
    days: '81–100',
    color: STAGE_COLORS.stage3,
    tasks: 'ТО мачты связи поз.1.23, раздел «Энергоэффективность», актуализация ПЗ по изменениям 2023–2026, свод и проверка всех разделов ПД и РД',
    result: 'Положительное заключение ГГЭ (Этап 3)',
    payment: '20%',
  },
  {
    num: '04',
    title: 'Сметная документация + проверка ГГЭ',
    days: '101–110',
    color: STAGE_COLORS.stage4,
    tasks: 'Корректировка всех локальных смет и ССР по итогам ГГЭ 2023–2026, проверка достоверности сметной стоимости в ФАУ «Главгосэкспертиза», передача полного комплекта',
    result: 'Положительное заключение ГГЭ (сметы) + передача Заказчику',
    payment: '20%',
  },
];

const keyFactors = [
  'Точное соответствие между КП и ТЗ — каждая позиция КП привязана к пункту ТЗ и к этапу',
  'Учёт требований производителей весов и ИДК (гильзы, закладные, водоотведение, обогрев) — прописано в ТЗ',
  'Параллельная работа с ГГЭ в режиме экспертного сопровождения — снижение времени на 30–40%',
  'Контроль разночтений диаметров (225/315, 250/225, 400/630) — прямое указание в КП, полностью исключено',
  'Резерв времени на согласование Техническим советом Заказчика (по ч.3.8 ст.49 ГрК) — учтено в этапах 1 и 2',
  'Предусмотрены дополнительные работы, не вошедшие в ТЗ — п.12 КП (перехватывающий лоток, кабельная трасса СС)',
  'Чёткое разделение стоимости по этапам — 30% / 30% / 20% / 20% — удобно для финансирования',
];

const deliverables = [
  'Откорректированная ПД (все разделы по Постановлению №87, с изменениями 2023–2026)',
  'Откорректированная РД (в объёме, достаточном для СМР)',
  'Сметная документация (локальные сметы, ССР, ведомости) с положительным заключением ГГЭ',
  'Сводный комплект актуализированных решений (перечень изменений с обоснованием)',
  'Электронная версия: USB + CD (PDF, DWG, Word, Excel, .gsfx, .gge)',
  'Бумажная версия: 3 экземпляра',
];

const LABEL_WIDTH = 280;
const ROW_HEIGHT = 28;
const ROW_GAP = 4;
const CHART_RIGHT_PAD = 20;

export default function KPApp() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const chartWidth = 900;
  const totalWidth = LABEL_WIDTH + chartWidth + CHART_RIGHT_PAD;
  const dayToX = (day: number) => LABEL_WIDTH + ((day - 1) / (TOTAL_DAYS - 1)) * chartWidth;

  const tickDays = [1, 10, 20, 30, 40, 45, 50, 60, 70, 80, 90, 100, 110];

  return (
    <>
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .print-page { page-break-after: always; }
          @page { size: A4 landscape; margin: 10mm; }
          html, body { font-size: 10px; }
        }
        .gantt-bar {
          transition: opacity 0.15s;
        }
        .gantt-bar:hover {
          opacity: 0.85;
        }
      `}</style>

      {/* Print Button */}
      <div className="no-print fixed top-4 right-4 z-50">
        <button
          onClick={handlePrint}
          style={{
            background: '#1e40af',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 22px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(30,64,175,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Скачать PDF / Печать
        </button>
      </div>

      <div ref={printRef} style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: "'Segoe UI', Arial, sans-serif", color: '#1e293b' }}>

        {/* ===== ОБЛОЖКА / ШАПКА ===== */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1e40af 100%)', color: '#fff', padding: '40px 48px 32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 320, height: 320, borderRadius: '50%', background: 'rgba(59,130,246,0.12)', transform: 'translate(80px,-80px)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '40%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', transform: 'translateY(60px)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24, position: 'relative' }}>
            <div style={{ flex: 1, minWidth: 320 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: '#93c5fd', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>
                Дорожная карта · план-график выполнения работ
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.25, margin: '0 0 12px', letterSpacing: -0.5 }}>
                Реконструкция АПП Бурачки<br />
                <span style={{ color: '#93c5fd' }}>Псковская область</span>
              </h1>
              <div style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.8 }}>
                <div><span style={{ color: '#fff', fontWeight: 600 }}>Исполнитель:</span> ООО «ЦТЭСК» · исх. №1114КП от 30.03.2026</div>
                <div><span style={{ color: '#fff', fontWeight: 600 }}>Заказчик:</span> АО «Росэлектроника» (в интересах ФГКУ Росгранстрой)</div>
                <div><span style={{ color: '#fff', fontWeight: 600 }}>Предмет:</span> Корректировка проектной, рабочей и сметной документации</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { val: '110', unit: 'календарных дней', label: 'Общий срок' },
                { val: '4', unit: 'этапа', label: 'Структура работ' },
                { val: '4', unit: 'заключения ГГЭ', label: 'Контрольные точки' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px', textAlign: 'center', minWidth: 110, border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, color: '#60a5fa' }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: '#93c5fd', marginTop: 2 }}>{s.unit}</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stage legend */}
          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap', position: 'relative' }}>
            {stageLabels.map(s => (
              <div key={s.stage} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: '4px 12px', fontSize: 12, border: `1px solid ${s.color.bg}40` }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color.bg }} />
                <span style={{ color: '#e2e8f0' }}>{s.label}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: '4px 12px', fontSize: 12, border: `1px solid ${STAGE_COLORS.milestone.bg}40` }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: STAGE_COLORS.milestone.bg }} />
              <span style={{ color: '#e2e8f0' }}>Контрольные точки (КТ)</span>
            </div>
          </div>
        </div>

        {/* ===== СОДЕРЖАНИЕ ===== */}
        <div style={{ padding: '32px 48px', maxWidth: 1400, margin: '0 auto' }}>

          {/* ===== КРАТКАЯ СТРУКТУРА ЭТАПОВ ===== */}
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', letterSpacing: -0.3, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 18, background: '#3b82f6', borderRadius: 2, display: 'inline-block' }} />
              Структура работ по этапам
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {etapeSummary.map(e => (
                <div key={e.num} style={{ background: '#fff', borderRadius: 12, border: `1.5px solid ${e.color.border}`, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                  <div style={{ background: e.color.bg, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>ЭТАП {e.num}</div>
                    <div style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>Дни {e.days}</div>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, fontSize: 12, color: e.color.text, marginBottom: 6 }}>{e.title}</div>
                    <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.6, marginBottom: 10 }}>{e.tasks}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${e.color.border}40`, paddingTop: 8, marginTop: 4 }}>
                      <div style={{ fontSize: 10, color: '#64748b' }}><span style={{ fontWeight: 600, color: e.color.text }}>Результат:</span> {e.result}</div>
                      <div style={{ background: e.color.light, color: e.color.text, fontWeight: 700, fontSize: 13, padding: '2px 10px', borderRadius: 6 }}>{e.payment}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ===== ДИАГРАММА ГАНТА ===== */}
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', letterSpacing: -0.3, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 18, background: '#3b82f6', borderRadius: 2, display: 'inline-block' }} />
              Диаграмма Ганта · 110 календарных дней
            </h2>

            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'auto', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
              <svg
                width={totalWidth}
                height={ganttTasks.length * (ROW_HEIGHT + ROW_GAP) + 60 + 30}
                style={{ display: 'block', minWidth: 900 }}
              >
                {/* Header bg */}
                <rect x={0} y={0} width={totalWidth} height={40} fill="#f1f5f9" />
                <rect x={0} y={0} width={LABEL_WIDTH} height={40} fill="#e2e8f0" />

                {/* Column header labels */}
                <text x={LABEL_WIDTH / 2} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">Задача / Подэтап</text>

                {/* Day ticks */}
                {tickDays.map(d => {
                  const x = dayToX(d);
                  return (
                    <g key={d}>
                      <line x1={x} y1={0} x2={x} y2={40} stroke="#cbd5e1" strokeWidth={1} />
                      <text x={x} y={26} textAnchor="middle" fontSize={9} fill="#64748b" fontWeight={600}>Д{d}</text>
                    </g>
                  );
                })}

                {/* Grid lines */}
                {ganttTasks.map((_, i) => {
                  const y = 40 + i * (ROW_HEIGHT + ROW_GAP);
                  return (
                    <rect key={i} x={0} y={y} width={totalWidth} height={ROW_HEIGHT} fill={i % 2 === 0 ? '#f8fafc' : '#fff'} />
                  );
                })}

                {/* Milestone vertical lines */}
                {milestones.map(m => {
                  const x = dayToX(m.day);
                  return (
                    <line key={m.day} x1={x} y1={40} x2={x} y2={ganttTasks.length * (ROW_HEIGHT + ROW_GAP) + 40} stroke={m.color} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.5} />
                  );
                })}

                {/* Stage section separators */}
                {[
                  { from: 0, to: 10, stage: 'stage1' },
                  { from: 11, to: 27, stage: 'stage2' },
                  { from: 28, to: 33, stage: 'stage3' },
                  { from: 34, to: 36, stage: 'stage4' },
                ].map((sec, i) => {
                  const y1 = 40 + sec.from * (ROW_HEIGHT + ROW_GAP);
                  const y2 = 40 + (sec.to + 1) * (ROW_HEIGHT + ROW_GAP);
                  const color = STAGE_COLORS[sec.stage as keyof typeof STAGE_COLORS];
                  return (
                    <rect key={i} x={0} y={y1} width={5} height={y2 - y1} fill={color.bg} rx={2} />
                  );
                })}

                {/* Tasks */}
                {ganttTasks.map((task, i) => {
                  const y = 40 + i * (ROW_HEIGHT + ROW_GAP) + 4;
                  const color = STAGE_COLORS[task.stage as keyof typeof STAGE_COLORS];
                  const x1 = dayToX(task.start);
                  const x2 = dayToX(task.end);
                  const barW = Math.max(x2 - x1, task.isMilestone ? 0 : 8);

                  return (
                    <g key={task.id}>
                      {/* Row label */}
                      <text x={10} y={y + ROW_HEIGHT / 2 + 4} fontSize={10} fill="#334155" fontWeight={task.isMilestone ? 700 : 400}>
                        {task.label}
                      </text>

                      {task.isMilestone ? (
                        // Diamond milestone
                        <g transform={`translate(${x1}, ${y + ROW_HEIGHT / 2})`}>
                          <polygon
                            points="0,-9 9,0 0,9 -9,0"
                            fill={color.bg}
                            stroke="#fff"
                            strokeWidth={1.5}
                          />
                        </g>
                      ) : (
                        <g className="gantt-bar">
                          {/* Bar */}
                          <rect
                            x={x1}
                            y={y + 3}
                            width={barW}
                            height={ROW_HEIGHT - 8}
                            rx={4}
                            fill={color.bg}
                            opacity={0.88}
                          />
                          {/* Duration label inside bar */}
                          {barW > 40 && (
                            <text x={x1 + barW / 2} y={y + ROW_HEIGHT / 2 + 3} textAnchor="middle" fontSize={9} fill="#fff" fontWeight={600}>
                              {task.start === task.end ? `Д${task.start}` : `Д${task.start}–${task.end}`}
                            </text>
                          )}
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Bottom: milestone labels */}
                {milestones.map(m => {
                  const x = dayToX(m.day);
                  const bottomY = ganttTasks.length * (ROW_HEIGHT + ROW_GAP) + 50;
                  return (
                    <g key={m.day}>
                      <polygon points={`${x},-6 ${x + 6},0 ${x},6 ${x - 6},0`} fill={m.color} transform={`translate(0, ${bottomY - 10})`} />
                      <text x={x} y={bottomY + 14} textAnchor="middle" fontSize={9} fill={m.color} fontWeight={700}>{m.label}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </section>

          {/* ===== ДЕТАЛЬНЫЙ ПЛАН ПО ЭТАПАМ ===== */}
          {[
            {
              num: 1, title: 'Корректировка КР, НВК, ПЗУ, 2.37/2.38', days: '1–45', color: STAGE_COLORS.stage1,
              note: 'Цель: получить локальное положительное заключение ГГЭ по наиболее критичным изменениям (позиции 1.12, НВК, 2.37, 2.38, ПЗУ)',
              checkpoint: 'День 45: положительное заключение ГГЭ по Этапу 1 + акт сдачи-приёмки',
              tasks: ganttTasks.filter(t => t.stage === 'stage1'),
            },
            {
              num: 2, title: 'Навесы, теплосети, 10кВ, приямки, СС', days: '1–80 (активная фаза: 36–80)', color: STAGE_COLORS.stage2,
              note: 'Этап идёт параллельно с Этапом 1. Основные работы стартуют после завершения Этапа 1 (День 36)',
              checkpoint: 'День 80: положительное заключение ГГЭ по Этапу 2 + акт сдачи-приёмки',
              tasks: ganttTasks.filter(t => t.stage === 'stage2'),
            },
            {
              num: 3, title: 'Мачта связи, Энергоэффективность, ПЗ', days: '81–100', color: STAGE_COLORS.stage3,
              note: 'Этап стартует после завершения Этапа 2',
              checkpoint: 'День 100: положительное заключение ГГЭ по Этапу 3 + акт',
              tasks: ganttTasks.filter(t => t.stage === 'stage3'),
            },
            {
              num: 4, title: 'Сметная документация + проверка достоверности', days: '101–110', color: STAGE_COLORS.stage4,
              note: 'Корректировка смет по итогам прохождения ГГЭ технической части за 2023–2026',
              checkpoint: 'День 110: положительное заключение ГГЭ на ПД+РД+сметы. Полный комплект документации передан Заказчику',
              tasks: ganttTasks.filter(t => t.stage === 'stage4'),
            },
          ].map(etap => (
            <section key={etap.num} style={{ marginBottom: 36 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ background: etap.color.bg, color: '#fff', borderRadius: 8, padding: '6px 18px', fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap' }}>
                  ЭТАП {etap.num} · Дни {etap.days}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{etap.title}</div>
              </div>
              <div style={{ background: etap.color.light, border: `1px solid ${etap.color.border}`, borderRadius: 8, padding: '8px 14px', fontSize: 12, color: etap.color.text, marginBottom: 10 }}>
                {etap.note}
              </div>
              <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#475569', width: 50 }}>№</th>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: '#475569' }}>Задача / Подэтап</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: '#475569', width: 120 }}>Дни</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: '#475569', width: 80 }}>Тип</th>
                    </tr>
                  </thead>
                  <tbody>
                    {etap.tasks.map((task, i) => (
                      <tr key={task.id} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                        <td style={{ padding: '7px 12px', color: etap.color.text, fontWeight: 700 }}>{task.id}</td>
                        <td style={{ padding: '7px 12px', color: '#1e293b' }}>{task.label.replace(/^\S+\s/, '')}</td>
                        <td style={{ padding: '7px 12px', textAlign: 'center' }}>
                          <span style={{ background: etap.color.light, color: etap.color.text, borderRadius: 5, padding: '2px 8px', fontWeight: 600, fontSize: 11 }}>
                            {task.start === task.end ? `День ${task.start}` : `Д${task.start}–${task.end}`}
                          </span>
                        </td>
                        <td style={{ padding: '7px 12px', textAlign: 'center' }}>
                          {task.isMilestone ? (
                            <span style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 5, padding: '2px 8px', fontSize: 10, fontWeight: 600 }}>Контр. точка</span>
                          ) : (
                            <span style={{ background: '#f1f5f9', color: '#64748b', borderRadius: 5, padding: '2px 8px', fontSize: 10 }}>Работа</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 10, background: '#0f172a', color: '#fff', borderRadius: 8, padding: '9px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>✅</span>
                <strong>Контрольная точка:</strong> {etap.checkpoint}
              </div>
            </section>
          ))}

          {/* ===== РИСКИ ===== */}
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', letterSpacing: -0.3, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 4, height: 18, background: '#ef4444', borderRadius: 2, display: 'inline-block' }} />
              Риски и компенсирующие меры
            </h2>
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#0f172a', color: '#fff' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700 }}>Риск</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, width: 100 }}>Вероятность</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, width: 100 }}>Влияние</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700 }}>Компенсирующая мера</th>
                  </tr>
                </thead>
                <tbody>
                  {risks.map((r, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fafafa' : '#fff' }}>
                      <td style={{ padding: '9px 14px', color: '#1e293b', lineHeight: 1.5 }}>{r.risk}</td>
                      <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                        <span style={{ background: '#f1f5f9', color: probColor(r.prob), fontWeight: 700, borderRadius: 5, padding: '2px 10px', fontSize: 11 }}>{r.prob}</span>
                      </td>
                      <td style={{ padding: '9px 14px', textAlign: 'center' }}>
                        <span style={{ background: impactBg(r.impact), color: '#475569', fontWeight: 600, borderRadius: 5, padding: '2px 10px', fontSize: 11 }}>{r.impact}</span>
                      </td>
                      <td style={{ padding: '9px 14px', color: '#475569', lineHeight: 1.5 }}>{r.measure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ===== КЛЮЧЕВЫЕ ФАКТОРЫ + РЕЗУЛЬТАТ ===== */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
            <section>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', letterSpacing: -0.3, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 4, height: 18, background: '#8b5cf6', borderRadius: 2, display: 'inline-block' }} />
                Ключевые факторы профессионализма
              </h2>
              <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                {keyFactors.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                    <div style={{ minWidth: 22, height: 22, background: '#8b5cf6', color: '#fff', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, marginTop: 1 }}>{i + 1}</div>
                    <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.55 }}>{f}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', letterSpacing: -0.3, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 4, height: 18, background: '#16a34a', borderRadius: 2, display: 'inline-block' }} />
                Результат, передаваемый Заказчику (День 110)
              </h2>
              <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                {deliverables.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                    <div style={{ minWidth: 20, marginTop: 3 }}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#dcfce7" /><path d="M8 12l3 3 5-5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.55 }}>{d}</div>
                  </div>
                ))}
              </div>

              {/* Финальный вывод */}
              <div style={{ marginTop: 16, background: 'linear-gradient(135deg, #0f172a, #1e3a8a)', borderRadius: 10, padding: '16px 20px', color: '#fff' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#93c5fd', marginBottom: 6 }}>Вывод</div>
                <div style={{ fontSize: 12, lineHeight: 1.65, color: '#cbd5e1' }}>
                  Предложенная дорожная карта позволяет выполнить работы строго за <strong style={{ color: '#60a5fa' }}>110 дней</strong> с получением всех необходимых положительных заключений ГГЭ и полным комплектом документации, готовой к строительству.
                </div>
              </div>
            </section>
          </div>

          {/* Подвал */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', flexWrap: 'wrap', gap: 8 }}>
            <div>ООО «ЦТЭСК» · исх. №1114КП от 30.03.2026 · Реконструкция АПП Бурачки, Псковская область</div>
            <div>Дата формирования: 30.03.2026</div>
          </div>
        </div>
      </div>
    </>
  );
}
