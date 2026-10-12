import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onExcel: () => void;
}

export function ExportActions({ onExcel }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
      <span className="flex items-center gap-1.5 text-sm font-medium">
        <DownloadIcon className="size-4" aria-hidden />
        Eksportuj dane jako:
      </span>
      <Button variant="secondary" size="sm" onClick={onExcel}>
        Plik Excel
      </Button>
      <Button
        variant="secondary"
        size="sm"
        title="W oknie drukowania wybierz „Zapisz jako PDF”"
        onClick={() => window.print()}
      >
        Plik PDF
      </Button>
      <span className="mx-1 h-5 w-px bg-border" aria-hidden />
      <Button variant="secondary" size="sm" onClick={() => window.print()}>
        Drukuj
      </Button>
    </div>
  );
}
