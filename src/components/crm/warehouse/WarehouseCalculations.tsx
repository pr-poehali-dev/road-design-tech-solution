import React from 'react';

export interface RoofCalculations {
  type: 'double' | 'single' | 'arch';
  ridgeHeight?: number;
  rafterLength?: number;
  heightDiff?: number;
  archHeight?: number;
  totalHeight: number;
  angle?: number;
  radius?: number;
}

export const useRoofCalculations = (
  w: number,
  h: number,
  roofType: string,
  roofAngle: number
): RoofCalculations => {
  return React.useMemo(() => {
    const angleRad = (roofAngle * Math.PI) / 180;
    
    if (roofType === 'double') {
      const ridgeHeight = (w / 2) * Math.tan(angleRad);
      const rafterLength = (w / 2) / Math.cos(angleRad);
      const overhang = 8;
      
      return {
        type: 'double',
        ridgeHeight,
        rafterLength: rafterLength + overhang,
        totalHeight: h + ridgeHeight,
        angle: roofAngle,
      };
    } else if (roofType === 'single') {
      const heightDiff = w * Math.tan(angleRad);
      const rafterLength = w / Math.cos(angleRad);
      const overhang = 8;
      
      return {
        type: 'single',
        heightDiff,
        rafterLength: rafterLength + overhang,
        totalHeight: h + heightDiff,
        angle: roofAngle,
      };
    } else {
      const archHeight = w / 2;
      
      return {
        type: 'arch',
        archHeight,
        totalHeight: h + archHeight,
        radius: w / 2,
      };
    }
  }, [w, h, roofType, roofAngle]);
};

export const useWarehouseDistribution = (
  length: number,
  columnStep: number,
  gatesCount: number,
  windowsCount: number,
  currentPurpose: { windowMultiplier: number }
) => {
  const columnsPerSide = Math.max(2, Math.floor(length / columnStep));
  
  const totalGates = Math.min(gatesCount, 6);
  const gatesOnFront = Math.ceil(totalGates / 2);
  const gatesOnSide = Math.floor(totalGates / 2);

  const totalWindows = Math.min(windowsCount * currentPurpose.windowMultiplier, 20);
  const windowsOnBack = Math.ceil(totalWindows * 0.4);
  const windowsOnSides = Math.floor(totalWindows * 0.6);

  return {
    columnsPerSide,
    totalGates,
    gatesOnFront,
    gatesOnSide,
    totalWindows,
    windowsOnBack,
    windowsOnSides,
  };
};
