
import React, { useState, useRef, useEffect } from 'react';
import { Language, Theme } from '../types';
import { translations } from '../translations';

interface TopBarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  onNewChat: () => void;
  onLogoClick?: () => void;
  onToggleSidebar: () => void;
  onSettingsClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  language, 
  setLanguage, 
  theme, 
  toggleTheme, 
  onNewChat,
  onLogoClick,
  onToggleSidebar,
  onSettingsClick
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const t = translations[language].topBar;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 md:h-16 flex items-center justify-between px-4 md:px-8 bg-white/40 dark:bg-hein-dark/40 backdrop-blur-md border border-white/50 dark:border-white/5 rounded-2xl md:rounded-3xl shadow-sm z-50 transition-all gap-2">
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2.5 text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        <button 
          onClick={onLogoClick}
          className="flex flex-col text-left hover:opacity-80 transition-opacity active:scale-[0.98] min-w-0"
        >
          <h1 className="text-lg md:text-xl font-bold tracking-tight leading-none flex items-center shrink-0">
            HE<span className="text-hein-lime">I</span>N
          </h1>
          <p className="text-[8px] md:text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] truncate">
            {t.subtitle}
          </p>
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* Language Selector: Desktop Row / Mobile Dropdown */}
        <div className="relative" ref={langMenuRef}>
          {/* Desktop Version */}
          <div className="hidden md:flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 p-1 rounded-xl border border-white/40 dark:border-white/5">
            {['EN', 'FR', 'DE', 'NL'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang as Language)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${language === lang ? 'bg-hein-lime text-hein-dark shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Mobile Version: Dropdown */}
          <div className="md:hidden">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/40 dark:border-white/5 text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest transition-all"
            >
              {language}
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-20 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-white/5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {['EN', 'FR', 'DE', 'NL'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang as Language);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-[10px] font-bold text-left uppercase tracking-widest transition-colors ${language === lang ? 'bg-hein-lime text-hein-dark' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={toggleTheme}
          className="p-2 md:p-2.5 text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-white/40 dark:hover:border-white/5 shrink-0"
        >
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="md:w-5 md:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="md:w-5 md:h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          )}
        </button>

        <button 
          onClick={onSettingsClick}
          title={t.settings}
          className="p-2 md:p-2.5 text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-white/40 dark:hover:border-white/5 shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="md:w-5 md:h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
