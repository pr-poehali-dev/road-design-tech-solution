import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { crewApi, CrewMember, ROLE_LABELS } from '@/lib/crewApi';
import { useCrewAuth } from './CrewAuthContext';
import CrewProfileModal from './CrewProfileModal';
import CrewInviteModal from './CrewInviteModal';
import CrewOrgChart from './CrewOrgChart';

const RANK_COLORS: Record<string, string> = {
  'Курсант': '#8B98A5',
  'Младший офицер': '#45A29E',
  'Офицер': '#66FCF1',
  'Старший офицер': '#66FCF1',
  'Капитан': '#FF6600',
  'Адмирал флота': '#FF4D4D',
};

interface Props {
  open: boolean;
  onClose: () => void;
  onOpenChat: (memberId?: number) => void;
}

const CrewPanel = ({ open, onClose, onOpenChat }: Props) => {
  const { me, logout } = useCrewAuth();
  const [tab, setTab] = useState<'list' | 'org'>('list');
  const [members, setMembers] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('all');
  const [search, setSearch] = useState('');
  const [profileId, setProfileId] = useState<number | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const load = useCallback(async () => {
    if (!me) return;
    setLoading(true);
    try {
      const res = await crewApi.list(role === 'all' ? undefined : role, search || undefined);
      setMembers(res.members);
    } finally {
      setLoading(false);
    }
  }, [me, role, search]);

  useEffect(() => {
    if (open && me && tab === 'list') {
      const t = setTimeout(load, 250);
      return () => clearTimeout(t);
    }
  }, [open, me, load, tab]);

  if (!open || !me) return null;

  const myRankColor = RANK_COLORS[me.rank] || '#66FCF1';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-[#0B0C10]/95 backdrop-blur-xl overflow-y-auto"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
          {/* header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-[#45A29E]/15 border border-[#45A29E]/40 flex items-center justify-center">
              <Icon name="Users" size={22} className="text-[#66FCF1]" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white">Экипаж</h1>
              <p className="text-[11px] text-[#6B7684] uppercase tracking-widest">реестр персонала станции</p>
            </div>
            <button onClick={onClose} className="ml-auto text-[#6B7684] hover:text-white p-2"><Icon name="X" size={22} /></button>
          </div>

          {/* my status card */}
          <div className="flex items-center gap-3 rounded-xl border border-[#66FCF1]/30 bg-gradient-to-r from-[#45A29E]/10 to-transparent p-3 mb-5">
            <button onClick={() => setProfileId(me.id)} className="relative w-12 h-12 rounded-xl overflow-hidden border-2 shrink-0" style={{ borderColor: myRankColor }}>
              {me.avatar_url ? <img src={me.avatar_url} alt={me.callsign} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#0B0C10] flex items-center justify-center"><Icon name="UserRound" size={22} className="text-[#45A29E]" /></div>}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{me.callsign}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#45A29E]/15 text-[#45A29E]">это вы</span>
              </div>
              <div className="text-[11px] text-[#8B98A5]">{me.position_title || me.role_label}{me.department ? ` · ${me.department}` : ''}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-heading font-bold text-sm" style={{ color: myRankColor }}>{me.rank}</div>
              <div className="text-[11px] font-mono text-[#66FCF1]">{me.points} очков</div>
            </div>
            <button onClick={() => setProfileId(me.id)} className="ml-2 px-3 py-1.5 rounded-lg border border-[#45A29E]/30 text-[#66FCF1] text-sm hover:bg-[#45A29E]/10 shrink-0">
              Мой профиль
            </button>
          </div>

          {/* tabs + actions */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex gap-1 p-1 rounded-lg bg-[#1F2833]/60">
              <TabBtn active={tab === 'list'} onClick={() => setTab('list')} icon="List" label="Список" />
              <TabBtn active={tab === 'org'} onClick={() => setTab('org')} icon="Network" label="Оргструктура" />
            </div>
            <div className="flex-1" />
            <button onClick={() => setInviteOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold text-sm hover:opacity-90">
              <Icon name="UserPlus" size={15} /> Пригласить
            </button>
            <button onClick={logout} title="Выйти"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#FF4D4D]/30 text-[#FF9B9B] text-sm hover:bg-[#FF4D4D]/10">
              <Icon name="LogOut" size={15} /> Выйти
            </button>
          </div>

          {tab === 'org' ? (
            <CrewOrgChart onProfile={setProfileId} onWrite={(id) => { onClose(); onOpenChat(id); }} />
          ) : (
            <>
              {/* search + filter */}
              <div className="flex items-center gap-2 bg-[#1F2833]/60 border border-[#45A29E]/30 rounded-lg px-3 mb-3">
                <Icon name="Search" size={16} className="text-[#45A29E]" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по позывному или отделу..."
                  className="flex-1 bg-transparent py-2 text-sm text-white placeholder:text-[#6B7684] focus:outline-none" />
              </div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                <FilterChip active={role === 'all'} onClick={() => setRole('all')} label="Все" />
                {Object.entries(ROLE_LABELS).map(([k, v]) => (
                  <FilterChip key={k} active={role === k} onClick={() => setRole(k)} label={v} />
                ))}
              </div>

              {loading ? (
                <div className="py-16 text-center"><Icon name="Loader2" size={28} className="animate-spin text-[#66FCF1] mx-auto" /></div>
              ) : members.length === 0 ? (
                <div className="py-16 text-center text-[#6B7684]">Никого не найдено</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {members.map((m, i) => {
                    const rankColor = RANK_COLORS[m.rank] || '#66FCF1';
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 rounded-xl border border-[#45A29E]/20 bg-[#1F2833]/40 p-3 hover:border-[#66FCF1]/50 transition-colors"
                      >
                        <button onClick={() => setProfileId(m.id)} className="relative w-12 h-12 rounded-xl overflow-hidden border shrink-0" style={{ borderColor: rankColor }}>
                          {m.avatar_url ? (
                            <img src={m.avatar_url} alt={m.callsign} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#0B0C10] flex items-center justify-center"><Icon name="UserRound" size={22} className="text-[#45A29E]" /></div>
                          )}
                          {m.is_online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#45A29E] border-2 border-[#1F2833]" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-white text-sm truncate">{m.callsign}</span>
                            {m.is_admin && <Icon name="ShieldCheck" size={13} className="text-[#FF6600] shrink-0" />}
                          </div>
                          <div className="text-[11px] text-[#8B98A5] truncate">{m.position_title || m.role_label}{m.department ? ` · ${m.department}` : ''}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-heading font-bold" style={{ color: rankColor }}>{m.rank}</span>
                            <span className="text-[11px] font-mono text-[#66FCF1]">{m.points} оч.</span>
                            <span className={`text-[10px] ${m.is_online ? 'text-[#45A29E]' : 'text-[#6B7684]'}`}>{m.is_online ? 'онлайн' : 'офлайн'}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button onClick={() => setProfileId(m.id)} title="Профиль"
                            className="w-8 h-8 rounded-lg border border-[#45A29E]/30 text-[#66FCF1] hover:bg-[#45A29E]/10 flex items-center justify-center">
                            <Icon name="User" size={15} />
                          </button>
                          <button onClick={() => { onClose(); onOpenChat(m.id); }} title="Написать"
                            className="w-8 h-8 rounded-lg border border-[#45A29E]/30 text-[#66FCF1] hover:bg-[#45A29E]/10 flex items-center justify-center">
                            <Icon name="MessageSquare" size={15} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        <CrewProfileModal memberId={profileId} onClose={() => setProfileId(null)} onChanged={load} onWrite={(id) => { onClose(); onOpenChat(id); }} />
        <CrewInviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
      </motion.div>
    </AnimatePresence>
  );
};

const TabBtn = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) => (
  <button onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${active ? 'bg-[#45A29E] text-[#0B0C10]' : 'text-[#8B98A5] hover:text-white'}`}>
    <Icon name={icon as any} size={15} /> {label}
  </button>
);

const FilterChip = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
  <button onClick={onClick}
    className={`text-[12px] px-3 py-1.5 rounded-lg border transition-colors ${
      active ? 'bg-[#45A29E] text-[#0B0C10] border-[#45A29E] font-bold' : 'border-[#45A29E]/25 text-[#8B98A5] hover:text-white hover:border-[#66FCF1]/50'
    }`}>
    {label}
  </button>
);

export default CrewPanel;
