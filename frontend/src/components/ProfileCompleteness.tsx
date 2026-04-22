// src/components/ProfileCompleteness.tsx

interface Props {
  score: number;
  missingFields: string[];
  isHindi: boolean;
  onImprove: () => void;
}

export function ProfileCompleteness({ score, missingFields, isHindi, onImprove }: Props) {
  if (score === 100) return null;

  const color =
    score >= 80 ? 'bg-green-500'  :
    score >= 60 ? 'bg-yellow-500' :
                  'bg-red-500';

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-semibold text-white ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? 'प्रोफाइल पूर्णता' : 'Profile Completeness'}
        </h3>
        <span className="text-sm font-bold text-white">{score}%</span>
      </div>

      {/* Bar */}
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>

      <p className={`text-xs text-slate-500 mb-3 ${isHindi ? 'font-hindi' : ''}`}>
        {isHindi
          ? `${missingFields.length} जानकारी जोड़ने से और योजनाएं मिल सकती हैं`
          : `Adding ${missingFields.length} more details could unlock more schemes`}
      </p>

      <button
        onClick={onImprove}
        className="
          w-full py-2 rounded-xl text-xs font-medium
          bg-saffron-500/10 hover:bg-saffron-500/20
          border border-saffron-500/25
          text-saffron-400 transition-all
        "
      >
        {isHindi ? 'प्रोफाइल पूरा करें →' : 'Complete Profile →'}
      </button>
    </div>
  );
}