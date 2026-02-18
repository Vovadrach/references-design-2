import React, { useState, useEffect, useRef } from 'react';
import { 
    X, Mail, Paperclip, 
    FileText, ArrowLeft,
    MapPin, Truck, Check,
    CheckSquare, StickyNote, Terminal, Globe,
    ArrowRightLeft, ChevronDown,
    Sparkles, ArrowUp, Calendar,
    Clock, DollarSign, Upload, Send, CheckCircle, MoreHorizontal,
    Download, FilePlus
} from 'lucide-react';
import { Trip, ActivityItem, TripStatus, PipelineStatus } from '../types';
import { MOCK_ACTIVITY_STREAM } from '../constants';

interface TripDetailViewProps {
  trip: Trip;
  onBack: () => void;
}

type Tab = 'ALL' | 'EMAIL' | 'TASK' | 'NOTE' | 'SYSTEM';

// --- THEME CONFIGURATION ---
const TAB_THEMES: Record<string, { accent: string, containerBg: string, text: string, placeholder: string, ring: string, inputBg: string, iconColor: string, glow: string }> = {
    ALL: {
        accent: 'text-gray-700',
        containerBg: 'bg-white',
        text: 'text-gray-800', 
        placeholder: "Run command or system query...",
        ring: 'focus-within:ring-gray-200',
        inputBg: 'bg-gray-50',
        iconColor: 'text-gray-400',
        glow: 'border-gray-200 shadow-xl shadow-gray-200/50'
    },
    EMAIL: {
        accent: 'text-blue-600',
        containerBg: 'bg-blue-50/40',
        text: 'text-gray-900', 
        placeholder: "Draft email content...",
        ring: 'focus-within:ring-blue-200',
        inputBg: 'bg-white',
        iconColor: 'text-blue-500',
        // Darker border (300/80) + Inner Top Highlight (Glassy) + Subtle Outer Ring
        glow: 'border-blue-300/80 shadow-[0_0_0_1px_rgba(59,130,246,0.1),inset_0_1px_0_0_rgba(255,255,255,0.6)]'
    },
    TASK: {
        accent: 'text-emerald-600',
        containerBg: 'bg-emerald-50/40',
        text: 'text-emerald-950', 
        placeholder: "Describe the task...",
        ring: 'focus-within:ring-emerald-200',
        inputBg: 'bg-white',
        iconColor: 'text-emerald-500',
        glow: 'border-emerald-300/80 shadow-[0_0_0_1px_rgba(16,185,129,0.1),inset_0_1px_0_0_rgba(255,255,255,0.6)]'
    },
    NOTE: {
        accent: 'text-amber-600',
        containerBg: 'bg-amber-50/40',
        text: 'text-amber-950', 
        placeholder: "Write a note...",
        ring: 'focus-within:ring-amber-200',
        inputBg: 'bg-white',
        iconColor: 'text-amber-500',
        glow: 'border-amber-300/80 shadow-[0_0_0_1px_rgba(245,158,11,0.1),inset_0_1px_0_0_rgba(255,255,255,0.6)]'
    },
    SYSTEM: {
        accent: 'text-gray-700',
        containerBg: 'bg-gray-50',
        text: 'text-gray-800',
        placeholder: "System log...",
        ring: 'focus-within:ring-gray-200',
        inputBg: 'bg-white',
        iconColor: 'text-gray-400',
        glow: 'border-gray-200 shadow-xl shadow-gray-200/50'
    }
};

// --- Helper Components ---

const TreeItem: React.FC<{ isLast: boolean; children: React.ReactNode }> = ({ isLast, children }) => (
  <div className="relative pl-6 py-1">
    <div className={`absolute left-[9px] top-0 w-px bg-gray-100 ${isLast ? 'h-3' : 'h-full'}`} />
    <div className="absolute left-[9px] top-3 w-3 h-px bg-gray-200" />
    <div className="text-xs w-full">
      {children}
    </div>
  </div>
);

// Copied from TripCard for identical look
interface CompactActionProps { 
  state: string; 
  type: 'cmr' | 'billing'; 
  colorTheme: string;
}

const CompactActionButton = ({ state, type, colorTheme }: CompactActionProps) => {
  let label = '';
  let icon = null;

  const colorStyles: Record<string, string> = {
    amber: "bg-white text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300",
    blue: "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300",
    emerald: "bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300",
    gray: "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
  };

  const currentStyle = colorStyles[colorTheme] || colorStyles.gray;
  const baseStyle = `flex items-center gap-2 text-[10px] font-bold font-mono uppercase tracking-wide transition-all cursor-pointer group px-3 py-1.5 rounded-lg border shadow-sm ${currentStyle} active:scale-95`;

  if (type === 'cmr') {
    switch(state) {
      case 'PENDING': label = 'Upload CMR'; icon = <Upload size={12} />; break;
      case 'UPLOADED': label = 'Send Email'; icon = <Mail size={12} />; break;
      case 'SENT': label = 'CMR'; icon = <Download size={12} />; break;
      default: return null;
    }
  } else {
    switch(state) {
      case 'PENDING': label = 'Виставити'; icon = <FilePlus size={12} />; break;
      case 'ISSUED': label = 'Вислати'; icon = <Send size={12} />; break;
      case 'WAITING_PAYMENT': label = 'Mark Paid'; icon = <DollarSign size={12} />; break;
      default: return null;
    }
  }

  return (
    <button className={baseStyle}>
      <span className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

// Tab Button
const SystemTab = ({ label, active, onClick, icon, themeKey }: any) => {
    const theme = TAB_THEMES[themeKey === 'SYSTEM' ? 'ALL' : themeKey];
    
    return (
        <button 
            onClick={onClick}
            className={`
                relative flex-1 py-1.5 flex items-center justify-center gap-2 rounded-md transition-all duration-200 group
                text-[10px] font-mono font-bold uppercase tracking-wider select-none
                ${active 
                    ? `bg-white shadow-sm ring-1 ring-black/5 ${theme.accent}` 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}
            `}
        >
            <div className={`transition-transform duration-200 ${active ? 'scale-100' : 'scale-90 opacity-70'}`}>
                {React.cloneElement(icon, { 
                    size: 14, 
                    strokeWidth: active ? 2.5 : 2
                })}
            </div>
            <span>{label}</span>
        </button>
    );
};

// --- FLOATING CONSOLE ---
const FloatingInputConsole = ({ activeTab, trip }: { activeTab: Tab, trip: Trip }) => {
    const theme = TAB_THEMES[activeTab === 'SYSTEM' ? 'ALL' : activeTab];

    // --- Logic for Buttons inside Console ---
    const cmrState = trip.cmr.status === PipelineStatus.COMPLETED ? 'RECEIVED' : 
                   trip.cmr.currentStep === 'Sent_to_Client' ? 'SENT' : 
                   trip.cmr.status === PipelineStatus.PENDING ? 'PENDING' : 'UPLOADED';

    const billingState = trip.billing.status === PipelineStatus.COMPLETED ? 'PAID' :
                       trip.billing.invoiceStatus === 'ISSUED' ? 'ISSUED' :
                       trip.billing.invoiceStatus === 'WAITING_PAYMENT' ? 'WAITING_PAYMENT' : 'PENDING';

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
    // ----------------------------------------

    const InputFieldWrapper = ({ children, label, widthClass = "col-span-12" }: any) => (
        <div className={`${widthClass} ${theme.inputBg} rounded-lg px-3 py-1.5 flex items-center gap-2 border border-transparent transition-all ${theme.ring} focus-within:bg-white focus-within:ring-1 focus-within:shadow-sm shadow-sm border-gray-100`}>
             {label && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide shrink-0">{label}</span>}
             {children}
        </div>
    );

    const renderEmailFields = () => (
        <div className="grid grid-cols-12 gap-2 mb-3 animate-in slide-in-from-bottom-1 fade-in duration-300 px-1">
            <InputFieldWrapper widthClass="col-span-5" label="To:">
                <input className="bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 w-full font-mono font-bold" defaultValue={trip.clientName} />
            </InputFieldWrapper>
            <InputFieldWrapper widthClass="col-span-3" label="CC:">
                <input className="bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 w-full font-mono" placeholder="logistics@" />
            </InputFieldWrapper>
            <InputFieldWrapper widthClass="col-span-4" label="Subj:">
                <input className="bg-transparent border-none outline-none text-sm font-bold text-gray-800 placeholder-gray-400 w-full font-mono" placeholder="..." />
            </InputFieldWrapper>
        </div>
    );

    const renderTaskFields = () => (
        <div className="flex gap-2 mb-3 animate-in slide-in-from-bottom-1 fade-in duration-300 px-1">
             <InputFieldWrapper widthClass="w-auto">
                <Calendar size={12} className={theme.iconColor} />
                <input type="date" className="bg-transparent border-none outline-none text-sm text-gray-700 font-mono w-24" />
             </InputFieldWrapper>
             <InputFieldWrapper widthClass="flex-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Assign:</span>
                <input className="bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 w-full font-mono" defaultValue="Me" />
             </InputFieldWrapper>
        </div>
    );

    return (
        <div className={`
            w-full rounded-2xl
            transition-all duration-300 ease-in-out
            border
            ${theme.containerBg}
            ${theme.glow}
            flex flex-col overflow-hidden relative backdrop-blur-xl
        `}>
            <div className="px-4 pt-4 flex flex-col">
                {activeTab === 'EMAIL' && renderEmailFields()}
                {activeTab === 'TASK' && renderTaskFields()}
                
                <textarea 
                    className={`
                        w-full bg-transparent border-none outline-none 
                        text-base ${theme.text} placeholder-gray-400 
                        resize-none min-h-[50px] max-h-[200px] 
                        font-mono leading-relaxed custom-scrollbar px-1 py-1
                    `}
                    placeholder={theme.placeholder}
                    rows={1}
                    autoFocus
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                    }}
                />
            </div>

            <div className="flex items-center justify-between px-3 pb-3 mt-2">
                {/* Left: Attachment */}
                <button className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0">
                    <Paperclip size={16} />
                </button>

                {/* Center: Contextual Actions */}
                <div className="flex items-center gap-2">
                     {cmrState !== 'RECEIVED' && (
                        <CompactActionButton 
                            state={cmrState} 
                            type="cmr" 
                            colorTheme={getCmrButtonTheme()} 
                        />
                    )}
                    {billingState !== 'PAID' && (
                        <CompactActionButton 
                            state={billingState} 
                            type="billing" 
                            colorTheme={getBillingButtonTheme()} 
                        />
                    )}
                </div>

                {/* Right: Send Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    <button className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                        <Sparkles size={16} />
                    </button>
                    <button className={`
                        h-8 px-4 flex items-center justify-center rounded-lg 
                        bg-white shadow-sm border border-gray-200
                        ${theme.accent} hover:brightness-95
                        text-[10px] font-bold uppercase tracking-wider
                        transition-all ml-1 group
                    `}>
                         <span className="mr-2">Send</span>
                         <ArrowUp size={14} strokeWidth={3} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---

const TripDetailView: React.FC<TripDetailViewProps> = ({ trip, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('ALL');
  const [stream] = useState<ActivityItem[]>(MOCK_ACTIVITY_STREAM);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false); 
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, []);

  const ratePerKm = (trip.billing.amount / trip.task.distance).toFixed(2);
  const filteredStream = stream.filter(item => activeTab === 'ALL' || item.type === activeTab);
  const displayStream = [...filteredStream].reverse();

  // --- Logic replicated from TripCard for visual consistency ---
  
  // States derived from trip props for detail view
  const cmrState = trip.cmr.status === PipelineStatus.COMPLETED ? 'RECEIVED' : 
                   trip.cmr.currentStep === 'Sent_to_Client' ? 'SENT' : 
                   trip.cmr.status === PipelineStatus.PENDING ? 'PENDING' : 'UPLOADED';

  const billingState = trip.billing.status === PipelineStatus.COMPLETED ? 'PAID' :
                       trip.billing.invoiceStatus === 'ISSUED' ? 'ISSUED' :
                       trip.billing.invoiceStatus === 'WAITING_PAYMENT' ? 'WAITING_PAYMENT' : 'PENDING';

  const getHeaderStyles = () => {
    if (billingState === 'WAITING_PAYMENT') return 'bg-blue-50/40 border-blue-100';
    if (billingState === 'PAID' || trip.status === TripStatus.COMPLETED) return 'bg-emerald-50/40 border-emerald-100';
    return 'bg-white border-gray-100';
  };

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

  const renderStatusIcon = () => {
    switch (trip.status) {
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

  return (
    <div className="flex flex-col h-full bg-[#F3F4F6] font-sans relative overflow-hidden">
        
        {/* HEADER AREA */}
        <div className="shrink-0 z-30 bg-[#F3F4F6] relative transition-all duration-300">
            {/* Top Bar */}
            <div className="px-4 py-3 flex items-center justify-between">
                <button 
                    onClick={onBack} 
                    className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm transition-all hover:border-gray-300 active:scale-95"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-[10px] font-bold font-mono uppercase tracking-wide">BACK</span>
                </button>
                
                <button 
                    onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
                    className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200
                        ${isHeaderExpanded 
                            ? 'bg-gray-100 text-gray-800 border-gray-300' 
                            : 'bg-white text-gray-500 border-gray-200 hover:border-blue-200 hover:text-blue-600'}
                    `}
                >
                    <span className="text-[10px] font-bold font-mono uppercase tracking-wide">Card Details</span>
                    <div className={`transition-transform duration-300 ${isHeaderExpanded ? 'rotate-180' : 'rotate-0'}`}>
                        <ChevronDown size={14}/>
                    </div>
                </button>
            </div>

            {/* Trip Info Card (Matches TripCard Style EXACTLY) */}
            <div className="px-4 pb-0">
                <div className="bg-white border border-gray-100 rounded-t-2xl shadow-sm shadow-gray-200/50 overflow-hidden relative">
                    
                    {/* --- Card Header (Matches TripCard Header) --- */}
                    <div className={`px-5 py-4 border-b transition-colors duration-500 ${getHeaderStyles()}`}>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="text-base font-bold text-gray-800 font-mono tracking-tight leading-none mb-1">
                                    {trip.clientName}
                                </h3>
                                <div className="text-[10px] text-gray-400 font-mono flex items-center gap-2">
                                        <span>International Transport</span>
                                </div>
                            </div>
                            {renderStatusIcon()}
                        </div>
                        
                        {/* Stats Row */}
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

                    {/* --- Card Body (Matches TripCard Body) - Collapsible --- */}
                    <div className={`
                        transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] 
                        ${isHeaderExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}
                        grid bg-white
                    `}>
                        <div className="overflow-hidden min-h-0">
                             <div className="px-5 py-4 space-y-5">
                                
                                {/* SECTION 1: ROUTE */}
                                <div className="relative">
                                    <div className={getSectionHeaderStyle(true)}>
                                        <span className="bg-gray-100 text-gray-500 px-1.5 rounded text-[9px]">{trip.id}</span>
                                        <span>ROUTE</span>
                                    </div>
                                    <div className="pl-1">
                                        <TreeItem isLast={true}>
                                            <div className="flex items-center py-0.5">
                                                <div className="flex items-center gap-2 bg-gray-50/50 px-2 py-1.5 rounded border border-gray-100 w-full">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-bold text-gray-700 text-[11px]">{trip.task.pickup.city}</span>
                                                        <span className="text-[10px] text-gray-400 font-mono">{trip.task.pickup.date}</span>
                                                    </div>
                                                    <div className="text-gray-300 text-[10px]">➝</div>
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
                                    <div className={getSectionHeaderStyle(true)}>
                                        <span>CMR DOCUMENTATION</span>
                                    </div>
                                    <div className="pl-1">
                                        {trip.cmr.history.map((node, i) => {
                                            const isLastItem = i === trip.cmr.history.length - 1;
                                            return (
                                                <TreeItem key={node.id} isLast={cmrState === 'RECEIVED' && isLastItem}>
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
                                        {cmrState !== 'RECEIVED' && (
                                            <TreeItem isLast={true}>
                                                <CompactActionButton 
                                                    state={cmrState} 
                                                    type="cmr" 
                                                    colorTheme={getCmrButtonTheme()} 
                                                />
                                            </TreeItem>
                                        )}
                                    </div>
                                </div>

                                {/* SECTION 3: FINANCIALS */}
                                <div className="relative">
                                    <div className={getSectionHeaderStyle(true)}>
                                        <span>FINANCIALS</span>
                                    </div>
                                    <div className="pl-1">
                                        {/* Static billing history simulation since props don't carry full history in type yet */}
                                        <TreeItem isLast={billingState !== 'PAID'}>
                                            <div className="flex items-center gap-2 py-0.5">
                                                <span className={`text-[11px] font-medium font-mono ${billingState === 'PENDING' ? 'text-gray-400' : 'text-emerald-600'}`}>
                                                    Billing Pipeline
                                                </span>
                                            </div>
                                        </TreeItem>

                                        {billingState !== 'PAID' && (
                                            <TreeItem isLast={true}>
                                                <CompactActionButton 
                                                    state={billingState} 
                                                    type="billing" 
                                                    colorTheme={getBillingButtonTheme()} 
                                                />
                                            </TreeItem>
                                        )}
                                    </div>
                                </div>

                             </div>
                        </div>
                    </div>
                </div>
            </div>

             {/* Tab Bar */}
             <div className="px-4 bg-[#F3F4F6] relative z-20">
                <div className="p-1 border-x border-b border-gray-200 rounded-b-xl flex gap-1 bg-gray-100 shadow-inner">
                    <SystemTab label="CONSOLE" active={activeTab === 'ALL'} onClick={() => setActiveTab('ALL')} icon={<Terminal />} themeKey="ALL" />
                    <SystemTab label="MAIL" active={activeTab === 'EMAIL'} onClick={() => setActiveTab('EMAIL')} icon={<Mail />} themeKey="EMAIL" />
                    <SystemTab label="TASKS" active={activeTab === 'TASK'} onClick={() => setActiveTab('TASK')} icon={<CheckSquare />} themeKey="TASK" />
                    <SystemTab label="NOTES" active={activeTab === 'NOTE'} onClick={() => setActiveTab('NOTE')} icon={<StickyNote />} themeKey="NOTE" />
                </div>
            </div>
        </div>

        {/* SCROLLABLE TIMELINE */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar relative z-0 flex flex-col">
            <div className="flex-1 min-h-[20px]"></div>
            <div className="max-w-4xl mx-auto w-full pb-64 px-4 space-y-0 pt-6">
                
                {/* Timeline Start Marker */}
                <div className="flex gap-4 mb-4 opacity-40">
                     <div className="w-12 flex justify-center"><div className="w-px h-full bg-gray-300"></div></div>
                     <div className="flex items-center gap-3">
                        <div className="h-px bg-gray-300 w-8"></div>
                        <span className="text-[9px] font-mono uppercase text-gray-500 tracking-widest">Inception</span>
                     </div>
                </div>

                {displayStream.map((item, idx) => (
                    <TimelineNode key={item.id} item={item} isLast={idx === displayStream.length - 1} />
                ))}
            </div>
        </div>

        {/* FLOATING INPUT CONSOLE */}
        <div className="absolute bottom-6 left-4 right-4 z-40 max-w-4xl mx-auto">
            <FloatingInputConsole activeTab={activeTab} trip={trip} />
        </div>

        {/* FADE OVERLAY */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F3F4F6] via-[#F3F4F6]/90 to-transparent pointer-events-none z-10" />
    </div>
  );
};

// --- TIMELINE COMPONENTS (Unified Look) ---

const TimelineNode: React.FC<{ item: ActivityItem, isLast: boolean }> = ({ item, isLast }) => {
    
    // Config based on type
    const config = {
        EMAIL: { icon: <Mail size={12} />, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', cardHover: 'hover:border-blue-200' },
        TASK: { icon: <CheckSquare size={12} />, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', cardHover: 'hover:border-emerald-200' },
        NOTE: { icon: <StickyNote size={12} />, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', cardHover: 'hover:border-amber-200' },
        DOCUMENT: { icon: <FileText size={12} />, bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', cardHover: 'hover:border-gray-300' },
        SYSTEM: { icon: <Terminal size={12} />, bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200', cardHover: 'hover:border-gray-300' }
    }[item.type] || { icon: <Terminal size={12} />, bg: 'bg-gray-50', text: 'text-gray-400', border: 'border-gray-200', cardHover: '' };

    return (
        <div className="flex gap-4 group">
            {/* Left Track */}
            <div className="flex flex-col items-center w-12 shrink-0 relative">
                {/* Continuous Line */}
                <div className={`w-px bg-gray-200 h-full absolute top-0 ${isLast ? 'h-4' : ''}`}></div>
                
                {/* Time Stamp */}
                <div className="text-[9px] font-mono text-gray-400 bg-[#F3F4F6] px-1 z-10 mb-1">
                    {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>

                {/* Node Icon */}
                <div className={`
                    w-6 h-6 rounded-lg z-10 flex items-center justify-center border shadow-sm
                    ${config.bg} ${config.text} ${config.border}
                `}>
                    {config.icon}
                </div>
            </div>

            {/* Right Content (Card) */}
            <div className={`flex-1 pb-6 animate-in slide-in-from-bottom-2 duration-500`}>
                <div className={`
                    bg-white rounded-xl border border-gray-100 shadow-sm p-3 
                    transition-all duration-200 ${config.cardHover}
                `}>
                    <div className="flex justify-between items-start mb-1">
                         <span className="text-xs font-bold text-gray-800">{item.title}</span>
                         {item.type === 'EMAIL' && item.meta?.attachments && (
                            <div className="flex items-center gap-1 text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                <Paperclip size={9} />
                                <span>{item.meta.attachments.length}</span>
                            </div>
                         )}
                         {item.type === 'TASK' && (
                            item.isCompleted 
                            ? <Check size={12} className="text-emerald-500" />
                            : <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                         )}
                    </div>
                    
                    {item.content && (
                        <div className={`
                            text-xs text-gray-600 font-mono leading-relaxed mt-1.5
                            ${item.type === 'SYSTEM' ? 'text-[10px] text-gray-400' : ''}
                        `}>
                            {item.content}
                        </div>
                    )}

                    {item.type === 'DOCUMENT' && (
                        <div className="mt-2 flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-100">
                            <FileText size={12} className="text-red-400" />
                            <span className="text-[10px] font-bold text-gray-700">{item.meta?.file}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TripDetailView;