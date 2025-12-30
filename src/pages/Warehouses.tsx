import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { SimpleWarehouseViewer } from '@/components/crm/SimpleWarehouseViewer';

interface WarehouseParams {
  length: number;
  width: number;
  height: number;
  constructionType: 'steel' | 'concrete' | 'frameless';
  roofType: 'single' | 'double' | 'arch';
  roofAngle: number;
  columnStep: number;
  wallMaterial: 'sandwich' | 'proflist' | 'concrete';
  wallThickness: number;
  gatesCount: number;
  gatesType: 'swing' | 'sliding' | 'sectional' | 'dock';
  windowsCount: number;
  region: string;
  purpose: string;
}

const Warehouses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [estimate, setEstimate] = useState<any>(null);

  const [params, setParams] = useState<WarehouseParams>({
    length: 48,
    width: 24,
    height: 8,
    constructionType: 'steel',
    roofType: 'double',
    roofAngle: 15,
    columnStep: 6,
    wallMaterial: 'sandwich',
    wallThickness: 150,
    gatesCount: 2,
    gatesType: 'sectional',
    windowsCount: 4,
    region: 'Московская область',
    purpose: 'Хранение общих грузов',
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const volume = params.length * params.width * params.height;
      
      const response = await fetch('https://functions.poehali.dev/48f6b4e5-56bd-455f-8903-d5fe4c62ffc2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params, volume }),
      });

      if (!response.ok) throw new Error('Ошибка расчёта сметы');

      const data = await response.json();
      setEstimate(data);

      toast({
        title: '✅ Проект склада готов',
        description: `Расчётная стоимость: ${data.total.toLocaleString('ru-RU')} ₽`,
      });
    } catch (error) {
      toast({
        title: '❌ Ошибка генерации',
        description: 'Не удалось сгенерировать проект склада',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!estimate) return;

    try {
      const response = await fetch('https://functions.poehali.dev/5cb05a8f-d328-4897-a175-eed9664e4d06', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params, estimate }),
      });

      if (!response.ok) throw new Error('Ошибка генерации PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `склад_${params.length}x${params.width}x${params.height}.html`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: '📄 PDF скачан',
        description: 'Технический отчёт успешно сохранён',
      });
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось сгенерировать PDF',
        variant: 'destructive',
      });
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-slate-900/50 border-cyan-500/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Icon name="Warehouse" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Конструктор склада</h2>
                <p className="text-sm text-cyan-400/70">Промышленное здание по ГОСТ</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Длина (м)</Label>
                  <Input
                    type="number"
                    value={params.length}
                    onChange={(e) => setParams({ ...params, length: Number(e.target.value) })}
                    min={12}
                    max={120}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Ширина (м)</Label>
                  <Input
                    type="number"
                    value={params.width}
                    onChange={(e) => setParams({ ...params, width: Number(e.target.value) })}
                    min={12}
                    max={36}
                    step={6}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Высота (м)</Label>
                  <Input
                    type="number"
                    value={params.height}
                    onChange={(e) => setParams({ ...params, height: Number(e.target.value) })}
                    min={6}
                    max={12}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Тип конструкции</Label>
                <Select value={params.constructionType} onValueChange={(v: any) => setParams({ ...params, constructionType: v })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="steel">🏗️ Стальной каркас</SelectItem>
                    <SelectItem value="concrete">🧱 Железобетонный каркас</SelectItem>
                    <SelectItem value="frameless">🏛️ Бескаркасный ангар</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Тип кровли</Label>
                <Select value={params.roofType} onValueChange={(v: any) => setParams({ ...params, roofType: v })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Односкатная</SelectItem>
                    <SelectItem value="double">Двускатная</SelectItem>
                    <SelectItem value="arch">Арочная</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Угол кровли (°)</Label>
                  <Input
                    type="number"
                    value={params.roofAngle}
                    onChange={(e) => setParams({ ...params, roofAngle: Number(e.target.value) })}
                    min={5}
                    max={30}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Шаг колонн (м)</Label>
                  <Input
                    type="number"
                    value={params.columnStep}
                    onChange={(e) => setParams({ ...params, columnStep: Number(e.target.value) })}
                    min={3}
                    max={12}
                    step={3}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Материал стен</Label>
                <Select value={params.wallMaterial} onValueChange={(v: any) => setParams({ ...params, wallMaterial: v })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandwich">Сэндвич-панели</SelectItem>
                    <SelectItem value="proflist">Профлист</SelectItem>
                    <SelectItem value="concrete">Бетонные панели</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Толщина стен (мм)</Label>
                <Input
                  type="number"
                  value={params.wallThickness}
                  onChange={(e) => setParams({ ...params, wallThickness: Number(e.target.value) })}
                  min={50}
                  max={300}
                  step={50}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Тип ворот</Label>
                <Select value={params.gatesType} onValueChange={(v: any) => setParams({ ...params, gatesType: v })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sectional">Секционные</SelectItem>
                    <SelectItem value="sliding">Откатные</SelectItem>
                    <SelectItem value="swing">Распашные</SelectItem>
                    <SelectItem value="dock">Докшелтер</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Количество ворот</Label>
                  <Input
                    type="number"
                    value={params.gatesCount}
                    onChange={(e) => setParams({ ...params, gatesCount: Number(e.target.value) })}
                    min={1}
                    max={10}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Количество окон</Label>
                  <Input
                    type="number"
                    value={params.windowsCount}
                    onChange={(e) => setParams({ ...params, windowsCount: Number(e.target.value) })}
                    min={0}
                    max={20}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Регион строительства</Label>
                <Select value={params.region} onValueChange={(v) => setParams({ ...params, region: v })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Московская область">Московская область</SelectItem>
                    <SelectItem value="Санкт-Петербург">Санкт-Петербург</SelectItem>
                    <SelectItem value="Краснодарский край">Краснодарский край</SelectItem>
                    <SelectItem value="Свердловская область">Свердловская область</SelectItem>
                    <SelectItem value="Татарстан">Татарстан</SelectItem>
                    <SelectItem value="Другой регион">Другой регион</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Назначение склада</Label>
                <Select value={params.purpose} onValueChange={(v) => setParams({ ...params, purpose: v })}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Хранение общих грузов">Хранение общих грузов</SelectItem>
                    <SelectItem value="Холодильный склад">Холодильный склад</SelectItem>
                    <SelectItem value="Производство">Производство</SelectItem>
                    <SelectItem value="Логистический центр">Логистический центр</SelectItem>
                    <SelectItem value="Автосервис">Автосервис</SelectItem>
                    <SelectItem value="Сельхозпродукция">Сельхозпродукция</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                >
                  <Icon name={isGenerating ? 'Loader2' : 'Rocket'} size={16} className={`mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Генерация проекта...' : 'Сгенерировать проект'}
                </Button>

                {estimate && (
                  <Button
                    onClick={handleDownloadPDF}
                    variant="outline"
                    className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <Icon name="FileText" size={16} className="mr-2" />
                    Скачать PDF
                  </Button>
                )}
              </div>

              {estimate && (
                <div className="mt-6 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <h3 className="text-white font-bold mb-2">Смета проекта</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-cyan-400">
                      <span>Объём здания:</span>
                      <span>{(params.length * params.width * params.height).toLocaleString('ru-RU')} м³</span>
                    </div>
                    <div className="flex justify-between text-cyan-400">
                      <span>Площадь пола:</span>
                      <span>{(params.length * params.width).toLocaleString('ru-RU')} м²</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-cyan-500/30">
                      <span>ИТОГО:</span>
                      <span>{estimate.total.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-slate-900/50 border-cyan-500/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Параметры склада</h2>
              <div className="text-sm text-cyan-400">
                {params.length}м × {params.width}м × {params.height}м
              </div>
            </div>
            
            <SimpleWarehouseViewer params={params} />
            
            {!estimate && (
              <div className="mt-4 text-center text-sm text-gray-500 italic">
                Измените параметры для расчета сметы
              </div>
            )}

            {estimate && (
              <div className="mt-6 space-y-3">
                <h3 className="text-white font-bold">Детализация сметы:</h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {estimate.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 rounded bg-slate-800/50 border border-slate-700">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-cyan-400 text-sm font-medium">{item.name}</span>
                        <span className="text-white font-bold">{item.sum.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.quantity} {item.unit} × {item.price_per_unit.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Warehouses;