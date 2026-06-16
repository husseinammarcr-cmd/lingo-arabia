import { useState, useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Keyboard, Mic, X, Send, Trash2 } from 'lucide-react';
import Lottie from 'lottie-react';
import orbAnimation from '@/assets/orb.json';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import '@/styles/AiTutorOrb.css';

type Message = { role: 'user' | 'assistant'; content: string };

const MAX_MESSAGES = 5;
const WINDOW_HOURS = 4;
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`;

const suggestedPrompts = [
  'علمني أهم 10 كلمات إنجليزية للمبتدئين',
  'كيف أعرّف عن نفسي بالإنجليزية؟',
  'اشرح لي الفرق بين present simple و present continuous',
  'أعطني تمرين ترجمة من العربي للإنجليزي',
];

const AiTutor = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [resetMinutes, setResetMinutes] = useState<number | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchUsage = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('ai_tutor_usage')
      .select('message_count, window_start')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) { setRemaining(MAX_MESSAGES); return; }
    if (!data) { setRemaining(MAX_MESSAGES); setResetMinutes(null); return; }
    const now = new Date();
    const windowStart = new Date(data.window_start);
    const windowEnd = new Date(windowStart.getTime() + WINDOW_HOURS * 60 * 60 * 1000);
    if (now > windowEnd) { setRemaining(MAX_MESSAGES); setResetMinutes(null); }
    else {
      const left = Math.max(0, MAX_MESSAGES - data.message_count);
      setRemaining(left);
      setResetMinutes(left === 0 ? Math.ceil((windowEnd.getTime() - now.getTime()) / 60000) : null);
    }
  }, [user]);

  useEffect(() => { fetchUsage(); }, [fetchUsage]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    if (remaining !== null && remaining <= 0) {
      toast({ title: 'حد الرسائل', description: `وصلت للحد الأقصى. يتم التجديد بعد ${resetMinutes ?? '?'} دقيقة.`, variant: 'destructive' });
      return;
    }
    const userMsg: Message = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    let assistantContent = '';
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const token = currentSession?.access_token;
      if (!token) throw new Error('يرجى تسجيل الدخول أولاً');
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: newMessages }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'خطأ غير معروف' }));
        if (err.rateLimited) { setRemaining(0); setResetMinutes(err.resetMinutes); }
        throw new Error(err.error || 'حدث خطأ');
      }
      const remainingHeader = resp.headers.get('X-Remaining-Messages');
      if (remainingHeader !== null) {
        const val = parseInt(remainingHeader, 10);
        if (!isNaN(val)) { setRemaining(val); if (val > 0) setResetMinutes(null); }
      }
      if (!resp.body) throw new Error('No response body');
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch { /* partial */ }
        }
      }
      await fetchUsage();
    } catch (e) {
      toast({ title: 'خطأ', description: e instanceof Error ? e.message : 'حدث خطأ', variant: 'destructive' });
      await fetchUsage();
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-black"><div className="animate-pulse text-[#D6FF4B] text-xl">جاري التحميل...</div></div>;
  }

  const isRateLimited = remaining !== null && remaining <= 0;
  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  const promptText = lastAssistant?.content || lastUser?.content || 'اسألني أي شيء عن اللغة الإنجليزية وسأساعدك في تعلمها';

  return (
    <div className="ai-buddy-screen min-h-screen relative overflow-hidden flex flex-col" dir="rtl">
      <Helmet>
        <title>المعلم الذكي بالذكاء الاصطناعي | Lingo Arab</title>
        <meta name="description" content="تعلم اللغة الإنجليزية مع معلم ذكاء اصطناعي متخصص للناطقين بالعربية." />
        <link rel="canonical" href="https://lingoarab.com/ai-tutor" />
      </Helmet>

      {/* Topographic decorative lines (top-left corner in RTL = visual top-right) */}
      <svg className="topo-lines absolute top-0 left-0 w-72 h-72 opacity-30 pointer-events-none" viewBox="0 0 300 300" fill="none">
        <path d="M-20 40 Q 80 20 180 60 T 340 80" stroke="#D6FF4B" strokeWidth="0.6" />
        <path d="M-20 70 Q 80 50 180 90 T 340 110" stroke="#D6FF4B" strokeWidth="0.6" opacity="0.8" />
        <path d="M-20 100 Q 80 80 180 120 T 340 140" stroke="#D6FF4B" strokeWidth="0.6" opacity="0.6" />
        <path d="M-20 130 Q 80 110 180 150 T 340 170" stroke="#D6FF4B" strokeWidth="0.6" opacity="0.4" />
        <path d="M-20 160 Q 80 140 180 180 T 340 200" stroke="#D6FF4B" strokeWidth="0.6" opacity="0.3" />
      </svg>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-5">
        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white">
          المعلم الذكي
        </div>
        <div className="flex items-center gap-2 text-xs text-white/80">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D6FF4B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D6FF4B]"></span>
          </span>
          متصل
        </div>
      </div>

      {/* Remaining badge */}
      {remaining !== null && (
        <div className="relative z-10 flex justify-center mt-3 px-4">
          <div className={`text-xs px-3 py-1 rounded-full ${isRateLimited ? 'bg-red-500/15 text-red-300' : 'bg-white/5 text-white/70 border border-white/10'}`}>
            {isRateLimited
              ? `⏳ يتجدد بعد ${resetMinutes ?? '?'} دقيقة`
              : `💬 ${remaining}/${MAX_MESSAGES} رسالة متبقية`}
          </div>
        </div>
      )}

      {/* Center: orb + prompt */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <div className="orb-wrap">
          <div className="orb-glow" />
          <Lottie animationData={orbAnimation} loop autoplay style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }} />
        </div>

        <div className="mt-6 max-w-md text-center">
          {messages.length === 0 ? (
            <p className="text-white/90 text-lg leading-relaxed">
              ما هي{' '}
              <span className="text-[#D6FF4B]">أفضل طريقة</span>{' '}
              لتعلم{' '}
              <span className="text-[#D6FF4B]">اللغة الإنجليزية</span>{' '}
              بسرعة وفعالية؟
            </p>
          ) : lastAssistant ? (
            <div className="text-white/90 text-sm leading-relaxed max-h-40 overflow-y-auto prose prose-sm prose-invert max-w-none text-right [&_*]:text-inherit">
              <ReactMarkdown>{lastAssistant.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-white/70 text-sm">{isLoading ? 'جاري التفكير...' : promptText}</p>
          )}
        </div>

        {/* Suggested prompts (only when empty) */}
        {messages.length === 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
            {suggestedPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => sendMessage(p)}
                disabled={isRateLimited || isLoading}
                className="text-xs text-right p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-colors text-white/80 disabled:opacity-40"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Keyboard input drawer */}
      {showKeyboard && (
        <div className="relative z-20 px-5 pb-3">
          <div className="flex gap-2 items-end max-w-md mx-auto">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRateLimited ? 'وصلت للحد الأقصى...' : 'اكتب سؤالك...'}
              className="resize-none min-h-[44px] max-h-32 rounded-xl bg-white/[0.04] border-white/10 text-white placeholder:text-white/40"
              rows={1}
              disabled={isLoading || isRateLimited}
              autoFocus
            />
            <Button
              size="icon"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading || isRateLimited}
              className="rounded-xl h-11 w-11 flex-shrink-0 bg-[#D6FF4B] hover:bg-[#C0E840] text-black"
            >
              <Send className="w-5 h-5 rotate-180" />
            </Button>
          </div>
        </div>
      )}

      {/* Bottom controls */}
      <div className="relative z-10 flex items-center justify-center gap-8 pb-10 pt-4">
        <button
          className="circle-btn"
          aria-label="لوحة المفاتيح"
          onClick={() => setShowKeyboard(s => !s)}
        >
          <Keyboard className="w-5 h-5" />
        </button>

        <div className="mic-btn-wrap">
          <span className="pulse-ring ring-1" />
          <span className="pulse-ring ring-2" />
          <span className="pulse-ring ring-3" />
          <button
            className="mic-btn"
            aria-label="الميكروفون"
            onClick={() => toast({ title: 'قريباً', description: 'الإدخال الصوتي قيد التطوير. استخدم لوحة المفاتيح حالياً.' })}
          >
            <Mic className="w-7 h-7" />
          </button>
        </div>

        <button
          className="circle-btn"
          aria-label="إغلاق"
          onClick={() => {
            if (messages.length > 0) setMessages([]);
            else navigate(-1);
          }}
        >
          {messages.length > 0 ? <Trash2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default AiTutor;
