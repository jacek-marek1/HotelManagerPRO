"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import type { DaySummary } from "@/lib/availability";
import { formatDate } from "@/lib/dates";
import { STATUS_FILL, STATUS_LABEL, STATUS_STROKE } from "./room-status-badge";
import type { DayStatus } from "@/lib/types";

const ORDER: DayStatus[] = ["occupied", "free", "cleaning", "repair"];

function People({
  label,
  items,
}: {
  label: string;
  items: DaySummary["arrivals"];
}) {
  return (
    <p className="text-sm">
      <span className="font-medium">{label}: </span>
      {items.length === 0
        ? "brak"
        : items
            .map((i) => `${i.room.number} (${i.reservation.guest.name})`)
            .join(", ")}
    </p>
  );
}

function Day({
  title,
  s,
  forceOpen,
}: {
  title: string;
  s: DaySummary;
  forceOpen?: boolean;
}) {
  const [openState, setOpen] = useState(false);
  const open = openState || !!forceOpen;
  const panelId = `summary-${title.toLowerCase()}`;
  return (
    <div className="flex-1 rounded-lg border bg-card">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!openState)}
        className="flex w-full flex-col gap-2 rounded-lg px-4 py-3 text-left hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-ring"
      >
        <span className="flex items-center justify-between">
          <span className="font-medium">
            {title}{" "}
            <span className="font-normal text-muted-foreground">
              · {formatDate(s.date)}
            </span>
          </span>
          <ChevronDownIcon
            className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </span>
        <span className="flex flex-wrap items-center gap-2">
          {ORDER.map((k) => (
            <span
              key={k}
              className={`inline-flex items-baseline gap-1.5 rounded-full border px-3 py-1 ${STATUS_FILL[k]} ${STATUS_STROKE[k]}`}
            >
              <span className="text-xl font-semibold leading-none">
                {s.counts[k]}
              </span>
              <span className="text-sm font-medium">{STATUS_LABEL[k]}</span>
            </span>
          ))}
        </span>
        <span className="text-sm text-muted-foreground">
          Przyjazdy: <b className="text-foreground">{s.arrivals.length}</b> ·
          Wyjazdy: <b className="text-foreground">{s.departures.length}</b>
        </span>
      </button>
      {open && (
        <div id={panelId} className="space-y-1 border-t px-4 py-3">
          <People label="Przyjazdy" items={s.arrivals} />
          <People label="Wyjazdy" items={s.departures} />
        </div>
      )}
    </div>
  );
}

export function OccupancySummary({
  today,
  tomorrow,
  forceOpenToday,
}: {
  today: DaySummary;
  tomorrow: DaySummary;
  forceOpenToday?: boolean;
}) {
  return (
    <section
      aria-label="Obłożenie"
      data-tour="summary"
      className="flex items-start gap-4"
    >
      <Day title="Dziś" s={today} forceOpen={forceOpenToday} />
      <Day title="Jutro" s={tomorrow} />
    </section>
  );
}
