# Proces pracy z AI – HotelManager PRO (prototyp ekranu rezerwacji)

Źródło szczegółów: [SESSION_LOG.md](../SESSION_LOG.md) (33 wpisy) i historia git. Historia git została przepisana, więc pierwsze kroki (P0 i P1) są w jednym commicie; dziennik jest dokładniejszy niż `git log`.

## 1. Punkt wyjścia i sposób pracy

- Jeden dokument wymagań (PRD) jako źródło prawdy; reguły: nic spoza PRD, przy niejasnościach pytania, zakaz tworzenia repozytorium i publikacji bez decyzji autora.
- Kolejność z promptu: plan bez kodu → akceptacja → P0 lokalnie → tabela wyników T1–T4 → P1 po akceptacji.
- Plan przed kodem: struktura, model danych, komponenty shadcn, 6 pytań z domyślnymi odpowiedziami (zaakceptowane jednym słowem).
- Stack: Next.js 16, shadcn/ui (Base UI), Tailwind v4, dane lokalne, „dziś" = 28.12.2024 jako stała.
- Rozmiar efektu: ok. 2000 linii własnego kodu, 10 własnych komponentów, jedna strona.

## 2. Zmiany względem oryginalnego ekranu

| Oryginał | Prototyp |
|---|---|
| Pola Od/Do nie filtrowały listy | Kalendarz zakresu realnie filtruje pokoje |
| „Wolne" = status na dziś | Dostępność z nakładania dat rezerwacji, pojemności i stanu technicznego |
| Pojemność ukryta w skrótach („2os.+") | Pojemność w osobach |
| Brak podsumowania obłożenia | Karty „Dziś" i „Jutro": liczby statusów, przyjazdy, wyjazdy |
| Sprzątanie i naprawa tylko w uwagach | Stan techniczny wpływa na dostępność (sprzątanie „za chwilę gotowy", naprawa do daty) |
| Status wpisywany ręcznie w modalu | Status wyliczany z dat i stanu pokoju |
| Pokój i rezerwacja jako jeden rekord | Rozdzielone w modelu (pokój ma wiele rezerwacji) |
| Akcje R/E/U | „Rezerwuj" + menu z trzema kropkami |
| „Nowak (wyjazd)" w nazwisku | Czyste nazwisko; wyjazd wynika z dat |

Scenariusze testowe T1–T4 z PRD przechodzą w przeglądarce w obecnym układzie.

## 3. Ewolucja prototypu po pierwszej wersji

1. P0, potem P1: modal edycji, usuwanie z potwierdzeniem, znaczniki przyjazdu i wyjazdu.
2. „R" w oryginale znaczyło „Rezerwuj": dodana akcja „Rezerwuj".
3. Dashboard: CTA „Nowa rezerwacja", menu z trzema kropkami, filtr statusu, kolor statusów, paginacja, nazwane przyciski eksportu.
4. Korekty układu: status jako dropdown, CTA w kontekście tabeli, eksport na dole, tabela w kontenerze z wyróżnionym nagłówkiem, jeden blok „Wyszukiwanie", przycisk „Wyczyść filtry", rozwijane karty Dziś/Jutro, usunięta legenda (status ma tekst w komórce).
5. Dodane po rozmowie o potrzebach recepcji: filtr piętra, panel szczegółów klienta (płatność, kontakt), liczba osób w rezerwacji.
6. Zarządzanie stanem pokoju: Gotowy / Sprzątanie / Naprawa do dnia, szybkie „posprzątany", automatyczne sprzątanie po wyjeździe.
7. Walidacje i komunikaty: kolizje terminów, naprawa, telefon, e-mail, pojemność; toasty; działający eksport (Excel jako CSV, PDF i druk przez okno drukowania).
8. Okno nowej rezerwacji: domyślne daty = najbliższy wolny termin pokoju, błąd nazwiska po „Zapisz".

## 4. Decyzje podjęte przez autora

- Plan z domyślnymi odpowiedziami (m.in. popover zamiast modala przy braku wyników).
- Przeniesienie CTA i eksportu poza górę ekranu.
- Statusy z wypełnionymi komórkami, potem usunięcie legendy jako zbędnej.
- Zlecenie oceny ekranu względem PRD i przyjęcie jej rekomendacji.
- Dashboard traktowany jak realny (bez komunikatów o „prototypie").
- Repozytorium GitHub i czyszczenie PRD oraz historii git.

## 5. Gdzie AI się pomyliło i jak to skorygowano

- **Błędna interpretacja:** „statusy nie są istotne" zrozumiane jako osłabienie koloru, a chodziło o znaczniki „Przyjazd/Wyjazd dziś". Skorygowano na uwagę autora.
- **Regresja przy naprawie błędu:** zmiana domyślnej liczby gości wydłużyła główny scenariusz do 4 kliknięć. Wykryte w ocenie względem PRD; przywrócono 3 kliknięcia.
- **Zbyt agresywna zmiana układu:** tekstowy przycisk „Szczegóły" przywrócił poziomy scroll (wymóg PRD). Zamieniony na ikonę.
- **Błędy skryptów edycji:** dwa razy źle zmodyfikowane pliki; wykryły je `tsc` i `eslint` przed trafieniem do repozytorium.
- **Pomyłka w git:** zbędne `git rm --cached`, cofnięte `git reset` bez utraty zmian.
- **Luki wykryte w audycie na prośbę autora:** brak walidacji, rezerwacja pokoju w naprawie, nieaktywny eksport, mylący komunikat braku wyników.

## 6. Efekt i ograniczenia

- Efekt: T1–T4 przechodzą, główny scenariusz w 3 kliknięciach, spójny model danych, zarządzanie stanem pokoju, walidacje, historia 24+ commitów.
- Ograniczenia: dane są lokalne (znikają po odświeżeniu), eksport do Excela to CSV, publikacja na Vercelu jeszcze niewykonana, kilku ścieżek nie sprawdzono w przeglądarce (np. zapis zmienionej ceny, zdjęcie naprawy).
- Rozbieżności z PRD przyjęte świadomie: zwinięte karty Dziś/Jutro (P0-2) i wypełnione komórki statusu (E3).
