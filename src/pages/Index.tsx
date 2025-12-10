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
    company: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [chatData, setChatData] = useState({
    projectType: '',
    timeline: '',
    email: ''
  });
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [hasShownExitPopup, setHasShownExitPopup] = useState(false);
  const [hasShownTimePopup, setHasShownTimePopup] = useState(false);
  
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
      solution: 'Проектируем стабилизацию in-situ, а не дорогостоящую замену грунта'
    },
    {
      id: 'materials',
      icon: 'TruckIcon',
      problem: 'Дефицит и дороговизна щебня в регионе',
      solution: 'Проектируем укрепление местных грунтов вяжущими, сокращая импорт материалов'
    },
    {
      id: 'reconstruction',
      icon: 'Construction',
      problem: 'Реконструкция без остановки движения',
      solution: 'Проектируем ресайклинг и армирование существующего полотна'
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
      image: 'https://images.unsplash.com/photo-1621159753203-36269feba2f4?w=800&auto=format&fit=crop'
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
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop'
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
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop'
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
      image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&auto=format&fit=crop'
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
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop'
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
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop'
    }
  ];

  const handleCalculate = () => {
    if (calcData.objectType && calcData.soilType && calcData.roadCategory) {
      setShowCalcResult(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };
  
  const handleChatNext = () => {
    if (chatStep < 3) {
      setChatStep(chatStep + 1);
    } else {
      console.log('Chat completed:', chatData);
      setShowChatbot(false);
      setChatStep(0);
    }
  };
  
  const handleExitPopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Exit popup submitted');
    setShowExitPopup(false);
  };
  
  const handleTimePopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Time popup submitted');
    setShowTimePopup(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <nav className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
          <div className="font-heading font-black text-2xl md:text-3xl tracking-tight">
            <span className="text-gradient">DEOD</span>
          </div>
          <div className="hidden lg:flex gap-6 xl:gap-8 text-sm font-medium">
            <a href="#road-types" className="hover:text-primary transition-colors">Типы дорог</a>
            <a href="#challenges" className="hover:text-primary transition-colors">Задачи</a>
            <a href="#services" className="hover:text-primary transition-colors">Этапы</a>
            <a href="#technologies" className="hover:text-primary transition-colors">Технологии</a>
            <a href="#calculator" className="hover:text-primary transition-colors">Калькулятор</a>
            <a href="#projects" className="hover:text-primary transition-colors">Кейсы</a>
            <a href="#contact" className="hover:text-primary transition-colors">Контакты</a>
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary/90 font-semibold text-sm md:text-base px-3 md:px-4 py-2 md:py-2.5">
            Консультация
          </Button>
        </nav>
      </header>

      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://cdn.poehali.dev/files/Дороги.png" 
            alt="Highway interchange complex"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/70 to-background" />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-20 z-[1]" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/30 px-4 py-2 text-sm font-semibold animate-fade-in">
              Проектирование дорог и стабилизация грунтов
            </Badge>
            <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-8 leading-[1.1] animate-fade-in">
              Проектируем не просто дороги.{' '}
              <span className="text-gradient-white block mt-2">
                Проектируем надежное основание
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in font-light">
              Разрабатываем проекты дорог любых категорий с применением технологий стабилизации грунтов. 
              Гарантируем прохождение экспертизы и снижение ваших затрат на строительство до 30%.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-scale-in px-4 sm:px-0">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 font-semibold group w-full sm:w-auto">
                <Icon name="Calculator" size={20} className="mr-2 group-hover:scale-110 transition-transform sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base">Рассчитать экономию</span>
              </Button>
              <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 font-semibold border-2 group w-full sm:w-auto">
                <Icon name="Presentation" size={20} className="mr-2 group-hover:scale-110 transition-transform sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base">Технологические решения</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-20 max-w-6xl mx-auto px-4 sm:px-0">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 animate-float">
                  <Icon name="TrendingDown" size={24} className="text-primary sm:w-8 sm:h-8" />
                </div>
                <CardTitle className="font-heading text-2xl sm:text-3xl">до 30%</CardTitle>
                <CardDescription className="text-sm sm:text-base">экономии на строительстве</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/20">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 animate-float" style={{animationDelay: '1s'}}>
                  <Icon name="Zap" size={24} className="text-primary sm:w-8 sm:h-8" />
                </div>
                <CardTitle className="font-heading text-2xl sm:text-3xl">в 2 раза</CardTitle>
                <CardDescription className="text-sm sm:text-base">быстрее сроков реализации</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/20 sm:col-span-2 md:col-span-1">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 animate-float" style={{animationDelay: '2s'}}>
                  <Icon name="Shield" size={24} className="text-primary sm:w-8 sm:h-8" />
                </div>
                <CardTitle className="font-heading text-2xl sm:text-3xl">100%</CardTitle>
                <CardDescription className="text-sm sm:text-base">прохождение экспертизы</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section id="road-types" className="py-12 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-6xl mb-4 md:mb-6 px-2">
              От федеральной трассы до городского проезда
            </h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Полный спектр проектных работ. Проектируем дороги всех типов и категорий.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="bg-card border-border hover:border-primary transition-all group relative overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://cdn.poehali.dev/files/фед.дорога.jpg" 
                  alt="Федеральная дорога"
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/80 to-background/75" />
              </div>
              <CardHeader className="relative z-10">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <Icon name="Highway" size={32} className="text-primary" />
                </div>
                <CardTitle className="font-heading text-2xl mb-3">Дороги федерального и регионального значения</CardTitle>
                <CardDescription className="text-base leading-relaxed mb-4">
                  <span className="font-semibold text-foreground">Для кого:</span> Минтранс, крупные госкомпании, инвесторы в межрегиональную инфраструктуру
                </CardDescription>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>• Скоростные дороги и автомагистрали (I кат.)</p>
                  <p>• Дороги обычные (I-IV кат.)</p>
                  <p>• Обходы населенных пунктов</p>
                  <p>• Подъезды к транспортным узлам</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Сложные инженерные изыскания, проектирование многоуровневых развязок, стабилизация грунтов на протяженных участках
                </p>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-all group relative overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://cdn.poehali.dev/files/город.дорога.jpg" 
                  alt="Городская дорога"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/80 to-background/75" />
              </div>
              <CardHeader className="relative z-10">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <Icon name="Building2" size={32} className="text-primary" />
                </div>
                <CardTitle className="font-heading text-2xl mb-3">Городские улицы и дороги</CardTitle>
                <CardDescription className="text-base leading-relaxed mb-4">
                  <span className="font-semibold text-foreground">Для кого:</span> Муниципалитеты, девелоперы, застройщики кварталов
                </CardDescription>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>• Магистральные улицы общегородского значения</p>
                  <p>• Улицы местного значения</p>
                  <p>• Проекты организации дорожного движения (ПОДД)</p>
                  <p>• Транспортные узлы в стесненных условиях</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Интеграция с инженерными коммуникациями, проектирование ливневой канализации, организация пешеходных потоков
                </p>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-all group relative overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://cdn.poehali.dev/files/пром.дорога.jpg" 
                  alt="Промышленная дорога"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/80 to-background/75" />
              </div>
              <CardHeader className="relative z-10">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <Icon name="Truck" size={32} className="text-primary" />
                </div>
                <CardTitle className="font-heading text-2xl mb-3">Промышленные и специальные дороги</CardTitle>
                <CardDescription className="text-base leading-relaxed mb-4">
                  <span className="font-semibold text-foreground">Для кого:</span> Горнодобывающие, нефтегазовые, промышленные предприятия
                </CardDescription>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>• Карьерные, рудничные, лесовозные дороги</p>
                  <p>• Подъезды к промплощадкам и складам</p>
                  <p>• Дороги на территориях предприятий</p>
                  <p>• Дороги для тяжелых нагрузок (спецтехника)</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Расчет на сверхнормативные нагрузки, усиленные дорожные одежды, стабилизация под тяжелой техникой
                </p>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-all group relative overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://cdn.poehali.dev/files/мост.jpg" 
                  alt="Мостовое сооружение"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/80 to-background/75" />
              </div>
              <CardHeader className="relative z-10">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <Icon name="Bridge" size={32} className="text-primary" />
                </div>
                <CardTitle className="font-heading text-2xl mb-3">Объекты дорожной инфраструктуры (ИССО)</CardTitle>
                <CardDescription className="text-base leading-relaxed mb-4">
                  <span className="font-semibold text-foreground">Для кого:</span> Все заказчики, чьи трассы требуют сложных пересечений
                </CardDescription>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <p>• Мосты, путепроводы, эстакады</p>
                  <p>• Тоннели</p>
                  <p>• Шумозащитные экраны, галереи</p>
                  <p>• Большепролетные водопропускные трубы</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Комплексное проектирование «мост + подходы», устройство оснований под опорами, расчет фундаментов в слабых грунтах
                </p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section id="challenges" className="py-12 md:py-24 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-6xl mb-4 md:mb-6 px-2">
              Слабый грунт, перерасход бюджета и срывы сроков?
            </h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Это решается на этапе проектирования
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {challenges.map((challenge, idx) => (
              <Card 
                key={challenge.id}
                className={`cursor-pointer transition-all hover:scale-105 relative overflow-hidden ${
                  activeChallenge === challenge.id 
                    ? 'border-primary shadow-xl shadow-primary/20' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setActiveChallenge(activeChallenge === challenge.id ? null : challenge.id)}
              >
                <div 
                  className="absolute inset-0 z-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${
                      idx === 0 ? 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800' :
                      idx === 1 ? 'https://images.unsplash.com/photo-1554224311-beee460c201f?w=800' :
                      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800'
                    })` 
                  }}
                />
                <div className="absolute inset-0 z-[1] bg-background/90" />
                <CardHeader className="relative z-10">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                    <Icon name={challenge.icon} size={24} className="text-primary md:w-8 md:h-8" />
                  </div>
                  <CardTitle className="font-heading text-lg md:text-xl mb-2 md:mb-3">Проблема</CardTitle>
                  <CardDescription className="text-sm md:text-base text-foreground/80 mb-4">
                    {challenge.problem}
                  </CardDescription>
                  {activeChallenge === challenge.id && (
                    <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                      <p className="text-xs md:text-sm font-semibold text-primary mb-2">Наш подход</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{challenge.solution}</p>
                    </div>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Button size="lg" variant="outline" className="border-2">
              <Icon name="MessageSquare" size={20} className="mr-2" />
              Какая у вас задача? Узнать решение
            </Button>
          </div>
        </div>
      </section>

      <section id="services" className="py-12 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-6xl mb-4 md:mb-6 px-2">
              Наш полный цикл проектирования
            </h2>
            <p className="text-base md:text-xl text-muted-foreground px-4">
              От изысканий до рабочей документации в BIM. С акцентом на оптимальные конструкции.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {[
              {
                step: '01',
                icon: 'Search',
                title: 'Инженерные изыскания и анализ',
                description: 'Не просто отчет. Цифровая модель грунтов для расчета стабилизации.',
                bgImage: 'https://cdn.poehali.dev/files/изыскания.jpg'
              },
              {
                step: '02',
                icon: 'FileText',
                title: 'Проектная документация (ПД)',
                description: 'Разработка с прохождением экспертизы. Конструкция дорожной одежды с обоснованием методов стабилизации.'
              },
              {
                step: '03',
                icon: 'Boxes',
                title: 'Рабочая документация (РД) в BIM',
                description: 'Детальные чертежи и спецификации для подрядчика. 3D-модель для устранения коллизий.'
              },
              {
                step: '04',
                icon: 'Eye',
                title: 'Авторский надзор и сопровождение',
                description: 'Контроль реализации проектных решений по стабилизации.'
              }
            ].map((service) => (
              <Card key={service.step} className="bg-card border-border hover:border-primary transition-all group relative overflow-hidden">
                {service.bgImage ? (
                  <>
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={service.bgImage} 
                        alt={service.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-background/90" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 z-0">
                      <img 
                        src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800" 
                        alt={service.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-background/90" />
                    </div>
                  </>
                )}
                <div className="absolute top-0 right-0 text-[120px] font-heading font-black text-primary/5 group-hover:text-primary/10 transition-colors leading-none pt-4 pr-4 z-[5]">
                  {service.step}
                </div>
                <CardHeader className="relative z-10 p-4 md:p-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                    <Icon name={service.icon} size={24} className="text-primary md:w-8 md:h-8" />
                  </div>
                  <CardTitle className="font-heading text-xl md:text-2xl mb-2 md:mb-3">{service.title}</CardTitle>
                  <CardDescription className="text-sm md:text-base leading-relaxed">{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="technologies" className="py-12 md:py-24 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-6xl mb-4 md:mb-6 px-2">
              Наши технологические решения
            </h2>
            <p className="text-base md:text-xl text-muted-foreground px-4">
              Мы не маскируем проблему грунта. Мы проектируем её устранение.
            </p>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 mb-8 md:mb-12 p-4 md:p-8">
            <CardTitle className="font-heading text-xl md:text-2xl mb-4 md:mb-6 text-center">Выберите вашу основную задачу</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {['Усиление слабого основания', 'Экономия на материалах', 'Ускорение строительства', 'Ремонт/реконструкция'].map((task) => (
                <Button 
                  key={task}
                  variant="outline" 
                  className="h-auto py-3 md:py-4 px-4 md:px-6 text-left justify-start hover:bg-primary/10 hover:border-primary"
                >
                  <Icon name="CheckCircle2" size={18} className="mr-2 flex-shrink-0 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm font-medium">{task}</span>
                </Button>
              ))}
            </div>
          </Card>

          <Tabs value={activeTech} onValueChange={setActiveTech} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 md:mb-8 h-auto">
              <TabsTrigger value="cement" className="text-xs md:text-sm lg:text-base py-2 md:py-2.5">Вяжущие</TabsTrigger>
              <TabsTrigger value="bitumen" className="text-xs md:text-sm lg:text-base py-2 md:py-2.5">Битумные</TabsTrigger>
              <TabsTrigger value="mechanical" className="text-xs md:text-sm lg:text-base py-2 md:py-2.5">Армирование</TabsTrigger>
            </TabsList>
            {Object.entries(technologies).map(([key, tech]) => (
              <TabsContent key={key} value={key}>
                <Card className="bg-card border-border">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="font-heading text-2xl md:text-3xl mb-3 md:mb-4">{tech.title}</CardTitle>
                    <CardDescription className="text-base md:text-lg leading-relaxed mb-4 md:mb-6">{tech.description}</CardDescription>
                    <div className="flex gap-2 flex-wrap">
                      {tech.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="px-2 md:px-3 py-1 text-xs md:text-sm">{tag}</Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-4 md:mt-6">
                      <div className="bg-destructive/10 rounded-xl p-6 border border-destructive/20">
                        <p className="text-sm font-semibold mb-2 text-destructive">ДО применения</p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>• Слабая несущая способность</p>
                          <p>• Высокая пучинистость</p>
                          <p>• Большая толщина одежды</p>
                        </div>
                      </div>
                      <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
                        <p className="text-sm font-semibold mb-2 text-primary">ПОСЛЕ стабилизации</p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>• Прочное основание</p>
                          <p>• Морозоустойчивость</p>
                          <p>• Оптимальная конструкция</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section id="calculator" className="py-12 md:py-24 px-4 bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-6xl mb-4 md:mb-6 px-2">
              Калькулятор предварительной экономии
            </h2>
            <p className="text-base md:text-xl text-muted-foreground px-4">
              Оцените потенциал экономии с проектным решением по стабилизации
            </p>
          </div>

          <Card className="bg-card border-primary/20 shadow-2xl">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="font-heading text-xl md:text-2xl">Параметры вашего объекта</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
              <div>
                <label className="block text-sm font-semibold mb-2">Тип объекта</label>
                <Select onValueChange={(value) => setCalcData({...calcData, objectType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип объекта" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новая дорога</SelectItem>
                    <SelectItem value="reconstruction">Реконструкция</SelectItem>
                    <SelectItem value="reinforcement">Усиление участка</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Длина участка: {calcData.length[0]} км
                </label>
                <Slider 
                  value={calcData.length} 
                  onValueChange={(value) => setCalcData({...calcData, length: value})}
                  max={50}
                  min={1}
                  step={1}
                  className="py-4"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Преобладающий тип грунта</label>
                <Select onValueChange={(value) => setCalcData({...calcData, soilType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип грунта" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Глина/Суглинок</SelectItem>
                    <SelectItem value="sand">Песок</SelectItem>
                    <SelectItem value="peat">Торф</SelectItem>
                    <SelectItem value="bulk">Насыпной грунт</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Категория дороги</label>
                <Select onValueChange={(value) => setCalcData({...calcData, roadCategory: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="I">I категория</SelectItem>
                    <SelectItem value="II">II категория</SelectItem>
                    <SelectItem value="III">III категория</SelectItem>
                    <SelectItem value="IV">IV категория</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleCalculate}
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90 text-lg py-6 font-semibold"
              >
                <Icon name="Calculator" size={24} className="mr-2" />
                Рассчитать потенциал экономии
              </Button>

              {showCalcResult && (
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 animate-scale-in">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-center">Предварительный результат</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-lg text-muted-foreground">
                      На проектах с аналогичными параметрами внедрение стабилизации позволило:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="bg-background/50 rounded-xl p-6">
                        <p className="text-4xl font-heading font-bold text-primary mb-2">до 40%</p>
                        <p className="text-sm text-muted-foreground">сокращение объема привозного щебня</p>
                      </div>
                      <div className="bg-background/50 rounded-xl p-6">
                        <p className="text-4xl font-heading font-bold text-primary mb-2">15-25%</p>
                        <p className="text-sm text-muted-foreground">снижение стоимости земляного полотна</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-border">
                      <p className="font-semibold mb-4">Для получения индивидуального инженерного расчета оставьте контакты</p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            placeholder="Ваше имя"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                          <Input
                            placeholder="Компания"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                          <Input
                            type="tel"
                            placeholder="Телефон"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>
                        <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
                          <Icon name="Send" size={20} className="mr-2" />
                          Получить предварительный расчет
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="projects" className="py-12 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-6xl mb-4 md:mb-6 px-2">
              Реализованные проекты и кейсы
            </h2>
            <p className="text-base md:text-xl text-muted-foreground px-4">
              Цифры, результаты и доказательства эффективности
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {projects.map((project, idx) => (
              <Card key={idx} className="overflow-hidden border-border hover:border-primary transition-all group hover:shadow-2xl">
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-xs sm:text-sm">
                    {project.location}
                  </Badge>
                </div>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="font-heading text-xl md:text-2xl mb-3 md:mb-4">{project.title}</CardTitle>
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <p className="text-xs md:text-sm font-semibold text-destructive mb-1">Вызов</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{project.challenge}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-semibold text-primary mb-1">Проектное решение</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{project.solution}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="space-y-2 md:space-y-3 pt-3 md:pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm text-muted-foreground">Экономия</span>
                      <span className="font-bold text-primary text-base md:text-lg">{project.results.saved}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm text-muted-foreground">Сокращение объемов</span>
                      <span className="font-bold text-primary text-sm md:text-base">{project.results.reduction}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs md:text-sm text-muted-foreground">Сокращение сроков</span>
                      <span className="font-bold text-primary text-sm md:text-base">{project.results.time}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-card/30">
        <div className="container mx-auto max-w-5xl">
          <Card className="bg-gradient-to-br from-primary/10 via-card to-primary/5 border-primary/30">
            <CardHeader className="text-center">
              <CardTitle className="font-heading text-4xl md:text-5xl mb-12">Почему выбирают нас</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div>
                  <div className="text-6xl md:text-7xl font-heading font-black text-primary mb-4 animate-float">50+</div>
                  <p className="text-base text-muted-foreground">опыт проектирования со стабилизацией</p>
                </div>
                <div>
                  <div className="text-6xl md:text-7xl font-heading font-black text-primary mb-4 animate-float" style={{animationDelay: '1s'}}>{'> 20%'}</div>
                  <p className="text-base text-muted-foreground">средняя экономия для заказчика</p>
                </div>
                <div>
                  <div className="text-6xl md:text-7xl font-heading font-black text-primary mb-4 animate-float" style={{animationDelay: '2s'}}>100%</div>
                  <p className="text-base text-muted-foreground">сертифицированные специалисты BIM</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section id="contact" className="py-12 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-6xl mb-4 md:mb-6 px-2">
              Готовы проектировать дорогу будущего?
            </h2>
            <p className="text-base md:text-xl text-muted-foreground px-4">
              Бесплатная консультация инженера-проектировщика
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
            <Card className="lg:col-span-3 bg-card border-border">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Свяжитесь с нами</CardTitle>
                <CardDescription>Мы ответим в течение 24 часов</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Ваше имя"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Компания"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                    <Input
                      type="tel"
                      placeholder="Телефон"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <Textarea
                    placeholder="Опишите ваш проект или задачу"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                  />
                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">
                    <Icon name="Send" size={20} className="mr-2" />
                    Отправить запрос
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="Mail" size={28} className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-lg">Email</CardTitle>
                    <CardDescription className="text-base">info@deod.ru</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="Phone" size={28} className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-lg">Телефон</CardTitle>
                    <CardDescription className="text-base">+7 (495) 123-45-67</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon name="MapPin" size={28} className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-lg">Офис</CardTitle>
                    <CardDescription className="text-base">г. Москва, ул. Проектная, д. 1</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-background/95 border-t border-border py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="font-heading font-black text-4xl mb-4">
                <span className="text-gradient">DEOD</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-md">
                Технологический лидер в проектировании дорог с применением BIM и методов стабилизации грунтов. 
                Создаем надежное основание для вашего бизнеса.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Услуги</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#services" className="hover:text-primary transition-colors">Проектирование</a></li>
                <li><a href="#technologies" className="hover:text-primary transition-colors">Стабилизация грунтов</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">BIM-моделирование</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Экспертиза</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#projects" className="hover:text-primary transition-colors">Кейсы</a></li>
                <li><a href="#technologies" className="hover:text-primary transition-colors">Технологии</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Контакты</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">&copy; 2024 DEOD. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {!showChatbot && (
        <Button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-2xl z-50 animate-pulse-slow"
        >
          <Icon name="MessageCircle" size={28} />
        </Button>
      )}

      {showChatbot && (
        <Card className="fixed bottom-6 right-6 w-96 shadow-2xl border-primary/30 z-50 animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-heading text-xl flex items-center gap-2">
                  <Icon name="UserCircle" size={24} className="text-primary" />
                  Инженер-консультант
                </CardTitle>
                <CardDescription>Помогу оценить ваш проект</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChatbot(false)}
                className="hover:bg-background/50"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {chatStep === 0 && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-sm text-muted-foreground">Здравствуйте! Давайте оценим потенциал вашего проекта. Какой тип работ планируется?</p>
                <div className="space-y-2">
                  {['Новое строительство', 'Реконструкция', 'Ремонт', 'Экспертиза проекта'].map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      className="w-full justify-start hover:bg-primary/10 hover:border-primary"
                      onClick={() => {
                        setChatData({...chatData, projectType: type});
                        handleChatNext();
                      }}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {chatStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-sm text-muted-foreground">Отлично! В какие сроки нужно выполнить проектирование?</p>
                <div className="space-y-2">
                  {['До 1 месяца (срочно)', '1-3 месяца', '3-6 месяцев', 'Более 6 месяцев'].map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      className="w-full justify-start hover:bg-primary/10 hover:border-primary"
                      onClick={() => {
                        setChatData({...chatData, timeline: time});
                        handleChatNext();
                      }}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {chatStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-sm text-muted-foreground">
                  Проект: <span className="font-semibold text-foreground">{chatData.projectType}</span><br/>
                  Сроки: <span className="font-semibold text-foreground">{chatData.timeline}</span>
                </p>
                <p className="text-sm text-muted-foreground">Оставьте email для получения предварительного расчета стоимости:</p>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={chatData.email}
                  onChange={(e) => setChatData({...chatData, email: e.target.value})}
                />
                <Button
                  onClick={handleChatNext}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={!chatData.email}
                >
                  <Icon name="Send" size={18} className="mr-2" />
                  Получить расчет
                </Button>
              </div>
            )}

            {chatStep === 3 && (
              <div className="space-y-4 animate-fade-in text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Icon name="CheckCircle2" size={32} className="text-primary" />
                </div>
                <p className="font-semibold">Спасибо за обращение!</p>
                <p className="text-sm text-muted-foreground">
                  Мы отправим предварительный расчет на {chatData.email} в течение 2 часов.
                </p>
                <Button onClick={() => setShowChatbot(false)} variant="outline" className="w-full">
                  Закрыть
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showExitPopup && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <Card className="max-w-md w-full shadow-2xl border-primary/30">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertCircle" size={32} className="text-primary" />
              </div>
              <CardTitle className="font-heading text-2xl">Уходите?</CardTitle>
              <CardDescription className="text-base">
                Получите презентацию наших технологий стабилизации на почту
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleExitPopupSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Ваш email"
                  required
                />
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                    <Icon name="Download" size={18} className="mr-2" />
                    Получить презентацию
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowExitPopup(false)}
                  >
                    <Icon name="X" size={18} />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {showTimePopup && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <Card className="max-w-md w-full shadow-2xl border-primary/30">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Gift" size={32} className="text-primary" />
              </div>
              <CardTitle className="font-heading text-2xl">Специальное предложение!</CardTitle>
              <CardDescription className="text-base">
                Бесплатный аудит вашего проекта при заявке сегодня
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTimePopupSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Ваше имя"
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  required
                />
                <Input
                  type="tel"
                  placeholder="Телефон"
                  required
                />
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                    <Icon name="CheckCircle2" size={18} className="mr-2" />
                    Получить аудит
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTimePopup(false)}
                  >
                    <Icon name="X" size={18} />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;