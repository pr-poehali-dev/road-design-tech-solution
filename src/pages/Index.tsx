import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputMask from 'react-input-mask';

const Index = () => {
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [activeTech, setActiveTech] = useState('cement');
  const [calcData, setCalcData] = useState({
    objectType: '',
    length: [5],
    soilType: '',
    roadCategory: ''
  });
  const [showCalcResult, setShowCalcResult] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isPhoneValid = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 11;
  };
  
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [chatData, setChatData] = useState({
    projectType: '',
    timeline: '',
    name: '',
    phone: ''
  });
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [hasShownExitPopup, setHasShownExitPopup] = useState(false);
  const [hasShownTimePopup, setHasShownTimePopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [exitPopupPhone, setExitPopupPhone] = useState('');
  const [timePopupPhone, setTimePopupPhone] = useState('');

  const saveLead = (leadData: any) => {
    const leads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
    const newLead = {
      id: Date.now().toString(),
      ...leadData,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    leads.push(newLead);
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  };
  
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExitPopup) {
        setShowExitPopup(true);
        setHasShownExitPopup(true);
      }
    };
    
    document.addEventListener('mouseleave', handleMouseLeave);
    
    const timeoutId = setTimeout(() => {
      if (!hasShownTimePopup) {
        setShowTimePopup(true);
        setHasShownTimePopup(true);
      }
    }, 60000);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, [hasShownExitPopup, hasShownTimePopup]);

  const challenges = [
    {
      id: 'weak-soil',
      icon: 'Mountain',
      problem: 'Болотистая местность или вечная мерзлота',
      solution: 'Проектируем стабилизацию in-situ, а не дорогостоящую замену грунта',
      image: 'https://cdn.poehali.dev/files/болотистая.jpg'
    },
    {
      id: 'materials',
      icon: 'TruckIcon',
      problem: 'Дефицит и дороговизна щебня в регионе',
      solution: 'Проектируем укрепление местных грунтов вяжущими, сокращая импорт материалов',
      image: 'https://cdn.poehali.dev/files/вяжущие.jpg'
    },
    {
      id: 'reconstruction',
      icon: 'Construction',
      problem: 'Реконструкция без остановки движения',
      solution: 'Проектируем ресайклинг и армирование существующего полотна',
      image: 'https://cdn.poehali.dev/files/Армирование.jpg'
    }
  ];

  const technologies = {
    cement: {
      title: 'Стабилизация грунтов вяжущими',
      description: 'Проектный расчет состава и толщины слоя для преобразования пучинистого грунта в прочное основание',
      tags: ['Цемент', 'Известь', 'Комплексные вяжущие']
    },
    bitumen: {
      title: 'Стабилизация битумными материалами',
      description: 'Проектирование ресайклинга и укрепления существующих дорожных одежд',
      tags: ['Эмульсии', 'Вспененный битум', 'Холодный ресайклинг']
    },
    mechanical: {
      title: 'Механическая стабилизация и армирование',
      description: 'Проектирование с применением георешеток, геотекстиля для разделения, армирования, дренажа',
      tags: ['Георешетки', 'Геотекстиль', 'Геокомпозиты']
    }
  };

  const projects = [
    {
      title: 'Магистраль М-11',
      location: 'Московская область',
      challenge: 'Слабые просадочные грунты на 80% участка',
      solution: 'Разработана конструкция дорожной одежды со стабилизацией грунта цементом на глубину 0.8 м',
      results: {
        saved: '90 млн ₽',
        reduction: '70%',
        time: '2 месяца'
      },
      image: 'https://cdn.poehali.dev/files/д4.jpeg'
    },
    {
      title: 'Обход г. Тверь',
      location: 'Тверская область',
      challenge: 'Высокие требования к несущей способности при ограниченном бюджете',
      solution: 'BIM-проектирование с комплексной стабилизацией местных грунтов и геосинтетикой',
      results: {
        saved: '65 млн ₽',
        reduction: '55%',
        time: '1.5 месяца'
      },
      image: 'https://cdn.poehali.dev/files/д.jpg'
    },
    {
      title: 'Реконструкция А-108',
      location: 'Подмосковье',
      challenge: 'Реконструкция без остановки движения',
      solution: 'Холодный ресайклинг с вспененным битумом и армирование геосеткой',
      results: {
        saved: '45 млн ₽',
        reduction: '60%',
        time: '3 недели'
      },
      image: 'https://cdn.poehali.dev/files/д2.jpg'
    },
    {
      title: 'Трасса Р-21 "Кола"',
      location: 'Мурманская область',
      challenge: 'Вечная мерзлота и крайне низкие температуры',
      solution: 'Проектирование с учетом сезонного промерзания, стабилизация морозостойкими вяжущими',
      results: {
        saved: '120 млн ₽',
        reduction: '65%',
        time: '2.5 месяца'
      },
      image: 'https://cdn.poehali.dev/files/фед.дорога.jpg'
    },
    {
      title: 'Магистраль М-7 "Волга"',
      location: 'Республика Татарстан',
      challenge: 'Участки с высоким уровнем грунтовых вод',
      solution: 'Комплексное решение с дренажем и стабилизацией известью',
      results: {
        saved: '75 млн ₽',
        reduction: '50%',
        time: '1 месяц'
      },
      image: 'https://cdn.poehali.dev/files/город.дорога.jpg'
    },
    {
      title: 'Подъезд к промзоне',
      location: 'Свердловская область',
      challenge: 'Расчет на нагрузку от тяжелой карьерной техники',
      solution: 'Усиленная дорожная одежда с глубокой стабилизацией и георешеткой',
      results: {
        saved: '35 млн ₽',
        reduction: '75%',
        time: '3 недели'
      },
      image: 'https://cdn.poehali.dev/files/пром.дорога.jpg'
    }
  ];

  const handleCalculate = () => {
    if (calcData.objectType && calcData.soilType && calcData.roadCategory) {
      setShowCalcResult(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveLead({
      type: 'Контактная форма',
      name: formData.name,
      phone: formData.phone,
      email: '',
      company: '',
      message: '',
      source: 'Форма обратной связи'
    });
    alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в течение 24 часов.');
    setFormData({ name: '', phone: '' });
  };
  
  const handleChatNext = () => {
    if (chatStep < 3) {
      setChatStep(chatStep + 1);
    } else {
      saveLead({
        type: 'Чат-бот',
        name: chatData.name,
        phone: chatData.phone,
        email: '',
        message: `Тип проекта: ${chatData.projectType}, Сроки: ${chatData.timeline}`,
        source: 'Чат-консультант'
      });
      setShowChatbot(false);
      setChatStep(0);
    }
  };
  
  const handleExitPopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    saveLead({
      type: 'Презентация',
      name: formData.get('name') as string,
      phone: exitPopupPhone,
      email: '',
      message: 'Запрос презентации технологий стабилизации',
      source: 'Exit popup'
    });
    alert('Презентация отправлена на вашу почту!');
    setShowExitPopup(false);
    setExitPopupPhone('');
  };
  
  const handleTimePopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    saveLead({
      type: 'Консультация',
      name: formData.get('name') as string,
      phone: timePopupPhone,
      email: '',
      message: 'Запрос на бесплатную консультацию',
      source: 'Time popup'
    });
    alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
    setShowTimePopup(false);
    setTimePopupPhone('');
  };
  
  const isFormValid = formData.name.trim() !== '' && isPhoneValid(formData.phone);
  const isExitPopupValid = (name: string) => name.trim() !== '' && isPhoneValid(exitPopupPhone);
  const isTimePopupValid = (name: string) => name.trim() !== '' && isPhoneValid(timePopupPhone);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 w-full bg-background/90 backdrop-blur-lg border-b border-border z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center glow-button">
              <Icon name="Route" size={24} className="text-white" />
            </div>
            <span className="font-heading font-bold text-xl md:text-2xl">DEOD</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#technologies" className="hover:text-primary transition-colors">Технологии</a>
            <a href="#calculator" className="hover:text-primary transition-colors">Калькулятор</a>
            <a href="#projects" className="hover:text-primary transition-colors">Кейсы</a>
            <a href="#contact" className="hover:text-primary transition-colors">Контакты</a>
          </div>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 font-semibold text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-2 touch-manipulation glow-button"
            onClick={() => {
              saveLead({
                type: 'Консультация',
                name: 'Не указано',
                email: 'Не указано',
                message: 'Клик на кнопку "Консультация" в header',
                source: 'Header кнопка'
              });
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Консультация
          </Button>
        </nav>
      </header>

      <section className="relative pt-32 pb-24 px-4 overflow-hidden road-animation">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://cdn.poehali.dev/files/Дороги.png" 
            alt="Highway interchange complex"
            className="w-full h-full object-cover opacity-40"
            style={{ opacity: 0.9 }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-20 z-[1]" />
        <div className="car-light" style={{ top: '30%' }} />
        <div className="car-light" style={{ top: '60%', animationDelay: '4s' }} />
        <div className="light-sweep" style={{ animationDelay: '1s' }} />
        <div className="road-stripes" style={{ left: '45%' }} />
        <div className="road-stripes" style={{ left: '55%', animationDelay: '0.5s' }} />
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/30 px-4 py-2 text-sm font-semibold animate-fade-in">
              Проектирование дорог и стабилизация грунтов
            </Badge>
            <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-8 leading-[1.1] animate-fade-in text-white">
              Проектируем не просто дороги.{' '}
              <span className="text-gradient-white block mt-2">
                Проектируем надежное основание
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in font-light">
              Разрабатываем проекты дорог любых категорий с применением технологий стабилизации грунтов. 
              Гарантируем прохождение экспертизы и снижение ваших затрат на строительство до 30%.
            </p>
            <div className="flex flex-col gap-6 items-center animate-scale-in px-4 sm:px-0">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 font-semibold text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 group touch-manipulation glow-button"
                  onClick={() => {
                    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Icon name="Calculator" className="mr-2 group-hover:scale-110 transition-transform" size={16} />
                  <span className="truncate">Рассчитать экономию</span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-2 font-semibold text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 group touch-manipulation glow-button"
                  onClick={() => {
                    document.getElementById('technologies')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Icon name="Presentation" className="mr-2 group-hover:scale-110 transition-transform" size={16} />
                  <span className="truncate">Технологические решения</span>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-white/90 text-sm sm:text-base">
                <a 
                  href="tel:+79011478767" 
                  className="flex items-center gap-2 hover:text-primary transition-colors group"
                >
                  <Icon name="Phone" size={18} className="group-hover:scale-110 transition-transform" />
                  <span>+7 (901) 147-87-67</span>
                </a>
                <a 
                  href="mailto:infosppi.ooo@mail.ru" 
                  className="flex items-center gap-2 hover:text-primary transition-colors group"
                >
                  <Icon name="Mail" size={18} className="group-hover:scale-110 transition-transform" />
                  <span>infosppi.ooo@mail.ru</span>
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-20 max-w-6xl mx-auto px-4 sm:px-0">
            <Card 
              className="glow-card overflow-hidden group md:hover:scale-105 transition-all duration-300" 
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img 
                  src="https://cdn.poehali.dev/files/economica-i-finansy-800x533.jpg" 
                  alt="Экономия на строительстве"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ opacity: 0.85 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 w-12 h-12 sm:w-14 sm:h-14 bg-primary/90 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Icon name="TrendingDown" size={24} className="text-white sm:w-7 sm:h-7" />
                </div>
              </div>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="font-heading text-2xl sm:text-3xl">до 30%</CardTitle>
                <CardDescription className="text-sm sm:text-base">экономии на строительстве</CardDescription>
              </CardHeader>
            </Card>
            <Card 
              className="glow-card overflow-hidden group md:hover:scale-105 transition-all duration-300" 
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img 
                  src="https://cdn.poehali.dev/files/экспертиза.png" 
                  alt="Прохождение экспертизы"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ opacity: 0.85 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 w-12 h-12 sm:w-14 sm:h-14 bg-primary/90 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Icon name="CheckCircle" size={24} className="text-white sm:w-7 sm:h-7" />
                </div>
              </div>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="font-heading text-2xl sm:text-3xl">100%</CardTitle>
                <CardDescription className="text-sm sm:text-base">прохождение экспертизы</CardDescription>
              </CardHeader>
            </Card>
            <Card 
              className="glow-card overflow-hidden group md:hover:scale-105 transition-all duration-300" 
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img 
                  src="https://cdn.poehali.dev/files/230713212132.jpg" 
                  alt="Быстрая разработка проекта"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ opacity: 0.85 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 w-12 h-12 sm:w-14 sm:h-14 bg-primary/90 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Icon name="Calendar" size={24} className="text-white sm:w-7 sm:h-7" />
                </div>
              </div>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="font-heading text-2xl sm:text-3xl">от 2 недель</CardTitle>
                <CardDescription className="text-sm sm:text-base">срок разработки проекта</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-heading font-bold text-4xl md:text-6xl mb-6">
              Решаем сложные задачи
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Каждый проект уникален. Подбираем оптимальное технологическое решение под ваши условия
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {challenges.map((challenge, index) => (
              <Card 
                key={challenge.id}
                className={`glow-card cursor-pointer transition-all duration-300 overflow-hidden group ${
                  activeChallenge === challenge.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setActiveChallenge(activeChallenge === challenge.id ? null : challenge.id)}
                style={{ 
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img 
                    src={challenge.image} 
                    alt={challenge.problem}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ opacity: 0.85 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 w-12 h-12 sm:w-14 sm:h-14 bg-primary/90 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Icon name={challenge.icon as any} size={24} className="text-white sm:w-7 sm:h-7" />
                  </div>
                </div>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="font-heading text-xl sm:text-2xl mb-3">{challenge.problem}</CardTitle>
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    {challenge.solution}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/30 px-4 py-2 text-sm font-semibold">
              Универсальные решения
            </Badge>
            <h2 className="font-heading font-bold text-4xl md:text-6xl mb-6">
              От федеральной трассы{' '}
              <span className="text-gradient block mt-2">
                до городского проезда
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Полный спектр проектных работ. Проектируем дороги всех типов и категорий.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              { 
                icon: 'Highway', 
                title: 'Федеральные трассы', 
                desc: 'I-II категории, магистрали с высокой интенсивностью движения',
                image: 'https://cdn.poehali.dev/files/фед.дорога.jpg'
              },
              { 
                icon: 'Route', 
                title: 'Региональные дороги', 
                desc: 'III категория, межмуниципальные и региональные трассы',
                image: 'https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/files/50169ed0-01a1-414c-84d9-add85b850444.jpg'
              },
              { 
                icon: 'MapPin', 
                title: 'Местные дороги', 
                desc: 'IV-V категории, подъезды к населенным пунктам',
                image: 'https://cdn.poehali.dev/files/д4.jpeg'
              },
              { 
                icon: 'Building', 
                title: 'Городские проезды', 
                desc: 'Улицы, проезды, парковки, дворовые территории',
                image: 'https://cdn.poehali.dev/projects/5adabe83-9a88-49bb-ba7c-144288d55800/files/c424783e-c3f0-44cc-a7cc-4e4e7566a24a.jpg'
              }
            ].map((type, index) => (
              <Card 
                key={index}
                className="glow-card group parallax-slow hover:scale-105 transition-all duration-300 overflow-hidden"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  transform: `translateY(${scrollY * (0.02 + index * 0.005)}px)`
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={type.image} 
                    alt={type.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ opacity: 0.9 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-primary/90 to-primary/70 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 backdrop-blur-sm">
                    <Icon name={type.icon as any} size={32} className="text-white" />
                  </div>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="font-heading text-xl mb-3">{type.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {type.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-b from-secondary/20 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/30 px-4 py-2 text-sm font-semibold">
              Работаем по стандартам
            </Badge>
            <h2 className="font-heading font-bold text-4xl md:text-6xl mb-6">
              Наш полный цикл{' '}
              <span className="text-gradient block mt-2">
                проектирования
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Сопровождаем проект от предпроектных изысканий до получения положительного заключения экспертизы
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" style={{ transform: 'translateY(-50%)' }} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
              {[
                { 
                  step: '01', 
                  icon: 'Search', 
                  title: 'Изыскания', 
                  desc: 'Инженерно-геологические и геодезические изыскания',
                  color: 'from-blue-500/20 to-blue-600/10'
                },
                { 
                  step: '02', 
                  icon: 'PenTool', 
                  title: 'Проектирование', 
                  desc: 'Разработка проектной и рабочей документации с BIM',
                  color: 'from-cyan-500/20 to-cyan-600/10'
                },
                { 
                  step: '03', 
                  icon: 'Layers', 
                  title: 'Стабилизация', 
                  desc: 'Расчет составов и технологий укрепления грунтов',
                  color: 'from-primary/20 to-primary/10'
                },
                { 
                  step: '04', 
                  icon: 'FileCheck', 
                  title: 'Экспертиза', 
                  desc: 'Сопровождение прохождения государственной экспертизы',
                  color: 'from-indigo-500/20 to-indigo-600/10'
                },
                { 
                  step: '05', 
                  icon: 'CheckCircle2', 
                  title: 'Авторский надзор', 
                  desc: 'Контроль соблюдения проектных решений при строительстве',
                  color: 'from-violet-500/20 to-violet-600/10'
                }
              ].map((stage, index) => (
                <Card 
                  key={index}
                  className="glow-card group relative parallax-medium hover:scale-105 transition-all duration-300"
                  style={{ 
                    animationDelay: `${index * 0.15}s`,
                    transform: `translateY(${scrollY * (0.02 + index * 0.003)}px)`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stage.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`} />
                  <CardHeader className="relative text-center p-6">
                    <div className="text-6xl font-black text-primary/10 group-hover:text-primary/20 transition-colors duration-300 mb-2">
                      {stage.step}
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Icon name={stage.icon as any} size={28} className="text-primary" />
                    </div>
                    <CardTitle className="font-heading text-lg mb-3">{stage.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {stage.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="technologies" className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-heading font-bold text-4xl md:text-6xl mb-6">
              Технологии стабилизации
            </h2>
            <p className="text-xl text-muted-foreground">
              Комплексный подход к укреплению дорожного основания
            </p>
          </div>
          
          <Tabs value={activeTech} onValueChange={setActiveTech} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1">
              <TabsTrigger value="cement" className="text-xs sm:text-sm md:text-base py-2 sm:py-3">
                <Icon name="Droplet" size={16} className="mr-2 hidden sm:inline" />
                Вяжущие
              </TabsTrigger>
              <TabsTrigger value="bitumen" className="text-xs sm:text-sm md:text-base py-2 sm:py-3">
                <Icon name="Recycle" size={16} className="mr-2 hidden sm:inline" />
                Битум
              </TabsTrigger>
              <TabsTrigger value="mechanical" className="text-xs sm:text-sm md:text-base py-2 sm:py-3">
                <Icon name="Grid3x3" size={16} className="mr-2 hidden sm:inline" />
                Армирование
              </TabsTrigger>
            </TabsList>
            
            {Object.entries(technologies).map(([key, tech]) => (
              <TabsContent key={key} value={key} className="animate-fade-in">
                <Card className="glow-card">
                  <CardHeader>
                    <CardTitle className="font-heading text-3xl mb-4">{tech.title}</CardTitle>
                    <CardDescription className="text-lg leading-relaxed mb-6">
                      {tech.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {tech.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-sm px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section id="calculator" className="py-24 px-4 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-heading font-bold text-4xl md:text-6xl mb-6">
              Калькулятор экономии
            </h2>
            <p className="text-xl text-muted-foreground">
              Оцените потенциальную экономию на вашем проекте
            </p>
          </div>
          
          <Card className="glow-card">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Параметры проекта</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Тип объекта</label>
                <Select value={calcData.objectType} onValueChange={(value) => setCalcData({...calcData, objectType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="federal">Федеральная трасса</SelectItem>
                    <SelectItem value="regional">Региональная дорога</SelectItem>
                    <SelectItem value="local">Местная дорога</SelectItem>
                    <SelectItem value="industrial">Промышленная дорога</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Протяженность участка: {calcData.length[0]} км
                </label>
                <Slider 
                  value={calcData.length} 
                  onValueChange={(value) => setCalcData({...calcData, length: value})}
                  min={1}
                  max={50}
                  step={1}
                  className="py-4"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Тип грунта</label>
                <Select value={calcData.soilType} onValueChange={(value) => setCalcData({...calcData, soilType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип грунта" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Глинистые</SelectItem>
                    <SelectItem value="sand">Песчаные</SelectItem>
                    <SelectItem value="swamp">Болотистые</SelectItem>
                    <SelectItem value="permafrost">Вечная мерзлота</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Категория дороги</label>
                <Select value={calcData.roadCategory} onValueChange={(value) => setCalcData({...calcData, roadCategory: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">I категория</SelectItem>
                    <SelectItem value="2">II категория</SelectItem>
                    <SelectItem value="3">III категория</SelectItem>
                    <SelectItem value="4">IV категория</SelectItem>
                    <SelectItem value="5">V категория</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleCalculate} 
                className="w-full glow-button"
                size="lg"
                disabled={!calcData.objectType || !calcData.soilType || !calcData.roadCategory}
              >
                <Icon name="Calculator" className="mr-2" />
                Рассчитать экономию
              </Button>
              
              {showCalcResult && (
                <div className="mt-8 p-6 bg-primary/10 border-2 border-primary rounded-lg animate-scale-in">
                  <h3 className="font-heading text-2xl mb-4 text-primary">Оценка экономии</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-3xl font-bold text-primary">
                        {(calcData.length[0] * 15).toFixed(0)} млн ₽
                      </div>
                      <div className="text-sm text-muted-foreground">Экономия на материалах</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">
                        {Math.min(25 + calcData.length[0] * 2, 35)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Снижение стоимости</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">
                        {Math.max(2, Math.ceil(calcData.length[0] / 3))} нед
                      </div>
                      <div className="text-sm text-muted-foreground">Экономия времени</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    * Оценка предварительная, для точного расчета требуется анализ проектных данных
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="projects" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-heading font-bold text-4xl md:text-6xl mb-6">
              Реализованные проекты
            </h2>
            <p className="text-xl text-muted-foreground">
              Подтвержденный опыт работы на сложных объектах
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {projects.map((project, index) => (
              <Card 
                key={index} 
                className="glow-card overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-primary text-white">
                    {project.location}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="font-heading text-xl mb-2">{project.title}</CardTitle>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold text-primary">Вызов:</span>
                      <p className="text-muted-foreground mt-1">{project.challenge}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-primary">Решение:</span>
                      <p className="text-muted-foreground mt-1">{project.solution}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
                    <div>
                      <div className="text-lg font-bold text-primary">{project.results.saved}</div>
                      <div className="text-xs text-muted-foreground">экономия</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">-{project.results.reduction}</div>
                      <div className="text-xs text-muted-foreground">снижение</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">{project.results.time}</div>
                      <div className="text-xs text-muted-foreground">срок</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-heading font-bold text-4xl md:text-6xl mb-6">
              Начните проект
            </h2>
            <p className="text-xl text-muted-foreground">
              Оставьте заявку, и мы свяжемся с вами в течение 24 часов
            </p>
          </div>
          
          <Card className="glow-card">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Ваше имя *</label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Иван Иванов"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Телефон *</label>
                  <InputMask
                    mask="+7 (999) 999-99-99"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  >
                    {(inputProps: any) => (
                      <Input 
                        {...inputProps}
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        required
                      />
                    )}
                  </InputMask>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full glow-button"
                  size="lg"
                  disabled={!isFormValid}
                >
                  <Icon name="Send" className="mr-2" />
                  Отправить заявку
                </Button>
              </form>
              
              <div className="mt-8 pt-8 border-t border-border text-center space-y-4">
                <p className="text-sm text-muted-foreground">Или свяжитесь с нами напрямую:</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="tel:+79011478767" className="flex items-center gap-2 text-primary hover:underline">
                    <Icon name="Phone" size={18} />
                    +7 (901) 147-87-67
                  </a>
                  <a href="mailto:infosppi.ooo@mail.ru" className="flex items-center gap-2 text-primary hover:underline">
                    <Icon name="Mail" size={18} />
                    infosppi.ooo@mail.ru
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-border bg-secondary/20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center glow-button">
                  <Icon name="Route" size={24} className="text-white" />
                </div>
                <span className="font-heading font-bold text-xl">DEOD</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Проектирование дорог с применением технологий стабилизации грунтов
              </p>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold mb-4">Контакты</h3>
              <div className="space-y-2 text-sm">
                <a href="tel:+79011478767" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Icon name="Phone" size={16} />
                  +7 (901) 147-87-67
                </a>
                <a href="mailto:infosppi.ooo@mail.ru" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Icon name="Mail" size={16} />
                  infosppi.ooo@mail.ru
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold mb-4">Навигация</h3>
              <div className="space-y-2 text-sm">
                <a href="#technologies" className="block hover:text-primary transition-colors">Технологии</a>
                <a href="#calculator" className="block hover:text-primary transition-colors">Калькулятор</a>
                <a href="#projects" className="block hover:text-primary transition-colors">Проекты</a>
                <a href="#contact" className="block hover:text-primary transition-colors">Контакты</a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 DEOD. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {showChatbot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-md glow-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Консультация специалиста</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowChatbot(false)}>
                  <Icon name="X" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {chatStep === 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Какой тип проекта вас интересует?</label>
                  <Select value={chatData.projectType} onValueChange={(value) => setChatData({...chatData, projectType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Новое строительство</SelectItem>
                      <SelectItem value="reconstruction">Реконструкция</SelectItem>
                      <SelectItem value="repair">Капитальный ремонт</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    className="w-full mt-4 glow-button" 
                    onClick={handleChatNext}
                    disabled={!chatData.projectType}
                  >
                    Далее
                  </Button>
                </div>
              )}
              
              {chatStep === 1 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Когда планируете начать проект?</label>
                  <Select value={chatData.timeline} onValueChange={(value) => setChatData({...chatData, timeline: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите срок" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Срочно (в течение месяца)</SelectItem>
                      <SelectItem value="soon">В ближайшие 3 месяца</SelectItem>
                      <SelectItem value="planning">На стадии планирования</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    className="w-full mt-4 glow-button" 
                    onClick={handleChatNext}
                    disabled={!chatData.timeline}
                  >
                    Далее
                  </Button>
                </div>
              )}
              
              {chatStep === 2 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Как к вам обращаться?</label>
                  <Input 
                    value={chatData.name}
                    onChange={(e) => setChatData({...chatData, name: e.target.value})}
                    placeholder="Ваше имя"
                  />
                  <Button 
                    className="w-full mt-4 glow-button" 
                    onClick={handleChatNext}
                    disabled={!chatData.name.trim()}
                  >
                    Далее
                  </Button>
                </div>
              )}
              
              {chatStep === 3 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Ваш телефон для связи</label>
                  <InputMask
                    mask="+7 (999) 999-99-99"
                    value={chatData.phone}
                    onChange={(e) => setChatData({...chatData, phone: e.target.value})}
                  >
                    {(inputProps: any) => (
                      <Input 
                        {...inputProps}
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                      />
                    )}
                  </InputMask>
                  <Button 
                    className="w-full mt-4 glow-button" 
                    onClick={handleChatNext}
                    disabled={!isPhoneValid(chatData.phone)}
                  >
                    Отправить
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {showExitPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-md glow-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Не уходите! Получите презентацию</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowExitPopup(false)}>
                  <Icon name="X" />
                </Button>
              </div>
              <CardDescription>
                Оставьте контакты и получите детальную презентацию технологий стабилизации грунтов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleExitPopupSubmit} className="space-y-4">
                <Input name="name" placeholder="Ваше имя" required />
                <InputMask
                  mask="+7 (999) 999-99-99"
                  value={exitPopupPhone}
                  onChange={(e) => setExitPopupPhone(e.target.value)}
                >
                  {(inputProps: any) => (
                    <Input 
                      {...inputProps}
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      required
                    />
                  )}
                </InputMask>
                <Button 
                  type="submit" 
                  className="w-full glow-button"
                  disabled={!isExitPopupValid((document.querySelector('input[name="name"]') as HTMLInputElement)?.value || '')}
                >
                  Получить презентацию
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {showTimePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-md glow-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Бесплатная консультация</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowTimePopup(false)}>
                  <Icon name="X" />
                </Button>
              </div>
              <CardDescription>
                Остались вопросы? Наш специалист свяжется с вами и ответит на все вопросы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTimePopupSubmit} className="space-y-4">
                <Input name="name" placeholder="Ваше имя" required />
                <InputMask
                  mask="+7 (999) 999-99-99"
                  value={timePopupPhone}
                  onChange={(e) => setTimePopupPhone(e.target.value)}
                >
                  {(inputProps: any) => (
                    <Input 
                      {...inputProps}
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      required
                    />
                  )}
                </InputMask>
                <Button 
                  type="submit" 
                  className="w-full glow-button"
                  disabled={!isTimePopupValid((document.querySelector('input[name="name"]') as HTMLInputElement)?.value || '')}
                >
                  Заказать звонок
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;