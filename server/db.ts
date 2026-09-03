import bcrypt from 'bcryptjs';
import {
  IUser,
  IFarm,
  IManagementZone,
  ISensorReading,
  ISensorHistoryPoint,
  IWeatherData,
  ISatelliteData,
  IAlert,
  IAiAnalysisResult
} from './models.js';

// Default mock password hash for demo: 'agrivision2025'
const DEMO_PASSWORD_HASH = bcrypt.hashSync('agrivision2025', 8);

export class DatabaseStore {
  public users: IUser[] = [];
  public farms: IFarm[] = [];
  public zones: Record<string, IManagementZone[]> = {};
  public sensorReadings: Record<string, ISensorReading> = {};
  public sensorHistories: Record<string, ISensorHistoryPoint[]> = {};
  public weatherData: Record<string, IWeatherData> = {};
  public satelliteObservations: Record<string, ISatelliteData[]> = {};
  public alerts: IAlert[] = [];
  public analyses: Record<string, IAiAnalysisResult[]> = {};

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Seed Demo User
    const demoUser: IUser = {
      id: 'usr_demo_101',
      name: 'Dr. Johnathan Vance',
      email: 'farmer@agrivision.ai',
      passwordHash: DEMO_PASSWORD_HASH,
      phone: '+1 (555) 234-8901',
      location: 'Salinas Valley, California, USA',
      farmName: 'Green Horizon Precision Agri-Ranch',
      createdAt: new Date().toISOString()
    };
    this.users.push(demoUser);

    // 2. Seed Primary Farm: Salinas Valley Wheat & Alfalfa
    const farm1: IFarm = {
      id: 'farm_001',
      userId: demoUser.id,
      name: 'Green Horizon Wheat Fields',
      cropType: 'Winter Wheat',
      cropVariety: 'Hard Red Winter (TAM 114)',
      soilType: 'Clay Loam (Rich Organic)',
      sowingDate: '2024-10-15',
      lengthMeters: 800,
      widthMeters: 500,
      areaSquareMeters: 400000,
      areaHectares: 40.0,
      areaAcres: 98.84,
      center: { lat: 36.6777, lng: -121.6555 },
      boundary: [
        [36.6815, -121.6595],
        [36.6815, -121.6515],
        [36.6740, -121.6515],
        [36.6740, -121.6595]
      ],
      overallHealthScore: 78,
      zonesCount: 4,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
    };

    // Second Farm: Corn & Soybean Valley
    const farm2: IFarm = {
      id: 'farm_002',
      userId: demoUser.id,
      name: 'Sunrise Organic Corn Valley',
      cropType: 'Organic Sweet Corn',
      cropVariety: 'Golden Bantam Heirloom',
      soilType: 'Silt Loam',
      sowingDate: '2025-03-01',
      lengthMeters: 600,
      widthMeters: 450,
      areaSquareMeters: 270000,
      areaHectares: 27.0,
      areaAcres: 66.72,
      center: { lat: 36.6920, lng: -121.6350 },
      boundary: [
        [36.6955, -121.6390],
        [36.6955, -121.6310],
        [36.6885, -121.6310],
        [36.6885, -121.6390]
      ],
      overallHealthScore: 88,
      zonesCount: 3,
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
    };

    this.farms.push(farm1, farm2);

    // 3. Seed Management Zones for Farm 1
    this.zones[farm1.id] = [
      {
        id: 'zone_f1_01',
        zoneId: 'Zone 1 - North Plateau',
        farmId: farm1.id,
        name: 'Zone 1: North Plateau (Upper Canal)',
        healthStatus: 'HEALTHY',
        healthScore: 92,
        soilMoisture: 42,
        temperature: 22.4,
        diseaseProbability: 4,
        waterRequirement: '0 mm (Optimal saturation)',
        recommendedAction: 'Maintain current drip cycle. Canopy vigor is prime; omit additional nitrogen this week.',
        boundary: [
          [36.6815, -121.6595],
          [36.6815, -121.6555],
          [36.6780, -121.6555],
          [36.6780, -121.6595]
        ],
        color: '#10b981', // Green
        areaAcres: 24.7,
        cropType: 'Winter Wheat'
      },
      {
        id: 'zone_f1_02',
        zoneId: 'Zone 2 - Central Basin',
        farmId: farm1.id,
        name: 'Zone 2: Central Basin',
        healthStatus: 'MODERATE_STRESS',
        healthScore: 68,
        soilMoisture: 28,
        temperature: 25.1,
        diseaseProbability: 18,
        waterRequirement: '14 mm within 18 hours',
        recommendedAction: 'Moderate water deficit detected in sub-canopy layer. Schedule pulsed irrigation during evening cooler hours.',
        boundary: [
          [36.6815, -121.6555],
          [36.6815, -121.6515],
          [36.6780, -121.6515],
          [36.6780, -121.6555]
        ],
        color: '#f59e0b', // Yellow
        areaAcres: 24.7,
        cropType: 'Winter Wheat'
      },
      {
        id: 'zone_f1_03',
        zoneId: 'Zone 3 - South Hill slope',
        farmId: farm1.id,
        name: 'Zone 3: South Hill slope (Rocky Outcrop)',
        healthStatus: 'SEVERE_STRESS',
        healthScore: 41,
        soilMoisture: 18,
        temperature: 27.8,
        diseaseProbability: 34,
        waterRequirement: '25 mm immediate deep saturation',
        recommendedAction: 'Critical moisture deficiency and early leaf roll symptom. Inspect soil compaction and drip valve flow sensor immediately.',
        boundary: [
          [36.6780, -121.6595],
          [36.6780, -121.6555],
          [36.6740, -121.6555],
          [36.6740, -121.6595]
        ],
        color: '#ef4444', // Red
        areaAcres: 24.7,
        cropType: 'Winter Wheat'
      },
      {
        id: 'zone_f1_04',
        zoneId: 'Zone 4 - East Boundary',
        farmId: farm1.id,
        name: 'Zone 4: East Boundary Buffer',
        healthStatus: 'HEALTHY',
        healthScore: 86,
        soilMoisture: 38,
        temperature: 23.0,
        diseaseProbability: 8,
        waterRequirement: '5 mm maintenance weekly',
        recommendedAction: 'Vegetation NDVI is stable at 0.74. No interventions needed. Routine scout inspection scheduled.',
        boundary: [
          [36.6780, -121.6555],
          [36.6780, -121.6515],
          [36.6740, -121.6515],
          [36.6740, -121.6555]
        ],
        color: '#10b981', // Green
        areaAcres: 24.7,
        cropType: 'Winter Wheat'
      }
    ];

    // Seed Management Zones for Farm 2
    this.zones[farm2.id] = [
      {
        id: 'zone_f2_01',
        zoneId: 'Zone 1 - Corn West',
        farmId: farm2.id,
        name: 'Zone 1: Sweet Corn West Block',
        healthStatus: 'HEALTHY',
        healthScore: 94,
        soilMoisture: 45,
        temperature: 21.8,
        diseaseProbability: 3,
        waterRequirement: '0 mm (Optimal)',
        recommendedAction: 'Excellent vegetative expansion. Tassel formation on schedule.',
        boundary: [
          [36.6955, -121.6390],
          [36.6955, -121.6350],
          [36.6885, -121.6350],
          [36.6885, -121.6390]
        ],
        color: '#10b981',
        areaAcres: 33.36,
        cropType: 'Organic Sweet Corn'
      },
      {
        id: 'zone_f2_02',
        zoneId: 'Zone 2 - Corn East',
        farmId: farm2.id,
        name: 'Zone 2: Sweet Corn East Block',
        healthStatus: 'MODERATE_STRESS',
        healthScore: 74,
        soilMoisture: 31,
        temperature: 24.2,
        diseaseProbability: 14,
        waterRequirement: '12 mm supplemental irrigation',
        recommendedAction: 'Minor nitrogen leaching after recent rain. Consider organic foliar feed.',
        boundary: [
          [36.6955, -121.6350],
          [36.6955, -121.6310],
          [36.6885, -121.6310],
          [36.6885, -121.6350]
        ],
        color: '#f59e0b',
        areaAcres: 33.36,
        cropType: 'Organic Sweet Corn'
      }
    ];

    // 4. Seed IoT Sensor Data
    this.sensorReadings[farm1.id] = {
      farmId: farm1.id,
      timestamp: new Date().toISOString(),
      status: 'ONLINE',
      soilMoisture: 31.4, // %
      soilTemperature: 21.8, // °C
      airTemperature: 24.6, // °C
      humidity: 58, // %
      soilPh: 6.8, // Slightly acidic to neutral
      rainfall: 0.0, // mm
      lightIntensity: 68500, // Lux
      batteryLevel: 94 // %
    };

    this.sensorReadings[farm2.id] = {
      farmId: farm2.id,
      timestamp: new Date().toISOString(),
      status: 'ONLINE',
      soilMoisture: 38.2,
      soilTemperature: 20.4,
      airTemperature: 23.2,
      humidity: 64,
      soilPh: 7.1,
      rainfall: 2.4,
      lightIntensity: 54200,
      batteryLevel: 89
    };

    // 5. Seed IoT Sensor 24-hour History for graphs
    const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', 'Now'];
    this.sensorHistories[farm1.id] = hours.map((hour, idx) => ({
      time: hour,
      soilMoisture: Math.round(36 - idx * 0.8 + (Math.random() * 2 - 1)),
      soilTemperature: Number((18 + idx * 0.7).toFixed(1)),
      airTemperature: Number((16 + idx * 1.2 - (idx > 5 ? (idx - 5) * 1.5 : 0)).toFixed(1)),
      humidity: Math.round(75 - idx * 2.5 + (idx > 6 ? 10 : 0)),
      soilPh: 6.8,
      rainfall: idx === 1 ? 1.2 : 0,
      lightIntensity: idx < 2 || idx > 6 ? 1200 : Math.round(45000 + idx * 4000)
    }));

    // 6. Seed Weather Intelligence
    this.weatherData[farm1.id] = {
      farmId: farm1.id,
      currentTemp: 24.6,
      humidity: 58,
      rainProbability: 15,
      windSpeed: 12.4,
      weatherCondition: 'Mostly Clear / Mild Breeze',
      uvIndex: 7,
      agriculturalImpact: 'Evapotranspiration rate is currently high (4.2 mm/day). Soil moisture will deplete faster in Zone 3.',
      forecast: [
        { day: 'Today', date: 'Sep 03', tempMin: 14, tempMax: 26, rainProb: 15, condition: 'Sunny', icon: 'Sun' },
        { day: 'Tomorrow', date: 'Sep 04', tempMin: 15, tempMax: 27, rainProb: 20, condition: 'Partly Cloudy', icon: 'CloudSun' },
        { day: 'Friday', date: 'Sep 05', tempMin: 13, tempMax: 23, rainProb: 65, condition: 'Scattered Rain', icon: 'CloudRain' },
        { day: 'Saturday', date: 'Sep 06', tempMin: 12, tempMax: 22, rainProb: 40, condition: 'Light Showers', icon: 'CloudDrizzle' },
        { day: 'Sunday', date: 'Sep 07', tempMin: 14, tempMax: 25, rainProb: 10, condition: 'Clear', icon: 'Sun' }
      ]
    };

    this.weatherData[farm2.id] = {
      farmId: farm2.id,
      currentTemp: 23.2,
      humidity: 64,
      rainProbability: 25,
      windSpeed: 9.8,
      weatherCondition: 'Passing Clouds',
      uvIndex: 6,
      agriculturalImpact: 'Optimal photosynthesis window. Rainfall probability rises to 65% in 48 hours; withhold heavy irrigation.',
      forecast: this.weatherData[farm1.id].forecast
    };

    // 7. Seed Satellite & NDVI Multi-temporal Observations (30d, 15d, 7d, Today)
    this.satelliteObservations[farm1.id] = [
      {
        farmId: farm1.id,
        observationDate: '2025-08-04',
        timeframeLabel: '30 Days Ago',
        ndviMean: 0.61,
        vegetationHealthIndex: 65,
        cropStressPercentage: 22,
        waterStressIndex: 48,
        soilIndex: 0.28,
        resolution: '10m Sentinel-2 MSI Multi-Spectral',
        cloudCoverage: 4.2,
        gridHeatmap: this.generateMockNdviGrid(0.61)
      },
      {
        farmId: farm1.id,
        observationDate: '2025-08-19',
        timeframeLabel: '15 Days Ago',
        ndviMean: 0.72,
        vegetationHealthIndex: 76,
        cropStressPercentage: 16,
        waterStressIndex: 38,
        soilIndex: 0.22,
        resolution: '10m Sentinel-2 MSI Multi-Spectral',
        cloudCoverage: 1.1,
        gridHeatmap: this.generateMockNdviGrid(0.72)
      },
      {
        farmId: farm1.id,
        observationDate: '2025-08-27',
        timeframeLabel: '7 Days Ago',
        ndviMean: 0.78,
        vegetationHealthIndex: 82,
        cropStressPercentage: 11,
        waterStressIndex: 29,
        soilIndex: 0.19,
        resolution: '10m Sentinel-2 MSI Multi-Spectral',
        cloudCoverage: 0.8,
        gridHeatmap: this.generateMockNdviGrid(0.78)
      },
      {
        farmId: farm1.id,
        observationDate: '2025-09-02',
        timeframeLabel: 'Today (Latest Pass)',
        ndviMean: 0.76,
        vegetationHealthIndex: 80,
        cropStressPercentage: 14,
        waterStressIndex: 32,
        soilIndex: 0.21,
        resolution: '10m Sentinel-2 MSI Multi-Spectral',
        cloudCoverage: 0.0,
        gridHeatmap: this.generateMockNdviGrid(0.76)
      }
    ];

    // 8. Seed Smart Alerts
    this.alerts = [
      {
        id: 'alt_001',
        farmId: farm1.id,
        zoneId: 'Zone 3 - South Hill slope',
        title: 'Critical Water Stress in Zone 3',
        message: 'Zone 3 soil moisture has fallen to 18%, crossing the critical vegetative wilting threshold (30%). Plant stress is accelerating.',
        severity: 'CRITICAL',
        timestamp: new Date(Date.now() - 42 * 60000).toISOString(),
        read: false,
        actionRequired: 'Initiate targeted pulsed irrigation (25 mm) immediately on Zone 3 manifold.'
      },
      {
        id: 'alt_002',
        farmId: farm1.id,
        zoneId: 'Zone 2 - Central Basin',
        title: 'Soil Moisture Below Optimal Target',
        message: 'Sub-surface sensor reading is 28% (recommended range: 35% - 48%). Evapotranspiration is climbing due to dry wind.',
        severity: 'WARNING',
        timestamp: new Date(Date.now() - 140 * 60000).toISOString(),
        read: false,
        actionRequired: 'Schedule 14 mm supplemental drip run this evening.'
      },
      {
        id: 'alt_003',
        farmId: farm1.id,
        zoneId: 'Zone 1 - North Plateau',
        title: 'High Afternoon Humidity Alert',
        message: 'Canopy humidity exceeded 72% at 24°C in dense canopy areas. Favorable spore incubation environment for stripe rust.',
        severity: 'ADVISORY',
        timestamp: new Date(Date.now() - 360 * 60000).toISOString(),
        read: false,
        actionRequired: 'Perform field scouting in North Plateau canopy for early rust lesions.'
      },
      {
        id: 'alt_004',
        farmId: farm1.id,
        title: 'Upcoming Rain Forecast Influence',
        message: 'Regional weather models predict 15–20mm rainfall on Friday (65% confidence). You can reduce planned field-wide irrigation by 40%.',
        severity: 'INFO',
        timestamp: new Date(Date.now() - 720 * 60000).toISOString(),
        read: true,
        actionRequired: 'Adjust automated irrigation controllers to conserve 140,000 liters of water.'
      }
    ];

    // 9. Seed Initial AI Analysis for Farm 1
    this.analyses[farm1.id] = [
      {
        id: 'anl_001',
        farmId: farm1.id,
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        cropHealthScore: 82,
        diseaseRisk: 14,
        waterStress: 'Moderate',
        nutrientStress: 'Balanced',
        pestRisk: 'Low',
        irrigationRequirement: '22,500 Liters (Zone-focused)',
        fertilizerRecommendation: 'No nitrogen top-dress needed in Zone 1. Spot-apply potassium phosphite in Zone 2.',
        expectedYieldHectare: '6.8 Tonnes / Ha (Above regional avg by 12%)',
        overallRecommendation: 'Targeted irrigation needed in Zone 3 immediately. Avoid uniform farm-wide chemical application: Zone 1 and Zone 4 are in peak health and need zero pesticides.',
        confidenceScore: 94,
        zonesAnalysis: [
          {
            zoneId: 'Zone 1 - North Plateau',
            zoneName: 'Zone 1: North Plateau',
            healthScore: 92,
            action: 'Optimal - No irrigation required',
            recommendation: 'Canopy vigor index (NDVI: 0.84) is exemplary. Continue weekly sensor monitoring.',
            urgency: 'LOW',
            irrigationVolumeLiters: 0,
            fertilizerAdjustment: 'Zero addition needed'
          },
          {
            zoneId: 'Zone 2 - Central Basin',
            zoneName: 'Zone 2: Central Basin',
            healthScore: 68,
            action: 'Moderate irrigation required',
            recommendation: 'Moisture at 28%. Deliver 14mm supplemental water via drip line within 18 hours.',
            urgency: 'MEDIUM',
            irrigationVolumeLiters: 8500,
            fertilizerAdjustment: 'Maintain current fertigation recipe'
          },
          {
            zoneId: 'Zone 3 - South Hill slope',
            zoneName: 'Zone 3: South Hill slope',
            healthScore: 41,
            action: 'Severe Water Deficit - Action required',
            recommendation: 'Soil moisture is 18%. Inspect sub-surface line pressure and apply 25mm deep watering.',
            urgency: 'HIGH',
            irrigationVolumeLiters: 14000,
            fertilizerAdjustment: 'Hold fertilizer until soil moisture stabilizes above 30%'
          },
          {
            zoneId: 'Zone 4 - East Boundary',
            zoneName: 'Zone 4: East Boundary Buffer',
            healthScore: 86,
            action: 'Healthy - Normal maintenance',
            recommendation: 'Stable crop development. Weather forecast shows rain in 48 hours, so withhold water.',
            urgency: 'LOW',
            irrigationVolumeLiters: 0,
            fertilizerAdjustment: 'Standard maintenance'
          }
        ]
      }
    ];
  }

  private generateMockNdviGrid(baseMean: number) {
    const grid = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        // Create realistic spatial gradient
        const variance = Math.sin(x * 0.7) * 0.12 - (y > 4 && x < 3 ? 0.28 : 0);
        const ndvi = Number(Math.max(0.15, Math.min(0.95, baseMean + variance + (Math.random() * 0.06 - 0.03))).toFixed(2));
        const healthClass: 'high' | 'moderate' | 'low' = ndvi >= 0.7 ? 'high' : ndvi >= 0.45 ? 'moderate' : 'low';
        grid.push({ x, y, ndvi, healthClass });
      }
    }
    return grid;
  }

  // Periodic sensor simulation for real-time live feeling
  public tickSensorReadings() {
    for (const farmId of Object.keys(this.sensorReadings)) {
      const current = this.sensorReadings[farmId];
      if (current && current.status === 'ONLINE') {
        // Natural micro-fluctuation
        const moistureDelta = (Math.random() * 0.4 - 0.2);
        const tempDelta = (Math.random() * 0.2 - 0.1);
        const luxDelta = Math.round(Math.random() * 300 - 150);

        current.soilMoisture = Number(Math.max(10, Math.min(65, current.soilMoisture + moistureDelta)).toFixed(1));
        current.soilTemperature = Number(Math.max(12, Math.min(38, current.soilTemperature + tempDelta)).toFixed(1));
        current.airTemperature = Number(Math.max(14, Math.min(42, current.airTemperature + tempDelta)).toFixed(1));
        current.lightIntensity = Math.max(0, current.lightIntensity + luxDelta);
        current.timestamp = new Date().toISOString();
      }
    }
  }
}

export const db = new DatabaseStore();

// Live sensor ticker every 8 seconds
setInterval(() => {
  db.tickSensorReadings();
}, 8000);
