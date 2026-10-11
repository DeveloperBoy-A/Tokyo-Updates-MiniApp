import StreamingBadge from "./StreamingBadge";

type Provider = { provider_id?: number; provider_name: string; logo_path?: string | null; link?: string | null };
export default function ProviderList({ providers, title = "Where to watch" }: { providers: Provider[]; title?: string }) {
  if (!providers?.length) return <section><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-neutral-500">No streaming providers are listed for this region.</p></section>;
  return <section><h3 className="mb-3 font-bold">{title}</h3><div className="flex flex-wrap gap-2">{providers.map((provider, index) => <StreamingBadge key={provider.provider_id ?? provider.provider_name + index} name={provider.provider_name} href={provider.link} logo={provider.logo_path || undefined} />)}</div></section>;
}
