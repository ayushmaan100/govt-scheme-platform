// src/types/index.ts

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
}

export interface EligibilityResponse {
  success: boolean;
  profile: UserProfile;
  totalSchemesChecked: number;
  matchedCount: number;
  schemes: MatchedScheme[];
  checkedAt: string;
}