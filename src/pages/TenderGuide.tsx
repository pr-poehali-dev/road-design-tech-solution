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
    title: 'Правило 4: Роль тендерного отдела',
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
                      <div className="p-3 bg-gradient-to-br from-purple-900/30 to-violet-900/30 hover:bg-purple-900/40 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Icon name="Target" size={20} className="text-purple-400" />
                          <span className="text-white font-medium">Поиск клиентов</span>
                          <Icon name="ExternalLink" size={16} className="text-purple-400 ml-auto" />
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-600 bg-clip-text text-transparent break-words">
            Тендерный блок DEOD
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto break-words">
            Правила работы с тендерами: от Pre-Sale до победы
          </p>
        </motion.div>

        <div className="grid gap-4 md:gap-6 mb-8 md:mb-12">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`p-4 md:p-6 bg-gradient-to-br ${rule.color} bg-opacity-10 border-2 cursor-pointer hover:scale-[1.02] transition-all ${selectedRule === rule.id ? 'ring-2 ring-purple-500 scale-[1.02]' : ''}`}
                onClick={() => setSelectedRule(selectedRule === rule.id ? null : rule.id)}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700 flex-shrink-0">
                    <Icon name={rule.icon} className="text-purple-400" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2 break-words">{rule.title}</h3>
                    <p className="text-sm md:text-base text-purple-300 font-medium mb-2 md:mb-3 break-words">{rule.description}</p>
                    <AnimatePresence>
                      {selectedRule === rule.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 md:space-y-3 mt-3 md:mt-4"
                        >
                          {rule.details.map((detail, i) => (
                            <div key={i} className="flex items-start gap-2 md:gap-3">
                              <Icon name="Check" className="text-green-400 mt-1 flex-shrink-0" size={16} />
                              <span className="text-sm md:text-base text-slate-300 break-words min-w-0">{detail}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center gap-2 md:gap-3 text-white">
            <Icon name="Workflow" className="text-cyan-400 flex-shrink-0" size={24} />
            <span className="break-words">Фазы COP (Client Onboarding Process)</span>
          </h2>
          <div className="grid gap-4 md:gap-6">
            {copPhases.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 md:p-6 bg-slate-800/50 border-cyan-500/30">
                  <h3 className="text-lg md:text-xl font-bold text-cyan-400 mb-3 md:mb-4 break-words">{phase.phase}</h3>
                  <div className="space-y-2 md:space-y-3">
                    {phase.actions.map((action, i) => (
                      <div key={i} className="flex items-start gap-2 md:gap-3">
                        <Icon name="ArrowRight" className="text-blue-400 mt-1 flex-shrink-0" size={16} />
                        <span className="text-sm md:text-base text-slate-300 break-words min-w-0">{action}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center gap-2 md:gap-3 text-white">
            <Icon name="GitBranch" className="text-purple-400 flex-shrink-0" size={24} />
            <span className="break-words">Алгоритм работы после COP</span>
          </h2>
          <div className="grid gap-3 md:gap-4">
            {algorithm.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 md:p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-bold text-white mb-1 break-words">{item.step}</h3>
                      <p className="text-sm md:text-base text-slate-400 break-words">{item.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center gap-2 md:gap-3 text-white">
            <Icon name="AlertCircle" className="text-orange-400 flex-shrink-0" size={24} />
            <span className="break-words">Типовые сценарии и решения</span>
          </h2>
          <div className="grid gap-4 md:gap-6">
            {scenarios.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 md:p-6 bg-slate-800/50 border-orange-500/30">
                  <h3 className="text-lg md:text-xl font-bold text-orange-400 mb-2 md:mb-3 break-words">{item.scenario}</h3>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start gap-2 md:gap-3">
                      <Icon name="XCircle" className="text-red-400 mt-1 flex-shrink-0" size={16} />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs md:text-sm font-semibold text-red-400 break-words">Проблема: </span>
                        <span className="text-sm md:text-base text-slate-300 break-words">{item.problem}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 md:gap-3 bg-green-900/20 p-3 md:p-4 rounded-lg border border-green-700/50">
                      <Icon name="CheckCircle" className="text-green-400 mt-1 flex-shrink-0" size={16} />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs md:text-sm font-semibold text-green-400 break-words">Решение: </span>
                        <span className="text-sm md:text-base text-green-300 break-words">{item.solution}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Button
            onClick={() => setShowTest(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-2xl shadow-purple-500/20 text-base md:text-lg px-6 md:px-8 py-4 md:py-6"
          >
            <Icon name="Brain" className="mr-2" size={20} />
            Проверить знания
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showTest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setShowTest(false);
              resetTest();
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 rounded-2xl p-6 md:p-8 max-w-2xl w-full border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {!showResults ? (
                <>
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-white break-words flex-1 min-w-0">
                      Вопрос {currentQuestion + 1} из {testQuestions.length}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowTest(false);
                        resetTest();
                      }}
                      className="flex-shrink-0"
                    >
                      <Icon name="X" size={20} />
                    </Button>
                  </div>
                  <div className="mb-4 bg-slate-800 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / testQuestions.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-base md:text-xl text-white mb-4 md:mb-6 font-medium break-words">
                    {testQuestions[currentQuestion].question}
                  </p>
                  <div className="space-y-3 md:space-y-4">
                    {testQuestions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(index)}
                        className={`w-full p-3 md:p-4 text-left rounded-lg border-2 transition-all ${
                          selectedAnswers[currentQuestion] === index
                            ? index === testQuestions[currentQuestion].correctAnswer
                              ? 'border-green-500 bg-green-900/20'
                              : 'border-red-500 bg-red-900/20'
                            : 'border-slate-600 hover:border-purple-500 bg-slate-800/50'
                        }`}
                        disabled={selectedAnswers[currentQuestion] !== undefined}
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                            selectedAnswers[currentQuestion] === index
                              ? index === testQuestions[currentQuestion].correctAnswer
                                ? 'border-green-500 bg-green-500'
                                : 'border-red-500 bg-red-500'
                              : 'border-slate-600'
                          }`}>
                            {selectedAnswers[currentQuestion] === index && (
                              <Icon 
                                name={index === testQuestions[currentQuestion].correctAnswer ? "Check" : "X"} 
                                size={16} 
                                className="text-white"
                              />
                            )}
                          </div>
                          <span className="text-sm md:text-base text-white break-words flex-1 min-w-0">{option}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {selectedAnswers[currentQuestion] !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 md:mt-6 p-3 md:p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      <p className="text-xs md:text-sm text-slate-300 break-words">
                        {testQuestions[currentQuestion].explanation}
                      </p>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white break-words">Результаты теста</h2>
                  <div className="mb-6 md:mb-8">
                    <div className="text-4xl md:text-6xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-purple-400 to-blue-600 bg-clip-text text-transparent">
                      {correctCount} / {testQuestions.length}
                    </div>
                    <p className="text-base md:text-lg text-slate-400 break-words">
                      {correctCount === testQuestions.length
                        ? 'Отлично! Вы отлично усвоили материал!'
                        : correctCount >= testQuestions.length * 0.7
                        ? 'Хорошо! Но есть куда расти.'
                        : 'Рекомендуем повторить материал.'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                    <Button
                      onClick={resetTest}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
                    >
                      <Icon name="RotateCcw" className="mr-2" size={16} />
                      Пройти снова
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowTest(false);
                        resetTest();
                      }}
                    >
                      Закрыть
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}