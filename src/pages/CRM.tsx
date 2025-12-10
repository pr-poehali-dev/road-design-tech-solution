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

  const statusStages = [
    { id: 'new', label: 'Новый лид', color: '#E8EBED', textColor: '#333' },
    { id: 'first-contact', label: 'Первый контакт', color: '#D5E8F7', textColor: '#1F5F8B' },
    { id: 'evaluation', label: 'Квалификация', color: '#FFF4E6', textColor: '#8B5A00' },
    { id: 'proposal', label: 'Коммерческое предложение', color: '#FFF0F0', textColor: '#8B2500' },
    { id: 'negotiation', label: 'Переговоры', color: '#F0E6FF', textColor: '#5A008B' },
    { id: 'closed-won', label: 'Успешно реализовано', color: '#E6F7ED', textColor: '#0F5132' },
    { id: 'closed-lost', label: 'Закрыто и не реализовано', color: '#FCE4E4', textColor: '#8B0000' }
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
    return statusStages.find(s => s.id === status) || statusStages[0];
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Icon name="Lock" size={32} className="text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold">DEOD CRM</CardTitle>
            <CardDescription>Введите пароль для входа</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
                required
              />
              <Button type="submit" className="w-full h-10 bg-blue-600 hover:bg-blue-700">
                Войти
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-10"
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
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white sticky top-0 z-40 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="font-semibold text-xl text-gray-900">DEOD CRM</h1>
              <div className="flex gap-2 ml-4">
                <Button 
                  onClick={() => openCreateLeadModal()}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 h-8"
                >
                  <Icon name="Plus" size={16} className="mr-1" />
                  Новая сделка
                </Button>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Icon name="Search" size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64 h-8 text-sm"
                />
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="h-8">
                <Icon name="Home" size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8">
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-gray-50 border-b px-4 py-4">
        <div className="grid grid-cols-4 gap-4 max-w-7xl">
          <div className="bg-white rounded p-3 border">
            <div className="text-xs text-gray-500 mb-1">Всего сделок</div>
            <div className="text-2xl font-semibold">{leads.length}</div>
          </div>
          <div className="bg-white rounded p-3 border">
            <div className="text-xs text-gray-500 mb-1">В работе</div>
            <div className="text-2xl font-semibold">
              {leads.filter(l => !['closed-won', 'closed-lost'].includes(l.status)).length}
            </div>
          </div>
          <div className="bg-white rounded p-3 border">
            <div className="text-xs text-gray-500 mb-1">Конверсия</div>
            <div className="text-2xl font-semibold text-green-600">{getConversionRate()}%</div>
          </div>
          <div className="bg-white rounded p-3 border">
            <div className="text-xs text-gray-500 mb-1">Общая сумма</div>
            <div className="text-2xl font-semibold">{getTotalBudget().toLocaleString()} ₽</div>
          </div>
        </div>
      </div>

      <main className="p-4 overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {statusStages.map((stage) => {
            const stageLeads = filteredLeads.filter(l => l.status === stage.id);
            const stageBudget = stageLeads.reduce((sum, l) => sum + parseInt(l.budget || '0'), 0);
            
            return (
              <div key={stage.id} className="w-72 flex-shrink-0">
                <div 
                  className="rounded-t p-2 mb-2"
                  style={{ backgroundColor: stage.color }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium" style={{ color: stage.textColor }}>
                        {stage.label}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: stage.textColor, opacity: 0.7 }}>
                        {stageLeads.length} • {stageBudget.toLocaleString()} ₽
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-black/5"
                      onClick={() => openCreateLeadModal(stage.id as Lead['status'])}
                    >
                      <Icon name="Plus" size={14} style={{ color: stage.textColor }} />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      className="bg-white border rounded p-3 hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => openLeadCard(lead)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {lead.name}
                          </div>
                          {lead.company && (
                            <div className="text-xs text-gray-500 truncate mt-0.5">
                              {lead.company}
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLead(lead.id);
                          }}
                        >
                          <Icon name="X" size={12} className="text-gray-400" />
                        </Button>
                      </div>
                      
                      {lead.budget && (
                        <div className="text-sm font-semibold text-gray-900 mb-2">
                          {parseInt(lead.budget).toLocaleString()} ₽
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500">
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
                    <div className="text-center py-8 text-gray-400 text-sm">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-xl w-full">
            <CardHeader className="border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Новая сделка</CardTitle>
                  <CardDescription className="mt-1">
                    Этап: {getStatusStage(newLead.status).label}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateLead(false)}>
                  <Icon name="X" size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Имя *</label>
                  <Input
                    placeholder="Иван Иванов"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Email *</label>
                  <Input
                    type="email"
                    placeholder="ivan@example.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Телефон</label>
                  <Input
                    type="tel"
                    placeholder="+7 999 123-45-67"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">Компания</label>
                  <Input
                    placeholder="ООО Компания"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">Примечание</label>
                <Textarea
                  placeholder="Дополнительная информация..."
                  value={newLead.message}
                  onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
                  rows={2}
                  className="text-sm"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={createLead} className="flex-1 h-9 bg-blue-600 hover:bg-blue-700">
                  Создать
                </Button>
                <Button variant="outline" onClick={() => setShowCreateLead(false)} className="h-9">
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showLeadCard && selectedLead && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl">{selectedLead.name}</CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    {selectedLead.company && <span>{selectedLead.company}</span>}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => deleteLead(selectedLead.id)} className="text-red-600">
                    <Icon name="Trash2" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowLeadCard(false)}>
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-4">
                  <div className="bg-gray-50 rounded p-3 space-y-2">
                    <div className="text-xs font-medium text-gray-500">Контакты</div>
                    <div className="space-y-1">
                      <div className="text-sm flex items-center gap-2">
                        <Icon name="Mail" size={14} className="text-gray-400" />
                        {selectedLead.email}
                      </div>
                      {selectedLead.phone && (
                        <div className="text-sm flex items-center gap-2">
                          <Icon name="Phone" size={14} className="text-gray-400" />
                          {selectedLead.phone}
                          <Button 
                            size="sm" 
                            onClick={() => makeCall(selectedLead.phone)} 
                            className="ml-auto h-6 text-xs bg-green-600 hover:bg-green-700"
                          >
                            Позвонить
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 space-y-2">
                    <div className="text-xs font-medium text-gray-500">Этап сделки</div>
                    <Select 
                      value={selectedLead.status} 
                      onValueChange={(value) => updateLeadStatus(selectedLead.id, value as Lead['status'])}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusStages.map(stage => (
                          <SelectItem key={stage.id} value={stage.id}>
                            {stage.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedLead.message && (
                    <div className="bg-gray-50 rounded p-3 space-y-2">
                      <div className="text-xs font-medium text-gray-500">Примечание</div>
                      <div className="text-sm">{selectedLead.message}</div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-500">Добавить примечание</div>
                    <Textarea
                      placeholder="Новая заметка..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                    <Button onClick={addNote} size="sm" className="h-8 bg-blue-600 hover:bg-blue-700">
                      Добавить
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs font-medium text-gray-500 mb-2">Задачи</div>
                    <div className="space-y-2 mb-3">
                      {tasks.filter(t => t.leadId === selectedLead.id && !t.completed).map(task => (
                        <div key={task.id} className="flex items-start gap-2 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0"
                            onClick={() => toggleTaskComplete(task.id)}
                          >
                            <Icon name="Circle" size={14} className="text-gray-400" />
                          </Button>
                          <div className="flex-1">
                            <div className="text-xs">{task.title}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                            </div>
                          </div>
                        </div>
                      ))}
                      {tasks.filter(t => t.leadId === selectedLead.id && !t.completed).length === 0 && (
                        <div className="text-xs text-gray-400">Нет задач</div>
                      )}
                    </div>
                    <Input
                      placeholder="Новая задача..."
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="h-8 text-xs mb-2"
                    />
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="h-8 text-xs mb-2"
                    />
                    <Button onClick={addTask} size="sm" className="w-full h-7 text-xs bg-blue-600 hover:bg-blue-700">
                      Добавить задачу
                    </Button>
                  </div>

                  <div className="bg-gray-50 rounded p-3">
                    <div className="text-xs font-medium text-gray-500 mb-2">История</div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {activities
                        .filter(a => a.leadId === selectedLead.id)
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map(activity => (
                          <div key={activity.id} className="text-xs">
                            <div className="text-gray-900">{activity.description}</div>
                            <div className="text-gray-500 text-xs">
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
