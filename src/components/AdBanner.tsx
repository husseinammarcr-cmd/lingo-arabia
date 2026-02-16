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

    const iframe = document.createElement('iframe');
    iframe.setAttribute('data-aa', '2407488');
    iframe.src = '//ad.a-ads.com/2407488?size=468x60';
    iframe.style.width = '468px';
    iframe.style.height = '60px';
    iframe.style.border = '0';
    iframe.style.padding = '0';
    iframe.style.overflow = 'hidden';
    iframe.style.backgroundColor = 'transparent';
    iframe.loading = 'lazy';
    containerRef.current.appendChild(iframe);
  }, []);

  return (
    <div className={`flex justify-center py-3 ${className ?? ''}`}>
      <div ref={containerRef} className="max-w-full overflow-hidden" />
    </div>
  );
};

export default AdBanner;
