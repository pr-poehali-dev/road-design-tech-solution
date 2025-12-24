import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Lead } from './CRMKanban';

interface ProjectCardProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onGenerateSpec: (data: any) => void;
  onGenerateProposal: (data: any) => void;
}

export const ProjectCard = ({ lead, open, onClose, onGenerateSpec, onGenerateProposal }: ProjectCardProps) => {
  const { toast } = useToast();
  const [specFile, setSpecFile] = useState<File | null>(null);
  const [specData, setSpecData] = useState({
    objectType: '',
    address: '',
    area: '',
    floors: '',
    purpose: '',
    soilType: '',
    seismicity: '',
    climate: '',
    requirements: ''
  });

  const [proposalData, setProposalData] = useState({
    projectName: '',
    clientCompany: '',
    sections: [] as string[],
    timeline: '',
    budget: '',
    specialConditions: ''
  });

  const sections = [
    'ПЗ - Пояснительная записка',
    'ПЗУ - План земельного участка',
    'АР - Архитектурные решения',
    'КР - Конструктивные решения',
    'ИОС - Инженерное оборудование (сети)',
    'ПОС - Проект организации строительства',
    'ООС - Охрана окружающей среды',
    'ПБ - Пожарная безопасность',
    'ОДИ - Обеспечение доступа инвалидов',
    'ЭЭ - Энергоэффективность'
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.docx')) {
      toast({
        title: 'Ошибка',
        description: 'Поддерживаются только PDF и DOCX файлы',
        variant: 'destructive'
      });
      return;
    }

    setSpecFile(file);
    toast({
      title: 'Файл загружен',
      description: `${file.name} готов к обработке`
    });
  };

  const handleGenerateSpec = () => {
    if (!specData.objectType || !specData.address) {
      toast({
        title: 'Ошибка',
        description: 'Заполните тип объекта и адрес',
        variant: 'destructive'
      });
      return;
    }

    onGenerateSpec({
      ...specData,
      leadId: lead?.id,
      clientName: lead?.name,
      clientEmail: lead?.email
    });
  };

  const handleGenerateProposal = () => {
    if (!proposalData.projectName || proposalData.sections.length === 0) {
      toast({
        title: 'Ошибка',
        description: 'Укажите название проекта и выберите разделы',
        variant: 'destructive'
      });
      return;
    }

    onGenerateProposal({
      ...proposalData,
      leadId: lead?.id,
      clientName: lead?.name,
      clientEmail: lead?.email,
      clientCompany: lead?.company || proposalData.clientCompany
    });
  };

  const toggleSection = (section: string) => {
    setProposalData(prev => ({
      ...prev,
      sections: prev.sections.includes(section)
        ? prev.sections.filter(s => s !== section)
        : [...prev.sections, section]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Briefcase" size={24} />
            Проект: {lead?.name}
            <Badge variant="outline" className="ml-2">{lead?.company}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">
              <Icon name="Info" size={16} className="mr-2" />
              Инфо
            </TabsTrigger>
            <TabsTrigger value="spec">
              <Icon name="FileEdit" size={16} className="mr-2" />
              ТЗ
            </TabsTrigger>
            <TabsTrigger value="proposal">
              <Icon name="FileText" size={16} className="mr-2" />
              КП
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Icon name="Calendar" size={16} className="mr-2" />
              График
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Информация о клиенте</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{lead?.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Телефон</Label>
                    <p className="font-medium">{lead?.phone || '—'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Компания</Label>
                    <p className="font-medium">{lead?.company || '—'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Дата заявки</Label>
                    <p className="font-medium">
                      {lead?.createdAt ? new Date(lead.createdAt).toLocaleDateString('ru-RU') : '—'}
                    </p>
                  </div>
                </div>
                {lead?.message && (
                  <div>
                    <Label className="text-muted-foreground">Описание проекта</Label>
                    <p className="mt-2 text-sm bg-muted p-3 rounded-lg">{lead.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spec" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Генерация технического задания</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="manual">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual">Ввести данные</TabsTrigger>
                    <TabsTrigger value="upload">Загрузить ТЗ</TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="objectType">Тип объекта *</Label>
                        <Input
                          id="objectType"
                          placeholder="Жилой дом, АЗС, школа..."
                          value={specData.objectType}
                          onChange={(e) => setSpecData({ ...specData, objectType: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Адрес строительства *</Label>
                        <Input
                          id="address"
                          placeholder="Город, улица, участок"
                          value={specData.address}
                          onChange={(e) => setSpecData({ ...specData, address: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Площадь, м²</Label>
                        <Input
                          id="area"
                          type="number"
                          placeholder="1000"
                          value={specData.area}
                          onChange={(e) => setSpecData({ ...specData, area: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="floors">Этажность</Label>
                        <Input
                          id="floors"
                          placeholder="5"
                          value={specData.floors}
                          onChange={(e) => setSpecData({ ...specData, floors: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purpose">Назначение</Label>
                        <Input
                          id="purpose"
                          placeholder="Многоквартирный дом"
                          value={specData.purpose}
                          onChange={(e) => setSpecData({ ...specData, purpose: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="soilType">Тип грунта</Label>
                        <Input
                          id="soilType"
                          placeholder="Суглинок, песок..."
                          value={specData.soilType}
                          onChange={(e) => setSpecData({ ...specData, soilType: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seismicity">Сейсмичность, баллы</Label>
                        <Input
                          id="seismicity"
                          placeholder="6-9"
                          value={specData.seismicity}
                          onChange={(e) => setSpecData({ ...specData, seismicity: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="climate">Климатический район</Label>
                        <Input
                          id="climate"
                          placeholder="IВ, IIБ..."
                          value={specData.climate}
                          onChange={(e) => setSpecData({ ...specData, climate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requirements">Особые требования</Label>
                      <Textarea
                        id="requirements"
                        placeholder="Дополнительные требования, ограничения, пожелания заказчика..."
                        rows={4}
                        value={specData.requirements}
                        onChange={(e) => setSpecData({ ...specData, requirements: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleGenerateSpec} className="w-full" size="lg">
                      <Icon name="Wand2" size={20} className="mr-2" />
                      Сгенерировать ТЗ через AI
                    </Button>
                  </TabsContent>

                  <TabsContent value="upload" className="space-y-4 mt-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <Label htmlFor="spec-file" className="cursor-pointer">
                        <span className="text-primary hover:underline">Выберите файл ТЗ</span>
                        {' '}или перетащите сюда
                      </Label>
                      <Input
                        id="spec-file"
                        type="file"
                        accept=".pdf,.docx"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <p className="text-sm text-muted-foreground mt-2">PDF или DOCX, до 10 МБ</p>
                      {specFile && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                          <Icon name="File" size={16} className="text-primary" />
                          <span className="font-medium">{specFile.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSpecFile(null)}
                          >
                            <Icon name="X" size={14} />
                          </Button>
                        </div>
                      )}
                    </div>
                    {specFile && (
                      <Button className="w-full" size="lg">
                        <Icon name="Sparkles" size={20} className="mr-2" />
                        Извлечь данные из ТЗ через AI
                      </Button>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proposal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Генерация коммерческого предложения</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="projectName">Название проекта *</Label>
                    <Input
                      id="projectName"
                      placeholder="Проектирование жилого комплекса..."
                      value={proposalData.projectName}
                      onChange={(e) => setProposalData({ ...proposalData, projectName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientCompany">Заказчик</Label>
                    <Input
                      id="clientCompany"
                      placeholder="ООО Компания"
                      value={proposalData.clientCompany || lead?.company || ''}
                      onChange={(e) => setProposalData({ ...proposalData, clientCompany: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Срок выполнения</Label>
                    <Input
                      id="timeline"
                      placeholder="60 дней"
                      value={proposalData.timeline}
                      onChange={(e) => setProposalData({ ...proposalData, timeline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Разделы проектирования *</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto p-2 border rounded-lg">
                    {sections.map((section) => (
                      <div
                        key={section}
                        onClick={() => toggleSection(section)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          proposalData.sections.includes(section)
                            ? 'bg-primary/10 border-primary'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon
                            name={proposalData.sections.includes(section) ? 'CheckSquare' : 'Square'}
                            size={18}
                            className={proposalData.sections.includes(section) ? 'text-primary' : 'text-muted-foreground'}
                          />
                          <span className="text-sm font-medium">{section}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Выбрано разделов: {proposalData.sections.length}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialConditions">Особые условия</Label>
                  <Textarea
                    id="specialConditions"
                    placeholder="Условия оплаты, гарантии, особенности..."
                    rows={3}
                    value={proposalData.specialConditions}
                    onChange={(e) => setProposalData({ ...proposalData, specialConditions: e.target.value })}
                  />
                </div>

                <Button onClick={handleGenerateProposal} className="w-full" size="lg">
                  <Icon name="FileText" size={20} className="mr-2" />
                  Сгенерировать КП через AI
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>План-график работ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>План-график будет сгенерирован автоматически</p>
                  <p className="text-sm mt-2">после создания ТЗ и КП</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
