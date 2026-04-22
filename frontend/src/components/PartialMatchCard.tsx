// src/components/PartialMatchCard.tsx

'use client';
import { PartialMatch } from '@/types';
import { CategoryBadge } from './CategoryBadge';
import { XCircle } from 'lucide-react';

interface Props {
  match: PartialMatch;
  index: number;
  isHindi: boolean;
}

export function PartialMatchCard({ match, index, isHindi }: Props) {
  const name    = isHindi && match.nameHi    ? match.nameHi    : match.name;
  const benefit = isHindi && match.benefitSummaryHi ? match.benefitSummaryHi : match.benefitSummary;

  return (
    <div
      className="opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
    >
      <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-4">
        <div className="flex items-start gap-3">
          {/* Progress ring */}
          <div className="shrink-0 relative w-10 h-10">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${(match.matchPercentage / 100) * 87.96} 87.96`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] font-bold text-amber-400">{match.matchPercentage}%</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CategoryBadge category={match.category} size="sm" />
            </div>
            <h4 className={`text-sm font-medium text-white/70 leading-snug mb-1 ${isHindi && match.nameHi ? 'font-hindi' : ''}`}>
              {name}
            </h4>
            <p className={`text-xs text-slate-600 mb-2 ${isHindi && match.benefitSummaryHi ? 'font-hindi' : ''}`}>
              {benefit}
            </p>

            {/* Why not qualifying */}
            {match.failedRules.map((rule, i) => (
              <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                <XCircle className="w-3 h-3 text-red-500/50 mt-0.5 shrink-0" />
                <span className={isHindi && rule.descriptionHi ? 'font-hindi' : ''}>
                  {isHindi && rule.descriptionHi ? rule.descriptionHi : rule.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}