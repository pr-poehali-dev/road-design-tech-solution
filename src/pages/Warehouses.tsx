import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Warehouses = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/crm')}
              variant="outline"
              size="sm"
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад в CRM
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Генератор складов</h1>
              <p className="text-cyan-400/70 text-sm">Проектирование промышленных зданий</p>
            </div>
          </div>
        </div>

        <div className="text-white text-center py-20">
          <h2 className="text-2xl mb-4">Страница складов загружена</h2>
          <p>Если видишь этот текст — роутинг работает</p>
        </div>
      </div>
    </div>
  );
};

export default Warehouses;