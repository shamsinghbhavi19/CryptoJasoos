import mongoose from 'mongoose';

const InvestigationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['wallet', 'transaction'],
      required: true
    },
    target: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    network: {
      type: String,
      default: 'homestead'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'limited'],
      default: 'completed'
    },
    summaryStatistics: {
      totalReceivedUSD: { type: Number, default: 0 },
      totalSentUSD: { type: Number, default: 0 },
      currentBalanceUSD: { type: Number, default: 0 },
      balanceNative: { type: String, default: '0' },
      transactionCount: { type: Number, default: 0 },
      connectedWalletsCount: { type: Number, default: 0 },
      firstSeen: { type: String, default: '' },
      lastActive: { type: String, default: '' }
    },
    riskAssessment: {
      riskScore: { type: Number, default: 0, min: 0, max: 100 },
      riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
      riskIndicators: [
        {
          id: String,
          name: String,
          severity: String,
          description: String,
          evidenceCount: Number,
          supportingHashes: [String],
          reason: String,
          limitations: String
        }
      ],
      exposure: {
        directIllicit: { type: Number, default: 0 },
        indirectIllicit: { type: Number, default: 0 },
        mixerExposure: { type: Number, default: 0 },
        sanctionedExposure: { type: Number, default: 0 },
        cleanVASP: { type: Number, default: 0 }
      },
      sanctionsMatch: {
        isSanctioned: { type: Boolean, default: false },
        lists: [String],
        sdnId: String
      }
    },
    transactions: [
      {
        hash: String,
        fromAddress: String,
        toAddress: String,
        amountCrypto: Number,
        symbol: String,
        amountUSD: Number,
        timestamp: String,
        blockNumber: Number,
        status: String,
        riskScore: Number,
        riskLevel: String
      }
    ],
    providerInfo: {
      provider: { type: String, default: 'Alchemy / Ethereum JSON-RPC' },
      retrievedAt: { type: Date, default: Date.now },
      dataCompleteness: {
        type: String,
        enum: ['complete', 'recent_window_only', 'rpc_limited', 'simulated_demo'],
        default: 'complete'
      },
      limitations: { type: String, default: 'Standard node historical lookback limit' }
    },
    aiSummary: {
      summaryText: String,
      generatedAt: Date,
      modelUsed: String
    }
  },
  {
    timestamps: true
  }
);

export const Investigation = mongoose.models.Investigation || mongoose.model('Investigation', InvestigationSchema);
