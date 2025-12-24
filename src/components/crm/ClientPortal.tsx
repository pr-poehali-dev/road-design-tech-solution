import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Lead } from './CRMKanban';
import { useToast } from '@/hooks/use-toast';

interface ProjectDocument {
  id: string;
  section: string;
  sectionCode: string;
  status: 'pending' | 'review' | 'approved' | 'rejected';
  uploadedAt: string;
  fileUrl?: string;
  comments: ProjectComment[];
}

interface ProjectComment {
  id: string;
  author: string;
  role: 'client' | 'contractor';
  text: string;
  createdAt: string;
  attachments?: string[];
}

interface ClientPortalProps {
  lead: Lead | null;
}

export const ClientPortal = ({ lead }: ClientPortalProps) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<ProjectDocument[]>([
    {
      id: '1',
      section: 'Пояснительная записка',
      sectionCode: 'ПЗ',
      status: 'review',
      uploadedAt: new Date().toISOString(),
      comments: [],
    },
    {
      id: '2',
      section: 'Архитектурные решения',
      sectionCode: 'АР',
      status: 'review',
      uploadedAt: new Date().toISOString(),
      comments: [],
    },
  ]);
  const [selectedDoc, setSelectedDoc] = useState<ProjectDocument | null>(null);
  const [newComment, setNewComment] = useState('');

  const projectProgress = {
    total: 8,
    completed: 2,
    inReview: 2,
    pending: 4,
  };

  const handleApprove = (docId: string) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === docId ? { ...doc, status: 'approved' } : doc
      )
    );

    toast({
      title: 'Документ согласован',
      description: 'Спасибо за оперативность!',
    });

    if (selectedDoc?.id === docId) {
      setSelectedDoc({ ...selectedDoc, status: 'approved' });
    }
  };

  const handleReject = (docId: string) => {
    if (!newComment.trim()) {
      toast({
        title: 'Укажите причину',
        description: 'Добавьте комментарий перед отклонением',
        variant: 'destructive',
      });
      return;
    }

    const comment: ProjectComment = {
      id: crypto.randomUUID(),
      author: lead?.name || 'Клиент',
      role: 'client',
      text: newComment,
      createdAt: new Date().toISOString(),
    };

    setDocuments(
      documents.map((doc) =>
        doc.id === docId
          ? { ...doc, status: 'rejected', comments: [...doc.comments, comment] }
          : doc
      )
    );

    toast({
      title: 'Замечания отправлены',
      description: 'Проектная организация внесёт правки',
    });

    setNewComment('');
    if (selectedDoc?.id === docId) {
      setSelectedDoc({
        ...selectedDoc,
        status: 'rejected',
        comments: [...selectedDoc.comments, comment],
      });
    }
  };

  const handleAddComment = () => {
    if (!selectedDoc || !newComment.trim()) return;

    const comment: ProjectComment = {
      id: crypto.randomUUID(),
      author: lead?.name || 'Клиент',
      role: 'client',
      text: newComment,
      createdAt: new Date().toISOString(),
    };

    setDocuments(
      documents.map((doc) =>
        doc.id === selectedDoc.id
          ? { ...doc, comments: [...doc.comments, comment] }
          : doc
      )
    );

    setSelectedDoc({
      ...selectedDoc,
      comments: [...selectedDoc.comments, comment],
    });

    setNewComment('');

    toast({
      title: 'Комментарий отправлен',
      description: 'Проектировщики получили уведомление',
    });
  };

  const getStatusColor = (status: ProjectDocument['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-500/10 text-gray-500';
      case 'review':
        return 'bg-blue-500/10 text-blue-500';
      case 'approved':
        return 'bg-green-500/10 text-green-500';
      case 'rejected':
        return 'bg-red-500/10 text-red-500';
    }
  };

  const getStatusLabel = (status: ProjectDocument['status']) => {
    switch (status) {
      case 'pending':
        return 'Ожидает';
      case 'review':
        return 'На согласовании';
      case 'approved':
        return 'Согласовано';
      case 'rejected':
        return 'Замечания';
    }
  };

  if (!lead) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Выберите проект
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="BarChart3" size={20} />
            Прогресс проекта
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Готовность документации</span>
              <span className="font-medium">
                {Math.round(
                  ((projectProgress.completed + projectProgress.inReview) /
                    projectProgress.total) *
                    100
                )}
                %
              </span>
            </div>
            <Progress
              value={
                ((projectProgress.completed + projectProgress.inReview) /
                  projectProgress.total) *
                100
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-500/10 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {projectProgress.completed}
              </div>
              <div className="text-xs text-muted-foreground">Согласовано</div>
            </div>
            <div className="text-center p-3 bg-blue-500/10 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {projectProgress.inReview}
              </div>
              <div className="text-xs text-muted-foreground">На проверке</div>
            </div>
            <div className="text-center p-3 bg-gray-500/10 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {projectProgress.pending}
              </div>
              <div className="text-xs text-muted-foreground">В работе</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="FileText" size={20} />
                Документы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{doc.sectionCode}</span>
                    <Badge className={getStatusColor(doc.status)}>
                      {getStatusLabel(doc.status)}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {doc.section}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(doc.uploadedAt).toLocaleDateString('ru-RU')}
                    {doc.comments.length > 0 && (
                      <span className="ml-2">
                        • {doc.comments.length} комментариев
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedDoc ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {selectedDoc.sectionCode}. {selectedDoc.section}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                      Загружен{' '}
                      {new Date(selectedDoc.uploadedAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <Badge className={getStatusColor(selectedDoc.status)}>
                    {getStatusLabel(selectedDoc.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Icon name="Download" size={16} className="mr-2" />
                    Скачать PDF
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Icon name="Eye" size={16} className="mr-2" />
                    Просмотр
                  </Button>
                </div>

                {selectedDoc.status === 'review' && (
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <Icon
                        name="AlertCircle"
                        size={20}
                        className="text-blue-600 mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-2">
                          Документ ожидает согласования
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(selectedDoc.id)}
                          >
                            <Icon name="Check" size={14} className="mr-2" />
                            Согласовать
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(selectedDoc.id)}
                          >
                            <Icon name="X" size={14} className="mr-2" />
                            Вернуть на доработку
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="font-medium flex items-center gap-2">
                    <Icon name="MessageSquare" size={16} />
                    Комментарии
                  </div>

                  {selectedDoc.comments.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDoc.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className={`p-3 rounded-lg border ${
                            comment.role === 'client'
                              ? 'bg-blue-500/5 border-blue-500/20'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">
                                {comment.author}
                              </span>
                              <Badge
                                variant="outline"
                                className={
                                  comment.role === 'client'
                                    ? 'bg-blue-500/10 text-blue-600'
                                    : ''
                                }
                              >
                                {comment.role === 'client' ? 'Клиент' : 'Подрядчик'}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                          <div className="text-sm">{comment.text}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      Комментариев пока нет
                    </div>
                  )}

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Добавьте комментарий или замечание..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                      <Icon name="Send" size={16} className="mr-2" />
                      Отправить комментарий
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-20 pb-20">
                <div className="text-center text-muted-foreground">
                  <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Выберите документ из списка</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
