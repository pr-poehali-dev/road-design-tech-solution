import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Stage {
  id: string;
  section: string;
  title: string;
  duration: number;
  startDate: string | null;
  endDate: string | null;
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  assignee: string;
  dependencies: string[];
  documents: Array<{
    id: string;
    name: string;
    status: 'draft' | 'review' | 'approved';
  }>;
}

interface ScheduleGeneratorProps {
  sections: string[];
  projectStartDate: string;
  onScheduleGenerated: (stages: Stage[]) => void;
}

export const ScheduleGenerator = ({ sections, projectStartDate, onScheduleGenerated }: ScheduleGeneratorProps) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const sectionDurations: { [key: string]: number } = {
    'ПЗ': 5,
    'ПЗУ': 7,
    'АР': 15,
    'КР': 20,
    'ИОС': 18,
    'ПОС': 10,
    'ООС': 8,
    'ПБ': 12,
    'ОДИ': 5,
    'ЭЭ': 7
  };

  const sectionDependencies: { [key: string]: string[] } = {
    'ПЗУ': ['ПЗ'],
    'АР': ['ПЗ', 'ПЗУ'],
    'КР': ['АР'],
    'ИОС': ['АР', 'КР'],
    'ПОС': ['КР'],
    'ООС': ['ПЗ'],
    'ПБ': ['АР', 'КР'],
    'ОДИ': ['АР'],
    'ЭЭ': ['АР', 'ИОС']
  };

  const generateSchedule = () => {
    setGenerating(true);

    const newStages: Stage[] = [];
    const startDate = new Date(projectStartDate);
    let currentDate = new Date(startDate);

    sections.forEach((section, index) => {
      const sectionCode = section.split(' -')[0];
      const duration = sectionDurations[sectionCode] || 10;
      const deps = sectionDependencies[sectionCode] || [];

      // Если есть зависимости, найти максимальную дату окончания зависимостей
      if (deps.length > 0) {
        const depStages = newStages.filter(s => 
          deps.some(dep => s.section.startsWith(dep))
        );
        if (depStages.length > 0) {
          const maxEndDate = new Date(Math.max(...depStages.map(s => 
            s.endDate ? new Date(s.endDate).getTime() : 0
          )));
          currentDate = new Date(maxEndDate);
        }
      }

      const stageStartDate = new Date(currentDate);
      const stageEndDate = new Date(currentDate);
      stageEndDate.setDate(stageEndDate.getDate() + duration);

      newStages.push({
        id: `stage-${index}`,
        section: sectionCode,
        title: section,
        duration,
        startDate: stageStartDate.toISOString(),
        endDate: stageEndDate.toISOString(),
        status: 'pending',
        assignee: '',
        dependencies: deps,
        documents: [
          {
            id: `doc-${index}-1`,
            name: `${sectionCode}_Текстовая часть.docx`,
            status: 'draft'
          },
          {
            id: `doc-${index}-2`,
            name: `${sectionCode}_Графическая часть.pdf`,
            status: 'draft'
          }
        ]
      });

      // Параллельные разделы не сдвигают дату
      const parallelSections = ['ООС', 'ОДИ'];
      if (!parallelSections.includes(sectionCode)) {
        currentDate = stageEndDate;
      }
    });

    setStages(newStages);
    onScheduleGenerated(newStages);
    setGenerating(false);

    toast({
      title: 'План-график создан!',
      description: `Сгенерировано ${newStages.length} этапов проектирования`
    });
  };

  useEffect(() => {
    if (sections.length > 0 && projectStartDate && stages.length === 0) {
      generateSchedule();
    }
  }, [sections, projectStartDate]);

  const getStatusColor = (status: Stage['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'review': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: Stage['status']) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'in_progress': return 'В работе';
      case 'review': return 'На проверке';
      default: return 'Ожидает';
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const overallProgress = stages.length > 0
    ? (stages.filter(s => s.status === 'completed').length / stages.length) * 100
    : 0;

  if (stages.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">
              План-график будет создан автоматически после выбора разделов
            </p>
            {sections.length > 0 && (
              <Button onClick={generateSchedule} disabled={generating}>
                {generating ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                    Генерация...
                  </>
                ) : (
                  <>
                    <Icon name="Sparkles" size={16} className="mr-2" />
                    Сгенерировать план-график
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Icon name="Gantt" size={20} />
              План-график проектирования
            </CardTitle>
            <Badge variant="secondary" className="text-sm">
              {stages.filter(s => s.status === 'completed').length} / {stages.length} этапов
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Общий прогресс</span>
              <span className="font-medium">{overallProgress.toFixed(0)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="space-y-3">
            {stages.map((stage, index) => (
              <Card key={stage.id} className="border-l-4" style={{
                borderLeftColor: getStatusColor(stage.status)
              }}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono text-xs">
                          {stage.section}
                        </Badge>
                        <h4 className="font-semibold">{stage.title}</h4>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={14} />
                          {formatDate(stage.startDate)} — {formatDate(stage.endDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" size={14} />
                          {stage.duration} дней
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(stage.status)}>
                      {getStatusLabel(stage.status)}
                    </Badge>
                  </div>

                  {stage.dependencies.length > 0 && (
                    <div className="text-xs text-muted-foreground mb-2">
                      <Icon name="GitBranch" size={12} className="inline mr-1" />
                      Зависит от: {stage.dependencies.join(', ')}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {stage.documents.map(doc => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-2 text-xs bg-muted px-2 py-1 rounded"
                      >
                        <Icon name="FileText" size={12} />
                        <span>{doc.name}</span>
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {doc.status === 'draft' && 'Черновик'}
                          {doc.status === 'review' && 'Проверка'}
                          {doc.status === 'approved' && 'Утверждено'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
