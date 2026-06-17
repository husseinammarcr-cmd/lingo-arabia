import { useState, useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Phone, PhoneOff, X, Trash2 } from 'lucide-react';
import Lottie from 'lottie-react';
import orbAnimation from '@/assets/orb.json';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import '@/styles/AiTutorOrb.css';

type ChatMsg =
  | { role: 'user'; text: string }
  | { role: 'assistant'; text: string; correction?: string; tip?: string };

type CallStatus = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking';

const WS_URL = 'wss://api.lingoarab.com/ws';

const SCENARIOS = [
  { id: 'restaurant', label: 'مطعم', emoji: '🍽️' },
  { id: 'airport', label: 'مطار', emoji: '✈️' },
  { id: 'hotel', label: 'فندق', emoji: '🏨' },
  { id: 'shopping', label: 'تسوق', emoji: '🛍️' },
];

const STATUS_MAP: Record<CallStatus, { label: string; color: string; emoji: string }> = {
  idle: { label: '', color: '', emoji: '' },
  connecting: { label: 'جاري الاتصال...', color: 'bg-white/10 text-white/80', emoji: '⏳' },
  listening: { label: 'يسمعك', color: 'bg-cyan-500/15 text-cyan-300', emoji: '👂' },
  thinking: { label: 'يفكر', color: 'bg-yellow-500/15 text-yellow-300', emoji: '🤔' },
  speaking: { label: 'يتكلم', color: 'bg-blue-500/15 text-blue-300', emoji: '🗣️' },
};

const AiTutor = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [scenario, setScenario] = useState('restaurant');
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [partialText, setPartialText] = useState('');

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playerCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partialText]);

  const inCall = callStatus !== 'idle';

  const playAudio = useCallback(async (b64: string) => {
    try {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      if (!playerCtxRef.current) {
        playerCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = playerCtxRef.current;
      const buf = await ctx.decodeAudioData(bytes.buffer.slice(0));
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
    } catch (e) {
      console.error('audio decode error', e);
    }
  }, []);

  const cleanup = useCallback(() => {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close().catch(() => {});
    processorRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    audioCtxRef.current = null;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) wsRef.current.close();
    wsRef.current = null;
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const startCall = useCallback(async () => {
    if (inCall) return;
    setCallStatus('connecting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 } as MediaTrackConstraints,
      });
      streamRef.current = stream;

      const ws = new WebSocket(WS_URL);
      ws.binaryType = 'arraybuffer';
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'start_call', scenario }));
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        sourceRef.current = source;
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;
        processor.onaudioprocess = (e) => {
          if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
          const input = e.inputBuffer.getChannelData(0);
          const i16 = new Int16Array(input.length);
          for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            i16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
          }
          wsRef.current.send(i16.buffer);
        };
        source.connect(processor);
        processor.connect(ctx.destination);
        setCallStatus('listening');
      };

      ws.onmessage = (ev) => {
        if (typeof ev.data !== 'string') return;
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'status') setCallStatus(msg.value);
          else if (msg.type === 'partial_text') setPartialText(msg.text || '');
          else if (msg.type === 'user_text') {
            setPartialText('');
            setMessages(prev => [...prev, { role: 'user', text: msg.text }]);
          } else if (msg.type === 'ai_text') {
            setMessages(prev => [...prev, { role: 'assistant', text: msg.reply, correction: msg.correction, tip: msg.tip }]);
          } else if (msg.type === 'audio') {
            playAudio(msg.audio);
          }
        } catch (e) { console.error('ws parse', e); }
      };

      ws.onerror = () => {
        toast({ title: 'خطأ في الاتصال', description: 'تعذر الاتصال بالخادم', variant: 'destructive' });
      };
      ws.onclose = () => {
        cleanup();
        setCallStatus('idle');
        setPartialText('');
      };
    } catch (e) {
      toast({ title: 'الميكروفون', description: 'تعذر الوصول للميكروفون', variant: 'destructive' });
      cleanup();
      setCallStatus('idle');
    }
  }, [inCall, scenario, playAudio, cleanup]);

  const endCall = useCallback(() => {
    cleanup();
    setCallStatus('idle');
    setPartialText('');
  }, [cleanup]);

  const onScenarioChange = (id: string) => {
    setScenario(id);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'scenario', scenario: id }));
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-black"><div className="animate-pulse text-[#D6FF4B] text-xl">جاري التحميل...</div></div>;
  }

  const status = STATUS_MAP[callStatus];

  return (
    <div className="ai-buddy-screen min-h-screen relative overflow-hidden flex flex-col" dir="rtl">
      <Helmet>
        <title>المكالمة الحية مع المعلم الذكي | Lingo Arab</title>
        <meta name="description" content="تدرّب على المحادثة بالإنجليزية في مكالمة حية مع معلم ذكاء اصطناعي." />
        <link rel="canonical" href="https://lingoarab.com/ai-tutor" />
      </Helmet>

      <svg className="topo-lines absolute top-0 left-0 w-72 h-72 opacity-30 pointer-events-none" viewBox="0 0 300 300" fill="none">
        <path d="M-20 40 Q 80 20 180 60 T 340 80" stroke="#D6FF4B" strokeWidth="0.6" />
        <path d="M-20 70 Q 80 50 180 90 T 340 110" stroke="#D6FF4B" strokeWidth="0.6" opacity="0.8" />
        <path d="M-20 100 Q 80 80 180 120 T 340 140" stroke="#D6FF4B" strokeWidth="0.6" opacity="0.6" />
        <path d="M-20 130 Q 80 110 180 150 T 340 170" stroke="#D6FF4B" strokeWidth="0.6" opacity="0.4" />
      </svg>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-5">
        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white">
          المكالمة الحية
        </div>
        {inCall && status.label && (
          <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ${status.color}`}>
            <span>{status.emoji}</span>
            <span>{status.label}</span>
          </div>
        )}
      </div>

      {/* Scenario selector (only before call) */}
      {!inCall && (
        <div className="relative z-10 mt-4 px-5">
          <p className="text-white/60 text-xs text-center mb-2">اختر سيناريو المحادثة</p>
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
            {SCENARIOS.map(s => (
              <button
                key={s.id}
                onClick={() => setScenario(s.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors ${
                  scenario === s.id
                    ? 'bg-[#D6FF4B]/10 border-[#D6FF4B] text-[#D6FF4B]'
                    : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.07]'
                }`}
              >
                <span className="text-xl">{s.emoji}</span>
                <span className="text-[11px]">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main area */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 pt-4">
        {!inCall && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="orb-wrap">
              <div className="orb-glow" />
              <Lottie animationData={orbAnimation} loop autoplay style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }} />
            </div>
            <p className="mt-6 text-white/80 text-center max-w-sm">
              اضغط على الزر الأخضر لبدء <span className="text-[#D6FF4B]">مكالمة حية</span> وتدرّب على المحادثة بالإنجليزية
            </p>
          </div>
        ) : (
          <>
            {inCall && (
              <div className="w-28 h-28 mb-3 relative">
                <div className="orb-glow" />
                <Lottie animationData={orbAnimation} loop autoplay style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }} />
              </div>
            )}

            <div className="w-full max-w-md flex-1 overflow-y-auto space-y-3 pb-4">
              {messages.map((m, i) => (
                m.role === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-2 text-sm">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-start">
                    <div className="max-w-[85%] bg-white text-gray-900 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm shadow-lg">
                      <div>{m.text}</div>
                      {m.correction && (
                        <div className="mt-2 text-xs bg-yellow-100 text-yellow-900 rounded-lg px-2 py-1.5">
                          ✏️ {m.correction}
                        </div>
                      )}
                      {m.tip && (
                        <div className="mt-1.5 text-xs bg-blue-50 text-blue-900 rounded-lg px-2 py-1.5">
                          💡 {m.tip}
                        </div>
                      )}
                    </div>
                  </div>
                )
              ))}
              {partialText && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-blue-500/40 text-white/80 italic rounded-2xl rounded-tr-sm px-4 py-2 text-sm">
                    {partialText}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </main>

      {/* Bottom controls */}
      <div className="relative z-10 flex items-center justify-center gap-8 pb-10 pt-4">
        {!inCall && messages.length > 0 && (
          <button className="circle-btn" aria-label="مسح" onClick={() => setMessages([])}>
            <Trash2 className="w-5 h-5" />
          </button>
        )}

        <div className="mic-btn-wrap">
          {inCall && (
            <>
              <span className="pulse-ring ring-1" />
              <span className="pulse-ring ring-2" />
              <span className="pulse-ring ring-3" />
            </>
          )}
          <button
            className="mic-btn"
            aria-label={inCall ? 'إنهاء المكالمة' : 'بدء المكالمة'}
            onClick={inCall ? endCall : startCall}
            style={{ background: inCall ? '#ef4444' : '#22c55e' }}
          >
            {inCall ? <PhoneOff className="w-7 h-7" /> : <Phone className="w-7 h-7" />}
          </button>
        </div>

        {!inCall && (
          <button className="circle-btn" aria-label="إغلاق" onClick={() => navigate(-1)}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AiTutor;
