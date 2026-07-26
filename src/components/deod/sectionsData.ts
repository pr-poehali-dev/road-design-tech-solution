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
  special?: 'crew' | 'chat' | 'depository' | 'tasks';
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
    route: '/admin',
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
    route: '/ecosystem',
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
    route: '#chat',
    accent: 'teal',
    special: 'chat',
    metrics: [
      { label: 'Каналов', value: '4' },
      { label: 'Онлайн', value: '—' },
      { label: 'Реальный чат', value: 'БД' },
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
    subtitle: 'Тактическая карта манёвров',
    icon: 'ClipboardList',
    route: '#tasks',
    accent: 'teal',
    special: 'tasks',
    metrics: [
      { label: 'Манёвров', value: 'live' },
      { label: 'ИИ-советник', value: 'да' },
      { label: 'Канбан', value: 'вкл' },
    ],
  },
  {
    id: 'depository',
    title: 'Голографический депозитарий',
    subtitle: 'Хранилище всех документов',
    icon: 'FolderLock',
    route: '#depository',
    accent: 'teal',
    special: 'depository',
    metrics: [
      { label: 'Отделов', value: '8' },
      { label: 'ИИ-поиск', value: 'да' },
      { label: 'Теги', value: 'авто' },
    ],
  },
  {
    id: 'crew',
    title: 'Экипаж',
    subtitle: 'Реестр персонала и ранги',
    icon: 'Users',
    route: '#crew',
    accent: 'teal',
    special: 'crew',
    metrics: [
      { label: 'Профили', value: 'да' },
      { label: 'Ранги', value: '6' },
      { label: 'Регистрация', value: 'вкл' },
    ],
  },
];