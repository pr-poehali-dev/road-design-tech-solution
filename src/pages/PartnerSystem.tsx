import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

const PartnerSystem = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState<'main' | 'simulator' | 'knowledge'>('main');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Данные для таблицы грейдов
  const gradeTable = [
    {
      grade: 'Агент',
      turnover: 'до 10 млн',
      personal: '8% (16% первый месяц)',
      line1: '8%',
      line2: '–',
      line3: '–',
      line4: '–',
    },
    {
      grade: 'Партнёр',
      turnover: '10-24 млн',
      personal: '10%',
      line1: '5%',
      line2: '8%',
      line3: '–',
      line4: '–',
    },
    {
      grade: 'Старший партнёр',
      turnover: '25-39 млн',
      personal: '12%',
      line1: '3%',
      line2: '5%',
      line3: '8%',
      line4: '–',
    },
    {
      grade: 'Генеральный партнёр',
      turnover: '40-74 млн',
      personal: '15%',
      line1: '1.5%',
      line2: '3%',
      line3: '5%',
      line4: '8%',
    },
    {
      grade: 'Амбассадор',
      turnover: 'от 75 млн',
      personal: '18%',
      line1: '0.5%',
      line2: '1.5%',
      line3: '3%',
      line4: '5% + 2%',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            DEOD
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setActiveTab('main')}
              className={`text-xs md:text-sm transition ${activeTab === 'main' ? 'text-cyan-400' : 'text-slate-300 hover:text-cyan-400'}`}
            >
              Экосистема
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`text-xs md:text-sm transition ${activeTab === 'simulator' ? 'text-cyan-400' : 'text-slate-300 hover:text-cyan-400'}`}
            >
              Симулятор
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`text-xs md:text-sm transition ${activeTab === 'knowledge' ? 'text-cyan-400' : 'text-slate-300 hover:text-cyan-400'}`}
            >
              База знаний
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-16">
        {activeTab === 'main' && (
          <div className="container mx-auto px-4 md:px-6 space-y-16">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-12">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Ваша финансовая сеть DEOD
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto">
                Доход с личных продаж и с оборота ваших партнёров
              </p>
            </section>

            {/* Intro Text */}
            <section className="max-w-5xl mx-auto space-y-6 text-lg text-slate-300 leading-relaxed">
              <p>
                Система DEOD работает на принципе финансовой сети. С каждой сделки распределяется фиксированный комиссионный фонд. 
                Вы получаете доход по двум направлениям: <span className="text-cyan-400 font-semibold">процент от ваших личных продаж до 18%</span>, 
                который растёт с повышением вашего статуса, и процент от оборота всех партнёров, которые пришли в систему по вашей рекомендации 
                и создали свои собственные структуры.
              </p>
              <p>
                Для быстрого старта действует специальное правило: заключив первую сделку в первый месяц, вы получаете <span className="text-green-400 font-semibold">удвоенный личный процент</span> с неё. 
                Это создаёт мощный первоначальный капитал.
              </p>
              <p>
                Ваш рост в системе ускоряется, если вы сразу демонстрируете высокий результат. Заключение крупной сделки может сразу перевести вас на более высокий уровень с увеличенным постоянным процентом. 
                Например, являясь обычным агентом на первом уровне с первой сделки <span className="text-purple-400 font-semibold">75 000 000 руб</span> (по КП) вы можете перепрыгнуть на статус <span className="text-yellow-400 font-semibold">Амбассадор</span> и 
                получить с нее <span className="text-green-400 font-semibold">18% т.е. 13 500 000</span>. И 50% с суммы наценки, превышающей суммы КП.
              </p>
              <p>
                Таким образом, вы строите не просто клиентскую базу, а <span className="text-cyan-400 font-semibold">саморазвивающийся актив</span> — многоуровневую партнёрскую сеть. 
                Ваш конечный доход практически не ограничен, так как складывается из высокого процента с вашей работы и небольших, но многочисленных процентов с оборота всей созданной вами экосистемы.
              </p>
            </section>

            {/* Блок 1: Схема доходов */}
            <section className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
                Как устроен ваш доход
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Левая колонка - Личный рост */}
                <Card className="bg-slate-900/50 border-cyan-500/30">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-2xl font-bold text-cyan-400 mb-6">Ваш личный рост</h3>
                    <div className="space-y-4">
                      {gradeTable.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-cyan-500/50 transition">
                          <div>
                            <div className="font-bold text-lg">{item.grade}</div>
                            <div className="text-sm text-slate-400">{item.turnover}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-400">{item.personal}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Правая колонка - Рост сети */}
                <Card className="bg-slate-900/50 border-purple-500/30">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-2xl font-bold text-purple-400 mb-6">Рост вашей сети</h3>
                    <div className="space-y-4">
                      {gradeTable.map((item, idx) => (
                        <div key={idx} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-purple-500/50 transition">
                          <div className="font-bold text-lg mb-2">{item.grade}</div>
                          <div className="grid grid-cols-4 gap-2 text-sm">
                            <div>
                              <div className="text-slate-400 text-xs">1-я линия</div>
                              <div className="text-purple-400 font-semibold">{item.line1}</div>
                            </div>
                            <div>
                              <div className="text-slate-400 text-xs">2-я линия</div>
                              <div className="text-purple-400 font-semibold">{item.line2}</div>
                            </div>
                            <div>
                              <div className="text-slate-400 text-xs">3-я линия</div>
                              <div className="text-purple-400 font-semibold">{item.line3}</div>
                            </div>
                            <div>
                              <div className="text-slate-400 text-xs">4-я линия</div>
                              <div className="text-purple-400 font-semibold">{item.line4}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center py-6">
                <div className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30">
                  <p className="text-xl font-semibold">
                    <span className="text-cyan-400">Ваш общий доход</span> = 
                    <span className="text-green-400"> Личный процент</span> + 
                    <span className="text-purple-400"> Процент от сети</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Таблица распределения */}
            <section className="max-w-6xl mx-auto">
              <Card className="bg-slate-900/50 border-slate-700/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-800">
                        <tr>
                          <th className="p-4 text-left">Уровень / Грейд</th>
                          <th className="p-4 text-center">Личные продажи</th>
                          <th className="p-4 text-center">1-я линия</th>
                          <th className="p-4 text-center">2-я линия</th>
                          <th className="p-4 text-center">3-я линия</th>
                          <th className="p-4 text-center">4-я линия+</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gradeTable.map((row, idx) => (
                          <tr key={idx} className="border-t border-slate-800 hover:bg-slate-800/30 transition">
                            <td className="p-4">
                              <div className="font-bold">{row.grade}</div>
                              <div className="text-xs text-slate-400">{row.turnover}</div>
                            </td>
                            <td className="p-4 text-center font-semibold text-green-400">{row.personal}</td>
                            <td className="p-4 text-center text-purple-400">{row.line1}</td>
                            <td className="p-4 text-center text-purple-400">{row.line2}</td>
                            <td className="p-4 text-center text-purple-400">{row.line3}</td>
                            <td className="p-4 text-center text-purple-400">{row.line4}</td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-cyan-500/50 bg-slate-800/50 font-bold">
                          <td className="p-4">ИТОГО выплата DEOD с оборота:</td>
                          <td className="p-4 text-center text-cyan-400">18%</td>
                          <td className="p-4 text-center text-cyan-400">18%</td>
                          <td className="p-4 text-center text-cyan-400">18%</td>
                          <td className="p-4 text-center text-cyan-400">18%</td>
                          <td className="p-4 text-center text-cyan-400">18%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Блок 2: Быстрый старт */}
            <section className="max-w-5xl mx-auto space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                Механика быстрого старта и роста
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-green-900/30 to-slate-900/50 border-green-500/30">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon name="Zap" className="text-green-400" size={32} />
                      <h3 className="text-2xl font-bold text-green-400">Стартовый импульс</h3>
                    </div>
                    <p className="text-lg text-slate-300">
                      Начните с усиленной ставки. Закройте первую сделку в первый месяц — ваш процент <span className="text-green-400 font-semibold">удвоится</span> (16% вместо 8%).
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 border-purple-500/30">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon name="TrendingUp" className="text-purple-400" size={32} />
                      <h3 className="text-2xl font-bold text-purple-400">Быстрый рост</h3>
                    </div>
                    <p className="text-lg text-slate-300">
                      Заключите крупную сделку — система может сразу перевести вас на грейд выше. Вы получите <span className="text-purple-400 font-semibold">повышенный личный процент навсегда</span> и 
                      начнёте зарабатывать с более глубоких уровней сети.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Блок 3: CTA */}
            <section className="max-w-4xl mx-auto text-center space-y-8 py-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Всё готово для вашего старта
              </h2>
              <p className="text-xl text-slate-300">
                Посмотрите, как ваша будущая сеть будет приносить доход
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  onClick={() => setActiveTab('simulator')}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg px-8 py-6 shadow-lg shadow-cyan-500/30"
                >
                  <Icon name="Calculator" className="mr-2" size={24} />
                  Смоделировать мой доход
                </Button>

                <Button
                  onClick={() => setActiveTab('knowledge')}
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 text-lg px-8 py-6"
                >
                  <Icon name="BookOpen" className="mr-2" size={24} />
                  С чего начать? Первые 3 шага
                </Button>
              </div>
            </section>
          </div>
        )}

        {/* Симулятор */}
        {activeTab === 'simulator' && (
          <div className="container mx-auto px-4 md:px-6">
            <SimulatorSection />
          </div>
        )}

        {/* База знаний */}
        {activeTab === 'knowledge' && (
          <div className="container mx-auto px-4 md:px-6">
            <KnowledgeSection />
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент симулятора (старый калькулятор)
const SimulatorSection = () => {
  const [calculatorData, setCalculatorData] = useState({
    projects: 5,
    avgBudget: 500,
    buildTeam: true,
  });

  const calculateIncome = () => {
    const baseRate = 0.18;
    const teamBonus = calculatorData.buildTeam ? 500 : 0;
    const personalIncome = calculatorData.projects * calculatorData.avgBudget * baseRate;
    const yearlyIncome = personalIncome + teamBonus;
    return (yearlyIncome / 1000).toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">Симулятор дохода</h1>
      
      <Card className="bg-slate-900/50 border-slate-700/50">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-slate-300 mb-2 block">Количество проектов в год</span>
              <input
                type="range"
                min="1"
                max="20"
                value={calculatorData.projects}
                onChange={(e) => setCalculatorData({ ...calculatorData, projects: Number(e.target.value) })}
                className="w-full"
              />
              <span className="text-cyan-400 font-bold">{calculatorData.projects}</span>
            </label>

            <label className="block">
              <span className="text-slate-300 mb-2 block">Средний бюджет проекта (млн ₽)</span>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={calculatorData.avgBudget}
                onChange={(e) => setCalculatorData({ ...calculatorData, avgBudget: Number(e.target.value) })}
                className="w-full"
              />
              <span className="text-cyan-400 font-bold">{calculatorData.avgBudget} млн ₽</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={calculatorData.buildTeam}
                onChange={(e) => setCalculatorData({ ...calculatorData, buildTeam: e.target.checked })}
                className="w-5 h-5"
              />
              <span className="text-slate-300">Строить партнёрскую команду (10 партнёров)</span>
            </label>
          </div>

          <div className="pt-6 border-t border-slate-700">
            <div className="text-center">
              <p className="text-slate-400 mb-2">Ваш годовой доход:</p>
              <p className="text-5xl font-bold text-green-400">{calculateIncome()} млрд ₽</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Компонент базы знаний
const KnowledgeSection = () => {
  const steps = [
    {
      number: 1,
      title: 'Изучите систему грейдов',
      description: 'Поймите, какой процент вы получаете на каждом уровне и что нужно для повышения. Это ваша дорожная карта роста.',
      icon: 'BookOpen',
    },
    {
      number: 2,
      title: 'Закройте первую сделку в первый месяц',
      description: 'Воспользуйтесь удвоенной ставкой 16% вместо 8%. Это даст вам мощный стартовый капитал и уверенность.',
      icon: 'Zap',
    },
    {
      number: 3,
      title: 'Начните строить сеть',
      description: 'Пригласите первых партнёров и помогите им закрыть сделки. Ваш пассивный доход начнёт расти с каждым новым партнёром.',
      icon: 'Users',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8">С чего начать?</h1>
      
      <div className="space-y-6">
        {steps.map((step) => (
          <Card key={step.number} className="bg-slate-900/50 border-cyan-500/30 hover:border-cyan-500/60 transition">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Icon name={step.icon as any} size={32} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl font-bold text-cyan-400">Шаг {step.number}</span>
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-lg text-slate-300">{step.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-green-900/20 to-slate-900/50 border-green-500/30 mt-12">
        <CardContent className="p-8 text-center space-y-4">
          <Icon name="Rocket" size={48} className="text-green-400 mx-auto" />
          <h3 className="text-2xl font-bold">Готовы начать?</h3>
          <p className="text-lg text-slate-300">
            Свяжитесь с вашим куратором или заполните форму на главной странице, чтобы получить персональное приглашение в систему DEOD.
          </p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg px-8 py-6">
              Вернуться на главную
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerSystem;
