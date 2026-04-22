// src/app/page.tsx

import Link from 'next/link';
import { ArrowRight, CheckCircle, Users, Shield, Zap } from 'lucide-react';

const STATS = [
  { value: '1000+', label: 'Govt Schemes', labelHi: 'सरकारी योजनाएं' },
  { value: '15+',   label: 'Covered Now',  labelHi: 'अभी उपलब्ध' },
  { value: '100%',  label: 'Free Forever', labelHi: 'हमेशा मुफ्त' },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Matching',
    titleHi: 'तुरंत मिलान',
    desc: 'Fill a 2-minute profile. Get personalized scheme matches instantly.',
    descHi: '2 मिनट का प्रोफाइल भरें। तुरंत योजनाएं पाएं।',
  },
  {
    icon: CheckCircle,
    title: 'Know Why You Qualify',
    titleHi: 'जानें क्यों योग्य हैं',
    desc: 'We explain exactly which conditions you meet for each scheme.',
    descHi: 'हम बताते हैं आप किन शर्तों को पूरा करते हैं।',
  },
  {
    icon: Shield,
    title: 'No Registration',
    titleHi: 'कोई रजिस्ट्रेशन नहीं',
    desc: 'We never store your data. No account, no tracking, no spam.',
    descHi: 'हम आपका डेटा नहीं रखते। कोई खाता नहीं, कोई ट्रैकिंग नहीं।',
  },
  {
    icon: Users,
    title: 'Built for Bharat',
    titleHi: 'भारत के लिए बना',
    desc: 'Supports Hindi. Designed for farmers, students, and workers.',
    descHi: 'हिंदी में उपलब्ध। किसानों, छात्रों और कामगारों के लिए।',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a1628] overflow-hidden">

      {/* Background mesh */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-saffron-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/6 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-saffron-500 flex items-center justify-center text-white font-bold text-sm">
            य
          </div>
          <span className="font-bold text-white text-[15px] tracking-tight">
            YojanaCheck
          </span>
        </div>
        <Link
          href="/check"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron-500/10 border border-saffron-500/25 text-saffron-400 text-sm font-medium hover:bg-saffron-500/20 transition-all"
        >
          Check Eligibility
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-16 pb-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 text-xs font-medium mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-pulse-slow" />
          Free · No registration · Works in Hindi
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-4 animate-fade-up">
          Find Government Schemes
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-saffron-600">
            You Actually Qualify For
          </span>
        </h1>

        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-4 animate-fade-up delay-100">
          Thousands of Indians miss out on free benefits every year —
          not because they don't qualify, but because they never knew.
        </p>

        <p className="font-hindi text-slate-500 text-base mb-10 animate-fade-up delay-200">
          हज़ारों भारतीय हर साल मुफ्त सरकारी योजनाओं से वंचित रह जाते हैं।
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up delay-300">
          <Link
            href="/check"
            className="
              inline-flex items-center justify-center gap-2
              px-7 py-3.5 rounded-xl
              bg-saffron-500 hover:bg-saffron-400
              text-white font-semibold text-sm
              transition-all hover:scale-[1.02] active:scale-[0.98]
              shadow-lg shadow-saffron-500/25
            "
          >
            Check My Eligibility — Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/check"
            className="
              inline-flex items-center justify-center gap-2
              px-7 py-3.5 rounded-xl
              bg-white/5 hover:bg-white/8 border border-white/10
              text-slate-300 font-semibold text-sm font-hindi
              transition-all
            "
          >
            हिंदी में देखें →
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-14 animate-fade-up delay-400">
          {STATS.map(stat => (
            <div key={stat.value} className="text-center">
              <div className="text-2xl font-extrabold text-white">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 pb-24 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="opacity-0 animate-fade-up rounded-2xl border border-white/8 bg-white/[0.025] p-5"
              style={{ animationDelay: `${500 + i * 80}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-9 h-9 rounded-xl bg-saffron-500/10 border border-saffron-500/20 flex items-center justify-center mb-3">
                <f.icon className="w-4 h-4 text-saffron-400" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{f.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              <p className="font-hindi text-slate-600 text-xs mt-1 leading-relaxed">{f.descHi}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}