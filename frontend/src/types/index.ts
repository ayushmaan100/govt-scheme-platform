// src/types/index.ts — REPLACE ENTIRELY
// (same as the backend types — copy them verbatim)

export type RuleStatus = 'pass' | 'fail_hard' | 'fail_missing';

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

export interface RuleResult {
  field: string;
  operator: string;
  status: RuleStatus;
  passed: boolean;
  description: string;
  descriptionHi?: string | null;
}

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
  matchedRules: RuleResult[];
  confidenceScore: number;
}

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
  missingFields: string[];
  passedCount: number;
  totalRequired: number;
}

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
  matchPercentage: number;
  failedRules: RuleResult[];
}

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
  missingProfileFields: string[];
  profileCompleteness: number;
  checkedAt: string;
}