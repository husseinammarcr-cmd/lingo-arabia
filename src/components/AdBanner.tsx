import { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
}

const AdBanner = ({ className }: AdBannerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || !containerRef.current) return;
    loadedRef.current = true;

    // Set atOptions on window
    (window as any).atOptions = {
      key: '8f0447ac83949ef99f1e15a0e4b8d2e7',
      format: 'iframe',
      height: 60,
      width: 468,
      params: {},
    };

    const script = document.createElement('script');
    script.src = 'https://www.highperformanceformat.com/8f0447ac83949ef99f1e15a0e4b8d2e7/invoke.js';
    script.async = true;
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className={`flex justify-center py-3 ${className ?? ''}`}>
      <div ref={containerRef} className="max-w-full overflow-hidden" />
    </div>
  );
};

export default AdBanner;
