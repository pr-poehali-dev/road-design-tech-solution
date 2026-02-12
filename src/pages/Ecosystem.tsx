import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

interface PartnerData {
  name: string;
  contact: string;
  grade: string;
  personalTurnover: number;
  networkTurnover: number;
  networkDepth: number;
  quarterForecast: number;
  progressToNext: { current: number; total: number };
}

const getPartnerData = (): PartnerData => {
  const userProfile = localStorage.getItem('userProfile');
  const defaultName = 'Партнёр';
  
  if (userProfile) {
    const profile = JSON.parse(userProfile);
    return {
      name: profile.name || defaultName,
      contact: profile.contact || '',
      grade: 'Партнёр',
      personalTurnover: 45000000,
      networkTurnover: 120000000,
      networkDepth: 2,
      quarterForecast: 18000000,
      progressToNext: { current: 45, total: 100 },
    };
  }
  
  return {
    name: defaultName,
    contact: '',
    grade: 'Партнёр',
    personalTurnover: 45000000,
    networkTurnover: 120000000,
    networkDepth: 2,
    quarterForecast: 18000000,
    progressToNext: { current: 45, total: 100 },
  };
};

const phases = [
  {
    id: 1,
    title: 'МОЩНЫЙ СТАРТ',
    period: 'День 1 — 30',
    goal: 'Активировать бонус «Ускоренный старт», заключив первую сделку в первый месяц',
    income: '16% с первой сделки вместо 8%. Пример: Сделка на 50 млн = доход 8 млн ₽ сразу',
    materials: [
      'Видео «Система за 7 минут»',
      'Скрипт первого звонка (аудио+текст)',
      'Шаблон КП',
      'Список из 50 приоритетных ниш',
    ],
    task: 'Совершить 50 целевых контактов за 14 дней',
    icon: 'Rocket',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 2,
    title: 'СОЗДАНИЕ ЛИНИИ',
    period: 'Месяцы 2-3',
    goal: 'Достичь личного оборота в 30 млн и привлечь 3 своих Агентов (1-я линия)',
    income: '10% с личных продаж + 5% с оборота каждого вашего Агента',
    logic: '3 Агента, продающие на 10 млн/кв каждый, принесут вам дополнительно 1.5 млн ₽/кв пассивного дохода',
    materials: [
      'Скрипт привлечения Агента',
      'Чек-лист обучения за первую неделю',
      'Шаблон партнёрского договора',
    ],
    icon: 'Users',
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 3,
    title: 'ГЛУБИНА СЕТИ',
    period: 'Месяцы 4-6',
    goal: 'Вырастить из своих Агентов Партнёров, чтобы создать 2-ю и 3-ю линию сети. Оборот структуры — 100 млн/кв',
    income: '12% с личных продаж + 5% с 1-й линии + 3% со 2-й линии',
    logic: 'Ваши Партнёры растят своих Агентов. Вы получаете процент уже с «внуков» вашей сети',
    materials: [
      'Вебинар «Как выявить и развить лидера в команде»',
      'Инструменты аналитики сети в ЛК',
      'Кейс «Как я построил 3 уровня за 120 дней»',
    ],
    icon: 'Network',
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 4,
    title: 'СИСТЕМА И КАПИТАЛ',
    period: 'Месяцы 7-12',
    goal: 'Выйти на грейд Амбассадор. Оборот вашей сети — 1.5 млрд+',
    income: '18% с личных продаж + совокупно ~12% с оборота всей сети',
    logic: 'При обороте сети в 1.5 млрд/мес ваш доход с сети составит ~180 млн/мес. Плюс 18% с личных продаж. Итог — цель в 1 млрд руб. годовой прибыли',
    materials: [
      'Закрытая стратегическая сессия с топ-амбассадором',
      'Финансовая консультация по управлению крупным доходом',
      'Шаблоны для масштабирования на новые регионы',
    ],
    icon: 'Crown',
    color: 'from-blue-500 to-purple-600',
  },
];

const grades = [
  { name: 'Агент', level: 4, color: 'cyan' },
  { name: 'Партнёр', level: 3, color: 'blue' },
  { name: 'Старший партнёр', level: 2, color: 'purple' },
  { name: 'Генеральный партнёр', level: 1, color: 'violet' },
  { name: 'Амбассадор', level: 0, color: 'purple' },
];

export default function Ecosystem() {
  const [partnerData] = useState<PartnerData>(getPartnerData());
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [simulatorGrade, setSimulatorGrade] = useState(grades[1]);
  const [dealAmount, setDealAmount] = useState(10000000);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
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

  useEffect(() => {
    const financialSystemResults = localStorage.getItem('financialSystemTestResults');
    const salesFunnelResults = localStorage.getItem('salesFunnelTestResults');
    const salesScriptResults = localStorage.getItem('salesScriptTestResults');
    const tenderGuideResults = localStorage.getItem('tenderGuideTestResults');
    const clientHuntingResults = localStorage.getItem('clientHuntingTestResults');
    const callScriptsResults = localStorage.getItem('callScriptsTestResults');

    setLearningProgress({
      financialSystem: financialSystemResults ? JSON.parse(financialSystemResults).passed : false,
      salesFunnel: salesFunnelResults ? JSON.parse(salesFunnelResults).passed : false,
      salesScript: salesScriptResults ? JSON.parse(salesScriptResults).passed : false,
      tenderGuide: tenderGuideResults ? JSON.parse(tenderGuideResults).passed : false,
      clientHunting: clientHuntingResults ? JSON.parse(clientHuntingResults).passed : false,
      callScripts: callScriptsResults ? JSON.parse(callScriptsResults).passed : false,
    });
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

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
    const { dealAmount, finalPrice, networkLevel, isFirstDeal, grade } = calculatorData;
    
    const percentMap: { [key: string]: number } = {
      'Агент': 8,
      'Партнёр': 10,
      'Старший партнёр': 12,
      'Генеральный партнёр': 15,
      'Амбассадор': 18,
    };

    const basePercent = percentMap[grade] || 8;
    const networkIncome = dealAmount * (basePercent / 100);
    const markup = finalPrice - dealAmount;
    const bonusIncome = markup > 0 ? (markup * basePercent / 100) * 0.5 : 0;
    const startBonus = isFirstDeal && grade === 'Агент' ? networkIncome : 0;

    return {
      networkIncome,
      bonusIncome,
      startBonus,
      total: networkIncome + bonusIncome + startBonus,
    };
  };

  const { distribution, total } = calculateDistribution();
  const income = calculateIncome();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Personal Header */}
      <section className="py-6 md:py-12 bg-slate-900/50 border-b border-cyan-500/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6 md:mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={32} className="text-white md:hidden" />
                <Icon name="User" size={40} className="text-white hidden md:block" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 md:mb-2">
                  {partnerData.name}, вы — {partnerData.grade}
                </h1>
                <p className="text-sm md:text-base text-cyan-400">Добро пожаловать в экосистему DEOD</p>
              </div>
              <div className="flex gap-3">
                <Link to="/crm">
                  <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg">
                    <Icon name="LayoutDashboard" className="mr-2" size={18} />
                    CRM
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
                    <Icon name={knowledgeOpen ? "ChevronUp" : "ChevronDown"} className="ml-2 animate-pulse" size={20} />
                  </Button>
                  
                  <AnimatePresence>
                    {knowledgeOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-slate-800 border border-slate-600/50 rounded-lg shadow-2xl z-50"
                      >
                        <div className="p-4">
                          <Link to="/ecosystem/gl" onClick={() => setKnowledgeOpen(false)}>
                            <div className="p-3 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer mb-3">
                              <div className="flex items-center gap-3">
                                <Icon name="DollarSign" size={20} className="text-cyan-400" />
                                <span className="text-white font-medium">Финансовая система</span>
                                <Icon name="ExternalLink" size={16} className="text-cyan-400 ml-auto" />
                              </div>
                            </div>
                          </Link>
                          
                          <Link to="/sales-funnel" onClick={() => setKnowledgeOpen(false)}>
                            <div className="p-3 bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer mb-3">
                              <div className="flex items-center gap-3">
                                <Icon name="TrendingDown" size={20} className="text-purple-400" />
                                <span className="text-white font-medium">Воронка продаж</span>
                                <Icon name="ExternalLink" size={16} className="text-purple-400 ml-auto" />
                              </div>
                            </div>
                          </Link>
                          
                          <Link to="/ecosystem/sales-script" onClick={() => setKnowledgeOpen(false)}>
                            <div className="p-3 bg-gradient-to-br from-violet-900/30 to-purple-900/30 border border-violet-500/30 rounded-lg hover:shadow-lg hover:shadow-violet-500/20 transition-all cursor-pointer mb-3">
                              <div className="flex items-center gap-3">
                                <Icon name="Phone" size={20} className="text-violet-400" />
                                <span className="text-white font-medium">Скрипты и встречи</span>
                                <Icon name="ExternalLink" size={16} className="text-violet-400 ml-auto" />
                              </div>
                            </div>
                          </Link>
                          
                          <Link to="/ecosystem/tender-guide" onClick={() => setKnowledgeOpen(false)}>
                            <div className="p-3 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer mb-3">
                              <div className="flex items-center gap-3">
                                <Icon name="FileText" size={20} className="text-blue-400" />
                                <span className="text-white font-medium">Работа с тендерами</span>
                                <Icon name="ExternalLink" size={16} className="text-blue-400 ml-auto" />
                              </div>
                            </div>
                          </Link>
                          
                          <Link to="/ecosystem/client-hunting" onClick={() => setKnowledgeOpen(false)}>
                            <div className="p-3 bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer mb-3">
                              <div className="flex items-center gap-3">
                                <Icon name="Target" size={20} className="text-purple-400" />
                                <span className="text-white font-medium">Поиск клиентов</span>
                                <Icon name="ExternalLink" size={16} className="text-purple-400 ml-auto" />
                              </div>
                            </div>
                          </Link>
                          
                          <Link to="/ecosystem/call-scripts" onClick={() => setKnowledgeOpen(false)}>
                            <div className="p-3 bg-gradient-to-br from-cyan-900/30 to-violet-900/30 border border-cyan-500/30 rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer">
                              <div className="flex items-center gap-3">
                                <Icon name="Phone" size={20} className="text-cyan-400" />
                                <span className="text-white font-medium">Скрипты звонков</span>
                                <Icon name="ExternalLink" size={16} className="text-cyan-400 ml-auto" />
                              </div>
                            </div>
                          </Link>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card className="bg-slate-800/50 border-cyan-500/20 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="TrendingUp" size={20} className="text-cyan-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Личный оборот за квартал</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-white">{formatNumber(partnerData.personalTurnover)} ₽</p>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/20 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="Network" size={20} className="text-blue-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Оборот вашей сети</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-white">{formatNumber(partnerData.networkTurnover)} ₽</p>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/20 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="Layers" size={20} className="text-purple-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Глубина сети</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-white">{partnerData.networkDepth} активных уровня</p>
              </Card>

              <Card className="bg-slate-800/50 border-violet-500/20 p-4 md:p-6 shadow-lg shadow-violet-500/10">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="DollarSign" size={20} className="text-violet-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Прогноз дохода за квартал</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-white">{formatNumber(partnerData.quarterForecast)} ₽</p>
              </Card>
            </div>

            <Card className="mt-4 md:mt-6 bg-slate-800/50 border-cyan-500/20 p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm md:text-base text-white font-semibold">До следующего грейда</p>
                <p className="text-sm md:text-base text-cyan-400">{partnerData.progressToNext.current}%</p>
              </div>
              <div className="w-full h-2 md:h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${partnerData.progressToNext.current}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                />
              </div>
              <p className="text-slate-400 text-xs md:text-sm mt-2">
                Осталось: {formatNumber(partnerData.progressToNext.total - partnerData.progressToNext.current)} млн ₽
              </p>
            </Card>
            
            {/* Learning Progress */}
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
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(Object.values(learningProgress).filter(Boolean).length / Object.keys(learningProgress).length) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Link to="/ecosystem/gl">
                  <div className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    learningProgress.financialSystem 
                      ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20' 
                      : 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Icon 
                        name={learningProgress.financialSystem ? "CheckCircle" : "XCircle"} 
                        size={20} 
                        className={learningProgress.financialSystem ? 'text-green-400' : 'text-red-400'} 
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">Финансовая система</p>
                        <p className="text-xs text-slate-400">
                          {learningProgress.financialSystem ? 'Тест сдан ✓' : 'Тест не сдан'}
                        </p>
                      </div>
                      <Icon name="ExternalLink" size={16} className="text-slate-400" />
                    </div>
                  </div>
                </Link>

                <Link to="/sales-funnel">
                  <div className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    learningProgress.salesFunnel 
                      ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20' 
                      : 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Icon 
                        name={learningProgress.salesFunnel ? "CheckCircle" : "XCircle"} 
                        size={20} 
                        className={learningProgress.salesFunnel ? 'text-green-400' : 'text-red-400'} 
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">Воронка продаж</p>
                        <p className="text-xs text-slate-400">
                          {learningProgress.salesFunnel ? 'Тест сдан ✓' : 'Тест не сдан'}
                        </p>
                      </div>
                      <Icon name="ExternalLink" size={16} className="text-slate-400" />
                    </div>
                  </div>
                </Link>

                <Link to="/ecosystem/sales-script">
                  <div className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    learningProgress.salesScript 
                      ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20' 
                      : 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Icon 
                        name={learningProgress.salesScript ? "CheckCircle" : "XCircle"} 
                        size={20} 
                        className={learningProgress.salesScript ? 'text-green-400' : 'text-red-400'} 
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">Скрипты и встречи</p>
                        <p className="text-xs text-slate-400">
                          {learningProgress.salesScript ? 'Тест сдан ✓' : 'Тест не сдан'}
                        </p>
                      </div>
                      <Icon name="ExternalLink" size={16} className="text-slate-400" />
                    </div>
                  </div>
                </Link>

                <Link to="/ecosystem/tender-guide">
                  <div className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    learningProgress.tenderGuide 
                      ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20' 
                      : 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Icon 
                        name={learningProgress.tenderGuide ? "CheckCircle" : "XCircle"} 
                        size={20} 
                        className={learningProgress.tenderGuide ? 'text-green-400' : 'text-red-400'} 
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">Работа с тендерами</p>
                        <p className="text-xs text-slate-400">
                          {learningProgress.tenderGuide ? 'Тест сдан ✓' : 'Тест не сдан'}
                        </p>
                      </div>
                      <Icon name="ExternalLink" size={16} className="text-slate-400" />
                    </div>
                  </div>
                </Link>

                <Link to="/ecosystem/client-hunting">
                  <div className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    learningProgress.clientHunting 
                      ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20' 
                      : 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Icon 
                        name={learningProgress.clientHunting ? "CheckCircle" : "XCircle"} 
                        size={20} 
                        className={learningProgress.clientHunting ? 'text-green-400' : 'text-red-400'} 
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">Поиск клиентов</p>
                        <p className="text-xs text-slate-400">
                          {learningProgress.clientHunting ? 'Тест сдан ✓' : 'Тест не сдан'}
                        </p>
                      </div>
                      <Icon name="ExternalLink" size={16} className="text-slate-400" />
                    </div>
                  </div>
                </Link>

                <Link to="/ecosystem/call-scripts">
                  <div className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    learningProgress.callScripts 
                      ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20' 
                      : 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Icon 
                        name={learningProgress.callScripts ? "CheckCircle" : "XCircle"} 
                        size={20} 
                        className={learningProgress.callScripts ? 'text-green-400' : 'text-red-400'} 
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">Скрипты звонков</p>
                        <p className="text-xs text-slate-400">
                          {learningProgress.callScripts ? 'Тест сдан ✓' : 'Тест не сдан'}
                        </p>
                      </div>
                      <Icon name="ExternalLink" size={16} className="text-slate-400" />
                    </div>
                  </div>
                </Link>
              </div>

              {Object.values(learningProgress).every(Boolean) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg"
                >
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

            {/* Badges Showcase */}
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
                        learningProgress.financialSystem && 'financial_expert',
                        learningProgress.salesFunnel && 'funnel_master',
                        learningProgress.salesScript && 'script_expert',
                        learningProgress.tenderGuide && 'tender_pro',
                        learningProgress.clientHunting && 'hunter',
                        learningProgress.callScripts && 'call_master',
                        Object.values(learningProgress).filter(Boolean).length >= 1 && 'first_test',
                        Object.values(learningProgress).filter(Boolean).length >= 3 && 'three_tests',
                        Object.values(learningProgress).every(Boolean) && 'all_tests'
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
                {/* Financial System Badge */}
                {learningProgress.financialSystem && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative group"
                  >
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 cursor-pointer hover:scale-110 transition-transform">
                      <Icon name="DollarSign" size={24} className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Финансовый эксперт
                    </div>
                  </motion.div>
                )}

                {/* First Test Badge */}
                {Object.values(learningProgress).filter(Boolean).length >= 1 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative group"
                  >
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 cursor-pointer hover:scale-110 transition-transform">
                      <Icon name="Award" size={24} className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Первые шаги
                    </div>
                  </motion.div>
                )}

                {/* Funnel Master */}
                {learningProgress.salesFunnel && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative group"
                  >
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30 cursor-pointer hover:scale-110 transition-transform">
                      <Icon name="TrendingDown" size={24} className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Мастер воронки
                    </div>
                  </motion.div>
                )}

                {/* Script Expert */}
                {learningProgress.salesScript && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative group"
                  >
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30 cursor-pointer hover:scale-110 transition-transform">
                      <Icon name="Phone" size={24} className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Эксперт переговоров
                    </div>
                  </motion.div>
                )}

                {/* Tender Pro */}
                {learningProgress.tenderGuide && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative group"
                  >
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30 cursor-pointer hover:scale-110 transition-transform">
                      <Icon name="FileText" size={24} className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Профи тендеров
                    </div>
                  </motion.div>
                )}

                {/* Hunter */}
                {learningProgress.clientHunting && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative group"
                  >
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30 cursor-pointer hover:scale-110 transition-transform">
                      <Icon name="Target" size={24} className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Охотник за клиентами
                    </div>
                  </motion.div>
                )}

                {/* Call Master */}
                {learningProgress.callScripts && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative group"
                  >
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 cursor-pointer hover:scale-110 transition-transform">
                      <Icon name="PhoneCall" size={24} className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Мастер звонков
                    </div>
                  </motion.div>
                )}

                {/* Three Tests Badge */}
                {Object.values(learningProgress).filter(Boolean).length >= 3 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative group"
                  >
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/40 cursor-pointer hover:scale-110 transition-transform border-2 border-blue-400">
                      <Icon name="BookOpen" size={24} className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Ученик (Редкий)
                    </div>
                  </motion.div>
                )}

                {/* All Tests Badge - Guru */}
                {Object.values(learningProgress).every(Boolean) && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="relative group"
                  >
                    <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-xl shadow-yellow-500/50 cursor-pointer hover:scale-110 transition-transform border-2 border-yellow-400 animate-pulse">
                      <Icon name="Trophy" size={24} className="text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                    <div className="absolute -top-2 -right-2 text-2xl">✨</div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold">
                      Гуру продаж (Эпический)
                    </div>
                  </motion.div>
                )}
              </div>

              {Object.values(learningProgress).every(Boolean) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 p-3 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/50 rounded-lg"
                >
                  <p className="text-sm text-yellow-300 text-center flex items-center justify-center gap-2">
                    <Icon name="Star" size={16} />
                    <span>Вы получили эпический бейдж "Гуру продаж"! 🎉</span>
                  </p>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-12 lg:mb-16"
            >
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                Ваш план на <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">миллиард</span>
              </h2>
              <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto px-4">
                4 фазы роста от первой сделки до финансовой системы с доходом 1 млрд ₽ в год
              </p>
            </motion.div>

            <div className="space-y-4 md:space-y-6">
              {phases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`bg-slate-800/50 border-cyan-500/20 overflow-hidden cursor-pointer transition-all hover:border-cyan-500/40 ${
                      selectedPhase === phase.id ? 'ring-2 ring-cyan-500' : ''
                    }`}
                    onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon name={phase.icon as any} size={24} className="text-white md:hidden" />
                          <Icon name={phase.icon as any} size={32} className="text-white hidden md:block" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-lg md:text-2xl font-bold text-white leading-tight">ФАЗА {phase.id}: {phase.title}</h3>
                            <Icon
                              name={selectedPhase === phase.id ? 'ChevronUp' : 'ChevronDown'}
                              size={20}
                              className="text-cyan-400 flex-shrink-0 md:w-6 md:h-6"
                            />
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
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-700"
                          >
                            {phase.logic && (
                              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                <p className="text-xs md:text-sm text-blue-300 font-semibold mb-2">💡 Логика роста:</p>
                                <p className="text-xs md:text-base text-slate-300">{phase.logic}</p>
                              </div>
                            )}

                            <div className="mb-4 md:mb-6">
                              <p className="text-sm md:text-base text-white font-semibold mb-2 md:mb-3">📦 Материалы для работы:</p>
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
                                <p className="text-xs md:text-sm text-cyan-300 font-semibold mb-2">🎯 Задание:</p>
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

      {/* Simulator */}
      <section className="py-12 md:py-16 lg:py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-12 lg:mb-16"
            >
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                Симулятор распределения <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">18%</span>
              </h2>
              <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto px-4">
                Посмотрите, как распределяются деньги с каждой сделки в вашей сети
              </p>
            </motion.div>

            <Card className="bg-slate-800/50 border-cyan-500/20 p-4 md:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-white font-semibold mb-3">Ваш грейд</label>
                  <div className="grid grid-cols-2 gap-3">
                    {grades.map((grade) => (
                      <button
                        key={grade.name}
                        onClick={() => setSimulatorGrade(grade)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          simulatorGrade.name === grade.name
                            ? `border-${grade.color}-500 bg-${grade.color}-500/20`
                            : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                        }`}
                      >
                        <p className={`font-semibold ${simulatorGrade.name === grade.name ? `text-${grade.color}-400` : 'text-slate-300'}`}>
                          {grade.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">Сумма сделки</label>
                  <input
                    type="number"
                    value={dealAmount}
                    onChange={(e) => setDealAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                  />
                  <p className="text-slate-400 text-sm mt-2">{formatNumber(dealAmount)} ₽</p>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                {distribution.map((item, index) => (
                  <motion.div
                    key={item.level}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 md:p-4 rounded-lg border-2 ${
                      simulatorGrade.level === item.level
                        ? 'border-cyan-500 bg-cyan-500/20'
                        : 'border-slate-600 bg-slate-700/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm md:text-base text-white font-semibold">{item.name}</p>
                        <p className="text-slate-400 text-xs md:text-sm">Уровень {item.level}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl md:text-2xl font-bold text-cyan-400">{item.percent}%</p>
                        <p className="text-sm md:text-base text-white">{formatNumber(item.amount)} ₽</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <div className="p-4 md:p-6 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500 rounded-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <p className="text-base md:text-xl font-bold text-white">Итого фонд распределения</p>
                    <p className="text-2xl md:text-3xl font-bold text-cyan-400">{formatNumber(total)} ₽</p>
                  </div>
                </div>

                {simulatorGrade && (
                  <div className="p-4 md:p-6 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <p className="text-xs md:text-sm text-blue-300 font-semibold mb-2">💡 Ваш доход:</p>
                    <p className="text-xs md:text-base text-white">
                      Если вы {simulatorGrade.name} на уровне {simulatorGrade.level}, ваш доход с этой сделки = {
                        distribution.find(d => d.level === simulatorGrade.level)?.percent
                      }% = {formatNumber(distribution.find(d => d.level === simulatorGrade.level)?.amount || 0)} ₽
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-12 lg:mb-16"
            >
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                Точный калькулятор <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">дохода</span>
              </h2>
              <p className="text-base md:text-xl text-slate-300 px-4">
                Рассчитайте свой доход с учётом всех бонусов и надбавок
              </p>
            </motion.div>

            <Card className="bg-slate-800/50 border-cyan-500/20 p-4 md:p-6 lg:p-8">
              <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                <div>
                  <label className="block text-sm md:text-base text-white font-semibold mb-2 md:mb-3">Ваш грейд</label>
                  <select
                    value={calculatorData.grade}
                    onChange={(e) => setCalculatorData({ ...calculatorData, grade: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm md:text-base"
                  >
                    {grades.map((grade) => (
                      <option key={grade.name} value={grade.name}>{grade.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm md:text-base text-white font-semibold mb-2 md:mb-3">Сумма сделки по КП</label>
                    <input
                      type="number"
                      value={calculatorData.dealAmount}
                      onChange={(e) => setCalculatorData({ ...calculatorData, dealAmount: Number(e.target.value) })}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm md:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm md:text-base text-white font-semibold mb-2 md:mb-3">Финальная цена продажи</label>
                    <input
                      type="number"
                      value={calculatorData.finalPrice}
                      onChange={(e) => setCalculatorData({ ...calculatorData, finalPrice: Number(e.target.value) })}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm md:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm md:text-base text-white font-semibold mb-2 md:mb-3">Уровень в сети</label>
                  <input
                    type="number"
                    min="1"
                    value={calculatorData.networkLevel}
                    onChange={(e) => setCalculatorData({ ...calculatorData, networkLevel: Number(e.target.value) })}
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm md:text-base"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="firstDeal"
                    checked={calculatorData.isFirstDeal}
                    onChange={(e) => setCalculatorData({ ...calculatorData, isFirstDeal: e.target.checked })}
                    className="w-4 h-4 md:w-5 md:h-5 mt-0.5"
                  />
                  <label htmlFor="firstDeal" className="text-xs md:text-base text-white">
                    Это первая сделка в первый месяц (бонус x2 для Агентов)
                  </label>
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="p-3 md:p-4 bg-slate-700/30 rounded-lg">
                  <p className="text-xs md:text-sm text-slate-400 mb-2">Шаг 1: Доход по сетевой модели</p>
                  <p className="text-xs md:text-base text-white">
                    Как {calculatorData.grade} с {calculatorData.networkLevel}-й линии вы получаете:{' '}
                    <span className="font-bold text-cyan-400">{formatNumber(income.networkIncome)} ₽</span>
                  </p>
                </div>

                <div className="p-3 md:p-4 bg-slate-700/30 rounded-lg">
                  <p className="text-xs md:text-sm text-slate-400 mb-2">Шаг 2: Бонус за эффективность</p>
                  <p className="text-xs md:text-base text-white">
                    Вы продали дороже КП на {formatNumber(calculatorData.finalPrice - calculatorData.dealAmount)} ₽. 50% вашей доли ={' '}
                    <span className="font-bold text-green-400">{formatNumber(income.bonusIncome)} ₽</span>
                  </p>
                </div>

                {income.startBonus > 0 && (
                  <div className="p-3 md:p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                    <p className="text-xs md:text-sm text-cyan-300 mb-2">Шаг 3: Стартовый бонус</p>
                    <p className="text-xs md:text-base text-white">
                      Ваш личный % удвоен! +{' '}
                      <span className="font-bold text-cyan-400">{formatNumber(income.startBonus)} ₽</span>
                    </p>
                  </div>
                )}

                <div className="p-4 md:p-6 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-2 border-cyan-500 rounded-lg">
                  <p className="text-base md:text-xl font-bold text-white mb-2">ИТОГО С ЭТОЙ СДЕЛКИ:</p>
                  <p className="text-2xl md:text-4xl font-bold text-cyan-400">{formatNumber(income.total)} ₽</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Knowledge Base - Dropdown */}
      <section className="py-12 md:py-16 lg:py-24 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-8 md:mb-12"
            >
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                База знаний
              </h2>
              <p className="text-base md:text-xl text-slate-300 px-4">
                Все материалы для вашего роста — от старта до амбассадора
              </p>
            </motion.div>

            <Card className="bg-slate-800/50 border-cyan-500/20 overflow-hidden">
              <button
                onClick={() => setKnowledgeOpen(!knowledgeOpen)}
                className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-slate-800/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Icon name="BookOpen" size={24} className="text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-white">Открыть базу знаний</h3>
                    <p className="text-sm text-slate-400 mt-1">3 раздела • Воронка продаж • Финансы • Развитие</p>
                  </div>
                </div>
                <Icon 
                  name={knowledgeOpen ? "ChevronUp" : "ChevronDown"} 
                  size={24} 
                  className="text-cyan-400 flex-shrink-0" 
                />
              </button>

              <AnimatePresence>
                {knowledgeOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-slate-700"
                  >
                    <div className="p-6 md:p-8 space-y-4">
                      {/* Финансовая система */}
                      <Link to="/ecosystem/gl">
                        <div className="p-4 md:p-6 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                              <Icon name="Coins" size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg md:text-xl font-bold text-white mb-2">1. Финансовая система</h4>
                              <p className="text-sm text-slate-300">
                                Система доходов, грейды, калькулятор прибыли и прогнозы развития партнёрской сети
                              </p>
                            </div>
                            <Icon name="ExternalLink" size={18} className="text-cyan-400 flex-shrink-0" />
                          </div>
                        </div>
                      </Link>

                      {/* Воронка продаж */}
                      <Link to="/sales-funnel">
                        <div className="p-4 md:p-6 bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(147,51,234,0.5)]">
                              <Icon name="TrendingDown" size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg md:text-xl font-bold text-white mb-2">2. Воронка продаж</h4>
                              <p className="text-sm text-slate-300">
                                5 этапов работы с клиентом: от лида до подписания. Жёсткие правила + интерактивный тест
                              </p>
                            </div>
                            <Icon name="ExternalLink" size={18} className="text-purple-400 flex-shrink-0" />
                          </div>
                        </div>
                      </Link>

                      {/* Фазы развития */}
                      <div className="p-4 md:p-6 bg-slate-900/50 border border-slate-700 rounded-lg">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                            <Icon name="Rocket" size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg md:text-xl font-bold text-white mb-2">3. Фазы развития</h4>
                            <p className="text-sm text-slate-300 mb-4">
                              Пошаговый план роста от Агента до Амбассадора с материалами для каждого этапа
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {phases.map((phase) => (
                            <div key={phase.id} className="p-3 bg-slate-800/50 border border-slate-600 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-8 h-8 rounded bg-gradient-to-br ${phase.color} flex items-center justify-center`}>
                                  <Icon name={phase.icon as any} size={16} className="text-white" />
                                </div>
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

      {/* CTA */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-500/30 p-6 md:p-10 lg:p-12">
              <Icon name="Rocket" size={48} className="text-cyan-400 mx-auto mb-4 md:hidden" />
              <Icon name="Rocket" size={64} className="text-cyan-400 mx-auto mb-6 hidden md:block" />
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
                Готовы начать путь к миллиарду?
              </h2>
              <p className="text-sm md:text-lg lg:text-xl text-slate-300 mb-6 md:mb-8 px-2">
                Скачайте стартовый пакет и совершите 50 целевых контактов за 14 дней. Всё остальное — вопрос ваших амбиций и действий.
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