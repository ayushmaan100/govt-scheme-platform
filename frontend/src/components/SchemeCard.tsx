// src/components/SchemeCard.tsx

'use client';

import { useState } from 'react';
import { MatchedScheme } from '@/types';
import { CategoryBadge } from './CategoryBadge';
import { ChevronDown, ExternalLink, CheckCircle2, IndianRupee } from 'lucide-react';
import { ConfidenceBadge } from './ConfidenceBadge';


interface Props {
  scheme: MatchedScheme;
  index: number;
  isHindi: boolean;
}

export function SchemeCard({ scheme, index, isHindi }: Props) {
  const [expanded, setExpanded] = useState(false);

  const name = isHindi && scheme.nameHi ? scheme.nameHi : scheme.name;
  const description = isHindi && scheme.descriptionHi ? scheme.descriptionHi : scheme.description;
  const benefit = isHindi && scheme.benefitSummaryHi ? scheme.benefitSummaryHi : scheme.benefitSummary;

  return (
    <div
      className="opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
    >
      <div className="
        group relative rounded-2xl border border-white/8 bg-white/[0.03]
        hover:bg-white/[0.055] hover:border-saffron-500/30
        transition-all duration-300 overflow-hidden
      ">
        {/* Saffron glow accent on hover */}
        <div className="
          absolute inset-x-0 top-0 h-px
          bg-gradient-to-r from-transparent via-saffron-500/60 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        " />

        <div className="p-5">
          {/* Header Row */}
          {/* Header Row */}
<div className="flex items-start justify-between gap-3 mb-3">
  <div className="flex-1 min-w-0">
    <div className="flex flex-wrap items-center gap-2 mb-2">
      <CategoryBadge category={scheme.category} />
      {scheme.isCentral && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-saffron-500/10 text-saffron-400 border border-saffron-500/20 font-medium">
          Central
        </span>
      )}
      <ConfidenceBadge score={scheme.confidenceScore} />  {/* ← NEW */}
    </div>
    <h3 className={`font-semibold text-white leading-snug ${isHindi && scheme.nameHi ? 'font-hindi text-base' : 'text-[15px]'}`}>
      {name}
    </h3>
  </div>
  {scheme.benefitAmount && (
    <div className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20">
      <IndianRupee className="w-3 h-3 text-green-400" />
      <span className="text-xs font-semibold text-green-400 whitespace-nowrap">
        {scheme.benefitAmount}
      </span>
    </div>
  )}
</div>

          {/* Benefit Summary */}
          <p className={`
            text-sm text-slate-400 leading-relaxed mb-4
            ${isHindi && scheme.benefitSummaryHi ? 'font-hindi' : ''}
          `}>
            {benefit}
          </p>

          {/* Why You Qualify — Expandable */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="
              w-full flex items-center justify-between
              text-xs font-medium text-saffron-400 hover:text-saffron-300
              transition-colors group/btn
            "
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              You qualify because ({scheme.matchedRules.length} conditions met)
            </span>
            <ChevronDown className={`
              w-3.5 h-3.5 transition-transform duration-200
              ${expanded ? 'rotate-180' : ''}
            `} />
          </button>

          {/* Expanded Rule Explanations */}
          {expanded && (
            <div className="mt-3 space-y-2 animate-fade-in">
              {scheme.matchedRules.map((rule, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-slate-400 pl-2"
                >
                  <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-saffron-500/70" />
                  <span className={isHindi && rule.descriptionHi ? 'font-hindi' : ''}>
                    {isHindi && rule.descriptionHi ? rule.descriptionHi : rule.description}
                  </span>
                </div>
              ))}

              {/* Description */}
              <p className={`
                mt-3 text-xs text-slate-500 leading-relaxed pt-3 border-t border-white/6
                ${isHindi && scheme.descriptionHi ? 'font-hindi' : ''}
              `}>
                {description}
              </p>
            </div>
          )}
        </div>

        {/* Footer — Apply button */}
        <div className="px-5 pb-5">
          <a
            href={scheme.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2 w-full justify-center
              px-4 py-2.5 rounded-xl
              bg-saffron-500/10 hover:bg-saffron-500/20
              border border-saffron-500/25 hover:border-saffron-500/50
              text-saffron-400 hover:text-saffron-300
              text-sm font-medium
              transition-all duration-200 group/link
            "
          >
            Apply on Official Portal
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}