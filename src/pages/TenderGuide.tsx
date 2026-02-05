import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

interface Rule {
  id: number;
  title: string;
  description: string;
  details: string[];
  icon: string;
  color: string;
}

const rules: Rule[] = [
  {
    id: 1,
    title: 'Правило 1: Участие только через юрлица DEOD',
    description: 'Все контракты заключаются от имени ООО «ДЕОД»',
    details: [
      'Никаких личных регистраций на площадках',
      'Единая юридическая защита и репутация',
      'Централизованное управление рисками'
    ],
    icon: 'Shield',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 2,
    title: 'Правило 2: Обязательная предварительная проработка (COP)',
    description: 'Зона ответственности партнёра — установить контакт и договорённости',
    details: [
      'Выход на ЛПР до объявления тендера',
      'Согласование ТЗ и критериев оценки',
      'Подготовка COP-досье для тендерного отдела',
      'Без успешного COP тендерный отдел не приступит к работе'
    ],
    icon: 'Target',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 3,
    title: 'Правило 3: Финансовая модель и «красная линия»',
    description: 'Цена не может быть ниже: Стоимость КП + Расходы + Комиссия партнёра',
    details: [
      'Формула: КП + Доп. расходы на тендер + Комиссия = Минимальная цена',
      'Не снижаем цену ниже «красной линии» для сохранения маржи',
      'Проигрыш лучше, чем работа себе в убыток'
    ],
    icon: 'DollarSign',
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 4,
    title: 'Правило 4: Роль тендерного отдела (50 тыс./мес.)',
    description: 'Исполнитель на площадке после успешного COP',
    details: [
      'Анализ документов, переданных партнёром',
      'Подготовка итогового пакета заявки',
      'Подача заявки и участие в аукционе',
      'Полная видеозапись процесса работы на площадке',
      'Тендерный отдел не ищет тендеры — он их оформляет'
    ],
    icon: 'Monitor',
    color: 'from-violet-500 to-purple-600'
  }
];

const copPhases = [
  {
    phase: 'Фаза 1: Разведка и выход на ЛПР',
    actions: [
      'Мониторинг планов закупок (ПГЗ по 44-ФЗ, план по 223-ФЗ)',
      'Выход на технического и экономического заказчика',
      'Скрипт: «Мы видим ваши планы по проектированию [объекта]. У нас есть экспертиза. Можем обсудить подход до формальных процедур?»'
    ]
  },
  {
    phase: 'Фаза 2: Экспертная сессия и формирование КП',
    actions: [
      'Встреча-интервью для выявления проблем',
      'Согласование предварительного ТЗ и бюджета',
      'Подготовка и согласование КП'
    ]
  },
  {
    phase: 'Фаза 3: Оформление допуска',
    actions: [
      'Заполнение COP-досье с контактами ЛПР и договорённостями',
      'Передача досье тендерному отделу',
      'Решение: «Допущено к подаче» или «Требует доработки»'
    ]
  }
];

const algorithm = [
  {
    step: '1. Публикация извещения',
    description: 'Партнёр передаёт ссылку на тендер тендерному отделу'
  },
  {
    step: '2. Стратегическая проверка',
    description: 'Отдел проверяет соответствие документов договорённостям в COP'
  },
  {
    step: '3. Подготовка и подача',
    description: 'Отдел готовит пакет, включает запись экрана, загружает документы'
  },
  {
    step: '4. Участие в аукционе',
    description: 'Следование «красной линии» цены, видеозапись всего процесса'
  },
  {
    step: '5. Разбор результатов',
    description: 'Анализ победы/проигрыша на основе COP-досье и видеозаписи'
  }
];

const scenarios = [
  {
    scenario: 'Неполное COP-досье',
    problem: 'Нет согласованного КП или контактов ЛПР',
    solution: 'Тендерный отдел отказывает в подаче. Доработайте досье.'
  },
  {
    scenario: 'Цена ниже «красной линии»',
    problem: 'В аукционе цена уходит ниже нашей минимальной',
    solution: 'Не снижаем цену, проигрываем, сохраняя маржу'
  },
  {
    scenario: 'Изменённые критерии',
    problem: 'Обещанные неценовые критерии не включены',
    solution: 'Выясняем причины через партнёра или пересчитываем риски'
  },
  {
    scenario: 'Давление на отдел',
    problem: 'Партнёр требует снизить цену ниже минимума',
    solution: 'Отказ, ссылка на Правило 3. Решение только с санкции руководства'
  }
];

const testQuestions = [
  {
    question: 'Какая основная разница между 44-ФЗ и 223-ФЗ?',
    options: [
      '44-ФЗ — жёсткие правила, 223-ФЗ — гибкие правила заказчика',
      '44-ФЗ для малого бизнеса, 223-ФЗ для крупных',
      'Нет разницы',
      '44-ФЗ только для госкомпаний'
    ],
    correctAnswer: 0,
    explanation: '44-ФЗ имеет жёсткие правила и фокус на цене, 223-ФЗ позволяет заказчику устанавливать гибкие критерии.'
  },
  {
    question: 'Что такое COP?',
    options: [
      'Финансовый документ',
      'Обязательная предварительная проработка тендера',
      'Маркетинговая презентация',
      'Юридическое согласование'
    ],
    correctAnswer: 1,
    explanation: 'COP — обязательная предварительная проработка тендера, зона ответственности партнёра.'
  },
  {
    question: 'Через кого можно участвовать в тендерах?',
    options: [
      'Через любую компанию',
      'Через физлицо-партнёра',
      'Только через юрлица DEOD',
      'Через подрядчика'
    ],
    correctAnswer: 2,
    explanation: 'Правило 1: участие только через юридические лица DEOD.'
  },
  {
    question: 'Роль тендерного отдела?',
    options: [
      'Ведение проекта от разведки до победы',
      'Только консультации',
      'Исполнитель: подготовка и подача после COP',
      'Поиск тендеров'
    ],
    correctAnswer: 2,
    explanation: 'Тендерный отдел — исполнитель на площадке после успешного COP партнёра.'
  },
  {
    question: 'Что делать с ценой в аукционе?',
    options: [
      'Всегда снижать до минимума',
      'Не снижать ниже «красной линии»',
      'Ориентироваться на конкурентов',
      'Договариваться с заказчиком'
    ],
    correctAnswer: 1,
    explanation: 'Правило 3: не снижаем цену ниже «красной линии» для сохранения маржи.'
  }
];

export default function TenderGuide() {
  const [selectedRule, setSelectedRule] = useState<number | null>(null);
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (currentQuestion < testQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 500);
    } else {
      setTimeout(() => setShowResults(true), 500);
    }
  };

  const correctCount = selectedAnswers.filter((answer, index) => 
    answer === testQuestions[index].correctAnswer
  ).length;

  const resetTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

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
                <Icon name={knowledgeOpen ? "ChevronUp" : "ChevronDown"} className="ml-2" size={16} />
              </Button>
              
              <AnimatePresence>
                {knowledgeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-600/50 rounded-lg shadow-2xl z-50"
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
                      
                      <Link to="/ecosystem/client-hunting" onClick={() => setKnowledgeOpen(false)}>
                        <div className="p-3 bg-gradient-to-br from-purple-900/30 to-violet-900/30 border border-purple-500/30 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Icon name="Target" size={20} className="text-purple-400" />
                            <span className="text-white font-medium">Поиск клиентов</span>
                            <Icon name="ExternalLink" size={16} className="text-purple-400 ml-auto" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link to="/ecosystem" className="text-xs md:text-sm text-slate-300 hover:text-blue-400 transition">
              Назад
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-4">
              <Icon name="Gavel" size={18} className="text-blue-400" />
              <span className="text-blue-400 text-sm font-semibold">База знаний</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent mb-4">
              Работа с тендерами 44-ФЗ и 223-ФЗ
            </h1>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              Полное руководство по участию в государственных закупках и тендерах коммерческих организаций
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Icon name="Shield" size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">44-ФЗ</h3>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Жёсткие правила:</strong> строгая процедура</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Конкуренция по цене:</strong> цена решает</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Фокус:</strong> техническое соответствие</span>
                </li>
              </ul>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border-cyan-500/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">223-ФЗ</h3>
              </div>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Гибкие правила:</strong> заказчик устанавливает</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Критерии:</strong> цена/качество 50/50, 60/40</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle2" size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Фокус:</strong> демонстрация экспертизы</span>
                </li>
              </ul>
            </Card>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Icon name="Book" size={32} className="text-blue-400" />
              Главные правила игры
            </h2>
            <div className="grid gap-6">
              {rules.map((rule, index) => (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card 
                    className="bg-slate-900/50 border-slate-700/50 hover:border-blue-500/50 transition-all cursor-pointer"
                    onClick={() => setSelectedRule(selectedRule === rule.id ? null : rule.id)}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${rule.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <Icon name={rule.icon as any} size={28} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-white">{rule.title}</h3>
                            <Icon 
                              name={selectedRule === rule.id ? "ChevronUp" : "ChevronDown"} 
                              size={24} 
                              className="text-blue-400"
                            />
                          </div>
                          <p className="text-blue-400">{rule.description}</p>
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedRule === rule.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t border-slate-700/50"
                          >
                            <ul className="space-y-3">
                              {rule.details.map((detail, i) => (
                                <li key={i} className="flex gap-3">
                                  <Icon name="ArrowRight" size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                                  <span className="text-slate-300">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Icon name="Map" size={32} className="text-cyan-400" />
              Руководство по COP
            </h2>
            <div className="space-y-6">
              {copPhases.map((phase, index) => (
                <Card key={index} className="bg-slate-900/50 border-slate-700/50 p-6">
                  <h3 className="text-xl font-bold text-white mb-4">{phase.phase}</h3>
                  <ul className="space-y-3">
                    {phase.actions.map((action, i) => (
                      <li key={i} className="flex gap-3">
                        <Icon name="CheckCircle2" size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{action}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Icon name="ListOrdered" size={32} className="text-violet-400" />
              Пошаговый алгоритм после COP
            </h2>
            <div className="grid gap-4">
              {algorithm.map((step, index) => (
                <Card key={index} className="bg-slate-900/50 border-slate-700/50 p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-1">{step.step}</h4>
                      <p className="text-slate-400 text-sm">{step.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Icon name="AlertTriangle" size={32} className="text-yellow-400" />
              Типовые сценарии
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {scenarios.map((s, index) => (
                <Card key={index} className="bg-slate-900/50 border-slate-700/50 p-6">
                  <h3 className="text-lg font-bold text-white mb-3">{s.scenario}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Icon name="XCircle" size={18} className="text-red-400 flex-shrink-0 mt-1" />
                      <p className="text-slate-400 text-sm"><strong>Проблема:</strong> {s.problem}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Icon name="CheckCircle2" size={18} className="text-cyan-400 flex-shrink-0 mt-1" />
                      <p className="text-slate-300 text-sm"><strong>Решение:</strong> {s.solution}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/50">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Icon name="GraduationCap" size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white">Тестовое задание</h2>
                    <p className="text-slate-400">Проверьте знание тендерных процедур</p>
                  </div>
                  {!showTest && (
                    <Button 
                      onClick={() => setShowTest(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Icon name="PlayCircle" className="mr-2" size={18} />
                      Начать тест
                    </Button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {showTest && !showResults && (
                    <motion.div
                      key={currentQuestion}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-blue-400 font-semibold">
                          Вопрос {currentQuestion + 1} из {testQuestions.length}
                        </span>
                        <div className="flex gap-2">
                          {testQuestions.map((_, index) => (
                            <div 
                              key={index}
                              className={`w-2 h-2 rounded-full ${
                                index === currentQuestion ? 'bg-blue-400' : 
                                index < currentQuestion ? 'bg-cyan-400' : 'bg-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-6">
                        {testQuestions[currentQuestion].question}
                      </h3>

                      <div className="space-y-3">
                        {testQuestions[currentQuestion].options.map((option, index) => (
                          <Button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className={`w-full justify-start text-left p-4 h-auto ${
                              selectedAnswers[currentQuestion] === index
                                ? index === testQuestions[currentQuestion].correctAnswer
                                  ? 'bg-cyan-500/20 border-cyan-500 hover:bg-cyan-500/30'
                                  : 'bg-red-500/20 border-red-500 hover:bg-red-500/30'
                                : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700/50'
                            }`}
                            variant="outline"
                            disabled={selectedAnswers[currentQuestion] !== undefined}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                selectedAnswers[currentQuestion] === index
                                  ? index === testQuestions[currentQuestion].correctAnswer
                                    ? 'border-cyan-400 bg-cyan-500/20'
                                    : 'border-red-400 bg-red-500/20'
                                  : 'border-slate-500'
                              }`}>
                                <span className="font-semibold">{String.fromCharCode(65 + index)}</span>
                              </div>
                              <span className="flex-1">{option}</span>
                              {selectedAnswers[currentQuestion] === index && (
                                <Icon 
                                  name={index === testQuestions[currentQuestion].correctAnswer ? "CheckCircle2" : "XCircle"} 
                                  size={20}
                                  className={index === testQuestions[currentQuestion].correctAnswer ? "text-cyan-400" : "text-red-400"}
                                />
                              )}
                            </div>
                          </Button>
                        ))}
                      </div>

                      {selectedAnswers[currentQuestion] !== undefined && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg border ${
                            selectedAnswers[currentQuestion] === testQuestions[currentQuestion].correctAnswer
                              ? 'bg-cyan-500/10 border-cyan-500/30'
                              : 'bg-blue-500/10 border-blue-500/30'
                          }`}
                        >
                          <p className="text-slate-300">{testQuestions[currentQuestion].explanation}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${
                        correctCount >= 4 
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-600' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-600'
                      }`}>
                        <div className="text-white">
                          <div className="text-4xl font-bold">{correctCount}/{testQuestions.length}</div>
                          <div className="text-sm">правильно</div>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {correctCount >= 4 
                          ? '🎉 Отличный результат!' 
                          : '💪 Хороший старт!'}
                      </h3>
                      
                      <p className="text-slate-400 mb-8 max-w-md mx-auto">
                        {correctCount >= 4 
                          ? 'Вы отлично знаете правила работы с тендерами!' 
                          : 'Пересмотрите материал для лучшего понимания процедур.'}
                      </p>
                      
                      <div className="flex gap-4 justify-center">
                        <Button 
                          onClick={resetTest}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          <Icon name="RotateCcw" className="mr-2" size={18} />
                          Пройти снова
                        </Button>
                        <Button 
                          onClick={() => setShowTest(false)}
                          variant="outline"
                          className="border-slate-600 hover:bg-slate-800"
                        >
                          Закрыть
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
