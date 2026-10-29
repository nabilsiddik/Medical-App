import { format } from "date-fns";

export const DateCell = ({ date }: { date?: string | Date | null }) => {
  if (!date) return <span className="text-xs text-muted-foreground">-</span>;

  try {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return (
      <div className="flex flex-col">
        <span className="text-xs font-medium text-foreground">
          {format(parsedDate, "MMM dd, yyyy")}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {format(parsedDate, "hh:mm a")}
        </span>
      </div>
    );
  } catch {
    return <span className="text-xs text-muted-foreground">{String(date)}</span>;
  }
};