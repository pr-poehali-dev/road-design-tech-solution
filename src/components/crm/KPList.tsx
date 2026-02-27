import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const KP_STORAGE_URL = 'https://functions.poehali.dev/0af926d6-1696-45cc-acd3-a20ae910f578';

const formatMoney = (n: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);

interface KPListItem {
  id: string;
  title: string;
  client: string;
  total_sum: number;
  status: string;
  sent_to_production: boolean;
  created_at: string;
  roadmap_id: string | null;
  roadmap_name: string | null;
  roadmap_duration: string | null;
}

interface KPDetail {
  kp_data: Record<string, unknown>;
  roadmap_data: Record<string, unknown> | null;
  files_text: string;
  extra_prompt: string;
}

interface KPListProps {
  onOpenKP?: (kpData: Record<string, unknown>, roadmapData: Record<string, unknown> | null, filesText: string, kpId: string) => void;
  onSendToProduction?: (kpData: Record<string, unknown>, roadmapData: Record<string, unknown> | null, filesText: string, kpId: string) => void;
}

const statusLabel: Record<string, { label: string; cls: string }> = {
  active: { label: 'Активно', cls: 'bg-slate-700 text-slate-300' },
  in_production: { label: 'В производстве', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
};

export const KPList = ({ onOpenKP, onSendToProduction }: KPListProps) => {
  const { toast } = useToast();
  const [list, setList] = useState<KPListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<KPDetail | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(KP_STORAGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list_kp' }),
      });
      const data = await res.json();
      setList(data.kp_list || []);
    } catch {
      toast({ title: 'Ошибка загрузки списка КП', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleOpen = async (id: string) => {
    if (expandedId === id) { setExpandedId(null); setDetail(null); return; }
    setOpeningId(id);
    try {
      const res = await fetch(KP_STORAGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_kp', kp_id: id }),
      });
      const data = await res.json();
      setDetail(data);
      setExpandedId(id);
      onOpenKP?.(data.kp_data, data.roadmap_data, data.files_text, id);
    } catch {
      toast({ title: 'Не удалось открыть КП', variant: 'destructive' });
    } finally {
      setOpeningId(null);
    }
  };

  const handleSendToProduction = async (item: KPListItem) => {
    setSendingId(item.id);
    try {
      const res = await fetch(KP_STORAGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_kp', kp_id: item.id }),
      });
      const data = await res.json();
      await fetch(KP_STORAGE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_to_production', kp_id: item.id }),
      });
      onSendToProduction?.(data.kp_data, data.roadmap_data, data.files_text, item.id);
      setList(prev => prev.map(k => k.id === item.id ? { ...k, sent_to_production: true, status: 'in_production' } : k));
      toast({ title: 'Передано в производство', description: item.title });
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    } finally {
      setSendingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400">
        <Icon name="Loader2" size={24} className="animate-spin mr-2" />
        Загружаю список КП...
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Icon name="FileText" size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">Нет сохранённых КП</p>
        <p className="text-xs mt-1">Сгенерируйте первое КП в разделе выше</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Icon name="Archive" size={16} className="text-violet-400" />
          Все КП ({list.length})
        </h3>
        <button onClick={load} className="text-slate-500 hover:text-slate-300 transition-colors">
          <Icon name="RefreshCw" size={14} />
        </button>
      </div>

      {list.map(item => {
        const st = statusLabel[item.status] || statusLabel.active;
        const isExpanded = expandedId === item.id;

        return (
          <Card key={item.id} className="bg-slate-900/60 border-slate-700/40 hover:border-slate-600/60 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="FileText" size={16} className="text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white truncate">{item.title}</span>
                    <Badge className={`text-xs border ${st.cls}`}>{st.label}</Badge>
                    {item.roadmap_id && (
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">+ Дорожная карта</Badge>
                    )}
                  </div>
                  {item.client && <p className="text-xs text-slate-400 mt-0.5">{item.client}</p>}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-bold text-white">{formatMoney(item.total_sum)}</span>
                    <span className="text-xs text-slate-500">
                      {new Date(item.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpen(item.id)}
                    disabled={openingId === item.id}
                    className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50 text-xs h-7 px-2"
                  >
                    {openingId === item.id ? <Icon name="Loader2" size={12} className="animate-spin" /> : <Icon name={isExpanded ? 'ChevronUp' : 'Eye'} size={12} />}
                    <span className="ml-1">{isExpanded ? 'Свернуть' : 'Открыть'}</span>
                  </Button>
                  {!item.sent_to_production && onSendToProduction && (
                    <Button
                      size="sm"
                      onClick={() => handleSendToProduction(item)}
                      disabled={sendingId === item.id}
                      className="bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs h-7 px-2"
                    >
                      {sendingId === item.id ? <Icon name="Loader2" size={12} className="animate-spin" /> : <Icon name="Factory" size={12} />}
                      <span className="ml-1">В произв.</span>
                    </Button>
                  )}
                </div>
              </div>

              {isExpanded && detail && expandedId === item.id && (
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className="space-y-2">
                    <p className="text-xs text-slate-400">{(detail.kp_data as { summary?: string }).summary}</p>
                    {detail.roadmap_data && (
                      <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20">
                        <p className="text-xs text-cyan-400 font-medium">
                          Дорожная карта: {(detail.roadmap_data as { total_duration?: string }).total_duration}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {(detail.roadmap_data as { overview?: string }).overview?.slice(0, 200)}...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default KPList;
