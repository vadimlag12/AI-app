import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { X, Save, Trash2, Cpu } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey, selectedModel, setSelectedModel } = useAppContext();
  const [tempApiKey, setTempApiKey] = useState(apiKey || '');
  const [models, setModels] = useState<string[]>([
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768',
    'gemma2-9b-it'
  ]);

  useEffect(() => {
    if (apiKey) {
      fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          const modelIds = data.data.map((m: any) => m.id);
          setModels(modelIds);
        }
      })
      .catch(err => console.error('Failed to fetch models:', err));
    }
  }, [apiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(tempApiKey);
    onClose();
  };

  const handleDeleteKey = () => {
    if (confirm('Are you sure you want to delete your API key?')) {
      setApiKey(null);
      setTempApiKey('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto">
          {/* API Key Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-zinc-300">Groq API Key</label>
              {apiKey && (
                <button
                  onClick={handleDeleteKey}
                  className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete Key
                </button>
              )}
            </div>
            <input
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          {/* Model Selection */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              AI Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
            >
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
