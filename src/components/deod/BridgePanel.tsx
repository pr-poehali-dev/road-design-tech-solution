import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { CRMBridge } from '@/components/crm/CRMBridge';
import { DEOD_SPACE_PARTNER_ID } from '@/lib/bridgeApi';

interface Props {
  open: boolean;
  onClose: () => void;
  initialClientId?: number | null;
}

const BridgePanel = ({ open, onClose, initialClientId }: Props) => {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-[#0B0C10]/95 backdrop-blur-xl overflow-y-auto"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-[#45A29E]/15 border border-[#45A29E]/40 flex items-center justify-center shrink-0">
              <Icon name="MessagesSquare" size={18} className="text-[#66FCF1]" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-white tracking-wide text-lg">Радужный мост</h2>
              <p className="text-[10px] text-[#6B7684] uppercase tracking-widest">Единая переписка с клиентами</p>
            </div>
            <button onClick={onClose} className="ml-auto text-[#6B7684] hover:text-white p-2"><Icon name="X" size={22} /></button>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <CRMBridge partnerId={DEOD_SPACE_PARTNER_ID} initialClientId={initialClientId} />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BridgePanel;
