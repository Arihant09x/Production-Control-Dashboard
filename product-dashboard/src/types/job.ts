export type JobStatus = 'Pending' | 'In Progress' | 'Delayed' | 'Completed';

export interface Job {
  id: string;
  productName: string;
  customer: string;
  quantity: number;
  dueDate: string;
  status: JobStatus;
  machine: string;
  notes: string;
  issues: string;
  createdAt: string;
  updatedAt: string;
}
