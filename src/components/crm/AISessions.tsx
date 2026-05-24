import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import func2url from '../../../backend/func2url.json';

const API_URL = func2url['generate-kp'];

interface Session {
  id: string;
  title: string;
  mode: 'kp' | 'roadmap';
  company_name: string;
  has_kp: boolean;
  has_roadmap: boolean;
  created_at: string;
  updated_at: string;
}

interface AISessions {
  onLoadSession: (session: {
    id: string;
    mode: 'kp' | 'roadmap';
    company_id: string;
    messages: { role: 'user' | 'assistant'; content: string }[];
    kp_json: unknown;
    roadmap_json: unknown;
  }) => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AISessions({ onLoadSession }: AISessions) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list_sessions' }),
      });
      const data = await resp.json();
      setSessions(data.sessions || []);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  const handleLoad = async (id: string) => {
    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'load_session', session_id: id }),
      });
      const data = await resp.json();
      onLoadSession(data);
    } catch (e) { void e; }
  };

  const handleArchive = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive_session', session_id: id }),
      });
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch (e) { void e; }
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-500">
        <Icon name="Loader2" size={20} className="animate-spin mr-2" />
        Загружаю сохранённые...
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
          <Icon name="Archive" size={28} className="text-slate-600" />
        </div>
        <p className="text-slate-500 text-sm font-medium">Нет сохранённых сессий</p>
        <p className="text-slate-600 text-xs">Сформируй КП или дорожную карту — они сохраняются автоматически</p>
      </div>
    );
  }

  const kpSessions = sessions.filter(s => s.has_kp || s.mode === 'kp');
  const rmSessions = sessions.filter(s => s.has_roadmap || s.mode === 'roadmap');

  const SessionCard = ({ s }: { s: Session }) => (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 overflow-hidden hover:border-slate-600 transition-colors">
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full shrink-0 ${s.has_kp ? 'bg-cyan-500' : 'bg-violet-500'}`} />
            <p className="text-sm font-semibold text-white truncate">{s.title}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {s.company_name && (
              <span className="text-[10px] text-slate-400">{s.company_name}</span>
            )}
            {s.has_kp && (
              <Badge className="text-[9px] h-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">КП</Badge>
            )}
            {s.has_roadmap && (
              <Badge className="text-[9px] h-4 bg-violet-500/20 text-violet-400 border-violet-500/30">Дорожная карта</Badge>
            )}
            <span className="text-[10px] text-slate-600">{formatDate(s.updated_at)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            onClick={() => handleLoad(s.id)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white h-7 px-3 text-xs gap-1"
          >
            <Icon name="FolderOpen" size={12} />
            Открыть
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleArchive(s.id)}
            disabled={deletingId === s.id}
            className="text-slate-600 hover:text-red-400 h-7 px-2"
          >
            {deletingId === s.id
              ? <Icon name="Loader2" size={13} className="animate-spin" />
              : <Icon name="Trash2" size={13} />
            }
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Сохранённые сессии</h3>
          <p className="text-xs text-slate-500 mt-0.5">Все КП и дорожные карты сохраняются автоматически</p>
        </div>
        <Button variant="ghost" size="sm" onClick={loadSessions} className="text-slate-400 hover:text-white h-7">
          <Icon name="RefreshCw" size={13} className="mr-1" />
          Обновить
        </Button>
      </div>

      {kpSessions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="FileText" size={13} className="text-cyan-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Коммерческие предложения ({kpSessions.length})</span>
          </div>
          <div className="space-y-2">
            {kpSessions.map(s => <SessionCard key={s.id} s={s} />)}
          </div>
        </div>
      )}

      {rmSessions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Map" size={13} className="text-violet-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Дорожные карты ({rmSessions.length})</span>
          </div>
          <div className="space-y-2">
            {rmSessions.map(s => <SessionCard key={s.id} s={s} />)}
          </div>
        </div>
      )}
    </div>
  );
}