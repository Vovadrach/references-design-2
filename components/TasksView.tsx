import React from 'react';
import { Trip, PipelineStatus } from '../types';
import { 
  FileText, CheckCircle, AlertCircle, 
  ArrowRight, Clock, AlertTriangle, 
  Info, Upload, Mail, ShieldAlert,
  Search, Check, Calendar
} from 'lucide-react';

interface TasksViewProps {
  trips: Trip[];
}

interface TaskItem {
  id: string;
  tripId: string;
  clientName: string;
  type: 'CMR' | 'BILLING';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  actionLabel: string;
  actionIcon: React.ReactNode;
  date: string;
}

// --- Helper Components ---

const TaskCard: React.FC<{ task: TaskItem }> = ({ task }) => {
    
    // Theme Configuration based on Severity (Matching TripCard aesthetic)
    const theme = {
        critical: {
            wrapper: 'border-red-100 hover:border-red-200 hover:shadow-red-100/50',
            header: 'bg-red-50/50 border-red-50 text-red-700',
            iconBox: 'bg-white text-red-600 border-red-100',
            button: 'text-red-600 border-red-100 hover:bg-red-50 hover:border-red-200'
        },
        warning: {
            wrapper: 'border-amber-100 hover:border-amber-200 hover:shadow-amber-100/50',
            header: 'bg-amber-50/50 border-amber-50 text-amber-700',
            iconBox: 'bg-white text-amber-600 border-amber-100',
            button: 'text-amber-600 border-amber-100 hover:bg-amber-50 hover:border-amber-200'
        },
        info: {
            wrapper: 'border-blue-100 hover:border-blue-200 hover:shadow-blue-100/50',
            header: 'bg-blue-50/50 border-blue-50 text-blue-700',
            iconBox: 'bg-white text-blue-600 border-blue-100',
            button: 'text-blue-600 border-blue-100 hover:bg-blue-50 hover:border-blue-200'
        }
    }[task.severity];

    const Icon = task.severity === 'critical' ? ShieldAlert : 
                 task.severity === 'warning' ? AlertTriangle : Info;

    return (
        <div className={`
            group relative flex flex-col 
            bg-white rounded-xl border shadow-sm transition-all duration-300
            ${theme.wrapper}
        `}>
            {/* Card Header (Soft Tint) */}
            <div className={`px-4 py-2.5 flex items-center justify-between border-b rounded-t-xl ${theme.header}`}>
                 <div className="flex items-center gap-2 overflow-hidden">
                     <div className={`w-5 h-5 rounded-md flex items-center justify-center border shadow-sm shrink-0 ${theme.iconBox}`}>
                        <Icon size={10} strokeWidth={2.5} />
                    </div>
                    
                    <div className="flex items-baseline gap-2 overflow-hidden">
                         <span className="text-[11px] font-bold tracking-tight truncate" title={task.clientName}>
                            {task.clientName}
                        </span>
                        <span className="text-[10px] font-bold font-mono uppercase tracking-wider opacity-60 shrink-0">
                            {task.tripId}
                        </span>
                    </div>
                 </div>
                 <div className="flex items-center gap-1.5 opacity-70 shrink-0 ml-2">
                    <Calendar size={10} />
                    <span className="text-[9px] font-mono font-bold">{task.date}</span>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-4 flex flex-col gap-3">
                
                {/* Text Content */}
                <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="text-sm font-bold text-gray-800 leading-tight">
                            {task.title}
                        </h3>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                            task.type === 'CMR' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                            {task.type}
                        </span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                        {task.description}
                    </p>
                </div>

                {/* Footer Action */}
                <div className="pt-2 flex justify-end">
                    <button className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-white shadow-sm
                        text-[10px] font-bold font-mono uppercase tracking-wide
                        transition-all active:scale-95 group/btn
                        ${theme.button}
                    `}>
                        <span className="opacity-70 group-hover/btn:opacity-100 transition-opacity">
                            {React.cloneElement(task.actionIcon as React.ReactElement, { size: 12, strokeWidth: 2.5 })}
                        </span>
                        <span>{task.actionLabel}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const TasksView: React.FC<TasksViewProps> = ({ trips }) => {
  
  // Logic to derive tasks
  const tasks: TaskItem[] = React.useMemo(() => {
    const list: TaskItem[] = [];
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });

    trips.forEach(trip => {
      // 1. Check CMR Tasks
      if (trip.cmr.status !== PipelineStatus.COMPLETED) {
        if (trip.cmr.currentStep === 'Drafting' || trip.cmr.status === PipelineStatus.PENDING) {
          list.push({
            id: `cmr-${trip.id}`,
            tripId: trip.task.id,
            clientName: trip.clientName,
            type: 'CMR',
            severity: 'critical',
            title: 'Missing Documentation',
            description: 'CMR document scan is required to proceed.',
            actionLabel: 'Upload Scan',
            actionIcon: <Upload />,
            date: today
          });
        } else if (trip.cmr.currentStep === 'Sent_to_Client') {
           list.push({
            id: `cmr-conf-${trip.id}`,
            tripId: trip.task.id,
            clientName: trip.clientName,
            type: 'CMR',
            severity: 'info',
            title: 'Pending Client Signature',
            description: 'Documents sent. Waiting for client confirmation.',
            actionLabel: 'Check Status',
            actionIcon: <Clock />,
            date: today
          });
        }
      }

      // 2. Check Billing Tasks
      if (trip.billing.status !== PipelineStatus.COMPLETED) {
        if (trip.billing.status === PipelineStatus.BLOCKED || trip.billing.invoiceStatus === 'WAITING_DOCS') {
           list.push({
            id: `bill-create-${trip.id}`,
            tripId: trip.task.id,
            clientName: trip.clientName,
            type: 'BILLING',
            severity: 'warning',
            title: 'Ready for Invoicing',
            description: 'All transport docs verified. Issue invoice now.',
            actionLabel: 'Create Invoice',
            actionIcon: <FileText />,
            date: today
          });
        } else if (trip.billing.invoiceStatus === 'ISSUED') {
          list.push({
            id: `bill-send-${trip.id}`,
            tripId: trip.task.id,
            clientName: trip.clientName,
            type: 'BILLING',
            severity: 'warning',
            title: 'Invoice Not Sent',
            description: `Invoice ${trip.billing.invoiceId} generated but not emailed.`,
            actionLabel: 'Send Email',
            actionIcon: <Mail />,
            date: today
          });
        } else if (trip.billing.status === PipelineStatus.PENDING && trip.billing.invoiceStatus !== 'ISSUED') {
           list.push({
            id: `bill-gen-${trip.id}`,
            tripId: trip.task.id,
            clientName: trip.clientName,
            type: 'BILLING',
            severity: 'info',
            title: 'Billing Review',
            description: 'Verify trip data before invoice generation.',
            actionLabel: 'Review Data',
            actionIcon: <Search />,
            date: today
           });
        }
      }
    });

    // Sort: Critical -> Warning -> Info
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return list.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  }, [trips]);

  const stats = {
      critical: tasks.filter(t => t.severity === 'critical').length,
      warning: tasks.filter(t => t.severity === 'warning').length,
      info: tasks.filter(t => t.severity === 'info').length
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm shadow-gray-200/50 overflow-hidden font-sans">
      
      {/* --- HEADER (Preserved UX) --- */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white z-10">
         <div className="flex items-center justify-between mb-4">
             <div>
                 <h2 className="text-lg font-bold text-gray-900 font-mono tracking-tight leading-none">System Tasks</h2>
                 <p className="text-xs text-gray-400 mt-1 font-medium">Pending actions and pipeline alerts</p>
             </div>
             
             {/* Simple Status Summary */}
             <div className="flex gap-2">
                 <div className="flex flex-col items-center px-3 py-1 bg-red-50 border border-red-100 rounded-lg">
                    <span className="text-lg font-bold font-mono text-red-600 leading-none">{stats.critical}</span>
                    <span className="text-[8px] font-bold text-red-400 uppercase tracking-wider">Crit</span>
                 </div>
                 <div className="flex flex-col items-center px-3 py-1 bg-amber-50 border border-amber-100 rounded-lg">
                    <span className="text-lg font-bold font-mono text-amber-600 leading-none">{stats.warning}</span>
                    <span className="text-[8px] font-bold text-amber-400 uppercase tracking-wider">Warn</span>
                 </div>
                 <div className="flex flex-col items-center px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg">
                    <span className="text-lg font-bold font-mono text-blue-600 leading-none">{stats.info}</span>
                    <span className="text-[8px] font-bold text-blue-400 uppercase tracking-wider">Info</span>
                 </div>
             </div>
         </div>

         {/* Filter Tabs */}
         <div className="flex items-center gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono border-b border-gray-100">
             <button className="pb-2 border-b-2 border-gray-900 text-gray-900">All Tasks</button>
             <button className="pb-2 border-b-2 border-transparent hover:text-gray-600 transition-colors">Documents</button>
             <button className="pb-2 border-b-2 border-transparent hover:text-gray-600 transition-colors">Financial</button>
         </div>
      </div>

      {/* --- TASK LIST (Redesigned as Cards) --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50 p-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-emerald-500" />
             </div>
             <p className="text-sm font-medium">All systems operational.</p>
             <p className="text-xs font-mono mt-1">No pending tasks.</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {tasks.map((task) => (
               <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default TasksView;