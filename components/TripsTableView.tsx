import React, { useState, useRef } from 'react';
import { Trip, PipelineStatus } from '../types';
import { 
  Plus, Check, Upload, FileText, 
  Clock, Send, ArrowRight
} from 'lucide-react';

interface TripsTableViewProps {
  trips: Trip[];
  onTripClick: (trip: Trip) => void;
}

// Local types for interactivity
type CmrState = 'PENDING' | 'UPLOADED' | 'SENT' | 'RECEIVED';
type BillingState = 'PENDING' | 'ISSUED' | 'WAITING_PAYMENT' | 'PAID';

// --- Status Pill Component (Refined & Compact) ---
const StatusPill = ({ type, state, onClick }: { type: 'CMR' | 'INV', state: string, onClick: (e: React.MouseEvent) => void }) => {
    
    let label = state;
    let styleClass = "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100 hover:border-gray-200";
    let icon = null;

    if (type === 'CMR') {
        switch (state) {
            case 'PENDING':
                label = 'Upload';
                styleClass = "bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-200";
                icon = <Upload size={10} />;
                break;
            case 'UPLOADED':
                label = 'Send';
                styleClass = "bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-200";
                icon = <Send size={10} />;
                break;
            case 'SENT':
                label = 'Waiting';
                styleClass = "bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-200";
                icon = <Clock size={10} />;
                break;
            case 'RECEIVED':
                label = 'Done';
                styleClass = "bg-emerald-50 text-emerald-600 border-emerald-100";
                icon = <Check size={10} strokeWidth={3} />;
                break;
        }
    } else {
        // INVOICE
        switch (state) {
             case 'PENDING':
                label = 'Create';
                styleClass = "bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-200";
                icon = <FileText size={10} />;
                break;
            case 'ISSUED':
                label = 'Send';
                styleClass = "bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-200";
                icon = <Send size={10} />;
                break;
            case 'WAITING_PAYMENT':
                label = 'Waiting';
                styleClass = "bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-200";
                icon = <Clock size={10} />;
                break;
            case 'PAID':
                label = 'Paid';
                styleClass = "bg-emerald-50 text-emerald-600 border-emerald-100";
                icon = <Check size={10} strokeWidth={3} />;
                break;
        }
    }

    return (
        <button 
            onClick={onClick}
            className={`
                group relative flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-md border 
                text-[9px] font-bold font-mono uppercase tracking-wider transition-all active:scale-95 shadow-sm
                w-20 shrink-0 h-6
                ${styleClass}
            `}
        >
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
            <span>{label}</span>
        </button>
    );
};

// --- ISOLATED ROW COMPONENT ---
interface TripTableRowProps {
  trip: Trip;
  index: number;
  onClick: () => void;
}

const TripTableRow: React.FC<TripTableRowProps> = ({ trip, index, onClick }) => {
  
  const [cmrState, setCmrState] = useState<CmrState>(() => {
     if (trip.cmr.status === PipelineStatus.COMPLETED) return 'RECEIVED';
     if (trip.cmr.currentStep === 'Sent_to_Client') return 'SENT';
     return trip.cmr.status === PipelineStatus.PENDING ? 'PENDING' : 'UPLOADED';
  });

  const [billingState, setBillingState] = useState<BillingState>(() => {
    if (trip.billing.status === PipelineStatus.COMPLETED) return 'PAID';
    const s = trip.billing.invoiceStatus;
    if (s === 'PAID') return 'PAID';
    if (s === 'WAITING_PAYMENT') return 'WAITING_PAYMENT'; 
    if (s === 'ISSUED') return 'ISSUED';
    return 'PENDING';
  });

  const handleCmrClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cmrState === 'PENDING') setCmrState('UPLOADED');
    else if (cmrState === 'UPLOADED') setCmrState('SENT');
    else if (cmrState === 'SENT') setCmrState('RECEIVED');
  };

  const handleInvClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (billingState === 'PENDING') setBillingState('ISSUED');
    else if (billingState === 'ISSUED') setBillingState('WAITING_PAYMENT');
    else if (billingState === 'WAITING_PAYMENT') setBillingState('PAID');
  };

  const isPaid = billingState === 'PAID';
  const ratePerKm = (trip.billing.amount / trip.task.distance).toFixed(2);

  // Common border class for vertical lines
  const borderClass = "border-r border-gray-100/50";

  return (
    <tr 
      onClick={onClick}
      className="group hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0 text-sm whitespace-nowrap"
    >
      {/* 1. Index */}
      <td className={`pl-4 pr-2 py-3 text-center w-10 align-middle ${borderClass}`}>
         <span className="text-gray-300 font-mono text-[10px] group-hover:text-gray-500 transition-colors">
             {String(index + 1).padStart(2, '0')}
         </span>
      </td>

      {/* 2. Client & ID (Tightened) */}
      <td className={`px-4 py-3 min-w-[200px] max-w-[240px] align-middle ${borderClass}`}>
         <div className="flex flex-col gap-0.5 overflow-hidden">
            <div className="font-bold text-gray-800 text-[13px] truncate group-hover:text-blue-700 transition-colors" title={trip.clientName}>
                {trip.clientName}
            </div>
            <div className="flex items-center gap-2">
                 <span className="font-mono text-[9px] text-gray-400 font-medium px-1 rounded bg-gray-50 border border-gray-100 group-hover:border-gray-200">
                    {trip.task.id}
                </span>
            </div>
         </div>
      </td>

      {/* 3. Pickup (Tightened) */}
      <td className={`px-4 py-3 min-w-[140px] max-w-[180px] align-middle ${borderClass}`}>
         <div className="flex flex-col items-start text-left overflow-hidden">
            <div className="flex items-center gap-1.5 w-full">
                 <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-gray-400 shrink-0"></span>
                 <span className="font-bold text-gray-700 text-[11px] uppercase truncate w-full" title={trip.task.pickup.city}>
                    {trip.task.pickup.city}
                </span>
            </div>
            <span className="font-mono text-[9px] text-gray-400 pl-3">{trip.task.pickup.date}</span>
         </div>
      </td>

      {/* 4. Delivery (Tightened) */}
      <td className={`px-4 py-3 min-w-[140px] max-w-[180px] align-middle ${borderClass}`}>
         <div className="flex flex-col items-start text-left overflow-hidden">
            <div className="flex items-center gap-1.5 w-full">
                 <span className="w-1.5 h-1.5 rounded-full bg-gray-800 group-hover:bg-blue-600 transition-colors shrink-0"></span>
                 <span className="font-bold text-gray-700 text-[11px] uppercase truncate w-full" title={trip.task.delivery.city}>
                    {trip.task.delivery.city}
                </span>
            </div>
            <span className="font-mono text-[9px] text-gray-400 pl-3">{trip.task.delivery.date}</span>
         </div>
      </td>

      {/* 5. KM */}
      <td className={`px-3 py-3 text-right align-middle w-[80px] ${borderClass}`}>
         <span className="font-mono text-gray-500 text-[11px] font-medium">{trip.task.distance} km</span>
      </td>

      {/* 6. Rate */}
      <td className={`px-3 py-3 text-right align-middle w-[80px] ${borderClass}`}>
         <div className="flex justify-end">
             <span className="font-mono text-[10px] text-gray-400 font-bold bg-white border border-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap group-hover:border-gray-200">
                {ratePerKm} €
             </span>
         </div>
      </td>

      {/* 7. Amount (Tightened) */}
      <td className={`px-4 py-3 text-right min-w-[100px] align-middle ${borderClass}`}>
         <div className="flex flex-col items-end justify-center h-full">
            <span className={`font-mono font-bold text-[13px] ${isPaid ? 'text-emerald-600' : 'text-gray-900'}`}>
                {trip.billing.amount.toLocaleString()} <span className="text-[9px] font-normal text-gray-400">{trip.billing.currency}</span>
            </span>
         </div>
      </td>

      {/* 8. CMR Status (Tightened) */}
      <td className={`px-2 py-3 text-center align-middle min-w-[100px] ${borderClass}`}>
         <div className="flex justify-center">
            <StatusPill type="CMR" state={cmrState} onClick={handleCmrClick} />
         </div>
      </td>

      {/* 9. Invoice Status (Tightened, no border right) */}
      <td className="px-2 py-3 text-center align-middle min-w-[100px]">
         <div className="flex justify-center">
            <StatusPill type="INV" state={billingState} onClick={handleInvClick} />
         </div>
      </td>
    </tr>
  );
};

const TripsTableView: React.FC<TripsTableViewProps> = ({ trips, onTripClick }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateClick = () => {
    fileInputRef.current?.click();
  };

  // Sticky Header styles
  const thClass = "px-4 py-2.5 font-bold text-gray-400 text-[9px] uppercase tracking-wider font-mono border-r border-gray-100 last:border-0 bg-white sticky top-0 z-20 whitespace-nowrap shadow-[0_1px_0_rgba(0,0,0,0.03)]";

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm shadow-gray-200/50 overflow-hidden font-sans mb-0">
      
      {/* Scrollable Container covering Table ONLY */}
      <div className="flex-1 overflow-auto custom-scrollbar relative bg-white flex flex-col">
        
        {/* Table - Reduced Min Width for compactness */}
        <table className="w-full text-left border-collapse min-w-[1000px]">
          {/* Header */}
          <thead>
            <tr className="h-9">
              <th className={`pl-4 pr-2 text-center w-10 ${thClass}`}>#</th>
              <th className={`text-left ${thClass}`}>Client / Ref</th>
              <th className={`text-left ${thClass}`}>Pickup</th>
              <th className={`text-left ${thClass}`}>Delivery</th>
              <th className={`text-right px-3 ${thClass}`}>Dist.</th>
              <th className={`text-right px-3 ${thClass}`}>Rate</th>
              <th className={`text-right ${thClass}`}>Revenue</th>
              <th className={`text-center px-2 ${thClass}`}>CMR</th>
              <th className={`text-center px-2 ${thClass} border-r-0`}>Invoice</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white">
            {trips.map((trip, index) => (
              <TripTableRow 
                key={trip.id} 
                trip={trip} 
                index={index} 
                onClick={() => onTripClick(trip)} 
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer - Add Button (Fixed at bottom of component, outside scroll area) */}
      <button 
        onClick={handleCreateClick}
        className="
            w-full h-10 shrink-0
            bg-gray-50 border-t border-gray-200 border-dashed hover:border-blue-300
            flex items-center justify-center gap-2
            cursor-pointer hover:bg-blue-50/30 transition-all group select-none
            text-gray-400 hover:text-blue-600
        "
      >
        <Plus size={14} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Create new trip</span>
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.xml,.json,.csv"
        />
      </button>

    </div>
  );
};

export default TripsTableView;