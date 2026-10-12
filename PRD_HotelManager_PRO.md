# Product Requirements Document: HotelManager PRO – Dostępność i obłożenie

> **Document Status:** Draft  
> **Last Updated:** 12 października 2026 (v1.2)  
> **Product Manager:** Jacek (Product / UX Designer)  
> **Contributors:** Claude (analiza, recenzja boarda, dowody), Claude Code (agent implementujący prototyp)

> **Uwaga dla agenta (Claude Code):** Ten dokument jest jedynym źródłem wymagań. Nie dodawaj funkcji, ekranów ani danych spoza PRD. Jeśli coś jest niejasne albo wymienione w sekcji *Open Questions*, **zapytaj Jacka, zamiast zakładać**. Szczegółowe instrukcje techniczne są w sekcji *Technical Specifications → Instrukcje dla agenta*.

---

## Executive Summary

**Product Name:** HotelManager PRO – ekran listy rezerwacji (redesign, klikalny prototyp)

**Problem Statement:**  
HotelManager PRO to wewnętrzne narzędzie dla małych i średnich obiektów noclegowych (3–50 pokoi lub apartamentów), z którego recepcjoniści i właściciele korzystają codziennie. Obecny ekran nie pozwala zapytać o dostępność na konkretny termin i liczbę gości – pokazuje tylko stan „na teraz”. Recepcjonista nie odpowie gościowi walk-in w jednym kroku na pytanie „czy macie pokój dla 2 osób na 2 noce?”, a właściciel musi liczyć obłożenie ręcznie.

**Proposed Solution:**  
Nowa wersja ekranu, w której recepcjonista podaje termin (od–do) i liczbę osób, a system pokazuje pasujące pokoje, wyliczając dostępność z dat rezerwacji, pojemności i stanu technicznego pokoju. Te same dane zasilają podsumowanie obłożenia dla właściciela („jakie mam dziś obłożenie i co się dzieje jutro?”).

**Success Metrics:**  
- Wyszukiwanie dostępności zwraca poprawny wynik we wszystkich scenariuszach testowych (sekcja *Success Metrics (Detailed)*)
- Od pytania gościa do wskazania pokoju: maks. 3 interakcje
- Właściciel widzi obłożenie na dziś bez liczenia wierszy ręcznie

**Launch Target:** Oddanie publicznego linku do prototypu w ustalonym terminie (do 4 dni od startu, rekomendowany nakład do 4 godzin)

---

## Background & Context

### Why Now?
Analiza obecnego ekranu listy rezerwacji jest zakończona. Ten PRD opisuje redesign: nowy ekran oparty na analizie, w którym kluczowa funkcja naprawdę działa (lub udaje), a nie jest statycznym obrazkiem.

### User Research & Insights
- **Research Methods:** Test oryginalnego prototypu w przeglądarce, przeklikanie filtrów i modala edycji, analiza na boardzie FigJam (Kontekst → Analiza → Główny problem), recenzja boarda i plansze z dowodami (#1–#4).
- **Key Findings:**
  - **Termin:** pola Od/Do nie filtrują listy. Przy terminie 30–31.12.2024 nadal widać 8/8 rekordów, łącznie z pobytami, które kończą się wcześniej (dowód #1 A).
  - **„Wolne” = status na dziś:** z zaznaczonym „Wolne” i terminem 30–31.12 zostają tylko 101 i 202. Brakuje 203 (wyjazd 29.12), 104 (wyjazd 30.12) i 103 (dziś sprzątanie). 105 ma w Uwagach „niedostępny do 30/12” (dowód #1 B).
  - **Model danych:** zakładka nazywa się „Rezerwacje”, ale każdy wiersz to pokój z maks. jedną rezerwacją. Przyszłych rezerwacji nie widać, a z tego wynikają problemy z terminem i statusem.
  - **Status ustawiany ręcznie:** w modalu edycji status to dropdown w sekcji „Dane pokoju”, niezależny od dat przyjazdu i wyjazdu (dowód #4).
- **User Quotes (pytania użytkowników z Kontekstu):**
  > Recepcjonista (gość walk-in stoi przy ladzie, presja czasu): „Czy macie pokój dla 2 osób na 2 noce od dziś?”

  > Właściciel (szybki przegląd): „Jakie mam dziś obłożenie i co się dzieje jutro?”

### Market Analysis
- **Market Size:** Nie dotyczy (narzędzie wewnętrzne).
- **Competitive Landscape:** Nie dotyczy, nie analizowano.
- **Differentiation:** Nie dotyczy. Punktem odniesienia jest oryginalny ekran HotelManager PRO.

---

## Goals & Success Criteria

### Business Goals
1. Dostarczyć działający, klikalny prototyp pod publicznym linkiem (bez logowania),.
2. Pokazać tezę (główny problem) i dowód, że da się ją dowieźć.
3. Mieć materiał do przeprowadzenia przez proces na rozmowie: board, dowody, ślad pracy z AI.

### User Goals
1. **Recepcjonista:** odpowiada gościowi walk-in w kilka sekund, czy jest pokój na dany termin i liczbę osób.
2. **Właściciel:** widzi obłożenie na dziś i to, co dzieje się jutro, bez liczenia wierszy.
3. Oba typy użytkowników mogą ufać statusom, bo wynikają z dat i stanu technicznego, a nie z ręcznych wpisów.

### Success Metrics (Detailed)

„Dziś” w prototypie = **28.12.2024** (tak jak w oryginale).

> **Priorytet:** głównym celem jest szybsze znalezienie wolnych pokoi i sprawdzenie obłożenia. Dane testowe to przykład. Nie skupiamy się na szczegółowych przypadkach brzegowych danych (dokładna pojemność, daty końca naprawy itp.), tylko na tym, żeby wyszukiwanie i podsumowanie działały poprawnie i szybko.

| Metric | Baseline (oryginał) | Target (prototyp) | Timeframe | Measurement Method |
|--------|---------------------|-------------------|-----------|-------------------|
| Filtrowanie po terminie | Pola Od/Do nie filtrują listy | Lista zawiera tylko pokoje dostępne w całym wybranym terminie | Przed oddaniem | Scenariusze testowe T1–T2 |
| Poprawność wyniku dla walk-in | Dla 30–31.12 + „Wolne”: 2 pokoje, pominięte co najmniej 3 (203, 104, 103) | 100% poprawnych wyników w scenariuszach T1–T2 | Przed oddaniem | Ręczne porównanie z danymi testowymi |
| Liczba interakcji: pytanie gościa → wskazany pokój | Nie da się wykonać (brak filtra terminu i liczby osób) | Maks. 3 interakcje | Przed oddaniem | Przejście scenariusza T1 w przeglądarce |
| Czas odpowiedzi recepcjonisty | Nie da się odpowiedzieć z ekranu | „W kilka sekund” (kryterium z Kontekstu) | Przed oddaniem | Przejście scenariusza T1 |
| Obłożenie dla właściciela | Brak podsumowania, liczenie wierszy ręcznie | Podsumowanie widoczne od razu po otwarciu ekranu | Przed oddaniem | Scenariusz T3 |
| Dostępność prototypu | – | Publiczny link Vercel otwiera się bez logowania | Przed oddaniem | Otwarcie linku w oknie incognito |

#### Scenariusze testowe (oczekiwane wyniki na danych z oryginału)

| ID | Scenariusz | Oczekiwany wynik |
|----|------------|------------------|
| T1 | Termin 30.12–31.12.2024, 2 osoby | Co najmniej 103 i 203. 101, 104 i 202 to pokoje 1-osobowe, więc nie pasują. 102 i 201 są zajęte. Wynik dla 105 (naprawa) nie jest kryterium testu. |
| T2 | „2 osoby na 2 noce od dziś”: 28.12–30.12.2024 | 103 z oznaczeniem, że jest w sprzątaniu i za chwilę będzie gotowy. 203 zajęty do 29.12, 105 w naprawie. |
| T3 | Podsumowanie dziś (28.12.2024) | Zajęte: 4 (102, 104, 201, 203) · Wolne: 2 (101, 202) · Sprzątanie: 1 (103) · Naprawa: 1 (105) · Przyjazdy dziś: 102 (Jan Kowalski) · Wyjazdy dziś: 103 (Anna Nowak). Jutro (29.12): wyjazd 203 (Rodzina Schmidt). |
| T4 | Zapytanie, do którego nie pasuje żaden pokój | Komunikat o braku wyników w formie tooltipa albo informacji typu modal |

### Non-Goals (Out of Scope)
- Pozostałe moduły aplikacji (Start, Pokoje, Goście, Płatności, Raporty, Ustawienia, Wiadomości, Personel, Restauracja).
- Kompletny redesign wszystkich stanów ekranu.
- Prawdziwy backend, baza danych, logowanie i uprawnienia.
- Funkcje i dane, których nie ma w tym dokumencie.

---

## User Personas & Use Cases

### Primary Persona: Recepcjonista
- **Role:** Recepcjonista w małym lub średnim obiekcie noclegowym (3–50 pokoi lub apartamentów)
- **Goals:** Szybko znaleźć wolny pokój dla gościa walk-in
- **Pain Points:** Gość stoi przy ladzie, jest presja czasu. Daty nie filtrują listy, status pokazuje tylko „dziś”, a pojemność i ograniczenia są rozrzucone po kolumnach i notatkach.
- **Technical Proficiency:** Nie określono
- **Context:** Codzienna praca przy recepcji

### Secondary Persona: Właściciel
- **Role:** Właściciel obiektu
- **Goals:** Szybki przegląd obłożenia: „jakie mam dziś obłożenie i co się dzieje jutro?”
- **Pain Points:** Brak podsumowania oraz wyróżnienia przyjazdów i wyjazdów dziś, więc liczy wiersze ręcznie.
- **Technical Proficiency:** Nie określono
- **Context:** Codzienne użycie, szybki przegląd

### Key Use Cases

#### Use Case 1: Wolny pokój dla gościa walk-in
**Actor:** Recepcjonista  
**Preconditions:** Prototyp otwarty, „dziś” = 28.12.2024, dane z oryginału  
**Flow:**
1. Gość pyta: „Czy macie pokój dla 2 osób na 2 noce od dziś?”
2. Recepcjonista podaje termin (od–do) i liczbę osób.
3. System wylicza dostępność z dat rezerwacji, pojemności i stanu technicznego pokoju.
4. System pokazuje tylko pokoje pasujące do zapytania.
5. Recepcjonista wskazuje gościowi pokój.

**Expected Outcome:** Odpowiedź w kilka sekund, maks. 3 interakcje, poprawny wynik (T1, T2).  
**Edge Cases:**
- Pokój w sprzątaniu, który za chwilę będzie gotowy (103) – nie może zniknąć z wyników.
- Pokój w naprawie (105) – stan techniczny wpływa na dostępność, a nie leży tylko w notatce.
- Brak pasujących pokoi – komunikat w formie tooltipa albo informacji typu modal (T4).

#### Use Case 2: Przegląd obłożenia
**Actor:** Właściciel  
**Preconditions:** Prototyp otwarty, „dziś” = 28.12.2024  
**Flow:**
1. Właściciel otwiera ekran.
2. System pokazuje podsumowanie obłożenia na dziś oraz przyjazdy i wyjazdy dziś.
3. Właściciel sprawdza, co dzieje się jutro.

**Expected Outcome:** Obłożenie widoczne bez liczenia wierszy (T3).  
**Edge Cases:** Pokój w naprawie (105) jest pokazany osobno, a nie jako wolny.

---

## Product Requirements

Numeracja w nawiasach odpowiada punktom z boardu i plansz z dowodami (#1–#4).

### Functional Requirements

#### Must Have (P0) - MVP
1. **Wyszukiwanie dostępności (termin + liczba osób)** – rozwiązuje Główny problem oraz punkty 1, 0 i 5
   - **Description:** Recepcjonista podaje termin od–do i liczbę osób, a system zwraca pokoje dostępne w całym terminie i mieszczące tę liczbę osób.
   - **User Story:** Jako recepcjonista chcę wpisać termin i liczbę gości, żeby w kilka sekund odpowiedzieć gościowi walk-in, czy mamy pokój.
   - **Acceptance Criteria:**
     - [ ] Termin wybiera się w polu daty, a nie wpisuje jako zwykły tekst (punkt 1)
     - [ ] Podanie terminu realnie filtruje wyniki (punkt 1)
     - [ ] Dostępność wynika z dat rezerwacji, a nie z ręcznie ustawionego statusu „na dziś” (punkty 1 i 5)
     - [ ] Dane rozdzielają pokój i rezerwację, więc pokój może mieć rezerwacje w różnych terminach (punkt 0)
     - [ ] Pole „liczba gości” filtruje po pojemności pokoju (punkt 2)
     - [ ] Wyniki T1 i T2 są zgodne z tabelą scenariuszy
     - [ ] Ścieżka pytanie gościa → wskazany pokój mieści się w maks. 3 interakcjach
     - [ ] Gdy żaden pokój nie pasuje, pojawia się komunikat o braku wyników w formie tooltipa albo informacji typu modal (T4)

2. **Podsumowanie obłożenia** – rozwiązuje punkt 4 („Bonus” z Głównego problemu)
   - **Description:** Podsumowanie na górze ekranu, liczone z tych samych danych co dostępność: wolne / zajęte / sprzątanie / naprawa oraz przyjazdy i wyjazdy dziś.
   - **User Story:** Jako właściciel chcę od razu zobaczyć dzisiejsze obłożenie i co dzieje się jutro, żeby nie liczyć wierszy ręcznie.
   - **Acceptance Criteria:**
     - [ ] Liczby zgodne ze scenariuszem T3
     - [ ] Przyjazdy i wyjazdy dziś są wyróżnione (punkt 4)
     - [ ] Widać, co dzieje się jutro (pytanie właściciela z Kontekstu)
     - [ ] Podsumowanie jest widoczne bez przewijania i bez dodatkowych kliknięć

3. **Jawna pojemność pokoju** – rozwiązuje punkt 2
   - **Description:** Pojemność pokoju jest pokazana wprost zamiast skrótów „1os.”, „2os.”, „2os.+”, „STUDIO”.
   - **User Story:** Jako recepcjonista chcę widzieć, ile osób mieści pokój, żeby nie zgadywać, co znaczy „2os.+”.
   - **Acceptance Criteria:**
     - [ ] Każdy pokój ma pojemność wyrażoną liczbą osób; „2os.+” i „STUDIO” mieszczą więcej niż 2 osoby (dokładna liczba nie jest istotna dla prototypu)
     - [ ] Pojemność jest używana przez filtr liczby gości

4. **Stan techniczny jako ograniczenie dostępności** – rozwiązuje punkt 3
   - **Description:** Sprzątanie i naprawa wpływają na dostępność, a ograniczenia czasowe (np. „naprawa do 30/12”) nie są zapisane tylko w Uwagach.
   - **User Story:** Jako recepcjonista chcę widzieć pokoje, które za chwilę będą gotowe, i nie proponować pokoi w naprawie.
   - **Acceptance Criteria:**
     - [ ] Pokój w sprzątaniu (103) nie znika z wyników i ma czytelne oznaczenie
     - [ ] Pokój w naprawie (105) nie jest pokazywany jako wolny

#### Should Have (P1) - Post-Launch
1. **Rozdzielenie statusu pokoju i stanu pobytu** – punkt B (dowody #2 i #4)
   - **Description:** Status pokoju (np. sprzątanie) nie miesza się ze stanem gościa (np. wyjazd dziś).
   - **User Story:** Jako recepcjonista chcę widzieć osobno stan pokoju i to, że gość dziś wyjeżdża, żeby nie wpisywać „(wyjazd)” w nazwisko.
   - **Acceptance Criteria:**
     - [ ] Anna Nowak ma czyste nazwisko „Nowak”, a wyjazd dziś do 14:00 wynika z danych pobytu
     - [ ] Brak obejść w polach danych gościa

2. **Czytelne akcje w wierszu** – punkt A (dowód #2)
   - **Description:** Pełne etykiety zamiast skrótów R / E / U. „Usuń” jest wizualnie odróżnione od pozostałych akcji, a kolumna akcji nie chowa się za poziomym scrollem.
   - **User Story:** Jako recepcjonista chcę od razu widzieć dostępne akcje i nie pomylić usunięcia z edycją.
   - **Acceptance Criteria:**
     - [ ] Akcje mają pełne etykiety
     - [ ] „Usuń” ma odrębny, ostrzegawczy styl
     - [ ] Akcje są widoczne bez poziomego scrolla

3. **Spójne dane** – punkt C (dowód #2)
   - **Acceptance Criteria:**
     - [ ] Brak „Dni 0” i „Suma 0 PLN” dla wolnych pokoi oraz jednolity zapis braku wartości
     - [ ] Paginacja nie pokazuje „Następna >”, gdy wszystkie rekordy mieszczą się na jednej stronie
     - [ ] Jeden format daty w całym ekranie (w oryginale: 28.12.2024 w nagłówku vs 28/12/2024 w tabeli)

4. **Czytelne filtry** – punkt D (dowód #2)
   - **Acceptance Criteria:**
     - [ ] Każde pole filtra ma etykietę umieszczoną przed nim (nie „-- Wybierz --” z etykietą „Piętro” za polem)
     - [ ] Brak niejasnej opcji „Inne”: każda opcja statusu ma zrozumiałą nazwę

5. **Mniej szumu w tabeli** – z recenzji analizy
   - **Acceptance Criteria:**
     - [ ] Wiek, miasto, telefon i email nie zabierają szerokości potrzebnej do decyzji o pokoju

6. **Poprawki estetyczne** – punkty Mało estetyczne 1–5 i mieszane fonty (dowód #3)
   - **Acceptance Criteria:**
     - [ ] Etykiety i tekst pomocniczy mają czytelny kontrast, odstępy są regularne (E1)
     - [ ] Legenda kolorów zgadza się z kolorami w tabeli albo status jest czytelny bez legendy (E2)
     - [ ] Statusy z polskimi znakami, bez CAPS-u i pełnego kolorowego tła komórki. Ceny nie wyglądają jak linki (E3)
     - [ ] Eksporty (Drukuj / Excel / PDF) nie konkurują wizualnie z główną akcją (E4)
     - [ ] Elementy interaktywne mają stany hover i focus (E5)
     - [ ] Jedna rodzina fontów w całym interfejsie (mieszane fonty)

#### Nice to Have (P2) - Future Consideration
- Brak. W wątku nie padły dodatkowe funkcje. Nowe pomysły zgłaszaj Jackowi jako pytania, nie implementuj ich.

### Non-Functional Requirements

#### Performance
- Wynik wyszukiwania pojawia się od razu po zmianie filtra, bez przeładowania strony (prototyp działa na danych lokalnych).
- Kryterium z Kontekstu: ekran odpowiada na pytania użytkowników „w kilka sekund”.

#### Security & Privacy
- Bez logowania. Wymagany jest link otwierany w przeglądarce bez logowania.
- Wyłącznie dane fikcyjne z oryginalnego prototypu.

#### Scalability
- Prototyp działa na 8 pokojach z oryginału. Docelowa skala produktu to 3–50 pokoi lub apartamentów, ale prototyp nie musi jej obsługiwać.

#### Accessibility
- Kontrast tekstu min. 4.5:1 (standard WCAG dla tekstu).
- Widoczne stany focus (E5).

#### Browser/Platform Support
- Tylko desktop. Prototyp nie musi działać na urządzeniach mobilnych.
- Otwiera się w przeglądarce desktopowej pod publicznym linkiem.
- Kolumna akcji nie może chować się za poziomym scrollem (punkt A).

---

## User Experience & Design

### User Flow Diagram
- Board analizy: FigJam (Kontekst → Analiza → Główny problem)
- Przepływ walk-in: termin + liczba osób → pasujące pokoje → wskazanie pokoju (Use Case 1)

### Wireframes/Mockups
- Brak makiet. Punkt odniesienia to oryginalny prototyp (zakładka „Prototyp”)
- Plansze z dowodami: `dowod-1-glowny-problem.png`, `dowod-2-nielogiczne.png`, `dowod-3-malo-estetyczne.png`, `dowod-4-modal-edycji.png`

Key Screens:
- Ekran listy rezerwacji z wyszukiwaniem dostępności i podsumowaniem obłożenia
- Modal edycji rezerwacji (z poprawkami P1; układ modala projektuje Jacek)

### Key Interactions
1. **Wyszukanie wolnego pokoju**
   - **Trigger:** Recepcjonista ustawia termin od–do i liczbę osób
   - **Behavior:** Lista pokazuje tylko pokoje dostępne w całym terminie i mieszczące tę liczbę osób
   - **Feedback:** Natychmiastowa zmiana wyników; pokój w sprzątaniu ma czytelne oznaczenie; przy braku wyników komunikat w formie tooltipa albo informacji typu modal

2. **Przegląd obłożenia**
   - **Trigger:** Otwarcie ekranu
   - **Behavior:** Podsumowanie dziś (wolne / zajęte / sprzątanie / naprawa, przyjazdy, wyjazdy) i informacja o jutrze
   - **Feedback:** Liczby zgodne z T3

3. **Edycja rezerwacji**
   - **Trigger:** Akcja „Edytuj” w wierszu
   - **Behavior:** Modal edycji; status nie jest ręcznym dropdownem oderwanym od dat (punkt 5)
   - **Feedback:** Zmiana dat aktualizuje dostępność i podsumowanie

### Design Principles for This Product
- **Odpowiedź w kilka sekund:** ekran odpowiada na pytanie gościa walk-in i pytanie właściciela bez szukania po kolumnach.
- **Jedno źródło prawdy:** status i dostępność wynikają z dat i stanu technicznego, nie z ręcznych wpisów i notatek.
- **Teza ponad kompletność:** dowozimy główny problem, nie wszystkie stany.

---

## Technical Specifications

### System Architecture
- **UI:** biblioteka komponentów **shadcn/ui** (https://ui.shadcn.com/)
- **Framework:** Next.js
- **Dane:** lokalne dane testowe w repozytorium (bez backendu). Funkcja „naprawdę działa lub udaje”.
- **Uruchamianie:** lokalnie (serwer deweloperski Next.js) przez cały czas pracy nad prototypem
- **Repozytorium:** GitHub – dopiero po decyzji Jacka
- **Hosting:** Vercel, publiczny link bez logowania – dopiero po decyzji Jacka i po utworzeniu repozytorium

### Data Model

Rozdzielenie pokoju i rezerwacji (punkt 0):

- **Pokój:** numer, piętro, typ, pojemność (liczba osób), cena/noc, stan techniczny (np. sprzątanie, naprawa do daty), uwagi
- **Rezerwacja / pobyt:** pokój, gość (imię, nazwisko, miasto/kraj, telefon, email), przyjazd, wyjazd, cena/noc, płatność, uwagi
- **Wartości wyliczane:** liczba nocy, suma, dostępność w terminie, podsumowanie obłożenia

#### Dane testowe (z oryginału, „dziś” = 28.12.2024)

| ID | Nr | Piętro | Typ | Status w oryginale | Gość | Tel. | Email | Przyjazd | Wyjazd | Cena/noc | Płatność | Uwagi |
|----|----|--------|-----|--------------------|------|------|-------|----------|--------|----------|----------|-------|
| 0001 | 101 | P1 | 1os. | WOLNY | – | – | – | – | – | 180 PLN | – | – |
| 0002 | 102 | P1 | 2os. | ZAJĘTY | Jan Kowalski (Warszawa, 45 lat) | +48501234567 | j.kowalski@example.com | 28/12/2024 | 02/01/2025 | 250 PLN | KARTA | Śniadanie 7:30, parking A5 |
| 0003 | 103 | P1 | 2os.+ | SPRZĄTANIE | Anna Nowak | +48601234567 | a.nowak@gmail.com | 26/12/2024 | 28/12/2024 | 280 PLN | GOTÓWKA | Do 14:00 |
| 0004 | 104 | P1 | 1os. | ZAJĘTY | Maria Wiśniewska (Kraków, Biznes) | +48791234567 | maria.w@company.pl | 27/12/2024 | 30/12/2024 | 180 PLN | FAKTURA | FV na firmę ABC Sp. z o.o. |
| 0005 | 105 | P1 | STUDIO | NAPRAWA | – | – | – | – | – | 350 PLN | – | Wymiana kranu, niedostępny do 30/12 |
| 0006 | 201 | P2 | 2os. | ZAJĘTY | Piotr Zieliński (Gdańsk, UK) | +447123456789 | piotr.z@email.co.uk | 25/12/2024 | 03/01/2025 | 250 PLN | PRZELEW | VIP, późny checkout |
| 0007 | 202 | P2 | 1os. | WOLNY | – | – | – | – | – | 180 PLN | – | – |
| 0008 | 203 | P2 | 2os.+ | ZAJĘTY | Rodzina Schmidt (4 os., Niemcy) | +491234567890 | schmidt@deutsche.de | 27/12/2024 | 29/12/2024 | 320 PLN | KARTA | 2 dzieci (5 i 8 lat), łóżeczko |

Uwagi do danych:
- W oryginale nazwisko Anny Nowak brzmi „Nowak (wyjazd)”. W prototypie „(wyjazd)” ma wynikać z danych pobytu (P1-1).
- Sumy z oryginału (1250, 560, 540, 2250, 640 PLN) mają być wyliczane z liczby nocy × cena/noc, a nie wpisywane.
- Kontekst nagłówka z oryginału: zalogowany admin@hotel.pl, ostatnie logowanie 28.12.2024 09:15, obiekt „Acme Corp Hotel”.

### API Requirements

#### Endpoints Needed
Nie dotyczy. Prototyp nie ma backendu, a dane są lokalne.

| Endpoint | Method | Purpose | Request | Response |
|----------|--------|---------|---------|----------|
| – | – | Nie dotyczy (dane lokalne) | – | – |

### Third-Party Integrations
- **shadcn/ui:** komponenty interfejsu (instalowane do projektu przez CLI shadcn)
- **GitHub:** repozytorium kodu prototypu (dopiero po decyzji Jacka)
- **Vercel:** publikacja prototypu pod publicznym linkiem, deploy z repozytorium GitHub (dopiero po decyzji Jacka)

### Technical Constraints
- Prototyp ma reagować na kliknięcia, a nie być statyczną makietą.
- Rekomendowany nakład całej pracy: do 4 godzin, z czego redesign to ok. 70%.
- Link musi działać publicznie, bez logowania.

### Instrukcje dla agenta (Claude Code)
1. **Zakres:** implementuj tylko wymagania z tego PRD. Kolejność: P0, potem P1. Nie dodawaj funkcji P2 ani własnych pomysłów.
2. **Wątpliwości:** każdą niejasność zgłaszaj Jackowi jako pytanie przed implementacją. Decyzje z sekcji *Open Questions* są już podjęte – stosuj je.
3. **Framework i UI:** projekt Next.js. Buduj interfejs z komponentów shadcn/ui (https://ui.shadcn.com/). Nie pisz komponentów od zera, jeśli shadcn ma odpowiednik.
4. **Dane:** użyj danych testowych z tabeli wyżej; „dziś” = 28.12.2024 (stała w kodzie, nie data systemowa). Nie skupiaj się na detalach danych – celem jest szybkie znalezienie wolnego pokoju i sprawdzenie obłożenia.
5. **Desktop i dostępność:** tylko widok desktopowy; kontrast tekstu min. 4.5:1.
6. **Weryfikacja:** przed oddaniem przejdź scenariusze T1–T4 i potwierdź wyniki z tabeli scenariuszy.
7. **Praca lokalna:** cały projekt uruchamiaj i pokazuj lokalnie (serwer deweloperski Next.js). Nie twórz repozytorium i nie publikuj na Vercel, dopóki Jacek wprost o tym nie zdecyduje.
8. **GitHub (po decyzji Jacka):** utwórz repozytorium na GitHubie i wypchnij do niego kod prototypu.
9. **Vercel (po GitHubie):** opublikuj projekt na Vercel z repozytorium GitHub. Sprawdź, że link otwiera się bez logowania (np. w oknie incognito).
10. **Raport:** po pracy lokalnej podaj adres lokalny i wynik scenariuszy T1–T4. Po publikacji dodaj link do repozytorium i link Vercel.

### Analytics & Tracking

#### Events to Track
Nie dotyczy. Prototyp nie zbiera analityki; sukces mierzymy scenariuszami T1–T4.

| Event Name | Trigger | Properties | Purpose |
|------------|---------|------------|---------|
| – | – | – | Nie dotyczy |

---

## Go-to-Market Strategy

### Launch Plan
- **Beta/Alpha Testing:** Samodzielne przejście scenariuszy T1–T4 przed oddaniem.
- **Phased Rollout:** Nie dotyczy.
- **Launch Date:** W ustalonym terminie (do 4 dni od startu).
- **Launch Channels:** Publiczny link do prototypu wysłany.

### Marketing & Positioning
- **Value Proposition:** Recepcjonista odpowiada gościowi walk-in w kilka sekund, a właściciel widzi obłożenie bez liczenia.
- **Key Messages:**
  - Recepcjonista: termin + liczba osób → pasujące pokoje
  - Właściciel: obłożenie dziś i jutro na pierwszy rzut oka
- **Marketing Channels:** Nie dotyczy.

### Sales Enablement (if B2B)
Nie dotyczy.

### Support & Documentation
- **User Documentation:** Nie dotyczy.
- **Prezentacja procesu:** przeprowadzenie przez proces (board, sticky notes, dowody #1–#4) i pokazanie śladu pracy (szkice, zrzut rozmowy z AI, np. pierwszy prompt, warianty w FigJam).
- **FAQ:** Nie dotyczy.

---

## Dependencies & Risks

### Dependencies
| Dependency | Owner | Status | Impact if Delayed | Mitigation |
|------------|-------|--------|-------------------|------------|
| Konto GitHub | Jacek | Do potwierdzenia | Brak repozytorium | – |
| Konto Vercel | Jacek | Do potwierdzenia | Brak publicznego linku, czyli brak formatu oddania | – |

### Risks & Mitigation

#### High Risk
1. **Agent dopowiada wymagania spoza PRD**
   - **Probability:** Medium
   - **Impact:** High (prototyp odchodzi od tezy i analizy)
   - **Mitigation:** Instrukcje dla agenta (pkt 1–2), P2 puste, Open Questions zamiast założeń
   - **Owner:** Jacek

2. **Błędne wyniki dostępności**
   - **Probability:** Medium
   - **Impact:** High (prototyp powtarza błąd, który miał naprawić)
   - **Mitigation:** Scenariusze T1–T4 z oczekiwanymi wynikami, weryfikacja przed oddaniem
   - **Owner:** Jacek + Claude Code

#### Medium Risk
1. **Przekroczenie czasu (rekomendowane do 4 godzin)**
   - **Probability:** Medium
   - **Impact:** Medium
   - **Mitigation:** Najpierw P0, P1 tylko jeśli starczy czasu (cel: teza i dowód, nie kompletny redesign)
   - **Owner:** Jacek

### Open Questions
Wszystkie pytania z v1.0 zostały rozstrzygnięte:
- [x] **Q1 – Pojemność:** „STUDIO” (i „2os.+”) mieszczą więcej niż 2 osoby. Dokładna liczba nie jest istotna.
- [x] **Q2 – Naprawa 105:** dostępność pokoju 105 jest nieistotna dla prototypu.
- [x] **Q3/Q4 – Sprzątanie i % obłożenia:** nie skupiamy się na detalach danych; liczy się szybkie znalezienie wolnych pokoi i sprawdzenie obłożenia.
- [x] **Q5 – Framework:** Next.js.
- [x] **Q6 – Brak wyników:** komunikat w formie tooltipa albo informacji typu modal.
- [x] **Q7 – Dostępność i urządzenia:** kontrast min. 4.5:1, tylko desktop.

---

## Timeline & Milestones

### Development Phases

| Phase | Timeline | Key Deliverables | Owner |
|-------|----------|------------------|-------|
| **Discovery** | Zakończone | Test prototypu, board: Kontekst → Analiza → Główny problem | Jacek |
| **Design** | Zakończone | Recenzja boarda, dowody #1–#4, ten PRD | Jacek + Claude |
| **Development Sprint 1** | Do ustalenia | P0: dostępność, podsumowanie obłożenia, pojemność, stan techniczny | Claude Code |
| **Development Sprint 2** | Do ustalenia | P1: status vs pobyt, akcje, spójne dane, filtry, szum, estetyka | Claude Code |
| **QA & Testing** | Do ustalenia | Scenariusze T1–T4 (lokalnie) | Jacek + Claude Code |
| **Beta Launch** | Nie dotyczy | – | – |
| **Full Launch** | W ustalonym terminie (do 4 dni) | Publiczny link Vercel przekazany dalej | Jacek |
| **Post-Launch** | Po oddaniu | Prezentacja na rozmowie (jeśli kolejny etap) | Jacek |

### Key Milestones
- **P0 gotowe:** scenariusze T1–T4 przechodzą
- **Praca lokalna:** prototyp działa lokalnie, scenariusze T1–T4 przechodzą
- **Decyzja Jacka o publikacji:** dopiero wtedy repozytorium GitHub
- **Publikacja:** link Vercel otwierany bez logowania
- **Oddanie:** link przekazany w terminie

---

## Resources & Team

### Core Team
- **Product Manager:** Jacek
- **Engineering Lead:** Claude Code (agent implementujący, pod kierunkiem Jacka)
- **Design Lead:** Jacek
- **QA Lead:** Jacek
- **Marketing Lead:** Nie dotyczy

### Budget (if applicable)
- **Development:** Część z rekomendowanych do 4 godzin na całość (redesign ok. 70%)
- **Design:** Część z tych samych 4 godzin (analiza ok. 30%)
- **Marketing:** Nie dotyczy
- **Third-party Services:** GitHub, Vercel (plan i koszty nie zostały ustalone)
- **Total:** Do 4 godzin pracy (rekomendacja)

---

## Post-Launch Plan

### Success Criteria Check-in Schedule
Zamiast tygodni (nie dotyczy prototypu):
- **Przed oddaniem:** scenariusze T1–T4, maks. 3 interakcje w T1, link działa bez logowania
- **Po oddaniu:** feedback do oddanego prototypu
- **Rozmowa:** prezentacja procesu i śladu pracy z AI

### Iteration Plan
- **Feedback Collection:** Feedback do prototypu
- **Update Cadence:** Nie dotyczy
- **Sunset Plan:** Nie dotyczy. Efekt można użyć w portfolio.

### Learning Goals
- Czy redesign odpowiada na oba pytania z Kontekstu „w kilka sekund”?
- Jak sterować agentem (Claude Code) przez PRD i jakie poprawki trzeba było wymusić.

---

## Appendix

### References
- Oryginalny prototyp ekranu (punkt odniesienia)
- Board FigJam z analizą
- Plansze z dowodami: `dowod-1-glowny-problem.png`, `dowod-2-nielogiczne.png`, `dowod-3-malo-estetyczne.png`, `dowod-4-modal-edycji.png`
- [shadcn/ui](https://ui.shadcn.com/)

#### Mapa problemów (board → PRD)

| Punkt | Źródło | Problem | Wymaganie |
|-------|--------|---------|-----------|
| 0 | Recenzja | Ekran to lista pokoi, nie rezerwacji | P0-1 |
| 1 | Board – Nielogiczne | Termin: Od/Do nie filtrują | P0-1 |
| 2 | Board – Nielogiczne | Pojemność ukryta w skrótach Typ | P0-3 |
| 3 | Board – Nielogiczne | Stan techniczny: „Wolne” ukrywa sprzątanie, naprawa tylko w Uwagach | P0-4 |
| 4 | Board – Nielogiczne | Brak podsumowania obłożenia | P0-2 |
| 5 | Board – Nielogiczne | Status ustawiany ręcznie w modalu | P0-1 |
| A | Recenzja | Akcje R/E/U, „Usuń” jak inne, chowanie za scrollem | P1-2 |
| B | Recenzja | Status miesza pokój i gościa, „(wyjazd)” w nazwisku | P1-1 |
| C | Recenzja | Niespójne dane, paginacja, formaty dat | P1-3 |
| D | Recenzja | Filtry bez etykiet, niejasne „Inne” | P1-4 |
| – | Recenzja | Szum w tabeli (wiek, miasto, telefon, email) | P1-5 |
| E1–E5 | Board – Mało estetyczne | Kontrast, legenda, statusy i ceny, nawigacja i eksporty, hover/focus | P1-6 |
| + | Recenzja | Mieszane fonty | P1-6 |

### Changelog
| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 12.10.2026 | 1.0 | Pierwsza wersja na podstawie analizy, recenzji boarda i dowodów #1–#4 | Jacek + Claude |
| 12.10.2026 | 1.1 | Rozstrzygnięte Q1–Q7 (Next.js, komunikat braku wyników, kontrast 4.5:1, tylko desktop, mniej nacisku na detale danych); usunięty wymóg zachowania układu modala; dodany scenariusz T4 | Jacek + Claude |
| 12.10.2026 | 1.2 | Projekt uruchamiany lokalnie; GitHub i Vercel dopiero po decyzji Jacka | Jacek + Claude |

### Stakeholder Approvals
- [ ] Engineering Lead – Claude Code (potwierdzenie zrozumienia zakresu) – [data]
- [ ] Design Lead – Jacek – [data]
- [ ] Marketing Lead – nie dotyczy
- [ ] Executive Sponsor – Jacek – [data]
