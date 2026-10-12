# Dziennik sesji – prototyp HotelManager PRO

Źródło wymagań: `PRD_HotelManager_PRO.md` (v1.2). Dziennik prowadzony przez Claude Code; każdy krok dopisywany na bieżąco.
Surowy, dosłowny zapis rozmowy: `~/.claude/projects/-Users-jacekmarek/575f7ccd-3ee0-493e-8200-7c268e9524c0.jsonl`
(ten plik to streszczenie kroków i decyzji, nie transkrypt).

## Jak odtworzyć projekt od zera
```bash
# create-next-app odrzuca nazwę z wielkimi literami, więc scaffold w folderze o małej nazwie, potem kopia do HotelManagerPRO
npx create-next-app@latest hotelmanager-pro --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
cd HotelManagerPRO
npx shadcn@latest init -d -y
npx shadcn@latest add card popover calendar select table badge label separator dialog input dropdown-menu checkbox -y
npm run dev   # http://localhost:3000
```
Uwaga: shadcn jest tu oparty na Base UI (nie Radix): zamiast `asChild` używa się propa `render`; do `ui/popover.tsx` dodano prop `anchor`.

## Kroki

### 1. Zadanie i zasady (prompt startowy)
- Prototyp wg PRD, nic spoza PRD, pytania przy niejasnościach.
- Nigdy: repo GitHub / deploy Vercel bez decyzji Jacka (praca lokalna).
- Kolejność: plan bez kodu → akceptacja → P0 lokalnie → wyniki T1–T4 + adres → P1 po OK.
- Dodatkowo: wszystko w `~/Desktop/HotelManagerPRO`.

### 2. Plan i decyzje (zaakceptowane „Akceptuję")
Struktura `src/{app,lib,components,components/ui}`; model Room / Reservation rozdzielony; dostępność z nakładania dat (`arrival < to && departure > from`); status dnia wyliczany.
Domyślne odpowiedzi na pytania:
1. Liczba gości domyślnie 2 (T1 w 3 interakcjach).
2. Brak wyników (T4): popover przy pasku wyszukiwania.
3. Modal edycji dopiero w P1.
4. Naprawa 105 „do 30/12": wolny od nocy 30.12 (pojawia się w T1).
5. Oznaczenie „sprzątanie – za chwilę gotowy" tylko, gdy termin zaczyna się dziś.
6. Eksporty i nagłówek admina w P1.
Pojemności: 101/104/202 = 1; 102/201 = 2; 103 = 3; 203 = 4; 105 = 4.

### 3. P0 (zrobione)
Pliki: `lib/{types,data,dates,availability}.ts`, `components/{occupancy-summary,availability-search,rooms-table,room-status-badge}.tsx`, `app/page.tsx`.
Weryfikacja: skrypt (poza repo) na funkcjach z `availability.ts` + przegląd w Chrome.
- T1 (30–31.12, 2 os.) → 103, 105, 203
- T2 (28–30.12, 2 os.) → 103 (sprzątanie)
- T3 → Zajęte 4 · Wolne 2 · Sprzątanie 1 · Naprawa 1; przyjazd 102; wyjazd 103; jutro wyjazd 203
- T4 (28–30.12, 4 os.) → brak wyników (komunikat popover; w przeglądarce jeszcze nieoglądany)

### 4. P1 (po „idź od razu dalej")
Modal edycji + usuwanie z potwierdzeniem (`reservation-dialogs.tsx`), znaczniki „Przyjazd/Wyjazd dziś", czyste nazwisko Anny Nowak, jeden format daty, ukryte wiek/miasto/telefon/email, nagłówek Acme Corp Hotel.
Poprawka: kolumna Akcje chowała się za poziomym scrollem → piętro przy numerze pokoju, pobyt w 2 liniach, uwagi zawijane.

### 5. Akcja „Rezerwuj"
Jacek: „R" w oryginale = Rezerwuj. Dodano „Rezerwuj" (otwiera modal w trybie nowej rezerwacji z datami z wyszukiwania). Poprawiono odmianę „1 noc / 2 noce / 5 nocy" (`formatNights`).

### 6. Zmiany dashboardu zamówione przez Jacka
- CTA „+ Nowa rezerwacja" w nagłówku (wybór pokoju w modalu).
- „Rezerwuj" jako akcja wiodąca; Edytuj/Usuń w menu z trzema kropkami (kebab).
- Filtr statusu (przyciski) + checkbox „Pokaż wolne pokoje" (= skrót do filtra „Wolny"; wyłączone przy wyszukiwaniu terminu).
- Wypełnione tło komórek statusu (nadpisuje punkt E3 PRD).
- Legenda kolorów + paginacja (5 pokoi / strona, ukryta przy jednej stronie).
- Eksport: „Eksportuj dane jako: Plik Excel / Plik PDF" (bez działania) + osobno „Drukuj" (`window.print()`).

### 7. Prośba o zapisywanie sesji
Ten plik; dopisywany po każdym kolejnym kroku.

### 8. Poprawki układu i błąd filtra gości
- Błąd: liczba gości filtrowała tylko razem z terminem (wybór „4 osoby" bez dat nic nie zmieniał). Teraz filtruje też bez dat (pojemność ≥ liczba gości).
- Zmiana domyślnej wartości: „Liczba gości" = „Dowolna liczba" (wcześniej 2), bo domyślne 2 ukrywałoby pokoje 1-osobowe na starcie. Konsekwencja: T1 wymaga ręcznego wyboru „2 osoby" (4 interakcje zamiast 3, PRD mówi maks. 3) – do decyzji Jacka.
- Filtr statusu jako dropdown („Wszystkie statusy"); „+ Nowa rezerwacja" przeniesione z nagłówka do paska nad tabelą (obok filtrów).
- Eksport (Excel / PDF / Drukuj) przeniesiony na dół strony (`components/export-actions.tsx`).
- Weryfikacja w Chrome: „4 osoby" bez terminu → tylko 105 i 203.

### 9. Układ filtrów i legenda
- Legenda przeniesiona w lewy dolny róg (pod tabelą, w jednym rzędzie z eksportem po prawej).
- Filtr statusu (dropdown) i checkbox „Pokaż tylko wolne pokoje" w jednym kontenerze „Filtrowanie". Interpretacja: zmieniono tylko nazwę checkboxa, dropdown statusu zostaje (do potwierdzenia).
- „Rezerwuj" w wierszach jako wariant secondary, żeby nie konkurował z głównym CTA „+ Nowa rezerwacja".

### 10. Wyrównanie pól wyszukiwania
- Dropdown „Liczba gości" był przesunięty względem pola terminu (różna wysokość kolumn). Naprawa: wspólna wysokość `h-9`, kolumny `flex flex-col gap-2`, kontener `items-start`; „Wyczyść" z `mt-7 h-9`.

### 11. Wdrożone rekomendacje po ocenie względem PRD
Ocena wykazała: dwa konkurujące bloki filtrów, checkbox „tylko wolne" = błąd z oryginału (status na dziś), T1 w 4 interakcjach, za dużo pasów nad tabelą.
- Jeden blok „Wyszukiwanie": termin, liczba gości, „Status dziś" (dropdown). Brak wzajemnego wyłączania: status działa także z wybranym terminem (filtruje po statusie na dziś).
- Usunięty checkbox „Pokaż tylko wolne pokoje" (zastępuje go opcja „Wolny" w dropdownie) oraz `table-toolbar.tsx`.
- Liczba gości: start „Dowolna liczba"; po wybraniu kompletnego terminu ustawia się automatycznie na 2 osoby → T1 znów w 3 interakcjach (zweryfikowane w Chrome: 103, 105, 203).
- Legenda nad tabelą (lewa strona), obok „+ Nowa rezerwacja"; na dole tylko eksport.
- Paginacja: 10 pokoi/strona (przy 8 pokojach ukryta, zgodnie z P1-3).

## Stan na teraz
- Lokalnie: `npm run dev` → http://localhost:3000. `tsc` i `eslint` bez błędów.
- Lokalne repo git założone przez create-next-app (bez commitów od nas). GitHub i Vercel: **nietknięte**, czekają na decyzję Jacka.
- Otwarte: Excel/PDF nic nie generują; interpretacja „Pokaż wolne pokoje" do potwierdzenia; T4 do obejrzenia w przeglądarce.
