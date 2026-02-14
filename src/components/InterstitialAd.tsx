import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const InterstitialAd = () => {
  const [adUrl, setAdUrl] = useState<string | null>(null);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.url) {
        setAdUrl(detail.url);
        setCanClose(false);
        setCountdown(5);
      }
    };
    window.addEventListener('show-interstitial', handler);
    return () => window.removeEventListener('show-interstitial', handler);
  }, []);

  useEffect(() => {
    if (!adUrl) return;
    if (countdown <= 0) {
      setCanClose(true);
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [adUrl, countdown]);

  if (!adUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      dir="ltr"
    >
      {/* Close / Countdown */}
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

      {/* Mini Browser */}
      <div className="w-full max-w-3xl h-[80vh] rounded-xl overflow-hidden shadow-2xl border border-border bg-background flex flex-col">
        {/* Browser Header */}
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

        {/* Iframe */}
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
