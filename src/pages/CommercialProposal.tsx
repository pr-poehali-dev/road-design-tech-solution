import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Plane } from '@react-three/drei';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ExcelJS from 'exceljs';

const budgetData = [
  { name: 'Проектирование ОКС', value: 10500000, percentage: 88.2 },
  { name: 'Изыскания', value: 105000, percentage: 0.9 },
  { name: 'Благоустройство', value: 625000, percentage: 5.2 },
  { name: 'Экспертиза', value: 200000, percentage: 1.7 },
  { name: 'Авторский надзор', value: 600000, percentage: 5.0 },
];

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];

const roadmapData = [
  { phase: 'Этап 0', weeks: 4, start: 0 },
  { phase: 'Этап 1', weeks: 10, start: 3 },
  { phase: 'Этап 2', weeks: 17, start: 10 },
  { phase: 'Этап 3', weeks: 16, start: 27 },
  { phase: 'Этап 4', weeks: 17, start: 32 },
  { phase: 'Этап 5', weeks: 24, start: 48 },
];

const detailedTasks = [
  { id: '0.1', task: 'Подписание договора', start: 1, duration: 1, phase: 'Этап 0' },
  { id: '0.2', task: 'Передача исходных данных', start: 2, duration: 3, phase: 'Этап 0' },
  { id: '1.1', task: 'Инженерные изыскания', start: 3, duration: 5, phase: 'Этап 1' },
  { id: '1.2', task: 'Эскизный проект', start: 5, duration: 8, phase: 'Этап 1' },
  { id: '2.1', task: 'Разработка ПД (все разделы)', start: 10, duration: 15, phase: 'Этап 2' },
  { id: '2.2', task: 'Проверка ПД', start: 25, duration: 2, phase: 'Этап 2' },
  { id: '3.1', task: 'Подготовка к экспертизе', start: 27, duration: 1, phase: 'Этап 3' },
  { id: '3.2', task: 'Прохождение экспертизы', start: 28, duration: 15, phase: 'Этап 3' },
  { id: '4.1', task: 'Разработка РД', start: 32, duration: 17, phase: 'Этап 4' },
  { id: '5.1', task: 'Авторский надзор', start: 48, duration: 24, phase: 'Этап 5' },
];

const workItems = [
  { name: 'Проектирование здания "под ключ"', unit: 'м³', volume: 10500, price: 2000, total: 21000000 },
  { name: 'Инженерно-геодезические изыскания', unit: 'га', volume: 1.0, price: 40000, total: 40000 },
  { name: 'Инженерно-экологические изыскания', unit: 'га', volume: 1.0, price: 65000, total: 65000 },
  { name: 'Благоустройство территории', unit: 'га', volume: 1.0, price: 500000, total: 500000 },
  { name: 'Проект парковки (опция)', unit: 'м²', volume: 500, price: 250, total: 125000 },
  { name: 'Сопровождение экспертизы', unit: 'компл.', volume: 1, price: 200000, total: 200000 },
  { name: 'Авторский надзор', unit: 'месяц', volume: 6, price: 100000, total: 600000 },
];

function Building3D() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Box args={[4, 1.5, 6]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color="#cbd5e1" />
      </Box>
      
      <Box args={[3.8, 0.3, 5.8]} position={[0, 1.65, 0]}>
        <meshStandardMaterial color="#06b6d4" />
      </Box>
      
      <Box args={[0.3, 1.5, 0.3]} position={[-1.5, 0.75, -2.5]}>
        <meshStandardMaterial color="#64748b" />
      </Box>
      <Box args={[0.3, 1.5, 0.3]} position={[1.5, 0.75, -2.5]}>
        <meshStandardMaterial color="#64748b" />
      </Box>
      <Box args={[0.3, 1.5, 0.3]} position={[-1.5, 0.75, 2.5]}>
        <meshStandardMaterial color="#64748b" />
      </Box>
      <Box args={[0.3, 1.5, 0.3]} position={[1.5, 0.75, 2.5]}>
        <meshStandardMaterial color="#64748b" />
      </Box>
      
      <Plane args={[8, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#475569" />
      </Plane>
      
      <OrbitControls enableZoom={true} enablePan={false} />
    </>
  );
}

export default function CommercialProposal() {
  const [activeTab, setActiveTab] = useState('overview');
  const contentRef = useRef<HTMLDivElement>(null);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('График работ');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Задача', key: 'task', width: 40 },
      { header: 'Неделя начала', key: 'start', width: 15 },
      { header: 'Длительность (нед.)', key: 'duration', width: 20 },
      { header: 'Этап', key: 'phase', width: 15 },
    ];

    detailedTasks.forEach(task => {
      worksheet.addRow(task);
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF06b6d4' },
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'График_работ_ТЦ_Лахденпохья.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      backgroundColor: '#0f172a',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    pdf.save('КП_ТЦ_Лахденпохья.pdf');
  };

  const exportContract = () => {
    const contractText = `
ДОГОВОР № ______
на выполнение проектных работ

г. Лахденпохья                                                                                              "___" __________ 202__ г.

ООО "DEOD", именуемое в дальнейшем "ИСПОЛНИТЕЛЬ", в лице Генерального директора _________________, действующего на основании Устава, с одной стороны, и

_________________________________________________, именуемое в дальнейшем "ЗАКАЗЧИК", в лице _________________, действующего на основании _________________, с другой стороны, совместно именуемые "Стороны", заключили настоящий Договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА

1.1. ИСПОЛНИТЕЛЬ обязуется по заданию ЗАКАЗЧИКА выполнить проектные работы по объекту: "Торговый центр площадью до 1500 кв.м в г. Лахденпохья, Республика Карелия" (далее - "Объект"), а ЗАКАЗЧИК обязуется принять и оплатить выполненные работы.

1.2. Состав проектных работ:
- Разработка проектной документации (ПД) стадии "П" по всем разделам согласно Постановлению Правительства РФ №87
- Разработка рабочей документации (РД) стадии "Р"
- Проведение инженерных изысканий (геодезических, экологических)
- Разработка проекта благоустройства территории
- Сопровождение прохождения государственной экспертизы
- Авторский надзор за строительством

1.3. Техническое задание на проектирование является неотъемлемой частью настоящего Договора (Приложение №1).

2. СТОИМОСТЬ РАБОТ И ПОРЯДОК РАСЧЕТОВ

2.1. Общая стоимость работ по настоящему Договору составляет: 11 905 000 (Одиннадцать миллионов девятьсот пять тысяч) рублей 00 копеек, в том числе НДС 20%.

2.2. Оплата производится в следующем порядке:
- 50% (5 952 500 руб.) - предоплата в течение 5 банковских дней с даты подписания Договора;
- 50% (5 952 500 руб.) - по факту выполнения работ и подписания Акта сдачи-приемки работ.

2.3. Оплата производится путем безналичного перечисления денежных средств на расчетный счет ИСПОЛНИТЕЛЯ.

3. СРОКИ ВЫПОЛНЕНИЯ РАБОТ

3.1. Общий срок выполнения работ: 12 месяцев с даты подписания Договора.

3.2. Промежуточные этапы и сроки определяются календарным планом-графиком (Приложение №2).

4. ОБЯЗАННОСТИ СТОРОН

4.1. ИСПОЛНИТЕЛЬ обязуется:
4.1.1. Выполнить работы качественно, в соответствии с действующими нормативными документами и техническим заданием.
4.1.2. Передать ЗАКАЗЧИКУ результаты выполненных работ в согласованные сроки.
4.1.3. Обеспечить сопровождение экспертизы проектной документации.
4.1.4. Осуществлять авторский надзор в период строительства Объекта.

4.2. ЗАКАЗЧИК обязуется:
4.2.1. Своевременно предоставить ИСПОЛНИТЕЛЮ исходные данные, необходимые для проектирования.
4.2.2. Обеспечить доступ на земельный участок для проведения изысканий.
4.2.3. Произвести оплату работ в порядке и сроки, установленные Договором.
4.2.4. Принять выполненные работы и подписать Акт сдачи-приемки.

5. ОТВЕТСТВЕННОСТЬ СТОРОН

5.1. За неисполнение или ненадлежащее исполнение обязательств по настоящему Договору Стороны несут ответственность в соответствии с действующим законодательством РФ.

5.2. В случае просрочки оплаты ЗАКАЗЧИК уплачивает пени в размере 0,1% от суммы задолженности за каждый день просрочки.

6. ПОРЯДОК СДАЧИ-ПРИЕМКИ РАБОТ

6.1. По завершении работ ИСПОЛНИТЕЛЬ передает ЗАКАЗЧИКУ результаты выполненных работ и Акт сдачи-приемки работ.

6.2. ЗАКАЗЧИК в течение 10 рабочих дней рассматривает представленные материалы и подписывает Акт либо направляет мотивированный отказ.

7. КОНФИДЕНЦИАЛЬНОСТЬ

7.1. Стороны обязуются сохранять конфиденциальность информации, полученной в ходе исполнения Договора.

8. РАЗРЕШЕНИЕ СПОРОВ

8.1. Споры по настоящему Договору разрешаются путем переговоров. При недостижении согласия - в Арбитражном суде по месту нахождения ответчика.

9. ПРОЧИЕ УСЛОВИЯ

9.1. Договор вступает в силу с момента подписания и действует до полного исполнения обязательств Сторонами.

9.2. Изменения и дополнения к Договору оформляются письменно в виде дополнительных соглашений.

9.3. Договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из Сторон.

10. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН

ИСПОЛНИТЕЛЬ:                                    ЗАКАЗЧИК:
ООО "DEOD"                                      _______________________
ИНН: ______________                             ИНН: ______________
КПП: ______________                             КПП: ______________
ОГРН: ______________                            ОГРН: ______________
Адрес: _____________                            Адрес: _____________
Р/с: _______________                            Р/с: _______________
Банк: ______________                            Банк: ______________
БИК: _______________                            БИК: _______________

Генеральный директор                            _______________________
_____________ / __________ /                    _____________ / __________ /
    М.П.                                            М.П.
`;

    const blob = new Blob([contractText], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Договор_проектирование_ТЦ.doc';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8" ref={contentRef}>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Коммерческое предложение</h1>
              <p className="text-cyan-400 text-lg">Торговый центр | г. Лахденпохья, Республика Карелия</p>
              <p className="text-gray-400 text-sm mt-1">Площадь: до 1500 м² | Участок: до 1 га</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-2">от ООО "DEOD"</div>
              <div className="text-3xl font-bold text-cyan-400">11 905 000 ₽</div>
              <div className="text-sm text-gray-400">Проектирование "под ключ"</div>
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <Button onClick={exportToExcel} className="bg-emerald-600 hover:bg-emerald-700">
              <Icon name="FileSpreadsheet" size={16} className="mr-2" />
              Скачать Excel (График)
            </Button>
            <Button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700">
              <Icon name="FileText" size={16} className="mr-2" />
              Скачать PDF
            </Button>
            <Button onClick={exportContract} className="bg-blue-600 hover:bg-blue-700">
              <Icon name="FileSignature" size={16} className="mr-2" />
              Скачать Договор (Word)
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="budget">Смета</TabsTrigger>
            <TabsTrigger value="roadmap">Дорожная карта</TabsTrigger>
            <TabsTrigger value="3d">3D Прототип</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="p-6 bg-slate-900/50 border-cyan-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Icon name="Building2" size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Объект проектирования</h2>
                  <p className="text-cyan-400/70">Новое строительство торгового центра</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white mb-3">Технические характеристики</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Общая площадь:</span>
                      <span className="text-white font-medium">до 1500 м²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Объем здания:</span>
                      <span className="text-white font-medium">~10 500 м³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Площадь участка:</span>
                      <span className="text-white font-medium">до 1 га</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Средняя высота:</span>
                      <span className="text-white font-medium">~7 м</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Парковка:</span>
                      <span className="text-white font-medium">~20 машиномест</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white mb-3">Состав работ</h3>
                  <div className="space-y-2 text-sm">
                    {['Проектная документация (ПД)', 'Рабочая документация (РД)', 'Инженерные изыскания', 'Проект благоустройства', 'Государственная экспертиза', 'Авторский надзор (6 мес.)'].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Icon name="CheckCircle2" size={16} className="text-emerald-400" />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/30">
                <Icon name="Clock" size={32} className="text-cyan-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">12 мес.</div>
                <div className="text-sm text-gray-400">Общий срок реализации</div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-green-600/10 border-emerald-500/30">
                <Icon name="FileCheck" size={32} className="text-emerald-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">7 этапов</div>
                <div className="text-sm text-gray-400">Структурированная работа</div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/30">
                <Icon name="Shield" size={32} className="text-purple-400 mb-3" />
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-gray-400">Соответствие ГОСТ и СНиП</div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <Card className="p-6 bg-slate-900/50 border-cyan-500/30">
              <h3 className="text-xl font-bold text-white mb-6">Структура бюджета</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={budgetData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.percentage}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {budgetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toLocaleString('ru-RU')} ₽`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {budgetData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[idx] }} />
                        <span className="text-gray-300 text-sm">{item.name}</span>
                      </div>
                      <span className="text-white font-bold">{item.value.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-4 rounded bg-cyan-500/20 border-2 border-cyan-500/50 mt-4">
                    <span className="text-white font-bold text-lg">ИТОГО:</span>
                    <span className="text-cyan-400 font-bold text-2xl">11 905 000 ₽</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-900/50 border-cyan-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Детализация работ</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cyan-500/30">
                      <th className="text-left py-3 px-2 text-cyan-400 font-semibold">Наименование работ</th>
                      <th className="text-center py-3 px-2 text-cyan-400 font-semibold">Ед. изм.</th>
                      <th className="text-center py-3 px-2 text-cyan-400 font-semibold">Объем</th>
                      <th className="text-right py-3 px-2 text-cyan-400 font-semibold">Цена за ед.</th>
                      <th className="text-right py-3 px-2 text-cyan-400 font-semibold">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                        <td className="py-3 px-2 text-gray-300">{item.name}</td>
                        <td className="py-3 px-2 text-center text-gray-400">{item.unit}</td>
                        <td className="py-3 px-2 text-center text-gray-400">{item.volume}</td>
                        <td className="py-3 px-2 text-right text-gray-400">{item.price.toLocaleString('ru-RU')} ₽</td>
                        <td className="py-3 px-2 text-right text-white font-semibold">{item.total.toLocaleString('ru-RU')} ₽</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/30">
              <h3 className="text-lg font-bold text-white mb-3">Условия оплаты</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-cyan-400">50%</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Предоплата</div>
                    <div className="text-sm text-gray-400">5 952 500 ₽</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-emerald-400">50%</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">По факту</div>
                    <div className="text-sm text-gray-400">5 952 500 ₽</div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <Card className="p-6 bg-slate-900/50 border-cyan-500/30">
              <h3 className="text-xl font-bold text-white mb-6">График выполнения работ</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roadmapData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#94a3b8" label={{ value: 'Недели', position: 'bottom', fill: '#94a3b8' }} />
                  <YAxis type="category" dataKey="phase" stroke="#94a3b8" width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #06b6d4' }}
                    labelStyle={{ color: '#06b6d4' }}
                    formatter={(value: number) => [`${value} недель`, 'Длительность']}
                  />
                  <Legend />
                  <Bar dataKey="weeks" fill="#06b6d4" name="Длительность (недели)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 bg-slate-900/50 border-cyan-500/30">
              <h3 className="text-xl font-bold text-white mb-4">Детализированный план работ</h3>
              <div className="space-y-6">
                {['Этап 0', 'Этап 1', 'Этап 2', 'Этап 3', 'Этап 4', 'Этап 5'].map((phase, phaseIdx) => {
                  const phaseTasks = detailedTasks.filter(t => t.phase === phase);
                  const phaseData = roadmapData[phaseIdx];
                  const phaseTitle = [
                    'Предпроектная подготовка и старт (недели 1-4)',
                    'Изыскания и эскизное проектирование (недели 3-12)',
                    'Разработка проектной документации (недели 10-26)',
                    'Прохождение государственной экспертизы (недели 27-42)',
                    'Разработка рабочей документации (недели 32-48)',
                    'Авторский надзор (начало после старта строительства)',
                  ][phaseIdx];

                  return (
                    <div key={phase} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-cyan-400">{phase}</h4>
                        <span className="text-sm text-gray-400">{phaseTitle}</span>
                      </div>
                      <div className="space-y-2">
                        {phaseTasks.map(task => (
                          <div key={task.id} className="flex items-center gap-3 p-2 rounded bg-slate-700/30">
                            <span className="text-xs text-cyan-400 font-mono w-8">{task.id}</span>
                            <span className="flex-1 text-sm text-gray-300">{task.task}</span>
                            <span className="text-xs text-gray-500">нед. {task.start}-{task.start + task.duration}</span>
                            <span className="text-xs text-gray-400 bg-slate-600/50 px-2 py-1 rounded">{task.duration} нед.</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="3d" className="space-y-6">
            <Card className="p-6 bg-slate-900/50 border-cyan-500/30">
              <h3 className="text-xl font-bold text-white mb-4">3D-прототип торгового центра</h3>
              <p className="text-sm text-gray-400 mb-6">Концептуальная модель здания. Используйте мышь для вращения и масштабирования.</p>
              <div className="w-full h-[500px] bg-slate-950 rounded-lg overflow-hidden border-2 border-cyan-500/30">
                <Canvas camera={{ position: [8, 5, 8], fov: 50 }}>
                  <Building3D />
                </Canvas>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-slate-800/50 text-center">
                  <Icon name="Maximize2" size={24} className="text-cyan-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">1500 м²</div>
                  <div className="text-xs text-gray-400">Площадь</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 text-center">
                  <Icon name="ArrowUpDown" size={24} className="text-cyan-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">7 м</div>
                  <div className="text-xs text-gray-400">Высота</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 text-center">
                  <Icon name="Box" size={24} className="text-cyan-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">10 500 м³</div>
                  <div className="text-xs text-gray-400">Объем</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 text-center">
                  <Icon name="Car" size={24} className="text-cyan-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">20 мест</div>
                  <div className="text-xs text-gray-400">Парковка</div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8 p-8 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-500/30">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Готовы начать проект?</h3>
            <p className="text-gray-300 mb-6">Свяжитесь с нами для обсуждения деталей и подписания договора</p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8">
                <Icon name="Phone" size={16} className="mr-2" />
                Связаться с нами
              </Button>
              <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                <Icon name="Mail" size={16} className="mr-2" />
                Отправить запрос
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
