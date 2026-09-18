import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Job, JobStatus } from "@/types/job";
import { StatusBadge } from "@/components/StatusBadge";

const statusOptions: JobStatus[] = [
  "Pending",
  "In Progress",
  "Delayed",
  "Completed",
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export function JobDetailPanel({
  job,
  open,
  onOpenChange,
  onStatusChange,
}: {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: JobStatus) => Promise<void>;
}) {
  const [pendingStatus, setPendingStatus] =
    React.useState<JobStatus>("Pending");
  const [statusError, setStatusError] = React.useState("");

  React.useEffect(() => {
    if (job) {
      setPendingStatus(job.status);
      setStatusError("");
    }
  }, [job]);

  const handleStatusChange = async (nextStatus: JobStatus) => {
    if (!job) {
      return;
    }

    setPendingStatus(nextStatus);
    setStatusError("");

    try {
      await onStatusChange(job.id, nextStatus);
    } catch (error) {
      setPendingStatus(job.status);
      setStatusError("Status update failed. Please try again.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        {job ? (
          <>
            <SheetHeader className="pr-10">
              <SheetTitle className="text-left">{job.id}</SheetTitle>
              <SheetDescription className="text-left text-slate-600">
                {job.productName}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 px-4 pb-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-600">
                  Status
                </span>
                <StatusBadge status={job.status} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">
                  Update status
                </label>
                <Select
                  value={pendingStatus}
                  onValueChange={(value) => {
                    const nextStatus = value as JobStatus;
                    void handleStatusChange(nextStatus);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {statusError ? (
                  <p className="text-sm text-red-600">{statusError}</p>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500">Customer</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {job.customer}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Machine</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {job.machine}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Quantity</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {job.quantity.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Due date</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {formatDate(job.dueDate)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Notes</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
                    {job.notes || "No notes on file."}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Issues</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
                    {job.issues || "No active issues."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500">Created</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {formatDate(job.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Updated</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {formatDate(job.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
