import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { useCrewAuth } from './CrewAuthContext';

const MissionHeader = ({ onOpenCrew, onOpenAuth }: { onOpenCrew: () => void; onOpenAuth: () => void }) => {
  const { me } = useCrewAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <header className="relative border-b border-[#45A29E]/30 bg-[#0B0C10]/70 backdrop-blur-lg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* animated rocket badge */}
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#45A29E]/30 to-[#66FCF1]/10 border border-[#66FCF1]/40 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(102,252,241,0.3)]">
            <motion.div
              animate={{ y: [2, -3, 2], rotate: [0, 3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon name="Rocket" size={22} className="text-[#66FCF1]" />
            </motion.div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-gradient-to-t from-[#FF6600] to-transparent blur-[2px] animate-pulse-glow" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-base sm:text-xl text-white tracking-wide leading-none">
              Центр управления полётом <span className="text-[#66FCF1]">DEOD</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-[#6B7684] font-mono mt-1 uppercase tracking-widest">
              Mission Control · станция на орбите
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="font-mono text-[#66FCF1] text-sm sm:text-lg font-bold tabular-nums leading-none">{timeStr}</span>
            <span className="text-[10px] text-[#6B7684] mt-1 capitalize">{dateStr}</span>
          </div>
          {me ? (
            <button onClick={onOpenCrew} className="flex items-center gap-2 pl-3 sm:pl-5 border-l border-[#45A29E]/20 group">
              <div className="hidden sm:block text-right">
                <div className="text-xs text-white font-semibold leading-none group-hover:text-[#66FCF1] transition-colors">{me.callsign}</div>
                <div className="text-[10px] text-[#45A29E] mt-0.5 flex items-center gap-1 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#45A29E] animate-pulse" /> {me.rank}
                </div>
              </div>
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#45A29E] to-[#1F2833] border border-[#66FCF1]/40 flex items-center justify-center">
                {me.avatar_url ? (
                  <img src={me.avatar_url} alt={me.callsign} className="w-full h-full object-cover" />
                ) : (
                  <Icon name="UserRound" size={20} className="text-[#66FCF1]" />
                )}
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 pl-3 sm:pl-5 border-l border-[#45A29E]/20 text-[#66FCF1] hover:text-white transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#1F2833] border border-[#66FCF1]/40 flex items-center justify-center">
                <Icon name="LogIn" size={19} />
              </div>
              <span className="hidden sm:inline text-sm font-semibold">Войти</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default MissionHeader;