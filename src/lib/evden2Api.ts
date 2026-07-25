const EVDEN2_URL = 'https://functions.poehali.dev/bc2ee383-b7b8-4960-abef-37242287aa89';
const TELEGRAM_URL = 'https://functions.poehali.dev/6c6e200a-5525-49b2-95be-4b170a916141';
const BIDZAAR_URL = 'https://functions.poehali.dev/596db4ae-bbb0-48a2-afb3-f14643a1ff50';

export interface Deal {
  id: number;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  telegram_username: string;
  telegram_chat_id: string | null;
  object_address: string;
  work_type: string;
  phase: 'ether' | 'gravity' | 'docking' | 'foundation';
  budget: number;
  probability: number;
  health: 'green' | 'yellow' | 'red';
  source: string;
  bidzaar_purchase_id: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  open_impulses?: number;
  comments_count?: number;
  messages_count?: number;
}

export interface Impulse {
  id: number;
  deal_id: number;
  title: string;
  description: string;
  assignee: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'progress' | 'review' | 'done';
  due_date: string | null;
  source: string;
  created_at: string;
}

export interface Comment {
  id: number;
  deal_id: number;
  author: string;
  text: string;
  channel: string;
  tone: string;
  ai_summary: string;
  created_at: string;
}

export interface Message {
  id: number;
  deal_id: number;
  channel: string;
  direction: 'in' | 'out';
  sender_name: string;
  telegram_chat_id: string;
  text: string;
  created_at: string;
}

export interface Stats {
  total_deals: number;
  total_budget: number;
  by_phase: Record<string, number>;
  closed_impulses: number;
  open_impulses: number;
}

async function req<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return data;
}

export const evdenApi = {
  getDeals: (phase?: string) =>
    req<{ deals: Deal[] }>(`${EVDEN2_URL}?resource=deals${phase ? `&phase=${phase}` : ''}`),

  getAllImpulses: () => req<{ impulses: (Impulse & { deal_name: string })[] }>(`${EVDEN2_URL}?resource=impulses`),

  getDeal: (id: number) =>
    req<{ deal: Deal; impulses: Impulse[]; comments: Comment[]; messages: Message[] }>(
      `${EVDEN2_URL}?resource=deal&id=${id}`
    ),

  getStats: () => req<Stats>(`${EVDEN2_URL}?resource=stats`),

  createDeal: (data: Partial<Deal>) =>
    req<{ success: boolean; deal: Deal }>(EVDEN2_URL, {
      method: 'POST',
      body: JSON.stringify({ resource: 'deal', data }),
    }),

  updateDeal: (id: number, updates: Partial<Deal>) =>
    req<{ success: boolean; deal: Deal }>(EVDEN2_URL, {
      method: 'PUT',
      body: JSON.stringify({ resource: 'deal', id, updates }),
    }),

  deleteDeal: (id: number) =>
    req<{ success: boolean }>(`${EVDEN2_URL}?resource=deal&id=${id}`, { method: 'DELETE' }),

  createImpulse: (data: Partial<Impulse>) =>
    req<{ success: boolean; impulse: Impulse }>(EVDEN2_URL, {
      method: 'POST',
      body: JSON.stringify({ resource: 'impulse', data }),
    }),

  updateImpulse: (id: number, updates: Partial<Impulse>) =>
    req<{ success: boolean; impulse: Impulse }>(EVDEN2_URL, {
      method: 'PUT',
      body: JSON.stringify({ resource: 'impulse', id, updates }),
    }),

  deleteImpulse: (id: number) =>
    req<{ success: boolean }>(`${EVDEN2_URL}?resource=impulse&id=${id}`, { method: 'DELETE' }),

  createComment: (dealId: number, text: string, author = 'Менеджер', channel = 'internal') =>
    req<{ success: boolean; comment: Comment; ai_analysis: any; created_impulses: Impulse[] }>(EVDEN2_URL, {
      method: 'POST',
      body: JSON.stringify({ resource: 'comment', data: { deal_id: dealId, text, author, channel } }),
    }),

  voiceCommand: (transcript: string) =>
    req<{ success: boolean; action: string; reply: string; executed: any }>(EVDEN2_URL, {
      method: 'POST',
      body: JSON.stringify({ resource: 'voice-command', transcript }),
    }),

  sendTelegramMessage: (dealId: number, text: string) =>
    req<{ success: boolean; message: Message }>(TELEGRAM_URL, {
      method: 'POST',
      body: JSON.stringify({ resource: 'send', deal_id: dealId, text }),
    }),

  getMessages: (dealId: number) =>
    req<{ messages: Message[] }>(`${TELEGRAM_URL}?deal_id=${dealId}`),

  fetchBidzaar: (pageSize = 20) =>
    req<{ purchases: any[]; total_from_api: number }>(`${BIDZAAR_URL}?pageSize=${pageSize}`),

  importBidzaar: (purchaseId: string) =>
    req<{ success: boolean; deal: Deal }>(BIDZAAR_URL, {
      method: 'POST',
      body: JSON.stringify({ resource: 'import', purchase_id: purchaseId }),
    }),
};

export const PHASE_LABELS: Record<string, { title: string; subtitle: string; icon: string; color: string }> = {
  ether: { title: 'Эфир', subtitle: 'Сбор лидов', icon: 'Radio', color: 'from-sky-500 to-cyan-400' },
  gravity: { title: 'Гравитация', subtitle: 'Интерес клиента', icon: 'Magnet', color: 'from-violet-500 to-purple-400' },
  docking: { title: 'Стыковка', subtitle: 'Переговоры', icon: 'Link2', color: 'from-amber-500 to-orange-400' },
  foundation: { title: 'Заливка фундамента', subtitle: 'В производстве', icon: 'HardHat', color: 'from-emerald-500 to-teal-400' },
};
