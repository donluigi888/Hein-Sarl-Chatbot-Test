
import React, { useState, useRef, useEffect } from 'react';
import { Message, Language, ConnectionStatus } from '../types';
import { translations } from '../translations';
import MessageBubble from './MessageBubble';

interface ChatPanelProps {
  messages: Message[];
  isTyping: boolean;
  isTranslating?: boolean;
  connectionStatus: ConnectionStatus;
  language: Language;
  onSendMessage: (content: string) => void;
  onQuickAction: (action: string) => void;
  chatTitle?: string;
  onRequestTechnician: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  messages, 
  isTyping, 
  isTranslating,
  connectionStatus,
  language, 
  onSendMessage,
  onQuickAction,
  chatTitle,
  onRequestTechnician
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;
    onSendMessage(inputValue);
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleExportPdf = () => {
    if (!(window as any).jspdf) {
      alert("PDF library is still loading. Please try again in a few seconds.");
      return;
    }

    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();
    let y = 20;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const innerWidth = pageWidth - (margin * 2);

    doc.setFontSize(22);
    doc.setTextColor(26, 26, 26);
    doc.text("HEIN Technical Chat Log", margin, y);
    doc.setDrawColor(193, 215, 46);
    doc.setLineWidth(1.5);
    doc.line(margin, y + 3, margin + 50, y + 3);
    y += 15;

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Session: ${chatTitle || 'Technical Live Data'}`, margin, y);
    y += 6;
    doc.text(`Generated: ${new Date().toLocaleString()} (${language})`, margin, y);
    y += 15;

    messages.forEach((msg) => {
      const isAssistant = msg.role === 'assistant';
      const sender = isAssistant ? "HEIN ASSISTANT" : "USER";
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(isAssistant ? 193 : 51, isAssistant ? 215 : 51, isAssistant ? 46 : 51);
      doc.text(`${sender} [${msg.timestamp.toLocaleTimeString()}]`, margin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(51, 51, 51);
      const lines = doc.splitTextToSize(msg.content, innerWidth);
      if (y + (lines.length * 6) > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(lines, margin, y);
      y += (lines.length * 6) + 12;
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(160);
      doc.text(`Page ${i} of ${pageCount} - Hein Sàrl Proprietary Support Log`, pageWidth / 2, 288, { align: 'center' });
    }

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
    const filename = `Hein_Session_${dateStr}_${timeStr}.pdf`;
    doc.save(filename);
  };

  const renderConnectionBadge = () => {
    if (connectionStatus === 'checking') {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/5 shrink-0">
          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse"></span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest hidden xs:inline">Verifying Link</span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest xs:hidden">...</span>
        </div>
      );
    }
    
    if (connectionStatus === 'connected') {
      return (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 shrink-0">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hidden xs:inline">Connected</span>
          <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest xs:hidden">LIVE</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 shrink-0">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        <span className="text-[8px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest hidden xs:inline">Not Connected</span>
        <span className="text-[8px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest xs:hidden">OFFLINE</span>
      </div>
    );
  };

  // Helper to render the Heini greeting with the localized brand color
  const renderWelcomeTitle = () => {
    const fullTitle = t.welcome.heiniTitle;
    if (fullTitle.includes("HEINI")) {
      const parts = fullTitle.split("HEINI");
      return (
        <>
          {parts[0]}<span className="text-hein-lime">HEINI</span>{parts[1]}
        </>
      );
    }
    return fullTitle;
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-white/20 dark:bg-black/10 backdrop-blur-md border-b border-white/40 dark:border-white/5 z-20 gap-2">
        <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2 md:gap-3">
          <h2 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 truncate max-w-[120px] sm:max-w-none">
            {chatTitle || "Live Data"}
          </h2>
          
          {renderConnectionBadge()}

          {isTranslating && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-hein-lime/10 border border-hein-lime/20 animate-pulse shrink-0">
              <span className="w-1 h-1 bg-hein-lime rounded-full"></span>
              <span className="text-[8px] font-black text-hein-lime uppercase tracking-widest">Translating</span>
            </div>
          )}
        </div>
        <div className="relative shrink-0" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-400 hover:text-hein-dark dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-700/40 rounded-xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 sm:w-56 origin-top-right bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 py-2 z-[60] animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  handleExportPdf();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <span className="p-1.5 bg-hein-lime/10 dark:bg-hein-lime/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-hein-lime">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
                {t.sidebar.exportChat}
              </button>
              <button
                onClick={() => {
                  onRequestTechnician();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors border-t border-slate-50 dark:border-white/5"
              >
                <span className="p-1.5 bg-red-100 dark:bg-red-500/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </span>
                {t.sidebar.errorCodes}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages Stream */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 md:px-12 space-y-6 scroll-smooth scrollbar-hide"
      >
        <div className="max-w-4xl mx-auto w-full space-y-8 pb-32">
          {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center py-10 md:py-20 animate-in fade-in zoom-in duration-700">
                <div className="mb-6 md:mb-8 w-20 h-20 md:w-24 md:h-24 bg-hein-lime/5 border border-hein-lime/10 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center shadow-inner overflow-hidden">
                  <span className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tighter">
                    HE<span className="text-hein-lime">I</span>N
                  </span>
                </div>
                <h3 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3 md:mb-4 text-center px-4">
                  {renderWelcomeTitle()}
                </h3>
                <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 font-medium text-center px-8">
                  {t.welcome.heiniSubtitle}
                </p>
                <div className="mt-8 md:mt-12 flex items-center gap-2">
                  <div className="w-1 h-1 bg-hein-lime rounded-full"></div>
                  <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                  <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                </div>
             </div>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] ml-2 md:ml-4">
              <div className="flex gap-1">
                  <span className="w-1 h-1 bg-hein-lime rounded-full animate-bounce [animation-duration:1s]"></span>
                  <span className="w-1 h-1 bg-hein-lime rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]"></span>
                  <span className="w-1 h-1 bg-hein-lime rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]"></span>
              </div>
              {t.input.typing}
            </div>
          )}
        </div>
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-8 bg-gradient-to-t from-white/95 dark:from-hein-dark/95 via-white/50 dark:via-hein-dark/50 to-transparent backdrop-blur-[2px]">
        <div className="max-w-4xl mx-auto w-full relative">
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl focus-within:ring-2 focus-within:ring-hein-lime/20 focus-within:border-hein-lime transition-all p-1"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={t.input.placeholder}
              className="flex-1 max-h-[160px] py-3 px-4 md:py-3.5 md:px-5 bg-transparent border-none focus:ring-0 text-sm md:text-base resize-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 md:p-3.5 bg-hein-dark text-white rounded-xl disabled:opacity-20 transition-all active:scale-95 shadow-md group shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="group-hover:text-hein-lime transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
