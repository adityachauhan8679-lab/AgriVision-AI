import React from 'react';
import { useAuth } from '../context/AuthContext';
import { farmsApi } from '../services/api';
import {
  Plus,
  MapPin,
  Sprout,
  Activity,
  Layers,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Farm } from '../types';

interface Props {
  onSelectFarmAndGoToDashboard: (farmId: string) => void;
  onSelectFarmAndGoToGis: (farmId: string) => void;
  onOpenAddFarm: () => void;
}

export const MyFarmsPage: React.FC<Props> = ({
  onSelectFarmAndGoToDashboard,
  onSelectFarmAndGoToGis,
  onOpenAddFarm
}) => {
  const { farms, selectedFarmId, setSelectedFarmId, refreshFarms } = useAuth();

  const handleDeleteFarm = async (farmId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (farms.length <= 1) {
      alert('You must keep at least one active farm in the platform.');
      return;
    }
    if (confirm('Are you sure you want to delete this farm from your telemetry records?')) {
      try {
        await farmsApi.delete(farmId);
        await refreshFarms();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Farmlands ({farms.length})</h2>
          <p className="text-xs text-slate-500">
            Select a farm to switch active telemetries or register a new plot
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddFarm}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Farm</span>
        </button>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {farms.map((farm) => {
          const isSelected = farm.id === selectedFarmId;
          return (
            <div
              key={farm.id}
              onClick={() => setSelectedFarmId(farm.id)}
              className={`cursor-pointer rounded-2xl border bg-white p-5 transition-all hover:shadow-md relative flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{farm.name}</h3>
                      {isSelected && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-emerald-600" />
                      {farm.location}
                    </p>
                  </div>

                  <span className={`inline-block text-xs font-bold px-2 py-1 rounded-lg ${
                    farm.overallHealthScore >= 80 ? 'bg-emerald-100 text-emerald-800' :
                    farm.overallHealthScore >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {farm.overallHealthScore}% Health
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                    <span className="text-[10px] text-slate-400">Crop Cultivar</span>
                    <p className="font-bold text-slate-800 truncate">{farm.cropType}</p>
                    <p className="text-[10px] text-slate-500 truncate">{farm.cropVariety}</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                    <span className="text-[10px] text-slate-400">Land Area</span>
                    <p className="font-bold text-slate-800">{farm.areaAcres} Acres</p>
                    <p className="text-[10px] text-slate-500">{farm.areaHectares} Hectares</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                    <span className="text-[10px] text-slate-400">Soil Profile</span>
                    <p className="font-bold text-slate-800 truncate">{farm.soilType}</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                    <span className="text-[10px] text-slate-400">GIS Zones</span>
                    <p className="font-bold text-emerald-700">{farm.managementZones?.length ?? farm.zonesCount ?? 4} Sectors</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectFarmAndGoToDashboard(farm.id)}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-semibold shadow-2xs transition-colors"
                >
                  Dashboard
                </button>

                <button
                  type="button"
                  onClick={() => onSelectFarmAndGoToGis(farm.id)}
                  className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  GIS Map
                </button>

                {farms.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteFarm(farm.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    title="Delete Farm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
