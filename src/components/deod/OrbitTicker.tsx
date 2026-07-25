import Icon from '@/components/ui/icon';

const newsItems = [
  { icon: 'Rocket', text: 'DEAD SPACE: сгенерировано 12 новых дорожных карт за сутки' },
  { icon: 'Users', text: 'Галактический реестр: +8 новых контактов на орбите' },
  { icon: 'Handshake', text: 'Альянс: заключено 3 партнёрских соглашения' },
  { icon: 'Wallet', text: 'Казначейство Федерации: баланс вырос на 4.2%' },
  { icon: 'AlertTriangle', text: 'Красное смещение: 5 задач вышли за горизонт событий' },
  { icon: 'Radio', text: 'Межзвездная связь: 14 активных каналов, экипаж на связи' },
  { icon: 'TrendingUp', text: 'Орбитальный вещатель: охват кампаний +18% за неделю' },
  { icon: 'Satellite', text: 'Все системы станции функционируют в штатном режиме' },
];

const OrbitTicker = () => {
  const doubled = [...newsItems, ...newsItems];

  return (
    <div className="relative overflow-hidden border-y border-[#45A29E]/30 bg-[#0B0C10]/80 backdrop-blur-sm py-2">
      <div className="flex items-center gap-3 px-4 absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-[#0B0C10] via-[#0B0C10] to-transparent pr-8">
        <span className="flex items-center gap-2 text-[#66FCF1] font-heading font-bold text-xs sm:text-sm uppercase tracking-widest whitespace-nowrap">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D4D] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4D4D]" />
          </span>
          Сводка с орбиты
        </span>
      </div>
      <div className="flex whitespace-nowrap animate-marquee pl-[280px]">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-[#C5C6C7] text-xs sm:text-sm mx-6">
            <Icon name={item.icon as any} size={14} className="text-[#45A29E] shrink-0" />
            {item.text}
            <span className="text-[#45A29E]/50 ml-4">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default OrbitTicker;