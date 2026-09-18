# Production Control Dashboard

This app tracks work orders, machine assignments, and due dates for an internal operations team. It is meant for the shop floor and production planners who need a quick view of what is running, delayed, and due soon.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind v4
- shadcn/ui
- lucide-react
- Mock data is in-memory

## Getting started

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

## API routes

- `/api/jobs` - returns the work order list with search, status, and sort options.
- `/api/jobs/[id]` (GET) - returns a single job or a 404.
- `/api/jobs/[id]` (PATCH) - updates a job status or notes.
- `/api/dashboard/stats` - returns the totals used by the summary cards.

## Component structure

The page owns the fetch state for search, status, sorting, and the selected job. Summary cards, table, and detail panel all pull from the same API-driven data flow.

```text
src/
  app/
    layout.tsx
    page.tsx
  components/
    SummaryCards.tsx
    JobsTable.tsx
    JobDetailPanel.tsx
    StatusBadge.tsx
  lib/
    api.ts
  types/
    job.ts
```

## Assumptions

- The mock data is in-memory and resets when the dev server restarts.
- The UI only patches the status field from the panel.
- The due-soon total uses the local date window from the stats API.
- The jobs table is client-rendered so filters and sorting happen on the page.
- Summary cards refresh after a status change.
- The detail sheet stays open after an update unless it is closed manually.

## What I would improve with more time

- Move the job store to a real database and API layer.
- Add optimistic status updates with a quick rollback on failure.
- Add keyboard navigation and row highlighting to the table.
- Add pagination once the job count grows past a few hundred.
- Add a proper toast or retry flow for failed updates.
- Add unit tests around the due-soon and status calculations.
