import React, { useState } from 'react';
import { 
  X, FileText, Minimize2, Trash2, ArrowRight, 
  Building2, Hash, Calendar, MapPin, Plus, Percent,
  CreditCard, Landmark, Globe, Receipt, LayoutTemplate,
  Tag, Box
} from 'lucide-react';

// --- UI Helpers ---

const SectionHeader = ({ label, icon }: { label: string, icon?: React.ReactNode }) => (
    <div className="flex items-center gap-2 mb-4 mt-6 pb-2 border-b border-gray-100/80">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono select-none">
            {label}
        </span>
    </div>
);

const FieldGroup = ({ label, children, className = "" }: { label: string, children?: React.ReactNode, className?: string }) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide select-none truncate" title={label}>{label}</label>
        {children}
    </div>
);

const LineInput = ({ value, onChange, placeholder, mono = true, bold = false, align = 'left', type="text" }: any) => (
    <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`
            w-full bg-transparent border-b border-gray-100 py-1.5 outline-none transition-colors
            focus:border-blue-300 placeholder-gray-200
            text-sm text-gray-700
            ${mono ? 'font-mono' : 'font-sans'}
            ${bold ? 'font-bold' : 'font-medium'}
            ${align === 'right' ? 'text-right' : 'text-left'}
        `}
    />
);

const SelectInput = ({ value, onChange, options, mono = true }: any) => (
    <div className="relative">
        <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className={`
                w-full bg-transparent border-b border-gray-100 py-1.5 outline-none transition-colors
                focus:border-blue-300 text-sm text-gray-700 appearance-none cursor-pointer
                ${mono ? 'font-mono' : 'font-sans'}
            `}
        >
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute right-0 top-2 pointer-events-none text-gray-300">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
    </div>
);

// --- Main Component ---

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

// Initial Data mapped to requested structure
const INITIAL_DATA = {
  // КОНТРАГЕНТ
  contractor: {
    companyName: "Paweł Siwiak Transbus",
    nip: "PL8272034402",
    country: "Poland",
    street: "ul. Warszawska 15",
    city: "Wrocław",
    zip: "50-001"
  },
  // ПОЗИЦІЯ ФАКТУРИ (Item Specs)
  item: {
    orderRef: "ZL005/02/26",
    description: "Transport Services", // Implicit needed for invoice usually
    quantity: "1",
    unit: "srv" // послуга
  },
  // ФІНАНСИ (Financials & Settings)
  finance: {
    netPrice: "270.00",
    currency: "EUR",
    vatRate: "23",
    gtu: "GTU_13",
    discount: "0.00",
    docType: "Faktura VAT",
    priceType: "Netto",
    paymentMethod: "Bank Transfer"
  },
  // ДАТИ
  dates: {
    saleDate: "2026-02-04",
    paymentTermDays: "60",
    placeOfIssue: "Katowice"
  }
};

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [data, setData] = useState(INITIAL_DATA);

  if (!isOpen) return null;

  const update = (section: keyof typeof INITIAL_DATA, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  // Calculations
  const net = parseFloat(data.finance.netPrice) || 0;
  const qty = parseFloat(data.item.quantity) || 0;
  const vatRate = parseFloat(data.finance.vatRate) || 0;
  const discount = parseFloat(data.finance.discount) || 0;

  const subtotal = (net * qty) - discount;
  const vatAmount = subtotal * (vatRate / 100);
  const totalGross = subtotal + vatAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/20 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="
        relative bg-white rounded-xl shadow-2xl shadow-gray-200/50 
        w-full max-w-3xl h-[85vh] md:h-[750px]
        flex flex-col 
        animate-in zoom-in-95 duration-200 
        border border-gray-100 overflow-hidden ring-1 ring-black/5
      ">
        
        {/* --- Header --- */}
        <div className="h-14 px-6 flex items-center justify-between border-b border-gray-50 bg-white shrink-0 z-20">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <Receipt size={16} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-gray-800 font-mono tracking-tight leading-none">INVOICE EDITOR</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-400 font-mono">DRAFT MODE</span>
                    </div>
                </div>
            </div>
            
            <button 
                onClick={onClose}
                className="p-1.5 text-gray-300 hover:text-red-500 rounded-md transition-colors"
            >
                <X size={18} />
            </button>
        </div>

        {/* --- Content (Scrollable Form) --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
            <div className="px-8 pb-10">

                {/* 1. КОНТРАГЕНТ (CONTRACTOR) */}
                <SectionHeader label="Контрагент / Contractor" icon={<Building2 size={12}/>} />
                <div className="space-y-4">
                    <FieldGroup label="Назва Компанії">
                        <LineInput value={data.contractor.companyName} onChange={(v: string) => update('contractor', 'companyName', v)} bold />
                    </FieldGroup>
                    
                    <div className="grid grid-cols-2 gap-8">
                        <FieldGroup label="NIP / Податковий ID">
                            <LineInput value={data.contractor.nip} onChange={(v: string) => update('contractor', 'nip', v)} />
                        </FieldGroup>
                        <FieldGroup label="Країна">
                             <LineInput value={data.contractor.country} onChange={(v: string) => update('contractor', 'country', v)} />
                        </FieldGroup>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                         <FieldGroup label="Вулиця">
                             <LineInput value={data.contractor.street} onChange={(v: string) => update('contractor', 'street', v)} />
                        </FieldGroup>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                         <FieldGroup label="Індекс">
                             <LineInput value={data.contractor.zip} onChange={(v: string) => update('contractor', 'zip', v)} />
                        </FieldGroup>
                        <FieldGroup label="Місто" className="col-span-2">
                             <LineInput value={data.contractor.city} onChange={(v: string) => update('contractor', 'city', v)} />
                        </FieldGroup>
                    </div>
                </div>

                {/* 2. ДАТИ (DATES) - Moved up for better flow */}
                <SectionHeader label="Дати / Dates" icon={<Calendar size={12}/>} />
                <div className="grid grid-cols-3 gap-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <FieldGroup label="Дата Продажу">
                        <LineInput type="date" value={data.dates.saleDate} onChange={(v: string) => update('dates', 'saleDate', v)} />
                    </FieldGroup>
                    <FieldGroup label="Термін (Дні)">
                        <LineInput value={data.dates.paymentTermDays} onChange={(v: string) => update('dates', 'paymentTermDays', v)} />
                    </FieldGroup>
                    <FieldGroup label="Місце Продажу">
                        <LineInput value={data.dates.placeOfIssue} onChange={(v: string) => update('dates', 'placeOfIssue', v)} />
                    </FieldGroup>
                </div>

                {/* 3. ФІНАНСИ (FINANCE SETTINGS) */}
                <SectionHeader label="Фінанси / Finance" icon={<Landmark size={12}/>} />
                <div className="grid grid-cols-4 gap-6 mb-4">
                    <FieldGroup label="Тип Документа">
                        <SelectInput 
                            value={data.finance.docType} 
                            onChange={(v: string) => update('finance', 'docType', v)} 
                            options={['Faktura VAT', 'Proforma', 'Correction']} 
                        />
                    </FieldGroup>
                    <FieldGroup label="Тип Ціни">
                        <SelectInput 
                            value={data.finance.priceType} 
                            onChange={(v: string) => update('finance', 'priceType', v)} 
                            options={['Netto', 'Brutto']} 
                        />
                    </FieldGroup>
                    <FieldGroup label="Метод Оплати" className="col-span-2">
                        <SelectInput 
                            value={data.finance.paymentMethod} 
                            onChange={(v: string) => update('finance', 'paymentMethod', v)} 
                            options={['Bank Transfer', 'Cash', 'Card']} 
                        />
                    </FieldGroup>
                </div>
                <div className="grid grid-cols-4 gap-6">
                     <FieldGroup label="Валюта">
                        <LineInput value={data.finance.currency} onChange={(v: string) => update('finance', 'currency', v)} bold />
                    </FieldGroup>
                    <FieldGroup label="Знижка">
                        <LineInput value={data.finance.discount} onChange={(v: string) => update('finance', 'discount', v)} />
                    </FieldGroup>
                     <FieldGroup label="GTU">
                        <LineInput value={data.finance.gtu} onChange={(v: string) => update('finance', 'gtu', v)} />
                    </FieldGroup>
                </div>

                {/* 4. ПОЗИЦІЯ ФАКТУРИ (INVOICE ITEM) */}
                <SectionHeader label="Позиція / Invoice Item" icon={<Box size={12}/>} />
                
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-blue-300 transition-colors">
                    {/* Description Row */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <FieldGroup label="Номер Злецення (Ref)">
                             <LineInput value={data.item.orderRef} onChange={(v: string) => update('item', 'orderRef', v)} bold />
                        </FieldGroup>
                         <FieldGroup label="Опис (Description)" className="col-span-2">
                             <LineInput value={data.item.description} onChange={(v: string) => update('item', 'description', v)} mono={false} />
                        </FieldGroup>
                    </div>

                    {/* Numeric Row */}
                    <div className="flex items-end gap-4 border-t border-gray-100 pt-3">
                        <div className="w-20">
                             <FieldGroup label="Кількість">
                                <LineInput value={data.item.quantity} onChange={(v: string) => update('item', 'quantity', v)} align="center" />
                             </FieldGroup>
                        </div>
                        <div className="w-20">
                             <FieldGroup label="Одиниця">
                                <LineInput value={data.item.unit} onChange={(v: string) => update('item', 'unit', v)} align="center" />
                             </FieldGroup>
                        </div>
                        
                        <div className="flex-1"></div> {/* Spacer */}

                        <div className="w-24">
                             <FieldGroup label="Ціна Нетто">
                                <LineInput value={data.finance.netPrice} onChange={(v: string) => update('finance', 'netPrice', v)} align="right" bold />
                             </FieldGroup>
                        </div>
                         <div className="w-16">
                             <FieldGroup label="ПДВ %">
                                <LineInput value={data.finance.vatRate} onChange={(v: string) => update('finance', 'vatRate', v)} align="right" />
                             </FieldGroup>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* --- Footer (Totals) --- */}
        <div className="h-20 px-8 border-t border-gray-50 bg-gray-50/80 backdrop-blur-sm flex items-center justify-between shrink-0">
            
            <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50" title="Delete">
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="flex items-center gap-8">
                {/* Summary Blocks */}
                <div className="flex items-center gap-6 text-right">
                     <div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase">Subtotal (Net)</div>
                        <div className="text-xs font-mono text-gray-600">{subtotal.toFixed(2)}</div>
                     </div>
                     <div className="w-px h-6 bg-gray-200"></div>
                     <div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase">VAT Amount</div>
                        <div className="text-xs font-mono text-gray-600">{vatAmount.toFixed(2)}</div>
                     </div>
                </div>

                {/* Grand Total */}
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Total Due</span>
                        <span className="text-xl font-bold font-mono text-gray-900 tracking-tight">{totalGross.toFixed(2)} {data.finance.currency}</span>
                    </div>
                </div>

                {/* Main Action */}
                <button 
                    onClick={() => onSubmit(data)}
                    className="
                        bg-gray-900 hover:bg-black text-white 
                        px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wide
                        flex items-center gap-2 transition-all shadow-lg shadow-gray-200 hover:shadow-gray-400 active:scale-95
                    "
                >
                    <span>Finalize</span>
                    <ArrowRight size={14} strokeWidth={2.5} />
                </button>
            </div>

        </div>

      </div>
    </div>
  );
};

export default InvoiceModal;