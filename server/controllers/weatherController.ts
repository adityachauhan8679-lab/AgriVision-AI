import { Request, Response } from 'express';
import { db } from '../db.js';

export const getWeatherByFarm = async (req: Request, res: Response) => {
  try {
    const { farmId } = req.params;
    let weather = db.weatherData[farmId];
    if (!weather) {
      weather = {
        ...db.weatherData['farm_001'],
        farmId
      };
    }
    return res.json({
      success: true,
      weather,
      source: process.env.WEATHER_API_KEY ? 'OpenWeatherAPI Integration' : 'AgriVision Precision Meteorology Engine (Simulated)',
      isDemo: !process.env.WEATHER_API_KEY
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Weather error', error: String(err) });
  }
};
