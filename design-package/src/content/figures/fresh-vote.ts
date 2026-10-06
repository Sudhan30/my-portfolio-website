// freshprobe's verdict, ported from internal/verdict/verdict.go and
// internal/probe/http.go at github.com/Sudhan30/freshprobe (main, 2026-04-02).
// The figure assumes a response whose only cache header is Last-Modified, so
// the data age and the header score both come from it, exactly as the probe
// falls back when Age and max-age are absent.

export const policies = {
  realtime: { label: 'api-realtime', maxSeconds: 60 },
  standard: { label: 'api-standard', maxSeconds: 300 },
  static: { label: 'static-content', maxSeconds: 86_400 },
} as const;
export type PolicyId = keyof typeof policies;

export const ages = [
  { seconds: 20, label: '20 seconds' },
  { seconds: 240, label: '4 minutes' },
  { seconds: 2_700, label: '45 minutes' },
  { seconds: 10_800, label: '3 hours' },
  { seconds: 172_800, label: '2 days' },
] as const;

export interface Probe { ageSeconds: number; bodyChanging: boolean; healthy: boolean; policy: PolicyId; }

/** http.go computeFreshnessScore, Last-Modified branch. */
export function headerScore(ageSeconds: number) {
  if (ageSeconds < 60) return 1;
  if (ageSeconds < 300) return 0.9;
  if (ageSeconds < 3_600) return 0.7;
  if (ageSeconds < 86_400) return 0.4;
  return 0.1;
}

export const signalWeights = { headers: 0.9, fingerprint: 0.8, liveness: 0.7, policy: 0.95 } as const;
export type SignalId = keyof typeof signalWeights;

/** verdict.go computeVerdictAndConfidence. */
export function verdict(probe: Probe) {
  const signals: Record<SignalId, boolean> = {
    headers: headerScore(probe.ageSeconds) >= 0.5,
    fingerprint: probe.bodyChanging,
    liveness: probe.healthy,
    policy: probe.ageSeconds <= policies[probe.policy].maxSeconds,
  };
  const fresh = Object.values(signals).filter(Boolean).length;
  const ratio = fresh / 4;
  const confidence = (signalWeights.headers + signalWeights.fingerprint + signalWeights.liveness + signalWeights.policy) / 4;
  if (ratio >= 0.7) return { signals, fresh, verdict: 'FRESH' as const, confidence };
  if (ratio <= 0.3) return { signals, fresh, verdict: 'STALE' as const, confidence };
  return { signals, fresh, verdict: 'UNKNOWN' as const, confidence: confidence * 0.6 };
}

export const scenarios = [
  {
    id: 'live', label: 'A live quote API', probe: { ageSeconds: 20, bodyChanging: true, healthy: true, policy: 'realtime' },
    heading: 'Every signal agrees',
    body: 'The data was modified 20 seconds ago, the body changed between polls, and latency is healthy. All four signals vote fresh, so the agent can act on it.',
    note: 'FRESH with 0.84 confidence: the mean of the four signal weights.',
  },
  {
    id: 'frozen', label: 'Up, but frozen', probe: { ageSeconds: 10_800, bodyChanging: false, healthy: true, policy: 'realtime' },
    heading: 'HTTP 200, and still stale',
    body: 'The endpoint answers quickly, so an uptime check would call it healthy. But the data is three hours old, the body never changes between polls, and the policy allows 60 seconds. One signal of four votes fresh.',
    note: 'This is the gap the tool exists for: available is not the same as current.',
  },
  {
    id: 'doubt', label: 'A static file', probe: { ageSeconds: 10_800, bodyChanging: false, healthy: true, policy: 'static' },
    heading: 'Honest about doubt',
    body: 'Three hours old is fine for a static asset, so the policy and liveness vote fresh. The header score and the unchanging body vote stale. Two of four is not a majority either way.',
    note: 'UNKNOWN, with confidence cut to 0.50. The tool says it does not know instead of picking a side.',
  },
] as const satisfies readonly { id: string; label: string; probe: Probe; heading: string; body: string; note: string }[];

export const customPanel = {
  id: 'custom', heading: 'Your probe',
  body: 'Each signal casts one vote. At least 70% fresh reads FRESH, 30% or less reads STALE, and anything between is UNKNOWN with its confidence cut by 0.6.',
  note: 'Same inputs, same verdict, every time. That is what lets an agent build on it.',
} as const;
