import { Badge } from "@/components/ui/badge";
import { JobStatus } from "@/types/job";

const statusStyles: Record<
  JobStatus,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
  }
> = {
  Pending: {
    variant: "secondary",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  "In Progress": {
    variant: "default",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  Delayed: {
    variant: "destructive",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  Completed: {
    variant: "outline",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
};

export function StatusBadge({ status }: { status: JobStatus }) {
  const styles = statusStyles[status];

  return (
    <Badge variant={styles.variant} className={styles.className}>
      {status}
    </Badge>
  );
}
