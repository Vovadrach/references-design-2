import React, { useState } from 'react';
import { Upload, Mail, CheckCircle, FileText, Send, DollarSign, Check, Truck, Clock, MoreHorizontal } from 'lucide-react';
import { Trip, TripStatus, PipelineStatus } from '../types';
import InvoiceModal from './InvoiceModal';
import EmailModal from './EmailModal';

interface TripCardProps {
  trip: Trip;
  index: number;
  onClick?: () => void;
}

// Local types for the interactive demo state
type CmrState = 'PENDING' | 'UPLOADED' | 'SENT' | 'RECEIVED';
type BillingState = 'PENDING' | 'ISSUED' | 'WAITING_PAYMENT' | 'PAID';

interface HistoryNode {
  id: string;
  label: string;
  value?: string;
  status: PipelineStatus;
}

// --- Helper Component for Tree Lines (Matches TripDetailView SystemLogItem style) ---
interface TreeItemProps {
  isLast: boolean;
  children: React.ReactNode;
}

const TreeItem: React.FC<TreeItemProps> = ({ isLast, children }) => (
  <div className="relative pl-6 py-1">
    {/* Vertical Line: Matches the subtle gray line from DetailView */}
    <div 
      className={`absolute left-[9px] top-0 w-px bg-gray-100 ${isLast ? 'h-3' : 'h-full'}`} 
    />
    {/* Horizontal Hook */}
    <div 
      className="absolute left-[9px] top-3 w-3 h-px bg-gray-200" 
    />
    {/* Content */}
    <div className="text-xs w-full">
      {children}
    </div>
  </div>
);

const TripCard: React.FC<TripCardProps> = ({ trip, index, onClick }) => {
  // --- Local State for Simulation ---
  const [cmrState, setCmrState] = useState<CmrState>('PENDING');
  // Initialize billing state based on trip status or default to PENDING
  const [billingState, setBillingState] = useState<BillingState>(
    trip.billing.status === PipelineStatus.COMPLETED ? 'PAID' : 'PENDING'
  );
  const [localTripStatus, setLocalTripStatus] = useState<TripStatus>(trip.status);
  
  // Modals state
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Initialize history 
  const [cmrHistory, setCmrHistory] = useState<HistoryNode[]>(
    trip.cmr.history.map(h => ({ 
      id: h.id, 
      label: h.label, 
      status: h.status,
      value: h.value || (h.status === PipelineStatus.COMPLETED ? 'Done' : undefined)
    }))
  );
  
  const [billingHistory, setBillingHistory] = useState<HistoryNode[]>([]);

  // Calculate Rate
  const ratePerKm = (trip.billing.amount / trip.task.distance).toFixed(2);

  // --- Handlers ---
  const addHistoryNode = (
    type: 'cmr' | 'billing', 
    label: string, 
    value: string, 
    status: PipelineStatus
  ) => {
    const newNode: HistoryNode = {
      id: Math.random().toString(36).substr(2, 9),
      label,
      value,
      status
    };

    if (type === 'cmr') {
      setCmrHistory(prev => [...prev, newNode]);
    } else {
      setBillingHistory(prev => [...prev, newNode]);
    }
  };

  const handleCmrAction = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (cmrState === 'PENDING') {
      setCmrState('UPLOADED');
      addHistoryNode('cmr', 'Завантажено', 'cmr_2405.pdf', PipelineStatus.WARNING);
    } else if (cmrState === 'UPLOADED') {
      setCmrState('SENT');
      addHistoryNode('cmr', 'Надіслано поштою', 'logistics@rossi.it', PipelineStatus.ACTIVE);
    } else if (cmrState === 'SENT') {
      setCmrState('RECEIVED');
      addHistoryNode('cmr', 'Підтверджено', 'Підписано клієнтом', PipelineStatus.COMPLETED);
    }
  };

  const handleBillingAction = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (billingState === 'PENDING') {
      // Step 1: Open Invoice Config
      setIsInvoiceModalOpen(true);
    } else if (billingState === 'ISSUED') {
      // Step 2: Open Email Client
      setIsEmailModalOpen(true);
    } else if (billingState === 'WAITING_PAYMENT') {
      setBillingState('PAID');
      setLocalTripStatus(TripStatus.COMPLETED);
      addHistoryNode('billing', 'Оплачено', '2450.00 EUR', PipelineStatus.COMPLETED);
    }
  };

  const handleInvoiceSubmit = (data: any) => {
    console.log("Invoice JSON Payload:", data);
    setBillingState('ISSUED');
    const mockInvId = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;
    addHistoryNode('billing', 'Рахунок створено', mockInvId, PipelineStatus.ACTIVE);
    setIsInvoiceModalOpen(false);
  };

  const handleEmailSubmit = () => {
    setBillingState('WAITING_PAYMENT');
    addHistoryNode('billing', 'Надіслано на оплату', 'Термін: 30 днів', PipelineStatus.WARNING);
    setIsEmailModalOpen(false);
  };

  // --- Render Helpers ---
  const getTextColor = (status: PipelineStatus, isLastItem: boolean) => {
    if (!isLastItem) return 'text-gray-400'; 

    switch (status) {
      case PipelineStatus.COMPLETED: return 'text-emerald-600';
      case PipelineStatus.WARNING: return 'text-amber-600';
      case PipelineStatus.ACTIVE: return 'text-blue-600';
      case PipelineStatus.BLOCKED: return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const showCmrAction = cmrState !== 'RECEIVED';
  const showBillingAction = billingState !== 'PAID';

  const getCmrButtonTheme = () => {
    switch (cmrState) {
      case 'PENDING': return 'amber'; 
      case 'UPLOADED': return 'blue'; 
      case 'SENT': return 'emerald';  
      default: return 'gray';
    }
  };

  const getBillingButtonTheme = () => {
    switch (billingState) {
      case 'PENDING': return 'blue';    
      case 'ISSUED': return 'amber';    
      case 'WAITING_PAYMENT': return 'emerald'; 
      default: return 'gray';
    }
  };

  // Styles matched to TripDetailView Header
  const getHeaderStyles = () => {
    if (billingState === 'WAITING_PAYMENT') return 'bg-blue-50/40 border-blue-100';
    if (billingState === 'PAID' || localTripStatus === TripStatus.COMPLETED) return 'bg-emerald-50/40 border-emerald-100';
    return 'bg-white border-gray-100';
  };

  const renderStatusIcon = () => {
    switch (localTripStatus) {
      case TripStatus.COMPLETED:
        return (
          <div className="bg-white p-1 rounded-md border border-emerald-100 shadow-sm text-emerald-600">
             <Check size={14} strokeWidth={2.5} />
          </div>
        );
      case TripStatus.IN_TRANSIT:
        return (
           <div className="bg-white p-1 rounded-md border border-blue-100 shadow-sm text-blue-600">
             <Truck size={14} strokeWidth={2} />
          </div>
        );
      default:
        return (
          <div className="bg-white p-1 rounded-md border border-gray-200 shadow-sm text-gray-400">
             <Clock size={14} />
          </div>
        );
    }
  };

  const getSectionHeaderStyle = (active: boolean) => 
    `text-[10px] font-bold font-mono uppercase tracking-wider mb-1 flex items-center gap-2 ${active ? 'text-gray-700' : 'text-gray-400'}`;

  return (
    <>
      <div 
        onClick={onClick}
        className="
            bg-white rounded-2xl shadow-sm shadow-gray-200/50 
            border border-gray-100 mb-4 overflow-hidden 
            hover:shadow-lg hover:shadow-gray-200/60 hover:border-blue-200/60 
            transition-all duration-300 cursor-pointer group
        "
      >
        
        {/* --- Card Header --- */}
        <div className={`px-5 py-4 border-b transition-colors duration-500 ${getHeaderStyles()}`}>
          <div className="flex justify-between items-start mb-3">
               <div>
                   <h3 className="text-base font-bold text-gray-800 font-mono tracking-tight leading-none mb-1 group-hover:text-blue-700 transition-colors">
                       {trip.clientName}
                   </h3>
                   <div className="text-[10px] text-gray-400 font-mono flex items-center gap-2">
                        <span>International Transport</span>
                   </div>
               </div>
               {renderStatusIcon()}
          </div>
          
          {/* Stats Row - Matches the 'chip' style in DetailView */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-gray-600">
             <div className="flex items-center gap-2 bg-white/60 border border-gray-200/50 rounded-lg px-2 py-1 backdrop-blur-sm">
                <span className="font-bold text-gray-900">{trip.billing.amount} {trip.billing.currency}</span>
             </div>
             <div className="flex items-center gap-2 bg-white/60 border border-gray-200/50 rounded-lg px-2 py-1 backdrop-blur-sm">
                <span>{trip.task.distance} km</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">{ratePerKm} €/km</span>
             </div>
          </div>
        </div>

        {/* --- Card Body --- */}
        <div className="px-5 py-4 space-y-5 bg-white">
          
          {/* SECTION 1: ROUTE (Single Line) */}
          <div className="relative">
            <div className={getSectionHeaderStyle(true)}>
               <span className="bg-gray-100 text-gray-500 px-1.5 rounded text-[9px]">{index}</span>
               <span>ROUTE</span>
            </div>
            
            <div className="pl-1">
               <TreeItem isLast={true}>
                 <div className="flex items-center py-0.5">
                    {/* Route Container matching SystemLogItem visual weight */}
                    <div className="flex items-center gap-2 bg-gray-50/50 px-2 py-1.5 rounded border border-gray-100 w-full hover:border-gray-200 transition-colors">
                        
                        {/* Pickup */}
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-700 text-[11px]">{trip.task.pickup.city}</span>
                            <span className="text-[10px] text-gray-400 font-mono">{trip.task.pickup.date}</span>
                        </div>
                        
                        {/* Arrow */}
                        <div className="text-gray-300 text-[10px]">➝</div>

                        {/* Delivery */}
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-700 text-[11px]">{trip.task.delivery.city}</span>
                            <span className="text-[10px] text-gray-400 font-mono">{trip.task.delivery.date}</span>
                        </div>
                    </div>
                 </div>
               </TreeItem>
            </div>
          </div>

          {/* SECTION 2: CMR */}
          <div className="relative">
             <div className={getSectionHeaderStyle(cmrHistory.length > 0)}>
               <span>CMR DOCUMENTATION</span>
            </div>
            <div className="pl-1">
              {cmrHistory.map((node, i) => {
                const isLastItem = i === cmrHistory.length - 1;
                return (
                    <TreeItem key={node.id} isLast={!showCmrAction && isLastItem}>
                        <div className="flex items-center gap-2 py-0.5">
                            <span className={`text-[11px] font-medium font-mono ${getTextColor(node.status, isLastItem)}`}>
                                {node.label}
                            </span>
                            {node.value && (
                                <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 font-mono">
                                    {node.value}
                                </span>
                            )}
                        </div>
                    </TreeItem>
                );
              })}

              {showCmrAction && (
                <TreeItem isLast={true}>
                   <CompactActionButton 
                      state={cmrState} 
                      type="cmr" 
                      onClick={handleCmrAction}
                      colorTheme={getCmrButtonTheme()}
                   />
                </TreeItem>
              )}
            </div>
          </div>

          {/* SECTION 3: BILLING */}
          <div className="relative">
             <div className={getSectionHeaderStyle(billingHistory.length > 0)}>
               <span>FINANCIALS</span>
            </div>
            <div className="pl-1">
                {billingHistory.map((node, i) => {
                  const isLastItem = i === billingHistory.length - 1;
                  return (
                      <TreeItem key={node.id} isLast={!showBillingAction && isLastItem}>
                        <div className="flex items-center gap-2 py-0.5">
                            <span className={`text-[11px] font-medium font-mono ${getTextColor(node.status, isLastItem)}`}>
                                {node.label}
                            </span>
                            {node.value && (
                                <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 font-mono">
                                    {node.value}
                                </span>
                            )}
                        </div>
                      </TreeItem>
                  );
                })}

                {showBillingAction && (
                  <TreeItem isLast={true}>
                     <CompactActionButton 
                        state={billingState} 
                        type="billing" 
                        onClick={handleBillingAction} 
                        colorTheme={getBillingButtonTheme()}
                     />
                  </TreeItem>
                )}
            </div>
          </div>

        </div>
      </div>

      <InvoiceModal 
        isOpen={isInvoiceModalOpen} 
        onClose={() => setIsInvoiceModalOpen(false)}
        onSubmit={handleInvoiceSubmit}
      />

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSubmit={handleEmailSubmit}
        clientName={trip.clientName}
      />
    </>
  );
};

// --- Helper: Updated Action Button (Less Boxy, More Pill-like) ---
interface ButtonProps { 
  state: string; 
  type: 'cmr' | 'billing'; 
  onClick: (e: React.MouseEvent) => void;
  colorTheme: string;
}

const CompactActionButton = ({ state, type, onClick, colorTheme }: ButtonProps) => {
  let label = '';
  let icon = null;

  const colorStyles: Record<string, string> = {
    amber: "bg-white text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300",
    blue: "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300",
    emerald: "bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300",
    gray: "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
  };

  const currentStyle = colorStyles[colorTheme] || colorStyles.gray;
  
  // Updated style: More padding, rounded-lg, shadow-sm
  const baseStyle = `flex items-center gap-2 text-[10px] font-bold font-mono uppercase tracking-wide transition-all cursor-pointer group px-3 py-1.5 rounded-lg border shadow-sm ${currentStyle} active:scale-95`;

  if (type === 'cmr') {
    switch(state) {
      case 'PENDING': 
        label = 'Upload CMR'; 
        icon = <Upload size={12} />;
        break;
      case 'UPLOADED': 
        label = 'Send Email'; 
        icon = <Mail size={12} />;
        break;
      case 'SENT': 
        label = 'Confirm'; 
        icon = <CheckCircle size={12} />;
        break;
      default: return null;
    }
  } else {
    switch(state) {
      case 'PENDING': 
        label = 'Create Invoice'; 
        icon = <FileText size={12} />;
        break;
      case 'ISSUED': 
        label = 'Send Payment'; 
        icon = <Send size={12} />;
        break;
      case 'WAITING_PAYMENT': 
        label = 'Mark Paid'; 
        icon = <DollarSign size={12} />;
        break;
      default: return null;
    }
  }

  return (
    <button onClick={onClick} className={baseStyle}>
      <span className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default TripCard;