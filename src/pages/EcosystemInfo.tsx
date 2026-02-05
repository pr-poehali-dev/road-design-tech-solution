import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

const EcosystemInfo = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleBlocks, setVisibleBlocks] = useState<number[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const blockId = parseInt(entry.target.getAttribute('data-block') || '0');
            setVisibleBlocks((prev) => [...new Set([...prev, blockId])]);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-block]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const gradeTable = [
    { 
      grade: 'Агент', 
      turnover: 'до 10 млн', 
      personal: '8%',
      personalDouble: '16%',
      example: '800 тыс ₽',
      exampleDouble: '1.6 млн ₽',
      line1: '8%', 
      line1Example: '800 тыс ₽',
      line2: '–', 
      line2Example: '–',
      line3: '–',
      line3Example: '–',
      line4: '–',
      line4Example: '–'
    },
    { 
      grade: 'Партнёр', 
      turnover: '10-24 млн', 
      personal: '10%',
      personalDouble: '',
      example: '2 млн ₽',
      exampleDouble: '',
      line1: '5%', 
      line1Example: '500 тыс ₽',
      line2: '8%', 
      line2Example: '800 тыс ₽',
      line3: '–',
      line3Example: '–',
      line4: '–',
      line4Example: '–'
    },
    { 
      grade: 'Старший партнёр', 
      turnover: '25-39 млн', 
      personal: '12%',
      personalDouble: '',
      example: '4 млн ₽',
      exampleDouble: '',
      line1: '3%', 
      line1Example: '300 тыс ₽',
      line2: '5%', 
      line2Example: '500 тыс ₽',
      line3: '8%',
      line3Example: '800 тыс ₽',
      line4: '–',
      line4Example: '–'
    },
    { 
      grade: 'Генеральный партнёр', 
      turnover: '40-74 млн', 
      personal: '15%',
      personalDouble: '',
      example: '10 млн ₽',
      exampleDouble: '',
      line1: '1.5%', 
      line1Example: '150 тыс ₽',
      line2: '3%', 
      line2Example: '300 тыс ₽',
      line3: '5%',
      line3Example: '500 тыс ₽',
      line4: '8%',
      line4Example: '800 тыс ₽'
    },
    { 
      grade: 'Амбассадор', 
      turnover: 'от 75 млн', 
      personal: '18%',
      personalDouble: '',
      example: '13.5 млн ₽',
      exampleDouble: '',
      line1: '0.5%', 
      line1Example: '50 тыс ₽',
      line2: '1.5%', 
      line2Example: '150 тыс ₽',
      line3: '3%',
      line3Example: '300 тыс ₽',
      line4: '5%+2%',
      line4Example: '700 тыс ₽'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link to="/ecosystem" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            DEOD
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/ecosystem" className="text-xs md:text-sm text-slate-300 hover:text-cyan-400 transition">
              Назад к экосистеме
            </Link>
            <a href="#simulator" className="text-xs md:text-sm text-slate-300 hover:text-cyan-400 transition hidden sm:block">
              Симулятор
            </a>
            <a href="#knowledge" className="text-xs md:text-sm text-slate-300 hover:text-cyan-400 transition hidden sm:block">
              База знаний
            </a>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.2) 0%, transparent 70%)`,
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="mb-6 animate-fade-in">
            <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs md:text-sm font-semibold">
              Финансовая экосистема DEOD
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight animate-scale-in">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Ваша партнерская сеть DEOD
            </span>
            <span className="block text-xl md:text-3xl lg:text-4xl text-slate-200 mt-4">
              Доход с личных продаж и с оборота ваших партнёров
            </span>
          </h1>

          <div className="max-w-4xl mx-auto space-y-6 text-base md:text-xl text-slate-300 mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="leading-relaxed">
              Система DEOD работает на <span className="text-cyan-400 font-semibold">сарафанного радио и пассивного дохода</span>. 
              С каждой сделки распределяется фиксированный комиссионный фонд. Вы получаете доход по двум направлениям:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <Card className="bg-slate-900/50 border-cyan-500/30">
                <CardContent className="p-6">
                  <Icon name="TrendingUp" className="text-cyan-400 mb-3" size={32} />
                  <p className="text-cyan-400 font-semibold mb-2">Личные продажи</p>
                  <p className="text-sm text-slate-400">Процент от ваших сделок до 18%, который растёт с повышением статуса</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900/50 border-purple-500/30">
                <CardContent className="p-6">
                  <Icon name="Network" className="text-purple-400 mb-3" size={32} />
                  <p className="text-purple-400 font-semibold mb-2">Партнёрская сеть</p>
                  <p className="text-sm text-slate-400">Процент от оборота всех партнёров, которые пришли по вашей рекомендации</p>
                </CardContent>
              </Card>
            </div>

            <div className="p-6 bg-gradient-to-r from-green-900/30 to-slate-900/50 rounded-xl border border-green-500/30 text-left">
              <div className="flex items-start gap-3 mb-3">
                <Icon name="Zap" className="text-green-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className="text-green-400 font-semibold mb-2">Быстрый старт</p>
                  <p className="text-sm text-slate-300">
                    Для быстрого старта действует специальное правило: заключив первую сделку в первый месяц, 
                    вы получаете <span className="text-green-400 font-bold">удвоенный личный процент</span> с неё. 
                    Это создаёт мощный первоначальный капитал.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-900/30 to-slate-900/50 rounded-xl border border-blue-500/30 text-left">
              <div className="flex items-start gap-3 mb-3">
                <Icon name="Rocket" className="text-blue-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className="text-blue-400 font-semibold mb-2">Ускоренный рост</p>
                  <p className="text-sm text-slate-300 mb-3">
                    Ваш рост в системе ускоряется, если вы сразу демонстрируете высокий результат. 
                    Заключение крупной сделки может сразу перевести вас на более высокий уровень с увеличенным постоянным процентом.
                  </p>
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-blue-500/20">
                    <p className="text-xs text-slate-400 mb-1">Пример:</p>
                    <p className="text-sm text-slate-200">
                      Являясь обычным <span className="text-cyan-400">агентом</span> на первом уровне, с первой сделки 
                      <span className="text-green-400 font-semibold"> 75 000 000 ₽</span> (по КП) вы можете перепрыгнуть на статус 
                      <span className="text-purple-400 font-semibold"> Амбассадор</span> и получить с нее 
                      <span className="text-green-400 font-bold"> 18%</span> т.е. 
                      <span className="text-green-400 font-bold"> 13 500 000 ₽</span>. 
                      И <span className="text-blue-400 font-semibold">50% с суммы наценки</span>, превышающей суммы КП.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-purple-900/30 to-slate-900/50 rounded-xl border border-purple-500/30 text-left">
              <div className="flex items-start gap-3">
                <Icon name="Trophy" className="text-purple-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className="text-purple-400 font-semibold mb-2">Саморазвивающийся актив</p>
                  <p className="text-sm text-slate-300">
                    Таким образом, вы строите не просто клиентскую базу, а <span className="text-purple-400 font-semibold">саморазвивающийся актив</span> — 
                    многоуровневую партнёрскую сеть. Ваш конечный доход практически не ограничен, так как складывается из 
                    высокого процента с вашей работы и небольших, но многочисленных процентов с оборота всей созданной вами экосистемы.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <Button 
              onClick={() => document.getElementById('income-structure')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-sm md:text-lg px-6 md:px-10 py-4 md:py-6 shadow-2xl shadow-cyan-500/50"
            >
              <Icon name="ArrowDown" className="mr-2" size={20} />
              Узнать подробнее
            </Button>
          </div>
        </div>
      </section>

      <section id="income-structure" data-block="1" className="py-16 md:py-24 bg-slate-900/30 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className={`text-center mb-12 transition-all duration-1000 ${visibleBlocks.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Как устроен ваш доход
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400">Две колонки роста, один результат — ваш успех</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className={`bg-slate-900/80 border-cyan-500/30 backdrop-blur transition-all duration-1000 delay-200 ${visibleBlocks.includes(1) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-cyan-400 flex items-center gap-3">
                  <Icon name="User" size={32} />
                  Ваш личный рост
                </CardTitle>
                <CardDescription className="text-base">Процент от ваших личных продаж растёт с увеличением оборота</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {gradeTable.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-lg bg-slate-800/50 border border-slate-700 transition-all duration-500 hover:border-cyan-500/50 hover:bg-slate-800`}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-lg text-cyan-300">{item.grade}</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-400">{item.personal}</span>
                        {item.personalDouble && (
                          <div className="text-xs text-green-300">
                            (x2 первая сделка: {item.personalDouble})
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-slate-400 mb-1">Оборот: {item.turnover}</div>
                    <div className="text-xs text-slate-500">
                      Пример: с оборота 10 млн = <span className="text-green-400 font-semibold">{item.example}</span>
                      {item.exampleDouble && (
                        <span className="text-green-300"> (или {item.exampleDouble} если первая сделка в первый месяц)</span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className={`bg-slate-900/80 border-purple-500/30 backdrop-blur transition-all duration-1000 delay-400 ${visibleBlocks.includes(1) ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-purple-400 flex items-center gap-3">
                  <Icon name="Users" size={32} />
                  Рост вашей сети
                </CardTitle>
                <CardDescription className="text-base">Дополнительный процент с оборота каждой линии партнёров</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {gradeTable.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-lg bg-slate-800/50 border border-slate-700 transition-all duration-500 hover:border-purple-500/50 hover:bg-slate-800`}
                    style={{ animationDelay: `${idx * 0.1 + 0.2}s` }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-lg text-purple-300">{item.grade}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-slate-500">1-я линия: <span className="text-purple-400 font-semibold">{item.line1}</span></div>
                        {item.line1Example !== '–' && <div className="text-slate-600">({item.line1Example})</div>}
                      </div>
                      <div>
                        <div className="text-slate-500">2-я линия: <span className="text-purple-400 font-semibold">{item.line2}</span></div>
                        {item.line2Example !== '–' && <div className="text-slate-600">({item.line2Example})</div>}
                      </div>
                      <div>
                        <div className="text-slate-500">3-я линия: <span className="text-purple-400 font-semibold">{item.line3}</span></div>
                        {item.line3Example !== '–' && <div className="text-slate-600">({item.line3Example})</div>}
                      </div>
                      <div>
                        <div className="text-slate-500">4-я+ линия: <span className="text-purple-400 font-semibold">{item.line4}</span></div>
                        {item.line4Example !== '–' && <div className="text-slate-600">({item.line4Example})</div>}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg text-xs text-slate-400">
                  <p className="font-semibold text-blue-400 mb-1">Итого выплата DEOD с каждого оборота:</p>
                  <p>С каждой сделки на всех уровнях распределяется фиксированно <span className="text-green-400 font-bold">18%</span> между всеми участниками сети</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className={`text-center py-8 transition-all duration-1000 delay-600 ${visibleBlocks.includes(1) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-2xl">
              <p className="text-xl md:text-2xl font-bold">
                <span className="text-cyan-400">Ваш общий доход</span> 
                <span className="text-white mx-3">=</span>
                <span className="text-green-400">Личный процент</span>
                <span className="text-white mx-3">+</span>
                <span className="text-purple-400">Процент от сети</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section data-block="2" className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-950" />
        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
          <div className={`text-center mb-12 transition-all duration-1000 ${visibleBlocks.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Быстрый старт и рост
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400">Специальные правила для ускоренного развития</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className={`bg-gradient-to-br from-green-900/30 to-slate-900/80 border-green-500/30 backdrop-blur transition-all duration-1000 delay-200 hover:scale-105 ${visibleBlocks.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardHeader>
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4">
                  <Icon name="Zap" size={32} className="text-green-400" />
                </div>
                <CardTitle className="text-2xl text-green-400">Стартовый импульс</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Начните с усиленной ставки. Закройте первую сделку в первый месяц — ваш процент удвоится.
                </p>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-green-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400">Обычная ставка:</span>
                    <span className="text-xl font-bold text-slate-300">8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-semibold">Первая сделка:</span>
                    <span className="text-3xl font-bold text-green-400">16%</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-xs text-slate-500">Пример: сделка 50 млн</p>
                    <p className="text-sm text-green-400 font-semibold">Вместо 4 млн → получите 8 млн ₽</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-gradient-to-br from-blue-900/30 to-slate-900/80 border-blue-500/30 backdrop-blur transition-all duration-1000 delay-400 hover:scale-105 ${visibleBlocks.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <CardHeader>
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4">
                  <Icon name="Rocket" size={32} className="text-blue-400" />
                </div>
                <CardTitle className="text-2xl text-blue-400">Быстрый рост</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4">
                  Заключите крупную сделку — система может сразу перевести вас на грейд выше. Повышенный личный процент навсегда и начнёте зарабатывать с более глубоких уровней сети!
                </p>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-blue-500/30">
                  <div className="text-sm text-slate-400 mb-2">Пример:</div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-slate-700 rounded text-xs">Агент (8%)</span>
                    <Icon name="ArrowRight" size={16} className="text-blue-400" />
                    <span className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-400">Амбассадор (18%)</span>
                  </div>
                  <div className="text-xs text-slate-500">Сделка 75 млн = <span className="text-blue-400 font-semibold">13.5 млн ₽</span></div>
                  <div className="text-xs text-green-400 mt-1">+ 50% от наценки сверх КП</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="simulator" data-block="3" className="py-16 md:py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_70%)]" />
        <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
          <div className={`text-center mb-12 transition-all duration-1000 ${visibleBlocks.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Всё готово для вашего старта
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 mb-8">
              Посмотрите, как ваша будущая сеть будет приносить доход
            </p>
          </div>

          <div className={`grid md:grid-cols-2 gap-6 transition-all duration-1000 delay-200 ${visibleBlocks.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="bg-slate-900/80 border-cyan-500/30 hover:border-cyan-500/60 transition-all hover:scale-105 cursor-pointer group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Icon name="Calculator" size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-cyan-400">Смоделировать мой доход</h3>
                <p className="text-slate-400 mb-6">
                  Интерактивный симулятор покажет ваш потенциальный заработок в цифрах
                </p>
                <Button 
                  onClick={() => {
                    const simulatorSection = document.getElementById('simulator-section');
                    if (simulatorSection) {
                      simulatorSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg py-6 shadow-xl shadow-cyan-500/30"
                >
                  Открыть симулятор
                  <Icon name="ArrowRight" className="ml-2" size={20} />
                </Button>
              </CardContent>
            </Card>

            <Card id="knowledge" className="bg-slate-900/80 border-purple-500/30 hover:border-purple-500/60 transition-all hover:scale-105 cursor-pointer group">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Icon name="BookOpen" size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-purple-400">С чего начать?</h3>
                <p className="text-slate-400 mb-6">
                  Первые 3 шага для успешного старта в системе DEOD
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-purple-500/20">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 text-sm font-bold">1</span>
                    </div>
                    <p className="text-sm text-slate-300">Изучите систему процентов и грейдов</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-purple-500/20">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 text-sm font-bold">2</span>
                    </div>
                    <p className="text-sm text-slate-300">Рассчитайте свой доход в симуляторе</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-purple-500/20">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 text-sm font-bold">3</span>
                    </div>
                    <p className="text-sm text-slate-300">Заключите первую сделку в первый месяц с удвоенной ставкой 16%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-slate-800 bg-slate-950">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
            DEOD
          </p>
          <p className="text-sm md:text-base text-slate-400">
            Партнёрская финансовая экосистема
          </p>
        </div>
      </footer>
    </div>
  );
};

export default EcosystemInfo;
