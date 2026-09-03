import { Request, Response } from 'express';
import { db } from '../db.js';

export const getSensorsByFarm = async (req: Request, res: Response) => {
  try {
    const { farmId } = req.params;
    let reading = db.sensorReadings[farmId];
    if (!reading) {
      // Fallback to primary farm reading so UI never shows empty
      reading = {
        ...db.sensorReadings['farm_001'],
        farmId
      };
    }
    return res.json({ success: true, sensor: reading, isDemoSimulated: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Sensor read error', error: String(err) });
  }
};

export const getSensorHistory = async (req: Request, res: Response) => {
  try {
    const { farmId } = req.params;
    let history = db.sensorHistories[farmId];
    if (!history) {
      history = db.sensorHistories['farm_001'];
    }
    return res.json({ success: true, history, isDemoSimulated: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Sensor history error', error: String(err) });
  }
};

export const toggleSensorStatus = async (req: Request, res: Response) => {
  try {
    const { farmId } = req.params;
    const reading = db.sensorReadings[farmId] || db.sensorReadings['farm_001'];
    reading.status = reading.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    return res.json({ success: true, status: reading.status });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
};
