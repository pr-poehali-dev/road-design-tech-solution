import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Lead } from './CRMKanban';

export const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/2c86d047-a46f-48f8-86f6-21557b41ca9b');
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
      }
    } catch (error) {
      console.error('Failed to load leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    inProgress: leads.filter(l => ['first-contact', 'evaluation', 'proposal', 'negotiation'].includes(l.status)).length,
    won: leads.filter(l => l.status === 'closed-won').length,
    lost: leads.filter(l => l.status === 'closed-lost').length
  };

  const conversionRate = stats.total > 0 
    ? ((stats.won / (stats.won + stats.lost)) * 100).toFixed(1)
    : 0;

  const recentLeads = leads
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatDate = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffHours = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'только что';
    if (diffHours < 24) return `${diffHours}ч назад`;
    if (diffHours < 48) return 'вчера';
    return then.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего заявок</CardTitle>
            <Icon name="Users" size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.new} новых
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
            <Icon name="Clock" size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Требуют внимания
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Успешно</CardTitle>
            <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.won}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Конверсия: {conversionRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Отказы</CardTitle>
            <Icon name="XCircle" size={16} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.lost}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Проанализировать причины
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Activity" size={20} />
            Последние заявки
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Заявок пока нет
            </p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{formatDate(lead.createdAt)}</p>
                    {lead.company && (
                      <p className="text-xs text-muted-foreground mt-1">{lead.company}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="BarChart3" size={20} />
              Распределение по статусам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'Новые', count: stats.new, color: 'bg-blue-500' },
                { label: 'В работе', count: stats.inProgress, color: 'bg-yellow-500' },
                { label: 'Успешно', count: stats.won, color: 'bg-green-500' },
                { label: 'Отказ', count: stats.lost, color: 'bg-red-500' }
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Target" size={20} />
              Быстрые действия
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="#leads"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <Icon name="Users" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-sm">Все заявки</p>
                <p className="text-xs text-muted-foreground">Просмотр и фильтрация</p>
              </div>
            </a>
            <a
              href="#price"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <Icon name="FileSpreadsheet" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-sm">Прайс-лист</p>
                <p className="text-xs text-muted-foreground">Загрузить новый</p>
              </div>
            </a>
            <a
              href="/crm"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <Icon name="Kanban" size={20} className="text-primary" />
              <div>
                <p className="font-medium text-sm">Канбан-доска</p>
                <p className="text-xs text-muted-foreground">Управление воронкой</p>
              </div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
