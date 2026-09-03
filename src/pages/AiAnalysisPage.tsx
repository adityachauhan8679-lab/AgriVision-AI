import React, { useState } from 'react';
import { Farm, AiAnalysisResult } from '../types';
import { aiApi } from '../services/api';
import {
  Sparkles,
  Activity,
  Droplets,
  AlertTriangle,
  Bug,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  farm: Farm | null;
  onAnalysisFinished?: () => void;
}

export const AiAnalysisPage: React.FC<Props> = ({ farm, onAnalysisFinished }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [result, setResult] = useState<AiAnalysisResult | null>(null);

  if (!farm) {
    return <div className="p-8 text-center text-slate-500">Please select an active farm.</div>;
  }

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStep('Ingesting Sentinel-2 multi-spectral reflectance bands...');

    try {
      setTimeout(() => setAnalysisStep('Normalizing root-zone IoT soil telemetries...'), 600);
      setTimeout(() => setAnalysisStep('Running convolutional disease probability models...'), 1200);

      const data = await aiApi.analyzeFarm(farm.id);

      setTimeout(() => {
        setResult(data);
        setIsAnalyzing(false);
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
        if (onAnalysisFinished) onAnalysisFinished();
      }, 1800);
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header with Run Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-[#111827] text-white p-5 shadow-xs border border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500 text-gray-950">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Autonomous Agronomic Intelligence
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">AI Crop Health & Precision Prescription Engine</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
            Synthesizes multi-spectral NDVI, in-situ root sensors, and meteorological forecasts to generate targeted, zone-specific farm actions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 text-xs shadow-2xs transition-colors self-start sm:self-auto"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Analyzing Farm...</span>
            </>
          ) : (
            <>
              <Zap className="h-3.5 w-3.5" />
              <span>Run AI Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Loading HUD during analysis */}
      {isAnalyzing && (
        <div className="grid-card text-center space-y-3 py-8">
          <div className="flex justify-center">
            <RefreshCw className="h-7 w-7 text-emerald-600 animate-spin" />
          </div>
          <p className="font-bold text-gray-900 text-sm">{analysisStep}</p>
          <div className="w-full max-w-md mx-auto bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full animate-pulse w-3/4 rounded-full" />
          </div>
          <p className="text-xs text-gray-500">Processing 10m Sentinel-2 pixels against in-situ IoT telemetry</p>
        </div>
      )}

      {/* Results Display */}
      {result ? (
        <div className="space-y-5">
          {/* Top Score Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="grid-card">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Overall Crop Health</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-2xl font-bold text-emerald-600">{result.healthScore}</span>
                <span className="text-xs font-semibold text-emerald-700">/100</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Calculated across all zones</p>
            </div>

            <div className="grid-card">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Disease Probability</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-2xl font-bold text-amber-500">{result.diseaseProbability}%</span>
              </div>
              <p className="text-[11px] text-amber-600 mt-1">Foliar fungal watch</p>
            </div>

            <div className="grid-card">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Water Stress</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-2xl font-bold text-blue-600">{result.waterStressScore}%</span>
              </div>
              <p className="text-[11px] text-blue-600 mt-1">Localized in South zone</p>
            </div>

            <div className="grid-card">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Yield Projection</span>
              <div className="flex items-baseline gap-1 mt-1.5">
                <span className="text-xl font-bold text-gray-900 truncate">{result.expectedYield}</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">+14% with precision zoning</p>
            </div>
          </div>

          {/* Action Prescriptions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="grid-card space-y-3.5">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-100 pb-2.5">
                Agronomic Recommendations
              </h3>

              <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-gray-900 mb-0.5">
                  <Droplets className="h-3.5 w-3.5 text-blue-600" />
                  <span>Precision Irrigation Requirement:</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{result.irrigationRequirement}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-emerald-500 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-gray-900 mb-0.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Prescribed Fertilizer & Nutrients (NPK):</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{result.fertilizerRecommendation}</p>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                <strong className="text-gray-900">Summary: </strong>{result.overallSummary}
              </p>
            </div>

            {/* Zone Specific Matrix */}
            <div className="grid-card space-y-3">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-100 pb-2.5">
                Zone-Specific Action Matrix ({result.zoneSpecificRecommendations.length} Zones)
              </h3>

              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {result.zoneSpecificRecommendations.map((rec) => (
                  <div key={rec.zoneId} className="p-2.5 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-gray-900">{rec.zoneName} ({rec.zoneId})</span>
                      <span className="badge health-80">
                        {rec.waterTarget}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{rec.prescription}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid-card border-dashed border-gray-300 p-10 text-center">
          <Sparkles className="h-7 w-7 text-emerald-600 mx-auto mb-2" />
          <h3 className="font-bold text-gray-900 text-sm">Ready to Run Diagnostic Scan</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-4">
            Click the "Run AI Analysis" button above to evaluate live satellite imagery, IoT sensors, and weather forecasts for {farm.name}.
          </p>
          <button
            type="button"
            onClick={handleRunAnalysis}
            className="rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 text-xs shadow-2xs transition-colors"
          >
            Launch AI Analysis Now
          </button>
        </div>
      )}
    </div>
  );
};
