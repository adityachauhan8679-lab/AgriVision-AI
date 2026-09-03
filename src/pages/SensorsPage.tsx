import React from 'react';
import { Farm, SensorReading, SensorHistoryPoint } from '../types';
import { SensorRealtimeCards } from '../components/SensorRealtimeCards';
import { sensorsApi } from '../services/api';
import { Cpu, Wifi, Activity, ShieldCheck, RefreshCw } from 'lucide-react';

interface Props {
  farm: Farm | null;
  sensor: SensorReading | null;
  history: SensorHistoryPoint[];
  onRefreshSensor: () => void;
}

export const SensorsPage: React.FC<Props> = ({ farm, sensor, history, onRefreshSensor }) => {
  if (!farm) {
    return <div className="p-8 text-center text-slate-500">Please select an active farm.</div>;
  }

  const handleToggleStatus = async () => {
    try {
      await sensorsApi.toggleStatus(farm.id);
      onRefreshSensor();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">IoT In-Situ Telemetry Station</h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live Polling: 8s
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {farm.name} • Solar-Powered Node #704 • LoRaWAN 915MHz Gateway
          </p>
        </div>

        <button
          type="button"
          onClick={onRefreshSensor}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
          <span>Force Telemetry Ping</span>
        </button>
      </div>

      {/* Sensor Real-time Cards & Graph */}
      <SensorRealtimeCards
        sensor={sensor}
        history={history}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
};
