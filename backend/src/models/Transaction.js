import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    chain: {
      type: String,
      default: 'ETH'
    },
    fromAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    fromLabel: {
      type: String,
      default: 'Address Under Investigation'
    },
    toAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    toLabel: {
      type: String,
      default: 'Counterparty Address'
    },
    amountCrypto: {
      type: Number,
      required: true
    },
    symbol: {
      type: String,
      default: 'ETH'
    },
    amountUSD: {
      type: Number,
      default: 0
    },
    blockNumber: {
      type: Number
    },
    timestamp: {
      type: String
    },
    gasUsed: {
      type: String
    },
    gasPriceGwei: {
      type: String
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Flagged', 'Failed'],
      default: 'Confirmed'
    },
    riskScore: {
      type: Number,
      default: 0
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    category: {
      type: String,
      default: 'Standard Transfer'
    },
    hopCount: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
