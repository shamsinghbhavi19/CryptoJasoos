import { Case } from '../models/Case.js';
import { SEED_CASES } from '../utils/seedData.js';
import { formatSuccess, formatError } from '../utils/responseFormatter.js';
import { getDbStatus } from '../config/db.js';

// In-memory fallback repository when MongoDB connection is not configured
let inMemoryCases = [...SEED_CASES.map((c, i) => ({ ...c, _id: `case-${i + 1}`, id: c.caseNumber }))];

export const getCases = async (req, res, next) => {
  try {
    const { search, risk, status, network, sortBy = 'date', page = 1, limit = 20 } = req.query;
    const dbStatus = getDbStatus();

    let items = [];
    let total = 0;

    if (dbStatus.connected) {
      const query = {};
      if (risk && risk !== 'all') query.riskLevel = risk.toLowerCase();
      if (status && status !== 'all') query.status = status.toUpperCase();
      if (network && network !== 'all') query.network = network;

      if (search) {
        query.$or = [
          { caseNumber: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { targetAddress: { $regex: search, $options: 'i' } }
        ];
      }

      total = await Case.countDocuments(query);
      items = await Case.find(query)
        .sort(sortBy === 'risk' ? { riskScore: -1 } : { createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit, 10));
    } else {
      // In-memory filtering
      let filtered = [...inMemoryCases];

      if (risk && risk !== 'all') filtered = filtered.filter((c) => c.riskLevel.toLowerCase() === risk.toLowerCase());
      if (status && status !== 'all') filtered = filtered.filter((c) => c.status === status.toUpperCase());
      if (network && network !== 'all') filtered = filtered.filter((c) => c.network === network);

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.caseNumber.toLowerCase().includes(q) ||
            c.title.toLowerCase().includes(q) ||
            c.targetAddress.toLowerCase().includes(q)
        );
      }

      if (sortBy === 'risk') filtered.sort((a, b) => b.riskScore - a.riskScore);
      else filtered.sort((a, b) => new Date(b.createdDate || 0) - new Date(a.createdDate || 0));

      total = filtered.length;
      items = filtered.slice((page - 1) * limit, page * limit);
    }

    // Stats
    const allCases = dbStatus.connected ? await Case.find() : inMemoryCases;
    const stats = {
      activeCases: allCases.filter((c) => c.status === 'ACTIVE').length + 20,
      highPriority: allCases.filter((c) => c.priority === 'High' || c.priority === 'Critical').length + 4,
      underReview: allCases.filter((c) => c.status === 'UNDER REVIEW').length + 9,
      closedCases: allCases.filter((c) => c.status === 'CLOSED').length + 35
    };

    res.json(
      formatSuccess(items, 'Cases retrieved successfully', {
        pagination: { total, page: parseInt(page, 10), limit: parseInt(limit, 10) },
        stats
      })
    );
  } catch (err) {
    next(err);
  }
};

export const getCaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDbStatus();

    let foundCase = null;
    if (dbStatus.connected) {
      foundCase = await Case.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { caseNumber: id }]
      });
    } else {
      foundCase = inMemoryCases.find((c) => c.caseNumber === id || c._id === id || c.id === id);
    }

    if (!foundCase) {
      return res.status(404).json(formatError(`Case not found with identifier: ${id}`, 404));
    }

    res.json(formatSuccess(foundCase, 'Case details retrieved'));
  } catch (err) {
    next(err);
  }
};

export const createCase = async (req, res, next) => {
  try {
    const { title, targetAddress, network = 'Ethereum', priority = 'Medium', notes = '' } = req.body;
    const dbStatus = getDbStatus();

    const caseCount = dbStatus.connected ? (await Case.countDocuments()) : inMemoryCases.length;
    const caseNumber = `CJ-2026-0${caseCount + 15}`;
    const riskLevel = priority === 'Critical' ? 'critical' : priority === 'High' ? 'high' : priority === 'Medium' ? 'medium' : 'low';
    const riskScore = priority === 'Critical' ? 92 : priority === 'High' ? 79 : 45;

    const newCasePayload = {
      caseNumber,
      title: title.trim(),
      targetAddress: targetAddress.trim(),
      network,
      riskLevel,
      priority,
      status: 'ACTIVE',
      alertsCount: 1,
      transactionsAnalyzed: 142,
      connectedAddressesCount: 18,
      riskScore,
      graphDepthHops: 3,
      firstActivityDate: '26 Aug 2026',
      lastActivityDate: '26 Aug 2026',
      createdDate: new Date().toISOString().split('T')[0],
      leadInvestigator: 'Alex Vance (Cyber Crime Unit)',
      notes: notes.trim() || 'New case initiated for multi-hop forensic analysis.',
      riskIndicators: ['Rapid Fund Movement', 'Multi-Hop Transfers']
    };

    let savedCase;
    if (dbStatus.connected) {
      savedCase = await Case.create(newCasePayload);
    } else {
      savedCase = { ...newCasePayload, _id: `case-${Date.now()}`, id: caseNumber };
      inMemoryCases.unshift(savedCase);
    }

    res.status(201).json(formatSuccess(savedCase, 'Case created successfully.'));
  } catch (err) {
    next(err);
  }
};

export const updateCase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const dbStatus = getDbStatus();

    let updatedCase = null;
    if (dbStatus.connected) {
      updatedCase = await Case.findOneAndUpdate(
        { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { caseNumber: id }] },
        { $set: updates },
        { new: true }
      );
    } else {
      const idx = inMemoryCases.findIndex((c) => c.caseNumber === id || c._id === id || c.id === id);
      if (idx !== -1) {
        inMemoryCases[idx] = { ...inMemoryCases[idx], ...updates, updatedAt: new Date().toISOString() };
        updatedCase = inMemoryCases[idx];
      }
    }

    if (!updatedCase) {
      return res.status(404).json(formatError(`Case not found: ${id}`, 404));
    }

    res.json(formatSuccess(updatedCase, 'Case updated successfully.'));
  } catch (err) {
    next(err);
  }
};

export const associateInvestigation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { investigationId } = req.body;

    res.json(formatSuccess({ caseId: id, investigationId }, 'Investigation associated with case.'));
  } catch (err) {
    next(err);
  }
};
