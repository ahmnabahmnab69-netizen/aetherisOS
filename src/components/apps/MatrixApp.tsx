import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  Copy, 
  Check, 
  Cpu, 
  FileText, 
  Table, 
  Presentation, 
  Kanban, 
  Palette,
  Terminal,
  Zap,
  CornerDownLeft,
  AlertCircle
} from 'lucide-react';
import { sound } from '../../utils/sound';
import { MatrixGlassIcon } from '../desktop/LiquidIcons';
import { AppId } from '../../types/os';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface MatrixAppProps {
  onLaunchApp?: (appId: AppId) => void;
}

export const MatrixApp: React.FC<MatrixAppProps> = ({ onLaunchApp }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Greetings. I am **Matrix AI**, the cybernetic intelligence and operating system co-pilot of **Aetheris Liquid OS**.

I am connected to your productivity suite and neural desktop. How may I assist your workflow today?
- **Office Suite**: Document drafting, financial Excel formulas, PowerPoint presentation structures, and Notion sprint boards.
- **System & Creative**: Optical glass shaders, fluid simulation mechanics, code architecture, and high-level reasoning.`,
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || isLoading) return;

    sound.playClick();
    setErrorStatus(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/matrix/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.reply || 'No output received from Matrix AI neural core.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      sound.playNotification();
      setMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      console.error('Matrix AI query failed:', err);
      setErrorStatus(err?.message || 'Neural connection interrupted. Please try again.');
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `⚠️ **Neural Link Exception**: ${err?.message || 'Failed to complete query'}\n\n*Tip*: If this is your first time using Gemini API, ensure your key is active in the environment or Settings panel.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text: string, id: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    sound.playClick();
    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'model',
        content: 'Neural history cleared. Matrix AI core standby for new directives.',
        timestamp: 'Just now',
      },
    ]);
  };

  const quickPrompts = [
    { label: 'Excel Formula', prompt: 'Write an Excel formula to calculate a 15% compound quarterly growth with weighted variance.', icon: <Table className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: 'Executive Memo', prompt: 'Draft a concise executive strategy memo for our next-generation liquid glass design system.', icon: <FileText className="w-3.5 h-3.5 text-sky-400" /> },
    { label: 'Slide Deck Plan', prompt: 'Outline a 6-slide presentation deck pitching Aetheris Virtual Operating System to investors.', icon: <Presentation className="w-3.5 h-3.5 text-amber-400" /> },
    { label: 'Fluid Shader', prompt: 'Explain the mathematics of fluid advection and diffusion used in our background canvas.', icon: <Zap className="w-3.5 h-3.5 text-violet-400" /> },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-slate-950/80 backdrop-blur-2xl text-slate-100 select-none overflow-hidden">
      {/* Top Status Bar */}
      <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between shrink-0 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 flex items-center justify-center drop-shadow-md">
            <MatrixGlassIcon size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">Matrix AI</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                gemini-3.8-flash
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Cybernetic Operating System Co-Pilot</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onLaunchApp && (
            <div className="hidden sm:flex items-center gap-1 border-r border-white/10 pr-2">
              <button
                onClick={() => onLaunchApp('word')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Open Word"
              >
                <FileText className="w-3.5 h-3.5 text-sky-400" />
              </button>
              <button
                onClick={() => onLaunchApp('excel')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Open Excel"
              >
                <Table className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button
                onClick={() => onLaunchApp('powerpoint')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Open PowerPoint"
              >
                <Presentation className="w-3.5 h-3.5 text-amber-400" />
              </button>
              <button
                onClick={() => onLaunchApp('notion')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Open Notion"
              >
                <Kanban className="w-3.5 h-3.5 text-zinc-300" />
              </button>
            </div>
          )}

          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-xl shrink-0 flex items-center justify-center border shadow-md ${
                  isUser
                    ? 'bg-sky-500/20 border-sky-400/40 text-sky-200'
                    : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className={`relative group max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed border shadow-xl ${
                isUser
                  ? 'bg-sky-600/25 border-sky-400/35 text-white backdrop-blur-xl rounded-tr-xs'
                  : 'bg-slate-900/85 border-white/15 text-slate-100 backdrop-blur-2xl rounded-tl-xs'
              }`}>
                {/* Copy button */}
                <button
                  onClick={() => handleCopy(msg.content, msg.id)}
                  className="absolute top-2 right-2 p-1 rounded-md bg-white/10 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy text"
                >
                  {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>

                {/* Message Body with clean markdown rendering */}
                <div className="space-y-2 whitespace-pre-wrap font-sans selection:bg-sky-500/40">
                  {msg.content.split('\n\n').map((paragraph, pIdx) => {
                    // Check if code block
                    if (paragraph.startsWith('```')) {
                      const lines = paragraph.split('\n');
                      const codeContent = lines.slice(1, lines[lines.length - 1] === '```' ? -1 : undefined).join('\n');
                      return (
                        <div key={pIdx} className="my-2 p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] overflow-x-auto text-sky-200">
                          <code>{codeContent}</code>
                        </div>
                      );
                    }
                    return (
                      <p key={pIdx}>
                        {paragraph}
                      </p>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end gap-2 mt-2 pt-1 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3 max-w-xl animate-in fade-in">
            <div className="w-7 h-7 rounded-xl shrink-0 flex items-center justify-center bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="rounded-2xl p-3.5 rounded-tl-xs bg-slate-900/85 border border-white/15 text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-emerald-300 text-[11px]">Matrix AI is processing neural query...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto border-t border-white/10 bg-white/[0.02]">
        <span className="text-[10px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-400" />
          Quick Actions:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors shrink-0 disabled:opacity-40"
          >
            {qp.icon}
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-white/10 bg-slate-950/90">
        <div className="relative flex items-center rounded-2xl bg-white/5 border border-white/15 focus-within:border-sky-400/80 focus-within:ring-2 focus-within:ring-sky-400/20 transition-all p-1.5 shadow-inner">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Matrix AI anything, request code, formulas, or draft office docs..."
            className="flex-1 bg-transparent border-0 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none max-h-32 min-h-[36px]"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              input.trim() && !isLoading
                ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg cursor-pointer scale-100'
                : 'bg-white/5 text-slate-500 cursor-not-allowed opacity-50'
            }`}
            title="Send Message (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between px-2 pt-1.5 text-[10px] text-slate-500 font-mono">
          <span>Press Enter to send · Shift+Enter for new line</span>
          <span>Matrix OS Core v3.8</span>
        </div>
      </div>
    </div>
  );
};
