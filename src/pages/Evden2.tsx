import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Evden2 = () => {
  const goBack = () => {
    window.location.href = '/crm';
  };

  const stats = [
    { label: 'Сделок в работе', value: '128', icon: 'Briefcase', color: 'from-cyan-500 to-blue-500' },
    { label: 'Конверсия', value: '34%', icon: 'TrendingUp', color: 'from-emerald-500 to-teal-500' },
    { label: 'Оборот за месяц', value: '12.4M ₽', icon: 'Wallet', color: 'from-amber-500 to-orange-500' },
    { label: 'Новых клиентов', value: '47', icon: 'Users', color: 'from-violet-500 to-purple-500' },
  ];

  const features = [
    {
      icon: 'Sparkles',
      title: 'ИИ-скоринг сделок',
      desc: 'Автоматическая приоритизация лидов на основе вероятности закрытия',
    },
    {
      icon: 'Workflow',
      title: 'Гибкие воронки продаж',
      desc: 'Настраиваемые этапы под любой бизнес-процесс без ограничений',
    },
    {
      icon: 'BarChart3',
      title: 'Аналитика в реальном времени',
      desc: 'Дашборды с прогнозами выручки и динамикой команды',
    },
    {
      icon: 'MessageSquareText',
      title: 'Единый центр коммуникаций',
      desc: 'Почта, звонки и чаты клиентов в одной карточке сделки',
    },
    {
      icon: 'Zap',
      title: 'Автоматизация рутины',
      desc: 'Триггеры, напоминания и авто-задачи для каждого этапа воронки',
    },
    {
      icon: 'ShieldCheck',
      title: 'Контроль и права доступа',
      desc: 'Гибкая ролевая модель для команд любого размера',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950/20 to-slate-950 text-white">
      <header className="border-b border-amber-500/30 bg-slate-900/80 backdrop-blur-lg sticky top-0 z-40 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.5)]">
              <Icon name="Sparkles" size={18} className="text-slate-900" />
            </div>
            <h1 className="font-semibold text-lg sm:text-xl bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
              EVDEN 2.0
            </h1>
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 hidden sm:inline-flex">
              Демо-версия
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={goBack}
            className="h-8 border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
          >
            <Icon name="ArrowLeft" size={14} className="mr-1" />
            Назад в CRM
          </Button>
        </div>
      </header>

      <section className="px-4 py-10 sm:py-16 text-center max-w-3xl mx-auto">
        <Badge className="mb-4 bg-amber-500/10 text-amber-300 border-amber-500/30">
          Новое поколение CRM
        </Badge>
        <h2 className="text-3xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
          Добро пожаловать в EVDEN 2.0
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Это демонстрационная витрина новой CRM-системы. Здесь можно посмотреть,
          какими будут ключевые модули и интерфейс — без изменения текущей рабочей CRM.
        </p>
      </section>

      <section className="px-4 pb-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="bg-slate-900/60 border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.05)]">
              <CardContent className="p-4">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-2`}>
                  <Icon name={s.icon as any} size={18} className="text-white" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 py-8 max-w-5xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 text-amber-300">Что нового</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <Card key={f.title} className="bg-slate-900/60 border-amber-500/20 hover:border-amber-500/40 transition-colors">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-2">
                  <Icon name={f.icon as any} size={20} className="text-amber-400" />
                </div>
                <CardTitle className="text-base text-white">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 py-10 text-center">
        <p className="text-slate-500 text-xs mb-3">Это демо-заглушка, реальный функционал в разработке</p>
        <Button
          onClick={goBack}
          className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-500 text-slate-900 font-bold"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Вернуться в текущую CRM
        </Button>
      </section>
    </div>
  );
};

export default Evden2;
