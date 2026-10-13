import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  dayStatus,
  displayReservation,
  overlappingReservation,
  termStatus,
} from "@/lib/availability";
import { TODAY, formatDate, formatNights, nightsBetween } from "@/lib/dates";
import type { Reservation, Room } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRightIcon, MoreVerticalIcon } from "lucide-react";
import { STATUS_FILL, STATUS_LABEL } from "./room-status-badge";

interface Props {
  rooms: Room[];
  reservations: Reservation[];
  /** Aktywne wyszukiwanie: wyniki to pokoje dostępne w terminie. */
  search?: { from: string; to: string };
  onReserve: (room: Room) => void;
  onChangeState: (room: Room) => void;
  onMarkReady: (room: Room) => void;
  onDetails: (r: Reservation) => void;
  onEdit: (r: Reservation) => void;
  onDelete: (r: Reservation) => void;
}

const money = (n: number) => `${n} PLN`;

export function RoomsTable({
  rooms,
  reservations,
  search,
  onReserve,
  onChangeState,
  onMarkReady,
  onDetails,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Table>
      <TableHeader className="bg-slate-100">
        <TableRow className="hover:bg-slate-100">
          <TableHead className="font-semibold text-slate-900">Pokój</TableHead>
          <TableHead className="font-semibold text-slate-900">
            Pojemność
          </TableHead>
          <TableHead className="font-semibold text-slate-900">
            {search ? "Status w terminie" : "Status dziś"}
          </TableHead>
          <TableHead className="font-semibold text-slate-900">
            Gość i pobyt
          </TableHead>
          <TableHead className="font-semibold text-slate-900 text-right">
            Cena / noc
          </TableHead>
          <TableHead className="font-semibold text-slate-900">Uwagi</TableHead>
          <TableHead className="font-semibold text-slate-900 text-right">
            Akcje
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rooms.map((room, rowIndex) => {
          const res = search
            ? overlappingReservation(room, reservations, search.from, search.to)
            : displayReservation(room, reservations, TODAY);
          const status = search
            ? termStatus(room, reservations, search.from, search.to)
            : dayStatus(room, reservations, TODAY);
          const repairUntil =
            room.condition.type === "repair" ? room.condition.until : null;
          return (
            <TableRow key={room.id}>
              <TableCell className="font-medium">
                {room.number}
                <span className="font-normal text-muted-foreground">
                  {" "}
                  · {room.floor}
                </span>
              </TableCell>
              <TableCell>
                {room.capacity} {room.capacity === 1 ? "osoba" : "osoby"}
              </TableCell>
              <TableCell className={`font-medium ${STATUS_FILL[status]}`}>
                {status === "repair" && repairUntil
                  ? `Naprawa do ${formatDate(repairUntil).slice(0, 5)}`
                  : STATUS_LABEL[status]}
              </TableCell>
              <TableCell>
                {res ? (
                  <div>
                    <button
                      type="button"
                      className="group inline-flex cursor-pointer items-center gap-1.5 rounded-sm font-medium focus-visible:outline-2 focus-visible:outline-ring"
                      title="Szczegóły i edycja"
                      aria-label={`Szczegóły i edycja – ${res.guest.name}`}
                      onClick={() => onDetails(res)}
                    >
                      <span className="underline-offset-2 group-hover:underline">
                        {res.guest.name}
                      </span>
                      <span className="inline-flex size-5 items-center justify-center rounded border border-border bg-card text-muted-foreground transition-colors group-hover:border-foreground/40 group-hover:bg-muted group-hover:text-foreground">
                        <ChevronRightIcon className="size-3.5" aria-hidden />
                      </span>
                    </button>
                    <div className="text-muted-foreground">
                      {formatDate(res.arrival)} – {formatDate(res.departure)} ·{" "}
                      {formatNights(
                        nightsBetween(res.arrival, res.departure),
                      )}{" "}
                    </div>
                  </div>
                ) : (
                  "–"
                )}
              </TableCell>
              <TableCell className="text-right">
                {money(room.pricePerNight)}
              </TableCell>
              <TableCell className="max-w-44 whitespace-normal text-muted-foreground">
                {room.notes || "–"}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                {!(
                  search &&
                  (status === "occupied" || status === "repair")
                ) && (
                  <Button
                    variant="outline"
                    size="sm"
                    data-tour={rowIndex === 0 ? "reserve-first" : undefined}
                    onClick={() => onReserve(room)}
                  >
                    Rezerwuj
                  </Button>
                )}
                {!search && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label={`Więcej akcji – pokój ${room.number}`}
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="ml-1"
                        />
                      }
                    >
                      <MoreVerticalIcon />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-52">
                      {status === "cleaning" && (
                        <DropdownMenuItem onClick={() => onMarkReady(room)}>
                          Oznacz jako posprzątany
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onChangeState(room)}>
                        Zmień status pokoju
                      </DropdownMenuItem>
                      {res && (
                        <>
                          <DropdownMenuItem onClick={() => onEdit(res)}>
                            Edytuj rezerwację
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-800 focus:text-red-900"
                            onClick={() => onDelete(res)}
                          >
                            Usuń rezerwację
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          );
        })}
        {rooms.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={7}
              className="py-8 text-center text-muted-foreground"
            >
              Brak pokoi spełniających kryteria. Zmień filtry.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
