import React, { useState } from 'react';
import { LeafDiseaseDiagnosis } from '../types';
import { aiApi } from '../services/api';
import {
  ScanLine,
  Upload,
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ShieldCheck,
  FileCheck,
  RefreshCw
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cropType?: string;
}

export const AiLeafDoctorModal: React.FC<Props> = ({ isOpen, onClose, cropType = 'Wheat' }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<LeafDiseaseDiagnosis | null>(null);
  const [selectedSample, setSelectedSample] = useState<string>('leaf_rust');

  if (!isOpen) return null;

  const samplePresets = [
    {
      id: 'leaf_rust',
      label: 'Wheat Leaf Rust',
      color: 'bg-amber-100 text-amber-900 border-amber-300',
      description: 'Yellow-orange pustules along leaf veins'
    },
    {
      id: 'powdery_mildew',
      label: 'Powdery Mildew',
      color: 'bg-slate-100 text-slate-900 border-slate-300',
      description: 'White talcum patches on upper blade'
    },
    {
      id: 'northern_corn_leaf_blight',
      label: 'Corn Leaf Blight',
      color: 'bg-rose-100 text-rose-900 border-rose-300',
      description: 'Cigar-shaped grayish necrotic lesions'
    },
    {
      id: 'healthy',
      label: 'Healthy Green Leaf',
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      description: 'Optimal chlorophyll, zero lesions'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      runDetection({ imageBase64: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sampleId: string) => {
    setSelectedSample(sampleId);
    setImagePreview(null);
    runDetection({ sampleType: sampleId });
  };

  const runDetection = async (payload: { imageBase64?: string; sampleType?: string }) => {
    setIsAnalyzing(true);
    try {
      const result = await aiApi.detectDisease({
        ...payload,
        cropType
      });
      setDiagnosis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <ScanLine className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Leaf Doctor • Computer Vision Diagnostic</h3>
              <p className="text-xs text-slate-500">Autonomous crop leaf pathology & treatment recommendation</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Preset Selector for instant demo testing */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Sample Specimen for Instant Analysis:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {samplePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectSample(preset.id)}
                  className={`rounded-xl border p-2.5 text-left text-xs transition-all ${
                    selectedSample === preset.id && !imagePreview
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/40'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold text-slate-900">{preset.label}</p>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Or Upload Custom Image */}
          <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center hover:bg-slate-50/60 transition-colors">
            <input
              type="file"
              accept="image/*"
              id="leaf-upload-input"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label htmlFor="leaf-upload-input" className="cursor-pointer flex flex-col items-center">
              <Upload className="h-6 w-6 text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-emerald-700 hover:underline">
                {imagePreview ? 'Change uploaded image' : 'Or upload crop/leaf photo from device'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or WEBP up to 10MB</span>
            </label>
          </div>

          {/* Image Preview if user uploaded */}
          {imagePreview && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <img src={imagePreview} alt="Uploaded Leaf" className="h-16 w-16 object-cover rounded-lg" />
              <div>
                <span className="text-xs font-semibold text-slate-800">Uploaded User Specimen</span>
                <p className="text-[11px] text-slate-500">Processed by Computer Vision Feature Extraction</p>
              </div>
            </div>
          )}

          {/* Analysis Results Display */}
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
              <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-800">Neural Network Segmenting Leaf Lesions...</p>
              <p className="text-xs text-slate-500">Evaluating chlorosis boundaries & pathogen signatures</p>
            </div>
          ) : diagnosis ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Diagnosis Report</span>
                  <h4 className="text-lg font-extrabold text-slate-900">{diagnosis.diseaseName}</h4>
                  <p className="text-xs text-slate-600">Pathogen Class: <b className="text-slate-800">{diagnosis.pathogenType}</b></p>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    Confidence: {diagnosis.confidence}%
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Severity: <b>{diagnosis.severity}</b></p>
                </div>
              </div>

              {/* Symptoms Identified */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-1.5">Observed Symptomology:</span>
                <ul className="space-y-1">
                  {diagnosis.symptoms.map((symptom, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prescribed Treatment */}
              <div className="rounded-xl border border-emerald-200 bg-white p-3.5 shadow-xs">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-900 mb-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Prescribed Agronomic Action:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed mb-2">{diagnosis.recommendedAction}</p>

                <div className="rounded-lg bg-emerald-50 p-2 text-xs text-emerald-950 font-medium">
                  <span className="font-bold text-emerald-900">Recommended Chemical/Organic Formula: </span>
                  {diagnosis.fungicidePesticide}
                </div>
              </div>

              {/* Preventative measures */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-1">Preventative Field Strategies:</span>
                <div className="flex flex-wrap gap-1.5">
                  {diagnosis.preventiveMeasures.map((measure, i) => (
                    <span key={i} className="rounded-lg bg-slate-200/70 px-2 py-1 text-[11px] text-slate-700">
                      {measure}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-500">
              Click a sample above or upload a photo to start diagnosis.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
