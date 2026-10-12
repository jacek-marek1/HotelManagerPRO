# Opis do FigJama – praca z AI nad HotelManager PRO

**Jak pracowałem z AI**
Dałem AI jeden dokument wymagań (PRD) i prompt z regułami: nic spoza PRD, przy wątpliwościach pytaj, bez GitHuba i wdrożenia bez mojej zgody. Kolejność: plan bez kodu → moja akceptacja → ekran lokalnie → wyniki testów T1–T4 → dopiero potem kolejne warstwy.

**Moje decyzje po drodze**
- Zaakceptowałem plan z 6 domyślnymi odpowiedziami.
- Dopracowywałem ekran w krótkich iteracjach: CTA w kontekście tabeli, eksport na dół, jeden blok „Wyszukiwanie", status z tekstem zamiast legendy, rozwijane karty Dziś/Jutro.
- Zleciłem ocenę ekranu względem PRD i wdrożyłem jej rekomendacje (m.in. główny scenariusz znów w 3 kliknięciach).
- Uznałem dashboard za realny, więc eksport ma działać, a błędy mają komunikaty.
- Dołożyłem to, czego potrzebuje recepcja: stan pokoju (sprzątanie/naprawa), szczegóły klienta, filtr piętra.

**Gdzie AI się myliło**
Błędnie zrozumiało „statusy nie są istotne" (osłabiło kolory zamiast przenieść znaczniki przyjazdu/wyjazdu), jedną „naprawą" wydłużyło główny scenariusz do 4 kliknięć, a tekstowy przycisk przywrócił poziomy scroll. Każdą z tych rzeczy wychwyciłem w przeglądzie i wymusiłem poprawkę.

**Efekt**
Działający klikalny ekran: wyszukiwanie wolnych pokoi po terminie, liczbie osób i piętrze, podsumowanie obłożenia, zarządzanie stanem pokoi, walidacje. Testy T1–T4 z PRD przechodzą. Dziennik kroków i kod są w repozytorium.

**Ograniczenia**
Dane lokalne (bez backendu), eksport do Excela jako CSV, wdrożenie jeszcze nie wykonane.
