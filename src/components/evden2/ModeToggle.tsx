import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';

interface ModeToggleProps {
  mode: 'voice' | 'manual';
  setMode: (m: 'voice' | 'manual') => void;
  listening: boolean;
  onToggleListen: () => void;
  transcript: string;
  processing: boolean;
  lastReply: string;
  supported: boolean;
}

export const ModeToggle = ({ mode, setMode, listening, onToggleListen, transcript, processing, lastReply, supported }: ModeToggleProps) => {
  return (
    <div className="rounded-2xl border border-amber-500/25 bg-slate-900/70 backdrop-blur-md p-4 sm:p-5 shadow-[0_0_25px_rgba(251,191,36,0.08)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setMode(mode === 'voice' ? 'manual' : 'voice')}
              className="relative w-16 h-8 rounded-full bg-slate-800 border border-amber-500/30 flex items-center px-1 transition-colors"
            >
              <motion.div
                animate={{ x: mode === 'voice' ? 32 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,0.6)]"
              >
                <Icon name={mode === 'voice' ? 'Mic' : 'MousePointer2'} size={13} className="text-slate-900" />
              </motion.div>
            </button>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              Режим: {mode === 'voice' ? 'Командир (Голос)' : 'Инженер (Руки)'}
            </div>
            <div className="text-xs text-slate-400">
              {supported ? 'Переключайтесь голосом или кликом в любой момент' : 'Голосовой ввод не поддерживается этим браузером — попробуйте Chrome'}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'voice' ? (
            <motion.button
              key="voice-btn"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={onToggleListen}
              disabled={!supported || processing}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all disabled:opacity-50 ${
                listening
                  ? 'border-red-500/50 bg-red-500/10 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
              }`}
            >
              {listening && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
              )}
              {processing ? (
                <Icon name="Loader2" size={16} className="animate-spin" />
              ) : (
                <Icon name={listening ? 'MicOff' : 'Mic'} size={16} />
              )}
              <span className="text-sm font-medium">
                {processing ? 'Обрабатываю...' : listening ? 'Слушаю... (нажмите чтобы завершить)' : 'Сказать «Неврон»'}
              </span>
            </motion.button>
          ) : (
            <motion.div
              key="manual-btn"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-600/40 bg-slate-800/60 text-slate-300"
            >
              <Icon name="LayoutGrid" size={16} />
              <span className="text-sm font-medium">Классический интерфейс активен</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {mode === 'voice' && (listening || transcript || lastReply) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-amber-500/15"
          >
            {(listening || transcript) && (
              <>
                <div className="flex items-center gap-2 text-xs text-amber-300/80 mb-2">
                  <Icon name="AudioLines" size={14} />
                  Распознавание речи
                </div>
                <div className="text-sm text-slate-200 italic min-h-[20px]">«{transcript || '...'}»</div>
                {listening && (
                  <div className="flex gap-0.5 mt-2 h-4 items-end">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <motion.span
                        key={i}
                        className="w-1 bg-gradient-to-t from-amber-500 to-orange-400 rounded-full"
                        animate={{ height: [4, Math.random() * 16 + 4, 4] }}
                        transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.03 }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            {lastReply && !listening && (
              <div className="flex items-start gap-2 mt-2 text-sm text-emerald-300">
                <Icon name="Bot" size={15} className="shrink-0 mt-0.5" />
                <span>{lastReply}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModeToggle;
