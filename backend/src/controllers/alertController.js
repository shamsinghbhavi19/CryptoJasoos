import { Alert } from '../models/Alert.js';
import { SEED_ALERTS } from '../utils/seedData.js';
import { formatSuccess, formatError } from '../utils/responseFormatter.js';
import { getDbStatus } from '../config/db.js';

let inMemoryAlerts = [...SEED_ALERTS.map((a, i) => ({ ...a, _id: `alert-${i + 1}`, id: a.alertId }))];

export const getAlerts = async (req, res, next) => {
  try {
    const { severity, status } = req.query;
    const dbStatus = getDbStatus();

    let alerts = [];

    if (dbStatus.connected) {
      const query = {};
      if (severity && severity !== 'all') query.severity = severity.toLowerCase();
      if (status && status !== 'all') query.status = status.toLowerCase();

      alerts = await Alert.find(query).sort({ createdAt: -1 });
    } else {
      alerts = [...inMemoryAlerts];
      if (severity && severity !== 'all') alerts = alerts.filter((a) => a.severity.toLowerCase() === severity.toLowerCase());
      if (status && status !== 'all') alerts = alerts.filter((a) => a.status.toLowerCase() === status.toLowerCase());
    }

    res.json(formatSuccess(alerts, 'Alerts retrieved successfully'));
  } catch (err) {
    next(err);
  }
};

export const updateAlertStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const dbStatus = getDbStatus();

    let updated = null;

    if (dbStatus.connected) {
      updated = await Alert.findOneAndUpdate(
        { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { alertId: id }] },
        { $set: { status } },
        { new: true }
      );
    } else {
      const idx = inMemoryAlerts.findIndex((a) => a.alertId === id || a._id === id || a.id === id);
      if (idx !== -1) {
        inMemoryAlerts[idx] = { ...inMemoryAlerts[idx], status };
        updated = inMemoryAlerts[idx];
      }
    }

    if (!updated) {
      return res.status(404).json(formatError(`Alert not found: ${id}`, 404));
    }

    res.json(formatSuccess(updated, 'Alert status updated successfully'));
  } catch (err) {
    next(err);
  }
};
