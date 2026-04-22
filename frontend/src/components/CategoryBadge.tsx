// src/components/CategoryBadge.tsx

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  agriculture:      { label: 'Agriculture',      color: 'bg-green-500/15 text-green-400 border-green-500/25',    icon: '🌾' },
  education:        { label: 'Education',         color: 'bg-blue-500/15 text-blue-400 border-blue-500/25',      icon: '📚' },
  health:           { label: 'Health',            color: 'bg-red-500/15 text-red-400 border-red-500/25',         icon: '🏥' },
  housing:          { label: 'Housing',           color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',icon: '🏠' },
  women_welfare:    { label: 'Women Welfare',     color: 'bg-pink-500/15 text-pink-400 border-pink-500/25',      icon: '👩' },
  social_security:  { label: 'Social Security',   color: 'bg-purple-500/15 text-purple-400 border-purple-500/25',icon: '🛡️' },
  skill_employment: { label: 'Skill & Jobs',      color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',     icon: '⚒️' },
  food_security:    { label: 'Food Security',     color: 'bg-orange-500/15 text-orange-400 border-orange-500/25',icon: '🌽' },
  business:         { label: 'Business & Loans',  color: 'bg-teal-500/15 text-teal-400 border-teal-500/25',     icon: '💼' },
  employment:       { label: 'Employment',        color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',icon: '👷' },
};

const DEFAULT = { label: 'General', color: 'bg-slate-500/15 text-slate-400 border-slate-500/25', icon: '📋' };

interface Props {
  category: string;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'sm' }: Props) {
  const config = CATEGORY_CONFIG[category] || DEFAULT;
  const sizeClass = size === 'sm'
    ? 'text-xs px-2.5 py-1'
    : 'text-sm px-3 py-1.5';

  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full border font-medium
      ${config.color} ${sizeClass}
    `}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}