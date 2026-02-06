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
  },
  {
    id: 6,
    question: 'Сколько времени занимает вступление менеджера на встрече-защите?',
    options: ['1 минута', '3 минуты', '10 минут', '15 минут'],
    correctAnswer: 1,
    explanation: 'Вступление менеджера короткое — всего 3 минуты для обозначения цели встречи.'
  },
  {
    id: 7,
    question: 'Что такое Pre-Sale?',
    options: [
      'Послепродажное обслуживание',
      'Работа с клиентом до объявления тендера',
      'Скидки при раннем заказе',
      'Маркетинговая акция'
    ],
    correctAnswer: 1,
    explanation: 'Pre-Sale — это работа с ЛПР до объявления тендера для влияния на ТЗ.'
  },
  {
    id: 8,
    question: 'Какой главный принцип встречи-анализа?',
    options: [
      'Продать максимально дорого',
      'Задавать правильные вопросы, а не презентовать',
      'Рассказать о компании',
      'Показать портфолио'
    ],
    correctAnswer: 1,
    explanation: 'Встреча-анализ строится на правильных вопросах, которые выявляют проблемы клиента.'
  },
  {
    id: 9,
    question: 'Что рекомендуется включить в ТЗ тендера?',
    options: [
      'Только цену',
      'Критерии, где вы сильны (BIM, процессы)',
      'Любые стандартные требования',
      'Минимальные требования'
    ],
    correctAnswer: 1,
    explanation: 'Важно включить в ТЗ специфические критерии качества процесса, где вы сильнее конкурентов.'
  },
  {
    id: 10,
    question: 'Как долго длится совместная проработка дорожной карты?',
    options: ['15-30 минут', '30-40 минут', '60-90 минут', '2 часа'],
    correctAnswer: 2,
    explanation: 'Черновик дорожной карты создаётся за 60-90 минут совместной работы с клиентом.'
  },
  {
    id: 11,
    question: 'Что является признаком готовности клиента к сделке?',
    options: [
      'Клиент слушает презентацию',
      'Клиент задаёт вопросы о деталях и сроках',
      'Клиент просит скидку',
      'Клиент говорит "подумаем"'
    ],
    correctAnswer: 1,
    explanation: 'Готовый клиент интересуется конкретикой: сроками, этапами, ответственностью.'
  },
  {
    id: 12,
    question: 'Какая ошибка №1 в продажах проектных услуг?',
    options: [
      'Низкая цена',
      'Продавать услуги вместо решения проблем',
      'Слишком много встреч',
      'Длинные презентации'
    ],
    correctAnswer: 1,
    explanation: 'Главная ошибка — продавать чертежи, а не гарантию достижения бизнес-целей клиента.'
  },
  {
    id: 13,
    question: 'Зачем привлекать эксперта на раннем этапе?',
    options: [
      'Для количества участников',
      'Для технического диалога и доверия',
      'Для снижения нагрузки менеджера',
      'Это не обязательно'
    ],
    correctAnswer: 1,
    explanation: 'Эксперт создаёт доверие через технический диалог с техническим ЛПР клиента.'
  },
  {
    id: 14,
    question: 'Что означает "не работаем с неопределённостью"?',
    options: [
      'Не берём сложные проекты',
      'Если клиент тянет — сворачиваем проект',
      'Работаем только по договору',
      'Не работаем с новыми клиентами'
    ],
    correctAnswer: 1,
    explanation: 'Если клиент не готов к решению и тянет время — мягко сворачиваем до его готовности.'
  },
  {
    id: 15,
    question: 'Сколько страниц в "Концепции подхода"?',
    options: ['1 страница', '2-3 страницы', '10 страниц', '20+ страниц'],
    correctAnswer: 1,
    explanation: 'Концепция — это короткий документ на 2-3 страницы с ключевыми идеями.'
  },
  {
    id: 16,
    question: 'Что важнее показать клиенту?',
    options: [
      'Размер компании',
      'Количество проектов',
      'Понимание его проблем и рисков',
      'Низкую цену'
    ],
    correctAnswer: 2,
    explanation: 'Клиент выбирает того, кто понимает его специфические проблемы и риски.'
  },
  {
    id: 17,
    question: 'Когда отправлять "Концепцию подхода"?',
    options: [
      'До первой встречи',
      'После встречи-анализа',
      'После подписания договора',
      'Вместо встречи'
    ],
    correctAnswer: 1,
    explanation: 'Концепция отправляется после встречи-анализа как резюме понятых потребностей.'
  },
  {
    id: 18,
    question: 'Что такое воркшоп-формат встречи?',
    options: [
      'Просмотр презентации',
      'Совместная проработка дорожной карты',
      'Переговоры о цене',
      'Экскурсия по офису'
    ],
    correctAnswer: 1,
    explanation: 'Воркшоп — это совместная работа над дорожной картой, а не монолог.'
  },
  {
    id: 19,
    question: 'Какой результат фазы Pre-Sale?',
    options: [
      'Подписание договора',
      'Влияние на ТЗ тендера',
      'Получение предоплаты',
      'Встреча с директором'
    ],
    correctAnswer: 1,
    explanation: 'Цель Pre-Sale — повлиять на техническое задание до объявления тендера.'
  },
  {
    id: 20,
    question: 'Сколько длится встреча-защита с экспертом?',
    options: ['30 минут', '45-60 минут', '2 часа', '3 часа'],
    correctAnswer: 1,
    explanation: 'Встреча занимает 45-60 минут: 3 мин вступление + 30-40 мин эксперт + 10 мин резюме.'
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 bg-clip-text text-transparent break-words">
            Скрипт продаж проектных услуг
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto break-words">
            Работающая методология для сложных B2B-продаж в строительном проектировании
          </p>
        </motion.div>

        <div className="grid gap-4 md:gap-6 mb-8 md:mb-12">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`p-4 md:p-6 bg-gradient-to-br ${phase.color} bg-opacity-10 border-2 cursor-pointer hover:scale-[1.02] transition-all ${selectedPhase === phase.id ? 'ring-2 ring-cyan-500 scale-[1.02]' : ''}`}
                onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700 flex-shrink-0">
                    <Icon name={phase.icon} className="text-cyan-400" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2 flex items-center gap-2 break-words">
                      <span className="break-words">{phase.title}</span>
                    </h3>
                    <p className="text-sm md:text-base text-cyan-300 font-medium mb-2 md:mb-3 break-words">{phase.goal}</p>
                    <AnimatePresence>
                      {selectedPhase === phase.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 md:space-y-6 mt-3 md:mt-4"
                        >
                          <div className="space-y-2 md:space-y-3">
                            {phase.content.map((item, i) => (
                              <div key={i} className="flex items-start gap-2 md:gap-3">
                                <Icon name="Check" className="text-green-400 mt-1 flex-shrink-0" size={16} />
                                <span className="text-sm md:text-base text-slate-300 break-words min-w-0">{item}</span>
                              </div>
                            ))}
                          </div>
                          {phase.script && (
                            <div className="bg-slate-800/50 p-3 md:p-4 rounded-lg border border-slate-700">
                              <p className="text-sm md:text-base text-slate-300 italic break-words">{phase.script}</p>
                            </div>
                          )}
                          {phase.example && (
                            <div className="bg-green-900/20 p-3 md:p-4 rounded-lg border border-green-700/50">
                              <p className="text-sm md:text-base text-green-300 break-words">{phase.example}</p>
                            </div>
                          )}
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
            <Icon name="AlertTriangle" className="text-red-400 flex-shrink-0" size={24} />
            <span className="break-words">5 главных ошибок в продажах</span>
          </h2>
          <div className="grid gap-4 md:gap-6">
            {mistakes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 md:p-6 bg-slate-800/50 border-red-500/30 hover:border-red-500/50 transition-all">
                  <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                    <Icon name="X" className="text-red-400 mt-1 flex-shrink-0" size={20} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-red-400 mb-2 break-words">{item.mistake}</h3>
                      <p className="text-sm md:text-base text-slate-400 break-words">{item.why}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:gap-4 bg-green-900/20 p-3 md:p-4 rounded-lg border border-green-700/50">
                    <Icon name="Check" className="text-green-400 mt-1 flex-shrink-0" size={20} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm md:text-base font-semibold text-green-400 mb-1 break-words">Правильно:</h4>
                      <p className="text-sm md:text-base text-green-300 break-words">{item.correct}</p>
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
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-2xl shadow-cyan-500/20 text-base md:text-lg px-6 md:px-8 py-4 md:py-6"
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
                      Вопрос {currentQuestion + 1} из {questions.length}
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
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-base md:text-xl text-white mb-4 md:mb-6 font-medium break-words">
                    {questions[currentQuestion].question}
                  </p>
                  <div className="space-y-3 md:space-y-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(index)}
                        className={`w-full p-3 md:p-4 text-left rounded-lg border-2 transition-all ${
                          selectedAnswers[currentQuestion] === index
                            ? index === questions[currentQuestion].correctAnswer
                              ? 'border-green-500 bg-green-900/20'
                              : 'border-red-500 bg-red-900/20'
                            : 'border-slate-600 hover:border-cyan-500 bg-slate-800/50'
                        }`}
                        disabled={selectedAnswers[currentQuestion] !== undefined}
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                            selectedAnswers[currentQuestion] === index
                              ? index === questions[currentQuestion].correctAnswer
                                ? 'border-green-500 bg-green-500'
                                : 'border-red-500 bg-red-500'
                              : 'border-slate-600'
                          }`}>
                            {selectedAnswers[currentQuestion] === index && (
                              <Icon 
                                name={index === questions[currentQuestion].correctAnswer ? "Check" : "X"} 
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
                        {questions[currentQuestion].explanation}
                      </p>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white break-words">Результаты теста</h2>
                  <div className="mb-6 md:mb-8">
                    <div className="text-4xl md:text-6xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                      {correctCount} / {questions.length}
                    </div>
                    <p className="text-base md:text-lg text-slate-400 break-words">
                      {correctCount === questions.length
                        ? 'Отлично! Вы отлично усвоили материал!'
                        : correctCount >= questions.length * 0.7
                        ? 'Хорошо! Но есть куда расти.'
                        : 'Рекомендуем повторить материал.'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                    <Button
                      onClick={resetTest}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
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