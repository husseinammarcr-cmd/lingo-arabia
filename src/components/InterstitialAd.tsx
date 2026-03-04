import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PROXY_BASE = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || 'qrbrilfuchxojsofzqwm'}.supabase.co/functions/v1/serve-script`;

const MY_DOMAINS = ['lingoarab.com', 'lovable.app', 'lovable.dev', 'localhost'];
const isMyDomain = (url: string) => {
  try { return MY_DOMAINS.some(d => new URL(url).hostname.includes(d)); }
  catch { return true; }
};

const InterstitialAd = () => {
  const { user } = useAuth();
  const [adUrl, setAdUrl] = useState<string | null>(null);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const scriptLoadedRef = useRef(false);
  const interceptInstalledRef = useRef(false);

  // Install navigation interception ONLY for authenticated users
  useEffect(() => {
    if (!user || interceptInstalledRef.current) return;
    interceptInstalledRef.current = true;

    const origOpen = window.open.bind(window);
    window.open = function (url?: string | URL, target?: string, features?: string) {
      const urlStr = url?.toString() || '';
      if (!urlStr || isMyDomain(urlStr)) return origOpen(urlStr, target, features);
      window.dispatchEvent(new CustomEvent('show-interstitial', { detail: { url: urlStr } }));
      return null;
    } as typeof window.open;

    const origAssign = location.assign.bind(location);
    const origReplace = location.replace.bind(location);
    location.assign = (url: string | URL) => { const s = url.toString(); isMyDomain(s) ? origAssign(s) : window.dispatchEvent(new CustomEvent('show-interstitial', { detail: { url: s } })); };
    location.replace = (url: string | URL) => { const s = url.toString(); isMyDomain(s) ? origReplace(s) : window.dispatchEvent(new CustomEvent('show-interstitial', { detail: { url: s } })); };

    let realHref = location.href;
    const interval = setInterval(() => {
      if (location.href !== realHref && !isMyDomain(location.href)) {
        const adUrl = location.href;
        history.replaceState(null, '', realHref);
        window.dispatchEvent(new CustomEvent('show-interstitial', { detail: { url: adUrl } }));
      } else { realHref = location.href; }
    }, 50);

    return () => clearInterval(interval);
  }, [user]);

  // Load popunder script via proxy only for authenticated users
  useEffect(() => {
    if (!user || scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const proxyUrl = `${PROXY_BASE}?t=pop&v=2`;
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
