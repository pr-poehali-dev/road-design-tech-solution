import React from 'react';
import Icon from '@/components/ui/icon';

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
    purpose?: string;
    floorType?: string;
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
    wallMaterial = 'sandwich',
    wallThickness = 100,
    gatesType = 'sectional',
    columnStep = 6,
    purpose = 'storage',
    floorType = 'concrete'
  } = params;
  
  const [showRoof, setShowRoof] = React.useState(true);
  
  const scale = 8;
  const w = width * scale;
  const h = height * scale;
  const d = length * scale;

  // Цвета стен в зависимости от материала
  const wallStyles = {
    sandwich: {
      front: 'from-slate-200 via-slate-300 to-slate-400',
      side: 'from-slate-300 via-slate-400 to-slate-500',
      back: 'from-slate-400 via-slate-500 to-slate-600',
      pattern: 'bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_48px,rgba(0,0,0,0.15)_48px,rgba(0,0,0,0.15)_50px)]',
      thickness: wallThickness * 0.08,
    },
    proflist: {
      front: 'from-zinc-400 via-zinc-500 to-zinc-600',
      side: 'from-zinc-500 via-zinc-600 to-zinc-700',
      back: 'from-zinc-600 via-zinc-700 to-zinc-800',
      pattern: 'bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_18px,rgba(0,0,0,0.3)_18px,rgba(0,0,0,0.3)_20px)]',
      thickness: wallThickness * 0.05,
    },
    concrete: {
      front: 'from-stone-300 via-stone-400 to-stone-500',
      side: 'from-stone-400 via-stone-500 to-stone-600',
      back: 'from-stone-500 via-stone-600 to-stone-700',
      pattern: 'bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_78px,rgba(0,0,0,0.2)_78px,rgba(0,0,0,0.2)_80px)]',
      thickness: wallThickness * 0.12,
    },
  };

  const currentWallStyle = wallStyles[wallMaterial as keyof typeof wallStyles] || wallStyles.sandwich;

  // Цвета крыши и каркаса
  const constructionStyles = {
    steel: {
      roof: 'from-blue-400 via-blue-500 to-blue-600',
      frame: 'bg-gradient-to-br from-gray-600 to-gray-800',
      color: 'text-blue-400'
    },
    concrete: {
      roof: 'from-gray-400 via-gray-500 to-gray-600',
      frame: 'bg-gradient-to-br from-stone-500 to-stone-700',
      color: 'text-stone-400'
    },
    frameless: {
      roof: 'from-zinc-400 via-zinc-500 to-zinc-600',
      frame: 'bg-gradient-to-br from-zinc-600 to-zinc-800',
      color: 'text-zinc-400'
    },
  };

  const currentConstruction = constructionStyles[constructionType as keyof typeof constructionStyles] || constructionStyles.steel;

  // Типы ворот
  const gateStyles = {
    sectional: {
      color: 'from-orange-400 to-orange-600',
      border: 'border-orange-700',
      pattern: 'bg-[repeating-linear-gradient(0deg,#000_0px,#000_2px,transparent_2px,transparent_12px)]'
    },
    rolling: {
      color: 'from-gray-500 to-gray-700',
      border: 'border-gray-800',
      pattern: 'bg-[repeating-linear-gradient(0deg,#000_0px,#000_1px,transparent_1px,transparent_6px)]'
    },
    swing: {
      color: 'from-amber-600 to-amber-800',
      border: 'border-amber-900',
      pattern: 'bg-[repeating-linear-gradient(45deg,transparent_0px,transparent_10px,rgba(0,0,0,0.2)_10px,rgba(0,0,0,0.2)_12px)]'
    },
  };

  const currentGateStyle = gateStyles[gatesType as keyof typeof gateStyles] || gateStyles.sectional;

  // Типы пола
  const floorStyles = {
    concrete: {
      color: 'from-gray-700 via-gray-600 to-gray-700',
      pattern: (
        <>
          <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_48px,#444_48px,#444_50px)]" />
          <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_48px,#444_48px,#444_50px)]" />
        </>
      )
    },
    polymer: {
      color: 'from-emerald-800 via-emerald-700 to-emerald-800',
      pattern: (
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.3)_0%,transparent_2px),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.2)_0%,transparent_3px)]" />
      )
    },
    asphalt: {
      color: 'from-slate-800 via-slate-900 to-black',
      pattern: (
        <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,transparent_0px,transparent_3px,#555_3px,#555_4px)]" />
      )
    },
  };

  const currentFloorStyle = floorStyles[floorType as keyof typeof floorStyles] || floorStyles.concrete;

  // Назначение склада влияет на количество окон и расположение ворот
  const purposeConfig = {
    storage: { windowMultiplier: 1, gateSize: 1, hasVentilation: false },
    production: { windowMultiplier: 2, gateSize: 0.8, hasVentilation: true },
    cold: { windowMultiplier: 0.3, gateSize: 0.7, hasVentilation: true },
    logistics: { windowMultiplier: 0.5, gateSize: 1.3, hasVentilation: false },
  };

  const currentPurpose = purposeConfig[purpose as keyof typeof purposeConfig] || purposeConfig.storage;

  // Расчет колонн
  const columnsPerSide = Math.max(2, Math.floor(length / columnStep));

  // Распределение ворот и окон
  const totalGates = Math.min(gatesCount, 6);
  const gatesOnFront = Math.ceil(totalGates / 2);
  const gatesOnSide = Math.floor(totalGates / 2);

  const totalWindows = Math.min(windowsCount * currentPurpose.windowMultiplier, 20);
  const windowsOnBack = Math.ceil(totalWindows * 0.4);
  const windowsOnSides = Math.floor(totalWindows * 0.6);

  return (
    <div className="w-full space-y-4">
      <div className="w-full aspect-video bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-lg overflow-hidden flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
        
        {/* Кнопка переключения крыши */}
        <button
          onClick={() => setShowRoof(!showRoof)}
          className="absolute top-4 right-4 z-20 bg-slate-800/80 hover:bg-slate-700/80 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all border border-slate-600"
        >
          <Icon name={showRoof ? 'Eye' : 'EyeOff'} size={18} />
          {showRoof ? 'Скрыть крышу' : 'Показать крышу'}
        </button>

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
              className={`absolute bg-gradient-to-br ${currentFloorStyle.color} border-2 border-gray-600`}
              style={{
                width: `${w}px`,
                height: `${d}px`,
                transform: `translateY(${h}px) rotateX(-90deg)`,
                transformOrigin: 'top left',
                boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.5)',
              }}
            >
              {currentFloorStyle.pattern}
            </div>

            {/* Колонны каркаса */}
            {constructionType !== 'frameless' && Array.from({ length: columnsPerSide }).map((_, i) => {
              const columnPos = (d / (columnsPerSide - 1)) * i;
              const columnWidth = 8;
              const columnDepth = 8;
              return (
                <React.Fragment key={`column-${i}`}>
                  {/* Левая колонна */}
                  <div
                    className={`absolute ${currentConstruction.frame} border border-gray-900`}
                    style={{
                      width: `${columnWidth}px`,
                      height: `${h}px`,
                      transform: `translateX(${currentWallStyle.thickness}px) translateZ(-${columnPos}px)`,
                      boxShadow: '2px 2px 8px rgba(0,0,0,0.6)',
                    }}
                  />
                  {/* Правая колонна */}
                  <div
                    className={`absolute ${currentConstruction.frame} border border-gray-900`}
                    style={{
                      width: `${columnWidth}px`,
                      height: `${h}px`,
                      transform: `translateX(${w - currentWallStyle.thickness - columnWidth}px) translateZ(-${columnPos}px)`,
                      boxShadow: '2px 2px 8px rgba(0,0,0,0.6)',
                    }}
                  />
                </React.Fragment>
              );
            })}

            {/* Передняя стена */}
            <div
              className={`absolute bg-gradient-to-b ${currentWallStyle.front} border-2 border-gray-600`}
              style={{
                width: `${w}px`,
                height: `${h}px`,
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              <div className={`absolute inset-0 opacity-40 ${currentWallStyle.pattern}`} />
              
              {/* Ворота на передней стене */}
              {Array.from({ length: gatesOnFront }).map((_, i) => {
                const gateWidth = Math.min(w / (gatesOnFront + 1), 80 * currentPurpose.gateSize);
                const gateHeight = Math.min(h * 0.75, 100 * currentPurpose.gateSize);
                return (
                  <div
                    key={`gate-front-${i}`}
                    className={`absolute bg-gradient-to-b ${currentGateStyle.color} border-4 ${currentGateStyle.border}`}
                    style={{
                      width: `${gateWidth}px`,
                      height: `${gateHeight}px`,
                      bottom: 0,
                      left: `${((i + 1) * w) / (gatesOnFront + 1) - gateWidth / 2}px`,
                      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5), 0 6px 14px rgba(0,0,0,0.6)',
                    }}
                  >
                    <div className={`absolute inset-0 opacity-60 ${currentGateStyle.pattern}`} />
                  </div>
                );
              })}

              {/* Вентиляция для производства */}
              {currentPurpose.hasVentilation && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-10 bg-gradient-to-b from-gray-600 to-gray-800 border-2 border-gray-700 rounded" />
              )}
            </div>

            {/* Задняя стена */}
            <div
              className={`absolute bg-gradient-to-b ${currentWallStyle.back} border-2 border-gray-700`}
              style={{
                width: `${w}px`,
                height: `${h}px`,
                transform: `translateZ(-${d}px)`,
                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              <div className={`absolute inset-0 opacity-30 ${currentWallStyle.pattern}`} />
              
              {/* Окна на задней стене */}
              {Array.from({ length: Math.floor(windowsOnBack) }).map((_, i) => {
                const windowWidth = Math.min(w / 12, 35);
                const windowHeight = Math.min(h / 6, 30);
                return (
                  <div
                    key={`window-back-${i}`}
                    className="absolute bg-gradient-to-br from-cyan-300 to-cyan-500 border-3 border-cyan-600"
                    style={{
                      width: `${windowWidth}px`,
                      height: `${windowHeight}px`,
                      top: `${h * 0.3 + (i % 2) * windowHeight * 1.5}px`,
                      left: `${((Math.floor(i / 2) + 1) * w) / (Math.ceil(windowsOnBack / 2) + 1) - windowWidth / 2}px`,
                      boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.5), 0 3px 12px rgba(6,182,212,0.6)',
                      opacity: 0.85,
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
              className={`absolute bg-gradient-to-br ${currentWallStyle.side} border-2 border-gray-700`}
              style={{
                width: `${d}px`,
                height: `${h}px`,
                transform: `rotateY(90deg) translateZ(0px)`,
                transformOrigin: 'left',
                boxShadow: 'inset -3px 0 15px rgba(0,0,0,0.5)',
              }}
            >
              <div className={`absolute inset-0 opacity-35 ${currentWallStyle.pattern}`} />
              
              {/* Ворота на боковой стене */}
              {Array.from({ length: gatesOnSide }).map((_, i) => {
                const gateWidth = Math.min(d / (gatesOnSide + 2), 70 * currentPurpose.gateSize);
                const gateHeight = Math.min(h * 0.7, 90 * currentPurpose.gateSize);
                return (
                  <div
                    key={`gate-side-${i}`}
                    className={`absolute bg-gradient-to-b ${currentGateStyle.color} border-4 ${currentGateStyle.border}`}
                    style={{
                      width: `${gateWidth}px`,
                      height: `${gateHeight}px`,
                      bottom: 0,
                      left: `${((i + 1) * d) / (gatesOnSide + 1) - gateWidth / 2}px`,
                      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5), 0 6px 14px rgba(0,0,0,0.6)',
                    }}
                  >
                    <div className={`absolute inset-0 opacity-60 ${currentGateStyle.pattern}`} />
                  </div>
                );
              })}

              {/* Окна на боковой стене */}
              {Array.from({ length: Math.floor(windowsOnSides / 2) }).map((_, i) => {
                const windowWidth = Math.min(d / 15, 30);
                const windowHeight = Math.min(h / 7, 28);
                return (
                  <div
                    key={`window-left-${i}`}
                    className="absolute bg-gradient-to-br from-cyan-300 to-cyan-500 border-3 border-cyan-600"
                    style={{
                      width: `${windowWidth}px`,
                      height: `${windowHeight}px`,
                      top: `${h * 0.35}px`,
                      left: `${((i + 1) * d) / (Math.floor(windowsOnSides / 2) + 1) - windowWidth / 2}px`,
                      boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.5), 0 3px 12px rgba(6,182,212,0.6)',
                      opacity: 0.85,
                    }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_48%,rgba(255,255,255,0.4)_48%,rgba(255,255,255,0.4)_52%,transparent_52%)]" />
                  </div>
                );
              })}
            </div>

            {/* Правая стена */}
            <div
              className={`absolute bg-gradient-to-br ${currentWallStyle.side} border-2 border-gray-600`}
              style={{
                width: `${d}px`,
                height: `${h}px`,
                transform: `rotateY(90deg) translateZ(${w}px)`,
                transformOrigin: 'left',
                boxShadow: 'inset 3px 0 15px rgba(0,0,0,0.4)',
              }}
            >
              <div className={`absolute inset-0 opacity-35 ${currentWallStyle.pattern}`} />
              
              {/* Окна на правой стене */}
              {Array.from({ length: Math.ceil(windowsOnSides / 2) }).map((_, i) => {
                const windowWidth = Math.min(d / 15, 30);
                const windowHeight = Math.min(h / 7, 28);
                return (
                  <div
                    key={`window-right-${i}`}
                    className="absolute bg-gradient-to-br from-cyan-300 to-cyan-500 border-3 border-cyan-600"
                    style={{
                      width: `${windowWidth}px`,
                      height: `${windowHeight}px`,
                      top: `${h * 0.35}px`,
                      left: `${((i + 1) * d) / (Math.ceil(windowsOnSides / 2) + 1) - windowWidth / 2}px`,
                      boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.5), 0 3px 12px rgba(6,182,212,0.6)',
                      opacity: 0.85,
                    }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_48%,rgba(255,255,255,0.4)_48%,rgba(255,255,255,0.4)_52%,transparent_52%)]" />
                  </div>
                );
              })}
            </div>

            {/* Крыша - СВЕРХУ стен */}
            {showRoof && (
              <>
                {roofType === 'double' ? (
                  <>
                    {/* Двускатная крыша - левый скат */}
                    <div
                      className={`absolute bg-gradient-to-br ${currentConstruction.roof} border-2 ${currentConstruction.color.replace('text-', 'border-')}`}
                      style={{
                        width: `${w / 2 + 5}px`,
                        height: `${d}px`,
                        left: '0px',
                        top: '0px',
                        transformOrigin: 'right top',
                        transform: `rotateZ(${-roofAngle}deg)`,
                        boxShadow: '0 -8px 30px rgba(59,130,246,0.4), inset 0 3px 15px rgba(255,255,255,0.2)',
                      }}
                    >
                      <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_48px,rgba(255,255,255,0.3)_48px,rgba(255,255,255,0.3)_50px)]" />
                    </div>
                    {/* Двускатная крыша - правый скат */}
                    <div
                      className={`absolute bg-gradient-to-br ${currentConstruction.roof} border-2 ${currentConstruction.color.replace('text-', 'border-')}`}
                      style={{
                        width: `${w / 2 + 5}px`,
                        height: `${d}px`,
                        left: `${w / 2}px`,
                        top: '0px',
                        transformOrigin: 'left top',
                        transform: `rotateZ(${roofAngle}deg)`,
                        boxShadow: '0 -8px 30px rgba(59,130,246,0.4), inset 0 3px 15px rgba(255,255,255,0.2)',
                      }}
                    >
                      <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_48px,rgba(255,255,255,0.3)_48px,rgba(255,255,255,0.3)_50px)]" />
                    </div>
                    {/* Конёк крыши */}
                    <div
                      className={`absolute ${currentConstruction.frame} border-2 border-gray-900`}
                      style={{
                        width: `${d}px`,
                        height: '10px',
                        left: `${w / 2}px`,
                        top: `${-(w / 2) * Math.tan((roofAngle * Math.PI) / 180)}px`,
                        transform: `rotateY(90deg)`,
                        transformOrigin: 'left',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
                      }}
                    />
                  </>
                ) : roofType === 'single' ? (
                  <div
                    className={`absolute bg-gradient-to-br ${currentConstruction.roof} border-2 ${currentConstruction.color.replace('text-', 'border-')}`}
                    style={{
                      width: `${w}px`,
                      height: `${d}px`,
                      left: '0px',
                      top: '0px',
                      transformOrigin: 'left top',
                      transform: `rotateZ(${-roofAngle / 2}deg)`,
                      boxShadow: '0 -8px 30px rgba(59,130,246,0.4), inset 0 3px 15px rgba(255,255,255,0.2)',
                    }}
                  >
                    <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_48px,rgba(255,255,255,0.3)_48px,rgba(255,255,255,0.3)_50px)]" />
                  </div>
                ) : (
                  <>
                    {/* Арочная крыша - верхняя часть */}
                    <div
                      className={`absolute bg-gradient-to-b ${currentConstruction.roof} border-2 ${currentConstruction.color.replace('text-', 'border-')}`}
                      style={{
                        width: `${w}px`,
                        height: `${w / 2}px`,
                        left: '0px',
                        top: `${-w / 2}px`,
                        borderRadius: '50% 50% 0 0',
                        boxShadow: '0 -8px 30px rgba(59,130,246,0.4), inset 0 3px 15px rgba(255,255,255,0.2)',
                      }}
                    >
                      <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_28px,rgba(255,255,255,0.3)_28px,rgba(255,255,255,0.3)_30px)]" />
                    </div>
                    {/* Арочная крыша - задняя часть */}
                    <div
                      className={`absolute bg-gradient-to-b ${currentConstruction.roof} border-2 ${currentConstruction.color.replace('text-', 'border-')}`}
                      style={{
                        width: `${w}px`,
                        height: `${w / 2}px`,
                        left: '0px',
                        top: `${-w / 2}px`,
                        borderRadius: '50% 50% 0 0',
                        transform: `translateZ(-${d}px)`,
                        boxShadow: '0 -8px 30px rgba(59,130,246,0.3), inset 0 3px 15px rgba(255,255,255,0.15)',
                      }}
                    >
                      <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_28px,rgba(255,255,255,0.2)_28px,rgba(255,255,255,0.2)_30px)]" />
                    </div>
                    {/* Арочная крыша - левая боковина */}
                    <div
                      className={`absolute bg-gradient-to-br ${currentConstruction.roof} border-2 ${currentConstruction.color.replace('text-', 'border-')}`}
                      style={{
                        width: `${d}px`,
                        height: `${w / 2}px`,
                        left: '0px',
                        top: `${-w / 2}px`,
                        borderRadius: '50% 50% 0 0',
                        transform: `rotateY(90deg)`,
                        transformOrigin: 'top left',
                        boxShadow: 'inset -3px 0 15px rgba(0,0,0,0.4)',
                      }}
                    >
                      <div className="absolute inset-0 opacity-35 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_38px,rgba(255,255,255,0.2)_38px,rgba(255,255,255,0.2)_40px)]" />
                    </div>
                    {/* Арочная крыша - правая боковина */}
                    <div
                      className={`absolute bg-gradient-to-br ${currentConstruction.roof} border-2 ${currentConstruction.color.replace('text-', 'border-')}`}
                      style={{
                        width: `${d}px`,
                        height: `${w / 2}px`,
                        left: `${w}px`,
                        top: `${-w / 2}px`,
                        borderRadius: '50% 50% 0 0',
                        transform: `rotateY(90deg)`,
                        transformOrigin: 'top left',
                        boxShadow: 'inset 3px 0 15px rgba(0,0,0,0.3)',
                      }}
                    >
                      <div className="absolute inset-0 opacity-35 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_38px,rgba(255,255,255,0.2)_38px,rgba(255,255,255,0.2)_40px)]" />
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Информация */}
          <div className="mt-12 text-center space-y-3">
            <div className="text-cyan-400 text-lg font-bold font-mono tracking-wider drop-shadow-[0_2px_8px_rgba(6,182,212,0.5)]">
              {length}м × {width}м × {height}м
            </div>
            <div className="flex gap-6 justify-center text-xs text-gray-400 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className={currentConstruction.color}>🏗️</span>
                <span>
                  {constructionType === 'steel' && 'Стальной каркас'}
                  {constructionType === 'concrete' && 'Ж/б каркас'}
                  {constructionType === 'frameless' && 'Бескаркасный'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-orange-400">■</span>
                <span>Ворот: {totalGates}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-cyan-400">■</span>
                <span>Окон: {Math.floor(totalWindows)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-blue-400">▲</span>
                <span>
                  {roofType === 'double' && 'Двускатная'}
                  {roofType === 'single' && 'Односкатная'}
                  {roofType === 'arch' && 'Арочная'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">▪</span>
                <span>Стены: {wallThickness}мм</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400">⬓</span>
                <span>Шаг: {columnStep}м</span>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .warehouse-3d {
            animation: rotateWarehouse 30s infinite linear;
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
    </div>
  );
};