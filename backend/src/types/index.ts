// src/types/index.ts

// ─────────────────────────────────────────
// USER PROFILE — what the frontend sends us
// ─────────────────────────────────────────
export interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  state: string;                              // e.g., "UP", "MH", "RJ"
  caste: 'general' | 'SC' | 'ST' | 'OBC';
  occupation: 'farmer' | 'student' | 'worker' | 'unemployed' | 'self_employed' | 'other';
  annualIncome: number;                       // in rupees
  isCurrentlyStudying?: boolean;
  landAreaAcres?: number;                     // for farmers
  isMarried?: boolean;
  hasRationCard?: boolean;
  rationCardType?: 'BPL' | 'APL' | 'AAY' | null;
  isBplHousehold?: boolean;
  hasBankAccount?: boolean;
  isDisabled?: boolean;
  disabilityPercentage?: number;
}

// ─────────────────────────────────────────
// RULE EVALUATION RESULT
// ─────────────────────────────────────────
export interface RuleResult {
  field: string;
  operator: string;
  passed: boolean;
  description: string;
  descriptionHi?: string | null;
}

// ─────────────────────────────────────────
// MATCHED SCHEME — what we return to frontend
// ─────────────────────────────────────────
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
  matchedRules: RuleResult[];    // rules that passed (for explanation)
}

// ─────────────────────────────────────────
// API RESPONSE SHAPE
// ─────────────────────────────────────────
export interface EligibilityResponse {
  success: boolean;
  profile: UserProfile;
  totalSchemesChecked: number;
  matchedCount: number;
  schemes: MatchedScheme[];
  checkedAt: string;
}