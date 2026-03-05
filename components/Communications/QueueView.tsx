import React from 'react';
import { UnassignedGroup } from '../../types';
import { ChevronLeft, UserPlus, Mail, MoreVertical, Clock, XCircle } from 'lucide-react';

interface QueueViewProps {
  unassigned: UnassignedGroup[];
  onBack: () => void;
}

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  }
};

const QueueView: React.FC<QueueViewProps> = ({ unassigned, onBack }) => {
  return (
    <div className="flex flex-col w-full h-full bg-white">
      {/* Header - Gmail Style */}
      <div className="px-4 py-2 border-b border-gray-100 flex items-center bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex-1 flex items-center">
          <button 
            onClick={onBack}
            className="p-1.5 -ml-1.5 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
        <h2 className="text-base font-bold text-gray-900 font-mono tracking-tight text-center flex-1 uppercase tracking-widest">Unassigned</h2>
        <div className="flex-1 flex items-center justify-end">
          <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#F3F4F6]">
        <div className="divide-y divide-gray-200/50">
          {unassigned.map((group) => {
            const lastMessage = group.messages[0];
            
            return (
              <div 
                key={group.email} 
                className="w-full flex items-start gap-3 p-3 bg-white hover:bg-gray-50 transition-all group relative"
              >
                {/* Icon/Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-base shadow-sm shrink-0">
                  <Mail size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 text-left min-w-0 pt-0.5">
                  <div className="flex justify-between items-start mb-0.5">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="font-bold font-mono text-xs text-gray-900 truncate">
                        {group.email}
                      </span>
                      <span className="text-[8px] font-bold font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 border border-gray-200 uppercase tracking-tighter shrink-0">
                        Unknown
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] font-mono text-gray-400 whitespace-nowrap">
                        {formatRelativeTime(group.lastDate)}
                      </span>
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-blue-500 shrink-0"></div>
                      <span className="text-[10px] font-bold text-gray-700 font-mono uppercase tracking-tight truncate">
                        {lastMessage.subject}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-gray-400 line-clamp-1 leading-relaxed">
                      {lastMessage.body}
                    </p>
                  </div>

                  {/* Action Buttons - Visible on Hover or Mobile */}
                  <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 text-white rounded-md text-[9px] font-bold font-mono uppercase tracking-wider hover:bg-blue-700 transition-all shadow-sm">
                      <UserPlus size={10} /> Assign
                    </button>
                    <button className="flex items-center gap-1.5 px-2.5 py-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md text-[9px] font-bold font-mono uppercase tracking-wider transition-all">
                      <XCircle size={10} /> Ignore
                    </button>
                    <div className="flex items-center gap-1 ml-auto text-[8px] font-mono text-gray-300">
                      <Clock size={8} />
                      <span>{group.messages.length} messages</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {unassigned.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                <Mail size={32} className="opacity-10" />
              </div>
              <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-gray-300">Queue is empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueView;
