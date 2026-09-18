import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Stats = {
  totalJobs: number;
  delayedJobs: number;
  dueTodayOrSoon: number;
  completedJobs: number;
};

export function SummaryCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Total Jobs",
      value: stats.totalJobs,
      icon: ClipboardList,
    },
    {
      label: "Delayed Jobs",
      value: stats.delayedJobs,
      icon: AlertTriangle,
    },
    {
      label: "Due Today / Soon",
      value: stats.dueTodayOrSoon,
      icon: CalendarClock,
    },
    {
      label: "Completed Jobs",
      value: stats.completedJobs,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="border-slate-200 bg-white shadow-sm">
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                {label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {value}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-600">
              <Icon className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
