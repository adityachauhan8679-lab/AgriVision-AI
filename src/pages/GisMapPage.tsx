import React, { useState } from 'react';
import { Farm, ManagementZone } from '../types';
import { LeafletGisMap } from '../components/LeafletGisMap';
import { zonesApi } from '../services/api';
import {
  Layers,
  MapPin,
  Sparkles,
  Droplets,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  farm: Farm | null;
  zones: ManagementZone[];
  onRefreshZones: () => void;
}

export const GisMapPage: React.FC<Props> = ({ farm, zones, onRefreshZones }) => {
  const [selectedZone, setSelectedZone] = useState<ManagementZone | null>(zones[0] || null);
  const [isApplying, setIsApplying] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!farm) {
    return <div className="p-8 text-center text-slate-500">Please select a farm to inspect GIS zones.</div>;
  }

  const handleApplyZoneAction = async (zone: ManagementZone) => {
    setIsApplying(true);
    setActionSuccess(null);
    try {
      // Simulate precision application improving the zone's status
      await zonesApi.updateZone(farm.id, zone.id, {
        healthScore: Math.min(100, zone.healthScore + 18),
        healthStatus: zone.healthScore + 18 >= 80 ? 'HEALTHY' : 'MODERATE_STRESS',
        soilMoisture: Math.min(55, zone.soilMoisture + 15),
        diseaseProbability: Math.max(5, zone.diseaseProbability - 10),
        waterRequirement: 'Target Met (Optimal)',
        recommendedAction: 'Prescription executed successfully. Maintain scheduled telemetry observation.'
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });

      setActionSuccess(`Prescription applied to ${zone.zoneId}! Soil moisture restored and crop stress alleviated.`);
      onRefreshZones();
    } catch (err) {
      console.error(err);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">GIS Management Zones & Geotagged Field Map</h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {zones.length} Sectors
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {farm.name} • {farm.cropType} ({farm.cropVariety}) • {farm.location}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Click any zone polygon to inspect or apply treatments</span>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-emerald-500 text-xs text-emerald-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{actionSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccess(null)}
            className="text-[11px] font-bold text-emerald-900 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Interactive Map Component */}
      <div className="grid-card p-0 overflow-hidden relative border border-gray-200">
        <LeafletGisMap
          farm={farm}
          zones={zones}
          onSelectZone={(zone) => setSelectedZone(zone)}
        />
      </div>

      {/* Zone Details & Action Runner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Selected Zone Inspector Card */}
        <div className="lg:col-span-5 grid-card">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Inspected Sector</span>
              <h3 className="font-bold text-gray-900 text-base">{selectedZone ? selectedZone.name : 'Select a zone'}</h3>
            </div>
            {selectedZone && (
              <span className={`badge ${
                selectedZone.healthStatus === 'HEALTHY' ? 'health-80' :
                selectedZone.healthStatus === 'MODERATE_STRESS' ? 'health-60' : 'health-30'
              }`}>
                Score: {selectedZone.healthScore}/100
              </span>
            )}
          </div>

          {selectedZone ? (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-lg bg-gray-50 p-2.5 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block">Zone Area</span>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{selectedZone.areaAcres} Acres</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-2.5 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block">Soil Moisture</span>
                  <p className="text-sm font-bold text-blue-600 mt-0.5">{selectedZone.soilMoisture}%</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-2.5 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block">Canopy Temp</span>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{selectedZone.temperature}°C</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-2.5 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block">Disease Probability</span>
                  <p className="text-sm font-bold text-amber-500 mt-0.5">{selectedZone.diseaseProbability}%</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500 text-xs">
                <span className="font-bold text-gray-800 block mb-0.5">Water Requirement:</span>
                <p className="text-gray-700 font-medium">{selectedZone.waterRequirement}</p>
              </div>

              <div className={`p-3 bg-gray-50 rounded-lg border-l-4 text-xs ${
                selectedZone.healthStatus === 'HEALTHY' ? 'border-emerald-500' : 'border-amber-400'
              }`}>
                <span className="font-bold text-gray-800 block mb-1">AI Precision Recommendation:</span>
                <p className="text-gray-700 leading-relaxed">{selectedZone.recommendedAction}</p>
              </div>

              {selectedZone.healthStatus !== 'HEALTHY' && (
                <button
                  type="button"
                  onClick={() => handleApplyZoneAction(selectedZone)}
                  disabled={isApplying}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 text-xs shadow-2xs transition-colors"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>{isApplying ? 'Dispatching Targeted Treatment...' : 'Execute Precision Prescription on Zone'}</span>
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">Select a zone polygon on the map above.</p>
          )}
        </div>

        {/* All Zones Summary Table */}
        <div className="lg:col-span-7 grid-card">
          <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">All Farm Management Zones</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="p-2.5">Zone</th>
                  <th className="p-2.5">Health</th>
                  <th className="p-2.5">Moisture</th>
                  <th className="p-2.5">Action Summary</th>
                  <th className="p-2.5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {zones.map((zone) => (
                  <tr
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedZone?.id === zone.id ? 'bg-emerald-50/60 font-medium' : ''
                    }`}
                  >
                    <td className="p-2.5 font-bold text-gray-900">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${
                          zone.healthStatus === 'HEALTHY' ? 'bg-emerald-500' :
                          zone.healthStatus === 'MODERATE_STRESS' ? 'bg-amber-400' : 'bg-red-500'
                        }`} />
                        <span>{zone.zoneId}</span>
                      </div>
                    </td>
                    <td className="p-2.5 font-bold">
                      <span className={`${
                        zone.healthScore >= 80 ? 'text-emerald-600' :
                        zone.healthScore >= 60 ? 'text-amber-500' : 'text-red-600'
                      }`}>
                        {zone.healthScore}%
                      </span>
                    </td>
                    <td className="p-2.5 text-gray-700">{zone.soilMoisture}%</td>
                    <td className="p-2.5 text-gray-600 max-w-[200px] truncate">{zone.recommendedAction}</td>
                    <td className="p-2.5 text-right">
                      <button
                        type="button"
                        className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
