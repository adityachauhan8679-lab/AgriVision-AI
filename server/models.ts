export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  phone: string;
  location: string;
  farmName: string;
  createdAt: string;
}

export interface ICoordinates {
  lat: number;
  lng: number;
}

export interface IManagementZone {
  id: string;
  zoneId: string; // e.g. "Zone 1 - North Ridge"
  farmId: string;
  name: string;
  healthStatus: 'HEALTHY' | 'MODERATE_STRESS' | 'SEVERE_STRESS';
  healthScore: number; // 0 - 100
  soilMoisture: number; // percentage
  temperature: number; // Celsius
  diseaseProbability: number; // percentage
  waterRequirement: string; // e.g., "0 mm (Optimal)", "18 mm within 24h"
  recommendedAction: string;
  boundary: [number, number][]; // Polygon lat/lng pairs
  color: string; // Hex color: Green (#10b981), Yellow (#f59e0b), Red (#ef4444)
  areaAcres: number;
  cropType: string;
}

export interface IFarm {
  id: string;
  userId: string;
  name: string;
  location?: string;
  cropType: string;
  cropVariety: string;
  soilType: string;
  sowingDate: string;
  lengthMeters: number;
  widthMeters: number;
  areaSquareMeters: number;
  areaHectares: number;
  areaAcres: number;
  center: ICoordinates;
  boundary: [number, number][];
  overallHealthScore: number;
  zonesCount: number;
  managementZones?: IManagementZone[];
  createdAt: string;
}

export interface ISensorReading {
  farmId: string;
  timestamp: string;
  status: 'ONLINE' | 'OFFLINE';
  soilMoisture: number; // %
  soilTemperature: number; // °C
  airTemperature: number; // °C
  humidity: number; // %
  soilPh: number; // 0-14
  rainfall: number; // mm
  lightIntensity: number; // Lux
  batteryLevel: number; // %
}

export interface ISensorHistoryPoint {
  time: string;
  soilMoisture: number;
  soilTemperature: number;
  airTemperature: number;
  humidity: number;
  soilPh: number;
  rainfall: number;
  lightIntensity: number;
}

export interface IWeatherData {
  farmId: string;
  currentTemp: number; // °C
  humidity: number; // %
  rainProbability: number; // %
  windSpeed: number; // km/h
  weatherCondition: string; // 'Sunny', 'Partly Cloudy', 'Scattered Showers', etc.
  uvIndex: number;
  forecast: {
    day: string;
    date: string;
    tempMin: number;
    tempMax: number;
    rainProb: number;
    condition: string;
    icon: string;
  }[];
  agriculturalImpact: string;
}

export interface ISatelliteData {
  farmId: string;
  observationDate: string;
  timeframeLabel: string; // e.g. "Today (Latest Pass)", "7 Days Ago", "15 Days Ago", "30 Days Ago"
  ndviMean: number; // -1 to 1, healthy is 0.6 - 0.9
  vegetationHealthIndex: number; // 0-100
  cropStressPercentage: number;
  waterStressIndex: number; // 0 - 100
  soilIndex: number;
  resolution: string; // e.g., "10m Sentinel-2 MSI"
  cloudCoverage: number; // %
  gridHeatmap: {
    x: number;
    y: number;
    ndvi: number;
    healthClass: 'high' | 'moderate' | 'low';
  }[];
}

export interface IAlert {
  id: string;
  farmId: string;
  zoneId?: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY' | 'INFO';
  timestamp: string;
  read: boolean;
  actionRequired: string;
}

export interface IZoneRecommendation {
  zoneId: string;
  zoneName: string;
  healthScore: number;
  action: string;
  recommendation: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  irrigationVolumeLiters: number;
  fertilizerAdjustment: string;
}

export interface IAiAnalysisResult {
  id: string;
  farmId: string;
  createdAt: string;
  cropHealthScore: number; // 0 - 100
  diseaseRisk: number; // %
  waterStress: 'Optimal' | 'Mild' | 'Moderate' | 'Severe';
  nutrientStress: 'Optimal' | 'Nitrogen Deficiency' | 'Phosphorus Imbalance' | 'Balanced';
  pestRisk: 'Low' | 'Moderate' | 'High';
  irrigationRequirement: string;
  fertilizerRecommendation: string;
  expectedYieldHectare: string;
  overallRecommendation: string;
  confidenceScore: number;
  zonesAnalysis: IZoneRecommendation[];
}

export interface ILeafDiseaseDiagnosis {
  diseaseName: string;
  confidence: number;
  severity: 'None' | 'Mild' | 'Moderate' | 'Severe';
  pathogenType: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest Infestation' | 'Healthy';
  symptoms: string[];
  recommendedAction: string;
  fungicidePesticide: string;
  preventiveMeasures: string[];
  isDemo: boolean;
}
