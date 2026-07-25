import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { evdenApi, Deal, PHASE_LABELS } from '@/lib/evden2Api';
import DealCard from './DealCard';

const healthDot: Record<string, string> = {
  green: 'bg-emerald-400',
  yellow: 'bg-amber-400',
  red: 'bg-red-400',
};

export const DealsPanel = ({ deals, onChanged }: { deals: Deal[]; onChanged: () => void }) => {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<number | null>(deals[0]?.id ?? null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company_name: '', contact_person: '', phone: '', object_address: '', work_type: '', budget: '' });
  const [creating, setCreating] = useState(false);

  const submitDeal = async () => {
    if (!form.company_name.trim()) {
      toast({ title: 'Укажите название компании', variant: 'destructive' });
      return;
    }
    setCreating(true);
    try {
      const res = await evdenApi.createDeal({
        company_name: form.company_name.trim(),
        contact_person: form.contact_person.trim(),
        phone: form.phone.trim(),
        object_address: form.object_address.trim(),
        work_type: form.work_type.trim(),
        budget: Number(form.budget) || 0,
        phase: 'ether',
        source: 'manual',
      });
      toast({ title: 'Сделка создана', description: res.deal.company_name });
      setForm({ company_name: '', contact_person: '', phone: '', object_address: '', work_type: '', budget: '' });
      setShowForm(false);
      setSelectedId(res.deal.id);
      onChanged();
    } catch (e: any) {
      toast({ title: 'Не удалось создать сделку', description: e.message, variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-4">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-3 h-fit">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-sm font-medium text-slate-200">Сделки ({deals.length})</span>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-amber-400" onClick={() => setShowForm((v) => !v)}>
            <Icon name={showForm ? 'X' : 'Plus'} size={16} />
          </Button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-3 space-y-2 px-1">
            <Input placeholder="Компания *" value={form.company_name} onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))} className="h-8 text-xs bg-slate-800/60 border-slate-700/50" />
            <Input placeholder="Контактное лицо" value={form.contact_person} onChange={(e) => setForm((f) => ({ ...f, contact_person: e.target.value }))} className="h-8 text-xs bg-slate-800/60 border-slate-700/50" />
            <Input placeholder="Телефон" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="h-8 text-xs bg-slate-800/60 border-slate-700/50" />
            <Input placeholder="Объект / адрес" value={form.object_address} onChange={(e) => setForm((f) => ({ ...f, object_address: e.target.value }))} className="h-8 text-xs bg-slate-800/60 border-slate-700/50" />
            <Input placeholder="Тип работ" value={form.work_type} onChange={(e) => setForm((f) => ({ ...f, work_type: e.target.value }))} className="h-8 text-xs bg-slate-800/60 border-slate-700/50" />
            <Input placeholder="Бюджет, ₽" type="number" value={form.budget} onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))} className="h-8 text-xs bg-slate-800/60 border-slate-700/50" />
            <Button onClick={submitDeal} disabled={creating} size="sm" className="w-full h-8 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs">
              {creating ? <Icon name="Loader2" size={13} className="animate-spin" /> : 'Создать сделку'}
            </Button>
          </motion.div>
        )}

        <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
          {deals.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedId(d.id)}
              className={`w-full text-left rounded-xl p-2.5 border transition-colors ${
                selectedId === d.id ? 'border-amber-400/50 bg-amber-500/10' : 'border-slate-700/40 bg-slate-800/30 hover:border-slate-600/50'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full ${healthDot[d.health] || healthDot.green}`} />
                <span className="text-xs font-medium text-slate-100 truncate">{d.company_name}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge className="text-[9px] px-1 py-0 bg-slate-700/40 text-slate-300 border-slate-600/30">
                  {PHASE_LABELS[d.phase]?.title || d.phase}
                </Badge>
                <span className="text-[10px] text-slate-500">{((d.budget || 0) / 1_000_000).toFixed(1)}M ₽</span>
              </div>
            </button>
          ))}
          {deals.length === 0 && (
            <div className="text-center text-xs text-slate-500 py-6 border border-dashed border-slate-700/40 rounded-xl">
              Пока нет сделок — создайте первую
            </div>
          )}
        </div>
      </div>

      <div>
        {selectedId ? (
          <DealCard dealId={selectedId} onChanged={onChanged} />
        ) : (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-10 text-center text-slate-500 text-sm">
            Выберите сделку слева
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsPanel;
