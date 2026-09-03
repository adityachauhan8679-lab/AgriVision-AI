import { Request, Response } from 'express';
import { db } from '../db.js';
import { IAlert } from '../models.js';

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const { farmId, severity } = req.query;
    let alerts = [...db.alerts];

    if (farmId) {
      alerts = alerts.filter(a => a.farmId === farmId);
    }
    if (severity && severity !== 'ALL') {
      alerts = alerts.filter(a => a.severity === severity);
    }

    return res.json({
      success: true,
      alerts,
      unreadCount: alerts.filter(a => !a.read).length
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Alerts error', error: String(err) });
  }
};

export const markAlertRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const alert = db.alerts.find(a => a.id === id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    alert.read = true;
    return res.json({ success: true, alert });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idx = db.alerts.findIndex(a => a.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    db.alerts.splice(idx, 1);
    return res.json({ success: true, message: 'Alert deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
};

export const createAlert = async (req: Request, res: Response) => {
  try {
    const { farmId, zoneId, title, message, severity, actionRequired } = req.body;
    const newAlert: IAlert = {
      id: `alt_${Date.now()}`,
      farmId: farmId || 'farm_001',
      zoneId,
      title: title || 'Custom Agronomic Notification',
      message: message || 'Sensor reading threshold triggered.',
      severity: severity || 'WARNING',
      timestamp: new Date().toISOString(),
      read: false,
      actionRequired: actionRequired || 'Review sensor values.'
    };
    db.alerts.unshift(newAlert);
    return res.status(201).json({ success: true, alert: newAlert });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
};
