const CRM_URL = 'https://functions.poehali.dev/fd1c95d9-d394-4d33-af98-1d5a05163881';

export interface Stage {
  id: number;
  partner_id: number;
  stage_key: string;
  label: string;
  sort_order: number;
  color: string;
  text_color: string;
  is_closed_won: boolean;
  is_closed_lost: boolean;
}

export interface Contact {
  id: number;
  client_id: number;
  full_name: string;
  position_title: string | null;
  phone: string | null;
  email: string | null;
  is_decision_maker: boolean;
}

export interface CrmDocument {
  id: number;
  client_id: number;
  depo_file_id: number | null;
  name: string;
  url: string;
  mime: string | null;
  size_bytes: number;
  created_at: string;
}

export interface CustomField {
  id: number;
  field_key: string;
  label: string;
  field_type: string;
  sort_order: number;
}

export interface CustomFieldValue extends CustomField {
  field_id: number;
  value: string | null;
}

export interface AnalyticsFunnelStage {
  stage_key: string;
  label: string;
  count: number;
  total_amount: number;
}

export interface AnalyticsConversion {
  from: string;
  to: string;
  rate: number;
}

export interface Analytics {
  funnel: AnalyticsFunnelStage[];
  conversions: AnalyticsConversion[];
  task_stats: { overdue: number; upcoming: number; open_total: number; completed_total: number };
  stale_deals: number;
  overall_conversion: number;
  recommendations: string[];
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

export const crmApi = {
  getPartnerId,

  createQuickTask: (payload: { client_id: number; title: string; due_date?: string; priority?: string }) => {
    const pid = getPartnerId();
    return call(CRM_URL, { method: 'POST', body: JSON.stringify({ resource: 'task', partner_id: pid, data: payload }) });
  },

  // stages
  getStages: (): Promise<{ stages: Stage[] }> => {
    const pid = getPartnerId();
    return call(`${CRM_URL}?resource=stages&partner_id=${pid}`);
  },

  createStage: (label: string, color?: string, text_color?: string) => {
    const pid = getPartnerId();
    return call(CRM_URL, { method: 'POST', body: JSON.stringify({ resource: 'stage', partner_id: pid, label, color, text_color }) });
  },

  updateStage: (id: number, updates: Partial<Pick<Stage, 'label' | 'color' | 'text_color'>>) => {
    const pid = getPartnerId();
    return call(CRM_URL, { method: 'PUT', body: JSON.stringify({ resource: 'stage', partner_id: pid, id, updates }) });
  },

  deleteStage: (id: number) => {
    const pid = getPartnerId();
    return call(`${CRM_URL}?resource=stage&partner_id=${pid}&id=${id}`, { method: 'DELETE' });
  },

  reorderStages: (order: number[]) => {
    const pid = getPartnerId();
    return call(CRM_URL, { method: 'PUT', body: JSON.stringify({ resource: 'stages_reorder', partner_id: pid, order }) });
  },

  // contacts
  getContacts: (client_id: number): Promise<{ contacts: Contact[] }> => {
    const pid = getPartnerId();
    return call(`${CRM_URL}?resource=contacts&partner_id=${pid}&client_id=${client_id}`);
  },

  createContact: (payload: { client_id: number; full_name: string; position_title?: string; phone?: string; email?: string; is_decision_maker?: boolean }) => {
    const pid = getPartnerId();
    return call(CRM_URL, { method: 'POST', body: JSON.stringify({ resource: 'contact', partner_id: pid, ...payload }) });
  },

  updateContact: (id: number, updates: Partial<Contact>) => {
    const pid = getPartnerId();
    return call(CRM_URL, { method: 'PUT', body: JSON.stringify({ resource: 'contact', partner_id: pid, id, updates }) });
  },

  deleteContact: (id: number) => {
    const pid = getPartnerId();
    return call(`${CRM_URL}?resource=contact&partner_id=${pid}&id=${id}`, { method: 'DELETE' });
  },

  // documents
  getDocuments: (client_id: number): Promise<{ documents: CrmDocument[] }> => {
    const pid = getPartnerId();
    return call(`${CRM_URL}?resource=documents&partner_id=${pid}&client_id=${client_id}`);
  },

  createDocument: (payload: { client_id: number; name: string; url: string; mime?: string; size_bytes?: number; depo_file_id?: number }) => {
    const pid = getPartnerId();
    return call(CRM_URL, { method: 'POST', body: JSON.stringify({ resource: 'document', partner_id: pid, ...payload }) });
  },

  deleteDocument: (id: number) => {
    const pid = getPartnerId();
    return call(`${CRM_URL}?resource=document&partner_id=${pid}&id=${id}`, { method: 'DELETE' });
  },

  uploadDocument: (payload: { client_id: number; name: string; data: string; mime: string }) => {
    const pid = getPartnerId();
    return call(CRM_URL, { method: 'POST', body: JSON.stringify({ resource: 'upload_document', partner_id: pid, ...payload }) });
  },

  // custom fields
  getCustomFields: (): Promise<{ custom_fields: CustomField[] }> => {
    const pid = getPartnerId();
    return call(`${CRM_URL}?resource=custom_fields&partner_id=${pid}`);
  },

  createCustomField: (payload: { label: string; field_type?: string; client_id?: number; value?: string }) => {
    const pid = getPartnerId();
    return call(CRM_URL, { method: 'POST', body: JSON.stringify({ resource: 'custom_field', partner_id: pid, ...payload }) });
  },

  setCustomFieldValue: (client_id: number, field_id: number, value: string) => {
    const pid = getPartnerId();
    return call(CRM_URL, { method: 'POST', body: JSON.stringify({ resource: 'custom_field_value', partner_id: pid, client_id, field_id, value }) });
  },

  // bulk import
  bulkImport: (rows: Record<string, unknown>[]) => {
    const pid = getPartnerId();
    return call(CRM_URL, { method: 'POST', body: JSON.stringify({ resource: 'bulk_import', partner_id: pid, rows }) });
  },

  // analytics
  getAnalytics: (): Promise<Analytics> => {
    const pid = getPartnerId();
    return call(`${CRM_URL}?resource=analytics&partner_id=${pid}`);
  },
};
