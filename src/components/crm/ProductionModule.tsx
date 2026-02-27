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

// ─── Подразделы по умолчанию для ПД ────────────────────────────────────────

const DEFAULT_SUBSECTIONS: SubSection[] = [
  { code: 'ПЗ', name: 'Пояснительная записка', gostRef: 'ПП РФ №87, раздел I' },
  { code: 'СПОЗУ', name: 'Схема планировочной организации ЗУ', gostRef: 'ПП РФ №87, раздел II' },
  { code: 'АР', name: 'Архитектурные решения', gostRef: 'ПП РФ №87, раздел III' },
  { code: 'КР', name: 'Конструктивные решения', gostRef: 'ПП РФ №87, раздел IV' },
  { code: 'ИОС1', name: 'Система электроснабжения', gostRef: 'ПП РФ №87, раздел V.1' },
  { code: 'ИОС2', name: 'Система водоснабжения и водоотведения', gostRef: 'ПП РФ №87, раздел V.2' },
  { code: 'ИОС3', name: 'Отопление, вентиляция, кондиционирование', gostRef: 'ПП РФ №87, раздел V.3' },
  { code: 'ООС', name: 'Охрана окружающей среды', gostRef: 'ПП РФ №87, раздел VI' },
  { code: 'МОПБ', name: 'Пожарная безопасность', gostRef: 'ПП РФ №87, раздел IX' },
  { code: 'ССР', name: 'Смета на строительство', gostRef: 'МДС 81-35.2004' },
];

const FALLBACK_SECTIONS: Omit<SectionDef, 'subSections'>[] = [
  { code: 'ИИ', name: 'Инженерные изыскания', icon: 'Search', phaseId: 'ИИ', duration: '', deliverables: [], tasks: [], responsible: '' },
  { code: 'ПД', name: 'Проектная документация', icon: 'BookOpen', phaseId: 'ПД', duration: '', deliverables: [], tasks: [], responsible: '' },
  { code: 'РД', name: 'Рабочая документация', icon: 'Hammer', phaseId: 'РД', duration: '', deliverables: [], tasks: [], responsible: '' },
  { code: 'ГЭ', name: 'Государственная экспертиза', icon: 'CheckSquare', phaseId: 'ГЭ', duration: '', deliverables: [], tasks: [], responsible: '' },
  { code: 'АН', name: 'Авторский надзор', icon: 'Eye', phaseId: 'АН', duration: '', deliverables: [], tasks: [], responsible: '' },
];

const SUBSECTIONS_BY_PHASE_NAME: Record<string, SubSection[]> = {
  'изыскания': [
    { code: 'ИГДИ', name: 'Инженерно-геодезические изыскания', gostRef: 'СП 47.13330.2016' },
    { code: 'ИГИ', name: 'Инженерно-геологические изыскания', gostRef: 'СП 47.13330.2016' },
    { code: 'ИЭИ', name: 'Инженерно-экологические изыскания', gostRef: 'СП 502.1325800.2021' },
    { code: 'ИГМИ', name: 'Инженерно-гидрометеорологические изыскания', gostRef: 'СП 33-101-2003' },
  ],
  'проектная': [
    ...DEFAULT_SUBSECTIONS,
  ],
  'рабочая': [
    { code: 'ГП', name: 'Генеральный план', gostRef: 'ГОСТ 21.508-93' },
    { code: 'АС', name: 'Архитектурно-строительные чертежи', gostRef: 'ГОСТ 21.501-2018' },
    { code: 'КЖ', name: 'Конструкции железобетонные', gostRef: 'ГОСТ 21.501-2018' },
    { code: 'КМ', name: 'Конструкции металлические', gostRef: 'ГОСТ 21.502-2016' },
    { code: 'ЭМ', name: 'Электрооборудование', gostRef: 'ГОСТ 21.614-88' },
    { code: 'ОВ', name: 'Отопление и вентиляция', gostRef: 'ГОСТ 21.602-2016' },
    { code: 'ВК', name: 'Водопровод и канализация', gostRef: 'ГОСТ 21.604-82' },
  ],
  'экспертиза': [
    { code: 'ГЭ', name: 'Заключение гос. экспертизы', gostRef: 'ГрК РФ ст.49' },
    { code: 'ГЭЭ', name: 'Заключение гос. экологической экспертизы', gostRef: 'ФЗ №174-ФЗ' },
    { code: 'СОПР', name: 'Сопровождение рассмотрения замечаний', gostRef: 'ПП РФ №145' },
  ],
  'авторский': [
    { code: 'АН-ОБЩ', name: 'Общий журнал авторского надзора', gostRef: 'СП 11-110-99' },
    { code: 'АН-ОТ', name: 'Отступления от проекта', gostRef: 'СП 11-110-99' },
  ],
};

const statusLabels: Record<Document['status'], { label: string; cls: string }> = {
  draft: { label: 'Черновик', cls: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  review: { label: 'На проверке', cls: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  approved: { label: 'Утверждён', cls: 'bg-green-500/10 text-green-500 border-green-500/20' },
  rejected: { label: 'Отклонён', cls: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

// ─── Утилиты ─────────────────────────────────────────────────────────────────

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

function getSubSectionsForPhase(phaseName: string, deliverables: string[]): SubSection[] {
  const n = phaseName.toLowerCase();
  for (const [key, subs] of Object.entries(SUBSECTIONS_BY_PHASE_NAME)) {
    if (n.includes(key)) return subs;
  }
  // Попробуем построить из deliverables
  if (deliverables.length > 0) {
    return deliverables.slice(0, 8).map((d, i) => ({
      code: `${i + 1}`,
      name: d,
    }));
  }
  return DEFAULT_SUBSECTIONS.slice(0, 5);
}

// ─── Экспорт одного раздела ─────────────────────────────────────────────────

function exportSectionToWord(doc: Document, projectName: string) {
  const today = new Date().toLocaleDateString('ru-RU');
  const statusLabel = statusLabels[doc.status].label;
  const body = doc.contentType === 'html'
    ? doc.content
    : doc.content.split('\n').map(l => l.trim() === '' ? '<br/>' : `<p>${l}</p>`).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>
  body{font-family:"Times New Roman",serif;font-size:12pt;color:#1a1a1a;margin:2cm}
  h1{font-size:18pt;color:#1e3a5f;border-bottom:2px solid #1e3a5f;padding-bottom:8px}
  h2{font-size:15pt;color:#1e3a5f;margin-top:20px}
  h3{font-size:13pt;color:#1e3a5f}
  p{line-height:1.8;margin:4px 0}
  table.data-table{border-collapse:collapse;width:100%;margin:16px 0;font-size:10pt}
  table.data-table th{background:#1e3a5f;color:#fff;padding:6px 10px;text-align:left;border:1px solid #aaa}
  table.data-table td{padding:5px 10px;border:1px solid #ccc;vertical-align:top}
  table.data-table tr:nth-child(even) td{background:#f5f8fc}
  .calc-block{background:#f0f4ff;border-left:3px solid #1e3a5f;padding:8px 12px;margin:10px 0;font-family:monospace;font-size:10pt}
  .param-block{background:#f8f9fa;padding:6px 10px;margin:6px 0;border-left:2px solid #aaa}
  .warn-block{background:#fff8e1;border-left:3px solid #f59e0b;padding:8px 12px;margin:10px 0}
  .cover{text-align:center;padding:60px 0;page-break-after:always}
</style>
</head><body>
<div class="cover">
  <p style="color:#666;font-size:10pt">Проектно-изыскательские работы</p>
  <h1 style="border:none">${projectName}</h1>
  <h2 style="color:#444">${doc.sectionCode} — ${doc.section}</h2>
  ${doc.subName ? `<p style="color:#555">${doc.subCode} · ${doc.subName}</p>` : ''}
  <p style="color:#666;margin-top:30px">Статус: <b>${statusLabel}</b> · Версия ${doc.version} · ${today}</p>
</div>
${body}
</body></html>`;

  const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.sectionCode}_${doc.section.slice(0, 30).replace(/[^а-яёА-ЯЁa-zA-Z0-9]/g, '_')}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportSectionToPDF(doc: Document, projectName: string) {
  const today = new Date().toLocaleDateString('ru-RU');
  const body = doc.contentType === 'html'
    ? doc.content
    : doc.content.split('\n').map(l => l.trim() === '' ? '<br/>' : `<p>${l}</p>`).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>
  @page{margin:2cm}
  body{font-family:"Times New Roman",serif;font-size:12pt;color:#1a1a1a}
  h1{font-size:17pt;color:#1e3a5f;border-bottom:2px solid #1e3a5f;padding-bottom:6px}
  h2{font-size:14pt;color:#1e3a5f}
  h3{font-size:12pt}
  p{line-height:1.8;margin:3px 0}
  table.data-table{border-collapse:collapse;width:100%;margin:12px 0;font-size:10pt}
  table.data-table th{background:#1e3a5f;color:#fff;padding:5px 8px;border:1px solid #999}
  table.data-table td{padding:4px 8px;border:1px solid #ccc}
  table.data-table tr:nth-child(even) td{background:#f5f8fc}
  .calc-block{background:#f0f4ff;border-left:3px solid #1e3a5f;padding:6px 10px;margin:8px 0;font-family:monospace;font-size:9pt}
  .param-block{background:#f8f9fa;padding:5px 8px;margin:4px 0}
  .warn-block{background:#fff8e1;border-left:3px solid #f59e0b;padding:6px 10px;margin:8px 0}
  .cover{text-align:center;padding:80px 0 40px;page-break-after:always}
</style>
</head><body>
<div class="cover">
  <p style="color:#666;font-size:10pt">Проектно-изыскательские работы</p>
  <h1 style="border:none">${projectName}</h1>
  <h2>${doc.sectionCode} — ${doc.section}</h2>
  ${doc.subName ? `<p>${doc.subCode} · ${doc.subName}</p>` : ''}
  <p style="color:#666;margin-top:20px">Версия ${doc.version} · ${today}</p>
</div>
${body}
</body></html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 600);
}

function exportAllToWord(sections: SectionDef[], documents: Document[], projectName: string, clientName?: string) {
  const today = new Date().toLocaleDateString('ru-RU');
  const sectionsHtml = sections.map(s => {
    const doc = documents.find(d => String(d.phaseId) === String(s.phaseId) && !d.subCode);
    if (!doc) return '';
    const body = doc.contentType === 'html'
      ? doc.content
      : doc.content.split('\n').map(l => l.trim() === '' ? '<br/>' : `<p>${l}</p>`).join('');
    return `<div style="page-break-before:always">${body}</div>`;
  }).filter(Boolean).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>
  body{font-family:"Times New Roman",serif;font-size:12pt;color:#1a1a1a;margin:2cm}
  h1{font-size:18pt;color:#1e3a5f} h2{font-size:15pt;color:#1e3a5f} h3{font-size:13pt}
  p{line-height:1.8;margin:4px 0}
  table.data-table{border-collapse:collapse;width:100%;margin:16px 0;font-size:10pt}
  table.data-table th{background:#1e3a5f;color:#fff;padding:6px 10px;border:1px solid #aaa}
  table.data-table td{padding:5px 10px;border:1px solid #ccc}
  table.data-table tr:nth-child(even) td{background:#f5f8fc}
  .calc-block{background:#f0f4ff;border-left:3px solid #1e3a5f;padding:8px;margin:10px 0;font-family:monospace;font-size:10pt}
  .warn-block{background:#fff8e1;border-left:3px solid #f59e0b;padding:8px;margin:10px 0}
  .param-block{background:#f8f9fa;padding:6px 10px;margin:6px 0}
</style>
</head><body>
<div style="text-align:center;padding:60px 0;page-break-after:always">
  <p style="color:#666">Проектно-изыскательские работы</p>
  <h1>${projectName}</h1>
  <p style="margin-top:30px;color:#666">Дата: ${today}${clientName ? ` · Заказчик: ${clientName}` : ''} · Разделов: ${documents.length}</p>
</div>
${sectionsHtml}
</body></html>`;

  const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ПИР_${projectName.slice(0, 40).replace(/[^а-яёА-ЯЁa-zA-Z0-9]/g, '_')}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Компонент просмотра HTML-контента ──────────────────────────────────────

function ContentViewer({ content, contentType }: { content: string; contentType: 'html' | 'text' }) {
  if (contentType === 'html') {
    return (
      <div
        className="prose-section text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{ color: 'inherit' }}
      />
    );
  }
  return (
    <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{content}</pre>
  );
}

// ─── Главный компонент ───────────────────────────────────────────────────────

export const ProductionModule = ({ projectContext }: ProductionModuleProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionDef | null>(null);
  const [activeSubSection, setActiveSubSection] = useState<SubSection | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
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
    return FALLBACK_SECTIONS.map(s => ({
      ...s,
      subSections: getSubSectionsForPhase(s.name, []),
    }));
  }, [projectContext?.roadmapData]);

  // Автовыбор первого раздела
  useEffect(() => {
    if (sections.length > 0 && !selectedSection) {
      setSelectedSection(sections[0]);
    }
  }, [sections]);

  const buildContext = (
    sectionCode: string,
    sectionName: string,
    phaseId: number | string,
    subSection?: SubSection
  ): string => {
    const ctx: string[] = [];

    if (projectContext?.filesText) {
      ctx.push(`=== ТЕХНИЧЕСКОЕ ЗАДАНИЕ ===`);
      ctx.push(projectContext.filesText.slice(0, 5000));
    }

    if (projectContext?.kpData) {
      const kp = projectContext.kpData;
      ctx.push(`\n=== КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ ===`);
      ctx.push(`Проект: ${kp.title}\nКлиент: ${kp.client}\nРезюме: ${kp.summary}`);
    }

    if (projectContext?.roadmapData) {
      const rm = projectContext.roadmapData;
      ctx.push(`\n=== ДОРОЖНАЯ КАРТА ПРОЕКТА ===`);
      ctx.push(`Обзор: ${rm.overview}`);
      const phases = rm.phases as RoadmapPhase[] | undefined;
      if (phases?.length) {
        phases.forEach(p => {
          const cur = p.id === phaseId ? ' ◀ ТЕКУЩИЙ ЭТАП' : '';
          ctx.push(`  • ${p.name} (${p.duration})${cur}: ${p.deliverables.join(', ')}`);
        });
      }
    }

    const phase = (projectContext?.roadmapData?.phases as RoadmapPhase[] | undefined)?.find(p => p.id === phaseId);
    if (phase) {
      ctx.push(`\n=== ТЕКУЩИЙ ЭТАП ===`);
      ctx.push(`Название: ${phase.name}\nСрок: ${phase.duration}`);
      ctx.push(`Задачи: ${phase.tasks.join('; ')}`);
      ctx.push(`Ожидаемые результаты: ${phase.deliverables.join('; ')}`);
    }

    ctx.push(`\n=== ЗАДАЧА ===`);
    if (subSection) {
      ctx.push(`Разработай подраздел "${subSection.code} — ${subSection.name}" в составе раздела "${sectionCode} — ${sectionName}".`);
      if (subSection.gostRef) ctx.push(`Нормативная база: ${subSection.gostRef}`);
    } else {
      ctx.push(`Разработай полное содержание раздела "${sectionCode} — ${sectionName}".`);
    }
    ctx.push(`Оформи в виде HTML с таблицами, расчётами и ссылками на нормативы (СП, ГОСТ, ПП РФ №87).`);
    if (phase?.deliverables?.length) {
      ctx.push(`Охвати документы: ${phase.deliverables.join(', ')}.`);
    }

    return ctx.join('\n');
  };

  const pollJob = async (jobId: string, maxWaitMs = 240000): Promise<Record<string, unknown>> => {
    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
      await new Promise(r => setTimeout(r, 3500));
      const res = await fetch(GENERATE_KP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_job', job_id: jobId }),
      });
      const data = await res.json();
      if (data.status === 'done') return data.data;
      if (data.status === 'error') throw new Error(data.error || 'Ошибка генерации');
    }
    throw new Error('Превышено время ожидания (4 мин)');
  };

  const handleGenerate = async (section: SectionDef, subSection?: SubSection) => {
    const key = subSection ? `${section.phaseId}_${subSection.code}` : String(section.phaseId);
    setGenerating(key);

    const label = subSection ? `${subSection.code} — ${subSection.name}` : `${section.code} — ${section.name}`;
    toast({ title: 'ИИ проектирует раздел...', description: label });

    try {
      const contextText = buildContext(section.code, section.name, section.phaseId, subSection);

      const startRes = await fetch(GENERATE_KP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_section',
          section_code: subSection ? subSection.code : section.code,
          section_name: subSection ? subSection.name : section.name,
          context: contextText,
        }),
      });
      const startData = await startRes.json();
      if (!startData.job_id) throw new Error(startData.error || 'Не удалось запустить');

      const result = await pollJob(startData.job_id);
      const content = (result.content || result.text || JSON.stringify(result)) as string;
      const isHtml = content.trim().startsWith('<') || content.includes('<h') || content.includes('<table') || content.includes('<p>');

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
      toast({ title: 'Раздел готов', description: label });
    } catch (error) {
      toast({
        title: 'Ошибка генерации',
        description: error instanceof Error ? error.message : 'Не удалось создать документ',
        variant: 'destructive',
      });
    } finally {
      setGenerating(null);
    }
  };

  const handleSelectDoc = (doc: Document) => {
    setSelectedDoc(doc);
    setEditContent(doc.content);
    setEditMode(false);
  };

  const handleSaveDocument = () => {
    if (!selectedDoc) return;
    const isHtml = editContent.trim().startsWith('<') || editContent.includes('<h') || editContent.includes('<table');
    const updated: Document = {
      ...selectedDoc,
      content: editContent,
      contentType: isHtml ? 'html' : 'text',
      version: selectedDoc.version + 1,
    };
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
    toast({ title: `Статус: ${statusLabels[newStatus].label}` });
  };

  const kp = projectContext?.kpData as Record<string, unknown> | undefined;
  const rm = projectContext?.roadmapData as Record<string, unknown> | undefined;
  const projectName = (kp?.title || rm?.project_name || 'Проект') as string;
  const clientName = kp?.client as string | undefined;
  const hasRoadmap = !!(projectContext?.roadmapData?.phases);
  const hasContext = !!(projectContext?.kpData || projectContext?.filesText);
  const docsForSection = selectedSection
    ? documents.filter(d => String(d.phaseId) === String(selectedSection.phaseId))
    : [];

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* ── Статус бар ── */}
      <Card className={hasRoadmap ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-amber-900/20 border-amber-500/30'}>
        <CardContent className="py-2.5 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Icon name={hasRoadmap ? 'CheckCircle' : 'AlertCircle'} size={15}
                className={hasRoadmap ? 'text-emerald-400' : 'text-amber-400'} />
              <span className={`font-medium text-sm ${hasRoadmap ? 'text-emerald-300' : 'text-amber-300'}`}>
                {hasRoadmap
                  ? `${sections.length} этапов ПИР${hasContext ? ' · ТЗ + КП загружены' : ''}`
                  : 'Передайте КП в производство — разделы сформируются автоматически'}
              </span>
            </div>
            {documents.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{documents.length} разд. готово</span>
                <Button size="sm" variant="outline" onClick={() => exportAllToWord(sections, documents, projectName, clientName)}
                  className="text-xs h-7 gap-1">
                  <Icon name="FileDown" size={12} />Экспорт всех
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Трёхколоночный layout ── */}
      <div className="grid grid-cols-12 gap-4 flex-1 min-h-0" style={{ minHeight: '600px' }}>

        {/* Колонка 1: Этапы ПИР */}
        <div className="col-span-3 flex flex-col gap-2 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">Этапы ПИР</p>
          {sections.map(section => {
            const key = String(section.phaseId);
            const docsCount = documents.filter(d => String(d.phaseId) === key).length;
            const isSelected = selectedSection?.phaseId === section.phaseId;

            return (
              <div
                key={key}
                onClick={() => { setSelectedSection(section); setActiveSubSection(null); setSelectedDoc(null); }}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/50 shadow-sm'
                    : 'border-slate-700/50 hover:bg-slate-700/30 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon name={section.icon as Parameters<typeof Icon>[0]['name']} size={14}
                      className={isSelected ? 'text-cyan-400' : 'text-slate-400'} />
                    <div className="min-w-0">
                      <div className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>{section.code}</div>
                      <div className="text-xs text-slate-400 leading-tight truncate">{section.name}</div>
                    </div>
                  </div>
                  {docsCount > 0 && (
                    <Badge variant="secondary" className="text-xs shrink-0 h-5">{docsCount}</Badge>
                  )}
                </div>
                {section.duration && (
                  <div className="mt-1.5 text-xs text-slate-500">{section.duration}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Колонка 2: Подразделы */}
        <div className="col-span-3 flex flex-col gap-2 overflow-y-auto">
          {selectedSection ? (
            <>
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Подразделы</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleGenerate(selectedSection)}
                  disabled={!!generating}
                  className="text-xs h-6 gap-1 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10"
                >
                  {generating === String(selectedSection.phaseId)
                    ? <><Icon name="Loader" size={11} className="animate-spin" />Генерирую...</>
                    : <><Icon name="Sparkles" size={11} />Весь раздел</>}
                </Button>
              </div>

              {/* Кнопка "без подраздела" — весь раздел */}
              {(() => {
                const mainDoc = documents.find(d => String(d.phaseId) === String(selectedSection.phaseId) && !d.subCode);
                return mainDoc ? (
                  <div
                    onClick={() => { setActiveSubSection(null); handleSelectDoc(mainDoc); }}
                    className={`p-2.5 border rounded-lg cursor-pointer transition-all ${
                      selectedDoc?.id === mainDoc.id && !activeSubSection
                        ? 'bg-cyan-500/15 border-cyan-500/50'
                        : 'border-slate-700/50 hover:bg-slate-700/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-200">Весь раздел целиком</span>
                      <Badge className={`text-xs ${statusLabels[mainDoc.status].cls}`}>
                        {statusLabels[mainDoc.status].label}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">v{mainDoc.version} · {mainDoc.contentType.toUpperCase()}</p>
                  </div>
                ) : null;
              })()}

              {selectedSection.subSections.map(sub => {
                const subKey = `${selectedSection.phaseId}_${sub.code}`;
                const subDoc = documents.find(d => String(d.phaseId) === String(selectedSection.phaseId) && d.subCode === sub.code);
                const isGen = generating === subKey;
                const isActive = activeSubSection?.code === sub.code;

                return (
                  <div
                    key={sub.code}
                    className={`p-2.5 border rounded-lg transition-all ${
                      isActive ? 'bg-blue-500/10 border-blue-500/40' : 'border-slate-700/50'
                    }`}
                  >
                    <div
                      onClick={() => {
                        setActiveSubSection(sub);
                        if (subDoc) handleSelectDoc(subDoc);
                        else setSelectedDoc(null);
                      }}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-bold text-slate-300 shrink-0">{sub.code}</span>
                          {subDoc && (
                            <Badge className={`text-xs h-4 ${statusLabels[subDoc.status].cls}`}>
                              {statusLabels[subDoc.status].label}
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={e => { e.stopPropagation(); handleGenerate(selectedSection, sub); }}
                          disabled={!!generating}
                          className="h-5 w-5 p-0 text-slate-400 hover:text-cyan-400"
                        >
                          {isGen
                            ? <Icon name="Loader" size={11} className="animate-spin" />
                            : <Icon name="Sparkles" size={11} />}
                        </Button>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-tight">{sub.name}</p>
                      {sub.gostRef && <p className="text-xs text-slate-600 mt-0.5">{sub.gostRef}</p>}
                    </div>
                    {subDoc && (
                      <div className="flex gap-1 mt-2 pt-1.5 border-t border-slate-700/50">
                        <button
                          onClick={() => exportSectionToPDF(subDoc, projectName)}
                          className="text-xs text-orange-400 hover:text-orange-300 border border-orange-500/20 rounded px-1.5 py-0.5 transition-colors"
                        >PDF</button>
                        <button
                          onClick={() => exportSectionToWord(subDoc, projectName)}
                          className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/20 rounded px-1.5 py-0.5 transition-colors"
                        >Word</button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Инфо об этапе */}
              {selectedSection.tasks.length > 0 && (
                <div className="mt-2 p-3 bg-slate-800/40 rounded-lg border border-slate-700/50">
                  <p className="text-xs font-medium text-slate-300 mb-1.5">Задачи этапа:</p>
                  <ul className="space-y-1">
                    {selectedSection.tasks.slice(0, 5).map((t, i) => (
                      <li key={i} className="text-xs text-slate-400 flex gap-1.5">
                        <span className="text-cyan-500 shrink-0">·</span>{t}
                      </li>
                    ))}
                  </ul>
                  {selectedSection.responsible && (
                    <p className="text-xs text-slate-500 mt-2">Отв.: {selectedSection.responsible}</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
              Выберите этап
            </div>
          )}
        </div>

        {/* Колонка 3: Просмотр/редактирование документа */}
        <div className="col-span-6 flex flex-col gap-3">
          {selectedDoc ? (
            <>
              {/* Заголовок документа */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {selectedDoc.subCode
                      ? `${selectedDoc.subCode} — ${selectedDoc.subName}`
                      : `${selectedDoc.sectionCode} — ${selectedDoc.section}`}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs ${statusLabels[selectedDoc.status].cls}`}>
                      {statusLabels[selectedDoc.status].label}
                    </Badge>
                    <span className="text-xs text-slate-500">v{selectedDoc.version}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(selectedDoc.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                    {selectedDoc.aiGenerated && (
                      <Badge variant="secondary" className="text-xs">AI</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                  {/* Статусы */}
                  {(['draft', 'review', 'approved', 'rejected'] as Document['status'][]).map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                        selectedDoc.status === s ? statusLabels[s].cls : 'border-slate-700/50 text-slate-500 hover:border-slate-500'
                      }`}
                    >{statusLabels[s].label}</button>
                  ))}
                  {/* Экспорт */}
                  <button
                    onClick={() => exportSectionToPDF(selectedDoc, projectName)}
                    className="text-xs text-orange-400 border border-orange-500/30 rounded px-2 py-0.5 hover:bg-orange-500/10"
                  >PDF</button>
                  <button
                    onClick={() => exportSectionToWord(selectedDoc, projectName)}
                    className="text-xs text-blue-400 border border-blue-500/30 rounded px-2 py-0.5 hover:bg-blue-500/10"
                  >Word</button>
                  {/* Редактирование */}
                  {!editMode ? (
                    <Button size="sm" variant="outline" onClick={() => setEditMode(true)} className="h-7 text-xs gap-1">
                      <Icon name="Edit" size={12} />Редактировать
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" onClick={handleSaveDocument} className="h-7 text-xs gap-1">
                        <Icon name="Save" size={12} />Сохранить
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setEditMode(false); setEditContent(selectedDoc.content); }}
                        className="h-7 text-xs">Отмена</Button>
                    </>
                  )}
                </div>
              </div>

              {/* Тело документа */}
              <Card className="flex-1 overflow-hidden">
                <CardContent className="p-0 h-full">
                  {editMode ? (
                    <Textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className="h-full min-h-[500px] resize-none rounded-lg border-0 font-mono text-xs leading-relaxed p-4"
                      placeholder="HTML или текст документа..."
                    />
                  ) : (
                    <div className="overflow-y-auto h-full p-4 max-h-[600px] doc-viewer">
                      <style>{`
                        .doc-viewer table.data-table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 12px; }
                        .doc-viewer table.data-table th { background: #1e3a5f; color: #fff; padding: 6px 10px; text-align: left; border: 1px solid #334155; }
                        .doc-viewer table.data-table td { padding: 5px 10px; border: 1px solid #334155; vertical-align: top; color: #cbd5e1; }
                        .doc-viewer table.data-table tr:nth-child(even) td { background: #1e293b; }
                        .doc-viewer .calc-block { background: #0f172a; border-left: 3px solid #22d3ee; padding: 8px 12px; margin: 10px 0; font-family: monospace; font-size: 11px; color: #a5f3fc; border-radius: 4px; }
                        .doc-viewer .param-block { background: #1e293b; padding: 6px 10px; margin: 6px 0; border-left: 2px solid #475569; color: #cbd5e1; font-size: 12px; }
                        .doc-viewer .warn-block { background: #422006; border-left: 3px solid #f59e0b; padding: 8px 12px; margin: 10px 0; color: #fcd34d; font-size: 12px; border-radius: 4px; }
                        .doc-viewer h1 { font-size: 16px; font-weight: 700; color: #e2e8f0; margin: 16px 0 8px; border-bottom: 1px solid #334155; padding-bottom: 4px; }
                        .doc-viewer h2 { font-size: 14px; font-weight: 600; color: #cbd5e1; margin: 14px 0 6px; }
                        .doc-viewer h3 { font-size: 13px; font-weight: 600; color: #94a3b8; margin: 10px 0 4px; }
                        .doc-viewer p { font-size: 13px; line-height: 1.7; color: #94a3b8; margin: 4px 0; }
                        .doc-viewer ul, .doc-viewer ol { padding-left: 20px; margin: 6px 0; }
                        .doc-viewer li { font-size: 13px; color: #94a3b8; line-height: 1.6; }
                        .doc-viewer b, .doc-viewer strong { color: #cbd5e1; }
                      `}</style>
                      <ContentViewer content={selectedDoc.content} contentType={selectedDoc.contentType} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : selectedSection ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <Icon name="FileSearch" size={40} className="text-slate-600" />
              <div>
                <p className="text-slate-400 font-medium">{selectedSection.code} — {selectedSection.name}</p>
                <p className="text-slate-500 text-sm mt-1">
                  {selectedSection.subSections.length} подразделов · {selectedSection.duration}
                </p>
              </div>

              {/* Deliverables */}
              {selectedSection.deliverables.length > 0 && (
                <div className="max-w-md text-left bg-slate-800/40 rounded-lg p-3 w-full border border-slate-700/50">
                  <p className="text-xs font-medium text-slate-300 mb-2">Ожидаемые результаты:</p>
                  <ul className="space-y-1">
                    {selectedSection.deliverables.map((d, i) => (
                      <li key={i} className="text-xs text-slate-400 flex gap-2">
                        <Icon name="FileCheck" size={12} className="text-cyan-500 mt-0.5 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                onClick={() => handleGenerate(selectedSection)}
                disabled={!!generating}
                className="gap-2 bg-cyan-600 hover:bg-cyan-700"
              >
                {generating === String(selectedSection.phaseId)
                  ? <><Icon name="Loader" size={15} className="animate-spin" />Проектирую...</>
                  : <><Icon name="Sparkles" size={15} />Сгенерировать раздел целиком</>}
              </Button>

              <p className="text-xs text-slate-500 max-w-sm">
                ИИ создаст полноценный раздел по ГОСТ Р 21.1101 с таблицами, нормативными ссылками и расчётами.
                Или выберите подраздел слева для точечной генерации.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
              Выберите этап из списка слева
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionModule;
