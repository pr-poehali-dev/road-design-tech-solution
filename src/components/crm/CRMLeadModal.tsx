import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Lead } from './CRMKanban';

export interface Task {
  id: string;
  leadId: string;
  title: string;
  type: 'call' | 'meeting' | 'proposal' | 'follow-up';
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  leadId: string;
  type: 'status_change' | 'call' | 'email' | 'note' | 'task_created';
  description: string;
  createdAt: string;
}

interface CRMLeadModalProps {
  showLeadCard: boolean;
  showCreateLead: boolean;
  selectedLead: Lead | null;
  newLead: {
    name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
    type: string;
    status: Lead['status'];
  };
  tasks: Task[];
  activities: Activity[];
  newTask: { title: string; type: string; dueDate: string };
  newNote: string;
  statusStages: Array<{ id: string; label: string }>;
  onCloseLeadCard: () => void;
  onCloseCreateLead: () => void;
  onDeleteLead: (id: string) => void;
  onUpdateLeadStatus: (id: string, status: Lead['status']) => void;
  onUpdateLead: (id: string, updates: Record<string, unknown>) => void;
  onAddNote: () => void;
  onAddTask: () => void;
  onToggleTaskComplete: (taskId: string) => void;
  onMakeCall: (phone?: string) => void;
  setNewNote: (note: string) => void;
  setNewTask: (task: { title: string; type: string; dueDate: string }) => void;
  setNewLead: (lead: Record<string, unknown>) => void;
  onCreateLead: () => void;
}

const formatCurrency = (value: number | undefined | null): string => {
  const num = Number(value) || 0;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString('ru-RU');
};

const inputCls = 'h-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20';
const labelCls = 'text-xs font-medium text-cyan-400';

interface EditFormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  description: string;
  stage: string;
  deal_amount: string;
  revenue: string;
  planned_revenue: string;
  contract_amount: string;
  received_amount: string;
}

export const CRMLeadModal = ({
  showLeadCard,
  showCreateLead,
  selectedLead,
  newLead,
  tasks,
  activities,
  newTask,
  newNote,
  statusStages,
  onCloseLeadCard,
  onCloseCreateLead,
  onDeleteLead,
  onUpdateLeadStatus,
  onUpdateLead,
  onAddNote,
  onAddTask,
  onToggleTaskComplete,
  onMakeCall,
  setNewNote,
  setNewTask,
  setNewLead,
  onCreateLead
}: CRMLeadModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormState>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    description: '',
    stage: 'new',
    deal_amount: '0',
    revenue: '0',
    planned_revenue: '0',
    contract_amount: '0',
    received_amount: '0',
  });

  useEffect(() => {
    if (selectedLead && isEditing) {
      setEditForm({
        name: selectedLead.name || '',
        email: selectedLead.email || '',
        phone: selectedLead.phone || '',
        company: selectedLead.company || '',
        message: selectedLead.message || '',
        description: selectedLead.description || '',
        stage: selectedLead.status || 'new',
        deal_amount: String(selectedLead.deal_amount || 0),
        revenue: String(selectedLead.revenue || 0),
        planned_revenue: String(selectedLead.planned_revenue || 0),
        contract_amount: String(selectedLead.contract_amount || 0),
        received_amount: String(selectedLead.received_amount || 0),
      });
    }
  }, [selectedLead, isEditing]);

  useEffect(() => {
    if (!showLeadCard) {
      setIsEditing(false);
    }
  }, [showLeadCard]);

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveEdits = () => {
    if (!selectedLead) return;
    onUpdateLead(selectedLead.id, {
      contact_name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      company_name: editForm.company,
      notes: editForm.message,
      description: editForm.description,
      stage: editForm.stage,
      deal_amount: parseFloat(editForm.deal_amount) || 0,
      revenue: parseFloat(editForm.revenue) || 0,
      planned_revenue: parseFloat(editForm.planned_revenue) || 0,
      contract_amount: parseFloat(editForm.contract_amount) || 0,
      received_amount: parseFloat(editForm.received_amount) || 0,
    });
    setIsEditing(false);
  };

  const updateField = (field: keyof EditFormState, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* -------- CREATE LEAD MODAL -------- */}
      {showCreateLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <Card className="w-full max-w-2xl bg-slate-800/95 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <CardHeader className="border-b border-cyan-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg text-white">Новая сделка</CardTitle>
                  <CardDescription className="text-cyan-400">Заполните данные о клиенте</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={onCloseCreateLead} className="touch-manipulation w-8 h-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50">
                  <Icon name="X" size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={labelCls}>Имя *</label>
                  <Input
                    placeholder="Иван Иванов"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>Email *</label>
                  <Input
                    type="email"
                    placeholder="ivan@example.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>Телефон</label>
                  <Input
                    type="tel"
                    placeholder="+7 999 123-45-67"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>Компания</label>
                  <Input
                    placeholder="ООО Компания"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelCls}>Примечание</label>
                <Textarea
                  placeholder="Дополнительная информация..."
                  value={newLead.message}
                  onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
                  rows={2}
                  className="text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button onClick={onCreateLead} className="flex-1 h-9 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-[0_0_20px_rgba(6,182,212,0.3)] touch-manipulation">
                  Создать
                </Button>
                <Button variant="outline" onClick={onCloseCreateLead} className="h-9 sm:w-auto touch-manipulation border-slate-600 text-slate-300 hover:bg-slate-700/50">
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* -------- VIEW / EDIT LEAD MODAL -------- */}
      {showLeadCard && selectedLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto my-2 sm:my-8 bg-slate-800/95 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)]">

            {/* ---------- HEADER ---------- */}
            <CardHeader className="border-b border-cyan-500/30 sticky top-0 bg-slate-800/95 backdrop-blur-lg z-10">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl text-white">
                    {isEditing ? 'Редактирование сделки' : selectedLead.name}
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2 text-cyan-400">
                    {!isEditing && selectedLead.company && <span>{selectedLead.company}</span>}
                    {isEditing && <span>Измените поля и нажмите Сохранить</span>}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={startEditing}
                      className="text-cyan-400 hover:bg-cyan-500/20 touch-manipulation w-8 h-8 p-0"
                      title="Редактировать"
                    >
                      <Icon name="Pencil" size={16} />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => onDeleteLead(selectedLead.id)} className="text-red-400 hover:bg-red-500/20 touch-manipulation w-8 h-8 p-0">
                    <Icon name="Trash2" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onCloseLeadCard} className="touch-manipulation w-8 h-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50">
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-3 sm:p-4">
              {/* ========== EDIT MODE ========== */}
              {isEditing ? (
                <div className="space-y-4">
                  {/* Contact fields */}
                  <div className="bg-slate-700/50 rounded-lg p-3 space-y-3 border border-cyan-500/20">
                    <div className="text-xs font-medium text-cyan-400 flex items-center gap-1.5">
                      <Icon name="User" size={14} />
                      Контактные данные
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className={labelCls}>Имя</label>
                        <Input value={editForm.name} onChange={(e) => updateField('name', e.target.value)} className={inputCls} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelCls}>Email</label>
                        <Input type="email" value={editForm.email} onChange={(e) => updateField('email', e.target.value)} className={inputCls} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelCls}>Телефон</label>
                        <Input type="tel" value={editForm.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputCls} />
                      </div>
                      <div className="space-y-1">
                        <label className={labelCls}>Компания</label>
                        <Input value={editForm.company} onChange={(e) => updateField('company', e.target.value)} className={inputCls} />
                      </div>
                    </div>
                  </div>

                  {/* Stage */}
                  <div className="bg-slate-700/50 rounded-lg p-3 space-y-2 border border-cyan-500/20">
                    <div className="text-xs font-medium text-cyan-400 flex items-center gap-1.5">
                      <Icon name="GitBranch" size={14} />
                      Этап сделки
                    </div>
                    <Select value={editForm.stage} onValueChange={(v) => updateField('stage', v)}>
                      <SelectTrigger className="h-9 bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {statusStages.map(stage => (
                          <SelectItem key={stage.id} value={stage.id} className="text-white hover:bg-slate-700">
                            {stage.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Financial fields */}
                  <div className="bg-slate-700/50 rounded-lg p-3 space-y-3 border border-emerald-500/20">
                    <div className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                      <Icon name="Banknote" size={14} />
                      Финансовые данные
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className={labelCls}>Сумма сделки</label>
                        <Input type="number" value={editForm.deal_amount} onChange={(e) => updateField('deal_amount', e.target.value)} className={inputCls} placeholder="0" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-emerald-400">Оборот (revenue)</label>
                        <Input type="number" value={editForm.revenue} onChange={(e) => updateField('revenue', e.target.value)} className={inputCls} placeholder="0" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-amber-400">Плановый оборот</label>
                        <Input type="number" value={editForm.planned_revenue} onChange={(e) => updateField('planned_revenue', e.target.value)} className={inputCls} placeholder="0" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-violet-400">Сумма контракта</label>
                        <Input type="number" value={editForm.contract_amount} onChange={(e) => updateField('contract_amount', e.target.value)} className={inputCls} placeholder="0" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-sky-400">Поступления</label>
                        <Input type="number" value={editForm.received_amount} onChange={(e) => updateField('received_amount', e.target.value)} className={inputCls} placeholder="0" />
                      </div>
                    </div>
                  </div>

                  {/* Notes & description */}
                  <div className="bg-slate-700/50 rounded-lg p-3 space-y-3 border border-cyan-500/20">
                    <div className="text-xs font-medium text-cyan-400 flex items-center gap-1.5">
                      <Icon name="FileText" size={14} />
                      Описание и примечания
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Описание</label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        rows={3}
                        className="text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        placeholder="Подробное описание сделки..."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Примечание</label>
                      <Textarea
                        value={editForm.message}
                        onChange={(e) => updateField('message', e.target.value)}
                        rows={2}
                        className="text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                        placeholder="Заметки..."
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      onClick={saveEdits}
                      className="flex-1 h-9 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-[0_0_20px_rgba(16,185,129,0.3)] touch-manipulation"
                    >
                      <Icon name="Check" size={16} className="mr-1.5" />
                      Сохранить
                    </Button>
                    <Button
                      variant="outline"
                      onClick={cancelEditing}
                      className="h-9 touch-manipulation border-slate-600 text-slate-300 hover:bg-slate-700/50"
                    >
                      <Icon name="X" size={16} className="mr-1.5" />
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                /* ========== VIEW MODE ========== */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 space-y-4">
                    {/* Contacts */}
                    <div className="bg-slate-700/50 rounded-lg p-3 space-y-2 border border-cyan-500/20">
                      <div className="text-xs font-medium text-cyan-400">Контакты</div>
                      <div className="space-y-1">
                        <div className="text-sm flex items-center gap-2 text-white">
                          <Icon name="Mail" size={14} className="text-cyan-400" />
                          {selectedLead.email}
                        </div>
                        {selectedLead.phone && (
                          <div className="text-sm flex items-center gap-2 text-white">
                            <Icon name="Phone" size={14} className="text-cyan-400" />
                            {selectedLead.phone}
                            <Button
                              size="sm"
                              onClick={() => onMakeCall(selectedLead.phone)}
                              className="ml-auto h-6 text-xs bg-emerald-600 hover:bg-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.3)] touch-manipulation"
                            >
                              Позвонить
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stage */}
                    <div className="bg-slate-700/50 rounded-lg p-3 space-y-2 border border-cyan-500/20">
                      <div className="text-xs font-medium text-cyan-400">Этап сделки</div>
                      <Select
                        value={selectedLead.status}
                        onValueChange={(value) => onUpdateLeadStatus(selectedLead.id, value as Lead['status'])}
                      >
                        <SelectTrigger className="h-9 bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {statusStages.map(stage => (
                            <SelectItem key={stage.id} value={stage.id} className="text-white hover:bg-slate-700">
                              {stage.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Revenue cards */}
                    <div className="bg-slate-700/50 rounded-lg p-3 space-y-2 border border-emerald-500/20">
                      <div className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                        <Icon name="Banknote" size={14} />
                        Финансы
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {selectedLead.deal_amount != null && (
                          <div className="bg-slate-800/60 rounded-md p-2 border border-slate-600/50">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Сумма сделки</div>
                            <div className="text-sm font-semibold text-white">{formatCurrency(selectedLead.deal_amount)} &#8381;</div>
                          </div>
                        )}
                        <div className="bg-slate-800/60 rounded-md p-2 border border-emerald-500/30">
                          <div className="text-[10px] text-emerald-400 uppercase tracking-wider">Оборот</div>
                          <div className="text-sm font-semibold text-emerald-400">{formatCurrency(selectedLead.revenue)} &#8381;</div>
                        </div>
                        <div className="bg-slate-800/60 rounded-md p-2 border border-amber-500/30">
                          <div className="text-[10px] text-amber-400 uppercase tracking-wider">Плановый</div>
                          <div className="text-sm font-semibold text-amber-400">{formatCurrency(selectedLead.planned_revenue)} &#8381;</div>
                        </div>
                        <div className="bg-slate-800/60 rounded-md p-2 border border-violet-500/30">
                          <div className="text-[10px] text-violet-400 uppercase tracking-wider">Контракт</div>
                          <div className="text-sm font-semibold text-violet-400">{formatCurrency(selectedLead.contract_amount)} &#8381;</div>
                        </div>
                        <div className="bg-slate-800/60 rounded-md p-2 border border-sky-500/30">
                          <div className="text-[10px] text-sky-400 uppercase tracking-wider">Поступления</div>
                          <div className="text-sm font-semibold text-sky-400">{formatCurrency(selectedLead.received_amount)} &#8381;</div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {selectedLead.description && (
                      <div className="bg-slate-700/50 rounded-lg p-3 space-y-2 border border-cyan-500/20">
                        <div className="text-xs font-medium text-cyan-400">Описание</div>
                        <div className="text-sm text-white whitespace-pre-wrap">{selectedLead.description}</div>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedLead.message && (
                      <div className="bg-slate-700/50 rounded-lg p-3 space-y-2 border border-cyan-500/20">
                        <div className="text-xs font-medium text-cyan-400">Примечание</div>
                        <div className="text-sm text-white">{selectedLead.message}</div>
                      </div>
                    )}

                    {/* Add note */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-cyan-400">Добавить примечание</div>
                      <Textarea
                        placeholder="Новая заметка..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={2}
                        className="text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                      <Button onClick={onAddNote} size="sm" className="h-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-[0_0_15px_rgba(6,182,212,0.3)] touch-manipulation">
                        Добавить
                      </Button>
                    </div>
                  </div>

                  {/* ---- RIGHT SIDEBAR ---- */}
                  <div className="space-y-4">
                    {/* Tasks */}
                    <div className="bg-slate-700/50 rounded-lg p-3 border border-cyan-500/20">
                      <div className="text-xs font-medium text-cyan-400 mb-2">Задачи</div>
                      <div className="space-y-2 mb-3">
                        {tasks.filter(t => t.leadId === selectedLead.id && !t.completed).map(task => (
                          <div key={task.id} className="flex items-start gap-2 text-sm">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 touch-manipulation"
                              onClick={() => onToggleTaskComplete(task.id)}
                            >
                              <Icon name="Circle" size={14} className="text-cyan-400" />
                            </Button>
                            <div className="flex-1">
                              <div className="text-xs text-white">{task.title}</div>
                              <div className="text-xs text-slate-400">
                                {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                              </div>
                            </div>
                          </div>
                        ))}
                        {tasks.filter(t => t.leadId === selectedLead.id && !t.completed).length === 0 && (
                          <div className="text-xs text-slate-500">Нет задач</div>
                        )}
                      </div>
                      <Input
                        placeholder="Новая задача..."
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="h-8 text-xs mb-2 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                      />
                      <Input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="h-8 text-xs mb-2 bg-slate-700/50 border-slate-600 text-white"
                      />
                      <Button onClick={onAddTask} size="sm" className="w-full h-7 text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-[0_0_15px_rgba(6,182,212,0.3)] touch-manipulation">
                        Добавить задачу
                      </Button>
                    </div>

                    {/* Activities */}
                    <div className="bg-slate-700/50 rounded-lg p-3 border border-cyan-500/20">
                      <div className="text-xs font-medium text-cyan-400 mb-2">История</div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {activities
                          .filter(a => a.leadId === selectedLead.id)
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map(activity => (
                            <div key={activity.id} className="text-xs">
                              <div className="text-white">{activity.description}</div>
                              <div className="text-slate-400 text-xs">
                                {new Date(activity.createdAt).toLocaleString('ru-RU')}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CRMLeadModal;
