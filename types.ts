
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

// --- Messenger-style Communications Types ---

export interface ChatMessage {
  id: string;
  threadId: string; // The original Gmail thread ID
  subject: string;
  body: string;
  date: string; // ISO string
  from: { name?: string; email: string };
  to: { name?: string; email: string }[];
  isIncoming: boolean;
  isRead: boolean;
  attachments?: string[];
}

export interface ClientConversation {
  clientId: string;
  clientName: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface UnassignedGroup {
  email: string;
  messages: ChatMessage[];
  lastDate: string;
}

export interface EmailMessage extends ChatMessage {}

export interface EmailThread {
  id: string;
  subject: string;
  preview: string;
  lastMessageDate: string;
  status: 'LINKED' | 'AMBIGUOUS' | 'UNLINKED';
  messages: EmailMessage[];
}

export interface ViewState {
  current: 'TRIPS' | 'TASKS' | 'DETAIL' | 'COMMUNICATIONS';
  commSubView?: 'LIST' | 'CHAT' | 'THREAD' | 'QUEUE';
  selectedClientId?: string;
  selectedThreadId?: string;
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
