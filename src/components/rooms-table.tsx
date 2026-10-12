import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { dayStatus, displayReservation, isCleaningSoon, stayTotal } from "@/lib/availability";
import { TODAY, formatDate, formatNights, nightsBetween } from "@/lib/dates";
import type { Reservation, Room } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { STATUS_FILL, STATUS_LABEL } from "./room-status-badge";

interface Props {
  rooms: Room[];
  reservations: Reservation[];
  /** Aktywne wyszukiwanie: wyniki to pokoje dostępne w terminie. */
  search?: { from: string; to: string };
  onReserve: (room: Room) => void;
  onDetails: (r: Reservation) => void;
  onEdit: (r: Reservation) => void;
  onDelete: (r: Reservation) => void;
}

const money = (n: number) => `${n} PLN`;

export function RoomsTable({ rooms, reservations, search, onReserve, onDetails, onEdit, onDelete }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pokój</TableHead>
          <TableHead>Pojemność</TableHead>
          <TableHead>{search ? "Dostępność w terminie" : "Status dziś"}</TableHead>
          <TableHead>Gość i pobyt</TableHead>
          <TableHead className="text-right">Cena / noc</TableHead>
          <TableHead>Uwagi</TableHead>
          <TableHead className="text-right">Akcje</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((room) => {
          const res = displayReservation(room, reservations, TODAY);
          const status = dayStatus(room, reservations, TODAY);
          const repairUntil = room.condition.type === "repair" ? room.condition.until : null;
          return (
            <TableRow key={room.id}>
              <TableCell className="font-medium">
                {room.number}
                <span className="font-normal text-muted-foreground"> · {room.floor}</span>
              </TableCell>
              <TableCell>
                {room.capacity} {room.capacity === 1 ? "osoba" : "osoby"}
                <span className="text-muted-foreground"> · {room.type}</span>
              </TableCell>
              <TableCell
                className={`font-medium ${
                  search ? (isCleaningSoon(room, search.from) ? STATUS_FILL.cleaning : STATUS_FILL.free) : STATUS_FILL[status]
                }`}
              >
                {search
                  ? isCleaningSoon(room, search.from)
                    ? "Sprzątanie – za chwilę gotowy"
                    : "Wolny"
                  : STATUS_LABEL[status]}
              </TableCell>
              <TableCell>
                {!search && res ? (
                  <>
                    <button
                      type="button"
                      className="rounded-sm font-medium underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                      onClick={() => onDetails(res)}
                    >
                      {res.guest.name}
                    </button>
                    {res.departure === TODAY && <Tag>Wyjazd dziś</Tag>}
                    {res.arrival === TODAY && <Tag>Przyjazd dziś</Tag>}
                    <div className="text-muted-foreground">
                      {formatDate(res.arrival)} – {formatDate(res.departure)} · {formatNights(nightsBetween(res.arrival, res.departure))} · {money(stayTotal(res))}
                    </div>
                  </>
                ) : (
                  "–"
                )}
              </TableCell>
              <TableCell className="text-right">{money(room.pricePerNight)}</TableCell>
              <TableCell className="max-w-44 whitespace-normal text-muted-foreground">
                {[room.notes, repairUntil && `niedostępny do ${formatDate(repairUntil)}`].filter(Boolean).join(" · ") || "–"}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <Button variant="secondary" size="sm" onClick={() => onReserve(room)}>
                  Rezerwuj
                </Button>
                {search || !res ? (
                  <span className="ml-1 inline-block size-7 align-middle" aria-hidden />
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label={`Więcej akcji – pokój ${room.number}`}
                      render={<Button variant="ghost" size="icon-sm" className="ml-1" />}
                    >
                      <MoreVerticalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onDetails(res)}>Szczegóły</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(res)}>Edytuj</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-800 focus:text-red-900"
                        onClick={() => onDelete(res)}
                      >
                        Usuń
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          );
        })}
        {rooms.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
              Brak pokoi spełniających kryteria.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <Badge variant="outline" className="ml-2 border-slate-700 bg-white text-slate-900">
      {children}
    </Badge>
  );
}
