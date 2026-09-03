import React from 'react';
import { FarmReport } from '../types';
import { X, Printer, Download, CheckCircle, Sprout, ShieldCheck, Calendar, MapPin, Activity, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  report: FarmReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<Props> = ({ report, isOpen, onClose }) => {
  if (!isOpen || !report) return null;

  const handlePrint = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
    window.print();
  };

  const handleDownload = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 }
    });

    // Generate downloadable text/markdown report file
    const content = `=====================================================
AGRIVISION AI • PRECISION AGRICULTURE AUDIT REPORT
=====================================================
Report ID: ${report.reportId}
Date Generated: ${new Date(report.generatedAt).toLocaleString()}
Certified By: ${report.certifiedBy}

1. FARMLAND PROFILE:
Farm: ${report.farm.name}
Crop Cultivar: ${report.farm.crop} (${report.farm.variety})
Soil Profile: ${report.farm.soilType}
Total Area: ${report.farm.areaAcres} Acres (${report.farm.areaHectares} Ha)
Sowing Date: ${report.farm.sowingDate}
Center Coordinates: Lat ${report.farm.center.lat}, Lng ${report.farm.center.lng}

2. OVERALL CROP HEALTH SCORE:
Score: ${report.healthScore} / 100
Classification: ${report.healthGrade}

3. GIS MANAGEMENT ZONES:
${report.zonesSummary.map(z => `[${z.zoneId}] ${z.name}: Health ${z.healthScore}/100 | Status: ${z.status} | Soil Moisture: ${z.soilMoisture}% | Action: ${z.recommendedAction}`).join('\n')}

4. SENSOR TELEMETRY SUMMARY:
- Soil Moisture: ${report.sensorsSummary.soilMoisture}
- Root Temp: ${report.sensorsSummary.soilTemp}
- Ambient Canopy Temp: ${report.sensorsSummary.airTemp}
- Relative Humidity: ${report.sensorsSummary.humidity}
- Soil pH: ${report.sensorsSummary.soilPh}
- Light Intensity: ${report.sensorsSummary.lightIntensity}

5. SATELLITE NDVI MULTI-SPECTRAL OBSERVATION:
- Timeframe: ${report.satelliteNdvi.timeframe}
- Mean NDVI: ${report.satelliteNdvi.meanNdvi}
- Vegetation Health Index: ${report.satelliteNdvi.vegetationHealthIndex} / 100
- Water Stress Index: ${report.satelliteNdvi.waterStressIndex}%
- Ground Sensor Resolution: ${report.satelliteNdvi.resolution}

6. WEATHER & MICROCLIMATE:
- Condition: ${report.weatherSummary.condition} (${report.weatherSummary.currentTemp})
- Rain Probability: ${report.weatherSummary.rainProbability}
- Wind Velocity: ${report.weatherSummary.windSpeed}
- Agronomic Impact: ${report.weatherSummary.agriculturalImpact}

7. AI ZONE-SPECIFIC RECOMMENDATION & PROJECTIONS:
- Expected Harvest Yield: ${report.aiRecommendations.expectedYield}
- Total Irrigation Target: ${report.aiRecommendations.irrigationRequirement}
- Nutrient Prescription: ${report.aiRecommendations.fertilizerRecommendation}
- Overall Strategy: ${report.aiRecommendations.overallRecommendation}
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.reportId}_AgriVision_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-800 px-5 py-3.5 bg-[#111827] text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600 text-white">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Farm Health & Remote Sensing Audit Report</h3>
              <p className="text-[11px] text-gray-400">ID: {report.reportId} • Certified Diagnostic</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-md bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-200 hover:bg-gray-700 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 shadow-2xs transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Download Report
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white ml-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-gray-800 font-sans" id="printable-report-area">
          {/* Header Identity */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-extrabold text-xl text-gray-900 tracking-tight">AgriVision AI</span>
                <span className="rounded bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-[10px] uppercase tracking-wider">PRECISION AUDIT</span>
              </div>
              <p className="text-xs text-gray-500">Autonomous GIS, Sentinel-2 Multi-Spectral & IoT Diagnostics</p>
              <p className="text-xs text-gray-500">Generated: {new Date(report.generatedAt).toLocaleString()}</p>
            </div>

            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3.5 text-right min-w-[180px]">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Crop Health Score</span>
              <div className="text-3xl font-bold text-emerald-700 mt-0.5">{report.healthScore}<span className="text-base text-emerald-600 font-normal">/100</span></div>
              <p className="text-xs font-medium text-emerald-900 mt-0.5">{report.healthGrade}</p>
            </div>
          </div>

          {/* Farm Specs Grid */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">Farmland Specifications</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-gray-500 text-[11px]">Farm Name:</span>
                <p className="font-bold text-gray-900 mt-0.5">{report.farm.name}</p>
              </div>
              <div>
                <span className="text-gray-500 text-[11px]">Crop Cultivar:</span>
                <p className="font-bold text-gray-900 mt-0.5">{report.farm.crop} ({report.farm.variety})</p>
              </div>
              <div>
                <span className="text-gray-500 text-[11px]">Total Area:</span>
                <p className="font-bold text-gray-900 mt-0.5">{report.farm.areaAcres} Acres ({report.farm.areaHectares} Ha)</p>
              </div>
              <div>
                <span className="text-gray-500 text-[11px]">Soil Classification:</span>
                <p className="font-bold text-gray-900 mt-0.5">{report.farm.soilType}</p>
              </div>
            </div>
          </div>

          {/* Zone-by-Zone Management Analysis */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">
              Geotagged Management Zones ({report.zonesSummary.length} Zones)
            </h4>
            <div className="space-y-2">
              {report.zonesSummary.map((zone) => (
                <div key={zone.zoneId} className="rounded-lg border border-gray-200 p-3 bg-white shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${
                        zone.status === 'HEALTHY' ? 'bg-emerald-500' :
                        zone.status === 'MODERATE_STRESS' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span className="font-bold text-gray-900 text-xs">{zone.name}</span>
                      <span className="text-[11px] text-gray-500">({zone.areaAcres} Acres)</span>
                    </div>
                    <span className={`badge ${
                      zone.status === 'HEALTHY' ? 'health-80' :
                      zone.status === 'MODERATE_STRESS' ? 'health-50' : 'health-30'
                    }`}>
                      Health: {zone.healthScore}/100 • {zone.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-gray-600 mb-2">
                    <div>Moisture: <b className="text-gray-900">{zone.soilMoisture}%</b></div>
                    <div>Canopy Temp: <b className="text-gray-900">{zone.temperature}°C</b></div>
                    <div>Disease Risk: <b className="text-gray-900">{zone.diseaseRisk}%</b></div>
                    <div>Water Need: <b className="text-emerald-700">{zone.waterRequirement}</b></div>
                  </div>

                  <p className="text-xs text-gray-600 bg-gray-50 rounded p-2 leading-relaxed">
                    <strong className="text-gray-900">Action: </strong>{zone.recommendedAction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry & Satellite Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 p-3.5 bg-gray-50">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">IoT Node Telemetry</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-gray-500 text-[11px]">Soil Moisture:</span>
                  <p className="font-bold text-gray-900 mt-0.5">{report.sensorsSummary.soilMoisture}</p>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-gray-500 text-[11px]">Soil Temp:</span>
                  <p className="font-bold text-gray-900 mt-0.5">{report.sensorsSummary.soilTemp}</p>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-gray-500 text-[11px]">Air Temp:</span>
                  <p className="font-bold text-gray-900 mt-0.5">{report.sensorsSummary.airTemp}</p>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-gray-500 text-[11px]">Relative Humidity:</span>
                  <p className="font-bold text-gray-900 mt-0.5">{report.sensorsSummary.humidity}</p>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-gray-500 text-[11px]">Soil pH:</span>
                  <p className="font-bold text-gray-900 mt-0.5">{report.sensorsSummary.soilPh}</p>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-gray-500 text-[11px]">Light Intensity:</span>
                  <p className="font-bold text-gray-900 mt-0.5">{report.sensorsSummary.lightIntensity}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-3.5 bg-gray-50">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">Satellite NDVI Remote Sensing</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-gray-500 text-[11px]">Mean NDVI Index:</span>
                  <p className="font-bold text-emerald-700 text-sm mt-0.5">{report.satelliteNdvi.meanNdvi}</p>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-gray-500 text-[11px]">Vegetation Health:</span>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">{report.satelliteNdvi.vegetationHealthIndex}/100</p>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-gray-500 text-[11px]">Water Stress Index:</span>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">{report.satelliteNdvi.waterStressIndex}%</p>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                  <span className="text-gray-500 text-[11px]">Resolution:</span>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">{report.satelliteNdvi.resolution}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Precision Agronomy Recommendations */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4">
            <div className="flex items-center gap-2 font-bold text-emerald-950 text-xs mb-2">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>AI Precision Farming Prescriptions</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed mb-3">
              {report.aiRecommendations.overallRecommendation}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs bg-white/90 p-2.5 rounded-lg border border-emerald-200">
              <div>
                <span className="text-gray-500 text-[11px]">Expected Harvest Yield:</span>
                <p className="font-bold text-gray-900 mt-0.5">{report.aiRecommendations.expectedYield}</p>
              </div>
              <div>
                <span className="text-gray-500 text-[11px]">Targeted Irrigation Volume:</span>
                <p className="font-bold text-emerald-700 mt-0.5">{report.aiRecommendations.irrigationRequirement}</p>
              </div>
              <div>
                <span className="text-gray-500 text-[11px]">Nutrient Adjustments:</span>
                <p className="font-bold text-gray-900 mt-0.5">{report.aiRecommendations.fertilizerRecommendation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-5 py-3 flex justify-between items-center text-xs text-gray-500">
          <span>AgriVision AI Certified Precision Agricultural Platform</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
