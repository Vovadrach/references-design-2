import React, { useState } from 'react';
import { Menu, Bell, Search, LayoutGrid, ListFilter, Table as TableIcon, Plus, CheckCircle, Circle, List, Layers, GitBranch, AlertCircle, XCircle, Truck, Command, ChevronDown } from 'lucide-react';
import TripCard from './components/TripCard';
import TasksView from './components/TasksView';
import Sidebar from './components/Sidebar';
import TripDetailView from './components/TripDetailView';
import TripsTableView from './components/TripsTableView';
import FooterStats from './components/FooterStats';
import { MOCK_TRIPS } from './constants';
import { Trip, TripStatus } from './types';

export type ViewState = 'TRIPS' | 'TASKS' | 'DETAIL';
export type TripViewMode = 'LIST' | 'TABLE';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('TRIPS');
  const [tripViewMode, setTripViewMode] = useState<TripViewMode>('LIST');
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Completed'>('All');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setCurrentView('DETAIL');
  };

  const handleBackToTrips = () => {
    setSelectedTrip(null);
    setCurrentView('TRIPS');
  };

  const handleSidebarChange = (view: 'TRIPS' | 'TASKS') => {
    if (view !== 'TRIPS') {
        setSelectedTrip(null);
    }
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  const filteredTrips = MOCK_TRIPS.filter(trip => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return trip.status === 'IN_TRANSIT';
    if (activeTab === 'Completed') return trip.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] overflow-hidden font-sans selection:bg-blue-100">
      
      {/* MAIN LAYOUT: SIDEBAR + CONTENT */}
      <div className="flex-1 flex overflow-hidden">
          
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            currentView={currentView === 'DETAIL' ? 'TRIPS' : currentView}
            onChangeView={handleSidebarChange}
          />

          {/* CONTENT AREA */}
          <div className="flex-1 flex flex-col relative min-w-0 bg-[#F3F4F6]">
            
            {/* --- HEADER: Glassmorphism Console Style --- */}
            {currentView !== 'DETAIL' && (
                <header className="px-6 py-4 flex items-center justify-between shrink-0 z-10 bg-[#F3F4F6]/90 backdrop-blur-sm transition-all">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleSidebar}
                            className="p-2 -ml-2 hover:bg-white rounded-lg text-gray-500 transition-all md:hidden active:scale-95"
                        >
                            <Menu size={20} />
                        </button>
                        
                        {/* Breadcrumbs / Path */}
                        <div className="flex items-center gap-2 text-sm select-none">
                            <div className="flex items-center gap-1.5 text-gray-400 font-mono">
                                <span className="opacity-50">nexmile</span>
                                <span className="text-gray-300">/</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm shadow-gray-200/50">
                                <div className={`w-2 h-2 rounded-full ${currentView === 'TRIPS' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                <span className="font-bold text-gray-800 tracking-tight text-xs uppercase font-mono">
                                    {currentView === 'TRIPS' ? 'Workspace' : 'Issues'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Pill (Visual Only) */}
                        <div className="hidden md:flex items-center gap-2 text-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-mono shadow-sm">
                            <Search size={12} />
                            <span className="opacity-50">Search...</span>
                            <span className="ml-2 text-[10px] border border-gray-200 rounded px-1">⌘K</span>
                        </div>

                        <div className="w-px h-4 bg-gray-300 mx-1 hidden md:block"></div>

                        <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
                            <Bell size={18} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F3F4F6]"></span>
                        </button>
                    </div>
                </header>
            )}

            {/* Scrollable View Container */}
            <main className="flex-1 overflow-hidden relative flex flex-col">
                
                {currentView === 'DETAIL' && selectedTrip ? (
                    <TripDetailView trip={selectedTrip} onBack={handleBackToTrips} />
                ) : (
                    <div className="flex-1 overflow-hidden flex flex-col px-4 md:px-6 pb-0">
                        <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
                            
                            {/* VIEW: TRIPS */}
                            {currentView === 'TRIPS' && (
                            <>
                                {/* --- TOOLBAR: Floating Action Strip --- */}
                                <div className="mb-5 flex items-center justify-between shrink-0">
                                    
                                    {/* Left: Filter Group */}
                                    <div className="flex items-center gap-2">
                                        <FilterPill 
                                            label="All" 
                                            icon={<Layers size={12} />} 
                                            active={activeTab === 'All'} 
                                            onClick={() => setActiveTab('All')}
                                            theme="gray"
                                        />
                                        <FilterPill 
                                            label="Active" 
                                            icon={<Truck size={12} />} 
                                            active={activeTab === 'Active'} 
                                            onClick={() => setActiveTab('Active')}
                                            theme="blue"
                                            count={2}
                                        />
                                        <FilterPill 
                                            label="Done" 
                                            icon={<CheckCircle size={12} />} 
                                            active={activeTab === 'Completed'} 
                                            onClick={() => setActiveTab('Completed')}
                                            theme="emerald"
                                        />
                                    </div>

                                    {/* Right: View Switcher */}
                                    <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex items-center gap-1">
                                        <ViewToggle 
                                            mode="LIST" 
                                            current={tripViewMode} 
                                            onClick={() => setTripViewMode('LIST')} 
                                            icon={<LayoutGrid size={14} />} 
                                        />
                                        <div className="w-px h-3 bg-gray-100 mx-0.5"></div>
                                        <ViewToggle 
                                            mode="TABLE" 
                                            current={tripViewMode} 
                                            onClick={() => setTripViewMode('TABLE')} 
                                            icon={<TableIcon size={14} />} 
                                        />
                                    </div>

                                </div>

                                {/* Removed pb-4 from this container to let content touch footer */}
                                <div className="flex-1 overflow-hidden relative flex flex-col">
                                    {tripViewMode === 'LIST' ? (
                                        // Reduced pb-20 to pb-2 so last card is closer to footer
                                        <div className="overflow-y-auto h-full pb-2 custom-scrollbar pr-1 -mr-1 pl-1 -ml-1 pt-1">
                                            <div className="space-y-4">
                                                {filteredTrips.map((trip, index) => (
                                                    <TripCard 
                                                        key={trip.id} 
                                                        trip={trip} 
                                                        index={index + 1} 
                                                        onClick={() => handleTripClick(trip)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <TripsTableView 
                                            trips={filteredTrips} 
                                            onTripClick={handleTripClick} 
                                        />
                                    )}
                                </div>
                            </>
                            )}

                            {/* VIEW: TASKS */}
                            {currentView === 'TASKS' && (
                                <div className="mt-0 h-full pb-4">
                                    <TasksView trips={MOCK_TRIPS} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* --- Footer Stats (Fixed Bottom) --- */}
            {currentView === 'TRIPS' && (
                <FooterStats trips={filteredTrips} />
            )}

            {/* --- FAB: Floating Create Button (Only show in LIST mode) --- */}
            {/* Adjusted bottom position to account for footer */}
            {currentView === 'TRIPS' && tripViewMode === 'LIST' && (
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30 w-auto animate-in slide-in-from-bottom-4 fade-in duration-500">
                    <button
                        onClick={() => alert('Trigger Create Modal')}
                        className="
                            group flex items-center gap-3 pl-2 pr-5 py-2
                            bg-gray-900 hover:bg-black text-white 
                            rounded-full shadow-2xl shadow-blue-900/20 
                            border border-gray-700/50
                            transition-all duration-300 hover:scale-105 active:scale-95
                        "
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-700 group-hover:bg-gray-600 flex items-center justify-center transition-colors">
                            <Plus size={18} strokeWidth={2.5} className="text-white" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-[11px] font-bold font-mono uppercase tracking-wider leading-none">New Trip</span>
                        </div>
                    </button>
                </div>
            )}

          </div>
      </div>
    </div>
  );
}

// --- Sub-components for Toolbar ---

interface FilterPillProps {
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
    theme: 'blue' | 'emerald' | 'gray';
    count?: number;
}

const FilterPill: React.FC<FilterPillProps> = ({ label, icon, active, onClick, theme, count }) => {
    
    const themes = {
        blue: { active: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
        emerald: { active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
        gray: { active: 'bg-white text-gray-900 ring-1 ring-gray-200 shadow-sm' }
    };

    const activeClass = themes[theme].active;
    const inactiveClass = "text-gray-500 hover:bg-white hover:text-gray-700 hover:shadow-sm hover:ring-1 hover:ring-gray-200/50";

    return (
        <button 
            onClick={onClick}
            className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200
                text-[10px] font-bold font-mono uppercase tracking-wider
                ${active ? activeClass : inactiveClass}
            `}
        >
            {React.cloneElement(icon as React.ReactElement, { size: 12, strokeWidth: 2.5 })}
            <span>{label}</span>
            {count && (
                <span className={`
                    ml-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold leading-none
                    ${active ? 'bg-white/50 text-current' : 'bg-gray-200 text-gray-600'}
                `}>
                    {count}
                </span>
            )}
        </button>
    );
};

interface ViewToggleProps {
    mode: TripViewMode;
    current: TripViewMode;
    onClick: () => void;
    icon: React.ReactNode;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ mode, current, onClick, icon }) => {
    const isActive = mode === current;
    return (
        <button 
            onClick={onClick}
            className={`
                p-1.5 rounded-md transition-all duration-200
                ${isActive 
                    ? 'bg-gray-100 text-gray-900 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}
            `}
            title={`${mode} View`}
        >
            {icon}
        </button>
    );
};

export default App;