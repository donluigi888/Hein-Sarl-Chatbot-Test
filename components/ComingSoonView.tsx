
import React from 'react';

interface ComingSoonViewProps {
  title: string;
  description: string;
  onBack: () => void;
}

const ComingSoonView: React.FC<ComingSoonViewProps> = ({ title, description, onBack }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
      <div className="mb-10">
        <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-hein-lime/10 border border-hein-lime/20 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-hein-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight uppercase">
        {title}
      </h2>
      
      <div className="max-w-md p-6 mb-8">
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <button
        onClick={onBack}
        className="flex items-center gap-2 px-6 py-3 bg-hein-dark dark:bg-hein-lime text-white dark:text-hein-dark text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-widest"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Chat
      </button>

      <div className="mt-16 flex justify-center gap-1.5">
        <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        <div className="w-1 h-1 rounded-full bg-hein-lime"></div>
        <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
      </div>
    </div>
  );
};

export default ComingSoonView;
