import { ReportService } from '../services/reportService.js';
import { formatSuccess } from '../utils/responseFormatter.js';

export const getReport = async (req, res, next) => {
  try {
    const { investigationId } = req.params;
    const report = ReportService.generateReport({
      investigation: { target: investigationId }
    });

    res.json(formatSuccess(report, 'Investigation report generated'));
  } catch (err) {
    next(err);
  }
};

export const exportReport = async (req, res, next) => {
  try {
    const { investigationId } = req.params;
    const { format = 'json' } = req.query;

    const report = ReportService.generateReport({
      investigation: { target: investigationId }
    });

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="SAR-Report-${investigationId}.json"`);
      return res.send(JSON.stringify(report, null, 2));
    }

    // Default text/pdf export representation
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="SAR-Report-${investigationId}.txt"`);
    const formattedText = `
================================================================================
CRYPTOJASOOS — FINANCIAL CRIMES ENFORCEMENT & FORENSIC DOSSIER
================================================================================
Report Identifier: ${report.reportId}
Regulatory Form:   ${report.formType}
Date of Generation: ${report.dateGenerated}
Lead Investigator: ${report.leadInvestigator}

TARGET SUBJECT:
Address:           ${report.targetSubject.address}
Network:           ${report.targetSubject.network}
Threat Score:      ${report.targetSubject.assessedRiskScore} / 100 (${report.targetSubject.assessedRiskLevel} Risk)

FORENSIC FINDINGS:
Transactions:      ${report.forensicFindings.transactionsAnalyzed}
Total Volume (USD): $${report.forensicFindings.totalVolumeUSD.toLocaleString()}
Counterparties:    ${report.forensicFindings.connectedCounterparties}

DETECTED RISK INDICATORS:
${report.forensicFindings.triggeredIndicators.map((ind) => `  * [${ind.severity.toUpperCase()}] ${ind.name}: ${ind.reason || ''}`).join('\n')}

CRYPTOGRAPHIC EVIDENCE HASHES:
${report.cryptographicEvidenceHashes.map((h) => `  - ${h}`).join('\n')}

REGULATORY NOTICE:
${report.regulatoryNotice}
================================================================================
`;
    res.send(formattedText);
  } catch (err) {
    next(err);
  }
};
