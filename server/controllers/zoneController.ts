import { Request, Response } from 'express';
import { db } from '../db.js';

export const getZonesByFarm = async (req: Request, res: Response) => {
  try {
    const { farmId } = req.params;
    let zones = db.zones[farmId];
    if (!zones || zones.length === 0) {
      zones = db.zones['farm_001'] || [];
    }
    return res.json({ success: true, zones });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Zones error', error: String(err) });
  }
};

export const updateZone = async (req: Request, res: Response) => {
  try {
    const { farmId, zoneId } = req.params;
    const zones = db.zones[farmId];
    if (!zones) {
      return res.status(404).json({ success: false, message: 'Farm zones not found' });
    }
    const idx = zones.findIndex(z => z.id === zoneId || z.zoneId === zoneId);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Zone not found' });
    }

    zones[idx] = { ...zones[idx], ...req.body };
    return res.json({ success: true, zone: zones[idx] });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
};
