import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Link, useNavigate } from 'react-router-dom';

const PartnerSystem = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const texts = [
    'Приводите строительные проекты — получайте 18% с каждой сделки.',
    'Зарабатывай пассивно до 1 млрд в год на своей партнерской сети.',
  ];

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

  useEffect(() => {
    const currentText = texts[textIndex];
    const typingSpeed = isDeleting ? 30 : 80;
    const pauseTime = isDeleting ? 500 : 3000;

    if (!isDeleting && typedText === currentText) {
      setTimeout(() => setIsDeleting(true), pauseTime);
      return;
    }

    if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(() => {
      setTypedText(
        isDeleting
          ? currentText.substring(0, typedText.length - 1)
          : currentText.substring(0, typedText.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, textIndex]);

  const calculateIncome = () => {
    const baseRate = 0.18;
    const teamBonus = calculatorData.buildTeam ? 500 : 0;
    const personalIncome = calculatorData.projects * calculatorData.avgBudget * baseRate;
    const yearlyIncome = personalIncome + teamBonus;
    return (yearlyIncome / 1000).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/ecosystem');
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
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.2) 0%, transparent 70%)`,
            transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0005})`,
          }}
        />
        
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="mb-4 md:mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs md:text-sm font-semibold backdrop-blur-sm">
              Партнёрская программа для строительного рынка
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient bg-300% block">
              DEOD
            </span>
            <span className="text-2xl md:text-4xl lg:text-5xl text-slate-200 block mt-2">
              Партнёрская программа
            </span>
          </h1>
          
          <div className="text-sm md:text-xl lg:text-2xl text-slate-300 mb-6 md:mb-12 max-w-4xl mx-auto px-4 leading-relaxed min-h-[80px] md:min-h-[160px] flex items-center justify-center">
            <p className="text-cyan-400 font-semibold">
              {typedText}
              <span className="inline-block w-0.5 md:w-1 h-4 md:h-8 bg-cyan-400 ml-1 animate-pulse" />
            </p>
          </div>
          <p className="text-base md:text-2xl text-slate-300 mb-6 md:mb-8 px-4">
            Для тех, кто знает рынок строительства и проектирования
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4">
            <Button
              onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-sm md:text-lg px-6 md:px-10 py-4 md:py-7 w-full sm:w-auto shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all transform hover:scale-105"
            >
              Рассчитать потенциал
              <Icon name="Calculator" className="ml-2" size={18} />
            </Button>
            <Button
              onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 text-sm md:text-lg px-6 md:px-10 py-4 md:py-7 w-full sm:w-auto backdrop-blur-sm hover:border-cyan-400 transition-all"
            >
              Получить приглашение
              <Icon name="ArrowRight" className="ml-2" size={18} />
            </Button>
          </div>
        </div>

        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
          <Icon name="ChevronDown" size={36} className="text-cyan-400 opacity-70" />
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-16 md:py-24 bg-slate-900/50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Рассчитайте свой доход
            </span>
          </h2>

          <Card className="bg-slate-900/80 border-cyan-500/30 backdrop-blur-sm">
            <CardContent className="p-6 md:p-10 space-y-8">
              <div>
                <label className="block text-base md:text-lg mb-4">
                  Количество проектов в год
                  <span className="block text-cyan-400 font-bold mt-2 text-xl md:text-2xl">{calculatorData.projects}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={calculatorData.projects}
                  onChange={(e) => setCalculatorData({ ...calculatorData, projects: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div>
                <label className="block text-base md:text-lg mb-4">
                  Средний бюджет проекта (млн ₽)
                  <span className="block text-cyan-400 font-bold mt-2 text-xl md:text-2xl">{calculatorData.avgBudget}</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={calculatorData.avgBudget}
                  onChange={(e) => setCalculatorData({ ...calculatorData, avgBudget: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                <input
                  type="checkbox"
                  id="buildTeam"
                  checked={calculatorData.buildTeam}
                  onChange={(e) => setCalculatorData({ ...calculatorData, buildTeam: e.target.checked })}
                  className="w-6 h-6 accent-cyan-500 cursor-pointer"
                />
                <label htmlFor="buildTeam" className="text-base md:text-lg cursor-pointer">
                  Планирую строить партнёрскую команду (10+ партнёров)
                </label>
              </div>

              <div className="pt-6 border-t border-slate-700">
                <div className="text-center space-y-4">
                  <p className="text-slate-400 text-lg md:text-xl">Ваш потенциальный годовой доход:</p>
                  <div className="flex items-center justify-center gap-3">
                    <Icon name="TrendingUp" className="text-green-400" size={48} />
                    <p className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                      {calculateIncome()} млрд ₽
                    </p>
                  </div>
                  <p className="text-slate-500 text-sm">
                    *Расчёт основан на ставке 18% для амбассадора и комиссии от команды
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Join Form */}
      <section id="join" className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                Стать партнёром
              </span>
            </h2>
            <p className="text-lg md:text-2xl text-slate-300">
              Заполните заявку, мы свяжемся в течение 1 рабочего дня
            </p>
          </div>

          <Card className="bg-slate-900/90 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 backdrop-blur-sm">
            <CardContent className="p-6 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm md:text-lg text-slate-200 mb-2 block font-semibold">
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
                  <label className="text-sm md:text-lg text-slate-200 mb-2 block font-semibold">
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
                  <label className="text-sm md:text-lg text-slate-200 mb-2 block font-semibold">
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
                  <label className="text-sm md:text-lg text-slate-200 mb-4 block font-semibold">
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
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-lg md:text-xl py-6 md:py-7 shadow-2xl shadow-cyan-500/50 hover:scale-105 transition-all"
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
          <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            DEOD
          </p>
          <p className="text-lg md:text-xl text-slate-300">
            Партнёрская программа для строительного рынка
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PartnerSystem;
