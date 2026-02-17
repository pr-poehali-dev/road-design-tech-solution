import { useState } from 'react';
import { CRMAuth } from '@/components/crm/CRMAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Dashboard } from '@/components/crm/Dashboard';
import { LeadsTable } from '@/components/crm/LeadsTable';
import { PriceListUpload } from '@/components/crm/PriceListUpload';
import { ProjectCard } from '@/components/crm/ProjectCard';
import { ProductionModule } from '@/components/crm/ProductionModule';
import { ClientPortal } from '@/components/crm/ClientPortal';
import { PartnerModule } from '@/components/crm/PartnerModule';
import { Analytics } from '@/components/crm/Analytics';
import { Lead } from '@/components/crm/CRMKanban';
import { useToast } from '@/hooks/use-toast';
import { WarehouseDesigner } from '@/components/crm/WarehouseDesigner';

const Admin = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      try { return !!JSON.parse(profile).id; } catch { return false; }
    }
    return false;
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showProjectCard, setShowProjectCard] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    toast({ title: 'Добро пожаловать', description: 'Вход выполнен успешно' });
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('userProfile');
    setIsAuthenticated(false);
  };

  const handleOpenProject = (lead: Lead) => {
    setSelectedLead(lead);
    setShowProjectCard(true);
  };

  const handleSelectLeadForWork = (lead: Lead) => {
    setSelectedLead(lead);
    setActiveTab('production');
  };

  const handleGenerateSpec = async (data: Record<string, unknown>) => {
    toast({
      title: 'Генерация ТЗ...',
      description: 'YandexGPT создаёт техническое задание'
    });
    // TODO: Вызов backend для генерации ТЗ
  };

  const handleGenerateProposal = async (data: Record<string, unknown>) => {
    toast({
      title: 'Генерация КП...',
      description: 'YandexGPT создаёт коммерческое предложение'
    });
    // TODO: Вызов backend для генерации КП
  };



  if (!isAuthenticated) {
    return (
      <CRMAuth
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <header className="border-b border-cyan-500/30 bg-slate-900/80 backdrop-blur-lg shadow-[0_0_30px_rgba(6,182,212,0.3)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-pulse">
                <Icon name="Rocket" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">DEAD SPACE</h1>
                <p className="text-sm text-cyan-400/70">Админ-панель</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/crm'}
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all"
              >
                <Icon name="Kanban" size={16} className="mr-2" />
                Канбан
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-violet-500/50 text-violet-400 hover:bg-violet-500/10 hover:border-violet-400 transition-all"
              >
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 lg:w-auto bg-slate-900/50 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Icon name="LayoutDashboard" size={16} className="mr-2" />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Icon name="Users" size={16} className="mr-2" />
              Заявки
            </TabsTrigger>
            <TabsTrigger value="production" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Icon name="FileText" size={16} className="mr-2" />
              Производство
            </TabsTrigger>
            <TabsTrigger value="client" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Клиенты
            </TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Icon name="Handshake" size={16} className="mr-2" />
              Партнёры
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="price" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Icon name="DollarSign" size={16} className="mr-2" />
              Прайс
            </TabsTrigger>
            <TabsTrigger value="warehouses" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Icon name="Warehouse" size={16} className="mr-2" />
              Склады
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <LeadsTable onOpenProject={handleSelectLeadForWork} />
          </TabsContent>

          <TabsContent value="production" className="space-y-6">
            <ProductionModule lead={selectedLead} />
          </TabsContent>

          <TabsContent value="client" className="space-y-6">
            <ClientPortal lead={selectedLead} />
          </TabsContent>

          <TabsContent value="partners" className="space-y-6">
            <PartnerModule />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Analytics />
          </TabsContent>

          <TabsContent value="price" className="space-y-6">
            <PriceListUpload />
          </TabsContent>

          <TabsContent value="warehouses" className="space-y-6">
            <WarehouseDesigner />
          </TabsContent>
        </Tabs>
      </main>

      <ProjectCard
        lead={selectedLead}
        open={showProjectCard}
        onClose={() => {
          setShowProjectCard(false);
          setSelectedLead(null);
        }}
        onGenerateSpec={handleGenerateSpec}
        onGenerateProposal={handleGenerateProposal}
      />
    </div>
  );
};

export default Admin;