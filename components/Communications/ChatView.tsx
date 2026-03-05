import React, { useRef, useEffect, useState } from 'react';
import { ClientConversation, ChatMessage } from '../../types';
import { ChevronLeft, MoreVertical, Paperclip, Reply, Info, X } from 'lucide-react';
import MessageComposer from './MessageComposer';
import ContextSidebar from './ContextSidebar';

interface ChatViewProps {
  conversation: ClientConversation;
  onBack: () => void;
  onSelectThread: (threadId: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ conversation, onBack, onSelectThread }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation.messages]);

  // Count messages per thread
  const threadCounts = conversation.messages.reduce((acc, msg) => {
    acc[msg.threadId] = (acc[msg.threadId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group messages by date for the floating separator
  const groupedMessages: { [key: string]: ChatMessage[] } = {};
  conversation.messages.forEach(msg => {
    const date = new Date(msg.date).toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    if (!groupedMessages[date]) groupedMessages[date] = [];
    groupedMessages[date].push(msg);
  });

  return (
    <div className="flex flex-col w-full h-full bg-[#F3F4F6]">
      {/* Sticky Header - More Compact */}
      <div className="px-4 py-2 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <button 
            onClick={onBack}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
              {conversation.clientName.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-gray-900 truncate font-mono tracking-tight">
                {conversation.clientName}
              </h3>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[9px] text-emerald-500 font-mono font-bold uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-1.5 rounded-lg transition-colors ${showSidebar ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-400'}`}
          >
            <Info size={18} />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6 pb-40"
          >
            {Object.entries(groupedMessages).map(([date, messages]) => (
              <div key={date} className="space-y-4">
                {/* Floating Date Separator - More Minimal */}
                <div className="sticky top-2 z-10 flex justify-center mb-2">
                  <span className="bg-white/90 backdrop-blur-md border border-gray-100 px-3 py-1 rounded-full text-[9px] font-bold text-gray-400 font-mono shadow-sm uppercase tracking-widest">
                    {date}
                  </span>
                </div>

                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.isIncoming ? 'justify-start' : 'justify-end'} group`}
                  >
                    <div className={`flex flex-col ${msg.isIncoming ? 'items-start' : 'items-end'} max-w-[85%]`}>
                      <div className="flex items-center gap-2 mb-1 px-1">
                        {msg.isIncoming && (
                          <span className="text-[10px] font-bold text-gray-500 font-mono uppercase tracking-tighter">
                            {msg.from.email}
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-gray-300">
                          {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="relative flex items-center gap-2">
                        {/* Reply Action Trigger */}
                        {!msg.isIncoming && (
                          <button 
                            onClick={() => setReplyTo(msg)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-lg text-gray-400 transition-all"
                          >
                            <Reply size={12} />
                          </button>
                        )}

                        <button 
                          onClick={() => onSelectThread(msg.threadId)}
                          className="text-left transition-transform active:scale-[0.98] relative"
                        >
                          <div className={`
                            p-2.5 rounded-xl border shadow-sm relative
                            ${msg.isIncoming 
                              ? 'bg-white border-gray-100 rounded-tl-none' 
                              : 'bg-gray-900 border-gray-800 text-white rounded-tr-none'}
                          `}>
                            {/* Thread Count Badge - Minimalist in corner */}
                            {threadCounts[msg.threadId] > 1 && (
                              <div className={`
                                absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold font-mono shadow-sm border
                                ${msg.isIncoming ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-white text-gray-900 border-gray-200'}
                              `}>
                                {threadCounts[msg.threadId]}
                              </div>
                            )}

                            {/* Subject Header - More Compact */}
                            <div className={`
                              text-[9px] font-bold font-mono uppercase tracking-wider mb-1.5 pb-1.5 border-b
                              ${msg.isIncoming ? 'text-gray-400 border-gray-50' : 'text-gray-500 border-gray-800'}
                            `}>
                              {msg.subject}
                            </div>

                            {/* Body */}
                            <div className="text-xs font-sans whitespace-pre-wrap leading-relaxed">
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
                          </div>
                        </button>

                        {msg.isIncoming && (
                          <button 
                            onClick={() => setReplyTo(msg)}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-lg text-gray-400 transition-all"
                          >
                            <Reply size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Smoke/Gradient Fade Effect */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-gray-50 via-gray-50/90 to-transparent pointer-events-none z-20" />

          {/* Message Composer - Floating */}
          <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-none">
            <div className="max-w-3xl mx-auto w-full pointer-events-auto">
              {replyTo && (
                <div className="mb-2 p-2 bg-blue-50/90 backdrop-blur-md border border-blue-100 rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-bottom-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Reply size={10} className="text-blue-600" />
                      <span className="text-[9px] font-bold text-blue-700 font-mono uppercase tracking-widest">Reply to {replyTo.from.email}</span>
                    </div>
                    <p className="text-[10px] text-blue-600 font-sans truncate opacity-70">{replyTo.body}</p>
                  </div>
                  <button 
                    onClick={() => setReplyTo(null)}
                    className="p-1 hover:bg-blue-100 rounded-full text-blue-400"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <div className="shadow-2xl shadow-black/10 rounded-2xl overflow-hidden backdrop-blur-md border border-black/20">
                <MessageComposer 
                  clientId={conversation.clientId} 
                  previousSubjects={Array.from(new Set(conversation.messages.map(m => m.subject)))}
                  fixedSubject={replyTo?.subject}
                  fixedThreadId={replyTo?.threadId}
                />
              </div>
            </div>
          </div>
        </div>

        {showSidebar && <ContextSidebar conversation={conversation} />}
      </div>
    </div>
  );
};

export default ChatView;
