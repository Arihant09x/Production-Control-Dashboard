import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Job, JobStatus } from "@/types/job";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function JobsTable({
  jobs,
  loading,
  sortBy,
  sortOrder,
  onSortChange,
  onRowClick,
}: {
  jobs: Job[];
  loading: boolean;
  sortBy: "dueDate" | "quantity";
  sortOrder: "asc" | "desc";
  onSortChange: (value: "dueDate" | "quantity") => void;
  onRowClick: (job: Job) => void;
}) {
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));

  const headerButton = (column: "dueDate" | "quantity", label: string) => (
    <button
      type="button"
      className="inline-flex items-center gap-1 text-left font-medium text-slate-600 hover:text-slate-900"
      onClick={() => onSortChange(column)}
    >
      {label}
      {sortBy === column ? (
        sortOrder === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5" />
        )
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
      )}
    </button>
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <Table className="min-w-[920px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">Job ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="w-[120px]">
              {headerButton("quantity", "Quantity")}
            </TableHead>
            <TableHead className="w-[170px]">
              {headerButton("dueDate", "Due Date")}
            </TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="w-[120px]">Machine</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                {Array.from({ length: 7 }).map((__, cellIndex) => (
                  <TableCell key={`cell-${cellIndex}`}>
                    <div className="h-4 animate-pulse rounded bg-slate-200" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : jobs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-10 text-center text-sm text-slate-500"
              >
                No jobs match the current filters.
              </TableCell>
            </TableRow>
          ) : (
            jobs.map((job) => (
              <TableRow
                key={job.id}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => onRowClick(job)}
              >
                <TableCell className="font-medium text-slate-900">
                  {job.id}
                </TableCell>
                <TableCell className="max-w-[260px] truncate">
                  {job.productName}
                </TableCell>
                <TableCell className="max-w-[220px] truncate">
                  {job.customer}
                </TableCell>
                <TableCell className="font-mono text-sm text-slate-700">
                  {job.quantity.toLocaleString()}
                </TableCell>
                <TableCell className="font-mono text-sm text-slate-700">
                  {formatDate(job.dueDate)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={job.status as JobStatus} />
                </TableCell>
                <TableCell className="text-slate-700">{job.machine}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
