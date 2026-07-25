const CREW_URL = 'https://functions.poehali.dev/f9e0edfc-d11f-4fd0-9b7d-6560ff825ba6';
const CHAT_URL = 'https://functions.poehali.dev/cf9d0069-c5f0-404a-ae54-f4f9da017900';

export const ROLE_LABELS: Record<string, string> = {
  engineer: 'Инженер',
  sales: 'Продажник',
  accountant: 'Бухгалтер',
  marketer: 'Маркетолог',
  admin: 'Администратор',
  lead: 'Руководитель',
  universal: 'Универсал',
};

export interface CrewMember {
  id: number;
  callsign: string;
  role: string;
  role_label: string;
  department: string | null;
  points: number;
  rank: string;
  avatar_url: string | null;
  motto: string | null;
  suit_status: string | null;
  is_admin: boolean;
  is_online: boolean;
  email?: string;
  created_at?: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  created_at: string;
  member_id: number;
  callsign: string;
  avatar_url: string | null;
  role: string;
  mine: boolean;
}

export interface ChatChannel {
  id: number;
  slug: string;
  name: string;
  icon: string;
}

const TOKEN_KEY = 'deod_crew_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function call(url: string, options: RequestInit = {}, auth = true): Promise<any> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as any) };
  if (auth) {
    const t = getToken();
    if (t) headers['X-Auth-Token'] = t;
  }
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Ошибка ${res.status}`);
  return data;
}

export const crewApi = {
  register: (email: string, password: string, callsign: string, invite_code?: string) =>
    call(CREW_URL, { method: 'POST', body: JSON.stringify({ action: 'register', email, password, callsign, invite_code }) }, false),

  login: (email: string, password: string) =>
    call(CREW_URL, { method: 'POST', body: JSON.stringify({ action: 'login', email, password }) }, false),

  me: () => call(`${CREW_URL}?action=me`),

  list: (role?: string, search?: string) => {
    const p = new URLSearchParams({ action: 'list' });
    if (role) p.set('role', role);
    if (search) p.set('search', search);
    return call(`${CREW_URL}?${p.toString()}`);
  },

  profile: (id: number) => call(`${CREW_URL}?action=profile&id=${id}`),

  pointsHistory: (id: number) => call(`${CREW_URL}?action=points_history&id=${id}`),

  updateProfile: (fields: Partial<CrewMember>) =>
    call(CREW_URL, { method: 'POST', body: JSON.stringify({ action: 'update_profile', ...fields }) }),

  addPoints: (member_id: number, delta: number, reason: string) =>
    call(CREW_URL, { method: 'POST', body: JSON.stringify({ action: 'add_points', member_id, delta, reason }) }),

  setRole: (member_id: number, role: string) =>
    call(CREW_URL, { method: 'POST', body: JSON.stringify({ action: 'set_role', member_id, role }) }),

  createInvite: (role: string, department: string, max_uses: number, ttl_days: number | null) =>
    call(CREW_URL, { method: 'POST', body: JSON.stringify({ action: 'create_invite', role, department, max_uses, ttl_days }) }),

  listInvites: () => call(`${CREW_URL}?action=list_invites`),

  // chat
  getChannels: () => call(`${CHAT_URL}?action=channels`),

  getMessages: (channel: string, after = 0) =>
    call(`${CHAT_URL}?action=messages&channel=${channel}&after=${after}`),

  sendMessage: (channel: string, text: string) =>
    call(CHAT_URL, { method: 'POST', body: JSON.stringify({ channel, text }) }),
};
