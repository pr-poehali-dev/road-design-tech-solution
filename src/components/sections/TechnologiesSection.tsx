import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Technology {
  title: string;
  description: string;
  tags: string[];
}

interface TechnologiesSectionProps {
  technologies: {
    cement: Technology;
    bitumen: Technology;
    mechanical: Technology;
  };
  activeTech: string;
  setActiveTech: (tech: string) => void;
}

const TechnologiesSection = ({ technologies, activeTech, setActiveTech }: TechnologiesSectionProps) => {
  return (
    <section id="technologies" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-80 z-0">
        <img 
          src="https://cdn.poehali.dev/files/стабил.jpg" 
          alt="Стабилизация грунтов"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>
      <div className="container mx-auto max-w-6xl relative z-10">
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
  );
};

export default TechnologiesSection;
