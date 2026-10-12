import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { stayTotal } from "@/lib/availability";
import { TODAY, formatDate, formatNights, nightsBetween } from "@/lib/dates";
import type { Reservation, Room } from "@/lib/types";

interface Props {
  reservation: Reservation | null;
  room: Room | undefined;
  onClose: () => void;
  onEdit: (r: Reservation) => void;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-2 border-b py-2 text-sm last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{children || "–"}</dd>
    </div>
  );
}

export function ReservationDetails({ reservation: r, room, onClose, onEdit }: Props) {
  return (
    <Sheet open={!!r} onOpenChange={(o) => !o && onClose()}>
      <SheetContent>
        {r && room && (
          <>
            <SheetHeader>
              <SheetTitle>{r.guest.name}</SheetTitle>
              <SheetDescription>
                Pokój {room.number} · {room.floor}
              </SheetDescription>
            </SheetHeader>
            <dl className="px-4">
              <Row label="Dziś">
                {r.arrival === TODAY
                  ? "Przyjazd dziś"
                  : r.departure === TODAY
                    ? "Wyjazd dziś"
                    : r.arrival < TODAY && r.departure > TODAY
                      ? "Gość w obiekcie"
                      : ""}
              </Row>
              <Row label="Płatność">{r.payment}</Row>
              <Row label="Telefon">
                {r.guest.phone && (
                  <a className="underline underline-offset-2" href={`tel:${r.guest.phone}`}>
                    {r.guest.phone}
                  </a>
                )}
              </Row>
              <Row label="E-mail">
                {r.guest.email && (
                  <a className="underline underline-offset-2" href={`mailto:${r.guest.email}`}>
                    {r.guest.email}
                  </a>
                )}
              </Row>
              <Row label="Miasto / kraj">{r.guest.origin}</Row>
              <Row label="Termin">
                {formatDate(r.arrival)} – {formatDate(r.departure)}
              </Row>
              <Row label="Pobyt">
                {formatNights(nightsBetween(r.arrival, r.departure))} · {r.pricePerNight} PLN/noc · razem {stayTotal(r)} PLN
              </Row>
              <Row label="Uwagi">{r.notes}</Row>
            </dl>
            <SheetFooter>
              <Button variant="outline" onClick={() => onEdit(r)}>
                Edytuj
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
