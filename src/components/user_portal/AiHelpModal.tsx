import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ExternalLink,
  Zap,
  LogIn,
  CreditCard,
  FileCheck2,
  FileText,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { WhatsAppIcon } from './UserNavbar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isFallback?: boolean;
  actions?: Array<{
    type: 'registration_link' | 'open_login' | 'open_payment' | 'open_pyqs' | 'open_bureau';
    label: string;
  }>;
}

interface AiHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStream: string;
  studentName?: string;
  adminMobile?: string;
  onOpenAuth?: () => void;
  onOpenPayment?: () => void;
  onNavigate?: (section: string) => void;
}

export const AiHelpModal: React.FC<AiHelpModalProps> = ({
  isOpen,
  onClose,
  selectedStream,
  studentName,
  adminMobile = '+91 89174 08498',
  onOpenAuth,
  onOpenPayment,
  onNavigate,
}) => {
  const REGISTRATION_URL = 'https://mychse12thclasse.netlify.app';

  const defaultWelcomeMessage: Message = {
    id: 'welcome',
    role: 'assistant',
    content: `ନମସ୍କାର${studentName ? ` ${studentName}` : ''}! ମୁଁ **MY CHSE 12TH CLASSES** ର Official AI Study & Portal Assistant (AI ସହାୟକ)।

ମୁଁ ଆପଣଙ୍କୁ ପୋର୍ଟାଲ୍‌ର ସମସ୍ତ ସୁବିଧା ଏବଂ ପାଠ୍ୟକ୍ରମରେ ସାହାଯ୍ୟ କରିପାରିବି:

1. **Student Registration**: ନୂଆ ଛାତ୍ରଛାତ୍ରୀ କିପରି ଅଫିସିଆଲ୍ ୱେବସାଇଟ୍‌ରେ ରେଜିଷ୍ଟ୍ରେସନ୍ କରିବେ।
2. **Students Login & OTP Verification**: Registration Number ପ୍ରବେଶ କରି ମୋବାଇଲ୍ OTP ଦ୍ୱାରା ଲଗଇନ୍।
3. **2026-27 Pass Plans**: Arts (₹99), Science (₹149) ଏବଂ Commerce (₹149) ପାସ୍ ସୂଚନା।
4. **Bureau Books & 10-Yr PYQs**: ବୋର୍ଡ ପରୀକ୍ଷା ଉତ୍ତର ଓ ନୋଟ୍ସ।

ତଳେ ଦିଆଯାଇଥିବା ବଟନ୍ ବ୍ୟବହାର କରିପାରିବେ କିମ୍ବା ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଲେଖି ପଚାରିପାରିବେ:`,
    timestamp: 'Just now',
    actions: [
      { type: 'registration_link', label: '🔗 Open Registration Website' },
      { type: 'open_login', label: '🔑 Students Login' },
      { type: 'open_payment', label: '💳 View Plans (₹99 / ₹149)' },
    ],
  };

  const [messages, setMessages] = useState<Message[]>([defaultWelcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '📝 Registration କେମିତି କରିବି?', query: 'How to register on student registration website and get registration number?' },
    { label: '🔑 Students Login & OTP', query: 'How to do Students Login using Registration Number and Mobile OTP?' },
    { label: '💳 Arts (₹99), Sci/Comm (₹149)', query: 'What are the subscription plans for Arts ₹99, Science ₹149 and Commerce ₹149?' },
    { label: '📚 Bureau Books & PYQs', query: 'How can I access Bureau Books and 10-Yr Solved PYQs in this portal?' },
    { label: '⚡ Physics/Chemistry 5-Marks', query: `Important 5-mark repeated questions in ${selectedStream} for 2026` },
    { label: '🎯 Score 90%+ in CHSE', query: 'How to score 90%+ in CHSE Odisha 12th Board Exams?' },
  ];

  const detectActions = (text: string, query: string): Message['actions'] => {
    const actions: Message['actions'] = [];
    const combined = (text + ' ' + query).toLowerCase();

    if (combined.includes('register') || combined.includes('registration') || combined.includes('website') || combined.includes('ରେଜିଷ୍ଟ୍ରେସନ୍')) {
      actions.push({ type: 'registration_link', label: '🔗 Visit Registration Portal' });
    }
    if (combined.includes('login') || combined.includes('verify') || combined.includes('otp') || combined.includes('reg no') || combined.includes('ଲଗଇନ୍')) {
      actions.push({ type: 'open_login', label: '🔑 Open Students Login' });
    }
    if (combined.includes('plan') || combined.includes('99') || combined.includes('149') || combined.includes('payment') || combined.includes('ପ୍ଲାନ୍')) {
      actions.push({ type: 'open_payment', label: '💳 Unlock Pass (₹99 / ₹149)' });
    }
    if (combined.includes('pyq') || combined.includes('bureau') || combined.includes('question paper')) {
      actions.push({ type: 'open_pyqs', label: '📖 Open 10-Yr PYQs' });
      actions.push({ type: 'open_bureau', label: '📚 Open Bureau Books' });
    }

    return actions.length > 0 ? actions : undefined;
  };

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/ask-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          stream: selectedStream,
          studentName: studentName || 'CHSE Student',
          history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (data.success && data.answer) {
        const actions = detectActions(data.answer, q);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: data.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isFallback: data.isFallback,
            actions,
          },
        ]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch {
      const fallbackText = `ନମସ୍କାର! ଆପଣଙ୍କର ପ୍ରଶ୍ନର ଉତ୍ତର:

1. **Student Registration**: ଛାତ୍ରଛାତ୍ରୀ ପ୍ରଥମେ ${REGISTRATION_URL} ରେ ରେଜିଷ୍ଟ୍ରେସନ୍ କରି Registration Number ପାଇବେ।
2. **Students Login**: ୩-ଡଟ୍ ମେନୁ (⋮) ➔ Students Login ➔ Reg No ଲେଖି OTP Verify କରନ୍ତୁ।
3. **Course Pass Plans**: Arts ₹99, Science ₹149, Commerce ₹149।
4. **Faculty WhatsApp Support**: ${adminMobile} ରେ ଯୋଗାଯୋଗ କରନ୍ତୁ।`;

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isFallback: true,
          actions: [
            { type: 'registration_link', label: '🔗 Open Registration Website' },
            { type: 'open_login', label: '🔑 Students Login' },
            { type: 'open_payment', label: '💳 View Plans' },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (type: string) => {
    if (type === 'registration_link') {
      window.open(REGISTRATION_URL, '_blank', 'noopener,noreferrer');
    } else if (type === 'open_login') {
      onOpenAuth?.();
    } else if (type === 'open_payment') {
      onOpenPayment?.();
    } else if (type === 'open_pyqs') {
      onNavigate?.('pyqs');
    } else if (type === 'open_bureau') {
      onNavigate?.('bureau_books');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([defaultWelcomeMessage]);
  };

  const waPhone = adminMobile.replace(/[^0-9]/g, '');
  const directWaUrl = `https://api.whatsapp.com/send?phone=${
    waPhone.length === 10 ? '91' + waPhone : waPhone || '918917408498'
  }&text=${encodeURIComponent(
    `Namaskar Sir! I need help with MY CHSE Classes (${selectedStream} Stream): ${input || 'General inquiry'}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-slate-900 p-4 border-b border-purple-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-950/50 border border-purple-300/40">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white tracking-tight flex items-center space-x-1.5">
                  <span>CHSE AI Study & Portal Help</span>
                  <span className="text-xs text-purple-300 font-normal">(AI ସହାୟକ)</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                  {selectedStream}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center space-x-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Registration • Login • Plans (₹99/₹149) • Syllabus</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleClear}
              title="Reset Chat"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Portal Shortcuts Ribbon */}
        <div className="px-3 py-2 bg-slate-950/80 border-b border-slate-800/90 flex items-center justify-between text-xs overflow-x-auto no-scrollbar gap-2 shrink-0">
          <div className="flex items-center space-x-1.5 shrink-0">
            <a
              href={REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] transition-all"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Register on Official Portal</span>
              <ExternalLink className="w-3 h-3 text-emerald-400" />
            </a>
            {onOpenAuth && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-blue-300 font-bold text-[11px] transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span>Students Login</span>
              </button>
            )}
            {onOpenPayment && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPayment();
                }}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 font-bold text-[11px] transition-all cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>Pass: Arts ₹99 | Sci ₹149</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950/50 border-b border-slate-800 overflow-x-auto flex items-center space-x-2 no-scrollbar shrink-0">
          <span className="text-[11px] text-purple-400 font-bold uppercase tracking-wider flex items-center space-x-1 shrink-0">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Ask:</span>
          </span>
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.query)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 border border-slate-700/80 hover:border-purple-500/50 whitespace-nowrap transition-all cursor-pointer shrink-0"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${
                msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
                    : 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-md shadow-purple-950/50'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-950/40'
                    : 'bg-slate-800/95 text-slate-200 border border-slate-700/70 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-slate-100">{msg.content}</div>

                {/* Interactive Action Buttons if attached to AI response */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                    {msg.actions.map((act, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleActionClick(act.type)}
                        className="px-2.5 py-1 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-purple-200 hover:text-white font-bold text-[11px] flex items-center space-x-1 transition-all cursor-pointer shadow-sm"
                      >
                        <span>{act.label}</span>
                        <ChevronRight className="w-3 h-3 text-purple-400" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-2 pt-1 border-t border-slate-700/40 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="flex items-center space-x-1 hover:text-white transition-colors cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-800/90 border border-purple-500/30 rounded-2xl rounded-tl-none p-3.5 text-xs text-purple-300 flex items-center space-x-2">
                <span className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                  <span
                    className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></span>
                </span>
                <span className="text-slate-300 font-medium">
                  CHSE AI is analyzing your inquiry & drafting instant assistance...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about registration, login, pass fees (₹99/₹149), or syllabus..."
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>

          {/* Footer note & faculty escalation */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Official MY CHSE 12TH CLASSES Assistant</span>
            </span>
            <a
              href={directWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1 hover:underline"
            >
              <WhatsAppIcon className="w-3 h-3 fill-current" />
              <span>Contact Faculty on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
