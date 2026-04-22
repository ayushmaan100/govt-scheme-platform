// src/lib/api.ts

import { UserProfile, EligibilityResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function checkEligibility(
  profile: UserProfile
): Promise<EligibilityResponse> {
  const response = await fetch(`${API_BASE}/api/v1/eligibility/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to check eligibility');
  }

  return response.json();
}