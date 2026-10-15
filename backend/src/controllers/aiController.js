import { GeminiService } from '../services/geminiService.js';
import { RiskAnalysisService } from '../services/riskAnalysisService.js';
import { formatSuccess } from '../utils/responseFormatter.js';

export const summarizeInvestigation = async (req, res, next) => {
  try {
    const { investigationId } = req.params;
    const { targetAddress = investigationId, summaryStats, riskAssessment, notes } = req.body;

    const risk = riskAssessment || RiskAnalysisService.analyze(targetAddress, []);

    const aiResult = await GeminiService.generateInvestigationSummary({
      targetAddress,
      summaryStats,
      riskAssessment: risk,
      notes
    });

    res.json(formatSuccess(aiResult, 'AI investigation summary generated'));
  } catch (err) {
    next(err);
  }
};

export const askAiAssistant = async (req, res, next) => {
  try {
    const { question, targetAddress = '0x82A7656EC7ab88b098defB751B7401B5f6d8976F' } = req.body;
    const risk = RiskAnalysisService.analyze(targetAddress, []);

    const aiResult = await GeminiService.generateInvestigationSummary({
      targetAddress,
      summaryStats: { currentBalanceUSD: 9300, transactionCount: 1284, connectedWalletsCount: 87 },
      riskAssessment: risk,
      notes: `Investigator Query: ${question}`
    });

    res.json(formatSuccess(aiResult, 'AI response synthesized'));
  } catch (err) {
    next(err);
  }
};
