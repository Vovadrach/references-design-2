import React from 'react';
import { 
    X, Truck, LayoutDashboard, CheckSquare, FileText, 
    Users, Settings, LogOut, Wallet, Search, 
    PieChart, ChevronRight
} from 'lucide-react';
import { ViewState } from '../App';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewState;
  onChangeView: (view: 'TRIPS' | 'TASKS') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, onChangeView }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/10 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 
        Sidebar Container 
        Corrected className string without comments to prevent layout breakage.
        On Desktop: Static positioning within flex container, floating card appearance via margins.
        On Mobile: Fixed positioning, slide-in animation.
      */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col font-sans bg-white
        transform transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        
        border-r border-gray-100 shadow-2xl rounded-r-2xl 
        
        md:static md:translate-x-0 
        md:shadow-sm md:shadow-gray-200/50
        md:m-4 md:mb-4 md:h-[calc(100vh-2rem)] 
        md:rounded-2xl md:border md:border-gray-100 
      `}>
        
        {/* --- Header --- */}
        <div className="h-18 px-5 py-5 shrink-0 border-b border-gray-100 bg-white rounded-t-2xl">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Logo */}
                <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center text-white shadow-sm shadow-gray-900/20 border border-gray-800">
                    <Truck size={18} strokeWidth={2.5} />
                </div>
                
                <div className="flex flex-col justify-center">
                    {/* Brand */}
                    <span className="font-bold text-gray-900 font-mono tracking-tight leading-none mb-1 text-base">
                        nexmile
                    </span>
                    {/* Status */}
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.4)]"></span>
                        <span>SYSTEM ONLINE</span>
                    </div>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="md:hidden p-2 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors"
              >
                <X size={18} />
              </button>
          </div>
        </div>

        {/* --- Search --- */}
        <div className="px-5 py-4">
            <div className="group relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Search size={14} />
                </div>
                <input 
                    type="text" 
                    placeholder="Quick Jump..." 
                    className="
                        w-full bg-gray-50/50 border border-gray-100 text-gray-800 text-[11px] font-mono font-bold
                        rounded-lg pl-9 pr-3 py-2.5 outline-none 
                        focus:bg-white focus:border-blue-200 focus:shadow-sm
                        transition-all placeholder-gray-400
                    "
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                     <span className="text-[9px] font-bold text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 bg-white shadow-sm">⌘K</span>
                </div>
            </div>
        </div>

        {/* --- Navigation --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-6 pb-6">
            
            <div className="space-y-1">
                <SectionLabel label="WORKSPACE" />
                <NavItem 
                    label="Operations" 
                    icon={<LayoutDashboard />} 
                    isActive={currentView === 'TRIPS'} 
                    onClick={() => onChangeView('TRIPS')}
                    theme="blue"
                />
                <NavItem 
                    label="Tasks & Alerts" 
                    icon={<CheckSquare />} 
                    isActive={currentView === 'TASKS'} 
                    onClick={() => onChangeView('TASKS')}
                    badge={3}
                    theme="amber"
                />
                <NavItem 
                    label="Analytics" 
                    icon={<PieChart />} 
                    isActive={false} 
                    onClick={() => {}}
                    theme="gray"
                />
            </div>

            <div className="space-y-1">
                <SectionLabel label="FINANCIALS" />
                <NavItem 
                    label="Invoices" 
                    icon={<FileText />} 
                    isActive={false} 
                    onClick={() => {}}
                    theme="emerald"
                />
                 <NavItem 
                    label="Cash Flow" 
                    icon={<Wallet />} 
                    isActive={false} 
                    onClick={() => {}}
                    theme="emerald"
                />
            </div>

            <div className="space-y-1">
                <SectionLabel label="COMPANY" />
                <NavItem 
                    label="Drivers" 
                    icon={<Users />} 
                    isActive={false} 
                    onClick={() => {}}
                    theme="gray"
                    isLocked
                />
                 <NavItem 
                    label="Settings" 
                    icon={<Settings />} 
                    isActive={false} 
                    onClick={() => {}}
                    theme="gray"
                />
            </div>

        </div>

        {/* --- Footer --- */}
        <div className="p-4 mt-auto border-t border-gray-100 bg-white rounded-b-2xl">
            <div className="
                flex items-center gap-3 p-2.5 rounded-xl 
                bg-white border border-gray-200 shadow-sm 
                hover:border-blue-200 hover:shadow-md hover:shadow-blue-900/5 
                transition-all cursor-pointer group
            ">
                <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 text-xs font-bold border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        JS
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors font-mono tracking-tight">John Smith</div>
                    <div className="text-[10px] text-gray-400 truncate font-mono">Senior Logistician</div>
                </div>
                <button className="text-gray-300 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors">
                    <LogOut size={15} />
                </button>
            </div>
        </div>

      </aside>
    </>
  );
};

// --- Helper Components ---

const SectionLabel = ({ label }: { label: string }) => (
    <div className="px-3 py-2 flex items-center gap-2 select-none opacity-80">
        <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-gray-400">{label}</span>
        <div className="h-px bg-gray-100 flex-1"></div>
    </div>
);

interface NavItemProps {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    badge?: number;
    theme: 'blue' | 'emerald' | 'amber' | 'purple' | 'gray';
    isLocked?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, isActive, onClick, badge, theme, isLocked }) => {
    
    const themes = {
        blue: { activeClass: 'bg-blue-50 border-blue-100 text-blue-700 shadow-sm', iconClass: 'text-blue-600' },
        emerald: { activeClass: 'bg-emerald-50 border-emerald-100 text-emerald-700 shadow-sm', iconClass: 'text-emerald-600' },
        amber: { activeClass: 'bg-amber-50 border-amber-100 text-amber-700 shadow-sm', iconClass: 'text-amber-600' },
        purple: { activeClass: 'bg-purple-50 border-purple-100 text-purple-700 shadow-sm', iconClass: 'text-purple-600' },
        gray: { activeClass: 'bg-gray-100 border-gray-200 text-gray-900 shadow-sm', iconClass: 'text-gray-900' }
    };

    const t = themes[theme];

    return (
        <button 
            onClick={onClick}
            disabled={isLocked}
            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 group relative select-none
                ${isActive 
                    ? `${t.activeClass}` 
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-100'}
                ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <div className={`
                flex items-center justify-center transition-colors
                ${isActive ? t.iconClass : 'text-gray-400 group-hover:text-gray-600'}
            `}>
                {React.cloneElement(icon as React.ReactElement, { size: 18, strokeWidth: isActive ? 2.5 : 2 })}
            </div>
            
            <div className="flex-1 text-left flex flex-col justify-center">
                <div className="flex items-center gap-2">
                    <span className={`text-[13px] font-mono tracking-tight leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                        {label}
                    </span>
                    {isLocked && (
                        <span className="text-[8px] font-bold font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-400 border border-gray-200">SOON</span>
                    )}
                </div>
            </div>
            
            {badge ? (
                <span className={`
                    flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-md 
                    text-[10px] font-bold font-mono leading-none shadow-sm
                    ${isActive 
                        ? 'bg-white text-gray-800 border border-gray-100' 
                        : 'bg-gray-100 text-gray-500 border border-gray-200 group-hover:bg-white'}
                `}>
                    {badge}
                </span>
            ) : null}
            
            {isActive && (
                <ChevronRight size={14} className="text-blue-300 opacity-50" />
            )}
        </button>
    );
};

export default Sidebar;