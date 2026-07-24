import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import NeuralBackground from '@/components/evden2/NeuralBackground';
import ModeToggle from '@/components/evden2/ModeToggle';
import PhaseFunnel from '@/components/evden2/PhaseFunnel';
import DealCardDemo from '@/components/evden2/DealCardDemo';
import ImpulsesKanban from '@/components/evden2/ImpulsesKanban';
import AiAgentsGrid from '@/components/evden2/AiAgentsGrid';
import IntegrationsRow from '@/components/evden2/IntegrationsRow';
import LiveAnalytics from '@/components/evden2/LiveAnalytics';

const voiceCommands = [
  'Неврон, покажи все сделки на этапе «Стыковка» с риском по срокам',
  'Неврон, создай импульс для Иванова — подготовить геологию до пятницы',
  'Неврон, ответь клиенту в Telegram, что мы выслали КП',
  'Неврон, покажи отчёт по комментариям за месяц',
];

const heroStats = [
  { label: 'Сделок в работе', value: '128', icon: 'Briefcase', color: 'from-cyan-500 to-blue-500' },
  { label: 'Конверсия', value: '34%', icon: 'TrendingUp', color: 'from-emerald-500 to-teal-500' },
  { label: 'Оборот за месяц', value: '12.4M ₽', icon: 'Wallet', color: 'from-amber-500 to-orange-500' },
  { label: 'Импульсов закрыто', value: '312', icon: 'Zap', color: 'from-violet-500 to-purple-500' },
];

const whyPoints = [
  { icon: 'Rocket', title: 'Скорость', desc: 'Сделки закрываются в 2 раза быстрее за счёт мгновенных реакций ИИ' },
  { icon: 'Infinity', title: 'Полная автоматизация', desc: 'Менеджер занимается переговорами — остальное делает ИИ' },
  { icon: 'LayoutTemplate', title: 'Единая экосистема', desc: 'Не нужно переключаться между десятком сервисов' },
  { icon: 'Mic2', title: 'Голосовое управление', desc: 'Освобождает руки и глаза в любой ситуации' },
  { icon: 'Eye', title: 'Аналитика-интуиция', desc: 'ИИ видит скрытые риски и настроения раньше вас' },
  { icon: 'Gavel', title: 'Охота за тендерами', desc: 'BIDZAAR превращает ожидание в активный поиск' },
];

const Evden2 = () => {
  const [mode, setMode] = useState<'voice' | 'manual'>('voice');
  const [listening, setListening] = useState(false);
  const [cmdIndex, setCmdIndex] = useState(0);
  const [activePhase, setActivePhase] = useState('docking');

  useEffect(() => {
    if (!listening) return;
    const interval = setInterval(() => {
      setCmdIndex((i) => (i + 1) % voiceCommands.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [listening]);

  const goBack = () => {
    window.location.href = '/crm';
  };

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
              Демо · Инженерные изыскания и проектирование
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
              Новый способ работать
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
            Голос и руки, ИИ-агенты, единый инбокс, тендеры BIDZAAR и модуль «Импульсы» —
            операционная система для инженерных изысканий и проектирования.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <ModeToggle
              mode={mode}
              setMode={setMode}
              listening={listening}
              setListening={setListening}
              transcript={voiceCommands[cmdIndex]}
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
              <div className="text-xl sm:text-2xl font-bold text-white">{s.value}</div>
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
        <PhaseFunnel active={activePhase} onSelect={setActivePhase} />
      </section>

      <section className="px-4 py-8 max-w-6xl mx-auto">
        <Tabs defaultValue="deal" className="w-full">
          <TabsList className="bg-slate-900/60 border border-slate-700/50 mb-5 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="deal" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 text-xs sm:text-sm">
              <Icon name="FileText" size={14} className="mr-1.5" />
              Карточка сделки
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
            <DealCardDemo />
          </TabsContent>
          <TabsContent value="impulses">
            <ImpulsesKanban />
          </TabsContent>
          <TabsContent value="agents">
            <AiAgentsGrid />
          </TabsContent>
          <TabsContent value="integrations">
            <IntegrationsRow />
          </TabsContent>
          <TabsContent value="analytics">
            <LiveAnalytics />
          </TabsContent>
        </Tabs>
      </section>

      <section className="px-4 py-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <Icon name="Flame" size={18} className="text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Почему это взрывает рынок</h3>
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
        <p className="text-slate-500 text-xs mb-3 relative">Это демо-заглушка новой системы — реальный функционал в разработке</p>
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
