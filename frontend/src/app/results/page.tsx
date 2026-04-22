// src/app/results/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EligibilityResponse } from '@/types';
import { SchemeCard } from '@/components/SchemeCard';
import { CategoryBadge } from '@/components/CategoryBadge';
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

// ── Category filter tabs ────────────────────────────────
const ALL = 'all';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult]   = useState<EligibilityResponse | null>(null);
  const [isHindi, setIsHindi] = useState(false);
  const [filter, setFilter]   = useState<string>(ALL);

  useEffect(() => {
    const raw = sessionStorage.getItem('eligibility_result');
    const hi  = sessionStorage.getItem('eligibility_hindi');
    if (!raw) { router.push('/check'); return; }
    setResult(JSON.parse(raw));
    setIsHindi(hi === 'true');
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-saffron-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Unique categories in results
  const categories = [ALL, ...new Set(result.schemes.map(s => s.category))];

  const filtered = filter === ALL
    ? result.schemes
    : result.schemes.filter(s => s.category === filter);

  const missed = result.totalSchemesChecked - result.matchedCount;

  return (
    <main className="min-h-screen bg-[#0a1628]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-saffron-500/5 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-3xl mx-auto">
        <Link
          href="/check"
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {isHindi ? 'वापस' : 'Back'}
        </Link>
        <button
          onClick={() => setIsHindi(h => !h)}
          className={`
            px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
            ${isHindi
              ? 'bg-saffron-500/15 border-saffron-500/40 text-saffron-400'
              : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
            }
          `}
        >
          <span className="font-hindi">{isHindi ? '🇮🇳 हिंदी' : '🇮🇳 हिंदी में'}</span>
        </button>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-4 pb-24">

        {/* Summary Banner */}
        <div className="
          rounded-2xl border border-white/8 bg-white/[0.03]
          p-6 mb-6 animate-fade-up
        ">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className={`text-2xl font-extrabold text-white mb-1 ${isHindi ? 'font-hindi' : ''}`}>
                {result.matchedCount > 0
                  ? (isHindi ? `${result.matchedCount} योजनाएं मिलीं!` : `${result.matchedCount} Schemes Found!`)
                  : (isHindi ? 'कोई योजना नहीं मिली' : 'No Matching Schemes')
                }
              </h1>
              <p className={`text-slate-400 text-sm ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi
                  ? `${result.totalSchemesChecked} योजनाओं में से ${result.matchedCount} आपके लिए हैं`
                  : `Out of ${result.totalSchemesChecked} schemes checked`}
              </p>
            </div>

            {/* Score circle */}
            <div className="shrink-0 relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                <circle
                  cx="28" cy="28" r="24" fill="none"
                  stroke="#f06200" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(result.matchedCount / result.totalSchemesChecked) * 150.8} 150.8`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-saffron-400">
                  {Math.round((result.matchedCount / result.totalSchemesChecked) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-white/6">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">{result.matchedCount}</span>
              <span className={`text-slate-500 ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? 'योग्य' : 'Eligible'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <XCircle className="w-4 h-4 text-slate-600" />
              <span className="text-slate-500 font-medium">{missed}</span>
              <span className={`text-slate-500 ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? 'अयोग्य' : 'Not matched'}
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-slate-600 bg-white/[0.02] border border-white/6 rounded-xl px-4 py-3 mb-6 leading-relaxed">
          ⚠️ {isHindi
            ? 'यह एक प्रारंभिक जांच है। अंतिम पात्रता सरकारी नियमों पर निर्भर करती है। आवेदन करने से पहले आधिकारिक पोर्टल पर सत्यापित करें।'
            : 'This is a preliminary check. Final eligibility depends on official government criteria. Always verify on the official portal before applying.'}
        </div>

        {/* Category Filter Tabs */}
        {result.matchedCount > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
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
                {cat === ALL ? (isHindi ? 'सभी' : 'All') : <CategoryBadge category={cat} />}
              </button>
            ))}
          </div>
        )}

        {/* Scheme Cards */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((scheme, i) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                index={i}
                isHindi={isHindi}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className={`text-lg font-semibold text-white mb-2 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'इस श्रेणी में कोई योजना नहीं' : 'No schemes in this category'}
            </h3>
            <p className={`text-slate-500 text-sm ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'अन्य श्रेणियां देखें' : 'Try another category filter'}
            </p>
          </div>
        )}

        {/* Check Again CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/check"
            className="
              inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20
              text-slate-400 hover:text-white text-sm font-medium
              transition-all
            "
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {isHindi ? 'फिर से जांचें' : 'Check with different details'}
          </Link>
        </div>
      </div>
    </main>
  );
}