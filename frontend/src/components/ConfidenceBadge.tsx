// src/components/ConfidenceBadge.tsx

interface Props {
  score: number; // 0–100
}

export function ConfidenceBadge({ score }: Props) {
  const color =
    score === 100 ? 'text-green-400 bg-green-500/10 border-green-500/25' :
    score >= 80   ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' :
                    'text-yellow-400 bg-yellow-500/10 border-yellow-500/25';

  const label =
    score === 100 ? 'Full Match' :
    score >= 80   ? 'Strong Match' :
                    'Good Match';

  return (
    <span className={`
      inline-flex items-center gap-1.5 text-xs font-semibold
      px-2.5 py-1 rounded-full border ${color}
    `}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label} ({score}%)
    </span>
  );
}