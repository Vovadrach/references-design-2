import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, ChevronUp, ChevronDown
} from 'lucide-react';
import { Trip } from '../types';

interface FooterStatsProps {
  trips: Trip[];
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const FooterStats: React.FC<FooterStatsProps> = ({ trips }) => {
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsMonthPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Calculations ---
  const stats = React.useMemo(() => {
    let totalRevenue = 0;
    let totalDistance = 0;

    trips.forEach(trip => {
      // In a real app, filter by the selected month here
      totalRevenue += trip.billing.amount;
      totalDistance += trip.task.distance;
    });

    const avgRate = totalDistance > 0 ? (totalRevenue / totalDistance) : 0;

    return {
      revenue: totalRevenue,
      distance: totalDistance,
      rate: avgRate
    };
  }, [trips, selectedMonth, selectedYear]);

  return (
    <div className="h-10 bg-white border-t border-gray-200 px-4 flex items-center justify-between shrink-0 z-40 relative select-none shadow-[0_-1px_2px_rgba(0,0,0,0.02)]">
      
      {/* --- LEFT: Minimalist Month Selector --- */}
      <div className="relative" ref={pickerRef}>
        <button 
          onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
          className={`
            flex items-center gap-2 px-2 py-1 rounded transition-colors duration-200
            text-[10px] font-bold font-mono uppercase tracking-widest text-gray-500
            hover:bg-gray-50 hover:text-gray-900
          `}
        >
          <Calendar size={12} className="text-gray-400 mb-0.5" />
          <span>{MONTHS[selectedMonth]} {selectedYear}</span>
          <div className={`transition-transform duration-200 ${isMonthPickerOpen ? 'rotate-180' : ''}`}>
             <ChevronUp size={10} className="text-gray-400" />
          </div>
        </button>

        {/* Picker Dropdown */}
        {isMonthPickerOpen && (
          <div className="
            absolute bottom-full left-0 mb-2 w-56 
            bg-white rounded-lg shadow-xl shadow-gray-200 border border-gray-100 
            overflow-hidden animate-in slide-in-from-bottom-1 fade-in duration-200
            p-2 z-50
          ">
            <div className="flex items-center justify-between mb-2 px-1">
                <button onClick={() => setSelectedYear(y => y - 1)} className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-gray-600">
                    <ChevronDown size={12} className="rotate-90" />
                </button>
                <span className="text-xs font-bold font-mono text-gray-800">{selectedYear}</span>
                <button onClick={() => setSelectedYear(y => y + 1)} className="p-1 hover:bg-gray-50 rounded text-gray-400 hover:text-gray-600">
                     <ChevronDown size={12} className="-rotate-90" />
                </button>
            </div>
            <div className="grid grid-cols-3 gap-0.5">
                {MONTHS.map((month, index) => (
                    <button
                        key={month}
                        onClick={() => {
                            setSelectedMonth(index);
                            setIsMonthPickerOpen(false);
                        }}
                        className={`
                            px-1 py-1.5 text-[9px] font-bold uppercase rounded transition-colors
                            ${selectedMonth === index 
                                ? 'bg-gray-900 text-white' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                        `}
                    >
                        {month.substring(0, 3)}
                    </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* --- RIGHT: Clean Data Points (No Icons, Reordered) --- */}
      <div className="flex items-center gap-6">
        
        {/* Metric 1: Revenue (Matched Table: font-bold text-[13px] text-gray-900) */}
        <div className="flex items-center gap-2 group cursor-default">
             <span className="font-mono font-bold text-[13px] text-gray-900">
                {stats.revenue.toLocaleString()} <span className="text-[9px] font-normal text-gray-400">EUR</span>
             </span>
        </div>

        <div className="w-px h-3 bg-gray-200"></div>

        {/* Metric 2: Distance (Matched Table: text-gray-500 text-[11px] font-medium font-mono) */}
        <div className="flex items-center gap-2 group cursor-default">
             <span className="font-mono text-gray-500 text-[11px] font-medium">
                {stats.distance.toLocaleString()} km
             </span>
        </div>

        <div className="w-px h-3 bg-gray-200"></div>

        {/* Metric 3: Avg Rate (Matched Table: Pill style) */}
        <div className="flex items-center gap-2 group cursor-default">
             <span className="font-mono text-[10px] text-gray-400 font-bold bg-white border border-gray-200 px-1.5 py-0.5 rounded whitespace-nowrap">
                {stats.rate.toFixed(2)} €
             </span>
        </div>

      </div>

    </div>
  );
};

export default FooterStats;