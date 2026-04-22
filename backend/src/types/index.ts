// backend/src/types/index.ts  — REPLACE ENTIRELY

export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  state: string;
  caste: 'general' | 'SC' | 'ST' | 'OBC';
  occupation: 'farmer' | 'student' | 'worker' | 'unemployed' | 'self_employed' | 'other';
  annualIncome: number;
  isCurrentlyStudying?: boolean;
  landAreaAcres?: number;
  isMarried?: boolean;
  hasRationCard?: boolean;
  rationCardType?: 'BPL' | 'APL' | 'AAY' | null;
  isBplHousehold?: boolean;
  hasBankAccount?: boolean;
  isDisabled?: boolean;
  disabilityPercentage?: number;
}

// ─────────────────────────────────────────────────────
// NEW in Phase 2: 3-state rule evaluation
//
//   pass         → condition is met. Include in "why you qualify"
//   fail_hard    → condition is definitively NOT met. Scheme is not a match
//   fail_missing → user didn't provide this field. We don't know.
//                  This is the key insight — we can ask the user for it!
// ─────────────────────────────────────────────────────
export type RuleStatus = 'pass' | 'fail_hard' | 'fail_missing';

export interface RuleResult {
  field: string;
  operator: string;
  status: RuleStatus;
  passed: boolean;               // true only if status === 'pass'
  description: string;
  descriptionHi?: string | null;
  userValue?: unknown;           // what the user provided (for debugging)
}

// ─────────────────────────────────────────────────────
// FULL MATCH: all required rules = pass
// ─────────────────────────────────────────────────────
export interface MatchedScheme {
  id: string;
  name: string;
  nameHi?: string | null;
  slug: string;
  category: string;
  description: string;
  descriptionHi?: string | null;
  benefitSummary: string;
  benefitSummaryHi?: string | null;
  benefitAmount?: string | null;
  applicationUrl: string;
  ministry?: string | null;
  isCentral: boolean;
  matchedRules: RuleResult[];     // rules that passed
  confidenceScore: number;        // NEW: 0–100, based on field completeness
}

// ─────────────────────────────────────────────────────
// POTENTIAL MATCH: would fully match if missing fields were provided
// All failures are fail_missing — not a single fail_hard
// ─────────────────────────────────────────────────────
export interface PotentialMatch {
  id: string;
  name: string;
  nameHi?: string | null;
  slug: string;
  category: string;
  benefitSummary: string;
  benefitSummaryHi?: string | null;
  benefitAmount?: string | null;
  applicationUrl: string;
  missingFields: string[];        // fields we need from the user
  passedCount: number;
  totalRequired: number;
}

// ─────────────────────────────────────────────────────
// PARTIAL MATCH: mostly qualifies, one rule fails hard
// Show as "almost qualifies" — don't hide, it's useful info
// ─────────────────────────────────────────────────────
export interface PartialMatch {
  id: string;
  name: string;
  nameHi?: string | null;
  slug: string;
  category: string;
  benefitSummary: string;
  benefitSummaryHi?: string | null;
  benefitAmount?: string | null;
  applicationUrl: string;
  passedCount: number;
  totalRequired: number;
  matchPercentage: number;        // e.g., 75 means 3/4 rules passed
  failedRules: RuleResult[];      // the rules that failed — explains why not
}

// ─────────────────────────────────────────────────────
// FULL API RESPONSE — Phase 2
// ─────────────────────────────────────────────────────
export interface EligibilityResponse {
  success: boolean;
  profile: UserProfile;
  totalSchemesChecked: number;
  matchedCount: number;
  potentialCount: number;
  partialCount: number;
  schemes: MatchedScheme[];
  potentialMatches: PotentialMatch[];
  partialMatches: PartialMatch[];
  missingProfileFields: string[];  // global: fields that would unlock more schemes
  profileCompleteness: number;     // 0–100 score
  checkedAt: string;
}