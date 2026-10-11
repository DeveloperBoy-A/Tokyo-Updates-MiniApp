type Bucket = { label: string; count: number };
export default function RatingDistribution({ buckets, total }: { buckets: Bucket[]; total?: number }) {
  const max = Math.max(1, ...buckets.map((bucket) => bucket.count));
  const sum = total ?? buckets.reduce((value, bucket) => value + bucket.count, 0);
  return <section className="space-y-3" aria-label="Rating distribution">{buckets.map((bucket) => <div key={bucket.label} className="grid grid-cols-[2.5rem_1fr_3rem] items-center gap-3 text-xs"><span className="text-neutral-400">{bucket.label}</span><div className="h-2 overflow-hidden rounded-full bg-neutral-800"><div className="h-full rounded-full bg-amber-400" style={{ width: `${Math.max(0, Math.min(100, bucket.count / max * 100))}%` }} /></div><span className="text-right tabular-nums text-neutral-500">{bucket.count.toLocaleString()}</span></div>)}<p className="text-xs text-neutral-500">{sum.toLocaleString()} ratings</p></section>;
}
