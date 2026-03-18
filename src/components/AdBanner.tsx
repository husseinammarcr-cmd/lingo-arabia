import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  className?: string;
}

const AdBanner = ({ className }: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || !adRef.current) return;
    loadedRef.current = true;

    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      
      // Load banner ad script via proxy
      const script = document.createElement('script');
      script.src = `https://${projectId}.supabase.co/functions/v1/serve-script?type=banner&t=${Date.now()}`;
      script.async = true;
      adRef.current.appendChild(script);
    } catch (e) {
      console.log('Banner ad skipped');
    }
  }, []);

  return (
    <div 
      ref={adRef}
      className={cn(
        "w-full min-h-[90px] flex items-center justify-center overflow-hidden rounded-xl bg-muted/30",
        className
      )}
    />
  );
};

export default AdBanner;
