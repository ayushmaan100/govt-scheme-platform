// backend/src/routes/eligibility.ts — REPLACE ENTIRELY

import { Router, Request, Response } from 'express';
import { getSchemesFromCache } from '../engine/schemeCache';
import { checkEligibility } from '../engine/evaluator';
import { UserProfile, EligibilityResponse } from '../types';

const router = Router();

// ─────────────────────────────────────────────────────────────────
// POST /api/v1/eligibility/check
// Phase 2: Returns full matches + potential + partial + missing fields
// ─────────────────────────────────────────────────────────────────
router.post('/check', async (req: Request, res: Response) => {
  try {
    const profile = req.body as UserProfile;

    // ── Validation ───────────────────────────────────
    const requiredFields: (keyof UserProfile)[] = [
      'age', 'gender', 'state', 'caste', 'occupation', 'annualIncome',
    ];

    const missingRequired = requiredFields.filter(
      f => profile[f] === undefined || profile[f] === null || profile[f] === '',
    );

    if (missingRequired.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields: missingRequired,
      });
    }

    if (typeof profile.age !== 'number' || profile.age < 0 || profile.age > 120) {
      return res.status(400).json({ success: false, error: 'Invalid age value' });
    }

    if (typeof profile.annualIncome !== 'number' || profile.annualIncome < 0) {
      return res.status(400).json({ success: false, error: 'Invalid annualIncome value' });
    }

    // ── Run engine ───────────────────────────────────
    const schemes = await getSchemesFromCache();
    const result  = checkEligibility(schemes, profile);

    const response: EligibilityResponse = {
      success:             true,
      profile,
      totalSchemesChecked: schemes.length,
      matchedCount:        result.matches.length,
      potentialCount:      result.potentialMatches.length,
      partialCount:        result.partialMatches.length,
      schemes:             result.matches,
      potentialMatches:    result.potentialMatches,
      partialMatches:      result.partialMatches,
      missingProfileFields: result.missingFields,
      profileCompleteness: result.profileCompleteness,
      checkedAt:           new Date().toISOString(),
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('[/check] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again.',
    });
  }
});

// ─────────────────────────────────────────────────────────────────
// GET /api/v1/eligibility/schemes
// ─────────────────────────────────────────────────────────────────
router.get('/schemes', async (_req: Request, res: Response) => {
  try {
    const schemes = await getSchemesFromCache();
    return res.status(200).json({
      success: true,
      count:   schemes.length,
      schemes: schemes.map(s => ({
        id:           s.id,
        name:         s.name,
        slug:         s.slug,
        category:     s.category,
        benefitAmount: s.benefitAmount,
        ruleCount:    s.rules.length,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch schemes' });
  }
});

// ─────────────────────────────────────────────────────────────────
// GET /api/v1/eligibility/scheme/:slug
// NEW in Phase 2: Full detail for one scheme
// ─────────────────────────────────────────────────────────────────
router.get('/scheme/:slug', async (req: Request, res: Response) => {
  try {
    const schemes = await getSchemesFromCache();
    const scheme  = schemes.find(s => s.slug === req.params.slug);

    if (!scheme) {
      return res.status(404).json({ success: false, error: 'Scheme not found' });
    }

    return res.status(200).json({ success: true, scheme });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch scheme' });
  }
});

export default router;