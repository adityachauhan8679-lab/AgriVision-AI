import { Request, Response } from 'express';
import { db } from '../db.js';

export const getSatelliteByFarm = async (req: Request, res: Response) => {
  try {
    const { farmId } = req.params;
    let observations = db.satelliteObservations[farmId];
    if (!observations || observations.length === 0) {
      observations = db.satelliteObservations['farm_001'];
    }

    return res.json({
      success: true,
      observations,
      provider: 'Sentinel-2 MSI Multi-Spectral Remote Sensing (Simulated 10m Ground Resolution)',
      isDemo: true,
      availableBands: ['B02 (Blue 490nm)', 'B03 (Green 560nm)', 'B04 (Red 665nm)', 'B08 (NIR 842nm)', 'B11 (SWIR 1610nm)'],
      indicesSupported: ['NDVI (Normalized Difference Vegetation Index)', 'NDRE (Red Edge)', 'NDWI (Water Index)', 'EVI (Enhanced Vegetation Index)']
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Satellite error', error: String(err) });
  }
};
