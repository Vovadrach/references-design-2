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
type CmrState = 'PENDING' | 'UPLOADED';
type BillingState = 'PENDING' | 'INVOICED' | 'SENT_FOR_PAYMENT' | 'PAID';

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
  const [cmrState, setCmrState] = useState<CmrState>(
    trip.cmr.status === PipelineStatus.COMPLETED ? 'UPLOADED' : 'PENDING'
  );
  const [billingState, setBillingState] = useState<BillingState>(
    trip.billing.invoiceStatus === 'PAID' ? 'PAID' : 
    trip.billing.invoiceStatus === 'WAITING_PAYMENT' ? 'SENT_FOR_PAYMENT' :
    trip.billing.invoiceStatus === 'ISSUED' ? 'INVOICED' : 'PENDING'
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
    e.stopPropagation();
    if (cmrState === 'PENDING') {
      setCmrState('UPLOADED');
      addHistoryNode('cmr', 'Завантажено', 'cmr_scan.pdf', PipelineStatus.COMPLETED);
    }
  };

  const handleBillingAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (billingState === 'PENDING') {
      setIsInvoiceModalOpen(true);
    } else if (billingState === 'INVOICED') {
      if (cmrState === 'UPLOADED') {
        setBillingState('SENT_FOR_PAYMENT');
        addHistoryNode('billing', 'Відправлено на оплату', 'Очікування', PipelineStatus.ACTIVE);
      }
    } else if (billingState === 'SENT_FOR_PAYMENT') {
      setBillingState('PAID');
      setLocalTripStatus(TripStatus.COMPLETED);
      addHistoryNode('billing', 'Оплачено', 'Завершено', PipelineStatus.COMPLETED);
    }
  };

  const handleInvoiceSubmit = (data: any) => {
    setBillingState('INVOICED');
    const mockInvId = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`;
    addHistoryNode('billing', 'Інвойс виставлено', mockInvId, PipelineStatus.COMPLETED);
    setIsInvoiceModalOpen(false);
  };

  const handleEmailSubmit = () => {
    setBillingState('SENT_FOR_PAYMENT');
    addHistoryNode('billing', 'Відправлено на оплату', 'Термін: 30 днів', PipelineStatus.ACTIVE);
    setIsEmailModalOpen(false);
  };

  // --- Render Helpers ---
  const getStatusColor = () => {
    if (billingState === 'PAID') return 'emerald';
    if (billingState === 'SENT_FOR_PAYMENT') return 'purple';
    if (cmrState === 'UPLOADED') return 'amber';
    return 'gray';
  };

  const getTextColor = (status: PipelineStatus, isLastItem: boolean) => {
    if (status === PipelineStatus.COMPLETED) return 'text-emerald-600';
    
    const theme = getStatusColor();
    if (!isLastItem) return 'text-gray-400'; 

    switch (theme) {
      case 'purple': return 'text-purple-600';
      case 'amber': return 'text-amber-600';
      case 'emerald': return 'text-emerald-600';
      default: return 'text-blue-600';
    }
  };

  const showCmrAction = cmrState === 'PENDING';
  const showBillingAction = billingState !== 'PAID';

  const getCmrButtonTheme = () => 'blue';

  const getBillingButtonTheme = () => {
    if (billingState === 'PENDING') return 'blue';
    if (billingState === 'INVOICED') return 'amber';
    if (billingState === 'SENT_FOR_PAYMENT') return 'purple';
    return 'gray';
  };

  // Styles matched to TripDetailView Header
  const getHeaderStyles = () => {
    const theme = getStatusColor();
    switch (theme) {
      case 'emerald': return 'bg-emerald-500/10 border-emerald-200';
      case 'purple': return 'bg-purple-500/10 border-purple-200';
      case 'amber': return 'bg-amber-500/10 border-amber-200';
      default: return 'bg-white border-gray-100';
    }
  };

  const renderStatusIcon = () => {
    const theme = getStatusColor();
    switch (theme) {
      case 'emerald':
        return (
          <div className="bg-white p-1 rounded-md border border-emerald-100 shadow-sm text-emerald-600">
             <Check size={14} strokeWidth={2.5} />
          </div>
        );
      case 'purple':
        return (
           <div className="bg-white p-1 rounded-md border border-purple-100 shadow-sm text-purple-600">
             <Clock size={14} strokeWidth={2} />
          </div>
        );
      case 'amber':
        return (
           <div className="bg-white p-1 rounded-md border border-amber-100 shadow-sm text-amber-600">
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
        <div className={`px-4 py-3 border-b transition-all duration-500 ${getHeaderStyles()}`}>
          <div className="flex justify-between items-start mb-2">
               <div>
                   <h3 className="text-sm font-bold text-gray-800 font-sans tracking-tight leading-none mb-1 group-hover:text-blue-700 transition-colors">
                       {trip.clientName}
                   </h3>
                   <div className="text-[9px] text-gray-400 font-mono flex items-center gap-2 uppercase tracking-widest">
                        <span>International</span>
                   </div>
               </div>
               {renderStatusIcon()}
          </div>
          
          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-sans text-gray-600">
             <div className="flex items-center gap-2 bg-white/60 border border-gray-200/50 rounded-lg px-2 py-0.5 backdrop-blur-sm">
                <span className="font-bold text-gray-900">{trip.billing.amount} {trip.billing.currency}</span>
             </div>
             <div className="flex items-center gap-2 bg-white/60 border border-gray-200/50 rounded-lg px-2 py-0.5 backdrop-blur-sm">
                <span>{trip.task.distance} km</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500">{ratePerKm} €/km</span>
             </div>
          </div>
        </div>

        {/* --- Card Body --- */}
        <div className="px-4 py-3 space-y-4 bg-white">
          
          {/* SECTION 1: ROUTE */}
          <div className="relative">
            <div className={getSectionHeaderStyle(true)}>
               <span className="bg-gray-100 text-gray-500 px-1.5 rounded text-[8px]">{index}</span>
               <span>ROUTE</span>
            </div>
            
            <div className="pl-1">
               <TreeItem isLast={true}>
                 <div className="flex items-center py-0.5">
                    <div className="flex items-center gap-2 bg-gray-50/50 px-2 py-1 rounded border border-gray-100 w-full hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-700 text-[10px]">{trip.task.pickup.city}</span>
                            <span className="text-[9px] text-gray-400 font-sans">{trip.task.pickup.date}</span>
                        </div>
                        <div className="text-gray-300 text-[9px]">➝</div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-gray-700 text-[10px]">{trip.task.delivery.city}</span>
                            <span className="text-[9px] text-gray-400 font-sans">{trip.task.delivery.date}</span>
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
                            <span className={`text-[11px] font-medium font-sans ${getTextColor(node.status, isLastItem)}`}>
                                {node.label}
                            </span>
                            {node.value && (
                                <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 font-sans">
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
                {billingHistory.length === 0 && (
                   <TreeItem isLast={!showBillingAction}>
                      <span className="text-[11px] font-medium font-sans text-gray-400">
                        {cmrState === 'PENDING' ? 'Очікування завантаження документів' : 'Готово до оплати'}
                      </span>
                   </TreeItem>
                )}
                {billingHistory.map((node, i) => {
                  const isLastItem = i === billingHistory.length - 1;
                  return (
                      <TreeItem key={node.id} isLast={!showBillingAction && isLastItem}>
                        <div className="flex items-center gap-2 py-0.5">
                            <span className={`text-[11px] font-medium font-sans ${getTextColor(node.status, isLastItem)}`}>
                                {node.label}
                            </span>
                            {node.value && (
                                <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 font-sans">
                                    {node.value}
                                </span>
                            )}
                        </div>
                      </TreeItem>
                  );
                })}

                {showBillingAction && (
                  <TreeItem isLast={true}>
                     {billingState === 'INVOICED' ? (
                        cmrState === 'UPLOADED' ? (
                          <CompactActionButton 
                            state={billingState} 
                            type="billing" 
                            onClick={handleBillingAction} 
                            colorTheme={getBillingButtonTheme()}
                          />
                        ) : null
                     ) : (
                        <CompactActionButton 
                          state={billingState} 
                          type="billing" 
                          onClick={handleBillingAction} 
                          colorTheme={getBillingButtonTheme()}
                        />
                     )}
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
    emerald: "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600",
    purple: "bg-purple-500 text-white border-purple-600 hover:bg-purple-600",
    amber: "bg-amber-500 text-white border-amber-600 hover:bg-amber-600",
    blue: "bg-blue-500 text-white border-blue-600 hover:bg-blue-600",
    gray: "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
  };

  const currentStyle = colorStyles[colorTheme] || colorStyles.gray;
  
  // Updated style: More padding, rounded-lg, shadow-sm
  const baseStyle = `flex items-center gap-2 text-[10px] font-bold font-sans uppercase tracking-wide transition-all cursor-pointer group px-3 py-1.5 rounded-lg border shadow-md ${currentStyle} active:scale-95`;

  if (type === 'cmr') {
    switch(state) {
      case 'PENDING': 
        label = 'Завантажити CMR'; 
        icon = <Upload size={12} />;
        break;
      default: return null;
    }
  } else {
    switch(state) {
      case 'PENDING': 
        label = 'Виставити інвойс-фактуру'; 
        icon = <FileText size={12} />;
        break;
      case 'INVOICED': 
        label = 'Відправити на оплату'; 
        icon = <Send size={12} />;
        break;
      case 'SENT_FOR_PAYMENT': 
        label = 'Позначити оплачено'; 
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