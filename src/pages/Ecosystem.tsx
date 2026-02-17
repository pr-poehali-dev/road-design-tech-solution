import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

const API_URL = 'https://functions.poehali.dev/dfa8f17b-5894-48e3-b263-bb3c5de0282e';

/* ------------------------------------------------------------------ types */

interface NetworkGrade {
  grade: string;
  personal_percent: number;
  line1_percent: number;
  line2_percent: number;
  line3_percent: number;
  line4_percent: number;
}

interface OwnStats {
  total_revenue: number;
  total_planned: number;
  total_contracts: number;
  total_received: number;
  total_deal_amount: number;
  deals_count: number;
  won_deals: number;
}

interface LineStat {
  line: number;
  partners_count: number;
  total_revenue: number;
  total_deals: number;
  won_deals: number;
  commission_percent: number;
  commission_amount: number;
}

interface NetworkPartner {
  id: number;
  name: string;
  phone: string;
  email: string;
  company: string;
  invite_code: string;
  grade: string;
  created_at: string;
  line: number;
  stats: {
    total_revenue: number;
    total_planned: number;
    total_contracts: number;
    total_received: number;
    total_deal_amount: number;
    deals_count: number;
    won_deals: number;
  };
  children: NetworkPartner[];
}

interface NetworkData {
  partner_id: number;
  grade: NetworkGrade;
  first_deal_bonus: boolean;
  own_stats: OwnStats;
  personal_commission_percent: number;
  personal_commission: number;
  network_tree: NetworkPartner[];
  line_stats: LineStat[];
  total_network_revenue: number;
  total_network_commission: number;
  total_income: number;
}

interface StatsData {
  total_clients: number;
  leads_count: number;
  qualified_count: number;
  proposal_count: number;
  negotiation_count: number;
  won_count: number;
  lost_count: number;
  total_deal_amount: number;
  total_revenue: number;
  total_planned: number;
  total_contracts: number;
  total_received: number;
  total_tasks: number;
  pending_tasks: number;
  completed_tasks: number;
  total_activities: number;
}

interface UserProfile {
  id: number;
  name: string;
  phone: string;
  email: string;
  company: string;
  invite_code: string;
  parent_id: number | null;
  grade: string;
}

/* --------------------------------------------------------------- helpers */

const GRADE_THRESHOLDS: { name: string; min: number; max: number }[] = [
  { name: 'Агент', min: 0, max: 10_000_000 },
  { name: 'Партнёр', min: 10_000_000, max: 25_000_000 },
  { name: 'Старший партнёр', min: 25_000_000, max: 40_000_000 },
  { name: 'Генеральный партнёр', min: 40_000_000, max: 75_000_000 },
  { name: 'Амбассадор', min: 75_000_000, max: 150_000_000 },
];

const GRADE_COLORS: Record<string, string> = {
  'Агент': 'cyan',
  'Партнёр': 'blue',
  'Старший партнёр': 'purple',
  'Генеральный партнёр': 'violet',
  'Амбассадор': 'yellow',
};

const GRADE_GRADIENT: Record<string, string> = {
  'Агент': 'from-cyan-500 to-cyan-600',
  'Партнёр': 'from-blue-500 to-blue-600',
  'Старший партнёр': 'from-purple-500 to-purple-600',
  'Генеральный партнёр': 'from-violet-500 to-violet-600',
  'Амбассадор': 'from-yellow-500 to-orange-500',
};

const GRADE_TEXT: Record<string, string> = {
  'Агент': 'text-cyan-400',
  'Партнёр': 'text-blue-400',
  'Старший партнёр': 'text-purple-400',
  'Генеральный партнёр': 'text-violet-400',
  'Амбассадор': 'text-yellow-400',
};

const formatRub = (v: number | string | undefined | null): string => {
  const num = Number(v) || 0;
  return new Intl.NumberFormat('ru-RU').format(num);
};

const formatShort = (v: number | string | undefined | null): string => {
  const num = Number(v) || 0;
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)} B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)} K`;
  return formatRub(num);
};

const gradeProgress = (gradeName: string, revenue: number): { percent: number; remaining: number; nextGrade: string } => {
  const idx = GRADE_THRESHOLDS.findIndex(g => g.name === gradeName);
  if (idx === -1 || idx === GRADE_THRESHOLDS.length - 1) return { percent: 100, remaining: 0, nextGrade: '' };
  const current = GRADE_THRESHOLDS[idx];
  const next = GRADE_THRESHOLDS[idx + 1];
  const range = next.min - current.min;
  const progress = Math.min(revenue - current.min, range);
  return {
    percent: Math.max(0, Math.min(100, Math.round((progress / range) * 100))),
    remaining: Math.max(0, next.min - revenue),
    nextGrade: next.name,
  };
};

/* --------------------------------------------------------------- phases */

const phases = [
  {
    id: 1, title: 'МОЩНЫЙ СТАРТ', period: 'День 1 - 30',
    goal: 'Активировать бонус "Ускоренный старт", заключив первую сделку в первый месяц',
    income: '16% с первой сделки вместо 8%. Пример: Сделка на 50 млн = доход 8 млн руб. сразу',
    materials: ['Видео "Система за 7 минут"', 'Скрипт первого звонка (аудио+текст)', 'Шаблон КП', 'Список из 50 приоритетных ниш'],
    task: 'Совершить 50 целевых контактов за 14 дней',
    icon: 'Rocket', color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 2, title: 'СОЗДАНИЕ ЛИНИИ', period: 'Месяцы 2-3',
    goal: 'Достичь личного оборота в 30 млн и привлечь 3 своих Агентов (1-я линия)',
    income: '10% с личных продаж + 5% с оборота каждого вашего Агента',
    logic: '3 Агента, продающие на 10 млн/кв каждый, принесут вам дополнительно 1.5 млн руб./кв пассивного дохода',
    materials: ['Скрипт привлечения Агента', 'Чек-лист обучения за первую неделю', 'Шаблон партнёрского договора'],
    icon: 'Users', color: 'from-blue-500 to-purple-600',
  },
  {
    id: 3, title: 'ГЛУБИНА СЕТИ', period: 'Месяцы 4-6',
    goal: 'Вырастить из своих Агентов Партнёров, чтобы создать 2-ю и 3-ю линию сети. Оборот структуры - 100 млн/кв',
    income: '12% с личных продаж + 5% с 1-й линии + 3% со 2-й линии',
    logic: 'Ваши Партнёры растят своих Агентов. Вы получаете процент уже с "внуков" вашей сети',
    materials: ['Вебинар "Как выявить и развить лидера в команде"', 'Инструменты аналитики сети в ЛК', 'Кейс "Как я построил 3 уровня за 120 дней"'],
    icon: 'Network', color: 'from-purple-500 to-violet-600',
  },
  {
    id: 4, title: 'СИСТЕМА И КАПИТАЛ', period: 'Месяцы 7-12',
    goal: 'Выйти на грейд Амбассадор. Оборот вашей сети - 1.5 млрд+',
    income: '18% с личных продаж + совокупно ~12% с оборота всей сети',
    logic: 'При обороте сети в 1.5 млрд/мес ваш доход с сети составит ~180 млн/мес. Плюс 18% с личных продаж. Итог - цель в 1 млрд руб. годовой прибыли',
    materials: ['Закрытая стратегическая сессия с топ-амбассадором', 'Финансовая консультация по управлению крупным доходом', 'Шаблоны для масштабирования на новые регионы'],
    icon: 'Crown', color: 'from-blue-500 to-purple-600',
  },
];

const grades = [
  { name: 'Агент', level: 4, color: 'cyan' },
  { name: 'Партнёр', level: 3, color: 'blue' },
  { name: 'Старший партнёр', level: 2, color: 'purple' },
  { name: 'Генеральный партнёр', level: 1, color: 'violet' },
  { name: 'Амбассадор', level: 0, color: 'purple' },
];

/* ============================================================ COMPONENT */

export default function Ecosystem() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [simulatorGrade, setSimulatorGrade] = useState(grades[1]);
  const [dealAmount, setDealAmount] = useState(10000000);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [calculatorData, setCalculatorData] = useState({
    grade: grades[1].name,
    dealAmount: 50000000,
    finalPrice: 55000000,
    networkLevel: 1,
    isFirstDeal: false,
  });
  const [learningProgress, setLearningProgress] = useState({
    financialSystem: false,
    salesFunnel: false,
    salesScript: false,
    tenderGuide: false,
    clientHunting: false,
    callScripts: false,
  });

  const getPartnerId = useCallback((): number | null => {
    try {
      const raw = localStorage.getItem('userProfile');
      if (!raw) return null;
      const p = JSON.parse(raw);
      return p?.id ?? null;
    } catch { return null; }
  }, []);

  const loadAllData = useCallback(async () => {
    const partnerId = getPartnerId();
    if (!partnerId) {
      window.location.href = '/partner-system';
      return;
    }
    setLoading(true);
    try {
      const [profileRes, networkRes, statsRes] = await Promise.all([
        fetch(`${API_URL}?resource=profile&partner_id=${partnerId}`),
        fetch(`${API_URL}?resource=network&partner_id=${partnerId}`),
        fetch(`${API_URL}?resource=stats&partner_id=${partnerId}`),
      ]);

      if (profileRes.ok) {
        const d = await profileRes.json();
        if (d.user) setProfile(d.user);
      }
      if (networkRes.ok) {
        const d = await networkRes.json();
        setNetworkData(d);
      }
      if (statsRes.ok) {
        const d = await statsRes.json();
        if (d.stats) setStats(d.stats);
      }
    } catch (err) {
      console.error('Error loading ecosystem data:', err);
    } finally {
      setLoading(false);
    }
  }, [getPartnerId]);

  useEffect(() => {
    loadAllData();

    // learning progress
    const keys = ['financialSystem', 'salesFunnel', 'salesScript', 'tenderGuide', 'clientHunting', 'callScripts'] as const;
    const storageKeys = [
      'financialSystemTestResults', 'salesFunnelTestResults', 'salesScriptTestResults',
      'tenderGuideTestResults', 'clientHuntingTestResults', 'callScriptsTestResults',
    ];
    const progress: Record<string, boolean> = {};
    keys.forEach((k, i) => {
      const raw = localStorage.getItem(storageKeys[i]);
      progress[k] = raw ? JSON.parse(raw).passed : false;
    });
    setLearningProgress(progress as typeof learningProgress);

    const interval = setInterval(loadAllData, 60000);
    return () => clearInterval(interval);
  }, [loadAllData]);

  /* ---- derived ---- */
  const ownRevenue = Number(networkData?.own_stats?.total_revenue) || 0;
  const gradeName = networkData?.grade?.grade || profile?.grade || 'Агент';
  const gProgress = gradeProgress(gradeName, ownRevenue);
  const inviteCode = profile?.invite_code || '';
  const referralLink = inviteCode ? `${window.location.origin}/partner-system?ref=${inviteCode}` : '';
  const activeLines = (networkData?.line_stats || []).filter(l => l.partners_count > 0).length;

  const copyReferral = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  /* ---- simulator / calculator (unchanged logic) ---- */
  const calculateDistribution = () => {
    const base = dealAmount * 0.18;
    const distribution = [
      { level: 4, name: 'Агент-исполнитель', percent: 8, amount: dealAmount * 0.08 },
      { level: 3, name: 'Партнёр', percent: 5, amount: dealAmount * 0.05 },
      { level: 2, name: 'Старший партнёр', percent: 3, amount: dealAmount * 0.03 },
      { level: 1, name: 'Генеральный', percent: 1.5, amount: dealAmount * 0.015 },
      { level: 0, name: 'Амбассадор', percent: 0.5, amount: dealAmount * 0.005 },
    ];
    return { distribution, total: base };
  };

  const calculateIncome = () => {
    const { dealAmount: da, finalPrice, isFirstDeal, grade } = calculatorData;
    const percentMap: Record<string, number> = { 'Агент': 8, 'Партнёр': 10, 'Старший партнёр': 12, 'Генеральный партнёр': 15, 'Амбассадор': 18 };
    const basePercent = percentMap[grade] || 8;
    const networkIncome = da * (basePercent / 100);
    const markup = finalPrice - da;
    const bonusIncome = markup > 0 ? (markup * basePercent / 100) * 0.5 : 0;
    const startBonus = isFirstDeal && grade === 'Агент' ? networkIncome : 0;
    return { networkIncome, bonusIncome, startBonus, total: networkIncome + bonusIncome + startBonus };
  };

  const { distribution, total } = calculateDistribution();
  const income = calculateIncome();

  /* ---- flatten network tree for partner cards ---- */
  const flattenTree = (nodes: NetworkPartner[]): NetworkPartner[] => {
    const result: NetworkPartner[] = [];
    for (const n of nodes) {
      result.push(n);
      if (n.children?.length) result.push(...flattenTree(n.children));
    }
    return result;
  };
  const allPartners = networkData ? flattenTree(networkData.network_tree) : [];

  /* ---- loading screen ---- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Icon name="Loader2" size={48} className="text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Загрузка данных...</p>
        </motion.div>
      </div>
    );
  }

  /* ============================================================ RENDER */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      {/* ======================== PERSONAL HEADER ======================== */}
      <section className="py-6 md:py-12 bg-slate-900/50 border-b border-cyan-500/20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">

            {/* Avatar + name */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 md:mb-8">
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${GRADE_GRADIENT[gradeName] || 'from-cyan-500 to-blue-600'} flex items-center justify-center flex-shrink-0`}>
                <Icon name="User" size={32} className="text-white md:hidden" />
                <Icon name="User" size={40} className="text-white hidden md:block" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">
                  {profile?.name || 'Партнёр'}, вы — <span className={GRADE_TEXT[gradeName] || 'text-cyan-400'}>{gradeName}</span>
                </h1>
                <p className="text-sm md:text-base text-cyan-400">Добро пожаловать в экосистему DEOD</p>
                {profile?.id && <p className="text-xs text-slate-500 mt-1">ID: {profile.id}</p>}
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                <Link to="/crm">
                  <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg relative">
                    <Icon name="LayoutDashboard" className="mr-2" size={18} />
                    CRM
                    {stats && Number(stats.leads_count) > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                        {stats.leads_count}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link to="/chat">
                  <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 shadow-lg">
                    <Icon name="MessageSquare" className="mr-2" size={18} />
                    Чат
                  </Button>
                </Link>
                <div className="relative">
                  <Button
                    onClick={() => setKnowledgeOpen(!knowledgeOpen)}
                    className="bg-slate-800/80 border border-slate-600/50 hover:bg-slate-700/80 hover:border-slate-500/50 shadow-lg relative"
                  >
                    <Icon name="BookOpen" className="mr-2" size={18} />
                    База знаний
                    <Icon name={knowledgeOpen ? 'ChevronUp' : 'ChevronDown'} className="ml-2 animate-pulse" size={20} />
                  </Button>

                  <AnimatePresence>
                    {knowledgeOpen && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-slate-800 border border-slate-600/50 rounded-lg shadow-2xl z-50">
                        <div className="p-4 space-y-3">
                          {[
                            { to: '/ecosystem/gl', icon: 'DollarSign', label: 'Финансовая система', cls: 'cyan' },
                            { to: '/sales-funnel', icon: 'TrendingDown', label: 'Воронка продаж', cls: 'purple' },
                            { to: '/ecosystem/sales-script', icon: 'Phone', label: 'Скрипты и встречи', cls: 'violet' },
                            { to: '/ecosystem/tender-guide', icon: 'FileText', label: 'Работа с тендерами', cls: 'blue' },
                            { to: '/ecosystem/client-hunting', icon: 'Target', label: 'Поиск клиентов', cls: 'purple' },
                            { to: '/ecosystem/call-scripts', icon: 'Phone', label: 'Скрипты звонков', cls: 'cyan' },
                          ].map((item) => (
                            <Link key={item.to} to={item.to} onClick={() => setKnowledgeOpen(false)}>
                              <div className={`p-3 bg-gradient-to-br from-${item.cls}-900/30 to-${item.cls}-900/30 border border-${item.cls}-500/30 rounded-lg hover:shadow-lg transition-all cursor-pointer`}>
                                <div className="flex items-center gap-3">
                                  <Icon name={item.icon} size={20} className={`text-${item.cls}-400`} />
                                  <span className="text-white font-medium">{item.label}</span>
                                  <Icon name="ExternalLink" size={16} className={`text-${item.cls}-400 ml-auto`} />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link to="/ecosystem/gl">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/30">
                    <Icon name="Home" className="mr-2" size={18} />
                    Главная
                  </Button>
                </Link>
              </div>
            </div>

            {/* ---- Dashboard cards row 1 ---- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card className="bg-slate-800/50 border-cyan-500/20 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="TrendingUp" size={20} className="text-cyan-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Личный оборот</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-white">{formatShort(ownRevenue)} &#8381;</p>
              </Card>
              <Card className="bg-slate-800/50 border-blue-500/20 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="Network" size={20} className="text-blue-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Оборот сети</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-white">{formatShort(networkData?.total_network_revenue)} &#8381;</p>
              </Card>
              <Card className="bg-slate-800/50 border-purple-500/20 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="Layers" size={20} className="text-purple-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Глубина сети</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-white">{activeLines} {activeLines === 1 ? 'уровень' : activeLines >= 2 && activeLines <= 4 ? 'уровня' : 'уровней'}</p>
              </Card>
              <Card className="bg-slate-800/50 border-violet-500/20 p-4 md:p-6 shadow-lg shadow-violet-500/10">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="DollarSign" size={20} className="text-violet-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Прогноз дохода</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-white">{formatShort(networkData?.total_income)} &#8381;</p>
              </Card>
            </div>

            {/* ---- Dashboard cards row 2 ---- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4 md:mt-6">
              <Card className="bg-slate-800/50 border-emerald-500/20 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="CalendarClock" size={20} className="text-emerald-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Плановый оборот</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-emerald-400">{formatShort(networkData?.own_stats?.total_planned)} &#8381;</p>
              </Card>
              <Card className="bg-slate-800/50 border-amber-500/20 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="FileCheck" size={20} className="text-amber-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Контракты</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-amber-400">{formatShort(networkData?.own_stats?.total_contracts)} &#8381;</p>
              </Card>
              <Card className="bg-slate-800/50 border-sky-500/20 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="Wallet" size={20} className="text-sky-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Поступления</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-sky-400">{formatShort(networkData?.own_stats?.total_received)} &#8381;</p>
              </Card>
              <Card className="bg-slate-800/50 border-rose-500/20 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="Percent" size={20} className="text-rose-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Комиссия сети</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-rose-400">{formatShort(networkData?.total_network_commission)} &#8381;</p>
              </Card>
            </div>

            {/* ---- Grade progress bar ---- */}
            <Card className="mt-4 md:mt-6 bg-slate-800/50 border-cyan-500/20 p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm md:text-base text-white font-semibold">
                  {gProgress.nextGrade ? `До грейда "${gProgress.nextGrade}"` : 'Максимальный грейд достигнут'}
                </p>
                <p className="text-sm md:text-base text-cyan-400">{gProgress.percent}%</p>
              </div>
              <div className="w-full h-2 md:h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${gProgress.percent}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-600" />
              </div>
              {gProgress.remaining > 0 && (
                <p className="text-slate-400 text-xs md:text-sm mt-2">Осталось: {formatRub(gProgress.remaining)} &#8381;</p>
              )}
            </Card>

            {/* ======================== PARTNER NETWORK SECTION ======================== */}
            <Card className="mt-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-cyan-500/30 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                  <Icon name="Network" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Моя партнёрская сеть</h3>
                  <p className="text-sm text-slate-400">Приглашайте партнёров и получайте комиссию с их оборота</p>
                </div>
              </div>

              {/* Invite block */}
              {inviteCode && (
                <div className="mb-6 p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 mb-1">Ваш код приглашения</p>
                      <p className="text-2xl font-bold text-cyan-400 tracking-widest font-mono">{inviteCode}</p>
                    </div>
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <p className="text-xs text-slate-400 mb-1">Реферальная ссылка</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-white bg-slate-700/60 px-3 py-2 rounded-md truncate block flex-1">{referralLink}</code>
                        <Button size="sm" onClick={copyReferral} className="h-9 px-3 bg-cyan-600 hover:bg-cyan-700 flex-shrink-0">
                          <Icon name={copied ? 'Check' : 'Copy'} size={14} className="mr-1" />
                          {copied ? 'Скопировано' : 'Копировать'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Line stats table */}
              {networkData && networkData.line_stats.length > 0 && (
                <div className="mb-6 overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left text-xs text-slate-400 py-2 px-3 font-medium">Линия</th>
                        <th className="text-right text-xs text-slate-400 py-2 px-3 font-medium">Партнёров</th>
                        <th className="text-right text-xs text-slate-400 py-2 px-3 font-medium">Оборот</th>
                        <th className="text-right text-xs text-slate-400 py-2 px-3 font-medium">Сделки</th>
                        <th className="text-right text-xs text-slate-400 py-2 px-3 font-medium">Комиссия %</th>
                        <th className="text-right text-xs text-slate-400 py-2 px-3 font-medium">Комиссия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {networkData.line_stats.map((ls) => (
                        <tr key={ls.line} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                          <td className="py-3 px-3 text-sm text-white font-medium">Линия {ls.line}</td>
                          <td className="py-3 px-3 text-sm text-white text-right">{ls.partners_count}</td>
                          <td className="py-3 px-3 text-sm text-cyan-400 text-right font-medium">{formatShort(ls.total_revenue)} &#8381;</td>
                          <td className="py-3 px-3 text-sm text-white text-right">{ls.won_deals} / {ls.total_deals}</td>
                          <td className="py-3 px-3 text-sm text-amber-400 text-right">{ls.commission_percent}%</td>
                          <td className="py-3 px-3 text-sm text-emerald-400 text-right font-medium">{formatRub(ls.commission_amount)} &#8381;</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Partner cards */}
              {allPartners.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-white mb-3">Партнёры в сети ({allPartners.length})</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {allPartners.map((p) => {
                      const g = p.grade || 'Агент';
                      const colorCls = GRADE_COLORS[g] || 'cyan';
                      return (
                        <div key={p.id} className={`p-3 bg-slate-800/60 border border-${colorCls}-500/30 rounded-lg`}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm text-white font-semibold">{p.name}</p>
                              {p.company && <p className="text-xs text-slate-400">{p.company}</p>}
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full bg-${colorCls}-500/20 text-${colorCls}-400 font-medium`}>{g}</span>
                          </div>
                          <p className="text-xs text-slate-500 mb-2">Линия {p.line} {p.phone ? `/ ${p.phone}` : ''}</p>
                          <div className="flex gap-3 text-xs">
                            <span className="text-slate-400">Сделок: <span className="text-white font-medium">{p.stats.deals_count}</span></span>
                            <span className="text-slate-400">Оборот: <span className="text-cyan-400 font-medium">{formatShort(p.stats.total_revenue)}</span></span>
                            <span className="text-slate-400">Выиграно: <span className="text-emerald-400 font-medium">{p.stats.won_deals}</span></span>
                          </div>
                          {p.children.length > 0 && (
                            <p className="text-[10px] text-slate-500 mt-1">Привлечено: {p.children.length} партнёр(ов)</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {allPartners.length === 0 && (
                <div className="mb-6 text-center py-8">
                  <Icon name="Users" size={40} className="text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">В вашей сети пока нет партнёров</p>
                  <p className="text-slate-500 text-xs mt-1">Поделитесь реферальной ссылкой, чтобы пригласить первого партнёра</p>
                </div>
              )}

              {/* Commission breakdown */}
              {networkData && (
                <div className="p-4 bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 border border-emerald-500/30 rounded-lg">
                  <p className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                    <Icon name="Calculator" size={16} />
                    Разбивка дохода
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Личная комиссия ({networkData.personal_commission_percent}%){networkData.first_deal_bonus ? ' - бонус 1-й сделки' : ''}</span>
                      <span className="text-white font-medium">{formatRub(networkData.personal_commission)} &#8381;</span>
                    </div>
                    {networkData.line_stats.map((ls) => (
                      ls.commission_percent > 0 && (
                        <div key={ls.line} className="flex justify-between text-sm">
                          <span className="text-slate-300">Линия {ls.line} ({ls.commission_percent}% от {formatShort(ls.total_revenue)})</span>
                          <span className="text-white font-medium">{formatRub(ls.commission_amount)} &#8381;</span>
                        </div>
                      )
                    ))}
                    <div className="border-t border-emerald-500/30 pt-2 mt-2 flex justify-between">
                      <span className="text-white font-bold">Итого доход</span>
                      <span className="text-emerald-400 font-bold text-lg">{formatRub(networkData.total_income)} &#8381;</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* ======================== LEARNING PROGRESS ======================== */}
            <Card className="mt-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-violet-500/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
                  <Icon name="GraduationCap" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Прогресс обучения</h3>
                  <p className="text-sm text-slate-400">
                    {Object.values(learningProgress).filter(Boolean).length} из {Object.keys(learningProgress).length} блоков сдано
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400">Общий прогресс</span>
                  <span className="text-sm text-violet-400 font-semibold">
                    {Math.round((Object.values(learningProgress).filter(Boolean).length / Object.keys(learningProgress).length) * 100)}%
                  </span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(Object.values(learningProgress).filter(Boolean).length / Object.keys(learningProgress).length) * 100}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-violet-500 to-purple-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: 'financialSystem' as const, to: '/ecosystem/gl', label: 'Финансовая система' },
                  { key: 'salesFunnel' as const, to: '/sales-funnel', label: 'Воронка продаж' },
                  { key: 'salesScript' as const, to: '/ecosystem/sales-script', label: 'Скрипты и встречи' },
                  { key: 'tenderGuide' as const, to: '/ecosystem/tender-guide', label: 'Работа с тендерами' },
                  { key: 'clientHunting' as const, to: '/ecosystem/client-hunting', label: 'Поиск клиентов' },
                  { key: 'callScripts' as const, to: '/ecosystem/call-scripts', label: 'Скрипты звонков' },
                ].map((item) => {
                  const passed = learningProgress[item.key];
                  return (
                    <Link key={item.key} to={item.to}>
                      <div className={`p-4 rounded-lg border transition-all cursor-pointer ${passed ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20' : 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20'}`}>
                        <div className="flex items-center gap-3">
                          <Icon name={passed ? 'CheckCircle' : 'XCircle'} size={20} className={passed ? 'text-green-400' : 'text-red-400'} />
                          <div className="flex-1">
                            <p className="text-white font-medium">{item.label}</p>
                            <p className="text-xs text-slate-400">{passed ? 'Тест сдан' : 'Тест не сдан'}</p>
                          </div>
                          <Icon name="ExternalLink" size={16} className="text-slate-400" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {Object.values(learningProgress).every(Boolean) && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Trophy" size={24} className="text-yellow-400" />
                    <div>
                      <p className="text-white font-bold">Поздравляем!</p>
                      <p className="text-sm text-slate-300">Вы успешно завершили все блоки обучения!</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </Card>

            {/* ======================== BADGES ======================== */}
            <Card className="mt-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-yellow-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
                    <Icon name="Award" size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Ваши достижения</h3>
                    <p className="text-sm text-slate-400">
                      {[
                        learningProgress.financialSystem, learningProgress.salesFunnel, learningProgress.salesScript,
                        learningProgress.tenderGuide, learningProgress.clientHunting, learningProgress.callScripts,
                        Object.values(learningProgress).filter(Boolean).length >= 1,
                        Object.values(learningProgress).filter(Boolean).length >= 3,
                        Object.values(learningProgress).every(Boolean),
                      ].filter(Boolean).length} бейджей получено
                    </p>
                  </div>
                </div>
                <Link to="/achievements">
                  <Button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500">
                    <Icon name="Trophy" className="mr-2" size={16} />
                    Все достижения
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {learningProgress.financialSystem && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative group">
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 cursor-pointer hover:scale-110 transition-transform"><Icon name="DollarSign" size={24} className="text-white" /></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Финансовый эксперт</div>
                  </motion.div>
                )}
                {Object.values(learningProgress).filter(Boolean).length >= 1 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative group">
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 cursor-pointer hover:scale-110 transition-transform"><Icon name="Award" size={24} className="text-white" /></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Первые шаги</div>
                  </motion.div>
                )}
                {learningProgress.salesFunnel && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative group">
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30 cursor-pointer hover:scale-110 transition-transform"><Icon name="TrendingDown" size={24} className="text-white" /></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Мастер воронки</div>
                  </motion.div>
                )}
                {learningProgress.salesScript && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative group">
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30 cursor-pointer hover:scale-110 transition-transform"><Icon name="Phone" size={24} className="text-white" /></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Эксперт переговоров</div>
                  </motion.div>
                )}
                {learningProgress.tenderGuide && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative group">
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30 cursor-pointer hover:scale-110 transition-transform"><Icon name="FileText" size={24} className="text-white" /></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Профи тендеров</div>
                  </motion.div>
                )}
                {learningProgress.clientHunting && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative group">
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30 cursor-pointer hover:scale-110 transition-transform"><Icon name="Target" size={24} className="text-white" /></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Охотник за клиентами</div>
                  </motion.div>
                )}
                {learningProgress.callScripts && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative group">
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 cursor-pointer hover:scale-110 transition-transform"><Icon name="PhoneCall" size={24} className="text-white" /></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Мастер звонков</div>
                  </motion.div>
                )}
                {Object.values(learningProgress).filter(Boolean).length >= 3 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative group">
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/40 cursor-pointer hover:scale-110 transition-transform border-2 border-blue-400"><Icon name="BookOpen" size={24} className="text-white" /></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Ученик (Редкий)</div>
                  </motion.div>
                )}
                {Object.values(learningProgress).every(Boolean) && (
                  <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }} className="relative group">
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-xl shadow-yellow-500/50 cursor-pointer hover:scale-110 transition-transform border-2 border-yellow-400 animate-pulse"><Icon name="Trophy" size={24} className="text-white" /></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold">Гуру продаж (Эпический)</div>
                  </motion.div>
                )}
              </div>

              {Object.values(learningProgress).every(Boolean) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/50 rounded-lg">
                  <p className="text-sm text-yellow-300 text-center flex items-center justify-center gap-2">
                    <Icon name="Star" size={16} />
                    <span>Вы получили эпический бейдж "Гуру продаж"!</span>
                  </p>
                </motion.div>
              )}
            </Card>

          </motion.div>
        </div>
      </section>

      {/* ======================== ROADMAP ======================== */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8 md:mb-12 lg:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                Ваш план на <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">миллиард</span>
              </h2>
              <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto px-4">4 фазы роста от первой сделки до финансовой системы с доходом 1 млрд руб. в год</p>
            </motion.div>

            <div className="space-y-4 md:space-y-6">
              {phases.map((phase, index) => (
                <motion.div key={phase.id} initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <Card className={`bg-slate-800/50 border-cyan-500/20 overflow-hidden cursor-pointer transition-all hover:border-cyan-500/40 ${selectedPhase === phase.id ? 'ring-2 ring-cyan-500' : ''}`} onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}>
                    <div className="p-4 md:p-6">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon name={phase.icon as string} size={24} className="text-white md:hidden" />
                          <Icon name={phase.icon as string} size={32} className="text-white hidden md:block" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-lg md:text-2xl font-bold text-white leading-tight">ФАЗА {phase.id}: {phase.title}</h3>
                            <Icon name={selectedPhase === phase.id ? 'ChevronUp' : 'ChevronDown'} size={20} className="text-cyan-400 flex-shrink-0 md:w-6 md:h-6" />
                          </div>
                          <p className="text-xs md:text-base text-cyan-400 font-semibold mb-2 md:mb-3">{phase.period}</p>
                          <p className="text-sm md:text-base text-slate-300 mb-2 md:mb-3">{phase.goal}</p>
                          <div className="flex items-start gap-2 text-green-400 font-semibold">
                            <Icon name="DollarSign" size={16} className="flex-shrink-0 mt-0.5 md:w-5 md:h-5" />
                            <span className="text-xs md:text-base">{phase.income}</span>
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedPhase === phase.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-700">
                            {'logic' in phase && phase.logic && (
                              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                <p className="text-xs md:text-sm text-blue-300 font-semibold mb-2">Логика роста:</p>
                                <p className="text-xs md:text-base text-slate-300">{phase.logic}</p>
                              </div>
                            )}
                            <div className="mb-4 md:mb-6">
                              <p className="text-sm md:text-base text-white font-semibold mb-2 md:mb-3">Материалы для работы:</p>
                              <ul className="space-y-2">
                                {phase.materials.map((material, idx) => (
                                  <li key={idx} className="flex items-start gap-2 md:gap-3 text-slate-300">
                                    <Icon name="CheckCircle" size={16} className="text-green-400 flex-shrink-0 mt-0.5 md:w-5 md:h-5" />
                                    <span className="text-xs md:text-base">{material}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {phase.task && (
                              <div className="p-3 md:p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg mb-4 md:mb-0">
                                <p className="text-xs md:text-sm text-cyan-300 font-semibold mb-2">Задание:</p>
                                <p className="text-xs md:text-base text-white">{phase.task}</p>
                              </div>
                            )}
                            <Button className="mt-4 md:mt-6 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-sm md:text-base py-5 md:py-6">
                              <Icon name="Download" size={18} className="mr-2 md:w-5 md:h-5" />
                              Скачать стартовый пакет Фазы {phase.id}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================== SIMULATOR ======================== */}
      <section className="py-12 md:py-16 lg:py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8 md:mb-12 lg:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                Симулятор распределения <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">18%</span>
              </h2>
              <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto px-4">Посмотрите, как распределяются деньги с каждой сделки в вашей сети</p>
            </motion.div>

            <Card className="bg-slate-800/50 border-cyan-500/20 p-4 md:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-white font-semibold mb-3">Ваш грейд</label>
                  <div className="grid grid-cols-2 gap-3">
                    {grades.map((grade) => (
                      <button key={grade.name} onClick={() => setSimulatorGrade(grade)} className={`p-3 rounded-lg border-2 transition-all ${simulatorGrade.name === grade.name ? `border-${grade.color}-500 bg-${grade.color}-500/20` : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'}`}>
                        <p className={`font-semibold ${simulatorGrade.name === grade.name ? `text-${grade.color}-400` : 'text-slate-300'}`}>{grade.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-white font-semibold mb-3">Сумма сделки</label>
                  <input type="number" value={dealAmount} onChange={(e) => setDealAmount(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white" />
                  <p className="text-slate-400 text-sm mt-2">{formatRub(dealAmount)} &#8381;</p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                {distribution.map((item, index) => (
                  <motion.div key={item.level} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className={`p-3 md:p-4 rounded-lg border-2 ${simulatorGrade.level === item.level ? 'border-cyan-500 bg-cyan-500/20' : 'border-slate-600 bg-slate-700/30'}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm md:text-base text-white font-semibold">{item.name}</p>
                        <p className="text-slate-400 text-xs md:text-sm">Уровень {item.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl md:text-2xl font-bold text-cyan-400">{item.percent}%</p>
                        <p className="text-sm md:text-base text-white">{formatRub(item.amount)} &#8381;</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <div className="p-4 md:p-6 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500 rounded-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <p className="text-base md:text-xl font-bold text-white">Итого фонд распределения</p>
                    <p className="text-2xl md:text-3xl font-bold text-cyan-400">{formatRub(total)} &#8381;</p>
                  </div>
                </div>

                {simulatorGrade && (
                  <div className="p-4 md:p-6 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <p className="text-xs md:text-sm text-blue-300 font-semibold mb-2">Ваш доход:</p>
                    <p className="text-xs md:text-base text-white">
                      Если вы {simulatorGrade.name} на уровне {simulatorGrade.level}, ваш доход с этой сделки = {distribution.find(d => d.level === simulatorGrade.level)?.percent}% = {formatRub(distribution.find(d => d.level === simulatorGrade.level)?.amount || 0)} &#8381;
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ======================== CALCULATOR ======================== */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8 md:mb-12 lg:mb-16">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                Точный калькулятор <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">дохода</span>
              </h2>
              <p className="text-base md:text-xl text-slate-300 px-4">Рассчитайте свой доход с учётом всех бонусов и надбавок</p>
            </motion.div>

            <Card className="bg-slate-800/50 border-cyan-500/20 p-4 md:p-6 lg:p-8">
              <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                <div>
                  <label className="block text-sm md:text-base text-white font-semibold mb-2 md:mb-3">Ваш грейд</label>
                  <select value={calculatorData.grade} onChange={(e) => setCalculatorData({ ...calculatorData, grade: e.target.value })} className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm md:text-base">
                    {grades.map((g) => <option key={g.name} value={g.name}>{g.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm md:text-base text-white font-semibold mb-2 md:mb-3">Сумма сделки по КП</label>
                    <input type="number" value={calculatorData.dealAmount} onChange={(e) => setCalculatorData({ ...calculatorData, dealAmount: Number(e.target.value) })} className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm md:text-base" />
                  </div>
                  <div>
                    <label className="block text-sm md:text-base text-white font-semibold mb-2 md:mb-3">Финальная цена продажи</label>
                    <input type="number" value={calculatorData.finalPrice} onChange={(e) => setCalculatorData({ ...calculatorData, finalPrice: Number(e.target.value) })} className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm md:text-base" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm md:text-base text-white font-semibold mb-2 md:mb-3">Уровень в сети</label>
                  <input type="number" min="1" value={calculatorData.networkLevel} onChange={(e) => setCalculatorData({ ...calculatorData, networkLevel: Number(e.target.value) })} className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm md:text-base" />
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="firstDeal" checked={calculatorData.isFirstDeal} onChange={(e) => setCalculatorData({ ...calculatorData, isFirstDeal: e.target.checked })} className="w-4 h-4 md:w-5 md:h-5 mt-0.5" />
                  <label htmlFor="firstDeal" className="text-xs md:text-base text-white">Это первая сделка в первый месяц (бонус x2 для Агентов)</label>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="p-3 md:p-4 bg-slate-700/30 rounded-lg">
                  <p className="text-xs md:text-sm text-slate-400 mb-2">Шаг 1: Доход по сетевой модели</p>
                  <p className="text-xs md:text-base text-white">Как {calculatorData.grade} с {calculatorData.networkLevel}-й линии вы получаете: <span className="font-bold text-cyan-400">{formatRub(income.networkIncome)} &#8381;</span></p>
                </div>
                <div className="p-3 md:p-4 bg-slate-700/30 rounded-lg">
                  <p className="text-xs md:text-sm text-slate-400 mb-2">Шаг 2: Бонус за эффективность</p>
                  <p className="text-xs md:text-base text-white">Вы продали дороже КП на {formatRub(calculatorData.finalPrice - calculatorData.dealAmount)} &#8381;. 50% вашей доли = <span className="font-bold text-green-400">{formatRub(income.bonusIncome)} &#8381;</span></p>
                </div>
                {income.startBonus > 0 && (
                  <div className="p-3 md:p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                    <p className="text-xs md:text-sm text-cyan-300 mb-2">Шаг 3: Стартовый бонус</p>
                    <p className="text-xs md:text-base text-white">Ваш личный % удвоен! + <span className="font-bold text-cyan-400">{formatRub(income.startBonus)} &#8381;</span></p>
                  </div>
                )}
                <div className="p-4 md:p-6 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500 rounded-lg">
                  <p className="text-base md:text-xl font-bold text-white mb-2">ИТОГО С ЭТОЙ СДЕЛКИ:</p>
                  <p className="text-2xl md:text-4xl font-bold text-cyan-400">{formatRub(income.total)} &#8381;</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ======================== KNOWLEDGE BASE ======================== */}
      <section className="py-12 md:py-16 lg:py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">База знаний</h2>
              <p className="text-base md:text-xl text-slate-300 px-4">Все материалы для вашего роста - от старта до амбассадора</p>
            </motion.div>

            <Card className="bg-slate-800/50 border-cyan-500/20 overflow-hidden">
              <button onClick={() => setKnowledgeOpen(!knowledgeOpen)} className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-slate-800/70 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"><Icon name="BookOpen" size={24} className="text-white" /></div>
                  <div className="text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-white">Открыть базу знаний</h3>
                    <p className="text-sm text-slate-400 mt-1">3 раздела - Воронка продаж - Финансы - Развитие</p>
                  </div>
                </div>
                <Icon name={knowledgeOpen ? 'ChevronUp' : 'ChevronDown'} size={24} className="text-cyan-400 flex-shrink-0" />
              </button>

              <AnimatePresence>
                {knowledgeOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="border-t border-slate-700">
                    <div className="p-6 md:p-8 space-y-4">
                      <Link to="/ecosystem/gl">
                        <div className="p-4 md:p-6 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0"><Icon name="Coins" size={20} className="text-white" /></div>
                            <div className="flex-1">
                              <h4 className="text-lg md:text-xl font-bold text-white mb-2">1. Финансовая система</h4>
                              <p className="text-sm text-slate-300">Система доходов, грейды, калькулятор прибыли и прогнозы развития партнёрской сети</p>
                            </div>
                            <Icon name="ExternalLink" size={18} className="text-cyan-400 flex-shrink-0" />
                          </div>
                        </div>
                      </Link>
                      <Link to="/sales-funnel">
                        <div className="p-4 md:p-6 bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(147,51,234,0.5)]"><Icon name="TrendingDown" size={20} className="text-white" /></div>
                            <div className="flex-1">
                              <h4 className="text-lg md:text-xl font-bold text-white mb-2">2. Воронка продаж</h4>
                              <p className="text-sm text-slate-300">5 этапов работы с клиентом: от лида до подписания. Жёсткие правила + интерактивный тест</p>
                            </div>
                            <Icon name="ExternalLink" size={18} className="text-purple-400 flex-shrink-0" />
                          </div>
                        </div>
                      </Link>
                      <div className="p-4 md:p-6 bg-slate-900/50 border border-slate-700 rounded-lg">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.5)]"><Icon name="Rocket" size={20} className="text-white" /></div>
                          <div className="flex-1">
                            <h4 className="text-lg md:text-xl font-bold text-white mb-2">3. Фазы развития</h4>
                            <p className="text-sm text-slate-300 mb-4">Пошаговый план роста от Агента до Амбассадора с материалами для каждого этапа</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {phases.map((phase) => (
                            <div key={phase.id} className="p-3 bg-slate-800/50 border border-slate-600 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-8 h-8 rounded bg-gradient-to-br ${phase.color} flex items-center justify-center`}><Icon name={phase.icon as string} size={16} className="text-white" /></div>
                                <h5 className="text-sm font-bold text-white">Фаза {phase.id}: {phase.title}</h5>
                              </div>
                              <p className="text-xs text-slate-400">{phase.period}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </section>

      {/* ======================== CTA ======================== */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center">
            <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-500/30 p-6 md:p-10 lg:p-12">
              <Icon name="Rocket" size={48} className="text-cyan-400 mx-auto mb-4 md:hidden" />
              <Icon name="Rocket" size={64} className="text-cyan-400 mx-auto mb-6 hidden md:block" />
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">Готовы начать путь к миллиарду?</h2>
              <p className="text-sm md:text-lg lg:text-xl text-slate-300 mb-6 md:mb-8 px-2">
                Скачайте стартовый пакет и совершите 50 целевых контактов за 14 дней. Всё остальное - вопрос ваших амбиций и действий.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-sm md:text-base lg:text-lg px-6 md:px-8 py-5 md:py-6 w-full sm:w-auto">
                <Icon name="Download" size={18} className="mr-2 md:hidden" />
                <Icon name="Download" size={24} className="mr-2 hidden md:block" />
                Скачать стартовый пакет Фазы 1
              </Button>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
