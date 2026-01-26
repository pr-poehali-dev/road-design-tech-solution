import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

const PartnerSystem = () => {
  const [scrollY, setScrollY] = useState(0);
  const [calculatorData, setCalculatorData] = useState({
    projects: 5,
    avgBudget: 500,
    buildTeam: true,
  });

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    asset: '',
    expectedIncome: 50,
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const calculateIncome = () => {
    // Базовая ставка 18% для амбассадора
    const baseRate = 0.18;
    // Бонус от команды: 10 партнёров x 5 проектов x 200 млн x 5% = 500 млн
    const teamBonus = calculatorData.buildTeam ? 500 : 0;
    // Личный доход
    const personalIncome = calculatorData.projects * calculatorData.avgBudget * baseRate;
    // Итого в млн
    const yearlyIncome = personalIncome + teamBonus;
    return (yearlyIncome / 1000).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
            DEOD
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <a href="#calculator" className="text-xs md:text-sm text-slate-300 hover:text-cyan-400 transition hidden sm:block">
              Калькулятор
            </a>
            <Button 
              onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-xs md:text-sm px-3 py-2 md:px-4 md:py-2 shadow-lg shadow-cyan-500/30"
            >
              Получить приглашение
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0">
        {/* Animated Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.2) 0%, transparent 70%)`,
            transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0005})`,
          }}
        />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-purple-600/20 blur-sm"
              style={{
                width: Math.random() * 150 + 50 + 'px',
                height: Math.random() * 150 + 50 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `float ${Math.random() * 15 + 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="mb-4 md:mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs md:text-sm font-semibold backdrop-blur-sm">
              Закрытый клуб будущих лидеров рынка
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient bg-300% block">
              DEOD
            </span>
            <span className="text-2xl md:text-4xl lg:text-5xl text-slate-200 block mt-2">
              Экосистема Миллиард
            </span>
          </h1>
          
          <p className="text-base md:text-xl lg:text-2xl text-slate-300 mb-8 md:mb-12 max-w-4xl mx-auto px-4 leading-relaxed">
            Первая в России экосистема, где партнёр зарабатывает от <span className="text-cyan-400 font-bold text-2xl md:text-3xl">1 млрд ₽ в год</span>.
            <br />
            Превращайте ваши связи в строительстве и проектировании в 
            <span className="text-cyan-400 font-bold"> капитал</span>, 
            <span className="text-blue-400 font-bold"> влияние</span> и 
            <span className="text-purple-400 font-bold"> статус</span>.
            <br />
            <span className="text-lg md:text-2xl text-cyan-400 font-semibold mt-4 block">
              Станьте миллиардером вместе с DEOD.
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-base md:text-lg px-8 md:px-10 py-5 md:py-7 w-full sm:w-auto shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all transform hover:scale-105"
            >
              Рассчитать свой потенциал
              <Icon name="Calculator" className="ml-2" size={20} />
            </Button>
            <Button
              onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 text-base md:text-lg px-8 md:px-10 py-5 md:py-7 w-full sm:w-auto backdrop-blur-sm hover:border-cyan-400 transition-all"
            >
              Получить приглашение в закрытый клуб
              <Icon name="ArrowRight" className="ml-2" size={20} />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <Icon name="ChevronDown" size={36} className="text-cyan-400 opacity-70" />
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-12 md:mb-20">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              DEOD меняет правила.
            </span>
            <br />
            <span className="text-cyan-400">Навсегда.</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: 'Wallet',
                title: 'Деньги',
                subtitle: 'До 18% с каждой сделки + процент с сети',
                description: 'Превращайте каждое введённое вами в экосистему тендерное или коммерческое предложение в стабильный капитал.',
                gradient: 'from-cyan-500 to-blue-600',
                glow: 'shadow-cyan-500/30',
              },
              {
                icon: 'Crown',
                title: 'Власть',
                subtitle: 'Закрепите регион. Постройте команду.',
                description: 'Вы не продавец — вы полевой командир и стратег. Вы определяете правила игры на своей территории.',
                gradient: 'from-blue-500 to-purple-600',
                glow: 'shadow-blue-500/30',
              },
              {
                icon: 'Sparkles',
                title: 'Известность',
                subtitle: 'Ваше имя станет брендом',
                description: 'Выступайте на наших закрытых билдер-саммитах. Ваши кейсы — в основе наших материалов. Вы — лицо изменений в отрасли.',
                gradient: 'from-purple-600 to-pink-600',
                glow: 'shadow-purple-500/30',
              },
            ].map((pillar, idx) => (
              <Card
                key={idx}
                className="bg-slate-900/70 border-slate-800 hover:border-cyan-500/50 transition-all duration-500 group hover:scale-105 backdrop-blur-sm"
              >
                <CardContent className="p-6 md:p-8">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${pillar.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl ${pillar.glow}`}>
                    <Icon name={pillar.icon as any} size={32} className="text-white md:w-10 md:h-10" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-cyan-400">{pillar.title}</h3>
                  <p className="text-base md:text-lg font-semibold text-white mb-4">{pillar.subtitle}</p>
                  <p className="text-sm md:text-base text-slate-400 leading-relaxed">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-slate-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-6 text-cyan-400">
            Вы приводите клиента.
          </h2>
          <p className="text-xl md:text-3xl text-slate-300 text-center mb-16 font-light">
            Экосистема делает всё остальное.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-1/3 left-[16.6%] right-[16.6%] h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
            
            {[
              {
                step: '01',
                title: 'ВЫ — ЛОКОМОТИВ',
                description: 'Вы находите проект (стройка, реконструкция, изыскания). Используете наш банк решений и методики.',
                icon: 'Rocket',
                color: 'from-cyan-500 to-cyan-600',
              },
              {
                step: '02',
                title: 'ЭКОСИСТЕМА — ДВИГАТЕЛЬ',
                description: 'Наша фабрика проектов (эксперты, ИИ, юристы, сметчики) мгновенно формирует победное КП «под ключ».',
                icon: 'Zap',
                color: 'from-blue-500 to-blue-600',
              },
              {
                step: '03',
                title: 'ВЫ — СОБСТВЕННИК',
                description: 'Контракт заключён. Вы получаете высокий процент. Экосистема выполняет работу. Вы строите свою сеть партнёров и умножаете доход.',
                icon: 'Trophy',
                color: 'from-purple-500 to-purple-600',
              },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10">
                <Card className="bg-slate-900/90 border-cyan-500/30 h-full hover:border-cyan-400 transition-all backdrop-blur-sm shadow-xl hover:shadow-cyan-500/30">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 shadow-2xl`}>
                        <Icon name={step.icon as any} size={32} className="text-white" />
                      </div>
                      <span className="text-6xl font-bold text-cyan-500/20 mb-4">{step.step}</span>
                      <h3 className="text-xl md:text-2xl font-bold mb-4 text-cyan-400">{step.title}</h3>
                      <p className="text-sm md:text-base text-slate-300 leading-relaxed">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Математика, которая не врёт
            </span>
          </h2>
          <p className="text-lg md:text-2xl text-slate-300 text-center mb-16">
            Мы спроектировали систему, где ваш рост — инженерный расчёт
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-blue-600/10 border-cyan-500/30 hover:border-cyan-400 transition-all shadow-xl shadow-cyan-500/20">
              <CardContent className="p-8 md:p-12 text-center">
                <p className="text-sm md:text-base text-slate-400 mb-4">Потенциал оборота экосистемы через 24 месяца</p>
                <p className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 animate-pulse">
                  50 млрд ₽
                </p>
                <div className="w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-4" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-pink-600/10 border-purple-500/30 hover:border-purple-400 transition-all shadow-xl shadow-purple-500/20">
              <CardContent className="p-8 md:p-12 text-center">
                <p className="text-sm md:text-base text-slate-400 mb-4">Максимальный годовой доход амбассадора в системе</p>
                <p className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2 animate-pulse">
                  1.5 млрд ₽
                </p>
                <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mt-4" />
              </CardContent>
            </Card>
          </div>

          <h3 className="text-2xl md:text-4xl font-bold text-center mb-12 text-cyan-400">
            Профили успеха
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Бывший руководитель тендерного отдела',
                time: '24 месяца в системе',
                network: 'Личная сеть: 15 партнёров',
                income: '1.2 млрд ₽',
                period: 'годовой доход',
                gradient: 'from-cyan-500/20 to-blue-600/20',
                border: 'border-cyan-500/30',
              },
              {
                title: 'Инженер с наработанными контактами',
                time: '18 месяцев в системе',
                network: 'Специализация: госзаказ + команда',
                income: '850 млн ₽',
                period: 'годовой доход',
                gradient: 'from-purple-500/20 to-pink-600/20',
                border: 'border-purple-500/30',
              },
            ].map((profile, idx) => (
              <Card key={idx} className={`bg-gradient-to-br ${profile.gradient} ${profile.border} hover:scale-105 transition-all backdrop-blur-sm`}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-xl">
                      <Icon name="User" size={32} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">{profile.title}</h3>
                      <p className="text-sm text-slate-400 mb-1">{profile.time}</p>
                      <p className="text-sm text-cyan-400 font-semibold mb-6">{profile.network}</p>
                      <div className="border-t border-slate-700 pt-4">
                        <p className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">{profile.income}</p>
                        <p className="text-xs text-slate-500">{profile.period}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 md:py-24 bg-slate-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-6 text-cyan-400">
            Ваша карьерная траектория спроектирована
          </h2>
          <p className="text-lg md:text-xl text-slate-300 text-center mb-16">
            От партнёра до амбассадора
          </p>
          
          <div className="relative">
            {/* Progress line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-500 via-purple-500 to-pink-600 rounded-full" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {[
                {
                  title: 'Партнёр',
                  period: '0-6 мес.',
                  focus: 'Первые крупные сделки от 50 млн. Фокус: личные продажи.',
                  income: '50-200 млн/год',
                  color: 'from-cyan-500 to-cyan-600',
                  icon: 'Target',
                },
                {
                  title: 'Стратег',
                  period: '6-12 мес.',
                  focus: 'Создание ядра команды (3-5 партнёров). Проекты от 100 млн.',
                  income: '200-500 млн/год',
                  color: 'from-blue-500 to-blue-600',
                  icon: 'Users',
                },
                {
                  title: 'Директор сети',
                  period: '12-18 мес.',
                  focus: 'Управление структурой 10+ партнёров. Проекты от 200 млн.',
                  income: '500 млн - 1 млрд/год',
                  color: 'from-purple-500 to-purple-600',
                  icon: 'Network',
                },
                {
                  title: 'Амбассадор',
                  period: '18+ мес.',
                  focus: 'Совладелец экосистемы. Сеть 15+ партнёров. Проекты от 500 млн.',
                  income: '1+ млрд/год',
                  color: 'from-purple-600 to-pink-600',
                  icon: 'Crown',
                },
              ].map((stage, idx) => (
                <div key={idx} className="relative z-10">
                  <Card className="bg-slate-900/90 border-cyan-500/30 hover:border-cyan-400 transition-all h-full backdrop-blur-sm hover:scale-105 shadow-xl">
                    <CardContent className="p-6 md:p-8">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${stage.color} mx-auto mb-6 flex items-center justify-center shadow-2xl`}>
                        <Icon name={stage.icon as any} size={28} className="text-white" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-center mb-2 text-cyan-400">{stage.title}</h3>
                      <p className="text-sm text-slate-500 text-center mb-6">{stage.period}</p>
                      <p className="text-sm text-slate-300 mb-8 min-h-[80px]">{stage.focus}</p>
                      <div className="text-center pt-6 border-t border-slate-700">
                        <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                          {stage.income}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Спроектируйте свой доход
            </span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 text-center mb-12">
            Минималистичный инженерный калькулятор
          </p>

          <Card className="bg-slate-900/90 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="space-y-10">
                <div>
                  <label className="text-base md:text-lg text-slate-200 mb-4 block font-semibold">
                    Сколько крупных проектов (от 100 млн) вы можете приводить в год?
                  </label>
                  <Input
                    type="range"
                    min="2"
                    max="20"
                    value={calculatorData.projects}
                    onChange={(e) => setCalculatorData({ ...calculatorData, projects: Number(e.target.value) })}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-3 text-sm text-slate-500">
                    <span>2</span>
                    <span className="text-cyan-400 font-bold text-2xl">{calculatorData.projects}</span>
                    <span>20</span>
                  </div>
                </div>

                <div>
                  <label className="text-base md:text-lg text-slate-200 mb-4 block font-semibold">
                    Какой средний бюджет ваших проектов?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {[100, 250, 500, 750, 1000].map((budget) => (
                      <Button
                        key={budget}
                        onClick={() => setCalculatorData({ ...calculatorData, avgBudget: budget })}
                        className={`text-sm md:text-base py-6 ${
                          calculatorData.avgBudget === budget
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50'
                            : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-cyan-500'
                        }`}
                      >
                        {budget} млн
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-base md:text-lg text-slate-200 mb-4 block font-semibold">
                    Будете ли строить команду из 10+ партнёров?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => setCalculatorData({ ...calculatorData, buildTeam: true })}
                      className={`text-base md:text-lg py-6 ${
                        calculatorData.buildTeam
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50'
                          : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-cyan-500'
                      }`}
                    >
                      Да (+500 млн от сети)
                    </Button>
                    <Button
                      onClick={() => setCalculatorData({ ...calculatorData, buildTeam: false })}
                      className={`text-base md:text-lg py-6 ${
                        !calculatorData.buildTeam
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50'
                          : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-cyan-500'
                      }`}
                    >
                      Только личные продажи
                    </Button>
                  </div>
                </div>

                <div className="pt-10 border-t-2 border-cyan-500/30">
                  <p className="text-lg md:text-xl text-slate-300 mb-4 text-center">
                    Ваш расчётный годовой потенциал в экосистеме DEOD:
                  </p>
                  <p className="text-6xl md:text-8xl font-bold text-center bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-3 animate-gradient bg-300%">
                    {calculateIncome()}
                  </p>
                  <p className="text-2xl md:text-3xl text-center text-slate-400 mb-4">млрд рублей</p>
                  <p className="text-base md:text-lg text-cyan-400 text-center mb-8">
                    🚀 {parseFloat(calculateIncome()) >= 1 ? 'Вы достигаете статуса миллиардера!' : 'Увеличьте параметры для выхода на миллиард'}
                  </p>
                  <p className="text-sm text-slate-500 text-center mb-8">
                    Расчёт: личные продажи (18%) + доход от сети партнёров (5%)
                  </p>
                  <Button
                    onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg md:text-xl py-7 shadow-2xl shadow-cyan-500/50 hover:scale-105 transition-all"
                  >
                    Зафиксировать свою позицию в следующем наборе
                    <Icon name="ArrowRight" className="ml-2" size={24} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Join Form */}
      <section id="join" className="py-16 md:py-24 bg-slate-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)]" />
        
        <div className="container mx-auto px-4 md:px-6 max-w-3xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-6">
              Ограниченное предложение
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-cyan-400">Следующий набор —</span>
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent block">
                25 мест
              </span>
            </h2>
            <p className="text-base md:text-xl text-slate-300 mb-4">
              Проверьте, ваше ли это сообщество
            </p>
            <p className="text-lg md:text-2xl text-slate-400 italic leading-relaxed px-4">
              «Мы ищем не всех. Мы ищем <span className="text-cyan-400 font-semibold">своих</span>: 
              амбициозных, с глубоким пониманием рынка или безупречными связями, 
              готовых строить не просто доход, а <span className="text-purple-400 font-semibold">наследие</span>.»
            </p>
          </div>

          <Card className="bg-slate-900/90 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-base md:text-lg text-slate-200 mb-3 block font-semibold">
                    Имя
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500 text-base md:text-lg py-6"
                    placeholder="Ваше имя"
                  />
                </div>

                <div>
                  <label className="text-base md:text-lg text-slate-200 mb-3 block font-semibold">
                    Телефон / Telegram
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500 text-base md:text-lg py-6"
                    placeholder="+7 (___) ___-__-__ или @username"
                  />
                </div>

                <div>
                  <label className="text-base md:text-lg text-slate-200 mb-3 block font-semibold">
                    Главный профессиональный актив
                  </label>
                  <select
                    required
                    value={formData.asset}
                    onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
                    className="w-full px-4 py-4 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-cyan-500 text-base md:text-lg"
                  >
                    <option value="">Выберите вариант</option>
                    <option value="connections">Глубокие отраслевые связи</option>
                    <option value="tenders">Опыт в госзакупках/тендерах</option>
                    <option value="expertise">Экспертиза в строительстве/проектировании</option>
                    <option value="team">Управляю командой продаж</option>
                  </select>
                </div>

                <div>
                  <label className="text-base md:text-lg text-slate-200 mb-4 block font-semibold">
                    Ожидаемый личный годовой доход через 2 года
                  </label>
                  <Input
                    type="range"
                    min="20"
                    max="1000"
                    step="10"
                    value={formData.expectedIncome}
                    onChange={(e) => setFormData({ ...formData, expectedIncome: Number(e.target.value) })}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-3 text-sm text-slate-500">
                    <span>20 млн</span>
                    <span className="text-cyan-400 font-bold text-xl">
                      {formData.expectedIncome >= 1000 ? '1+ млрд' : `${formData.expectedIncome}+ млн`} ₽
                    </span>
                    <span>1 млрд</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg md:text-xl py-7 mt-8 shadow-2xl shadow-cyan-500/50 hover:scale-105 transition-all"
                >
                  Отправить заявку
                  <Icon name="Send" className="ml-2" size={24} />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent" />
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 animate-gradient bg-300%">
            DEOD
          </p>
          <p className="text-lg md:text-xl text-slate-400 font-light">
            Капитализируйте вашу экспертизу
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.15;
          }
          33% {
            transform: translateY(-30px) translateX(20px) scale(1.1);
            opacity: 0.25;
          }
          66% {
            transform: translateY(-15px) translateX(-20px) scale(0.95);
            opacity: 0.2;
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
        
        .bg-300% {
          background-size: 300% 300%;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          cursor: pointer;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.7);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          cursor: pointer;
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.7);
          border: none;
        }
      `}</style>
    </div>
  );
};

export default PartnerSystem;