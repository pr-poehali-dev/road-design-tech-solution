import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  setShowQuoteForm: (show: boolean) => void;
  saveLead: (data: any) => void;
}

const HeroSection = ({ setShowQuoteForm, saveLead }: HeroSectionProps) => {
  return (
    <>
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
                  onClick={() => setShowQuoteForm(true)}
                >
                  <Icon name="FileText" className="mr-2 group-hover:scale-110 transition-transform" size={16} />
                  <span className="truncate">Рассчитать стоимость</span>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-2 font-semibold text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 group touch-manipulation glow-button"
                  onClick={() => window.location.href = '/partner-system'}
                >
                  <Icon name="TrendingUp" className="mr-2 group-hover:scale-110 transition-transform" size={16} />
                  <span className="truncate">Партнёрская система</span>
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
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="w-full sm:w-auto font-semibold text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 group touch-manipulation"
                  onClick={() => window.location.href = '/kp'}
                >
                  <Icon name="Briefcase" className="mr-2 group-hover:scale-110 transition-transform" size={16} />
                  <span className="truncate">Коммерческое предложение</span>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-white/90 text-sm sm:text-base">
                <a 
                  href="tel:+79955556231" 
                  className="flex items-center gap-2 hover:text-primary transition-colors group"
                >
                  <Icon name="Phone" size={18} className="group-hover:scale-110 transition-transform" />
                  <span>+7 (995) 555-62-31</span>
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
                  src="https://cdn.poehali.dev/files/экспертиза.jpg" 
                  alt="Гарантия экспертизы"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ opacity: 0.85 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 w-12 h-12 sm:w-14 sm:h-14 bg-primary/90 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Icon name="CheckCircle2" size={24} className="text-white sm:w-7 sm:h-7" />
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
                  src="https://cdn.poehali.dev/files/опыт.jpg" 
                  alt="Опыт работы"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ opacity: 0.85 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 w-12 h-12 sm:w-14 sm:h-14 bg-primary/90 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Icon name="Award" size={24} className="text-white sm:w-7 sm:h-7" />
                </div>
              </div>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="font-heading text-2xl sm:text-3xl">12+ лет</CardTitle>
                <CardDescription className="text-sm sm:text-base">опыта в проектировании</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
