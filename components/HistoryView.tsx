
import React from 'react';
import { ChatSession, Language } from '../types';
import { translations } from '../translations';

interface HistoryViewProps {
  sessions: ChatSession[];
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onNewChat: () => void;
  language: Language;
}

const HistoryView: React.FC<HistoryViewProps> = ({ sessions, onSelectChat, onDeleteChat, onNewChat, language }) => {
  const t = translations[language];
  const sidebarT = t.sidebar;

  const formatDate = (date: Date) => {
    const now = new Date();
    const isToday = now.toDateString() === date.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent overflow-hidden">
      <div className="p-4 sm:p-8 md:p-12 overflow-y-auto h-full scrollbar-hide">
        {/* Chatbot Entry Section */}
        <section className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Chatbot</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-hein-lime/10 border border-hein-lime/20 rounded-full">
              <span className="w-1.5 h-1.5 bg-hein-lime rounded-full animate-pulse"></span>
              <span className="text-[9px] sm:text-[10px] font-black text-hein-lime uppercase tracking-widest">Live</span>
            </div>
          </div>

          <div 
            onClick={onNewChat}
            className="group relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl hover:border-hein-lime/50 transition-all cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-hein-lime/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl group-hover:bg-hein-lime/10 transition-colors"></div>

            <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-hein-lime rounded-2xl flex items-center justify-center shadow-lg shadow-hein-lime/20 group-hover:scale-105 transition-transform duration-500 shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-hein-dark">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
               </svg>
            </div>

            <div className="relative flex-1 space-y-1 min-w-0">
              <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight truncate">
                {t.topBar.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium line-clamp-2">
                {t.welcome.description}
              </p>
            </div>

            <div className="relative shrink-0">
              <button className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-hein-dark text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl group-hover:bg-black group-hover:shadow-2xl transition-all shadow-lg active:scale-95">
                New Chat
              </button>
            </div>
          </div>
        </section>

        {/* History Section */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">{sidebarT.history}</h2>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Logs Archive</p>
          </div>
          <div className="hidden sm:block px-4 py-2 border border-slate-200 dark:border-white/5 rounded-xl">
             <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
               Count: {sessions.length}
             </span>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center opacity-30">
            <div className="w-10 h-10 mb-4 border border-slate-300 dark:border-white/10 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest">No previous records</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-12">
            {sessions.map((session) => (
              <div 
                key={session.id}
                onClick={() => onSelectChat(session.id)}
                className="group relative bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 p-5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:shadow-lg transition-all cursor-pointer flex flex-col gap-3 min-w-0"
              >
                <div className="flex justify-between items-start">
                   <div className="w-9 h-9 rounded-xl bg-hein-lime/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-hein-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                   </div>
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       onDeleteChat(session.id);
                     }}
                     className="p-1.5 text-slate-400 hover:text-red-500 transition-all opacity-100 sm:opacity-0 group-hover:opacity-100"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                   </button>
                </div>

                <div className="min-w-0">
                   <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1 truncate">{session.title}</h3>
                   <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed opacity-80">
                     {session.messages[session.messages.length - 1]?.content || "..."}
                   </p>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                   <span className="text-[8px] font-bold tracking-widest text-slate-400 uppercase">
                     {formatDate(session.lastTimestamp)}
                   </span>
                   <span className="text-[9px] font-black text-hein-lime uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                     Open
                   </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
