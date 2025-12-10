import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
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
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [createLeadStatus, setCreateLeadStatus] = useState<Lead['status'] | null>(null);
  const [newTask, setNewTask] = useState({ title: '', type: 'call', dueDate: '' });
  const [newNote, setNewNote] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    type: 'Ручной ввод',
    status: 'new' as Lead['status']
  });

  const statusStages = [
    { id: 'new', label: 'Новый лид', color: 'bg-blue-500', icon: 'Sparkles' },
    { id: 'first-contact', label: 'Первый контакт', color: 'bg-cyan-500', icon: 'Phone' },
    { id: 'evaluation', label: 'Оценка', color: 'bg-yellow-500', icon: 'Search' },
    { id: 'proposal', label: 'Предложение', color: 'bg-orange-500', icon: 'FileText' },
    { id: 'negotiation', label: 'Переговоры', color: 'bg-purple-500', icon: 'MessageSquare' },
    { id: 'closed-won', label: 'Выиграна', color: 'bg-green-500', icon: 'CheckCircle2' },
    { id: 'closed-lost', label: 'Проиграна', color: 'bg-red-500', icon: 'XCircle' }
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

  const openCreateLeadModal = (status?: Lead['status']) => {
    setCreateLeadStatus(status || 'new');
    setNewLead({ ...newLead, status: status || 'new' });
    setShowCreateLead(true);
  };

  const createLead = () => {
    if (!newLead.name || !newLead.email) {
      alert('Заполните имя и email');
      return;
    }

    const lead: Lead = {
      id: Date.now().toString(),
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone || undefined,
      company: newLead.company || undefined,
      message: newLead.message || undefined,
      type: newLead.type,
      status: newLead.status,
      source: 'Ручное создание',
      createdAt: new Date().toISOString()
    };

    const updatedLeads = [...leads, lead];
    setLeads(updatedLeads);

    const activity: Activity = {
      id: (Date.now() + 1).toString(),
      leadId: lead.id,
      type: 'note',
      description: 'Лид создан вручную',
      createdAt: new Date().toISOString()
    };
    const updatedActivities = [...activities, activity];
    setActivities(updatedActivities);

    saveData(updatedLeads, tasks, updatedActivities);

    setNewLead({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
      type: 'Ручной ввод',
      status: 'new'
    });
    setShowCreateLead(false);
    setCreateLeadStatus(null);
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

  const updateLeadName = () => {
    if (!selectedLead || !editedName.trim()) return;
    
    const updatedLeads = leads.map(lead =>
      lead.id === selectedLead.id ? { ...lead, name: editedName } : lead
    );
    setLeads(updatedLeads);
    setSelectedLead({ ...selectedLead, name: editedName });
    saveData(updatedLeads, tasks, activities);
    setEditingName(false);
  };

  const deleteLead = (id: string) => {
    if (!confirm('Удалить этот лид?')) return;
    
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
    setEditedName(lead.name);
    setEditingName(false);
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

  const getStatusIcon = (status: string) => {
    return statusStages.find(s => s.id === status)?.icon || 'Circle';
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

  const getConversionRate = () => {
    const total = leads.length;
    if (total === 0) return 0;
    const won = leads.filter(l => l.status === 'closed-won').length;
    return ((won / total) * 100).toFixed(1);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Icon name="Lock" size={36} className="text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="font-heading text-3xl mb-2">CRM Система</CardTitle>
              <CardDescription>Введите пароль для доступа</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                required
              />
              <Button type="submit" className="w-full h-12 text-lg">
                <Icon name="LogIn" size={20} className="mr-2" />
                Войти
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12"
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shadow-lg">
                <Icon name="LayoutDashboard" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-2xl text-gradient">DEOD CRM</h1>
                <p className="text-sm text-muted-foreground">Управление продажами</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => openCreateLeadModal()}>
                <Icon name="Plus" size={20} className="mr-2" />
                Создать лид
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                <Icon name="Home" size={20} className="mr-2" />
                На сайт
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <Icon name="LogOut" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm text-muted-foreground mb-2">Всего лидов</CardTitle>
                  <p className="text-4xl font-bold">{leads.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-primary" />
                </div>
              </div>
            </CardHeader>
          </Card>
          
          <Card className="border-blue-500/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm text-muted-foreground mb-2">Новые</CardTitle>
                  <p className="text-4xl font-bold text-blue-500">
                    {leads.filter(l => l.status === 'new').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Icon name="Sparkles" size={24} className="text-blue-500" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-yellow-500/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm text-muted-foreground mb-2">В работе</CardTitle>
                  <p className="text-4xl font-bold text-yellow-500">
                    {leads.filter(l => ['first-contact', 'evaluation', 'proposal', 'negotiation'].includes(l.status)).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                  <Icon name="Target" size={24} className="text-yellow-500" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-green-500/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm text-muted-foreground mb-2">Конверсия</CardTitle>
                  <p className="text-4xl font-bold text-green-500">{getConversionRate()}%</p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} className="text-green-500" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Card className="shadow-xl border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Воронка продаж</CardTitle>
            <CardDescription>Перетащите карточки между этапами</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              {statusStages.map((stage) => {
                const stageLeads = leads.filter(l => l.status === stage.id);
                return (
                  <div key={stage.id} className="space-y-3">
                    <div className="sticky top-20 bg-background/95 backdrop-blur-sm pb-3 border-b border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name={stage.icon as any} size={18} className={`${stage.color.replace('bg-', 'text-')}`} />
                        <h3 className="font-semibold text-sm">{stage.label}</h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className={`${stage.color} text-white`}>{stageLeads.length}</Badge>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => openCreateLeadModal(stage.id as Lead['status'])}
                          className="h-7 w-7 p-0"
                        >
                          <Icon name="Plus" size={14} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {stageLeads.map(lead => (
                        <Card 
                          key={lead.id} 
                          className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all group"
                          onClick={() => openLeadCard(lead)}
                        >
                          <CardHeader className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                                {lead.name}
                              </CardTitle>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteLead(lead.id);
                                }}
                              >
                                <Icon name="Trash2" size={14} className="text-red-500" />
                              </Button>
                            </div>
                            <CardDescription className="text-xs line-clamp-1">
                              {lead.company || lead.email}
                            </CardDescription>
                            <div className="flex gap-1 mt-2">
                              <Badge variant="outline" className="text-xs">{lead.type}</Badge>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                      {stageLeads.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-xs">
                          <Icon name="Inbox" size={32} className="mx-auto mb-2 opacity-20" />
                          <p>Пусто</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      {showCreateLead && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full shadow-2xl">
            <CardHeader className="border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Создать лид</CardTitle>
                  <CardDescription className="mt-2">
                    Добавить в этап: <Badge className={`${getStatusColor(newLead.status)} text-white ml-2`}>
                      {getStatusLabel(newLead.status)}
                    </Badge>
                  </CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setShowCreateLead(false)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Имя *</label>
                  <Input
                    placeholder="Иван Иванов"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Email *</label>
                  <Input
                    type="email"
                    placeholder="ivan@example.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Телефон</label>
                  <Input
                    type="tel"
                    placeholder="+7 999 123-45-67"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Компания</label>
                  <Input
                    placeholder="ООО Компания"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Комментарий</label>
                <Textarea
                  placeholder="Дополнительная информация о клиенте..."
                  value={newLead.message}
                  onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={createLead} className="flex-1">
                  <Icon name="Check" size={20} className="mr-2" />
                  Создать лид
                </Button>
                <Button variant="outline" onClick={() => setShowCreateLead(false)}>
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showLeadCard && selectedLead && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <Card className="w-full md:max-w-5xl md:max-h-[90vh] h-full md:h-auto overflow-y-auto shadow-2xl">
            <CardHeader className="border-b sticky top-0 bg-card z-10">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  {editingName ? (
                    <div className="flex gap-2">
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-xl font-bold"
                        autoFocus
                      />
                      <Button size="sm" onClick={updateLeadName}>
                        <Icon name="Check" size={16} />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingName(false)}>
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl">{selectedLead.name}</CardTitle>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setEditingName(true)}
                        className="h-8 w-8 p-0"
                      >
                        <Icon name="Pencil" size={14} />
                      </Button>
                    </div>
                  )}
                  <CardDescription className="mt-2 flex items-center gap-2 flex-wrap">
                    {selectedLead.company && <span>{selectedLead.company}</span>}
                    <Badge variant="outline">{selectedLead.source}</Badge>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="destructive" size="sm" onClick={() => deleteLead(selectedLead.id)}>
                    <Icon name="Trash2" size={16} />
                  </Button>
                  <Button variant="ghost" onClick={() => setShowLeadCard(false)}>
                    <Icon name="X" size={20} />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-none border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon name="User" size={18} />
                      Контактная информация
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Email</label>
                      <p className="text-sm font-medium">{selectedLead.email}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Телефон</label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{selectedLead.phone || 'Не указан'}</p>
                        {selectedLead.phone && (
                          <Button size="sm" variant="outline" onClick={() => makeCall(selectedLead.phone)} className="h-7">
                            <Icon name="Phone" size={12} className="mr-1" />
                            Позвонить
                          </Button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Статус</label>
                      <Select 
                        value={selectedLead.status} 
                        onValueChange={(value) => updateLeadStatus(selectedLead.id, value as Lead['status'])}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusStages.map(stage => (
                            <SelectItem key={stage.id} value={stage.id}>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                                {stage.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedLead.message && (
                      <div>
                        <label className="text-xs text-muted-foreground">Сообщение</label>
                        <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{selectedLead.message}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-none border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon name="CheckSquare" size={18} />
                      Задачи
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {tasks.filter(t => t.leadId === selectedLead.id && !t.completed).map(task => (
                        <Card key={task.id} className="p-3 shadow-none border">
                          <div className="flex items-start gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 mt-0.5"
                              onClick={() => toggleTaskComplete(task.id)}
                            >
                              <Icon name="Circle" size={16} />
                            </Button>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-2">{task.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              <Icon name={getTaskIcon(task.type)} size={12} />
                            </Badge>
                          </div>
                        </Card>
                      ))}
                      {tasks.filter(t => t.leadId === selectedLead.id && !t.completed).length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">Нет активных задач</p>
                      )}
                    </div>
                    <div className="pt-2 border-t space-y-2">
                      <Input
                        placeholder="Название задачи"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="h-9"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="call">Звонок</SelectItem>
                            <SelectItem value="meeting">Встреча</SelectItem>
                            <SelectItem value="proposal">КП</SelectItem>
                            <SelectItem value="follow-up">Контроль</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                          className="h-9"
                        />
                      </div>
                      <Button onClick={addTask} size="sm" className="w-full">
                        <Icon name="Plus" size={14} className="mr-2" />
                        Добавить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-none border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon name="Activity" size={18} />
                    Лента активности
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Добавить заметку..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={2}
                    />
                    <Button onClick={addNote} size="sm">
                      <Icon name="Plus" size={14} className="mr-2" />
                      Добавить заметку
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {activities
                      .filter(a => a.leadId === selectedLead.id)
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map(activity => (
                        <Card key={activity.id} className="p-3 shadow-none">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon name={getActivityIcon(activity.type)} size={14} className="text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm">{activity.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(activity.createdAt).toLocaleString('ru-RU')}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CRM;
