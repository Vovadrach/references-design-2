import React from 'react';
import { EmailThread } from '../../types';
import { Mail, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface ThreadListProps {
  threads: EmailThread[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ThreadList: React.FC<ThreadListProps> = ({ threads, selectedId, onSelect }) => {
  return (
    <div className="divide-y divide-gray-50">
      {threads.map((thread) => {
        const isSelected = thread.id === selectedId;
        const lastMessage = thread.messages[thread.messages.length - 1];
        const date = new Date(thread.lastMessageDate);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
          <button
            key={thread.id}
            onClick={() => onSelect(thread.id)}
            className={`
              w-full text-left p-4 transition-all relative group
              ${isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50'}
            `}
          >
            {isSelected && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
            )}
            
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`
                  shrink-0 w-2 h-2 rounded-full
                  ${thread.status === 'LINKED' ? 'bg-emerald-500' : 
                    thread.status === 'AMBIGUOUS' ? 'bg-amber-500' : 
                    'bg-gray-300'}
                `} />
                <span className={`text-[11px] font-bold font-mono truncate ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                  {lastMessage.from.name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-gray-400 shrink-0">{timeStr}</span>
            </div>

            <h4 className={`text-xs font-bold mb-1 truncate ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
              {thread.subject}
            </h4>
            
            <p className="text-[11px] text-gray-400 font-mono line-clamp-2 leading-relaxed">
              {thread.preview}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex -space-x-1">
                {/* Visual avatars placeholder */}
                <div className="w-4 h-4 rounded-full bg-gray-200 border border-white" />
                <div className="w-4 h-4 rounded-full bg-gray-300 border border-white" />
              </div>
              <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tighter">
                {thread.messages.length} messages
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ThreadList;
