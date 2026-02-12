
import React, { useState, useRef } from 'react';
import { Language, Manual } from '../types';
import { translations } from '../translations';
import { saveManual } from '../services/storage.ts';

interface AdminModalProps {
  language: Language;
  isAuthenticated: boolean;
  manuals: Manual[];
  onClose: () => void;
  onSuccess: () => void;
  onUploadSuccess: (manual: Manual) => void;
  onDeleteManual: (id: string) => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ 
  language, 
  isAuthenticated, 
  manuals,
  onClose, 
  onSuccess, 
  onUploadSuccess,
  onDeleteManual
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language].admin;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const mockApiAuth = async (u: string, p: string) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (u === 'hein_admin' && p === 'HeinSàrl123$$') {
              resolve(true);
            } else {
              resolve(false);
            }
          }, 800);
        });
      };

      const isValid = await mockApiAuth(username, password);
      
      if (isValid) {
        onSuccess();
      } else {
        setError(t.invalidCreds);
      }
    } catch (err) {
      setError("Connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  const processFiles = async (files: FileList) => {
    if (files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
      alert("Only PDF files are allowed.");
      return;
    }

    setUploadStatus('uploading');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        
        const newManual: Manual = {
          id: Date.now().toString(),
          name: file.name.replace('.pdf', ''),
          url: base64Data,
          uploadDate: new Date().toISOString().split('T')[0]
        };
        
        // Persist to IndexedDB
        await saveManual(newManual);
        
        onUploadSuccess(newManual);
        setUploadStatus('success');
        setTimeout(() => setUploadStatus('idle'), 2000);
        
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload failed", err);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              {isAuthenticated ? "Document Management" : t.loginTitle}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t.username}</label>
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl text-sm focus:ring-2 focus:ring-hein-lime/20 focus:border-hein-lime transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t.password}</label>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl text-sm focus:ring-2 focus:ring-hein-lime/20 focus:border-hein-lime transition-all outline-none"
                />
              </div>

              {error && (
                <p className="text-xs font-bold text-red-500 text-center animate-shake">{error}</p>
              )}

              <p className="text-[10px] text-slate-500 text-center opacity-60">
                {t.helperText}
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all uppercase tracking-widest"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-4 bg-hein-dark text-white text-xs font-bold rounded-2xl hover:bg-black transition-all uppercase tracking-widest disabled:opacity-50"
                >
                  {isLoading ? "..." : t.signIn}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 overflow-hidden flex flex-col max-h-[70vh]">
              {/* Upload Area */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative group flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-[1.5rem] transition-all cursor-pointer shrink-0
                  ${isDragging ? 'border-hein-lime bg-hein-lime/5 scale-[1.01]' : 'border-slate-200 dark:border-white/10 hover:border-hein-lime/50 bg-slate-50/50 dark:bg-slate-800/40'}
                  ${uploadStatus === 'uploading' ? 'opacity-50 pointer-events-none' : ''}
                `}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="application/pdf"
                />
                
                <div className={`w-10 h-10 mb-2 rounded-xl flex items-center justify-center transition-colors ${uploadStatus === 'success' ? 'bg-green-100 text-green-600' : 'bg-hein-lime/10 text-hein-lime'}`}>
                  {uploadStatus === 'uploading' ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : uploadStatus === 'success' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  )}
                </div>
                
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1 uppercase tracking-tight">
                   {uploadStatus === 'uploading' ? 'Uploading...' : uploadStatus === 'success' ? 'Success!' : 'Upload New PDF'}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium text-center">
                   Drag & drop or click to browse
                </p>
              </div>

              {/* Management List */}
              <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3 px-1">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                     Library ({manuals.length})
                   </p>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-hide">
                  {manuals.length === 0 ? (
                    <div className="py-10 text-center border border-dashed border-slate-100 dark:border-white/5 rounded-2xl opacity-40">
                      <p className="text-[10px] font-bold uppercase tracking-widest">Repository empty</p>
                    </div>
                  ) : (
                    manuals.map((manual) => (
                      <div 
                        key={manual.id}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-transparent hover:border-hein-lime/30 transition-all group"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate pr-4">{manual.name}</h4>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest opacity-60">{manual.uploadDate}</p>
                        </div>
                        <button
                          onClick={() => onDeleteManual(manual.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all shrink-0"
                          title="Delete Manual"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2 shrink-0">
                <button
                  onClick={onClose}
                  className="w-full px-6 py-4 bg-hein-dark text-white text-xs font-bold rounded-2xl hover:bg-black transition-all uppercase tracking-widest"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
