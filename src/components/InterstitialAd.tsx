import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const InterstitialAd = () => {
  const { user } = useAuth();
  const interceptInstalledRef = useRef(false);
  const [showAd, setShowAd] = useState(false);
  const [adUrl, setAdUrl] = useState('');

  // Load ad scripts via edge function proxy
  useEffect(() => {
    if (!user) return;

    const loadAdScript = async () => {
      try {
        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const script = document.createElement('script');
        script.src = `https://${projectId}.supabase.co/functions/v1/serve-script?t=${Date.now()}`;
        script.async = true;
        document.head.appendChild(script);
      } catch (e) {
        console.log('Ad script load skipped');
      }
    };

    loadAdScript();
  }, [user]);

  // Navigation interception - only for authenticated users
  useEffect(() => {
    if (!user || interceptInstalledRef.current) return;
    interceptInstalledRef.current = true;

    const MY_DOMAINS = [
      'lingoarab.com',
      'lovable.app',
      'lovable.dev',
      'supabase.co',
      'google.com',
      'googletagmanager.com',
      'google-analytics.com',
      'googleapis.com'
    ];

    const isMyDomain = (url: string) => {
      try {
        const hostname = new URL(url).hostname;
        return MY_DOMAINS.some(d => hostname === d || hostname.endsWith('.' + d));
      } catch {
        return true; // relative URLs are safe
      }
    };

    // Override window.open
    const origOpen = window.open.bind(window);
    window.open = (url?: string | URL, target?: string, features?: string) => {
      const urlStr = url?.toString() || '';
      if (!urlStr || isMyDomain(urlStr)) {
        return origOpen(urlStr, target, features);
      }
      window.dispatchEvent(new CustomEvent('show-interstitial', { detail: { url: urlStr } }));
      return null;
    };

    // Try to override location methods (may fail in strict environments)
    try {
      const origAssign = location.assign.bind(location);
      Object.defineProperty(location, 'assign', {
        value: (url: string | URL) => {
          const urlStr = url.toString();
          if (isMyDomain(urlStr)) {
            origAssign(urlStr);
          } else {
            window.dispatchEvent(new CustomEvent('show-interstitial', { detail: { url: urlStr } }));
          }
        },
        writable: true,
        configurable: true
      });
    } catch (e) {
      console.log('Could not override location.assign');
    }

    try {
      const origReplace = location.replace.bind(location);
      Object.defineProperty(location, 'replace', {
        value: (url: string | URL) => {
          const urlStr = url.toString();
          if (isMyDomain(urlStr)) {
            origReplace(urlStr);
          } else {
            window.dispatchEvent(new CustomEvent('show-interstitial', { detail: { url: urlStr } }));
          }
        },
        writable: true,
        configurable: true
      });
    } catch (e) {
      console.log('Could not override location.replace');
    }
    let lastHref = location.href;
    const hrefChecker = setInterval(() => {
      if (location.href !== lastHref) {
        const newHref = location.href;
        if (!isMyDomain(newHref)) {
          history.replaceState(null, '', lastHref);
          window.dispatchEvent(new CustomEvent('show-interstitial', { detail: { url: newHref } }));
        } else {
          lastHref = newHref;
        }
      }
    }, 50);

    // Listen for interstitial events
    const handleShowInterstitial = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.url) {
        setAdUrl(detail.url);
        setShowAd(true);
      }
    };
    window.addEventListener('show-interstitial', handleShowInterstitial);

    return () => {
      clearInterval(hrefChecker);
      window.removeEventListener('show-interstitial', handleShowInterstitial);
    };
  }, [user]);

  if (!showAd) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
        <p className="text-lg font-bold text-foreground mb-4">جاري التحميل...</p>
        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
          <p className="text-muted-foreground text-sm">مساحة إعلانية</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setShowAd(false);
              window.open(adUrl, '_blank');
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
          >
            متابعة
          </button>
          <button
            onClick={() => setShowAd(false)}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterstitialAd;
