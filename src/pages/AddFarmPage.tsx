import React, { useState } from 'react';
import { Farm } from '../types';
import { farmsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LeafletGisMap } from '../components/LeafletGisMap';
import {
  MapPin,
  Building,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Pencil
} from 'lucide-react';

interface Props {
  onFarmCreated: (farm: Farm) => void;
  onCancel: () => void;
}

export const AddFarmPage: React.FC<Props> = ({ onFarmCreated, onCancel }) => {
  const { refreshFarms } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    cropType: 'Wheat',
    cropVariety: 'Hard Red Winter',
    soilType: 'Loamy Clay',
    sowingDate: new Date().toISOString().split('T')[0],
    lengthMeters: 450,
    widthMeters: 300,
    latitude: 36.6777,
    longitude: -121.6555,
    location: 'Salinas Valley, CA'
  });

  const [drawnBoundary, setDrawnBoundary] = useState<[number, number][]>([]);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-calculated area
  const areaSquareMeters = formData.lengthMeters * formData.widthMeters;
  const areaHectares = Number((areaSquareMeters / 10000).toFixed(2));
  const areaAcres = Number((areaSquareMeters / 4046.86).toFixed(2));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Please provide a Farm Name');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await farmsApi.create({
        name: formData.name,
        cropType: formData.cropType,
        cropVariety: formData.cropVariety,
        soilType: formData.soilType,
        sowingDate: formData.sowingDate,
        lengthMeters: formData.lengthMeters,
        widthMeters: formData.widthMeters,
        latitude: formData.latitude,
        longitude: formData.longitude,
        location: formData.location,
        boundary: drawnBoundary.length >= 3 ? drawnBoundary : undefined
      });

      await refreshFarms();
      onFarmCreated(res.farm);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to register farm.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Add New Farm & Geotag Boundary</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Define farm dimensions, crop cultivar, and draw boundaries on the satellite map
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="self-start sm:self-auto rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 shadow-2xs transition-colors"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Input Form Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="grid-card space-y-3.5">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">
              1. Farm Identification
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Farm Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Oak Ridge Corn Field #3"
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Crop Type</label>
                <select
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs bg-white focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="Wheat">Wheat</option>
                  <option value="Corn">Corn</option>
                  <option value="Soybeans">Soybeans</option>
                  <option value="Rice">Rice</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Potatoes">Potatoes</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Crop Variety</label>
                <input
                  type="text"
                  value={formData.cropVariety}
                  onChange={(e) => setFormData({ ...formData, cropVariety: e.target.value })}
                  placeholder="e.g. Pioneer 1197"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Soil Type</label>
                <select
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs bg-white focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="Loamy Clay">Loamy Clay</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Silt Loam">Silt Loam</option>
                  <option value="Black Cotton Soil">Black Cotton Soil</option>
                  <option value="Alluvial">Alluvial</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Sowing Date</label>
                <input
                  type="date"
                  value={formData.sowingDate}
                  onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Size & Dimensions */}
          <div className="grid-card space-y-3.5">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">
              2. Dimensions & Calculated Area
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Length (Meters)</label>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  value={formData.lengthMeters}
                  onChange={(e) => setFormData({ ...formData, lengthMeters: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Width (Meters)</label>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  value={formData.widthMeters}
                  onChange={(e) => setFormData({ ...formData, widthMeters: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Calculated Area Highlight Card */}
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs">
              <span className="text-emerald-800 font-bold uppercase tracking-wider text-[10px] block">
                Auto-Calculated Farm Area:
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-bold text-emerald-900">{areaSquareMeters.toLocaleString()} m²</span>
                <span className="text-emerald-700 font-medium">({areaAcres} Acres / {areaHectares} Ha)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Region / Location Label</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 text-xs shadow-2xs transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Registering Farm Digital Twin...' : 'Save & Partition Farm Zones'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Right: Map for Boundary Selection */}
        <div className="lg:col-span-7 space-y-3">
          <div className="grid-card">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider">3. Boundary Mapping & Satellite Alignment</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isDrawMode
                    ? 'Click vertices directly on the map to trace your field perimeters.'
                    : 'A standard rectangular boundary is auto-projected based on dimensions, or click Draw to customize.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawMode(!isDrawMode)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isDrawMode ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>{isDrawMode ? 'Exit Drawing' : 'Draw Boundary'}</span>
              </button>
            </div>

            <LeafletGisMap
              farm={{
                id: 'preview',
                name: formData.name || 'New Farm Preview',
                location: formData.location,
                areaHectares,
                areaAcres,
                cropType: formData.cropType,
                cropVariety: formData.cropVariety,
                soilType: formData.soilType,
                sowingDate: formData.sowingDate,
                overallHealthScore: 85,
                center: { lat: formData.latitude, lng: formData.longitude },
                boundary: drawnBoundary.length >= 3 ? drawnBoundary : [
                  [formData.latitude - 0.002, formData.longitude - 0.003],
                  [formData.latitude - 0.002, formData.longitude + 0.003],
                  [formData.latitude + 0.002, formData.longitude + 0.003],
                  [formData.latitude + 0.002, formData.longitude - 0.003]
                ],
                managementZones: []
              }}
              zones={[]}
              isDrawMode={isDrawMode}
              onBoundaryDrawn={(coords) => setDrawnBoundary(coords)}
            />

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              <span>Points defined: <b>{drawnBoundary.length > 0 ? drawnBoundary.length : '4 (Auto-projected)'}</b></span>
              <span className="text-emerald-700 font-medium">Automatic GIS sub-zone creation on submit</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
