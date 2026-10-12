"use client";

import { useMemo, useState } from "react";
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
import { StatusLegend } from "@/components/status-legend";
import { TablePagination } from "@/components/table-pagination";
import { Button } from "@/components/ui/button";
import { ExportActions } from "@/components/export-actions";
import { dayStatus, isAvailable, summarize } from "@/lib/availability";
import { TODAY, addDays, toISO } from "@/lib/dates";
import { reservations as initialReservations, rooms } from "@/lib/data";
import type { Reservation, Room } from "@/lib/types";

const PAGE_SIZE = 10;

export default function Home() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState<number | null>(null);
  const [reservations, setReservations] = useState(initialReservations);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleting, setDeleting] = useState<Reservation | null>(null);
  const [dismissedKey, setDismissedKey] = useState("");
  const [floor, setFloor] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const today = useMemo(
    () => summarize(rooms, reservations, TODAY),
    [reservations],
  );
  const tomorrow = useMemo(
    () => summarize(rooms, reservations, addDays(TODAY, 1)),
    [reservations],
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
  }, [search?.from, search?.to, guests, reservations, status, floor]); // eslint-disable-line react-hooks/exhaustive-deps

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRooms = results.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const key = search ? `${search.from}|${search.to}|${guests}` : "";
  const noResults = !!search && results.length === 0;

  const startReservation = (room?: Room) => {
    const target = room ?? results[0] ?? rooms[0];
    setIsNew(true);
    setEditing({
      id: `b${Date.now()}`,
      roomId: target.id,
      guest: { name: "", origin: "", phone: "", email: "" },
      arrival: search?.from ?? TODAY,
      departure: search?.to ?? addDays(TODAY, 1),
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
          if (r?.from && r.to && guests === null) setGuests(2);
        }}
        guests={guests}
        onGuestsChange={(n) => {
          setGuests(n);
          setPage(1);
        }}
        noResultsOpen={noResults && dismissedKey !== key}
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
        hasFilter={!!range}
        onReset={() => setRange(undefined)}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <StatusLegend />
        <Button onClick={() => startReservation()}>+ Nowa rezerwacja</Button>
      </div>
      <RoomsTable
        rooms={pageRooms}
        reservations={reservations}
        search={search}
        onReserve={startReservation}
        onDetails={(r) => setDetailsId(r.id)}
        onEdit={(r) => {
          setIsNew(false);
          setEditing(r);
        }}
        onDelete={setDeleting}
      />
      <TablePagination
        page={currentPage}
        pageCount={pageCount}
        total={results.length}
        pageSize={PAGE_SIZE}
        onPage={setPage}
      />
      <div className="border-t pt-4">
        <ExportActions />
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
      <EditReservationDialog
        reservation={editing}
        isNew={isNew}
        rooms={rooms}
        all={reservations}
        onClose={() => setEditing(null)}
        onSave={(r) => {
          setReservations((all) =>
            isNew ? [...all, r] : all.map((x) => (x.id === r.id ? r : x)),
          );
          setEditing(null);
        }}
      />
      <DeleteReservationDialog
        reservation={deleting}
        onClose={() => setDeleting(null)}
        onConfirm={(r) => {
          setReservations((all) => all.filter((x) => x.id !== r.id));
          setDeleting(null);
        }}
      />
    </main>
  );
}
