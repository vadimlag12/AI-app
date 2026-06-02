import React, { createContext, useContext, useState, useEffect } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
}

interface AppContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  history: ChatHistory[];
  setHistory: React.Dispatch<React.SetStateAction<ChatHistory[]>>;
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, _setApiKey] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load from electron-store
    window.electron.store.get('groq_api_key').then((key: any) => _setApiKey(key));
    window.electron.store.get('selected_model').then((model: any) => model && setSelectedModel(model));
    window.electron.store.get('chat_history').then((hist: any) => hist && setHistory(hist));
  }, []);

  const setApiKey = (key: string | null) => {
    _setApiKey(key);
    if (key) {
      window.electron.store.set('groq_api_key', key);
    } else {
      window.electron.store.delete('groq_api_key');
    }
  };

  useEffect(() => {
    window.electron.store.set('selected_model', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    if (history.length > 0) {
      window.electron.store.set('chat_history', history);
    }
  }, [history]);

  return (
    <AppContext.Provider value={{
      apiKey, setApiKey,
      selectedModel, setSelectedModel,
      history, setHistory,
      currentChatId, setCurrentChatId,
      isLoading, setIsLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

// Add types for window.electron
declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<void>;
        delete: (key: string) => Promise<void>;
      };
    };
  }
}
