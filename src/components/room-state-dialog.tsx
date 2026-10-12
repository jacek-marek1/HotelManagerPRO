"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { repairConflicts } from "@/lib/availability";
import { TODAY, addDays, formatDate } from "@/lib/dates";
import type { Condition, Reservation, Room } from "@/lib/types";

interface Props {
  room: Room | null;
  reservations: Reservation[];
  onSave: (room: Room, condition: Condition, notes: string) => void;
  onClose: () => void;
}

type Kind = "ready" | "cleaning" | "repair";

const OPTIONS: { value: Kind; label: string; hint: string }[] = [
  { value: "ready", label: "Gotowy", hint: "Pokój wolny od ograniczeń technicznych." },
  { value: "cleaning", label: "Sprzątanie", hint: "Dotyczy dziś. Pokój nie jest oferowany jako gotowy." },
  { value: "repair", label: "Naprawa", hint: "Pokój niedostępny od dziś do wskazanego dnia." },
];

export function RoomStateDialog({ room, reservations, onSave, onClose }: Props) {
  return (
    <Dialog open={!!room} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {room && <Form key={room.id} room={room} reservations={reservations} onSave={onSave} onClose={onClose} />}
      </DialogContent>
    </Dialog>
  );
}

function initialKind(room: Room): Kind {
  return room.condition.type === "none" ? "ready" : room.condition.type;
}

function Form({ room, reservations, onSave, onClose }: Omit<Props, "room"> & { room: Room }) {
  const [kind, setKind] = useState<Kind>(initialKind(room));
  const [until, setUntil] = useState(room.condition.type === "repair" ? room.condition.until : addDays(TODAY, 2));
  const [notes, setNotes] = useState(room.notes);

  const untilBad = kind === "repair" && (!until || until <= TODAY);
  const conflicts = kind === "repair" && !untilBad ? repairConflicts(room, reservations, until) : [];
  const canSave = !untilBad && conflicts.length === 0;

  const condition: Condition =
    kind === "repair" ? { type: "repair", until } : kind === "cleaning" ? { type: "cleaning" } : { type: "none", readyOn: TODAY };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Stan pokoju {room.number}</DialogTitle>
        <DialogDescription>
          Stan techniczny jest niezależny od rezerwacji gościa i wpływa na dostępność pokoju.
        </DialogDescription>
      </DialogHeader>
      <fieldset className="grid gap-2">
        <legend className="mb-1 text-sm font-medium">Stan</legend>
        {OPTIONS.map((o) => (
          <label key={o.value} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:bg-muted">
            <input
              type="radio"
              name="room-state"
              className="mt-1"
              checked={kind === o.value}
              onChange={() => setKind(o.value)}
            />
            <span>
              <span className="block text-sm font-medium">{o.label}</span>
              <span className="block text-sm text-muted-foreground">{o.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>
      {kind === "repair" && (
        <div className="grid gap-2">
          <Label htmlFor="repair-until">Naprawa do dnia</Label>
          <Input id="repair-until" type="date" min={addDays(TODAY, 1)} aria-invalid={untilBad} value={until} onChange={(e) => setUntil(e.target.value)} />
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="room-notes">Uwagi do pokoju</Label>
        <Input id="room-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      {(untilBad || conflicts.length > 0) && (
        <ul className="space-y-1 text-sm text-red-800" role="alert">
          {untilBad && <li>Data końca naprawy musi być późniejsza niż dziś.</li>}
          {conflicts.length > 0 && (
            <li>
              Pokój ma rezerwacje w tym okresie:{" "}
              {conflicts.map((c) => `${c.guest.name} (${formatDate(c.arrival)} – ${formatDate(c.departure)})`).join(", ")}. Zmień lub usuń je
              przed ustawieniem naprawy.
            </li>
          )}
        </ul>
      )}
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Anuluj
        </Button>
        <Button disabled={!canSave} onClick={() => onSave(room, condition, notes)}>
          Zapisz
        </Button>
      </DialogFooter>
    </>
  );
}
