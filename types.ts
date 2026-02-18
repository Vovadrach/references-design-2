
export enum PipelineStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED',
  WARNING = 'WARNING'
}

export enum TripStatus {
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'COMPLETED',
  SCHEDULED = 'SCHEDULED'
}

export interface PipelineStep {
  id: string;
  label: string;
  status: PipelineStatus;
  date?: string;
  meta?: string;
  value?: string;
}

export interface LocationDetails {
  country: string;
  zip: string;
  city: string;
  date: string; // formatted date string e.g. "03.02"
}

export interface TripTask {
  id: string;
  pickup: LocationDetails;
  delivery: LocationDetails;
  distance: number; // in km
}

export interface CmrPipeline {
  status: PipelineStatus;
  currentStep: string;
  history: PipelineStep[];
  tag?: string;
}

export interface BillingPipeline {
  status: PipelineStatus;
  amount: number;
  currency: string;
  invoiceId?: string;
  invoiceStatus?: string;
}

export interface Trip {
  id: string;
  clientName: string;
  status: TripStatus;
  task: TripTask;
  cmr: CmrPipeline;
  billing: BillingPipeline;
}

// --- New Types for Activity Stream ---

export type ActivityType = 'EMAIL' | 'SYSTEM' | 'NOTE' | 'TASK' | 'DOCUMENT';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  date: string; // ISO string for sorting
  author: string; // 'System', 'Me', or Client Name
  title: string;
  content?: string; // Body of email, note text
  meta?: any; // Attachments, status changes, etc.
  isCompleted?: boolean; // For tasks
}
