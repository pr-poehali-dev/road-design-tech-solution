import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/dfa8f17b-5894-48e3-b263-bb3c5de0282e';

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

  const inputCls = 'h-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl border-cyan-500/30 bg-slate-800/80 backdrop-blur-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <Icon name={mode === 'login' ? 'Lock' : 'UserPlus'} size={32} className="text-white" />
          </div>
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
            DEAD SPACE
          </CardTitle>
          <CardDescription className="text-slate-300">
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
                <Icon name="Gift" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/60" />
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
              <div className="bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 text-sm text-red-400 flex items-center gap-2">
                <Icon name="AlertCircle" size={14} />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all disabled:opacity-50"
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
              className="text-sm text-cyan-400/70 hover:text-cyan-400 transition-colors underline underline-offset-4 decoration-cyan-500/30 hover:decoration-cyan-500/60"
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
