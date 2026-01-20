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
  Radar
} from 'recharts';

const vacanciesData = [
  { name: 'Помощник бурильщика', count: 5, salary: 180000, category: 'Рабочие' },
  { name: 'Машинист буровой', count: 3, salary: 220000, category: 'Рабочие' },
  { name: 'Водитель КМУ', count: 2, salary: 190000, category: 'Рабочие' },
  { name: 'Мастер участка', count: 2, salary: 250000, category: 'Руководители' },
  { name: 'Инженер по ТБ', count: 1, salary: 235000, category: 'Специалисты' },
  { name: 'Инженер-геодезист', count: 1, salary: 210000, category: 'Специалисты' }
];

const categoryData = [
  { name: 'Рабочие', value: 10, color: '#06b6d4' },
  { name: 'Руководители', value: 2, color: '#8b5cf6' },
  { name: 'Специалисты', value: 2, color: '#ec4899' }
];

const requirementsData = [
  { subject: 'Опыт работы', value: 90 },
  { subject: 'Образование', value: 75 },
  { subject: 'Здоровье', value: 100 },
  { subject: 'Навыки', value: 85 },
  { subject: 'Документы', value: 80 }
];

const timelineData = [
  { month: 'Янв 2026', openPositions: 14, filled: 0 },
  { month: 'Фев 2026', openPositions: 14, filled: 4 },
  { month: 'Мар 2026', openPositions: 10, filled: 8 },
  { month: 'Апр 2026', openPositions: 6, filled: 12 },
  { month: 'Май 2026', openPositions: 2, filled: 14 }
];

const TEC = () => {
  const [selectedVacancy, setSelectedVacancy] = useState<number | null>(null);
  const [animateCards, setAnimateCards] = useState(false);

  useState(() => {
    setTimeout(() => setAnimateCards(true), 100);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950">
      <header className="border-b border-cyan-500/30 bg-slate-900/80 backdrop-blur-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.6)] animate-pulse">
                <Icon name="Building2" size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Южно-Якутская ТЭС
                </h1>
                <p className="text-cyan-400/80 text-sm mt-1">Подбор персонала • Январь 2026</p>
              </div>
            </div>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
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
            { icon: 'Users', label: 'Всего вакансий', value: '14', color: 'cyan' },
            { icon: 'MapPin', label: 'Локация', value: 'Чульман', color: 'purple' },
            { icon: 'Calendar', label: 'График', value: '2/1 вахта', color: 'pink' },
            { icon: 'TrendingUp', label: 'Средняя ЗП', value: '₽215k', color: 'blue' }
          ].map((stat, idx) => (
            <Card
              key={idx}
              className={`bg-slate-900/50 border-${stat.color}-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] ${
                animateCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                    <p className={`text-3xl font-bold bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600 bg-clip-text text-transparent mt-1`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/20 flex items-center justify-center`}>
                    <Icon name={stat.icon as any} size={24} className={`text-${stat.color}-400`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-900/50 border border-cyan-500/30">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="vacancies">Вакансии</TabsTrigger>
            <TabsTrigger value="requirements">Требования</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            <TabsTrigger value="info">Информация</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Распределение по категориям</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1000}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(6, 182, 212, 0.3)',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Уровень зарплат по вакансиям</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={vacanciesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis tick={{ fill: '#94a3b8' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid rgba(6, 182, 212, 0.3)',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`₽${value.toLocaleString()}`, 'Зарплата']}
                      />
                      <Bar dataKey="salary" fill="url(#colorGradient)" animationDuration={1000} />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Прогноз закрытия вакансий</CardTitle>
                <CardDescription className="text-slate-400">Планируемая динамика подбора персонала</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(6, 182, 212, 0.1)" />
                    <XAxis dataKey="month" tick={{ fill: '#94a3b8' }} />
                    <YAxis tick={{ fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="openPositions"
                      stroke="#ec4899"
                      strokeWidth={3}
                      name="Открытые вакансии"
                      animationDuration={1500}
                    />
                    <Line
                      type="monotone"
                      dataKey="filled"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      name="Закрытые вакансии"
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vacancies" className="space-y-4">
            {vacanciesData.map((vacancy, idx) => (
              <Card
                key={idx}
                className={`bg-slate-900/50 border-cyan-500/30 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] ${
                  selectedVacancy === idx ? 'ring-2 ring-cyan-500' : ''
                }`}
                onClick={() => setSelectedVacancy(selectedVacancy === idx ? null : idx)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
                        <Icon name="Briefcase" size={24} className="text-cyan-400" />
                      </div>
                      <div>
                        <CardTitle className="text-cyan-400">{vacancy.name}</CardTitle>
                        <CardDescription className="text-slate-400">{vacancy.category}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-400">₽{vacancy.salary.toLocaleString()}</p>
                      <p className="text-sm text-slate-400">{vacancy.count} {vacancy.count === 1 ? 'позиция' : 'позиций'}</p>
                    </div>
                  </div>
                </CardHeader>
                {selectedVacancy === idx && (
                  <CardContent className="border-t border-cyan-500/20 pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">График работы:</p>
                        <p className="text-cyan-400">Вахта 2/1 (2 месяца работа / 1 месяц отдых)</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Испытательный срок:</p>
                        <p className="text-cyan-400">3 месяца</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Локация:</p>
                        <p className="text-cyan-400">г. Чульман, Якутия</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Премия:</p>
                        <p className="text-cyan-400">По результатам работы</p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <Card className="bg-slate-900/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Критерии отбора кандидатов</CardTitle>
                <CardDescription className="text-slate-400">Ключевые требования к соискателям</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={requirementsData}>
                    <PolarGrid stroke="rgba(6, 182, 212, 0.2)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8' }} />
                    <PolarRadiusAxis tick={{ fill: '#94a3b8' }} />
                    <Radar
                      name="Требования"
                      dataKey="value"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.6}
                      animationDuration={1500}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius: '8px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2">
                    <Icon name="CheckCircle2" size={20} />
                    Обязательные требования
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    'Трезвый образ жизни',
                    'Крепкое здоровье для Крайнего Севера',
                    'Отсутствие судимостей',
                    'Прохождение медкомиссии',
                    'Опыт работы от 3-5 лет',
                    'Профильное образование'
                  ].map((req, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                      <Icon name="Check" size={16} className="text-cyan-400 flex-shrink-0" />
                      <p className="text-slate-300">{req}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2">
                    <Icon name="Star" size={20} />
                    Желательные качества
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    'Опыт работы на Севере/Дальнем Востоке',
                    'Водительские права категории С',
                    'Навыки работы с ДВС и техникой',
                    'Уверенное владение ПК',
                    'Коммуникабельность',
                    'Стрессоустойчивость'
                  ].map((req, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <Icon name="Star" size={16} className="text-purple-400 flex-shrink-0" />
                      <p className="text-slate-300">{req}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-slate-900/50 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-400 text-lg">Общий бюджет ФОТ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    ₽3.01М
                  </p>
                  <p className="text-slate-400 text-sm mt-2">в месяц на всех сотрудников</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400 text-lg">Средний возраст</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    35-45
                  </p>
                  <p className="text-slate-400 text-sm mt-2">лет (целевой диапазон)</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-pink-500/30">
                <CardHeader>
                  <CardTitle className="text-pink-400 text-lg">Срок закрытия</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    3-4
                  </p>
                  <p className="text-slate-400 text-sm mt-2">месяца (прогноз)</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Ключевые метрики проекта</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">Прогресс подбора</span>
                      <span className="text-cyan-400">28%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-pulse" style={{ width: '28%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">Рабочие позиции</span>
                      <span className="text-purple-400">71%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '71%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">Инженеры/Специалисты</span>
                      <span className="text-pink-400">29%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink-500 to-cyan-500" style={{ width: '29%' }} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Заявок на рассмотрении', value: '47', icon: 'FileText' },
                    { label: 'Прошли первичный отбор', value: '23', icon: 'CheckCircle' },
                    { label: 'Назначены собеседования', value: '12', icon: 'Calendar' },
                    { label: 'Оформлены', value: '4', icon: 'UserCheck' }
                  ].map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-cyan-500/20">
                      <div className="flex items-center gap-3">
                        <Icon name={stat.icon as any} size={20} className="text-cyan-400" />
                        <span className="text-slate-300">{stat.label}</span>
                      </div>
                      <span className="text-xl font-bold text-cyan-400">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <Card className="bg-slate-900/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Общая информация о проекте</CardTitle>
                <CardDescription className="text-slate-400">Заявка от 19.01.2026</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                      <p className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                        <Icon name="MapPin" size={18} />
                        Локация проекта
                      </p>
                      <p className="text-slate-300 text-sm">
                        Республика Саха (Якутия), Нерюнгринский район, г. Чульман, площадка Южно-Якутской ТЭС
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <p className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                        <Icon name="Building" size={18} />
                        Отдел
                      </p>
                      <p className="text-slate-300 text-sm">Бурение</p>
                    </div>

                    <div className="p-4 rounded-lg bg-pink-500/5 border border-pink-500/20">
                      <p className="text-pink-400 font-semibold mb-2 flex items-center gap-2">
                        <Icon name="User" size={18} />
                        Руководитель
                      </p>
                      <p className="text-slate-300 text-sm">Швалагин Иван Иванович</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                      <p className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                        <Icon name="Calendar" size={18} />
                        График работы
                      </p>
                      <p className="text-slate-300 text-sm">
                        Вахтовый метод: 2 месяца на объекте / 1 месяц отдых
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <p className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                        <Icon name="Clock" size={18} />
                        Испытательный срок
                      </p>
                      <p className="text-slate-300 text-sm">3 месяца</p>
                    </div>

                    <div className="p-4 rounded-lg bg-pink-500/5 border border-pink-500/20">
                      <p className="text-pink-400 font-semibold mb-2 flex items-center gap-2">
                        <Icon name="Plane" size={18} />
                        Командировки
                      </p>
                      <p className="text-slate-300 text-sm">
                        Возможны на другие объекты проекта
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30">
                  <p className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                    <Icon name="AlertCircle" size={20} />
                    Причина подбора
                  </p>
                  <p className="text-slate-300">
                    Расширение фронта работ, формирование новой вахты
                  </p>
                </div>

                <div className="border-t border-cyan-500/20 pt-6 flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Составил</p>
                    <p className="text-cyan-400 font-semibold">Козлов Евгений Владимирович</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">Согласовано</p>
                    <p className="text-purple-400 font-semibold">Швалагин И.И.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Перспективы и развитие</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <div className="flex items-start gap-3">
                    <Icon name="TrendingUp" size={20} className="text-cyan-400 mt-1" />
                    <div>
                      <p className="text-cyan-400 font-semibold mb-1">Карьерный рост</p>
                      <p className="text-slate-300 text-sm">
                        Возможность повышения квалификации и карьерного роста в рамках проекта и компании
                        (старший мастер, ведущий инженер)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                  <div className="flex items-start gap-3">
                    <Icon name="Users" size={20} className="text-purple-400 mt-1" />
                    <div>
                      <p className="text-purple-400 font-semibold mb-1">Источники кандидатов</p>
                      <p className="text-slate-300 text-sm">
                        Приветствуются кандидаты из крупных строительных и буровых компаний
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-pink-500/5 border border-pink-500/20">
                  <div className="flex items-start gap-3">
                    <Icon name="Package" size={20} className="text-pink-400 mt-1" />
                    <div>
                      <p className="text-pink-400 font-semibold mb-1">Обеспечение</p>
                      <p className="text-slate-300 text-sm">
                        Все необходимое оборудование и рабочие места обеспечиваются компанией на месте работы
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-cyan-500/30 bg-slate-900/80 backdrop-blur-lg mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-slate-400">
          <p className="text-sm">
            © 2026 Южно-Якутская ТЭС • Подбор персонала • Конфиденциально
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TEC;
