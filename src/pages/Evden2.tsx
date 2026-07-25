import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import NeuralBackground from '@/components/evden2/NeuralBackground';
import ModeToggle from '@/components/evden2/ModeToggle';
import PhaseFunnel from '@/components/evden2/PhaseFunnel';
import DealsPanel from '@/components/evden2/DealsPanel';
import ImpulsesKanban from '@/components/evden2/ImpulsesKanban';
import AiAgentsGrid from '@/components/evden2/AiAgentsGrid';
import IntegrationsRow from '@/components/evden2/IntegrationsRow';
import LiveAnalytics from '@/components/evden2/LiveAnalytics';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { evdenApi, Deal, Stats } from '@/lib/evden2Api';

const whyPoints = [
  { icon: 'Rocket', title: 'Скорость', desc: 'Сделки закрываются быстрее за счёт мгновенных реакций ИИ' },
  { icon: 'Infinity', title: 'Полная автоматизация', desc: 'Менеджер занимается переговорами — остальное делает ИИ' },
  { icon: 'LayoutTemplate', title: 'Единая экосистема', desc: 'Сделки, задачи и переписка в одном месте' },
  { icon: 'Mic2', title: 'Голосовое управление', desc: 'Реальное распознавание речи создаёт задачи и двигает сделки' },
  { icon: 'Eye', title: 'ИИ-аналитика', desc: 'Настоящий анализ тональности комментариев через YandexGPT' },
  { icon: 'Gavel', title: 'Охота за тендерами', desc: 'BIDZAAR API подключён и готов к работе' },
];

const Evden2 = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState<'voice' | 'manual'>('voice');
  const [activePhase, setActivePhase] = useState('docking');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const [dealsRes, statsRes] = await Promise.all([evdenApi.getDeals(), evdenApi.getStats()]);
      setDeals(dealsRes.deals);
      setStats(statsRes);
    } catch (e: any) {
      toast({ title: 'Ошибка загрузки данных EVDEN 2.0', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChanged = () => {
    loadData();
    setRefreshTick((t) => t + 1);
  };

  const voice = useVoiceControl({ onExecuted: handleChanged });

  const goBack = () => {
    window.location.href = '/crm';
  };

  const totalBudget = stats?.total_budget || 0;
  const totalDeals = stats?.total_deals ?? deals.length;
  const avgConversion = deals.length
    ? Math.round((deals.filter((d) => d.phase === 'foundation').length / deals.length) * 100)
    : 0;

  const heroStats = [
    { label: 'Сделок в работе', value: String(totalDeals), icon: 'Briefcase', color: 'from-cyan-500 to-blue-500' },
    { label: 'В производстве', value: `${avgConversion}%`, icon: 'TrendingUp', color: 'from-emerald-500 to-teal-500' },
    { label: 'Общий бюджет', value: `${(totalBudget / 1_000_000).toFixed(1)}M ₽`, icon: 'Wallet', color: 'from-amber-500 to-orange-500' },
    { label: 'Импульсов закрыто', value: String(stats?.closed_impulses ?? 0), icon: 'Zap', color: 'from-violet-500 to-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950/10 to-slate-950 text-white relative">
      <header className="border-b border-amber-500/30 bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.5)]"
            >
              <Icon name="Sparkles" size={18} className="text-slate-900" />
            </motion.div>
            <h1 className="font-semibold text-lg sm:text-xl bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
              EVDEN 2.0
            </h1>
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 hidden sm:inline-flex">
              Инженерные изыскания и проектирование
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={goBack}
            className="h-8 border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
          >
            <Icon name="ArrowLeft" size={14} className="mr-1" />
            Назад в CRM
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-slate-800/60">
        <div className="absolute inset-0">
          <NeuralBackground />
        </div>
        <div className="relative px-4 py-12 sm:py-20 text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="mb-4 bg-amber-500/10 text-amber-300 border-amber-500/30">
              Работающая система, не витрина
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent"
          >
            EVDEN 2.0 — CRM, которая говорит и думает
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8"
          >
            Реальная база сделок, живой ИИ-анализ комментариев, голосовое управление и
            Telegram — всё работает по-настоящему, а не для вида.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <ModeToggle
              mode={mode}
              setMode={setMode}
              listening={voice.listening}
              onToggleListen={voice.listening ? voice.stop : voice.start}
              transcript={voice.transcript}
              processing={voice.processing}
              lastReply={voice.lastReply}
              supported={voice.supported}
            />
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {heroStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-amber-500/20 bg-slate-900/60 shadow-[0_0_15px_rgba(251,191,36,0.05)] p-4"
            >
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
                <Icon name={s.icon as any} size={18} className="text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">{loading ? '—' : s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Waypoints" size={18} className="text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Воронка продаж: 4 фазы</h3>
        </div>
        <PhaseFunnel deals={deals} active={activePhase} onSelect={setActivePhase} />
      </section>

      <section className="px-4 py-8 max-w-6xl mx-auto">
        <Tabs defaultValue="deal" className="w-full">
          <TabsList className="bg-slate-900/60 border border-slate-700/50 mb-5 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="deal" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 text-xs sm:text-sm">
              <Icon name="FileText" size={14} className="mr-1.5" />
              Сделки
            </TabsTrigger>
            <TabsTrigger value="impulses" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 text-xs sm:text-sm">
              <Icon name="Zap" size={14} className="mr-1.5" />
              Импульсы
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 text-xs sm:text-sm">
              <Icon name="Bot" size={14} className="mr-1.5" />
              ИИ-агенты
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 text-xs sm:text-sm">
              <Icon name="Plug" size={14} className="mr-1.5" />
              Интеграции
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 text-xs sm:text-sm">
              <Icon name="BarChart3" size={14} className="mr-1.5" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deal">
            {loading ? (
              <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-10 text-center text-slate-400">
                <Icon name="Loader2" size={28} className="animate-spin mx-auto mb-2 text-amber-400" />
                Загрузка сделок...
              </div>
            ) : (
              <DealsPanel deals={deals} onChanged={handleChanged} />
            )}
          </TabsContent>
          <TabsContent value="impulses">
            <ImpulsesKanban refreshKey={refreshTick} />
          </TabsContent>
          <TabsContent value="agents">
            <AiAgentsGrid />
          </TabsContent>
          <TabsContent value="integrations">
            <IntegrationsRow onDealCreated={handleChanged} />
          </TabsContent>
          <TabsContent value="analytics">
            <LiveAnalytics deals={deals} stats={stats} />
          </TabsContent>
        </Tabs>
      </section>

      <section className="px-4 py-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <Icon name="Flame" size={18} className="text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Почему это по-настоящему работает</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {whyPoints.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-amber-500/20 bg-slate-900/60 hover:border-amber-500/40 transition-colors p-4"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                <Icon name={f.icon as any} size={20} className="text-amber-400" />
              </div>
              <div className="text-sm font-semibold text-white mb-1">{f.title}</div>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />
        <p className="text-slate-500 text-xs mb-3 relative">Данные сохраняются в реальной базе — можно создавать сделки, задачи и переписываться в Telegram</p>
        <Button
          onClick={goBack}
          className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-500 text-slate-900 font-bold shadow-[0_0_25px_rgba(251,191,36,0.35)]"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Вернуться в текущую CRM
        </Button>
      </section>
    </div>
  );
};

export default Evden2;
