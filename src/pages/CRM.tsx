import { useState, useEffect, useCallback } from 'react';
import { CRMAuth } from '@/components/crm/CRMAuth';
import { CRMHeader } from '@/components/crm/CRMHeader';
import { CRMKanban, Lead, StageDef } from '@/components/crm/CRMKanban';
import { CRMLeadModal, Task, Activity } from '@/components/crm/CRMLeadModal';
import { CRMListView } from '@/components/crm/CRMListView';
import { CRMAnalytics } from '@/components/crm/CRMAnalytics';
import { CRMBridge } from '@/components/crm/CRMBridge';
import StarfieldBackground from '@/components/deod/StarfieldBackground';
import { getToken as getCrewToken } from '@/lib/crewApi';
import { crmApi } from '@/lib/crmApi';
import { bridgeApi } from '@/lib/bridgeApi';
import { exportLeadsToExcel, importLeadsFromExcel } from '@/lib/crmExcel';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/fd1c95d9-d394-4d33-af98-1d5a05163881';

const DEFAULT_COLORS: Record<string, { color: string; textColor: string }> = {
  'new': { color: '#12232b', textColor: '#66FCF1' },
  'first-contact': { color: '#1F2833', textColor: '#45A29E' },
  'evaluation': { color: '#2b1f33', textColor: '#C89BFF' },
  'proposal': { color: '#3a2412', textColor: '#FF9B4D' },
  'negotiation': { color: '#3a1414', textColor: '#FF8080' },
  'closed-won': { color: '#0f2b26', textColor: '#5eead4' },
  'closed-lost': { color: '#1F2833', textColor: '#6B7684' },
};

const CRM = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingCrewAuth, setCheckingCrewAuth] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [revenueStats, setRevenueStats] = useState({ totalRevenue: 0, totalPlanned: 0, totalContracts: 0, totalReceived: 0 });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadCard, setShowLeadCard] = useState(false);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    type: 'Ручной ввод',
    status: 'new'
  });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColors, setCustomColors] = useState<{ [key: string]: { color: string; textColor: string } }>(DEFAULT_COLORS);
  const [statusStages, setStatusStages] = useState<StageDef[]>([]);
  const [view, setView] = useState<'kanban' | 'list' | 'analytics' | 'bridge'>('kanban');

  const loadStages = useCallback(async () => {
    try {
      const res = await crmApi.getStages();
      const stages: StageDef[] = res.stages.map((s) => ({ id: s.stage_key, label: s.label, dbId: s.id }));
      setStatusStages(stages);
      const colors: Record<string, { color: string; textColor: string }> = {};
      res.stages.forEach((s) => { colors[s.stage_key] = { color: s.color, textColor: s.text_color }; });
      setCustomColors(colors);
    } catch {
      setStatusStages(Object.keys(DEFAULT_COLORS).map((id) => ({ id, label: id })));
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        try {
          const profile = JSON.parse(userProfile);
          if (profile && profile.id) {
            setIsAuthenticated(true);
            loadData();
            loadStages();
            setCheckingCrewAuth(false);
            return;
          }
        } catch {
          // invalid profile, try crew auth below
        }
      }

      const crewToken = getCrewToken();
      if (crewToken) {
        try {
          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Auth-Token': crewToken },
            body: JSON.stringify({ resource: 'crew_login' }),
          });
          const data = await res.json();
          if (res.ok && data.user) {
            localStorage.setItem('userProfile', JSON.stringify(data.user));
            setIsAuthenticated(true);
            loadData();
            loadStages();
          }
        } catch {
          // сеть недоступна — остаёмся на обычном экране входа
        }
      }
      setCheckingCrewAuth(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Фоновая проверка почты (пока открыта вкладка CRM) — каждую минуту, без участия пользователя
  useEffect(() => {
    if (!isAuthenticated) return;

    const syncMail = async () => {
      try {
        await bridgeApi.syncEmail();
        await loadData();
      } catch {
        // тихо — почта могла быть временно недоступна, попробуем на следующем цикле
      }
    };

    const interval = setInterval(syncMail, 60_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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

      const clientsResponse = await fetch(`${API_URL}?resource=clients&partner_id=${partnerId}`);

      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        if (clientsData.clients) {
          const mappedLeads = clientsData.clients.map((client: Record<string, unknown>) => ({
            id: String(client.id),
            name: client.contact_name || '',
            email: client.email || '',
            phone: client.phone || '',
            company: client.company_name || '',
            legal_name: client.legal_name || '',
            message: client.notes || '',
            description: client.description || '',
            type: 'CRM',
            status: client.stage || 'new',
            createdAt: client.created_at,
            updatedAt: client.updated_at,
            deal_amount: Number(client.deal_amount) || 0,
            revenue: Number(client.revenue) || 0,
            planned_revenue: Number(client.planned_revenue) || 0,
            contract_amount: Number(client.contract_amount) || 0,
            received_amount: Number(client.received_amount) || 0,
            decision_maker_name: client.decision_maker_name || '',
            decision_maker_phone: client.decision_maker_phone || '',
            open_task_title: client.open_task_title || '',
            open_task_due_date: client.open_task_due_date || '',
            open_task_status: client.open_task_status || '',
            next_action_at: client.next_action_at || '',
            last_action_at: client.last_action_at || '',
            unread_messages_count: Number(client.unread_messages_count) || 0,
            telegram_username: client.telegram_username || '',
          }));
          setLeads(mappedLeads);
        }
      }

      const tasksResponse = await fetch(`${API_URL}?resource=tasks&partner_id=${partnerId}`);
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        if (tasksData.tasks) {
          setTasks(tasksData.tasks.map((t: Record<string, unknown>) => ({
            id: String(t.id),
            leadId: String(t.client_id),
            title: t.title,
            type: 'call',
            dueDate: t.due_date || '',
            completed: t.status === 'completed',
            createdAt: t.created_at,
          })));
        }
      }

      const activitiesResponse = await fetch(`${API_URL}?resource=activities&partner_id=${partnerId}`);
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        if (activitiesData.activities) {
          setActivities(activitiesData.activities.map((a: Record<string, unknown>) => ({
            id: String(a.id),
            leadId: String(a.client_id),
            type: a.type,
            description: a.description,
            createdAt: a.created_at,
          })));
        }
      }

      const statsResponse = await fetch(`${API_URL}?resource=stats&partner_id=${partnerId}`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.stats) {
          setRevenueStats({
            totalRevenue: parseFloat(statsData.stats.total_revenue) || 0,
            totalPlanned: parseFloat(statsData.stats.total_planned) || 0,
            totalContracts: parseFloat(statsData.stats.total_contracts) || 0,
            totalReceived: parseFloat(statsData.stats.total_received) || 0,
          });
        }
      }
    } catch (error) {
      console.error('Error loading CRM data:', error);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    loadData();
    loadStages();
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_auth');
    localStorage.removeItem('userProfile');
    setIsAuthenticated(false);
  };

  const openCreateLeadModal = (status?: string) => {
    setNewLead({ ...newLead, status: status || statusStages[0]?.id || 'new' });
    setShowCreateLead(true);
  };

  const quickCreateLead = async () => {
    const name = prompt('Название сделки (компания или ФИО клиента):');
    if (!name || !name.trim()) return;
    const userProfile = localStorage.getItem('userProfile');
    if (!userProfile) return;
    const profile = JSON.parse(userProfile);
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resource: 'client',
          partner_id: profile.id,
          contact_name: name.trim(),
          company_name: name.trim(),
          stage: statusStages[0]?.id || 'new',
          source: 'Быстрое создание',
        }),
      });
      await loadData();
    } catch (error) {
      console.error('Error quick-creating lead:', error);
    }
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

      const response = await fetch(API_URL, {
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
        await loadData();
        setNewLead({ name: '', email: '', phone: '', company: '', message: '', type: 'Ручной ввод', status: 'new' });
        setShowCreateLead(false);
      } else {
        alert('Ошибка создания клиента');
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Ошибка создания клиента');
    }
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    const updatedLeads = leads.map(lead => (lead.id === id ? { ...lead, status: newStatus } : lead));
    setLeads(updatedLeads);

    if (selectedLead?.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }

    try {
      const userProfile = localStorage.getItem('userProfile');
      const profile = userProfile ? JSON.parse(userProfile) : null;
      if (profile?.id) {
        await fetch(API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resource: 'client',
            partner_id: profile.id,
            id: Number(id),
            updates: { stage: newStatus }
          })
        });
        await loadData();
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Удалить этот лид?')) return;

    const updatedLeads = leads.filter(lead => lead.id !== id);
    setLeads(updatedLeads);

    try {
      const userProfile = localStorage.getItem('userProfile');
      const profile = userProfile ? JSON.parse(userProfile) : null;
      if (profile?.id) {
        await fetch(`${API_URL}?resource=client&partner_id=${profile.id}&id=${id}`, { method: 'DELETE' });
      }
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

  const addNote = async () => {
    if (!selectedLead || !newNote) return;
    try {
      const userProfile = localStorage.getItem('userProfile');
      const profile = userProfile ? JSON.parse(userProfile) : null;
      if (!profile?.id) return;
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource: 'activity', partner_id: profile.id, client_id: Number(selectedLead.id), type: 'note', description: newNote }),
      });
      setNewNote('');
      await loadData();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const toggleTaskComplete = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const userProfile = localStorage.getItem('userProfile');
    const profile = userProfile ? JSON.parse(userProfile) : null;
    if (!profile?.id) return;
    try {
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource: 'task', partner_id: profile.id, id: Number(taskId), updates: { status: task.completed ? 'pending' : 'completed' } }),
      });
      await loadData();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const makeCall = (phone?: string) => {
    if (!phone) return;
    window.open(`tel:${phone}`);
  };

  const updateLead = async (id: string, updates: Record<string, unknown>) => {
    try {
      const userProfile = localStorage.getItem('userProfile');
      if (!userProfile) return;
      const profile = JSON.parse(userProfile);
      const partnerId = profile.id;
      if (!partnerId) return;

      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource: 'client', partner_id: partnerId, id: Number(id), updates }),
      });

      if (response.ok) {
        setShowLeadCard(false);
        await loadData();
      } else {
        alert('Ошибка обновления сделки');
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Ошибка обновления сделки');
    }
  };

  const updateStageColor = async (stageId: string, color: string, textColor: string) => {
    const newColors = { ...customColors, [stageId]: { color, textColor } };
    setCustomColors(newColors);
    const stage = statusStages.find((s) => s.id === stageId);
    if (stage?.dbId) {
      try { await crmApi.updateStage(stage.dbId, { color, text_color: textColor }); } catch { /* noop */ }
    }
  };

  const moveLead = (leadId: string, newStatus: string) => updateLeadStatus(leadId, newStatus);

  const reorderStages = async (newOrder: StageDef[]) => {
    setStatusStages(newOrder);
    const ids = newOrder.map((s) => s.dbId).filter((v): v is number => !!v);
    if (ids.length === newOrder.length) {
      try { await crmApi.reorderStages(ids); } catch { /* noop */ }
    }
  };

  const renameStage = async (stageId: string, newLabel: string) => {
    setStatusStages((prev) => prev.map((s) => (s.id === stageId ? { ...s, label: newLabel } : s)));
    const stage = statusStages.find((s) => s.id === stageId);
    if (stage?.dbId) {
      try { await crmApi.updateStage(stage.dbId, { label: newLabel }); } catch { /* noop */ }
    }
  };

  const addStage = async () => {
    const label = prompt('Название нового этапа:');
    if (!label || !label.trim()) return;
    try {
      const res = await crmApi.createStage(label.trim());
      setStatusStages((prev) => [...prev, { id: res.stage.stage_key, label: res.stage.label, dbId: res.stage.id }]);
      setCustomColors((prev) => ({ ...prev, [res.stage.stage_key]: { color: res.stage.color, textColor: res.stage.text_color } }));
    } catch (error) {
      console.error('Error adding stage:', error);
    }
  };

  const deleteStageHandler = async (stageId: string) => {
    if (!confirm('Удалить этап? Сделки на этом этапе не будут удалены, но потеряют привязку к этапу.')) return;
    const stage = statusStages.find((s) => s.id === stageId);
    setStatusStages((prev) => prev.filter((s) => s.id !== stageId));
    if (stage?.dbId) {
      try { await crmApi.deleteStage(stage.dbId); } catch { /* noop */ }
    }
  };

  const handleExport = () => {
    const labels: Record<string, string> = {};
    statusStages.forEach((s) => { labels[s.id] = s.label; });
    exportLeadsToExcel(leads, labels);
  };

  const handleImportFile = async (file: File) => {
    try {
      const rows = await importLeadsFromExcel(file);
      if (rows.length === 0) {
        alert('Не удалось найти данные для импорта. Проверьте заголовки колонок.');
        return;
      }
      await crmApi.bulkImport(rows as Record<string, unknown>[]);
      await loadData();
      alert(`Импортировано сделок: ${rows.length}`);
    } catch (error) {
      console.error('Import error:', error);
      alert('Ошибка импорта файла');
    }
  };

  const triggerImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) handleImportFile(file);
    };
    input.click();
  };

  const getConversionRate = (): string => {
    const total = leads.length;
    if (total === 0) return '0';
    const won = leads.filter(l => l.status === 'closed-won' || l.status === 'closed_won').length;
    return ((won / total) * 100).toFixed(0);
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTotalBudget = () => {
    return leads.reduce((sum, lead) => sum + (lead.deal_amount || 0), 0);
  };

  const stageLabels: Record<string, string> = {};
  statusStages.forEach((s) => { stageLabels[s.id] = s.label; });

  if (checkingCrewAuth) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
        <Icon name="Loader2" size={32} className="text-[#66FCF1] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <CRMAuth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0C10] via-[#12132a] to-[#0B0C10]" />
        <div className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#45A29E]/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#663399]/12 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[30vw] h-[30vw] rounded-full bg-[#FF6600]/5 blur-[100px]" />
      </div>
      <StarfieldBackground />
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(#66FCF1 1px, transparent 1px), linear-gradient(90deg, #66FCF1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10">
        <CRMHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCreateLead={() => openCreateLeadModal()}
          onQuickCreateLead={quickCreateLead}
          onToggleColorPicker={() => setShowColorPicker(!showColorPicker)}
          onLogout={handleLogout}
          totalLeads={leads.length}
          activeLeads={leads.filter(l => !['closed-won', 'closed-lost', 'closed_won', 'closed_lost'].includes(l.status)).length}
          conversionRate={getConversionRate()}
          totalBudget={getTotalBudget()}
          totalRevenue={revenueStats.totalRevenue}
          totalPlanned={revenueStats.totalPlanned}
          totalContracts={revenueStats.totalContracts}
          totalReceived={revenueStats.totalReceived}
          view={view}
          onChangeView={setView}
          onExport={handleExport}
          onImportClick={triggerImport}
        />

        {view === 'kanban' && statusStages.length > 0 && (
          <CRMKanban
            leads={filteredLeads}
            statusStages={statusStages}
            customColors={customColors}
            showColorPicker={showColorPicker}
            onLeadClick={openLeadCard}
            onCreateLeadInStage={openCreateLeadModal}
            onUpdateStageColor={updateStageColor}
            onMoveLead={moveLead}
            onReorderStages={reorderStages}
            onRenameStage={renameStage}
            onAddStage={addStage}
            onDeleteStage={deleteStageHandler}
          />
        )}

        {view === 'list' && (
          <CRMListView leads={filteredLeads} stageLabels={stageLabels} onLeadClick={openLeadCard} />
        )}

        {view === 'analytics' && <CRMAnalytics />}

        {view === 'bridge' && <CRMBridge />}

        <CRMLeadModal
          showLeadCard={showLeadCard}
          showCreateLead={showCreateLead}
          selectedLead={selectedLead}
          newLead={newLead}
          tasks={tasks}
          activities={activities}
          newNote={newNote}
          statusStages={statusStages}
          onCloseLeadCard={() => setShowLeadCard(false)}
          onCloseCreateLead={() => setShowCreateLead(false)}
          onDeleteLead={deleteLead}
          onUpdateLeadStatus={updateLeadStatus}
          onUpdateLead={updateLead}
          onAddNote={addNote}
          onToggleTaskComplete={toggleTaskComplete}
          onMakeCall={makeCall}
          setNewNote={setNewNote}
          setNewLead={(lead) => setNewLead(lead as typeof newLead)}
          onCreateLead={createLead}
        />
      </div>
    </div>
  );
};

export default CRM;