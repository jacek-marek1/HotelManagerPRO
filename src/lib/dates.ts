// Daty jako "YYYY-MM-DD" (porównywalne leksykograficznie).
export const TODAY = "2024-12-28";

export function toISO(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function fromISO(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(s: string, n: number): string {
  const d = fromISO(s);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function nightsBetween(from: string, to: string): number {
  return Math.round((fromISO(to).getTime() - fromISO(from).getTime()) / 86400000);
}

export function formatDate(s: string): string {
  const [y, m, d] = s.split("-");
  return `${d}.${m}.${y}`;
}

export function formatNights(n: number): string {
  if (n === 1) return "1 noc";
  const last = n % 10;
  const teen = n % 100 >= 12 && n % 100 <= 14;
  return `${n} ${last >= 2 && last <= 4 && !teen ? "noce" : "nocy"}`;
}

/**
 * Wybór zakresu w kalendarzu: kliknięcie przy pustym lub kompletnym zakresie
 * zaczyna nowy zakres (przyjazd), kolejne ustawia wyjazd. Dzięki temu nie da się
 * rozciągać ani zawężać starego zakresu ani zaznaczyć dwóch różnych terminów.
 */
export function nextRange(
  current: { from?: Date; to?: Date } | undefined,
  clicked: Date,
): { from: Date; to?: Date } {
  if (!current?.from || current.to || clicked <= current.from)
    return { from: clicked };
  return { from: current.from, to: clicked };
}
