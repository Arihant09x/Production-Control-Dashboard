import { NextResponse } from 'next/server';
import { jobs } from '@/data/jobs';
import { JobStatus } from '@/types/job';

const statuses: JobStatus[] = ['Pending', 'In Progress', 'Delayed', 'Completed'];

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = jobs.find((j) => j.id === id);
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  return NextResponse.json(job);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

  const body: { status?: string; notes?: string } = await req.json();
  const next = statuses.find((s) => s === body.status);
  if (body.status && !next) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });

  if (next) jobs[idx].status = next;
  if (body.notes !== undefined) jobs[idx].notes = String(body.notes);
  jobs[idx].updatedAt = new Date().toISOString();

  return NextResponse.json(jobs[idx]);
}
