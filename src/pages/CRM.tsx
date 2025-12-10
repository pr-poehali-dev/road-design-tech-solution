import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

interface Task {
  id: string;
  leadId: string;
  title: string;
  type: 'call' | 'meeting' | 'proposal' | 'follow-up';
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

interface Activity {
  id: string;
  leadId: string;
  type: 'status_change' | 'call' | 'email' | 'note' | 'task_created';
  description: string;
  createdAt: string;
}

interface Lead {
  id: string;
  type: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  status: 'new' | 'first-contact' | 'evaluation' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  createdAt: string;
  source: string;
  budget?: string;
  tags?: string[];
  manager?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

const CRM = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadCard, setShowLeadCard] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', type: 'call', dueDate: '' });
  const [newNote, setNewNote] = useState('');

  const statusStages = [
    { id: 'new', label: 'Новый лид', color: 'bg-blue-500' },
    { id: 'first-contact', label: 'Первый контакт', color: 'bg-cyan-500' },
    { id: 'evaluation', label: 'Оценка', color: 'bg-yellow-500' },
    { id: 'proposal', label: 'Предложение', color: 'bg-orange-500' },
    { id: 'negotiation', label: 'Переговоры', color: 'bg-purple-500' },
    { id: 'closed-won', label: 'Сделка заключена', color: 'bg-green-500' },
    { id: 'closed-lost', label: 'Не состоялась', color: 'bg-red-500' }
  ];

  useEffect(() => {
    const auth = localStorage.getItem('crm_auth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    const savedLeads = localStorage.getItem('crm_leads');
    const savedTasks = localStorage.getItem('crm_tasks');
    const savedActivities = localStorage.getItem('crm_activities');
    
    if (savedLeads) setLeads(JSON.parse(savedLeads));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedActivities) setActivities(JSON.parse(savedActivities));
  };

  const saveData = (newLeads: Lead[], newTasks?: Task[], newActivities?: Activity[]) => {
    localStorage.setItem('crm_leads', JSON.stringify(newLeads));
    if (newTasks) localStorage.setItem('crm_tasks', JSON.stringify(newTasks));
    if (newActivities) localStorage.setItem('crm_activities', JSON.stringify(newActivities));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'deod2024') {
      localStorage.setItem('crm_auth', 'authenticated');
      setIsAuthenticated(true);
      loadData();
    } else {
      alert('Неверный пароль');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  const updateLeadStatus = (id: string, newStatus: Lead['status']) => {
    const updatedLeads = leads.map(lead => 
      lead.id === id ? { ...lead, status: newStatus } : lead
    );
    setLeads(updatedLeads);
    
    const newActivity: Activity = {
      id: Date.now().toString(),
      leadId: id,
      type: 'status_change',
      description: `Статус изменен на "${statusStages.find(s => s.id === newStatus)?.label}"`,
      createdAt: new Date().toISOString()
    };
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    
    saveData(updatedLeads, tasks, updatedActivities);
    
    if (selectedLead?.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const deleteLead = (id: string) => {
    const updatedLeads = leads.filter(lead => lead.id !== id);
    const updatedTasks = tasks.filter(task => task.leadId !== id);
    const updatedActivities = activities.filter(activity => activity.leadId !== id);
    
    setLeads(updatedLeads);
    setTasks(updatedTasks);
    setActivities(updatedActivities);
    saveData(updatedLeads, updatedTasks, updatedActivities);
    
    if (selectedLead?.id === id) {
      setShowLeadCard(false);
      setSelectedLead(null);
    }
  };

  const openLeadCard = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadCard(true);
  };

  const addTask = () => {
    if (!selectedLead || !newTask.title) return;
    
    const task: Task = {
      id: Date.now().toString(),
      leadId: selectedLead.id,
      title: newTask.title,
      type: newTask.type as Task['type'],
      dueDate: newTask.dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    
    const activity: Activity = {
      id: (Date.now() + 1).toString(),
      leadId: selectedLead.id,
      type: 'task_created',
      description: `Создана задача: ${newTask.title}`,
      createdAt: new Date().toISOString()
    };
    const updatedActivities = [...activities, activity];
    setActivities(updatedActivities);
    
    saveData(leads, updatedTasks, updatedActivities);
    setNewTask({ title: '', type: 'call', dueDate: '' });
  };

  const addNote = () => {
    if (!selectedLead || !newNote) return;
    
    const activity: Activity = {
      id: Date.now().toString(),
      leadId: selectedLead.id,
      type: 'note',
      description: newNote,
      createdAt: new Date().toISOString()
    };
    
    const updatedActivities = [...activities, activity];
    setActivities(updatedActivities);
    saveData(leads, tasks, updatedActivities);
    setNewNote('');
  };

  const toggleTaskComplete = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveData(leads, updatedTasks, activities);
  };

  const makeCall = (phone?: string) => {
    if (!phone || !selectedLead) return;
    
    const activity: Activity = {
      id: Date.now().toString(),
      leadId: selectedLead.id,
      type: 'call',
      description: `Звонок на номер ${phone}`,
      createdAt: new Date().toISOString()
    };
    
    const updatedActivities = [...activities, activity];
    setActivities(updatedActivities);
    saveData(leads, tasks, updatedActivities);
    
    window.open(`tel:${phone}`);
  };

  const getStatusColor = (status: string) => {
    return statusStages.find(s => s.id === status)?.color || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    return statusStages.find(s => s.id === status)?.label || status;
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'call': return 'Phone';
      case 'meeting': return 'Users';
      case 'proposal': return 'FileText';
      case 'follow-up': return 'Clock';
      default: return 'CheckCircle2';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'status_change': return 'ArrowRight';
      case 'call': return 'Phone';
      case 'email': return 'Mail';
      case 'note': return 'FileText';
      case 'task_created': return 'CheckSquare';
      default: return 'Activity';
    }
  };

  const getPipelineStats = () => {
    return statusStages.map(stage => ({
      ...stage,
      count: leads.filter(l => l.status === stage.id).length
    }));
  };

  const getConversionRate = () => {
    const total = leads.length;
    if (total === 0) return 0;
    const won = leads.filter(l => l.status === 'closed-won').length;
    return ((won / total) * 100).toFixed(1);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={32} className="text-primary" />
            </div>
            <CardTitle className="font-heading text-3xl mb-2">CRM Система</CardTitle>
            <CardDescription>Введите пароль для доступа</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                <Icon name="LogIn" size={20} className="mr-2" />
                Войти
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Вернуться на сайт
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-heading font-bold text-2xl text-gradient">DEOD CRM</h1>
            <p className="text-sm text-muted-foreground">Управление продажами</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/')}>
              <Icon name="Home" size={20} className="mr-2" />
              На сайт
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={20} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm text-muted-foreground">Всего лидов</CardTitle>
                <p className="text-3xl font-bold">{leads.length}</p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm text-muted-foreground">Новые</CardTitle>
                <p className="text-3xl font-bold text-blue-500">
                  {leads.filter(l => l.status === 'new').length}
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm text-muted-foreground">В работе</CardTitle>
                <p className="text-3xl font-bold text-yellow-500">
                  {leads.filter(l => ['first-contact', 'evaluation', 'proposal', 'negotiation'].includes(l.status)).length}
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm text-muted-foreground">Выиграно</CardTitle>
                <p className="text-3xl font-bold text-green-500">
                  {leads.filter(l => l.status === 'closed-won').length}
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm text-muted-foreground">Конверсия</CardTitle>
                <p className="text-3xl font-bold text-primary">
                  {getConversionRate()}%
                </p>
              </CardHeader>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="pipeline">Воронка продаж</TabsTrigger>
            <TabsTrigger value="tasks">Задачи ({tasks.filter(t => !t.completed).length})</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              {statusStages.map((stage) => {
                const stageLeads = leads.filter(l => l.status === stage.id);
                return (
                  <div key={stage.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">{stage.label}</h3>
                      <Badge className={stage.color}>{stageLeads.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {stageLeads.map(lead => (
                        <Card 
                          key={lead.id} 
                          className="cursor-pointer hover:border-primary transition-all"
                          onClick={() => openLeadCard(lead)}
                        >
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm font-medium">{lead.name}</CardTitle>
                            <CardDescription className="text-xs">{lead.company || lead.email}</CardDescription>
                            <div className="flex gap-1 mt-2">
                              <Badge variant="outline" className="text-xs">{lead.type}</Badge>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                      {stageLeads.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-xs">
                          Пусто
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Мои задачи</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.filter(t => !t.completed).length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="CheckCircle2" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Все задачи выполнены!</p>
                  </div>
                ) : (
                  tasks.filter(t => !t.completed).map(task => {
                    const lead = leads.find(l => l.id === task.leadId);
                    return (
                      <Card key={task.id} className="border-border">
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTaskComplete(task.id)}
                              >
                                <Icon name="Circle" size={20} />
                              </Button>
                              <div>
                                <CardTitle className="text-base">{task.title}</CardTitle>
                                <CardDescription className="text-sm mt-1">
                                  {lead?.name} • {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge variant="outline">
                              <Icon name={getTaskIcon(task.type)} size={14} className="mr-1" />
                              {task.type}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Конверсия по этапам воронки</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getPipelineStats().map(stage => {
                      const percentage = leads.length > 0 ? ((stage.count / leads.length) * 100).toFixed(1) : 0;
                      return (
                        <div key={stage.id}>
                          <div className="flex justify-between text-sm mb-2">
                            <span>{stage.label}</span>
                            <span className="font-semibold">{stage.count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`${stage.color} h-2 rounded-full transition-all`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Источники лидов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(new Set(leads.map(l => l.source))).map(source => {
                      const count = leads.filter(l => l.source === source).length;
                      return (
                        <div key={source} className="flex justify-between items-center">
                          <span className="text-sm">{source}</span>
                          <Badge>{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {showLeadCard && selectedLead && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{selectedLead.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {selectedLead.company && <span>{selectedLead.company} • </span>}
                    {selectedLead.source}
                  </CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setShowLeadCard(false)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <Tabs defaultValue="info">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="info">Информация</TabsTrigger>
                  <TabsTrigger value="tasks">Задачи</TabsTrigger>
                  <TabsTrigger value="activity">История</TabsTrigger>
                  <TabsTrigger value="notes">Заметки</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold">Email</label>
                      <p className="text-sm text-muted-foreground">{selectedLead.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Телефон</label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">{selectedLead.phone || 'Не указан'}</p>
                        {selectedLead.phone && (
                          <Button size="sm" variant="outline" onClick={() => makeCall(selectedLead.phone)}>
                            <Icon name="Phone" size={14} className="mr-1" />
                            Позвонить
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Статус</label>
                      <Select 
                        value={selectedLead.status} 
                        onValueChange={(value) => updateLeadStatus(selectedLead.id, value as Lead['status'])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusStages.map(stage => (
                            <SelectItem key={stage.id} value={stage.id}>{stage.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Тип заявки</label>
                      <Badge>{selectedLead.type}</Badge>
                    </div>
                  </div>
                  {selectedLead.message && (
                    <div>
                      <label className="text-sm font-semibold">Сообщение</label>
                      <p className="text-sm text-muted-foreground mt-1">{selectedLead.message}</p>
                    </div>
                  )}
                  <div className="pt-4 border-t">
                    <Button variant="destructive" onClick={() => deleteLead(selectedLead.id)}>
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Удалить лид
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4">
                  <Card className="bg-card/50">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Создать задачу</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <Input
                        placeholder="Название задачи"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="call">Звонок</SelectItem>
                            <SelectItem value="meeting">Встреча</SelectItem>
                            <SelectItem value="proposal">Отправить КП</SelectItem>
                            <SelectItem value="follow-up">Контрольный звонок</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="datetime-local"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        />
                      </div>
                      <Button onClick={addTask} className="w-full">
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить задачу
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    {tasks.filter(t => t.leadId === selectedLead.id).map(task => (
                      <Card key={task.id} className={task.completed ? 'opacity-50' : ''}>
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleTaskComplete(task.id)}
                            >
                              <Icon name={task.completed ? 'CheckCircle2' : 'Circle'} size={20} />
                            </Button>
                            <div className="flex-1">
                              <p className={task.completed ? 'line-through' : ''}>{task.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(task.dueDate).toLocaleString('ru-RU')}
                              </p>
                            </div>
                            <Badge variant="outline">
                              <Icon name={getTaskIcon(task.type)} size={14} className="mr-1" />
                              {task.type}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-3">
                  {activities
                    .filter(a => a.leadId === selectedLead.id)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map(activity => (
                      <Card key={activity.id}>
                        <CardHeader className="p-4">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Icon name={getActivityIcon(activity.type)} size={16} className="text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{activity.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(activity.createdAt).toLocaleString('ru-RU')}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <Card className="bg-card/50">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Добавить заметку</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <Textarea
                        placeholder="Заметка или комментарий..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={3}
                      />
                      <Button onClick={addNote} className="w-full">
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить заметку
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="space-y-2">
                    {activities
                      .filter(a => a.leadId === selectedLead.id && a.type === 'note')
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map(note => (
                        <Card key={note.id}>
                          <CardHeader className="p-4">
                            <p className="text-sm">{note.description}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(note.createdAt).toLocaleString('ru-RU')}
                            </p>
                          </CardHeader>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CRM;
