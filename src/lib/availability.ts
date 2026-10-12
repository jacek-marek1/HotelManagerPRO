import { TODAY, addDays, nightsBetween } from "./dates";
import type { DayStatus, Reservation, Room } from "./types";

export function stayTotal(r: Reservation): number {
  return nightsBetween(r.arrival, r.departure) * r.pricePerNight;
}

/** Pokój zablokowany technicznie w nocy zaczynającej się dnia `date`. */
function repairBlocks(room: Room, date: string): boolean {
  return room.condition.type === "repair" && date < room.condition.until;
}

/** Pokój wolny w całym terminie [from, to) i mieszczący `guests` osób. */
export function isAvailable(
  room: Room,
  reservations: Reservation[],
  from: string,
  to: string,
  guests: number,
): boolean {
  if (room.capacity < guests) return false;
  if (room.condition.type === "repair" && from < room.condition.until) return false;
  return !reservations.some(
    (r) => r.roomId === room.id && r.arrival < to && r.departure > from,
  );
}

/**
 * Sprzątanie dotyczy „dziś": pokój oznaczony ręcznie albo po wyjeździe gościa dziś,
 * dopóki recepcja nie oznaczy go jako gotowy.
 */
export function isCleaning(room: Room, reservations: Reservation[]): boolean {
  if (room.condition.type === "cleaning") return true;
  if (room.condition.type !== "none" || room.condition.readyOn === TODAY) return false;
  return reservations.some((r) => r.roomId === room.id && r.departure === TODAY);
}

/** Pokój w sprzątaniu, który za chwilę będzie gotowy – oznaczenie przy terminie od dziś. */
export function isCleaningSoon(room: Room, reservations: Reservation[], from: string): boolean {
  return from === TODAY && isCleaning(room, reservations);
}

/** Rezerwacje pokoju kolidujące z naprawą trwającą od dziś do dnia `until` (noc przed `until` zajęta). */
export function repairConflicts(room: Room, reservations: Reservation[], until: string): Reservation[] {
  return reservations.filter((r) => r.roomId === room.id && r.arrival < until && r.departure > TODAY);
}

export function currentReservation(
  room: Room,
  reservations: Reservation[],
  date: string,
): Reservation | undefined {
  return reservations.find(
    (r) => r.roomId === room.id && r.arrival <= date && r.departure > date,
  );
}

export function dayStatus(room: Room, reservations: Reservation[], date: string): DayStatus {
  if (repairBlocks(room, date)) return "repair";
  if (date === TODAY && isCleaning(room, reservations)) return "cleaning";
  return currentReservation(room, reservations, date) ? "occupied" : "free";
}

export interface DaySummary {
  date: string;
  counts: Record<DayStatus, number>;
  arrivals: { room: Room; reservation: Reservation }[];
  departures: { room: Room; reservation: Reservation }[];
}

export function summarize(rooms: Room[], reservations: Reservation[], date: string): DaySummary {
  const counts: Record<DayStatus, number> = { free: 0, occupied: 0, cleaning: 0, repair: 0 };
  for (const room of rooms) counts[dayStatus(room, reservations, date)]++;
  const pair = (r: Reservation) => ({ room: rooms.find((x) => x.id === r.roomId)!, reservation: r });
  return {
    date,
    counts,
    arrivals: reservations.filter((r) => r.arrival === date).map(pair),
    departures: reservations.filter((r) => r.departure === date).map(pair),
  };
}

export const tomorrow = () => addDays(TODAY, 1);

/** Rezerwacja pokazywana w wierszu: trwająca dziś albo kończąca się dziś. */
export function displayReservation(
  room: Room,
  reservations: Reservation[],
  date: string,
): Reservation | undefined {
  return (
    currentReservation(room, reservations, date) ??
    reservations.find((r) => r.roomId === room.id && r.departure === date)
  );
}

/** Czy zmiana terminu rezerwacji koliduje z inną rezerwacją tego pokoju. */
export function overlapsOther(
  reservations: Reservation[],
  id: string,
  roomId: string,
  from: string,
  to: string,
): boolean {
  return reservations.some(
    (r) => r.id !== id && r.roomId === roomId && r.arrival < to && r.departure > from,
  );
}
