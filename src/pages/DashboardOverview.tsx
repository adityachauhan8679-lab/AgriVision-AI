import React, { useState } from 'react';
import {
  Farm,
  SensorReading,
  SensorHistoryPoint,
  WeatherData,
  ManagementZone,
  Alert,
  AiAnalysisResult
} from '../types';
import {
  Activity,
  Droplets,
  Thermometer,
  CloudRain,
  Sun,
  AlertTriangle,
  Bug,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ScanLine,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

interface Props {
  farm: Farm | null;
  sensor: SensorReading | null;
  sensorHistory: SensorHistoryPoint[];
  weather: WeatherData | null;
  zones: ManagementZone[];
  alerts: Alert[];
  onNavigateToTab: (tab: any) => void;
  onRunAiAnalysis: () => void;
  onOpenLeafDoctor: () => void;
  onOpenReport: () => void;
}

export const DashboardOverview: React.FC<Props> = ({
  farm,
  sensor,
  sensorHistory,
  weather,
  zones,
  alerts,
  onNavigateToTab,
  onRunAiAnalysis,
  onOpenLeafDoctor,
  onOpenReport
}) => {
  if (!farm) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>No active farm selected. Please add or select a farm.</p>
      </div>
    );
  }

  // Zone Health chart data
  const zoneChartData = zones.map((z) => ({
    name: z.zoneId,
    healthScore: z.healthScore,
    soilMoisture: z.soilMoisture,
    diseaseRisk: z.diseaseProbability
  }));

  const unreadAlerts = alerts.filter(a => !a.isRead).slice(0, 3);

  return (
    <div className="space-y-5">
      {/* Top Banner / Hero Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl bg-[#111827] text-white p-5 shadow-xs border border-[#374151]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Autonomous Agronomy Active
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">{farm.name}</h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-400">
            <span className="flex items-center gap-1 text-gray-300"><MapPin className="h-3.5 w-3.5 text-emerald-400" /> {farm.location}</span>
            <span>•</span>
            <span>{farm.cropType} ({farm.cropVariety})</span>
            <span>•</span>
            <span>{farm.areaAcres} Acres</span>
            <span>•</span>
            <span>Soil: {farm.soilType}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRunAiAnalysis}
            className="flex items-center gap-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3.5 py-1.5 text-xs shadow-2xs transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Run AI Analysis</span>
          </button>

          <button
            type="button"
            onClick={onOpenLeafDoctor}
            className="flex items-center gap-1.5 rounded-md bg-[#1f2937] hover:bg-gray-800 text-gray-200 font-medium px-3 py-1.5 text-xs border border-gray-700 transition-colors"
          >
            <ScanLine className="h-3.5 w-3.5 text-emerald-400" />
            <span>Leaf Doctor</span>
          </button>

          <button
            type="button"
            onClick={onOpenReport}
            className="flex items-center gap-1.5 rounded-md bg-[#1f2937] hover:bg-gray-800 text-gray-200 font-medium px-3 py-1.5 text-xs border border-gray-700 transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-blue-400" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* 8 Primary Metric Cards with Sleek Interface styling */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Overall Crop Health */}
        <div className="col-span-2 sm:col-span-2 grid-card">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Crop Health Index</div>
            <Activity className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{farm.overallHealthScore}%</div>
          <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, farm.overallHealthScore)}%` }} />
          </div>
          <span className="text-[10px] text-emerald-600 mt-1.5 block font-medium">
            {farm.overallHealthScore >= 80 ? '+2.4% Optimal Vigour' : farm.overallHealthScore >= 60 ? 'Moderate Stress Watch' : 'Action Required'}
          </span>
        </div>

        {/* 2. Soil Moisture */}
        <div className="col-span-2 sm:col-span-2 grid-card">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Soil Moisture (Avg)</div>
            <Droplets className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{sensor?.soilMoisture ?? 32}%</div>
          <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, sensor?.soilMoisture ?? 32)}%` }} />
          </div>
          <span className="text-[10px] text-gray-400 mt-1.5 block">Target: 35% - 50%</span>
        </div>

        {/* 3. Soil Temp */}
        <div className="col-span-2 sm:col-span-2 grid-card">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Temperature</div>
            <Thermometer className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{sensor?.airTemperature ?? 24.5}°C</div>
          <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min(100, (sensor?.airTemperature ?? 24.5) * 2)}%` }} />
          </div>
          <span className="text-[10px] text-gray-400 mt-1.5 block">Root Zone: {sensor?.soilTemperature ?? 21.8}°C</span>
        </div>

        {/* 4. Humidity */}
        <div className="col-span-2 sm:col-span-2 grid-card">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Air Humidity</div>
            <Activity className="h-3.5 w-3.5 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{sensor?.humidity ?? 58}%</div>
          <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${Math.min(100, sensor?.humidity ?? 58)}%` }} />
          </div>
          <span className="text-[10px] text-gray-400 mt-1.5 block">Vapor Deficit: Normal</span>
        </div>

        {/* 5. Rainfall */}
        <div className="col-span-2 sm:col-span-2 grid-card">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Precipitation</div>
            <CloudRain className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{sensor?.rainfall ?? 0} mm</div>
          <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${Math.min(100, (sensor?.rainfall ?? 0) * 10 + 10)}%` }} />
          </div>
          <span className="text-[10px] text-gray-400 mt-1.5 block">Rain Prob: {weather?.forecast?.[0]?.rainProb ?? 15}%</span>
        </div>

        {/* 6. Water Requirement */}
        <div className="col-span-2 sm:col-span-2 grid-card">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Irrigation Req.</div>
            <Droplets className="h-3.5 w-3.5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">22.5k L</div>
          <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-teal-500 h-full rounded-full" style={{ width: '45%' }} />
          </div>
          <span className="text-[10px] text-gray-400 mt-1.5 block">Next cycle: 18:00</span>
        </div>

        {/* 7. Disease Risk */}
        <div className="col-span-2 sm:col-span-2 grid-card">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Disease Risk</div>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-500">28%</div>
          <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: '28%' }} />
          </div>
          <span className="text-[10px] text-amber-600 mt-1.5 block font-medium">Mildew Watch in Zone 3</span>
        </div>

        {/* 8. Pest Risk */}
        <div className="col-span-2 sm:col-span-2 grid-card">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Pest Risk</div>
            <Bug className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">14%</div>
          <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '14%' }} />
          </div>
          <span className="text-[10px] text-emerald-600 mt-1.5 block font-medium">Low Activity Level</span>
        </div>
      </div>

      {/* Dual Graphical Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Zone Health Distribution (Bar Chart) */}
        <div className="lg:col-span-7 grid-card">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div>
              <h3 className="text-xs font-bold text-gray-800">GIS Management Zone Health Comparison</h3>
              <p className="text-[11px] text-gray-500">Calculated across multispectral vegetation & sensor indices</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('gis')}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              <span>View Map</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="healthScore" fill="#10b981" radius={[4, 4, 0, 0]} name="Health Score" />
                <Bar dataKey="soilMoisture" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Soil Moisture %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Real-time 24h Soil Moisture Curve */}
        <div className="lg:col-span-5 grid-card">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div>
              <h3 className="text-xs font-bold text-gray-800">24h Soil Moisture Dynamics</h3>
              <p className="text-[11px] text-gray-500">Root zone moisture telemetry</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Live
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sensorHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} domain={[20, 50]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="soilMoisture"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#moistureGradient)"
                  name="Moisture %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weather Forecast & Recent Alerts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Weather Intelligence Widget */}
        <div className="lg:col-span-6 grid-card">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs font-bold text-gray-800">Microclimate Forecast ({farm.location})</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('weather')}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              5-Day Plan &rarr;
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center">
            {weather?.forecast?.map((day) => (
              <div key={day.day} className="rounded-lg border border-gray-100 bg-gray-50 p-2.5">
                <span className="text-[11px] font-bold text-gray-700">{day.day}</span>
                <p className="text-sm font-extrabold text-gray-900 mt-1">{day.tempMax}°</p>
                <p className="text-[10px] text-gray-500">{day.tempMin}°</p>
                <div className="mt-2 text-[10px] font-semibold text-blue-600">
                  {day.rainProb}% rain
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-emerald-50/60 p-3 border border-emerald-100 text-xs text-emerald-950">
            <span className="font-bold text-emerald-900">Agronomic Advisory: </span>
            {weather?.agriculturalAdvisory || 'Optimal conditions for scheduled morning fertigation prior to peak sun hours.'}
          </div>
        </div>

        {/* Smart Alerts Feed with sleek border-l-4 style */}
        <div className="lg:col-span-6 grid-card">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs font-bold text-gray-800">Recent Smart Alerts</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('alerts')}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              View All ({alerts.length}) &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {unreadAlerts.length === 0 ? (
              <p className="text-xs text-gray-500 p-4 text-center">No unread critical alerts. All zones within optimal limits.</p>
            ) : (
              unreadAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 bg-gray-50 rounded-lg border-l-4 transition-colors flex items-start justify-between gap-3 ${
                    alert.severity === 'CRITICAL'
                      ? 'border-red-500'
                      : alert.severity === 'WARNING'
                      ? 'border-amber-400'
                      : 'border-blue-500'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-gray-800">{alert.title}</div>
                    <div className="text-[11px] text-gray-600 line-clamp-1 mt-0.5">{alert.message}</div>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                    {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
