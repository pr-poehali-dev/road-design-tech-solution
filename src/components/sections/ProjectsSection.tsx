import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Project {
  title: string;
  location: string;
  challenge: string;
  solution: string;
  results: {
    saved: string;
    reduction: string;
    time: string;
  };
  image: string;
}

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  return (
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
  );
};

export default ProjectsSection;
