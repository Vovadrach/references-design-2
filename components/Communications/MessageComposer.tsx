import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, ChevronDown, Reply, Sparkles } from 'lucide-react';

interface MessageComposerProps {
  clientId: string;
  previousSubjects?: string[];
  fixedSubject?: string;
  fixedThreadId?: string;
}

// Sub-component 1: Subject Selector
const SubjectSelector: React.FC<{
  subject: string;
  setSubject: (s: string) => void;
  previousSubjects: string[];
  isDropdownOpen: boolean;
  setIsDropdownOpen: (o: boolean) => void;
}> = ({ subject, setSubject, previousSubjects, isDropdownOpen, setIsDropdownOpen }) => {
  if (previousSubjects.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-100/50 relative">
      <span className="text-[9px] font-bold text-gray-600 font-mono uppercase tracking-widest">Subject:</span>
      <input 
        type="text" 
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-[11px] font-bold font-mono text-gray-900 placeholder-gray-400"
        placeholder="New Subject..."
      />
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="p-1 hover:bg-gray-200 rounded-md text-gray-500 transition-colors"
      >
        <ChevronDown size={12} />
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-30 max-h-[200px] overflow-y-auto custom-scrollbar">
          <div className="p-2 border-b border-gray-50 bg-gray-50/50">
            <span className="text-[8px] font-bold text-gray-400 font-mono uppercase tracking-widest">Existing Threads</span>
          </div>
          {previousSubjects.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setSubject(s);
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-[10px] font-mono text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-50 last:border-none"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Sub-component 2: Auto-expanding Message Input
const MessageInput: React.FC<{
  body: string;
  setBody: (b: string) => void;
  placeholder: string;
}> = ({ body, setBody, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [body]);

  return (
    <div className="relative px-3 py-2">
      <textarea 
        ref={textareaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full bg-transparent border-none outline-none text-xs font-sans resize-none min-h-[20px] max-h-[200px] p-0 placeholder-gray-400 leading-relaxed custom-scrollbar text-gray-900"
        placeholder={placeholder}
        rows={1}
      />
    </div>
  );
};

// Sub-component 3: Composer Actions
const ComposerActions: React.FC<{
  onSend: () => void;
  canSend: boolean;
  isReply: boolean;
}> = ({ onSend, canSend, isReply }) => {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100/50">
      <div className="flex items-center gap-1">
        <button className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors group" title="Attach Files">
          <Paperclip size={14} className="group-hover:text-gray-900" />
        </button>
        <button className="p-1.5 hover:bg-purple-50 rounded-lg text-gray-700 transition-colors group" title="AI Assist">
          <Sparkles size={14} className="group-hover:text-purple-700" />
        </button>
        <div className="w-px h-3 bg-gray-200 mx-1"></div>
        <button className="px-2 py-1 hover:bg-gray-200 rounded-md text-[9px] font-bold font-mono text-gray-700 uppercase tracking-widest transition-all">
          Templates
        </button>
      </div>

      <button 
        onClick={onSend}
        className="flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-bold font-mono uppercase tracking-widest transition-all bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-500/20"
      >
        {isReply ? <Reply size={12} className="text-white" /> : <Send size={12} className="text-white" />}
        <span className="text-white">{isReply ? 'Reply' : 'Send'}</span>
      </button>
    </div>
  );
};

const MessageComposer: React.FC<MessageComposerProps> = ({ clientId, previousSubjects = [], fixedSubject, fixedThreadId }) => {
  const [subject, setSubject] = useState(fixedSubject || '');
  const [body, setBody] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSend = () => {
    if (!body.trim()) return;
    // In a real app, this would call an API
    console.log(`Sending message to Client ${clientId}`, { subject, threadId: fixedThreadId, body });
    setBody('');
    if (!fixedSubject) setSubject('');
  };

  return (
    <div className="flex flex-col bg-gray-100/50 rounded-2xl overflow-hidden transition-all focus-within:bg-white focus-within:shadow-sm">
      {!fixedSubject && (
        <SubjectSelector 
          subject={subject}
          setSubject={setSubject}
          previousSubjects={previousSubjects}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
        />
      )}

      <MessageInput 
        body={body}
        setBody={setBody}
        placeholder={fixedSubject ? `Reply to "${fixedSubject}"...` : "Type your message here..."}
      />

      <ComposerActions 
        onSend={handleSend}
        canSend={body.trim().length > 0}
        isReply={!!fixedSubject}
      />
    </div>
  );
};

export default MessageComposer;
