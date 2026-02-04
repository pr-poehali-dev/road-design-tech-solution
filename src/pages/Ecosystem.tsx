import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

interface PartnerData {
  name: string;
  grade: string;
  personalTurnover: number;
  networkTurnover: number;
  networkDepth: number;
  quarterForecast: number;
  progressToNext: { current: number; total: number };
}

const mockPartnerData: PartnerData = {
  name: 'Александр',
  grade: 'Партнёр',
  personalTurnover: 45000000,
  networkTurnover: 120000000,
  networkDepth: 2,
  quarterForecast: 18000000,
  progressToNext: { current: 45, total: 100 },
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
    color: 'from-purple-500 to-pink-600',
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
    color: 'from-amber-500 to-orange-600',
  },
];

const grades = [
  { name: 'Агент', level: 4, color: 'cyan' },
  { name: 'Партнёр', level: 3, color: 'blue' },
  { name: 'Старший партнёр', level: 2, color: 'purple' },
  { name: 'Генеральный партнёр', level: 1, color: 'pink' },
  { name: 'Амбассадор', level: 0, color: 'amber' },
];

export default function Ecosystem() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [simulatorGrade, setSimulatorGrade] = useState(grades[1]);
  const [dealAmount, setDealAmount] = useState(10000000);
  const [calculatorData, setCalculatorData] = useState({
    grade: grades[1].name,
    dealAmount: 50000000,
    finalPrice: 55000000,
    networkLevel: 1,
    isFirstDeal: false,
  });

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
      <section className="py-8 md:py-12 bg-slate-900/50 border-b border-cyan-500/20">
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
                  {mockPartnerData.name}, вы — {mockPartnerData.grade}
                </h1>
                <p className="text-sm md:text-base text-cyan-400">Добро пожаловать в экосистему DEOD</p>
              </div>
              <Link to="/ecosystem/gl">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/30">
                  <Icon name="Home" className="mr-2" size={18} />
                  Главная
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card className="bg-slate-800/50 border-cyan-500/20 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="TrendingUp" size={20} className="text-cyan-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Личный оборот за квартал</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-white">{formatNumber(mockPartnerData.personalTurnover)} ₽</p>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/20 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="Network" size={20} className="text-blue-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Оборот вашей сети</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-white">{formatNumber(mockPartnerData.networkTurnover)} ₽</p>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/20 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="Layers" size={20} className="text-purple-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Глубина сети</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-white">{mockPartnerData.networkDepth} активных уровня</p>
              </Card>

              <Card className="bg-slate-800/50 border-pink-500/20 p-4 md:p-6">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <Icon name="DollarSign" size={20} className="text-pink-400 md:w-6 md:h-6" />
                  <p className="text-slate-400 text-xs md:text-sm">Прогноз дохода за квартал</p>
                </div>
                <p className="text-lg md:text-2xl font-bold text-white">{formatNumber(mockPartnerData.quarterForecast)} ₽</p>
              </Card>
            </div>

            <Card className="mt-4 md:mt-6 bg-slate-800/50 border-cyan-500/20 p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm md:text-base text-white font-semibold">До следующего грейда</p>
                <p className="text-sm md:text-base text-cyan-400">{mockPartnerData.progressToNext.current}%</p>
              </div>
              <div className="w-full h-2 md:h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mockPartnerData.progressToNext.current}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                />
              </div>
              <p className="text-slate-400 text-xs md:text-sm mt-2">
                Осталось: {formatNumber(mockPartnerData.progressToNext.total - mockPartnerData.progressToNext.current)} млн ₽
              </p>
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

      {/* Knowledge Base */}
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
                База знаний
              </h2>
              <p className="text-base md:text-xl text-slate-300 px-4">
                Все материалы для вашего роста — от старта до амбассадора
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {phases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-cyan-500/20 p-4 md:p-6 h-full">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${phase.color} flex items-center justify-center mb-3 md:mb-4`}>
                      <Icon name={phase.icon as any} size={20} className="text-white md:hidden" />
                      <Icon name={phase.icon as any} size={24} className="text-white hidden md:block" />
                    </div>
                    <h3 className="text-base md:text-xl font-bold text-white mb-2 md:mb-3">Фаза {phase.id}: {phase.title}</h3>
                    <ul className="space-y-2 mb-4">
                      {phase.materials.slice(0, 3).map((material, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300">
                          <Icon name="FileText" size={14} className="text-cyan-400 flex-shrink-0 mt-0.5 md:w-4 md:h-4" />
                          <span className="text-xs md:text-sm">{material}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-slate-700 hover:bg-slate-600 text-xs md:text-sm py-4 md:py-5">
                      <Icon name="FolderOpen" size={16} className="mr-2 md:w-5 md:h-5" />
                      Открыть материалы
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
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