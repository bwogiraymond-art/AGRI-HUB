/**
 * Generates a unique Nakasero Market reference number.
 * Format: NKS-XXXX-#### e.g. NKS-KM82-7741
 */
export function genRef(): string {
  const alpha = Math.random().toString(36).slice(2, 6).toUpperCase();
  const nums  = Math.floor(Math.random() * 9000 + 1000);
  return `NKS-${alpha}-${nums}`;
}
