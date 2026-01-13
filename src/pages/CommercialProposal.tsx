import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ExcelJS from 'exceljs';

const budgetData = [
  { name: 'Проектирование ОКС', value: 5145000, percentage: 87.2 },
  { name: 'Изыскания', value: 105000, percentage: 1.8 },
  { name: 'Благоустройство', value: 200000, percentage: 3.4 },
  { name: 'Авторский надзор', value: 450000, percentage: 7.6 },
];

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'];

const roadmapData = [
  { phase: 'Этап 0', weeks: 4 },
  { phase: 'Этап 1', weeks: 10 },
  { phase: 'Этап 2', weeks: 17 },
  { phase: 'Этап 3', weeks: 14 },
  { phase: 'Этап 4', weeks: 24 },
];

const detailedTasks = [
  { id: '0.1', task: 'Подписание договора и получение аванса', start: 1, duration: 1, phase: 'Этап 0', desc: 'Оформление всех необходимых документов, подписание договора с заказчиком' },
  { id: '0.2', task: 'Передача исходных данных от заказчика', start: 2, duration: 3, phase: 'Этап 0', desc: 'Получение технического задания, градостроительных условий, правоустанавливающих документов' },
  { id: '1.1', task: 'Инженерно-геодезические изыскания', start: 3, duration: 3, phase: 'Этап 1', desc: 'Топографическая съёмка участка М1:500, вынос в натуру границ земельного участка' },
  { id: '1.2', task: 'Инженерно-экологические изыскания', start: 3, duration: 3, phase: 'Этап 1', desc: 'Оценка воздействия на окружающую среду, анализ почв и воды' },
  { id: '1.3', task: 'Эскизный проект и концепция', start: 6, duration: 7, phase: 'Этап 1', desc: 'Разработка архитектурного решения, объёмно-планировочные решения, согласование с заказчиком' },
  { id: '2.1', task: 'Раздел 1. Пояснительная записка', start: 10, duration: 3, phase: 'Этап 2', desc: 'Общие сведения об объекте, основание для проектирования, исходные данные' },
  { id: '2.2', task: 'Раздел 2. Схема планировочной организации', start: 10, duration: 5, phase: 'Этап 2', desc: 'Генплан участка, размещение здания, благоустройство, парковка' },
  { id: '2.3', task: 'Раздел 3. Архитектурные решения', start: 13, duration: 6, phase: 'Этап 2', desc: 'Планы этажей, фасады, разрезы, спецификации материалов отделки' },
  { id: '2.4', task: 'Раздел 4. Конструктивные решения', start: 15, duration: 7, phase: 'Этап 2', desc: 'Фундаменты, несущие конструкции, каркас, кровля, расчёты прочности' },
  { id: '2.5', task: 'Раздел 5. Инженерные системы', start: 18, duration: 8, phase: 'Этап 2', desc: 'Водоснабжение, канализация, отопление, вентиляция, электроснабжение, слаботочные системы' },
  { id: '2.6', task: 'Раздел 6. Проект организации строительства', start: 20, duration: 3, phase: 'Этап 2', desc: 'Календарный план, строительный генплан, ведомость объёмов работ' },
  { id: '2.7', task: 'Раздел 8. ОДД (организация дорожного движения)', start: 22, duration: 2, phase: 'Этап 2', desc: 'Схемы движения транспорта, подъезды, парковка, дорожные знаки' },
  { id: '2.8', task: 'Раздел 9. Мероприятия по обеспечению пожарной безопасности', start: 23, duration: 3, phase: 'Этап 2', desc: 'Противопожарные мероприятия, пути эвакуации, системы сигнализации' },
  { id: '2.9', task: 'Раздел 10. Мероприятия по обеспечению доступа инвалидов', start: 24, duration: 2, phase: 'Этап 2', desc: 'Безбарьерная среда, пандусы, санузлы, навигация для МГН' },
  { id: '2.10', task: 'Раздел 11. Смета на строительство', start: 25, duration: 2, phase: 'Этап 2', desc: 'Локальные сметы, сводный сметный расчёт стоимости строительства' },
  { id: '2.11', task: 'Проверка комплектности ПД, устранение замечаний', start: 26, duration: 1, phase: 'Этап 2', desc: 'Внутренняя проверка всех разделов проектной документации' },
  { id: '3.1', task: 'Разработка рабочей документации (РД)', start: 27, duration: 14, phase: 'Этап 3', desc: 'Детальные чертежи для производства работ, спецификации оборудования' },
  { id: '3.2', task: 'Согласование РД с заказчиком', start: 40, duration: 2, phase: 'Этап 3', desc: 'Проверка рабочей документации заказчиком, внесение корректировок' },
  { id: '3.3', task: 'Передача РД для строительства', start: 41, duration: 1, phase: 'Этап 3', desc: 'Финальная комплектация и передача всей документации подрядчику' },
  { id: '4.1', task: 'Авторский надзор за строительством (6 месяцев)', start: 42, duration: 24, phase: 'Этап 4', desc: 'Контроль соответствия строительства проекту, выезды на объект, консультации подрядчика' },
];

const workItemsDetailed = [
  { 
    name: 'Проектная документация (ПД) стадии "П" (одноэтажное здание)', 
    unit: 'комплект', 
    volume: 1, 
    price: 4500000, 
    total: 4500000,
    description: 'Полный комплект проектной документации по всем разделам для одноэтажного торгового центра'
  },
  { 
    name: 'Рабочая документация (РД) стадии "Р"', 
    unit: 'комплект', 
    volume: 1, 
    price: 645000, 
    total: 645000,
    description: 'Детальные рабочие чертежи для производства строительно-монтажных работ'
  },
  { 
    name: 'Инженерно-геодезические изыскания', 
    unit: 'га', 
    volume: 1.0, 
    price: 50000, 
    total: 50000,
    description: 'Топографическая съёмка М1:500, вынос границ участка в натуру'
  },
  { 
    name: 'Инженерно-экологические изыскания', 
    unit: 'га', 
    volume: 1.0, 
    price: 55000, 
    total: 55000,
    description: 'Оценка воздействия на окружающую среду, анализ почв, воды, воздуха'
  },
  { 
    name: 'Проект благоустройства территории', 
    unit: 'га', 
    volume: 1.0, 
    price: 150000, 
    total: 150000,
    description: 'Дорожки, малые архитектурные формы, озеленение, освещение'
  },
  { 
    name: 'Проект парковки на 20 м/мест', 
    unit: 'м²', 
    volume: 500, 
    price: 100, 
    total: 50000,
    description: 'Планировочные решения, дорожная разметка, освещение парковочных мест'
  },
  { 
    name: 'Авторский надзор за строительством', 
    unit: 'месяц', 
    volume: 6, 
    price: 75000, 
    total: 450000,
    description: 'Контроль соответствия проекту, выезды на объект, консультации подрядчика, составление актов освидетельствования'
  },
];

export default function CommercialProposal() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('График работ');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Задача', key: 'task', width: 50 },
      { header: 'Описание', key: 'desc', width: 60 },
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
      fgColor: { argb: 'FF3b82f6' },
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
      backgroundColor: '#ffffff',
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

г. Лахденпохья                                                            "___" __________ 202__ г.

ООО "DEOD", именуемое в дальнейшем "ИСПОЛНИТЕЛЬ", в лице Генерального директора _________________, 
действующего на основании Устава, с одной стороны, и

_________________________________________________, именуемое в дальнейшем "ЗАКАЗЧИК", 
в лице _________________, действующего на основании _________________, с другой стороны, 
совместно именуемые "Стороны", заключили настоящий Договор о нижеследующем:

1. ПРЕДМЕТ ДОГОВОРА

1.1. ИСПОЛНИТЕЛЬ обязуется по заданию ЗАКАЗЧИКА выполнить проектные работы по объекту: 
"Торговый центр площадью до 1500 кв.м в г. Лахденпохья, Республика Карелия" (далее - "Объект"), 
а ЗАКАЗЧИК обязуется принять и оплатить выполненные работы.

1.2. Состав проектных работ:
- Разработка проектной документации (ПД) стадии "П" для одноэтажного здания
- Разработка рабочей документации (РД) стадии "Р"
- Проведение инженерных изысканий (геодезических, экологических)
- Разработка проекта благоустройства территории
- Авторский надзор за строительством (6 месяцев)

2. СТОИМОСТЬ РАБОТ И ПОРЯДОК РАСЧЕТОВ

2.1. Общая стоимость работ по настоящему Договору составляет: 
5 900 000 (Пять миллионов девятьсот тысяч) рублей 00 копеек без НДС.

2.2. Оплата производится в следующем порядке:
- 50% (2 950 000 руб.) - предоплата в течение 5 банковских дней с даты подписания Договора;
- 30% (1 770 000 руб.) - после сдачи проектной документации;
- 20% (1 180 000 руб.) - по факту выполнения всех работ и подписания итогового Акта сдачи-приемки работ.

3. СРОКИ ВЫПОЛНЕНИЯ РАБОТ

3.1. Общий срок выполнения работ: 12 месяцев с даты подписания Договора 
(без учёта срока строительства для авторского надзора).

3.2. Авторский надзор осуществляется в период строительства Объекта сроком 6 месяцев.

4. ГАРАНТИИ И ОТВЕТСТВЕННОСТЬ

4.1. ИСПОЛНИТЕЛЬ гарантирует:
- Соответствие проектной документации действующим нормам и стандартам
- Прохождение государственной экспертизы с первого раза
- Соблюдение сроков выполнения работ

4.2. За просрочку выполнения работ ИСПОЛНИТЕЛЬ уплачивает неустойку 0,1% от стоимости за каждый день.

4.3. За просрочку оплаты ЗАКАЗЧИК уплачивает пени 0,1% от суммы задолженности за каждый день.

5. ПРОЧИЕ УСЛОВИЯ

5.1. Договор вступает в силу с момента подписания.

5.2. Все споры решаются переговорами, при недостижении согласия - в суде.

6. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН

ИСПОЛНИТЕЛЬ:                    ЗАКАЗЧИК:
ООО "DEOD"                      _______________________

_____________/______/           _____________/______/
    М.П.                            М.П.
`;

    const blob = new Blob([contractText], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Договор_проектирование_ТЦ.doc';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalCost = workItemsDetailed.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6 md:py-12" ref={contentRef}>
        {/* Header */}
        <div 
          id="header" 
          data-animate 
          className={`mb-8 md:mb-12 transition-all duration-1000 ${visibleSections.has('header') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="inline-block px-4 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-full mb-4">
                ООО "DEOD"
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                Коммерческое предложение
              </h1>
              <p className="text-lg md:text-2xl text-gray-700 font-medium mb-6">Торговый центр в г. Лахденпохья</p>
              
              {/* Вращающиеся буквы ТЦ */}
              <div className="relative w-full h-32 mx-auto md:mx-0 flex items-center justify-center md:justify-start my-8">
                <style>{`
                  @keyframes rotateY {
                    0% { transform: rotateY(0deg); }
                    100% { transform: rotateY(360deg); }
                  }
                  .rotating-text {
                    animation: rotateY 4s linear infinite;
                    transform-style: preserve-3d;
                  }
                `}</style>
                
                <div className="rotating-text">
                  <div className="text-8xl md:text-9xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    ТЦ
                  </div>
                </div>
              </div>
              
              <p className="text-sm md:text-base text-gray-500 mt-6">Республика Карелия | Площадь до 1500 м² | Участок до 1 га</p>
            </div>
            <div className="text-left md:text-right">
              <div className="text-xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {totalCost.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-sm md:text-base text-gray-600">Проектирование "под ключ"</div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">Без НДС</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button onClick={exportToExcel} className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg">
              <Icon name="FileSpreadsheet" size={18} className="mr-2" />
              <span className="text-sm md:text-base">Скачать График работ (Excel)</span>
            </Button>
            <Button onClick={exportToPDF} className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg">
              <Icon name="FileText" size={18} className="mr-2" />
              <span className="text-sm md:text-base">Скачать КП (PDF)</span>
            </Button>
            <Button onClick={exportContract} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
              <Icon name="FileSignature" size={18} className="mr-2" />
              <span className="text-sm md:text-base">Скачать Договор (Word)</span>
            </Button>
          </div>
        </div>

        {/* Обзор проекта */}
        <div 
          id="overview" 
          data-animate 
          className={`mb-12 transition-all duration-1000 delay-100 ${visibleSections.has('overview') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <Card className="p-6 md:p-8 bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Icon name="Building2" size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Объект проектирования</h2>
                <p className="text-gray-600">Торговый центр | Новое строительство</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon name="Ruler" size={20} className="text-blue-600" />
                  Технические характеристики
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Общая площадь здания', value: 'до 1500 м²' },
                    { label: 'Строительный объём', value: '~10 500 м³' },
                    { label: 'Площадь земельного участка', value: 'до 1 га (10 000 м²)' },
                    { label: 'Средняя высота здания', value: '~7 метров' },
                    { label: 'Количество этажей', value: '1 этаж' },
                    { label: 'Парковка', value: '~20 машиномест' },
                    { label: 'Категория здания', value: 'Общественное (торговля)' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-white/60 hover:bg-white transition-colors">
                      <span className="text-gray-600 text-sm md:text-base">{item.label}:</span>
                      <span className="font-semibold text-gray-800 text-sm md:text-base">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon name="CheckCircle2" size={20} className="text-emerald-600" />
                  Состав работ
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Проектная документация (ПД)', desc: 'Все разделы по ПП РФ №87' },
                    { name: 'Рабочая документация (РД)', desc: 'Детальные чертежи для стройки' },
                    { name: 'Инженерные изыскания', desc: 'Геодезия + экология' },
                    { name: 'Проект благоустройства', desc: 'Дорожки, озеленение, МАФ' },
                    { name: 'Государственная экспертиза', desc: 'Сопровождение и устранение замечаний' },
                    { name: 'Авторский надзор', desc: '6 месяцев контроля строительства' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-cyan-50 hover:from-emerald-100 hover:to-cyan-100 transition-colors">
                      <Icon name="Check" size={20} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-gray-800 text-sm md:text-base">{item.name}</div>
                        <div className="text-xs md:text-sm text-gray-600">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Ключевые показатели */}
        <div 
          id="stats" 
          data-animate 
          className={`grid md:grid-cols-3 gap-4 md:gap-6 mb-12 transition-all duration-1000 delay-200 ${visibleSections.has('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <Card className="p-6 bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl hover:scale-105 transition-transform">
            <Icon name="Clock" size={40} className="mb-4" />
            <div className="text-4xl md:text-5xl font-bold mb-2">12 мес.</div>
            <div className="text-cyan-100">Срок реализации проекта</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-xl hover:scale-105 transition-transform">
            <Icon name="FileCheck" size={40} className="mb-4" />
            <div className="text-4xl md:text-5xl font-bold mb-2">6 этапов</div>
            <div className="text-emerald-100">Структурированная работа</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl hover:scale-105 transition-transform">
            <Icon name="Shield" size={40} className="mb-4" />
            <div className="text-4xl md:text-5xl font-bold mb-2">100%</div>
            <div className="text-purple-100">Соответствие ГОСТ и СНиП</div>
          </Card>
        </div>

        {/* Структура бюджета */}
        <div 
          id="budget" 
          data-animate 
          className={`mb-12 transition-all duration-1000 delay-300 ${visibleSections.has('budget') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <Card className="p-6 md:p-8 bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Icon name="PieChart" size={28} className="text-purple-600" />
              Структура бюджета
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.percentage}%`}
                      outerRadius={window.innerWidth < 768 ? 80 : 110}
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
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx] }} />
                      <span className="text-gray-700 font-medium text-sm md:text-base">{item.name}</span>
                    </div>
                    <span className="font-bold text-gray-800 text-sm md:text-base">{item.value.toLocaleString('ru-RU')} ₽</span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg mt-6">
                  <span className="font-bold text-lg md:text-xl">ИТОГО:</span>
                  <span className="font-bold text-2xl md:text-3xl">{totalCost.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Детализация работ и стоимости */}
        <div 
          id="detailed-costs" 
          data-animate 
          className={`mb-12 transition-all duration-1000 delay-400 ${visibleSections.has('detailed-costs') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <Card className="p-6 md:p-8 bg-gradient-to-br from-white to-cyan-50 border-cyan-200 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Icon name="Receipt" size={28} className="text-cyan-600" />
              Детальная смета
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b-2 border-cyan-300">
                    <th className="text-left py-4 px-2 md:px-4 text-cyan-700 font-bold">Наименование работ</th>
                    <th className="text-center py-4 px-2 md:px-4 text-cyan-700 font-bold hidden md:table-cell">Ед. изм.</th>
                    <th className="text-center py-4 px-2 md:px-4 text-cyan-700 font-bold hidden md:table-cell">Объем</th>
                    <th className="text-right py-4 px-2 md:px-4 text-cyan-700 font-bold hidden md:table-cell">Цена</th>
                    <th className="text-right py-4 px-2 md:px-4 text-cyan-700 font-bold">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {workItemsDetailed.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-cyan-50 transition-colors">
                      <td className="py-4 px-2 md:px-4">
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        <div className="text-xs md:text-sm text-gray-600 mt-1">{item.description}</div>
                        <div className="md:hidden text-xs text-gray-500 mt-1">
                          {item.volume} {item.unit} × {item.price.toLocaleString('ru-RU')} ₽
                        </div>
                      </td>
                      <td className="py-4 px-2 md:px-4 text-center text-gray-600 hidden md:table-cell">{item.unit}</td>
                      <td className="py-4 px-2 md:px-4 text-center text-gray-600 hidden md:table-cell">{item.volume}</td>
                      <td className="py-4 px-2 md:px-4 text-right text-gray-600 hidden md:table-cell">{item.price.toLocaleString('ru-RU')} ₽</td>
                      <td className="py-4 px-2 md:px-4 text-right font-bold text-gray-800">{item.total.toLocaleString('ru-RU')} ₽</td>
                    </tr>
                  ))}
                  <tr className="bg-gradient-to-r from-cyan-100 to-blue-100 font-bold">
                    <td className="py-5 px-2 md:px-4 text-lg md:text-xl text-gray-800" colSpan={4}>ИТОГО к оплате:</td>
                    <td className="py-5 px-2 md:px-4 text-right text-xl md:text-2xl text-cyan-700">{totalCost.toLocaleString('ru-RU')} ₽</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon name="Wallet" size={20} className="text-blue-600" />
                  Условия оплаты
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                      50%
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Предоплата</div>
                      <div className="text-sm text-gray-600">{(totalCost * 0.5).toLocaleString('ru-RU')} ₽</div>
                      <div className="text-xs text-gray-500">При подписании договора</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                      30%
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">После ПД + экспертиза</div>
                      <div className="text-sm text-gray-600">{(totalCost * 0.3).toLocaleString('ru-RU')} ₽</div>
                      <div className="text-xs text-gray-500">При получении положительного заключения</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                      20%
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">Финальный платёж</div>
                      <div className="text-sm text-gray-600">{(totalCost * 0.2).toLocaleString('ru-RU')} ₽</div>
                      <div className="text-xs text-gray-500">По факту выполнения всех работ</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-emerald-100 to-green-100 border-emerald-300">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Icon name="Gift" size={20} className="text-emerald-600" />
                  Что входит в стоимость
                </h3>
                <div className="space-y-2">
                  {[
                    'Полный комплект ПД и РД',
                    'Прохождение экспертизы с первого раза',
                    'Все изыскания и согласования',
                    '6 месяцев авторского надзора',
                    'Бесплатные консультации после сдачи',
                    'Корректировки по замечаниям',
                    'Электронная версия проекта',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm md:text-base">
                      <Icon name="CheckCircle" size={18} className="text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </Card>
        </div>

        {/* Дорожная карта */}
        <div 
          id="roadmap" 
          data-animate 
          className={`mb-12 transition-all duration-1000 delay-500 ${visibleSections.has('roadmap') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <Card className="p-6 md:p-8 bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Icon name="Calendar" size={28} className="text-orange-600" />
              График выполнения работ
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roadmapData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" label={{ value: 'Недели', position: 'bottom', fill: '#6b7280' }} />
                <YAxis type="category" dataKey="phase" stroke="#6b7280" width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #3b82f6', borderRadius: '8px' }}
                  labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                  formatter={(value: number) => [`${value} недель`, 'Длительность']}
                />
                <Legend />
                <Bar dataKey="weeks" fill="url(#colorGradient)" name="Длительность (недели)" radius={[0, 8, 8, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Детализированный план */}
        <div 
          id="detailed-plan" 
          data-animate 
          className={`mb-12 transition-all duration-1000 delay-600 ${visibleSections.has('detailed-plan') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <Card className="p-6 md:p-8 bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Icon name="ListTree" size={28} className="text-pink-600" />
              Детализированный план работ
            </h2>
            <div className="space-y-6">
              {['Этап 0', 'Этап 1', 'Этап 2', 'Этап 3', 'Этап 4', 'Этап 5'].map((phase, phaseIdx) => {
                const phaseTasks = detailedTasks.filter(t => t.phase === phase);
                const phaseDescriptions = [
                  { title: 'Предпроектная подготовка', subtitle: 'Недели 1-4', color: 'from-blue-500 to-cyan-500' },
                  { title: 'Изыскания и эскизный проект', subtitle: 'Недели 3-13', color: 'from-emerald-500 to-green-500' },
                  { title: 'Разработка проектной документации', subtitle: 'Недели 10-27', color: 'from-purple-500 to-pink-500' },
                  { title: 'Государственная экспертиза', subtitle: 'Недели 27-44', color: 'from-orange-500 to-red-500' },
                  { title: 'Разработка рабочей документации', subtitle: 'Недели 32-49', color: 'from-indigo-500 to-blue-500' },
                  { title: 'Авторский надзор за строительством', subtitle: 'Недели 49-72 (6 мес.)', color: 'from-teal-500 to-cyan-500' },
                ][phaseIdx];

                return (
                  <div key={phase} className="p-6 rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
                      <div>
                        <h3 className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${phaseDescriptions.color} bg-clip-text text-transparent`}>
                          {phase}: {phaseDescriptions.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{phaseDescriptions.subtitle}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${phaseDescriptions.color} text-white font-semibold text-sm whitespace-nowrap`}>
                        {phaseTasks.length} задач{phaseTasks.length > 4 ? '' : 'и'}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {phaseTasks.map(task => (
                        <div key={task.id} className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors border border-gray-200">
                          <span className="text-sm font-mono font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex-shrink-0">
                            {task.id}
                          </span>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 text-sm md:text-base">{task.task}</div>
                            <div className="text-xs md:text-sm text-gray-600 mt-1">{task.desc}</div>
                          </div>
                          <div className="flex gap-2 text-xs text-gray-500 flex-shrink-0">
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                              нед. {task.start}-{task.start + task.duration}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
                              {task.duration} нед.
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div 
          id="cta" 
          data-animate 
          className={`transition-all duration-1000 delay-700 ${visibleSections.has('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <Card className="p-8 md:p-12 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white shadow-2xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Готовы начать проект?</h2>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Свяжитесь с нами для обсуждения деталей и подписания договора. Гарантируем качество и соблюдение сроков!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-6 text-lg shadow-xl">
                  <Icon name="Phone" size={20} className="mr-2" />
                  +7 (999) 123-45-67
                </Button>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-6 text-lg">
                  <Icon name="Mail" size={20} className="mr-2" />
                  info@deod.space
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}