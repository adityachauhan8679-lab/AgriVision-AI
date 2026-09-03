import React, { useState } from 'react';
import { SensorReading, SensorHistoryPoint } from '../types';
import {
  Droplets,
  Thermometer,
  CloudRain,
  Sun,
  Activity,
  AlertTriangle,
  CheckCircle,
  Wifi,
  WifiOff,
  BatteryCharging
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface Props {
  sensor: SensorReading | null;
  history: SensorHistoryPoint[];
  onToggleStatus?: () => void;
}

export const SensorRealtimeCards: React.FC<Props> = ({ sensor, history, onToggleStatus }) => {
  const [activeChartMetric, setActiveChartMetric] = useState<keyof SensorHistoryPoint>('soilMoisture');

  if (!sensor) {
    return <div className="p-8 text-center text-slate-500">Connecting to IoT telemetric node...</div>;
  }

  const isMoistureCritical = sensor.soilMoisture < 30;
  const isTempHigh = sensor.airTemperature > 32;

  const sensorCards = [
    {
      id: 'soilMoisture',
      name: 'Soil Moisture',
      value: `${sensor.soilMoisture}%`,
      subtext: isMoistureCritical ? 'Critically Low' : 'Optimal Field Capacity',
      icon: Droplets,
      color: isMoistureCritical ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-blue-600 bg-blue-50 border-blue-200',
      warning: isMoistureCritical ? 'Soil moisture < 30%: Wilting point risk' : null,
      metricKey: 'soilMoisture' as keyof SensorHistoryPoint,
      unit: '%'
    },
    {
      id: 'soilTemp',
      name: 'Soil Temperature',
      value: `${sensor.soilTemperature}°C`,
      subtext: 'Root Zone Level',
      icon: Thermometer,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      warning: null,
      metricKey: 'soilTemperature' as keyof SensorHistoryPoint,
      unit: '°C'
    },
    {
      id: 'airTemp',
      name: 'Air Temperature',
      value: `${sensor.airTemperature}°C`,
      subtext: 'Ambient Canopy',
      icon: Thermometer,
      color: isTempHigh ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-orange-600 bg-orange-50 border-orange-200',
      warning: isTempHigh ? 'High heat load on leaf canopy' : null,
      metricKey: 'airTemperature' as keyof SensorHistoryPoint,
      unit: '°C'
    },
    {
      id: 'humidity',
      name: 'Relative Humidity',
      value: `${sensor.humidity}%`,
      subtext: 'Vapor Deficit Standard',
      icon: Activity,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      warning: sensor.humidity > 70 ? 'High fungal spore incubation risk' : null,
      metricKey: 'humidity' as keyof SensorHistoryPoint,
      unit: '%'
    },
    {
      id: 'soilPh',
      name: 'Soil pH',
      value: `${sensor.soilPh}`,
      subtext: 'Slightly Acidic (Ideal)',
      icon: Activity,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      warning: null,
      metricKey: 'soilPh' as keyof SensorHistoryPoint,
      unit: 'pH'
    },
    {
      id: 'rainfall',
      name: 'Cumulative Rainfall',
      value: `${sensor.rainfall} mm`,
      subtext: 'Last 24 Hours',
      icon: CloudRain,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      warning: null,
      metricKey: 'rainfall' as keyof SensorHistoryPoint,
      unit: 'mm'
    },
    {
      id: 'lightIntensity',
      name: 'Solar Insolation',
      value: `${sensor.lightIntensity.toLocaleString()} Lux`,
      subtext: 'Photosynthetic Active',
      icon: Sun,
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      warning: null,
      metricKey: 'lightIntensity' as keyof SensorHistoryPoint,
      unit: 'Lux'
    }
  ];

  const chartLabels: Record<string, string> = {
    soilMoisture: 'Soil Moisture (%)',
    soilTemperature: 'Soil Temperature (°C)',
    airTemperature: 'Air Temperature (°C)',
    humidity: 'Relative Humidity (%)',
    soilPh: 'Soil pH',
    rainfall: 'Rainfall (mm)',
    lightIntensity: 'Solar Insolation (Lux)'
  };

  return (
    <div className="space-y-5">
      {/* Node Status Bar */}
      <div className="grid-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            sensor.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {sensor.status === 'ONLINE' ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900 text-sm">IoT Telemetry Station #NODE-704</h4>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                sensor.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {sensor.status === 'ONLINE' ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              LoRaWAN 915MHz Gateway • Reading updated: {new Date(sensor.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
            <BatteryCharging className="h-4 w-4 text-emerald-600" />
            <span>Battery: {sensor.batteryLevel}% (Solar Trickle)</span>
          </div>

          {onToggleStatus && (
            <button
              type="button"
              onClick={onToggleStatus}
              className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors"
            >
              Simulate {sensor.status === 'ONLINE' ? 'Disconnect' : 'Connect'}
            </button>
          )}
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sensorCards.map((card) => {
          const Icon = card.icon;
          const isSelected = activeChartMetric === card.metricKey;
          return (
            <div
              key={card.id}
              onClick={() => setActiveChartMetric(card.metricKey)}
              className={`grid-card cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-emerald-500 border-emerald-500' : 'hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">{card.name}</span>
                <span className={`rounded-lg p-1.5 border ${card.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="mt-2.5">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">{card.value}</span>
                <p className="text-[11px] text-gray-500 mt-0.5">{card.subtext}</p>
              </div>

              {card.warning && (
                <div className="mt-2.5 flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-1 text-[10px] font-medium text-red-700 border border-red-100">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span className="truncate">{card.warning}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* History Line Chart */}
      <div className="grid-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-4">
          <div>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">24-Hour Sensor History & Trends</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Showing: <span className="font-semibold text-emerald-700">{chartLabels[activeChartMetric]}</span> (Click any card above to change metric)
            </p>
          </div>
          <span className="text-xs font-medium text-gray-400">15-min Telemetry Intervals</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderRadius: '0.5rem', color: '#ffffff', border: 'none', fontSize: '12px' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Line
                type="monotone"
                dataKey={activeChartMetric}
                stroke="#065f46"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#10b981', strokeWidth: 1.5, stroke: '#ffffff' }}
                activeDot={{ r: 5, fill: '#065f46' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
