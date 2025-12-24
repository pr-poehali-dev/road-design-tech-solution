import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface ProjectMetrics {
  totalRevenue: number;
  averageProjectCost: number;
  activeProjects: number;
  completedProjects: number;
  conversionRate: number;
  averageCompletionTime: number;
}

interface UnitEconomics {
  leadCost: number;
  projectCost: number;
  revenue: number;
  profit: number;
  profitMargin: number;
  roi: number;
}

interface PartnerMetrics {
  totalPartners: number;
  activePartners: number;
  averageRating: number;
  totalTasksAssigned: number;
  completedTasks: number;
  averageTaskCost: number;
}

export const Analytics = () => {
  const projectMetrics: ProjectMetrics = {
    totalRevenue: 5420000,
    averageProjectCost: 385000,
    activeProjects: 8,
    completedProjects: 14,
    conversionRate: 68,
    averageCompletionTime: 45,
  };

  const unitEconomics: UnitEconomics = {
    leadCost: 2500,
    projectCost: 85000,
    revenue: 385000,
    profit: 297500,
    profitMargin: 77.3,
    roi: 350,
  };

  const partnerMetrics: PartnerMetrics = {
    totalPartners: 12,
    activePartners: 8,
    averageRating: 4.7,
    totalTasksAssigned: 45,
    completedTasks: 32,
    averageTaskCost: 125000,
  };

  const monthlyData = [
    { month: 'Январь', revenue: 450000, profit: 347000, projects: 3 },
    { month: 'Февраль', revenue: 520000, profit: 402000, projects: 2 },
    { month: 'Март', revenue: 680000, profit: 525000, projects: 4 },
    { month: 'Апрель', revenue: 580000, profit: 448000, projects: 3 },
    { month: 'Май', revenue: 720000, profit: 556000, projects: 5 },
    { month: 'Июнь', revenue: 850000, profit: 657000, projects: 6 },
  ];

  const topSections = [
    { code: 'КР', name: 'Конструктивные решения', count: 14, revenue: 2100000 },
    { code: 'АР', name: 'Архитектурные решения', count: 12, revenue: 2400000 },
    { code: 'ИОС', name: 'Инженерные системы', count: 10, revenue: 1800000 },
    { code: 'ПБ', name: 'Пожарная безопасность', count: 8, revenue: 960000 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Общая выручка</div>
                <div className="text-2xl font-bold">
                  {(projectMetrics.totalRevenue / 1000000).toFixed(1)}М ₽
                </div>
                <div className="text-xs text-green-600 mt-1">+23% к прошлому месяцу</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Icon name="TrendingUp" size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Средний проект
                </div>
                <div className="text-2xl font-bold">
                  {projectMetrics.averageProjectCost.toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {projectMetrics.completedProjects} завершено
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Icon name="DollarSign" size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Конверсия</div>
                <div className="text-2xl font-bold">
                  {projectMetrics.conversionRate}%
                </div>
                <div className="text-xs text-purple-600 mt-1">
                  из {projectMetrics.activeProjects + projectMetrics.completedProjects}{' '}
                  заявок
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Icon name="Target" size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Срок выполнения
                </div>
                <div className="text-2xl font-bold">
                  {projectMetrics.averageCompletionTime} дней
                </div>
                <div className="text-xs text-orange-600 mt-1">в среднем</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Icon name="Clock" size={24} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="PieChart" size={20} />
              Unit-экономика проекта
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="text-sm">Стоимость привлечения лида</div>
                <div className="font-bold">
                  {unitEconomics.leadCost.toLocaleString('ru-RU')} ₽
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="text-sm">Стоимость проекта (себестоимость)</div>
                <div className="font-bold">
                  {unitEconomics.projectCost.toLocaleString('ru-RU')} ₽
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                <div className="text-sm font-medium">Выручка с проекта</div>
                <div className="font-bold text-blue-600">
                  {unitEconomics.revenue.toLocaleString('ru-RU')} ₽
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                <div className="text-sm font-medium">Прибыль</div>
                <div className="font-bold text-green-600">
                  {unitEconomics.profit.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Маржинальность</div>
                <div className="text-lg font-bold text-green-600">
                  {unitEconomics.profitMargin}%
                </div>
              </div>
              <Progress value={unitEconomics.profitMargin} className="h-2" />
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">ROI</div>
                <div className="text-lg font-bold text-blue-600">
                  {unitEconomics.roi}%
                </div>
              </div>
              <Progress value={Math.min(unitEconomics.roi, 100)} className="h-2" />
            </div>

            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start gap-2">
                <Icon name="Lightbulb" size={16} className="text-primary mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium mb-1">Рекомендация:</div>
                  <div className="text-muted-foreground">
                    Для увеличения прибыльности оптимизируйте работу с партнёрами —
                    снижение себестоимости на 10% даст +35К ₽ к каждому проекту
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Users" size={20} />
              Метрики партнёров
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{partnerMetrics.totalPartners}</div>
                <div className="text-sm text-muted-foreground">Всего партнёров</div>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {partnerMetrics.activePartners}
                </div>
                <div className="text-sm text-muted-foreground">Активных</div>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {partnerMetrics.averageRating}
                </div>
                <div className="text-sm text-muted-foreground">Средний рейтинг</div>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {partnerMetrics.completedTasks}
                </div>
                <div className="text-sm text-muted-foreground">Задач выполнено</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">
                Выполнение задач ({partnerMetrics.completedTasks}/
                {partnerMetrics.totalTasksAssigned})
              </div>
              <Progress
                value={
                  (partnerMetrics.completedTasks / partnerMetrics.totalTasksAssigned) *
                  100
                }
              />
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Средняя стоимость задачи
              </div>
              <div className="text-xl font-bold">
                {partnerMetrics.averageTaskCost.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm font-medium mb-3">Экономика партнёрства</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Экономия на штате (8 партнёров)
                  </span>
                  <span className="font-medium">~320К ₽/мес</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Гибкость масштабирования
                  </span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600">
                    Высокая
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Качество работ</span>
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={14} className="text-yellow-500" />
                    <span className="font-medium">{partnerMetrics.averageRating}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="BarChart3" size={20} />
            Динамика по месяцам
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyData.map((data, index) => (
              <div
                key={data.month}
                className="p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{data.month}</div>
                  <Badge>{data.projects} проектов</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">Выручка</div>
                    <div className="font-bold text-blue-600">
                      {data.revenue.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Прибыль</div>
                    <div className="font-bold text-green-600">
                      {data.profit.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                </div>
                <Progress
                  value={(data.profit / data.revenue) * 100}
                  className="mt-2 h-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Award" size={20} />
            Топ разделов по выручке
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topSections.map((section, index) => (
              <div
                key={section.code}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">
                    {section.code} - {section.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {section.count} проектов
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {(section.revenue / 1000000).toFixed(1)}М ₽
                  </div>
                  <div className="text-xs text-muted-foreground">выручка</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
