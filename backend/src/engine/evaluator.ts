// backend/src/engine/evaluator.ts — REPLACE ENTIRELY

import { Scheme, EligibilityRule } from '@prisma/client';
import {
  UserProfile, RuleResult, RuleStatus,
  MatchedScheme, PotentialMatch, PartialMatch,
} from '../types';

// ─────────────────────────────────────────────────────────────────
// CORE: Evaluate a single rule — now returns 3-state status
// ─────────────────────────────────────────────────────────────────
export function evaluateRule(
  rule: EligibilityRule,
  profile: UserProfile
): RuleResult {
  const userValue = (profile as unknown as Record<string, unknown>)[rule.field];
  const ruleValue = rule.value;

  const base = {
    field: rule.field,
    operator: rule.operator,
    description: rule.description,
    descriptionHi: rule.descriptionHi,
    userValue,
  };

  // FAIL_MISSING: field not provided at all
  if (userValue === undefined || userValue === null || userValue === '') {
    return { ...base, status: 'fail_missing', passed: false };
  }

  // ── Evaluate based on operator ───────────────────
  let conditionMet = false;

  switch (rule.operator) {
    case 'eq':
      conditionMet = userValue === ruleValue;
      break;

    case 'gte':
      conditionMet = Number(userValue) >= Number(ruleValue);
      break;

    case 'lte':
      conditionMet = Number(userValue) <= Number(ruleValue);
      break;

    case 'in': {
      const list = ruleValue as string[];
      conditionMet = Array.isArray(list) && list.includes(String(userValue));
      break;
    }

    case 'not_in': {
      const excluded = ruleValue as string[];
      conditionMet = !excluded.includes(String(userValue));
      break;
    }

    case 'between': {
      const range = ruleValue as { min: number; max: number };
      const n = Number(userValue);
      conditionMet = n >= range.min && n <= range.max;
      break;
    }

    case 'is_true':
      conditionMet = userValue === true;
      break;

    case 'is_false':
      conditionMet = userValue === false;
      break;

    case 'gt':
      conditionMet = Number(userValue) > Number(ruleValue);
      break;

    case 'lt':
      conditionMet = Number(userValue) < Number(ruleValue);
      break;

    default:
      console.warn(`[Evaluator] Unknown operator: ${rule.operator}`);
      conditionMet = false;
  }

  const status: RuleStatus = conditionMet ? 'pass' : 'fail_hard';
  return { ...base, status, passed: conditionMet };
}

// ─────────────────────────────────────────────────────────────────
// CONFIDENCE SCORE
// Measures how "clean" a full match is.
// If all fields were provided and passed = 100.
// If some fields were optional/missing but scheme still matched = lower.
// ─────────────────────────────────────────────────────────────────
function computeConfidence(
  allResults: RuleResult[],
  requiredCount: number
): number {
  if (requiredCount === 0) return 100;
  const passCount = allResults.filter(r => r.status === 'pass').length;
  return Math.round((passCount / requiredCount) * 100);
}

// ─────────────────────────────────────────────────────────────────
// SCHEME EVALUATOR — Full classification
// Returns one of: full match, potential, partial, or null (no match)
// ─────────────────────────────────────────────────────────────────
type SchemeEvalResult =
  | { type: 'match';     data: MatchedScheme }
  | { type: 'potential'; data: PotentialMatch }
  | { type: 'partial';   data: PartialMatch }
  | { type: 'none' };

export function evaluateScheme(
  scheme: Scheme & { rules: EligibilityRule[] },
  profile: UserProfile
): SchemeEvalResult {
  const requiredRules = scheme.rules.filter(r => r.isRequired);
  const allResults: RuleResult[] = scheme.rules.map(r => evaluateRule(r, profile));

  const requiredResults = allResults.filter((_, i) => scheme.rules[i].isRequired);

  const hardFails    = requiredResults.filter(r => r.status === 'fail_hard');
  const missingFails = requiredResults.filter(r => r.status === 'fail_missing');
  const passes       = requiredResults.filter(r => r.status === 'pass');

  const baseSchemeInfo = {
    id:              scheme.id,
    name:            scheme.name,
    nameHi:          scheme.nameHi,
    slug:            scheme.slug,
    category:        scheme.category,
    benefitSummary:  scheme.benefitSummary,
    benefitSummaryHi: scheme.benefitSummaryHi,
    benefitAmount:   scheme.benefitAmount,
    applicationUrl:  scheme.applicationUrl,
  };

  // ── FULL MATCH: zero hard fails, zero missing fails ──────────
  if (hardFails.length === 0 && missingFails.length === 0) {
    return {
      type: 'match',
      data: {
        ...baseSchemeInfo,
        description:   scheme.description,
        descriptionHi: scheme.descriptionHi,
        ministry:      scheme.ministry,
        isCentral:     scheme.isCentral,
        matchedRules:  requiredResults.filter(r => r.passed),
        confidenceScore: computeConfidence(allResults, requiredRules.length),
      },
    };
  }

  // ── POTENTIAL MATCH: zero hard fails, some missing fields ────
  // If the user provides the missing fields, they might fully qualify
  if (hardFails.length === 0 && missingFails.length > 0) {
    return {
      type: 'potential',
      data: {
        ...baseSchemeInfo,
        missingFields: missingFails.map(r => r.field),
        passedCount:   passes.length,
        totalRequired: requiredRules.length,
      },
    };
  }

  // ── PARTIAL MATCH: 1 hard fail but > 60% rules pass ─────────
  // User is "close" — worth showing with explanation
  const matchPct = Math.round((passes.length / requiredRules.length) * 100);
  if (hardFails.length === 1 && matchPct >= 60) {
    return {
      type: 'partial',
      data: {
        ...baseSchemeInfo,
        passedCount:     passes.length,
        totalRequired:   requiredRules.length,
        matchPercentage: matchPct,
        failedRules:     hardFails,
      },
    };
  }

  return { type: 'none' };
}

// ─────────────────────────────────────────────────────────────────
// PROFILE COMPLETENESS SCORE
// Rewards filling optional fields that unlock more schemes
// ─────────────────────────────────────────────────────────────────
const PROFILE_FIELDS = [
  // Required (weight 2 each)
  { field: 'age',           weight: 2 },
  { field: 'gender',        weight: 2 },
  { field: 'state',         weight: 2 },
  { field: 'caste',         weight: 2 },
  { field: 'occupation',    weight: 2 },
  { field: 'annualIncome',  weight: 2 },
  // Optional (weight 1 each)
  { field: 'isBplHousehold',      weight: 1 },
  { field: 'hasRationCard',       weight: 1 },
  { field: 'hasBankAccount',      weight: 1 },
  { field: 'isCurrentlyStudying', weight: 1 },
  { field: 'landAreaAcres',       weight: 1 },
  { field: 'isMarried',           weight: 1 },
];

export function computeProfileCompleteness(profile: UserProfile): number {
  const profileMap = profile as unknown as Record<string, unknown>;
  let earned = 0;
  let total = 0;

  for (const { field, weight } of PROFILE_FIELDS) {
    total += weight;
    const val = profileMap[field];
    if (val !== undefined && val !== null && val !== '') {
      earned += weight;
    }
  }

  return Math.round((earned / total) * 100);
}

// ─────────────────────────────────────────────────────────────────
// GLOBAL MISSING FIELDS
// Which profile fields, if filled, would unlock the most schemes
// ─────────────────────────────────────────────────────────────────
export function findGlobalMissingFields(
  potentialMatches: PotentialMatch[]
): string[] {
  const fieldCount: Record<string, number> = {};

  for (const pm of potentialMatches) {
    for (const field of pm.missingFields) {
      fieldCount[field] = (fieldCount[field] || 0) + 1;
    }
  }

  // Sort by how many schemes each field would unlock, return top 5
  return Object.entries(fieldCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([field]) => field);
}

// ─────────────────────────────────────────────────────────────────
// MAIN ENTRY POINT — runs all schemes, classifies results
// ─────────────────────────────────────────────────────────────────
export interface FullEligibilityResult {
  matches:          MatchedScheme[];
  potentialMatches: PotentialMatch[];
  partialMatches:   PartialMatch[];
  missingFields:    string[];
  profileCompleteness: number;
}

export function checkEligibility(
  schemes: Array<Scheme & { rules: EligibilityRule[] }>,
  profile: UserProfile
): FullEligibilityResult {
  const matches:          MatchedScheme[]  = [];
  const potentialMatches: PotentialMatch[] = [];
  const partialMatches:   PartialMatch[]   = [];

  for (const scheme of schemes) {
    const result = evaluateScheme(scheme, profile);

    if (result.type === 'match')     matches.push(result.data);
    if (result.type === 'potential') potentialMatches.push(result.data);
    if (result.type === 'partial')   partialMatches.push(result.data);
  }

  return {
    matches,
    potentialMatches,
    partialMatches,
    missingFields:       findGlobalMissingFields(potentialMatches),
    profileCompleteness: computeProfileCompleteness(profile),
  };
}