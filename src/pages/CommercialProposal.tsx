import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ExcelJS from 'exceljs';
import ProposalHeader from '@/components/proposal/ProposalHeader';
import ProposalOverviewAndMetrics from '@/components/proposal/ProposalOverviewAndMetrics';
import ProposalCharts from '@/components/proposal/ProposalCharts';
import ProposalDetails from '@/components/proposal/ProposalDetails';

const budgetData = [
  { name: 'Проектирование ОКС', value: 5545000, percentage: 94.0 },
  { name: 'Изыскания (геодезия, геология, экология)', value: 255000, percentage: 4.3 },
  { name: 'Благоустройство', value: 100000, percentage: 1.7 },
];

// ИТОГО: 3540000 + 2360000 + 50000 + 150000 + 55000 + 100000 = 6255000

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#06b6d4'];

const roadmapData = [
  { phase: 'Этап 0', weeks: 4 },
  { phase: 'Этап 1', weeks: 10 },
  { phase: 'Этап 2', weeks: 4 },
  { phase: 'Этап 3', weeks: 12 },
];

const detailedTasks = [
  { id: '0.1', task: 'Подписание договора и получение аванса', start: 1, duration: 1, phase: 'Этап 0', desc: 'Оформление всех необходимых документов, подписание договора с заказчиком' },
  { id: '0.2', task: 'Передача исходных данных от заказчика', start: 2, duration: 3, phase: 'Этап 0', desc: 'Получение технического задания, градостроительных условий, правоустанавливающих документов' },
  { id: '1.1', task: 'Инженерно-геодезические изыскания', start: 4, duration: 2, phase: 'Этап 1', desc: 'Топографическая съёмка участка М1:500, вынос в натуру границ земельного участка' },
  { id: '1.2', task: 'Инженерно-геологические изыскания', start: 4, duration: 3, phase: 'Этап 1', desc: 'Бурение скважин, отбор проб грунта, лабораторные испытания, определение несущей способности' },
  { id: '1.3', task: 'Инженерно-экологические изыскания', start: 4, duration: 2, phase: 'Этап 1', desc: 'Оценка воздействия на окружающую среду, анализ почв и воды' },
  { id: '1.4', task: 'Эскизный проект и концепция', start: 7, duration: 7, phase: 'Этап 1', desc: 'Разработка архитектурного решения, объёмно-планировочные решения' },
  { id: '1.5', task: 'Согласование эскизного проекта с заказчиком', start: 14, duration: 1, phase: 'Этап 1 (не входит в общий срок)', desc: 'Презентация концепции, внесение корректировок по замечаниям заказчика (срок зависит от заказчика)' },
  { id: '2.1', task: 'Раздел 1. Пояснительная записка', start: 14, duration: 1, phase: 'Этап 2', desc: 'Общие сведения об объекте, основание для проектирования, исходные данные' },
  { id: '2.2', task: 'Раздел 2. Схема планировочной организации', start: 14, duration: 2, phase: 'Этап 2', desc: 'Генплан участка, размещение здания, благоустройство, парковка' },
  { id: '2.3', task: 'Раздел 3-6. АР, КР, ИС, ПОС (параллельно)', start: 15, duration: 4, phase: 'Этап 2', desc: 'Архитектурные, конструктивные решения, инженерные системы, организация строительства - разработка ведётся параллельно' },
  { id: '2.4', task: 'Раздел 7. Мероприятия по охране окружающей среды', start: 16, duration: 2, phase: 'Этап 2', desc: 'Воздействие на окружающую среду, мероприятия по снижению негативного воздействия' },
  { id: '2.5', task: 'Раздел 8. ОДД (организация дорожного движения)', start: 17, duration: 1, phase: 'Этап 2', desc: 'Схемы движения транспорта, подъезды, парковка, дорожные знаки' },
  { id: '2.6', task: 'Раздел 9. Мероприятия по обеспечению пожарной безопасности', start: 17, duration: 1, phase: 'Этап 2', desc: 'Противопожарные мероприятия, пути эвакуации, системы сигнализации' },
  { id: '2.7', task: 'Раздел 10. Мероприятия по обеспечению доступа инвалидов', start: 17, duration: 1, phase: 'Этап 2', desc: 'Безбарьерная среда, пандусы, санузлы, навигация для МГН' },
  { id: '2.8', task: 'Проверка комплектности ПД, устранение замечаний', start: 18, duration: 1, phase: 'Этап 2', desc: 'Внутренняя проверка всех разделов проектной документации' },
  { id: '2.9', task: 'Согласование ПД с заказчиком', start: 19, duration: 1, phase: 'Этап 2 (не входит в общий срок)', desc: 'Передача проектной документации заказчику для проверки и утверждения (срок зависит от заказчика)' },
  { id: '3.1', task: 'Разработка рабочей документации: Архитектура', start: 18, duration: 10, phase: 'Этап 3', desc: 'Детальные архитектурные чертежи, узлы, спецификации материалов' },
  { id: '3.2', task: 'Разработка рабочей документации: Конструкции', start: 18, duration: 12, phase: 'Этап 3', desc: 'Рабочие чертежи фундаментов, каркаса, перекрытий, кровли' },
  { id: '3.3', task: 'Разработка рабочей документации: Инженерные системы', start: 19, duration: 11, phase: 'Этап 3', desc: 'Детальные схемы ВК, отопления, вентиляции, электрики, слаботочных систем' },
  { id: '3.4', task: 'Комплектация РД и передача для строительства', start: 30, duration: 1, phase: 'Этап 3', desc: 'Финальная сборка всей рабочей документации, передача подрядчику' },
];

const workItemsDetailed = [
  { 
    name: 'Проектная документация (ПД) стадии "П" (60%)', 
    unit: 'комплект', 
    volume: 1, 
    price: 3327000, 
    total: 3327000,
    description: 'Полный комплект проектной документации по всем разделам для 2-этажного торгового центра высотой 10 м'
  },
  { 
    name: 'Рабочая документация (РД) стадии "Д" (40%)', 
    unit: 'комплект', 
    volume: 1, 
    price: 2218000, 
    total: 2218000,
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
    name: 'Инженерно-геологические изыскания', 
    unit: 'компл.', 
    volume: 1, 
    price: 150000, 
    total: 150000,
    description: 'Бурение 5 скважин глубиной до 15 м, лабораторные испытания грунтов, определение несущей способности, уровня грунтовых вод'
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
    price: 100000, 
    total: 100000,
    description: 'Дорожки, малые архитектурные формы, озеленение, освещение, парковка'
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
"Торговый центр 2-этажный высотой 10 м, площадью до 1500 кв.м в г. Лахденпохья, Республика Карелия" (далее - "Объект"), 
а ЗАКАЗЧИК обязуется принять и оплатить выполненные работы.

1.2. Состав проектных работ:
- Разработка проектной документации (ПД) стадии "П" - 60% от общей стоимости
- Разработка рабочей документации (РД) стадии "Д" - 40% от общей стоимости
- Проведение инженерных изысканий (геодезических, геологических, экологических)
- Разработка проекта благоустройства территории

1.3. Согласование с ЗАКАЗЧИКОМ:
- Согласование эскизного проекта - 1 неделя (не входит в общий срок)
- Согласование проектной документации - 1 неделя (не входит в общий срок)

2. СТОИМОСТЬ РАБОТ И ПОРЯДОК РАСЧЕТОВ

2.1. Общая стоимость работ по настоящему Договору составляет: 
5 900 000 (Пять миллионов девятьсот тысяч) рублей 00 копеек без НДС.

2.2. Оплата производится в следующем порядке:
- 30% (1 770 000 руб.) - предоплата в течение 5 банковских дней с даты подписания Договора;
- 30% (1 770 000 руб.) - после сдачи проектной документации (ПД);
- 40% (2 360 000 руб.) - после подписания Акта сдачи-приемки работ по рабочей документации (РД).

3. СРОКИ ВЫПОЛНЕНИЯ РАБОТ

3.1. Общий срок выполнения работ: 30 недель с даты подписания Договора.

3.2. Сроки согласования с ЗАКАЗЧИКОМ (эскизный проект и ПД) не входят в общий срок и составляют по 1 неделе каждый.

4. ГАРАНТИИ И ОТВЕТСТВЕННОСТЬ

4.1. ИСПОЛНИТЕЛЬ гарантирует:
- Соответствие проектной документации действующим нормам и стандартам
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
        <ProposalHeader 
          totalCost={totalCost} 
          onExportExcel={exportToExcel} 
          onExportPDF={exportToPDF} 
          onExportContract={exportContract} 
          isVisible={visibleSections.has('header')} 
        />

        <ProposalOverviewAndMetrics 
          isOverviewVisible={visibleSections.has('overview')} 
          isStatsVisible={visibleSections.has('stats')} 
        />

        <ProposalCharts 
          budgetData={budgetData} 
          roadmapData={roadmapData} 
          colors={COLORS} 
          totalCost={totalCost} 
          isBudgetVisible={visibleSections.has('budget')} 
          isRoadmapVisible={visibleSections.has('roadmap')} 
        />

        <ProposalDetails 
          workItemsDetailed={workItemsDetailed} 
          totalCost={totalCost} 
          detailedTasks={detailedTasks} 
          isDetailedCostsVisible={visibleSections.has('detailed-costs')} 
          isDetailedPlanVisible={visibleSections.has('detailed-plan')} 
          isCTAVisible={visibleSections.has('cta')} 
        />
      </div>
    </div>
  );
}
