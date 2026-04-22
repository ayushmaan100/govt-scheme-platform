// src/components/SkeletonCard.tsx

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-5 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-20 h-5 rounded-full shimmer-card" />
        <div className="w-14 h-5 rounded-full shimmer-card" />
      </div>
      <div className="w-3/4 h-4 rounded-lg shimmer-card mb-2" />
      <div className="w-full h-3 rounded-lg shimmer-card mb-1" />
      <div className="w-2/3 h-3 rounded-lg shimmer-card mb-4" />
      <div className="w-full h-9 rounded-xl shimmer-card" />
    </div>
  );
}

export function SkeletonResults() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
    </div>
  );
}