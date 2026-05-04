import { useEffect, type ReactNode } from 'react';
import Lottie from 'lottie-react';
import dashboardBgAnimation from '@/assets/dashboard-bg.json';

interface DashboardBackgroundProps {
  children: ReactNode;
  /** Tint of the primary blob glow (top-right). Defaults to lime. */
  primaryGlow?: string;
  /** Tint of the secondary blob glow (bottom-left). Defaults to purple. */
  secondaryGlow?: string;
}

/**
 * Reusable dark dashboard shell with Lottie + grid + animated blobs.
 * Forces html/body to dark so iOS overscroll doesn't show white.
 * Children render in a `relative z-10` layer above the background.
 */
const DashboardBackground = ({
  children,
  primaryGlow = 'rgba(205,255,79,0.22)',
  secondaryGlow = 'rgba(165,116,255,0.18)',
}: DashboardBackgroundProps) => {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.backgroundColor;
    const prevBody = body.style.backgroundColor;
    html.style.backgroundColor = '#070907';
    body.style.backgroundColor = '#070907';
    return () => {
      html.style.backgroundColor = prevHtml;
      body.style.backgroundColor = prevBody;
    };
  }, []);

  return (
    <>
      {/* Fixed Lottie + grid background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden bg-[#070907]"
        style={{ zIndex: 0 }}
      >
        <Lottie
          animationData={dashboardBgAnimation}
          loop
          autoplay
          rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.7,
          }}
        />
        {/* vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(7,9,7,0) 0%, rgba(7,9,7,0.45) 70%, rgba(7,9,7,0.75) 100%)',
          }}
        />
        {/* grid */}
        <div className="absolute inset-0 bg-grid" />
        {/* Aurora blobs */}
        <div className="absolute inset-0 overflow-hidden opacity-60 mix-blend-screen">
          <div
            className="absolute -top-[10%] right-[10%] rounded-full animate-blob"
            style={{
              width: '70vw',
              height: '70vw',
              background: `radial-gradient(circle, ${primaryGlow} 0%, transparent 60%)`,
              filter: 'blur(120px)',
            }}
          />
          <div
            className="absolute -bottom-[10%] -left-[10%] rounded-full animate-blob"
            style={{
              width: '50vw',
              height: '50vw',
              background: `radial-gradient(circle, ${secondaryGlow} 0%, transparent 60%)`,
              filter: 'blur(110px)',
              animationDelay: '3s',
              animationDirection: 'alternate-reverse',
            }}
          />
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </>
  );
};

export default DashboardBackground;
