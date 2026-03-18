import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X } from 'lucide-react';

const POPUNDER_URL = 'https://pl28568529.effectivegatecpm.com/49/32/04/493204385b6c8fd92119aadfe195e983.js';

const InterstitialAd = () => {
  const { user } = useAuth();
  const scriptLoadedRef = useRef(false);
  const hasShownRef = useRef(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [adPageUrl, setAdPageUrl] = useState('');

  // Load popunder script for authenticated users
  useEffect(() => {
    if (!user || scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    // Intercept window.open to capture the popunder URL
    const origOpen = window.open.bind(window);
    window.open = (url?: string | URL, target?: string, features?: string) => {
      const urlStr = url?.toString() || '';
      
      // Allow our own domains
      const safeDomains = ['lingoarab.com', 'lovable.app', 'lovable.dev', 'supabase.co', 'google.com', 'googleapis.com', 'googletagmanager.com', 'google-analytics.com'];
      try {
        const hostname = new URL(urlStr).hostname;
        const isSafe = safeDomains.some(d => hostname === d || hostname.endsWith('.' + d));
        if (isSafe || !urlStr) {
          return origOpen(urlStr, target, features);
        }
      } catch {
        return origOpen(urlStr, target, features);
      }

      // Instead of opening a new window, show in-app overlay
      if (!hasShownRef.current) {
        hasShownRef.current = true;
        setAdPageUrl(urlStr);
        setShowOverlay(true);
        setCanClose(false);
        setCountdown(5);
      }
      return null;
    };

    // Also intercept location changes
    try {
      const origAssign = location.assign.bind(location);
      Object.defineProperty(location, 'assign', {
        value: (url: string | URL) => {
          const urlStr = url.toString();
          const safeDomains = ['lingoarab.com', 'lovable.app', 'lovable.dev', 'supabase.co'];
          try {
            const hostname = new URL(urlStr).hostname;
            const isSafe = safeDomains.some(d => hostname === d || hostname.endsWith('.' + d));
            if (isSafe) { origAssign(urlStr); return; }
          } catch { origAssign(urlStr); return; }
          
          if (!hasShownRef.current) {
            hasShownRef.current = true;
            setAdPageUrl(urlStr);
            setShowOverlay(true);
            setCanClose(false);
            setCountdown(5);
          }
        },
        writable: true, configurable: true
      });
    } catch (e) {}

    try {
      const origReplace = location.replace.bind(location);
      Object.defineProperty(location, 'replace', {
        value: (url: string | URL) => {
          const urlStr = url.toString();
          const safeDomains = ['lingoarab.com', 'lovable.app', 'lovable.dev', 'supabase.co'];
          try {
            const hostname = new URL(urlStr).hostname;
            const isSafe = safeDomains.some(d => hostname === d || hostname.endsWith('.' + d));
            if (isSafe) { origReplace(urlStr); return; }
          } catch { origReplace(urlStr); return; }
          
          if (!hasShownRef.current) {
            hasShownRef.current = true;
            setAdPageUrl(urlStr);
            setShowOverlay(true);
            setCanClose(false);
            setCountdown(5);
          }
        },
        writable: true, configurable: true
      });
    } catch (e) {}

    // Load the popunder script immediately
    try {
      const script = document.createElement('script');
      script.src = POPUNDER_URL;
      document.head.appendChild(script);
    } catch (e) {
      console.log('Popunder script skipped');
    }
  }, [user]);

  // Countdown timer
  useEffect(() => {
    if (!showOverlay) return;
    
    if (countdown <= 0) {
      setCanClose(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showOverlay, countdown]);

  // Reset for next click after closing
  const handleClose = () => {
    setShowOverlay(false);
    setAdPageUrl('');
    // Allow showing again on next click
    setTimeout(() => {
      hasShownRef.current = false;
    }, 30000); // 30 seconds cooldown before showing again
  };

  if (!showOverlay || !adPageUrl) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg h-[70vh] bg-card rounded-2xl shadow-2xl overflow-hidden border border-border flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
          <span className="text-sm text-muted-foreground">إعلان</span>
          {canClose ? (
            <button
              onClick={handleClose}
              className="flex items-center gap-1 px-3 py-1.5 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <X className="w-4 h-4" />
              إغلاق
            </button>
          ) : (
            <span className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-sm">
              إغلاق بعد {countdown} ثوانٍ
            </span>
          )}
        </div>
        
        {/* Ad iframe */}
        <div className="flex-1">
          <iframe
            src={adPageUrl}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            title="إعلان"
          />
        </div>
      </div>
    </div>
  );
};

export default InterstitialAd;
