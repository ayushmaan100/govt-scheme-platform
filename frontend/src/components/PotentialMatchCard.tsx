// src/components/PotentialMatchCard.tsx

'use client';
import { PotentialMatch } from '@/types';
import { getFieldLabel } from '@/lib/fieldLabels';
import { CategoryBadge } from './CategoryBadge';
import { ExternalLink, HelpCircle } from 'lucide-react';

interface Props {
  match: PotentialMatch;
  index: number;
  isHindi: boolean;
  onFillFields: (fields: string[]) => void;
}

export function PotentialMatchCard({ match, index, isHindi, onFillFields }: Props) {
  const name    = isHindi && match.nameHi    ? match.nameHi    : match.name;
  const benefit = isHindi && match.benefitSummaryHi ? match.benefitSummaryHi : match.benefitSummary;

  return (
    <div
      className="opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
    >
      <div className="
        group relative rounded-2xl border border-amber-500/15 bg-amber-500/[0.03]
        hover:border-amber-500/30 transition-all duration-300 overflow-hidden
      ">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CategoryBadge category={match.category} />
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {isHindi ? 'संभावित' : 'Potential'}
                </span>
              </div>
              <h3 className={`font-semibold text-white/80 text-sm leading-snug ${isHindi && match.nameHi ? 'font-hindi' : ''}`}>
                {name}
              </h3>
            </div>
          </div>

          <p className={`text-xs text-slate-500 mb-4 ${isHindi && match.benefitSummaryHi ? 'font-hindi' : ''}`}>
            {benefit}
          </p>

          {/* Missing fields */}
          <div className="flex items-start gap-2 mb-4 p-3 rounded-xl bg-amber-500/8 border border-amber-500/15">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className={`text-xs text-amber-400 font-medium mb-1 ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? 'ये जानकारी दें ताकि हम जाँच कर सकें:' : 'Provide these to check eligibility:'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {match.missingFields.map(field => (
                  <span key={field} className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {getFieldLabel(field, isHindi)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onFillFields(match.missingFields)}
              className="
                flex-1 py-2 rounded-xl text-xs font-medium
                bg-amber-500/10 hover:bg-amber-500/20
                border border-amber-500/25 hover:border-amber-500/40
                text-amber-400 transition-all
              "
            >
              {isHindi ? 'जानकारी भरें' : 'Complete Profile'}
            </button>
          <a
            href={match.applicationUrl}
            target="_blank" rel="noopener noreferrer"
              className="
                px-3 py-2 rounded-xl text-xs
                bg-white/5 hover:bg-white/8 border border-white/8
                text-slate-500 hover:text-slate-400 transition-all
              "
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}