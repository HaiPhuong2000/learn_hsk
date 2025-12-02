import React from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ role, content, timestamp }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {/* Avatar */}
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-indigo-500' : 'bg-teal-500'
      }`}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      {/* Message Container */}
      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isUser
              ? 'bg-indigo-500/20 border border-indigo-500/30'
              : 'bg-slate-800/50 border border-white/10'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
        </div>

        {/* Timestamp and Actions */}
        <div className={`flex items-center gap-2 px-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-slate-500">{formatTime(timestamp)}</span>
          
          {!isUser && (
            <button
              onClick={handleCopy}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1"
              title="Copy message"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
