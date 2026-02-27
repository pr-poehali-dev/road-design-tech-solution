import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const GENERATE_KP_URL = 'https://functions.poehali.dev/f595b8a7-903c-4870-b1f7-d0aac554463f';

interface Document {
  id: string;
  section: string;
  sectionCode: string;
  status: 'draft' | 'review' | 'approved' | 'rejected';
  content: string;
  aiGenerated: boolean;
  version: number;
  createdAt: string;
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

const sections = [
  { code: 'ПЗ', name: 'Пояснительная записка', icon: 'FileText' },
  { code: 'ПЗУ', name: 'Схема планировочной организации', icon: 'Map' },
  { code: 'АР', name: 'Архитектурные решения', icon: 'Building2' },
  { code: 'КР', name: 'Конструктивные решения', icon: 'Hammer' },
  { code: 'ИОС', name: 'Инженерные системы', icon: 'Zap' },
  { code: 'ПОС', name: 'Проект организации строительства', icon: 'HardHat' },
  { code: 'ООС', name: 'Охрана окружающей среды', icon: 'Leaf' },
  { code: 'ПБ', name: 'Пожарная безопасность', icon: 'Flame' },
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

  const buildContext = (sectionCode: string, sectionName: string): string => {
    const ctx: string[] = [];

    if (projectContext?.kpData) {
      const kp = projectContext.kpData as Record<string, unknown>;
      ctx.push(`=== КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ ===`);
      ctx.push(`Проект: ${kp.title}`);
      ctx.push(`Клиент: ${kp.client}`);
      ctx.push(`Краткое резюме: ${kp.summary}`);
      ctx.push(`Общая стоимость: ${kp.total_sum} руб.`);

      const timeline = kp.timeline as Array<{ phase: string; duration: string; description: string }> | undefined;
      if (timeline?.length) {
        ctx.push(`\nСроки: ${timeline.map(t => `${t.phase} (${t.duration}): ${t.description}`).join('; ')}`);
      }
      const conditions = (kp.payment_conditions || kp.conditions) as string[] | undefined;
      if (conditions?.length) {
        ctx.push(`Условия: ${conditions.join('; ')}`);
      }
    }

    if (projectContext?.roadmapData) {
      const rm = projectContext.roadmapData as Record<string, unknown>;
      ctx.push(`\n=== ДОРОЖНАЯ КАРТА ===`);
      ctx.push(`${rm.overview}`);
      const phases = rm.phases as Array<{ name: string; duration: string; tasks: string[]; deliverables: string[] }> | undefined;
      if (phases?.length) {
        ctx.push(`Этапы: ${phases.map(p => `${p.name} (${p.duration}): задачи — ${p.tasks.join(', ')}`).join(' | ')}`);
      }
    }

    if (projectContext?.filesText) {
      ctx.push(`\n=== ТЕХНИЧЕСКОЕ ЗАДАНИЕ ===`);
      ctx.push(projectContext.filesText.slice(0, 8000));
    }

    ctx.push(`\n=== ЗАДАЧА ===`);
    ctx.push(`Разработай раздел "${sectionCode} — ${sectionName}" проектной документации на основе приведённых данных.`);
    ctx.push(`Подготовь профессиональный структурированный текст раздела с конкретными техническими решениями, нормативными ссылками и расчётными обоснованиями.`);

    return ctx.join('\n');
  };

  const pollJob = async (jobId: string, maxWaitMs = 120000): Promise<Record<string, unknown>> => {
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
    throw new Error('Превышено время ожидания (2 мин)');
  };

  const handleGenerateDocument = async (sectionCode: string, sectionName: string) => {
    setGenerating(sectionCode);
    toast({ title: 'AI генерирует раздел...', description: `DeepSeek создаёт черновик раздела ${sectionCode}` });

    try {
      const contextText = buildContext(sectionCode, sectionName);

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
        section: sectionName,
        sectionCode,
        status: 'draft',
        content,
        aiGenerated: true,
        version: 1,
        createdAt: new Date().toISOString(),
      };

      setDocuments(prev => [...prev.filter(d => d.sectionCode !== sectionCode), newDoc]);
      setSelectedDoc(newDoc);
      setEditContent(content);
      toast({ title: 'Раздел создан', description: `Черновик ${sectionCode} готов к редактированию` });
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

  const hasContext = !!(projectContext?.kpData || projectContext?.filesText);

  return (
    <div className="space-y-4">
      {hasContext && (
        <Card className="bg-emerald-900/20 border-emerald-500/30">
          <CardContent className="py-3 px-4">
            <div className="flex items-center gap-2 text-sm">
              <Icon name="CheckCircle" size={16} className="text-emerald-400 shrink-0" />
              <span className="text-emerald-300 font-medium">Контекст загружен:</span>
              <span className="text-slate-300">
                {[
                  projectContext?.kpData && 'КП',
                  projectContext?.roadmapData && 'дорожная карта',
                  projectContext?.filesText && 'ТЗ',
                ].filter(Boolean).join(' + ')}
              </span>
              <span className="text-slate-400 text-xs ml-2">— ИИ будет генерировать разделы с учётом этих данных</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!hasContext && (
        <Card className="bg-slate-800/40 border-slate-600/30">
          <CardContent className="py-3 px-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Icon name="Info" size={16} className="shrink-0" />
              Нет контекста. Передайте КП в производство из вкладки «Генерация КП» — ИИ будет генерировать разделы на основе ТЗ и дорожной карты
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Icon name="FolderOpen" size={16} />
                Разделы проекта
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sections.map((section) => {
                const doc = documents.find(d => d.sectionCode === section.code);
                const isGenerating = generating === section.code;
                const isSelected = selectedDoc?.sectionCode === section.code;

                return (
                  <div
                    key={section.code}
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
                    <p className="text-xs text-muted-foreground mb-2">{section.name}</p>
                    {!doc && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                        onClick={e => { e.stopPropagation(); handleGenerateDocument(section.code, section.name); }}
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
                        onClick={e => { e.stopPropagation(); handleGenerateDocument(section.code, section.name); }}
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
                  <p className="text-sm">Выберите раздел или сгенерируйте его через AI</p>
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

export default ProductionModule;
