
import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      let processed = line;
      
      const imgMatch = processed.match(/!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        return (
          <div key={i} className="my-4 md:my-6">
            <img 
              src={imgMatch[2]} 
              alt={imgMatch[1]} 
              className="max-w-full rounded-2xl md:rounded-3xl border border-white/20 shadow-lg"
            />
            {imgMatch[1] && <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2 md:mt-3 ml-2">{imgMatch[1]}</p>}
          </div>
        );
      }

      if (processed.startsWith('### ')) {
        return <h3 key={i} className="text-sm md:text-base font-bold mt-4 md:mt-6 mb-2 text-slate-900 dark:text-white tracking-tight break-words">{processed.replace('### ', '')}</h3>;
      }
      if (processed.startsWith('## ')) {
        return <h2 key={i} className="text-lg md:text-xl font-bold mt-6 md:mt-8 mb-3 md:mb-4 text-slate-900 dark:text-white tracking-tight break-words">{processed.replace('## ', '')}</h2>;
      }

      if (processed.trim().startsWith('- ')) {
        return <li key={i} className="ml-4 md:ml-6 list-disc text-slate-600 dark:text-slate-300 my-1.5 md:my-2 leading-relaxed break-words">{processed.replace(/^- /, '')}</li>;
      }
      if (processed.trim().startsWith('* ')) {
        return <li key={i} className="ml-4 md:ml-6 list-disc text-slate-600 dark:text-slate-300 my-1.5 md:my-2 leading-relaxed break-words">{processed.replace(/^\* /, '')}</li>;
      }

      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = processed.split(boldRegex);
      if (parts.length > 1) {
        return (
          <p key={i} className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 md:mb-4 break-words">
            {parts.map((p, index) => index % 2 === 1 ? <strong key={index} className="font-bold text-slate-900 dark:text-white">{p}</strong> : p)}
          </p>
        );
      }

      return <p key={i} className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3 md:mb-4 min-h-[1.2em] break-words">{processed}</p>;
    });
  };

  return (
    <div className={`flex w-full ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[90%] sm:max-w-[85%] md:max-w-[75%] group animate-in slide-in-from-bottom-2 duration-300`}>
        <div className={`
          relative px-4 py-4 md:px-6 md:py-5 rounded-[1.5rem] md:rounded-[2rem] shadow-sm transition-all
          ${isAssistant 
            ? 'bg-white/60 dark:bg-slate-800/40 border border-white dark:border-white/5 rounded-tl-lg' 
            : 'bg-hein-dark text-white rounded-tr-lg border border-slate-700'
          }
        `}>
          <div className="text-xs md:text-base whitespace-pre-wrap break-words overflow-hidden">
            {isAssistant ? renderContent(message.content) : <p className="leading-relaxed">{message.content}</p>}
          </div>
          
          <div className={`
            absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-[-16px]
            ${isAssistant ? 'left-2' : 'right-2'}
          `}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
