import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const InterstitialAd = () => {
  const { user } = useAuth();
  const [adUrl, setAdUrl] = useState<string | null>(null);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const scriptLoadedRef = useRef(false);

  // Load popunder script via proxy only for authenticated users
  useEffect(() => {
    if (!user || scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const proxyUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/serve-script?t=pop&v=2`;
    const script = document.createElement('script');
    script.src = proxyUrl;
    script.async = true;
    document.head.appendChild(script);
  }, [user]);

  useEffect(() => {
    const handler = (e: Event) => {
      if (!user) return;
      const detail = (e as CustomEvent).detail;
      if (detail?.url) {
        setAdUrl(detail.url);
        setCanClose(false);
        setCountdown(5);
      }
    };
    window.addEventListener('show-interstitial', handler);
    return () => window.removeEventListener('show-interstitial', handler);
  }, [user]);

  useEffect(() => {
    if (!adUrl) return;
    if (countdown <= 0) {
      setCanClose(true);
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [adUrl, countdown]);

  if (!user || !adUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      dir="ltr"
    >
      {canClose ? (
        <button
          onClick={() => setAdUrl(null)}
          className="fixed top-4 right-4 z-[10001] bg-destructive text-destructive-foreground rounded-full w-9 h-9 flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
          aria-label="Close ad"
        >
          <X className="w-5 h-5" />
        </button>
      ) : (
        <div className="fixed top-4 right-4 z-[10001] bg-muted text-muted-foreground rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm shadow-lg">
          {countdown}
        </div>
      )}

      <div className="w-full max-w-3xl h-[80vh] rounded-xl overflow-hidden shadow-2xl border border-border bg-background flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-muted border-b border-border shrink-0">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex-1 mx-2 px-3 py-1 rounded-md bg-background text-xs text-muted-foreground truncate border border-border">
            {adUrl}
          </div>
        </div>

        <iframe
          src={adUrl}
          className="flex-1 w-full border-0"
          sandbox="allow-scripts allow-popups allow-same-origin allow-forms"
          title="Advertisement"
        />
      </div>
    </div>
  );
};

export default InterstitialAd;
