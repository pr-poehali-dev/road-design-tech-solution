import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export interface Lead {
  id: string;
  type: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  status: 'new' | 'first-contact' | 'evaluation' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  createdAt: string;
  source: string;
  budget?: string;
  tags?: string[];
  manager?: string;
}

interface CRMKanbanProps {
  leads: Lead[];
  statusStages: Array<{ id: string; label: string }>;
  customColors: {[key: string]: {color: string, textColor: string}};
  showColorPicker: boolean;
  onLeadClick: (lead: Lead) => void;
  onCreateLeadInStage: (status: Lead['status']) => void;
  onUpdateStageColor: (stageId: string, color: string, textColor: string) => void;
}

export const CRMKanban = ({
  leads,
  statusStages,
  customColors,
  showColorPicker,
  onLeadClick,
  onCreateLeadInStage,
  onUpdateStageColor
}: CRMKanbanProps) => {
  const getStatusStage = (status: string) => {
    const stage = statusStages.find(s => s.id === status) || statusStages[0];
    const colors = customColors[status] || customColors['new'];
    return { ...stage, ...colors };
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex gap-4 pb-4 min-w-max">
        {statusStages.map((stage) => {
          const stageLeads = leads.filter(lead => lead.status === stage.id);
          const stageColors = getStatusStage(stage.id);
          
          return (
            <div key={stage.id} className="w-72 flex-shrink-0">
              <div 
                className="rounded-t-lg p-3 flex justify-between items-center shadow-[0_0_15px_rgba(6,182,212,0.2)]" 
                style={{ backgroundColor: stageColors.color }}
              >
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium" style={{ color: stageColors.textColor }}>
                    {stage.label}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="h-5 px-1.5 text-xs font-semibold"
                    style={{ backgroundColor: `${stageColors.textColor}30`, color: stageColors.textColor }}
                  >
                    {stageLeads.length}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  {showColorPicker && (
                    <div className="flex gap-1">
                      <input
                        type="color"
                        value={stageColors.color}
                        onChange={(e) => onUpdateStageColor(stage.id, e.target.value, stageColors.textColor)}
                        className="w-6 h-6 rounded cursor-pointer border border-white/20"
                        title="Цвет фона"
                      />
                      <input
                        type="color"
                        value={stageColors.textColor}
                        onChange={(e) => onUpdateStageColor(stage.id, stageColors.color, e.target.value)}
                        className="w-6 h-6 rounded cursor-pointer border border-white/20"
                        title="Цвет текста"
                      />
                    </div>
                  )}
                  <Button
                    size="sm"
                    onClick={() => onCreateLeadInStage(stage.id as Lead['status'])}
                    className="h-6 w-6 p-0 touch-manipulation"
                    style={{ backgroundColor: stageColors.textColor, color: stageColors.color }}
                  >
                    <Icon name="Plus" size={14} />
                  </Button>
                </div>
              </div>
              
              <div className="bg-slate-800/30 rounded-b-lg p-2 min-h-[calc(100vh-300px)] space-y-2 border border-t-0 border-cyan-500/20">
                {stageLeads.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    Нет сделок
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-slate-800/80 border-cyan-500/20 hover:border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] touch-manipulation"
                      onClick={() => onLeadClick(lead)}
                    >
                      <CardHeader className="p-3 pb-2">
                        <CardTitle className="text-sm font-medium text-white leading-tight">
                          {lead.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="space-y-1.5 text-xs">
                          {lead.company && (
                            <div className="flex items-center gap-1.5 text-cyan-400">
                              <Icon name="Building" size={12} />
                              <span className="truncate">{lead.company}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Icon name="Mail" size={12} />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Icon name="Phone" size={12} />
                              <span className="truncate">{lead.phone}</span>
                            </div>
                          )}
                          {lead.budget && (
                            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                              <Icon name="DollarSign" size={12} />
                              <span>{parseInt(lead.budget).toLocaleString()} ₽</span>
                            </div>
                          )}
                          <div className="text-slate-500 text-[10px] mt-2">
                            {new Date(lead.createdAt).toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
