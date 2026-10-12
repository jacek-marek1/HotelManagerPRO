"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import type { DaySummary } from "@/lib/availability";
import { formatDate } from "@/lib/dates";
import { STATUS_LABEL } from "./room-status-badge";
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

function Day({ title, s }: { title: string; s: DaySummary }) {
  const [open, setOpen] = useState(false);
  const panelId = `summary-${title.toLowerCase()}`;
  return (
    <div className="flex-1 rounded-lg border bg-card">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
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
        <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          {ORDER.map((k) => (
            <span key={k} className="flex items-baseline gap-1.5">
              <span className="text-xl font-semibold leading-none">
                {s.counts[k]}
              </span>
              <span className="text-sm text-muted-foreground">
                {STATUS_LABEL[k]}
              </span>
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
}: {
  today: DaySummary;
  tomorrow: DaySummary;
}) {
  return (
    <section aria-label="Obłożenie" className="flex items-start gap-4">
      <Day title="Dziś" s={today} />
      <Day title="Jutro" s={tomorrow} />
    </section>
  );
}
