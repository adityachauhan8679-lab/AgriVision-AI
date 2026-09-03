import { Router } from 'express';
import {
  registerUser,
  loginUser,
  demoLogin,
  getProfile,
  authenticateJwt
} from './controllers/authController.js';
import {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm
} from './controllers/farmController.js';
import {
  getSensorsByFarm,
  getSensorHistory,
  toggleSensorStatus
} from './controllers/sensorController.js';
import { getWeatherByFarm } from './controllers/weatherController.js';
import { getSatelliteByFarm } from './controllers/satelliteController.js';
import { getZonesByFarm, updateZone } from './controllers/zoneController.js';
import { runFarmAnalysis, detectCropDisease } from './controllers/aiController.js';
import {
  getAlerts,
  markAlertRead,
  deleteAlert,
  createAlert
} from './controllers/alertController.js';
import { getFarmReport } from './controllers/reportController.js';

const router = Router();

// Authentication Routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/demo-login', demoLogin);
router.get('/auth/profile', authenticateJwt, getProfile);

// Farm Management Routes
router.get('/farms', getFarms);
router.post('/farms', createFarm);
router.get('/farms/:id', getFarmById);
router.put('/farms/:id', updateFarm);
router.delete('/farms/:id', deleteFarm);

// IoT Sensors Routes
router.get('/sensors/:farmId', getSensorsByFarm);
router.get('/sensors/:farmId/history', getSensorHistory);
router.post('/sensors/:farmId/toggle', toggleSensorStatus);

// Weather Routes
router.get('/weather/:farmId', getWeatherByFarm);

// Satellite & Remote Sensing Routes
router.get('/satellite/:farmId', getSatelliteByFarm);

// GIS Management Zones Routes
router.get('/zones/:farmId', getZonesByFarm);
router.put('/zones/:farmId/:zoneId', updateZone);

// AI & Computer Vision Routes
router.post('/ai/analyze', runFarmAnalysis);
router.post('/ai/disease-detection', detectCropDisease);

// Smart Alerts Routes
router.get('/alerts', getAlerts);
router.put('/alerts/:id/read', markAlertRead);
router.delete('/alerts/:id', deleteAlert);
router.post('/alerts', createAlert);

// Reports Routes
router.get('/reports/:farmId', getFarmReport);

export default router;
