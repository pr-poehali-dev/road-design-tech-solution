import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Lead } from './CRMKanban';

interface LeadsTableProps {
  onOpenProject: (lead: Lead) => void;
}

export const LeadsTable = ({ onOpenProject }: LeadsTableProps) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const statusLabels: Record<string, string> = {
    'new': 'Новый',
    'first-contact': 'Первый контакт',
    'evaluation': 'Квалификация',
    'proposal': 'КП',
    'negotiation': 'Переговоры',
    'closed-won': 'Успешно',
    'closed-lost': 'Отказ'
  };

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

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !search || 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.company?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Icon name="Loader2" size={32} className="animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Users" size={24} />
          Все заявки ({filteredLeads.length})
        </CardTitle>
        
        <div className="flex gap-3 mt-4">
          <div className="flex-1">
            <Input
              placeholder="Поиск по имени, email, компании..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={loadLeads} variant="outline">
            <Icon name="RefreshCw" size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="Inbox" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Заявок не найдено</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Компания</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                        {lead.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      {lead.phone ? (
                        <a href={`tel:${lead.phone}`} className="hover:underline">
                          {lead.phone}
                        </a>
                      ) : '—'}
                    </TableCell>
                    <TableCell>{lead.company || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {statusLabels[lead.status] || lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(lead.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => onOpenProject(lead)}
                        disabled={lead.status === 'closed-won' || lead.status === 'closed-lost'}
                      >
                        <Icon name="Folder" size={14} className="mr-1" />
                        Открыть
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};