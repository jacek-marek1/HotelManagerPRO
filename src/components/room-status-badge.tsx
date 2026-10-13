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
  occupied: "bg-red-100 text-red-900",
  cleaning: "bg-amber-100 text-amber-900",
  repair: "bg-slate-200 text-slate-900",
};

/** Obrys w kolorze statusu (do pigułek z liczbami w podsumowaniu obłożenia). */
export const STATUS_STROKE: Record<DayStatus, string> = {
  free: "border-emerald-400",
  occupied: "border-red-400",
  cleaning: "border-amber-400",
  repair: "border-slate-400",
};

export const STATUS_ORDER: DayStatus[] = [
  "free",
  "occupied",
  "cleaning",
  "repair",
];
