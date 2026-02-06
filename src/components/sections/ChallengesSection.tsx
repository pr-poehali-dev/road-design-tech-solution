import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Challenge {
  id: string;
  icon: string;
  problem: string;
  solution: string;
  image: string;
}

interface ChallengesSectionProps {
  challenges: Challenge[];
  activeChallenge: string | null;
  setActiveChallenge: (id: string | null) => void;
}

const ChallengesSection = ({ challenges, activeChallenge, setActiveChallenge }: ChallengesSectionProps) => {
  return (
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
  );
};

export default ChallengesSection;
