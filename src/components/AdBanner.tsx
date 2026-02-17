import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

    // Set options on window with obfuscated name
    (window as any).atOptions = {
      key: AD_KEY,
      format: 'iframe',
      height: 60,
      width: 468,
      params: {},
    };

    // Try direct load first
    const directScript = document.createElement('script');
    directScript.src = `https://www.highperformanceformat.com/${AD_KEY}/invoke.js`;
    directScript.async = true;

    // If direct fails (adblock), use proxy
    directScript.onerror = () => {
      if (!containerRef.current) return;
      
      const proxyUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/serve-script?k=${AD_KEY}`;
      
      const proxyScript = document.createElement('script');
      proxyScript.src = proxyUrl;
      proxyScript.async = true;
      containerRef.current.appendChild(proxyScript);
    };

    containerRef.current.appendChild(directScript);
  }, []);

  return (
    <div className={`flex justify-center py-3 ${className ?? ''}`}>
      <div ref={containerRef} className="max-w-full overflow-hidden content-module" />
    </div>
  );
};

export default AdBanner;
