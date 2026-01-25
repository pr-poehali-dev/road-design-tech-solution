import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart
} from 'recharts';

const gradeData = [
  {
    id: 1,
    name: 'Агент',
    nameEn: 'Agent',
    baseRate: 5,
    color: '#06b6d4',
    entry: 'Подписание агентского соглашения',
    bonus: 'Ускоренный старт: первая сделка = 10%',
    personalSales: 5,
    teamBonus: 0,
    requirements: []
  },
  {
    id: 2,
    name: 'Партнёр',
    nameEn: 'Partner',
    baseRate: 10,
    color: '#8b5cf6',
    entry: 'Успешное выполнение первой сделки',
    privileges: 'Полный доступ к CRM, ИИ для КП, базы',
    personalSales: 10,
    teamBonus: 0,
    requirements: ['Первая сделка закрыта']
  },
  {
    id: 3,
    name: 'Старший партнёр',
    nameEn: 'Senior Partner',
    baseRate: 13,
    color: '#ec4899',
    personalSales: 13,
    teamBonus: 3,
    requirements: ['30 млн руб. за квартал', '1 менеджер с закрытой сделкой'],
    privileges: 'Приоритетное право на закрепление региона'
  },
  {
    id: 4,
    name: 'Генеральный партнёр',
    nameEn: 'General Partner',
    baseRate: 16,
    color: '#f59e0b',
    personalSales: 16,
    teamBonus: 5,
    additionalBonus: 2,
    requirements: ['3 активных менеджера', '60 млн руб. структурный оборот'],
    privileges: 'Участие в обучающих вебинарах как эксперт'
  },
  {
    id: 5,
    name: 'Амбассадор',
    nameEn: 'Ambassador',
    baseRate: 18,
    color: '#10b981',
    personalSales: 18,
    teamBonus: 5,
    additionalBonus: 5,
    requirements: ['2 Генеральных партнёра в сети', '150 млн руб. оборот сети'],
    privileges: 'Доля в годовой прибыли DEOD, статус стратегического советника'
  }
];

const incomeComparisonData = [
  { deal: '10 млн', agent: 500000, partner: 1000000, senior: 1300000, general: 1600000, ambassador: 1800000 },
  { deal: '20 млн', agent: 1000000, partner: 2000000, senior: 2600000, general: 3200000, ambassador: 3600000 },
  { deal: '30 млн', agent: 1500000, partner: 3000000, senior: 3900000, general: 4800000, ambassador: 5400000 },
  { deal: '50 млн', agent: 2500000, partner: 5000000, senior: 6500000, general: 8000000, ambassador: 9000000 }
];

const prepaymentBonusData = [
  { range: '30-50%', bonus: 1, total: 11, color: '#06b6d4' },
  { range: '51-70%', bonus: 2, total: 12, color: '#8b5cf6' },
  { range: '>70%', bonus: 3, total: 13, color: '#ec4899' }
];

const growthScenarioData = [
  { month: 'Месяц 1', agent: 500000, team: 0 },
  { month: 'Месяц 2', agent: 1000000, team: 0 },
  { month: 'Месяц 3', agent: 1300000, team: 300000 },
  { month: 'Месяц 4', agent: 1600000, team: 800000 },
  { month: 'Месяц 5', agent: 1600000, team: 1500000 },
  { month: 'Месяц 6', agent: 1800000, team: 2500000 }
];

const profitSharingData = [
  { scenario: 'КП: 10 млн\nФакт: 12 млн', kpPrice: 10, actualPrice: 12, extra: 2, partnerShare: 1, deodShare: 1 },
  { scenario: 'КП: 15 млн\nФакт: 18 млн', kpPrice: 15, actualPrice: 18, extra: 3, partnerShare: 1.5, deodShare: 1.5 },
  { scenario: 'КП: 20 млн\nФакт: 25 млн', kpPrice: 20, actualPrice: 25, extra: 5, partnerShare: 2.5, deodShare: 2.5 }
];

const PartnerSystem = () => {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [calculatorDeal, setCalculatorDeal] = useState(10000000);
  const [calculatorGrade, setCalculatorGrade] = useState(2);
  const [calculatorPrepayment, setCalculatorPrepayment] = useState(50);

  const calculateIncome = () => {
    const grade = gradeData[calculatorGrade - 1];
    const baseIncome = (calculatorDeal * grade.personalSales) / 100;
    
    let prepaymentBonus = 0;
    if (calculatorPrepayment >= 30 && calculatorPrepayment <= 50) prepaymentBonus = 1;
    else if (calculatorPrepayment >= 51 && calculatorPrepayment <= 70) prepaymentBonus = 2;
    else if (calculatorPrepayment > 70) prepaymentBonus = 3;
    
    const prepaymentIncome = (calculatorDeal * prepaymentBonus) / 100;
    
    return {
      base: baseIncome,
      prepayment: prepaymentIncome,
      total: baseIncome + prepaymentIncome
    };
  };

  const income = calculateIncome();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <header className="border-b border-purple-500/30 bg-slate-900/80 backdrop-blur-lg shadow-[0_0_30px_rgba(139,92,246,0.3)] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.6)] animate-pulse">
                <Icon name="TrendingUp" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Партнёрская система DEOD
                </h1>
                <p className="text-purple-400/80 text-sm mt-1">Система грейдов и мотивации партнёров</p>
              </div>
            </div>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              <Icon name="Home" size={16} className="mr-2" />
              На главную
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: 'Award', label: 'Грейдов', value: '5', color: 'purple' },
            { icon: 'Percent', label: 'Макс. ставка', value: '18%', color: 'pink' },
            { icon: 'TrendingUp', label: 'Лимит', value: '20%', color: 'cyan' },
            { icon: 'Users', label: 'Уровней сети', value: '∞', color: 'blue' }
          ].map((stat, idx) => (
            <Card
              key={idx}
              className="bg-slate-900/50 border-purple-500/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300"
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 flex items-center justify-center`}>
                    <Icon name={stat.icon as any} size={24} className={`text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-purple-400">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="grades" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 border border-purple-500/30">
            <TabsTrigger value="grades">Грейды</TabsTrigger>
            <TabsTrigger value="mechanics">Механики</TabsTrigger>
            <TabsTrigger value="comparison">Сравнение</TabsTrigger>
            <TabsTrigger value="calculator">Калькулятор</TabsTrigger>
            <TabsTrigger value="growth">Рост дохода</TabsTrigger>
          </TabsList>

          <TabsContent value="grades" className="space-y-4">
            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">Структура грейдов</CardTitle>
                <CardDescription className="text-slate-400">
                  5 уровней партнёрства с растущими привилегиями и доходом
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="nameEn" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #a855f7' }}
                      labelStyle={{ color: '#a855f7' }}
                    />
                    <Legend />
                    <Bar dataKey="personalSales" name="Личные продажи %" fill="#8b5cf6" />
                    <Bar dataKey="teamBonus" name="Команда %" fill="#ec4899" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {gradeData.map((grade, idx) => (
              <Card
                key={idx}
                className={`bg-slate-900/50 border-purple-500/30 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] ${
                  selectedGrade === idx ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedGrade(selectedGrade === idx ? null : idx)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-white text-2xl shadow-lg"
                        style={{ backgroundColor: grade.color }}
                      >
                        {grade.id}
                      </div>
                      <div>
                        <CardTitle className="text-purple-400">{grade.name}</CardTitle>
                        <CardDescription className="text-slate-400">{grade.nameEn}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-pink-400">{grade.personalSales}%</p>
                      <p className="text-xs text-slate-400 mt-1">базовая ставка</p>
                    </div>
                  </div>
                </CardHeader>
                {selectedGrade === idx && (
                  <CardContent className="border-t border-purple-500/20 pt-4 space-y-4">
                    {grade.entry && (
                      <div>
                        <p className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                          <Icon name="LogIn" size={18} />
                          Условия входа:
                        </p>
                        <p className="text-slate-300 text-sm">{grade.entry}</p>
                      </div>
                    )}

                    {grade.requirements.length > 0 && (
                      <div>
                        <p className="text-pink-400 font-semibold mb-2 flex items-center gap-2">
                          <Icon name="CheckCircle2" size={18} />
                          Требования:
                        </p>
                        <ul className="text-slate-300 text-sm space-y-1">
                          {grade.requirements.map((req, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {grade.bonus && (
                      <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                        <p className="text-cyan-400 font-semibold mb-1 flex items-center gap-2">
                          <Icon name="Zap" size={18} />
                          Бонус:
                        </p>
                        <p className="text-slate-300 text-sm">{grade.bonus}</p>
                      </div>
                    )}

                    {grade.privileges && (
                      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                        <p className="text-purple-400 font-semibold mb-1 flex items-center gap-2">
                          <Icon name="Star" size={18} />
                          Привилегии:
                        </p>
                        <p className="text-slate-300 text-sm">{grade.privileges}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-purple-500/10">
                      <div className="text-center p-3 rounded-lg bg-purple-500/5">
                        <p className="text-3xl font-bold text-purple-400">{grade.personalSales}%</p>
                        <p className="text-xs text-slate-400 mt-1">Личные продажи</p>
                      </div>
                      {grade.teamBonus > 0 && (
                        <div className="text-center p-3 rounded-lg bg-pink-500/5">
                          <p className="text-3xl font-bold text-pink-400">{grade.teamBonus}%</p>
                          <p className="text-xs text-slate-400 mt-1">Команда</p>
                        </div>
                      )}
                      {grade.additionalBonus && (
                        <div className="text-center p-3 rounded-lg bg-cyan-500/5">
                          <p className="text-3xl font-bold text-cyan-400">+{grade.additionalBonus}%</p>
                          <p className="text-xs text-slate-400 mt-1">Доп. бонус</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="mechanics" className="space-y-6">
            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">Премия за эффективную продажу (50/50)</CardTitle>
                <CardDescription className="text-slate-400">
                  Если финальная цена контракта выше расчётной в КП, дополнительная прибыль делится поровну
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={profitSharingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="scenario" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #a855f7' }}
                      labelStyle={{ color: '#a855f7' }}
                    />
                    <Legend />
                    <Bar dataKey="partnerShare" name="Доля партнёра (млн ₽)" fill="#8b5cf6" />
                    <Bar dataKey="deodShare" name="Доля DEOD (млн ₽)" fill="#ec4899" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
                  <p className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
                    <Icon name="Calculator" size={20} />
                    Примеры расчёта:
                  </p>
                  <div className="space-y-2 text-sm text-slate-300">
                    <p>📊 КП: 10 млн → Факт: 12 млн → Переплата: 2 млн → Партнёр: <span className="text-purple-400 font-bold">1 млн</span></p>
                    <p>📊 КП: 15 млн → Факт: 18 млн → Переплата: 3 млн → Партнёр: <span className="text-purple-400 font-bold">1.5 млн</span></p>
                    <p>📊 КП: 20 млн → Факт: 25 млн → Переплата: 5 млн → Партнёр: <span className="text-purple-400 font-bold">2.5 млн</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">Бонус «Кэш-драйв» за предоплату</CardTitle>
                <CardDescription className="text-slate-400">
                  Чем выше аванс от клиента, тем выше процент партнёра
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepaymentBonusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="range" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #a855f7' }}
                      labelStyle={{ color: '#a855f7' }}
                    />
                    <Legend />
                    <Bar dataKey="bonus" name="Доп. бонус %" fill="#06b6d4" />
                    <Bar dataKey="total" name="Итого с бонусом %" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {prepaymentBonusData.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border"
                      style={{ backgroundColor: `${item.color}15`, borderColor: `${item.color}40` }}
                    >
                      <p className="text-2xl font-bold mb-2" style={{ color: item.color }}>
                        {item.range}
                      </p>
                      <p className="text-slate-300 text-sm">Предоплата</p>
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <p className="text-3xl font-bold" style={{ color: item.color }}>
                          +{item.bonus}%
                        </p>
                        <p className="text-slate-400 text-xs mt-1">к базовой ставке</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">Ключевые правила</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <div className="flex items-start gap-3">
                    <Icon name="AlertCircle" size={20} className="text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-purple-400 font-semibold mb-1">Лимит выплат</p>
                      <p className="text-slate-300 text-sm">
                        Максимальный процент с расчётной суммы КП для партнёра — <span className="text-purple-400 font-bold">20%</span> 
                        (уровень Амбассадора). Дополнительные 5% Амбассадора — это доля с оборота сети, а не с конкретной сделки.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/30">
                  <div className="flex items-start gap-3">
                    <Icon name="Calendar" size={20} className="text-pink-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-pink-400 font-semibold mb-1">Скользящий квартал</p>
                      <p className="text-slate-300 text-sm">
                        Условия грейда проверяются за последние 3 месяца, а не за календарный квартал. 
                        Это позволяет партнёру расти быстрее без привязки к датам.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <div className="flex items-start gap-3">
                    <Icon name="Zap" size={20} className="text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-cyan-400 font-semibold mb-1">Ускоренный старт</p>
                      <p className="text-slate-300 text-sm">
                        Если первая сделка Агента оплачена клиентом в первый месяц, комиссия удваивается: 
                        <span className="text-cyan-400 font-bold"> 5% × 2 = 10%</span>. После сделки — автоматический переход в Партнёры.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">Сравнение дохода по грейдам</CardTitle>
                <CardDescription className="text-slate-400">
                  Доход с личных продаж в зависимости от суммы сделки
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={incomeComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="deal" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #a855f7' }}
                      labelStyle={{ color: '#a855f7' }}
                      formatter={(value: number) => `${(value / 1000000).toFixed(1)} млн ₽`}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="agent" name="Агент" stroke="#06b6d4" strokeWidth={2} />
                    <Line type="monotone" dataKey="partner" name="Партнёр" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="senior" name="Старший" stroke="#ec4899" strokeWidth={2} />
                    <Line type="monotone" dataKey="general" name="Генеральный" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="ambassador" name="Амбассадор" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>

                <div className="overflow-x-auto mt-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-purple-500/20">
                        <th className="text-left p-3 text-purple-400">Сумма сделки</th>
                        <th className="text-right p-3 text-cyan-400">Агент (5%)</th>
                        <th className="text-right p-3 text-purple-400">Партнёр (10%)</th>
                        <th className="text-right p-3 text-pink-400">Старший (13%)</th>
                        <th className="text-right p-3 text-orange-400">Генеральный (16%)</th>
                        <th className="text-right p-3 text-green-400">Амбассадор (18%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomeComparisonData.map((row, idx) => (
                        <tr key={idx} className="border-b border-slate-700/50 hover:bg-purple-500/5">
                          <td className="p-3 text-slate-300 font-semibold">{row.deal}</td>
                          <td className="p-3 text-right text-cyan-400">{(row.agent / 1000000).toFixed(1)} млн</td>
                          <td className="p-3 text-right text-purple-400">{(row.partner / 1000000).toFixed(1)} млн</td>
                          <td className="p-3 text-right text-pink-400">{(row.senior / 1000000).toFixed(1)} млн</td>
                          <td className="p-3 text-right text-orange-400">{(row.general / 1000000).toFixed(1)} млн</td>
                          <td className="p-3 text-right text-green-400 font-bold">{(row.ambassador / 1000000).toFixed(1)} млн</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">Калькулятор дохода партнёра</CardTitle>
                <CardDescription className="text-slate-400">
                  Рассчитайте ваш доход в зависимости от условий сделки
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Сумма сделки (₽)</label>
                    <input
                      type="number"
                      value={calculatorDeal}
                      onChange={(e) => setCalculatorDeal(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-purple-500/30 text-white"
                      min={0}
                      step={1000000}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Ваш грейд</label>
                    <select
                      value={calculatorGrade}
                      onChange={(e) => setCalculatorGrade(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-purple-500/30 text-white"
                    >
                      {gradeData.map((grade) => (
                        <option key={grade.id} value={grade.id}>
                          {grade.name} ({grade.personalSales}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Предоплата (%)</label>
                    <input
                      type="number"
                      value={calculatorPrepayment}
                      onChange={(e) => setCalculatorPrepayment(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-purple-500/30 text-white"
                      min={0}
                      max={100}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30">
                    <p className="text-slate-400 text-sm mb-2">Базовый доход</p>
                    <p className="text-3xl font-bold text-purple-400">
                      {(income.base / 1000000).toFixed(2)} млн ₽
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/30">
                    <p className="text-slate-400 text-sm mb-2">Бонус за предоплату</p>
                    <p className="text-3xl font-bold text-pink-400">
                      {(income.prepayment / 1000000).toFixed(2)} млн ₽
                    </p>
                  </div>

                  <div className="p-6 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30">
                    <p className="text-slate-400 text-sm mb-2">Итого доход</p>
                    <p className="text-4xl font-bold text-cyan-400">
                      {(income.total / 1000000).toFixed(2)} млн ₽
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/30">
                  <p className="text-slate-300 text-sm">
                    <span className="text-purple-400 font-semibold">Расчёт:</span> Базовая ставка {gradeData[calculatorGrade - 1].personalSales}% 
                    {calculatorPrepayment >= 30 && calculatorPrepayment <= 50 && ' + 1% за предоплату 30-50%'}
                    {calculatorPrepayment >= 51 && calculatorPrepayment <= 70 && ' + 2% за предоплату 51-70%'}
                    {calculatorPrepayment > 70 && ' + 3% за предоплату >70%'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth" className="space-y-6">
            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">Сценарий роста дохода</CardTitle>
                <CardDescription className="text-slate-400">
                  Пример развития от Агента до Генерального партнёра за 6 месяцев
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={growthScenarioData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #a855f7' }}
                      labelStyle={{ color: '#a855f7' }}
                      formatter={(value: number) => `${(value / 1000000).toFixed(1)} млн ₽`}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="agent" stackId="1" name="Личные продажи" stroke="#8b5cf6" fill="#8b5cf6" />
                    <Area type="monotone" dataKey="team" stackId="1" name="Доход с команды" stroke="#ec4899" fill="#ec4899" />
                  </AreaChart>
                </ResponsiveContainer>

                <div className="mt-6 space-y-3">
                  {[
                    { month: 'Месяц 1-2', status: 'Агент → Партнёр', desc: 'Первые сделки, удвоение комиссии за быстрый старт', icon: 'Rocket' },
                    { month: 'Месяц 3', status: 'Партнёр → Старший', desc: 'Привлечение первого менеджера, начало строительства команды', icon: 'Users' },
                    { month: 'Месяц 4-5', status: 'Старший партнёр', desc: 'Рост оборота команды, закрепление региона', icon: 'TrendingUp' },
                    { month: 'Месяц 6', status: 'Генеральный партнёр', desc: '3 активных менеджера, участие в обучении новичков', icon: 'Award' }
                  ].map((step, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                        <Icon name={step.icon as any} size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-purple-400 font-semibold">{step.month}: {step.status}</p>
                        <p className="text-slate-300 text-sm mt-1">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">Максимальный потенциал</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30">
                    <Icon name="Target" size={32} className="text-purple-400 mb-4" />
                    <p className="text-2xl font-bold text-purple-400 mb-2">Личные продажи</p>
                    <p className="text-slate-300 text-sm mb-4">
                      Амбассадор с личными продажами 50 млн руб./квартал
                    </p>
                    <p className="text-4xl font-bold text-purple-400">
                      9 млн ₽
                    </p>
                    <p className="text-slate-400 text-xs mt-2">18% от оборота</p>
                  </div>

                  <div className="p-6 rounded-lg bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/30">
                    <Icon name="Network" size={32} className="text-pink-400 mb-4" />
                    <p className="text-2xl font-bold text-pink-400 mb-2">Команда + Сеть</p>
                    <p className="text-slate-300 text-sm mb-4">
                      Сеть 150 млн руб./квартал + личные 50 млн
                    </p>
                    <p className="text-4xl font-bold text-pink-400">
                      16.5 млн ₽
                    </p>
                    <p className="text-slate-400 text-xs mt-2">9 млн личные + 7.5 млн сеть (5%)</p>
                  </div>
                </div>

                <div className="mt-6 p-6 rounded-lg bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/30">
                  <div className="flex items-start gap-4">
                    <Icon name="Crown" size={40} className="text-yellow-400 flex-shrink-0" />
                    <div>
                      <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text mb-2">
                        Статус Амбассадора
                      </p>
                      <p className="text-slate-300 text-sm">
                        Кроме комиссий, Амбассадор получает долю в годовой прибыли DEOD и становится стратегическим советником компании. 
                        Это не просто доход — это партнёрство на уровне собственника бизнеса.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-purple-500/30 bg-slate-900/80 backdrop-blur-lg mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-slate-400">
          <p className="text-sm">
            Партнёрская система DEOD • Система грейдов и мотивации • 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PartnerSystem;
