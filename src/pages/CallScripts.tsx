import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

interface Script {
  id: number;
  title: string;
  stage: string;
  goal: string;
  duration: string;
  script: string[];
  tips: string[];
  objections: { objection: string; response: string }[];
  icon: string;
  color: string;
}

const scripts: Script[] = [
  {
    id: 1,
    title: 'Холодный звонок застройщику',
    stage: 'Первый контакт',
    goal: 'Договориться о встрече',
    duration: '3-5 минут',
    script: [
      'Добрый день! Меня зовут [Имя], компания [Название]. Я правильно понимаю, что вы планируете строительство ЖК на [адрес/район]?',
      '[Ждём подтверждения] Отлично! Мы специализируемся на проектировании жилых комплексов. Недавно завершили проект на 20 тыс. м² с экономией бюджета заказчика на 15%.',
      'Скажите, у вас уже есть проектировщик или вы сейчас в процессе выбора?',
      '[Если ещё выбирают] Предлагаю встретиться на 30 минут — покажу наш кейс аналогичного объекта и расскажу, как мы можем оптимизировать ваш проект. Вам удобно в четверг в 14:00 или в пятницу в 11:00?',
      '[Фиксируем встречу] Отлично! Скиньте, пожалуйста, краткую информацию о проекте на почту — подготовлюсь к встрече. До встречи!'
    ],
    tips: [
      'Говорите уверенно, но не навязчиво',
      'Упоминайте конкретные цифры (площадь, экономия)',
      'Задавайте открытые вопросы',
      'Предлагайте 2 варианта времени встречи (иллюзия выбора)',
      'Записывайте все детали сразу в CRM'
    ],
    objections: [
      { objection: 'У нас уже есть проектировщик', response: 'Понимаю! А как давно вы с ними работаете? Бывает полезно получить альтернативное мнение — мы можем провести бесплатный аудит вашего проекта и найти точки оптимизации. Это займёт 30 минут.' },
      { objection: 'Мы пока не готовы обсуждать', response: 'Хорошо, скажите, когда планируете запускать проектирование? [Записываем дату] Отлично, свяжусь с вами за 2 недели до этого срока. Можно отправить вам наш кейс на почту, чтобы вы заранее изучили?' },
      { objection: 'Отправьте коммерческое предложение', response: 'Конечно, отправлю! Но чтобы КП было максимально точным, мне нужно уточнить несколько деталей: площадь объекта, этажность, есть ли особые требования? Это займёт 5 минут.' },
      { objection: 'Нам это не интересно', response: 'Понял. Скажите, это не актуально сейчас или вообще не рассматриваете аутсорс проектирования? [Если не актуально сейчас] Когда планируете вернуться к этому вопросу?' }
    ],
    icon: 'Phone',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 2,
    title: 'Холодный звонок производству',
    stage: 'Первый контакт',
    goal: 'Выйти на ЛПР (главного инженера)',
    duration: '3-5 минут',
    script: [
      'Добрый день! Меня зовут [Имя], компания [Название]. Мы проектируем производственные объекты. Я прочитал, что вы планируете модернизацию цеха. С кем можно обсудить вопросы проектирования?',
      '[Переключают на главного инженера] Добрый день, [Имя]! Я по поводу проектирования вашего нового цеха. Мы специализируемся на промышленных объектах — недавно сдали цех для [название компании] с оптимизацией технологических процессов.',
      'Скажите, у вас уже утверждена концепция проекта или сейчас на этапе выбора подрядчика?',
      '[Если выбирают] Предлагаю встретиться — покажу решения для вашей отрасли. Вам удобно на этой неделе?',
      '[Фиксируем] Отлично! До встречи в [день/время]. Отправлю вам кейс на почту.'
    ],
    tips: [
      'Сразу спрашивайте, кто принимает решения',
      'Упоминайте отраслевой опыт',
      'Говорите про оптимизацию, а не просто проектирование',
      'Уточняйте стадию проекта (концепция, РД, рабочка)',
      'Будьте готовы к техническим вопросам'
    ],
    objections: [
      { objection: 'У нас своё проектное бюро', response: 'Отлично! А они справляются с текущей нагрузкой? Мы часто работаем как дополнительная команда для пиковых периодов.' },
      { objection: 'Это не моя зона ответственности', response: 'Понял. Подскажите, с кем лучше обсудить вопросы проектирования? Можете переключить или дать контакт?' },
      { objection: 'Мы работаем только через тендер', response: 'Понимаю. Скажите, когда планируете объявлять тендер? Можно заранее изучить ваши требования, чтобы подготовить сильное предложение?' },
      { objection: 'Слишком дорого', response: 'Я понимаю вашу озабоченность бюджетом. Давайте встретимся — покажу, как мы экономим деньги заказчика на этапе проектирования за счёт BIM-технологий. Это окупается в 3 раза.' }
    ],
    icon: 'Factory',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 3,
    title: 'Встреча с ЛПР (первая)',
    stage: 'Презентация',
    goal: 'Выявить потребности и боли',
    duration: '45-60 минут',
    script: [
      '[Открытие, 5 мин] Спасибо, что нашли время! Я подготовил презентацию на 15 минут, а остальное время предлагаю обсудить ваш проект. Договорились?',
      '[Вопросы, 20 мин] Расскажите, пожалуйста, о вашем проекте: какие цели, какие сроки, что для вас критически важно?',
      '[Уточняющие вопросы] Какие были сложности в прошлых проектах? Что бы хотели избежать сейчас?',
      '[Презентация, 15 мин] Отлично! Исходя из того, что вы рассказали, вот как мы можем помочь: [показываем кейс аналогичного проекта]. Главное отличие — мы используем BIM, что экономит время и деньги.',
      '[Закрытие, 10 мин] Что скажете? Есть вопросы? [Отвечаем на вопросы] Предлагаю следующий шаг: мы подготовим детальное КП с дорожной картой проекта. Вам удобно получить его к [дата]?'
    ],
    tips: [
      'Больше слушайте, чем говорите (70/30)',
      'Задавайте открытые вопросы про боли',
      'Не продавайте на первой встрече — изучайте потребности',
      'Записывайте всё, что говорит клиент',
      'Показывайте кейсы, а не презентацию компании',
      'Всегда договаривайтесь о следующем шаге'
    ],
    objections: [
      { objection: 'Нам нужно подумать', response: 'Конечно! Скажите, что именно вас смущает? Может, я сразу отвечу на вопросы?' },
      { objection: 'У конкурентов дешевле', response: 'Понимаю. Скажите, вы сравниваете по цене или по ценности? Давайте покажу, что входит в нашу стоимость — BIM, сопровождение, гарантии.' },
      { objection: 'Нам нужно согласовать с директором', response: 'Отлично! Когда планируете встречу? Может, я приеду и презентую директору лично? Или подготовлю материалы для вас?' },
      { objection: 'Мы ещё рассматриваем варианты', response: 'Правильно делаете! Сколько компаний вы сейчас рассматриваете? Что для вас главный критерий выбора?' }
    ],
    icon: 'Users',
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 4,
    title: 'Звонок в госкорпорацию',
    stage: 'Первый контакт (B2G)',
    goal: 'Выйти на ЛПР и узнать о планах закупок',
    duration: '5-7 минут',
    script: [
      'Добрый день! Меня зовут [Имя], компания [Название]. Мы специализируемся на проектировании объектов [направление]. Я правильно понимаю, что вы курируете вопросы капитального строительства?',
      '[Ждём подтверждения] Отлично! Мы работаем с такими организациями как [примеры госкомпаний]. Скажите, у вас есть планы закупок на проектирование в этом году?',
      '[Если есть планы] Замечательно! Можете подсказать, где я могу ознакомиться с вашим планом-графиком закупок? Или есть возможность обсудить требования до публикации тендера?',
      '[Уточняем контакты] Подскажите, пожалуйста, с кем ещё лучше связаться по вопросам участия в закупках? Может быть, есть ответственный за формирование технического задания?',
      '[Фиксируем] Спасибо большое! Я изучу ваш план закупок и свяжусь с [ФИО ответственного]. Можно отправить вам нашу презентацию на почту?'
    ],
    tips: [
      'Будьте максимально вежливы и официальны',
      'Упоминайте опыт работы с другими госструктурами',
      'Просите о встрече только после изучения плана закупок',
      'Узнавайте всех ЛПР в цепочке принятия решений',
      'Записывайте даты публикации тендеров',
      'Спрашивайте про возможность COP (предтендерных консультаций)'
    ],
    objections: [
      { objection: 'Всё через тендер, звонить бесполезно', response: 'Понимаю! Я как раз хотел уточнить сроки публикации тендера и технические требования, чтобы подготовить качественное предложение. Это поможет нам сделать конкурентное предложение.' },
      { objection: 'Мы не даём консультаций до тендера', response: 'Конечно, я понимаю все ограничения 44-ФЗ. Я просто хотел уточнить общедоступную информацию из плана-графика. Можете подсказать, на каком ресурсе её лучше смотреть?' },
      { objection: 'Обращайтесь в отдел закупок', response: 'Спасибо! Подскажите, пожалуйста, как лучше с ними связаться — есть общий email или нужно звонить напрямую? И кто у вас курирует техническую часть ТЗ?' },
      { objection: 'У нас долгий цикл согласований', response: 'Я понимаю специфику работы госструктур. Именно поэтому хотел заранее подготовиться. Скажите, когда примерно планируется публикация — во втором квартале?' }
    ],
    icon: 'Building',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 5,
    title: 'Встреча по итогам КП',
    stage: 'Переговоры',
    goal: 'Закрыть сделку или договориться о следующем шаге',
    duration: '30-45 минут',
    script: [
      '[Открытие] Добрый день! Вы изучили наше предложение? Какие есть вопросы?',
      '[Обсуждение] Что понравилось? Что смущает? [Слушаем активно]',
      '[Работа с возражениями] Понимаю ваши опасения. Давайте разберём по пунктам. [Отвечаем на каждое возражение]',
      '[Усиление ценности] Обратите внимание: мы включили сопровождение на всех этапах, BIM-модель, корректировки — это экономит ваше время и деньги.',
      '[Закрытие] Если мы уберём ваши сомнения, мы можем двигаться дальше? Что нужно для принятия решения?',
      '[Следующий шаг] Отлично! Предлагаю подписать договор на этой неделе. Вам удобно в четверг?'
    ],
    tips: [
      'Не защищайтесь — задавайте вопросы',
      'Не скидывайте цену сразу — усиливайте ценность',
      'Уточняйте, кто ещё влияет на решение',
      'Предлагайте варианты (этапность, рассрочка)',
      'Фиксируйте договорённости письменно'
    ],
    objections: [
      { objection: 'Дорого', response: 'Дорого в сравнении с чем? Давайте разберём, что входит в стоимость. [Показываем детализацию] Если убрать какие-то опции, цена снизится, но и качество пострадает.' },
      { objection: 'Долгие сроки', response: 'Я понимаю, что сроки критичны. Скажите, к какой дате вам нужен результат? [Уточняем] Мы можем ускориться, если увеличим команду, но это повлияет на стоимость. Вас устроит?' },
      { objection: 'Мы хотим ещё посмотреть варианты', response: 'Правильно! Скажите, чего не хватает в нашем предложении? Что нужно добавить, чтобы мы были в приоритете?' },
      { objection: 'Нужно согласовать с юристами', response: 'Конечно! Когда планируете согласование? Можем созвониться с вашим юристом и сразу ответить на вопросы — ускорим процесс.' }
    ],
    icon: 'Handshake',
    color: 'from-cyan-500 to-blue-600'
  }
];

const meetingPreparation = [
  { step: 'Изучи клиента', details: 'Сайт, соцсети, новости, проекты, конкуренты', icon: 'Search', color: 'text-cyan-400' },
  { step: 'Подготовь кейсы', details: 'Аналогичные проекты, цифры, результаты', icon: 'BookOpen', color: 'text-purple-400' },
  { step: 'Сформулируй вопросы', details: 'Минимум 10 открытых вопросов про боли', icon: 'HelpCircle', color: 'text-violet-400' },
  { step: 'Подготовь материалы', details: 'Презентация, КП-шаблон, договор', icon: 'FileText', color: 'text-blue-400' },
  { step: 'Настрой CRM', details: 'Создай карточку сделки, добавь контакты', icon: 'Database', color: 'text-cyan-400' },
  { step: 'Выспись и приди раньше', details: 'За 10 минут до встречи — проверь всё', icon: 'Clock', color: 'text-purple-400' }
];

const objectionHandling = [
  {
    category: 'Цена',
    objections: [
      { objection: 'Дорого', technique: 'Вопрос-якорь', response: 'Дорого в сравнении с чем? Давайте разберём, что входит в стоимость.' },
      { objection: 'У конкурентов дешевле', technique: 'Усиление ценности', response: 'Понимаю. Скажите, вы сравниваете цену или ценность? Давайте я покажу, что вы получаете за эти деньги.' },
      { objection: 'Нет бюджета', technique: 'Уточнение', response: 'Понимаю. Скажите, бюджет совсем не утверждён или нужно уложиться в определённую сумму? Может, рассмотрим этапность?' }
    ]
  },
  {
    category: 'Сроки',
    objections: [
      { objection: 'Слишком долго', technique: 'Альтернатива', response: 'Понимаю важность сроков. Можем ускориться на 20%, если увеличим команду. Вас устроит?' },
      { objection: 'Нужно срочно', technique: 'Уточнение дедлайна', response: 'Срочно — это когда? К какой конкретной дате? [Уточняем] Мы можем сделать экспресс-проект, но с ограничениями.' },
      { objection: 'Мы подумаем', technique: 'Вопрос на уточнение', response: 'Конечно! Скажите, что именно вас смущает? Цена, сроки, условия? Давайте обсудим.' }
    ]
  },
  {
    category: 'Доверие',
    objections: [
      { objection: 'Мы вас не знаем', technique: 'Социальное доказательство', response: 'Понимаю! Вот список наших клиентов: [показываем]. Могу дать контакты для рекомендаций.' },
      { objection: 'А если не получится?', technique: 'Гарантии', response: 'У нас есть гарантийные обязательства в договоре. Плюс мы страхуем ответственность. Что конкретно вас беспокоит?' },
      { objection: 'Мы работаем только с проверенными', technique: 'Пилотный проект', response: 'Правильный подход! Предлагаю начать с небольшого пилотного проекта — проверите качество.' }
    ]
  },
  {
    category: 'Конкуренты',
    objections: [
      { objection: 'Мы работаем с другими', technique: 'Дополнительная ценность', response: 'Отлично! А они справляются с нагрузкой? Мы можем быть дополнительной командой или дать второе мнение.' },
      { objection: 'У других лучше условия', technique: 'Уточнение', response: 'Интересно! Скажите, какие именно условия лучше? Давайте сравним детально.' },
      { objection: 'Нам посоветовали других', technique: 'Выбор клиента', response: 'Хорошо, что изучаете рынок! Скажите, по каким критериям выбираете? Что для вас важно?' }
    ]
  }
];

const spinMethod = [
  {
    letter: 'S',
    title: 'Situation — Ситуация',
    description: 'Вопросы о текущей ситуации клиента',
    examples: [
      'Расскажите о вашем проекте',
      'Какая у вас сейчас стадия?',
      'С кем работаете сейчас?',
      'Какой у вас опыт в проектировании?'
    ],
    goal: 'Понять контекст',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    letter: 'P',
    title: 'Problem — Проблема',
    description: 'Вопросы о проблемах и болях',
    examples: [
      'Какие сложности возникали в прошлых проектах?',
      'Что вас не устраивает в текущем подрядчике?',
      'С какими рисками сталкиваетесь?',
      'Что хотели бы улучшить?'
    ],
    goal: 'Выявить боль',
    color: 'from-purple-500 to-violet-600'
  },
  {
    letter: 'I',
    title: 'Implication — Последствия',
    description: 'Вопросы о последствиях проблемы',
    examples: [
      'Как это влияет на сроки проекта?',
      'Сколько денег теряете из-за этого?',
      'Что будет, если не решить эту проблему?',
      'Как это отражается на репутации?'
    ],
    goal: 'Усилить боль',
    color: 'from-violet-500 to-purple-600'
  },
  {
    letter: 'N',
    title: 'Need-Payoff — Выгода',
    description: 'Вопросы о ценности решения',
    examples: [
      'Что изменится, если решить эту проблему?',
      'Сколько сэкономите времени/денег?',
      'Как это поможет достичь целей?',
      'Что для вас будет идеальным решением?'
    ],
    goal: 'Показать ценность',
    color: 'from-cyan-500 to-blue-600'
  }
];

const powerPhrases = [
  { context: 'Открытие звонка', phrase: 'Я правильно понимаю, что...?', why: 'Показывает, что вы изучили клиента' },
  { context: 'Выявление боли', phrase: 'Расскажите подробнее...', why: 'Открытый вопрос — клиент раскрывается' },
  { context: 'Усиление боли', phrase: 'Что будет, если не решить?', why: 'Клиент сам осознаёт критичность' },
  { context: 'Работа с возражением', phrase: 'Я понимаю... И именно поэтому...', why: 'Согласие + аргумент' },
  { context: 'Закрытие сделки', phrase: 'Если мы решим этот вопрос, мы можем двигаться дальше?', why: 'Условное согласие' },
  { context: 'Следующий шаг', phrase: 'Предлагаю следующее: вам удобно в [день] или [день]?', why: 'Иллюзия выбора' },
  { context: 'Отказ', phrase: 'Понял. Когда планируете вернуться к этому вопросу?', why: 'Не сжигаем мосты' },
  { context: 'Переключение на ЛПР', phrase: 'С кем лучше обсудить вопросы проектирования?', why: 'Прямой вопрос без обид' }
];

const testQuestions = [
  {
    question: 'Какая главная цель холодного звонка?',
    options: ['Продать услугу', 'Договориться о встрече', 'Отправить КП', 'Рассказать о компании'],
    correctAnswer: 1,
    explanation: 'Цель холодного звонка — договориться о встрече, а не продавать. Продажа происходит на встрече.'
  },
  {
    question: 'Сколько времени должен длиться холодный звонок?',
    options: ['1-2 минуты', '3-5 минут', '10-15 минут', 'Не ограничено'],
    correctAnswer: 1,
    explanation: 'Холодный звонок должен быть коротким — 3-5 минут. Цель: заинтересовать и договориться о встрече.'
  },
  {
    question: 'Что делать, если клиент говорит "Отправьте КП"?',
    options: ['Сразу отправить', 'Отказаться', 'Уточнить детали, потом отправить персонализированное', 'Сказать, что КП нет'],
    correctAnswer: 2,
    explanation: 'Важно уточнить детали проекта, чтобы КП было персонализированным и точным. Шаблонные КП не работают.'
  },
  {
    question: 'Что такое SPIN-метод?',
    options: ['Скрипт звонка', 'Метод выявления потребностей через вопросы', 'Техника закрытия сделки', 'Способ работы с возражениями'],
    correctAnswer: 1,
    explanation: 'SPIN — это метод выявления потребностей через 4 типа вопросов: Situation, Problem, Implication, Need-Payoff.'
  },
  {
    question: 'Какое соотношение "слушать/говорить" на первой встрече?',
    options: ['50/50', '30/70', '70/30', '90/10'],
    correctAnswer: 2,
    explanation: 'На первой встрече важно больше слушать (70%) и меньше говорить (30%). Изучайте потребности клиента.'
  },
  {
    question: 'Как отвечать на возражение "Дорого"?',
    options: ['Снизить цену', 'Игнорировать', 'Спросить "Дорого в сравнении с чем?"', 'Согласиться'],
    correctAnswer: 2,
    explanation: 'Вопрос-якорь "Дорого в сравнении с чем?" помогает понять критерии клиента и усилить ценность.'
  },
  {
    question: 'Что делать, если клиент говорит "Мы подумаем"?',
    options: ['Согласиться и уйти', 'Давить на клиента', 'Спросить "Что именно смущает?"', 'Снизить цену'],
    correctAnswer: 2,
    explanation: 'Уточняющий вопрос помогает выявить истинное возражение и отработать его.'
  },
  {
    question: 'Когда нужно предлагать скидку?',
    options: ['В самом начале', 'После усиления ценности', 'Никогда', 'По просьбе клиента'],
    correctAnswer: 1,
    explanation: 'Скидку предлагают только после усиления ценности, когда клиент понимает выгоду, но есть барьер по цене.'
  },
  {
    question: 'Что важнее всего на первой встрече?',
    options: ['Продать', 'Выявить боли и потребности', 'Показать презентацию', 'Рассказать о компании'],
    correctAnswer: 1,
    explanation: 'На первой встрече главное — выявить боли и потребности клиента. Продажа — на второй встрече.'
  },
  {
    question: 'Как правильно предложить встречу?',
    options: ['Когда вам удобно?', 'Давайте встретимся', 'Вам удобно в четверг или пятницу?', 'Я позвоню позже'],
    correctAnswer: 2,
    explanation: 'Иллюзия выбора — предлагайте 2 конкретных варианта. Клиент выбирает, а не отказывается.'
  },
  {
    question: 'Что делать после встречи?',
    options: ['Ждать звонка клиента', 'Забыть', 'Отправить благодарность и следующий шаг в течение 24 часов', 'Позвонить через неделю'],
    correctAnswer: 2,
    explanation: 'Follow-up в течение 24 часов — отправьте благодарность, резюме встречи и следующий шаг.'
  },
  {
    question: 'Какая техника работы с возражением "У нас уже есть подрядчик"?',
    options: ['Критиковать конкурента', 'Согласиться и уйти', 'Предложить дополнительную ценность или аудит', 'Снизить цену'],
    correctAnswer: 2,
    explanation: 'Не критикуйте конкурента. Предложите дополнительную ценность: аудит, второе мнение, работа на пиковые периоды.'
  },
  {
    question: 'Что такое "якорь" в переговорах?',
    options: ['Первая названная цена', 'Скидка', 'Возражение', 'Кейс'],
    correctAnswer: 0,
    explanation: 'Якорь — это первая названная цифра в переговорах. Она задаёт рамки обсуждения.'
  },
  {
    question: 'Как подготовиться к встрече с клиентом?',
    options: ['Не готовиться', 'Сделать презентацию', 'Изучить клиента, подготовить кейсы, вопросы, материалы', 'Выучить скрипт'],
    correctAnswer: 2,
    explanation: 'Подготовка к встрече включает: изучение клиента, кейсы, вопросы (минимум 10), материалы, настройку CRM.'
  },
  {
    question: 'Что такое Need-Payoff вопросы?',
    options: ['Вопросы о ситуации', 'Вопросы о проблеме', 'Вопросы о выгоде решения', 'Вопросы о цене'],
    correctAnswer: 2,
    explanation: 'Need-Payoff вопросы — это вопросы о ценности и выгоде решения для клиента. Они завершают SPIN-метод.'
  },
  {
    question: 'Когда лучше говорить о цене?',
    options: ['В начале звонка', 'После выявления ценности', 'В конце встречи', 'Никогда'],
    correctAnswer: 1,
    explanation: 'О цене говорят после того, как клиент понял ценность решения. Иначе цена кажется дорогой.'
  },
  {
    question: 'Что делать, если клиент просит скидку?',
    options: ['Сразу дать', 'Отказать', 'Спросить "В обмен на что?" и предложить условия', 'Уйти'],
    correctAnswer: 2,
    explanation: 'Скидка должна быть обоснованной. Спросите "В обмен на что?" — предоплата, объём, сроки, рекомендация.'
  },
  {
    question: 'Как закрывать встречу?',
    options: ['Сказать "До свидания"', 'Ждать инициативы клиента', 'Договориться о следующем конкретном шаге', 'Отправить КП'],
    correctAnswer: 2,
    explanation: 'Всегда закрывайте встречу конкретным следующим шагом: дата, время, действие.'
  },
  {
    question: 'Что такое "открытый вопрос"?',
    options: ['Вопрос с вариантами ответа', 'Вопрос, требующий развёрнутого ответа', 'Вопрос о цене', 'Вопрос о сроках'],
    correctAnswer: 1,
    explanation: 'Открытый вопрос требует развёрнутого ответа (начинается с "Как?", "Что?", "Почему?", "Расскажите...").'
  },
  {
    question: 'Главная ошибка на встрече?',
    options: ['Много слушать', 'Говорить только о себе и компании', 'Задавать вопросы', 'Показывать кейсы'],
    correctAnswer: 1,
    explanation: 'Главная ошибка — говорить только о себе и компании. Клиенту важны его боли и решения, а не ваша презентация.'
  },
  {
    question: 'Как работать с возражением "Нет бюджета"?',
    options: ['Уйти', 'Снизить цену', 'Уточнить: бюджет не утверждён или нужно уложиться в сумму?', 'Настаивать'],
    correctAnswer: 2,
    explanation: 'Уточните реальную ситуацию: бюджет совсем не утверждён или нужно уложиться в сумму? Предложите этапность.'
  },
  {
    question: 'Что важнее: цена или ценность?',
    options: ['Цена', 'Ценность', 'Оба равны', 'Зависит от клиента'],
    correctAnswer: 1,
    explanation: 'Ценность всегда важнее цены. Если клиент видит ценность, он готов платить. Ваша задача — показать ценность.'
  },
  {
    question: 'Как правильно начать холодный звонок?',
    options: ['Представиться и спросить о проекте', 'Сразу продавать', 'Рассказать о компании', 'Извиниться за беспокойство'],
    correctAnswer: 0,
    explanation: 'Начните с представления и демонстрации знания о клиенте: "Я правильно понимаю, что вы планируете...?"'
  },
  {
    question: 'Что такое Follow-up?',
    options: ['Повторный звонок', 'Встреча', 'Последующие действия после встречи/звонка', 'Скидка'],
    correctAnswer: 2,
    explanation: 'Follow-up — это последующие действия: благодарность, резюме, отправка материалов, следующий шаг в течение 24 часов.'
  },
  {
    question: 'Как выйти на ЛПР по телефону?',
    options: ['Требовать переключения', 'Спросить вежливо "С кем обсудить вопросы проектирования?"', 'Рассказать всё секретарю', 'Повесить трубку'],
    correctAnswer: 1,
    explanation: 'Вежливо спросите: "С кем лучше обсудить вопросы проектирования?" — вас переключат или дадут контакт.'
  },
  {
    question: 'Почему важно записывать встречи в CRM?',
    options: ['Для отчётности', 'Чтобы не забыть детали и следующие шаги', 'Не обязательно', 'Для красоты'],
    correctAnswer: 1,
    explanation: 'CRM помогает не забыть детали, боли, договорённости и следующие шаги. Без записи теряется 80% информации.'
  }
];

export default function CallScripts() {
  const [selectedScript, setSelectedScript] = useState<number | null>(null);
  const [selectedObjection, setSelectedObjection] = useState<string | null>(null);
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const correctCount = selectedAnswers.filter((answer, index) => 
    answer === testQuestions[index].correctAnswer
  ).length;

  const isPassed = correctCount >= 20;

  useEffect(() => {
    const savedResults = localStorage.getItem('callScriptsTestResults');
    if (savedResults) {
      const { passed } = JSON.parse(savedResults);
      if (!passed && !showTest) {
        setShowTest(true);
      }
    }
  }, [showTest]);

  useEffect(() => {
    if (showResults) {
      localStorage.setItem('callScriptsTestResults', JSON.stringify({
        passed: isPassed,
        score: correctCount,
        total: testQuestions.length,
        timestamp: Date.now()
      }));
    }
  }, [showResults, isPassed, correctCount]);

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

      {!isPassed && showResults && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-red-600/90 backdrop-blur-xl border-b border-red-500/50 py-3">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white font-bold flex items-center justify-center gap-2">
              <Icon name="AlertCircle" size={20} />
              БЛОК НЕ СДАН! Пройдите тест заново (нужно минимум 20/25 правильных ответов)
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pt-24 md:pt-28 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-violet-400 via-purple-500 to-cyan-600 bg-clip-text text-transparent">
            Скрипты звонков и встреч
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto">
            Практические шаблоны разговоров, работа с возражениями, техники продаж
          </p>
        </motion.div>

        {showTest ? (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700/50 p-6 md:p-8">
              {!showResults ? (
                <>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-slate-400">Вопрос {currentQuestion + 1} из {testQuestions.length}</span>
                      <span className="text-sm text-slate-400">{Math.round(((currentQuestion + 1) / testQuestions.length) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / testQuestions.length) * 100}%` }}
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
                      />
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
                    {testQuestions[currentQuestion].question}
                  </h3>

                  <div className="space-y-3">
                    {testQuestions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(index)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedAnswers[currentQuestion] === index
                            ? index === testQuestions[currentQuestion].correctAnswer
                              ? 'border-green-500 bg-green-500/20'
                              : 'border-red-500 bg-red-500/20'
                            : 'border-slate-600 bg-slate-700/30 hover:border-violet-500'
                        }`}
                        disabled={selectedAnswers[currentQuestion] !== undefined}
                      >
                        <span className="text-white">{option}</span>
                      </motion.button>
                    ))}
                  </div>

                  {selectedAnswers[currentQuestion] !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6"
                    >
                      <div className={`p-4 rounded-lg mb-4 ${
                        selectedAnswers[currentQuestion] === testQuestions[currentQuestion].correctAnswer
                          ? 'bg-green-500/20 border border-green-500/50'
                          : 'bg-red-500/20 border border-red-500/50'
                      }`}>
                        <p className="text-white text-sm">
                          {testQuestions[currentQuestion].explanation}
                        </p>
                      </div>
                      <Button
                        onClick={handleNextQuestion}
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                        size="lg"
                      >
                        {currentQuestion < testQuestions.length - 1 ? (
                          <>
                            Следующий вопрос
                            <Icon name="ArrowRight" className="ml-2" size={20} />
                          </>
                        ) : (
                          <>
                            Показать результаты
                            <Icon name="CheckCircle" className="ml-2" size={20} />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      isPassed ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}
                  >
                    <Icon 
                      name={isPassed ? "CheckCircle" : "XCircle"} 
                      size={48} 
                      className={isPassed ? 'text-green-400' : 'text-red-400'} 
                    />
                  </motion.div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {isPassed ? 'Поздравляем! 🎉' : 'Тест не сдан 😔'}
                  </h3>

                  <p className="text-xl text-slate-300 mb-6">
                    Правильных ответов: {correctCount} из {testQuestions.length}
                  </p>

                  <div className="space-y-3">
                    <Button
                      onClick={resetTest}
                      className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500"
                      size="lg"
                    >
                      <Icon name="RotateCcw" className="mr-2" size={20} />
                      Пройти тест заново
                    </Button>
                    {isPassed && (
                      <Button
                        onClick={() => setShowTest(false)}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500"
                        size="lg"
                      >
                        <Icon name="BookOpen" className="mr-2" size={20} />
                        Вернуться к обучению
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {scripts.map((script) => (
                <motion.div
                  key={script.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: script.id * 0.1 }}
                >
                  <Card className="bg-slate-800/50 border-slate-700/50 hover:border-violet-500/50 transition-all cursor-pointer h-full"
                    onClick={() => setSelectedScript(selectedScript === script.id ? null : script.id)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${script.color} rounded-t-lg`} />
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${script.color}`}>
                          <Icon name={script.icon} size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{script.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300">
                              {script.stage}
                            </span>
                            <span className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300">
                              {script.duration}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400">
                            <span className="font-semibold text-violet-400">Цель:</span> {script.goal}
                          </p>
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedScript === script.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6"
                          >
                            <div>
                              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <Icon name="MessageSquare" size={20} className="text-cyan-400" />
                                Скрипт разговора
                              </h4>
                              <div className="space-y-3">
                                {script.script.map((line, index) => (
                                  <div key={index} className="flex gap-3">
                                    <span className="text-violet-400 font-bold">{index + 1}.</span>
                                    <p className="text-slate-300 flex-1">{line}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <Icon name="Lightbulb" size={20} className="text-yellow-400" />
                                Важные советы
                              </h4>
                              <ul className="space-y-2">
                                {script.tips.map((tip, index) => (
                                  <li key={index} className="flex items-start gap-2 text-slate-300">
                                    <Icon name="Check" size={16} className="text-green-400 mt-1 flex-shrink-0" />
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <Icon name="Shield" size={20} className="text-red-400" />
                                Возражения и ответы
                              </h4>
                              <div className="space-y-3">
                                {script.objections.map((obj, index) => (
                                  <div key={index} className="bg-slate-700/30 rounded-lg p-4">
                                    <p className="text-red-400 font-semibold mb-2">❌ {obj.objection}</p>
                                    <p className="text-green-400">✅ {obj.response}</p>
                                  </div>
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

            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                Подготовка к встрече
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meetingPreparation.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-800/50 border-slate-700/50 p-4 h-full">
                      <div className="flex items-start gap-3">
                        <Icon name={step.icon} size={24} className={step.color} />
                        <div>
                          <h3 className="text-white font-semibold mb-1">{step.step}</h3>
                          <p className="text-sm text-slate-400">{step.details}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                SPIN: Метод выявления потребностей
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {spinMethod.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-800/50 border-slate-700/50 h-full">
                      <div className={`h-2 bg-gradient-to-r ${item.color} rounded-t-lg`} />
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                            <span className="text-2xl font-bold text-white">{item.letter}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{item.title}</h3>
                            <p className="text-sm text-slate-400">{item.goal}</p>
                          </div>
                        </div>
                        <p className="text-slate-300 mb-4">{item.description}</p>
                        <div className="space-y-2">
                          {item.examples.map((example, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <Icon name="MessageCircle" size={16} className="text-violet-400 mt-1 flex-shrink-0" />
                              <p className="text-sm text-slate-300">{example}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                Работа с возражениями
              </h2>
              <div className="space-y-6">
                {objectionHandling.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-slate-800/50 border-slate-700/50">
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Icon name="AlertCircle" size={24} className="text-red-400" />
                          {category.category}
                        </h3>
                        <div className="space-y-4">
                          {category.objections.map((obj, i) => (
                            <div
                              key={i}
                              className="bg-slate-700/30 rounded-lg p-4 cursor-pointer hover:bg-slate-700/50 transition-all"
                              onClick={() => setSelectedObjection(selectedObjection === `${index}-${i}` ? null : `${index}-${i}`)}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <p className="text-red-400 font-semibold mb-1">❌ "{obj.objection}"</p>
                                  <p className="text-xs text-slate-400 mb-2">Техника: {obj.technique}</p>
                                  <AnimatePresence>
                                    {selectedObjection === `${index}-${i}` && (
                                      <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-green-400 mt-2"
                                      >
                                        ✅ {obj.response}
                                      </motion.p>
                                    )}
                                  </AnimatePresence>
                                </div>
                                <Icon 
                                  name={selectedObjection === `${index}-${i}` ? "ChevronUp" : "ChevronDown"} 
                                  size={20} 
                                  className="text-slate-400" 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
                Сильные фразы для продаж
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {powerPhrases.map((phrase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-slate-800/50 border-slate-700/50 p-4">
                      <div className="flex items-start gap-3">
                        <Icon name="Quote" size={20} className="text-violet-400 flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-xs text-slate-400 mb-1">{phrase.context}</p>
                          <p className="text-white font-semibold mb-2">"{phrase.phrase}"</p>
                          <p className="text-sm text-green-400">{phrase.why}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={() => setShowTest(true)}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-xl text-lg px-8 py-6"
                size="lg"
              >
                <Icon name="ClipboardCheck" className="mr-2" size={24} />
                Пройти итоговый тест (25 вопросов)
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}