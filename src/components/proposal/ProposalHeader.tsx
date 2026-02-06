import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ProposalHeaderProps {
  totalCost: number;
  onExportExcel: () => void;
  onExportPDF: () => void;
  onExportContract: () => void;
  isVisible: boolean;
}

const ProposalHeader = ({ totalCost, onExportExcel, onExportPDF, onExportContract, isVisible }: ProposalHeaderProps) => {
  return (
    <div 
      id="header" 
      data-animate 
      className={`mb-8 md:mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
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
          
          <p className="text-sm md:text-base text-gray-500 mt-6">Республика Карелия | 2 этажа (высота 10 м) | Площадь до 1500 м² | Участок до 1 га</p>
        </div>
        <div className="text-left md:text-right">
          <div className="text-xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {totalCost.toLocaleString('ru-RU')} ₽
          </div>
          <div className="text-sm md:text-base text-gray-600">Проектирование "под ключ"</div>
          <div className="text-xs md:text-sm text-gray-500 mt-1">Без НДС</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button onClick={onExportExcel} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg">
          <Icon name="FileSpreadsheet" size={18} className="mr-2" />
          <span className="text-sm md:text-base">Скачать График работ (Excel)</span>
        </Button>
        <Button onClick={onExportPDF} className="bg-gradient-to-r from-red-500 to-violet-600 hover:from-red-600 hover:to-violet-700 text-white shadow-lg">
          <Icon name="FileText" size={18} className="mr-2" />
          <span className="text-sm md:text-base">Скачать КП (PDF)</span>
        </Button>
        <Button onClick={onExportContract} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
          <Icon name="FileSignature" size={18} className="mr-2" />
          <span className="text-sm md:text-base">Скачать Договор (Word)</span>
        </Button>
      </div>
    </div>
  );
};

export default ProposalHeader;
