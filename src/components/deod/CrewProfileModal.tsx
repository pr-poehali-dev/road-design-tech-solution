import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { crewApi, CrewMember, ROLE_LABELS } from '@/lib/crewApi';
import { useCrewAuth } from './CrewAuthContext';

const RANK_COLORS: Record<string, string> = {
  'Курсант': '#8B98A5',
  'Младший офицер': '#45A29E',
  'Офицер': '#66FCF1',
  'Старший офицер': '#66FCF1',
  'Капитан': '#FF6600',
  'Адмирал флота': '#FF4D4D',
};

interface Props {
  memberId: number | null;
  onClose: () => void;
  onChanged: () => void;
}

const CrewProfileModal = ({ memberId, onClose, onChanged }: Props) => {
  const { me } = useCrewAuth();
  const [tab, setTab] = useState<'general' | 'achievements' | 'history' | 'settings'>('general');
  const [member, setMember] = useState<CrewMember | null>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // edit fields
  const [callsign, setCallsign] = useState('');
  const [motto, setMotto] = useState('');
  const [suit, setSuit] = useState('');
  const [avatar, setAvatar] = useState('');
  const [department, setDepartment] = useState('');
  const [saving, setSaving] = useState(false);

  // admin points
  const [delta, setDelta] = useState('');
  const [reason, setReason] = useState('');

  const isSelf = me && member && me.id === member.id;
  const canEdit = isSelf;

  const load = async () => {
    if (!memberId) return;
    setLoading(true);
    try {
      const res = await crewApi.profile(memberId);
      setMember(res.member);
      setAchievements(res.achievements || []);
      setCallsign(res.member.callsign || '');
      setMotto(res.member.motto || '');
      setSuit(res.member.suit_status || '');
      setAvatar(res.member.avatar_url || '');
      setDepartment(res.member.department || '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (memberId) { setTab('general'); load(); }
  }, [memberId]);

  useEffect(() => {
    if (tab === 'history' && memberId) {
      crewApi.pointsHistory(memberId).then((r) => setHistory(r.history)).catch(() => {});
    }
  }, [tab, memberId]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await crewApi.updateProfile({ callsign, motto, suit_status: suit, avatar_url: avatar, department });
      await load();
      onChanged();
    } finally {
      setSaving(false);
    }
  };

  const applyPoints = async () => {
    if (!member || !delta || !reason.trim()) return;
    await crewApi.addPoints(member.id, parseInt(delta), reason.trim());
    setDelta(''); setReason('');
    await load();
    onChanged();
  };

  const setRole = async (role: string) => {
    if (!member) return;
    await crewApi.setRole(member.id, role);
    await load();
    onChanged();
  };

  const rankColor = member ? (RANK_COLORS[member.rank] || '#66FCF1') : '#66FCF1';

  return (
    <AnimatePresence>
      {memberId && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl border border-[#45A29E]/40 bg-[#0B0C10]/95 backdrop-blur-xl shadow-[0_0_50px_rgba(69,162,158,0.2)]"
          >
            {loading || !member ? (
              <div className="p-16 text-center text-[#8B98A5]">
                <Icon name="Loader2" size={28} className="animate-spin mx-auto text-[#66FCF1]" />
              </div>
            ) : (
              <>
                {/* header */}
                <div className="relative p-5 border-b border-[#45A29E]/20 bg-gradient-to-br from-[#45A29E]/10 to-transparent">
                  <button onClick={onClose} className="absolute top-4 right-4 text-[#6B7684] hover:text-white"><Icon name="X" size={20} /></button>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0" style={{ borderColor: rankColor }}>
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt={member.callsign} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#1F2833] flex items-center justify-center">
                          <Icon name="UserRound" size={32} className="text-[#45A29E]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-heading font-bold text-xl text-white truncate">{member.callsign}</h2>
                        {member.is_admin && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#FF6600]/20 text-[#FF6600] border border-[#FF6600]/40 uppercase font-bold">Админ</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <span className="text-[#45A29E]">{member.role_label}</span>
                        {member.department && <span className="text-[#6B7684]">· {member.department}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-heading font-bold text-lg" style={{ color: rankColor }}>{member.rank}</span>
                        <span className="font-mono text-[#66FCF1] font-bold">{member.points} очков</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* tabs */}
                <div className="flex border-b border-[#45A29E]/20 px-3">
                  {([
                    ['general', 'Общее'],
                    ['achievements', 'Достижения'],
                    ['history', 'История баллов'],
                    ...(canEdit ? [['settings', 'Настройки']] : []),
                  ] as [string, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setTab(key as any)}
                      className={`px-3 py-2.5 text-sm font-medium transition-colors ${
                        tab === key ? 'text-[#66FCF1] border-b-2 border-[#66FCF1]' : 'text-[#8B98A5] hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* content */}
                <div className="flex-1 overflow-y-auto p-5">
                  {tab === 'general' && (
                    <div className="space-y-4">
                      {member.motto && (
                        <div className="rounded-xl border border-[#45A29E]/20 bg-[#1F2833]/40 p-3">
                          <div className="text-[10px] uppercase tracking-widest text-[#6B7684] mb-1">Девиз</div>
                          <div className="text-white italic">«{member.motto}»</div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <InfoCard icon="Shield" label="Звание" value={member.rank} />
                        <InfoCard icon="Star" label="Очки" value={String(member.points)} />
                        <InfoCard icon="Briefcase" label="Роль" value={member.role_label} />
                        <InfoCard icon="Radio" label="Статус скафандра" value={member.suit_status || '—'} />
                      </div>

                      {me?.is_admin && !isSelf && (
                        <div className="rounded-xl border border-[#FF6600]/25 bg-[#FF6600]/5 p-3 space-y-3">
                          <div className="text-[11px] uppercase tracking-widest text-[#FF6600] font-bold flex items-center gap-1.5">
                            <Icon name="Settings" size={13} /> Администрирование
                          </div>
                          <div className="flex gap-2">
                            <input value={delta} onChange={(e) => setDelta(e.target.value)} type="number" placeholder="±баллы"
                              className="w-24 bg-[#1F2833]/70 border border-[#45A29E]/30 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[#66FCF1]/60" />
                            <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Причина"
                              className="flex-1 bg-[#1F2833]/70 border border-[#45A29E]/30 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[#66FCF1]/60" />
                            <button onClick={applyPoints} className="px-3 rounded-lg bg-[#FF6600] text-[#0B0C10] font-bold text-sm hover:opacity-90">ОК</button>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] text-[#8B98A5]">Роль:</span>
                            {Object.entries(ROLE_LABELS).map(([k, v]) => (
                              <button key={k} onClick={() => setRole(k)}
                                className={`text-[11px] px-2 py-1 rounded-md border ${member.role === k ? 'bg-[#45A29E] text-[#0B0C10] border-[#45A29E]' : 'border-[#45A29E]/30 text-[#8B98A5] hover:text-white'}`}>
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {tab === 'achievements' && (
                    <div className="space-y-2">
                      {achievements.length === 0 && <div className="text-center text-[#6B7684] text-sm py-8">Достижений пока нет</div>}
                      {achievements.map((a) => (
                        <div key={a.id} className="flex items-center gap-3 rounded-xl border border-[#45A29E]/20 bg-[#1F2833]/40 p-3">
                          <Icon name={a.icon || 'Award'} size={20} className="text-[#FF6600]" />
                          <span className="text-white text-sm">{a.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab === 'history' && (
                    <div className="space-y-2">
                      {history.length === 0 && <div className="text-center text-[#6B7684] text-sm py-8">История пуста</div>}
                      {history.map((h) => (
                        <div key={h.id} className="flex items-center gap-3 rounded-lg border border-[#45A29E]/15 bg-[#1F2833]/30 px-3 py-2">
                          <span className={`font-mono font-bold text-sm w-14 ${h.delta >= 0 ? 'text-[#45A29E]' : 'text-[#FF4D4D]'}`}>
                            {h.delta >= 0 ? '+' : ''}{h.delta}
                          </span>
                          <span className="flex-1 text-sm text-[#C5C6C7]">{h.reason}</span>
                          <span className="text-[10px] text-[#6B7684]">{new Date(h.created_at).toLocaleDateString('ru-RU')}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab === 'settings' && canEdit && (
                    <div className="space-y-3">
                      <EditField label="Позывной" value={callsign} onChange={setCallsign} />
                      <EditField label="Отдел / сектор" value={department} onChange={setDepartment} />
                      <EditField label="Девиз" value={motto} onChange={setMotto} />
                      <EditField label="Статус скафандра" value={suit} onChange={setSuit} />
                      <EditField label="Ссылка на аватар" value={avatar} onChange={setAvatar} placeholder="https://..." />
                      <button onClick={saveProfile} disabled={saving}
                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#45A29E] to-[#66FCF1] text-[#0B0C10] font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                        {saving ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="Save" size={16} />}
                        Сохранить профиль
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InfoCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="rounded-xl border border-[#45A29E]/20 bg-[#1F2833]/40 p-3">
    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#6B7684] mb-1">
      <Icon name={icon as any} size={12} /> {label}
    </div>
    <div className="text-white font-medium text-sm truncate">{value}</div>
  </div>
);

const EditField = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div>
    <label className="text-[11px] text-[#8B98A5] mb-1 block">{label}</label>
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-[#1F2833]/70 border border-[#45A29E]/30 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#6B7684] focus:outline-none focus:border-[#66FCF1]/60" />
  </div>
);

export default CrewProfileModal;
