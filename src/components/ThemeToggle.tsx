import React, { useRef, useEffect } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useTheme } from '@/contexts/ThemeContext';
import themeToggleAnimation from '@/assets/theme-toggle.json';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (lottieRef.current) {
      // Set initial frame based on current theme
      // Dark mode = end of animation (moon), Light mode = start (sun)
      if (theme === 'dark') {
        lottieRef.current.goToAndStop(179, true);
      } else {
        lottieRef.current.goToAndStop(0, true);
      }
    }
  }, []);

  const handleClick = () => {
    if (lottieRef.current) {
      if (theme === 'light') {
        // Play forward: sun to moon (frames 0-80)
        lottieRef.current.setDirection(1);
        lottieRef.current.playSegments([0, 80], true);
      } else {
        // Play backward: moon to sun (frames 120-179)
        lottieRef.current.setDirection(1);
        lottieRef.current.playSegments([120, 179], true);
      }
    }
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      className={`w-10 h-10 flex items-center justify-center rounded-md hover:bg-accent transition-colors ${className}`}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={themeToggleAnimation}
        loop={false}
        autoplay={false}
        className="w-8 h-8"
      />
    </button>
  );
};

export default ThemeToggle;
