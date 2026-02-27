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

  const exportRoadmapToWord = (roadmap: Record<string, unknown>, projectName: string) => {
    type Phase = { id: number; name: string; duration: string; tasks: string[]; deliverables: string[]; responsible: string };
    type Milestone = { month: number; week?: number; name: string; criteria: string };
    type Risk = { risk: string; probability: string; impact: string; mitigation: string };

    const phases = (roadmap.phases as Phase[] | undefined) || [];
    const milestones = (roadmap.milestones as Milestone[] | undefined) || [];
    const risks = (roadmap.risks as Risk[] | undefined) || [];

    const phasesHtml = phases.map(p => `
      <tr>
        <td style="padding:6px 10px;border:1px solid #ddd;font-weight:bold">${p.id}. ${p.name}</td>
        <td style="padding:6px 10px;border:1px solid #ddd;text-align:center">${p.duration}</td>
        <td style="padding:6px 10px;border:1px solid #ddd">${(p.tasks || []).map(t => `• ${t}`).join('<br/>')}</td>
        <td style="padding:6px 10px;border:1px solid #ddd">${(p.deliverables || []).map(d => `• ${d}`).join('<br/>')}</td>
        <td style="padding:6px 10px;border:1px solid #ddd;color:#555">${p.responsible || ''}</td>
      </tr>`).join('');

    const milestonesHtml = milestones.map(m => `
      <tr>
        <td style="padding:6px 10px;border:1px solid #ddd;text-align:center">Мес. ${m.month ?? m.week ?? ''}</td>
        <td style="padding:6px 10px;border:1px solid #ddd;font-weight:bold">${m.name}</td>
        <td style="padding:6px 10px;border:1px solid #ddd;color:#555">${m.criteria}</td>
      </tr>`).join('');

    const risksHtml = risks.map(r => `
      <tr>
        <td style="padding:6px 10px;border:1px solid #ddd">${r.risk}</td>
        <td style="padding:6px 10px;border:1px solid #ddd;text-align:center">${r.probability}</td>
        <td style="padding:6px 10px;border:1px solid #ddd;text-align:center">${r.impact}</td>
        <td style="padding:6px 10px;border:1px solid #ddd;color:#555">${r.mitigation}</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
      <style>body{font-family:"Times New Roman",serif;font-size:12pt;color:#1a1a1a;margin:40px}
      h1{font-size:18pt;color:#1e3a5f;margin:0 0 8px} h2{font-size:14pt;color:#1e3a5f;margin:20px 0 8px}
      table{width:100%;border-collapse:collapse;margin:8px 0}
      th{background:#1e3a5f;color:white;padding:8px 10px;border:1px solid #1e3a5f;text-align:left;font-size:11pt}
      p{line-height:1.6}</style>
    </head><body>
      <h1>Дорожная карта ПИР</h1>
      <h3 style="font-weight:normal;color:#333;margin:0 0 4px">${projectName}</h3>
      <p style="color:#666;font-size:10pt">Общая продолжительность: ${roadmap.total_duration || ''} · Дата: ${new Date().toLocaleDateString('ru-RU')}</p>
      <p style="border-left:3px solid #1e3a5f;padding-left:12px;color:#444;margin:16px 0">${roadmap.overview || ''}</p>
      ${phases.length ? `<h2>Этапы реализации</h2>
      <table><thead><tr>
        <th>Этап</th><th style="width:100px">Срок</th><th>Задачи</th><th>Результаты</th><th>Ответственный</th>
      </tr></thead><tbody>${phasesHtml}</tbody></table>` : ''}
      ${milestones.length ? `<h2>Ключевые вехи</h2>
      <table><thead><tr><th style="width:80px">Месяц</th><th>Веха</th><th>Критерии приёмки</th></tr></thead><tbody>${milestonesHtml}</tbody></table>` : ''}
      ${risks.length ? `<h2>Риски и митигация</h2>
      <table><thead><tr><th>Риск</th><th style="width:100px">Вероятность</th><th style="width:100px">Влияние</th><th>Митигация</th></tr></thead><tbody>${risksHtml}</tbody></table>` : ''}
    </body></html>`;

    const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Дорожная_карта_${projectName.slice(0, 30).replace(/[^а-яёА-ЯЁa-zA-Z0-9]/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportRoadmapToPDF = (roadmap: Record<string, unknown>, projectName: string) => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
      <style>@page{margin:2cm}body{font-family:"Times New Roman",serif;font-size:11pt}
      h1{font-size:16pt;color:#1e3a5f}h2{font-size:13pt;color:#1e3a5f;border-bottom:1px solid #ccc;padding-bottom:4px}
      table{width:100%;border-collapse:collapse}th{background:#1e3a5f;color:white;padding:6px;text-align:left;font-size:10pt}
      td{padding:5px 8px;border:1px solid #ddd;font-size:10pt}</style>
    </head><body>
      <h1>Дорожная карта ПИР: ${projectName}</h1>
      <p style="color:#666">Продолжительность: ${roadmap.total_duration} · ${new Date().toLocaleDateString('ru-RU')}</p>
      <p style="border-left:3px solid #1e3a5f;padding-left:10px;color:#444">${roadmap.overview || ''}</p>
    </body></html>`;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
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
                <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4">
                  {/* Резюме КП */}
                  {(detail.kp_data as { summary?: string }).summary && (
                    <p className="text-xs text-slate-400 leading-relaxed">{(detail.kp_data as { summary?: string }).summary}</p>
                  )}

                  {/* Дорожная карта */}
                  {detail.roadmap_data && (() => {
                    const rm = detail.roadmap_data as Record<string, unknown>;
                    type Phase = { id: number; name: string; duration: string; deliverables: string[] };
                    type Milestone = { month?: number; week?: number; name: string };
                    const phases = (rm.phases as Phase[] | undefined) || [];
                    const milestones = (rm.milestones as Milestone[] | undefined) || [];
                    return (
                      <div className="bg-cyan-500/10 rounded-lg border border-cyan-500/20 overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-500/20">
                          <div>
                            <span className="text-xs text-cyan-400 font-semibold">Дорожная карта ПИР</span>
                            {rm.total_duration && <span className="text-xs text-slate-400 ml-2">· {rm.total_duration as string}</span>}
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => exportRoadmapToPDF(rm, item.title)}
                              className="text-xs text-orange-400 hover:text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded transition-colors"
                            >PDF</button>
                            <button
                              onClick={() => exportRoadmapToWord(rm, item.title)}
                              className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded transition-colors"
                            >Word</button>
                          </div>
                        </div>
                        {rm.overview && (
                          <p className="text-xs text-slate-300 px-3 py-2 border-b border-cyan-500/10">{rm.overview as string}</p>
                        )}
                        {phases.length > 0 && (
                          <div className="px-3 py-2 space-y-2">
                            {phases.map(p => (
                              <div key={p.id} className="flex gap-2 items-start text-xs">
                                <span className="bg-cyan-600/30 text-cyan-300 rounded px-1.5 py-0.5 shrink-0 font-medium">{p.id}</span>
                                <div className="flex-1">
                                  <span className="text-white font-medium">{p.name}</span>
                                  <span className="text-slate-500 ml-1">· {p.duration}</span>
                                  {p.deliverables?.length > 0 && (
                                    <p className="text-slate-400 mt-0.5">{p.deliverables.join(' · ')}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {milestones.length > 0 && (
                          <div className="px-3 py-2 border-t border-cyan-500/10 flex flex-wrap gap-2">
                            {milestones.map((m, i) => (
                              <span key={i} className="text-xs bg-slate-700/50 text-slate-300 rounded px-2 py-0.5">
                                Мес. {m.month ?? m.week} — {m.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
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