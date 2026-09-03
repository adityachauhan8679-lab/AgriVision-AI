import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { IUser, IFarm } from '../models.js';

const JWT_SECRET = process.env.JWT_SECRET || 'agrivision-jwt-secret-key-2025';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authenticateJwt = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = db.users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token expired or invalid', error: String(err) });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, location, farmName } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 8);
    const newUser: IUser = {
      id: `usr_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone: phone || '',
      location: location || 'California, USA',
      farmName: farmName || `${name}'s Agro-Tech Farm`,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    // Also auto-provision a starter farm for the new user
    const starterBoundary: [number, number][] = [
      [36.6800, -121.6580],
      [36.6800, -121.6520],
      [36.6750, -121.6520],
      [36.6750, -121.6580]
    ];
    const starterFarm: IFarm = {
      id: `farm_${Date.now()}`,
      userId: newUser.id,
      name: newUser.farmName,
      cropType: 'Corn',
      cropVariety: 'Yellow Dent Hybrid',
      soilType: 'Loamy Sand',
      sowingDate: new Date(Date.now() - 20 * 86400000).toISOString().split('T')[0],
      lengthMeters: 500,
      widthMeters: 400,
      areaSquareMeters: 200000,
      areaHectares: 20.0,
      areaAcres: 49.4,
      center: { lat: 36.6777, lng: -121.6555 },
      boundary: starterBoundary,
      overallHealthScore: 84,
      zonesCount: 3,
      createdAt: new Date().toISOString()
    };
    db.farms.push(starterFarm);

    // Setup mock zones & sensor data for new farm
    db.zones[starterFarm.id] = [
      {
        id: `zone_${starterFarm.id}_1`,
        zoneId: 'Zone 1 - Main Field',
        farmId: starterFarm.id,
        name: 'Zone 1: Main Cultivation Block',
        healthStatus: 'HEALTHY',
        healthScore: 88,
        soilMoisture: 38,
        temperature: 23.5,
        diseaseProbability: 6,
        waterRequirement: '0 mm (Good)',
        recommendedAction: 'Crop canopy index is healthy. Keep standard irrigation scheduling.',
        boundary: [
          [36.6800, -121.6580],
          [36.6800, -121.6550],
          [36.6750, -121.6550],
          [36.6750, -121.6580]
        ],
        color: '#10b981',
        areaAcres: 24.7,
        cropType: 'Corn'
      },
      {
        id: `zone_${starterFarm.id}_2`,
        zoneId: 'Zone 2 - East Ridge',
        farmId: starterFarm.id,
        name: 'Zone 2: East Ridge Lowland',
        healthStatus: 'MODERATE_STRESS',
        healthScore: 66,
        soilMoisture: 27,
        temperature: 25.2,
        diseaseProbability: 16,
        waterRequirement: '15 mm within 24 hours',
        recommendedAction: 'Moisture deficit emerging. Recommended evening drip irrigation.',
        boundary: [
          [36.6800, -121.6550],
          [36.6800, -121.6520],
          [36.6750, -121.6520],
          [36.6750, -121.6550]
        ],
        color: '#f59e0b',
        areaAcres: 24.7,
        cropType: 'Corn'
      }
    ];

    db.sensorReadings[starterFarm.id] = {
      farmId: starterFarm.id,
      timestamp: new Date().toISOString(),
      status: 'ONLINE',
      soilMoisture: 35.0,
      soilTemperature: 22.0,
      airTemperature: 24.0,
      humidity: 60,
      soilPh: 6.7,
      rainfall: 0.0,
      lightIntensity: 62000,
      batteryLevel: 98
    };

    db.weatherData[starterFarm.id] = db.weatherData['farm_001'];
    db.satelliteObservations[starterFarm.id] = db.satelliteObservations['farm_001'];

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    const { passwordHash: _, ...safeUser } = newUser;
    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: safeUser,
      starterFarmId: starterFarm.id
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server registration error', error: String(err) });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.passwordHash) {
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...safeUser } = user;

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server login error', error: String(err) });
  }
};

export const demoLogin = async (_req: Request, res: Response) => {
  try {
    const demoUser = db.users[0];
    const token = jwt.sign({ id: demoUser.id, email: demoUser.email }, JWT_SECRET, { expiresIn: '7d' });
    const { passwordHash: _, ...safeUser } = demoUser;

    return res.json({
      success: true,
      message: 'Demo farmer session authenticated',
      token,
      user: safeUser
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Demo authentication failed', error: String(err) });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  const { passwordHash: _, ...safeUser } = req.user;
  return res.json({ success: true, user: safeUser });
};
