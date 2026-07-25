import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { crewApi, ROLE_LABELS } from '@/lib/crewApi';

const CrewInviteModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [role, setRole] = useState('universal');
  const [department, setDepartment] = useState('');
  const [maxUses, setMaxUses] = useState('1');
  const [ttl, setTtl] = useState('7');
  const [invites, setInvites] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const load = () => crewApi.listInvites().then((r) => setInvites(r.invites)).catch(() => {});
  useEffect(() => { if (open) load(); }, [open]);

  const create = async () => {
    setCreating(true);
    try {
      await crewApi.createInvite(role, department.trim(), parseInt(maxUses) || 1, ttl ? parseInt(ttl) : null);
      await load();
    } finally { setCreating(false); }
  };

  const linkFor = (code: string) => `${window.location.origin}/deod.space?invite=${code}`;

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch { /* fallback below */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.setAttribute('readonly', '');
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };

  const copy = async (code: string) => {
    const ok = await copyToClipboard(linkFor(code));
    if (ok) {
      setCopied(code);
      setTimeout(() => setCopied(null), 1500);
    } else {
      window.prompt('Скопируйте ссылку вручную:', linkFor(code));
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[76] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#45A29E]/40 bg-[#0B0C10]/95 backdrop-blur-xl p-5 shadow-[0_0_50px_rgba(69,162,158,0.2)]">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="UserPlus" size={20} className="text-[#66FCF1]" />
              <h2 className="font-heading font-bold text-lg text-white">Призыв новобранцев</h2>
              <button onClick={onClose} className="ml-auto text-[#6B7684] hover:text-white"><Icon name="X" size={18} /></button>
            </div>

            <div className="space-y-3 rounded-xl border border-[#45A29E]/20 bg-[#1F2833]/40 p-3 mb-4">
              <div>
                <label className="text-[11px] text-[#8B98A5] mb-1 block">Роль новичка</label>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(ROLE_LABELS).map(([k, v]) => (
                    <button key={k} onClick={() => setRole(k)}
                      className={`text-[11px] px-2 py-1 rounded-md border ${role === k ? 'bg-[#45A29E] text-[#0B0C10] border-[#45A29E]' : 'border-[#45A29E]/30 text-[#8B98A5] hover:text-white'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-[#8B98A5] mb-1 block">Отдел</label>
                  <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="—"
                    className="w-full bg-[#0B0C10]/60 border border-[#45A29E]/30 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[#66FCF1]/60" />
                </div>
                <div>
                  <label className="text-[11px] text-[#8B98A5] mb-1 block">Исп. раз</label>
                  <input value={maxUses} onChange={(e) => setMaxUses(e.target.value)} type="number" min="1"
                    className="w-full bg-[#0B0C10]/60 border border-[#45A29E]/30 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[#66FCF1]/60" />
                </div>
                <div>
                  <label className="text-[11px] text-[#8B98A5] mb-1 block">Дней (0=∞)</label>
                  <input value={ttl} onChange={(e) => setTtl(e.target.value)} type="number" min="0"
                    className="w-full bg-[#0B0C10]/60 border border-[#45A29E]/30 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-[#66FCF1]/60" />
                </div>
              </div>
              <button onClick={create} disabled={creating}
                className="w-full py-2 rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                {creating ? <Icon name="Loader2" size={15} className="animate-spin" /> : <Icon name="Ticket" size={15} />}
                Создать приглашение
              </button>
            </div>

            <div className="text-[11px] uppercase tracking-widest text-[#6B7684] mb-2">Созданные ссылки</div>
            <div className="space-y-2">
              {invites.length === 0 && <div className="text-center text-[#6B7684] text-sm py-4">Приглашений пока нет</div>}
              {invites.map((inv) => {
                const exhausted = inv.used_count >= inv.max_uses;
                return (
                  <div key={inv.id} className="flex items-center gap-2 rounded-lg border border-[#45A29E]/15 bg-[#1F2833]/30 px-3 py-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-mono truncate">{inv.code}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#45A29E]/15 text-[#45A29E]">{ROLE_LABELS[inv.role] || inv.role}</span>
                      </div>
                      <div className="text-[10px] text-[#6B7684]">
                        Использований: {inv.used_count}/{inv.max_uses} {exhausted && '· исчерпано'}
                      </div>
                    </div>
                    <button onClick={() => copy(inv.code)} disabled={exhausted}
                      className="text-[11px] px-2 py-1 rounded-md border border-[#66FCF1]/40 text-[#66FCF1] hover:bg-[#66FCF1]/10 disabled:opacity-40 flex items-center gap-1">
                      <Icon name={copied === inv.code ? 'Check' : 'Copy'} size={12} />
                      {copied === inv.code ? 'Готово' : 'Ссылка'}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CrewInviteModal;