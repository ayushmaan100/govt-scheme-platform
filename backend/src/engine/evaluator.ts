// src/engine/evaluator.ts

import { Scheme, EligibilityRule } from '@prisma/client';
import { UserProfile, RuleResult, MatchedScheme } from '../types';

// ─────────────────────────────────────────────────────────────────
// RULE EVALUATOR
// Takes ONE rule and the user profile
// Returns whether the rule passed and the explanation
// ─────────────────────────────────────────────────────────────────
export function evaluateRule(
  rule: EligibilityRule,
  profile: UserProfile
): RuleResult {
  const base: Omit<RuleResult, 'passed'> = {
    field: rule.field,
    operator: rule.operator,
    description: rule.description,
    descriptionHi: rule.descriptionHi,
  };

  // Get the user's value for this field
  // e.g., if rule.field = "age", we get profile.age
  const userValue = (profile as unknown as Record<string, unknown>)[rule.field];

  // If user didn't provide this field, rule cannot be evaluated
  // We treat missing data as "unknown" — rule fails for required fields
  if (userValue === undefined || userValue === null) {
    return { ...base, passed: false };
  }

  const ruleValue = rule.value; // This is Json type from Prisma

  // ─────────────────────────────────────────
  // OPERATOR: "eq" — exact equality
  // Example: occupation must equal "farmer"
  // rule.value: "farmer"
  // ─────────────────────────────────────────
  if (rule.operator === 'eq') {
    const passed = userValue === ruleValue;
    return { ...base, passed };
  }

  // ─────────────────────────────────────────
  // OPERATOR: "gte" — greater than or equal
  // Example: age must be >= 18
  // rule.value: 18
  // ─────────────────────────────────────────
  if (rule.operator === 'gte') {
    const passed = Number(userValue) >= Number(ruleValue);
    return { ...base, passed };
  }

  // ─────────────────────────────────────────
  // OPERATOR: "lte" — less than or equal
  // Example: annual_income must be <= 200000
  // rule.value: 200000
  // ─────────────────────────────────────────
  if (rule.operator === 'lte') {
    const passed = Number(userValue) <= Number(ruleValue);
    return { ...base, passed };
  }

  // ─────────────────────────────────────────
  // OPERATOR: "in" — value must be in a list
  // Example: caste must be in ["SC", "ST", "OBC"]
  // rule.value: ["SC", "ST", "OBC"]
  // ─────────────────────────────────────────
  if (rule.operator === 'in') {
    const allowedValues = ruleValue as string[];
    const passed = Array.isArray(allowedValues) && allowedValues.includes(String(userValue));
    return { ...base, passed };
  }

  // ─────────────────────────────────────────
  // OPERATOR: "between" — value must be in range
  // Example: age must be between 18 and 40
  // rule.value: { "min": 18, "max": 40 }
  // ─────────────────────────────────────────
  if (rule.operator === 'between') {
    const range = ruleValue as { min: number; max: number };
    const num = Number(userValue);
    const passed = num >= range.min && num <= range.max;
    return { ...base, passed };
  }

  // ─────────────────────────────────────────
  // OPERATOR: "is_true" — boolean check
  // Example: user must currently be studying
  // rule.value: true  (means: field must be true)
  // ─────────────────────────────────────────
  if (rule.operator === 'is_true') {
    const passed = userValue === true;
    return { ...base, passed };
  }

  // ─────────────────────────────────────────
  // OPERATOR: "is_false" — negative boolean
  // Example: must not have a pucca house
  // ─────────────────────────────────────────
  if (rule.operator === 'is_false') {
    const passed = userValue === false;
    return { ...base, passed };
  }

  // ─────────────────────────────────────────
  // OPERATOR: "not_in" — value must NOT be in list
  // Example: state must not be in excluded states
  // ─────────────────────────────────────────
  if (rule.operator === 'not_in') {
    const excludedValues = ruleValue as string[];
    const passed = !excludedValues.includes(String(userValue));
    return { ...base, passed };
  }

  // Unknown operator — fail safely
  console.warn(`Unknown operator: ${rule.operator} for rule ${rule.id}`);
  return { ...base, passed: false };
}


// ─────────────────────────────────────────────────────────────────
// SCHEME EVALUATOR
// Takes ONE scheme (with its rules) and the user profile
// Returns null if not matched, or MatchedScheme if matched
// ─────────────────────────────────────────────────────────────────
export function evaluateScheme(
  scheme: Scheme & { rules: EligibilityRule[] },
  profile: UserProfile
): MatchedScheme | null {

  const ruleResults: RuleResult[] = [];
  
  // Evaluate every rule for this scheme
  for (const rule of scheme.rules) {
    const result = evaluateRule(rule, profile);
    ruleResults.push(result);

    // If a REQUIRED rule fails → scheme is not a match
    // Short-circuit: no need to check remaining rules
    if (rule.isRequired && !result.passed) {
      return null;
    }
  }

  // All required rules passed → scheme is matched!
  return {
    id: scheme.id,
    name: scheme.name,
    nameHi: scheme.nameHi,
    slug: scheme.slug,
    category: scheme.category,
    description: scheme.description,
    descriptionHi: scheme.descriptionHi,
    benefitSummary: scheme.benefitSummary,
    benefitSummaryHi: scheme.benefitSummaryHi,
    benefitAmount: scheme.benefitAmount,
    applicationUrl: scheme.applicationUrl,
    ministry: scheme.ministry,
    isCentral: scheme.isCentral,
    matchedRules: ruleResults.filter(r => r.passed), // only passing rules for explanation
  };
}


// ─────────────────────────────────────────────────────────────────
// MAIN ELIGIBILITY CHECKER
// Runs user profile against ALL schemes
// Returns list of matched schemes
// ─────────────────────────────────────────────────────────────────
export function checkEligibility(
  schemes: Array<Scheme & { rules: EligibilityRule[] }>,
  profile: UserProfile
): MatchedScheme[] {
  
  const matched: MatchedScheme[] = [];

  for (const scheme of schemes) {
    const result = evaluateScheme(scheme, profile);
    if (result !== null) {
      matched.push(result);
    }
  }

  return matched;
}