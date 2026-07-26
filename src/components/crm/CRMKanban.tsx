import { useState } from 'react';
import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent,
  PointerSensor, useSensor, useSensors, closestCorners,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

export interface Lead {
  id: string;
  type: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  legal_name?: string;
  message?: string;
  description?: string;
  status: string;
  createdAt: string;
  source: string;
  budget?: string;
  tags?: string[];
  manager?: string;
  deal_amount?: number;
  revenue?: number;
  planned_revenue?: number;
  contract_amount?: number;
  received_amount?: number;
  decision_maker_name?: string;
  decision_maker_phone?: string;
  open_task_title?: string;
  open_task_due_date?: string;
  open_task_status?: string;
  next_action_at?: string;
  last_action_at?: string;
}

export interface StageDef {
  id: string;
  label: string;
  dbId?: number;
}

interface CRMKanbanProps {
  leads: Lead[];
  statusStages: StageDef[];
  customColors: { [key: string]: { color: string; textColor: string } };
  showColorPicker: boolean;
  onLeadClick: (lead: Lead) => void;
  onCreateLeadInStage: (status: string) => void;
  onUpdateStageColor: (stageId: string, color: string, textColor: string) => void;
  onMoveLead: (leadId: string, newStatus: string) => void;
  onReorderStages: (newOrder: StageDef[]) => void;
  onRenameStage: (stageId: string, newLabel: string) => void;
  onAddStage: () => void;
  onDeleteStage: (stageId: string) => void;
}

const isOverdue = (dueDate?: string, status?: string) => {
  if (!dueDate || status === 'completed') return false;
  return new Date(dueDate).getTime() < Date.now();
};

const DealCard = ({ lead, onLeadClick }: { lead: Lead; onLeadClick: (lead: Lead) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `card-${lead.id}` });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };
  const overdue = isOverdue(lead.open_task_due_date, lead.open_task_status);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onLeadClick(lead)}
      className={`cursor-pointer rounded-lg bg-[#1F2833]/60 border p-3 hover:border-[#66FCF1]/50 transition-all touch-manipulation ${
        overdue ? 'border-[#FF4D4D] animate-pulse-red' : 'border-[#45A29E]/20'
      }`}
    >
      <div className="text-sm font-medium text-white leading-tight mb-1.5">{lead.name || lead.company || '—'}</div>
      <div className="space-y-1.5 text-xs">
        {lead.company && (
          <div className="flex items-center gap-1.5 text-[#66FCF1]">
            <Icon name="Building" size={12} />
            <span className="truncate">{lead.company}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-[#8B98A5]">
          <Icon name="Mail" size={12} />
          <span className="truncate">{lead.email}</span>
        </div>
        {lead.phone && (
          <div className="flex items-center gap-1.5 text-[#8B98A5]">
            <Icon name="Phone" size={12} />
            <span className="truncate">{lead.phone}</span>
          </div>
        )}
        {(lead.deal_amount ?? 0) > 0 && (
          <div className="flex items-center gap-1.5 text-[#66FCF1] font-medium">
            <Icon name="DollarSign" size={12} />
            <span>{Number(lead.deal_amount).toLocaleString()} ₽</span>
          </div>
        )}
        {lead.open_task_title && (
          <div className={`flex items-center gap-1.5 mt-1.5 rounded-md px-1.5 py-1 ${overdue ? 'bg-[#FF4D4D]/15 text-[#FF9B9B]' : 'bg-[#45A29E]/10 text-[#66FCF1]'}`}>
            <Icon name={overdue ? 'AlertTriangle' : 'ListTodo'} size={12} className="shrink-0" />
            <span className="truncate text-[10px]">{lead.open_task_title}</span>
          </div>
        )}
        <div className="text-[#6B7684] text-[10px] mt-1.5">
          {new Date(lead.createdAt).toLocaleDateString('ru-RU')}
        </div>
      </div>
    </div>
  );
};

const ColumnHeader = ({
  stage, stageColors, count, showColorPicker, editing, editLabel, setEditLabel,
  onStartEdit, onSaveEdit, onCancelEdit, onDelete, onColorChange, onCreate,
}: {
  stage: StageDef; stageColors: { color: string; textColor: string }; count: number; showColorPicker: boolean;
  editing: boolean; editLabel: string; setEditLabel: (v: string) => void;
  onStartEdit: () => void; onSaveEdit: () => void; onCancelEdit: () => void; onDelete: () => void;
  onColorChange: (color: string, textColor: string) => void; onCreate: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `col-${stage.id}` });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, backgroundColor: stageColors.color }}
      className="rounded-t-lg p-3 flex justify-between items-center shadow-[0_0_15px_rgba(102,252,241,0.15)]"
    >
      <div {...attributes} {...listeners} className="flex items-center gap-2 flex-1 min-w-0 cursor-grab active:cursor-grabbing">
        <Icon name="GripVertical" size={13} style={{ color: stageColors.textColor }} className="opacity-50 shrink-0" />
        {editing ? (
          <Input
            autoFocus
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSaveEdit(); if (e.key === 'Escape') onCancelEdit(); }}
            onBlur={onSaveEdit}
            onClick={(e) => e.stopPropagation()}
            className="h-6 text-xs bg-[#0B0C10]/60 border-white/20 text-white px-1.5"
          />
        ) : (
          <div className="text-sm font-medium truncate" style={{ color: stageColors.textColor }} onDoubleClick={onStartEdit}>
            {stage.label}
          </div>
        )}
        <Badge variant="secondary" className="h-5 px-1.5 text-xs font-semibold shrink-0" style={{ backgroundColor: `${stageColors.textColor}30`, color: stageColors.textColor }}>
          {count}
        </Badge>
      </div>
      <div className="flex gap-1 items-center shrink-0">
        {showColorPicker && (
          <div className="flex gap-1">
            <input type="color" value={stageColors.color} onChange={(e) => onColorChange(e.target.value, stageColors.textColor)} className="w-6 h-6 rounded cursor-pointer border border-white/20" title="Цвет фона" />
            <input type="color" value={stageColors.textColor} onChange={(e) => onColorChange(stageColors.color, e.target.value)} className="w-6 h-6 rounded cursor-pointer border border-white/20" title="Цвет текста" />
          </div>
        )}
        {!editing && (
          <Button size="sm" variant="ghost" onClick={onStartEdit} className="h-6 w-6 p-0 touch-manipulation" style={{ color: stageColors.textColor }} title="Переименовать">
            <Icon name="Pencil" size={12} />
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={onDelete} className="h-6 w-6 p-0 touch-manipulation text-[#FF9B9B]" title="Удалить этап">
          <Icon name="Trash2" size={12} />
        </Button>
        <Button size="sm" onClick={onCreate} className="h-6 w-6 p-0 touch-manipulation" style={{ backgroundColor: stageColors.textColor, color: stageColors.color }}>
          <Icon name="Plus" size={14} />
        </Button>
      </div>
    </div>
  );
};

export const CRMKanban = ({
  leads, statusStages, customColors, showColorPicker,
  onLeadClick, onCreateLeadInStage, onUpdateStageColor,
  onMoveLead, onReorderStages, onRenameStage, onAddStage, onDeleteStage,
}: CRMKanbanProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const getStageColors = (status: string) => customColors[status] || customColors['new'] || { color: '#1F2833', textColor: '#66FCF1' };

  const handleDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    if (activeIdStr.startsWith('col-')) {
      if (activeIdStr === overIdStr || !overIdStr.startsWith('col-')) return;
      const oldIndex = statusStages.findIndex((s) => `col-${s.id}` === activeIdStr);
      const newIndex = statusStages.findIndex((s) => `col-${s.id}` === overIdStr);
      if (oldIndex === -1 || newIndex === -1) return;
      onReorderStages(arrayMove(statusStages, oldIndex, newIndex));
      return;
    }

    if (activeIdStr.startsWith('card-')) {
      const leadId = activeIdStr.replace('card-', '');
      let targetStage: string | null = null;
      if (overIdStr.startsWith('col-')) {
        targetStage = overIdStr.replace('col-', '');
      } else if (overIdStr.startsWith('card-')) {
        const overLeadId = overIdStr.replace('card-', '');
        const overLead = leads.find((l) => l.id === overLeadId);
        targetStage = overLead?.status || null;
      }
      const lead = leads.find((l) => l.id === leadId);
      if (targetStage && lead && lead.status !== targetStage) {
        onMoveLead(leadId, targetStage);
      }
    }
  };

  const startEdit = (stage: StageDef) => { setEditingStage(stage.id); setEditLabel(stage.label); };
  const saveEdit = () => {
    if (editingStage && editLabel.trim()) onRenameStage(editingStage, editLabel.trim());
    setEditingStage(null);
  };

  const activeLead = activeId?.startsWith('card-') ? leads.find((l) => l.id === activeId.replace('card-', '')) : null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="p-4 overflow-x-auto">
        <SortableContext items={statusStages.map((s) => `col-${s.id}`)} strategy={horizontalListSortingStrategy}>
          <div className="flex gap-4 pb-4 min-w-max">
            {statusStages.map((stage) => {
              const stageLeads = leads.filter((lead) => lead.status === stage.id);
              const stageColors = getStageColors(stage.id);

              return (
                <div key={stage.id} className="w-72 flex-shrink-0">
                  <ColumnHeader
                    stage={stage}
                    stageColors={stageColors}
                    count={stageLeads.length}
                    showColorPicker={showColorPicker}
                    editing={editingStage === stage.id}
                    editLabel={editLabel}
                    setEditLabel={setEditLabel}
                    onStartEdit={() => startEdit(stage)}
                    onSaveEdit={saveEdit}
                    onCancelEdit={() => setEditingStage(null)}
                    onDelete={() => onDeleteStage(stage.id)}
                    onColorChange={(c, t) => onUpdateStageColor(stage.id, c, t)}
                    onCreate={() => onCreateLeadInStage(stage.id)}
                  />

                  <div className="bg-[#1F2833]/30 rounded-b-lg p-2 min-h-[calc(100vh-300px)] space-y-2 border border-t-0 border-[#45A29E]/20">
                    <SortableContext items={stageLeads.map((l) => `card-${l.id}`)}>
                      {stageLeads.length === 0 ? (
                        <div className="text-center py-8 text-[#6B7684] text-sm">Нет сделок</div>
                      ) : (
                        stageLeads.map((lead) => <DealCard key={lead.id} lead={lead} onLeadClick={onLeadClick} />)
                      )}
                    </SortableContext>
                  </div>
                </div>
              );
            })}

            <div className="w-56 flex-shrink-0">
              <button
                onClick={onAddStage}
                className="w-full h-full min-h-[120px] rounded-lg border-2 border-dashed border-[#45A29E]/30 text-[#66FCF1] hover:border-[#66FCF1]/60 hover:bg-[#45A29E]/5 transition-colors flex flex-col items-center justify-center gap-2 text-sm"
              >
                <Icon name="Plus" size={20} />
                Добавить этап
              </button>
            </div>
          </div>
        </SortableContext>
      </div>

      <DragOverlay>
        {activeLead ? (
          <div className="rounded-lg bg-[#1F2833] border border-[#66FCF1]/50 p-3 w-64 shadow-2xl">
            <div className="text-sm font-medium text-white">{activeLead.name || activeLead.company}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
