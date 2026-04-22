// backend/src/engine/schemeCache.ts

import { prisma } from '../db/client';
import { Scheme, EligibilityRule } from '@prisma/client';

type SchemeWithRules = Scheme & { rules: EligibilityRule[] };

// ─────────────────────────────────────────────────────────────────
// Simple in-memory TTL cache
// Schemes change rarely — refreshing every 10 minutes is plenty
// In production you'd use Redis, but this is perfectly fine for MVP
// ─────────────────────────────────────────────────────────────────
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

let cachedSchemes: SchemeWithRules[] | null = null;
let cacheTimestamp = 0;

export async function getSchemesFromCache(): Promise<SchemeWithRules[]> {
  const now = Date.now();

  // Cache hit: return immediately
  if (cachedSchemes && (now - cacheTimestamp) < CACHE_TTL_MS) {
    return cachedSchemes;
  }

  // Cache miss or expired: fetch from DB
  console.log('[Cache] Refreshing scheme cache from database...');
  const schemes = await prisma.scheme.findMany({
    where: { isActive: true },
    include: { rules: { where: { isRequired: true } } },
  });

  cachedSchemes = schemes;
  cacheTimestamp = now;

  console.log(`[Cache] Loaded ${schemes.length} schemes`);
  return schemes;
}

// Call this when schemes are updated (e.g., after admin adds a scheme)
export function invalidateCache(): void {
  cachedSchemes = null;
  cacheTimestamp = 0;
  console.log('[Cache] Scheme cache invalidated');
}