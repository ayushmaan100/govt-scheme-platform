// src/app/check/page.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProfileForm } from '@/components/ProfileForm';
import { ArrowLeft } from 'lucide-react';

export default function CheckPage() {
  const [isHindi, setIsHindi] = useState(false);

  return (
    <main className="min-h-screen bg-[#0a1628]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-saffron-500/6 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-2xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Hindi toggle */}
        <button
          onClick={() => setIsHindi(h => !h)}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
            ${isHindi
              ? 'bg-saffron-500/15 border-saffron-500/40 text-saffron-400'
              : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
            }
          `}
        >
          <span className="font-hindi">{isHindi ? '🇮🇳 हिंदी' : '🇮🇳 हिंदी में'}</span>
        </button>
      </nav>

      {/* Header */}
      <div className="relative z-10 text-center px-6 pt-4 pb-10">
        <h1 className={`text-2xl font-bold text-white mb-2 ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? 'अपनी योग्यता जांचें' : 'Check Your Eligibility'}
        </h1>
        <p className={`text-slate-500 text-sm ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi
            ? '4 आसान चरणों में जानें कौन सी सरकारी योजनाएं आपके लिए हैं'
            : 'Answer 4 simple steps to find schemes meant for you'}
        </p>
      </div>

      {/* Form */}
      <div className="relative z-10 px-4 pb-20">
        <ProfileForm isHindi={isHindi} />
      </div>
    </main>
  );
}