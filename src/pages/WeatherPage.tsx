import React from 'react';
import { Farm, WeatherData } from '../types';
import {
  Sun,
  CloudRain,
  Wind,
  Droplets,
  CloudSun,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Compass
} from 'lucide-react';

interface Props {
  farm: Farm | null;
  weather: WeatherData | null;
}

export const WeatherPage: React.FC<Props> = ({ farm, weather }) => {
  if (!farm || !weather) {
    return <div className="p-8 text-center text-slate-500">Loading microclimate meteorological data...</div>;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Weather & Microclimate Intelligence</h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Hyperlocal 1km Grid
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Station: {weather.station} • Elevation: 54m AMSL • Evapotranspiration Tracking Active
          </p>
        </div>
      </div>

      {/* Current Conditions Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        <div className="md:col-span-6 rounded-xl bg-[#111827] text-white p-5 shadow-xs border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Microclimate</span>
              <span className="rounded-full bg-emerald-900/60 text-emerald-400 border border-emerald-700/50 px-2.5 py-0.5 text-xs font-semibold">
                {weather.current.condition}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-4xl font-bold tracking-tight">{weather.current.temp}°C</span>
              <span className="text-xs text-gray-400">Feels like {weather.current.temp - 1}°C</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Updated 10 minutes ago via on-farm weather station</p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-800 pt-3.5 text-xs">
            <div>
              <span className="text-gray-400 text-[11px] flex items-center gap-1">
                <Droplets className="h-3.5 w-3.5 text-blue-400" /> Humidity
              </span>
              <p className="font-bold text-sm text-white mt-0.5">{weather.current.humidity}%</p>
            </div>
            <div>
              <span className="text-gray-400 text-[11px] flex items-center gap-1">
                <Wind className="h-3.5 w-3.5 text-emerald-400" /> Wind
              </span>
              <p className="font-bold text-sm text-white mt-0.5">{weather.current.windSpeed} km/h</p>
            </div>
            <div>
              <span className="text-gray-400 text-[11px] flex items-center gap-1">
                <CloudRain className="h-3.5 w-3.5 text-cyan-400" /> Rain Prob
              </span>
              <p className="font-bold text-sm text-white mt-0.5">{weather.current.rainProbability}%</p>
            </div>
          </div>
        </div>

        {/* Agricultural Impact & Farm Advisory */}
        <div className="md:col-span-6 grid-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <CloudSun className="h-4 w-4" />
              </span>
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">Automated Agronomic Advisory</h3>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200 mb-3">
              {weather.agriculturalAdvisory}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-950 font-medium">
              <span>Spray Window Suitability (Next 24h):</span>
              <b className="text-emerald-800">Optimal (Low Drift &lt; 15 km/h)</b>
            </div>
            <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-950 font-medium">
              <span>Reference Evapotranspiration (ETo):</span>
              <b className="text-blue-800">4.2 mm/day</b>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Precision Forecast */}
      <div className="grid-card">
        <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">5-Day Agricultural Weather Outlook</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {weather.forecast.map((day) => (
            <div key={day.day} className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
              <span className="text-xs font-bold text-gray-900 block">{day.day}</span>
              <span className="text-[11px] text-gray-500 block mb-1.5">{day.condition}</span>

              <div className="my-1.5">
                <span className="text-xl font-bold text-gray-900">{day.tempMax}°</span>
                <span className="text-xs text-gray-400 ml-1 font-medium">{day.tempMin}°</span>
              </div>

              <div className="mt-2.5 pt-2.5 border-t border-gray-200 space-y-1 text-[11px]">
                <div className="flex justify-between text-blue-600 font-medium">
                  <span>Rain:</span>
                  <span>{day.rainProb}%</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Wind:</span>
                  <span>{day.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
