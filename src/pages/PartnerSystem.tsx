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
    
    // Генерируем уникальный partner_id
    const generatePartnerId = () => {
      const timestamp = Date.now().toString(36);
      const randomStr = Math.random().toString(36).substring(2, 7);
      return `${timestamp}-${randomStr}`.toUpperCase();
    };
    
    // Сохраняем профиль пользователя в localStorage
    const userProfile = {
      id: generatePartnerId(),
      name: formData.name,
      contact: formData.contact,
      asset: formData.asset,
      expectedIncome: formData.expectedIncome,
      registeredAt: Date.now()
    };
    
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
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
        {/* Animated Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.2) 0%, transparent 70%)`,
            transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0005})`,
          }}
        />
        
        {/* Animated Building Blueprints */}
        <div className="absolute inset-0">
          {/* Left Blueprint - Multi-story building */}
          <div className="absolute left-0 top-1/4 w-64 h-80 opacity-10 animate-blueprint-float-left">
            <svg viewBox="0 0 200 250" className="w-full h-full stroke-cyan-400 fill-none">
              <rect x="40" y="40" width="120" height="180" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="40" y1="80" x2="160" y2="80" strokeWidth="1" className="animate-draw-2" />
              <line x1="40" y1="120" x2="160" y2="120" strokeWidth="1" className="animate-draw-2" />
              <line x1="40" y1="160" x2="160" y2="160" strokeWidth="1" className="animate-draw-2" />
              <line x1="40" y1="200" x2="160" y2="200" strokeWidth="1" className="animate-draw-2" />
              <line x1="100" y1="40" x2="100" y2="220" strokeWidth="1" strokeDasharray="4" className="animate-draw-3" />
              <rect x="60" y="60" width="20" height="15" strokeWidth="1" className="animate-draw-4" />
              <rect x="120" y="60" width="20" height="15" strokeWidth="1" className="animate-draw-4" />
              <rect x="60" y="100" width="20" height="15" strokeWidth="1" className="animate-draw-4" />
              <rect x="120" y="100" width="20" height="15" strokeWidth="1" className="animate-draw-4" />
              {/* Dimension lines */}
              <line x1="30" y1="40" x2="30" y2="220" strokeWidth="0.5" className="animate-draw-5" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
              <line x1="40" y1="230" x2="160" y2="230" strokeWidth="0.5" className="animate-draw-5" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
              <text x="20" y="130" fill="currentColor" fontSize="10" className="animate-draw-5">18м</text>
              <text x="85" y="242" fill="currentColor" fontSize="10" className="animate-draw-5">12м</text>
            </svg>
          </div>

          {/* Right Blueprint - Floor plan */}
          <div className="absolute right-0 top-1/3 w-72 h-64 opacity-10 animate-blueprint-float-right">
            <svg viewBox="0 0 240 200" className="w-full h-full stroke-cyan-400 fill-none">
              <rect x="20" y="20" width="200" height="160" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="80" y1="20" x2="80" y2="180" strokeWidth="1" className="animate-draw-2" />
              <line x1="160" y1="20" x2="160" y2="180" strokeWidth="1" className="animate-draw-2" />
              <rect x="30" y="30" width="40" height="30" strokeWidth="1" className="animate-draw-3" />
              <rect x="90" y="30" width="60" height="30" strokeWidth="1" className="animate-draw-3" />
              <rect x="170" y="30" width="40" height="30" strokeWidth="1" className="animate-draw-3" />
              <circle cx="120" cy="100" r="30" strokeWidth="1" strokeDasharray="5" className="animate-draw-4" />
              <line x1="100" y1="140" x2="140" y2="140" strokeWidth="2" className="animate-draw-5" />
              {/* Dimension arrows */}
              <line x1="20" y1="10" x2="220" y2="10" strokeWidth="0.5" className="animate-draw-5" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
              <line x1="10" y1="20" x2="10" y2="180" strokeWidth="0.5" className="animate-draw-5" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
              <text x="105" y="8" fill="currentColor" fontSize="8" className="animate-draw-5">20м</text>
              <text x="2" y="105" fill="currentColor" fontSize="8" className="animate-draw-5">16м</text>
            </svg>
          </div>

          {/* Top Center Blueprint - A-frame building */}
          <div className="absolute left-1/3 top-10 w-48 h-56 opacity-8 animate-blueprint-float-center">
            <svg viewBox="0 0 150 180" className="w-full h-full stroke-blue-400 fill-none">
              <polygon points="75,20 140,60 140,160 10,160 10,60" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="75" y1="20" x2="75" y2="160" strokeWidth="1" strokeDasharray="3" className="animate-draw-2" />
              <rect x="30" y="80" width="25" height="20" strokeWidth="1" className="animate-draw-3" />
              <rect x="95" y="80" width="25" height="20" strokeWidth="1" className="animate-draw-3" />
              <rect x="30" y="120" width="25" height="20" strokeWidth="1" className="animate-draw-4" />
              <rect x="95" y="120" width="25" height="20" strokeWidth="1" className="animate-draw-4" />
              {/* Measurement lines */}
              <line x1="5" y1="60" x2="5" y2="160" strokeWidth="0.5" className="animate-draw-5" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
              <text x="1" y="115" fill="currentColor" fontSize="8" className="animate-draw-5" transform="rotate(-90 8 110)">10м</text>
            </svg>
          </div>

          {/* Bottom Right Small Blueprint */}
          <div className="absolute right-1/4 bottom-20 w-40 h-48 opacity-8 animate-blueprint-rotate">
            <svg viewBox="0 0 120 150" className="w-full h-full stroke-purple-400 fill-none">
              <rect x="30" y="30" width="60" height="90" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="30" y1="60" x2="90" y2="60" strokeWidth="1" className="animate-draw-2" />
              <line x1="30" y1="90" x2="90" y2="90" strokeWidth="1" className="animate-draw-2" />
              <rect x="40" y="40" width="12" height="15" strokeWidth="1" className="animate-draw-3" />
              <rect x="68" y="40" width="12" height="15" strokeWidth="1" className="animate-draw-3" />
              <line x1="25" y1="30" x2="25" y2="120" strokeWidth="0.5" className="animate-draw-4" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
            </svg>
          </div>

          {/* New: Bottom Left - Section view */}
          <div className="absolute left-10 bottom-32 w-56 h-64 opacity-9 animate-blueprint-slide-up">
            <svg viewBox="0 0 180 200" className="w-full h-full stroke-cyan-300 fill-none">
              <rect x="40" y="60" width="100" height="120" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="40" y1="100" x2="140" y2="100" strokeWidth="1" className="animate-draw-2" />
              <line x1="40" y1="140" x2="140" y2="140" strokeWidth="1" className="animate-draw-2" />
              <polygon points="35,60 90,30 145,60" strokeWidth="1" className="animate-draw-3" />
              {/* Stairs */}
              <line x1="80" y1="180" x2="80" y2="100" strokeWidth="1" className="animate-draw-4" />
              <line x1="70" y1="170" x2="80" y2="170" strokeWidth="1" className="animate-draw-4" />
              <line x1="70" y1="155" x2="80" y2="155" strokeWidth="1" className="animate-draw-4" />
              <line x1="70" y1="140" x2="80" y2="140" strokeWidth="1" className="animate-draw-4" />
              <line x1="70" y1="125" x2="80" y2="125" strokeWidth="1" className="animate-draw-4" />
              <line x1="70" y1="110" x2="80" y2="110" strokeWidth="1" className="animate-draw-4" />
              {/* Dimension */}
              <line x1="30" y1="60" x2="30" y2="180" strokeWidth="0.5" className="animate-draw-5" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
              <text x="18" y="125" fill="currentColor" fontSize="9" className="animate-draw-5">12м</text>
            </svg>
          </div>

          {/* New: Top Right - Detail drawing */}
          <div className="absolute right-16 top-16 w-52 h-52 opacity-9 animate-blueprint-pulse">
            <svg viewBox="0 0 160 160" className="w-full h-full stroke-blue-300 fill-none">
              <circle cx="80" cy="80" r="60" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="80" y1="20" x2="80" y2="140" strokeWidth="0.5" strokeDasharray="3" className="animate-draw-2" />
              <line x1="20" y1="80" x2="140" y2="80" strokeWidth="0.5" strokeDasharray="3" className="animate-draw-2" />
              <rect x="60" y="60" width="40" height="40" strokeWidth="1" className="animate-draw-3" />
              <line x1="50" y1="50" x2="110" y2="110" strokeWidth="1" strokeDasharray="2" className="animate-draw-4" />
              <line x1="110" y1="50" x2="50" y2="110" strokeWidth="1" strokeDasharray="2" className="animate-draw-4" />
              {/* Angle markers */}
              <path d="M 110 80 Q 105 75, 100 80" strokeWidth="0.5" className="animate-draw-5" />
              <text x="105" y="72" fill="currentColor" fontSize="7" className="animate-draw-5">45°</text>
            </svg>
          </div>

          {/* New: Middle Left - Elevation view */}
          <div className="absolute left-1/4 top-1/2 w-60 h-44 opacity-9 animate-blueprint-fade">
            <svg viewBox="0 0 200 140" className="w-full h-full stroke-purple-300 fill-none">
              <rect x="30" y="40" width="140" height="80" strokeWidth="1.5" className="animate-draw-1" />
              <rect x="40" y="30" width="120" height="10" strokeWidth="1" className="animate-draw-2" />
              <line x1="50" y1="50" x2="50" y2="120" strokeWidth="1" className="animate-draw-3" />
              <line x1="90" y1="50" x2="90" y2="120" strokeWidth="1" className="animate-draw-3" />
              <line x1="130" y1="50" x2="130" y2="120" strokeWidth="1" className="animate-draw-3" />
              {/* Windows */}
              <rect x="55" y="60" width="25" height="20" strokeWidth="1" className="animate-draw-4" />
              <rect x="95" y="60" width="25" height="20" strokeWidth="1" className="animate-draw-4" />
              <rect x="135" y="60" width="25" height="20" strokeWidth="1" className="animate-draw-4" />
              {/* Ground line */}
              <line x1="20" y1="120" x2="180" y2="120" strokeWidth="1.5" className="animate-draw-5" />
              <line x1="20" y1="125" x2="30" y2="115" strokeWidth="0.8" className="animate-draw-5" />
              <line x1="40" y1="125" x2="50" y2="115" strokeWidth="0.8" className="animate-draw-5" />
            </svg>
          </div>

          {/* New: Center Bottom - Foundation detail */}
          <div className="absolute left-1/2 bottom-24 w-48 h-40 opacity-8 animate-blueprint-float-slow">
            <svg viewBox="0 0 150 120" className="w-full h-full stroke-cyan-300 fill-none">
              <rect x="40" y="20" width="70" height="60" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="40" y1="40" x2="110" y2="40" strokeWidth="1" className="animate-draw-2" />
              <rect x="35" y="80" width="80" height="15" strokeWidth="1.5" className="animate-draw-3" />
              {/* Hatching for foundation */}
              <line x1="40" y1="85" x2="50" y2="95" strokeWidth="0.5" className="animate-draw-4" />
              <line x1="50" y1="85" x2="60" y2="95" strokeWidth="0.5" className="animate-draw-4" />
              <line x1="60" y1="85" x2="70" y2="95" strokeWidth="0.5" className="animate-draw-4" />
              <line x1="70" y1="85" x2="80" y2="95" strokeWidth="0.5" className="animate-draw-4" />
              <line x1="80" y1="85" x2="90" y2="95" strokeWidth="0.5" className="animate-draw-4" />
              <line x1="90" y1="85" x2="100" y2="95" strokeWidth="0.5" className="animate-draw-4" />
              <line x1="100" y1="85" x2="110" y2="95" strokeWidth="0.5" className="animate-draw-4" />
              {/* Dimension */}
              <line x1="40" y1="105" x2="110" y2="105" strokeWidth="0.5" className="animate-draw-5" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
              <text x="65" y="115" fill="currentColor" fontSize="8" className="animate-draw-5">7м</text>
            </svg>
          </div>
        </div>

        {/* Grid overlay */}
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

      {/* Three Pillars */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Background Blueprints */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute right-10 top-20 w-48 h-56 animate-blueprint-fade">
            <svg viewBox="0 0 150 180" className="w-full h-full stroke-cyan-400 fill-none">
              <rect x="30" y="40" width="90" height="120" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="30" y1="70" x2="120" y2="70" strokeWidth="1" className="animate-draw-2" />
              <line x1="30" y1="100" x2="120" y2="100" strokeWidth="1" className="animate-draw-2" />
              <line x1="30" y1="130" x2="120" y2="130" strokeWidth="1" className="animate-draw-2" />
              <rect x="45" y="55" width="15" height="12" strokeWidth="1" className="animate-draw-3" />
              <rect x="90" y="55" width="15" height="12" strokeWidth="1" className="animate-draw-3" />
              <line x1="25" y1="40" x2="25" y2="160" strokeWidth="0.5" className="animate-draw-4" />
              <text x="15" y="100" fill="currentColor" fontSize="8" className="animate-draw-5">12м</text>
            </svg>
          </div>
          <div className="absolute left-16 bottom-32 w-44 h-44 animate-blueprint-pulse">
            <svg viewBox="0 0 140 140" className="w-full h-full stroke-blue-400 fill-none">
              <circle cx="70" cy="70" r="50" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="70" y1="20" x2="70" y2="120" strokeWidth="0.5" strokeDasharray="3" className="animate-draw-2" />
              <line x1="20" y1="70" x2="120" y2="70" strokeWidth="0.5" strokeDasharray="3" className="animate-draw-2" />
              <rect x="55" y="55" width="30" height="30" strokeWidth="1" className="animate-draw-3" />
              <path d="M 85 70 Q 90 65, 95 70" strokeWidth="0.5" className="animate-draw-4" />
              <text x="92" y="63" fill="currentColor" fontSize="6" className="animate-draw-5">90°</text>
            </svg>
          </div>
          <div className="absolute right-1/3 top-1/3 w-36 h-40 animate-blueprint-float-slow opacity-60">
            <svg viewBox="0 0 120 130" className="w-full h-full stroke-purple-400 fill-none">
              <rect x="30" y="30" width="60" height="80" strokeWidth="1" className="animate-draw-1" />
              <line x1="30" y1="55" x2="90" y2="55" strokeWidth="0.8" className="animate-draw-2" />
              <line x1="30" y1="80" x2="90" y2="80" strokeWidth="0.8" className="animate-draw-2" />
              <rect x="40" y="40" width="12" height="10" strokeWidth="0.8" className="animate-draw-3" />
              <rect x="68" y="40" width="12" height="10" strokeWidth="0.8" className="animate-draw-3" />
              <line x1="20" y1="30" x2="20" y2="110" strokeWidth="0.5" className="animate-draw-4" />
              <text x="12" y="75" fill="currentColor" fontSize="7" className="animate-draw-5">8м</text>
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-center mb-8 md:mb-20 px-4">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Как это работает
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: 'Building2',
                title: '1. Вы приводите проект',
                subtitle: 'Строительство, проектирование, инжиниринг',
                description: 'Любой проект от 100 млн ₽: жилые комплексы, торговые центры, промышленные объекты, инфраструктура.',
                gradient: 'from-cyan-500 to-blue-600',
                glow: 'shadow-cyan-500/30',
              },
              {
                icon: 'Users',
                title: '2. Мы делаем проект',
                subtitle: 'Полный цикл: от проектирования до сдачи',
                description: 'Наша команда берёт проект в работу — вам не нужно ничего делать. Архитектура, конструктив, инженерия, строительство.',
                gradient: 'from-blue-500 to-purple-600',
                glow: 'shadow-blue-500/30',
              },
              {
                icon: 'Wallet',
                title: '3. Вы получаете доход',
                subtitle: 'До 18% от стоимости проекта',
                description: 'Деньги перечисляются поэтапно по ходу реализации проекта. Плюс 5% с продаж вашей команды партнёров.',
                gradient: 'from-purple-600 to-purple-700',
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
                  <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 text-cyan-400">{pillar.title}</h3>
                  <p className="text-sm md:text-lg font-semibold text-white mb-3 md:mb-4">{pillar.subtitle}</p>
                  <p className="text-xs md:text-base text-slate-400 leading-relaxed">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-slate-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Blueprints for this section */}
        <div className="absolute inset-0 opacity-6">
          <div className="absolute left-8 top-24 w-52 h-60 animate-blueprint-slide-up">
            <svg viewBox="0 0 170 200" className="w-full h-full stroke-cyan-300 fill-none">
              <polygon points="85,20 150,50 150,180 20,180 20,50" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="85" y1="20" x2="85" y2="180" strokeWidth="1" strokeDasharray="4" className="animate-draw-2" />
              <rect x="40" y="70" width="30" height="25" strokeWidth="1" className="animate-draw-3" />
              <rect x="100" y="70" width="30" height="25" strokeWidth="1" className="animate-draw-3" />
              <rect x="40" y="120" width="30" height="25" strokeWidth="1" className="animate-draw-4" />
              <rect x="100" y="120" width="30" height="25" strokeWidth="1" className="animate-draw-4" />
              <line x1="10" y1="50" x2="10" y2="180" strokeWidth="0.5" className="animate-draw-5" />
              <text x="3" y="120" fill="currentColor" fontSize="8" className="animate-draw-5">13м</text>
            </svg>
          </div>
          <div className="absolute right-12 bottom-16 w-56 h-48 animate-blueprint-rotate">
            <svg viewBox="0 0 180 150" className="w-full h-full stroke-purple-300 fill-none">
              <rect x="30" y="30" width="120" height="90" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="50" y1="30" x2="50" y2="120" strokeWidth="1" className="animate-draw-2" />
              <line x1="90" y1="30" x2="90" y2="120" strokeWidth="1" className="animate-draw-2" />
              <line x1="130" y1="30" x2="130" y2="120" strokeWidth="1" className="animate-draw-2" />
              <rect x="35" y="40" width="12" height="15" strokeWidth="1" className="animate-draw-3" />
              <rect x="95" y="40" width="12" height="15" strokeWidth="1" className="animate-draw-3" />
              <line x1="30" y1="140" x2="150" y2="140" strokeWidth="0.5" className="animate-draw-4" />
              <text x="80" y="148" fill="currentColor" fontSize="7" className="animate-draw-5">12м</text>
            </svg>
          </div>
          <div className="absolute left-1/3 bottom-1/4 w-40 h-44 animate-blueprint-float-center opacity-60">
            <svg viewBox="0 0 130 140" className="w-full h-full stroke-blue-400 fill-none">
              <rect x="25" y="30" width="80" height="90" strokeWidth="1" className="animate-draw-1" />
              <line x1="25" y1="60" x2="105" y2="60" strokeWidth="0.8" className="animate-draw-2" />
              <line x1="25" y1="90" x2="105" y2="90" strokeWidth="0.8" className="animate-draw-2" />
              <line x1="65" y1="30" x2="65" y2="120" strokeWidth="0.8" strokeDasharray="3" className="animate-draw-3" />
              <rect x="35" y="40" width="15" height="15" strokeWidth="0.8" className="animate-draw-4" />
              <rect x="75" y="40" width="15" height="15" strokeWidth="0.8" className="animate-draw-4" />
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-center mb-4 md:mb-6 text-cyan-400 px-4">
            Пример проекта
          </h2>
          <p className="text-base md:text-3xl text-slate-300 text-center mb-12 md:mb-16 font-light px-4">
            Жилой комплекс за 500 млн ₽
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-1/3 left-[16.6%] right-[16.6%] h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
            
            {[
              {
                step: '01',
                title: 'Вы находите проект',
                description: 'Застройщик ищет подрядчика на строительство ЖК. Вы передаёте нам контакты и ТЗ.',
                icon: 'Search',
                color: 'from-cyan-500 to-cyan-600',
              },
              {
                step: '02',
                title: 'Мы ведём проект',
                description: 'Наши архитекторы, конструкторы, сметчики готовят проектную документацию. Строители реализуют.',
                icon: 'FileText',
                color: 'from-blue-500 to-blue-600',
              },
              {
                step: '03',
                title: 'Вы получаете 90 млн',
                description: '18% от 500 млн = 90 млн ₽ вам. Выплаты поэтапно по ходу строительства.',
                icon: 'Wallet',
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
                      <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 text-cyan-400">{step.title}</h3>
                      <p className="text-xs md:text-base text-slate-300 leading-relaxed">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Blueprints for statistics */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute right-20 top-16 w-64 h-72 animate-blueprint-float-right">
            <svg viewBox="0 0 200 220" className="w-full h-full stroke-blue-400 fill-none">
              <rect x="40" y="30" width="120" height="160" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="40" y1="70" x2="160" y2="70" strokeWidth="1" className="animate-draw-2" />
              <line x1="40" y1="110" x2="160" y2="110" strokeWidth="1" className="animate-draw-2" />
              <line x1="40" y1="150" x2="160" y2="150" strokeWidth="1" className="animate-draw-2" />
              <line x1="100" y1="30" x2="100" y2="190" strokeWidth="1" strokeDasharray="4" className="animate-draw-3" />
              <rect x="60" y="50" width="20" height="15" strokeWidth="1" className="animate-draw-4" />
              <rect x="120" y="50" width="20" height="15" strokeWidth="1" className="animate-draw-4" />
              <rect x="60" y="90" width="20" height="15" strokeWidth="1" className="animate-draw-4" />
              <rect x="120" y="90" width="20" height="15" strokeWidth="1" className="animate-draw-4" />
              <rect x="60" y="130" width="20" height="15" strokeWidth="1" className="animate-draw-5" />
              <rect x="120" y="130" width="20" height="15" strokeWidth="1" className="animate-draw-5" />
            </svg>
          </div>
          <div className="absolute left-10 bottom-20 w-48 h-52 animate-blueprint-float-left">
            <svg viewBox="0 0 150 160" className="w-full h-full stroke-cyan-300 fill-none">
              <rect x="30" y="40" width="90" height="100" strokeWidth="1.5" className="animate-draw-1" />
              <polygon points="75,10 130,40 20,40" strokeWidth="1.5" className="animate-draw-2" />
              <line x1="75" y1="10" x2="75" y2="140" strokeWidth="1" strokeDasharray="3" className="animate-draw-3" />
              <rect x="45" y="60" width="20" height="18" strokeWidth="1" className="animate-draw-4" />
              <rect x="85" y="60" width="20" height="18" strokeWidth="1" className="animate-draw-4" />
              <rect x="45" y="100" width="20" height="18" strokeWidth="1" className="animate-draw-5" />
              <rect x="85" y="100" width="20" height="18" strokeWidth="1" className="animate-draw-5" />
              <line x1="20" y1="40" x2="130" y2="40" strokeWidth="0.5" className="animate-draw-5" />
              <text x="65" y="35" fill="currentColor" fontSize="7" className="animate-draw-5">11м</text>
            </svg>
          </div>
          <div className="absolute right-1/4 top-1/4 w-42 h-46 animate-blueprint-pulse opacity-60">
            <svg viewBox="0 0 135 145" className="w-full h-full stroke-purple-300 fill-none">
              <rect x="30" y="30" width="75" height="95" strokeWidth="1" className="animate-draw-1" />
              <line x1="30" y1="65" x2="105" y2="65" strokeWidth="0.8" className="animate-draw-2" />
              <line x1="30" y1="95" x2="105" y2="95" strokeWidth="0.8" className="animate-draw-2" />
              <rect x="40" y="40" width="18" height="20" strokeWidth="0.8" className="animate-draw-3" />
              <rect x="77" y="40" width="18" height="20" strokeWidth="0.8" className="animate-draw-3" />
              <rect x="40" y="75" width="18" height="15" strokeWidth="0.8" className="animate-draw-4" />
              <rect x="77" y="75" width="18" height="15" strokeWidth="0.8" className="animate-draw-4" />
              <line x1="20" y1="30" x2="20" y2="125" strokeWidth="0.5" className="animate-draw-5" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-center mb-4 md:mb-6 px-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Потенциал программы
            </span>
          </h2>
          <p className="text-base md:text-2xl text-slate-300 text-center mb-12 md:mb-16 px-4">
            Реальные цифры из проектов
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-blue-600/10 border-cyan-500/30 hover:border-cyan-400 transition-all shadow-xl shadow-cyan-500/20">
              <CardContent className="p-6 md:p-12 text-center">
                <p className="text-xs md:text-base text-slate-400 mb-3 md:mb-4">Общий объем проектов за 2 года</p>
                <p className="text-3xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 animate-pulse">
                  50 млрд ₽
                </p>
                <div className="w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mt-4" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 via-purple-600/10 to-purple-700/10 border-purple-500/30 hover:border-purple-400 transition-all shadow-xl shadow-purple-500/20">
              <CardContent className="p-6 md:p-12 text-center">
                <p className="text-xs md:text-base text-slate-400 mb-3 md:mb-4">Доход амбассадора за год</p>
                <p className="text-3xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent mb-2 animate-pulse">
                  1.5 млрд ₽
                </p>
                <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mt-4" />
              </CardContent>
            </Card>
          </div>

          <h3 className="text-xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-cyan-400 px-4">
            Примеры партнёров
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Начальник отдела тендеров',
                time: '5 проектов по 200 млн',
                network: 'Работает один, без команды',
                income: '180 млн ₽',
                period: 'годовой доход (18%)',
                gradient: 'from-cyan-500/20 to-blue-600/20',
                border: 'border-cyan-500/30',
              },
              {
                title: 'Главный инженер стройки',
                time: '10 проектов по 300 млн',
                network: 'Собрал команду 10 партнёров',
                income: '1.04 млрд ₽',
                period: 'год (540млн + 500млн от команды)',
                gradient: 'from-purple-500/20 to-purple-700/20',
                border: 'border-purple-500/30',
              },
            ].map((profile, idx) => (
              <Card key={idx} className={`bg-gradient-to-br ${profile.gradient} ${profile.border} hover:scale-105 transition-all backdrop-blur-sm`}>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-xl">
                      <Icon name="User" size={24} className="text-white md:w-8 md:h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-xl font-bold text-white mb-1 md:mb-2">{profile.title}</h3>
                      <p className="text-xs md:text-sm text-slate-400 mb-1">{profile.time}</p>
                      <p className="text-xs md:text-sm text-cyan-400 font-semibold mb-4 md:mb-6">{profile.network}</p>
                      <div className="border-t border-slate-700 pt-3 md:pt-4">
                        <p className="text-2xl md:text-4xl font-bold text-cyan-400 mb-1">{profile.income}</p>
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
        
        {/* Blueprints for roadmap */}
        <div className="absolute inset-0 opacity-6">
          <div className="absolute left-1/4 top-12 w-44 h-48 animate-blueprint-float-center">
            <svg viewBox="0 0 140 150" className="w-full h-full stroke-purple-400 fill-none">
              <rect x="30" y="30" width="80" height="100" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="30" y1="60" x2="110" y2="60" strokeWidth="1" className="animate-draw-2" />
              <line x1="30" y1="90" x2="110" y2="90" strokeWidth="1" className="animate-draw-2" />
              <rect x="40" y="40" width="15" height="15" strokeWidth="1" className="animate-draw-3" />
              <rect x="85" y="40" width="15" height="15" strokeWidth="1" className="animate-draw-3" />
              <rect x="40" y="70" width="15" height="15" strokeWidth="1" className="animate-draw-4" />
              <rect x="85" y="70" width="15" height="15" strokeWidth="1" className="animate-draw-4" />
              <line x1="30" y1="140" x2="110" y2="140" strokeWidth="0.5" className="animate-draw-5" />
              <text x="60" y="147" fill="currentColor" fontSize="7" className="animate-draw-5">8м</text>
            </svg>
          </div>
          <div className="absolute right-1/4 bottom-24 w-52 h-56 animate-blueprint-pulse">
            <svg viewBox="0 0 160 180" className="w-full h-full stroke-cyan-400 fill-none">
              <circle cx="80" cy="90" r="60" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="80" y1="30" x2="80" y2="150" strokeWidth="0.5" strokeDasharray="3" className="animate-draw-2" />
              <line x1="20" y1="90" x2="140" y2="90" strokeWidth="0.5" strokeDasharray="3" className="animate-draw-2" />
              <rect x="60" y="70" width="40" height="40" strokeWidth="1" className="animate-draw-3" />
              <line x1="50" y1="50" x2="110" y2="130" strokeWidth="1" strokeDasharray="2" className="animate-draw-4" />
              <path d="M 100 90 Q 105 85, 110 90" strokeWidth="0.5" className="animate-draw-5" />
              <text x="106" y="82" fill="currentColor" fontSize="6" className="animate-draw-5">45°</text>
            </svg>
          </div>
          <div className="absolute left-12 bottom-1/3 w-38 h-42 animate-blueprint-slide-up opacity-60">
            <svg viewBox="0 0 125 135" className="w-full h-full stroke-blue-300 fill-none">
              <polygon points="62,15 115,40 115,120 10,120 10,40" strokeWidth="1" className="animate-draw-1" />
              <line x1="62" y1="15" x2="62" y2="120" strokeWidth="0.8" strokeDasharray="3" className="animate-draw-2" />
              <rect x="30" y="60" width="20" height="18" strokeWidth="0.8" className="animate-draw-3" />
              <rect x="75" y="60" width="20" height="18" strokeWidth="0.8" className="animate-draw-3" />
              <rect x="30" y="92" width="20" height="18" strokeWidth="0.8" className="animate-draw-4" />
              <rect x="75" y="92" width="20" height="18" strokeWidth="0.8" className="animate-draw-4" />
            </svg>
          </div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-center mb-4 md:mb-6 text-cyan-400 px-4">
            Как расти в программе
          </h2>
          <p className="text-base md:text-xl text-slate-300 text-center mb-12 md:mb-16 px-4">
            4 уровня партнёрства
          </p>
          
          <div className="relative">
            {/* Progress line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {[
                {
                  title: 'Партнёр',
                  period: 'Уровень 1',
                  focus: '1-3 проекта в год от 100 млн. Работаете самостоятельно.',
                  income: 'До 180 млн/год',
                  color: 'from-cyan-500 to-cyan-600',
                  icon: 'Building2',
                },
                {
                  title: 'Старший партнёр',
                  period: 'Уровень 2',
                  focus: '5-7 проектов в год. Привлекаете 2-3 партнёров.',
                  income: 'До 500 млн/год',
                  color: 'from-blue-500 to-blue-600',
                  icon: 'Users',
                },
                {
                  title: 'Региональный',
                  period: 'Уровень 3',
                  focus: '10+ проектов. Команда 10 партнёров. Закреплён регион.',
                  income: 'До 1 млрд/год',
                  color: 'from-purple-500 to-purple-600',
                  icon: 'MapPin',
                },
                {
                  title: 'Амбассадор',
                  period: 'Уровень 4',
                  focus: 'Многоуровневая сеть 20+ партнёров. Крупные проекты 500+ млн.',
                  income: '1.5+ млрд/год',
                  color: 'from-purple-600 to-purple-700',
                  icon: 'Crown',
                },
              ].map((stage, idx) => (
                <div key={idx} className="relative z-10">
                  <Card className="bg-slate-900/90 border-cyan-500/30 hover:border-cyan-400 transition-all h-full backdrop-blur-sm hover:scale-105 shadow-xl">
                    <CardContent className="p-6 md:p-8">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${stage.color} mx-auto mb-6 flex items-center justify-center shadow-2xl`}>
                        <Icon name={stage.icon as any} size={28} className="text-white" />
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold text-center mb-2 text-cyan-400">{stage.title}</h3>
                      <p className="text-xs md:text-sm text-slate-500 text-center mb-4 md:mb-6">{stage.period}</p>
                      <p className="text-xs md:text-sm text-slate-300 mb-6 md:mb-8 min-h-[60px] md:min-h-[80px]">{stage.focus}</p>
                      <div className="text-center pt-4 md:pt-6 border-t border-slate-700">
                        <p className="text-xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
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
      <section id="calculator" className="py-16 md:py-24 relative overflow-hidden">
        {/* Blueprints for calculator */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute left-8 top-32 w-60 h-64 animate-blueprint-slide-up">
            <svg viewBox="0 0 190 200" className="w-full h-full stroke-blue-300 fill-none">
              <rect x="40" y="40" width="110" height="140" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="40" y1="80" x2="150" y2="80" strokeWidth="1" className="animate-draw-2" />
              <line x1="40" y1="120" x2="150" y2="120" strokeWidth="1" className="animate-draw-2" />
              <line x1="40" y1="160" x2="150" y2="160" strokeWidth="1" className="animate-draw-2" />
              <line x1="95" y1="40" x2="95" y2="180" strokeWidth="1" strokeDasharray="3" className="animate-draw-3" />
              <rect x="55" y="60" width="18" height="15" strokeWidth="1" className="animate-draw-4" />
              <rect x="115" y="60" width="18" height="15" strokeWidth="1" className="animate-draw-4" />
              <rect x="55" y="100" width="18" height="15" strokeWidth="1" className="animate-draw-5" />
              <rect x="115" y="100" width="18" height="15" strokeWidth="1" className="animate-draw-5" />
              <line x1="30" y1="40" x2="30" y2="180" strokeWidth="0.5" className="animate-draw-5" />
              <text x="18" y="115" fill="currentColor" fontSize="8" className="animate-draw-5">14м</text>
            </svg>
          </div>
          <div className="absolute right-12 bottom-28 w-56 h-60 animate-blueprint-rotate">
            <svg viewBox="0 0 180 190" className="w-full h-full stroke-purple-300 fill-none">
              <polygon points="90,20 160,60 160,170 20,170 20,60" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="90" y1="20" x2="90" y2="170" strokeWidth="1" strokeDasharray="4" className="animate-draw-2" />
              <rect x="40" y="80" width="35" height="30" strokeWidth="1" className="animate-draw-3" />
              <rect x="105" y="80" width="35" height="30" strokeWidth="1" className="animate-draw-3" />
              <rect x="40" y="125" width="35" height="30" strokeWidth="1" className="animate-draw-4" />
              <rect x="105" y="125" width="35" height="30" strokeWidth="1" className="animate-draw-4" />
              <line x1="20" y1="180" x2="160" y2="180" strokeWidth="0.5" className="animate-draw-5" />
              <text x="80" y="188" fill="currentColor" fontSize="7" className="animate-draw-5">14м</text>
            </svg>
          </div>
          <div className="absolute right-1/3 top-1/3 w-44 h-48 animate-blueprint-float-center opacity-60">
            <svg viewBox="0 0 140 150" className="w-full h-full stroke-cyan-400 fill-none">
              <rect x="30" y="30" width="80" height="100" strokeWidth="1" className="animate-draw-1" />
              <line x1="30" y1="60" x2="110" y2="60" strokeWidth="0.8" className="animate-draw-2" />
              <line x1="30" y1="90" x2="110" y2="90" strokeWidth="0.8" className="animate-draw-2" />
              <line x1="70" y1="30" x2="70" y2="130" strokeWidth="0.8" strokeDasharray="3" className="animate-draw-3" />
              <rect x="40" y="40" width="15" height="15" strokeWidth="0.8" className="animate-draw-4" />
              <rect x="85" y="40" width="15" height="15" strokeWidth="0.8" className="animate-draw-4" />
              <rect x="40" y="70" width="15" height="15" strokeWidth="0.8" className="animate-draw-5" />
              <rect x="85" y="70" width="15" height="15" strokeWidth="0.8" className="animate-draw-5" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
          <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-center mb-4 md:mb-6 px-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Спроектируйте свой доход
            </span>
          </h2>
          <p className="text-base md:text-xl text-slate-300 text-center mb-8 md:mb-12 px-4">
            Минималистичный инженерный калькулятор
          </p>

          <Card className="bg-slate-900/90 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 backdrop-blur-sm">
            <CardContent className="p-6 md:p-12">
              <div className="space-y-8 md:space-y-10">
                <div>
                  <label className="text-sm md:text-lg text-slate-200 mb-3 md:mb-4 block font-semibold">
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
                  <label className="text-sm md:text-lg text-slate-200 mb-3 md:mb-4 block font-semibold">
                    Какой средний бюджет ваших проектов?
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                    {[100, 250, 500, 750, 1000].map((budget) => (
                      <Button
                        key={budget}
                        onClick={() => setCalculatorData({ ...calculatorData, avgBudget: budget })}
                        className={`text-xs md:text-base py-4 md:py-6 ${
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
                  <label className="text-sm md:text-lg text-slate-200 mb-3 md:mb-4 block font-semibold">
                    Будете ли строить команду из 10+ партнёров?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <Button
                      onClick={() => setCalculatorData({ ...calculatorData, buildTeam: true })}
                      className={`text-sm md:text-lg py-4 md:py-6 ${
                        calculatorData.buildTeam
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50'
                          : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-cyan-500'
                      }`}
                    >
                      Да (+500 млн от сети)
                    </Button>
                    <Button
                      onClick={() => setCalculatorData({ ...calculatorData, buildTeam: false })}
                      className={`text-sm md:text-lg py-4 md:py-6 ${
                        !calculatorData.buildTeam
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50'
                          : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-cyan-500'
                      }`}
                    >
                      Только личные продажи
                    </Button>
                  </div>
                </div>

                <div className="pt-8 md:pt-10 border-t-2 border-cyan-500/30">
                  <p className="text-base md:text-xl text-slate-300 mb-3 md:mb-4 text-center">
                    Ваш годовой доход:
                  </p>
                  <p className="text-5xl md:text-8xl font-bold text-center bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2 md:mb-3 animate-gradient bg-300%">
                    {calculateIncome()}
                  </p>
                  <p className="text-xl md:text-3xl text-center text-slate-400 mb-3 md:mb-4">млрд рублей</p>

                  <p className="text-xs md:text-sm text-slate-500 text-center mb-6 md:mb-8">
                    Расчёт: личные продажи (18%) + доход от сети партнёров (5%)
                  </p>
                  <Button
                    onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-sm md:text-xl py-5 md:py-7 shadow-2xl shadow-cyan-500/50 hover:scale-105 transition-all"
                  >
Подать заявку
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
        {/* Blueprints for form */}
        <div className="absolute inset-0 opacity-6">
          <div className="absolute left-16 top-20 w-48 h-56 animate-blueprint-float-left">
            <svg viewBox="0 0 150 180" className="w-full h-full stroke-cyan-400 fill-none">
              <rect x="30" y="40" width="90" height="120" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="30" y1="75" x2="120" y2="75" strokeWidth="1" className="animate-draw-2" />
              <line x1="30" y1="110" x2="120" y2="110" strokeWidth="1" className="animate-draw-2" />
              <line x1="30" y1="145" x2="120" y2="145" strokeWidth="1" className="animate-draw-2" />
              <rect x="45" y="55" width="20" height="15" strokeWidth="1" className="animate-draw-3" />
              <rect x="85" y="55" width="20" height="15" strokeWidth="1" className="animate-draw-3" />
              <rect x="45" y="90" width="20" height="15" strokeWidth="1" className="animate-draw-4" />
              <rect x="85" y="90" width="20" height="15" strokeWidth="1" className="animate-draw-4" />
              <line x1="30" y1="170" x2="120" y2="170" strokeWidth="0.5" className="animate-draw-5" />
              <text x="65" y="177" fill="currentColor" fontSize="7" className="animate-draw-5">9м</text>
            </svg>
          </div>
          <div className="absolute right-20 bottom-32 w-52 h-52 animate-blueprint-pulse">
            <svg viewBox="0 0 160 160" className="w-full h-full stroke-blue-400 fill-none">
              <circle cx="80" cy="80" r="60" strokeWidth="1.5" className="animate-draw-1" />
              <line x1="80" y1="20" x2="80" y2="140" strokeWidth="0.5" strokeDasharray="3" className="animate-draw-2" />
              <line x1="20" y1="80" x2="140" y2="80" strokeWidth="0.5" strokeDasharray="3" className="animate-draw-2" />
              <rect x="60" y="60" width="40" height="40" strokeWidth="1" className="animate-draw-3" />
              <line x1="50" y1="50" x2="110" y2="110" strokeWidth="1" strokeDasharray="2" className="animate-draw-4" />
              <line x1="110" y1="50" x2="50" y2="110" strokeWidth="1" strokeDasharray="2" className="animate-draw-4" />
              <circle cx="80" cy="80" r="15" strokeWidth="0.8" className="animate-draw-5" />
              <path d="M 95 80 Q 100 75, 105 80" strokeWidth="0.5" className="animate-draw-5" />
            </svg>
          </div>
          <div className="absolute left-1/3 bottom-1/4 w-40 h-44 animate-blueprint-rotate opacity-60">
            <svg viewBox="0 0 130 140" className="w-full h-full stroke-purple-300 fill-none">
              <polygon points="65,20 120,50 120,120 10,120 10,50" strokeWidth="1" className="animate-draw-1" />
              <line x1="65" y1="20" x2="65" y2="120" strokeWidth="0.8" strokeDasharray="3" className="animate-draw-2" />
              <rect x="30" y="65" width="25" height="20" strokeWidth="0.8" className="animate-draw-3" />
              <rect x="75" y="65" width="25" height="20" strokeWidth="0.8" className="animate-draw-3" />
              <rect x="30" y="95" width="25" height="15" strokeWidth="0.8" className="animate-draw-4" />
              <rect x="75" y="95" width="25" height="15" strokeWidth="0.8" className="animate-draw-4" />
            </svg>
          </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)]" />
        
        <div className="container mx-auto px-4 md:px-6 max-w-3xl relative z-10">
          <div className="text-center mb-12">

            <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 px-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                Стать партнёром
              </span>
            </h2>
            <p className="text-base md:text-2xl text-slate-300 leading-relaxed px-4">
              Заполните заявку ниже, мы свяжемся в течение 1 рабочего дня
            </p>
          </div>

          <Card className="bg-slate-900/90 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 backdrop-blur-sm">
            <CardContent className="p-6 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div>
                  <label className="text-sm md:text-lg text-slate-200 mb-2 md:mb-3 block font-semibold">
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
                  <label className="text-sm md:text-lg text-slate-200 mb-2 md:mb-3 block font-semibold">
                    Телефон / Telegram
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500 text-sm md:text-lg py-4 md:py-6"
                    placeholder="+7 (___) ___-__-__ или @username"
                  />
                </div>

                <div>
                  <label className="text-sm md:text-lg text-slate-200 mb-2 md:mb-3 block font-semibold">
                    Главный профессиональный актив
                  </label>
                  <select
                    required
                    value={formData.asset}
                    onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
                    className="w-full px-3 md:px-4 py-3 md:py-4 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-cyan-500 text-sm md:text-lg"
                  >
                    <option value="">Выберите вариант</option>
                    <option value="connections">Глубокие отраслевые связи</option>
                    <option value="tenders">Опыт в госзакупках/тендерах</option>
                    <option value="expertise">Экспертиза в строительстве/проектировании</option>
                    <option value="team">Управляю командой продаж</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm md:text-lg text-slate-200 mb-3 md:mb-4 block font-semibold">
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
                    <span className="text-cyan-400 font-bold text-base md:text-xl">
                      {formData.expectedIncome >= 1000 ? '1+ млрд' : `${formData.expectedIncome}+ млн`} ₽
                    </span>
                    <span>1 млрд</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-base md:text-xl py-5 md:py-7 mt-6 md:mt-8 shadow-2xl shadow-cyan-500/50 hover:scale-105 transition-all"
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
          <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-3 md:mb-4 animate-gradient bg-300%">
            DEOD
          </p>
          <p className="text-base md:text-xl text-slate-300 font-light">
            Партнёрская программа для строительного рынка
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes blueprint-float-left {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-40px) translateX(30px) rotate(3deg);
            opacity: 0.15;
          }
        }

        @keyframes blueprint-float-right {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(30px) translateX(-40px) rotate(-5deg);
            opacity: 0.15;
          }
        }

        @keyframes blueprint-float-center {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.08;
          }
          50% {
            transform: translateY(-20px) scale(1.05);
            opacity: 0.12;
          }
        }

        @keyframes blueprint-rotate {
          0%, 100% {
            transform: rotate(0deg) translateY(0);
            opacity: 0.08;
          }
          50% {
            transform: rotate(10deg) translateY(-15px);
            opacity: 0.12;
          }
        }

        @keyframes blueprint-slide-up {
          0%, 100% {
            transform: translateY(0) rotate(-2deg);
            opacity: 0.09;
          }
          50% {
            transform: translateY(-25px) rotate(2deg);
            opacity: 0.14;
          }
        }

        @keyframes blueprint-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.09;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.14;
          }
        }

        @keyframes blueprint-fade {
          0%, 100% {
            transform: translateX(0);
            opacity: 0.09;
          }
          50% {
            transform: translateX(15px);
            opacity: 0.13;
          }
        }

        @keyframes blueprint-float-slow {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.08;
          }
          50% {
            transform: translateY(-30px) translateX(-20px);
            opacity: 0.12;
          }
        }

        @keyframes draw-1 {
          0% {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes draw-2 {
          0% {
            stroke-dasharray: 500;
            stroke-dashoffset: 500;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes draw-3 {
          0% {
            stroke-dasharray: 300;
            stroke-dashoffset: 300;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes draw-4 {
          0% {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes draw-5 {
          0% {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .animate-blueprint-float-left {
          animation: blueprint-float-left 20s ease-in-out infinite;
        }

        .animate-blueprint-float-right {
          animation: blueprint-float-right 25s ease-in-out infinite;
        }

        .animate-blueprint-float-center {
          animation: blueprint-float-center 18s ease-in-out infinite;
        }

        .animate-blueprint-rotate {
          animation: blueprint-rotate 22s ease-in-out infinite;
        }

        .animate-blueprint-slide-up {
          animation: blueprint-slide-up 19s ease-in-out infinite;
        }

        .animate-blueprint-pulse {
          animation: blueprint-pulse 16s ease-in-out infinite;
        }

        .animate-blueprint-fade {
          animation: blueprint-fade 21s ease-in-out infinite;
        }

        .animate-blueprint-float-slow {
          animation: blueprint-float-slow 24s ease-in-out infinite;
        }

        .animate-draw-1 {
          stroke-dasharray: 1000;
          animation: draw-1 8s ease-in-out infinite;
        }

        .animate-draw-2 {
          stroke-dasharray: 500;
          animation: draw-2 6s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-draw-3 {
          stroke-dasharray: 300;
          animation: draw-3 5s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-draw-4 {
          stroke-dasharray: 200;
          animation: draw-4 4s ease-in-out infinite;
          animation-delay: 3s;
        }

        .animate-draw-5 {
          stroke-dasharray: 100;
          animation: draw-5 3s ease-in-out infinite;
          animation-delay: 4s;
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