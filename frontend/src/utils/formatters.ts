// ─── Currency ─────────────────────────────────────────────
export function formatUGX(amount: number, compact = false): string {
  if (compact && amount >= 1_000_000) {
    return 'UGX ' + (amount / 1_000_000).toFixed(1) + 'M';
  }
  if (compact && amount >= 1_000) {
    return 'UGX ' + Math.round(amount / 1_000) + 'K';
  }
  return 'UGX ' + amount.toLocaleString('en-UG');
}

// ─── Percentage change ────────────────────────────────────
export function pctChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

export function formatPctChange(current: number, previous: number): string {
  const chg = pctChange(current, previous);
  return (chg > 0 ? '+' : '') + chg + '%';
}

// ─── Dates ────────────────────────────────────────────────
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-UG', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-UG', {
    hour: '2-digit', minute: '2-digit',
  });
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function todayLabel(): string {
  return new Date().toLocaleDateString('en-UG', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

// ─── Weights ──────────────────────────────────────────────
export function formatKg(kg: number): string {
  if (kg >= 1000) return (kg / 1000).toFixed(1) + ' t';
  return kg.toLocaleString() + ' kg';
}
