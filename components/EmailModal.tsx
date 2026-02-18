import React, { useState } from 'react';
import { 
  X, Send, Paperclip, ChevronDown, User, Sparkles, 
  Trash2, Mail, Link, Minimize2, Paperclip as AttachmentIcon
} from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  clientName: string;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, onSubmit, clientName }) => {
  const [email, setEmail] = useState('accounting@rossi-transport.it');
  const [subject, setSubject] = useState(`Invoice INV-${new Date().getFullYear()}/005 & CMR Docs`);
  const [body, setBody] = useState(`Dear Partner,

Please find attached the invoice and CMR documentation for the recently completed transport (Hoerdt - Thalfang).

Kindly confirm receipt of these documents at your earliest convenience.

Best regards,
John Smith
Senior Logistician | Nexmile`);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* 1. Backdrop (Softer blur) */}
      <div 
        className="absolute inset-0 bg-gray-900/20 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* 2. Main Window Container (Compact & Elegant) */}
      <div className="
        relative bg-white rounded-xl shadow-2xl shadow-gray-200/50 
        w-full max-w-3xl h-[600px] 
        flex flex-col 
        animate-in zoom-in-95 duration-200 
        border border-gray-100 overflow-hidden ring-1 ring-black/5
      ">
        
        {/* --- HEADER (Updated: Client Name & Mono Font) --- */}
        <div className="h-14 px-6 flex items-center justify-between border-b border-gray-50 bg-white shrink-0">
            <div className="flex items-center gap-3">
                <div className="text-gray-400">
                    <Mail size={16} />
                </div>
                {/* Client Name as Header in Mono */}
                <h2 className="text-sm font-bold text-gray-800 font-mono tracking-tight">{clientName}</h2>
            </div>
            
            <div className="flex items-center gap-1">
                <button className="p-1.5 text-gray-300 hover:text-gray-600 rounded-md transition-colors">
                    <Minimize2 size={14} />
                </button>
                <button 
                    onClick={onClose}
                    className="p-1.5 text-gray-300 hover:text-red-500 rounded-md transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>

        {/* --- META FIELDS (Updated Spacing & Dropdown look) --- */}
        <div className="px-6 py-4 bg-white shrink-0 flex flex-col gap-1 z-10">
            
            {/* Field: TO (Dropdown Style) */}
            <div className="flex items-center gap-2 border-b border-gray-50 py-2 group focus-within:border-blue-100 transition-colors">
                <label className="text-[11px] font-bold text-gray-400 font-mono uppercase tracking-wider w-20 shrink-0 text-right pr-4">TO:</label>
                <div className="flex-1 flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50/50 rounded px-2 -ml-2 py-1 transition-colors group/input relative">
                    <div className="flex items-center gap-2 flex-1">
                        <User size={12} className="text-gray-400" />
                        <input 
                            type="text" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 outline-none text-sm text-gray-700 font-mono font-medium bg-transparent placeholder-gray-300 w-full"
                        />
                    </div>
                    {/* Dropdown Arrow */}
                    <button className="text-gray-300 hover:text-blue-500 transition-colors">
                        <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {/* Field: SUBJECT (Increased Spacing) */}
            <div className="flex items-center gap-2 py-2 group focus-within:border-blue-100 border-b border-transparent transition-colors px-2 -ml-2">
                <label className="text-[11px] font-bold text-gray-400 font-mono uppercase tracking-wider w-20 shrink-0 text-right pr-4">SUBJECT:</label>
                <input 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="flex-1 outline-none text-sm font-bold text-gray-800 bg-transparent placeholder-gray-300"
                />
            </div>
        </div>

        {/* --- EDITOR BODY (Fluid) --- */}
        <div className="flex-1 flex flex-col min-h-0 bg-white relative">
            <textarea 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="
                    flex-1 w-full px-8 py-4 resize-none outline-none 
                    text-base text-gray-800 leading-relaxed font-mono
                    placeholder-gray-300 custom-scrollbar selection:bg-blue-100
                "
                spellCheck={false}
                placeholder="Write your message here..."
            />

            {/* Attachments (Bottom of Body) */}
            <div className="px-6 pb-2 pt-2 shrink-0">
                <div className="flex flex-wrap gap-2 pl-2">
                    <FileBadge name={`INV-${new Date().getFullYear()}.pdf`} size="145 KB" />
                    <FileBadge name="CMR_Signed.pdf" size="1.2 MB" />
                </div>
            </div>
        </div>

        {/* --- FOOTER (Actions) --- */}
        <div className="h-16 px-6 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between shrink-0">
            
            {/* Left: Simple Tools */}
            <div className="flex items-center gap-1">
                <IconButton icon={<Paperclip size={16}/>} tooltip="Attach" />
                <IconButton icon={<Link size={16}/>} tooltip="Link" />
                <div className="w-px h-4 bg-gray-200 mx-2"></div>
                <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors text-[11px] font-bold uppercase tracking-wide">
                    <Sparkles size={14} />
                    <span>Polish</span>
                </button>
            </div>

            {/* Right: Primary Action */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Discard"
                >
                    <Trash2 size={16} />
                </button>
                
                <div className="flex items-center shadow-lg shadow-blue-500/20 rounded-lg overflow-hidden transition-transform active:scale-95">
                    <button 
                        onClick={onSubmit}
                        className="
                            bg-blue-600 hover:bg-blue-700 text-white 
                            px-5 py-2 text-xs font-bold uppercase tracking-wide
                            flex items-center gap-2 transition-colors
                        "
                    >
                        <span>Send</span>
                        <Send size={12} strokeWidth={2.5} />
                    </button>
                    <div className="w-px h-full bg-blue-700"></div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2">
                        <ChevronDown size={14} />
                    </button>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

// --- Sub-components (Refined) ---

const FileBadge = ({ name, size }: { name: string, size: string }) => (
    <div className="
        flex items-center gap-2 px-2.5 py-1.5
        bg-white border border-gray-200 rounded-lg 
        hover:border-blue-300 transition-all cursor-pointer group select-none shadow-sm
    ">
        <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
            <AttachmentIcon size={12} />
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-xs font-medium text-gray-700">{name}</span>
            <span className="text-[9px] text-gray-400 font-mono">{size}</span>
        </div>
        <button className="ml-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
            <X size={12} />
        </button>
    </div>
);

const IconButton = ({ icon, tooltip }: { icon: React.ReactNode, tooltip: string }) => (
    <button 
        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white hover:shadow-sm rounded-lg transition-all"
        title={tooltip}
    >
        {icon}
    </button>
);

export default EmailModal;