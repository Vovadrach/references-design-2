import React from 'react';
import { ClientConversation, Trip } from '../../types';
import { User, Phone, Mail, MapPin, ExternalLink, Package, Calendar } from 'lucide-react';
import { MOCK_TRIPS } from '../../constants';

interface ContextSidebarProps {
  conversation: ClientConversation;
}

const ContextSidebar: React.FC<ContextSidebarProps> = ({ conversation }) => {
  // Find trips related to this client
  const clientTrips = MOCK_TRIPS.filter(t => t.clientName === conversation.clientName);

  return (
    <div className="w-80 border-l border-gray-100 bg-white h-full overflow-y-auto custom-scrollbar hidden lg:flex flex-col">
      <div className="p-6 border-b border-gray-50">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-4">Client Profile</h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-gray-900/10">
            {conversation.clientName.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 font-mono leading-tight">{conversation.clientName}</h4>
            <span className="text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-widest">Active Account</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-500">
            <User size={14} />
            <span className="text-xs font-sans">Marco Rossi (CEO)</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <Phone size={14} />
            <span className="text-xs font-sans">+39 02 123 4567</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <Mail size={14} />
            <span className="text-xs font-sans">ops@rossi.it</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <MapPin size={14} />
            <span className="text-xs font-sans">Milan, Italy</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Active Trips</h3>
          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
            {clientTrips.length}
          </span>
        </div>

        <div className="space-y-3">
          {clientTrips.map(trip => (
            <div key={trip.id} className="p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold font-mono text-gray-900">{trip.task.id}</span>
                <ExternalLink size={10} className="text-gray-300 group-hover:text-blue-500" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold font-mono text-gray-400 uppercase">{trip.task.pickup.city}</span>
                </div>
                <div className="h-px flex-1 bg-gray-100"></div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold font-mono text-gray-400 uppercase">{trip.task.delivery.city}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[9px] text-gray-400 font-sans">
                  <Package size={10} />
                  <span>22 Pallets</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-gray-400 font-sans">
                  <Calendar size={10} />
                  <span>{trip.task.delivery.date}</span>
                </div>
              </div>
            </div>
          ))}
          {clientTrips.length === 0 && (
            <p className="text-[10px] text-gray-400 font-sans italic text-center py-4">No active trips found</p>
          )}
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-gray-50">
        <button className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-[10px] font-bold font-mono uppercase tracking-widest transition-all border border-gray-100">
          View CRM Profile
        </button>
      </div>
    </div>
  );
};

export default ContextSidebar;
