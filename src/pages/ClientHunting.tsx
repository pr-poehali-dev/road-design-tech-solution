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
    explanation: 'Поиск всех подряд без квалификации тратит время на нецелевых клиентов.'
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-purple-500/20">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link to="/ecosystem" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-500 to-cyan-600 bg-clip-text text-transparent">
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
                      
                      <Link to="/ecosystem/tender-guide" onClick={() => setKnowledgeOpen(false)}>
                        <div className="p-3 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Icon name="FileText" size={20} className="text-blue-400" />
                            <span className="text-white font-medium">Работа с тендерами</span>
                            <Icon name="ExternalLink" size={16} className="text-blue-400 ml-auto" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <Link to="/ecosystem" className="text-xs md:text-sm text-slate-300 hover:text-purple-400 transition">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4">
              <Icon name="Target" size={18} className="text-purple-400" />
              <span className="text-purple-400 text-sm font-semibold">База знаний</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Как искать клиентов
            </h1>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              Полное руководство по поиску идеальных клиентов для инженерных и проектных работ
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Icon name="Users" size={32} className="text-purple-400" />
              Целевая аудитория DEOD
            </h2>
            <div className="grid gap-6">
              {audiences.map((aud, index) => (
                <motion.div
                  key={aud.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card 
                    className="bg-slate-900/50 border-slate-700/50 hover:border-purple-500/50 transition-all cursor-pointer"
                    onClick={() => setSelectedAudience(selectedAudience === aud.id ? null : aud.id)}
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${aud.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                          <Icon name={aud.icon as any} size={28} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-white">{aud.title}</h3>
                            <Icon 
                              name={selectedAudience === aud.id ? "ChevronUp" : "ChevronDown"} 
                              size={24} 
                              className="text-purple-400"
                            />
                          </div>
                          <p className="text-purple-400">{aud.why}</p>
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedAudience === aud.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t border-slate-700/50 space-y-4"
                          >
                            <div>
                              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <Icon name="Search" size={18} className="text-purple-400" />
                                Где искать:
                              </h4>
                              <ul className="space-y-2">
                                {aud.howToFind.map((method, i) => (
                                  <li key={i} className="flex gap-2 text-slate-300">
                                    <Icon name="ArrowRight" size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
                                    {method}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                <Icon name="UserCheck" size={18} className="text-purple-400" />
                                Ключевые контакты:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {aud.keyContacts.map((contact, i) => (
                                  <span key={i} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300">
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
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Icon name="Compass" size={32} className="text-cyan-400" />
              5 источников клиентов
            </h2>
            <div className="space-y-6">
              {sources.map((source, index) => (
                <Card key={index} className="bg-slate-900/50 border-slate-700/50 p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${source.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon name={source.icon as any} size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{source.title}</h3>
                      <p className="text-cyan-400">{source.description}</p>
                    </div>
                  </div>
                  <div className="space-y-3 ml-16">
                    <div>
                      <span className="text-slate-400 text-sm font-semibold">Инструменты:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {source.tools.map((tool, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-slate-300">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm"><strong>Стратегия:</strong> {source.strategy}</p>
                    <p className="text-purple-400 text-sm font-semibold">Конверсия: {source.conversion}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 border-violet-500/50 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Icon name="Crosshair" size={32} className="text-violet-400" />
                Портрет идеального клиента
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {idealClient.map((item, i) => (
                  <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon name={item.icon as any} size={20} className="text-violet-400" />
                      <h4 className="font-semibold text-white">{item.criteria}</h4>
                    </div>
                    <p className="text-slate-300 text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Icon name="Filter" size={32} className="text-blue-400" />
              Система квалификации BANT
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {bant.map((item, i) => (
                <Card key={i} className="bg-slate-900/50 border-slate-700/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xl">
                      {item.letter}
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {item.questions.map((q, j) => (
                      <li key={j} className="flex gap-2 text-slate-300 text-sm">
                        <Icon name="HelpCircle" size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                        {q}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3 border-t border-slate-700">
                    <p className="text-xs text-slate-400">Оценка: {item.score}</p>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="bg-cyan-500/10 border-cyan-500/30 p-4 mt-6">
              <div className="flex items-center gap-3">
                <Icon name="Lightbulb" size={20} className="text-cyan-400" />
                <p className="text-slate-300 text-sm">
                  <strong>Итого BANT:</strong> 16-20 = Горячий лид, 12-15 = Теплый лид, 8-11 = Холодный лид, &lt;8 = Не квалифицирован
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Icon name="BookOpen" size={32} className="text-yellow-400" />
              Практические кейсы
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {cases.map((c, i) => (
                <Card key={i} className="bg-slate-900/50 border-slate-700/50 p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4`}>
                    <Icon name={c.icon as any} size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{c.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{c.situation}</p>
                  <div className="space-y-2 mb-4">
                    {c.actions.map((action, j) => (
                      <div key={j} className="flex gap-2 text-slate-300 text-xs">
                        <Icon name="ArrowRight" size={14} className="text-purple-400 flex-shrink-0 mt-0.5" />
                        {action}
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-slate-700">
                    <p className="text-cyan-400 text-sm font-semibold mb-1">Результат: {c.result}</p>
                    <p className="text-slate-500 text-xs">{c.metrics}</p>
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
            <Card className="bg-gradient-to-br from-red-900/20 to-violet-900/20 border-red-500/50 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Icon name="AlertTriangle" size={32} className="text-red-400" />
                Ошибки при поиске клиентов
              </h2>
              <div className="space-y-4">
                {mistakes.map((m, i) => (
                  <div key={i} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-start gap-3 mb-2">
                      <Icon name="XCircle" size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-1">Ошибка: {m.mistake}</h4>
                        <p className="text-slate-400 text-sm mb-2">{m.why}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 ml-8 pl-3 border-l-2 border-cyan-500/50">
                      <Icon name="CheckCircle2" size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300 text-sm"><strong>Правильно:</strong> {m.correct}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-gradient-to-br from-purple-900/20 to-violet-900/20 border-purple-500/50">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                    <Icon name="GraduationCap" size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white">Тестовое задание</h2>
                    <p className="text-slate-400">Проверьте знание стратегий поиска клиентов</p>
                  </div>
                  {!showTest && (
                    <Button 
                      onClick={() => setShowTest(true)}
                      className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
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
                        <span className="text-purple-400 font-semibold">
                          Вопрос {currentQuestion + 1} из {testQuestions.length}
                        </span>
                        <div className="flex gap-2">
                          {testQuestions.map((_, index) => (
                            <div 
                              key={index}
                              className={`w-2 h-2 rounded-full ${
                                index === currentQuestion ? 'bg-purple-400' : 
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
                              : 'bg-purple-500/10 border-purple-500/30'
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
                          : 'bg-gradient-to-br from-purple-500 to-violet-600'
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
                          ? 'Вы знаете, как находить идеальных клиентов!' 
                          : 'Пересмотрите материал для улучшения навыков поиска.'}
                      </p>
                      
                      <div className="flex gap-4 justify-center">
                        <Button 
                          onClick={resetTest}
                          className="bg-purple-500 hover:bg-purple-600"
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
