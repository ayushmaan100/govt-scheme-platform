// src/routes/eligibility.ts

import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { checkEligibility } from '../engine/evaluator';
import { UserProfile, EligibilityResponse } from '../types';

const router = Router();

// ─────────────────────────────────────────────────────────────────
// POST /api/v1/eligibility/check
// 
// Body: UserProfile object
// Returns: List of matched schemes with explanations
// ─────────────────────────────────────────────────────────────────
router.post('/check', async (req: Request, res: Response) => {
  try {
    const profile = req.body as UserProfile;

    // ── VALIDATION ──────────────────────────────────────
    // Check required fields are present
    const requiredFields: (keyof UserProfile)[] = [
      'age', 'gender', 'state', 'caste', 'occupation', 'annualIncome'
    ];

    const missingFields = requiredFields.filter(
      field => profile[field] === undefined || profile[field] === null || profile[field] === ''
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields,
      });
    }

    // ── BASIC TYPE VALIDATION ─────────────────────────
    if (typeof profile.age !== 'number' || profile.age < 0 || profile.age > 120) {
      return res.status(400).json({ success: false, error: 'Invalid age value' });
    }

    if (typeof profile.annualIncome !== 'number' || profile.annualIncome < 0) {
      return res.status(400).json({ success: false, error: 'Invalid annualIncome value' });
    }

    // ── FETCH ALL ACTIVE SCHEMES WITH THEIR RULES ─────
    // We fetch once and evaluate in-memory for speed
    const schemes = await prisma.scheme.findMany({
      where: { isActive: true },
      include: { rules: true },
    });

    // ── RUN ELIGIBILITY ENGINE ─────────────────────────
    const matchedSchemes = checkEligibility(schemes, profile);

    // ── BUILD RESPONSE ─────────────────────────────────
    const response: EligibilityResponse = {
      success: true,
      profile,
      totalSchemesChecked: schemes.length,
      matchedCount: matchedSchemes.length,
      schemes: matchedSchemes,
      checkedAt: new Date().toISOString(),
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Eligibility check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again.',
    });
  }
});

// ─────────────────────────────────────────────────────────────────
// GET /api/v1/eligibility/schemes
// Returns all active schemes (useful for debugging / admin)
// ─────────────────────────────────────────────────────────────────
router.get('/schemes', async (_req: Request, res: Response) => {
  try {
    const schemes = await prisma.scheme.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        benefitAmount: true,
        _count: { select: { rules: true } },
      },
      orderBy: { category: 'asc' },
    });

    return res.status(200).json({
      success: true,
      count: schemes.length,
      schemes,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch schemes' });
  }
});

export default router;