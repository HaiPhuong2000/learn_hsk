import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const STORAGE_KEY = 'hsk-chat-history';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-10).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError('Không thể kết nối với AI. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    if (confirm('Bạn có chắc muốn xóa lịch sử chat?')) {
      setMessages([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
            Chat với AI
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Hỏi đáp về từ vựng, ngữ pháp, và luyện thi HSK
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="px-3 py-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors"
          >
            Xóa lịch sử
          </button>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 flex items-center justify-center">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Chào mừng đến Chat AI!</h3>
              <p className="text-slate-400 text-sm">
                Bạn có thể hỏi tôi về từ vựng HSK, ngữ pháp tiếng Trung, hoặc bất kỳ câu hỏi nào liên quan đến việc học tiếng Trung.
              </p>
              <div className="mt-6 space-y-2 text-left">
                <p className="text-xs text-slate-500">Ví dụ câu hỏi:</p>
                <div className="space-y-1">
                  <button
                    onClick={() => setInput('Sự khác biệt giữa 看 và 见 là gì?')}
                    className="block w-full text-left px-3 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-slate-300"
                  >
                    "Sự khác biệt giữa 看 và 见 là gì?"
                  </button>
                  <button
                    onClick={() => setInput('Giải thích ngữ pháp "把" sentence cho tôi')}
                    className="block w-full text-left px-3 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-slate-300"
                  >
                    "Giải thích ngữ pháp "把" sentence cho tôi"
                  </button>
                  <button
                    onClick={() => setInput('Cho tôi 5 từ vựng HSK 4 về chủ đề gia đình')}
                    className="block w-full text-left px-3 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-slate-300"
                  >
                    "Cho tôi 5 từ vựng HSK 4 về chủ đề gia đình"
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatBubble key={message.id} {...message} />
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                  <Loader2 size={18} className="animate-spin" />
                </div>
                <div className="bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-2.5">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-3">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập câu hỏi của bạn..."
            rows={1}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 outline-none resize-none max-h-32"
            style={{ minHeight: '24px' }}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
