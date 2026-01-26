import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InterstitialAdProps {
  onComplete: () => void;
  autoCloseDelay?: number; // milliseconds before showing close button
}

export const InterstitialAd = ({ 
  onComplete, 
  autoCloseDelay = 5000 // 5 seconds before close button appears
}: InterstitialAdProps) => {
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [countdown, setCountdown] = useState(Math.ceil(autoCloseDelay / 1000));
  const [adLoaded, setAdLoaded] = useState(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setShowCloseButton(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load the ad script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://pl28568529.effectivegatecpm.com/49/32/04/493204385b6c8fd92119aadfe195e983.js';
    script.async = true;
    script.onload = () => setAdLoaded(true);
    script.onerror = () => {
      // If ad fails to load, allow closing immediately
      setShowCloseButton(true);
      setAdLoaded(true);
    };
    
    const adContainer = document.getElementById('interstitial-ad-container');
    if (adContainer) {
      adContainer.appendChild(script);
    }

    return () => {
      if (adContainer && script.parentNode === adContainer) {
        adContainer.removeChild(script);
      }
    };
  }, []);

  const handleClose = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        dir="rtl"
      >
        {/* Header with countdown/close */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            إعلان
          </div>
          {showCloseButton ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-full bg-muted hover:bg-muted/80"
            >
              <X className="w-5 h-5" />
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              <span>تخطي بعد</span>
              <span className="font-bold text-foreground">{countdown}</span>
            </div>
          )}
        </div>

        {/* Ad Container */}
        <div 
          id="interstitial-ad-container"
          className="w-full max-w-lg min-h-[300px] flex items-center justify-center"
        >
          {!adLoaded && (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm">جاري تحميل الإعلان...</span>
            </div>
          )}
        </div>

        {/* Skip message */}
        <motion.p
          className="absolute bottom-8 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          الدرس سيبدأ بعد الإعلان
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};
