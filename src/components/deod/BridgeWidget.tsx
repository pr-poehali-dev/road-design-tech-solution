import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { bridgeApi, BridgeConversation, DEOD_SPACE_PARTNER_ID } from '@/lib/bridgeApi';

const CHANNEL_ICON: Record<string, string> = { email: 'Mail', telegram: 'Send', max: 'MessageCircle' };
const CHANNEL_COLOR: Record<string, string> = { email: '#66FCF1', telegram: '#45A29E', max: '#C89BFF' };

const fmtTime = (d?: string) =>
  d ? new Date(d).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';

interface Props {
  onOpen: (clientId?: number) => void;
}

const BridgeWidget = ({ onOpen }: Props) => {
  const [conversations, setConversations] = useState<BridgeConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await bridgeApi.getConversations(undefined, undefined, DEOD_SPACE_PARTNER_ID);
      setConversations(res.conversations);
    } catch {
      // молча — виджет не критичен для главного экрана
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Фоновая проверка почты и обновление списка раз в минуту, пока открыт /deod-space
  useEffect(() => {
    const sync = async () => {
      setSyncing(true);
      try {
        await bridgeApi.syncEmail(DEOD_SPACE_PARTNER_ID);
        await load();
      } catch {
        // тихо
      } finally {
        setSyncing(false);
      }
    };
    const interval = setInterval(sync, 60_000);
    return () => clearInterval(interval);
  }, [load]);

  const unreadTotal = conversations.reduce((sum, c) => sum + (c.unread_messages_count || 0), 0);

  return (
    <div className="rounded-2xl border border-[#45A29E]/25 bg-[#1F2833]/30 p-4 sm:p-5">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 text-left"
      >
        <div className="w-9 h-9 rounded-lg bg-[#45A29E]/15 border border-[#45A29E]/40 flex items-center justify-center shrink-0 relative">
          <Icon name="MessagesSquare" size={18} className="text-[#66FCF1]" />
          {syncing && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#45A29E] animate-pulse" />}
        </div>
        <div>
          <h2 className="font-heading font-bold text-white tracking-wide">Радужный мост</h2>
          <p className="text-[10px] text-[#6B7684] uppercase tracking-widest">
            {loading ? 'загрузка...' : `${conversations.length} диалогов · ${unreadTotal} новых`}
          </p>
        </div>
        {unreadTotal > 0 && (
          <span className="shrink-0 text-[10px] font-bold bg-[#FF6600] text-[#0B0C10] rounded-full px-1.5 py-0.5">
            {unreadTotal}
          </span>
        )}
        <span
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          className="ml-auto flex items-center gap-1 text-[12px] text-[#66FCF1] hover:text-white transition-colors shrink-0"
        >
          Открыть переписку <Icon name="ArrowRight" size={14} />
        </span>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 ml-2">
          <Icon name="ChevronDown" size={18} className="text-[#6B7684]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {loading ? (
                <div className="py-8 text-center"><Icon name="Loader2" size={22} className="animate-spin text-[#66FCF1] mx-auto" /></div>
              ) : conversations.length === 0 ? (
                <div className="py-8 text-center text-[#6B7684] text-sm">
                  <Icon name="Inbox" size={28} className="mx-auto mb-2 opacity-50" />
                  Пока нет переписки. Новые письма появятся здесь автоматически.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {conversations.slice(0, 6).map((c, i) => (
                    <motion.button
                      key={c.client_id}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      onClick={() => onOpen(c.client_id)}
                      className="w-full flex items-center gap-2.5 rounded-xl border border-[#45A29E]/15 bg-[#0B0C10]/40 px-3 py-2 hover:border-[#66FCF1]/40 transition-colors text-left"
                    >
                      <Icon name={CHANNEL_ICON[c.last_channel] || 'Mail'} size={14} style={{ color: CHANNEL_COLOR[c.last_channel] }} className="shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-white truncate">{c.contact_person || c.company_name || '—'}</span>
                          {c.auto_created && (
                            <span className="shrink-0 text-[8px] px-1 py-0.5 rounded bg-[#FF6600]/20 text-[#FF9B4D] font-bold">лид</span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#8B98A5] truncate">
                          {c.last_direction === 'out' ? 'Вы: ' : ''}{c.last_message || ''}
                        </div>
                      </div>
                      <span className="shrink-0 text-[9px] text-[#6B7684]">{fmtTime(c.last_message_created_at)}</span>
                      {c.unread_messages_count > 0 && (
                        <span className="shrink-0 text-[9px] font-bold bg-[#FF6600] text-[#0B0C10] rounded-full px-1.5 py-0.5">
                          {c.unread_messages_count}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BridgeWidget;
