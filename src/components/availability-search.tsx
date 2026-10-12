"use client";

import { useRef } from "react";
import { CalendarIcon } from "lucide-react";
import { pl } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TODAY, formatDate, fromISO } from "@/lib/dates";
import type { DayStatus } from "@/lib/types";
import { STATUS_LABEL, STATUS_ORDER } from "./room-status-badge";

export type StatusFilter = "all" | DayStatus;

const FLOOR_ITEMS = [
  { value: "all", label: "Wszystkie piętra" },
  { value: "P1", label: "Piętro 1" },
  { value: "P2", label: "Piętro 2" },
];

const STATUS_ITEMS = [
  { value: "all", label: "Wszystkie statusy" },
  ...STATUS_ORDER.map((s) => ({ value: s, label: STATUS_LABEL[s] })),
];

const GUEST_ITEMS = [
  { value: "any", label: "Dowolna liczba" },
  { value: "1", label: "1 osoba" },
  { value: "2", label: "2 osoby" },
  { value: "3", label: "3 osoby" },
  { value: "4", label: "4 osoby" },
];

interface Props {
  range: DateRange | undefined;
  onRangeChange: (r: DateRange | undefined) => void;
  guests: number | null;
  onGuestsChange: (n: number | null) => void;
  floor: string;
  onFloor: (f: string) => void;
  status: StatusFilter;
  onStatus: (s: StatusFilter) => void;
  noResultsOpen: boolean;
  onNoResultsDismiss: () => void;
  onReset: () => void;
  hasFilter: boolean;
}

export function AvailabilitySearch(p: Props) {
  const label =
    p.range?.from && p.range.to
      ? `${formatDate(toIso(p.range.from))} – ${formatDate(toIso(p.range.to))}`
      : p.range?.from
        ? `${formatDate(toIso(p.range.from))} – wybierz wyjazd`
        : "Wybierz termin";

  const barRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <section
        ref={barRef}
        aria-label="Wyszukiwanie"
        className="flex flex-col gap-3 rounded-lg border bg-card p-4"
      >
        <h2 className="text-sm font-semibold">Wyszukiwanie</h2>
        <div className="flex items-start gap-4">
          <div className="flex flex-col gap-2">
            <Label>Termin (przyjazd – wyjazd)</Label>
            <DatePicker {...p} label={label} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Liczba gości</Label>
            <Select
              value={p.guests === null ? "any" : String(p.guests)}
              onValueChange={(v) =>
                p.onGuestsChange(!v || v === "any" ? null : Number(v))
              }
              items={GUEST_ITEMS}
            >
              <SelectTrigger className="h-9 w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GUEST_ITEMS.map((i) => (
                  <SelectItem key={i.value} value={i.value}>
                    {i.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Piętro</Label>
            <Select
              value={p.floor}
              onValueChange={(v) => p.onFloor(v ?? "all")}
              items={FLOOR_ITEMS}
            >
              <SelectTrigger className="h-9 w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FLOOR_ITEMS.map((i) => (
                  <SelectItem key={i.value} value={i.value}>
                    {i.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Status dziś</Label>
            <Select
              value={p.status}
              onValueChange={(v) => p.onStatus((v ?? "all") as StatusFilter)}
              items={STATUS_ITEMS}
            >
              <SelectTrigger className="h-9 w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_ITEMS.map((i) => (
                  <SelectItem key={i.value} value={i.value}>
                    {i.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {p.hasFilter && (
            <Button variant="ghost" className="mt-7 h-9" onClick={p.onReset}>
              Wyczyść
            </Button>
          )}
        </div>
      </section>
      <Popover
        open={p.noResultsOpen}
        onOpenChange={(o) => !o && p.onNoResultsDismiss()}
      >
        <PopoverContent
          anchor={barRef}
          align="start"
          role="status"
          initialFocus={false}
        >
          <p className="font-medium">Brak wolnych pokoi</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Żaden pokój nie jest dostępny w całym wybranym terminie dla tej
            liczby gości. Zmień termin lub liczbę osób.
          </p>
        </PopoverContent>
      </Popover>
    </>
  );
}

function toIso(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${String(d.getDate()).padStart(2, "0")}`;
}

function DatePicker(p: Props & { label: string }) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className="h-9 w-64 justify-start font-normal"
          />
        }
      >
        <CalendarIcon className="size-4" />
        {p.label}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          locale={pl}
          weekStartsOn={1}
          numberOfMonths={2}
          defaultMonth={fromISO(TODAY)}
          selected={p.range}
          onSelect={p.onRangeChange}
          disabled={{ before: fromISO(TODAY) }}
        />
      </PopoverContent>
    </Popover>
  );
}
