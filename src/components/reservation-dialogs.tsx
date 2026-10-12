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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { overlapsOther, stayTotal } from "@/lib/availability";
import { TODAY, formatDate, formatNights, nightsBetween } from "@/lib/dates";
import type { Reservation, Room } from "@/lib/types";

const PAYMENTS = [
  { value: "none", label: "Nie wybrano" },
  ...["Karta", "Gotówka", "Faktura", "Przelew"].map((v) => ({
    value: v,
    label: v,
  })),
];

interface EditProps {
  reservation: Reservation | null;
  isNew: boolean;
  rooms: Room[];
  all: Reservation[];
  onSave: (r: Reservation) => void;
  onClose: () => void;
}

export function EditReservationDialog({
  reservation,
  isNew,
  rooms,
  all,
  onSave,
  onClose,
}: EditProps) {
  return (
    <Dialog open={!!reservation} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {reservation && (
          <EditForm
            key={reservation.id}
            isNew={isNew}
            reservation={reservation}
            rooms={rooms}
            all={all}
            onSave={onSave}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditForm({
  reservation,
  isNew,
  rooms,
  all,
  onSave,
  onClose,
}: Omit<EditProps, "reservation"> & { reservation: Reservation }) {
  const [roomId, setRoomId] = useState(reservation.roomId);
  const room = rooms.find((r) => r.id === roomId)!;
  const [name, setName] = useState(reservation.guest.name);
  const [arrival, setArrival] = useState(reservation.arrival);
  const [departure, setDeparture] = useState(reservation.departure);
  const [notes, setNotes] = useState(reservation.notes);
  const [payment, setPayment] = useState(reservation.payment || "none");
  const [phone, setPhone] = useState(reservation.guest.phone);
  const [email, setEmail] = useState(reservation.guest.email);

  const invalid = !arrival || !departure || departure <= arrival;
  const conflict =
    !invalid && overlapsOther(all, reservation.id, roomId, arrival, departure);
  const repairUntil =
    room.condition.type === "repair" ? room.condition.until : null;
  const repairBlocked =
    !invalid && repairUntil !== null && arrival < repairUntil;
  const cleaningNote =
    !invalid && room.condition.type === "cleaning" && arrival === TODAY;
  const phoneBad =
    phone.trim() !== "" && !/^\+?[0-9 ()-]{7,}$/.test(phone.trim());
  const emailBad =
    email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const errors = [
    invalid && "Wyjazd musi być po przyjeździe.",
    conflict && "Ten termin koliduje z inną rezerwacją tego pokoju.",
    repairBlocked &&
      `Pokój ${room.number} jest w naprawie do ${formatDate(repairUntil!)}. Wybierz późniejszy termin lub inny pokój.`,
    phoneBad && "Niepoprawny numer telefonu.",
    emailBad && "Niepoprawny adres e-mail.",
  ].filter(Boolean) as string[];
  const canSave = errors.length === 0 && name.trim() !== "";
  const draft = {
    ...reservation,
    roomId,
    pricePerNight: isNew ? room.pricePerNight : reservation.pricePerNight,
    guest: { ...reservation.guest, name, phone, email },
    payment: payment === "none" ? "" : payment,
    arrival,
    departure,
    notes,
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {isNew
            ? "Nowa rezerwacja"
            : `Edytuj rezerwację – pokój ${room.number}`}
        </DialogTitle>
        <DialogDescription>
          Status pokoju wynika z dat pobytu i stanu technicznego, nie jest
          ustawiany ręcznie.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4">
        {isNew && (
          <div className="grid gap-2">
            <Label htmlFor="room">Pokój</Label>
            <Select
              value={roomId}
              onValueChange={(v) => v && setRoomId(v)}
              items={rooms.map((r) => ({
                value: r.id,
                label: `${r.number} · ${r.capacity} os. · ${r.pricePerNight} PLN/noc`,
              }))}
            >
              <SelectTrigger id="room" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.number} · {r.capacity} os. · {r.pricePerNight} PLN/noc
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="guest">Gość</Label>
          <Input
            id="guest"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="arrival">Przyjazd</Label>
            <Input
              id="arrival"
              type="date"
              value={arrival}
              onChange={(e) => setArrival(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="departure">Wyjazd</Label>
            <Input
              id="departure"
              type="date"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              aria-invalid={phoneBad}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              aria-invalid={emailBad}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="payment">Płatność</Label>
          <Select
            value={payment}
            onValueChange={(v) => setPayment(v ?? "none")}
            items={PAYMENTS}
          >
            <SelectTrigger id="payment" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENTS.map((i) => (
                <SelectItem key={i.value} value={i.value}>
                  {i.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Uwagi</Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        {errors.length > 0 ? (
          <ul className="space-y-1 text-sm text-red-800" role="alert">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        ) : (
          <div className="space-y-1 text-sm" role="status">
            {name.trim() === "" && (
              <p className="text-muted-foreground">
                Podaj imię i nazwisko gościa, aby zapisać rezerwację.
              </p>
            )}
            {cleaningNote && (
              <p className="text-amber-900">
                Pokój jest w sprzątaniu i będzie gotowy po wyjeździe obecnego
                gościa.
              </p>
            )}
            <p>
              {formatNights(nightsBetween(arrival, departure))} ·{" "}
              {stayTotal(draft)} PLN
            </p>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Anuluj
        </Button>
        <Button disabled={!canSave} onClick={() => onSave(draft)}>
          Zapisz
        </Button>
      </DialogFooter>
    </>
  );
}

interface DeleteProps {
  reservation: Reservation | null;
  onConfirm: (r: Reservation) => void;
  onClose: () => void;
}

export function DeleteReservationDialog({
  reservation,
  onConfirm,
  onClose,
}: DeleteProps) {
  return (
    <Dialog open={!!reservation} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Usunąć rezerwację?</DialogTitle>
          <DialogDescription>
            Rezerwacja gościa {reservation?.guest.name} zostanie usunięta, a
            pokój zwolni się w tym terminie.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Anuluj
          </Button>
          <Button
            className="bg-red-800 text-white hover:bg-red-900"
            onClick={() => reservation && onConfirm(reservation)}
          >
            Usuń
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
