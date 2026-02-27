import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const GENERATE_KP_URL = 'https://functions.poehali.dev/f595b8a7-903c-4870-b1f7-d0aac554463f';

interface Document {
  id: string;
  phaseId: number | string;
  section: string;
  sectionCode: string;
  status: 'draft' | 'review' | 'approved' | 'rejected';
  content: string;
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

const FALLBACK_SECTIONS = [
  { code: 'ПЗ', name: 'Пояснительная записка', icon: 'FileText' },
  { code: 'ПД', name: 'Проектная документация', icon: 'BookOpen' },
  { code: 'РД', name: 'Рабочая документация', icon: 'Hammer' },
  { code: 'ИИ', name: 'Инженерные изыскания', icon: 'Search' },
  { code: 'ЭКС', name: 'Экспертиза', icon: 'CheckSquare' },
];

const statusLabels: Record<Document['status'], { label: string; cls: string }> = {
  draft: { label: 'Черновик', cls: 'bg-yellow-500/10 text-yellow-500' },
  review: { label: 'На проверке', cls: 'bg-blue-500/10 text-blue-500' },
  approved: { label: 'Утверждён', cls: 'bg-green-500/10 text-green-500' },
  rejected: { label: 'Отклонён', cls: 'bg-red-500/10 text-red-500' },
};

export const ProductionModule = ({ projectContext }: ProductionModuleProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (projectContext?.kpId) {
      setDocuments([]);
      setSelectedDoc(null);
    }
  }, [projectContext?.kpId]);

  // Берём этапы из дорожной карты, иначе fallback
  const sections = useMemo(() => {
    const phases = (projectContext?.roadmapData?.phases as RoadmapPhase[] | undefined);
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
      }));
    }
    return FALLBACK_SECTIONS.map(s => ({ ...s, phaseId: s.code, duration: '', deliverables: [], tasks: [], responsible: '' }));
  }, [projectContext?.roadmapData]);

  const buildContext = (sectionCode: string, sectionName: string, phaseId: number | string): string => {
    const ctx: string[] = [];

    if (projectContext?.filesText) {
      ctx.push(`=== ТЕХНИЧЕСКОЕ ЗАДАНИЕ ===`);
      ctx.push(projectContext.filesText.slice(0, 6000));
    }

    if (projectContext?.kpData) {
      const kp = projectContext.kpData as Record<string, unknown>;
      ctx.push(`\n=== КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ ===`);
      ctx.push(`Проект: ${kp.title}`);
      ctx.push(`Клиент: ${kp.client}`);
      ctx.push(`Краткое резюме: ${kp.summary}`);
    }

    if (projectContext?.roadmapData) {
      const rm = projectContext.roadmapData as Record<string, unknown>;
      ctx.push(`\n=== ДОРОЖНАЯ КАРТА ПРОЕКТА ===`);
      ctx.push(`Обзор: ${rm.overview}`);
      const phases = rm.phases as RoadmapPhase[] | undefined;
      if (phases?.length) {
        ctx.push(`Этапы ПИР:`);
        phases.forEach(p => {
          const marker = p.id === phaseId ? ' ◀ ТЕКУЩИЙ ЭТАП' : '';
          ctx.push(`  • ${p.name} (${p.duration})${marker}: ${p.deliverables.join(', ')}`);
        });
      }
    }

    // Данные конкретного этапа
    const phase = (projectContext?.roadmapData?.phases as RoadmapPhase[] | undefined)?.find(p => p.id === phaseId);
    if (phase) {
      ctx.push(`\n=== ТЕКУЩИЙ ЭТАП ===`);
      ctx.push(`Название: ${phase.name}`);
      ctx.push(`Срок: ${phase.duration}`);
      ctx.push(`Задачи: ${phase.tasks.join('; ')}`);
      ctx.push(`Ожидаемые результаты: ${phase.deliverables.join('; ')}`);
    }

    ctx.push(`\n=== ЗАДАЧА ===`);
    ctx.push(`Разработай содержание этапа "${sectionCode} — ${sectionName}".`);
    ctx.push(`Подготовь профессиональный структурированный текст с конкретными техническими решениями, нормативными ссылками (СП, ГОСТ, СНиП, ФЗ) и расчётными обоснованиями, соответствующими объекту из ТЗ.`);
    if (phase?.deliverables?.length) {
      ctx.push(`Охвати в тексте следующие документы/разделы: ${phase.deliverables.join(', ')}.`);
    }

    return ctx.join('\n');
  };

  const pollJob = async (jobId: string, maxWaitMs = 180000): Promise<Record<string, unknown>> => {
    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
      await new Promise(r => setTimeout(r, 3000));
      const res = await fetch(GENERATE_KP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_job', job_id: jobId }),
      });
      const data = await res.json();
      if (data.status === 'done') return data.data;
      if (data.status === 'error') throw new Error(data.error || 'Ошибка генерации');
    }
    throw new Error('Превышено время ожидания (3 мин)');
  };

  const handleGenerateDocument = async (sectionCode: string, sectionName: string, phaseId: number | string) => {
    const key = String(phaseId);
    setGenerating(key);
    toast({ title: 'AI генерирует раздел...', description: `DeepSeek создаёт черновик: ${sectionName}` });

    try {
      const contextText = buildContext(sectionCode, sectionName, phaseId);

      const startRes = await fetch(GENERATE_KP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_section',
          section_code: sectionCode,
          section_name: sectionName,
          context: contextText,
        }),
      });
      const startData = await startRes.json();
      if (!startData.job_id) throw new Error(startData.error || 'Не удалось запустить задачу');

      const result = await pollJob(startData.job_id);
      const content = (result.content || result.text || JSON.stringify(result)) as string;

      const newDoc: Document = {
        id: crypto.randomUUID(),
        phaseId,
        section: sectionName,
        sectionCode,
        status: 'draft',
        content,
        aiGenerated: true,
        version: 1,
        createdAt: new Date().toISOString(),
      };

      setDocuments(prev => [...prev.filter(d => String(d.phaseId) !== key), newDoc]);
      setSelectedDoc(newDoc);
      setEditContent(content);
      toast({ title: 'Раздел создан', description: `Черновик «${sectionCode}» готов к редактированию` });
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
    const updated = { ...selectedDoc, content: editContent, version: selectedDoc.version + 1 };
    setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? updated : d));
    setSelectedDoc(updated);
    setEditMode(false);
    toast({ title: 'Сохранено', description: `Версия ${updated.version} раздела ${selectedDoc.sectionCode}` });
  };

  const handleStatusChange = (newStatus: Document['status']) => {
    if (!selectedDoc) return;
    const updated = { ...selectedDoc, status: newStatus };
    setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? updated : d));
    setSelectedDoc(updated);
    toast({ title: `Статус: ${statusLabels[newStatus].label}`, description: selectedDoc.sectionCode });
  };

  const hasRoadmap = !!(projectContext?.roadmapData?.phases);
  const hasContext = !!(projectContext?.kpData || projectContext?.filesText);

  return (
    <div className="space-y-4">
      <Card className={hasRoadmap ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-amber-900/20 border-amber-500/30'}>
        <CardContent className="py-3 px-4">
          <div className="flex items-center gap-2 text-sm">
            <Icon name={hasRoadmap ? 'CheckCircle' : 'AlertCircle'} size={16} className={hasRoadmap ? 'text-emerald-400 shrink-0' : 'text-amber-400 shrink-0'} />
            <span className={`font-medium ${hasRoadmap ? 'text-emerald-300' : 'text-amber-300'}`}>
              {hasRoadmap ? 'Разделы из дорожной карты:' : 'Дорожная карта не загружена:'}
            </span>
            <span className="text-slate-300 text-xs">
              {hasRoadmap
                ? `${sections.length} этапов ПИР${hasContext ? ' · КП + ТЗ загружены' : ''}`
                : 'Передайте КП в производство — разделы сформируются автоматически по ТЗ'}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Icon name="FolderOpen" size={16} />
                Этапы ПИР
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sections.map((section) => {
                const key = String(section.phaseId);
                const doc = documents.find(d => String(d.phaseId) === key);
                const isGenerating = generating === key;
                const isSelected = selectedDoc && String(selectedDoc.phaseId) === key;

                return (
                  <div
                    key={key}
                    onClick={() => doc && handleSelectDoc(doc)}
                    className={`p-3 border rounded-lg transition-colors cursor-pointer ${isSelected ? 'bg-accent border-primary/50' : 'hover:bg-accent'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Icon name={section.icon as Parameters<typeof Icon>[0]['name']} size={14} />
                        <span className="font-medium text-sm">{section.code}</span>
                      </div>
                      {doc && (
                        <Badge className={`text-xs ${statusLabels[doc.status].cls}`}>
                          {statusLabels[doc.status].label}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{section.name}</p>
                    {section.duration && (
                      <p className="text-xs text-slate-500 mb-2">⏱ {section.duration}</p>
                    )}
                    {!doc && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                        onClick={e => { e.stopPropagation(); handleGenerateDocument(section.code, section.name, section.phaseId); }}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <><Icon name="Loader2" size={12} className="mr-1 animate-spin" />Генерация...</>
                        ) : (
                          <><Icon name="Sparkles" size={12} className="mr-1" />Создать с AI</>
                        )}
                      </Button>
                    )}
                    {doc && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full text-xs text-muted-foreground"
                        onClick={e => { e.stopPropagation(); handleGenerateDocument(section.code, section.name, section.phaseId); }}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <><Icon name="Loader2" size={12} className="mr-1 animate-spin" />Перегенерация...</>
                        ) : (
                          <><Icon name="RefreshCw" size={12} className="mr-1" />Перегенерировать</>
                        )}
                      </Button>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {!selectedDoc ? (
            <Card className="h-full min-h-[400px]">
              <CardContent className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Icon name="FileSearch" size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Выберите этап или сгенерируйте его через AI</p>
                  {hasRoadmap && (
                    <p className="text-xs mt-2 text-slate-500">Разделы сформированы по дорожной карте проекта</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon name="File" size={18} />
                    {selectedDoc.sectionCode} — {selectedDoc.section}
                    <Badge className={`text-xs ${statusLabels[selectedDoc.status].cls}`}>
                      {statusLabels[selectedDoc.status].label}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-normal">v{selectedDoc.version}</span>
                  </CardTitle>
                  <div className="flex gap-2 flex-wrap">
                    {selectedDoc.status === 'draft' && (
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange('review')} className="text-xs">
                        <Icon name="Send" size={12} className="mr-1" />На проверку
                      </Button>
                    )}
                    {selectedDoc.status === 'review' && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange('approved')} className="text-xs text-green-600 border-green-500/50 hover:bg-green-500/10">
                          <Icon name="CheckCircle" size={12} className="mr-1" />Утвердить
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange('rejected')} className="text-xs text-red-600 border-red-500/50 hover:bg-red-500/10">
                          <Icon name="XCircle" size={12} className="mr-1" />Отклонить
                        </Button>
                      </>
                    )}
                    {!editMode ? (
                      <Button size="sm" variant="outline" onClick={() => setEditMode(true)} className="text-xs">
                        <Icon name="Pencil" size={12} className="mr-1" />Редактировать
                      </Button>
                    ) : (
                      <>
                        <Button size="sm" onClick={handleSaveDocument} className="text-xs">
                          <Icon name="Save" size={12} className="mr-1" />Сохранить
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setEditMode(false); setEditContent(selectedDoc.content); }} className="text-xs">
                          Отмена
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <Textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="min-h-[400px] font-mono text-sm resize-none"
                  />
                ) : (
                  <div className="prose prose-sm max-w-none text-sm text-foreground whitespace-pre-wrap leading-relaxed min-h-[400px] max-h-[600px] overflow-y-auto bg-muted/30 rounded-lg p-4">
                    {selectedDoc.content}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

function getPhaseIcon(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('изыскан')) return 'Search';
  if (n.includes('геодез')) return 'Compass';
  if (n.includes('геолог')) return 'Mountain';
  if (n.includes('эколог')) return 'Leaf';
  if (n.includes('предпроект') || n.includes('ппт') || n.includes('пмт')) return 'Map';
  if (n.includes('проектн') || n.includes(' пд') || n.includes('стадия п')) return 'FileText';
  if (n.includes('рабоч') || n.includes(' рд') || n.includes('стадия р')) return 'Hammer';
  if (n.includes('экспертиз') || n.includes('гэ') || n.includes('нгэ') || n.includes('гээ')) return 'CheckSquare';
  if (n.includes('авторск') || n.includes(' ан')) return 'Eye';
  if (n.includes('нтс') || n.includes('согласован')) return 'Users';
  if (n.includes('ту') || n.includes('технич')) return 'Settings';
  return 'FileText';
}

export default ProductionModule;
