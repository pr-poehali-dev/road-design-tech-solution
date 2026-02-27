import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const GENERATE_KP_URL = 'https://functions.poehali.dev/f595b8a7-903c-4870-b1f7-d0aac554463f';

// ─── Типы ───────────────────────────────────────────────────────────────────

interface SubSection {
  code: string;
  name: string;
  gostRef?: string;
  pp87?: string;
  type?: 'pz' | 'ar' | 'kr' | 'ios' | 'smeta' | 'spec' | 'schema' | 'izisk';
}

interface SectionDef {
  code: string;
  name: string;
  icon: string;
  phaseId: number | string;
  duration: string;
  deliverables: string[];
  tasks: string[];
  responsible: string;
  subSections: SubSection[];
}

interface Document {
  id: string;
  phaseId: number | string;
  section: string;
  sectionCode: string;
  subCode?: string;
  subName?: string;
  status: 'draft' | 'review' | 'approved' | 'rejected';
  content: string;
  contentType: 'html' | 'text';
  aiGenerated: boolean;
  version: number;
  createdAt: string;
}

interface RoadmapPhase {
  id: number;
  name: string;
  duration: string;
  start_month: number;
  end_month: number;
  tasks: string[];
  deliverables: string[];
  responsible: string;
  section_codes?: string[];
}

interface ProjectContext {
  kpData?: Record<string, unknown> | null;
  roadmapData?: Record<string, unknown> | null;
  filesText?: string;
  kpId?: string;
}

interface ProductionModuleProps {
  projectContext?: ProjectContext | null;
}

// ─── Подразделы по ПП РФ №87 ────────────────────────────────────────────────

const SUBSECTIONS_PD: SubSection[] = [
  { code: 'ПЗ', name: 'Пояснительная записка', gostRef: 'ГОСТ Р 21.1101', pp87: 'Раздел 1', type: 'pz' },
  { code: 'СПОЗУ', name: 'Схема планировочной организации ЗУ', gostRef: 'ГОСТ 21.508', pp87: 'Раздел 2', type: 'schema' },
  { code: 'АР', name: 'Архитектурные решения', gostRef: 'ГОСТ 21.501', pp87: 'Раздел 3', type: 'ar' },
  { code: 'КР', name: 'Конструктивные и объёмно-планировочные решения', gostRef: 'ГОСТ 21.501', pp87: 'Раздел 4', type: 'kr' },
  { code: 'ИОС1', name: 'Система электроснабжения', gostRef: 'ГОСТ 21.614', pp87: 'Раздел 5.1', type: 'ios' },
  { code: 'ИОС2', name: 'Система водоснабжения и водоотведения', gostRef: 'СП 31, СП 32', pp87: 'Раздел 5.2', type: 'ios' },
  { code: 'ИОС3', name: 'Отопление, вентиляция, кондиционирование', gostRef: 'СП 60.13330', pp87: 'Раздел 5.3', type: 'ios' },
  { code: 'ИОС4', name: 'Сети связи', gostRef: 'ПУЭ, СП 5', pp87: 'Раздел 5.4', type: 'ios' },
  { code: 'ИОС5', name: 'Системы газоснабжения', gostRef: 'СП 62.13330', pp87: 'Раздел 5.5', type: 'ios' },
  { code: 'ТХ', name: 'Технологические решения', gostRef: 'ГОСТ Р 15.301', pp87: 'Раздел 6', type: 'spec' },
  { code: 'ПОС', name: 'Проект организации строительства', gostRef: 'СП 48.13330', pp87: 'Раздел 7', type: 'pz' },
  { code: 'ПОД', name: 'Проект организации работ по сносу', gostRef: 'МДС 12-43.2008', pp87: 'Раздел 8', type: 'pz' },
  { code: 'ООС', name: 'Мероприятия по охране окружающей среды', gostRef: 'СП 502', pp87: 'Раздел 9', type: 'pz' },
  { code: 'МОПБ', name: 'Мероприятия по обеспечению пожарной безопасности', gostRef: 'СП 1, СП 2, СП 3', pp87: 'Раздел 9', type: 'pz' },
  { code: 'МДИ', name: 'Мероприятия для инвалидов', gostRef: 'СП 59.13330', pp87: 'Раздел 10', type: 'pz' },
  { code: 'ССР', name: 'Сводный сметный расчёт', gostRef: 'МДС 81-35.2004', pp87: 'Раздел 11', type: 'smeta' },
  { code: 'ИД', name: 'Иная документация', gostRef: 'ПП РФ №87', pp87: 'Раздел 12', type: 'pz' },
];

const SUBSECTIONS_RD: SubSection[] = [
  { code: 'ГП', name: 'Генеральный план и транспорт', gostRef: 'ГОСТ 21.508-93', type: 'schema' },
  { code: 'АС', name: 'Архитектурно-строительные решения', gostRef: 'ГОСТ 21.501-2018', type: 'ar' },
  { code: 'КЖ', name: 'Конструкции железобетонные', gostRef: 'ГОСТ 21.501', type: 'kr' },
  { code: 'КМ', name: 'Конструкции металлические', gostRef: 'ГОСТ 21.502-2016', type: 'kr' },
  { code: 'КД', name: 'Конструкции деревянные', gostRef: 'СП 64.13330', type: 'kr' },
  { code: 'ЭО', name: 'Электрооборудование', gostRef: 'ГОСТ 21.614-88', type: 'ios' },
  { code: 'ЭМ', name: 'Электромонтажные работы', gostRef: 'ГОСТ 21.614-88', type: 'ios' },
  { code: 'ОВ', name: 'Отопление и вентиляция', gostRef: 'ГОСТ 21.602-2016', type: 'ios' },
  { code: 'ВК', name: 'Водопровод и канализация', gostRef: 'ГОСТ 21.604-82', type: 'ios' },
  { code: 'ГС', name: 'Газоснабжение', gostRef: 'ГОСТ 21.609-83', type: 'ios' },
  { code: 'СС', name: 'Сети связи и сигнализации', gostRef: 'РМ 4-59-96', type: 'ios' },
  { code: 'ТМ', name: 'Технологические трубопроводы', gostRef: 'ГОСТ 21.401', type: 'ios' },
  { code: 'АТХ', name: 'Автоматизация технологических процессов', gostRef: 'ГОСТ 21.408-2013', type: 'ios' },
  { code: 'ЛСР', name: 'Локальные сметные расчёты', gostRef: 'МДС 81-35.2004', type: 'smeta' },
];

const SUBSECTIONS_II: SubSection[] = [
  { code: 'ИГДИ', name: 'Инженерно-геодезические изыскания', gostRef: 'СП 47.13330.2016', type: 'izisk' },
  { code: 'ИГИ', name: 'Инженерно-геологические изыскания', gostRef: 'СП 47.13330.2016', type: 'izisk' },
  { code: 'ИЭИ', name: 'Инженерно-экологические изыскания', gostRef: 'СП 502.1325800.2021', type: 'izisk' },
  { code: 'ИГМИ', name: 'Инженерно-гидрометеорологические изыскания', gostRef: 'СП 33-101-2003', type: 'izisk' },
  { code: 'ИГЭ', name: 'Технический отчёт по ИГЭ', gostRef: 'ГОСТ 25100-2011', type: 'pz' },
];

const SUBSECTIONS_GE: SubSection[] = [
  { code: 'ЗГЭ', name: 'Заключение государственной экспертизы', gostRef: 'ГрК РФ ст.49', type: 'pz' },
  { code: 'ЗГЭ-ЭО', name: 'Заключение по экологической экспертизе', gostRef: 'ФЗ №174-ФЗ', type: 'pz' },
  { code: 'СОПР', name: 'Сопровождение замечаний экспертизы', gostRef: 'ПП РФ №145', type: 'pz' },
];

const SUBSECTIONS_AN: SubSection[] = [
  { code: 'ЖАН', name: 'Журнал авторского надзора', gostRef: 'СП 11-110-99', type: 'pz' },
  { code: 'АО', name: 'Акты освидетельствования', gostRef: 'СП 48.13330', type: 'pz' },
  { code: 'ОТП', name: 'Отступления от проекта', gostRef: 'СП 11-110-99', type: 'pz' },
];

function getSubSectionsForPhase(phaseName: string, deliverables: string[]): SubSection[] {
  const n = phaseName.toLowerCase();
  if (n.includes('изыскани')) return SUBSECTIONS_II;
  if (n.includes('рабоч')) return SUBSECTIONS_RD;
  if (n.includes('проектн') || n.includes('пд') || n.includes('проект')) return SUBSECTIONS_PD;
  if (n.includes('экспертиз')) return SUBSECTIONS_GE;
  if (n.includes('авторск') || n.includes('надзор')) return SUBSECTIONS_AN;
  // fallback — из deliverables
  if (deliverables.length > 0) {
    return deliverables.slice(0, 10).map((d, i) => ({ code: `${i + 1}`, name: d, type: 'pz' as const }));
  }
  return SUBSECTIONS_PD;
}

function getPhaseIcon(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('изыскани')) return 'Search';
  if (n.includes('архитект') || n.includes('планир')) return 'Layout';
  if (n.includes('конструк')) return 'Wrench';
  if (n.includes('электр')) return 'Zap';
  if (n.includes('вентил') || n.includes('отоплени')) return 'Wind';
  if (n.includes('водо') || n.includes('канали')) return 'Droplets';
  if (n.includes('экспертиз')) return 'CheckSquare';
  if (n.includes('авторск') || n.includes('надзор')) return 'Eye';
  if (n.includes('смета') || n.includes('сметн')) return 'Calculator';
  if (n.includes('экологи')) return 'Leaf';
  if (n.includes('пожар')) return 'Flame';
  if (n.includes('рабоч')) return 'Hammer';
  return 'FileText';
}

const statusLabels: Record<Document['status'], { label: string; cls: string }> = {
  draft: { label: 'Черновик', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  review: { label: 'На проверке', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  approved: { label: 'Утверждён', cls: 'bg-green-500/10 text-green-400 border-green-500/30' },
  rejected: { label: 'Отклонён', cls: 'bg-red-500/10 text-red-400 border-red-500/30' },
};

const typeIcon: Record<string, string> = {
  pz: 'FileText', ar: 'Layout', kr: 'Wrench', ios: 'Zap',
  smeta: 'Calculator', spec: 'Package', schema: 'Map', izisk: 'Search',
};

// ─── Штамп ГОСТ 21.1101-2013 ────────────────────────────────────────────────

function buildGostStamp(params: {
  projectName: string;
  client: string;
  sectionCode: string;
  sectionName: string;
  subCode?: string;
  subName?: string;
  status: string;
  version: number;
  date: string;
  sheetNum: number;
  sheetsTotal: number;
}): string {
  const docName = params.subName || params.sectionName;
  const docCode = params.subCode || params.sectionCode;
  return `
  <table style="width:100%;border-collapse:collapse;border:1px solid #1e3a5f;margin-bottom:20px;font-size:9pt;font-family:'Times New Roman',serif">
    <tr>
      <td rowspan="5" style="width:60%;border:1px solid #1e3a5f;padding:8px;vertical-align:middle;text-align:center">
        <div style="font-size:13pt;font-weight:bold;margin-bottom:4px">${params.projectName}</div>
        <div style="font-size:10pt;color:#444">${docCode} — ${docName}</div>
      </td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px;font-size:8pt;color:#666">Изм.</td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px;font-size:8pt;color:#666">Кол.уч.</td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px;font-size:8pt;color:#666">Лист</td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px;font-size:8pt;color:#666">№ докум.</td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px;font-size:8pt;color:#666">Подп.</td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px;font-size:8pt;color:#666">Дата</td>
    </tr>
    <tr>
      <td style="border:1px solid #1e3a5f;padding:3px 6px"></td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px"></td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px"></td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px"></td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px"></td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px">${params.date}</td>
    </tr>
    <tr>
      <td colspan="3" style="border:1px solid #1e3a5f;padding:3px 6px;font-size:8pt">Разраб.</td>
      <td colspan="3" style="border:1px solid #1e3a5f;padding:3px 6px;font-size:8pt">ГИП</td>
    </tr>
    <tr>
      <td colspan="2" style="border:1px solid #1e3a5f;padding:3px 6px;font-size:8pt;color:#666">Заказчик</td>
      <td colspan="4" style="border:1px solid #1e3a5f;padding:3px 6px;font-size:9pt">${params.client}</td>
    </tr>
    <tr>
      <td style="border:1px solid #1e3a5f;padding:3px 6px;font-size:8pt">Стадия</td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px;font-weight:bold;font-size:9pt">${params.status === 'approved' ? 'П' : 'РД'}</td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px;font-size:8pt">Лист</td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px;font-weight:bold">${params.sheetNum}</td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px;font-size:8pt">Листов</td>
      <td style="border:1px solid #1e3a5f;padding:3px 6px;font-weight:bold">${params.sheetsTotal}</td>
    </tr>
  </table>`;
}

// ─── Экспорт ─────────────────────────────────────────────────────────────────

const DOC_STYLES = `
  body{font-family:"Times New Roman",serif;font-size:12pt;color:#1a1a1a;margin:2cm;line-height:1.6}
  h1{font-size:16pt;font-weight:bold;color:#1e3a5f;margin:20px 0 10px;border-bottom:2px solid #1e3a5f;padding-bottom:6px}
  h2{font-size:14pt;font-weight:bold;color:#1e3a5f;margin:16px 0 8px}
  h3{font-size:12pt;font-weight:bold;color:#2d4a6f;margin:12px 0 6px}
  h4{font-size:11pt;font-weight:bold;margin:10px 0 4px}
  p{margin:4px 0;line-height:1.8}
  ul,ol{padding-left:24px;margin:6px 0}
  li{margin:3px 0;line-height:1.7}
  table.data-table{border-collapse:collapse;width:100%;margin:14px 0;font-size:10pt}
  table.data-table th{background:#1e3a5f;color:#fff;padding:6px 10px;text-align:left;border:1px solid #999;font-size:9.5pt}
  table.data-table td{padding:5px 10px;border:1px solid #ccc;vertical-align:top}
  table.data-table tr:nth-child(even) td{background:#f4f7fc}
  table.data-table .total-row td{background:#e8f0fe;font-weight:bold;border-top:2px solid #1e3a5f}
  .calc-block{background:#f0f5ff;border-left:4px solid #1e3a5f;padding:10px 14px;margin:12px 0;font-family:"Courier New",monospace;font-size:10pt;border-radius:2px}
  .param-block{background:#f8f9fa;border-left:3px solid #6b7280;padding:6px 12px;margin:6px 0;font-size:10.5pt}
  .warn-block{background:#fffbeb;border-left:4px solid #d97706;padding:8px 14px;margin:12px 0;font-size:10.5pt}
  .info-block{background:#eff6ff;border-left:4px solid #3b82f6;padding:8px 14px;margin:12px 0;font-size:10.5pt}
  svg{max-width:100%;height:auto;display:block;margin:12px auto}
  .section-break{page-break-before:always;padding-top:20px}
  .doc-stamp{margin-bottom:24px}
`;

function exportSectionToWord(doc: Document, projectName: string, client: string) {
  const today = new Date().toLocaleDateString('ru-RU');
  const stamp = buildGostStamp({
    projectName, client,
    sectionCode: doc.sectionCode, sectionName: doc.section,
    subCode: doc.subCode, subName: doc.subName,
    status: doc.status, version: doc.version, date: today,
    sheetNum: 1, sheetsTotal: 1,
  });
  const body = doc.contentType === 'html' ? doc.content : doc.content.split('\n').map(l => l.trim() === '' ? '<br/>' : `<p>${l}</p>`).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>${DOC_STYLES}</style></head><body>
<div class="doc-stamp">${stamp}</div>
${body}
</body></html>`;
  const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fn = `${doc.subCode || doc.sectionCode}_${(doc.subName || doc.section).slice(0, 30).replace(/[^а-яёА-ЯЁa-zA-Z0-9]/g, '_')}`;
  a.download = `${fn}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportSectionToPDF(doc: Document, projectName: string, client: string) {
  const today = new Date().toLocaleDateString('ru-RU');
  const stamp = buildGostStamp({
    projectName, client,
    sectionCode: doc.sectionCode, sectionName: doc.section,
    subCode: doc.subCode, subName: doc.subName,
    status: doc.status, version: doc.version, date: today,
    sheetNum: 1, sheetsTotal: 1,
  });
  const body = doc.contentType === 'html' ? doc.content : doc.content.split('\n').map(l => l.trim() === '' ? '<br/>' : `<p>${l}</p>`).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>@page{margin:2cm}${DOC_STYLES}</style></head><body>
<div class="doc-stamp">${stamp}</div>
${body}
</body></html>`;
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 800);
}

function exportAllToWord(sections: SectionDef[], documents: Document[], projectName: string, client: string) {
  const today = new Date().toLocaleDateString('ru-RU');
  const cover = `
  <div style="text-align:center;padding:80px 40px;page-break-after:always;font-family:'Times New Roman',serif">
    <p style="font-size:12pt;color:#444;margin-bottom:8px">ПРОЕКТНАЯ ДОКУМЕНТАЦИЯ</p>
    <h1 style="font-size:22pt;color:#1e3a5f;margin:16px 0;border:none">${projectName}</h1>
    <p style="font-size:12pt;margin:8px 0">Заказчик: <b>${client}</b></p>
    <p style="font-size:11pt;color:#666;margin-top:40px">Дата разработки: ${today}</p>
    <p style="font-size:11pt;color:#666">Количество разделов: ${documents.length}</p>
    <p style="font-size:10pt;color:#999;margin-top:60px">Разработано в соответствии с ПП РФ №87 и ГОСТ Р 21.1101-2013</p>
  </div>`;

  const sectionsHtml = sections.flatMap(s => {
    const mainDoc = documents.find(d => String(d.phaseId) === String(s.phaseId) && !d.subCode);
    const subDocs = documents.filter(d => String(d.phaseId) === String(s.phaseId) && d.subCode);
    const allDocs = mainDoc ? [mainDoc, ...subDocs] : subDocs;
    return allDocs.map((doc, i) => {
      const stamp = buildGostStamp({
        projectName, client,
        sectionCode: doc.sectionCode, sectionName: doc.section,
        subCode: doc.subCode, subName: doc.subName,
        status: doc.status, version: doc.version, date: today,
        sheetNum: i + 1, sheetsTotal: allDocs.length,
      });
      const body = doc.contentType === 'html' ? doc.content : doc.content.split('\n').map(l => l.trim() === '' ? '<br/>' : `<p>${l}</p>`).join('');
      return `<div class="section-break"><div class="doc-stamp">${stamp}</div>${body}</div>`;
    });
  }).filter(Boolean).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>${DOC_STYLES}</style></head><body>${cover}${sectionsHtml}</body></html>`;
  const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ПД_${projectName.slice(0, 40).replace(/[^а-яёА-ЯЁa-zA-Z0-9]/g, '_')}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Viewer стили ────────────────────────────────────────────────────────────

const VIEWER_CSS = `
  .doc-viewer { color: #e2e8f0; }
  .doc-viewer h1 { font-size:15px;font-weight:700;color:#f1f5f9;margin:18px 0 10px;border-bottom:1px solid #334155;padding-bottom:6px }
  .doc-viewer h2 { font-size:13px;font-weight:600;color:#cbd5e1;margin:16px 0 8px }
  .doc-viewer h3 { font-size:12px;font-weight:600;color:#94a3b8;margin:12px 0 5px }
  .doc-viewer h4 { font-size:11px;font-weight:600;color:#64748b;margin:8px 0 3px }
  .doc-viewer p { font-size:12.5px;line-height:1.8;color:#94a3b8;margin:3px 0 }
  .doc-viewer ul,.doc-viewer ol { padding-left:18px;margin:5px 0 }
  .doc-viewer li { font-size:12.5px;color:#94a3b8;line-height:1.7;margin:2px 0 }
  .doc-viewer b,.doc-viewer strong { color:#cbd5e1 }
  .doc-viewer table.data-table { border-collapse:collapse;width:100%;margin:12px 0;font-size:11px }
  .doc-viewer table.data-table th { background:#1e3a5f;color:#e2e8f0;padding:6px 10px;text-align:left;border:1px solid #334155;font-size:10.5px }
  .doc-viewer table.data-table td { padding:5px 10px;border:1px solid #334155;vertical-align:top;color:#94a3b8 }
  .doc-viewer table.data-table tr:nth-child(even) td { background:#1a2744 }
  .doc-viewer table.data-table .total-row td { background:#1e3a5f;color:#e2e8f0;font-weight:bold;border-top:2px solid #3b82f6 }
  .doc-viewer .calc-block { background:#0c1628;border-left:4px solid #22d3ee;padding:10px 14px;margin:12px 0;font-family:monospace;font-size:11px;color:#a5f3fc;border-radius:4px }
  .doc-viewer .param-block { background:#1e293b;border-left:3px solid #475569;padding:6px 12px;margin:5px 0;color:#cbd5e1;font-size:12px }
  .doc-viewer .warn-block { background:#2a1a00;border-left:4px solid #f59e0b;padding:8px 14px;margin:12px 0;color:#fde68a;font-size:12px;border-radius:4px }
  .doc-viewer .info-block { background:#0f2040;border-left:4px solid #3b82f6;padding:8px 14px;margin:12px 0;color:#93c5fd;font-size:12px;border-radius:4px }
  .doc-viewer svg { max-width:100%;height:auto;display:block;margin:14px auto;border:1px solid #334155;border-radius:6px;background:#f8fafc }
  .doc-viewer .doc-stamp { display:none }
`;

// ─── Главный компонент ───────────────────────────────────────────────────────

export const ProductionModule = ({ projectContext }: ProductionModuleProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionDef | null>(null);
  const [activeSubSection, setActiveSubSection] = useState<SubSection | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [agentStage, setAgentStage] = useState<{ stage: string; stage_num: number; total_stages: number } | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (projectContext?.kpId) {
      setDocuments([]);
      setSelectedDoc(null);
      setSelectedSection(null);
      setActiveSubSection(null);
    }
  }, [projectContext?.kpId]);

  const sections = useMemo((): SectionDef[] => {
    const phases = projectContext?.roadmapData?.phases as RoadmapPhase[] | undefined;
    if (phases && phases.length > 0) {
      return phases.map(p => ({
        code: p.section_codes?.[0] || `Эт.${p.id}`,
        name: p.name,
        icon: getPhaseIcon(p.name),
        phaseId: p.id,
        duration: p.duration,
        deliverables: p.deliverables,
        tasks: p.tasks,
        responsible: p.responsible,
        subSections: getSubSectionsForPhase(p.name, p.deliverables),
      }));
    }
    return [
      { code: 'ИИ', name: 'Инженерные изыскания', icon: 'Search', phaseId: 'ИИ', duration: '', deliverables: [], tasks: [], responsible: '', subSections: SUBSECTIONS_II },
      { code: 'ПД', name: 'Проектная документация', icon: 'BookOpen', phaseId: 'ПД', duration: '', deliverables: [], tasks: [], responsible: '', subSections: SUBSECTIONS_PD },
      { code: 'РД', name: 'Рабочая документация', icon: 'Hammer', phaseId: 'РД', duration: '', deliverables: [], tasks: [], responsible: '', subSections: SUBSECTIONS_RD },
      { code: 'ГЭ', name: 'Государственная экспертиза', icon: 'CheckSquare', phaseId: 'ГЭ', duration: '', deliverables: [], tasks: [], responsible: '', subSections: SUBSECTIONS_GE },
      { code: 'АН', name: 'Авторский надзор', icon: 'Eye', phaseId: 'АН', duration: '', deliverables: [], tasks: [], responsible: '', subSections: SUBSECTIONS_AN },
    ];
  }, [projectContext?.roadmapData]);

  useEffect(() => {
    if (sections.length > 0 && !selectedSection) setSelectedSection(sections[0]);
  }, [sections]);

  const kp = projectContext?.kpData as Record<string, unknown> | undefined;
  const rm = projectContext?.roadmapData as Record<string, unknown> | undefined;
  const projectName = (kp?.title || rm?.project_name || 'Проект') as string;
  const clientName = (kp?.client as string | undefined) || '';
  const hasRoadmap = !!(projectContext?.roadmapData?.phases);
  const hasContext = !!(projectContext?.kpData || projectContext?.filesText);

  const buildContext = (section: SectionDef, subSection?: SubSection): string => {
    const ctx: string[] = [];
    if (projectContext?.filesText) {
      ctx.push(`=== ТЕХНИЧЕСКОЕ ЗАДАНИЕ ===\n${projectContext.filesText.slice(0, 5000)}`);
    }
    if (kp) {
      ctx.push(`\n=== КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ ===\nПроект: ${kp.title}\nКлиент: ${kp.client}\nРезюме: ${kp.summary}`);
      if (kp.sections) ctx.push(`Разделы КП: ${JSON.stringify(kp.sections).slice(0, 1000)}`);
    }
    if (rm) {
      ctx.push(`\n=== ДОРОЖНАЯ КАРТА ===\nОбзор: ${rm.overview}`);
      const phases = rm.phases as RoadmapPhase[] | undefined;
      phases?.forEach(p => {
        const cur = String(p.id) === String(section.phaseId) ? ' ◀ ТЕКУЩИЙ ЭТАП' : '';
        ctx.push(`  • Этап ${p.id}: ${p.name} (${p.duration})${cur} → ${p.deliverables.join(', ')}`);
      });
    }
    const phase = (rm?.phases as RoadmapPhase[] | undefined)?.find(p => String(p.id) === String(section.phaseId));
    if (phase) {
      ctx.push(`\n=== ТЕКУЩИЙ ЭТАП: ${phase.name} ===`);
      ctx.push(`Срок: ${phase.duration}`);
      ctx.push(`Задачи: ${phase.tasks.join('; ')}`);
      ctx.push(`Результаты: ${phase.deliverables.join('; ')}`);
      ctx.push(`Ответственный: ${phase.responsible}`);
    }
    ctx.push(`\n=== ЗАДАЧА ===`);
    if (subSection) {
      ctx.push(`Разработай подраздел: "${subSection.code} — ${subSection.name}" в составе "${section.code} — ${section.name}".`);
      if (subSection.pp87) ctx.push(`Нормативная ссылка: ПП РФ №87, ${subSection.pp87}`);
      if (subSection.gostRef) ctx.push(`ГОСТ/СП: ${subSection.gostRef}`);
      const typeHints: Record<string, string> = {
        smeta: 'Это СМЕТА — генерируй полную таблицу по МДС 81-35.2004 с расценками ГЕСН/ФЕР, накладными расходами, сметной прибылью и НДС.',
        schema: 'Это СХЕМА/ЧЕРТЁЖ — обязательно включи SVG-схему с условными обозначениями, размерами и экспликацией.',
        ios: 'Это ИНЖЕНЕРНАЯ СИСТЕМА — включи расчёты, однолинейную схему в SVG, спецификацию оборудования.',
        kr: 'Это КОНСТРУКЦИИ — включи таблицу сбора нагрузок, расчёт несущих элементов, спецификацию арматуры.',
        ar: 'Это АРХИТЕКТУРА — включи экспликацию помещений (таблица), ведомость отделки, план в SVG.',
        izisk: 'Это ИЗЫСКАНИЯ — включи таблицу физико-механических свойств грунтов, литологический разрез в SVG, гидрогеологию.',
      };
      if (subSection.type && typeHints[subSection.type]) ctx.push(typeHints[subSection.type]);
    } else {
      ctx.push(`Разработай полный раздел: "${section.code} — ${section.name}".`);
      ctx.push(`Охвати все подразделы: ${section.subSections.map(s => `${s.code} ${s.name}`).join(', ')}.`);
    }
    ctx.push(`\nПроект: ${projectName}. Заказчик: ${clientName}.`);
    ctx.push(`Создай ПОЛНОЦЕННЫЙ документ с SVG-схемами, таблицами, расчётами и нормативными ссылками. Минимум 2000 слов.`);
    return ctx.join('\n');
  };

  const pollJob = async (jobId: string): Promise<Record<string, unknown>> => {
    const start = Date.now();
    while (Date.now() - start < 300000) {
      await new Promise(r => setTimeout(r, 3000));
      const res = await fetch(GENERATE_KP_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_job', job_id: jobId }),
      });
      const data = await res.json();
      if (data.progress) setAgentStage(data.progress);
      if (data.status === 'done') return data.data;
      if (data.status === 'error') throw new Error(data.error || 'Ошибка генерации');
    }
    throw new Error('Превышено время ожидания (5 мин)');
  };

  const handleGenerate = async (section: SectionDef, subSection?: SubSection) => {
    const key = subSection ? `${section.phaseId}_${subSection.code}` : String(section.phaseId);
    setGenerating(key);
    const label = subSection ? `${subSection.code} — ${subSection.name}` : `${section.code} — ${section.name}`;
    toast({ title: 'ИИ разрабатывает документ...', description: `${label} · с чертежами, таблицами и расчётами` });
    try {
      const contextText = buildContext(section, subSection);
      const startRes = await fetch(GENERATE_KP_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_section',
          section_code: subSection?.code || section.code,
          section_name: subSection?.name || section.name,
          context: contextText,
        }),
      });
      const startData = await startRes.json();
      if (!startData.job_id) throw new Error(startData.error || 'Не удалось запустить');
      const result = await pollJob(startData.job_id);
      const content = (result.content || result.text || JSON.stringify(result)) as string;
      const isHtml = /<[a-z][\s\S]*>/i.test(content);
      const newDoc: Document = {
        id: crypto.randomUUID(),
        phaseId: section.phaseId,
        section: section.name,
        sectionCode: section.code,
        subCode: subSection?.code,
        subName: subSection?.name,
        status: 'draft',
        content,
        contentType: isHtml ? 'html' : 'text',
        aiGenerated: true,
        version: 1,
        createdAt: new Date().toISOString(),
      };
      setDocuments(prev => [...prev.filter(d => !(String(d.phaseId) === String(section.phaseId) && d.subCode === subSection?.code)), newDoc]);
      setSelectedDoc(newDoc);
      setEditContent(content);
      setEditMode(false);
      toast({ title: 'Документ готов', description: label });
    } catch (error) {
      toast({ title: 'Ошибка', description: error instanceof Error ? error.message : 'Не удалось создать', variant: 'destructive' });
    } finally {
      setGenerating(null);
      setAgentStage(null);
    }
  };

  const handleSaveDocument = () => {
    if (!selectedDoc) return;
    const isHtml = /<[a-z][\s\S]*>/i.test(editContent);
    const updated: Document = { ...selectedDoc, content: editContent, contentType: isHtml ? 'html' : 'text', version: selectedDoc.version + 1 };
    setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? updated : d));
    setSelectedDoc(updated);
    setEditMode(false);
    toast({ title: 'Сохранено', description: `Версия ${updated.version}` });
  };

  const handleStatusChange = (newStatus: Document['status']) => {
    if (!selectedDoc) return;
    const updated = { ...selectedDoc, status: newStatus };
    setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? updated : d));
    setSelectedDoc(updated);
  };

  const docsForSection = selectedSection
    ? documents.filter(d => String(d.phaseId) === String(selectedSection.phaseId))
    : [];
  const totalDocs = documents.length;

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Статус-бар */}
      <div className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm ${
        hasRoadmap ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-amber-900/20 border-amber-500/30'
      }`}>
        <div className="flex items-center gap-2">
          <Icon name={hasRoadmap ? 'CheckCircle' : 'AlertCircle'} size={15}
            className={hasRoadmap ? 'text-emerald-400' : 'text-amber-400'} />
          <span className={`font-medium ${hasRoadmap ? 'text-emerald-300' : 'text-amber-300'}`}>
            {hasRoadmap
              ? `${sections.length} этапов ПИР${hasContext ? ' · ТЗ + КП загружены' : ''} · документы по ПП РФ №87 и ГОСТ Р 21.1101`
              : 'Передайте КП в производство для автоматического формирования разделов'}
          </span>
        </div>
        {totalDocs > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{totalDocs} документов</span>
            <Button size="sm" variant="outline" onClick={() => exportAllToWord(sections, documents, projectName, clientName)}
              className="h-7 text-xs gap-1">
              <Icon name="FileDown" size={12} />Экспорт всего проекта
            </Button>
          </div>
        )}
      </div>

      {/* Основной layout — 3 колонки */}
      <div className="grid grid-cols-12 gap-3 flex-1" style={{ minHeight: '650px' }}>

        {/* Колонка 1: Этапы */}
        <div className="col-span-2 flex flex-col gap-1.5 overflow-y-auto pr-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">Этапы ПИР</p>
          {sections.map(section => {
            const docsCount = documents.filter(d => String(d.phaseId) === String(section.phaseId)).length;
            const isSelected = selectedSection?.phaseId === section.phaseId;
            return (
              <button
                key={String(section.phaseId)}
                onClick={() => { setSelectedSection(section); setActiveSubSection(null); setSelectedDoc(null); }}
                className={`w-full text-left p-2.5 border rounded-lg transition-all ${
                  isSelected ? 'bg-cyan-500/15 border-cyan-500/50' : 'border-slate-700/50 hover:bg-slate-700/30 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon name={section.icon as Parameters<typeof Icon>[0]['name']} size={13}
                    className={isSelected ? 'text-cyan-400' : 'text-slate-500'} />
                  <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-300'}`}>{section.code}</span>
                  {docsCount > 0 && <Badge variant="secondary" className="text-xs h-4 ml-auto">{docsCount}</Badge>}
                </div>
                <p className="text-xs text-slate-400 leading-tight">{section.name}</p>
                {section.duration && <p className="text-xs text-slate-600 mt-0.5">{section.duration}</p>}
              </button>
            );
          })}
        </div>

        {/* Колонка 2: Подразделы по ПП РФ №87 */}
        <div className="col-span-3 flex flex-col gap-1.5 overflow-y-auto pr-1">
          {selectedSection ? (
            <>
              <div className="flex items-center justify-between mb-1 px-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {selectedSection.code} · {selectedSection.subSections.length} разделов
                </p>
                <button
                  onClick={() => handleGenerate(selectedSection)}
                  disabled={!!generating}
                  className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded px-2 py-0.5 disabled:opacity-50 transition-colors"
                >
                  {generating === String(selectedSection.phaseId) ? '...' : 'Всё'}
                </button>
              </div>

              {/* Прогресс агентов */}
              {generating && agentStage && (
                <div className="p-2.5 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon name="Loader" size={12} className="animate-spin text-cyan-400" />
                    <span className="text-xs font-medium text-cyan-300">
                      Этап {agentStage.stage_num} из {agentStage.total_stages}
                    </span>
                  </div>
                  <p className="text-xs text-cyan-400/80">{agentStage.stage}</p>
                  <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${(agentStage.stage_num / agentStage.total_stages) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Кнопки подразделов */}
              {selectedSection.subSections.map(sub => {
                const subKey = `${selectedSection.phaseId}_${sub.code}`;
                const subDoc = documents.find(d => String(d.phaseId) === String(selectedSection.phaseId) && d.subCode === sub.code);
                const isGen = generating === subKey;
                const isActive = activeSubSection?.code === sub.code;

                return (
                  <div
                    key={sub.code}
                    className={`border rounded-lg transition-all overflow-hidden ${
                      isActive ? 'border-blue-500/40 bg-blue-500/5' : 'border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div
                      className="flex items-start gap-2 p-2.5 cursor-pointer"
                      onClick={() => {
                        setActiveSubSection(sub);
                        if (subDoc) { setSelectedDoc(subDoc); setEditContent(subDoc.content); setEditMode(false); }
                        else setSelectedDoc(null);
                      }}
                    >
                      <Icon name={(typeIcon[sub.type || ''] || 'FileText') as Parameters<typeof Icon>[0]['name']} size={12}
                        className={isActive ? 'text-blue-400 mt-0.5 shrink-0' : 'text-slate-500 mt-0.5 shrink-0'} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className={`text-xs font-bold shrink-0 ${isActive ? 'text-blue-300' : 'text-slate-300'}`}>{sub.code}</span>
                          {sub.pp87 && <span className="text-xs text-slate-600">({sub.pp87})</span>}
                          {subDoc && (
                            <Badge className={`text-xs h-4 ${statusLabels[subDoc.status].cls}`}>
                              {statusLabels[subDoc.status].label}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-tight mt-0.5">{sub.name}</p>
                        {sub.gostRef && <p className="text-xs text-slate-600 mt-0.5">{sub.gostRef}</p>}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); handleGenerate(selectedSection, sub); }}
                        disabled={!!generating}
                        className="shrink-0 p-1 rounded hover:bg-cyan-500/10 text-slate-500 hover:text-cyan-400 transition-colors disabled:opacity-40"
                        title="Сгенерировать"
                      >
                        {isGen
                          ? <Icon name="Loader" size={12} className="animate-spin" />
                          : <Icon name="Sparkles" size={12} />}
                      </button>
                    </div>
                    {subDoc && (
                      <div className="flex gap-1.5 px-2.5 pb-2 pt-0">
                        <button onClick={() => exportSectionToPDF(subDoc, projectName, clientName)}
                          className="text-xs text-orange-400 hover:text-orange-300 border border-orange-500/20 rounded px-1.5 py-0.5">PDF</button>
                        <button onClick={() => exportSectionToWord(subDoc, projectName, clientName)}
                          className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/20 rounded px-1.5 py-0.5">Word</button>
                        <span className="text-xs text-slate-600 ml-auto">v{subDoc.version}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Инфо этапа */}
              {(selectedSection.tasks.length > 0 || selectedSection.deliverables.length > 0) && (
                <div className="mt-2 p-2.5 bg-slate-800/30 rounded-lg border border-slate-700/40 text-xs">
                  {selectedSection.deliverables.length > 0 && (
                    <>
                      <p className="font-medium text-slate-400 mb-1.5">Результаты этапа:</p>
                      <ul className="space-y-1">
                        {selectedSection.deliverables.slice(0, 6).map((d, i) => (
                          <li key={i} className="text-slate-500 flex gap-1.5">
                            <Icon name="FileCheck" size={10} className="text-cyan-600 mt-0.5 shrink-0" />{d}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {selectedSection.responsible && (
                    <p className="text-slate-600 mt-2">Ответственный: {selectedSection.responsible}</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-slate-600 text-sm">Выберите этап</div>
          )}
        </div>

        {/* Колонка 3: Просмотр документа */}
        <div className="col-span-7 flex flex-col gap-2">
          {selectedDoc ? (
            <>
              {/* Заголовок */}
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <h3 className="text-sm font-semibold text-white leading-tight">
                    {selectedDoc.subCode
                      ? `${selectedDoc.subCode} — ${selectedDoc.subName}`
                      : `${selectedDoc.sectionCode} — ${selectedDoc.section}`}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge className={`text-xs ${statusLabels[selectedDoc.status].cls}`}>{statusLabels[selectedDoc.status].label}</Badge>
                    <span className="text-xs text-slate-500">v{selectedDoc.version}</span>
                    <span className="text-xs text-slate-500">{new Date(selectedDoc.createdAt).toLocaleDateString('ru-RU')}</span>
                    {selectedDoc.aiGenerated && <Badge variant="secondary" className="text-xs">AI · ГИП</Badge>}
                    {selectedDoc.contentType === 'html' && (
                      <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">SVG+Таблицы</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                  {(['draft','review','approved','rejected'] as Document['status'][]).map(s => (
                    <button key={s} onClick={() => handleStatusChange(s)}
                      className={`text-xs px-1.5 py-0.5 rounded border transition-colors ${
                        selectedDoc.status === s ? statusLabels[s].cls : 'border-slate-700 text-slate-600 hover:border-slate-500'
                      }`}>
                      {statusLabels[s].label}
                    </button>
                  ))}
                  <button onClick={() => exportSectionToPDF(selectedDoc, projectName, clientName)}
                    className="text-xs text-orange-400 border border-orange-500/30 rounded px-2 py-0.5 hover:bg-orange-500/10">PDF</button>
                  <button onClick={() => exportSectionToWord(selectedDoc, projectName, clientName)}
                    className="text-xs text-blue-400 border border-blue-500/30 rounded px-2 py-0.5 hover:bg-blue-500/10">Word</button>
                  {!editMode
                    ? <Button size="sm" variant="outline" onClick={() => setEditMode(true)} className="h-7 text-xs gap-1">
                        <Icon name="Edit" size={11} />Редактировать
                      </Button>
                    : <>
                        <Button size="sm" onClick={handleSaveDocument} className="h-7 text-xs gap-1">
                          <Icon name="Save" size={11} />Сохранить
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setEditMode(false); setEditContent(selectedDoc.content); }} className="h-7 text-xs">
                          Отмена
                        </Button>
                      </>}
                </div>
              </div>

              {/* Тело документа */}
              <Card className="flex-1 overflow-hidden border-slate-700">
                <CardContent className="p-0 h-full">
                  {editMode ? (
                    <Textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className="h-full min-h-[560px] resize-none rounded-lg border-0 font-mono text-xs leading-relaxed p-4"
                    />
                  ) : (
                    <div className="overflow-y-auto p-5 max-h-[620px] doc-viewer">
                      <style>{VIEWER_CSS}</style>
                      {selectedDoc.contentType === 'html'
                        ? <div dangerouslySetInnerHTML={{ __html: selectedDoc.content }} />
                        : <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans text-slate-300">{selectedDoc.content}</pre>}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : selectedSection ? (
            /* Пустое состояние — выбран этап но нет документа */
            <div className="flex flex-col items-center justify-center h-full gap-5 py-16">
              <div className="text-center">
                <Icon name={selectedSection.icon as Parameters<typeof Icon>[0]['name']} size={48} className="text-slate-700 mx-auto mb-3" />
                <h3 className="text-slate-300 font-semibold text-base">{selectedSection.code} — {selectedSection.name}</h3>
                <p className="text-slate-500 text-sm mt-1">{selectedSection.subSections.length} подразделов по ПП РФ №87</p>
              </div>

              {/* Список подразделов */}
              <div className="grid grid-cols-2 gap-2 w-full max-w-xl">
                {selectedSection.subSections.slice(0, 8).map(sub => (
                  <div key={sub.code} className="flex items-center gap-2 p-2 bg-slate-800/30 rounded border border-slate-700/40 text-xs">
                    <Icon name={(typeIcon[sub.type || ''] || 'FileText') as Parameters<typeof Icon>[0]['name']} size={11} className="text-slate-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-300">{sub.code}</span>
                      <span className="text-slate-500 ml-1">{sub.name.slice(0, 28)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedSection.deliverables.length > 0 && (
                <div className="max-w-xl w-full bg-slate-800/20 rounded-lg p-3 border border-slate-700/40">
                  <p className="text-xs font-medium text-slate-400 mb-2">Документы этапа:</p>
                  <div className="grid grid-cols-1 gap-1">
                    {selectedSection.deliverables.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                        <Icon name="FileCheck" size={10} className="text-cyan-600 shrink-0" />{d}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                size="lg"
                onClick={() => handleGenerate(selectedSection)}
                disabled={!!generating}
                className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {generating === String(selectedSection.phaseId)
                  ? <><Icon name="Loader" size={16} className="animate-spin" />Разрабатываю раздел...</>
                  : <><Icon name="Sparkles" size={16} />Разработать весь раздел</>}
              </Button>

              <div className="text-center max-w-md">
                <p className="text-xs text-slate-500">
                  ИИ сгенерирует полноценный раздел с <b className="text-slate-400">SVG-чертежами</b>, <b className="text-slate-400">сметами по ГЕСН</b>,
                  <b className="text-slate-400"> таблицами ТЭП</b>, <b className="text-slate-400">расчётами</b> и <b className="text-slate-400">нормативными ссылками</b>.
                  Или выберите конкретный подраздел для точечной разработки.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-600 text-sm">
              Выберите этап из списка слева
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionModule;