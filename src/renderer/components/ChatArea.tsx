import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Send, StopCircle, User, Bot, Sparkles } from 'lucide-react';
import Groq from 'groq-sdk';

export const ChatArea: React.FC = () => {
  const { apiKey, selectedModel, history, setHistory, currentChatId, setCurrentChatId, isLoading, setIsLoading } = useAppContext();
  const [input, setInput] = useState('');
  const [streamingMessage, setStreamingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentChat = history.find(c => c.id === currentChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages, streamingMessage]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !apiKey || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    let chatId = currentChatId;
    let updatedHistory = history;

    if (!chatId) {
      chatId = Date.now().toString();
      const newChat = {
        id: chatId,
        title: userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : ''),
        messages: [{ role: 'user' as const, content: userMessage }],
        createdAt: Date.now()
      };
      updatedHistory = [newChat, ...history];
      setHistory(updatedHistory);
      setCurrentChatId(chatId);
    } else {
      // Add user message to history
      updatedHistory = history.map(chat => 
        chat.id === chatId ? { ...chat, messages: [...chat.messages, { role: 'user' as const, content: userMessage }] } : chat
      );
      setHistory(updatedHistory);
    }

    setIsLoading(true);
    setStreamingMessage('');
    abortControllerRef.current = new AbortController();

    try {
      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
      const currentChatState = updatedHistory.find(c => c.id === chatId);
      const currentMessages = currentChatState?.messages || [];
      const allMessages = currentMessages;

      const stream = await groq.chat.completions.create({
        messages: allMessages.map(m => ({ role: m.role, content: m.content })),
        model: selectedModel,
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        if (abortControllerRef.current?.signal.aborted) break;
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        setStreamingMessage(fullResponse);
      }

      if (!abortControllerRef.current?.signal.aborted) {
        // Save assistant message to history
        setHistory(prev => prev.map(chat => 
          chat.id === chatId ? { ...chat, messages: [...chat.messages, { role: 'assistant', content: fullResponse }] } : chat
        ));
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      alert(error.message || 'An error occurred during chat generation.');
    } finally {
      setIsLoading(false);
      setStreamingMessage('');
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const promptSuggestions = [
    "Write a Python script to scrape a website",
    "Explain quantum physics in simple terms",
    "How do I package an Electron app for Linux?",
    "Write a creative short story about a time traveler"
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {!currentChat && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-blue-500" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">What can I help with?</h1>
              <p className="text-zinc-400 mb-8 max-w-md">
                I'm powered by Groq's lightning-fast inference. Ask me anything or try a suggestion below.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                {promptSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(s)}
                    className="p-4 text-left bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 hover:bg-zinc-800 transition-all text-sm text-zinc-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentChat?.messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-100'
              }`}>
                <MarkdownRenderer content={msg.content} />
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-5 h-5 text-zinc-400" />
                </div>
              )}
            </div>
          ))}

          {streamingMessage && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="max-w-[85%] rounded-2xl px-5 py-3 bg-zinc-900 border border-zinc-800 text-zinc-100">
                <MarkdownRenderer content={streamingMessage} />
                <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="max-w-3xl mx-auto relative group">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message Groq..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-4 pr-12 py-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none overflow-hidden"
          />
          <div className="absolute right-2 bottom-2.5">
            {isLoading ? (
              <button
                onClick={handleStop}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors"
                title="Stop generating"
              >
                <StopCircle className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="p-2 bg-white text-black rounded-xl hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] text-zinc-600">
          AI can make mistakes. Consider checking important information. Powered by Groq.
        </p>
      </div>
    </div>
  );
};
