
import React from 'react';
import { Language, ViewMode } from '../types';
import { translations } from '../translations';

interface SidebarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onNewChat: () => void;
  onChatbotClick: () => void;
  onViewSelect: (view: ViewMode) => void;
  viewMode: ViewMode;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  language, 
  setLanguage,
  onNewChat,
  onChatbotClick,
  onViewSelect, 
  viewMode,
  isOpen,
  onClose
}) => {
  const t = translations[language].sidebar;

  const content = (
    <div className="flex flex-col h-full bg-transparent w-[300px] md:w-[300px] p-2 md:p-0">
      <div className="flex-1 space-y-8 overflow-y-auto scrollbar-hide py-4 px-4">
        {/* Main Action: New Chat (Brand Identity Green) */}
        <section className="space-y-4">
          <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase">
            {t.start}
          </p>
          <button 
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-hein-lime hover:brightness-105 text-hein-dark text-sm font-bold rounded-[1.5rem] shadow-xl shadow-hein-lime/20 transition-all active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            {t.newChat}
          </button>
        </section>

        {/* Navigation Tabs */}
        <section className="space-y-4">
          <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase">
            {t.quickTopics}
          </p>
          <div className="space-y-2">
            {/* Chatbot Tab */}
            <button
              onClick={() => { onChatbotClick(); onClose(); }}
              className={`w-full flex items-center gap-4 px-5 py-4 text-sm font-semibold rounded-[1.2rem] border transition-all group ${
                viewMode === 'chat' 
                ? 'bg-white dark:bg-slate-800 border-hein-lime text-slate-900 dark:text-white shadow-md' 
                : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${viewMode === 'chat' ? 'bg-hein-lime text-hein-dark' : 'bg-hein-lime/10 text-hein-lime'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </span>
              {t.chatbot}
            </button>

            {/* History Tab */}
            <button
              onClick={() => { onViewSelect('history'); onClose(); }}
              className={`w-full flex items-center gap-4 px-5 py-4 text-sm font-semibold rounded-[1.2rem] border transition-all group ${
                viewMode === 'history' 
                ? 'bg-white dark:bg-slate-800 border-hein-lime text-slate-900 dark:text-white shadow-md' 
                : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${viewMode === 'history' ? 'bg-hein-lime text-hein-dark' : 'bg-hein-lime/10 text-hein-lime'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              {t.history}
            </button>

            {/* Manuals Tab */}
            <button
              onClick={() => { onViewSelect('manuals'); onClose(); }}
              className={`w-full flex items-center gap-4 px-5 py-4 text-sm font-semibold rounded-[1.2rem] border transition-all group ${
                viewMode === 'manuals' 
                ? 'bg-white dark:bg-slate-800 border-hein-lime text-slate-900 dark:text-white shadow-md' 
                : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${viewMode === 'manuals' ? 'bg-hein-lime text-hein-dark' : 'bg-hein-lime/10 text-hein-lime'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
              {t.manuals}
            </button>

            {/* Request Technician Tab */}
            <button
              onClick={() => { onViewSelect('technician'); onClose(); }}
              className={`w-full flex items-center gap-4 px-5 py-4 text-sm font-semibold rounded-[1.2rem] border transition-all group ${
                viewMode === 'technician' 
                ? 'bg-white dark:bg-slate-800 border-hein-lime text-slate-900 dark:text-white shadow-md' 
                : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${viewMode === 'technician' ? 'bg-hein-lime text-hein-dark' : 'bg-hein-lime/10 text-hein-lime'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </span>
              {t.errorCodes}
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="p-4 mt-auto space-y-3">
        {/* Mobile Language Switcher redundant in sidebar */}
        <div className="md:hidden flex items-center justify-center gap-1 bg-white/20 dark:bg-white/5 p-1 rounded-2xl border border-white/40 dark:border-white/5 backdrop-blur-sm">
          {['EN', 'FR', 'DE', 'NL'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang as Language)}
              className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${language === lang ? 'bg-hein-lime text-hein-dark shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="p-5 bg-white/30 dark:bg-hein-grey/30 border border-white/50 dark:border-white/5 rounded-3xl backdrop-blur-md">
           <p className="text-[10px] font-medium text-slate-400 leading-tight">
             developed by Louis Kohnen and <a 
                href="https://flowly.lu/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-500 dark:text-slate-300 hover:text-hein-lime dark:hover:text-hein-lime transition-colors underline decoration-hein-lime/30"
              >
                flowly.lu
              </a>
           </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block h-full transition-all duration-500">
        {content}
      </aside>

      <div 
        className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
        <div className={`absolute top-2 left-2 bottom-2 w-[300px] bg-hein-light dark:bg-hein-dark rounded-[2.5rem] shadow-2xl transform transition-transform duration-500 ease-out p-1 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full overflow-hidden rounded-[2.2rem] bg-hein-light dark:bg-hein-dark">
            {content}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
