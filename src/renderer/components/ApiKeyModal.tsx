import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Key, ArrowRight } from 'lucide-react';

export const ApiKeyModal: React.FC = () => {
  const { apiKey, setApiKey } = useAppContext();
  const [inputKey, setInputKey] = useState('');

  if (apiKey) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim().startsWith('gsk_')) {
      setApiKey(inputKey.trim());
    } else {
      alert('Please enter a valid Groq API key (starts with gsk_)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
            <Key className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to GroqChat</h2>
          <p className="text-zinc-400">
            Enter your Groq API key to get started. Your key is stored securely on your machine.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              placeholder="gsk_..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Don't have an API key? Get one at{' '}
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            console.groq.com
          </a>
        </p>
      </div>
    </div>
  );
};
