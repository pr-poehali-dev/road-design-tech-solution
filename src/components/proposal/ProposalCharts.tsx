import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface BudgetDataItem {
  name: string;
  value: number;
  percentage: number;
}

interface RoadmapDataItem {
  phase: string;
  weeks: number;
}

interface ProposalChartsProps {
  budgetData: BudgetDataItem[];
  roadmapData: RoadmapDataItem[];
  colors: string[];
  totalCost: number;
  isBudgetVisible: boolean;
  isRoadmapVisible: boolean;
}

const ProposalCharts = ({ 
  budgetData, 
  roadmapData, 
  colors, 
  totalCost, 
  isBudgetVisible, 
  isRoadmapVisible 
}: ProposalChartsProps) => {
  return (
    <>
      {/* Структура бюджета */}
      <div 
        id="budget" 
        data-animate 
        className={`mb-12 transition-all duration-1000 delay-300 ${isBudgetVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <Card className="p-6 md:p-8 bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Icon name="PieChart" size={28} className="text-purple-600" />
            Структура бюджета
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.percentage}%`}
                    outerRadius={window.innerWidth < 768 ? 80 : 110}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toLocaleString('ru-RU')} ₽`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {budgetData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: colors[idx] }} />
                    <span className="text-gray-700 font-medium text-sm md:text-base">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-800 text-sm md:text-base">{item.value.toLocaleString('ru-RU')} ₽</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg mt-6">
                <span className="font-bold text-lg md:text-xl">ИТОГО:</span>
                <span className="font-bold text-2xl md:text-3xl">{totalCost.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Дорожная карта */}
      <div 
        id="roadmap" 
        data-animate 
        className={`mb-12 transition-all duration-1000 delay-500 ${isRoadmapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <Card className="p-6 md:p-8 bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Icon name="Calendar" size={28} className="text-orange-600" />
            График выполнения работ
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roadmapData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" label={{ value: 'Недели', position: 'bottom', fill: '#6b7280' }} />
              <YAxis type="category" dataKey="phase" stroke="#6b7280" width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #3b82f6', borderRadius: '8px' }}
                labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                formatter={(value: number) => [`${value} недель`, 'Длительность']}
              />
              <Legend />
              <Bar dataKey="weeks" fill="url(#colorGradient)" name="Длительность (недели)" radius={[0, 8, 8, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </>
  );
};

export default ProposalCharts;
