import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export const PriceListUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        toast({
          title: 'Ошибка',
          description: 'Пожалуйста, выберите CSV файл',
          variant: 'destructive'
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csv = e.target?.result as string;
        
        const response = await fetch('https://functions.poehali.dev/a4bb63b0-ad90-4bc0-bbf6-2769f1f1f2f7', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csv_data: csv })
        });

        if (response.ok) {
          toast({
            title: 'Успешно!',
            description: 'Прайс-лист загружен в базу данных'
          });
          setFile(null);
        } else {
          const error = await response.json();
          throw new Error(error.error || 'Ошибка загрузки');
        }
      };
      reader.readAsText(file);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось загрузить прайс-лист',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="FileSpreadsheet" size={24} />
          Загрузка прайс-листа
        </CardTitle>
        <CardDescription>
          Загрузите CSV файл с услугами и ценами. Формат: name, special_rules, price_per_unit, min_order_sum, unit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="csv-file">CSV файл</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>

        {file && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Icon name="File" size={20} className="text-muted-foreground" />
            <span className="text-sm flex-1">{file.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFile(null)}
              disabled={uploading}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Icon name="Loader2" size={16} className="animate-spin mr-2" />
              Загрузка...
            </>
          ) : (
            <>
              <Icon name="Upload" size={16} className="mr-2" />
              Загрузить прайс-лист
            </>
          )}
        </Button>

        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-medium">Пример формата CSV:</p>
          <code className="block bg-muted p-2 rounded text-xs">
            name,special_rules,price_per_unit,min_order_sum,unit<br/>
            Лендинг,,50000,50000,проект<br/>
            Корпоративный сайт,5+ страниц,100000,100000,проект
          </code>
        </div>
      </CardContent>
    </Card>
  );
};
