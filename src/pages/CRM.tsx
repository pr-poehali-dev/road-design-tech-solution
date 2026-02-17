import { useState, useEffect } from 'react';
import { CRMAuth } from '@/components/crm/CRMAuth';
import { CRMHeader } from '@/components/crm/CRMHeader';
import { CRMKanban, Lead } from '@/components/crm/CRMKanban';
import { CRMLeadModal, Task, Activity } from '@/components/crm/CRMLeadModal';

const CRM = () => {
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
    setIsAuthenticated(true);
    loadData();
    const savedColors = localStorage.getItem('crm_colors');
    if (savedColors) {
      setCustomColors(JSON.parse(savedColors));
    }
  }, []);

  const loadData = async () => {
    try {
      const userProfile = localStorage.getItem('userProfile');
      if (!userProfile) return;
      
      const profile = JSON.parse(userProfile);
      const partnerId = profile.id;
      
      if (!partnerId) {
        console.error('Partner ID not found in user profile');
        return;
      }
      
      // Загружаем клиентов партнера из backend/crm
      const clientsResponse = await fetch(
        `https://functions.poehali.dev/dfa8f17b-5894-48e3-b263-bb3c5de0282e?resource=clients&partner_id=${partnerId}`
      );
      
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        if (clientsData.clients) {
          const mappedLeads = clientsData.clients.map((client: Record<string, unknown>) => ({
            id: client.id,
            name: client.contact_name || '',
            email: client.email || '',
            phone: client.phone || '',
            company: client.company_name || '',
            message: client.notes || '',
            type: 'CRM',
            status: client.stage || 'new',
            createdAt: client.created_at,
            updatedAt: client.updated_at
          }));
          setLeads(mappedLeads);
        }
      }
      
      // Загружаем задачи партнера
      const tasksResponse = await fetch(
        `https://functions.poehali.dev/dfa8f17b-5894-48e3-b263-bb3c5de0282e?resource=tasks&partner_id=${partnerId}`
      );
      
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        if (tasksData.tasks) {
          setTasks(tasksData.tasks);
        }
      }
      
      // Загружаем активности партнера
      const activitiesResponse = await fetch(
        `https://functions.poehali.dev/dfa8f17b-5894-48e3-b263-bb3c5de0282e?resource=activities&partner_id=${partnerId}`
      );
      
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        if (activitiesData.activities) {
          setActivities(activitiesData.activities);
        }
      }
    } catch (error) {
      console.error('Error loading CRM data:', error);
    }
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
      const existing = localStorage.getItem('userProfile');
      if (!existing || !JSON.parse(existing).id) {
        localStorage.setItem('userProfile', JSON.stringify({
          id: 1,
          name: 'Admin',
          contact: '',
          registeredAt: Date.now()
        }));
      }
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

  const createLead = async () => {
    if (!newLead.name || !newLead.email) {
      alert('Заполните имя и email');
      return;
    }

    try {
      const userProfile = localStorage.getItem('userProfile');
      if (!userProfile) {
        alert('Профиль пользователя не найден');
        return;
      }
      
      const profile = JSON.parse(userProfile);
      const partnerId = profile.id;
      
      if (!partnerId) {
        alert('ID партнера не найден в профиле');
        return;
      }

      // Создаем клиента в backend
      const response = await fetch('https://functions.poehali.dev/dfa8f17b-5894-48e3-b263-bb3c5de0282e', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resource: 'client',
          partner_id: partnerId,
          contact_name: newLead.name,
          email: newLead.email,
          phone: newLead.phone || '',
          company_name: newLead.company || '',
          notes: newLead.message || '',
          stage: newLead.status,
          source: 'Ручное создание'
        })
      });

      if (response.ok) {
        // Перезагружаем данные после создания
        await loadData();
        
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
      } else {
        alert('Ошибка создания клиента');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Ошибка создания клиента');
    }
  };

  const updateLeadStatus = async (id: string, newStatus: Lead['status']) => {
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
    
    // Синхронизируем с backend
    try {
      await fetch('https://functions.poehali.dev/2c86d047-a46f-48f8-86f6-21557b41ca9b', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
    
    if (selectedLead?.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Удалить этот лид?')) return;
    
    const updatedLeads = leads.filter(lead => lead.id !== id);
    const updatedTasks = tasks.filter(task => task.leadId !== id);
    const updatedActivities = activities.filter(activity => activity.leadId !== id);
    
    setLeads(updatedLeads);
    setTasks(updatedTasks);
    setActivities(updatedActivities);
    saveData(updatedLeads, updatedTasks, updatedActivities);
    
    // Удаляем из backend
    try {
      await fetch(`https://functions.poehali.dev/2c86d047-a46f-48f8-86f6-21557b41ca9b?id=${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
    
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

  const updateStageColor = (stageId: string, color: string, textColor: string) => {
    const newColors = { ...customColors, [stageId]: { color, textColor } };
    setCustomColors(newColors);
    localStorage.setItem('crm_colors', JSON.stringify(newColors));
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
      <CRMAuth 
        password={password} 
        setPassword={setPassword} 
        onLogin={handleLogin} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <CRMHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateLead={() => openCreateLeadModal()}
        onToggleColorPicker={() => setShowColorPicker(!showColorPicker)}
        onLogout={handleLogout}
        totalLeads={leads.length}
        activeLeads={leads.filter(l => !['closed-won', 'closed-lost'].includes(l.status)).length}
        conversionRate={getConversionRate()}
        totalBudget={getTotalBudget()}
      />

      <CRMKanban
        leads={filteredLeads}
        statusStages={statusStages}
        customColors={customColors}
        showColorPicker={showColorPicker}
        onLeadClick={openLeadCard}
        onCreateLeadInStage={openCreateLeadModal}
        onUpdateStageColor={updateStageColor}
      />

      <CRMLeadModal
        showLeadCard={showLeadCard}
        showCreateLead={showCreateLead}
        selectedLead={selectedLead}
        newLead={newLead}
        tasks={tasks}
        activities={activities}
        newTask={newTask}
        newNote={newNote}
        statusStages={statusStages}
        onCloseLeadCard={() => setShowLeadCard(false)}
        onCloseCreateLead={() => setShowCreateLead(false)}
        onDeleteLead={deleteLead}
        onUpdateLeadStatus={updateLeadStatus}
        onAddNote={addNote}
        onAddTask={addTask}
        onToggleTaskComplete={toggleTaskComplete}
        onMakeCall={makeCall}
        setNewNote={setNewNote}
        setNewTask={setNewTask}
        setNewLead={setNewLead}
        onCreateLead={createLead}
      />
    </div>
  );
};

export default CRM;