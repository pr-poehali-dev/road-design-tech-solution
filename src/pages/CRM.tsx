import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

interface Lead {
  id: string;
  type: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  status: 'new' | 'in-progress' | 'completed';
  createdAt: string;
  source: string;
}

const CRM = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const auth = localStorage.getItem('crm_auth');
    if (auth === 'authenticated') {
      setIsAuthenticated(true);
      loadLeads();
    }
  }, []);

  const loadLeads = () => {
    const savedLeads = localStorage.getItem('crm_leads');
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'deod2024') {
      localStorage.setItem('crm_auth', 'authenticated');
      setIsAuthenticated(true);
      loadLeads();
    } else {
      alert('Неверный пароль');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  const updateLeadStatus = (id: string, status: 'new' | 'in-progress' | 'completed') => {
    const updatedLeads = leads.map(lead => 
      lead.id === id ? { ...lead, status } : lead
    );
    setLeads(updatedLeads);
    localStorage.setItem('crm_leads', JSON.stringify(updatedLeads));
  };

  const deleteLead = (id: string) => {
    const updatedLeads = leads.filter(lead => lead.id !== id);
    setLeads(updatedLeads);
    localStorage.setItem('crm_leads', JSON.stringify(updatedLeads));
  };

  const filteredLeads = activeTab === 'all' 
    ? leads 
    : leads.filter(lead => lead.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'in-progress': return 'В работе';
      case 'completed': return 'Завершена';
      default: return status;
    }
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
            <p className="text-sm text-muted-foreground">Управление заявками</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm text-muted-foreground">Всего заявок</CardTitle>
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
                  {leads.filter(l => l.status === 'in-progress').length}
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm text-muted-foreground">Завершено</CardTitle>
                <p className="text-3xl font-bold text-green-500">
                  {leads.filter(l => l.status === 'completed').length}
                </p>
              </CardHeader>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Заявки</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="new">Новые</TabsTrigger>
                <TabsTrigger value="in-progress">В работе</TabsTrigger>
                <TabsTrigger value="completed">Завершено</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {filteredLeads.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Inbox" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Заявок пока нет</p>
                  </div>
                ) : (
                  filteredLeads.map((lead) => (
                    <Card key={lead.id} className="border-border hover:border-primary transition-all">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-xl">{lead.name}</CardTitle>
                              <Badge className={getStatusColor(lead.status)}>
                                {getStatusText(lead.status)}
                              </Badge>
                              <Badge variant="outline">{lead.type}</Badge>
                            </div>
                            <CardDescription>
                              {new Date(lead.createdAt).toLocaleString('ru-RU')} • {lead.source}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteLead(lead.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{lead.email}</p>
                          </div>
                          {lead.phone && (
                            <div>
                              <p className="text-sm text-muted-foreground">Телефон</p>
                              <p className="font-medium">{lead.phone}</p>
                            </div>
                          )}
                          {lead.company && (
                            <div>
                              <p className="text-sm text-muted-foreground">Компания</p>
                              <p className="font-medium">{lead.company}</p>
                            </div>
                          )}
                        </div>
                        {lead.message && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Сообщение</p>
                            <p className="text-sm">{lead.message}</p>
                          </div>
                        )}
                        <div className="flex gap-2 pt-3 border-t">
                          <Button
                            size="sm"
                            variant={lead.status === 'new' ? 'default' : 'outline'}
                            onClick={() => updateLeadStatus(lead.id, 'new')}
                          >
                            Новая
                          </Button>
                          <Button
                            size="sm"
                            variant={lead.status === 'in-progress' ? 'default' : 'outline'}
                            onClick={() => updateLeadStatus(lead.id, 'in-progress')}
                          >
                            В работе
                          </Button>
                          <Button
                            size="sm"
                            variant={lead.status === 'completed' ? 'default' : 'outline'}
                            onClick={() => updateLeadStatus(lead.id, 'completed')}
                          >
                            Завершена
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CRM;
