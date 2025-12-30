import React from 'react';
import Icon from '@/components/ui/icon';
import { wallStyles, constructionStyles, gateStyles, floorStyles, purposeConfig } from './warehouse/WarehouseStyles';
import { useRoofCalculations, useWarehouseDistribution } from './warehouse/WarehouseCalculations';
import { Warehouse3DModel } from './warehouse/Warehouse3DModel';

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

  const roofCalculations = useRoofCalculations(w, h, roofType, roofAngle);

  const currentWallStyleBase = wallStyles[wallMaterial as keyof typeof wallStyles] || wallStyles.sandwich;
  const currentWallStyle = {
    ...currentWallStyleBase,
    thickness: currentWallStyleBase.thickness(wallThickness),
  };

  const currentConstruction = constructionStyles[constructionType as keyof typeof constructionStyles] || constructionStyles.steel;
  const currentGateStyle = gateStyles[gatesType as keyof typeof gateStyles] || gateStyles.sectional;
  const currentFloorStyle = floorStyles[floorType as keyof typeof floorStyles] || floorStyles.concrete;
  const currentPurpose = purposeConfig[purpose as keyof typeof purposeConfig] || purposeConfig.storage;

  const {
    columnsPerSide,
    totalGates,
    gatesOnFront,
    gatesOnSide,
    totalWindows,
    windowsOnBack,
    windowsOnSides,
  } = useWarehouseDistribution(length, columnStep, gatesCount, windowsCount, currentPurpose);

  return (
    <div className="w-full space-y-4">
      <div className="w-full aspect-video bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-lg overflow-hidden flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
        
        <button
          onClick={() => setShowRoof(!showRoof)}
          className="absolute top-4 right-4 z-20 bg-slate-800/80 hover:bg-slate-700/80 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all border border-slate-600"
        >
          <Icon name={showRoof ? 'Eye' : 'EyeOff'} size={18} />
          {showRoof ? 'Скрыть крышу' : 'Показать крышу'}
        </button>

        <div className="relative z-10" style={{ perspective: '1800px' }}>
          <Warehouse3DModel
            w={w}
            h={h}
            d={d}
            showRoof={showRoof}
            roofCalculations={roofCalculations}
            roofAngle={roofAngle}
            currentWallStyle={currentWallStyle}
            currentFloorStyle={currentFloorStyle}
            currentConstruction={currentConstruction}
            currentGateStyle={currentGateStyle}
            currentPurpose={currentPurpose}
            columnsPerSide={columnsPerSide}
            constructionType={constructionType}
            gatesOnFront={gatesOnFront}
            gatesOnSide={gatesOnSide}
            windowsOnBack={windowsOnBack}
            windowsOnSides={windowsOnSides}
          />

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
                  {roofType === 'double' && `Двускатная ${roofAngle}°`}
                  {roofType === 'single' && `Односкатная ${roofAngle}°`}
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
            {showRoof && (
              <div className="text-xs text-gray-500 italic mt-2">
                {roofCalculations.type === 'double' && (
                  <span>Высота конька: {(roofCalculations.ridgeHeight! / scale).toFixed(1)}м | Длина ската: {(roofCalculations.rafterLength! / scale).toFixed(1)}м</span>
                )}
                {roofCalculations.type === 'single' && (
                  <span>Перепад высот: {(roofCalculations.heightDiff! / scale).toFixed(1)}м | Длина ската: {(roofCalculations.rafterLength! / scale).toFixed(1)}м</span>
                )}
                {roofCalculations.type === 'arch' && (
                  <span>Высота арки: {(roofCalculations.archHeight! / scale).toFixed(1)}м | Радиус: {(roofCalculations.radius! / scale).toFixed(1)}м</span>
                )}
              </div>
            )}
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
