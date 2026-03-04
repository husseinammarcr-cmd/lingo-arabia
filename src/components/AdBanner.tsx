import { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
}

const AD_KEY = '8f0447ac83949ef99f1e15a0e4b8d2e7';

const AdBanner = ({ className }: AdBannerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || !containerRef.current) return;
    loadedRef.current = true;

    // Set options on window
    (window as any).atOptions = {
      key: AD_KEY,
      format: 'iframe',
      height: 60,
      width: 468,
      params: {},
    };

    // Always load via proxy to avoid ad domain detection
    const proxyUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/serve-script?t=banner&k=${AD_KEY}`;
    
    const script = document.createElement('script');
    script.src = proxyUrl;
    script.async = true;
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className={`flex justify-center py-3 ${className ?? ''}`}>
      <div ref={containerRef} className="max-w-full overflow-hidden content-module" />
    </div>
  );
};

export default AdBanner;
