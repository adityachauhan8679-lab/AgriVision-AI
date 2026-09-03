import React from 'react';
import { Farm, SatelliteObservation } from '../types';
import { NdviSatelliteViewer } from '../components/NdviSatelliteViewer';
import { Satellite, Layers, Info, CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  farm: Farm | null;
  observations: SatelliteObservation[];
}

export const SatellitePage: React.FC<Props> = ({ farm, observations }) => {
  if (!farm) {
    return <div className="p-8 text-center text-slate-500">Please select an active farm.</div>;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Satellite Remote Sensing & NDVI Analytics</h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Sentinel-2 MSI
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {farm.name} • 10m Ground Sample Distance • Normalized Difference Vegetation Index
          </p>
        </div>
      </div>

      {/* Main Satellite Component with Heatmap & Multi-Temporal Selector */}
      <NdviSatelliteViewer observations={observations} />

      {/* Deep-Dive Remote Sensing Explainer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="grid-card">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-xs uppercase tracking-wider mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 text-[11px] font-bold">
              NIR
            </span>
            <span>Near-Infrared Reflectance (B8)</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Healthy mesophyll cell structure strongly reflects Near-Infrared wavelengths (842nm). Decreased NIR reflectance directly indicates cellular water deficit and early-stage pathogen degradation before symptoms are visible to the human eye.
          </p>
        </div>

        <div className="grid-card">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-xs uppercase tracking-wider mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-100 text-red-600 text-[11px] font-bold">
              RED
            </span>
            <span>Chlorophyll Absorption (B4)</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Active chlorophyll absorbing solar radiation in the red band (665nm) creates a high mathematical contrast against NIR. NDVI is derived as:
            <code className="block mt-2 bg-gray-50 border border-gray-200 p-1.5 rounded text-[11px] font-mono text-gray-800">NDVI = (NIR - RED) / (NIR + RED)</code>
          </p>
        </div>

        <div className="grid-card">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-xs uppercase tracking-wider mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-700 text-[11px] font-bold">
              SWIR
            </span>
            <span>Canopy Water Stress (B11/B12)</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Short-Wave Infrared detects foliar moisture content. Combined with NDVI, AgriVision AI calculates the Normalized Difference Water Index (NDWI) to separate nutrient deficiency from simple irrigation shortages.
          </p>
        </div>
      </div>
    </div>
  );
};
