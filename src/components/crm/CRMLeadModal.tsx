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
  onAddNote: () => void;
  onAddTask: () => void;
  onToggleTaskComplete: (taskId: string) => void;
  onMakeCall: (phone?: string) => void;
  setNewNote: (note: string) => void;
  setNewTask: (task: { title: string; type: string; dueDate: string }) => void;
  setNewLead: (lead: any) => void;
  onCreateLead: () => void;
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
  onAddNote,
  onAddTask,
  onToggleTaskComplete,
  onMakeCall,
  setNewNote,
  setNewTask,
  setNewLead,
  onCreateLead
}: CRMLeadModalProps) => {
  return (
    <>
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
                  <label className="text-xs font-medium text-cyan-400">Имя *</label>
                  <Input
                    placeholder="Иван Иванов"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="h-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-cyan-400">Email *</label>
                  <Input
                    type="email"
                    placeholder="ivan@example.com"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="h-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-cyan-400">Телефон</label>
                  <Input
                    type="tel"
                    placeholder="+7 999 123-45-67"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="h-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-cyan-400">Компания</label>
                  <Input
                    placeholder="ООО Компания"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    className="h-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-cyan-400">Примечание</label>
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

      {showLeadCard && selectedLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto my-2 sm:my-8 bg-slate-800/95 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <CardHeader className="border-b border-cyan-500/30 sticky top-0 bg-slate-800/95 backdrop-blur-lg z-10">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl text-white">{selectedLead.name}</CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2 text-cyan-400">
                    {selectedLead.company && <span>{selectedLead.company}</span>}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
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

                  {selectedLead.message && (
                    <div className="bg-slate-700/50 rounded-lg p-3 space-y-2 border border-cyan-500/20">
                      <div className="text-xs font-medium text-cyan-400">Примечание</div>
                      <div className="text-sm text-white">{selectedLead.message}</div>
                    </div>
                  )}

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

                <div className="space-y-4">
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
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
