import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}

export function TablePagination({
  page,
  pageCount,
  total,
  pageSize,
  onPage,
}: Props) {
  if (pageCount <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <nav aria-label="Paginacja" className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Pokoje {from}–{to} z {total}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => onPage(page - 1)}
        >
          Poprzednia
        </Button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <Button
            key={n}
            size="sm"
            variant={n === page ? "default" : "outline"}
            aria-current={n === page ? "page" : undefined}
            onClick={() => onPage(n)}
          >
            {n}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          disabled={page === pageCount}
          onClick={() => onPage(page + 1)}
        >
          Następna
        </Button>
      </div>
    </nav>
  );
}
