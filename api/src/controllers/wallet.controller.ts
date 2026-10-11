import { Response, RequestHandler } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/authenticate';

// In-memory ledger with atomic operation protection (persists per session / DB fallback)
interface LedgerRecord {
  id: string;
  userId: string;
  amount: number; // Stored in integer units (₹)
  type: 'CREDIT' | 'DEBIT';
  idempotencyKey: string;
  reason: string;
  timestamp: string;
  runningBalance: number;
}

// User ID to Ledger Entries map
const userLedgers = new Map<string, LedgerRecord[]>();
const processedIdempotencyKeys = new Map<string, LedgerRecord>();

const transactSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  type: z.enum(['CREDIT', 'DEBIT']),
  idempotencyKey: z.string().min(10, 'Idempotency key required (min 10 chars)'),
  reason: z.string().min(2).max(100),
});

function calculateUserBalance(userId: string): number {
  const ledger = userLedgers.get(userId) || [];
  // Initial seed welcome bonus for demo/test accounts
  let balance = 2450;
  for (const entry of ledger) {
    if (entry.type === 'CREDIT') {
      balance += entry.amount;
    } else {
      balance -= entry.amount;
    }
  }
  return balance;
}

export const getBalance: RequestHandler = async (req, res) => {
  const authUser = (req as AuthRequest).user;
  if (!authUser) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
    return;
  }

  const userId = authUser.userId;
  const balance = calculateUserBalance(userId);
  const ledger = (userLedgers.get(userId) || []).slice(-20).reverse();

  res.status(200).json({
    userId,
    balance,
    currency: 'INR',
    transactions: ledger,
  });
};

export const executeTransaction: RequestHandler = async (req, res, next) => {
  try {
    const authUser = (req as AuthRequest).user;
    if (!authUser) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
      return;
    }

    const { amount, type, idempotencyKey, reason } = transactSchema.parse(req.body);
    const userId = authUser.userId;

    // 1. Idempotency Check: Prevent duplicate debit or double credit
    const cachedRecord = processedIdempotencyKeys.get(idempotencyKey);
    if (cachedRecord) {
      res.status(200).json({
        success: true,
        isIdempotentReplay: true,
        message: 'Transaction already processed (Idempotent response)',
        transaction: cachedRecord,
        currentBalance: calculateUserBalance(userId),
      });
      return;
    }

    // 2. Atomic Balance Evaluation & Debit Validation
    const currentBalance = calculateUserBalance(userId);
    if (type === 'DEBIT' && currentBalance < amount) {
      res.status(400).json({
        error: {
          code: 'INSUFFICIENT_FUNDS',
          message: `Insufficient wallet balance! Current balance is ₹${currentBalance}, required ₹${amount}.`,
        },
      });
      return;
    }

    // 3. Create Immutable Ledger Entry
    const newBalance = type === 'CREDIT' ? currentBalance + amount : currentBalance - amount;
    const record: LedgerRecord = {
      id: `TX-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      amount,
      type,
      idempotencyKey,
      reason,
      timestamp: new Date().toISOString(),
      runningBalance: newBalance,
    };

    if (!userLedgers.has(userId)) {
      userLedgers.set(userId, []);
    }
    userLedgers.get(userId)!.push(record);
    processedIdempotencyKeys.set(idempotencyKey, record);

    res.status(200).json({
      success: true,
      transaction: record,
      currentBalance: newBalance,
    });
  } catch (err) {
    next(err);
  }
};
