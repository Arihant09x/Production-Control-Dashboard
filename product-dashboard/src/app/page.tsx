'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobDetailPanel } from '@/components/JobDetailPanel';
import { JobsTable } from '@/components/JobsTable';
import { StatusBadge } from '@/components/StatusBadge';
import { SummaryCards } from '@/components/SummaryCards';
import { getJobs, getStats, updateJob } from '@/lib/api';
import { Job, JobStatus } from '@/types/job';

type DashboardStats = {
  totalJobs: number;
  delayedJobs: number;
  dueTodayOrSoon: number;
  completedJobs: number;
};

const statusOptions: Array<'all' | JobStatus> = ['all', 'Pending', 'In Progress', 'Delayed', 'Completed'];

export default function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    delayedJobs: 0,
    dueTodayOrSoon: 0,
    completedJobs: 0,
  });
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | JobStatus>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'quantity'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [jobsLoading, setJobsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);

  async function loadJobs() {
    setJobsLoading(true);
    setError('');

    try {
      const data = await getJobs({
        search: search.trim(),
        status: status === 'all' ? undefined : status,
        sortBy,
        sortOrder,
      });
      setJobs(data);
    } catch {
      setError('Unable to load jobs.');
    } finally {
      setJobsLoading(false);
    }
  }

  async function loadStats() {
    setStatsLoading(true);

    try {
      const data = await getStats();
      setStats(data);
    } catch {
      setError('Unable to load dashboard stats.');
    } finally {
      setStatsLoading(false);
    }
  }

  useEffect(() => {
    void loadJobs();
  }, [search, status, sortBy, sortOrder]);

  useEffect(() => {
    void loadStats();
  }, []);

  const handleSortChange = (nextSortBy: 'dueDate' | 'quantity') => {
    if (sortBy === nextSortBy) {
      setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortBy(nextSortBy);
    setSortOrder('asc');
  };

  const handleRowClick = (job: Job) => {
    setSelectedJob(job);
    setDetailOpen(true);
  };

  const handleStatusChange = async (id: string, nextStatus: JobStatus) => {
    try {
      const updatedJob = await updateJob(id, { status: nextStatus });

      setJobs((current) =>
        current.map((job) => (job.id === id ? { ...job, ...updatedJob } : job))
      );

      if (selectedJob && selectedJob.id === id) {
        setSelectedJob((current) => (current ? { ...current, ...updatedJob } : current));
      }

      await Promise.all([loadJobs(), loadStats()]);
    } catch {
      throw new Error('Status update failed');
    }
  };

  return (
    <main className='min-h-screen bg-slate-100 p-4 text-slate-900 md:p-6'>
      <div className='mx-auto max-w-7xl space-y-5'>
        <header className='flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5'>
          <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <p className='text-xs font-medium uppercase tracking-[0.18em] text-slate-500'>Operations</p>
              <h1 className='mt-1 text-2xl font-semibold text-slate-900'>Production Control Dashboard</h1>
            </div>
            <div className='flex items-center gap-2 text-xs text-slate-500'>
              <StatusBadge status='In Progress' />
              <span>Live status board</span>
            </div>
          </div>
        </header>

        <section className='space-y-4'>
          {statsLoading ? (
            <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className='h-24 animate-pulse rounded-xl border border-slate-200 bg-white' />
              ))}
            </div>
          ) : (
            <SummaryCards stats={stats} />
          )}
        </section>

        <section className='space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
          <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
              <div className='relative'>
                <Search className='pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder='Search job, product, customer...'
                  className='h-9 w-full min-w-[220px] pl-8 md:w-[280px]'
                />
              </div>

              <Select
                value={status}
                onValueChange={(value) => setStatus((value as 'all' | JobStatus) ?? 'all')}
              >
                <SelectTrigger className='h-9 w-[180px]'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === 'all' ? 'All statuses' : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => {
                  setSearch('');
                  setStatus('all');
                  setSortBy('dueDate');
                  setSortOrder('asc');
                }}
              >
                Reset
              </Button>
            </div>
          </div>

          {error ? <p className='text-sm text-red-600'>{error}</p> : null}

          <JobsTable
            jobs={jobs}
            loading={jobsLoading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onRowClick={handleRowClick}
          />
        </section>
      </div>

      <JobDetailPanel
        job={selectedJob}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onStatusChange={handleStatusChange}
      />
    </main>
  );
}
