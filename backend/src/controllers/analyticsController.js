import { formatSuccess } from '../utils/responseFormatter.js';
import { SEED_CASES, SEED_ALERTS } from '../utils/seedData.js';

export const getAnalytics = async (req, res, next) => {
  try {
    const analytics = {
      summary: {
        totalInvestigations: 24,
        totalCases: SEED_CASES.length + 35,
        totalAlerts: SEED_ALERTS.length + 15,
        totalVolumeUSD: 48920000,
        highRiskWalletsCount: 18
      },
      riskDistribution: [
        { level: 'Critical', count: 6, percentage: 25 },
        { level: 'High', count: 12, percentage: 50 },
        { level: 'Medium', count: 4, percentage: 17 },
        { level: 'Low', count: 2, percentage: 8 }
      ],
      weeklyTrend: [
        { day: 'Mon', volumeUSD: 4200000, alerts: 3 },
        { day: 'Tue', volumeUSD: 8900000, alerts: 6 },
        { day: 'Wed', volumeUSD: 3100000, alerts: 2 },
        { day: 'Thu', volumeUSD: 14500000, alerts: 8 },
        { day: 'Fri', volumeUSD: 11200000, alerts: 5 },
        { day: 'Sat', volumeUSD: 2300000, alerts: 1 },
        { day: 'Sun', volumeUSD: 4720000, alerts: 4 }
      ],
      topMonitoredAddresses: SEED_CASES.map((c) => ({
        address: c.targetAddress,
        network: c.network,
        riskScore: c.riskScore,
        riskLevel: c.riskLevel,
        caseNumber: c.caseNumber
      }))
    };

    res.json(formatSuccess(analytics, 'Forensic analytics retrieved'));
  } catch (err) {
    next(err);
  }
};
