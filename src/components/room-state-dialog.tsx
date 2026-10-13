"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  currentReservation,
  dayStatus,
  repairConflicts,
} from "@/lib/availability";
import { STATUS_LABEL } from "@/components/room-status-badge";
import {
  TODAY,
  addDays,
  formatDate,
  formatNights,
  nightsBetween,
} from "@/lib/dates";
import type { Condition, Reservation, Room } from "@/lib/types";

interface Props {
  room: Room | null;
  reservations: Reservation[];
  onSave: (
    room: Room,
    condition: Condition,
    notes: string,
    /** Rezerwacja trwająca dziś, której gość zostaje wymeldowany (status „Wolny"). */
    endStay?: Reservation,
  ) => void;
  onClose: () => void;
}

type Kind = "ready" | "cleaning" | "repair";

const OPTIONS: { value: Kind; label: string; hint: string }[] = [
  {
    value: "ready",
    label: "Wolny",
    hint: "Pokój wolny do przypisania gościowi. Jeśli jest w nim gość, zostanie wymeldowany dziś.",
  },
  {
    value: "cleaning",
    label: "Sprzątanie",
    hint: "Dotyczy dziś. Pokój nie jest oferowany jako gotowy.",
  },
  {
    value: "repair",
    label: "Naprawa",
    hint: "Pokój niedostępny od dziś do wskazanego dnia.",
  },
];

export function RoomStateDialog({
  room,
  reservations,
  onSave,
  onClose,
}: Props) {
  return (
    <Dialog open={!!room} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {room && (
          <Form
            key={room.id}
            room={room}
            reservations={reservations}
            onSave={onSave}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function initialKind(room: Room, occupied: boolean): Kind | null {
  if (room.condition.type !== "none") return room.condition.type;
  return occupied ? null : "ready";
}

function Form({
  room,
  reservations,
  onSave,
  onClose,
}: Omit<Props, "room"> & { room: Room }) {
  const current = currentReservation(room, reservations, TODAY);
  const [kind, setKind] = useState<Kind | null>(initialKind(room, !!current));
  const [until, setUntil] = useState(
    room.condition.type === "repair" ? room.condition.until : addDays(TODAY, 2),
  );
  const [notes, setNotes] = useState(room.notes);

  const untilBad = kind === "repair" && (!until || until <= TODAY);
  const conflicts =
    kind === "repair" && !untilBad
      ? repairConflicts(room, reservations, until)
      : [];
  const canSave = kind !== null && !untilBad && conflicts.length === 0;
  const endStay = kind === "ready" ? current : undefined;
  const nightsLeft = endStay ? nightsBetween(endStay.arrival, TODAY) : 0;

  const condition: Condition =
    kind === "repair"
      ? { type: "repair", until }
      : kind === "cleaning"
        ? { type: "cleaning" }
        : { type: "none", readyOn: TODAY };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Status pokoju {room.number}</DialogTitle>
        <DialogDescription>
          Obecny status:{" "}
          <b>{STATUS_LABEL[dayStatus(room, reservations, TODAY)]}</b>. Status
          techniczny jest niezależny od rezerwacji gościa i wpływa na dostępność
          pokoju.
        </DialogDescription>
      </DialogHeader>
      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-medium">Nowy status</legend>
        {OPTIONS.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:bg-muted"
          >
            <input
              type="radio"
              name="room-state"
              className="mt-1"
              checked={kind === o.value}
              onChange={() => setKind(o.value)}
            />
            <span>
              <span className="block text-sm font-medium">{o.label}</span>
              <span className="block text-sm text-muted-foreground">
                {o.hint}
              </span>
            </span>
          </label>
        ))}
      </fieldset>
      {kind === "repair" && (
        <div className="grid gap-2">
          <Label htmlFor="repair-until">Naprawa do dnia</Label>
          <Input
            id="repair-until"
            type="date"
            min={addDays(TODAY, 1)}
            aria-invalid={untilBad}
            value={until}
            onChange={(e) => setUntil(e.target.value)}
          />
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="room-notes">Uwagi do pokoju</Label>
        <Input
          id="room-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      {endStay && (
        <p
          className="rounded-lg bg-amber-50 p-3 text-sm text-amber-950"
          role="status"
        >
          Gość {endStay.guest.name} zostanie wymeldowany dziś.{" "}
          {nightsLeft > 0
            ? `Rezerwacja ${formatDate(endStay.arrival)} – ${formatDate(endStay.departure)} skróci się do ${formatNights(nightsLeft)}, a suma zostanie przeliczona. `
            : "Rezerwacja zostanie usunięta, bo gość nie spędził w pokoju żadnej nocy. "}
          Pokój wróci jako Wolny i od razu można go przypisać innemu gościowi.
        </p>
      )}
      {(untilBad || conflicts.length > 0) && (
        <ul className="space-y-1 text-sm text-red-800" role="alert">
          {untilBad && (
            <li>Data końca naprawy musi być późniejsza niż dziś.</li>
          )}
          {conflicts.length > 0 && (
            <li>
              Pokój ma rezerwacje w tym okresie:{" "}
              {conflicts
                .map(
                  (c) =>
                    `${c.guest.name} (${formatDate(c.arrival)} – ${formatDate(c.departure)})`,
                )
                .join(", ")}
              . Zmień lub usuń je przed ustawieniem naprawy.
            </li>
          )}
        </ul>
      )}
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Anuluj
        </Button>
        <Button
          disabled={!canSave}
          onClick={() => onSave(room, condition, notes, endStay)}
        >
          Zapisz
        </Button>
      </DialogFooter>
    </>
  );
}
