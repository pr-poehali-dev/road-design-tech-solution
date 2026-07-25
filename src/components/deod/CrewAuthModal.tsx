import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { useCrewAuth } from './CrewAuthContext';

const CrewAuthModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { login, register } = useCrewAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [callsign, setCallsign] = useState('');
  const [invite, setInvite] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      const code = new URLSearchParams(window.location.search).get('invite');
      if (code) {
        setInvite(code);
        setMode('register');
      }
    }
  }, [open]);

  const submit = async () => {
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password, callsign.trim(), invite.trim() || undefined);
      }
      onClose();
      setEmail(''); setPassword(''); setCallsign(''); setInvite('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-[#45A29E]/40 bg-[#0B0C10]/95 backdrop-blur-xl p-6 shadow-[0_0_50px_rgba(69,162,158,0.25)]"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[#45A29E]/15 border border-[#45A29E]/40 flex items-center justify-center">
                <Icon name="UserRound" size={20} className="text-[#66FCF1]" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg text-white">
                  {mode === 'login' ? 'Вход в экипаж' : 'Призыв на борт'}
                </h2>
                <p className="text-[11px] text-[#6B7684]">Центр управления полётом DEOD</p>
              </div>
              <button onClick={onClose} className="ml-auto text-[#6B7684] hover:text-white">
                <Icon name="X" size={18} />
              </button>
            </div>

            <div className="flex gap-1 my-4 p-1 rounded-lg bg-[#1F2833]/60">
              {(['login', 'register'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    mode === m ? 'bg-[#45A29E] text-[#0B0C10]' : 'text-[#8B98A5] hover:text-white'
                  }`}
                >
                  {m === 'login' ? 'Вход' : 'Регистрация'}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {mode === 'register' && (
                <Field icon="Radio" placeholder="Позывной (имя)" value={callsign} onChange={setCallsign} />
              )}
              <Field icon="Mail" placeholder="Email" value={email} onChange={setEmail} type="email" />
              <Field icon="Lock" placeholder="Пароль" value={password} onChange={setPassword} type="password" onEnter={submit} />
              {mode === 'register' && (
                <Field icon="Ticket" placeholder="Код приглашения (необязательно)" value={invite} onChange={setInvite} />
              )}

              {error && (
                <div className="flex items-center gap-2 text-sm text-[#FF9B9B] bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 rounded-lg px-3 py-2">
                  <Icon name="AlertTriangle" size={15} /> {error}
                </div>
              )}

              <button
                onClick={submit}
                disabled={busy}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#45A29E] to-[#66FCF1] text-[#0B0C10] font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {busy ? <Icon name="Loader2" size={17} className="animate-spin" /> : <Icon name="Rocket" size={17} />}
                {mode === 'login' ? 'Пристыковаться' : 'На борт!'}
              </button>
              {mode === 'register' && (
                <p className="text-[10px] text-[#6B7684] text-center">Первый зарегистрированный становится администратором станции</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Field = ({ icon, placeholder, value, onChange, type = 'text', onEnter }: {
  icon: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string; onEnter?: () => void;
}) => (
  <div className="flex items-center gap-2 bg-[#1F2833]/70 border border-[#45A29E]/30 rounded-lg px-3 focus-within:border-[#66FCF1]/60">
    <Icon name={icon as any} size={16} className="text-[#45A29E] shrink-0" />
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
      placeholder={placeholder}
      className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder:text-[#6B7684] focus:outline-none"
    />
  </div>
);

export default CrewAuthModal;