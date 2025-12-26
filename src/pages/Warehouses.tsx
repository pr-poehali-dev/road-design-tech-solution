import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { WarehouseDesigner } from '@/components/crm/WarehouseDesigner';

const Warehouses = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Icon name="Warehouse" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Конструктор складов</h1>
                <p className="text-sm text-muted-foreground">Промышленные здания по ГОСТ</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
            >
              <Icon name="Home" size={16} className="mr-2" />
              На главную
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Проектирование промышленных складов
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI-конструктор складских зданий с автоматическим расчетом сметы, 3D-визуализацией и генерацией технической документации
            </p>
          </div>

          <WarehouseDesigner />
        </div>
      </main>

      <footer className="border-t border-border/40 mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 DEOD SPACE. Проектирование промышленных объектов</p>
        </div>
      </footer>
    </div>
  );
};

export default Warehouses;
