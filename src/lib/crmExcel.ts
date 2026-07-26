import ExcelJS from 'exceljs';
import { Lead } from '@/components/crm/CRMKanban';

const COLUMNS = [
  { header: 'Название/ФИО', key: 'name', width: 25 },
  { header: 'Компания', key: 'company', width: 25 },
  { header: 'Юр. название', key: 'legal_name', width: 28 },
  { header: 'Email', key: 'email', width: 25 },
  { header: 'Телефон', key: 'phone', width: 18 },
  { header: 'Этап', key: 'status', width: 22 },
  { header: 'Сумма сделки', key: 'deal_amount', width: 16 },
  { header: 'Оборот', key: 'revenue', width: 16 },
  { header: 'Плановый оборот', key: 'planned_revenue', width: 18 },
  { header: 'Контракт', key: 'contract_amount', width: 16 },
  { header: 'Поступления', key: 'received_amount', width: 16 },
  { header: 'Примечание', key: 'message', width: 35 },
];

export async function exportLeadsToExcel(leads: Lead[], stageLabels: Record<string, string>, filename = 'Воронка_сделок.xlsx') {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Сделки');
  sheet.columns = COLUMNS;

  leads.forEach((lead) => {
    sheet.addRow({
      name: lead.name,
      company: lead.company || '',
      legal_name: lead.legal_name || '',
      email: lead.email,
      phone: lead.phone || '',
      status: stageLabels[lead.status] || lead.status,
      deal_amount: lead.deal_amount || 0,
      revenue: lead.revenue || 0,
      planned_revenue: lead.planned_revenue || 0,
      contract_amount: lead.contract_amount || 0,
      received_amount: lead.received_amount || 0,
      message: lead.message || '',
    });
  });

  sheet.getRow(1).font = { bold: true, color: { argb: 'FF66FCF1' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2833' } };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export interface ImportedRow {
  company_name: string;
  contact_name: string;
  legal_name: string;
  email: string;
  phone: string;
  stage: string;
  deal_amount: number;
  revenue: number;
  planned_revenue: number;
  contract_amount: number;
  received_amount: number;
  notes: string;
}

const HEADER_MAP: Record<string, keyof ImportedRow> = {
  'название/фио': 'contact_name',
  'название': 'contact_name',
  'фио': 'contact_name',
  'компания': 'company_name',
  'юр. название': 'legal_name',
  'юр название': 'legal_name',
  'email': 'email',
  'телефон': 'phone',
  'этап': 'stage',
  'сумма сделки': 'deal_amount',
  'оборот': 'revenue',
  'плановый оборот': 'planned_revenue',
  'контракт': 'contract_amount',
  'поступления': 'received_amount',
  'примечание': 'notes',
};

export async function importLeadsFromExcel(file: File): Promise<Partial<ImportedRow>[]> {
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.worksheets[0];
  if (!sheet) return [];

  const headerRow = sheet.getRow(1);
  const colMap: Record<number, keyof ImportedRow> = {};
  headerRow.eachCell((cell, colNumber) => {
    const key = String(cell.value || '').trim().toLowerCase();
    if (HEADER_MAP[key]) colMap[colNumber] = HEADER_MAP[key];
  });

  const rows: Partial<ImportedRow>[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const rowData: Partial<ImportedRow> = {};
    row.eachCell((cell, colNumber) => {
      const field = colMap[colNumber];
      if (!field) return;
      const value = cell.value;
      if (['deal_amount', 'revenue', 'planned_revenue', 'contract_amount', 'received_amount'].includes(field)) {
        (rowData as any)[field] = Number(value) || 0;
      } else {
        (rowData as any)[field] = value != null ? String(value) : '';
      }
    });
    if (Object.keys(rowData).length > 0) rows.push(rowData);
  });

  return rows;
}
