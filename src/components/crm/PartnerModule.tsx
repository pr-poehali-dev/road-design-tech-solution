import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Partner {
  id: string;
  name: string;
  companyName: string;
  specialization: string[];
  rating: number;
  completedProjects: number;
  status: 'active' | 'busy' | 'inactive';
  email: string;
  phone: string;
}

interface PartnerTask {
  id: string;
  partnerId: string;
  partnerName: string;
  section: string;
  sectionCode: string;
  projectName: string;
  deadline: string;
  status: 'assigned' | 'in_progress' | 'review' | 'completed';
  price: number;
  isolatedData: boolean;
}

export const PartnerModule = () => {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: '1',
      name: 'Иванов Иван',
      companyName: 'ООО "Конструктив"',
      specialization: ['КР', 'ПОС'],
      rating: 4.8,
      completedProjects: 23,
      status: 'active',
      email: 'ivanov@konstruktiv.ru',
      phone: '+7 (999) 123-45-67',
    },
    {
      id: '2',
      name: 'Петрова Мария',
      companyName: 'ИП Петрова',
      specialization: ['АР', 'ПЗУ'],
      rating: 4.9,
      completedProjects: 31,
      status: 'active',
      email: 'petrova@arch.ru',
      phone: '+7 (999) 234-56-78',
    },
    {
      id: '3',
      name: 'Сидоров Алексей',
      companyName: 'ООО "ИнжПроект"',
      specialization: ['ИОС', 'ПБ'],
      rating: 4.7,
      completedProjects: 18,
      status: 'busy',
      email: 'sidorov@inzhproekt.ru',
      phone: '+7 (999) 345-67-89',
    },
  ]);

  const [tasks, setTasks] = useState<PartnerTask[]>([
    {
      id: '1',
      partnerId: '1',
      partnerName: 'Иванов Иван',
      section: 'Конструктивные решения',
      sectionCode: 'КР',
      projectName: 'Жилой дом на ул. Ленина',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'in_progress',
      price: 150000,
      isolatedData: true,
    },
    {
      id: '2',
      partnerId: '2',
      partnerName: 'Петрова Мария',
      section: 'Архитектурные решения',
      sectionCode: 'АР',
      projectName: 'Офисное здание',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'review',
      price: 200000,
      isolatedData: true,
    },
  ]);

  const [showAddPartner, setShowAddPartner] = useState(false);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const handleAddPartner = () => {
    toast({
      title: 'Партнёр добавлен',
      description: 'Приглашение отправлено на email',
    });
    setShowAddPartner(false);
  };

  const handleAssignTask = () => {
    toast({
      title: 'Задача назначена',
      description: 'Партнёр получил доступ к изолированным данным проекта',
    });
    setShowAssignTask(false);
  };

  const getStatusColor = (status: Partner['status'] | PartnerTask['status']) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'bg-green-500/10 text-green-600';
      case 'busy':
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-600';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-600';
      case 'assigned':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'review':
        return 'bg-purple-500/10 text-purple-600';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: Partner['status'] | PartnerTask['status']) => {
    switch (status) {
      case 'active':
        return 'Доступен';
      case 'busy':
        return 'Занят';
      case 'inactive':
        return 'Неактивен';
      case 'assigned':
        return 'Назначено';
      case 'in_progress':
        return 'В работе';
      case 'review':
        return 'На проверке';
      case 'completed':
        return 'Выполнено';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{partners.length}</div>
              <div className="text-sm text-muted-foreground">Всего партнёров</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {tasks.filter((t) => t.status !== 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Активных задач</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {partners.filter((p) => p.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Доступно сейчас</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Icon name="Users" size={20} />
                Партнёры
              </CardTitle>
              <Button size="sm" onClick={() => setShowAddPartner(!showAddPartner)}>
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {showAddPartner && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-3">
                  <Input placeholder="Имя партнёра" />
                  <Input placeholder="Email" type="email" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Специализация" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">АР - Архитектура</SelectItem>
                      <SelectItem value="kr">КР - Конструкции</SelectItem>
                      <SelectItem value="ios">ИОС - Инженерия</SelectItem>
                      <SelectItem value="pb">ПБ - Пожарная безопасность</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button onClick={handleAddPartner} size="sm" className="flex-1">
                      Пригласить
                    </Button>
                    <Button
                      onClick={() => setShowAddPartner(false)}
                      size="sm"
                      variant="outline"
                    >
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {partners.map((partner) => (
              <div
                key={partner.id}
                className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                onClick={() => setSelectedPartner(partner)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium">{partner.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {partner.companyName}
                    </div>
                  </div>
                  <Badge className={getStatusColor(partner.status)}>
                    {getStatusLabel(partner.status)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {partner.specialization.map((spec) => (
                    <Badge key={spec} variant="outline">
                      {spec}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={14} className="text-yellow-500" />
                    <span className="font-medium">{partner.rating}</span>
                  </div>
                  <div className="text-muted-foreground">
                    {partner.completedProjects} проектов
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Icon name="ListChecks" size={20} />
                Задачи партнёров
              </CardTitle>
              <Button size="sm" onClick={() => setShowAssignTask(!showAssignTask)}>
                <Icon name="Plus" size={16} className="mr-2" />
                Назначить
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {showAssignTask && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4 space-y-3">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите партнёра" />
                    </SelectTrigger>
                    <SelectContent>
                      {partners
                        .filter((p) => p.status === 'active')
                        .map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name} ({p.specialization.join(', ')})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Раздел проекта" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pz">ПЗ - Пояснительная записка</SelectItem>
                      <SelectItem value="ar">АР - Архитектурные решения</SelectItem>
                      <SelectItem value="kr">КР - Конструктивные решения</SelectItem>
                      <SelectItem value="ios">ИОС - Инженерные системы</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Стоимость работ" type="number" />
                  <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg">
                    <Icon name="Lock" size={16} className="text-blue-600" />
                    <div className="text-xs text-muted-foreground">
                      Партнёр получит доступ только к данным своего раздела
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAssignTask} size="sm" className="flex-1">
                      Назначить задачу
                    </Button>
                    <Button
                      onClick={() => setShowAssignTask(false)}
                      size="sm"
                      variant="outline"
                    >
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {task.sectionCode} - {task.section}
                      {task.isolatedData && (
                        <Icon
                          name="Lock"
                          size={14}
                          className="text-blue-600"
                          title="Изолированные данные"
                        />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {task.projectName}
                    </div>
                  </div>
                  <Badge className={getStatusColor(task.status)}>
                    {getStatusLabel(task.status)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Исполнитель: {task.partnerName}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Icon name="Calendar" size={14} />
                    <span>
                      до {new Date(task.deadline).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <div className="font-medium">
                    {task.price.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {selectedPartner && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="User" size={20} />
              Профиль партнёра
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Имя</div>
                <div className="font-medium">{selectedPartner.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Компания</div>
                <div className="font-medium">{selectedPartner.companyName}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Email</div>
                <div className="font-medium">{selectedPartner.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Телефон</div>
                <div className="font-medium">{selectedPartner.phone}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Рейтинг</div>
                <div className="flex items-center gap-2">
                  <Icon name="Star" size={16} className="text-yellow-500" />
                  <span className="font-medium">{selectedPartner.rating}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Завершённые проекты
                </div>
                <div className="font-medium">{selectedPartner.completedProjects}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Специализация</div>
              <div className="flex gap-2 flex-wrap">
                {selectedPartner.specialization.map((spec) => (
                  <Badge key={spec}>{spec}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
