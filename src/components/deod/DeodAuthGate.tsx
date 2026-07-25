import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/ui/icon';
import { useCrewAuth } from './CrewAuthContext';
import StarfieldBackground from './StarfieldBackground';

const DeodAuthGate = () => {
  const { login, register } = useCrewAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [callsign, setCallsign] = useState('');
  const [invite, setInvite] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('invite');
    if (code) {
      setInvite(code);
      setMode('register');
    }
  }, []);

  const submit = async () => {
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') await login(email.trim(), password);
      else await register(email.trim(), password, callsign.trim(), invite.trim() || undefined);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white relative overflow-hidden flex items-center justify-center p-4 font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0C10] via-[#12132a] to-[#0B0C10]" />
        <div className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#45A29E]/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#663399]/14 blur-[120px]" />
      </div>
      <StarfieldBackground />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-[#45A29E]/40 bg-[#0B0C10]/90 backdrop-blur-xl p-7 shadow-[0_0_60px_rgba(69,162,158,0.25)]"
      >
        {/* logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#45A29E]/30 to-[#66FCF1]/10 border border-[#66FCF1]/40 flex items-center justify-center mb-3 shadow-[0_0_28px_rgba(102,252,241,0.35)]">
            <motion.div animate={{ y: [2, -3, 2] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
              <Icon name="Rocket" size={30} className="text-[#66FCF1]" />
            </motion.div>
          </div>
          <h1 className="font-heading font-extrabold text-xl text-white">
            Центр управления полётом <span className="text-[#66FCF1]">DEOD</span>
          </h1>
          <p className="text-[11px] text-[#6B7684] uppercase tracking-widest mt-1">
            {mode === 'login' ? 'Авторизация в систему' : 'Призыв на борт станции'}
          </p>
        </div>

        <div className="flex gap-1 mb-5 p-1 rounded-lg bg-[#1F2833]/60">
          {(['login', 'register'] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === m ? 'bg-[#45A29E] text-[#0B0C10]' : 'text-[#8B98A5] hover:text-white'
              }`}>
              {m === 'login' ? 'Вход' : 'Регистрация'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {mode === 'register' && <Field icon="Radio" placeholder="Позывной (имя)" value={callsign} onChange={setCallsign} />}
          <Field icon="Mail" placeholder="Email" value={email} onChange={setEmail} type="email" />
          <Field icon="Lock" placeholder="Пароль" value={password} onChange={setPassword} type="password" onEnter={submit} />
          {mode === 'register' && <Field icon="Ticket" placeholder="Код приглашения (если есть)" value={invite} onChange={setInvite} />}

          {error && (
            <div className="flex items-center gap-2 text-sm text-[#FF9B9B] bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 rounded-lg px-3 py-2">
              <Icon name="AlertTriangle" size={15} /> {error}
            </div>
          )}

          <button onClick={submit} disabled={busy}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#45A29E] to-[#66FCF1] text-[#0B0C10] font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
            {busy ? <Icon name="Loader2" size={18} className="animate-spin" /> : <Icon name="LogIn" size={18} />}
            {mode === 'login' ? 'Пристыковаться' : 'На борт!'}
          </button>
          {mode === 'register' && (
            <p className="text-[10px] text-[#6B7684] text-center">Первый зарегистрированный становится командиром станции</p>
          )}
        </div>

        {/* partner login link */}
        <div className="mt-6 pt-5 border-t border-[#45A29E]/15 text-center">
          <p className="text-[11px] text-[#6B7684] mb-2">Вы партнёр DEOD?</p>
          <a href="/ref" className="inline-flex items-center gap-1.5 text-sm text-[#66FCF1] hover:text-white transition-colors">
            <Icon name="Handshake" size={15} /> Вход для партнёров
          </a>
        </div>
      </motion.div>
    </div>
  );
};

const Field = ({ icon, placeholder, value, onChange, type = 'text', onEnter }: {
  icon: string; placeholder: string; value: string; onChange: (v: string) => void; type?: string; onEnter?: () => void;
}) => (
  <div className="flex items-center gap-2 bg-[#1F2833]/70 border border-[#45A29E]/30 rounded-lg px-3 focus-within:border-[#66FCF1]/60">
    <Icon name={icon as any} size={16} className="text-[#45A29E] shrink-0" />
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onEnter?.()} placeholder={placeholder}
      className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder:text-[#6B7684] focus:outline-none" />
  </div>
);

export default DeodAuthGate;
