import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, MessageSquare, Trash2, Edit2, Settings } from 'lucide-react';

interface SidebarProps {
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSettings }) => {
  const { history, setHistory, currentChatId, setCurrentChatId } = useAppContext();

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(chat => chat.id !== id));
    if (currentChatId === id) setCurrentChatId(null);
  };

  const renameChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTitle = prompt('Enter new title:');
    if (newTitle) {
      setHistory(prev => prev.map(chat => 
        chat.id === id ? { ...chat, title: newTitle } : chat
      ));
    }
  };

  return (
    <div className="w-72 bg-sidebar border-r border-border flex flex-col h-full overflow-hidden">
      <div className="p-4">
        <button
          onClick={createNewChat}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors border border-zinc-700"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {history.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setCurrentChatId(chat.id)}
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
              currentChatId === chat.id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span className="truncate text-sm font-medium flex-1">{chat.title}</span>
            
            <div className="hidden group-hover:flex items-center gap-1">
              <button
                onClick={(e) => renameChat(chat.id, e)}
                className="p-1 hover:text-white transition-colors"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => deleteChat(chat.id, e)}
                className="p-1 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-xl transition-all"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};
