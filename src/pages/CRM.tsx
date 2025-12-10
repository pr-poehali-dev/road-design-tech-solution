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
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadCard, setShowLeadCard] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [createLeadStatus, setCreateLeadStatus] = useState<Lead['status'] | null>(null);
  const [newTask, setNewTask] = useState({ title: '', type: 'call', dueDate: '' });
  const [newNote, setNewNote] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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
    { id: 'new', label: 'Новый лид', color: 'from-blue-400 to-blue-600', icon: 'Sparkles', emoji: '✨' },
    { id: 'first-contact', label: 'Контакт', color: 'from-cyan-400 to-cyan-600', icon: 'Phone', emoji: '📞' },
    { id: 'evaluation', label: 'Оценка', color: 'from-amber-400 to-amber-600', icon: 'Search', emoji: '🔍' },
    { id: 'proposal', label: 'Предложение', color: 'from-orange-400 to-orange-600', icon: 'FileText', emoji: '📄' },
    { id: 'negotiation', label: 'Переговоры', color: 'from-purple-400 to-purple-600', icon: 'MessageSquare', emoji: '💬' },
    { id: 'closed-won', label: 'Выиграна', color: 'from-green-400 to-green-600', icon: 'Trophy', emoji: '🏆' },
    { id: 'closed-lost', label: 'Проиграна', color: 'from-red-400 to-red-600', icon: 'XCircle', emoji: '❌' }
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

  const getStatusStage = (status: string) => {
    return statusStages.find(s => s.id === status) || statusStages[0];
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

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzkzYzVmZCIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjMiLz48L2c+PC9zdmc+')] opacity-40"></div>
        <Card className="max-w-md w-full shadow-2xl border-0 backdrop-blur-xl bg-white/80 relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform">
              <Icon name="Rocket" size={64} className="text-white" />
            </div>
          </div>
          <CardHeader className="text-center pt-20 space-y-2">
            <CardTitle className="font-heading text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DEOD CRM
            </CardTitle>
            <CardDescription className="text-base">CRM нового поколения</CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Icon name="Lock" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 border-2 focus:border-blue-500"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Icon name="LogIn" size={20} className="mr-2" />
                Войти в систему
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12"
                onClick={() => navigate('/')}
              >
                <Icon name="Home" size={20} className="mr-2" />
                На главную
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzkzYzVmZCIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjMiLz48L2c+PC9zdmc+')] opacity-40"></div>
      
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40 shadow-sm relative">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <Icon name="Rocket" size={28} className="text-white" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DEOD CRM
                </h1>
                <p className="text-sm text-gray-600">Ваши продажи на автопилоте</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="relative hidden md:block">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Поиск по лидам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 border-gray-200"
                />
              </div>
              <Button 
                onClick={() => openCreateLeadModal()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
              >
                <Icon name="Plus" size={20} className="mr-2" />
                Создать лид
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                <Icon name="Home" size={20} />
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <Icon name="LogOut" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <CardHeader className="pb-2 relative">
              <CardTitle className="text-sm font-medium text-blue-100">Всего лидов</CardTitle>
              <div className="flex items-end justify-between mt-2">
                <p className="text-5xl font-bold">{leads.length}</p>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Icon name="Users" size={24} />
                </div>
              </div>
            </CardHeader>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <CardHeader className="pb-2 relative">
              <CardTitle className="text-sm font-medium text-purple-100">В работе</CardTitle>
              <div className="flex items-end justify-between mt-2">
                <p className="text-5xl font-bold">
                  {leads.filter(l => !['closed-won', 'closed-lost'].includes(l.status)).length}
                </p>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Icon name="Target" size={24} />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden relative">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <CardHeader className="pb-2 relative">
              <CardTitle className="text-sm font-medium text-green-100">Выиграно</CardTitle>
              <div className="flex items-end justify-between mt-2">
                <p className="text-5xl font-bold">
                  {leads.filter(l => l.status === 'closed-won').length}
                </p>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Icon name="Trophy" size={24} />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-500 to-pink-600 text-white overflow-hidden relative">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <CardHeader className="pb-2 relative">
              <CardTitle className="text-sm font-medium text-orange-100">Конверсия</CardTitle>
              <div className="flex items-end justify-between mt-2">
                <p className="text-5xl font-bold">{getConversionRate()}%</p>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Icon name="TrendingUp" size={24} />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Card className="shadow-2xl border-0 backdrop-blur-xl bg-white/80">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Воронка продаж</CardTitle>
                <CardDescription className="text-base mt-1">
                  Управляйте сделками на каждом этапе
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-base px-4 py-2">
                {filteredLeads.length} лидов
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
              {statusStages.map((stage) => {
                const stageLeads = filteredLeads.filter(l => l.status === stage.id);
                const totalValue = stageLeads.length;
                
                return (
                  <div key={stage.id} className="space-y-4">
                    <div className={`sticky top-24 bg-gradient-to-br ${stage.color} rounded-2xl p-4 shadow-lg transform hover:scale-105 transition-all`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{stage.emoji}</span>
                          <div>
                            <h3 className="font-bold text-white text-sm">{stage.label}</h3>
                            <p className="text-white/80 text-xs">{totalValue} лидов</p>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0"
                        onClick={() => openCreateLeadModal(stage.id as Lead['status'])}
                      >
                        <Icon name="Plus" size={16} className="mr-1" />
                        Добавить
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {stageLeads.map(lead => (
                        <Card 
                          key={lead.id} 
                          className="cursor-pointer hover:shadow-2xl hover:scale-105 transition-all border-0 shadow-lg bg-white group"
                          onClick={() => openLeadCard(lead)}
                        >
                          <CardHeader className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-sm font-bold line-clamp-1 group-hover:text-blue-600 transition-colors">
                                  {lead.name}
                                </CardTitle>
                                <CardDescription className="text-xs mt-1 line-clamp-1">
                                  {lead.company || lead.email}
                                </CardDescription>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity -mr-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteLead(lead.id);
                                }}
                              >
                                <Icon name="Trash2" size={14} className="text-red-500" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {lead.type}
                              </Badge>
                              {lead.phone && (
                                <Icon name="Phone" size={12} className="text-green-500" />
                              )}
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                      {stageLeads.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                          <Icon name="Inbox" size={40} className="mx-auto mb-3 opacity-30" />
                          <p className="text-sm">Пусто</p>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full shadow-2xl border-0">
            <CardHeader className="border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Создать новый лид</CardTitle>
                  <CardDescription className="mt-2 text-white/80">
                    Добавить в: {getStatusStage(newLead.status).emoji} {getStatusStage(newLead.status).label}
                  </CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setShowCreateLead(false)} className="text-white hover:bg-white/20">
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1">
                    <Icon name="User" size={14} />
                    Имя *
                  </label>
                  <Input
                    placeholder="Иван Иванов"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="border-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1">
                    <Icon name="Mail" size={14} />
                    Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="ivan@example.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="border-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1">
                    <Icon name="Phone" size={14} />
                    Телефон
                  </label>
                  <Input
                    type="tel"
                    placeholder="+7 999 123-45-67"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="border-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-1">
                    <Icon name="Building2" size={14} />
                    Компания
                  </label>
                  <Input
                    placeholder="ООО Компания"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    className="border-2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-1">
                  <Icon name="MessageSquare" size={14} />
                  Комментарий
                </label>
                <Textarea
                  placeholder="Дополнительная информация..."
                  value={newLead.message}
                  onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
                  rows={3}
                  className="border-2"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={createLead} className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Icon name="Check" size={20} className="mr-2" />
                  Создать лид
                </Button>
                <Button variant="outline" onClick={() => setShowCreateLead(false)} className="h-12">
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showLeadCard && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <Card className="w-full md:max-w-6xl md:max-h-[90vh] h-full md:h-auto overflow-y-auto shadow-2xl border-0 md:rounded-2xl">
            <CardHeader className={`border-b sticky top-0 z-10 bg-gradient-to-r ${getStatusStage(selectedLead.status).color} text-white`}>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  {editingName ? (
                    <div className="flex gap-2">
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-xl font-bold bg-white/20 border-white/30 text-white placeholder:text-white/60"
                        autoFocus
                      />
                      <Button size="sm" onClick={updateLeadName} className="bg-white/20 hover:bg-white/30">
                        <Icon name="Check" size={16} />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingName(false)} className="border-white/30 text-white hover:bg-white/20">
                        <Icon name="X" size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getStatusStage(selectedLead.status).emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-3xl">{selectedLead.name}</CardTitle>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setEditingName(true)}
                            className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                          >
                            <Icon name="Pencil" size={14} />
                          </Button>
                        </div>
                        <CardDescription className="mt-2 text-white/80 flex items-center gap-3 flex-wrap text-base">
                          {selectedLead.company && <span className="flex items-center gap-1">
                            <Icon name="Building2" size={14} />
                            {selectedLead.company}
                          </span>}
                          <Badge variant="secondary" className="bg-white/20 text-white border-0">
                            {selectedLead.source}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => deleteLead(selectedLead.id)} className="bg-red-500/20 hover:bg-red-500/30 text-white">
                    <Icon name="Trash2" size={16} />
                  </Button>
                  <Button variant="ghost" onClick={() => setShowLeadCard(false)} className="hover:bg-white/20 text-white">
                    <Icon name="X" size={20} />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="shadow-lg border-2">
                  <CardHeader className="pb-4 bg-gradient-to-br from-blue-50 to-white">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="User" size={20} className="text-blue-600" />
                      Контакты
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                      <p className="text-base font-medium mt-1 flex items-center gap-2">
                        <Icon name="Mail" size={16} className="text-gray-400" />
                        {selectedLead.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Телефон</label>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedLead.phone ? (
                          <>
                            <p className="text-base font-medium flex items-center gap-2">
                              <Icon name="Phone" size={16} className="text-gray-400" />
                              {selectedLead.phone}
                            </p>
                            <Button 
                              size="sm" 
                              onClick={() => makeCall(selectedLead.phone)} 
                              className="ml-auto bg-green-500 hover:bg-green-600"
                            >
                              <Icon name="Phone" size={14} className="mr-1" />
                              Позвонить
                            </Button>
                          </>
                        ) : (
                          <p className="text-sm text-gray-400">Не указан</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Этап</label>
                      <Select 
                        value={selectedLead.status} 
                        onValueChange={(value) => updateLeadStatus(selectedLead.id, value as Lead['status'])}
                      >
                        <SelectTrigger className="mt-1 border-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusStages.map(stage => (
                            <SelectItem key={stage.id} value={stage.id}>
                              <div className="flex items-center gap-2">
                                <span>{stage.emoji}</span>
                                {stage.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {selectedLead.message && (
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Сообщение</label>
                        <p className="text-sm mt-2 p-3 bg-gray-50 rounded-lg border">{selectedLead.message}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-2">
                  <CardHeader className="pb-4 bg-gradient-to-br from-purple-50 to-white">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="CheckSquare" size={20} className="text-purple-600" />
                      Задачи
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {tasks.filter(t => t.leadId === selectedLead.id && !t.completed).map(task => (
                        <Card key={task.id} className="p-3 shadow-sm border-2 hover:border-purple-300 transition-colors">
                          <div className="flex items-start gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 mt-0.5"
                              onClick={() => toggleTaskComplete(task.id)}
                            >
                              <Icon name="Circle" size={18} className="text-gray-400" />
                            </Button>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-2">{task.title}</p>
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Icon name="Calendar" size={12} />
                                {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                      {tasks.filter(t => t.leadId === selectedLead.id && !t.completed).length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-6">Нет активных задач</p>
                      )}
                    </div>
                    <div className="pt-3 border-t space-y-3">
                      <Input
                        placeholder="Новая задача..."
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="border-2"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                          <SelectTrigger className="border-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="call">📞 Звонок</SelectItem>
                            <SelectItem value="meeting">👥 Встреча</SelectItem>
                            <SelectItem value="proposal">📄 КП</SelectItem>
                            <SelectItem value="follow-up">⏰ Контроль</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                          className="border-2"
                        />
                      </div>
                      <Button onClick={addTask} className="w-full bg-purple-600 hover:bg-purple-700">
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить задачу
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-2">
                  <CardHeader className="pb-4 bg-gradient-to-br from-orange-50 to-white">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="Activity" size={20} className="text-orange-600" />
                      Активность
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Добавить заметку..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={3}
                        className="border-2"
                      />
                      <Button onClick={addNote} className="w-full bg-orange-600 hover:bg-orange-700">
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить заметку
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto pt-2 border-t">
                      {activities
                        .filter(a => a.leadId === selectedLead.id)
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map(activity => (
                          <Card key={activity.id} className="p-3 shadow-sm border">
                            <div className="flex gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Icon name={getActivityIcon(activity.type)} size={14} className="text-orange-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm">{activity.description}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(activity.createdAt).toLocaleString('ru-RU')}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CRM;
