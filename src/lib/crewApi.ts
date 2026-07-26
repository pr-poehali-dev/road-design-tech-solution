const CREW_URL = 'https://functions.poehali.dev/f9e0edfc-d11f-4fd0-9b7d-6560ff825ba6';
const CHAT_URL = 'https://functions.poehali.dev/cf9d0069-c5f0-404a-ae54-f4f9da017900';
const TASKS_URL = 'https://functions.poehali.dev/e759fe81-2fc9-4a30-8840-e13b63f75d0c';

export const PRIORITY_LABELS: Record<string, string> = {
  critical: 'Критическая угроза',
  high: 'Высокая угроза',
  medium: 'Средняя угроза',
  low: 'Низкая угроза',
};

export const STATUS_LABELS: Record<string, string> = {
  planned: 'На старте',
  in_progress: 'В зоне поражения',
  review: 'На подтверждении',
  done: 'Миссия выполнена',
  failed: 'Провалено',
};

export interface CrewTask {
  id: number;
  title: string;
  comment: string | null;
  deadline: string | null;
  priority: string;
  priority_label: string;
  status: string;
  status_label: string;
  assignee_id: number | null;
  assignee_callsign: string | null;
  assignee_avatar: string | null;
  created_by: number | null;
  creator_callsign: string | null;
  reminder_at: string | null;
  ai_analysis: string | null;
  created_at: string;
  updated_at: string;
}

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
  position_title: string | null;
  parent_id: number | null;
  is_admin: boolean;
  is_online: boolean;
  email?: string;
  created_at?: string;
}

export interface Recipient {
  id: number;
  callsign: string;
  avatar_url: string | null;
  role: string;
  is_online: boolean;
  unread: number;
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
  file_url?: string | null;
  file_name?: string | null;
  file_mime?: string | null;
  file_size?: number | null;
  depo_path?: string | null;
}

export interface ChatFilePayload {
  file_data?: string;
  file_url?: string;
  file_name?: string;
  file_mime?: string;
  file_size?: number;
  depo_path?: string;
}

export interface DepoFolder {
  id: number;
  name: string;
  parent_id: number | null;
  kind: string;
  is_public: boolean;
  file_count?: number;
  sub_count?: number;
}

export interface DepoFile {
  id: number;
  folder_id: number | null;
  name: string;
  url: string;
  mime: string | null;
  size_bytes: number;
  description: string | null;
  tags: string[];
  ai_summary: string | null;
  owner_id: number | null;
  owner_name?: string | null;
  is_public: boolean;
  path?: string;
  created_at: string;
  updated_at: string;
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

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function call(url: string, options: RequestInit = {}, auth = true): Promise<any> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as any) };
  if (auth) {
    const t = getToken();
    if (t) headers['X-Auth-Token'] = t;
  }
  const res = await fetch(url, { ...options, headers });
  let data: any = {};
  try {
    data = await res.json();
  } catch {
    // невалидный/пустой JSON — не считаем это ошибкой авторизации
    if (!res.ok) throw new ApiError(`Ошибка ${res.status}`, res.status);
    return data;
  }
  if (!res.ok) throw new ApiError(data.error || `Ошибка ${res.status}`, res.status);
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

  // org structure
  orgTree: () => call(`${CREW_URL}?action=org_tree`),

  setParent: (member_id: number, parent_id: number | null) =>
    call(CREW_URL, { method: 'POST', body: JSON.stringify({ action: 'set_parent', member_id, parent_id }) }),

  setPosition: (member_id: number, position_title: string, department?: string) =>
    call(CREW_URL, { method: 'POST', body: JSON.stringify({ action: 'set_position', member_id, position_title, department }) }),

  uploadAvatar: (image: string, member_id?: number) =>
    call(CREW_URL, { method: 'POST', body: JSON.stringify({ action: 'upload_avatar', image, member_id }) }),

  fire: (member_id: number, reason?: string) =>
    call(CREW_URL, { method: 'POST', body: JSON.stringify({ action: 'fire', member_id, reason }) }),

  logout: () => call(CREW_URL, { method: 'POST', body: JSON.stringify({ action: 'logout' }) }).catch(() => {}),

  // chat channels
  getChannels: () => call(`${CHAT_URL}?action=channels`),

  getMessages: (channel: string, after = 0) =>
    call(`${CHAT_URL}?action=messages&channel=${channel}&after=${after}`),

  sendMessage: (channel: string, text: string, file?: ChatFilePayload) =>
    call(CHAT_URL, { method: 'POST', body: JSON.stringify({ channel, text, ...(file || {}) }) }),

  // direct messages
  getRecipients: () => call(`${CHAT_URL}?action=recipients`),

  getDM: (withId: number, after = 0) =>
    call(`${CHAT_URL}?action=dm&with=${withId}&after=${after}`),

  sendDM: (recipient_id: number, text: string, file?: ChatFilePayload) =>
    call(CHAT_URL, { method: 'POST', body: JSON.stringify({ recipient_id, text, ...(file || {}) }) }),
};

const DEPO_URL = 'https://functions.poehali.dev/0e05d2cd-6312-4f14-bf4f-28492bc6e2bf';

export const depoApi = {
  folders: (parentId?: number | null) =>
    call(`${DEPO_URL}?action=folders${parentId ? `&parent_id=${parentId}` : ''}`),

  files: (folderId?: number | null) =>
    call(`${DEPO_URL}?action=files${folderId ? `&folder_id=${folderId}` : ''}`),

  file: (id: number) => call(`${DEPO_URL}?action=file&id=${id}`),

  createFolder: (name: string, parent_id: number | null, kind = 'folder') =>
    call(DEPO_URL, { method: 'POST', body: JSON.stringify({ action: 'create_folder', name, parent_id, kind }) }),

  upload: (payload: { name: string; folder_id: number | null; data: string; mime: string; description?: string; tags?: string[] }) =>
    call(DEPO_URL, { method: 'POST', body: JSON.stringify({ action: 'upload', ...payload }) }),

  updateFile: (id: number, fields: Partial<DepoFile>) =>
    call(DEPO_URL, { method: 'POST', body: JSON.stringify({ action: 'update_file', id, ...fields }) }),

  trashFile: (id: number) =>
    call(DEPO_URL, { method: 'POST', body: JSON.stringify({ action: 'trash_file', id }) }),

  search: (q: string) => call(`${DEPO_URL}?action=search&q=${encodeURIComponent(q)}`),

  aiSearch: (q: string) => call(`${DEPO_URL}?action=ai_search&q=${encodeURIComponent(q)}`),

  recent: (limit = 8) => call(`${DEPO_URL}?action=recent&limit=${limit}`),

  saveFromChat: (payload: { name: string; url: string; mime: string; size: number; folder_id: number | null; tags?: string[] }) =>
    call(DEPO_URL, { method: 'POST', body: JSON.stringify({ action: 'save_from_chat', ...payload }) }),

  activity: (fileId: number) => call(`${DEPO_URL}?action=activity&file_id=${fileId}`),
};

export const taskApi = {
  list: (assignee_id?: number, status?: string) => {
    const p = new URLSearchParams({ action: 'list' });
    if (assignee_id) p.set('assignee_id', String(assignee_id));
    if (status) p.set('status', status);
    return call(`${TASKS_URL}?${p.toString()}`);
  },

  create: (payload: { title: string; comment?: string; deadline?: string | null; priority?: string; assignee_id?: number | null; reminder_at?: string | null }) =>
    call(TASKS_URL, { method: 'POST', body: JSON.stringify({ action: 'create', ...payload }) }),

  update: (id: number, fields: Partial<CrewTask>) =>
    call(TASKS_URL, { method: 'POST', body: JSON.stringify({ action: 'update', id, ...fields }) }),

  remove: (id: number) =>
    call(TASKS_URL, { method: 'POST', body: JSON.stringify({ action: 'delete', id }) }),

  aiAnalyze: (id: number) =>
    call(TASKS_URL, { method: 'POST', body: JSON.stringify({ action: 'ai_analyze', id }) }),
};