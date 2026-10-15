import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema(
  {
    alertId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
      index: true
    },
    category: {
      type: String,
      default: 'Suspicious Activity Detected'
    },
    walletAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true
    },
    entityLabel: {
      type: String,
      default: 'Address Under Investigation'
    },
    txHash: {
      type: String,
      default: ''
    },
    amountUSD: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['new', 'investigating', 'resolved'],
      default: 'new',
      index: true
    },
    description: {
      type: String,
      required: true
    },
    evidence: {
      type: [String],
      default: []
    },
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case'
    },
    investigationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Investigation'
    },
    assignedTo: {
      type: String,
      default: 'Cyber Forensics Unit'
    }
  },
  {
    timestamps: true
  }
);

export const Alert = mongoose.models.Alert || mongoose.model('Alert', AlertSchema);
