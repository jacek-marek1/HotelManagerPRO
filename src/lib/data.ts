import type { Reservation, Room } from "./types";

const none = { type: "none" } as const;

export const rooms: Room[] = [
  { id: "r101", number: "101", floor: "P1", type: "1 os.", capacity: 1, pricePerNight: 180, condition: none, notes: "" },
  { id: "r102", number: "102", floor: "P1", type: "2 os.", capacity: 2, pricePerNight: 250, condition: none, notes: "" },
  { id: "r103", number: "103", floor: "P1", type: "2 os.+", capacity: 3, pricePerNight: 280, condition: { type: "cleaning" }, notes: "" },
  { id: "r104", number: "104", floor: "P1", type: "1 os.", capacity: 1, pricePerNight: 180, condition: none, notes: "" },
  { id: "r105", number: "105", floor: "P1", type: "Studio", capacity: 4, pricePerNight: 350, condition: { type: "repair", until: "2024-12-30" }, notes: "Wymiana kranu" },
  { id: "r201", number: "201", floor: "P2", type: "2 os.", capacity: 2, pricePerNight: 250, condition: none, notes: "" },
  { id: "r202", number: "202", floor: "P2", type: "1 os.", capacity: 1, pricePerNight: 180, condition: none, notes: "" },
  { id: "r203", number: "203", floor: "P2", type: "2 os.+", capacity: 4, pricePerNight: 320, condition: none, notes: "" },
];

export const reservations: Reservation[] = [
  { id: "b1", roomId: "r102", guest: { name: "Jan Kowalski", origin: "Warszawa", phone: "+48501234567", email: "j.kowalski@example.com" }, arrival: "2024-12-28", departure: "2025-01-02", pricePerNight: 250, payment: "Karta", notes: "Śniadanie 7:30, parking A5" },
  { id: "b2", roomId: "r103", guest: { name: "Anna Nowak", origin: "", phone: "+48601234567", email: "a.nowak@gmail.com" }, arrival: "2024-12-26", departure: "2024-12-28", pricePerNight: 280, payment: "Gotówka", notes: "Wyjazd do 14:00" },
  { id: "b3", roomId: "r104", guest: { name: "Maria Wiśniewska", origin: "Kraków", phone: "+48791234567", email: "maria.w@company.pl" }, arrival: "2024-12-27", departure: "2024-12-30", pricePerNight: 180, payment: "Faktura", notes: "FV na firmę ABC Sp. z o.o." },
  { id: "b4", roomId: "r201", guest: { name: "Piotr Zieliński", origin: "Gdańsk", phone: "+447123456789", email: "piotr.z@email.co.uk" }, arrival: "2024-12-25", departure: "2025-01-03", pricePerNight: 250, payment: "Przelew", notes: "VIP, późny checkout" },
  { id: "b5", roomId: "r203", guest: { name: "Rodzina Schmidt", origin: "Niemcy", phone: "+491234567890", email: "schmidt@deutsche.de" }, arrival: "2024-12-27", departure: "2024-12-29", pricePerNight: 320, payment: "Karta", notes: "4 os., 2 dzieci (5 i 8 lat), łóżeczko" },
];
