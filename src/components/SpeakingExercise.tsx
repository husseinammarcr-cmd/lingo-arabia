import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, CheckCircle2, XCircle } from 'lucide-react';

interface SpeakingExerciseProps {
  target: string;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
}

type SR = typeof window extends { SpeechRecognition: infer T } ? T : any;

function getRecognition(): any | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => unknown;
    webkitSpeechRecognition?: new () => unknown;
  };
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[.,!?؛،;:"'`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function similarity(a: string, b: string): number {
  const A = normalize(a).split(' ').filter(Boolean);
  const B = normalize(b).split(' ').filter(Boolean);
  if (!A.length || !B.length) return 0;
  const set = new Set(A);
  const hit = B.filter((w) => set.has(w)).length;
  return hit / Math.max(A.length, B.length);
}

export const SpeakingExercise = ({ target, onAnswer, disabled }: SpeakingExerciseProps) => {
  const [supported, setSupported] = useState(true);
  const [recording, setRecording] = useState(false);
  const [heard, setHeard] = useState('');
  const [result, setResult] = useState<null | { ok: boolean; score: number }>(null);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const r = getRecognition();
    if (!r) {
      setSupported(false);
      return;
    }
    r.lang = 'en-US';
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.continuous = false;
    r.onresult = (e: any) => {
      const text = e.results?.[0]?.[0]?.transcript || '';
      setHeard(text);
      const s = similarity(text, target);
      const ok = s >= 0.6;
      setResult({ ok, score: s });
      setRecording(false);
      setTimeout(() => onAnswer(ok), 1300);
    };
    r.onerror = () => {
      setRecording(false);
      setResult({ ok: false, score: 0 });
      setTimeout(() => onAnswer(false), 1200);
    };
    r.onend = () => setRecording(false);
    recRef.current = r;
    return () => {
      try { r.abort?.(); } catch { /* ignore */ }
    };
  }, [target, onAnswer]);

  const speakTarget = async () => {
    const { playLessonAudio } = await import('@/lib/lessonAudio');
    playLessonAudio(target).catch(() => { /* handled in util */ });
  };

  const start = () => {
    if (!recRef.current || disabled || result) return;
    setHeard('');
    setResult(null);
    try {
      recRef.current.start();
      setRecording(true);
    } catch { /* already started */ }
  };

  const stop = () => {
    try { recRef.current?.stop?.(); } catch { /* ignore */ }
    setRecording(false);
  };

  if (!supported) {
    return (
      <div className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-center">
        <p className="text-sm text-amber-200">
          متصفحك لا يدعم التعرف الصوتي. اضغط تخطي للمتابعة.
        </p>
        <button
          type="button"
          className="la-next-btn"
          onClick={() => onAnswer(true)}
        >
          تخطي
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        dir="ltr"
        className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-lg font-semibold text-white flex items-center justify-center gap-3"
      >
        <button
          type="button"
          onClick={speakTarget}
          aria-label="استمع"
          className="rounded-full p-2 hover:bg-white/10 transition"
        >
          <Volume2 className="w-5 h-5 text-[#cdff4f]" />
        </button>
        <span>{target}</span>
      </div>

      <button
        type="button"
        onClick={recording ? stop : start}
        disabled={!!result || disabled}
        className={`relative h-24 w-24 rounded-full flex items-center justify-center transition-all ${
          recording
            ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)]'
            : 'bg-[#cdff4f] text-black hover:brightness-110'
        }`}
      >
        {recording && (
          <span className="absolute inset-0 rounded-full animate-ping bg-red-500/40" />
        )}
        {recording ? (
          <MicOff className="w-10 h-10 text-white relative" />
        ) : (
          <Mic className="w-10 h-10 relative" />
        )}
      </button>

      <p className="text-sm text-white/70">
        {recording ? 'جاري الاستماع... تكلم الآن' : result ? '' : 'اضغط على المايك وانطق الجملة'}
      </p>

      {heard && (
        <div dir="ltr" className="text-sm text-white/80 italic">"{heard}"</div>
      )}

      {result && (
        <div
          className={`flex items-center gap-2 text-base font-bold ${
            result.ok ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {result.ok ? (
            <>
              <CheckCircle2 className="w-5 h-5" /> نطق ممتاز! ({Math.round(result.score * 100)}%)
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5" /> حاول ثانية - استمع للنطق الصحيح
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SpeakingExercise;
