import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { crewApi, CrewMember, getToken, setToken, clearToken } from '@/lib/crewApi';

interface AuthCtx {
  me: CrewMember | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, callsign: string, invite?: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export const useCrewAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCrewAuth must be used within CrewAuthProvider');
  return c;
};

export const CrewAuthProvider = ({ children }: { children: ReactNode }) => {
  const [me, setMe] = useState<CrewMember | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setMe(null);
      setLoading(false);
      return;
    }
    try {
      const res = await crewApi.me();
      setMe(res.member);
    } catch {
      clearToken();
      setMe(null);
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
    setMe(null);
  };

  return <Ctx.Provider value={{ me, loading, login, register, logout, refresh }}>{children}</Ctx.Provider>;
};