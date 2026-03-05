import React, { useRef, useEffect } from 'react';
import { ClientConversation, ChatMessage } from '../../types';
import { ChevronLeft, MoreVertical, Paperclip } from 'lucide-react';
import MessageComposer from './MessageComposer';

interface ThreadViewProps {
  conversation: ClientConversation;
  threadId: string;
  onBack: () => void;
}

const ThreadView: React.FC<ThreadViewProps> = ({ conversation, threadId, onBack }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const threadMessages = conversation.messages.filter(m => m.threadId === threadId);
  const subject = threadMessages[0]?.subject || 'No Subject';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [threadMessages]);

  return (
    <div className="flex flex-col w-full h-full bg-[#F3F4F6]">
      {/* Sticky Header - Compact */}
      <div className="px-4 py-2 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <button 
            onClick={onBack}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="min-w-0">
            <h3 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-0.5">
              {conversation.clientName}
            </h3>
            <h4 className="text-xs font-bold text-gray-900 truncate font-mono tracking-tight">
              {subject}
            </h4>
          </div>
        </div>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
      >
        {threadMessages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.isIncoming ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`
              max-w-[85%] p-2.5 rounded-xl border shadow-sm relative
              ${msg.isIncoming 
                ? 'bg-white border-gray-100 rounded-tl-none' 
                : 'bg-gray-900 border-gray-800 text-white rounded-tr-none'}
            `}>
              {/* Body only - no subject header here */}
              <div className="text-xs font-mono whitespace-pre-wrap leading-relaxed">
                {msg.body}
              </div>

              {/* Attachments */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-2 pt-2 border-t border-current/5 flex flex-wrap gap-1.5">
                  {msg.attachments.map((file, i) => (
                    <div key={i} className={`
                      flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold font-mono
                      ${msg.isIncoming ? 'bg-gray-50 text-gray-500' : 'bg-white/10 text-white/80'}
                    `}>
                      <Paperclip size={9} />
                      <span className="truncate max-w-[100px]">{file}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Time */}
              <div className={`
                mt-1.5 text-[8px] font-mono font-bold
                ${msg.isIncoming ? 'text-gray-300' : 'text-gray-500'}
              `}>
                {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Composer - Locked to this thread */}
      <div className="p-3 bg-white border-t border-gray-100">
        <MessageComposer 
          clientId={conversation.clientId} 
          fixedSubject={subject}
          fixedThreadId={threadId}
        />
      </div>
    </div>
  );
};

export default ThreadView;
