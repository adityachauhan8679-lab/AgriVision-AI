export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  farmName: string;
  createdAt: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ManagementZone {
  id: string;
  zoneId: string;
  farmId: string;
  name: string;
  healthStatus: 'HEALTHY' | 'MODERATE_STRESS' | 'SEVERE_STRESS';
  healthScore: number;
  soilMoisture: number;
  temperature: number;
  diseaseProbability: number;
  waterRequirement: string;
  recommendedAction: string;
  boundary: [number, number][];
  color: string;
  areaAcres: number;
  cropType: string;
}

export interface Farm {
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
  center: Coordinates;
  boundary: [number, number][];
  overallHealthScore: number;
  zonesCount: number;
  managementZones?: ManagementZone[];
  createdAt: string;
}

export interface SensorReading {
  farmId: string;
  timestamp: string;
  status: 'ONLINE' | 'OFFLINE';
  soilMoisture: number;
  soilTemperature: number;
  airTemperature: number;
  humidity: number;
  soilPh: number;
  rainfall: number;
  lightIntensity: number;
  batteryLevel: number;
}

export interface SensorHistoryPoint {
  time: string;
  soilMoisture: number;
  soilTemperature: number;
  airTemperature: number;
  humidity: number;
  soilPh: number;
  rainfall: number;
  lightIntensity: number;
}

export interface WeatherData {
  farmId: string;
  currentTemp: number;
  humidity: number;
  rainProbability: number;
  windSpeed: number;
  weatherCondition: string;
  uvIndex: number;
  agriculturalImpact: string;
  forecast: {
    day: string;
    date: string;
    tempMin: number;
    tempMax: number;
    rainProb: number;
    condition: string;
    icon: string;
  }[];
}

export interface SatelliteObservation {
  farmId: string;
  observationDate: string;
  timeframeLabel: string;
  ndviMean: number;
  vegetationHealthIndex: number;
  cropStressPercentage: number;
  waterStressIndex: number;
  soilIndex: number;
  resolution: string;
  cloudCoverage: number;
  gridHeatmap: {
    x: number;
    y: number;
    ndvi: number;
    healthClass: 'high' | 'moderate' | 'low';
  }[];
}

export interface Alert {
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

export interface ZoneRecommendation {
  zoneId: string;
  zoneName: string;
  healthScore: number;
  action: string;
  recommendation: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  irrigationVolumeLiters: number;
  fertilizerAdjustment: string;
}

export interface AiAnalysisResult {
  id: string;
  farmId: string;
  createdAt: string;
  cropHealthScore: number;
  diseaseRisk: number;
  waterStress: 'Optimal' | 'Mild' | 'Moderate' | 'Severe';
  nutrientStress: 'Optimal' | 'Nitrogen Deficiency' | 'Phosphorus Imbalance' | 'Balanced';
  pestRisk: 'Low' | 'Moderate' | 'High';
  irrigationRequirement: string;
  fertilizerRecommendation: string;
  expectedYieldHectare: string;
  overallRecommendation: string;
  confidenceScore: number;
  zonesAnalysis: ZoneRecommendation[];
}

export interface LeafDiseaseDiagnosis {
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

export interface FarmReport {
  reportId: string;
  generatedAt: string;
  platform: string;
  certifiedBy: string;
  farm: {
    id: string;
    name: string;
    crop: string;
    variety: string;
    soilType: string;
    sowingDate: string;
    areaHectares: number;
    areaAcres: number;
    lengthMeters: number;
    widthMeters: number;
    center: Coordinates;
  };
  healthScore: number;
  healthGrade: string;
  zonesSummary: {
    zoneId: string;
    name: string;
    healthScore: number;
    status: string;
    soilMoisture: number;
    temperature: number;
    diseaseRisk: number;
    waterRequirement: string;
    recommendedAction: string;
    areaAcres: number;
  }[];
  sensorsSummary: {
    soilMoisture: string;
    soilTemp: string;
    airTemp: string;
    humidity: string;
    soilPh: number;
    lightIntensity: string;
    status: string;
  };
  satelliteNdvi: {
    timeframe: string;
    meanNdvi: number;
    vegetationHealthIndex: number;
    waterStressIndex: number;
    resolution: string;
  };
  weatherSummary: {
    currentTemp: string;
    condition: string;
    humidity: string;
    rainProbability: string;
    windSpeed: string;
    agriculturalImpact: string;
  };
  aiRecommendations: {
    expectedYield: string;
    waterStress: string;
    pestRisk: string;
    irrigationRequirement: string;
    fertilizerRecommendation: string;
    overallRecommendation: string;
  };
  activeAlertsCount: number;
  alertsSummary: Alert[];
}
