import { RiskAnalysisService } from '../services/riskAnalysisService.js';
import { formatSuccess } from '../utils/responseFormatter.js';

export const analyzeRisk = async (req, res, next) => {
  try {
    const { address, transactions = [] } = req.body;
    const analysis = RiskAnalysisService.analyze(address, transactions);

    res.json(formatSuccess(analysis, 'Risk analysis completed'));
  } catch (err) {
    next(err);
  }
};

export const getInvestigationRisk = async (req, res, next) => {
  try {
    const { id } = req.params;
    const analysis = RiskAnalysisService.analyze(id, []);

    res.json(formatSuccess(analysis, 'Investigation risk retrieved'));
  } catch (err) {
    next(err);
  }
};
