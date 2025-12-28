interface SimpleWarehouseViewerProps {
  params: {
    length: number;
    width: number;
    height: number;
    gatesCount: number;
    windowsCount: number;
    constructionType: string;
  };
}

export const SimpleWarehouseViewer = ({ params }: SimpleWarehouseViewerProps) => {
  const { length, width, height, gatesCount, windowsCount, constructionType } = params;
  
  const scale = 2;
  const w = width * scale;
  const h = height * scale * 1.2;
  const d = length * scale;

  return (
    <div className="w-full aspect-video bg-gradient-to-b from-slate-900 to-slate-950 rounded-lg overflow-hidden p-8 flex items-center justify-center">
      <div className="relative" style={{ perspective: '1000px' }}>
        <div
          className="relative transition-transform duration-300 hover:rotate-y-12"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-15deg) rotateY(-25deg)',
            width: `${w}px`,
            height: `${h}px`,
          }}
        >
          {/* Пол */}
          <div
            className="absolute bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600"
            style={{
              width: `${w}px`,
              height: `${d}px`,
              transform: `rotateX(90deg) translateZ(-${h}px)`,
              transformOrigin: 'top',
            }}
          />

          {/* Передняя стена */}
          <div
            className="absolute bg-gradient-to-b from-gray-400 to-gray-500 border-2 border-gray-600"
            style={{
              width: `${w}px`,
              height: `${h}px`,
            }}
          >
            {/* Ворота */}
            {Array.from({ length: gatesCount }).map((_, i) => (
              <div
                key={`gate-${i}`}
                className="absolute bg-orange-500 border-2 border-orange-600"
                style={{
                  width: '40px',
                  height: '50px',
                  bottom: 0,
                  left: `${((i + 1) * w) / (gatesCount + 1) - 20}px`,
                }}
              />
            ))}
          </div>

          {/* Задняя стена */}
          <div
            className="absolute bg-gradient-to-b from-gray-500 to-gray-600 border border-gray-700"
            style={{
              width: `${w}px`,
              height: `${h}px`,
              transform: `translateZ(-${d}px)`,
            }}
          >
            {/* Окна */}
            {Array.from({ length: windowsCount }).map((_, i) => (
              <div
                key={`window-${i}`}
                className="absolute bg-cyan-400/60 border border-cyan-300"
                style={{
                  width: '30px',
                  height: '20px',
                  top: '20px',
                  left: `${((i + 1) * w) / (windowsCount + 1) - 15}px`,
                }}
              />
            ))}
          </div>

          {/* Левая стена */}
          <div
            className="absolute bg-gradient-to-b from-gray-500 to-gray-600 border border-gray-700"
            style={{
              width: `${d}px`,
              height: `${h}px`,
              transform: `rotateY(90deg) translateZ(0px)`,
              transformOrigin: 'left',
            }}
          />

          {/* Правая стена */}
          <div
            className="absolute bg-gradient-to-b from-gray-400 to-gray-500 border border-gray-600"
            style={{
              width: `${d}px`,
              height: `${h}px`,
              transform: `rotateY(90deg) translateZ(${w}px)`,
              transformOrigin: 'left',
            }}
          />

          {/* Крыша */}
          <div
            className="absolute bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-700"
            style={{
              width: `${w}px`,
              height: `${d}px`,
              transform: `rotateX(90deg) translateZ(0px)`,
              transformOrigin: 'top',
            }}
          />
        </div>

        {/* Информация */}
        <div className="mt-8 text-center space-y-2">
          <div className="text-cyan-400 text-sm font-mono">
            {length}м × {width}м × {height}м
          </div>
          <div className="text-gray-500 text-xs">
            {constructionType === 'steel' && '🏗️ Стальной каркас'}
            {constructionType === 'concrete' && '🧱 Ж/б каркас'}
            {constructionType === 'frameless' && '🏛️ Бескаркасный'}
          </div>
          <div className="text-gray-600 text-xs italic">
            Наведите для поворота
          </div>
        </div>
      </div>

      <style>{`
        .hover\\:rotate-y-12:hover {
          transform: rotateX(-15deg) rotateY(15deg) !important;
        }
      `}</style>
    </div>
  );
};
