// src/app/results/page.tsx — REPLACE ENTIRELY

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EligibilityResponse } from '@/types';
import { SchemeCard } from '@/components/SchemeCard';
import { PotentialMatchCard } from '@/components/PotentialMatchCard';
import { PartialMatchCard } from '@/components/PartialMatchCard';
import { CategoryBadge } from '@/components/CategoryBadge';
import { ProfileCompleteness } from '@/components/ProfileCompleteness';
import { SkeletonResults } from '@/components/SkeletonCard';
import {
  ArrowLeft, RotateCcw, CheckCircle2, Search,
  ChevronDown, Sparkles, AlertTriangle,
} from 'lucide-react';

const ALL = 'all';

export default function ResultsPage() {
  const router = useRouter();
  const [result,   setResult]   = useState<EligibilityResponse | null>(null);
  const [isHindi,  setIsHindi]  = useState(false);
  const [filter,   setFilter]   = useState(ALL);
  const [search,   setSearch]   = useState('');
  const [showPartials, setShowPartials] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('eligibility_result');
    const hi  = sessionStorage.getItem('eligibility_hindi');
    if (!raw) { router.push('/check'); return; }
    setResult(JSON.parse(raw));
    setIsHindi(hi === 'true');
  }, [router]);

  const handleFillFields = useCallback((_fields: string[]) => {
    router.push('/check');
  }, [router]);

  if (!result) return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      <SkeletonResults />
    </div>
  );

  // Filter + search
  const categories = [ALL, ...new Set(result.schemes.map(s => s.category))];

  const filteredSchemes = result.schemes
    .filter(s => filter === ALL || s.category === filter)
    .filter(s => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.benefitSummary.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    });

  return (
    <main className="min-h-screen bg-[#0a1628]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-saffron-500/5 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-3xl mx-auto">
        <Link href="/check" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {isHindi ? 'वापस' : 'Back'}
        </Link>
        <button
          onClick={() => setIsHindi(h => !h)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${isHindi ? 'bg-saffron-500/15 border-saffron-500/40 text-saffron-400' : 'bg-white/5 border-white/10 text-slate-400'}`}
        >
          <span className="font-hindi">{isHindi ? '🇮🇳 हिंदी' : '🇮🇳 हिंदी में'}</span>
        </button>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-4 pb-24">

        {/* ── Summary Banner ─────────────────────────── */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 mb-5 animate-fade-up">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className={`text-2xl font-extrabold text-white mb-1 ${isHindi ? 'font-hindi' : ''}`}>
                {result.matchedCount > 0
                  ? (isHindi ? `${result.matchedCount} योजनाएं मिलीं!` : `${result.matchedCount} Schemes Found!`)
                  : (isHindi ? 'कोई पूर्ण मिलान नहीं' : 'No Full Matches')}
              </h1>
              <p className={`text-slate-400 text-sm ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi
                  ? `${result.totalSchemesChecked} योजनाओं की जाँच हुई`
                  : `Out of ${result.totalSchemesChecked} schemes checked`}
              </p>
            </div>
            {/* Score ring */}
            <div className="shrink-0 relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                <circle cx="28" cy="28" r="24" fill="none" stroke="#f06200" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${(result.matchedCount / result.totalSchemesChecked) * 150.8} 150.8`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-saffron-400">
                  {Math.round((result.matchedCount / result.totalSchemesChecked) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* 3 stat pills */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/8 border border-green-500/15">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs text-green-400 font-medium">
                {result.matchedCount} {isHindi ? 'पूर्ण मिलान' : 'Full Matches'}
              </span>
            </div>
            {result.potentialCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/8 border border-amber-500/15">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-amber-400 font-medium">
                  {result.potentialCount} {isHindi ? 'संभावित' : 'Potential'}
                </span>
              </div>
            )}
            {result.partialCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-500/8 border border-slate-500/15">
                <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-400 font-medium">
                  {result.partialCount} {isHindi ? 'आंशिक' : 'Partial'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Profile Completeness ─────────────────── */}
        <ProfileCompleteness
          score={result.profileCompleteness}
          missingFields={result.missingProfileFields}
          isHindi={isHindi}
          onImprove={() => router.push('/check')}
        />

        {/* ── Disclaimer ───────────────────────────── */}
        <p className="text-xs text-slate-600 bg-white/[0.02] border border-white/6 rounded-xl px-4 py-3 mb-6 leading-relaxed">
          ⚠️ {isHindi
            ? 'यह प्रारंभिक जाँच है। अंतिम पात्रता सरकारी नियमों पर निर्भर करती है।'
            : 'Preliminary check only. Verify eligibility on official portals before applying.'}
        </p>

        {/* ── SECTION 1: Full Matches ──────────────── */}
        {result.matchedCount > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <h2 className={`font-bold text-white ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? 'आप इनके लिए योग्य हैं' : 'You Qualify For These'}
              </h2>
              <span className="ml-auto text-xs text-slate-500">{result.matchedCount} schemes</span>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
              <input
                type="text"
                placeholder={isHindi ? 'योजना खोजें...' : 'Search schemes...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="
                  w-full pl-9 pr-4 py-2.5 rounded-xl
                  bg-white/5 border border-white/8
                  text-sm text-white placeholder-slate-600
                  focus:border-saffron-500/40 outline-none transition-all
                "
              />
            </div>

            {/* Category filter */}
            {categories.length > 2 && (
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`
                      shrink-0 px-3 py-1.5 rounded-full border text-xs font-medium transition-all
                      ${filter === cat
                        ? 'bg-saffron-500/15 border-saffron-500/40 text-saffron-400'
                        : 'bg-white/[0.03] border-white/8 text-slate-500 hover:border-white/15'
                      }
                    `}
                  >
                    {cat === ALL
                      ? (isHindi ? 'सभी' : 'All')
                      : <CategoryBadge category={cat} />}
                  </button>
                ))}
              </div>
            )}

            {/* Cards */}
            <div className="space-y-3">
              {filteredSchemes.length > 0
                ? filteredSchemes.map((scheme, i) => (
                    <SchemeCard key={scheme.id} scheme={scheme} index={i} isHindi={isHindi} />
                  ))
                : (
                  <div className="text-center py-10 text-slate-600 text-sm">
                    {isHindi ? 'कोई परिणाम नहीं' : 'No results for this search'}
                  </div>
                )
              }
            </div>
          </section>
        )}

        {/* ── SECTION 2: Potential Matches ─────────── */}
        {result.potentialCount > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className={`font-bold text-white ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? 'अधूरी जानकारी से रुके हुए' : 'Unlockable With More Info'}
              </h2>
              <span className="ml-auto text-xs text-slate-500">{result.potentialCount}</span>
            </div>
            <p className={`text-xs text-slate-500 mb-4 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi
                ? 'ये योजनाएं आपके लिए हो सकती हैं — बस कुछ जानकारी और चाहिए'
                : 'These schemes could be yours — we just need a few more details'}
            </p>
            <div className="space-y-3">
              {result.potentialMatches.map((m, i) => (
                <PotentialMatchCard
                  key={m.id} match={m} index={i}
                  isHindi={isHindi} onFillFields={handleFillFields}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── SECTION 3: Partial Matches (collapsible) ─ */}
        {result.partialCount > 0 && (
          <section className="mb-10">
            <button
              onClick={() => setShowPartials(p => !p)}
              className="w-full flex items-center justify-between mb-3 group"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-slate-500" />
                <h2 className={`font-bold text-slate-400 group-hover:text-white transition-colors ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'लगभग योग्य (1 शर्त नहीं मिली)' : 'Almost Qualified (1 condition failed)'}
                </h2>
                <span className="text-xs text-slate-600">{result.partialCount}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${showPartials ? 'rotate-180' : ''}`} />
            </button>

            {showPartials && (
              <div className="space-y-3 animate-fade-in">
                {result.partialMatches.map((m, i) => (
                  <PartialMatchCard key={m.id} match={m} index={i} isHindi={isHindi} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Zero state ───────────────────────────── */}
        {result.matchedCount === 0 && result.potentialCount === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className={`text-lg font-semibold text-white mb-2 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'इस प्रोफाइल से कोई योजना नहीं मिली' : 'No schemes matched your profile'}
            </h3>
            <p className={`text-slate-500 text-sm mb-6 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'प्रोफाइल बदलकर दोबारा जाँचें' : 'Try updating your profile details'}
            </p>
          </div>
        )}

        {/* ── Check Again CTA ──────────────────────── */}
        <div className="text-center mt-6">
          <Link
            href="/check"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/8 border border-white/10 text-slate-400 hover:text-white text-sm font-medium transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isHindi ? 'फिर से जाँचें' : 'Check with different details'}
          </Link>
        </div>
      </div>
    </main>
  );
}