import { Response } from 'express';
import { AuthenticatedRequest } from './authController.js';
import { db } from '../db.js';
import { IFarm, IManagementZone } from '../models.js';

export const getFarms = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    // Return user's farms or all demo farms if in demo session
    let farms = db.farms.filter(f => f.userId === userId);
    if (farms.length === 0) {
      farms = db.farms; // fallback to demo farms so user always sees data
    }
    return res.json({ success: true, farms });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch farms', error: String(err) });
  }
};

export const getFarmById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const farm = db.farms.find(f => f.id === id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }
    return res.json({ success: true, farm });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve farm', error: String(err) });
  }
};

export const createFarm = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || 'usr_demo_101';
    const {
      name,
      cropType,
      cropVariety,
      soilType,
      sowingDate,
      lengthMeters,
      widthMeters,
      latitude,
      longitude,
      boundary
    } = req.body;

    if (!name || !cropType) {
      return res.status(400).json({ success: false, message: 'Farm name and crop type are required' });
    }

    const length = Number(lengthMeters) || 500;
    const width = Number(widthMeters) || 400;
    const areaSqM = length * width;
    const areaHa = Number((areaSqM / 10000).toFixed(2));
    const areaAc = Number((areaSqM * 0.000247105).toFixed(2));

    const lat = Number(latitude) || 36.6777;
    const lng = Number(longitude) || -121.6555;

    // Build boundary: either custom coordinates passed from map drawer or calculated box
    let farmBoundary: [number, number][] = boundary;
    if (!farmBoundary || !Array.isArray(farmBoundary) || farmBoundary.length < 3) {
      // 1 deg lat is approx 111,000m, 1 deg lng is approx 111,000 * cos(lat)
      const latDelta = (width / 111000) / 2;
      const lngDelta = (length / (111000 * Math.cos((lat * Math.PI) / 180))) / 2;

      farmBoundary = [
        [Number((lat + latDelta).toFixed(5)), Number((lng - lngDelta).toFixed(5))],
        [Number((lat + latDelta).toFixed(5)), Number((lng + lngDelta).toFixed(5))],
        [Number((lat - latDelta).toFixed(5)), Number((lng + lngDelta).toFixed(5))],
        [Number((lat - latDelta).toFixed(5)), Number((lng - lngDelta).toFixed(5))]
      ];
    }

    const newFarm: IFarm = {
      id: `farm_${Date.now()}`,
      userId,
      name,
      cropType,
      cropVariety: cropVariety || 'Standard Cultivar',
      soilType: soilType || 'Alluvial Silt Loam',
      sowingDate: sowingDate || new Date().toISOString().split('T')[0],
      lengthMeters: length,
      widthMeters: width,
      areaSquareMeters: areaSqM,
      areaHectares: areaHa,
      areaAcres: areaAc,
      center: { lat, lng },
      boundary: farmBoundary,
      overallHealthScore: 82,
      zonesCount: 3,
      createdAt: new Date().toISOString()
    };

    db.farms.unshift(newFarm);

    // Auto-generate 3 realistic GIS management zones for this farm
    const zone1Boundary: [number, number][] = [
      farmBoundary[0],
      [farmBoundary[0][0], (farmBoundary[0][1] + farmBoundary[1][1]) / 2],
      [(farmBoundary[0][0] + farmBoundary[3][0]) / 2, (farmBoundary[0][1] + farmBoundary[1][1]) / 2],
      farmBoundary[3]
    ];

    const zone2Boundary: [number, number][] = [
      [farmBoundary[0][0], (farmBoundary[0][1] + farmBoundary[1][1]) / 2],
      farmBoundary[1],
      [(farmBoundary[1][0] + farmBoundary[2][0]) / 2, farmBoundary[1][1]],
      [(farmBoundary[0][0] + farmBoundary[3][0]) / 2, (farmBoundary[0][1] + farmBoundary[1][1]) / 2]
    ];

    const zone3Boundary: [number, number][] = [
      [(farmBoundary[0][0] + farmBoundary[3][0]) / 2, (farmBoundary[0][1] + farmBoundary[1][1]) / 2],
      [(farmBoundary[1][0] + farmBoundary[2][0]) / 2, farmBoundary[1][1]],
      farmBoundary[2],
      farmBoundary[3]
    ];

    const zones: IManagementZone[] = [
      {
        id: `zone_${newFarm.id}_1`,
        zoneId: 'Zone 1 - Northern Sector',
        farmId: newFarm.id,
        name: 'Zone 1: Northern Vigor Sector',
        healthStatus: 'HEALTHY',
        healthScore: 91,
        soilMoisture: 42,
        temperature: 22.5,
        diseaseProbability: 5,
        waterRequirement: '0 mm (Optimal)',
        recommendedAction: 'Canopy is robust. Continue uniform monitoring.',
        boundary: zone1Boundary,
        color: '#10b981',
        areaAcres: Number((areaAc * 0.35).toFixed(1)),
        cropType
      },
      {
        id: `zone_${newFarm.id}_2`,
        zoneId: 'Zone 2 - Central Swale',
        farmId: newFarm.id,
        name: 'Zone 2: Central Swale',
        healthStatus: 'MODERATE_STRESS',
        healthScore: 71,
        soilMoisture: 29,
        temperature: 24.8,
        diseaseProbability: 15,
        waterRequirement: '12 mm within 24 hours',
        recommendedAction: 'Moderate moisture depletion. Drip cycle recommended.',
        boundary: zone2Boundary,
        color: '#f59e0b',
        areaAcres: Number((areaAc * 0.35).toFixed(1)),
        cropType
      },
      {
        id: `zone_${newFarm.id}_3`,
        zoneId: 'Zone 3 - Southern Lowland',
        farmId: newFarm.id,
        name: 'Zone 3: Southern Lowland Slope',
        healthStatus: 'SEVERE_STRESS',
        healthScore: 48,
        soilMoisture: 20,
        temperature: 26.9,
        diseaseProbability: 28,
        waterRequirement: '22 mm targeted saturation',
        recommendedAction: 'Severe moisture deficit. Check valve distribution.',
        boundary: zone3Boundary,
        color: '#ef4444',
        areaAcres: Number((areaAc * 0.30).toFixed(1)),
        cropType
      }
    ];

    db.zones[newFarm.id] = zones;

    // Initialize mock IoT sensor readings
    db.sensorReadings[newFarm.id] = {
      farmId: newFarm.id,
      timestamp: new Date().toISOString(),
      status: 'ONLINE',
      soilMoisture: 33.5,
      soilTemperature: 22.1,
      airTemperature: 24.4,
      humidity: 61,
      soilPh: 6.9,
      rainfall: 0.0,
      lightIntensity: 64000,
      batteryLevel: 96
    };

    // Initialize mock weather data based on Salinas/California
    db.weatherData[newFarm.id] = {
      ...db.weatherData['farm_001'],
      farmId: newFarm.id
    };

    // Initialize satellite observations
    db.satelliteObservations[newFarm.id] = [
      {
        farmId: newFarm.id,
        observationDate: '2025-08-04',
        timeframeLabel: '30 Days Ago',
        ndviMean: 0.58,
        vegetationHealthIndex: 62,
        cropStressPercentage: 24,
        waterStressIndex: 45,
        soilIndex: 0.31,
        resolution: '10m Sentinel-2 MSI Multi-Spectral',
        cloudCoverage: 2.1,
        gridHeatmap: db['generateMockNdviGrid'] ? (db as any).generateMockNdviGrid(0.58) : []
      },
      {
        farmId: newFarm.id,
        observationDate: new Date().toISOString().split('T')[0],
        timeframeLabel: 'Today (Latest Pass)',
        ndviMean: 0.77,
        vegetationHealthIndex: 82,
        cropStressPercentage: 12,
        waterStressIndex: 28,
        soilIndex: 0.20,
        resolution: '10m Sentinel-2 MSI Multi-Spectral',
        cloudCoverage: 0.0,
        gridHeatmap: db['generateMockNdviGrid'] ? (db as any).generateMockNdviGrid(0.77) : []
      }
    ];

    return res.status(201).json({
      success: true,
      message: 'Farm registered and mapped into GIS zones successfully',
      farm: newFarm
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create farm', error: String(err) });
  }
};

export const updateFarm = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const farmIndex = db.farms.findIndex(f => f.id === id);
    if (farmIndex === -1) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    db.farms[farmIndex] = { ...db.farms[farmIndex], ...req.body, id };
    return res.json({ success: true, farm: db.farms[farmIndex] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update farm', error: String(err) });
  }
};

export const deleteFarm = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const index = db.farms.findIndex(f => f.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    db.farms.splice(index, 1);
    delete db.zones[id];
    delete db.sensorReadings[id];
    delete db.weatherData[id];

    return res.json({ success: true, message: 'Farm removed successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete farm', error: String(err) });
  }
};
