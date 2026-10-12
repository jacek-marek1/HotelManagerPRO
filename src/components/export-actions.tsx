import { Button } from "@/components/ui/button";

export function ExportActions() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <span className="text-sm font-medium">Eksportuj dane jako:</span>
      <Button variant="outline" size="sm">
        Plik Excel
      </Button>
      <Button variant="outline" size="sm">
        Plik PDF
      </Button>
      <span className="mx-1 h-5 w-px bg-border" aria-hidden />
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        Drukuj
      </Button>
    </div>
  );
}
