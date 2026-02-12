import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Language, Theme, Message, ChatSession, ViewMode, Manual, ConnectionStatus } from './types';
import { translations } from './translations';
import { createHeinChat } from './services/n8n';
import { getAllManuals, deleteManual } from './services/storage';
import { checkWorkflowConnectivity } from './services/connectivity';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import HistoryView from './components/HistoryView';
import ComingSoonView from './components/ComingSoonView';
import ManualsView from './components/ManualsView';
import AdminModal from './components/AdminModal';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('hein_lang') as Language) || 'EN';
  });
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('hein_theme') as Theme) || 'light';
  });

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('hein_chats');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((c: any) => ({
        ...c,
        lastTimestamp: new Date(c.lastTimestamp),
        messages: c.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
      }));
    } catch (e) {
      return [];
    }
  });

  const [manuals, setManuals] = useState<Manual[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');
  
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  
  const chatRef = useRef<any>(null);

  // Connectivity Monitor
  useEffect(() => {
    const verifyConnection = async () => {
      const status = await checkWorkflowConnectivity();
      setConnectionStatus(status);
    };

    verifyConnection();
    const interval = setInterval(verifyConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Load manuals from IndexedDB on startup
  useEffect(() => {
    const loadManuals = async () => {
      try {
        const storedManuals = await getAllManuals();
        setManuals(storedManuals);
      } catch (err) {
        console.error("Failed to load manuals from storage:", err);
      }
    };
    loadManuals();
  }, []);

  const currentChat = chatSessions.find(s => s.id === currentChatId);
  const messages = currentChat?.messages || [];

  const startNewChat = useCallback(() => {
    chatRef.current = createHeinChat(language);
    setCurrentChatId(null);
    setViewMode('chat');
    setIsSidebarOpen(false);
  }, [language]);

  const resetToHome = useCallback(() => {
    setCurrentChatId(null);
    setViewMode('chat');
    setIsSidebarOpen(false);
  }, []);

  const selectChat = (id: string) => {
    setCurrentChatId(id);
    setViewMode('chat');
    chatRef.current = createHeinChat(language);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    localStorage.setItem('hein_chats', JSON.stringify(chatSessions));
  }, [chatSessions]);

  // When language changes, update localStorage and recreate chat ref
  useEffect(() => {
    localStorage.setItem('hein_lang', language);
    chatRef.current = createHeinChat(language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('hein_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    if (viewMode !== 'chat') setViewMode('chat');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    let activeId = currentChatId;
    
    if (!activeId) {
      activeId = Date.now().toString();
      const newSession: ChatSession = {
        id: activeId,
        title: content.slice(0, 40) + (content.length > 40 ? '...' : ''),
        messages: [userMsg],
        lastTimestamp: new Date()
      };
      setChatSessions(prev => [newSession, ...prev]);
      setCurrentChatId(activeId);
    } else {
      setChatSessions(prev => prev.map(s => 
        s.id === activeId 
          ? { ...s, messages: [...s.messages, userMsg], lastTimestamp: new Date() } 
          : s
      ));
    }

    setIsTyping(true);

    try {
      if (!chatRef.current) chatRef.current = createHeinChat(language);
      const response = await chatRef.current.sendMessage({ message: content });
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "Communication error.",
        timestamp: new Date(),
      };
      setChatSessions(prev => prev.map(s => 
        s.id === activeId 
          ? { ...s, messages: [...s.messages, assistantMsg], lastTimestamp: new Date() } 
          : s
      ));
    } catch (error) {
      console.error("n8n request failed:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "System Error: Could not reach the HEIN assistant. Please check your connection and try again.",
        timestamp: new Date(),
      };
      setChatSessions(prev => prev.map(s => 
        s.id === activeId 
          ? { ...s, messages: [...s.messages, errorMsg], lastTimestamp: new Date() } 
          : s
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const deleteChat = (id: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== id));
    if (currentChatId === id) setCurrentChatId(null);
  };

  const handleAdminSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('adminAuthenticated', 'true');
  };

  const handleManualUpload = (newManual: Manual) => {
    setManuals(prev => [newManual, ...prev]);
  };

  const handleDeleteManual = async (id: string) => {
    try {
      await deleteManual(id);
      setManuals(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const renderMainContent = () => {
    const currentTranslations = translations[language];
    switch (viewMode) {
      case 'history':
        return <HistoryView sessions={chatSessions} onSelectChat={selectChat} onDeleteChat={deleteChat} onNewChat={startNewChat} language={language} />;
      case 'manuals':
        return <ManualsView language={language} manuals={manuals} onBack={() => setViewMode('chat')} />;
      case 'technician':
        return (
          <ComingSoonView 
            title={currentTranslations.sidebar.errorCodes}
            description="Coming soon..."
            onBack={() => setViewMode('chat')}
          />
        );
      default:
        return (
          <ChatPanel 
            messages={messages}
            isTyping={isTyping}
            isTranslating={false}
            connectionStatus={connectionStatus}
            language={language}
            onSendMessage={handleSendMessage}
            onQuickAction={handleSendMessage}
            chatTitle={currentChat?.title}
            onRequestTechnician={() => setViewMode('technician')}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen w-full theme-transition p-2 md:p-4 gap-2 md:gap-4 overflow-hidden">
      <TopBar 
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        toggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        onNewChat={startNewChat}
        onLogoClick={resetToHome}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onSettingsClick={() => setIsAdminModalOpen(true)}
      />
      
      <div className="flex flex-1 overflow-hidden gap-4 rounded-3xl md:rounded-4xl">
        <Sidebar 
          language={language}
          setLanguage={setLanguage}
          onNewChat={startNewChat}
          onChatbotClick={resetToHome}
          onViewSelect={setViewMode}
          viewMode={viewMode}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 flex flex-col min-w-0 glass-card rounded-3xl md:rounded-4xl overflow-hidden shadow-2xl transition-all">
          {renderMainContent()}
        </main>
      </div>

      {isAdminModalOpen && (
        <AdminModal 
          language={language} 
          isAuthenticated={isAdminAuthenticated}
          manuals={manuals}
          onClose={() => setIsAdminModalOpen(false)} 
          onSuccess={handleAdminSuccess}
          onUploadSuccess={handleManualUpload}
          onDeleteManual={handleDeleteManual}
        />
      )}
    </div>
  );
};

export default App;
