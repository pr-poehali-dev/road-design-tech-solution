import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Lead } from './CRMKanban';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  section: string;
  sectionCode: string;
  status: 'draft' | 'review' | 'approved' | 'rejected';
  content: string;
  aiGenerated: boolean;
  author: string;
  version: number;
  createdAt: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

interface ProductionModuleProps {
  lead: Lead | null;
}

export const ProductionModule = ({ lead }: ProductionModuleProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);

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

  const handleGenerateDocument = async (sectionCode: string, sectionName: string) => {
    if (!lead) return;

    setGenerating(sectionCode);
    toast({
      title: 'AI генерирует документ...',
      description: `YandexGPT создаёт черновик раздела ${sectionCode}`,
    });

    try {
      const response = await fetch('https://functions.poehali.dev/c8a36558-765a-4876-a143-62697345f8d7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectData: lead,
          section: sectionCode,
          sectionName: sectionName,
        }),
      });

      const data = await response.json();

      const newDoc: Document = {
        id: crypto.randomUUID(),
        section: sectionName,
        sectionCode: sectionCode,
        status: 'draft',
        content: data.content,
        aiGenerated: true,
        author: 'AI YandexGPT',
        version: 1,
        createdAt: new Date().toISOString(),
        comments: [],
      };

      setDocuments([...documents, newDoc]);
      setSelectedDoc(newDoc);

      toast({
        title: 'Документ создан!',
        description: `Черновик ${sectionCode} готов к редактированию`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка генерации',
        description: 'Не удалось создать документ',
        variant: 'destructive',
      });
    } finally {
      setGenerating(null);
    }
  };

  const handleSaveDocument = () => {
    if (!selectedDoc) return;

    setDocuments(
      documents.map((doc) =>
        doc.id === selectedDoc.id
          ? { ...selectedDoc, version: selectedDoc.version + 1 }
          : doc
      )
    );

    setEditMode(false);
    toast({
      title: 'Сохранено',
      description: `Версия ${selectedDoc.version + 1} документа ${selectedDoc.sectionCode}`,
    });
  };

  const handleApproveDocument = () => {
    if (!selectedDoc) return;

    setDocuments(
      documents.map((doc) =>
        doc.id === selectedDoc.id ? { ...doc, status: 'approved' } : doc
      )
    );

    setSelectedDoc({ ...selectedDoc, status: 'approved' });

    toast({
      title: 'Документ утверждён',
      description: `${selectedDoc.sectionCode} готов к передаче клиенту`,
    });
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'review':
        return 'bg-blue-500/10 text-blue-500';
      case 'approved':
        return 'bg-green-500/10 text-green-500';
      case 'rejected':
        return 'bg-red-500/10 text-red-500';
    }
  };

  const getStatusLabel = (status: Document['status']) => {
    switch (status) {
      case 'draft':
        return 'Черновик';
      case 'review':
        return 'На проверке';
      case 'approved':
        return 'Утверждён';
      case 'rejected':
        return 'Отклонён';
    }
  };

  if (!lead) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Выберите проект для начала работы
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="FolderOpen" size={20} />
              Разделы проекта
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sections.map((section) => {
              const doc = documents.find((d) => d.sectionCode === section.code);
              const isGenerating = generating === section.code;

              return (
                <div
                  key={section.code}
                  className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => doc && setSelectedDoc(doc)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon name={section.icon as any} size={16} />
                      <span className="font-medium text-sm">{section.code}</span>
                    </div>
                    {doc && (
                      <Badge className={getStatusColor(doc.status)}>
                        {getStatusLabel(doc.status)}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {section.name}
                  </div>
                  {!doc ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateDocument(section.code, section.name);
                      }}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Icon name="Loader2" size={14} className="mr-2 animate-spin" />
                          Генерация...
                        </>
                      ) : (
                        <>
                          <Icon name="Sparkles" size={14} className="mr-2" />
                          Создать с AI
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Версия {doc.version} • {doc.author}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {selectedDoc ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedDoc.sectionCode}. {selectedDoc.section}
                    {selectedDoc.aiGenerated && (
                      <Badge variant="outline" className="ml-2">
                        <Icon name="Sparkles" size={12} className="mr-1" />
                        AI
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    Версия {selectedDoc.version} • {selectedDoc.author} •{' '}
                    {new Date(selectedDoc.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <Badge className={getStatusColor(selectedDoc.status)}>
                  {getStatusLabel(selectedDoc.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Содержание документа</label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? (
                      <>
                        <Icon name="X" size={14} className="mr-2" />
                        Отмена
                      </>
                    ) : (
                      <>
                        <Icon name="Pencil" size={14} className="mr-2" />
                        Редактировать
                      </>
                    )}
                  </Button>
                </div>
                {editMode ? (
                  <Textarea
                    value={selectedDoc.content}
                    onChange={(e) =>
                      setSelectedDoc({ ...selectedDoc, content: e.target.value })
                    }
                    rows={20}
                    className="font-mono text-sm"
                  />
                ) : (
                  <div className="p-4 border rounded-lg bg-muted/50 whitespace-pre-wrap text-sm">
                    {selectedDoc.content}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {editMode && (
                  <Button onClick={handleSaveDocument} className="flex-1">
                    <Icon name="Save" size={16} className="mr-2" />
                    Сохранить изменения
                  </Button>
                )}
                {selectedDoc.status === 'draft' && !editMode && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setDocuments(
                          documents.map((doc) =>
                            doc.id === selectedDoc.id
                              ? { ...doc, status: 'review' }
                              : doc
                          )
                        )
                      }
                      className="flex-1"
                    >
                      <Icon name="Send" size={16} className="mr-2" />
                      Отправить на проверку
                    </Button>
                  </>
                )}
                {selectedDoc.status === 'review' && !editMode && (
                  <Button onClick={handleApproveDocument} className="flex-1">
                    <Icon name="CheckCircle" size={16} className="mr-2" />
                    Утвердить документ
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-20 pb-20">
              <div className="text-center text-muted-foreground">
                <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-20" />
                <p>Выберите раздел из списка слева</p>
                <p className="text-sm mt-2">
                  или создайте новый документ с помощью AI
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};