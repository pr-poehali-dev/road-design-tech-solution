import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ProposalOverviewAndMetricsProps {
  isOverviewVisible: boolean;
  isStatsVisible: boolean;
}

const ProposalOverviewAndMetrics = ({ isOverviewVisible, isStatsVisible }: ProposalOverviewAndMetricsProps) => {
  return (
    <>
      {/* Обзор проекта */}
      <div 
        id="overview" 
        data-animate 
        className={`mb-12 transition-all duration-1000 delay-100 ${isOverviewVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <Card className="p-6 md:p-8 bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Icon name="Building2" size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Объект проектирования</h2>
              <p className="text-gray-600">Торговый центр | Новое строительство</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Icon name="Ruler" size={20} className="text-blue-600" />
                Технические характеристики
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Общая площадь здания', value: 'до 1500 м²' },
                  { label: 'Строительный объём', value: '~15 000 м³' },
                  { label: 'Площадь земельного участка', value: 'до 1 га (10 000 м²)' },
                  { label: 'Высота здания', value: '10 метров' },
                  { label: 'Количество этажей', value: '2 этажа' },
                  { label: 'Парковка', value: '~20 машиномест' },
                  { label: 'Категория здания', value: 'Общественное (торговля)' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-white/60 hover:bg-white transition-colors">
                    <span className="text-gray-600 text-sm md:text-base">{item.label}:</span>
                    <span className="font-semibold text-gray-800 text-sm md:text-base">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Icon name="CheckCircle2" size={20} className="text-cyan-600" />
                Состав работ
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Проектная документация (ПД)', desc: 'Стадия "П" - 60% от стоимости' },
                  { name: 'Рабочая документация (РД)', desc: 'Стадия "Д" - 40% от стоимости' },
                  { name: 'Инженерные изыскания', desc: 'Геодезия + геология + экология' },
                  { name: 'Проект благоустройства', desc: 'Дорожки, озеленение, МАФ, парковка' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-cyan-50 hover:from-emerald-100 hover:to-cyan-100 transition-colors">
                    <Icon name="Check" size={20} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-800 text-sm md:text-base">{item.name}</div>
                      <div className="text-xs md:text-sm text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Ключевые показатели */}
      <div 
        id="stats" 
        data-animate 
        className={`grid md:grid-cols-3 gap-4 md:gap-6 mb-12 transition-all duration-1000 delay-200 ${isStatsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <Card className="p-6 bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl hover:scale-105 transition-transform">
          <Icon name="Clock" size={40} className="mb-4" />
          <div className="text-4xl md:text-5xl font-bold mb-2">30 недель</div>
          <div className="text-cyan-100">Срок реализации проекта</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-xl hover:scale-105 transition-transform">
          <Icon name="FileCheck" size={40} className="mb-4" />
          <div className="text-4xl md:text-5xl font-bold mb-2">4 этапа</div>
          <div className="text-emerald-100">Структурированная работа</div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl hover:scale-105 transition-transform">
          <Icon name="Shield" size={40} className="mb-4" />
          <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
          <div className="text-purple-100">Соответствие ГОСТ и СНиП</div>
        </Card>
      </div>
    </>
  );
};

export default ProposalOverviewAndMetrics;
