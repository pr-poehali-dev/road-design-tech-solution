import { Lead } from './CRMKanban';
import Icon from '@/components/ui/icon';

interface CRMListViewProps {
  leads: Lead[];
  stageLabels: Record<string, string>;
  onLeadClick: (lead: Lead) => void;
}

const isOverdue = (dueDate?: string, status?: string) => {
  if (!dueDate || status === 'completed') return false;
  return new Date(dueDate).getTime() < Date.now();
};

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('ru-RU') : '—');

export const CRMListView = ({ leads, stageLabels, onLeadClick }: CRMListViewProps) => {
  return (
    <div className="p-4 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-[#45A29E]/30 text-left text-[#66FCF1] text-xs uppercase tracking-wider">
            <th className="py-2 px-3">Сделка</th>
            <th className="py-2 px-3">ЛПР</th>
            <th className="py-2 px-3">Телефон</th>
            <th className="py-2 px-3">Этап</th>
            <th className="py-2 px-3">Последний манёвр</th>
            <th className="py-2 px-3">Следующий манёвр</th>
            <th className="py-2 px-3 text-right">Сумма</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const overdue = isOverdue(lead.open_task_due_date, lead.open_task_status);
            return (
              <tr
                key={lead.id}
                onClick={() => onLeadClick(lead)}
                className={`border-b border-[#45A29E]/10 cursor-pointer hover:bg-[#45A29E]/5 transition-colors ${overdue ? 'bg-[#FF4D4D]/5' : ''}`}
              >
                <td className="py-2.5 px-3">
                  <div className="font-medium text-white">{lead.name || lead.company || '—'}</div>
                  {lead.company && <div className="text-xs text-[#8B98A5]">{lead.company}</div>}
                </td>
                <td className="py-2.5 px-3 text-[#C5C6C7]">{lead.decision_maker_name || '—'}</td>
                <td className="py-2.5 px-3 text-[#C5C6C7]">{lead.decision_maker_phone || lead.phone || '—'}</td>
                <td className="py-2.5 px-3">
                  <span className="text-xs px-2 py-1 rounded-md bg-[#45A29E]/10 text-[#66FCF1]">
                    {stageLabels[lead.status] || lead.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-[#8B98A5] text-xs">{fmtDate(lead.last_action_at)}</td>
                <td className="py-2.5 px-3">
                  {overdue ? (
                    <span className="flex items-center gap-1 text-xs text-[#FF9B9B] font-bold">
                      <Icon name="AlertTriangle" size={12} /> {fmtDate(lead.open_task_due_date)}
                    </span>
                  ) : (
                    <span className="text-xs text-[#8B98A5]">{fmtDate(lead.open_task_due_date || lead.next_action_at)}</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-[#66FCF1]">
                  {(lead.deal_amount ?? 0) > 0 ? `${Number(lead.deal_amount).toLocaleString()} ₽` : '—'}
                </td>
              </tr>
            );
          })}
          {leads.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-10 text-[#6B7684]">Сделок не найдено</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CRMListView;
