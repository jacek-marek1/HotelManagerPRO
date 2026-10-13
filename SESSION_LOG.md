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

### 12. Repozytorium GitHub
Decyzja Jacka: repozytorium https://github.com/jacek-marek1/HotelManagerPRO. Remote `origin`, commit całego projektu (z PRD i dziennikiem) wypchnięty na `main`. Vercel: nadal nie ruszany.

### 13. Czyszczenie PRD i historii repo
Na prośbę Jacka usunięto z PRD e-mail rekrutera, opis zadania/briefu i wszystkie wzmianki o firmie rekrutującej (w tym linki do zewnętrznego prototypu i boardu). Historia git przepisana (filter-branch), usunięty commit „PRD: usunięty e-mail…", wymuszony push (`--force-with-lease`). Aktualnie: 3 commity na `main`. Lokalna kopia sprzed przepisania w katalogu scratchpad (poza repo).

### 14. Filtr „Piętro"
Dodany dropdown „Piętro" (Wszystkie piętra / Piętro 1 / Piętro 2) w bloku „Wyszukiwanie". Łączy się z terminem, gośćmi i statusem. Uzasadnienie: filtr istniał w oryginale, a PRD (P1-4) wymaga tylko etykiet przed polami. Weryfikacja w Chrome: „Piętro 2" → 201, 202, 203.

### 15. Szczegóły rezerwacji (płatność i kontakt)
Pytanie Jacka: gdzie pokazać płatność, telefon i e-mail bez ingerencji w akcje główne. Wybrane rozwiązanie: panel boczny (Sheet) otwierany kliknięciem w nazwisko gościa lub pozycją „Szczegóły" w menu z trzema kropkami (`reservation-details.tsx`). Tylko do odczytu: płatność, telefon (`tel:`), e-mail (`mailto:`), miasto/kraj, termin, pobyt i suma, uwagi; przycisk „Edytuj" w panelu otwiera modal.
Modal edycji rozszerzony o telefon, e-mail i płatność (dropdown: Nie wybrano / Karta / Gotówka / Faktura / Przelew).
Weryfikacja w Chrome: nazwisko → panel z danymi Jana Kowalskiego → Edytuj → modal z nowymi polami. Poza zakresem PRD (rozszerzenie P1-5), zatwierdzone przez Jacka.

### 16. Mniej nacisku na status, widoczny dostęp do szczegółów
Uwaga Jacka: statusy mniej istotne, potrzebny widoczny element wskazujący na szczegóły i edycję.
- Status: zamiast wypełnionej całej komórki mała etykieta (pigułka) w kolorze statusu; legenda bez zmian.
- Przy każdym gościu: podkreślone nazwisko + przycisk ze strzałką (`title`/`aria-label` „Szczegóły i edycja") otwierający panel szczegółów (z przyciskiem „Edytuj"). Wersja z tekstem „Szczegóły" przywróciła poziomy scroll, więc przycisk jest samą ikoną.
- Kolumna „Pojemność": tylko liczba osób (usunięty skrót typu pokoju, np. „2 os.+", zgodnie z P0-3 PRD).
- Weryfikacja w Chrome: brak poziomego scrolla, kolumna Akcje w pełni widoczna.

### 17. Korekta kroku 16
Jacek doprecyzował: chodziło o znaczniki „Przyjazd dziś" / „Wyjazd dziś" (zajmują miejsce w tabeli), nie o kolor statusu.
- Znaczniki usunięte z tabeli; w panelu szczegółów nowy wiersz „Dziś" (Przyjazd dziś / Wyjazd dziś / Gość w obiekcie). Przyjazdy i wyjazdy dziś nadal są w podsumowaniu na górze (T3).
- Cofnięta moja błędna interpretacja z kroku 16: status znów jako wypełniona komórka (jak prosił Jacek wcześniej).
- Weryfikacja w Chrome: tabela bez znaczników; panel Anny Nowak pokazuje „Wyjazd dziś".

### 18. Usunięta legenda statusów
Ocena: status ma tekst w wypełnionej komórce, więc legenda dubluje informację (PRD E2 dopuszcza „status czytelny bez legendy"; tekst jest też lepszy dla dostępności). Usunięty komponent z widoku (plik `status-legend.tsx` usunięty); „+ Nowa rezerwacja" w osobnym wąskim rzędzie nad tabelą, po prawej.

### 19. Przejście scenariuszy T1–T4 w przeglądarce (stan po kroku 18)
- T1 (30–31.12, 2 os.): 103, 105, 203 (bez 101, 104, 202, 102, 201). OK.
- T2 (28–30.12, 2 os.): tylko 103 z „Sprzątanie – za chwilę gotowy" (203 zajęty, 105 w naprawie). OK.
- T3 (podsumowanie 28.12): Zajęte 4 · Wolne 2 · Sprzątanie 1 · Naprawa 1; przyjazd 102 (Jan Kowalski); wyjazd 103 (Anna Nowak); jutro wyjazd 203 (Rodzina Schmidt). OK.
- T4 (28–30.12, 4 os.): popover „Brak wolnych pokoi" + pusta tabela. OK.
- Znaleziona usterka: przy oknie ~1000 px „Wyczyść" wychodziło poza ramkę → dodane `flex-wrap` w bloku wyszukiwania.
- Uwaga do testów automatycznych: pierwsze kliknięcie po przeładowaniu nie otwierało kalendarza (artefakt narzędzia, nie aplikacji).

### 20. CTA w nagłówku tabeli i uproszczenie dostępu do szczegółów
- Rząd nad tabelą: po lewej tytuł z licznikiem („Pokoje · 8" / „Dostępne pokoje · N" przy wyszukiwaniu), po prawej „Nowa rezerwacja" w rozmiarze `lg` z ikoną plusa.
- Menu z trzema kropkami: usunięta pozycja „Szczegóły" (zostają Edytuj i Usuń). Dostęp do szczegółów: klikalne nazwisko i strzałka obok.

### 21. Tabela w boxie, wyróżniony nagłówek
Tytuł z licznikiem, CTA, tabela i (gdy >1 strona) paginacja w jednym kontenerze (obramowanie, zaokrąglenia, `overflow-hidden`); wiersz nagłówka tabeli w lekkim kolorze (`slate-100`, pogrubione etykiety). Eksport zostaje pod boxem.

### 22. Większy komunikat braku wyników
Popover „Brak wolnych pokoi" powiększony: szerokość 28rem, padding 5, tytuł `text-lg font-semibold`, treść `text-base` (wcześniej 18rem / sm).

### 23. Wyrównanie „Rezerwuj" do prawej
Gdy wiersz nie ma menu z trzema kropkami (pokój wolny, w naprawie, wyniki wyszukiwania), „Rezerwuj" jest dosunięty do prawej krawędzi kolumny (usunięty pusty znacznik miejsca po menu).

### 24. Eksport i „Rezerwuj" – styl przycisków
- Eksport: ikona pobierania przy „Eksportuj dane jako:", przyciski (Plik Excel, Plik PDF, Drukuj) w wariancie secondary (szare).
- „Rezerwuj" w tabeli: wariant outline (obrys bez wypełnienia).

### 25. Poprawiona akcja „Wyczyść"
Wyglądała jak zwykły tekst, była przesunięta względem pól i czyściła tylko termin. Teraz: przycisk outline z ikoną X „Wyczyść filtry", wyrównany z polami , widoczny gdy aktywny jest dowolny filtr (termin, goście, piętro, status), resetuje wszystkie do wartości domyślnych i wraca na stronę 1.

Korekta: przy węższym oknie (~1000 px) przycisk zawijał się pod pola, więc przeniesiony do nagłówka bloku „Wyszukiwanie" (po prawej, rozmiar sm) – zawsze się mieści.

### 26. Weryfikacja założeń i naprawa luk (3 kliknięcia, dostęp do informacji, błędy, edge cases)
Decyzja Jacka: dashboard traktowany jako realny, bez komunikatów o „prototypie".
Znalezione luki i naprawy:
- Auto-ustawianie „2 osoby" tylko przy kompletnym terminie (od < do); dwukrotne kliknięcie tego samego dnia nie zawęża już listy (zweryfikowane w Chrome).
- Komunikat braku wyników zależny od przyczyny: brak wolnych pokoi w terminie vs. za wąskie filtry piętra/statusu (zweryfikowane w Chrome); pusta tabela: „Zmień filtry".
- Modal rezerwacji: błąd i blokada zapisu dla pokoju w naprawie przed datą końca naprawy (Chrome); informacja przy pokoju w sprzątaniu (przyjazd dziś); walidacja telefonu i e-maila (czerwone pole + komunikat, Chrome); podpowiedź przy pustym nazwisku.
- Eksport działa: Plik Excel → CSV (średnik, BOM, polskie znaki; `lib/export.ts`), Plik PDF i Drukuj → okno drukowania (elementy sterujące ukryte w druku, `print:hidden`). Toast „Wyeksportowano N pokoi do pliku Excel" (Chrome; sam plik zweryfikowany skryptem, nie w przeglądarce).
- Toasty po zapisie, dodaniu i usunięciu rezerwacji (`role="status"`).
Otwarte: liczba osób w rezerwacji i data końca naprawy nadal tylko w uwagach; „Jutro" w podsumowaniu bez liczb; filtr „Status dziś" z wybranym terminem ukrywa np. 103 przy „Wolny".

### 27. Zarządzanie stanem pokoju (sprzątanie / naprawa)
Pytanie Jacka: jak recepcjonista zarządza statusami pokojów. Luka: stan techniczny był tylko w danych testowych. Zaakceptowane domyślne odpowiedzi: po dniu wyjazdu pokój automatycznie w „Sprzątanie" do oznaczenia; tylko recepcjonista (bez ról); sprzątanie zawsze dotyczy „dziś".
- Stan pokoju w stanie aplikacji (`rooms`), pokój i rezerwacja rozdzielone. `Condition.none` ma `readyOn`.
- Logika (`lib/availability.ts`): `isCleaning` (ręcznie albo wyjazd dziś bez oznaczenia „gotowy"), `repairConflicts`, `isCleaningSoon(room, reservations, from)`.
- UI: menu z trzema kropkami przy każdym pokoju → „Zmień stan pokoju" (okno `room-state-dialog.tsx`: Gotowy / Sprzątanie / Naprawa do dnia + uwagi do pokoju); przycisk z haczykiem „Oznacz jako posprzątany" w komórce statusu pokoju w sprzątaniu; Edytuj/Usuń zmienione na „Edytuj rezerwację"/„Usuń rezerwację".
- Walidacja: naprawa wymaga daty późniejszej niż dziś; blokada zapisu i lista kolidujących rezerwacji.
- Weryfikacja: skrypt (T1–T4 bez zmian; 103 gotowy → 3 wolne; konflikt naprawy 102 z Janem Kowalskim) i Chrome (haczyk 103 → Wolny + toast; naprawa 102 → czerwony komunikat, Zapisz nieaktywny). Zapis zmiany stanu w oknie i zdjęcie naprawy nie były klikane.

### 28. Rezerwuj na przyszłość: domyślne daty = najbliższy wolny termin
Pytanie Jacka o „Rezerwuj" przy każdym pokoju (rezerwacja na przyszłość). Problem: okno miało domyślnie dziś → jutro, więc przy zajętym pokoju od razu był błąd kolizji.
- `nextFreeStart(room, reservations)` w `lib/availability.ts`: po końcu naprawy i po wyjeździe obecnych gości (np. 102 → 02.01, 105 → 30.12, 203 → 29.12, 201 → 03.01).
- Okno nowej rezerwacji bez terminu z wyszukiwania używa tej daty i pokazuje podpowiedź „Pokój jest zajęty/w naprawie do … – najbliższy wolny termin"; zmiana pokoju w oknie przelicza daty, dopóki użytkownik ich nie ruszył. Z wyszukiwania daty nadal przenoszą się bez zmian.
- Weryfikacja w Chrome: Rezerwuj przy 102 → 02.01–03.01 + podpowiedź, bez błędu. Zmiana pokoju w oknie nie była klikana.

### 29. Domknięcie otwartych punktów (zaakceptowane przez Jacka)
1. Liczba osób w rezerwacji: opcjonalne `guestsCount` (Schmidt = 4 z PRD, pozostałe puste), pole w oknie rezerwacji, wiersz w panelu szczegółów; walidacja: całkowita ≥ 1 i nie więcej niż pojemność pokoju; z wyszukiwania podstawia się liczba gości.
2. Data końca naprawy w komórce statusu („Naprawa do 30.12"); usunięta automatyczna wzmianka w uwagach.
3. „Jutro" w podsumowaniu z liczbami; reguła: po wyjeździe gościa pokój idzie do sprzątania także w prognozie (jutro: Zajęte 3, Wolne 3, Sprzątanie 1 (203), Naprawa 1). T3 bez zmian.
4. Filtr „Status dziś" ukryty przy wybranym terminie i ignorowany w wynikach wyszukiwania (wraca po wyczyszczeniu).
5. Okno rezerwacji: dodane Miasto/kraj i Cena/noc (walidacja > 0; zmiana pokoju w nowej rezerwacji podstawia cenę pokoju, dopóki cena nie była edytowana).
Weryfikacja: skrypt (T1–T4 bez zmian, jutro 3/3/1/1) i Chrome (karta Jutro z liczbami, „Naprawa do 30.12", panel Schmidtów z „Liczba osób 4", okno edycji z nowymi polami, błąd „Pokój 203 mieści maksymalnie 4 osoby"). Nie klikane: ukrywanie filtra statusu przy terminie, zapis zmienionej ceny/liczby osób.

### 30. Okno nowej rezerwacji: mniej pól, błąd dopiero po „Zapisz"
- W trybie nowej rezerwacji usunięte pola „Miasto / kraj" i „Cena / noc" (cena wynika z wybranego pokoju); w edycji rezerwacji zostają.
- Brak imienia i nazwiska: bez wstępnej podpowiedzi; „Zapisz" jest aktywny, a po kliknięciu przy pustym polu pole robi się czerwone i pojawia się „Podaj imię i nazwisko gościa." (zapis wstrzymany). Pozostałe błędy (daty, kolizje, naprawa, telefon, e-mail, liczba osób) nadal blokują „Zapisz" od razu.
- Weryfikacja w Chrome: okno bez cen i miasta, błąd po kliknięciu „Zapisz". W trakcie zmiany skrypt źle domknął JSX (błąd składni naprawiony od razu, `tsc`/`eslint` czyste).

### 31. „Liczba osób" obok pola „Gość"
W oknie rezerwacji (nowa i edycja) „Liczba osób" stoi w jednym rzędzie z „Gość" (szerokość 9 rem). W edycji rząd z „Miasto / kraj" i „Cena / noc" ma teraz dwie kolumny. Weryfikacja w Chrome (okno nowej rezerwacji); układ edycji nie był oglądany po zmianie.

### 32. „Dziś" i „Jutro" jako rozwijane karty
Prośba Jacka: oszczędzić miejsce nad tabelą. Karty są domyślnie zwinięte: nagłówek (dzień + data + strzałka), liczby statusów w jednej linii oraz liczba przyjazdów i wyjazdów; po kliknięciu rozwijają się nazwiska/pokoje przyjazdów i wyjazdów (`aria-expanded`). Świadomy kompromis względem PRD (P0-2: podsumowanie bez dodatkowych kliknięć): liczby i liczba przyjazdów/wyjazdów widoczne od razu, same nazwiska za jednym kliknięciem; domyślnie rozwinięte można przywrócić jedną zmianą (`useState(false)` → `true`).
Weryfikacja w Chrome: zwinięte karty (tabela wyżej), rozwinięcie „Dziś" pokazuje 102 (Jan Kowalski) / 103 (Anna Nowak).

### 33. Większy nagłówek „Wyszukiwanie"
Nagłówek bloku z `text-sm` na `text-lg font-semibold` (jak „Pokoje" nad tabelą); wiersz nagłówka `h-9`.

### 34. Opis procesu pracy z AI
Na prośbę Jacka: `docs/PROCES_PRACY_Z_AI.md` (pełna lista zmian względem oryginału, ewolucja, decyzje, pomyłki AI, efekt) i `docs/OPIS_FIGJAM.md` (krótki opis do wklejenia do FigJama).

### 35. Zamiana kolorów statusów
Zajęty = czerwony (`red-100`), Naprawa = szary (`slate-200`); Wolny (zielony) i Sprzątanie (żółty) bez zmian.

### 36. Nazwisko bez podkreślenia, chevron obok
Usunięte podkreślenie nazwiska gościa; mały chevron (`size-3.5`) bezpośrednio za nazwiskiem w tym samym przycisku (jedno miejsce kliknięcia, `title`/`aria-label` „Szczegóły i edycja"); hover zmienia kolor nazwiska i ikony. Osobny przycisk ze strzałką po prawej usunięty.

### 37. Bez ikony w statusie „Sprzątanie"
Usunięty przycisk z haczykiem z komórki statusu. Funkcja „Oznacz jako posprzątany" przeniesiona do menu z trzema kropkami (pierwsza pozycja, tylko dla pokoju w sprzątaniu). Weryfikacja w Chrome: komórka bez ikony, menu pokoju 103 z nową pozycją na górze; samo kliknięcie pozycji nie było powtarzane po przeniesieniu.

### 38. Chevron w obramowaniu, hover na nazwisku
Chevron obok nazwiska w małym polu z cienkim obrysem (`size-5`, `border-border`); po najechaniu na przycisk: nazwisko się podkreśla (bez stałego podkreślenia), a pole z chevronem dostaje ciemniejszy obrys i szare tło; kursor `pointer`.

### 39. Więcej pokoi i klientów (dane demonstracyjne)
Prośba Jacka: pokazać zarządzanie pokojami na większej liczbie danych, ten sam wzór, nadal dwa piętra. Oryginalne 8 pokoi i 5 rezerwacji bez zmian; dodane 12 pokoi (106–110 na P1, 204–210 na P2; razem 20: po 10 na piętro) i 11 fikcyjnych rezerwacji z pełnymi danymi (gość, miasto/kraj, telefon, e-mail, płatność, liczba osób), pokoje posortowane po numerze.
Zaprojektowane sytuacje (dziś = 28.12.2024): przyjazdy dziś (102, 108, 210), wyjazdy dziś (103, 109 – 109 przechodzi w sprzątanie automatycznie), wyjazd jutro (203, 206), przyjazd jutro (208), sprzątanie ręczne (209), naprawa do 02.01 (110), rezerwacje na przyszłość (106, 107, 204), długi pobyt (207).
Skutek dla scenariuszy PRD (które zakładały 8 pokoi): T1 (30–31.12, 2 os.) → 103, 105, 203, 109, 204, 206, 209 (nadal zawiera 103 i 203, bez 1-osobowych i zajętych); T2 → 103, 109, 209 (wszystkie „za chwilę gotowy"); T3 dziś → Zajęte 10, Wolne 5, Sprzątanie 3, Naprawa 2; przyjazdy 102, 108, 210; wyjazdy 103, 109; jutro wyjazdy 203, 206, przyjazd 208. Wartości z PRD dla T3 (4/2/1/1) dotyczą wyłącznie oryginalnych 8 pokoi. Brak wyników (T4) np. 28–30.12, 4 os., Piętro 2.
Spójność danych sprawdzona skryptem (brak nakładania rezerwacji, pojemność, istniejące pokoje).

### 40. Suma przeniesiona do panelu bocznego
Z komórki „Gość i pobyt" usunięta kwota za pobyt (zostają: nazwisko, termin, liczba nocy). W bocznym panelu szczegółów osobny wiersz „Suma" (noce × cena/noc); wiersz „Pobyt" ma tylko noce i cenę za noc.

### 41. Przewodnik po prototypie (samouczek)
Prośba Jacka: osoba otwierająca prototyp ma być przeprowadzona przez flow; zakres zawężony do głównego zadania (szybkie znalezienie wolnego pokoju dla gościa walk-in i sprawdzenie obłożenia, problemy użyteczności → rozwiązania); przewodnik sam wykonuje akcje na ekranie, ale do kolejnego kroku przechodzi osoba oglądająca („Idę dalej" / „Wychodzę").
- Komponent `components/guided-tour.tsx`: modal powitalny (Tak / Nie; „Nie" zapamiętane w `sessionStorage`), ciemna nakładka z podświetleniem elementu (box-shadow), dymek z numerem kroku, sekcjami „Problem" i „Rozwiązanie", przyciskami „Wychodzę", „Wstecz", „Idę dalej" (na ostatnim kroku „Zakończ"); klawisze: strzałki i Enter (dalej/wstecz), Esc (wyjście). Przycisk „Przewodnik" w nagłówku uruchamia go ponownie.
- 6 kroków: (1) obłożenie (karty Dziś/Jutro, Dziś rozwinięte), (2) termin i liczba osób (przewodnik ustawia 28–30.12, 2 osoby), (3) wynik liczony z dat (sprzątanie „za chwilę gotowy"), (4) „Rezerwuj" w wyniku, (5) komunikat braku wyników (4 osoby, Piętro 2), (6) kolumna statusu (filtry wyczyszczone).
- Na czas przewodnika: blokada klikania w ekran pod spodem, pusta przestrzeń na dole strony (żeby cel dało się przewinąć na górę), popover braku wyników nie zamyka się sam.
- Po „Zakończ" / „Wychodzę" ekran wraca do stanu początkowego (filtry, karty).
- Weryfikacja w Chrome: modal, kroki 1–6, „Zakończ" z resetem. Znaleziona i naprawiona w trakcie: dymek zasłaniał podświetlaną tabelę (zmiana przewijania i ustawiania dymku, krok 6 zawężony do kolumny statusu). Nie sprawdzone: „Nie" w modalu powitalnym, „Wychodzę", „Wstecz", przycisk „Przewodnik" w nagłówku.

### 42. Przewodnik: krok 7 – dane klienta w panelu bocznym
Dodany krok „Dane klienta poza tabelą": przewodnik otwiera panel szczegółów Jana Kowalskiego i tłumaczy, że dane kontaktowe, forma płatności, suma za pobyt i uwagi są w panelu bocznym (problem: wiek, miasto, telefon, e-mail i płatność zabierały szerokość tabeli). Technicznie: panel jest niemodalny na czas przewodnika (`modal={!tourActive}`) i nie zamyka się po kliknięciu poza nim; `TourApi.openDetails`; reset zamyka panel. Modal powitalny: „7 krótkich kroków".
Weryfikacja w Chrome: krok 7 z panelem (telefon, e-mail, suma 1250 PLN, uwagi), „Zakończ" zamyka panel i przywraca ekran.

### 43. Treść ekranu powitalnego przewodnika
Opis zastąpiony tekstem Jacka („Cześć, przygotowałem krótki przewodnik po moim redesignie…"); przyciski „Tak" → „Zaczynamy", „Nie" → „Rezygnuję" (zinterpretowane z niepełnego polecenia); z drugiego akapitu usunięte pytanie „Czy chcesz przejść…", bo nie pasuje do nowych przycisków.

## Stan na teraz
- Lokalnie: `npm run dev` → http://localhost:3000. `tsc` i `eslint` bez błędów.
- Lokalne repo git założone przez create-next-app (bez commitów od nas). GitHub i Vercel: **nietknięte**, czekają na decyzję Jacka.
- Otwarte: Excel/PDF nic nie generują; interpretacja „Pokaż wolne pokoje" do potwierdzenia; T4 do obejrzenia w przeglądarce.
