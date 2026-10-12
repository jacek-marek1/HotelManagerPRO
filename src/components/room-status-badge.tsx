import type { DayStatus } from "@/lib/types";

export const STATUS_LABEL: Record<DayStatus, string> = {
  free: "Wolny",
  occupied: "Zajęty",
  cleaning: "Sprzątanie",
  repair: "Naprawa",
};

/** Wypełnienie tła komórki statusu (ciemny tekst na jasnym tle, kontrast > 4.5:1). */
export const STATUS_FILL: Record<DayStatus, string> = {
  free: "bg-emerald-100 text-emerald-900",
  occupied: "bg-slate-200 text-slate-900",
  cleaning: "bg-amber-100 text-amber-900",
  repair: "bg-red-100 text-red-900",
};

export const STATUS_ORDER: DayStatus[] = [
  "free",
  "occupied",
  "cleaning",
  "repair",
];
