import React from 'react';
import { ClientConversation, UnassignedGroup } from '../../types';
import { AlertCircle, Search, ChevronLeft } from 'lucide-react';

interface DialogListProps {
  conversations: ClientConversation[];
  unassigned: UnassignedGroup[];
  onSelectClient: (id: string) => void;
  onOpenQueue: () => void;
  onBack?: () => void;
}

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'long' });
  } else {
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  }
};

const DialogList: React.FC<DialogListProps> = ({ conversations, unassigned, onSelectClient, onOpenQueue, onBack }) => {
  const unassignedCount = unassigned.length;
  const unassignedEmails = unassigned.slice(0, 3).map(u => u.email).join(', ');

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header - More Compact */}
      <div className="px-4 py-2 border-b border-gray-100 flex items-center bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex-1 flex items-center">
          <button 
            onClick={onBack}
            className="p-1.5 -ml-1.5 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
        <h2 className="text-base font-bold text-gray-900 font-mono tracking-tight text-center flex-1">Gmail</h2>
        <div className="flex-1 flex items-center justify-end">
          <button className="p-1.5 hover:bg-gray-50 rounded-lg text-gray-400 transition-colors">
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#F3F4F6]">
        {/* Queue Block (Unassigned) - More Compact */}
        {unassignedCount > 0 && (
          <button 
            onClick={onOpenQueue}
            className="w-full flex items-start gap-3 p-3 border-b border-gray-100 hover:bg-white transition-all group bg-white"
          >
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600 shadow-sm shrink-0">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1 text-left min-w-0 pt-0.5">
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-bold text-gray-900 font-mono text-xs uppercase tracking-wider">Unassigned</span>
                <span className="text-[9px] font-bold text-gray-400 font-mono">
                  {unassigned[0] ? formatRelativeTime(unassigned[0].lastDate) : ''}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono line-clamp-2 leading-relaxed">
                {unassignedEmails}{unassignedCount > 3 ? '...' : ''}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 pt-0.5">
              <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                {unassignedCount}
              </span>
            </div>
          </button>
        )}

        {/* Conversations List - More Compact */}
        <div className="divide-y divide-gray-200/50">
          {conversations.sort((a, b) => {
            const dateA = a.lastMessage ? new Date(a.lastMessage.date).getTime() : 0;
            const dateB = b.lastMessage ? new Date(b.lastMessage.date).getTime() : 0;
            return dateB - dateA;
          }).map((conv) => (
            <button
              key={conv.clientId}
              onClick={() => onSelectClient(conv.clientId)}
              className={`
                w-full flex items-start gap-3 p-3 transition-all group relative
                ${conv.unreadCount > 0 ? 'bg-white' : 'bg-transparent hover:bg-gray-200/50'}
              `}
            >
              {/* Avatar - More Compact */}
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition-transform shrink-0">
                {conv.clientName.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <span className={`font-bold font-mono text-xs truncate pr-2 ${conv.unreadCount > 0 ? 'text-gray-900' : 'text-gray-600'}`}>
                    {conv.clientName}
                  </span>
                  <span className="text-[9px] font-mono text-gray-400 whitespace-nowrap pt-0.5">
                    {conv.lastMessage ? formatRelativeTime(conv.lastMessage.date) : ''}
                  </span>
                </div>
                <p className={`text-[10px] font-mono line-clamp-2 leading-relaxed ${conv.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>
                  {conv.lastMessage ? conv.lastMessage.body : 'No messages'}
                </p>
              </div>

              {/* Unread Badge */}
              {conv.unreadCount > 0 && (
                <div className="flex flex-col items-end pt-0.5">
                  <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                    {conv.unreadCount}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DialogList;
