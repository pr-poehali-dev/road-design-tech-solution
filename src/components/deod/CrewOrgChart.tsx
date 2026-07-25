import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { crewApi, CrewMember } from '@/lib/crewApi';

const RANK_COLORS: Record<string, string> = {
  'Курсант': '#8B98A5', 'Младший офицер': '#45A29E', 'Офицер': '#66FCF1',
  'Старший офицер': '#66FCF1', 'Капитан': '#FF6600', 'Адмирал флота': '#FF4D4D',
};

interface Props {
  onProfile: (id: number) => void;
  onWrite: (id: number) => void;
}

const CrewOrgChart = ({ onProfile, onWrite }: Props) => {
  const [members, setMembers] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await crewApi.orgTree();
      setMembers(r.members);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const assignParent = async (memberId: number, parentId: number | null) => {
    await crewApi.setParent(memberId, parentId);
    setEditId(null);
    await load();
  };

  if (loading) {
    return <div className="py-16 text-center"><Icon name="Loader2" size={28} className="animate-spin text-[#66FCF1] mx-auto" /></div>;
  }

  const roots = members.filter((m) => !m.parent_id);
  const childrenOf = (id: number) => members.filter((m) => m.parent_id === id);

  const Node = ({ member, depth }: { member: CrewMember; depth: number }) => {
    const kids = childrenOf(member.id);
    const rankColor = RANK_COLORS[member.rank] || '#66FCF1';
    return (
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 rounded-xl border border-[#45A29E]/25 bg-[#1F2833]/50 p-2.5 hover:border-[#66FCF1]/50 transition-colors"
          style={{ marginLeft: depth * 24 }}
        >
          {depth > 0 && <span className="absolute -left-3 top-1/2 w-3 h-px bg-[#45A29E]/40" style={{ left: depth * 24 - 12 }} />}
          <button onClick={() => onProfile(member.id)} className="relative w-10 h-10 rounded-lg overflow-hidden border shrink-0" style={{ borderColor: rankColor }}>
            {member.avatar_url ? <img src={member.avatar_url} alt={member.callsign} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#0B0C10] flex items-center justify-center"><Icon name="UserRound" size={18} className="text-[#45A29E]" /></div>}
            {member.is_online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#45A29E] border-2 border-[#1F2833]" />}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white text-sm truncate">{member.callsign}</span>
              {member.is_admin && <Icon name="ShieldCheck" size={12} className="text-[#FF6600] shrink-0" />}
            </div>
            <div className="text-[11px] text-[#8B98A5] truncate">
              {member.position_title || member.role_label}{member.department ? ` · ${member.department}` : ''}
            </div>
          </div>
          <span className="text-[10px] font-heading font-bold shrink-0" style={{ color: rankColor }}>{member.rank}</span>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => onWrite(member.id)} title="Написать" className="w-7 h-7 rounded-md border border-[#45A29E]/30 text-[#66FCF1] hover:bg-[#45A29E]/10 flex items-center justify-center">
              <Icon name="MessageSquare" size={13} />
            </button>
            <button onClick={() => setEditId(editId === member.id ? null : member.id)} title="Кому подчиняется" className="w-7 h-7 rounded-md border border-[#45A29E]/30 text-[#66FCF1] hover:bg-[#45A29E]/10 flex items-center justify-center">
              <Icon name="Link" size={13} />
            </button>
          </div>
        </motion.div>

        {editId === member.id && (
          <div className="mt-1.5 mb-1 rounded-lg border border-[#66FCF1]/30 bg-[#0B0C10]/80 p-2" style={{ marginLeft: depth * 24 }}>
            <div className="text-[10px] text-[#8B98A5] mb-1.5">Назначить руководителя для «{member.callsign}»:</div>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => assignParent(member.id, null)}
                className={`text-[11px] px-2 py-1 rounded-md border ${!member.parent_id ? 'bg-[#45A29E] text-[#0B0C10] border-[#45A29E]' : 'border-[#45A29E]/30 text-[#8B98A5] hover:text-white'}`}>
                Без руководителя (вершина)
              </button>
              {members.filter((c) => c.id !== member.id).map((c) => (
                <button key={c.id} onClick={() => assignParent(member.id, c.id)}
                  className={`text-[11px] px-2 py-1 rounded-md border ${member.parent_id === c.id ? 'bg-[#45A29E] text-[#0B0C10] border-[#45A29E]' : 'border-[#45A29E]/30 text-[#8B98A5] hover:text-white'}`}>
                  {c.callsign}
                </button>
              ))}
            </div>
          </div>
        )}

        {kids.length > 0 && (
          <div className="mt-1.5 space-y-1.5 border-l border-[#45A29E]/20" style={{ marginLeft: depth * 24 + 20 }}>
            <div className="space-y-1.5" style={{ marginLeft: -depth * 24 - 20 }}>
              {kids.map((k) => <Node key={k.id} member={k} depth={depth + 1} />)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 text-[11px] text-[#8B98A5]">
        <Icon name="Info" size={14} className="text-[#45A29E]" />
        Нажмите на иконку связи, чтобы назначить, кому подчиняется сотрудник. Так строится оргструктура станции.
      </div>
      <div className="space-y-1.5">
        {roots.length === 0 && <div className="py-10 text-center text-[#6B7684]">Пока никого нет в структуре</div>}
        {roots.map((m) => <Node key={m.id} member={m} depth={0} />)}
      </div>
    </div>
  );
};

export default CrewOrgChart;
