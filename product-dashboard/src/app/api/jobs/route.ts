import { NextResponse } from 'next/server';
import { jobs } from '@/data/jobs';

const statuses = ['Pending', 'In Progress', 'Delayed', 'Completed'];

export async function GET(req: Request) {
  const qs = new URL(req.url).searchParams;
  const q = (qs.get('search') ?? '').trim().toLowerCase();
  const status = qs.get('status') ?? '';
  const by = qs.get('sortBy') === 'quantity' ? 'quantity' : 'dueDate';
  const dir = qs.get('sortOrder') === 'desc' ? -1 : 1;

  const list = jobs.filter((j) => {
    if (q && !j.id.toLowerCase().includes(q) && !j.productName.toLowerCase().includes(q) && !j.customer.toLowerCase().includes(q)) return false;
    if (status && statuses.includes(status) && j.status !== status) return false;
    return true;
  });

  list.sort((a, b) =>
    by === 'quantity'
      ? (a.quantity - b.quantity) * dir
      : (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * dir
  );

  return NextResponse.json(list);
}
