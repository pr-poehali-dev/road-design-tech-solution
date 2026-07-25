import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import StarfieldBackground from '@/components/deod/StarfieldBackground';

const API_URL = 'https://functions.poehali.dev/fd1c95d9-d394-4d33-af98-1d5a05163881';

interface CRMAuthProps {
  onLoginSuccess: (user: any) => void;
}

export const CRMAuth = ({ onLoginSuccess }: CRMAuthProps) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login fields
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Register-only fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setInviteCode(ref);
      setMode('register');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body: Record<string, any> =
        mode === 'login'
          ? { resource: 'login', phone, password }
          : { resource: 'register', name, phone, password, email, company, invite_code: inviteCode || undefined };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Ошибка сервера');
        return;
      }

      if (data.user) {
        localStorage.setItem('userProfile', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setError('Не удалось получить данные пользователя');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'h-10 bg-[#1F2833]/70 border-[#45A29E]/30 text-white placeholder:text-[#6B7684] focus:border-[#66FCF1]/60 focus:ring-[#66FCF1]/20';

  return (
    <div className="min-h-screen bg-[#0B0C10] relative overflow-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0C10] via-[#12132a] to-[#0B0C10]" />
        <div className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#45A29E]/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#663399]/12 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[30vw] h-[30vw] rounded-full bg-[#FF6600]/5 blur-[100px]" />
      </div>
      <StarfieldBackground />

      <Card className="relative z-10 max-w-md w-full shadow-2xl border-[#45A29E]/30 bg-[#1F2833]/60 backdrop-blur-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#45A29E] to-[#0B0C10] border border-[#66FCF1]/40 rounded-lg flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(102,252,241,0.4)]">
            <Icon name={mode === 'login' ? 'Lock' : 'UserPlus'} size={32} className="text-[#66FCF1]" />
          </div>
          <CardTitle className="font-heading text-2xl font-bold text-white tracking-wide">
            DEAD SPACE
          </CardTitle>
          <CardDescription className="text-[#C5C6C7]">
            {mode === 'login' ? 'Войдите в систему' : 'Создайте аккаунт партнёра'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <>
                <Input
                  type="text"
                  placeholder="Имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                />
                <Input
                  type="text"
                  placeholder="Компания"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={inputCls}
                />
              </>
            )}

            <Input
              type="tel"
              placeholder="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputCls}
              required
            />

            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
              required
            />

            {mode === 'register' && (
              <div className="relative">
                <Icon name="Gift" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#66FCF1]/60" />
                <Input
                  type="text"
                  placeholder="Код приглашения (необязательно)"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className={`${inputCls} pl-10 uppercase tracking-widest`}
                />
              </div>
            )}

            {error && (
              <div className="bg-[#FF4D4D]/10 border border-[#FF4D4D]/30 rounded-md px-3 py-2 text-sm text-[#FF4D4D] flex items-center gap-2">
                <Icon name="AlertCircle" size={14} />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-[#45A29E] hover:bg-[#3d8f8b] text-[#0B0C10] font-bold shadow-[0_0_20px_rgba(102,252,241,0.25)] hover:shadow-[0_0_30px_rgba(102,252,241,0.4)] transition-all disabled:opacity-50"
            >
              {loading ? (
                <Icon name="Loader2" size={16} className="animate-spin mr-2" />
              ) : (
                <Icon name={mode === 'login' ? 'LogIn' : 'UserPlus'} size={16} className="mr-2" />
              )}
              {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-sm text-[#66FCF1]/70 hover:text-[#66FCF1] transition-colors underline underline-offset-4 decoration-[#45A29E]/30 hover:decoration-[#66FCF1]/60"
            >
              {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMAuth;