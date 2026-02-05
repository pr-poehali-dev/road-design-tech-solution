import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

interface Stage {
  id: number;
  title: string;
  emoji: string;
  goal: string;
  actions: string[];
  criteria: string;
  rule?: string;
  stimulus?: string;
  icon: string;
  color: string;
}

const stages: Stage[] = [
  {
    id: 1,
    title: 'Новый лид (явка)',
    emoji: '📌',
    goal: 'Получить контакт заинтересованного лица',
    actions: ['Лид поступает через заявку на сайте', 'Реклама или рекомендация', 'Фиксация контактных данных'],
    criteria: 'Наличие контакта и первичного интереса. Лид передан менеджеру.',
    icon: 'UserPlus',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 2,
    title: 'Квалификация',
    emoji: '⚡',
    goal: 'Оценить потенциального клиента и выявить его потребности',
    actions: [
      'Первый звонок/диалог менеджера',
      'ТЗ (Техническое задание): Что именно нужно клиенту?',
      'ТЭП (Технико-экономические показатели): Бюджет, сроки, ключевые параметры',
    ],
    criteria: 'Получены чёткие ТЗ и ТЭП, клиент подтвердил готовность двигаться дальше.',
    rule: '🚨 Жёсткое правило: Если ТЗ нет или оно нечёткое — дальнейшая работа не ведётся.',
    icon: 'ClipboardCheck',
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 3,
    title: 'Создание КП и дорожной карты',
    emoji: '📊',
    goal: 'Подготовить и отправить персональное коммерческое предложение',
    actions: [
      'Менеджер с экспертом создаёт КП с предварительными цифрами',
      'Демо-версия решения включается в КП',
      'В КП встраивается кнопка для записи на встречу',
    ],
    criteria: 'Клиент записался на встречу через календарь в КП.',
    stimulus: '💎 Стимул: При записи в течение 48 часов — этап проектирования и дорожной карты БЕСПЛАТНО!',
    icon: 'FileText',
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 4,
    title: 'Встреча (Менеджер + Эксперт)',
    emoji: '🤝',
    goal: 'Провести финальную презентацию, обсудить детали и договориться об условиях',
    actions: [
      'Эксперт представляет дорожную карту проекта (этапы, сроки, ответственность)',
      'Клиенту передаётся полный пакет: дорожная карта + черновик договора',
      'Проговариваются сроки принятия решения',
    ],
    criteria: 'Клиент принципиально согласен с условиями, начинается финальное согласование.',
    rule: '⚠️ Если клиент не укладывается в сроки — работа приостанавливается. Мы не работаем с неопределённостью.',
    icon: 'Handshake',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 5,
    title: 'Согласование и подписание договора',
    emoji: '✅',
    goal: 'Утвердить все детали и подписать договор',
    actions: [
      'Юридическое и техническое согласование итоговых документов',
      'Внесение правок при необходимости',
      'Обмен подписанными экземплярами',
    ],
    criteria: 'Договор подписан. Проект переходит в статус исполнения.',
    icon: 'CheckCircle2',
    color: 'from-cyan-500 to-blue-600',
  },
];

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const testQuestions: Question[] = [
  {
    id: 1,
    question: 'Что является обязательным условием для перехода со 2-го этапа (Квалификация) на 3-й?',
    options: [
      'Клиент оставил контактные данные',
      'Получены чёткие ТЗ и ТЭП, клиент подтвердил готовность',
      'Менеджер провёл первый звонок',
      'Клиент согласился на встречу',
    ],
    correctAnswer: 1,
    explanation: 'Без чётких ТЗ и ТЭП переход на следующий этап невозможен — это жёсткое правило воронки.',
  },
  {
    id: 2,
    question: 'Какой стимул предлагается клиенту при записи на встречу в течение 48 часов?',
    options: [
      'Скидка 10% на весь проект',
      'Бесплатное проектирование и создание дорожной карты',
      'Ускоренная реализация проекта',
      'Дополнительная консультация эксперта',
    ],
    correctAnswer: 1,
    explanation: 'При быстрой записи (в течение 2 дней) этап проектирования и дорожной карты выполняется бесплатно.',
  },
  {
    id: 3,
    question: 'Что получает клиент на встрече с менеджером и экспертом (4-й этап)?',
    options: [
      'Только презентацию возможностей компании',
      'Коммерческое предложение',
      'Полный пакет: дорожную карту + черновик договора',
      'Техническое задание',
    ],
    correctAnswer: 2,
    explanation: 'На встрече клиент сразу получает дорожную карту проекта и черновик договора для ознакомления.',
  },
  {
    id: 4,
    question: 'Что происходит, если клиент не укладывается в согласованные сроки принятия решения?',
    options: [
      'Менеджер продолжает работу и ждёт решения',
      'Дальнейшая работа приостанавливается',
      'Клиенту даётся дополнительное время без условий',
      'Проект автоматически отменяется',
    ],
    correctAnswer: 1,
    explanation: 'Компания не работает с неопределённостью — если сроки не соблюдаются, работа приостанавливается.',
  },
  {
    id: 5,
    question: 'Какова главная цель воронки продаж DEOD?',
    options: [
      'Получить максимальное количество лидов',
      'Последовательно фильтровать лидов и концентрироваться на реальных клиентах',
      'Быстро подписать договор с любым клиентом',
      'Провести как можно больше встреч',
    ],
    correctAnswer: 1,
    explanation: 'Воронка сужается на каждом этапе, отсеивая неподходящих клиентов, чтобы фокусироваться на мотивированных.',
  },
];

export default function SalesFunnel() {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(new Array(testQuestions.length).fill(false));
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (answeredQuestions[currentQuestion]) return;

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const newAnswered = [...answeredQuestions];
    newAnswered[currentQuestion] = true;
    setAnsweredQuestions(newAnswered);

    if (answerIndex === testQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setTestCompleted(true);
    }
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setTestCompleted(false);
    setAnsweredQuestions(new Array(testQuestions.length).fill(false));
  };

  const getScoreMessage = () => {
    const percentage = (score / testQuestions.length) * 100;
    if (percentage === 100) return { text: 'Отлично! Вы полностью освоили воронку продаж!', color: 'text-cyan-400' };
    if (percentage >= 80) return { text: 'Хорошо! Вы понимаете основные принципы.', color: 'text-blue-400' };
    if (percentage >= 60) return { text: 'Неплохо, но есть над чем поработать.', color: 'text-purple-400' };
    return { text: 'Рекомендуем пройти обучение ещё раз.', color: 'text-violet-400' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <section className="py-8 md:py-12 bg-slate-900/50 border-b border-cyan-500/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  Воронка продаж DEOD
                </h1>
                <p className="text-sm md:text-lg text-cyan-400">От лида до подписания договора</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Button
                    onClick={() => setShowKnowledgeBase(!showKnowledgeBase)}
                    className="bg-gradient-to-r from-purple-500 to-magenta-500 hover:from-purple-600 hover:to-magenta-600"
                  >
                    <Icon name="BookOpen" className="mr-2" size={18} />
                    База знаний
                    <Icon name="ChevronDown" className={`ml-2 transition-transform ${showKnowledgeBase ? 'rotate-180' : ''}`} size={16} />
                  </Button>
                  {showKnowledgeBase && (
                    <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-slate-800/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                      <Link
                        to="/ecosystem/gl"
                        className="block px-4 py-3 text-white hover:bg-purple-500/20 transition-colors border-b border-white/10"
                        onClick={() => setShowKnowledgeBase(false)}
                      >
                        Финансовая система
                      </Link>
                      <Link
                        to="/sales-funnel"
                        className="block px-4 py-3 text-white hover:bg-purple-500/20 transition-colors border-b border-white/10"
                        onClick={() => setShowKnowledgeBase(false)}
                      >
                        Воронка продаж
                      </Link>
                      <Link
                        to="/ecosystem/sales-script"
                        className="block px-4 py-3 text-white hover:bg-purple-500/20 transition-colors border-b border-white/10"
                        onClick={() => setShowKnowledgeBase(false)}
                      >
                        Скрипты и встречи
                      </Link>
                      <Link
                        to="/ecosystem/tender-guide"
                        className="block px-4 py-3 text-white hover:bg-purple-500/20 transition-colors border-b border-white/10"
                        onClick={() => setShowKnowledgeBase(false)}
                      >
                        Работа с тендерами
                      </Link>
                      <Link
                        to="/ecosystem/client-hunting"
                        className="block px-4 py-3 text-white hover:bg-purple-500/20 transition-colors"
                        onClick={() => setShowKnowledgeBase(false)}
                      >
                        Поиск клиентов
                      </Link>
                    </div>
                  )}
                </div>
                <Link to="/ecosystem">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    <Icon name="ArrowLeft" className="mr-2" size={18} />
                    Назад
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="bg-slate-800/50 border-purple-500/20 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="TrendingDown" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Принцип воронки</h3>
                  <p className="text-slate-300">
                    Воронка последовательно <span className="text-purple-400 font-semibold">сужается</span>. 
                    На каждом этапе отсеиваются неподходящие или нерешительные лиды, чтобы усилия команды 
                    концентрировались только на <span className="text-cyan-400 font-semibold">реальных и мотивированных клиентах</span>.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Stages Learning */}
      {!showTest && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
                  5 этапов воронки продаж
                </h2>
                <p className="text-slate-400 text-center max-w-2xl mx-auto">
                  Изучите каждый этап последовательно, чтобы понять логику работы с клиентами
                </p>
              </motion.div>

              <div className="space-y-6">
                {stages.map((stage, index) => (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`bg-slate-800/50 border-2 transition-all cursor-pointer hover:shadow-lg ${
                        selectedStage === stage.id
                          ? 'border-cyan-500 shadow-cyan-500/20'
                          : 'border-slate-700/50 hover:border-slate-600'
                      }`}
                      onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center flex-shrink-0`}>
                            <Icon name={stage.icon as any} size={32} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-3xl">{stage.emoji}</span>
                              <h3 className="text-xl md:text-2xl font-bold text-white">
                                Этап {stage.id}: {stage.title}
                              </h3>
                            </div>
                            <p className="text-cyan-400 font-medium">{stage.goal}</p>
                          </div>
                          <Icon
                            name={selectedStage === stage.id ? 'ChevronUp' : 'ChevronDown'}
                            size={24}
                            className="text-slate-400"
                          />
                        </div>

                        <AnimatePresence>
                          {selectedStage === stage.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 border-t border-slate-700 space-y-4">
                                <div>
                                  <h4 className="text-sm font-semibold text-slate-400 uppercase mb-2">Действия:</h4>
                                  <ul className="space-y-2">
                                    {stage.actions.map((action, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-slate-300">
                                        <Icon name="CheckCircle2" size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>{action}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {stage.stimulus && (
                                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
                                    <p className="text-purple-300 font-medium">{stage.stimulus}</p>
                                  </div>
                                )}

                                {stage.rule && (
                                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-4">
                                    <p className="text-orange-300 font-medium">{stage.rule}</p>
                                  </div>
                                )}

                                <div className="bg-slate-900/50 rounded-lg p-4">
                                  <h4 className="text-sm font-semibold text-emerald-400 uppercase mb-2">
                                    Критерий перехода на следующий этап:
                                  </h4>
                                  <p className="text-white font-medium">{stage.criteria}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 text-center"
              >
                <Button
                  onClick={() => setShowTest(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-6 text-lg shadow-lg shadow-purple-500/30"
                >
                  <Icon name="GraduationCap" className="mr-2" size={24} />
                  Пройти тест на проверку знаний
                </Button>
                <p className="text-slate-400 mt-4">Проверьте, как хорошо вы усвоили материал</p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Test Section */}
      {showTest && !testCompleted && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      Вопрос {currentQuestion + 1} из {testQuestions.length}
                    </h2>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowTest(false);
                        resetTest();
                      }}
                      className="border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      <Icon name="X" className="mr-2" size={18} />
                      Выйти
                    </Button>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestion + 1) / testQuestions.length) * 100}%` }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
                    />
                  </div>
                </div>

                <Card className="bg-slate-800/50 border-slate-700 p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
                    {testQuestions[currentQuestion].question}
                  </h3>

                  <div className="space-y-4 mb-6">
                    {testQuestions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={answeredQuestions[currentQuestion]}
                        whileHover={{ scale: answeredQuestions[currentQuestion] ? 1 : 1.02 }}
                        whileTap={{ scale: answeredQuestions[currentQuestion] ? 1 : 0.98 }}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          selectedAnswer === index
                            ? index === testQuestions[currentQuestion].correctAnswer
                              ? 'bg-emerald-500/20 border-emerald-500 text-white'
                              : 'bg-red-500/20 border-red-500 text-white'
                            : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600'
                        } ${answeredQuestions[currentQuestion] ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              selectedAnswer === index
                                ? index === testQuestions[currentQuestion].correctAnswer
                                  ? 'bg-emerald-500 border-emerald-500'
                                  : 'bg-red-500 border-red-500'
                                : 'border-slate-600'
                            }`}
                          >
                            {selectedAnswer === index && (
                              <Icon
                                name={index === testQuestions[currentQuestion].correctAnswer ? 'Check' : 'X'}
                                size={18}
                                className="text-white"
                              />
                            )}
                          </div>
                          <span className="flex-1">{option}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-slate-900/80 rounded-lg p-6 border-l-4 border-cyan-500">
                          <div className="flex items-start gap-3">
                            <Icon name="Info" size={24} className="text-cyan-400 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="text-cyan-400 font-semibold mb-2">Объяснение:</h4>
                              <p className="text-slate-300">{testQuestions[currentQuestion].explanation}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                          <Button
                            onClick={handleNextQuestion}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                          >
                            {currentQuestion < testQuestions.length - 1 ? (
                              <>
                                Следующий вопрос
                                <Icon name="ArrowRight" className="ml-2" size={18} />
                              </>
                            ) : (
                              <>
                                Завершить тест
                                <Icon name="CheckCircle2" className="ml-2" size={18} />
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Test Results */}
      {testCompleted && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="bg-slate-800/50 border-slate-700 p-8 md:p-12 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-6">
                    <Icon name="Award" size={48} className="text-white" />
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Тест завершён!</h2>

                  <div className="mb-6">
                    <p className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                      {score} / {testQuestions.length}
                    </p>
                    <p className={`text-xl font-semibold ${getScoreMessage().color}`}>{getScoreMessage().text}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Button
                      onClick={resetTest}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    >
                      <Icon name="RotateCcw" className="mr-2" size={18} />
                      Пройти ещё раз
                    </Button>
                    <Button
                      onClick={() => {
                        setShowTest(false);
                        resetTest();
                      }}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      <Icon name="BookOpen" className="mr-2" size={18} />
                      Вернуться к обучению
                    </Button>
                    <Link to="/ecosystem">
                      <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">
                        <Icon name="ArrowLeft" className="mr-2" size={18} />
                        В экосистему
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}