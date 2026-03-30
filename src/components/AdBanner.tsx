import { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  className?: string;
}

const AD_KEY = '8f0447ac83949ef99f1e15a0e4b8d2e7';

const AdBanner = ({ className }: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const loadAd = useCallback(() => {
    if (!adRef.current) return;

    // Clear previous content
    adRef.current.innerHTML = '';

    // Re-set atOptions every time before loading
    (window as any).atOptions = {
      key: AD_KEY,
      format: 'iframe',
      height: 60,
      width: 468,
      params: {}
    };

    try {
      const script = document.createElement('script');
      script.src = `https://www.highperformanceformat.com/${AD_KEY}/invoke.js`;
      script.async = true;
      adRef.current.appendChild(script);
    } catch (e) {
      console.log('Banner ad skipped');
    }
  }, []);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    loadAd();

    // Watch for ad content being removed and reload if needed
    const observer = new MutationObserver(() => {
      if (adRef.current && adRef.current.children.length === 0) {
        // Ad content was removed, retry after a short delay
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = setTimeout(() => {
          loadAd();
        }, 2000);
      }
    });

    if (adRef.current) {
      observer.observe(adRef.current, { childList: true });
    }

    return () => {
      observer.disconnect();
      clearTimeout(retryTimerRef.current);
    };
  }, [loadAd]);

  return (
    <div
      ref={adRef}
      className={cn(
        "w-full min-h-[60px] flex items-center justify-center overflow-hidden rounded-xl",
        className
      )}
    />
  );
};

export default AdBanner;
