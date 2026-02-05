import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

interface Phase {
  id: number;
  title: string;
  emoji: string;
  goal: string;
  content: string[];
  script?: string;
  example?: string;
  icon: string;
  color: string;
}

const phases: Phase[] = [
  {
    id: 1,
    title: 'Фаза 1: Pre-Sale & Влияние на ТЗ',
    emoji: '🎯',
    goal: 'Выйти на ключевого ЛПР до объявления тендера',
    content: [
      'Установление экспертного контакта',
      'Встреча-анализ без продажи',
      'Формирование доверия через консультацию'
    ],
    script: '«Добрый день, [Имя Отчество]. Меня зовут [Имя], DEOD. Мы специализируемся на проектировании [специализация]. Звоню, потому что видим активность вашей компании в [регион/сегмент]. У нас есть наработки, как на этапе проектирования закладывать решения, которые снижают capex на 10-15% за счёт оптимизации [например, узлов сопряжения, инженерных систем]. Готовы ли вы уделить 20 минут на обмен мнениями, даже если конкретный проект пока только в планах?»',
    icon: 'Target',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 2,
    title: 'Встреча-анализ: Правильные вопросы',
    emoji: '🔍',
    goal: 'Показать глубину экспертизы через интервью',
    content: [
      '«С какими основными рисками по срокам и бюджету вы сталкиваетесь на стадии ПИР?»',
      '«Как вы оцениваете готовность подрядчиков работать по вашей рабочей документации? Часты ли коллизии?»',
      '«Рассматриваете ли вы BIM не как формальность, а как инструмент управления стройкой и будущей эксплуатацией?»'
    ],
    example: 'Результат: Вы становитесь консультантом, а не рядовым подрядчиком. ЛПР начинает видеть в вас союзника для решения его проблем.',
    icon: 'Search',
    color: 'from-blue-500 to-purple-600',
  },
  {
    id: 3,
    title: 'Сценарий А: Планируемый проект (будет тендер)',
    emoji: '📋',
    goal: 'Участвовать в формировании технического задания',
    content: [
      'Направляете «Концепцию подхода к проектированию» (2-3 страницы)',
      'Резюмируете понятые цели и риски проекта',
      'Предлагаете набросок дорожной карты ключевых этапов',
      'Рекомендуете включить в ТЗ специфические критерии, где вы сильны'
    ],
    script: '«Чтобы ваши интересы были максимально защищены в тендерной документации, мы структурировали наши рекомендации. Критерии в ТЗ, основанные на качестве процесса, а не только на цене, позволят выбрать подрядчика, который реально снизит риски, а не того, кто сделает просто дешево»',
    icon: 'FileText',
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 4,
    title: 'Сценарий Б: Прямой заказ (без тендера)',
    emoji: '🤝',
    goal: 'Перейти к детальному проектированию предложения',
    content: [
      'Зафиксировать встречу с вашим техническим экспертом (ведущий инженер, ГИП)',
      'Совместно набросать черновик дорожной карты проекта за 60-90 минут',
      'Определить ключевые вехи (Milestones)',
      'Зафиксировать точки принятия решений и состав команд'
    ],
    icon: 'Handshake',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 5,
    title: 'Фаза 3: Встреча/Защита с экспертом',
    emoji: '💎',
    goal: 'Воркшоп вместо монолога — совместная проработка',
    content: [
      'Вступление менеджера (3 мин): цель встречи',
      'Работа эксперта (30-40 мин): технические вопросы, схемы, последствия решений',
      'Совместное заполнение дорожной карты: этапы, сроки, ответственные',
      'Обсуждение ценности и условий (10 мин): резюме и принятие решения'
    ],
    example: 'Жёсткое правило: Если клиент не готов к решению — мягко сворачивайте проект. «Я понимаю. Видимо, приоритеты проекта сейчас иные. Будем рады возобновить, когда появится готовность двигаться в рабочем темпе»',
    icon: 'Presentation',
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

const questions: Question[] = [
  {
    id: 1,
    question: 'Что является главной целью первого контакта с ЛПР?',
    options: [
      'Сразу продать услугу и заключить договор',
      'Предложить экспертную сессию и обмен мнениями',
      'Отправить коммерческое предложение',
      'Назначить встречу с юристом'
    ],
    correctAnswer: 1,
    explanation: 'Первый контакт — это не продажа, а предложение экспертной сессии. Ваша цель — показать компетенцию и выявить реальные проблемы клиента.'
  },
  {
    id: 2,
    question: 'Что НЕ нужно делать на встрече-анализе?',
    options: [
      'Задавать глубокие технические вопросы',
      'Презентовать свои услуги и настаивать на сделке',
      'Выявлять риски и проблемы клиента',
      'Демонстрировать экспертизу через вопросы'
    ],
    correctAnswer: 1,
    explanation: 'Встреча-анализ — это интервью, а не презентация. Не продавайте, а изучайте проблемы клиента и становитесь консультантом.'
  },
  {
    id: 3,
    question: 'Сколько времени эксперт ведёт встречу на этапе защиты?',
    options: [
      '10-15 минут',
      '20-25 минут',
      '30-40 минут',
      '60-90 минут'
    ],
    correctAnswer: 2,
    explanation: 'Эксперт ведёт основную часть встречи 30-40 минут, работая с дорожной картой, схемами и техническими решениями.'
  },
  {
    id: 4,
    question: 'Что делать, если клиент не готов принять решение после встречи?',
    options: [
      'Продолжать настаивать и давить на клиента',
      'Снизить цену для ускорения решения',
      'Мягко свернуть проект до готовности клиента',
      'Отправить ещё одно коммерческое предложение'
    ],
    correctAnswer: 2,
    explanation: 'Если клиент тянет время — мягко сворачивайте проект. Работа с неопределённостью снижает эффективность и отвлекает ресурсы.'
  },
  {
    id: 5,
    question: 'Что включает «Концепция подхода к проектированию»?',
    options: [
      'Только цену и сроки',
      'Резюме целей, дорожную карту и рекомендации для ТЗ',
      'Юридические документы и договор',
      'Список всех выполненных проектов'
    ],
    correctAnswer: 1,
    explanation: 'Концепция — это документ на 2-3 страницы с резюме понятых целей, дорожной картой и рекомендациями по критериям для тендерного ТЗ.'
  }
];

const mistakes = [
  {
    mistake: 'Продавать услуги, а не решать проблемы',
    why: 'Клиент покупает не чертежи, а гарантию, что объект будет построен в срок и бюджет.',
    correct: 'Говорить на языке бизнес-результатов клиента: снижение capex/opex, минимизация штрафов за срыв сроков, ускорение выхода на рынок.'
  },
  {
    mistake: 'Не выходить на технического эксперта',
    why: 'Менеджер не может ответить на детальные вопросы о нормах, технологиях, согласованиях.',
    correct: 'Привлекать эксперта на самой ранней стадии. Его диалог с технарём клиента — главный инструмент доверия.'
  },
  {
    mistake: 'Предлагать шаблонную дорожную карту',
    why: 'У каждого объекта уникальные вызовы: геология, инфраструктура, соседи.',
    correct: 'Создавать карту вместе с клиентом. Это доказывает, что вы думаете о его конкретике.'
  },
  {
    mistake: 'Давить на клиента как в розничных продажах',
    why: 'Решения принимаются коллегиально, цикл длинный.',
    correct: 'Быть настойчивым в процессе, но гибким в сроках. Ваша настойчивость должна проявляться в глубине проработки, а не количестве звонков.'
  },
  {
    mistake: 'Игнорировать «человеческий фактор»',
    why: 'ЛПР отвечает головой за выбор подрядчика. Ему нужен не просто поставщик, а партнёр, на которого можно положиться.',
    correct: 'Делиться опытом, предупреждать о рисках, даже если это может усложнить сделку. Это показывает, что вы думаете о его профессионализме, а не только о своей марже.'
  }
];

export default function SalesScript() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 500);
    } else {
      setTimeout(() => setShowResults(true), 500);
    }
  };

  const correctCount = selectedAnswers.filter((answer, index) => 
    answer === questions[index].correctAnswer
  ).length;

  const resetTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-violet-500/20">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link to="/ecosystem" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-400 via-purple-500 to-cyan-600 bg-clip-text text-transparent">
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
            
            <Link to="/ecosystem" className="text-xs md:text-sm text-slate-300 hover:text-violet-400 transition">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-4">
              <Icon name="Phone" size={18} className="text-violet-400" />
              <span className="text-violet-400 text-sm font-semibold">База знаний</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Скрипты и встречи
            </h1>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              Детальное руководство по работе со скриптами продаж и проведению встреч с клиентами
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 mb-12">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="bg-slate-900/50 border-slate-700/50 hover:border-violet-500/50 transition-all cursor-pointer"
                  onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <Icon name={phase.icon as any} size={28} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                          <Icon 
                            name={selectedPhase === phase.id ? "ChevronUp" : "ChevronDown"} 
                            size={24} 
                            className="text-violet-400"
                          />
                        </div>
                        <p className="text-violet-400 font-medium mb-2">Цель: {phase.goal}</p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedPhase === phase.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 pt-6 border-t border-slate-700/50"
                        >
                          <div className="space-y-4">
                            {phase.content.map((item, i) => (
                              <div key={i} className="flex gap-3">
                                <Icon name="CheckCircle2" size={20} className="text-violet-400 flex-shrink-0 mt-0.5" />
                                <p className="text-slate-300">{item}</p>
                              </div>
                            ))}
                            
                            {phase.script && (
                              <div className="mt-6 p-4 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <Icon name="MessageSquare" size={18} className="text-violet-400" />
                                  <span className="text-violet-400 font-semibold">Скрипт:</span>
                                </div>
                                <p className="text-slate-300 italic">{phase.script}</p>
                              </div>
                            )}
                            
                            {phase.example && (
                              <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Icon name="Lightbulb" size={18} className="text-cyan-400" />
                                  <span className="text-cyan-400 font-semibold">Результат:</span>
                                </div>
                                <p className="text-slate-300">{phase.example}</p>
                              </div>
                            )}
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
            className="mb-12"
          >
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-violet-500/30">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-violet-600 flex items-center justify-center">
                    <Icon name="AlertTriangle" size={24} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Ключевые ошибки и как их избежать</h2>
                </div>
                
                <img 
                  src="https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/bucket/71b34447-e950-45dd-9a9c-1733ae7d1ef5.png" 
                  alt="Ключевые ошибки в продажах"
                  className="w-full rounded-lg mb-6 border border-slate-700"
                />
                
                <div className="space-y-6">
                  {mistakes.map((item, index) => (
                    <div key={index} className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50">
                      <div className="flex items-start gap-3 mb-3">
                        <Icon name="XCircle" size={20} className="text-red-400 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-red-400 mb-2">Ошибка: {item.mistake}</h3>
                          <p className="text-slate-400 mb-3">Почему это провал: {item.why}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 ml-8 pl-3 border-l-2 border-cyan-500/50">
                        <Icon name="CheckCircle2" size={20} className="text-cyan-400 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="text-cyan-400 font-semibold mb-2">Правильный подход:</h4>
                          <p className="text-slate-300">{item.correct}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 border-violet-500/50">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Icon name="GraduationCap" size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white">Тестовое задание</h2>
                    <p className="text-slate-400">Проверьте, как вы усвоили материал</p>
                  </div>
                  {!showTest && (
                    <Button 
                      onClick={() => setShowTest(true)}
                      className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
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
                        <span className="text-violet-400 font-semibold">
                          Вопрос {currentQuestion + 1} из {questions.length}
                        </span>
                        <div className="flex gap-2">
                          {questions.map((_, index) => (
                            <div 
                              key={index}
                              className={`w-2 h-2 rounded-full ${
                                index === currentQuestion ? 'bg-violet-400' : 
                                index < currentQuestion ? 'bg-cyan-400' : 'bg-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-6">
                        {questions[currentQuestion].question}
                      </h3>

                      <div className="space-y-3">
                        {questions[currentQuestion].options.map((option, index) => (
                          <Button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className={`w-full justify-start text-left p-4 h-auto ${
                              selectedAnswers[currentQuestion] === index
                                ? index === questions[currentQuestion].correctAnswer
                                  ? 'bg-cyan-500/20 border-cyan-500 hover:bg-cyan-500/30'
                                  : 'bg-red-500/20 border-red-500 hover:bg-red-500/30'
                                : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700/50'
                            }`}
                            variant="outline"
                            disabled={selectedAnswers[currentQuestion] !== undefined}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                selectedAnswers[currentQuestion] === index
                                  ? index === questions[currentQuestion].correctAnswer
                                    ? 'border-cyan-400 bg-cyan-500/20'
                                    : 'border-red-400 bg-red-500/20'
                                  : 'border-slate-500'
                              }`}>
                                <span className="font-semibold">{String.fromCharCode(65 + index)}</span>
                              </div>
                              <span className="flex-1">{option}</span>
                              {selectedAnswers[currentQuestion] === index && (
                                <Icon 
                                  name={index === questions[currentQuestion].correctAnswer ? "CheckCircle2" : "XCircle"} 
                                  size={20}
                                  className={index === questions[currentQuestion].correctAnswer ? "text-cyan-400" : "text-red-400"}
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
                            selectedAnswers[currentQuestion] === questions[currentQuestion].correctAnswer
                              ? 'bg-cyan-500/10 border-cyan-500/30'
                              : 'bg-violet-500/10 border-violet-500/30'
                          }`}
                        >
                          <p className="text-slate-300">{questions[currentQuestion].explanation}</p>
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
                          : 'bg-gradient-to-br from-violet-500 to-purple-600'
                      }`}>
                        <div className="text-white">
                          <div className="text-4xl font-bold">{correctCount}/{questions.length}</div>
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
                          ? 'Вы отлично разбираетесь в технике продаж! Применяйте эти знания на практике.' 
                          : 'Пересмотрите материал и попробуйте ещё раз. Практика — ключ к мастерству.'}
                      </p>
                      
                      <div className="flex gap-4 justify-center">
                        <Button 
                          onClick={resetTest}
                          className="bg-violet-500 hover:bg-violet-600"
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
