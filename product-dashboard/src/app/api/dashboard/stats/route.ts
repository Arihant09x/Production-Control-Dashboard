import { NextResponse } from 'next/server';
import { jobs } from '@/data/jobs';

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // local midnight, not utc
  const start = today.getTime();
  const end = start + 3 * 24 * 60 * 60 * 1000;

  const dueTodayOrSoon = jobs.filter((j) => {
    const t = new Date(j.dueDate).getTime();
    return t >= start && t < end && j.status !== 'Completed';
  }).length;

  return NextResponse.json({
    totalJobs: jobs.length,
    delayedJobs: jobs.filter((j) => j.status === 'Delayed').length,
    dueTodayOrSoon,
    completedJobs: jobs.filter((j) => j.status === 'Completed').length,
  });
}
