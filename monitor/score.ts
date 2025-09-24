export function scoreLatency(ms: number) {
    // 100ms → 100, 1500ms → 0 (clamped)
    const min = 100, max = 1500;
    const clamped = Math.max(Math.min(ms, max), min);
    return Math.round(100 * (max - clamped) / (max - min));
  }
  
  export function scoreUptime(uptime: number) {
    // 95% → 0, 100% → 100
    const clamped = Math.max(0.95, Math.min(1, uptime));
    return Math.round(100 * (clamped - 0.95) / 0.05);
  }
  
  export function scoreCost(costPerReq: number) {
    // <= $0.0001 → 100, >= $0.10 → 0 (tune later)
    const min = 0, max = 0.10;
    const c = Math.max(min, Math.min(max, costPerReq));
    return Math.round(100 * (max - c) / (max - min));
  }
  
  export function trustScore(p95ms: number, uptime: number, costPerReq: number) {
    const sU = scoreUptime(uptime);
    const sL = scoreLatency(p95ms);
    const sC = scoreCost(costPerReq);
    return Math.round(0.6 * sU + 0.3 * sL + 0.1 * sC);
  }
  