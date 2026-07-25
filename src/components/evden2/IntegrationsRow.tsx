import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { evdenApi } from '@/lib/evden2Api';

export const IntegrationsRow = ({ onDealCreated }: { onDealCreated?: () => void }) => {
  const { toast } = useToast();
  const [loadingBidzaar, setLoadingBidzaar] = useState(false);
  const [bidzaarError, setBidzaarError] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [importingId, setImportingId] = useState<string | null>(null);

  const fetchBidzaar = async () => {
    setLoadingBidzaar(true);
    setBidzaarError(null);
    try {
      const res = await evdenApi.fetchBidzaar(20);
      setPurchases(res.purchases);
      if (res.purchases.length === 0) {
        toast({ title: 'BIDZAAR не вернул тендеров за выбранный период' });
      }
    } catch (e: any) {
      setBidzaarError(e.message);
    } finally {
      setLoadingBidzaar(false);
    }
  };

  const importPurchase = async (purchaseId: string) => {
    setImportingId(purchaseId);
    try {
      const res = await evdenApi.importBidzaar(purchaseId);
      toast({ title: 'Тендер импортирован в сделку', description: res.deal.company_name });
      onDealCreated?.();
    } catch (e: any) {
      toast({ title: 'Не удалось импортировать', description: e.message, variant: 'destructive' });
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/50 p-4 flex items-center gap-3 col-span-2 lg:col-span-2">
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center shrink-0">
            <Icon name="Gavel" size={19} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              BIDZAAR
              <Badge className="text-[9px] px-1.5 py-0 bg-slate-700/50 text-slate-300 border-slate-600/40">подключён, ждёт IP-вайтлист</Badge>
            </div>
            <div className="text-[11px] text-slate-400 leading-snug">Реальный API-запрос к площадке закупок</div>
          </div>
          <Button size="sm" onClick={fetchBidzaar} disabled={loadingBidzaar} className="h-8 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs shrink-0">
            {loadingBidzaar ? <Icon name="Loader2" size={14} className="animate-spin" /> : 'Проверить тендеры'}
          </Button>
        </div>

        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/50 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center shrink-0">
            <Icon name="Send" size={19} className="text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white flex items-center gap-1.5">
              Telegram
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            </div>
            <div className="text-[11px] text-slate-400 leading-snug">Webhook активен, работает</div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-slate-900/50 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center shrink-0">
            <Icon name="MessageCircle" size={19} className="text-blue-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Max</div>
            <div className="text-[11px] text-slate-400 leading-snug">Нужен токен бота для подключения</div>
          </div>
        </div>
      </div>

      {bidzaarError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3.5 text-sm text-red-300 flex items-start gap-2">
          <Icon name="AlertTriangle" size={16} className="shrink-0 mt-0.5" />
          <div>
            <div className="font-medium mb-0.5">Ошибка запроса к BIDZAAR</div>
            <div className="text-xs text-red-300/80">{bidzaarError}</div>
          </div>
        </div>
      )}

      {purchases.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4">
          <div className="text-sm font-medium text-white mb-3">Найденные тендеры ({purchases.length})</div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {purchases.map((p) => (
              <div key={p.purchase_id} className="rounded-xl bg-slate-800/50 border border-slate-700/40 p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-medium text-slate-100 truncate">{p.title || `Тендер №${p.purchase_id}`}</div>
                  <div className="text-[11px] text-slate-500 truncate">{p.customer_name} · {p.region}</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => importPurchase(p.purchase_id)}
                  disabled={importingId === p.purchase_id}
                  className="h-7 text-[11px] border-amber-500/30 text-amber-300 hover:bg-amber-500/10 shrink-0"
                >
                  {importingId === p.purchase_id ? <Icon name="Loader2" size={12} className="animate-spin" /> : 'Импорт в сделку'}
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default IntegrationsRow;
