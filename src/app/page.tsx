"use client";

import { useMemo, useRef, useState } from "react";
import { PlusIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import {
  AvailabilitySearch,
  type StatusFilter,
} from "@/components/availability-search";
import { OccupancySummary } from "@/components/occupancy-summary";
import {
  DeleteReservationDialog,
  EditReservationDialog,
} from "@/components/reservation-dialogs";
import { ReservationDetails } from "@/components/reservation-details";
import { RoomsTable } from "@/components/rooms-table";
import { TablePagination } from "@/components/table-pagination";
import { Button } from "@/components/ui/button";
import { ExportActions } from "@/components/export-actions";
import {
  dayStatus,
  displayReservation,
  nextFreeStart,
  isAvailable,
  isCleaningSoon,
  summarize,
} from "@/lib/availability";
import { buildCsv, downloadCsv, type ExportRow } from "@/lib/export";
import { STATUS_LABEL } from "@/components/room-status-badge";
import { TODAY, addDays, toISO } from "@/lib/dates";
import {
  reservations as initialReservations,
  rooms as initialRooms,
} from "@/lib/data";
import { RoomStateDialog } from "@/components/room-state-dialog";
import type { Reservation, Room } from "@/lib/types";

const PAGE_SIZE = 10;

export default function Home() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<number | null>(null);
  const [rooms, setRooms] = useState(initialRooms);
  const [reservations, setReservations] = useState(initialReservations);
  const [stateRoom, setStateRoom] = useState<Room | null>(null);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [autoDates, setAutoDates] = useState(false);
  const [deleting, setDeleting] = useState<Reservation | null>(null);
  const [dismissedKey, setDismissedKey] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notify = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };
  const [floor, setFloor] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const today = useMemo(
    () => summarize(rooms, reservations, TODAY),
    [rooms, reservations],
  );
  const tomorrow = useMemo(
    () => summarize(rooms, reservations, addDays(TODAY, 1)),
    [rooms, reservations],
  );

  const search =
    range?.from && range.to && toISO(range.to) > toISO(range.from)
      ? { from: toISO(range.from), to: toISO(range.to) }
      : undefined;

  const results = useMemo(() => {
    const seats = guests ?? 1;
    return rooms.filter((r) => {
      const fits = search
        ? isAvailable(r, reservations, search.from, search.to, seats)
        : r.capacity >= seats;
      return (
        fits &&
        (floor === "all" || r.floor === floor) &&
        (status === "all" || dayStatus(r, reservations, TODAY) === status)
      );
    });
  }, [search?.from, search?.to, guests, rooms, reservations, status, floor]); // eslint-disable-line react-hooks/exhaustive-deps

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRooms = results.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const key = search ? `${search.from}|${search.to}|${guests}` : "";
  const noResults = !!search && results.length === 0;
  const noResultsByFilters =
    noResults &&
    rooms.some((r) =>
      isAvailable(r, reservations, search!.from, search!.to, guests ?? 1),
    );

  const exportExcel = () => {
    const rows: ExportRow[] = results.map((r) => {
      const reservation = displayReservation(r, reservations, TODAY);
      const st = dayStatus(r, reservations, TODAY);
      return {
        room: r.number,
        floor: r.floor,
        capacity: r.capacity,
        status: search
          ? isCleaningSoon(r, reservations, search.from)
            ? "Sprzątanie – za chwilę gotowy"
            : "Wolny w terminie"
          : STATUS_LABEL[st],
        pricePerNight: r.pricePerNight,
        notes: r.notes,
        reservation: search ? undefined : reservation,
      };
    });
    downloadCsv(buildCsv(rows), `pokoje-${TODAY}.csv`);
    notify(`Wyeksportowano ${rows.length} pokoi do pliku Excel`);
  };

  const markReady = (room: Room) => {
    setRooms((all) =>
      all.map((r) =>
        r.id === room.id
          ? { ...r, condition: { type: "none", readyOn: TODAY } }
          : r,
      ),
    );
    notify(`Pokój ${room.number} oznaczony jako posprzątany`);
  };

  const startReservation = (room?: Room) => {
    const target = room ?? results[0] ?? rooms[0];
    const start = search?.from ?? nextFreeStart(target, reservations).date;
    setIsNew(true);
    setAutoDates(!search);
    setEditing({
      id: `b${Date.now()}`,
      roomId: target.id,
      guest: { name: "", origin: "", phone: "", email: "" },
      arrival: start,
      departure: search?.to ?? addDays(start, 1),
      pricePerNight: target.pricePerNight,
      payment: "",
      notes: "",
    });
  };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Rezerwacje</h1>
          <p className="text-sm text-muted-foreground">
            Acme Corp Hotel · admin@hotel.pl · ostatnie logowanie 28.12.2024
            09:15
          </p>
        </div>
      </header>
      <OccupancySummary today={today} tomorrow={tomorrow} />
      <AvailabilitySearch
        range={range}
        onRangeChange={(r) => {
          setRange(r);
          setPage(1);
          // Wyszukiwanie terminu bez wybranej liczby gości zakłada 2 osoby.
          if (r?.from && r.to && toISO(r.to) > toISO(r.from) && guests === null)
            setGuests(2);
        }}
        guests={guests}
        onGuestsChange={(n) => {
          setGuests(n);
          setPage(1);
        }}
        noResultsOpen={noResults && dismissedKey !== key}
        noResultsByFilters={noResultsByFilters}
        onNoResultsDismiss={() => setDismissedKey(key)}
        floor={floor}
        onFloor={(f) => {
          setFloor(f);
          setPage(1);
        }}
        status={status}
        onStatus={(st) => {
          setStatus(st);
          setPage(1);
        }}
        hasFilter={
          !!range || guests !== null || floor !== "all" || status !== "all"
        }
        onReset={() => {
          setRange(undefined);
          setGuests(null);
          setFloor("all");
          setStatus("all");
          setPage(1);
        }}
      />
      <section
        aria-label="Lista pokoi"
        className="overflow-hidden rounded-lg border bg-card"
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <h2 className="text-lg font-semibold">
            {search ? "Dostępne pokoje" : "Pokoje"}{" "}
            <span className="font-normal text-muted-foreground">
              · {results.length}
            </span>
          </h2>
          <Button
            size="lg"
            className="print:hidden"
            onClick={() => startReservation()}
          >
            <PlusIcon />
            Nowa rezerwacja
          </Button>
        </div>
        <RoomsTable
          rooms={pageRooms}
          reservations={reservations}
          search={search}
          onReserve={startReservation}
          onChangeState={setStateRoom}
          onMarkReady={markReady}
          onDetails={(r) => setDetailsId(r.id)}
          onEdit={(r) => {
            setIsNew(false);
            setEditing(r);
          }}
          onDelete={setDeleting}
        />
        {pageCount > 1 && (
          <div className="border-t px-4 py-3">
            <TablePagination
              page={currentPage}
              pageCount={pageCount}
              total={results.length}
              pageSize={PAGE_SIZE}
              onPage={setPage}
            />
          </div>
        )}
      </section>
      <div className="border-t pt-4 print:hidden">
        <ExportActions onExcel={exportExcel} />
      </div>
      <ReservationDetails
        reservation={reservations.find((x) => x.id === detailsId) ?? null}
        room={rooms.find(
          (r) => r.id === reservations.find((x) => x.id === detailsId)?.roomId,
        )}
        onClose={() => setDetailsId(null)}
        onEdit={(r) => {
          setDetailsId(null);
          setIsNew(false);
          setEditing(r);
        }}
      />
      <RoomStateDialog
        room={stateRoom}
        reservations={reservations}
        onClose={() => setStateRoom(null)}
        onSave={(room, condition, notes) => {
          setRooms((all) =>
            all.map((r) => (r.id === room.id ? { ...r, condition, notes } : r)),
          );
          setStateRoom(null);
          notify(`Zapisano stan pokoju ${room.number}`);
        }}
      />
      <EditReservationDialog
        reservation={editing}
        isNew={isNew}
        autoDates={autoDates}
        rooms={rooms}
        all={reservations}
        onClose={() => setEditing(null)}
        onSave={(r) => {
          setReservations((all) =>
            isNew ? [...all, r] : all.map((x) => (x.id === r.id ? r : x)),
          );
          setEditing(null);
          notify(
            isNew
              ? `Dodano rezerwację – pokój ${rooms.find((x) => x.id === r.roomId)?.number}`
              : "Zapisano zmiany w rezerwacji",
          );
        }}
      />
      <DeleteReservationDialog
        reservation={deleting}
        onClose={() => setDeleting(null)}
        onConfirm={(r) => {
          setReservations((all) => all.filter((x) => x.id !== r.id));
          setDeleting(null);
          notify("Rezerwacja usunięta");
        }}
      />
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-lg print:hidden"
        >
          {toast}
        </div>
      )}
    </main>
  );
}
