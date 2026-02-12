
import React, { useState, useEffect } from 'react';
import { Language, Manual } from '../types';
import { translations } from '../translations';

interface ManualsViewProps {
  language: Language;
  manuals: Manual[];
  onBack: () => void;
}

const ManualsView: React.FC<ManualsViewProps> = ({ language, manuals, onBack }) => {
  const [selectedManual, setSelectedManual] = useState<Manual | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = translations[language];

  useEffect(() => {
    let url: string | null = null;
    if (selectedManual) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        try {
          if (selectedManual.url.startsWith('data:')) {
            const parts = selectedManual.url.split(',');
            const mimeType = parts[0].split(':')[1].split(';')[0];
            const b64Data = parts[1];
            const byteCharacters = atob(b64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            url = URL.createObjectURL(blob);
            setPreviewUrl(url);
          } else {
            setPreviewUrl(selectedManual.url);
          }
        } catch (e) {
          console.error("PDF Preview generation failed:", e);
          setPreviewUrl(selectedManual.url);
        } finally {
          setIsLoading(false);
        }
      }, 100);
      return () => {
        clearTimeout(timer);
        if (url) URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
      setIsLoading(false);
    }
  }, [selectedManual]);

  const handleOpenExternal = () => {
    if (previewUrl) window.open(previewUrl, '_blank');
  };

  const handleDownload = () => {
    if (previewUrl && selectedManual) {
      const link = document.createElement('a');
      link.href = previewUrl;
      link.download = `${selectedManual.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (selectedManual) {
    return (
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden animate-in fade-in duration-300">
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-slate-900 z-10 gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button 
              onClick={() => setSelectedManual(null)}
              className="p-2 text-slate-400 hover:text-hein-lime hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="min-w-0">
              <h3 className="text-xs md:text-sm font-bold text-slate-800 dark:text-white uppercase tracking-tight truncate">
                {selectedManual.name}
              </h3>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">Technical PDF</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={handleOpenExternal}
              className="px-3 py-1.5 bg-hein-dark text-white text-[9px] font-bold rounded-lg uppercase tracking-widest hover:bg-black transition-all"
            >
              View
            </button>
          </div>
        </div>
        
        <div className="flex-1 w-full h-full bg-slate-200 dark:bg-slate-950 relative overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hein-lime"></div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Loading Viewer...</p>
            </div>
          ) : previewUrl ? (
            <div className="w-full h-full relative flex flex-col">
              <iframe
                src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                className="flex-1 w-full border-none bg-slate-200 dark:bg-slate-900"
                title={selectedManual.name}
                key={selectedManual.id}
              />
              <div className="p-4 sm:p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5 flex flex-col items-center text-center gap-3">
                <div className="space-y-1">
                  <h4 className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-white uppercase tracking-tight">Access Options</h4>
                  <p className="text-[8px] sm:text-[10px] text-slate-500 dark:text-slate-400">PDF viewing may be restricted on some mobile browsers.</p>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={handleOpenExternal}
                    className="px-4 py-2 sm:px-8 sm:py-3 bg-hein-lime text-hein-dark text-[9px] font-black rounded-xl uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                  >
                    Full View
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="px-4 py-2 sm:px-8 sm:py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-black rounded-xl uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
               <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-tight mb-2">Error</h3>
               <button onClick={() => setSelectedManual(null)} className="px-5 py-2.5 bg-hein-dark text-white text-[9px] font-bold rounded-xl uppercase tracking-widest">Back</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent overflow-hidden animate-in fade-in duration-300">
      <div className="p-5 sm:p-8 md:p-12 overflow-y-auto h-full scrollbar-hide">
        <div className="mb-8 sm:mb-10">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-slate-400 hover:text-hein-lime text-[9px] font-bold uppercase tracking-widest mb-3 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Live Data
          </button>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Manuals</h2>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] mt-1 opacity-60">Technical Archive</p>
        </div>

        <div className="space-y-2 pb-12">
          <p className="text-[9px] font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase mb-3">
            RESOURCES ({manuals.length})
          </p>
          
          <div className="flex flex-col gap-2">
            {manuals.length === 0 ? (
              <div className="py-16 px-6 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2rem] flex flex-col items-center justify-center opacity-40">
                 <p className="text-[10px] font-bold uppercase tracking-widest">No documents found</p>
              </div>
            ) : (
              manuals.map((manual) => (
                <div 
                  key={manual.id}
                  onClick={() => setSelectedManual(manual)}
                  className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl md:rounded-[1.5rem] hover:border-hein-lime/30 transition-all cursor-pointer shadow-sm min-w-0"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 bg-hein-lime/10 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:bg-hein-lime group-hover:text-hein-dark transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white mb-0.5 group-hover:text-hein-lime transition-colors truncate">
                        {manual.name}
                      </h3>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest truncate">{manual.uploadDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-3">
                    <span className="text-[8px] font-black text-hein-lime uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all hidden sm:inline">
                      View
                    </span>
                    <div className="w-7 h-7 rounded-lg border border-slate-100 dark:border-white/5 flex items-center justify-center group-hover:border-hein-lime transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-slate-300 group-hover:text-hein-lime transition-all">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualsView;
