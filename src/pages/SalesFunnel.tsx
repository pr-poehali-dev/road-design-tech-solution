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
  {
    id: 6,
    question: 'Что означает аббревиатура ТЗ на этапе квалификации?',
    options: [
      'Технический заказ',
      'Техническое задание',
      'Тестовая закупка',
      'Точные замеры',
    ],
    correctAnswer: 1,
    explanation: 'ТЗ — Техническое задание, в котором описывается что именно нужно клиенту.',
  },
  {
    id: 7,
    question: 'Что означает аббревиатура ТЭП на этапе квалификации?',
    options: [
      'Технико-экологические параметры',
      'Технико-экономические показатели',
      'Территориально-экономический проект',
      'Технический экспертный план',
    ],
    correctAnswer: 1,
    explanation: 'ТЭП — Технико-экономические показатели: бюджет, сроки, ключевые параметры проекта.',
  },
  {
    id: 8,
    question: 'Что включает демо-версия решения на 3-м этапе?',
    options: [
      'Только текстовое описание',
      'Демонстрацию работающего решения в КП',
      'Видео с примерами других проектов',
      'Фотографии аналогичных объектов',
    ],
    correctAnswer: 1,
    explanation: 'На этапе создания КП демо-версия решения включается прямо в коммерческое предложение.',
  },
  {
    id: 9,
    question: 'Кто создаёт коммерческое предложение на 3-м этапе?',
    options: [
      'Только менеджер',
      'Только эксперт',
      'Менеджер с экспертом совместно',
      'Автоматическая система',
    ],
    correctAnswer: 2,
    explanation: 'КП создаётся совместно менеджером и экспертом с предварительными цифрами.',
  },
  {
    id: 10,
    question: 'Какой элемент встраивается в КП для упрощения записи на встречу?',
    options: [
      'Ссылка на сайт',
      'Номер телефона',
      'Кнопка для записи на встречу',
      'QR-код',
    ],
    correctAnswer: 2,
    explanation: 'В КП встраивается кнопка для удобной записи на встречу через календарь.',
  },
  {
    id: 11,
    question: 'Сколько времени даётся клиенту для получения бесплатного проектирования?',
    options: [
      '24 часа',
      '48 часов',
      '72 часа',
      'Неделя',
    ],
    correctAnswer: 1,
    explanation: 'При записи в течение 48 часов этап проектирования и дорожной карты выполняется бесплатно.',
  },
  {
    id: 12,
    question: 'Кто участвует во встрече на 4-м этапе?',
    options: [
      'Только менеджер',
      'Только эксперт',
      'Менеджер + эксперт',
      'Весь отдел продаж',
    ],
    correctAnswer: 2,
    explanation: 'На 4-м этапе проводится встреча с участием менеджера и эксперта для полной презентации.',
  },
  {
    id: 13,
    question: 'Что представляет эксперт на встрече 4-го этапа?',
    options: [
      'Финансовый отчёт компании',
      'Дорожную карту проекта с этапами, сроками и ответственностью',
      'Юридические документы',
      'Список сотрудников',
    ],
    correctAnswer: 1,
    explanation: 'Эксперт представляет дорожную карту проекта, включая этапы, сроки и ответственность.',
  },
  {
    id: 14,
    question: 'Что обсуждается на встрече помимо презентации решения?',
    options: [
      'История компании',
      'Личные достижения менеджера',
      'Сроки принятия решения',
      'Маркетинговая стратегия',
    ],
    correctAnswer: 2,
    explanation: 'На встрече обязательно проговариваются сроки принятия решения клиентом.',
  },
  {
    id: 15,
    question: 'Что является критерием успешного завершения 4-го этапа?',
    options: [
      'Клиент посетил встречу',
      'Клиент принципиально согласен с условиями',
      'Клиент задал много вопросов',
      'Клиент попросил время на размышление',
    ],
    correctAnswer: 1,
    explanation: 'Критерий 4-го этапа — клиент принципиально согласен с условиями, начинается финальное согласование.',
  },
  {
    id: 16,
    question: 'Что происходит на 5-м этапе воронки?',
    options: [
      'Первая встреча с клиентом',
      'Создание коммерческого предложения',
      'Согласование и подписание договора',
      'Начало выполнения работ',
    ],
    correctAnswer: 2,
    explanation: '5-й этап — согласование и подписание договора, юридическое и техническое согласование.',
  },
  {
    id: 17,
    question: 'Какие документы согласовываются на последнем этапе?',
    options: [
      'Только финансовые',
      'Юридические и технические',
      'Только маркетинговые',
      'Только бухгалтерские',
    ],
    correctAnswer: 1,
    explanation: 'На последнем этапе проходит юридическое и техническое согласование итоговых документов.',
  },
  {
    id: 18,
    question: 'Что означает принцип "не работаем с неопределённостью"?',
    options: [
      'Не работаем без предоплаты',
      'Если клиент не соблюдает сроки принятия решения — работа приостанавливается',
      'Не берём проекты без ТЗ',
      'Не работаем с новыми клиентами',
    ],
    correctAnswer: 1,
    explanation: 'Если клиент не укладывается в согласованные сроки принятия решения — работа приостанавливается.',
  },
  {
    id: 19,
    question: 'Почему важно получить ТЗ и ТЭП перед созданием КП?',
    options: [
      'Для отчётности',
      'Для создания точного и персонализированного предложения',
      'Для статистики',
      'Это не обязательно',
    ],
    correctAnswer: 1,
    explanation: 'Чёткие ТЗ и ТЭП необходимы для создания точного КП с корректными цифрами и решениями.',
  },
  {
    id: 20,
    question: 'Какова главная задача этапа "Новый лид"?',
    options: [
      'Провести презентацию компании',
      'Получить контакт заинтересованного лица и передать менеджеру',
      'Подписать договор',
      'Создать коммерческое предложение',
    ],
    correctAnswer: 1,
    explanation: 'На первом этапе главная цель — получить контакт заинтересованного лица и передать лид менеджеру.',
  },
  {
    id: 21,
    question: 'Сколько основных этапов в воронке продаж DEOD?',
    options: [
      '3 этапа',
      '4 этапа',
      '5 этапов',
      '7 этапов',
    ],
    correctAnswer: 2,
    explanation: 'В воронке продаж DEOD 5 основных этапов: от нового лида до подписания договора.',
  },
  {
    id: 22,
    question: 'Что происходит с лидом, если на этапе квалификации ТЗ нечёткое?',
    options: [
      'Менеджер всё равно создаёт КП',
      'Дальнейшая работа не ведётся',
      'Лид передаётся другому менеджеру',
      'Клиенту даётся неограниченное время',
    ],
    correctAnswer: 1,
    explanation: 'Жёсткое правило: если ТЗ нет или оно нечёткое — дальнейшая работа не ведётся.',
  },
  {
    id: 23,
    question: 'Какой документ клиент получает вместе с дорожной картой на встрече?',
    options: [
      'Финансовый план',
      'Черновик договора',
      'Маркетинговую презентацию',
      'Штатное расписание',
    ],
    correctAnswer: 1,
    explanation: 'На встрече клиент получает полный пакет: дорожную карту + черновик договора.',
  },
  {
    id: 24,
    question: 'Как воронка относится к "сырым" лидам без чёткого запроса?',
    options: [
      'Все лиды принимаются в работу',
      'Лиды фильтруются, работа ведётся только с квалифицированными',
      'Лиды сохраняются для будущей работы',
      'Лиды передаются конкурентам',
    ],
    correctAnswer: 1,
    explanation: 'Воронка последовательно фильтрует лидов, отсеивая неподходящих для концентрации на реальных клиентах.',
  },
  {
    id: 25,
    question: 'В чём уникальность подхода DEOD к воронке продаж?',
    options: [
      'Максимальное количество лидов',
      'Жёсткая фильтрация на каждом этапе и отказ работать с неопределённостью',
      'Минимальная цена услуг',
      'Автоматизация всех процессов',
    ],
    correctAnswer: 1,
    explanation: 'Уникальность — жёсткая фильтрация на каждом этапе, чёткие критерии перехода и отказ работать с неопределённостью.',
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
  const [testPassed, setTestPassed] = useState(() => {
    const saved = localStorage.getItem('salesFunnelTestPassed');
    return saved === 'true';
  });

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
      const finalScore = score + (selectedAnswer === testQuestions[currentQuestion].correctAnswer ? 1 : 0);
      const percentage = (finalScore / testQuestions.length) * 100;
      const passed = percentage >= 80;
      setTestCompleted(true);
      setTestPassed(passed);
      localStorage.setItem('salesFunnelTestPassed', passed ? 'true' : 'false');
      localStorage.setItem('salesFunnelTestResults', JSON.stringify({
        passed,
        score: finalScore,
        total: testQuestions.length,
        timestamp: Date.now()
      }));
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
    if (percentage >= 80) return { text: 'Отлично! Тест пройден! Вы полностью освоили воронку продаж!', color: 'text-cyan-400' };
    if (percentage >= 60) return { text: 'Неплохо, но тест не пройден. Нужно 80% для успеха.', color: 'text-purple-400' };
    return { text: 'Тест не пройден. Рекомендуем изучить материал ещё раз.', color: 'text-red-400' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Not Passed Banner */}
      {!testPassed && (
        <div className="bg-red-500/10 border-b border-red-500/30 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 text-red-400">
              <Icon name="AlertCircle" size={20} />
              <span className="text-sm md:text-base font-medium">
                Тест не пройден. Необходимо набрать минимум 80% для доступа ко всем материалам.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="py-8 md:py-12 bg-slate-900/50 border-b border-cyan-500/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  Воронка продаж DEOD
                </h1>
                <p className="text-sm md:text-base lg:text-lg text-slate-400">
                  Пять этапов от лида до договора
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/ecosystem">
                  <Button className="w-full sm:w-auto bg-slate-800/80 border border-slate-600/50 hover:bg-slate-700/80">
                    <Icon name="ArrowLeft" className="mr-2" size={16} />
                    Экосистема
                  </Button>
                </Link>
                <Button 
                  onClick={() => setShowKnowledgeBase(!showKnowledgeBase)}
                  className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                >
                  <Icon name="Book" className="mr-2" size={16} />
                  {showKnowledgeBase ? 'Скрыть базу знаний' : 'База знаний'}
                </Button>
                <Button 
                  onClick={() => setShowTest(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                >
                  <Icon name="GraduationCap" className="mr-2" size={16} />
                  Пройти тест ({testQuestions.length} вопросов)
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Knowledge Base */}
      <AnimatePresence>
        {showKnowledgeBase && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="py-12 md:py-16"
          >
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                  База знаний: Воронка продаж
                </h2>
                
                {/* Stages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                  {stages.map((stage, index) => (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className={`bg-gradient-to-br ${stage.color} p-6 cursor-pointer hover:scale-105 transition-transform`}
                        onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <Icon name={stage.icon as any} size={24} className="text-white" />
                          <h3 className="text-lg font-bold text-white">{stage.title}</h3>
                        </div>
                        <p className="text-white/90 text-sm mb-3">{stage.goal}</p>
                        
                        <AnimatePresence>
                          {selectedStage === stage.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-white/20"
                            >
                              <div className="space-y-3">
                                <div>
                                  <p className="text-white font-semibold text-sm mb-2">Действия:</p>
                                  <ul className="text-white/90 text-sm space-y-1">
                                    {stage.actions.map((action, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="text-white/60">•</span>
                                        <span>{action}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="text-white font-semibold text-sm mb-1">Критерий:</p>
                                  <p className="text-white/90 text-sm">{stage.criteria}</p>
                                </div>
                                {stage.rule && (
                                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                                    <p className="text-white text-sm">{stage.rule}</p>
                                  </div>
                                )}
                                {stage.stimulus && (
                                  <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-3">
                                    <p className="text-white text-sm">{stage.stimulus}</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Test Modal */}
      <AnimatePresence>
        {showTest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !testCompleted && setShowTest(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-2xl border border-cyan-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {!testCompleted ? (
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      Вопрос {currentQuestion + 1} / {testQuestions.length}
                    </h3>
                    <Button
                      onClick={() => setShowTest(false)}
                      className="bg-slate-800 hover:bg-slate-700"
                      size="sm"
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>

                  <div className="mb-6">
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / testQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <h4 className="text-lg md:text-xl text-white mb-6">
                    {testQuestions[currentQuestion].question}
                  </h4>

                  <div className="space-y-3 mb-6">
                    {testQuestions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={answeredQuestions[currentQuestion]}
                        className={`w-full p-4 rounded-xl text-left transition-all ${
                          selectedAnswer === index
                            ? index === testQuestions[currentQuestion].correctAnswer
                              ? 'bg-green-500/20 border-2 border-green-500'
                              : 'bg-red-500/20 border-2 border-red-500'
                            : answeredQuestions[currentQuestion] && index === testQuestions[currentQuestion].correctAnswer
                            ? 'bg-green-500/20 border-2 border-green-500'
                            : 'bg-slate-800 border-2 border-slate-700 hover:border-cyan-500/50'
                        } ${answeredQuestions[currentQuestion] ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span className="text-white">{option}</span>
                      </button>
                    ))}
                  </div>

                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-6"
                    >
                      <p className="text-cyan-400 text-sm">{testQuestions[currentQuestion].explanation}</p>
                    </motion.div>
                  )}

                  {answeredQuestions[currentQuestion] && (
                    <Button
                      onClick={handleNextQuestion}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                    >
                      {currentQuestion < testQuestions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
                      <Icon name="ArrowRight" className="ml-2" size={16} />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="p-6 md:p-8 text-center">
                  <div className="mb-6">
                    <Icon 
                      name={(score / testQuestions.length) >= 0.8 ? "Trophy" : "Target"} 
                      size={64} 
                      className={`mx-auto ${(score / testQuestions.length) >= 0.8 ? 'text-cyan-400' : 'text-purple-400'}`}
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Тест завершён!
                  </h3>
                  <p className="text-3xl md:text-4xl font-bold text-cyan-400 mb-4">
                    {score} / {testQuestions.length}
                  </p>
                  <p className={`text-lg md:text-xl mb-8 ${getScoreMessage().color}`}>
                    {getScoreMessage().text}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={resetTest}
                      className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                    >
                      <Icon name="RotateCcw" className="mr-2" size={16} />
                      Пройти заново
                    </Button>
                    <Button
                      onClick={() => {
                        setShowTest(false);
                        resetTest();
                      }}
                      className="bg-slate-800 hover:bg-slate-700"
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

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`bg-gradient-to-br ${stage.color} p-6 h-full`}>
                    <div className="flex items-center gap-3 mb-4">
                      <Icon name={stage.icon as any} size={32} className="text-white" />
                      <span className="text-3xl">{stage.emoji}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{stage.title}</h3>
                    <p className="text-white/90 text-sm">{stage.goal}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}