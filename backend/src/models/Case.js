import mongoose from 'mongoose';

const CaseSchema = new mongoose.Schema(
  {
    caseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    targetAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    network: {
      type: String,
      enum: ['Ethereum', 'Bitcoin', 'Polygon', 'Solana', 'BNB Chain'],
      default: 'Ethereum'
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'UNDER REVIEW', 'CLOSED'],
      default: 'ACTIVE',
      index: true
    },
    alertsCount: {
      type: Number,
      default: 0
    },
    transactionsAnalyzed: {
      type: Number,
      default: 0
    },
    connectedAddressesCount: {
      type: Number,
      default: 0
    },
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    graphDepthHops: {
      type: Number,
      default: 1
    },
    firstActivityDate: {
      type: String,
      default: ''
    },
    lastActivityDate: {
      type: String,
      default: ''
    },
    createdDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    leadInvestigator: {
      type: String,
      default: 'Alex Vance (Senior Investigator)'
    },
    associatedAddresses: {
      type: [String],
      default: []
    },
    associatedTransactionHashes: {
      type: [String],
      default: []
    },
    investigationReferences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Investigation'
      }
    ],
    notes: {
      type: String,
      default: ''
    },
    riskIndicators: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const Case = mongoose.models.Case || mongoose.model('Case', CaseSchema);
