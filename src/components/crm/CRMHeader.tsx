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
      <header className="border-b border-[#45A29E]/30 bg-[#0B0C10]/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <h1 className="font-heading font-bold text-lg sm:text-xl text-white tracking-wide">DEOD CRM</h1>
              <Button
                onClick={onCreateLead}
                size="sm"
                className="bg-[#45A29E] hover:bg-[#3d8f8b] text-[#0B0C10] font-bold h-8 text-xs ml-auto sm:ml-0 touch-manipulation shadow-[0_0_15px_rgba(102,252,241,0.25)]"
              >
                <Icon name="Plus" size={14} className="mr-1" />
                <span className="hidden sm:inline">Новая сделка</span>
                <span className="sm:hidden">Создать</span>
              </Button>
              <Button
                onClick={onToggleColorPicker}
                size="sm"
                variant="outline"
                className="h-8 border-[#45A29E]/30 text-[#66FCF1] hover:bg-[#45A29E]/10 touch-manipulation"
              >
                <Icon name="Palette" size={14} />
              </Button>
            </div>
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Icon name="Search" size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#6B7684]" />
                <Input
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full sm:w-48 h-8 text-sm bg-[#1F2833]/70 border-[#45A29E]/30 text-white placeholder:text-[#6B7684]"
                />
              </div>
              <Button
                onClick={goToEcosystem}
                size="sm"
                className="h-8 bg-[#1F2833] border border-[#45A29E]/40 hover:bg-[#45A29E]/15 text-[#66FCF1] font-medium transition-all"
              >
                <Icon name="Globe" size={14} className="mr-1" />
                <span className="hidden sm:inline">В кабинет партнёра</span>
                <span className="sm:hidden">Кабинет</span>
              </Button>
              <Button
                onClick={() => window.location.href = '/admin'}
                size="sm"
                className="h-8 bg-[#FF6600]/15 border border-[#FF6600]/50 hover:bg-[#FF6600]/25 text-[#FF6600] font-bold transition-all"
              >
                <Icon name="Rocket" size={14} className="mr-1" />
                DEAD SPACE
              </Button>
              <Button
                onClick={() => window.location.href = '/evden2'}
                size="sm"
                className="h-8 bg-[#FF6600] hover:bg-[#e65c00] text-[#0B0C10] font-bold shadow-[0_0_15px_rgba(255,102,0,0.3)] transition-all"
              >
                <Icon name="Sparkles" size={14} className="mr-1" />
                EVDEN 2.0
              </Button>
              <Button variant="ghost" size="sm" onClick={goHome} className="h-8 w-8 p-0 touch-manipulation text-[#66FCF1] hover:bg-[#45A29E]/10">
                <Icon name="Home" size={16} />
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout} className="h-8 w-8 p-0 touch-manipulation text-[#66FCF1] hover:bg-[#45A29E]/10">
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-[#1F2833]/30 border-b border-[#45A29E]/20 px-4 py-4 overflow-x-auto backdrop-blur-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 min-w-max sm:min-w-0">
          <div className="bg-gradient-to-br from-[#1F2833]/70 to-[#0B0C10]/80 rounded-lg p-2 sm:p-3 border border-[#45A29E]/20 min-w-[120px]">
            <div className="text-xs text-[#66FCF1] mb-1">Всего сделок</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-white">{totalLeads}</div>
          </div>
          <div className="bg-gradient-to-br from-[#1F2833]/70 to-[#0B0C10]/80 rounded-lg p-2 sm:p-3 border border-[#45A29E]/20 min-w-[120px]">
            <div className="text-xs text-[#66FCF1] mb-1">В работе</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-white">{activeLeads}</div>
          </div>
          <div className="bg-gradient-to-br from-[#1F2833]/70 to-[#0B0C10]/80 rounded-lg p-2 sm:p-3 border border-[#45A29E]/20 min-w-[120px]">
            <div className="text-xs text-[#66FCF1] mb-1">Конверсия</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#66FCF1]">{conversionRate}%</div>
          </div>
          <div className="bg-gradient-to-br from-[#1F2833]/70 to-[#0B0C10]/80 rounded-lg p-2 sm:p-3 border border-[#45A29E]/20 min-w-[120px]">
            <div className="text-xs text-[#66FCF1] mb-1">Бюджет</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-white">{formatMillions(totalBudget)} &#8381;</div>
          </div>
          <div className="bg-gradient-to-br from-[#1F2833]/70 to-[#0B0C10]/80 rounded-lg p-2 sm:p-3 border border-[#66FCF1]/20 min-w-[120px]">
            <div className="text-xs text-[#66FCF1] mb-1">Оборот</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#66FCF1]">{formatMillions(totalRevenue)} &#8381;</div>
          </div>
          <div className="bg-gradient-to-br from-[#1F2833]/70 to-[#0B0C10]/80 rounded-lg p-2 sm:p-3 border border-[#FF6600]/20 min-w-[120px]">
            <div className="text-xs text-[#FF6600] mb-1">Плановый оборот</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#FF6600]">{formatMillions(totalPlanned)} &#8381;</div>
          </div>
          <div className="bg-gradient-to-br from-[#1F2833]/70 to-[#0B0C10]/80 rounded-lg p-2 sm:p-3 border border-[#663399]/30 min-w-[120px]">
            <div className="text-xs text-[#C89BFF] mb-1">Контракты</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#C89BFF]">{formatMillions(totalContracts)} &#8381;</div>
          </div>
          <div className="bg-gradient-to-br from-[#1F2833]/70 to-[#0B0C10]/80 rounded-lg p-2 sm:p-3 border border-[#45A29E]/30 min-w-[120px]">
            <div className="text-xs text-[#66FCF1] mb-1">Поступления</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#66FCF1]">{formatMillions(totalReceived)} &#8381;</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CRMHeader;