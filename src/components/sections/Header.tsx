import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  saveLead: (data: any) => void;
}

const Header = ({ saveLead }: HeaderProps) => {
  return (
    <header className="fixed top-0 w-full bg-background/90 backdrop-blur-lg border-b border-border z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center glow-button">
            <Icon name="Route" size={24} className="text-white" />
          </div>
          <span className="font-heading font-bold text-xl md:text-2xl">DEOD</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium items-center">
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
              phone: '',
              email: '',
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
  );
};

export default Header;
