import React from 'react';
import { RoofCalculations } from './WarehouseCalculations';

interface Warehouse3DModelProps {
  w: number;
  h: number;
  d: number;
  showRoof: boolean;
  roofCalculations: RoofCalculations;
  roofAngle: number;
  currentWallStyle: {
    front: string;
    side: string;
    back: string;
    pattern: string;
    thickness: number;
  };
  currentFloorStyle: {
    color: string;
    pattern: React.ReactNode;
  };
  currentConstruction: {
    roof: string;
    frame: string;
    color: string;
  };
  currentGateStyle: {
    color: string;
    border: string;
    pattern: string;
  };
  currentPurpose: {
    windowMultiplier: number;
    gateSize: number;
    hasVentilation: boolean;
  };
  columnsPerSide: number;
  constructionType: string;
  gatesOnFront: number;
  gatesOnSide: number;
  windowsOnBack: number;
  windowsOnSides: number;
}

export const Warehouse3DModel: React.FC<Warehouse3DModelProps> = ({
  w,
  h,
  d,
  showRoof,
  roofCalculations,
  roofAngle,
  currentWallStyle,
  currentFloorStyle,
  currentConstruction,
  currentGateStyle,
  currentPurpose,
  columnsPerSide,
  constructionType,
  gatesOnFront,
  gatesOnSide,
  windowsOnBack,
  windowsOnSides,
}) => {
  return (
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
        return (
          <React.Fragment key={`column-${i}`}>
            <div
              className={`absolute ${currentConstruction.frame} border border-gray-900`}
              style={{
                width: `${columnWidth}px`,
                height: `${h}px`,
                transform: `translateX(${currentWallStyle.thickness}px) translateZ(-${columnPos}px)`,
                boxShadow: '2px 2px 8px rgba(0,0,0,0.6)',
              }}
            />
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

      {/* КРЫША */}
      {showRoof && roofCalculations.type === 'double' && (
        <>
          <div
            className={`absolute bg-gradient-to-br ${currentConstruction.roof} border-2 ${currentConstruction.color.replace('text-', 'border-')}`}
            style={{
              width: `${roofCalculations.rafterLength}px`,
              height: `${d}px`,
              left: `${w / 2}px`,
              top: `${-roofCalculations.ridgeHeight}px`,
              transformOrigin: 'right bottom',
              transform: `rotateZ(${-roofAngle}deg)`,
              boxShadow: '0 -8px 30px rgba(59,130,246,0.4), inset 0 3px 15px rgba(255,255,255,0.2)',
            }}
          >
            <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_48px,rgba(255,255,255,0.3)_48px,rgba(255,255,255,0.3)_50px)]" />
          </div>
          <div
            className={`absolute bg-gradient-to-br ${currentConstruction.roof} border-2 ${currentConstruction.color.replace('text-', 'border-')}`}
            style={{
              width: `${roofCalculations.rafterLength}px`,
              height: `${d}px`,
              left: `${w / 2}px`,
              top: `${-roofCalculations.ridgeHeight}px`,
              transformOrigin: 'left bottom',
              transform: `rotateZ(${roofAngle}deg)`,
              boxShadow: '0 -8px 30px rgba(59,130,246,0.4), inset 0 3px 15px rgba(255,255,255,0.2)',
            }}
          >
            <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_48px,rgba(255,255,255,0.3)_48px,rgba(255,255,255,0.3)_50px)]" />
          </div>
          <div
            className={`absolute ${currentConstruction.frame} border-2 border-gray-900`}
            style={{
              width: `${d}px`,
              height: '12px',
              left: `${w / 2 - 6}px`,
              top: `${-roofCalculations.ridgeHeight! - 6}px`,
              transform: `rotateY(90deg)`,
              transformOrigin: 'left',
              boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
            }}
          />
        </>
      )}

      {showRoof && roofCalculations.type === 'single' && (
        <div
          className={`absolute bg-gradient-to-br ${currentConstruction.roof} border-2 ${currentConstruction.color.replace('text-', 'border-')}`}
          style={{
            width: `${roofCalculations.rafterLength}px`,
            height: `${d}px`,
            left: '0px',
            top: '0px',
            transformOrigin: 'left top',
            transform: `rotateZ(${-roofAngle}deg)`,
            boxShadow: '0 -8px 30px rgba(59,130,246,0.4), inset 0 3px 15px rgba(255,255,255,0.2)',
          }}
        >
          <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_48px,rgba(255,255,255,0.3)_48px,rgba(255,255,255,0.3)_50px)]" />
        </div>
      )}

      {showRoof && roofCalculations.type === 'arch' && (
        <>
          <div
            className={`absolute bg-gradient-to-b ${currentConstruction.roof} border-2 ${currentConstruction.color.replace('text-', 'border-')}`}
            style={{
              width: `${w}px`,
              height: `${roofCalculations.archHeight}px`,
              left: '0px',
              top: `${-roofCalculations.archHeight}px`,
              borderRadius: '50% 50% 0 0',
              boxShadow: '0 -8px 30px rgba(59,130,246,0.4), inset 0 3px 15px rgba(255,255,255,0.2)',
            }}
          >
            <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_28px,rgba(255,255,255,0.3)_28px,rgba(255,255,255,0.3)_30px)]" />
          </div>
          <div
            className={`absolute bg-gradient-to-b ${currentConstruction.roof} border-2 ${currentConstruction.color.replace('text-', 'border-')}`}
            style={{
              width: `${w}px`,
              height: `${roofCalculations.archHeight}px`,
              left: '0px',
              top: `${-roofCalculations.archHeight}px`,
              borderRadius: '50% 50% 0 0',
              transform: `translateZ(-${d}px)`,
              boxShadow: '0 -8px 30px rgba(59,130,246,0.3), inset 0 3px 15px rgba(255,255,255,0.15)',
            }}
          >
            <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_28px,rgba(255,255,255,0.2)_28px,rgba(255,255,255,0.2)_30px)]" />
          </div>
          <div
            className={`absolute bg-gradient-to-br ${currentConstruction.roof} border-2 ${currentConstruction.color.replace('text-', 'border-')}`}
            style={{
              width: `${d}px`,
              height: `${roofCalculations.archHeight}px`,
              left: '0px',
              top: `${-roofCalculations.archHeight}px`,
              borderRadius: '50% 50% 0 0',
              transform: `rotateY(90deg)`,
              transformOrigin: 'top left',
              boxShadow: 'inset -3px 0 15px rgba(0,0,0,0.4)',
            }}
          >
            <div className="absolute inset-0 opacity-35 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_38px,rgba(255,255,255,0.2)_38px,rgba(255,255,255,0.2)_40px)]" />
          </div>
          <div
            className={`absolute bg-gradient-to-br ${currentConstruction.roof} border-2 ${currentConstruction.color.replace('text-', 'border-')}`}
            style={{
              width: `${d}px`,
              height: `${roofCalculations.archHeight}px`,
              left: `${w}px`,
              top: `${-roofCalculations.archHeight}px`,
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
    </div>
  );
};
