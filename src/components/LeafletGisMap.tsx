import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Farm, ManagementZone } from '../types';
import { Layers, MapPin, ZoomIn, ZoomOut, Compass, Info, CheckCircle2, AlertTriangle, AlertCircle, Maximize2 } from 'lucide-react';

interface Props {
  farm: Farm | null;
  zones: ManagementZone[];
  onSelectZone?: (zone: ManagementZone) => void;
  isDrawMode?: boolean;
  onBoundaryDrawn?: (coords: [number, number][]) => void;
}

export const LeafletGisMap: React.FC<Props> = ({
  farm,
  zones,
  onSelectZone,
  isDrawMode = false,
  onBoundaryDrawn
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const zonesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const boundaryLayerRef = useRef<L.Polygon | null>(null);
  const drawnMarkersRef = useRef<L.Marker[]>([]);
  const drawnPolygonRef = useRef<L.Polygon | null>(null);

  const [selectedZone, setSelectedZone] = useState<ManagementZone | null>(null);
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('satellite');
  const [drawnPoints, setDrawnPoints] = useState<[number, number][]>([]);

  // Base tile layers
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default to Salinas, CA coordinates
      const centerLat = farm?.center.lat || 36.6777;
      const centerLng = farm?.center.lng || -121.6555;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 15,
        zoomControl: false
      });

      // Satellite Imagery tile layer (ESRI World Imagery)
      const satelliteTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
      });

      // Street map layer (OpenStreetMap)
      const streetTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      });

      if (mapType === 'satellite') {
        satelliteTiles.addTo(map);
        tileLayerRef.current = satelliteTiles;
      } else {
        streetTiles.addTo(map);
        tileLayerRef.current = streetTiles;
      }

      const zonesGroup = L.layerGroup().addTo(map);
      zonesLayerGroupRef.current = zonesGroup;

      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Map Type change (Street vs Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (mapType === 'satellite') {
      const satelliteTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri World Imagery'
      }).addTo(map);
      tileLayerRef.current = satelliteTiles;
    } else {
      const streetTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      tileLayerRef.current = streetTiles;
    }
  }, [mapType]);

  // Render Farm Boundary and Management Zones
  useEffect(() => {
    const map = mapInstanceRef.current;
    const zonesGroup = zonesLayerGroupRef.current;
    if (!map || !zonesGroup || !farm) return;

    zonesGroup.clearLayers();

    if (boundaryLayerRef.current) {
      map.removeLayer(boundaryLayerRef.current);
      boundaryLayerRef.current = null;
    }

    // 1. Draw outer farm boundary polygon
    if (farm.boundary && farm.boundary.length >= 3) {
      const boundaryPoly = L.polygon(farm.boundary, {
        color: '#ffffff',
        weight: 3,
        dashArray: '6, 6',
        fill: false,
        opacity: 0.9
      }).addTo(map);

      boundaryLayerRef.current = boundaryPoly;
      map.fitBounds(boundaryPoly.getBounds(), { padding: [40, 40] });
    }

    // 2. Draw Color-coded Management Zones
    zones.forEach((zone) => {
      if (!zone.boundary || zone.boundary.length < 3) return;

      const fillColor =
        zone.healthStatus === 'HEALTHY'
          ? '#10b981' // Green
          : zone.healthStatus === 'MODERATE_STRESS'
          ? '#f59e0b' // Yellow / Amber
          : '#ef4444'; // Red

      const zonePolygon = L.polygon(zone.boundary, {
        color: fillColor,
        fillColor: fillColor,
        fillOpacity: 0.45,
        weight: 2
      });

      // Hover feedback
      zonePolygon.on('mouseover', (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.7,
          weight: 3
        });
      });

      zonePolygon.on('mouseout', (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.45,
          weight: 2
        });
      });

      // Click zone handler
      zonePolygon.on('click', () => {
        setSelectedZone(zone);
        if (onSelectZone) onSelectZone(zone);
      });

      // Rich popup tooltip
      zonePolygon.bindPopup(`
        <div class="p-3 font-sans min-w-[220px]">
          <div class="flex items-center justify-between border-b pb-1.5 mb-2 border-slate-100">
            <span class="font-bold text-slate-900 text-sm">${zone.zoneId}</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded ${
              zone.healthStatus === 'HEALTHY' ? 'bg-emerald-100 text-emerald-800' :
              zone.healthStatus === 'MODERATE_STRESS' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
            }">
              Score: ${zone.healthScore}/100
            </span>
          </div>
          <div class="space-y-1 text-xs text-slate-600">
            <div class="flex justify-between"><span>Soil Moisture:</span> <b class="text-slate-800">${zone.soilMoisture}%</b></div>
            <div class="flex justify-between"><span>Canopy Temp:</span> <b class="text-slate-800">${zone.temperature}°C</b></div>
            <div class="flex justify-between"><span>Disease Risk:</span> <b class="text-slate-800">${zone.diseaseProbability}%</b></div>
            <div class="flex justify-between"><span>Water Need:</span> <b class="text-emerald-700">${zone.waterRequirement}</b></div>
          </div>
          <div class="mt-2.5 pt-2 border-t border-slate-100">
            <p class="text-[11px] text-slate-700 leading-snug"><strong class="text-slate-900">Action:</strong> ${zone.recommendedAction}</p>
          </div>
        </div>
      `);

      zonesGroup.addLayer(zonePolygon);
    });
  }, [farm, zones]);

  // Handle boundary drawing mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!isDrawMode) {
      // Clear any temporary drawing markers
      drawnMarkersRef.current.forEach(m => map.removeLayer(m));
      drawnMarkersRef.current = [];
      if (drawnPolygonRef.current) {
        map.removeLayer(drawnPolygonRef.current);
        drawnPolygonRef.current = null;
      }
      return;
    }

    const handleClick = (e: L.LeafletMouseEvent) => {
      const newPoint: [number, number] = [Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5))];
      setDrawnPoints(prev => {
        const updated = [...prev, newPoint];
        if (onBoundaryDrawn) onBoundaryDrawn(updated);

        // Marker for corner
        const marker = L.circleMarker(newPoint, {
          radius: 6,
          fillColor: '#3b82f6',
          color: '#ffffff',
          weight: 2,
          fillOpacity: 1
        }).addTo(map);
        drawnMarkersRef.current.push(marker);

        // Polygon line
        if (drawnPolygonRef.current) {
          map.removeLayer(drawnPolygonRef.current);
        }
        if (updated.length >= 2) {
          drawnPolygonRef.current = L.polygon(updated, {
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.25,
            dashArray: '4, 4'
          }).addTo(map);
        }

        return updated;
      });
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [isDrawMode]);

  const clearDrawing = () => {
    const map = mapInstanceRef.current;
    if (map) {
      drawnMarkersRef.current.forEach(m => map.removeLayer(m));
      drawnMarkersRef.current = [];
      if (drawnPolygonRef.current) {
        map.removeLayer(drawnPolygonRef.current);
        drawnPolygonRef.current = null;
      }
    }
    setDrawnPoints([]);
    if (onBoundaryDrawn) onBoundaryDrawn([]);
  };

  const handleZoom = (delta: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + delta);
    }
  };

  const handleCenterFarm = () => {
    if (mapInstanceRef.current && farm) {
      mapInstanceRef.current.setView([farm.center.lat, farm.center.lng], 15);
    }
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        {/* Layer Switcher */}
        <div className="flex rounded-xl bg-white/95 p-1 shadow-md border border-slate-200/80 backdrop-blur-xs">
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mapType === 'satellite' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Satellite 10m
          </button>
          <button
            type="button"
            onClick={() => setMapType('streets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              mapType === 'streets' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            Topographic
          </button>
        </div>

        {/* Center Farm Button */}
        <button
          type="button"
          onClick={handleCenterFarm}
          className="flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-md border border-slate-200/80 hover:bg-slate-50 transition-colors backdrop-blur-xs"
        >
          <MapPin className="h-3.5 w-3.5 text-emerald-600" />
          Focus Boundary
        </button>

        {isDrawMode && (
          <div className="flex items-center gap-2 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md">
            <span>Drawing Mode: Click map corners ({drawnPoints.length} points)</span>
            <button
              type="button"
              onClick={clearDrawing}
              className="ml-2 bg-blue-700 hover:bg-blue-800 text-white text-[11px] px-2 py-0.5 rounded"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Right Controls: Zoom Buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => handleZoom(1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-slate-700 shadow-md border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
      </div>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-4 left-4 z-10 rounded-xl bg-white/95 px-4 py-3 shadow-lg border border-slate-200/80 backdrop-blur-xs max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">GIS Management Zones</span>
          <span className="text-[10px] text-emerald-700 font-medium">Click zone to inspect</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            <span className="font-semibold text-slate-800 text-[11px]">Healthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-500 ring-2 ring-amber-200" />
            <span className="font-semibold text-slate-800 text-[11px]">Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500 ring-2 ring-rose-200" />
            <span className="font-semibold text-slate-800 text-[11px]">Severe</span>
          </div>
        </div>
      </div>

      {/* Selected Zone Modal Overlay Card */}
      {selectedZone && (
        <div className="absolute bottom-4 right-4 z-10 w-80 rounded-2xl bg-white p-4 shadow-xl border border-slate-200 ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between border-b border-slate-100 pb-2 mb-2">
            <div>
              <h4 className="font-bold text-slate-900 text-sm leading-tight">{selectedZone.name}</h4>
              <p className="text-[11px] text-slate-500">{selectedZone.cropType} • {selectedZone.areaAcres} Acres</p>
            </div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              selectedZone.healthStatus === 'HEALTHY' ? 'bg-emerald-100 text-emerald-800' :
              selectedZone.healthStatus === 'MODERATE_STRESS' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {selectedZone.healthStatus === 'HEALTHY' ? <CheckCircle2 className="h-3 w-3" /> :
               selectedZone.healthStatus === 'MODERATE_STRESS' ? <AlertTriangle className="h-3 w-3" /> :
               <AlertCircle className="h-3 w-3" />}
              {selectedZone.healthScore}/100
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="text-[10px] text-slate-500">Soil Moisture</span>
              <p className="text-sm font-bold text-slate-900">{selectedZone.soilMoisture}%</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="text-[10px] text-slate-500">Temperature</span>
              <p className="text-sm font-bold text-slate-900">{selectedZone.temperature}°C</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="text-[10px] text-slate-500">Disease Risk</span>
              <p className="text-sm font-bold text-slate-900">{selectedZone.diseaseProbability}%</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
              <span className="text-[10px] text-slate-500">Water Target</span>
              <p className="text-xs font-bold text-emerald-700 truncate">{selectedZone.waterRequirement}</p>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50/70 p-2.5 border border-emerald-100 text-xs text-emerald-950">
            <p className="font-semibold text-[11px] text-emerald-900 mb-0.5">Recommended Zone Action:</p>
            <p className="text-[11px] leading-relaxed">{selectedZone.recommendedAction}</p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedZone(null)}
            className="mt-3 w-full rounded-lg border border-slate-200 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};
