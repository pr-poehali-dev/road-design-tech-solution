import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface CRMAuthProps {
  password: string;
  setPassword: (password: string) => void;
  onLogin: (e: React.FormEvent) => void;
}

export const CRMAuth = ({ password, setPassword, onLogin }: CRMAuthProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl border-cyan-500/30 bg-slate-800/80 backdrop-blur-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <Icon name="Lock" size={32} className="text-white" />
          </div>
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">DEOD CRM</CardTitle>
          <CardDescription className="text-slate-300">Введите пароль для входа</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              required
            />
            <Button type="submit" className="w-full h-10 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all">
              Войти
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-10 border-slate-600 text-slate-300 hover:bg-slate-700/50"
              onClick={() => navigate('/')}
            >
              На главную
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
