"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface TourSearch {
  from: string;
  to: string;
  guests: number | null;
  floor: string;
}

/** Akcje, które przewodnik wykonuje na ekranie za osobę oglądającą. */
export interface TourApi {
  applySearch: (s: TourSearch) => void;
  clearFilters: () => void;
  setStatus: (status: string) => void;
  /** Ustawia filtry bez terminu (piętro, liczba gości, status). */
  setFilters: (f: {
    guests: number | null;
    floor: string;
    status: string;
  }) => void;
  showSummary: (open: boolean) => void;
  /** Otwiera panel szczegółów rezerwacji o danym id (null = zamyka). */
  openDetails: (reservationId: string | null) => void;
  reset: () => void;
}

interface Step {
  /** Selektory elementów do podświetlenia (podświetlany jest ich wspólny obszar). */
  targets: string[];
  title: string;
  /** Rodzaj problemu: nielogiczność działania vs estetyka i odciążenie poznawcze. */
  kind?: "logic" | "cognitive";
  /** Czy krok odpowiada na główny problem z analizy, czy na dodatkową kwestię. */
  focus: "main" | "extra";
  problem: string;
  solution: string;
  /** Gdzie na ekranie ma stanąć podświetlenie po przewinięciu: u góry (domyślnie) albo niżej. */
  align?: "top" | "lower";
  /** Po której stronie podświetlenia ma stanąć dymek (domyślnie pod nim). */
  cardSide?: "below" | "above";
  /** Id rezerwacji, której panel szczegółów ma być otwarty w tym kroku. */
  details?: string;
  enter?: (api: TourApi) => void;
}

const STEPS: Step[] = [
  {
    targets: [],
    title: "Główny problem – na co odpowiada ten ekran",
    focus: "main",
    problem:
      "Recepcjonista nie mógł szybko sprawdzić, czy jest wolny pokój na konkretny termin dla konkretnej liczby osób. Ekran pokazywał tylko to, co dzieje się „na teraz”, więc gość przy ladzie czekał, a właściciel liczył obłożenie w głowie, wiersz po wierszu.",
    solution:
      "Wystarczy podać termin i liczbę osób, a lista od razu pokaże pasujące pokoje. Obłożenie widać na górze ekranu, bez liczenia. Pokażę to krok po kroku i przy każdym kroku zaznaczę, czy dotyczy głównego problemu, czy dodatkowej kwestii.",
  },
  {
    targets: ['[data-tour="summary"]'],
    title: "Obłożenie na pierwszy rzut oka",
    kind: "logic",
    focus: "main",
    problem:
      "Żeby sprawdzić obłożenie, trzeba było liczyć wiersze ręcznie. Przyjazdów i wyjazdów dziś nic nie wyróżniało.",
    solution:
      "Karty „Dziś” i „Jutro” liczą statusy z tych samych danych co wyszukiwarka. Kolory odpowiadają statusom pokoi w tabeli (czerwony zajęty, zielony wolny, żółty sprzątanie, szary naprawa), więc obłożenie rozpoznasz w kilka sekund. Po rozwinięciu widać, kto przyjeżdża i wyjeżdża.",
    enter: (api) => api.showSummary(true),
  },
  {
    targets: ['[data-tour="search"]'],
    title: "Pytanie gościa: termin i liczba osób",
    kind: "logic",
    focus: "main",
    problem:
      "Pola Od/Do nie filtrowały listy i nie dało się podać liczby gości. Na pytanie „czy macie pokój dla 2 osób na 2 noce od dziś?” ekran nie odpowiadał.",
    solution:
      "Kalendarz zakresu i liczba gości filtrują pokoje od razu, bez przeładowania strony. Przewodnik wpisał za Ciebie 28–30.12 i 2 osoby.",
    enter: (api) => {
      api.showSummary(false);
      api.applySearch({
        from: "2024-12-28",
        to: "2024-12-30",
        guests: 2,
        floor: "all",
      });
    },
  },
  {
    targets: ['[data-tour="table"]'],
    title: "Wynik liczony z dat, nie z ręcznego statusu",
    kind: "logic",
    focus: "main",
    problem:
      "„Wolne” znaczyło tylko „wolny dziś”. Pokój w sprzątaniu znikał z wyników, a naprawa była ukryta w uwagach.",
    solution:
      "Lista pokazuje pokoje dostępne w całym terminie. Pokój w sprzątaniu zostaje na liście z oznaczeniem „Sprzątanie”.",
  },
  {
    targets: ['[data-tour="reserve-first"]'],
    title: "Rezerwacja z wyniku: czytelna akcja",
    align: "lower",
    cardSide: "above",
    kind: "cognitive",
    focus: "extra",
    problem:
      "Z wyniku dało się od razu przejść do rezerwacji, ale ta akcja niczym się nie wyróżniała. Były tylko pojedyncze litery R, E, U, trudne do rozpoznania w krótkim czasie, a pojemność trzeba było odgadywać ze skrótów („2os.+”).",
    solution:
      "„Rezerwuj” ma pełną nazwę i stoi przy każdym pokoju, a pojemność jest podana w osobach. Edycja i usuwanie są w osobnym menu, więc nie pomylisz ich z rezerwacją. Daty z wyszukiwania przenoszą się do rezerwacji.",
  },
  {
    targets: ['[data-tour="search"]', '[data-slot="popover-content"]'],
    title: "Komunikat zamiast pustego ekranu",
    kind: "logic",
    focus: "main",
    problem:
      "Ekran nie odpowiadał na pytanie o termin i liczbę osób, więc nie mógł też powiedzieć „brak wolnych pokoi” ani podpowiedzieć, co zmienić.",
    solution:
      "Komunikat mówi, że brak pokoi, i podpowiada, co zmienić: termin, liczbę osób albo filtry. Przewodnik ustawił 4 osoby na piętrze 2.",
    enter: (api) =>
      api.applySearch({
        from: "2024-12-28",
        to: "2024-12-30",
        guests: 4,
        floor: "P2",
      }),
  },
  {
    targets: ['[data-tour="search"]', '[data-tour="table"]'],
    title: "Status pokoi i filtry w jednej tabeli",
    kind: "logic",
    focus: "extra",
    problem:
      "W oryginale do wyboru były tylko pokoje zajęte i wolne, a sprzątanie i naprawa trafiały do nieczytelnej opcji „Inne”. Naprawa była tylko w uwagach, a status ustawiano ręcznie, niezależnie od dat.",
    solution:
      "Status wylicza się z dat i stanu pokoju, a kolor i tekst mówią to samo (naprawa pokazuje datę końca). Każdy status ma własną pozycję filtra, a filtry łączą się ze sobą w jednej tabeli. Przewodnik ustawił piętro 1, co najmniej 2 osoby i status „Zajęty”.",
    enter: (api) => {
      api.clearFilters();
      api.setFilters({ guests: 2, floor: "P1", status: "occupied" });
    },
  },
  {
    targets: ['[data-slot="sheet-content"]'],
    details: "b1",
    title: "Dane klienta poza tabelą",
    kind: "cognitive",
    focus: "extra",
    problem:
      "Wiek, miasto, telefon i e-mail zabierały szerokość tabeli i utrudniały szybką decyzję o pokoju.",
    solution:
      "Tabela zostaje czytelna: pokój, status, gość i termin. Dane kontaktowe, forma płatności, suma za pobyt i uwagi są w panelu bocznym klienta, który otwiera kliknięcie w nazwisko. Stamtąd przejdziesz też do edycji.",
  },
];

const KIND_LABEL: Record<
  NonNullable<Step["kind"]>,
  { text: string; className: string }
> = {
  logic: {
    text: "Nielogiczność",
    className: "bg-amber-100 text-amber-950",
  },
  cognitive: {
    text: "Estetyka i odciążenie poznawcze",
    className: "bg-sky-100 text-sky-950",
  },
};

const DECLINED_KEY = "hm-tour-declined";
const PAD = 8;

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function unionRect(selectors: string[]): Rect | null {
  const rects = selectors
    .flatMap((s) => Array.from(document.querySelectorAll(s)))
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width > 0 && r.height > 0);
  if (rects.length === 0) return null;
  const top = Math.min(...rects.map((r) => r.top));
  const left = Math.min(...rects.map((r) => r.left));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  const right = Math.max(...rects.map((r) => r.right));
  return {
    top: top - PAD,
    left: left - PAD,
    width: right - left + PAD * 2,
    height: bottom - top + PAD * 2,
  };
}

interface Props {
  api: TourApi;
  /** Zwiększenie wartości uruchamia przewodnik (przycisk w nagłówku). */
  runId: number;
  onActiveChange: (active: boolean) => void;
}

export function GuidedTour({ api, runId, onActiveChange }: Props) {
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardH, setCardH] = useState(280);

  // Modal powitalny przy świeżym wejściu (chyba że odrzucony w tej sesji).
  useEffect(() => {
    let declined = false;
    try {
      declined = sessionStorage.getItem(DECLINED_KEY) === "1";
    } catch {}
    if (declined) return;
    const t = setTimeout(() => setWelcomeOpen(true), 0);
    return () => clearTimeout(t);
  }, []);

  const start = useCallback(() => {
    setWelcomeOpen(false);
    setIndex(0);
    setActive(true);
    onActiveChange(true);
  }, [onActiveChange]);

  const exit = useCallback(() => {
    setActive(false);
    setRect(null);
    onActiveChange(false);
    api.reset();
  }, [api, onActiveChange]);

  useEffect(() => {
    if (runId === 0) return;
    const t = setTimeout(() => setWelcomeOpen(true), 0);
    return () => clearTimeout(t);
  }, [runId]);

  const step = STEPS[index];

  // Wejście w krok: wykonanie akcji, przewinięcie, śledzenie położenia elementów.
  useEffect(() => {
    if (!active) return;
    api.openDetails(step.details ?? null);
    step.enter?.(api);
    const scrollTimer = setTimeout(() => {
      const r = unionRect(step.targets);
      if (r)
        window.scrollTo({
          top:
            window.scrollY +
            r.top -
            (step.align === "lower" ? window.innerHeight * 0.62 : 16),
          behavior: "smooth",
        });
    }, 350);
    const poll = setInterval(() => {
      setRect(unionRect(step.targets));
      setViewport({ w: window.innerWidth, h: window.innerHeight });
      if (cardRef.current) setCardH(cardRef.current.offsetHeight);
    }, 120);
    return () => {
      clearTimeout(scrollTimer);
      clearInterval(poll);
    };
  }, [active, index]); // eslint-disable-line react-hooks/exhaustive-deps

  const last = index === STEPS.length - 1;
  const next = () => (last ? exit() : setIndex(index + 1));

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exit();
      if (e.key === "ArrowRight" || e.key === "Enter") next();
      if (e.key === "ArrowLeft" && index > 0) setIndex(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const decline = () => {
    try {
      sessionStorage.setItem(DECLINED_KEY, "1");
    } catch {}
    setWelcomeOpen(false);
  };

  // Położenie dymku: pod podświetleniem, nad nim, z prawej, z lewej albo przy dolnej krawędzi okna.
  const W = 440;
  const GAP = 16;
  let cardTop = Math.max(8, viewport.h - cardH - GAP);
  let cardLeft = Math.max(GAP, viewport.w - W - GAP);
  if (step.targets.length === 0) {
    cardTop = Math.max(8, (viewport.h - cardH) / 2);
    cardLeft = Math.max(GAP, (viewport.w - W) / 2);
  }
  if (rect) {
    const clampLeft = (x: number) =>
      Math.min(Math.max(GAP, x), Math.max(GAP, viewport.w - W - GAP));
    const clampTop = (y: number) =>
      Math.min(Math.max(8, y), Math.max(8, viewport.h - cardH - 8));
    const below = rect.top + rect.height + GAP;
    const above = rect.top - cardH - GAP;
    const rightSpace = viewport.w - (rect.left + rect.width) - GAP * 2;
    const leftSpace = rect.left - GAP * 2;
    if (step.cardSide === "above" && above >= 8) {
      cardTop = above;
      cardLeft = clampLeft(rect.left);
    } else if (below + cardH <= viewport.h - 8) {
      cardTop = below;
      cardLeft = clampLeft(rect.left);
    } else if (above >= 8) {
      cardTop = above;
      cardLeft = clampLeft(rect.left);
    } else if (rightSpace >= W) {
      cardTop = clampTop(rect.top);
      cardLeft = rect.left + rect.width + GAP;
    } else if (leftSpace >= W) {
      cardTop = clampTop(rect.top);
      cardLeft = rect.left - W - GAP;
    }
  }

  return (
    <>
      <Dialog open={welcomeOpen} onOpenChange={(o) => !o && decline()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[22px] leading-tight">
              Przewodnik po prototypie
            </DialogTitle>
            <DialogDescription className="text-foreground">
              Cześć, przygotowałem krótki przewodnik po moim redesignie.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm">
            To {STEPS.length} krótkich kroków. Ekran będzie się zmieniał sam, a
            dalej idziesz Ty. Przewodnik jest opcjonalny: możesz go pominąć i
            korzystać z prototypu samodzielnie, a wrócić do niego w każdej
            chwili przez zakładkę „Skorzystaj z przewodnika”.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={decline}>
              Rezygnuję
            </Button>
            <Button onClick={start}>Zaczynamy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {active && (
        <div
          className="fixed inset-0 z-[100] print:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Przewodnik"
        >
          {/* Blokuje klikanie w ekran pod spodem – dalej idzie tylko osoba oglądająca. */}
          <div className="absolute inset-0" />
          {rect ? (
            <div
              className="pointer-events-none absolute rounded-lg ring-2 ring-white/90 transition-all duration-300"
              style={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.65)",
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-slate-900/65" />
          )}
          <div
            ref={cardRef}
            className="absolute rounded-xl border bg-card p-5 text-card-foreground shadow-xl transition-all duration-300"
            style={{ top: cardTop, left: cardLeft, width: W }}
          >
            <p className="text-xs font-medium text-muted-foreground">
              Krok {index + 1} z {STEPS.length}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{step.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  step.focus === "main"
                    ? "bg-slate-900 text-white"
                    : "border border-slate-400 text-slate-800"
                }`}
              >
                {step.focus === "main" ? "Główny problem" : "Dodatkowa kwestia"}
              </span>
              {step.kind && (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${KIND_LABEL[step.kind].className}`}
                >
                  {KIND_LABEL[step.kind].text}
                </span>
              )}
            </div>
            <div className="mt-3 space-y-3 text-sm">
              <p>
                <span className="mb-0.5 block text-xs font-semibold uppercase tracking-wide text-red-800">
                  Problem
                </span>
                {step.problem}
              </p>
              <p>
                <span className="mb-0.5 block text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  Rozwiązanie
                </span>
                {step.solution}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <Button variant="ghost" onClick={exit}>
                Wychodzę
              </Button>
              <div className="flex gap-2">
                {index > 0 && (
                  <Button variant="outline" onClick={() => setIndex(index - 1)}>
                    Wstecz
                  </Button>
                )}
                <Button onClick={next}>{last ? "Zakończ" : "Idę dalej"}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
