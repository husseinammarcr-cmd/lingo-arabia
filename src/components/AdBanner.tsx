import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  className?: string;
}

// Pre-set atOptions immediately so the script can use it as soon as it loads
if (typeof window !== 'undefined') {
  (window as any).atOptions = {
    key: '8f0447ac83949ef99f1e15a0e4b8d2e7',
    format: 'iframe',
    height: 60,
    width: 468,
    params: {}
  };
}

const AdBanner = ({ className }: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || !adRef.current) return;
    loadedRef.current = true;

    try {
      const script = document.createElement('script');
      script.src = 'https://www.highperformanceformat.com/8f0447ac83949ef99f1e15a0e4b8d2e7/invoke.js';
      adRef.current.appendChild(script);
    } catch (e) {
      console.log('Banner ad skipped');
    }
  }, []);

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
