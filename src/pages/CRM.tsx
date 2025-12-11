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
  const [newTask, setNewTask] = useState({ title: '', type: 'call', dueDate: '' });
  const [newNote, setNewNote] = useState('');
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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColors, setCustomColors] = useState<{[key: string]: {color: string, textColor: string}}>({
    'new': { color: '#1e3a8a', textColor: '#60a5fa' },
    'first-contact': { color: '#0f766e', textColor: '#5eead4' },
    'evaluation': { color: '#7c2d12', textColor: '#fdba74' },
    'proposal': { color: '#7e22ce', textColor: '#d8b4fe' },
    'negotiation': { color: '#be123c', textColor: '#fda4af' },
    'closed-won': { color: '#065f46', textColor: '#6ee7b7' },
    'closed-lost': { color: '#1f2937', textColor: '#9ca3af' }
  });

  const statusStages = [
    { id: 'new', label: 'Новый лид' },
    { id: 'first-contact', label: 'Первый контакт' },
    { id: 'evaluation', label: 'Квалификация' },
    { id: 'proposal', label: 'Коммерческое предложение' },
    { id: 'negotiation', label: 'Переговоры' },
    { id: 'closed-won', label: 'Успешно реализовано' },
    { id: 'closed-lost', label: 'Закрыто и не реализовано' }
  ];

  useEffect(() => {
    const auth = localStorage.getItem('crm_auth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
      loadData();
    }
    const savedColors = localStorage.getItem('crm_colors');
    if (savedColors) {
      setCustomColors(JSON.parse(savedColors));
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
    const stage = statusStages.find(s => s.id === status) || statusStages[0];
    const colors = customColors[status] || customColors['new'];
    return { ...stage, ...colors };
  };

  const updateStageColor = (stageId: string, color: string, textColor: string) => {
    const newColors = { ...customColors, [stageId]: { color, textColor } };
    setCustomColors(newColors);
    localStorage.setItem('crm_colors', JSON.stringify(newColors));
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
    return ((won / total) * 100).toFixed(0);
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTotalBudget = () => {
    return leads.reduce((sum, lead) => {
      const budget = parseInt(lead.budget || '0');
      return sum + budget;
    }, 0);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl border-cyan-500/30 bg-slate-800/80 backdrop-blur-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              <Icon name="Lock" size={32} className="text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">DEOD CRM</CardTitle>
            <CardDescription className="text-slate-300">Введите пароль для входа</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
              <Button type="submit" className="w-full h-10 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all">
                Войти
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-10 border-slate-600 text-slate-300 hover:bg-slate-700/50"
                onClick={() => navigate('/')}
              >
                На главную
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <header className="border-b border-cyan-500/30 bg-slate-800/80 backdrop-blur-lg sticky top-0 z-40 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <div className="px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <h1 className="font-semibold text-lg sm:text-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">DEOD CRM</h1>
              <Button 
                onClick={() => openCreateLeadModal()}
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 h-8 text-xs ml-auto sm:ml-0 touch-manipulation shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <Icon name="Plus" size={14} className="mr-1" />
                <span className="hidden sm:inline">Новая сделка</span>
                <span className="sm:hidden">Создать</span>
              </Button>
              <Button 
                onClick={() => setShowColorPicker(!showColorPicker)}
                size="sm"
                variant="outline"
                className="h-8 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 touch-manipulation"
              >
                <Icon name="Palette" size={14} />
              </Button>
            </div>
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Icon name="Search" size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full sm:w-48 h-8 text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="h-8 w-8 p-0 touch-manipulation text-cyan-400 hover:bg-cyan-500/10">
                <Icon name="Home" size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 w-8 p-0 touch-manipulation text-cyan-400 hover:bg-cyan-500/10">
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-slate-800/50 border-b border-cyan-500/20 px-4 py-4 overflow-x-auto backdrop-blur-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 min-w-max sm:min-w-0">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 sm:p-3 border border-cyan-500/20 min-w-[120px] shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <div className="text-xs text-cyan-400 mb-1">Всего сделок</div>
            <div className="text-xl sm:text-2xl font-semibold text-white">{leads.length}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 sm:p-3 border border-cyan-500/20 min-w-[120px] shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <div className="text-xs text-cyan-400 mb-1">В работе</div>
            <div className="text-xl sm:text-2xl font-semibold text-white">
              {leads.filter(l => !['closed-won', 'closed-lost'].includes(l.status)).length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 sm:p-3 border border-cyan-500/20 min-w-[120px] shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <div className="text-xs text-cyan-400 mb-1">Конверсия</div>
            <div className="text-xl sm:text-2xl font-semibold text-emerald-400">{getConversionRate()}%</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 sm:p-3 border border-cyan-500/20 min-w-[120px] shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <div className="text-xs text-cyan-400 mb-1">Общая сумма</div>
            <div className="text-xl sm:text-2xl font-semibold text-white">{getTotalBudget().toLocaleString()} ₽</div>
          </div>
        </div>
      </div>

      {showColorPicker && (
        <div className="bg-slate-800/90 border-b border-cyan-500/30 px-4 py-3 backdrop-blur-lg">
          <div className="text-sm text-cyan-400 mb-3 font-medium">Настройка цветов воронки</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
            {statusStages.map((stage) => {
              const colors = customColors[stage.id];
              return (
                <div key={stage.id} className="space-y-1">
                  <div className="text-xs text-slate-300 truncate">{stage.label}</div>
                  <div className="flex gap-1">
                    <input 
                      type="color" 
                      value={colors.color}
                      onChange={(e) => updateStageColor(stage.id, e.target.value, colors.textColor)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <input 
                      type="color" 
                      value={colors.textColor}
                      onChange={(e) => updateStageColor(stage.id, colors.color, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <main className="p-2 sm:p-4 overflow-x-auto">
        <div className="flex gap-2 sm:gap-3 min-w-max pb-4">
          {statusStages.map((stage) => {
            const stageLeads = filteredLeads.filter(l => l.status === stage.id);
            const stageBudget = stageLeads.reduce((sum, l) => sum + parseInt(l.budget || '0'), 0);
            const stageColors = getStatusStage(stage.id);
            
            return (
              <div key={stage.id} className="w-64 sm:w-72 flex-shrink-0">
                <div 
                  className="rounded-t-lg p-2 mb-2 border-2 transition-all"
                  style={{ 
                    backgroundColor: stageColors.color,
                    borderColor: stageColors.textColor,
                    boxShadow: `0 0 20px ${stageColors.textColor}40`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium" style={{ color: stageColors.textColor }}>
                        {stage.label}
                      </div>
                      <div className="text-xs mt-0.5 font-semibold" style={{ color: stageColors.textColor }}>
                        {stageLeads.length} • {stageBudget.toLocaleString()} ₽
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-white/10 touch-manipulation"
                      onClick={() => openCreateLeadModal(stage.id as Lead['status'])}
                    >
                      <Icon name="Plus" size={14} style={{ color: stageColors.textColor }} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      className="bg-slate-800/80 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-3 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all cursor-pointer group"
                      onClick={() => openLeadCard(lead)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-white truncate">
                            {lead.name}
                          </div>
                          {lead.company && (
                            <div className="text-xs text-cyan-300 truncate mt-0.5">
                              {lead.company}
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 touch-manipulation hover:bg-red-500/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLead(lead.id);
                          }}
                        >
                          <Icon name="X" size={12} className="text-red-400" />
                        </Button>
                      </div>
                      
                      {lead.budget && (
                        <div className="text-sm font-semibold text-emerald-400 mb-2">
                          {parseInt(lead.budget).toLocaleString()} ₽
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        {lead.phone && (
                          <div className="flex items-center gap-1">
                            <Icon name="Phone" size={12} />
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-1">
                            <Icon name="Mail" size={12} />
                          </div>
                        )}
                        <div className="ml-auto">
                          {new Date(lead.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {stageLeads.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      Пусто
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showCreateLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="max-w-xl w-full my-8 bg-slate-800/95 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <CardHeader className="border-b border-cyan-500/30">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-white">Новая сделка</CardTitle>
                  <CardDescription className="mt-1 text-cyan-400">
                    Этап: {getStatusStage(newLead.status).label}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateLead(false)} className="touch-manipulation text-slate-400 hover:text-white hover:bg-slate-700/50">
                  <Icon name="X" size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-cyan-400">Имя *</label>
                  <Input
                    placeholder="Иван Иванов"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="h-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-cyan-400">Email *</label>
                  <Input
                    type="email"
                    placeholder="ivan@example.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="h-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-cyan-400">Телефон</label>
                  <Input
                    type="tel"
                    placeholder="+7 999 123-45-67"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="h-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-cyan-400">Компания</label>
                  <Input
                    placeholder="ООО Компания"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    className="h-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-cyan-400">Примечание</label>
                <Textarea
                  placeholder="Дополнительная информация..."
                  value={newLead.message}
                  onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
                  rows={2}
                  className="text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button onClick={createLead} className="flex-1 h-9 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-[0_0_20px_rgba(6,182,212,0.3)] touch-manipulation">
                  Создать
                </Button>
                <Button variant="outline" onClick={() => setShowCreateLead(false)} className="h-9 sm:w-auto touch-manipulation border-slate-600 text-slate-300 hover:bg-slate-700/50">
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showLeadCard && selectedLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto my-2 sm:my-8 bg-slate-800/95 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <CardHeader className="border-b border-cyan-500/30 sticky top-0 bg-slate-800/95 backdrop-blur-lg z-10">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl text-white">{selectedLead.name}</CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2 text-cyan-400">
                    {selectedLead.company && <span>{selectedLead.company}</span>}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => deleteLead(selectedLead.id)} className="text-red-400 hover:bg-red-500/20 touch-manipulation w-8 h-8 p-0">
                    <Icon name="Trash2" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowLeadCard(false)} className="touch-manipulation w-8 h-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50">
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-3 sm:p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-slate-700/50 rounded-lg p-3 space-y-2 border border-cyan-500/20">
                    <div className="text-xs font-medium text-cyan-400">Контакты</div>
                    <div className="space-y-1">
                      <div className="text-sm flex items-center gap-2 text-white">
                        <Icon name="Mail" size={14} className="text-cyan-400" />
                        {selectedLead.email}
                      </div>
                      {selectedLead.phone && (
                        <div className="text-sm flex items-center gap-2 text-white">
                          <Icon name="Phone" size={14} className="text-cyan-400" />
                          {selectedLead.phone}
                          <Button 
                            size="sm" 
                            onClick={() => makeCall(selectedLead.phone)} 
                            className="ml-auto h-6 text-xs bg-emerald-600 hover:bg-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.3)] touch-manipulation"
                          >
                            Позвонить
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-3 space-y-2 border border-cyan-500/20">
                    <div className="text-xs font-medium text-cyan-400">Этап сделки</div>
                    <Select 
                      value={selectedLead.status} 
                      onValueChange={(value) => updateLeadStatus(selectedLead.id, value as Lead['status'])}
                    >
                      <SelectTrigger className="h-9 bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {statusStages.map(stage => (
                          <SelectItem key={stage.id} value={stage.id} className="text-white hover:bg-slate-700">
                            {stage.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedLead.message && (
                    <div className="bg-slate-700/50 rounded-lg p-3 space-y-2 border border-cyan-500/20">
                      <div className="text-xs font-medium text-cyan-400">Примечание</div>
                      <div className="text-sm text-white">{selectedLead.message}</div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-cyan-400">Добавить примечание</div>
                    <Textarea
                      placeholder="Новая заметка..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={2}
                      className="text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                    <Button onClick={addNote} size="sm" className="h-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-[0_0_15px_rgba(6,182,212,0.3)] touch-manipulation">
                      Добавить
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-700/50 rounded-lg p-3 border border-cyan-500/20">
                    <div className="text-xs font-medium text-cyan-400 mb-2">Задачи</div>
                    <div className="space-y-2 mb-3">
                      {tasks.filter(t => t.leadId === selectedLead.id && !t.completed).map(task => (
                        <div key={task.id} className="flex items-start gap-2 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 touch-manipulation"
                            onClick={() => toggleTaskComplete(task.id)}
                          >
                            <Icon name="Circle" size={14} className="text-cyan-400" />
                          </Button>
                          <div className="flex-1">
                            <div className="text-xs text-white">{task.title}</div>
                            <div className="text-xs text-slate-400">
                              {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                            </div>
                          </div>
                        </div>
                      ))}
                      {tasks.filter(t => t.leadId === selectedLead.id && !t.completed).length === 0 && (
                        <div className="text-xs text-slate-500">Нет задач</div>
                      )}
                    </div>
                    <Input
                      placeholder="Новая задача..."
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="h-8 text-xs mb-2 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                    />
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="h-8 text-xs mb-2 bg-slate-700/50 border-slate-600 text-white"
                    />
                    <Button onClick={addTask} size="sm" className="w-full h-7 text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-[0_0_15px_rgba(6,182,212,0.3)] touch-manipulation">
                      Добавить задачу
                    </Button>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-3 border border-cyan-500/20">
                    <div className="text-xs font-medium text-cyan-400 mb-2">История</div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {activities
                        .filter(a => a.leadId === selectedLead.id)
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map(activity => (
                          <div key={activity.id} className="text-xs">
                            <div className="text-white">{activity.description}</div>
                            <div className="text-slate-400 text-xs">
                              {new Date(activity.createdAt).toLocaleString('ru-RU')}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CRM;