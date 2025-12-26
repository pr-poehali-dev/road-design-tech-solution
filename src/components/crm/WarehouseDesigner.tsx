import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { WarehouseViewer } from './WarehouseViewer';

interface WarehouseParams {
  length: number;
  width: number;
  height: number;
  constructionType: 'steel' | 'concrete' | 'frameless';
  roofType: 'single' | 'double' | 'arch';
  roofAngle: number;
  spanCount: number;
  columnStep: number;
  wallMaterial: 'sandwich' | 'proflist' | 'concrete';
  wallThickness: number;
  gatesCount: number;
  gatesType: 'swing' | 'sliding' | 'sectional' | 'dock';
  windowsCount: number;
  region: string;
  purpose: string;
}

export const WarehouseDesigner = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [estimate, setEstimate] = useState<any>(null);

  const [params, setParams] = useState<WarehouseParams>({
    length: 48,
    width: 24,
    height: 8,
    constructionType: 'steel',
    roofType: 'double',
    roofAngle: 10,
    spanCount: 1,
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
    setShowViewer(false);
    
    try {
      const volume = params.length * params.width * params.height;
      
      const response = await fetch('https://functions.poehali.dev/48f6b4e5-56bd-455f-8903-d5fe4c62ffc2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ params, volume }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`Ошибка ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Estimate received:', data);
      
      setEstimate(data);
      setIsGenerating(false);
      setShowViewer(true);
      
      toast({
        title: '✅ Проект склада готов',
        description: `Расчётная стоимость: ${data.total.toLocaleString('ru-RU')} ₽`,
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      setIsGenerating(false);
      setShowViewer(false);
      toast({
        title: '❌ Ошибка генерации',
        description: error.message || 'Не удалось сгенерировать проект склада',
        variant: 'destructive',
      });
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
                <SelectItem value="steel">Стальной каркас</SelectItem>
                <SelectItem value="concrete">Железобетонный каркас</SelectItem>
                <SelectItem value="frameless">Бескаркасный ангар</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Шаг колонн (м)</Label>
              <Select value={String(params.columnStep)} onValueChange={(v) => setParams({ ...params, columnStep: Number(v) })}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 м</SelectItem>
                  <SelectItem value="12">12 м</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="concrete">Бетонные плиты</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-white">Ворота (шт)</Label>
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
              <Label className="text-white">Тип ворот</Label>
              <Select value={params.gatesType} onValueChange={(v: any) => setParams({ ...params, gatesType: v })}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="swing">Распашные</SelectItem>
                  <SelectItem value="sliding">Откатные</SelectItem>
                  <SelectItem value="sectional">Секционные</SelectItem>
                  <SelectItem value="dock">Док-уровень</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white">Окна (шт)</Label>
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
            <Input
              value={params.region}
              onChange={(e) => setParams({ ...params, region: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Московская область"
            />
          </div>

          <div>
            <Label className="text-white">Назначение склада</Label>
            <Input
              value={params.purpose}
              onChange={(e) => setParams({ ...params, purpose: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Хранение общих грузов"
            />
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
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                >
                  <Icon name="FileText" size={16} className="mr-2" />
                  Скачать PDF
                </Button>
                <Button
                  onClick={() => setShowViewer(!showViewer)}
                  variant="outline"
                  className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                >
                  <Icon name="Eye" size={16} className="mr-2" />
                  {showViewer ? 'Скрыть 3D' : 'Показать 3D'}
                </Button>
              </div>
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
          <h2 className="text-xl font-bold text-white">3D Визуализация</h2>
          <div className="text-sm text-cyan-400">
            {params.length}м × {params.width}м × {params.height}м
          </div>
        </div>
        
        {isGenerating ? (
          <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
            <div className="text-center text-cyan-400">
              <div className="animate-spin h-12 w-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="font-bold text-lg">Генерация проекта...</p>
              <p className="text-sm text-cyan-400/70 mt-2">Расчёт сметы и создание 3D-модели</p>
            </div>
          </div>
        ) : showViewer && estimate ? (
          <WarehouseViewer params={params} />
        ) : (
          <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
            <div className="text-center text-slate-500">
              <Icon name="Box" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Нажмите "Сгенерировать проект"</p>
              <p className="text-sm">для создания 3D-модели</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};