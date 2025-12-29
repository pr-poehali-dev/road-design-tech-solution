interface SimpleWarehouseViewerProps {
  params: {
    length: number;
    width: number;
    height: number;
    gatesCount: number;
    windowsCount: number;
    constructionType: string;
    roofType?: string;
    roofAngle?: number;
    columnStep?: number;
    wallMaterial?: string;
    wallThickness?: number;
    gatesType?: string;
  };
}

export const SimpleWarehouseViewer = ({ params }: SimpleWarehouseViewerProps) => {
  const { 
    length, 
    width, 
    height, 
    gatesCount, 
    windowsCount, 
    constructionType,
    roofType = 'double',
    roofAngle = 15,
    wallMaterial = 'sandwich'
  } = params;
  
  const scale = 8;
  const w = width * scale;
  const h = height * scale;
  const d = length * scale;

  const wallColors = {
    sandwich: 'from-gray-300 via-gray-400 to-gray-500',
    proflist: 'from-gray-400 via-gray-500 to-gray-600',
    concrete: 'from-stone-400 via-stone-500 to-stone-600'
  };

  const roofColors = {
    steel: 'from-blue-400 via-blue-500 to-blue-700',
    concrete: 'from-gray-500 via-gray-600 to-gray-700',
    frameless: 'from-zinc-400 via-zinc-500 to-zinc-600'
  };

  return (
    <div className="w-full aspect-video bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-lg overflow-hidden flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
      
      <div className="relative z-10" style={{ perspective: '1800px' }}>
        <div
          className="warehouse-3d relative"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-25deg) rotateY(-35deg)',
            width: `${w}px`,
            height: `${h}px`,
          }}
        >
          {/* Пол */}
          <div
            className="absolute bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 border-2 border-gray-600"
            style={{
              width: `${w}px`,
              height: `${d}px`,
              transform: `rotateX(90deg) translateZ(-${h}px)`,
              transformOrigin: 'top',
              boxShadow: '0 10px 50px rgba(0,0,0,0.9)',
            }}
          >
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_38px,#555_38px,#555_40px)]" />
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_38px,#555_38px,#555_40px)]" />
          </div>

          {/* Передняя стена */}
          <div
            className={`absolute bg-gradient-to-b ${wallColors[wallMaterial as keyof typeof wallColors] || wallColors.sandwich} border-2 border-gray-600`}
            style={{
              width: `${w}px`,
              height: `${h}px`,
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)',
            }}
          >
            <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_28px,#555_28px,#555_30px)]" />
            
            {Array.from({ length: Math.min(gatesCount, 5) }).map((_, i) => {
              const gateWidth = Math.min(w / 5, 60);
              const gateHeight = Math.min(h * 0.7, 90);
              return (
                <div
                  key={`gate-${i}`}
                  className="absolute bg-gradient-to-b from-orange-400 to-orange-600 border-4 border-orange-700"
                  style={{
                    width: `${gateWidth}px`,
                    height: `${gateHeight}px`,
                    bottom: 0,
                    left: `${((i + 1) * w) / (Math.min(gatesCount, 5) + 1) - gateWidth / 2}px`,
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4), 0 6px 14px rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="absolute inset-0 opacity-50 bg-[repeating-linear-gradient(0deg,#000_0px,#000_2px,transparent_2px,transparent_10px)]" />
                </div>
              );
            })}
          </div>

          {/* Задняя стена */}
          <div
            className="absolute bg-gradient-to-b from-gray-500 via-gray-600 to-gray-700 border-2 border-gray-700"
            style={{
              width: `${w}px`,
              height: `${h}px`,
              transform: `translateZ(-${d}px)`,
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.4)',
            }}
          >
            <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_28px,#333_28px,#333_30px)]" />
            
            {Array.from({ length: Math.min(windowsCount, 8) }).map((_, i) => {
              const windowWidth = Math.min(w / 10, 40);
              const windowHeight = Math.min(h / 5, 35);
              return (
                <div
                  key={`window-${i}`}
                  className="absolute bg-gradient-to-br from-cyan-300 to-cyan-500 border-3 border-cyan-600"
                  style={{
                    width: `${windowWidth}px`,
                    height: `${windowHeight}px`,
                    top: `${h * 0.25}px`,
                    left: `${((i + 1) * w) / (Math.min(windowsCount, 8) + 1) - windowWidth / 2}px`,
                    boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.5), 0 3px 12px rgba(6,182,212,0.6)',
                    opacity: 0.9,
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_48%,rgba(255,255,255,0.4)_48%,rgba(255,255,255,0.4)_52%,transparent_52%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_48%,rgba(255,255,255,0.4)_48%,rgba(255,255,255,0.4)_52%,transparent_52%)]" />
                </div>
              );
            })}
          </div>

          {/* Левая стена */}
          <div
            className="absolute bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 border-2 border-gray-700"
            style={{
              width: `${d}px`,
              height: `${h}px`,
              transform: `rotateY(90deg) translateZ(0px)`,
              transformOrigin: 'left',
              boxShadow: 'inset -3px 0 15px rgba(0,0,0,0.4)',
            }}
          >
            <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_28px,#333_28px,#333_30px)]" />
          </div>

          {/* Правая стена */}
          <div
            className="absolute bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 border-2 border-gray-600"
            style={{
              width: `${d}px`,
              height: `${h}px`,
              transform: `rotateY(90deg) translateZ(${w}px)`,
              transformOrigin: 'left',
              boxShadow: 'inset 3px 0 15px rgba(0,0,0,0.3)',
            }}
          >
            <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_28px,#555_28px,#555_30px)]" />
          </div>

          {/* Крыша - цельная конструкция */}
          {roofType === 'double' ? (
            <>
              {/* Двускатная крыша - левая часть */}
              <div
                className={`absolute bg-gradient-to-br ${roofColors[constructionType as keyof typeof roofColors] || roofColors.steel} border-2 border-blue-800`}
                style={{
                  width: `${w / 2}px`,
                  height: `${d}px`,
                  transformOrigin: 'left top',
                  transform: `rotateX(90deg) rotateY(${-roofAngle}deg) translateZ(0px)`,
                  boxShadow: '0 -8px 30px rgba(59,130,246,0.5), inset 0 3px 15px rgba(255,255,255,0.25)',
                }}
              >
                <div className="absolute inset-0 opacity-35 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_38px,rgba(255,255,255,0.3)_38px,rgba(255,255,255,0.3)_40px)]" />
              </div>

              {/* Двускатная крыша - правая часть */}
              <div
                className={`absolute bg-gradient-to-br ${roofColors[constructionType as keyof typeof roofColors] || roofColors.steel} border-2 border-blue-800`}
                style={{
                  width: `${w / 2}px`,
                  height: `${d}px`,
                  transformOrigin: 'right top',
                  transform: `rotateX(90deg) rotateY(${roofAngle}deg) translateZ(0px) translateX(${w / 2}px)`,
                  boxShadow: '0 -8px 30px rgba(59,130,246,0.5), inset 0 3px 15px rgba(255,255,255,0.25)',
                }}
              >
                <div className="absolute inset-0 opacity-35 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_38px,rgba(255,255,255,0.3)_38px,rgba(255,255,255,0.3)_40px)]" />
              </div>
            </>
          ) : roofType === 'single' ? (
            <div
              className={`absolute bg-gradient-to-br ${roofColors[constructionType as keyof typeof roofColors] || roofColors.steel} border-2 border-blue-800`}
              style={{
                width: `${w}px`,
                height: `${d}px`,
                transformOrigin: 'left top',
                transform: `rotateX(90deg) rotateY(${-roofAngle / 2}deg) translateZ(0px)`,
                boxShadow: '0 -8px 30px rgba(59,130,246,0.5), inset 0 3px 15px rgba(255,255,255,0.25)',
              }}
            >
              <div className="absolute inset-0 opacity-35 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_38px,rgba(255,255,255,0.3)_38px,rgba(255,255,255,0.3)_40px)]" />
            </div>
          ) : (
            <div
              className={`absolute bg-gradient-to-br ${roofColors[constructionType as keyof typeof roofColors] || roofColors.steel} border-2 border-blue-800 rounded-t-[50%]`}
              style={{
                width: `${w}px`,
                height: `${d}px`,
                transform: `rotateX(90deg) translateZ(0px)`,
                transformOrigin: 'top',
                boxShadow: '0 -8px 30px rgba(59,130,246,0.5), inset 0 3px 15px rgba(255,255,255,0.25)',
              }}
            >
              <div className="absolute inset-0 opacity-35 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_38px,rgba(255,255,255,0.3)_38px,rgba(255,255,255,0.3)_40px)]" />
            </div>
          )}
        </div>

        {/* Информация */}
        <div className="mt-12 text-center space-y-3">
          <div className="text-cyan-400 text-lg font-bold font-mono tracking-wider drop-shadow-[0_2px_8px_rgba(6,182,212,0.5)]">
            {length}м × {width}м × {height}м
          </div>
          <div className="text-gray-300 text-sm flex items-center justify-center gap-2">
            {constructionType === 'steel' && (
              <>
                <span className="text-2xl">🏗️</span>
                <span>Стальной каркас</span>
              </>
            )}
            {constructionType === 'concrete' && (
              <>
                <span className="text-2xl">🧱</span>
                <span>Ж/б каркас</span>
              </>
            )}
            {constructionType === 'frameless' && (
              <>
                <span className="text-2xl">🏛️</span>
                <span>Бескаркасный</span>
              </>
            )}
          </div>
          <div className="flex gap-6 justify-center text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="text-orange-400 text-lg">■</span>
              <span>Ворот: {gatesCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400 text-lg">■</span>
              <span>Окон: {windowsCount}</span>
            </div>
            {roofType && (
              <div className="flex items-center gap-1.5">
                <span className="text-blue-400 text-lg">▲</span>
                <span>
                  {roofType === 'double' && 'Двускатная'}
                  {roofType === 'single' && 'Односкатная'}
                  {roofType === 'arch' && 'Арочная'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .warehouse-3d {
          animation: rotateWarehouse 25s infinite linear;
          transition: transform 0.4s ease;
        }
        .warehouse-3d:hover {
          animation-play-state: paused;
          transform: rotateX(-25deg) rotateY(-35deg) scale(1.08) !important;
        }
        @keyframes rotateWarehouse {
          0% { transform: rotateX(-25deg) rotateY(-35deg); }
          50% { transform: rotateX(-25deg) rotateY(325deg); }
          100% { transform: rotateX(-25deg) rotateY(-35deg); }
        }
      `}</style>
    </div>
  );
};
