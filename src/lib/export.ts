import { stayTotal } from "./availability";
import { formatDate, nightsBetween } from "./dates";
import type { Reservation } from "./types";

export interface ExportRow {
  room: string;
  floor: string;
  capacity: number;
  status: string;
  pricePerNight: number;
  notes: string;
  reservation?: Reservation;
}

const HEADER = [
  "Pokój",
  "Piętro",
  "Pojemność (os.)",
  "Status",
  "Gość",
  "Przyjazd",
  "Wyjazd",
  "Noce",
  "Suma (PLN)",
  "Cena / noc (PLN)",
  "Płatność",
  "Telefon",
  "E-mail",
  "Uwagi",
];

const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

/** CSV rozdzielany średnikiem z BOM – otwiera się w Excelu z polskimi znakami. */
export function buildCsv(rows: ExportRow[]): string {
  const lines = rows.map((r) => {
    const b = r.reservation;
    return [
      r.room,
      r.floor,
      r.capacity,
      r.status,
      b?.guest.name ?? "",
      b ? formatDate(b.arrival) : "",
      b ? formatDate(b.departure) : "",
      b ? nightsBetween(b.arrival, b.departure) : "",
      b ? stayTotal(b) : "",
      r.pricePerNight,
      b?.payment ?? "",
      b?.guest.phone ?? "",
      b?.guest.email ?? "",
      r.notes,
    ]
      .map(cell)
      .join(";");
  });
  return "﻿" + [HEADER.map(cell).join(";"), ...lines].join("\r\n");
}

export function downloadCsv(csv: string, filename: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
