import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Lead } from './CRMKanban';
import ReactMarkdown from 'react-markdown';

interface ProposalGeneratorProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
}

interface GeneratedData {
  technical_specification: string;
  proposal: string;
  total_price_min: number;
  total_price_max: number;
}

export const ProposalGenerator = ({ lead, open, onClose }: ProposalGeneratorProps) => {
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState<GeneratedData | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!lead) return;

    setGenerating(true);
    try {
      const response = await fetch('https://functions.poehali.dev/aab955ed-3240-40e6-ad71-9f607dd47dd8', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: lead.name,
          project_description: lead.message || 'Не указано',
          email: lead.email,
          phone: lead.phone || ''
        })
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
        toast({
          title: 'Готово!',
          description: 'ТЗ и КП успешно сгенерированы'
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка генерации');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось сгенерировать документы',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Скопировано!',
      description: 'Текст скопирован в буфер обмена'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Sparkles" size={24} />
            Генерация ТЗ и КП для {lead?.name}
          </DialogTitle>
        </DialogHeader>

        {!data ? (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Информация о клиенте:</p>
                <div className="grid gap-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-muted-foreground min-w-[100px]">Email:</span>
                    <span>{lead?.email}</span>
                  </div>
                  {lead?.phone && (
                    <div className="flex gap-2">
                      <span className="text-muted-foreground min-w-[100px]">Телефон:</span>
                      <span>{lead.phone}</span>
                    </div>
                  )}
                  {lead?.company && (
                    <div className="flex gap-2">
                      <span className="text-muted-foreground min-w-[100px]">Компания:</span>
                      <span>{lead.company}</span>
                    </div>
                  )}
                  {lead?.message && (
                    <div className="flex gap-2">
                      <span className="text-muted-foreground min-w-[100px]">Описание:</span>
                      <span>{lead.message}</span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full"
                size="lg"
              >
                {generating ? (
                  <>
                    <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                    Генерация через YandexGPT...
                  </>
                ) : (
                  <>
                    <Icon name="Wand2" size={20} className="mr-2" />
                    Сгенерировать ТЗ и КП
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                AI автоматически создаст техническое задание и коммерческое предложение на основе прайс-листа
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Стоимость проекта:</p>
                    <p className="text-2xl font-bold">
                      {formatPrice(data.total_price_min)} — {formatPrice(data.total_price_max)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    <Icon name="CheckCircle2" size={18} className="mr-2" />
                    Готово
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="tz" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tz">
                  <Icon name="FileCode" size={16} className="mr-2" />
                  Техническое задание
                </TabsTrigger>
                <TabsTrigger value="kp">
                  <Icon name="FileText" size={16} className="mr-2" />
                  Коммерческое предложение
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tz" className="space-y-3">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(data.technical_specification)}
                  >
                    <Icon name="Copy" size={14} className="mr-2" />
                    Копировать
                  </Button>
                </div>
                <Card>
                  <CardContent className="pt-6 prose prose-sm max-w-none">
                    <ReactMarkdown>{data.technical_specification}</ReactMarkdown>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="kp" className="space-y-3">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(data.proposal)}
                  >
                    <Icon name="Copy" size={14} className="mr-2" />
                    Копировать
                  </Button>
                </div>
                <Card>
                  <CardContent className="pt-6 prose prose-sm max-w-none">
                    <ReactMarkdown>{data.proposal}</ReactMarkdown>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Закрыть
              </Button>
              <Button className="flex-1" onClick={() => {
                copyToClipboard(`${data.technical_specification}\n\n${data.proposal}`);
              }}>
                <Icon name="Mail" size={16} className="mr-2" />
                Отправить клиенту
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
