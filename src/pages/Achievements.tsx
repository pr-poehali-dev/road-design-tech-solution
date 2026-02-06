import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  unlocked: boolean;
  unlockedAt?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  icon: string;
  color: string;
  completed: boolean;
  reward?: string;
}

export default function Achievements() {
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
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

  const badges: Badge[] = [
    {
      id: 'first_test',
      title: 'Первые шаги',
      description: 'Пройдите первый тест по любому разделу',
      icon: 'Award',
      color: 'from-cyan-500 to-blue-600',
      requirement: 'Пройти 1 тест',
      unlocked: Object.values(learningProgress).filter(Boolean).length >= 1,
      unlockedAt: learningProgress.salesFunnel ? Date.now() : undefined,
      rarity: 'common'
    },
    {
      id: 'financial_expert',
      title: 'Финансовый эксперт',
      description: 'Успешно сдан тест по финансовой системе',
      icon: 'DollarSign',
      color: 'from-cyan-500 to-blue-600',
      requirement: 'Сдать тест "Финансовая система"',
      unlocked: learningProgress.financialSystem,
      rarity: 'common'
    },
    {
      id: 'funnel_master',
      title: 'Мастер воронки',
      description: 'Успешно сдан тест по воронке продаж',
      icon: 'TrendingDown',
      color: 'from-purple-500 to-violet-600',
      requirement: 'Сдать тест "Воронка продаж"',
      unlocked: learningProgress.salesFunnel,
      rarity: 'common'
    },
    {
      id: 'script_expert',
      title: 'Эксперт переговоров',
      description: 'Успешно сдан тест по скриптам и встречам',
      icon: 'Phone',
      color: 'from-violet-500 to-purple-600',
      requirement: 'Сдать тест "Скрипты и встречи"',
      unlocked: learningProgress.salesScript,
      rarity: 'common'
    },
    {
      id: 'tender_pro',
      title: 'Профи тендеров',
      description: 'Успешно сдан тест по работе с тендерами',
      icon: 'FileText',
      color: 'from-blue-500 to-cyan-600',
      requirement: 'Сдать тест "Работа с тендерами"',
      unlocked: learningProgress.tenderGuide,
      rarity: 'common'
    },
    {
      id: 'hunter',
      title: 'Охотник за клиентами',
      description: 'Успешно сдан тест по поиску клиентов',
      icon: 'Target',
      color: 'from-purple-500 to-violet-600',
      requirement: 'Сдать тест "Поиск клиентов"',
      unlocked: learningProgress.clientHunting,
      rarity: 'common'
    },
    {
      id: 'call_master',
      title: 'Мастер звонков',
      description: 'Успешно сдан тест по скриптам звонков',
      icon: 'PhoneCall',
      color: 'from-cyan-500 to-blue-600',
      requirement: 'Сдать тест "Скрипты звонков"',
      unlocked: learningProgress.callScripts,
      rarity: 'common'
    },
    {
      id: 'three_tests',
      title: 'Ученик',
      description: 'Пройдите 3 любых теста',
      icon: 'BookOpen',
      color: 'from-blue-500 to-purple-600',
      requirement: 'Пройти 3 теста',
      unlocked: Object.values(learningProgress).filter(Boolean).length >= 3,
      rarity: 'rare'
    },
    {
      id: 'all_tests',
      title: 'Гуру продаж',
      description: 'Пройдите все тесты базы знаний',
      icon: 'Trophy',
      color: 'from-yellow-500 to-orange-600',
      requirement: 'Пройти все 5 тестов',
      unlocked: Object.values(learningProgress).every(Boolean),
      rarity: 'epic'
    },
    {
      id: 'perfect_score',
      title: 'Перфекционист',
      description: 'Наберите 100% в любом тесте',
      icon: 'Star',
      color: 'from-purple-500 to-pink-600',
      requirement: '100% в любом тесте',
      unlocked: false,
      rarity: 'rare'
    },
    {
      id: 'speed_learner',
      title: 'Быстрый ученик',
      description: 'Пройдите все тесты за один день',
      icon: 'Zap',
      color: 'from-cyan-500 to-violet-600',
      requirement: 'Все тесты за 1 день',
      unlocked: false,
      rarity: 'epic'
    },
    {
      id: 'legend',
      title: 'Легенда DEOD',
      description: 'Получите все возможные бейджи',
      icon: 'Crown',
      color: 'from-yellow-400 via-orange-500 to-red-600',
      requirement: 'Получить все бейджи',
      unlocked: false,
      rarity: 'legendary'
    }
  ];

  const achievements: Achievement[] = [
    {
      id: 'complete_all_tests',
      title: 'Знания — сила',
      description: 'Завершите все тесты базы знаний',
      progress: Object.values(learningProgress).filter(Boolean).length,
      total: 5,
      icon: 'BookCheck',
      color: 'from-cyan-500 to-blue-600',
      completed: Object.values(learningProgress).every(Boolean),
      reward: 'Бейдж "Гуру продаж"'
    },
    {
      id: 'unlock_3_badges',
      title: 'Коллекционер',
      description: 'Получите 3 любых бейджа',
      progress: badges.filter(b => b.unlocked).length,
      total: 3,
      icon: 'Award',
      color: 'from-purple-500 to-violet-600',
      completed: badges.filter(b => b.unlocked).length >= 3
    },
    {
      id: 'unlock_all_common',
      title: 'Основы освоены',
      description: 'Получите все обычные бейджи',
      progress: badges.filter(b => b.rarity === 'common' && b.unlocked).length,
      total: badges.filter(b => b.rarity === 'common').length,
      icon: 'CheckCircle',
      color: 'from-blue-500 to-purple-600',
      completed: badges.filter(b => b.rarity === 'common').every(b => b.unlocked)
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-slate-500';
      case 'rare': return 'border-blue-500';
      case 'epic': return 'border-purple-500';
      case 'legendary': return 'border-yellow-500';
      default: return 'border-slate-500';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'shadow-slate-500/20';
      case 'rare': return 'shadow-blue-500/30';
      case 'epic': return 'shadow-purple-500/40';
      case 'legendary': return 'shadow-yellow-500/50';
      default: return 'shadow-slate-500/20';
    }
  };

  const totalBadges = badges.length;
  const unlockedBadges = badges.filter(b => b.unlocked).length;
  const completionPercentage = Math.round((unlockedBadges / totalBadges) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-blue-500/20">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link to="/ecosystem" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 via-cyan-500 to-violet-600 bg-clip-text text-transparent">
            DEOD
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <Button 
                onClick={() => setKnowledgeOpen(!knowledgeOpen)}
                className="bg-slate-800/80 border border-slate-600/50 hover:bg-slate-700/80 hover:border-slate-500/50 shadow-lg text-xs md:text-sm"
                size="sm"
              >
                <Icon name="BookOpen" className="mr-2" size={16} />
                База знаний
                <Icon name={knowledgeOpen ? "ChevronUp" : "ChevronDown"} className="ml-2 animate-pulse" size={18} />
              </Button>
              <AnimatePresence>
                {knowledgeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-lg shadow-2xl overflow-hidden"
                  >
                    <Link to="/ecosystem/gl" onClick={() => setKnowledgeOpen(false)}>
                      <div className="p-3 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-b border-cyan-500/30 hover:bg-cyan-900/40 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Icon name="DollarSign" size={20} className="text-cyan-400" />
                          <span className="text-white font-medium">Финансовая система</span>
                          <Icon name="ExternalLink" size={16} className="text-cyan-400 ml-auto" />
                        </div>
                      </div>
                    </Link>
                    
                    <Link to="/sales-funnel" onClick={() => setKnowledgeOpen(false)}>
                      <div className="p-3 bg-gradient-to-br from-purple-900/30 to-violet-900/30 border-b border-purple-500/30 hover:bg-purple-900/40 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Icon name="TrendingDown" size={20} className="text-purple-400" />
                          <span className="text-white font-medium">Воронка продаж</span>
                          <Icon name="ExternalLink" size={16} className="text-purple-400 ml-auto" />
                        </div>
                      </div>
                    </Link>
                    
                    <Link to="/ecosystem/sales-script" onClick={() => setKnowledgeOpen(false)}>
                      <div className="p-3 bg-gradient-to-br from-violet-900/30 to-purple-900/30 border-b border-violet-500/30 hover:bg-violet-900/40 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Icon name="Phone" size={20} className="text-violet-400" />
                          <span className="text-white font-medium">Скрипты и встречи</span>
                          <Icon name="ExternalLink" size={16} className="text-violet-400 ml-auto" />
                        </div>
                      </div>
                    </Link>
                    
                    <Link to="/ecosystem/tender-guide" onClick={() => setKnowledgeOpen(false)}>
                      <div className="p-3 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-b border-blue-500/30 hover:bg-blue-900/40 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Icon name="FileText" size={20} className="text-blue-400" />
                          <span className="text-white font-medium">Работа с тендерами</span>
                          <Icon name="ExternalLink" size={16} className="text-blue-400 ml-auto" />
                        </div>
                      </div>
                    </Link>
                    
                    <Link to="/ecosystem/client-hunting" onClick={() => setKnowledgeOpen(false)}>
                      <div className="p-3 bg-gradient-to-br from-purple-900/30 to-violet-900/30 border-b border-purple-500/30 hover:bg-purple-900/40 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Icon name="Target" size={20} className="text-purple-400" />
                          <span className="text-white font-medium">Поиск клиентов</span>
                          <Icon name="ExternalLink" size={16} className="text-purple-400 ml-auto" />
                        </div>
                      </div>
                    </Link>
                    
                    <Link to="/ecosystem/call-scripts" onClick={() => setKnowledgeOpen(false)}>
                      <div className="p-3 bg-gradient-to-br from-cyan-900/30 to-violet-900/30 hover:bg-cyan-900/40 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Icon name="Phone" size={20} className="text-cyan-400" />
                          <span className="text-white font-medium">Скрипты звонков</span>
                          <Icon name="ExternalLink" size={16} className="text-cyan-400 ml-auto" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/ecosystem">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg text-xs md:text-sm" size="sm">
                <Icon name="ArrowLeft" className="mr-2" size={16} />
                Назад
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24 md:pt-28 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 bg-clip-text text-transparent">
            Достижения и награды
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto">
            Ваш прогресс в освоении системы продаж DEOD
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-violet-500/30 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                <Icon name="Trophy" size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Общий прогресс</h2>
                <p className="text-slate-400">Открыто {unlockedBadges} из {totalBadges} бейджей</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Прогресс коллекции</span>
                <span className="text-sm text-violet-400 font-semibold">{completionPercentage}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-400">{badges.filter(b => b.rarity === 'common' && b.unlocked).length}</p>
                <p className="text-xs text-slate-400 mt-1">Обычные</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-400">{badges.filter(b => b.rarity === 'rare' && b.unlocked).length}</p>
                <p className="text-xs text-slate-400 mt-1">Редкие</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-400">{badges.filter(b => b.rarity === 'epic' && b.unlocked).length}</p>
                <p className="text-xs text-slate-400 mt-1">Эпические</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-400">{badges.filter(b => b.rarity === 'legendary' && b.unlocked).length}</p>
                <p className="text-xs text-slate-400 mt-1">Легендарные</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Badges Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Icon name="Award" size={28} className="text-yellow-400" />
            Бейджи
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedBadge(badge)}
              >
                <Card className={`cursor-pointer transition-all hover:scale-105 ${
                  badge.unlocked 
                    ? `bg-slate-800/50 border-2 ${getRarityColor(badge.rarity)} shadow-lg ${getRarityGlow(badge.rarity)}` 
                    : 'bg-slate-800/20 border-slate-700/30 opacity-50 grayscale'
                }`}>
                  <div className="p-4 text-center">
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center ${
                      !badge.unlocked && 'opacity-30'
                    }`}>
                      <Icon name={badge.icon} size={32} className="text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-1 text-sm">{badge.title}</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">{badge.rarity}</p>
                    {badge.unlocked && (
                      <div className="mt-2">
                        <Icon name="CheckCircle" size={16} className="text-green-400 mx-auto" />
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Icon name="Target" size={28} className="text-purple-400" />
            Испытания
          </h2>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 ${
                  achievement.completed 
                    ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/50' 
                    : 'bg-slate-800/50 border-slate-700/50'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${achievement.color}`}>
                      <Icon name={achievement.icon} size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-bold text-lg">{achievement.title}</h3>
                          <p className="text-sm text-slate-400">{achievement.description}</p>
                        </div>
                        {achievement.completed && (
                          <Icon name="CheckCircle" size={24} className="text-green-400" />
                        )}
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-400">Прогресс</span>
                          <span className="text-xs text-slate-300 font-semibold">
                            {achievement.progress} / {achievement.total}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full bg-gradient-to-r ${achievement.color}`}
                          />
                        </div>
                        {achievement.reward && (
                          <p className="text-xs text-yellow-400 mt-2">
                            🏆 Награда: {achievement.reward}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBadge(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full"
            >
              <Card className={`bg-slate-900 border-2 ${getRarityColor(selectedBadge.rarity)} shadow-2xl ${getRarityGlow(selectedBadge.rarity)}`}>
                <div className="p-6 text-center">
                  <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${selectedBadge.color} flex items-center justify-center ${
                    !selectedBadge.unlocked && 'opacity-30 grayscale'
                  }`}>
                    <Icon name={selectedBadge.icon} size={48} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedBadge.title}</h2>
                  <p className="text-sm text-slate-400 uppercase tracking-wider mb-4">{selectedBadge.rarity}</p>
                  <p className="text-slate-300 mb-4">{selectedBadge.description}</p>
                  <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                    <p className="text-xs text-slate-400 mb-1">Требование</p>
                    <p className="text-white font-semibold">{selectedBadge.requirement}</p>
                  </div>
                  {selectedBadge.unlocked ? (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <Icon name="CheckCircle" size={20} />
                      <span className="font-semibold">Получено!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                      <Icon name="Lock" size={20} />
                      <span className="font-semibold">Заблокировано</span>
                    </div>
                  )}
                  <Button
                    onClick={() => setSelectedBadge(null)}
                    className="mt-6 w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                  >
                    Закрыть
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}