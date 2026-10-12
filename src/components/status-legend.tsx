import { STATUS_FILL, STATUS_LABEL, STATUS_ORDER } from "./room-status-badge";

export function StatusLegend() {
  return (
    <ul aria-label="Legenda statusów" className="flex items-center gap-4 text-sm">
      <li className="font-medium">Legenda:</li>
      {STATUS_ORDER.map((s) => (
        <li key={s} className="flex items-center gap-2">
          <span className={`size-4 rounded border border-black/20 ${STATUS_FILL[s]}`} aria-hidden />
          {STATUS_LABEL[s]}
        </li>
      ))}
    </ul>
  );
}
