const BRIDGE_URL = 'https://functions.poehali.dev/29c0dd7a-f662-4bf9-992a-36612d3361d9';

export type BridgeChannel = 'email' | 'telegram' | 'max';

export interface BridgeMessage {
  id: number;
  partner_id: number;
  client_id: number | null;
  channel: BridgeChannel;
  direction: 'in' | 'out';
  sender_name: string | null;
  subject: string | null;
  body: string | null;
  email_from: string | null;
  email_to: string | null;
  telegram_chat_id: string | null;
  telegram_username: string | null;
  is_read: boolean;
  created_at: string;
}

export interface BridgeConversation {
  client_id: number;
  company_name: string;
  contact_person: string;
  email: string | null;
  phone: string | null;
  telegram_chat_id: string | null;
  telegram_username: string | null;
  unread_messages_count: number;
  last_message_at: string | null;
  last_channel: BridgeChannel;
  last_message: string | null;
  last_direction: 'in' | 'out';
  last_message_created_at: string;
}

function getPartnerId(): number | null {
  try {
    const raw = localStorage.getItem('userProfile');
    if (!raw) return null;
    const profile = JSON.parse(raw);
    return profile?.id ?? null;
  } catch {
    return null;
  }
}

async function call(url: string, options: RequestInit = {}): Promise<any> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers as any) },
  });
  let data: any = {};
  try {
    data = await res.json();
  } catch {
    if (!res.ok) throw new Error(`Ошибка ${res.status}`);
    return data;
  }
  if (!res.ok) throw new Error(data.error || `Ошибка ${res.status}`);
  return data;
}

export const bridgeApi = {
  getPartnerId,

  getConversations: (channel?: BridgeChannel): Promise<{ conversations: BridgeConversation[] }> => {
    const pid = getPartnerId();
    const q = channel ? `&channel=${channel}` : '';
    return call(`${BRIDGE_URL}?resource=conversations&partner_id=${pid}${q}`);
  },

  getMessages: (client_id: number, channel?: BridgeChannel): Promise<{ messages: BridgeMessage[] }> => {
    const q = channel ? `&channel=${channel}` : '';
    return call(`${BRIDGE_URL}?resource=messages&client_id=${client_id}${q}`);
  },

  sendEmail: (payload: { client_id?: number; subject?: string; body: string; to?: string }) => {
    const pid = getPartnerId();
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'send_email', partner_id: pid, ...payload }) });
  },

  sendTelegram: (payload: { client_id: number; body: string }) => {
    const pid = getPartnerId();
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'send_telegram', partner_id: pid, ...payload }) });
  },

  syncEmail: () => {
    const pid = getPartnerId();
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'sync_email', partner_id: pid }) });
  },

  markRead: (client_id: number) => {
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'mark_read', client_id }) });
  },
};
