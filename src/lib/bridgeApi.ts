const BRIDGE_URL = 'https://functions.poehali.dev/29c0dd7a-f662-4bf9-992a-36612d3361d9';

export type BridgeChannel = 'email' | 'telegram' | 'max';

export interface BridgeAttachment {
  id: number;
  message_id: number;
  file_name: string;
  mime: string | null;
  size_bytes: number | null;
  url: string;
  created_at: string;
}

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
  mailbox: string | null;
  telegram_chat_id: string | null;
  telegram_username: string | null;
  is_read: boolean;
  created_at: string;
  attachments: BridgeAttachment[];
  company_name?: string;
  contact_person?: string;
  folder_id?: number | null;
  folder_name?: string | null;
  folder_color?: string | null;
  email_message_id?: string | null;
  email_in_reply_to?: string | null;
  email_cc?: string | null;
  email_to_all?: string | null;
}

export interface BridgeFolder {
  id: number;
  partner_id: number;
  name: string;
  color: string;
  sort_order: number;
  created_at: string;
  messages_count: number;
  rule_addresses: string[];
}

export interface BridgeSignature {
  id: number;
  partner_id: number;
  name: string;
  html: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface BridgeNotification {
  id: number;
  subject: string | null;
  sender_name: string | null;
  email_from: string | null;
  client_id: number | null;
  folder_name: string | null;
  folder_color: string | null;
}

export interface BridgeDepoFileInput {
  name: string;
  mime: string;
  url: string;
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
  auto_created: boolean;
  last_channel: BridgeChannel;
  last_message: string | null;
  last_direction: 'in' | 'out';
  last_mailbox: string | null;
  last_message_created_at: string;
}

export interface BridgeAttachmentInput {
  name: string;
  mime: string;
  data: string; // data URL (base64)
}

// Аккаунт CRM, к которому привязан модуль "Радужный мост" на главном экране станции (/deod-space).
// Используется как запасной partner_id там, где нет localStorage-сессии CRM (crew-аутентификация).
export const DEOD_SPACE_PARTNER_ID = 14;

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

  getConversations: (channel?: BridgeChannel, mailbox?: string, partnerId?: number): Promise<{ conversations: BridgeConversation[] }> => {
    const pid = partnerId ?? getPartnerId();
    const q = (channel ? `&channel=${channel}` : '') + (mailbox ? `&mailbox=${encodeURIComponent(mailbox)}` : '');
    return call(`${BRIDGE_URL}?resource=conversations&partner_id=${pid}${q}`);
  },

  getMessages: (client_id: number, channel?: BridgeChannel): Promise<{ messages: BridgeMessage[] }> => {
    const q = channel ? `&channel=${channel}` : '';
    return call(`${BRIDGE_URL}?resource=messages&client_id=${client_id}${q}`);
  },

  getEmailList: (direction: 'in' | 'out', mailbox?: string, limit?: number, partnerId?: number, folderId?: number | 'none' | null): Promise<{ messages: BridgeMessage[] }> => {
    const pid = partnerId ?? getPartnerId();
    const q =
      (mailbox ? `&mailbox=${encodeURIComponent(mailbox)}` : '') +
      (limit ? `&limit=${limit}` : '') +
      (folderId ? `&folder_id=${folderId}` : '');
    return call(`${BRIDGE_URL}?resource=email_list&partner_id=${pid}&direction=${direction}${q}`);
  },

  getMailboxes: (): Promise<{ mailboxes: { address: string }[] }> => {
    return call(`${BRIDGE_URL}?resource=mailboxes`);
  },

  sendEmail: (
    payload: {
      client_id?: number;
      subject?: string;
      body: string;
      to?: string | string[];
      cc?: string | string[];
      mailbox?: string;
      attachments?: BridgeAttachmentInput[];
      depo_files?: BridgeDepoFileInput[];
      reply_to_message_id?: number;
      signature_id?: number | null;
      create_lead?: boolean;
    },
    partnerId?: number,
  ): Promise<{ success: boolean; message: BridgeMessage; client_id: number | null }> => {
    const pid = partnerId ?? getPartnerId();
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'send_email', partner_id: pid, ...payload }) });
  },

  getFolders: (partnerId?: number): Promise<{ folders: BridgeFolder[] }> => {
    const pid = partnerId ?? getPartnerId();
    return call(`${BRIDGE_URL}?resource=folders&partner_id=${pid}`);
  },

  saveFolder: (payload: { id?: number; name: string; color?: string }, partnerId?: number): Promise<{ folder: BridgeFolder }> => {
    const pid = partnerId ?? getPartnerId();
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'save_folder', partner_id: pid, ...payload }) });
  },

  moveMessage: (payload: { message_id: number; folder_id: number | null; apply_rule?: boolean }, partnerId?: number) => {
    const pid = partnerId ?? getPartnerId();
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'move_message', partner_id: pid, ...payload }) });
  },

  getSignatures: (partnerId?: number): Promise<{ signatures: BridgeSignature[] }> => {
    const pid = partnerId ?? getPartnerId();
    return call(`${BRIDGE_URL}?resource=signatures&partner_id=${pid}`);
  },

  saveSignature: (payload: { id?: number; name: string; html: string; is_default?: boolean }, partnerId?: number): Promise<{ signature: BridgeSignature }> => {
    const pid = partnerId ?? getPartnerId();
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'save_signature', partner_id: pid, ...payload }) });
  },

  uploadSignatureImage: (payload: { name: string; mime: string; data: string }): Promise<{ url: string }> => {
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'upload_signature_image', ...payload }) });
  },

  getNotifications: (partnerId?: number): Promise<{ notifications: BridgeNotification[] }> => {
    const pid = partnerId ?? getPartnerId();
    return call(`${BRIDGE_URL}?resource=notifications&partner_id=${pid}`);
  },

  sendTelegram: (payload: { client_id: number; body: string }, partnerId?: number) => {
    const pid = partnerId ?? getPartnerId();
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'send_telegram', partner_id: pid, ...payload }) });
  },

  syncEmail: (partnerId?: number) => {
    const pid = partnerId ?? getPartnerId();
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'sync_email', partner_id: pid }) });
  },

  markRead: (client_id: number) => {
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'mark_read', client_id }) });
  },

  importRange: (payload: { mailbox: string; date_from: string; date_to: string }) => {
    const pid = getPartnerId();
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'import_range', partner_id: pid, ...payload }) });
  },

  getFolderMessages: (folderId: number, partnerId?: number): Promise<{ messages: BridgeMessage[] }> => {
    const pid = partnerId ?? getPartnerId();
    return call(`${BRIDGE_URL}?resource=folder_messages&partner_id=${pid}&folder_id=${folderId}`);
  },

  deleteMessage: (messageId: number, partnerId?: number) => {
    const pid = partnerId ?? getPartnerId();
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'delete_message', partner_id: pid, message_id: messageId }) });
  },

  deleteConversation: (clientId: number, partnerId?: number) => {
    const pid = partnerId ?? getPartnerId();
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'delete_conversation', partner_id: pid, client_id: clientId }) });
  },

  deleteFolder: (folderId: number, partnerId?: number) => {
    const pid = partnerId ?? getPartnerId();
    return call(BRIDGE_URL, { method: 'POST', body: JSON.stringify({ resource: 'delete_folder', partner_id: pid, folder_id: folderId }) });
  },
};