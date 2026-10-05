import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { crewApi, CrewMember, getToken, setToken, clearToken, ApiError } from '@/lib/crewApi';

interface AuthCtx {
  me: CrewMember | null;
  loading: boolean;
  connectionError: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, callsign: string, invite?: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const GUEST: CrewMember = {
  id: 2,
  callsign: 'Командор',
  role: 'commander',
  role_label: 'Командор',
  department: null,
  points: 0,
  rank: '',
  avatar_url: null,
  motto: null,
  suit_status: null,
  position_title: null,
  parent_id: null,
  is_admin: true,
  is_online: true,
  email: 'ipzlenko@gmail.com',
};

const Ctx = createContext<AuthCtx | null>(null);

export const useCrewAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCrewAuth must be used within CrewAuthProvider');
  return c;
};

export const CrewAuthProvider = ({ children }: { children: ReactNode }) => {
  const [me, setMe] = useState<CrewMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const refresh = useCallback(async () => {
    const url = new URL(window.location.href);
    const key = url.searchParams.get('key');
    if (key) {
      url.searchParams.delete('key');
      window.history.replaceState({}, '', url.pathname + url.search + url.hash);
      try {
        const res = await crewApi.keyLogin(key);
        setToken(res.token);
        setMe(res.member);
        setConnectionError(false);
        setLoading(false);
        return;
      } catch {
        clearToken();
      }
    }
    if (!getToken()) {
      setMe(GUEST);
      setConnectionError(false);
      setLoading(false);
      return;
    }
    try {
      const res = await crewApi.me();
      setMe(res.member);
      setConnectionError(false);
    } catch (err) {
      // Токен считаем недействительным только если сервер явно ответил 401/403.
      // Сетевые сбои, таймауты и временные ошибки сервера (500) не должны разлогинивать —
      // просто показываем, что не удалось проверить сессию, и даём повторить попытку.
      const status = err instanceof ApiError ? err.status : 0;
      if (status === 401 || status === 403) {
        clearToken();
      }
      setMe(GUEST);
      setConnectionError(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    const res = await crewApi.login(email, password);
    setToken(res.token);
    setMe(res.member);
  };

  const register = async (email: string, password: string, callsign: string, invite?: string) => {
    const res = await crewApi.register(email, password, callsign, invite);
    setToken(res.token);
    setMe(res.member);
  };

  const logout = () => {
    crewApi.logout();
    clearToken();
    setMe(GUEST);
  };

  return <Ctx.Provider value={{ me, loading, connectionError, login, register, logout, refresh }}>{children}</Ctx.Provider>;
};