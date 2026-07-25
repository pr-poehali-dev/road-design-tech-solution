import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { crewApi, CrewMember, ROLE_LABELS } from '@/lib/crewApi';
import { useCrewAuth } from './CrewAuthContext';
import CrewProfileModal from './CrewProfileModal';
import CrewInviteModal from './CrewInviteModal';

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
  onRequireAuth: () => void;
  onOpenChat: (memberId?: number) => void;
}

const CrewPanel = ({ open, onClose, onRequireAuth, onOpenChat }: Props) => {
  const { me, logout } = useCrewAuth();
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
    if (open && me) {
      const t = setTimeout(load, 250);
      return () => clearTimeout(t);
    }
  }, [open, me, load]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-[#0B0C10]/95 backdrop-blur-xl overflow-y-auto"
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
          {/* header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#45A29E]/15 border border-[#45A29E]/40 flex items-center justify-center">
              <Icon name="Users" size={22} className="text-[#66FCF1]" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white">Экипаж</h1>
              <p className="text-[11px] text-[#6B7684] uppercase tracking-widest">реестр персонала станции</p>
            </div>
            <button onClick={onClose} className="ml-auto text-[#6B7684] hover:text-white p-2"><Icon name="X" size={22} /></button>
          </div>

          {!me ? (
            <div className="text-center py-20">
              <Icon name="Lock" size={36} className="text-[#66FCF1] mx-auto mb-4" />
              <h2 className="font-heading font-bold text-lg text-white mb-2">Требуется авторизация</h2>
              <p className="text-[#8B98A5] mb-5">Войдите или зарегистрируйтесь, чтобы увидеть экипаж</p>
              <button onClick={onRequireAuth} className="px-6 py-2.5 rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold hover:opacity-90">
                Пристыковаться
              </button>
            </div>
          ) : (
            <>
              {/* toolbar */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center gap-2 bg-[#1F2833]/60 border border-[#45A29E]/30 rounded-lg px-3 flex-1 min-w-[200px]">
                  <Icon name="Search" size={16} className="text-[#45A29E]" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по позывному или отделу..."
                    className="flex-1 bg-transparent py-2 text-sm text-white placeholder:text-[#6B7684] focus:outline-none" />
                </div>
                {me.is_admin && (
                  <button onClick={() => setInviteOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold text-sm hover:opacity-90">
                    <Icon name="UserPlus" size={15} /> Пригласить
                  </button>
                )}
                <button onClick={logout} title="Выйти"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#FF4D4D]/30 text-[#FF9B9B] text-sm hover:bg-[#FF4D4D]/10">
                  <Icon name="LogOut" size={15} /> Выйти
                </button>
              </div>

              {/* role filter */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                <FilterChip active={role === 'all'} onClick={() => setRole('all')} label="Все" />
                {Object.entries(ROLE_LABELS).map(([k, v]) => (
                  <FilterChip key={k} active={role === k} onClick={() => setRole(k)} label={v} />
                ))}
              </div>

              {/* list */}
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
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border shrink-0" style={{ borderColor: rankColor }}>
                          {m.avatar_url ? (
                            <img src={m.avatar_url} alt={m.callsign} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#0B0C10] flex items-center justify-center"><Icon name="UserRound" size={22} className="text-[#45A29E]" /></div>
                          )}
                          {m.is_online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#45A29E] border-2 border-[#1F2833]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-white text-sm truncate">{m.callsign}</span>
                            {m.is_admin && <Icon name="ShieldCheck" size={13} className="text-[#FF6600] shrink-0" />}
                          </div>
                          <div className="text-[11px] text-[#8B98A5]">{m.role_label}{m.department ? ` · ${m.department}` : ''}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-heading font-bold" style={{ color: rankColor }}>{m.rank}</span>
                            <span className="text-[11px] font-mono text-[#66FCF1]">{m.points} оч.</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button onClick={() => setProfileId(m.id)} title="Профиль"
                            className="w-8 h-8 rounded-lg border border-[#45A29E]/30 text-[#66FCF1] hover:bg-[#45A29E]/10 flex items-center justify-center">
                            <Icon name="User" size={15} />
                          </button>
                          <button onClick={() => onOpenChat(m.id)} title="Написать"
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

        <CrewProfileModal memberId={profileId} onClose={() => setProfileId(null)} onChanged={load} />
        <CrewInviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
      </motion.div>
    </AnimatePresence>
  );
};

const FilterChip = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
  <button onClick={onClick}
    className={`text-[12px] px-3 py-1.5 rounded-lg border transition-colors ${
      active ? 'bg-[#45A29E] text-[#0B0C10] border-[#45A29E] font-bold' : 'border-[#45A29E]/25 text-[#8B98A5] hover:text-white hover:border-[#66FCF1]/50'
    }`}>
    {label}
  </button>
);

export default CrewPanel;
