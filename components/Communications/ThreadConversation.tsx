import React from 'react';
import { EmailThread, EmailMessage } from '../../types';
import { Mail, Terminal, User, ArrowRight, Paperclip } from 'lucide-react';

interface ThreadConversationProps {
  thread: EmailThread;
}

const ThreadConversation: React.FC<ThreadConversationProps> = ({ thread }) => {
  // In a real app, we would fetch system events related to the linked trip/client
  // and interleave them with messages. For this demo, we'll simulate one.
  
  const events = [
    {
      type: 'SYSTEM',
      date: '2024-02-04T10:30:00',
      title: 'Invoice Issued',
      content: 'INV-789012 was generated and sent to billing queue.',
      icon: <Terminal size={12} />
    }
  ];

  // Combine and sort
  const timeline = [
    ...thread.messages.map(m => ({ type: 'MESSAGE', date: m.date, data: m })),
    ...events.map(e => ({ type: 'EVENT', date: e.date, data: e }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8 relative">
      {/* Vertical Line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100 -z-10" />

      {timeline.map((item, idx) => {
        if (item.type === 'MESSAGE') {
          const msg = item.data as EmailMessage;
          const isMe = msg.from.email === 'ops@nexmile.com';

          return (
            <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className={`
                w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border shadow-sm z-10
                ${isMe ? 'bg-gray-900 text-white border-gray-800' : 'bg-white text-gray-400 border-gray-200'}
              `}>
                {isMe ? <ArrowRight size={14} /> : <User size={14} />}
              </div>
              
              <div className={`flex-1 max-w-[85%] ${isMe ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2 mb-1 justify-end flex-row-reverse">
                  <span className="text-[11px] font-bold text-gray-900 font-mono">{msg.from.name}</span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className={`
                  p-4 rounded-2xl border shadow-sm text-sm leading-relaxed
                  ${isMe ? 'bg-blue-600 text-white border-blue-500' : 'bg-white text-gray-800 border-gray-100'}
                `}>
                  <div className="font-mono whitespace-pre-wrap">{msg.body}</div>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-current/10 flex flex-wrap gap-2">
                      {msg.attachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/5 text-[10px] font-bold font-mono">
                          <Paperclip size={10} />
                          <span>{file}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        } else {
          const event = item.data as any;
          return (
            <div key={idx} className="flex gap-4 items-center">
              <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border border-gray-200 bg-gray-50 text-gray-400 shadow-sm z-10">
                {event.icon}
              </div>
              <div className="flex-1 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl px-4 py-2 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 font-mono uppercase tracking-widest">{event.title}</span>
                  <span className="text-[11px] text-gray-400 font-mono">{event.content}</span>
                </div>
                <span className="text-[9px] font-mono text-gray-300">
                  {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default ThreadConversation;
