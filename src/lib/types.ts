export type Condition =
  | { type: "none"; readyOn?: string }
  | { type: "cleaning" }
  | { type: "repair"; until: string };

export interface Room {
  id: string;
  number: string;
  floor: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  condition: Condition;
  notes: string;
}

export interface Reservation {
  id: string;
  roomId: string;
  guest: { name: string; origin: string; phone: string; email: string };
  arrival: string;
  departure: string;
  guestsCount?: number;
  pricePerNight: number;
  payment: string;
  notes: string;
}

export type DayStatus = "free" | "occupied" | "cleaning" | "repair";
