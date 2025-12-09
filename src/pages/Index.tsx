import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="font-heading font-bold text-2xl text-gradient">RoadTech</div>
          <div className="hidden md:flex gap-6">
            <a href="#services" className="hover:text-primary transition-colors">Услуги</a>
            <a href="#solutions" className="hover:text-primary transition-colors">Решения</a>
            <a href="#projects" className="hover:text-primary transition-colors">Проекты</a>
            <a href="#technology" className="hover:text-primary transition-colors">Технология</a>
            <a href="#contact" className="hover:text-primary transition-colors">Контакты</a>
          </div>
          <Button className="bg-accent hover:bg-accent/90">
            Получить консультацию
          </Button>
        </nav>
      </header>

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Технологический лидер проектирования
            </Badge>
            <h1 className="font-heading font-bold text-5xl md:text-7xl mb-6 leading-tight">
              Проектные решения для <span className="text-gradient">дорожного строительства</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Экспертиза в стабилизации грунтов и дорожных конструкций. Сокращаем бюджет, сроки и риски строительства.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Icon name="FileText" size={20} className="mr-2" />
                Запросить КП
              </Button>
              <Button size="lg" variant="outline">
                <Icon name="Phone" size={20} className="mr-2" />
                Консультация
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
            <Card className="bg-card border-border hover:border-primary transition-all hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="TrendingDown" size={24} className="text-primary" />
                </div>
                <CardTitle className="font-heading">До 30% экономии</CardTitle>
                <CardDescription>Снижение бюджета строительства</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border hover:border-primary transition-all hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Clock" size={24} className="text-accent" />
                </div>
                <CardTitle className="font-heading">В 2 раза быстрее</CardTitle>
                <CardDescription>Сокращение сроков реализации</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border hover:border-primary transition-all hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Shield" size={24} className="text-primary" />
                </div>
                <CardTitle className="font-heading">Минимум рисков</CardTitle>
                <CardDescription>Гарантия качества проектов</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">Наши услуги</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Комплексные решения для проектирования и строительства дорог
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: 'Layers',
                title: 'Стабилизация грунтов',
                description: 'Проектирование укрепления грунтовых оснований с использованием передовых технологий'
              },
              {
                icon: 'Map',
                title: 'Проектирование дорог',
                description: 'Разработка проектной документации для дорожных конструкций любой сложности'
              },
              {
                icon: 'LineChart',
                title: 'Технико-экономическое обоснование',
                description: 'Анализ и оптимизация затрат на строительство и эксплуатацию'
              },
              {
                icon: 'FileCheck',
                title: 'Экспертиза проектов',
                description: 'Проверка и оптимизация существующих проектных решений'
              },
              {
                icon: 'Settings',
                title: 'Технический надзор',
                description: 'Контроль качества выполнения работ на всех этапах строительства'
              },
              {
                icon: 'Users',
                title: 'Консалтинг',
                description: 'Профессиональные консультации по вопросам дорожного строительства'
              }
            ].map((service, idx) => (
              <Card key={idx} className="bg-background border-border hover:border-primary transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon name={service.icon} size={28} className="text-primary" />
                  </div>
                  <CardTitle className="font-heading text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">Инновационные решения</h2>
            <p className="text-muted-foreground text-lg">
              Технологии, которые меняют индустрию
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-card border-border p-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Zap" size={32} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-2xl mb-3">Ускоренная стабилизация</h3>
                  <p className="text-muted-foreground mb-4">
                    Применение современных вяжущих позволяет сократить время твердения грунта до 3-5 дней вместо стандартных 28 суток.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">Экономия времени</Badge>
                    <Badge variant="outline">Высокая прочность</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border p-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Recycle" size={32} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-2xl mb-3">Использование местных материалов</h3>
                  <p className="text-muted-foreground mb-4">
                    Технология переработки существующего дорожного покрытия снижает потребность в привозных материалах на 70%.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">Экология</Badge>
                    <Badge variant="outline">Снижение затрат</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border p-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Activity" size={32} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-2xl mb-3">BIM-проектирование</h3>
                  <p className="text-muted-foreground mb-4">
                    3D-моделирование и цифровые двойники позволяют выявить коллизии на этапе проектирования и избежать переделок.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">Точность</Badge>
                    <Badge variant="outline">Визуализация</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border p-8">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Brain" size={32} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-2xl mb-3">AI-оптимизация проектов</h3>
                  <p className="text-muted-foreground mb-4">
                    Искусственный интеллект подбирает оптимальные параметры конструкций, минимизируя стоимость при сохранении качества.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">Инновации</Badge>
                    <Badge variant="outline">Оптимизация</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="projects" className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">Реализованные проекты</h2>
            <p className="text-muted-foreground text-lg">
              Кейсы с конкретными результатами и экономией
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[
              {
                title: 'Магистраль М-11',
                location: 'Московская область',
                description: 'Проектирование и стабилизация грунтов на участке 85 км',
                stats: {
                  budget: '120 млн ₽',
                  time: '4 месяца',
                  saved: '32%'
                }
              },
              {
                title: 'Обход г. Тверь',
                location: 'Тверская область',
                description: 'Комплексное проектирование дорожной конструкции',
                stats: {
                  budget: '85 млн ₽',
                  time: '3 месяца',
                  saved: '28%'
                }
              },
              {
                title: 'Реконструкция А-108',
                location: 'Подмосковье',
                description: 'Укрепление грунтового основания с использованием геосинтетики',
                stats: {
                  budget: '65 млн ₽',
                  time: '2.5 месяца',
                  saved: '35%'
                }
              }
            ].map((project, idx) => (
              <Card key={idx} className="bg-background border-border hover:border-primary transition-all hover:shadow-lg overflow-hidden group">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCA0YzEuMTA1IDAgMiAuODk1IDIgMnMtLjg5NSAyLTIgMi0yLS44OTUtMi0yIC44OTUtMiAyLTJ6IiBmaWxsPSIjMDBhNGU5IiBvcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-50" />
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-background/80 backdrop-blur-sm">{project.location}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="font-heading text-xl">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Бюджет проекта</span>
                      <span className="font-semibold">{project.stats.budget}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Срок реализации</span>
                      <span className="font-semibold">{project.stats.time}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <span className="text-sm font-medium">Экономия для заказчика</span>
                      <span className="font-bold text-accent text-xl">{project.stats.saved}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="technology" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">Наша технология</h2>
            <p className="text-muted-foreground text-lg">
              Пошаговый процесс создания эффективных решений
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: 'FlaskConical',
                title: 'Анализ грунтов',
                description: 'Лабораторные испытания и геологические изыскания'
              },
              {
                step: '02',
                icon: 'Cpu',
                title: 'Цифровое моделирование',
                description: 'BIM-проектирование и расчет несущей способности'
              },
              {
                step: '03',
                icon: 'FileCheck2',
                title: 'Оптимизация проекта',
                description: 'Подбор оптимальных решений по стоимости и качеству'
              },
              {
                step: '04',
                icon: 'Rocket',
                title: 'Реализация',
                description: 'Технический надзор и контроль качества'
              }
            ].map((item, idx) => (
              <Card key={idx} className="bg-card border-border relative overflow-hidden group hover:border-primary transition-all">
                <div className="absolute top-0 right-0 text-8xl font-heading font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
                  {item.step}
                </div>
                <CardHeader className="relative z-10">
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon name={item.icon} size={28} className="text-primary" />
                  </div>
                  <CardTitle className="font-heading text-xl">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="mt-12 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="font-heading text-3xl mb-4">Почему выбирают нас?</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div>
                  <div className="text-5xl font-heading font-bold text-primary mb-2">15+</div>
                  <p className="text-muted-foreground">лет опыта в проектировании</p>
                </div>
                <div>
                  <div className="text-5xl font-heading font-bold text-accent mb-2">250+</div>
                  <p className="text-muted-foreground">реализованных проектов</p>
                </div>
                <div>
                  <div className="text-5xl font-heading font-bold text-primary mb-2">98%</div>
                  <p className="text-muted-foreground">довольных заказчиков</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 bg-card">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4">Свяжитесь с нами</h2>
            <p className="text-muted-foreground text-lg">
              Оставьте заявку на консультацию или запросите коммерческое предложение
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-background border-border">
              <CardHeader>
                <CardTitle className="font-heading">Отправить заявку</CardTitle>
                <CardDescription>Мы свяжемся с вами в течение 24 часов</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Ваше имя"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Телефон"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Опишите ваш проект"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    <Icon name="Send" size={20} className="mr-2" />
                    Отправить заявку
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-background border-border">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Mail" size={24} className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-lg">Email</CardTitle>
                    <CardDescription className="text-base">info@roadtech.ru</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-background border-border">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="Phone" size={24} className="text-accent" />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-lg">Телефон</CardTitle>
                    <CardDescription className="text-base">+7 (495) 123-45-67</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-background border-border">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="MapPin" size={24} className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-heading text-lg">Офис</CardTitle>
                    <CardDescription className="text-base">г. Москва, ул. Проектная, 1</CardDescription>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="font-heading text-xl mb-2">Специальное предложение</CardTitle>
                  <CardDescription className="text-base">
                    Бесплатная консультация и предварительный расчет стоимости проекта при обращении в этом месяце
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-background border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-heading font-bold text-2xl text-gradient mb-4">RoadTech</div>
              <p className="text-muted-foreground text-sm">
                Технологический лидер в проектировании дорог и стабилизации грунтов
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#services" className="hover:text-primary transition-colors">Стабилизация грунтов</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Проектирование</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">ТЭО</a></li>
                <li><a href="#services" className="hover:text-primary transition-colors">Консалтинг</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#technology" className="hover:text-primary transition-colors">О технологии</a></li>
                <li><a href="#projects" className="hover:text-primary transition-colors">Проекты</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>+7 (495) 123-45-67</li>
                <li>info@roadtech.ru</li>
                <li>г. Москва, ул. Проектная, 1</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 RoadTech. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
