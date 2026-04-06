import { useState, useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { LottieAnimation } from '@/components/animations/LottieAnimation';
import aiTutorLogo from '@/assets/ai-tutor-logo.json';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type Message = { role: 'user' | 'assistant'; content: string };

const MAX_MESSAGES = 5;
const WINDOW_HOURS = 4;
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`;

const suggestedPrompts = [
  "علمني أهم 10 كلمات إنجليزية للمبتدئين",
  "كيف أعرّف عن نفسي بالإنجليزية؟",
  "اشرح لي الفرق بين present simple و present continuous",
  "أعطني تمرين ترجمة من العربي للإنجليزي",
];

const AiTutor = () => {
  const { user, session, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [resetMinutes, setResetMinutes] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch remaining from database on mount
  const fetchUsage = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('ai_tutor_usage')
      .select('message_count, window_start')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Usage fetch error:', error);
      setRemaining(MAX_MESSAGES);
      return;
    }

    if (!data) {
      setRemaining(MAX_MESSAGES);
      setResetMinutes(null);
      return;
    }

    const now = new Date();
    const windowStart = new Date(data.window_start);
    const windowEnd = new Date(windowStart.getTime() + WINDOW_HOURS * 60 * 60 * 1000);

    if (now > windowEnd) {
      setRemaining(MAX_MESSAGES);
      setResetMinutes(null);
    } else {
      const left = Math.max(0, MAX_MESSAGES - data.message_count);
      setRemaining(left);
      if (left === 0) {
        setResetMinutes(Math.ceil((windowEnd.getTime() - now.getTime()) / 60000));
      } else {
        setResetMinutes(null);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

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
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: 'خطأ غير معروف' }));
        if (err.rateLimited) {
          setRemaining(0);
          setResetMinutes(err.resetMinutes);
        }
        throw new Error(err.error || 'حدث خطأ');
      }

      // After successful response, re-fetch usage from DB for accuracy
      // Also try header as immediate feedback
      const remainingHeader = resp.headers.get('X-Remaining-Messages');
      if (remainingHeader !== null) {
        const val = parseInt(remainingHeader, 10);
        if (!isNaN(val)) {
          setRemaining(val);
          if (val > 0) setResetMinutes(null);
        }
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
          } catch {
            // partial JSON
          }
        }
      }

      // Re-fetch from DB after stream completes for accurate count
      await fetchUsage();
    } catch (e) {
      console.error(e);
      toast({ title: 'خطأ', description: e instanceof Error ? e.message : 'حدث خطأ', variant: 'destructive' });
      // Re-fetch usage even on error to stay in sync
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
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-primary text-xl">جاري التحميل...</div></div>;
  }

  const isRateLimited = remaining !== null && remaining <= 0;

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Helmet>
        <title>المعلم الذكي - LingoArab</title>
        <meta name="description" content="تعلم اللغة الإنجليزية مع معلم ذكاء اصطناعي متخصص للناطقين بالعربية" />
      </Helmet>
      <Header showBack showUserInfo />

      <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
        {/* Remaining messages badge */}
        {remaining !== null && (
          <div className="flex justify-center pt-3 px-4">
            <div className={`text-xs px-3 py-1 rounded-full ${isRateLimited ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-secondary-foreground'}`}>
              {isRateLimited
                ? `⏳ وصلت للحد الأقصى — يتجدد بعد ${resetMinutes ?? '?'} دقيقة`
                : `💬 ${remaining} رسالة متبقية من ${MAX_MESSAGES}`}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-6 py-12">
              <div className="w-24 h-24">
                <LottieAnimation 
                  animationData={aiTutorLogo}
                  loop={true}
                  autoplay={true}
                  className="w-full h-full"
                />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">المعلم الذكي</h2>
                <p className="text-muted-foreground max-w-md">معلم ذكاء اصطناعي متخصص في تعليم الإنجليزية للناطقين بالعربية. اسألني أي سؤال!</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    disabled={isRateLimited}
                    className="text-sm text-right p-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-foreground disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-right [&>*]:text-inherit">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          {messages.length > 0 && (
            <div className="flex justify-center mb-2">
              <Button variant="ghost" size="sm" onClick={() => setMessages([])} className="text-muted-foreground">
                <Trash2 className="w-4 h-4 ml-1" /> مسح المحادثة
              </Button>
            </div>
          )}
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRateLimited ? "وصلت للحد الأقصى، انتظر التجديد..." : "اكتب سؤالك هنا..."}
              className="resize-none min-h-[44px] max-h-32 rounded-xl"
              rows={1}
              disabled={isLoading || isRateLimited}
            />
            <Button
              size="icon"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading || isRateLimited}
              className="rounded-xl h-11 w-11 flex-shrink-0"
            >
              <Send className="w-5 h-5 rotate-180" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AiTutor;
