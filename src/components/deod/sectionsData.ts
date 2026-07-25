export interface SectionMetric {
  label: string;
  value: string;
}

export interface DeodSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  route: string;
  metrics: SectionMetric[];
  accent: 'teal' | 'orange';
  featured?: boolean;
}

export const sections: DeodSection[] = [
  {
    id: 'crm',
    title: 'Галактический реестр',
    subtitle: 'База контактов и сделок',
    icon: 'Users',
    route: '/crm',
    accent: 'teal',
    metrics: [
      { label: 'Контактов', value: '1 248' },
      { label: 'Новых за день', value: '+8' },
      { label: 'Активных сделок', value: '37' },
    ],
  },
  {
    id: 'deadspace',
    title: 'DEAD SPACE',
    subtitle: 'Генерация проектов, КП и дорожных карт',
    icon: 'Rocket',
    route: '/kp',
    accent: 'orange',
    featured: true,
    metrics: [
      { label: 'Активных проектов', value: '24' },
      { label: 'Этапов', value: '156' },
      { label: 'Прогресс', value: '72%' },
    ],
  },
  {
    id: 'partners',
    title: 'Альянс',
    subtitle: 'Партнёрская экосистема',
    icon: 'Handshake',
    route: '/partner',
    accent: 'teal',
    metrics: [
      { label: 'Партнёров', value: '86' },
      { label: 'Новых заявок', value: '5' },
      { label: 'Интеграций', value: '92%' },
    ],
  },
  {
    id: 'finance',
    title: 'Казначейство Федерации',
    subtitle: 'Финансы и бухгалтерия',
    icon: 'Landmark',
    route: '/crm',
    accent: 'teal',
    metrics: [
      { label: 'Баланс', value: '14.2M ₽' },
      { label: 'Доход/мес', value: '+3.1M' },
      { label: 'Динамика', value: '+4.2%' },
    ],
  },
  {
    id: 'projects',
    title: 'Инженерный отсек',
    subtitle: 'Работа исполнителей',
    icon: 'Wrench',
    route: '/crm',
    accent: 'teal',
    metrics: [
      { label: 'Задач в работе', value: '43' },
      { label: 'Завершено/нед', value: '28' },
      { label: 'Загрузка', value: '81%' },
    ],
  },
  {
    id: 'evden',
    title: 'Капитанский мостик',
    subtitle: 'Админка создателей',
    icon: 'ShieldCheck',
    route: '/admin',
    accent: 'teal',
    metrics: [
      { label: 'Статус системы', value: 'OK' },
      { label: 'Пользователей', value: '11' },
      { label: 'Событий/день', value: '204' },
    ],
  },
  {
    id: 'comms',
    title: 'Межзвездная связь',
    subtitle: 'Чаты с экипажем',
    icon: 'Radio',
    route: '/chat',
    accent: 'teal',
    metrics: [
      { label: 'Непрочитанных', value: '7' },
      { label: 'Активных каналов', value: '14' },
      { label: 'Онлайн', value: '9' },
    ],
  },
  {
    id: 'marketing',
    title: 'Орбитальный вещатель',
    subtitle: 'Маркетинг и кампании',
    icon: 'Satellite',
    route: '/crm',
    accent: 'teal',
    metrics: [
      { label: 'Конверсия', value: '6.4%' },
      { label: 'Бюджет', value: '420K ₽' },
      { label: 'Охват', value: '1.2M' },
    ],
  },
  {
    id: 'tasks',
    title: 'Бортовой журнал',
    subtitle: 'Личный задачник',
    icon: 'ClipboardList',
    route: '/crm',
    accent: 'teal',
    metrics: [
      { label: 'Личных задач', value: '18' },
      { label: 'Приоритетных', value: '4' },
      { label: 'Дедлайн сегодня', value: '2' },
    ],
  },
  {
    id: 'depository',
    title: 'Голографический депозитарий',
    subtitle: 'Хранилище всех документов',
    icon: 'FolderLock',
    route: '/crm',
    accent: 'teal',
    metrics: [
      { label: 'Документов', value: '3 402' },
      { label: 'Загружено/нед', value: '124' },
      { label: 'Хранилище', value: '68%' },
    ],
  },
];