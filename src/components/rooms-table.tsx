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
  isCleaningSoon,
  stayTotal,
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
import { CheckIcon, ChevronRightIcon, MoreVerticalIcon } from "lucide-react";
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
            {search ? "Dostępność w terminie" : "Status dziś"}
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
        {rooms.map((room) => {
          const res = displayReservation(room, reservations, TODAY);
          const status = dayStatus(room, reservations, TODAY);
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
              <TableCell
                className={`font-medium ${
                  search
                    ? isCleaningSoon(room, reservations, search.from)
                      ? STATUS_FILL.cleaning
                      : STATUS_FILL.free
                    : STATUS_FILL[status]
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span>
                    {search
                      ? isCleaningSoon(room, reservations, search.from)
                        ? "Sprzątanie – za chwilę gotowy"
                        : "Wolny"
                      : status === "repair" && repairUntil
                        ? `Naprawa do ${formatDate(repairUntil).slice(0, 5)}`
                        : STATUS_LABEL[status]}
                  </span>
                  {!search && status === "cleaning" && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="-my-1 shrink-0"
                      title="Oznacz jako posprzątany"
                      aria-label={`Oznacz pokój ${room.number} jako posprzątany`}
                      onClick={() => onMarkReady(room)}
                    >
                      <CheckIcon />
                    </Button>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {!search && res ? (
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <button
                        type="button"
                        className="rounded-sm font-medium underline underline-offset-2 hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
                        onClick={() => onDetails(res)}
                      >
                        {res.guest.name}
                      </button>
                      <div className="text-muted-foreground">
                        {formatDate(res.arrival)} – {formatDate(res.departure)}{" "}
                        ·{" "}
                        {formatNights(
                          nightsBetween(res.arrival, res.departure),
                        )}{" "}
                        · {money(stayTotal(res))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0"
                      title="Szczegóły i edycja"
                      aria-label={`Szczegóły i edycja – ${res.guest.name}`}
                      onClick={() => onDetails(res)}
                    >
                      <ChevronRightIcon />
                    </Button>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReserve(room)}
                >
                  Rezerwuj
                </Button>
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
                      <DropdownMenuItem onClick={() => onChangeState(room)}>
                        Zmień stan pokoju
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
