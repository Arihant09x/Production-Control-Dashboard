import { Job } from "@/types/job";

export async function getJobs(
  params: {
    search?: string;
    status?: string;
    sortBy?: "dueDate" | "quantity";
    sortOrder?: "asc" | "desc";
  } = {},
) {
  const qs = new URLSearchParams();

  if (params.search) {
    qs.set("search", params.search);
  }

  if (params.status) {
    qs.set("status", params.status);
  }

  if (params.sortBy) {
    qs.set("sortBy", params.sortBy);
  }

  if (params.sortOrder) {
    qs.set("sortOrder", params.sortOrder);
  }

  const response = await fetch(
    `/api/jobs${qs.toString() ? `?${qs.toString()}` : ""}`,
  );

  if (!response.ok) {
    throw new Error("Failed to load jobs");
  }

  return response.json() as Promise<Job[]>;
}

export async function getStats() {
  const response = await fetch("/api/dashboard/stats");

  if (!response.ok) {
    throw new Error("Failed to load stats");
  }

  return response.json() as Promise<{
    totalJobs: number;
    delayedJobs: number;
    dueTodayOrSoon: number;
    completedJobs: number;
  }>;
}

export async function updateJob(
  id: string,
  patch: { status?: string; notes?: string },
) {
  const response = await fetch(`/api/jobs/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  });

  if (!response.ok) {
    throw new Error("Failed to update job");
  }

  return response.json() as Promise<Job>;
}
