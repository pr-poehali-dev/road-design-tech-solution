import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface CRMHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreateLead: () => void;
  onToggleColorPicker: () => void;
  onLogout: () => void;
  totalLeads: number;
  activeLeads: number;
  conversionRate: string;
  totalBudget: number;
  totalRevenue: number;
  totalPlanned: number;
  totalContracts: number;
  totalReceived: number;
}

const formatMillions = (value: number) => `${(value / 1_000_000).toFixed(1)}M`;

export const CRMHeader = ({
  searchQuery,
  setSearchQuery,
  onCreateLead,
  onToggleColorPicker,
  onLogout,
  totalLeads,
  activeLeads,
  conversionRate,
  totalBudget,
  totalRevenue,
  totalPlanned,
  totalContracts,
  totalReceived,
}: CRMHeaderProps) => {
  const goHome = () => {
    window.location.href = '/ecosystem';
  };

  const goToEcosystem = () => {
    window.location.href = '/ecosystem';
  };

  return (
    <>
      <header className="border-b border-cyan-500/30 bg-slate-800/80 backdrop-blur-lg sticky top-0 z-40 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <div className="px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <h1 className="font-semibold text-lg sm:text-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">DEOD CRM</h1>
              <Button
                onClick={onCreateLead}
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 h-8 text-xs ml-auto sm:ml-0 touch-manipulation shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <Icon name="Plus" size={14} className="mr-1" />
                <span className="hidden sm:inline">Новая сделка</span>
                <span className="sm:hidden">Создать</span>
              </Button>
              <Button
                onClick={onToggleColorPicker}
                size="sm"
                variant="outline"
                className="h-8 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 touch-manipulation"
              >
                <Icon name="Palette" size={14} />
              </Button>
            </div>
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Icon name="Search" size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full sm:w-48 h-8 text-sm bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <Button
                onClick={goToEcosystem}
                size="sm"
                className="h-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all border-0"
              >
                <Icon name="Globe" size={14} className="mr-1" />
                <span className="hidden sm:inline">В кабинет партнёра</span>
                <span className="sm:hidden">Кабинет</span>
              </Button>
              <Button
                onClick={() => window.location.href = '/admin'}
                size="sm"
                className="h-8 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-600 text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all animate-pulse border-0"
              >
                <Icon name="Rocket" size={14} className="mr-1" />
                DEAD SPACE
              </Button>
              <Button variant="ghost" size="sm" onClick={goHome} className="h-8 w-8 p-0 touch-manipulation text-cyan-400 hover:bg-cyan-500/10">
                <Icon name="Home" size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout} className="h-8 w-8 p-0 touch-manipulation text-cyan-400 hover:bg-cyan-500/10">
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-slate-800/50 border-b border-cyan-500/20 px-4 py-4 overflow-x-auto backdrop-blur-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 min-w-max sm:min-w-0">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 sm:p-3 border border-cyan-500/20 min-w-[120px] shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <div className="text-xs text-cyan-400 mb-1">Всего сделок</div>
            <div className="text-xl sm:text-2xl font-semibold text-white">{totalLeads}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 sm:p-3 border border-cyan-500/20 min-w-[120px] shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <div className="text-xs text-cyan-400 mb-1">В работе</div>
            <div className="text-xl sm:text-2xl font-semibold text-white">{activeLeads}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 sm:p-3 border border-cyan-500/20 min-w-[120px] shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <div className="text-xs text-cyan-400 mb-1">Конверсия</div>
            <div className="text-xl sm:text-2xl font-semibold text-emerald-400">{conversionRate}%</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 sm:p-3 border border-cyan-500/20 min-w-[120px] shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <div className="text-xs text-cyan-400 mb-1">Бюджет</div>
            <div className="text-xl sm:text-2xl font-semibold text-white">{formatMillions(totalBudget)} &#8381;</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 sm:p-3 border border-emerald-500/20 min-w-[120px] shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div className="text-xs text-emerald-400 mb-1">Оборот</div>
            <div className="text-xl sm:text-2xl font-semibold text-emerald-400">{formatMillions(totalRevenue)} &#8381;</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 sm:p-3 border border-amber-500/20 min-w-[120px] shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <div className="text-xs text-amber-400 mb-1">Плановый оборот</div>
            <div className="text-xl sm:text-2xl font-semibold text-amber-400">{formatMillions(totalPlanned)} &#8381;</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 sm:p-3 border border-violet-500/20 min-w-[120px] shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <div className="text-xs text-violet-400 mb-1">Контракты</div>
            <div className="text-xl sm:text-2xl font-semibold text-violet-400">{formatMillions(totalContracts)} &#8381;</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 sm:p-3 border border-sky-500/20 min-w-[120px] shadow-[0_0_15px_rgba(14,165,233,0.1)]">
            <div className="text-xs text-sky-400 mb-1">Поступления</div>
            <div className="text-xl sm:text-2xl font-semibold text-sky-400">{formatMillions(totalReceived)} &#8381;</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CRMHeader;
