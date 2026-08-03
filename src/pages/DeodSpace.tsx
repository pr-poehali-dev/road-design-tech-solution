import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import StarfieldBackground from '@/components/deod/StarfieldBackground';
import OrbitTicker from '@/components/deod/OrbitTicker';
import MissionHeader from '@/components/deod/MissionHeader';
import QuickNav from '@/components/deod/QuickNav';
import CosmicAnalytics from '@/components/deod/CosmicAnalytics';
import SectionCard from '@/components/deod/SectionCard';
import CrewSupportWidget from '@/components/deod/CrewSupportWidget';
import StarComWidget from '@/components/deod/StarComWidget';
import StarComLauncher from '@/components/deod/StarComLauncher';
import CrewPanel from '@/components/deod/CrewPanel';
import DepositoryPanel from '@/components/deod/DepositoryPanel';
import TacticalLog from '@/components/deod/TacticalLog';
import RecentFilesWidget from '@/components/deod/RecentFilesWidget';
import BridgeWidget from '@/components/deod/BridgeWidget';
import BridgePanel from '@/components/deod/BridgePanel';
import DeodAuthGate from '@/components/deod/DeodAuthGate';
import { CrewAuthProvider, useCrewAuth } from '@/components/deod/CrewAuthContext';
import { sections } from '@/components/deod/sectionsData';

const DeodSpaceInner = () => {
  const { me, loading, connectionError, refresh } = useCrewAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<number | null>(null);
  const [crewOpen, setCrewOpen] = useState(false);
  const [depoOpen, setDepoOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);
  const [bridgeOpen, setBridgeOpen] = useState(false);
  const [bridgeClientId, setBridgeClientId] = useState<number | null>(null);
  const [unread, setUnread] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const prevUnread = useRef(0);

  useEffect(() => {
    if (window.location.hash === '#chat') setChatOpen(true);
    if (window.location.hash === '#crew') setCrewOpen(true);
    if (window.location.hash === '#depository') setDepoOpen(true);
    if (window.location.hash === '#tasks') setTasksOpen(true);
    if (window.location.hash === '#bridge') setBridgeOpen(true);
  }, [me]);

  useEffect(() => {
    if (unread > prevUnread.current && !chatOpen) {
      setFlashing(true);
      const t = setTimeout(() => setFlashing(false), 4000);
      prevUnread.current = unread;
      return () => clearTimeout(t);
    }
    prevUnread.current = unread;
  }, [unread, chatOpen]);

  const openChat = (recipientId?: number) => {
    setChatRecipient(recipientId ?? null);
    setChatOpen(true);
  };
  const openCrew = () => setCrewOpen(true);
  const openDepo = () => setDepoOpen(true);
  const openTasks = () => setTasksOpen(true);
  const openBridge = (clientId?: number) => {
    setBridgeClientId(clientId ?? null);
    setBridgeOpen(true);
  };

  const handleSpecial = (kind: 'crew' | 'chat' | 'depository' | 'tasks' | 'bridge') => {
    if (kind === 'crew') openCrew();
    else if (kind === 'depository') openDepo();
    else if (kind === 'tasks') openTasks();
    else if (kind === 'bridge') openBridge();
    else openChat();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
        <Icon name="Loader2" size={32} className="animate-spin text-[#66FCF1]" />
      </div>
    );
  }

  if (!me && connectionError) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <Icon name="WifiOff" size={40} className="text-[#FF6600] mx-auto mb-4" />
          <h2 className="font-heading font-bold text-white text-lg mb-2">Нет связи со станцией</h2>
          <p className="text-[#8B98A5] text-sm mb-5">
            Не удалось проверить сессию. Ваш вход сохранён — проверьте соединение и повторите попытку.
          </p>
          <button
            onClick={() => refresh()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold hover:opacity-90"
          >
            <Icon name="RefreshCw" size={16} /> Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  if (!me) {
    return <DeodAuthGate />;
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white relative overflow-hidden font-sans">
      {/* deep space gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0C10] via-[#12132a] to-[#0B0C10]" />
        <div className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#45A29E]/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#663399]/12 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[30vw] h-[30vw] rounded-full bg-[#FF6600]/5 blur-[100px]" />
      </div>
      <StarfieldBackground />

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(#66FCF1 1px, transparent 1px), linear-gradient(90deg, #66FCF1 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="fixed top-24 right-8 pointer-events-none hidden lg:block opacity-40">
        <div className="animate-rocket-fly">
          <div className="relative">
            <Icon name="Rocket" size={90} className="text-[#66FCF1]/40" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-16 bg-gradient-to-t from-transparent via-[#FF6600]/50 to-[#FF6600]/80 blur-md rotate-[225deg] origin-top" />
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <MissionHeader onOpenCrew={openCrew} />
        <OrbitTicker />
        <QuickNav onOpenChat={openChat} onOpenCrew={openCrew} onOpenDepo={openDepo} onOpenTasks={openTasks} />

        <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-6">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#45A29E]/40" />
            <span className="font-mono text-[11px] text-[#45A29E] uppercase tracking-[0.3em]">
              Все системы онлайн · выберите модуль станции
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#45A29E]/40" />
          </motion.div>

          <div className="mb-8">
            <CosmicAnalytics />
          </div>

          <div className="mb-8">
            <RecentFilesWidget onOpenDepo={openDepo} />
          </div>

          <div className="mb-8">
            <BridgeWidget onOpen={openBridge} />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Icon name="LayoutGrid" size={18} className="text-[#66FCF1]" />
            <h2 className="font-heading font-bold text-lg text-white tracking-wide">Модули станции</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section, i) => (
              <SectionCard key={section.id} section={section} index={i} onSpecial={handleSpecial} />
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-mono text-[#45A29E]/70 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#45A29E] animate-pulse" /> Реактор: стабилен</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#66FCF1] animate-pulse" /> Связь: 100%</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FF6600] animate-pulse" /> DEAD SPACE: активен</span>
            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D] animate-pulse" /> Аномалий: 14</span>
          </div>
        </main>
      </div>

      <CrewSupportWidget />

      {!chatOpen && (
        <StarComLauncher unread={unread} flashing={flashing} onClick={() => openChat()} />
      )}
      <StarComWidget
        open={chatOpen}
        recipientId={chatRecipient}
        onClose={() => setChatOpen(false)}
        onUnreadChange={setUnread}
      />

      <CrewPanel open={crewOpen} onClose={() => setCrewOpen(false)} onOpenChat={openChat} />
      <DepositoryPanel open={depoOpen} onClose={() => setDepoOpen(false)} />
      <TacticalLog open={tasksOpen} onClose={() => setTasksOpen(false)} />
      <BridgePanel open={bridgeOpen} onClose={() => setBridgeOpen(false)} initialClientId={bridgeClientId} />
    </div>
  );
};

const DeodSpace = () => (
  <CrewAuthProvider>
    <DeodSpaceInner />
  </CrewAuthProvider>
);

export default DeodSpace;