import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

interface TargetAudience {
  id: number;
  title: string;
  why: string;
  howToFind: string[];
  keyContacts: string[];
  icon: string;
  color: string;
}

const audiences: TargetAudience[] = [
  {
    id: 1,
    title: 'Строительные и девелоперские компании',
    why: 'Постоянный поток проектов, бюджет от 100 млн, понимают ценность качественной проектной документации',
    howToFind: [
      'Мониторинг базы ЕИСЖС (стройки жилья)',
      'НаОбъектах.ру — база строящихся объектов',
      'Новости о получении земельных участков',
      'Выставки недвижимости (MIPIM, 100+ Forum)'
    ],
    keyContacts: ['Технический директор', 'Начальник управления капстроительства', 'Главный инженер проекта'],
    icon: 'Building2',
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 2,
    title: 'Производственные предприятия',
    why: 'Проекты расширения, модернизации, строительство новых цехов. Бюджет 50-500 млн',
    howToFind: [
      'План закупок 223-ФЗ',
      'Пресс-релизы о модернизации/расширении',
      'Отраслевые конференции',
      'СПАРК — мониторинг финансовых показателей'
    ],
    keyContacts: ['Главный инженер', 'Директор по развитию', 'Начальник отдела капитального строительства'],
    icon: 'Factory',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 3,
    title: 'Госкорпорации',
    why: 'Крупные бюджеты (от 200 млн), длинный цикл, но стабильность и репутация',
    howToFind: [
      'План закупок 44-ФЗ (ЕИС zakupki.gov.ru)',
      'Мониторинг ПГЗ на год вперед',
      'Отраслевые форумы и круглые столы',
      'Прямые контакты с профильными управлениями'
    ],
    keyContacts: ['Начальник управления', 'Заместитель ген. директора по строительству', 'Начальник отдела закупок'],
    icon: 'Building',
    color: 'from-cyan-500 to-blue-600'
  }
];

const sources = [
  {
    title: '1. План закупок (44-ФЗ/223-ФЗ)',
    description: 'Золотая жила для B2G',
    tools: ['zakupki.gov.ru (ЕИС)', 'СБИС Тендеры', 'ПИК-Тендер'],
    strategy: 'Мониторинг ПГЗ на квартал вперед → выход на ЛПР до публикации → COP → влияние на ТЗ',
    conversion: '15-25% при качественном COP',
    icon: 'FileSearch',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    title: '2. Строительные базы данных',
    description: 'Кто строит прямо сейчас',
    tools: ['НаОбъектах.ру', 'ЕИСЖС', 'Строительство.ру'],
    strategy: 'Фильтр по стадии «Получено разрешение на строительство» → холодный контакт с предложением оптимизации',
    conversion: '5-10% (холодные контакты)',
    icon: 'Database',
    color: 'from-blue-500 to-purple-600'
  },
  {
    title: '3. Деловые СМИ и новости',
    description: 'Кто анонсирует проекты',
    tools: ['Коммерсантъ Недвижимость', 'РБК Строительство', 'Google Alerts'],
    strategy: 'Настроить алерты на ключевые слова → звонок в течение 48 часов после публикации новости',
    conversion: '10-15% (теплый контакт)',
    icon: 'Newspaper',
    color: 'from-purple-500 to-violet-600'
  },
  {
    title: '4. Нетворкинг',
    description: 'Личные связи и доверие',
    tools: ['Выставки (Interbudexpo, Stroytech)', 'Конференции', 'LinkedIn'],
    strategy: 'Не продавать на выставке → обмен контактами → follow-up в течение недели',
    conversion: '20-30% (теплые контакты)',
    icon: 'Users',
    color: 'from-violet-500 to-purple-600'
  },
  {
    title: '5. Теплые рекомендации',
    description: 'Самый высокий ROI',
    tools: ['Реферальная программа', 'Кейсы довольных клиентов'],
    strategy: 'Запрос рекомендации у каждого завершенного проекта → бонус за привлеченного клиента',
    conversion: '40-60% (высокое доверие)',
    icon: 'Award',
    color: 'from-cyan-500 to-blue-600'
  }
];

const idealClient = [
  { criteria: 'Бюджет проекта', value: 'от 30 млн ₽', icon: 'DollarSign' },
  { criteria: 'Земельный участок', value: 'есть в собственности или аренде', icon: 'MapPin' },
  { criteria: 'ЛПР', value: '1-3 человека', icon: 'Users' },
  { criteria: 'Deadline', value: 'есть причина срочности', icon: 'Clock' },
  { criteria: 'Готовность', value: 'встреча в течение недели', icon: 'Calendar' }
];

const bant = [
  { letter: 'B', title: 'Budget — Бюджет', questions: ['Утвержден ли бюджет?', 'Из какого источника финансирование?', 'Есть ли резерв на доп. расходы?'], score: 'Утвержден = 5, В процессе = 3, Не определен = 1' },
  { letter: 'A', title: 'Authority — Полномочия', questions: ['С кем я говорю? ЛПР или посредник?', 'Кто еще участвует в решении?', 'Кто ставит подпись на договоре?'], score: 'ЛПР = 5, Влияет на решение = 3, Посредник = 1' },
  { letter: 'N', title: 'Need — Потребность', questions: ['Какая боль/проблема решается?', 'Что будет, если не решить?', 'Есть ли альтернативные решения?'], score: 'Критичная потребность = 5, Желательно = 3, Не срочно = 1' },
  { letter: 'T', title: 'Timeline — Сроки', questions: ['Когда нужно начать?', 'Есть ли жесткий дедлайн?', 'Что влияет на сроки?'], score: 'До 1 месяца = 5, 1-3 месяца = 3, Неопределенно = 1' }
];

const cases = [
  {
    title: 'Кейс: Застройщик из ПГЗ',
    situation: 'Нашли в плане закупок застройщика проект «Проектирование ЖК на 15 тыс. м²» за 3 месяца до публикации тендера',
    actions: ['Нашли техдиректора через LinkedIn', 'Предложили бесплатный аудит текущих проектных решений', 'Провели встречу с BIM-экспертом', 'Согласовали критерии для ТЗ тендера'],
    result: 'Выиграли тендер с ценой на 12% выше конкурентов благодаря неценовым критериям',
    metrics: 'Бюджет: 45 млн ₽, Цикл: 4 месяца, Конверсия: 100%',
    icon: 'Trophy',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    title: 'Кейс: Производство через новости',
    situation: 'Прочитали в РБК о планах завода построить новый цех. Позвонили на следующий день',
    actions: ['Холодный звонок главному инженеру', 'Отправили кейс аналогичного проекта', 'Встреча через неделю', 'КП с дорожной картой'],
    result: 'Контракт на проектирование цеха',
    metrics: 'Бюджет: 38 млн ₽, Цикл: 2 месяца',
    icon: 'Zap',
    color: 'from-purple-500 to-violet-600'
  },
  {
    title: 'Кейс: Реферал от клиента',
    situation: 'Завершили успешный проект для девелопера. Попросили рекомендацию',
    actions: ['Клиент познакомил с коллегой из другой компании', 'Теплая встреча через 3 дня', 'Подписание договора через 2 недели'],
    result: 'Самая быстрая сделка без тендера',
    metrics: 'Бюджет: 52 млн ₽, Цикл: 3 недели, Конверсия: 100%',
    icon: 'Handshake',
    color: 'from-violet-500 to-purple-600'
  }
];

const mistakes = [
  { mistake: 'Искать всех подряд', why: 'Трата времени на нецелевых клиентов', correct: 'Фокус на идеальном профиле клиента' },
  { mistake: 'Не квалифицировать лиды', why: 'Работа с "мёртвыми" лидами', correct: 'Использовать BANT для отсева' },
  { mistake: 'Шаблонные КП', why: 'Клиент не видит ценности', correct: 'Персонализированное КП с дорожной картой' },
  { mistake: 'Не выходить на ЛПР', why: 'Длинный цикл через посредников', correct: 'Сразу выходить на техдиректора/главного инженера' },
  { mistake: 'Ждать входящих', why: 'Пассивная позиция', correct: 'Активный поиск через базы и нетворкинг' }
];

const testQuestions = [
  {
    question: 'Какой минимальный бюджет для идеального клиента?',
    options: ['От 10 млн', 'От 30 млн', 'От 50 млн', 'Не важно'],
    correctAnswer: 1,
    explanation: 'Минимальный бюджет — от 30 млн рублей для достаточной маржи и рентабельности.'
  },
  {
    question: 'Что такое система BANT?',
    options: ['Метод звонков', 'Budget, Authority, Need, Timeline', 'База клиентов', 'Тип тендера'],
    correctAnswer: 1,
    explanation: 'BANT — Budget, Authority, Need, Timeline. Система квалификации качества лида.'
  },
  {
    question: 'Самый эффективный источник для 44-ФЗ/223-ФЗ?',
    options: ['Соцсети', 'План закупок на ЕИС', 'Холодные звонки', 'Email'],
    correctAnswer: 1,
    explanation: 'План закупок на ЕИС показывает планы на год вперед, позволяя провести COP.'
  },
  {
    question: 'Почему важно выходить на ЛПР?',
    options: ['Для знакомства', 'ЛПР принимает решение о подрядчике', 'ЛПР дружелюбнее', 'Не обязательно'],
    correctAnswer: 1,
    explanation: 'ЛПР принимает окончательное решение. Посредники увеличивают цикл сделки.'
  },
  {
    question: 'Главная ошибка при поиске?',
    options: ['Много каналов', 'Поиск всех без квалификации', 'Выход на ЛПР', 'Использование баз'],
    correctAnswer: 1,
    explanation: 'Поиск всех подряд без квалификации — трата времени. Фокус на идеальном профиле клиента.'
  }
];

export default function ClientHunting() {
  const [selectedAudience, setSelectedAudience] = useState<number | null>(null);
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
                    className="absolute right-0 mt-2 w-48 md:w-56 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-lg shadow-2xl overflow-hidden"
                  >
                    <Link to="/sales-script" className="block px-3 md:px-4 py-2 md:py-3 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50">
                      <div className="flex items-center gap-2 md:gap-3">
                        <Icon name="MessageSquare" size={16} className="text-cyan-400 flex-shrink-0" />
                        <span className="text-xs md:text-sm text-slate-200 break-words min-w-0">Скрипт продаж</span>
                      </div>
                    </Link>
                    <Link to="/tender-guide" className="block px-3 md:px-4 py-2 md:py-3 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50">
                      <div className="flex items-center gap-2 md:gap-3">
                        <Icon name="Gavel" size={16} className="text-purple-400 flex-shrink-0" />
                        <span className="text-xs md:text-sm text-slate-200 break-words min-w-0">Тендерный блок</span>
                      </div>
                    </Link>
                    <Link to="/client-hunting" className="block px-3 md:px-4 py-2 md:py-3 hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center gap-2 md:gap-3">
                        <Icon name="Target" size={16} className="text-violet-400 flex-shrink-0" />
                        <span className="text-xs md:text-sm text-slate-200 break-words min-w-0">Охота на клиентов</span>
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-violet-400 via-purple-500 to-cyan-600 bg-clip-text text-transparent break-words">
            Охота на клиентов
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto break-words">
            Стратегия и тактика поиска целевых клиентов в B2B проектирования
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center gap-2 md:gap-3 text-white">
            <Icon name="Crosshair" className="text-violet-400 flex-shrink-0" size={24} />
            <span className="break-words">Целевые аудитории</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {audiences.map((audience, index) => (
              <motion.div
                key={audience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`p-4 md:p-6 bg-gradient-to-br ${audience.color} bg-opacity-10 border-2 cursor-pointer hover:scale-[1.02] transition-all h-full ${selectedAudience === audience.id ? 'ring-2 ring-violet-500 scale-[1.02]' : ''}`}
                  onClick={() => setSelectedAudience(selectedAudience === audience.id ? null : audience.id)}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700 flex-shrink-0">
                        <Icon name={audience.icon} className="text-violet-400" size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-2 break-words">{audience.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-slate-300 mb-3 md:mb-4 break-words">{audience.why}</p>
                    <AnimatePresence>
                      {selectedAudience === audience.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 md:space-y-6 mt-auto"
                        >
                          <div>
                            <h4 className="text-sm md:text-base font-semibold text-cyan-400 mb-2 break-words">Где искать:</h4>
                            <div className="space-y-2">
                              {audience.howToFind.map((method, i) => (
                                <div key={i} className="flex items-start gap-2 md:gap-3">
                                  <Icon name="Search" className="text-blue-400 mt-1 flex-shrink-0" size={14} />
                                  <span className="text-xs md:text-sm text-slate-300 break-words min-w-0">{method}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm md:text-base font-semibold text-green-400 mb-2 break-words">Ключевые контакты:</h4>
                            <div className="flex flex-wrap gap-2">
                              {audience.keyContacts.map((contact, i) => (
                                <span key={i} className="text-xs md:text-sm px-2 md:px-3 py-1 bg-green-900/30 text-green-300 rounded-full border border-green-700/50 break-words">
                                  {contact}
                                </span>
                              ))}
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center gap-2 md:gap-3 text-white">
            <Icon name="Radar" className="text-cyan-400 flex-shrink-0" size={24} />
            <span className="break-words">5 источников лидов</span>
          </h2>
          <div className="grid gap-4 md:gap-6">
            {sources.map((source, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-4 md:p-6 bg-gradient-to-br ${source.color} bg-opacity-10 border-2`}>
                  <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700 flex-shrink-0">
                      <Icon name={source.icon} className="text-cyan-400" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-1 break-words">{source.title}</h3>
                      <p className="text-sm md:text-base text-cyan-300 break-words">{source.description}</p>
                    </div>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <span className="text-xs md:text-sm font-semibold text-slate-400 break-words">Инструменты:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {source.tools.map((tool, i) => (
                          <span key={i} className="text-xs md:text-sm px-2 md:px-3 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700 break-words">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-3 md:p-4 rounded-lg border border-slate-700">
                      <p className="text-xs md:text-sm text-slate-300 mb-2 break-words"><span className="font-semibold">Стратегия:</span> {source.strategy}</p>
                      <p className="text-xs md:text-sm text-green-400 font-semibold break-words">Конверсия: {source.conversion}</p>
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
            <Icon name="Star" className="text-yellow-400 flex-shrink-0" size={24} />
            <span className="break-words">Профиль идеального клиента</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {idealClient.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 md:p-6 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
                  <div className="flex items-start gap-3 md:gap-4">
                    <Icon name={item.icon} className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-semibold text-yellow-400 mb-1 break-words">{item.criteria}</h3>
                      <p className="text-sm md:text-base text-slate-300 break-words">{item.value}</p>
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
            <Icon name="Filter" className="text-purple-400 flex-shrink-0" size={24} />
            <span className="break-words">Система квалификации BANT</span>
          </h2>
          <div className="grid gap-4 md:gap-6">
            {bant.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 md:p-6 bg-slate-800/50 border-purple-500/30">
                  <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center font-bold text-white text-xl md:text-2xl flex-shrink-0">
                      {item.letter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 break-words">{item.title}</h3>
                    </div>
                  </div>
                  <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                    {item.questions.map((question, i) => (
                      <div key={i} className="flex items-start gap-2 md:gap-3">
                        <Icon name="HelpCircle" className="text-purple-400 mt-1 flex-shrink-0" size={16} />
                        <span className="text-sm md:text-base text-slate-300 break-words min-w-0">{question}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-purple-900/20 p-3 md:p-4 rounded-lg border border-purple-700/50">
                    <p className="text-xs md:text-sm text-purple-300 break-words"><span className="font-semibold">Оценка:</span> {item.score}</p>
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
            <Icon name="BookOpen" className="text-cyan-400 flex-shrink-0" size={24} />
            <span className="break-words">Реальные кейсы</span>
          </h2>
          <div className="grid gap-4 md:gap-6">
            {cases.map((caseItem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-4 md:p-6 bg-gradient-to-br ${caseItem.color} bg-opacity-10 border-2`}>
                  <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700 flex-shrink-0">
                      <Icon name={caseItem.icon} className="text-cyan-400" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 break-words">{caseItem.title}</h3>
                    </div>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <h4 className="text-sm md:text-base font-semibold text-slate-400 mb-2 break-words">Ситуация:</h4>
                      <p className="text-sm md:text-base text-slate-300 break-words">{caseItem.situation}</p>
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-semibold text-slate-400 mb-2 break-words">Действия:</h4>
                      <div className="space-y-2">
                        {caseItem.actions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2 md:gap-3">
                            <Icon name="ArrowRight" className="text-blue-400 mt-1 flex-shrink-0" size={14} />
                            <span className="text-sm md:text-base text-slate-300 break-words min-w-0">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-green-900/20 p-3 md:p-4 rounded-lg border border-green-700/50">
                      <h4 className="text-sm md:text-base font-semibold text-green-400 mb-1 break-words">Результат:</h4>
                      <p className="text-sm md:text-base text-green-300 mb-2 break-words">{caseItem.result}</p>
                      <p className="text-xs md:text-sm text-green-400 font-semibold break-words">{caseItem.metrics}</p>
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
            <Icon name="AlertTriangle" className="text-red-400 flex-shrink-0" size={24} />
            <span className="break-words">5 главных ошибок</span>
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
            className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 shadow-2xl shadow-violet-500/20 text-base md:text-lg px-6 md:px-8 py-4 md:py-6"
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
                      className="bg-gradient-to-r from-violet-500 to-cyan-600 h-2 rounded-full transition-all duration-300"
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
                            : 'border-slate-600 hover:border-violet-500 bg-slate-800/50'
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
                    <div className="text-4xl md:text-6xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-violet-400 to-cyan-600 bg-clip-text text-transparent">
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
                      className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500"
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