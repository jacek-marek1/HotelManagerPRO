import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function Day({
  title,
  s,
  showCounts,
}: {
  title: string;
  s: DaySummary;
  showCounts: boolean;
}) {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>
          {title}{" "}
          <span className="font-normal text-muted-foreground">
            · {formatDate(s.date)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {showCounts && (
          <div className="flex gap-6">
            {ORDER.map((k) => (
              <div key={k}>
                <div className="text-2xl font-semibold leading-none">
                  {s.counts[k]}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {STATUS_LABEL[k]}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-1">
          <People label="Przyjazdy" items={s.arrivals} />
          <People label="Wyjazdy" items={s.departures} />
        </div>
      </CardContent>
    </Card>
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
    <section aria-label="Obłożenie" className="flex gap-4">
      <Day title="Dziś" s={today} showCounts />
      <Day title="Jutro" s={tomorrow} showCounts />
    </section>
  );
}
