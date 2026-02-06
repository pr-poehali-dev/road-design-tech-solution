import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface WorkItem {
  name: string;
  unit: string;
  volume: number;
  price: number;
  total: number;
  description: string;
}

interface DetailedTask {
  id: string;
  task: string;
  start: number;
  duration: number;
  phase: string;
  desc: string;
}

interface ProposalDetailsProps {
  workItemsDetailed: WorkItem[];
  totalCost: number;
  detailedTasks: DetailedTask[];
  isDetailedCostsVisible: boolean;
  isDetailedPlanVisible: boolean;
  isCTAVisible: boolean;
}

export default function ProposalDetails({
  workItemsDetailed,
  totalCost,
  detailedTasks,
  isDetailedCostsVisible,
  isDetailedPlanVisible,
  isCTAVisible,
}: ProposalDetailsProps) {
  return (
    <>
      {/* Детализация работ и стоимости */}
      <div 
        id="detailed-costs" 
        data-animate 
        className={`mb-12 transition-all duration-1000 delay-400 ${isDetailedCostsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <Card className="p-6 md:p-8 bg-gradient-to-br from-white to-cyan-50 border-cyan-200 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Icon name="Receipt" size={28} className="text-cyan-600" />
            Детальная смета
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="border-b-2 border-cyan-300">
                  <th className="text-left py-4 px-2 md:px-4 text-cyan-700 font-bold">Наименование работ</th>
                  <th className="text-center py-4 px-2 md:px-4 text-cyan-700 font-bold hidden md:table-cell">Ед. изм.</th>
                  <th className="text-center py-4 px-2 md:px-4 text-cyan-700 font-bold hidden md:table-cell">Объем</th>
                  <th className="text-right py-4 px-2 md:px-4 text-cyan-700 font-bold hidden md:table-cell">Цена</th>
                  <th className="text-right py-4 px-2 md:px-4 text-cyan-700 font-bold">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {workItemsDetailed.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-cyan-50 transition-colors">
                    <td className="py-4 px-2 md:px-4">
                      <div className="font-semibold text-gray-800">{item.name}</div>
                      <div className="text-xs md:text-sm text-gray-600 mt-1">{item.description}</div>
                      <div className="md:hidden text-xs text-gray-500 mt-1">
                        {item.volume} {item.unit} × {item.price.toLocaleString('ru-RU')} ₽
                      </div>
                    </td>
                    <td className="py-4 px-2 md:px-4 text-center text-gray-600 hidden md:table-cell">{item.unit}</td>
                    <td className="py-4 px-2 md:px-4 text-center text-gray-600 hidden md:table-cell">{item.volume}</td>
                    <td className="py-4 px-2 md:px-4 text-right text-gray-600 hidden md:table-cell">{item.price.toLocaleString('ru-RU')} ₽</td>
                    <td className="py-4 px-2 md:px-4 text-right font-bold text-gray-800">{item.total.toLocaleString('ru-RU')} ₽</td>
                  </tr>
                ))}
                <tr className="bg-gradient-to-r from-cyan-100 to-blue-100 font-bold">
                  <td className="py-5 px-2 md:px-4 text-lg md:text-xl text-gray-800" colSpan={4}>ИТОГО к оплате:</td>
                  <td className="py-5 px-2 md:px-4 text-right text-xl md:text-2xl text-cyan-700">{totalCost.toLocaleString('ru-RU')} ₽</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Icon name="Wallet" size={20} className="text-blue-600" />
                Условия оплаты
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                    30%
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Предоплата</div>
                    <div className="text-sm text-gray-600">{(totalCost * 0.3).toLocaleString('ru-RU')} ₽</div>
                    <div className="text-xs text-gray-500">При подписании договора</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                    30%
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">После сдачи ПД</div>
                    <div className="text-sm text-gray-600">{(totalCost * 0.3).toLocaleString('ru-RU')} ₽</div>
                    <div className="text-xs text-gray-500">При передаче проектной документации</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                    40%
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">При подписании акта</div>
                    <div className="text-sm text-gray-600">{(totalCost * 0.4).toLocaleString('ru-RU')} ₽</div>
                    <div className="text-xs text-gray-500">По сдаче РД и подписании Акта приемки работ</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-300">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Icon name="Gift" size={20} className="text-emerald-600" />
                Что входит в стоимость
              </h3>
              <div className="space-y-2">
                {[
                  'Полный комплект ПД (60%) и РД (40%)',
                  'Все изыскания (геодезия, геология, экология)',
                  'Проект благоустройства территории',
                  'Бесплатные консультации после сдачи',
                  'Корректировки по замечаниям',
                  'Электронная версия проекта',
                  'Гарантия качества и сроков',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm md:text-base">
                    <Icon name="CheckCircle" size={18} className="text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Card>
      </div>

      {/* Детализированный план */}
      <div 
        id="detailed-plan" 
        data-animate 
        className={`mb-12 transition-all duration-1000 delay-600 ${isDetailedPlanVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <Card className="p-6 md:p-8 bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Icon name="ListTree" size={28} className="text-pink-600" />
            Детализированный план работ
          </h2>
          <div className="space-y-6">
            {['Этап 0', 'Этап 1', 'Этап 2', 'Этап 3'].map((phase, phaseIdx) => {
              const phaseTasks = detailedTasks.filter(t => t.phase === phase);
              const phaseDescriptions = [
                { title: 'Предпроектная подготовка', subtitle: 'Недели 1-4', color: 'from-blue-500 to-cyan-500' },
                { title: 'Изыскания и эскизный проект', subtitle: 'Недели 4-14', color: 'from-emerald-500 to-green-500' },
                { title: 'Разработка проектной документации', subtitle: 'Недели 14-18', color: 'from-purple-500 to-pink-500' },
                { title: 'Разработка рабочей документации', subtitle: 'Недели 19-30', color: 'from-indigo-500 to-blue-500' },
              ][phaseIdx];

              return (
                <div key={phase} className="p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
                    <div>
                      <h3 className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${phaseDescriptions.color} bg-clip-text text-transparent`}>
                        {phase}: {phaseDescriptions.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{phaseDescriptions.subtitle}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${phaseDescriptions.color} text-white font-semibold text-sm whitespace-nowrap`}>
                      {phaseTasks.length} задач{phaseTasks.length > 4 ? '' : 'и'}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {phaseTasks.map(task => (
                      <div key={task.id} className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors border border-gray-200">
                        <span className="text-sm font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex-shrink-0">
                          {task.id}
                        </span>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-sm md:text-base">{task.task}</div>
                          <div className="text-xs md:text-sm text-gray-600 mt-1">{task.desc}</div>
                        </div>
                        <div className="flex gap-2 text-xs text-gray-500 flex-shrink-0">
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                            нед. {task.start}-{task.start + task.duration}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
                            {task.duration} нед.
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* CTA */}
      <div 
        id="cta" 
        data-animate 
        className={`transition-all duration-1000 delay-700 ${isCTAVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <Card className="p-8 md:p-12 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white shadow-2xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Готовы начать проект?</h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Свяжитесь с нами для обсуждения деталей и подписания договора. Гарантируем качество и соблюдение сроков!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-6 text-lg shadow-xl">
                <Icon name="Phone" size={20} className="mr-2" />
                +7 (999) 123-45-67
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-6 text-lg">
                <Icon name="Mail" size={20} className="mr-2" />
                info@deod.space
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
