import React, { useState, useEffect } from 'react';
import { Farm, FarmReport } from '../types';
import { reportsApi } from '../services/api';
import { ReportModal } from '../components/ReportModal';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  farm: Farm | null;
}

export const ReportsPage: React.FC<Props> = ({ farm }) => {
  const [report, setReport] = useState<FarmReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchReport = async () => {
    if (!farm) return;
    setLoading(true);
    try {
      const data = await reportsApi.getByFarm(farm.id);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [farm?.id]);

  if (!farm) {
    return <div className="p-8 text-center text-slate-500">Please select an active farm.</div>;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Farm Health & Remote Sensing Audit Reports</h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Certified Diagnostic
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Generate and export comprehensive precision agronomy compliance audits
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            confetti({ particleCount: 50, spread: 60 });
            setShowModal(true);
          }}
          disabled={!report}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3.5 py-2 shadow-2xs transition-colors self-start sm:self-auto"
        >
          <FileText className="h-4 w-4" />
          <span>Open Full Printable Audit</span>
        </button>
      </div>

      {/* Report Summary Card */}
      {report ? (
        <div className="grid-card space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-3.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Report Snapshot</span>
              <h3 className="text-base font-bold text-gray-900 mt-0.5">{farm.name} Health Evaluation</h3>
              <p className="text-xs text-gray-500">
                Document #{report.reportId} • Generated: {new Date(report.generatedAt).toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-right">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Crop Health Grade</span>
              <p className="text-lg font-bold text-emerald-700">{report.healthScore}/100 • {report.healthGrade}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
              <span className="text-gray-500 font-medium text-[11px] block">Farmland & Crop Profile</span>
              <p className="font-bold text-gray-900 mt-1">{report.farm.name}</p>
              <p className="text-gray-600 mt-0.5">{report.farm.crop} ({report.farm.variety})</p>
              <p className="text-gray-500">{report.farm.areaAcres} Acres • {report.farm.soilType}</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
              <span className="text-gray-500 font-medium text-[11px] block">Sentinel-2 Satellite Telemetry</span>
              <p className="font-bold text-emerald-700 mt-1">Mean NDVI: {report.satelliteNdvi.meanNdvi}</p>
              <p className="text-gray-600 mt-0.5">Vigor Index: {report.satelliteNdvi.vegetationHealthIndex}/100</p>
              <p className="text-gray-500">Water Deficit: {report.satelliteNdvi.waterStressIndex}%</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
              <span className="text-gray-500 font-medium text-[11px] block">IoT In-Situ Ground Status</span>
              <p className="font-bold text-gray-900 mt-1">Moisture: {report.sensorsSummary.soilMoisture}</p>
              <p className="text-gray-600 mt-0.5">Root Temp: {report.sensorsSummary.soilTemp}</p>
              <p className="text-gray-500">pH: {report.sensorsSummary.soilPh} • Humidity: {report.sensorsSummary.humidity}</p>
            </div>
          </div>

          {/* Zones Summary */}
          <div>
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2.5">
              Zone Partitioning Health Summary ({report.zonesSummary.length} Zones)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {report.zonesSummary.map((z) => (
                <div key={z.zoneId} className="rounded-lg border border-gray-200 p-2.5 bg-gray-50 text-xs">
                  <div className="flex items-center justify-between font-bold text-gray-900 mb-1">
                    <span>{z.name}</span>
                    <span className={`badge ${
                      z.status === 'HEALTHY' ? 'health-80' :
                      z.status === 'MODERATE_STRESS' ? 'health-50' : 'health-30'
                    }`}>
                      {z.healthScore}% • {z.status}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-snug text-[11px]">{z.recommendedAction}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="rounded-md bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium px-3.5 py-2 transition-colors shadow-2xs"
            >
              Inspect Complete Report &rarr;
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">Compiling report data...</div>
      )}

      {/* Full Modal Viewer */}
      <ReportModal
        report={report}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};
