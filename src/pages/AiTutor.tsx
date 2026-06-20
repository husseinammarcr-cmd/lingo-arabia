import { useState, useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Phone, PhoneOff, X, Trash2 } from 'lucide-react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import orbAnimation from '@/assets/orb.json';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import '@/styles/AiTutorOrb.css';
import CallFeedbackDialog from '@/components/CallFeedbackDialog';

type ChatMsg =
  | { role: 'user'; text: string }
  | { role: 'assistant'; text: string; correction?: string; tip?: string };

type CallStatus = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking';

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
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // PCM recording refs
  const recordAudioCtxRef = useRef<AudioContext | null>(null);
  const recordProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const recordSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const pcmSamplesRef = useRef<Float32Array[]>([]);
  const aiSpeakingRef = useRef(false);

  // Silence detection
  const silenceCtxRef = useRef<AudioContext | null>(null);
  const silenceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const RECORD_SAMPLE_RATE = 16000;
  const SILENCE_THRESHOLD = 0.09;
  const SILENCE_DELAY = 2500;

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partialText]);

  const inCall = callStatus !== 'idle';

  const encodeWav = (samplesArray: Float32Array[], sampleRate: number): ArrayBuffer => {
    let totalLength = 0;
    for (const s of samplesArray) totalLength += s.length;
    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const s of samplesArray) { merged.set(s, offset); offset += s.length; }
    const pcm16 = new Int16Array(merged.length);
    for (let i = 0; i < merged.length; i++) {
      const v = Math.max(-1, Math.min(1, merged[i]));
      pcm16[i] = v < 0 ? v * 0x8000 : v * 0x7FFF;
    }
    const blockAlign = 2;
    const byteRate = sampleRate * blockAlign;
    const dataSize = pcm16.length * 2;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    const writeStr = (off: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i));
    };
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, dataSize, true);
    let o = 44;
    for (let i = 0; i < pcm16.length; i++, o += 2) {
      view.setInt16(o, pcm16[i], true);
    }
    return buffer;
  };

  const flushPcmToServer = useCallback(() => {
    if (pcmSamplesRef.current.length === 0) return;
    const wavBuffer = encodeWav(pcmSamplesRef.current, RECORD_SAMPLE_RATE);
    pcmSamplesRef.current = [];
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(wavBuffer);
    }
  }, []);

  const startRecording = useCallback((stream: MediaStream) => {
    if (recordAudioCtxRef.current) return;
    const AC: typeof AudioContext = (window.AudioContext || (window as any).webkitAudioContext);
    const ctx = new AC({ sampleRate: RECORD_SAMPLE_RATE });
    recordAudioCtxRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    recordSourceRef.current = source;
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    recordProcessorRef.current = processor;
    processor.onaudioprocess = (e) => {
      if (aiSpeakingRef.current) return;
      const input = e.inputBuffer.getChannelData(0);
      pcmSamplesRef.current.push(new Float32Array(input));
    };
    source.connect(processor);
    const silentGain = ctx.createGain();
    silentGain.gain.value = 0;
    processor.connect(silentGain);
    silentGain.connect(ctx.destination);
  }, []);

  const stopRecordingNodes = useCallback(() => {
    if (recordProcessorRef.current) { try { recordProcessorRef.current.disconnect(); } catch {} recordProcessorRef.current = null; }
    if (recordSourceRef.current) { try { recordSourceRef.current.disconnect(); } catch {} recordSourceRef.current = null; }
    if (recordAudioCtxRef.current) { try { recordAudioCtxRef.current.close(); } catch {} recordAudioCtxRef.current = null; }
  }, []);

  const startSilenceDetection = useCallback((stream: MediaStream) => {
    const AC: typeof AudioContext = (window.AudioContext || (window as any).webkitAudioContext);
    const audioCtx = new AC();
    silenceCtxRef.current = audioCtx;
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let isSpeaking = true;
    silenceIntervalRef.current = setInterval(() => {
      if (aiSpeakingRef.current) return;
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const avg = sum / dataArray.length / 255;
      if (avg > SILENCE_THRESHOLD) {
        if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
        isSpeaking = true;
      } else if (isSpeaking && !silenceTimerRef.current) {
        silenceTimerRef.current = setTimeout(() => {
          isSpeaking = false;
          silenceTimerRef.current = null;
          aiSpeakingRef.current = true;
          flushPcmToServer();
        }, SILENCE_DELAY);
      }
    }, 100);
  }, [flushPcmToServer]);

  const stopSilenceDetection = useCallback(() => {
    if (silenceIntervalRef.current) { clearInterval(silenceIntervalRef.current); silenceIntervalRef.current = null; }
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null; }
    if (silenceCtxRef.current) { try { silenceCtxRef.current.close(); } catch {} silenceCtxRef.current = null; }
  }, []);

  const playAudio = useCallback(async (b64: string) => {
    return new Promise<void>((resolve) => {
      try {
        const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        const ctx = new AudioContext();
        ctx.decodeAudioData(bytes.buffer).then((buffer) => {
          const src = ctx.createBufferSource();
          src.buffer = buffer;
          src.connect(ctx.destination);
          src.onended = () => {
            aiSpeakingRef.current = false;
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({ type: 'audio_done' }));
            }
            resolve();
          };
          src.start();
        }).catch(() => { aiSpeakingRef.current = false; resolve(); });
      } catch (e) {
        aiSpeakingRef.current = false;
        resolve();
      }
    });
  }, []);

  const cleanup = useCallback(() => {
    stopSilenceDetection();
    stopRecordingNodes();
    pcmSamplesRef.current = [];
    aiSpeakingRef.current = false;
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) wsRef.current.close();
    wsRef.current = null;
  }, [stopSilenceDetection, stopRecordingNodes]);

  useEffect(() => () => cleanup(), [cleanup]);

  const startCall = useCallback(async () => {
    if (inCall) return;
    setCallStatus('connecting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } as MediaTrackConstraints,
      });
      streamRef.current = stream;

      const ws = new WebSocket('wss://api.lingoarab.com/ws');
      ws.binaryType = 'arraybuffer';
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'scenario', scenario }));
        ws.send(JSON.stringify({ type: 'start_call', scenario }));
        aiSpeakingRef.current = false;
        startRecording(stream);
        startSilenceDetection(stream);
        setCallStatus('listening');
      };

      ws.onmessage = (ev) => {
        if (typeof ev.data !== 'string') return;
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'status') {
            const next = msg.value as CallStatus;
            if (['listening', 'thinking', 'speaking'].includes(next)) setCallStatus(next);
            if (next === 'speaking') aiSpeakingRef.current = true;
            if (next === 'listening') aiSpeakingRef.current = false;
          } else if (msg.type === 'partial_text') setPartialText(msg.text || '');
          else if (msg.type === 'user_text') {
            setPartialText('');
            setMessages(prev => [...prev, { role: 'user', text: msg.text }]);
          } else if (msg.type === 'ai_text') {
            setMessages(prev => [...prev, { role: 'assistant', text: msg.reply, correction: msg.correction, tip: msg.tip }]);
          } else if (msg.type === 'audio') {
            aiSpeakingRef.current = true;
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
  }, [inCall, scenario, playAudio, cleanup, startRecording, startSilenceDetection]);

  const endCall = useCallback(() => {
    if (!inCall) return;
    stopSilenceDetection();
    stopRecordingNodes();
    pcmSamplesRef.current = [];
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) wsRef.current.close();
    wsRef.current = null;
    setCallStatus('idle');
    setPartialText('');
  }, [inCall, stopSilenceDetection, stopRecordingNodes]);

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="ai-buddy-screen min-h-screen relative overflow-hidden flex flex-col"
      dir="rtl"
    >
      <Helmet>
        <title>مكالمة صوتية بالإنجليزية مع AI - تدرّب الآن | Lingo Arab</title>
        <meta name="description" content="ابدأ مكالمة صوتية حية بالإنجليزية مع معلم ذكاء اصطناعي. تصحيح فوري للنطق والقواعد، 4 سيناريوهات: مطعم، مطار، فندق، تسوق. مجاناً." />
        <meta name="keywords" content="محادثة صوتية بالانجليزي, ai tutor عربي, تعلم الانجليزية بالصوت, ذكاء اصطناعي محادثة" />
        <link rel="canonical" href="https://lingoarab.com/ai-tutor" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lingoarab.com/ai-tutor" />
        <meta property="og:title" content="مكالمة صوتية بالإنجليزية مع AI | Lingo Arab" />
        <meta property="og:description" content="تكلّم مع معلم ذكاء اصطناعي بصوتك — تصحيح فوري، 4 سيناريوهات، مجاناً 24/7." />
        <meta property="og:locale" content="ar_AR" />
        <meta name="twitter:card" content="summary_large_image" />
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
            {SCENARIOS.map((s, idx) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onScenarioChange(s.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-colors ${
                  scenario === s.id
                    ? 'bg-[#D6FF4B]/10 border-[#D6FF4B] text-[#D6FF4B]'
                    : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.07]'
                }`}
              >
                <span className="text-xl">{s.emoji}</span>
                <span className="text-[11px]">{s.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Main area */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 pt-4">
        {!inCall && messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center flex-1"
          >
            <div className="orb-wrap">
              <div className="orb-glow" />
              <Lottie animationData={orbAnimation} loop autoplay style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }} />
            </div>
            <p className="mt-6 text-white/80 text-center max-w-sm">
              اضغط على الزر الأخضر لبدء <span className="text-[#D6FF4B]">مكالمة حية</span> وتدرّب على المحادثة بالإنجليزية
            </p>
            <div className="mt-5 px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-200/80 text-xs text-center max-w-sm space-y-1">
              <p>🎙️ المحادثة الصوتية <b className="text-yellow-100">باللغة الإنجليزية فقط</b> لتقوية التحدث والاستماع، ولا تدعم العربية حالياً.</p>
              <p>⏳ قد تواجه <b className="text-yellow-100">بعض التأخير</b> أحياناً بسبب الضغط على الخادم.</p>
            </div>
          </motion.div>
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
    </motion.div>
  );
};

export default AiTutor;
