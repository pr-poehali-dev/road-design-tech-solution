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

const Admin = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('crm_auth') === 'authenticated';
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showProjectCard, setShowProjectCard] = useState(false);

  const handleLogin = () => {
    localStorage.setItem('crm_auth', 'authenticated');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_auth');
    setIsAuthenticated(false);
  };

  const handleOpenProject = (lead: Lead) => {
    setSelectedLead(lead);
    setShowProjectCard(true);
  };

  const handleGenerateSpec = async (data: any) => {
    toast({
      title: 'Генерация ТЗ...',
      description: 'YandexGPT создаёт техническое задание'
    });
    // TODO: Вызов backend для генерации ТЗ
  };

  const handleGenerateProposal = async (data: any) => {
    toast({
      title: 'Генерация КП...',
      description: 'YandexGPT создаёт коммерческое предложение'
    });
    // TODO: Вызов backend для генерации КП
  };

  if (!isAuthenticated) {
    return <CRMAuth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Icon name="Rocket" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">DEAD SPACE</h1>
                <p className="text-sm text-muted-foreground">Админ-панель</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => window.location.href = '/crm'}>
                <Icon name="Kanban" size={16} className="mr-2" />
                Канбан
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto">
            <TabsTrigger value="dashboard">
              <Icon name="LayoutDashboard" size={16} className="mr-2" />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="leads">
              <Icon name="Users" size={16} className="mr-2" />
              Заявки
            </TabsTrigger>
            <TabsTrigger value="production">
              <Icon name="FileText" size={16} className="mr-2" />
              Производство
            </TabsTrigger>
            <TabsTrigger value="client">
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Клиенты
            </TabsTrigger>
            <TabsTrigger value="partners">
              <Icon name="Handshake" size={16} className="mr-2" />
              Партнёры
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="price">
              <Icon name="DollarSign" size={16} className="mr-2" />
              Прайс
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <LeadsTable onOpenProject={handleOpenProject} />
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