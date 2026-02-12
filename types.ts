export type Language = 'EN' | 'FR' | 'DE' | 'NL';

export type Theme = 'light' | 'dark';

export type ViewMode = 'chat' | 'history' | 'manuals' | 'technician';

export type ConnectionStatus = 'checking' | 'connected' | 'disconnected';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastTimestamp: Date;
}

export interface Manual {
  id: string;
  name: string;
  url: string;
  uploadDate: string;
}

export interface TranslationSet {
  sidebar: {
    start: string;
    newChat: string;
    chatbot: string;
    askHint: string;
    quickTopics: string;
    history: string;
    manuals: string;
    errorCodes: string;
    exportChat: string;
    maintenance: string;
    requestService: string;
    privacyNote: string;
  };
  topBar: {
    title: string;
    subtitle: string;
    settings: string;
  };
  welcome: {
    title: string;
    description: string;
    heiniTitle: string;
    heiniSubtitle: string;
  };
  input: {
    placeholder: string;
    typing: string;
  };
  admin: {
    loginTitle: string;
    username: string;
    password: string;
    signIn: string;
    cancel: string;
    helperText: string;
    uploadBtn: string;
    uploadSuccess: string;
    uploadFail: string;
    invalidCreds: string;
  };
}
