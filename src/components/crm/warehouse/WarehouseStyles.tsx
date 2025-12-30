import React from 'react';

export const wallStyles = {
  sandwich: {
    front: 'from-slate-200 via-slate-300 to-slate-400',
    side: 'from-slate-300 via-slate-400 to-slate-500',
    back: 'from-slate-400 via-slate-500 to-slate-600',
    pattern: 'bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_48px,rgba(0,0,0,0.15)_48px,rgba(0,0,0,0.15)_50px)]',
    thickness: (wallThickness: number) => wallThickness * 0.08,
  },
  proflist: {
    front: 'from-zinc-400 via-zinc-500 to-zinc-600',
    side: 'from-zinc-500 via-zinc-600 to-zinc-700',
    back: 'from-zinc-600 via-zinc-700 to-zinc-800',
    pattern: 'bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_18px,rgba(0,0,0,0.3)_18px,rgba(0,0,0,0.3)_20px)]',
    thickness: (wallThickness: number) => wallThickness * 0.05,
  },
  concrete: {
    front: 'from-stone-300 via-stone-400 to-stone-500',
    side: 'from-stone-400 via-stone-500 to-stone-600',
    back: 'from-stone-500 via-stone-600 to-stone-700',
    pattern: 'bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_78px,rgba(0,0,0,0.2)_78px,rgba(0,0,0,0.2)_80px)]',
    thickness: (wallThickness: number) => wallThickness * 0.12,
  },
};

export const constructionStyles = {
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

export const gateStyles = {
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

export const floorStyles = {
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

export const purposeConfig = {
  storage: { windowMultiplier: 1, gateSize: 1, hasVentilation: false },
  production: { windowMultiplier: 2, gateSize: 0.8, hasVentilation: true },
  cold: { windowMultiplier: 0.3, gateSize: 0.7, hasVentilation: true },
  logistics: { windowMultiplier: 0.5, gateSize: 1.3, hasVentilation: false },
};
