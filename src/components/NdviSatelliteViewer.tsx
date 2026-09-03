import React, { useState } from 'react';
import { SatelliteObservation } from '../types';
import { Satellite, Calendar, Sparkles, AlertTriangle, CheckCircle, Info, Eye, Layers } from 'lucide-react';

interface Props {
  observations: SatelliteObservation[];
}

export const NdviSatelliteViewer: React.FC<Props> = ({ observations }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(observations.length > 0 ? observations.length - 1 : 0);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number; ndvi: number } | null>(null);

  const activeObs = observations[selectedIndex] || observations[0];

  if (!activeObs) {
    return <div className="p-8 text-center text-slate-500">Loading satellite remote sensing data...</div>;
  }

  // Color generator for NDVI (-1 to 1)
  const getNdviColor = (ndvi: number) => {
    if (ndvi >= 0.75) return '#059669'; // Emerald-600
    if (ndvi >= 0.65) return '#10b981'; // Emerald-500
    if (ndvi >= 0.50) return '#84cc16'; // Lime-500
    if (ndvi >= 0.40) return '#eab308'; // Yellow-500
    if (ndvi >= 0.30) return '#f97316'; // Orange-500
    return '#ef4444'; // Red-500
  };

  return (
    <div className="grid-card">
      {/* Header with timeframe selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Satellite className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Multi-Temporal Satellite NDVI Monitoring</h3>
              <p className="text-xs text-gray-500">{activeObs.resolution} • Cloud Cover: {activeObs.cloudCoverage}%</p>
            </div>
          </div>
        </div>

        {/* Date Selector Pills */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1">
          {observations.map((obs, idx) => (
            <button
              key={obs.timeframeLabel}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedIndex === idx
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-3 w-3 opacity-70" />
              <span>{obs.timeframeLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Heatmap Grid on Left, Metrics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        {/* Heatmap & Satellite overlay simulation */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[400px] rounded-xl overflow-hidden border border-gray-200 bg-gray-950 p-2.5 shadow-inner">
            {/* Dark agricultural imagery background texture */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative w-full h-full grid grid-cols-8 grid-rows-8 gap-1 p-2 rounded-lg bg-gray-900/90 border border-gray-800">
              {activeObs.gridHeatmap.map((cell) => {
                const color = getNdviColor(cell.ndvi);
                return (
                  <div
                    key={`${cell.x}-${cell.y}`}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{ backgroundColor: color }}
                    className="w-full h-full rounded-xs transition-transform hover:scale-125 hover:z-20 cursor-crosshair opacity-90 hover:opacity-100 ring-1 ring-white/10"
                    title={`Pixel (${cell.x},${cell.y}) - NDVI: ${cell.ndvi}`}
                  />
                );
              })}
            </div>

            {/* Hovered pixel HUD */}
            <div className="absolute top-3 left-3 rounded-md bg-gray-900/90 border border-gray-700/80 px-2 py-0.5 text-[11px] text-white shadow-sm backdrop-blur-xs">
              {hoveredCell ? (
                <span>Pixel ({hoveredCell.x},{hoveredCell.y}): <b style={{ color: getNdviColor(hoveredCell.ndvi) }}>NDVI {hoveredCell.ndvi}</b></span>
              ) : (
                <span className="text-gray-400">Hover pixel to inspect NDVI</span>
              )}
            </div>

            <div className="absolute bottom-3 right-3 rounded-md bg-gray-900/90 border border-gray-700/80 px-2 py-0.5 text-[10px] text-gray-300">
              Observation: {activeObs.observationDate}
            </div>
          </div>

          {/* Color bar scale */}
          <div className="w-full max-w-[400px] mt-3">
            <div className="flex justify-between text-[10px] font-medium text-gray-500 mb-1">
              <span>0.2 (Bare/Water)</span>
              <span>0.5 (Sparse)</span>
              <span>0.7 (Healthy)</span>
              <span>0.95 (Dense Canopy)</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-red-500 via-yellow-400 via-lime-500 to-emerald-600 shadow-xs" />
          </div>
        </div>

        {/* Remote Sensing Metrics & Indices */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Mean Farm NDVI Index</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">{activeObs.ndviMean}</span>
              <span className="text-xs font-semibold text-emerald-600">Healthy Vegetative Range</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Calculated using NIR (Band 8: 842nm) and Red (Band 4: 665nm) surface reflectance.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Vegetation Health</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-bold text-gray-900">{activeObs.vegetationHealthIndex}/100</span>
                <span className="rounded-full bg-emerald-100 p-1 text-emerald-600">
                  <CheckCircle className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${activeObs.vegetationHealthIndex}%` }} />
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Crop Water Stress</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-bold text-gray-900">{activeObs.waterStressIndex}%</span>
                <span className="rounded-full bg-amber-100 p-1 text-amber-500">
                  <AlertTriangle className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-400 h-full" style={{ width: `${activeObs.waterStressIndex}%` }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-emerald-500 text-xs text-emerald-950">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Multi-Temporal Satellite Trend</span>
            </div>
            <p className="leading-relaxed text-gray-700 text-[11px]">
              Compared to the 30-day baseline ({observations[0]?.ndviMean} NDVI), crop vigor has gained{' '}
              <b className="text-emerald-700">+{Math.round((activeObs.ndviMean - (observations[0]?.ndviMean || 0.6)) * 100)}%</b> canopy density.
              Sub-canopy moisture stress remains localized strictly in southern sectors.
            </p>
          </div>

          <div className="rounded-lg bg-gray-900 p-3 text-xs text-gray-300">
            <div className="flex items-center justify-between text-gray-400 text-[11px] mb-1">
              <span>Sentinel-2 Constellation Pass</span>
              <span className="text-emerald-400 font-mono text-[10px]">10m Pixel</span>
            </div>
            <div className="text-[11px] text-gray-400 leading-snug">
              Sentinel-2 MSI schema synced. Real-time satellite imagery feeds automatically update NDVI polygons on scheduled orbital sweeps.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
