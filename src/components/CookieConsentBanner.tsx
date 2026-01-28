import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CONSENT_KEY = 'cookie-consent';

type ConsentStatus = 'accepted' | 'declined' | null;

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(CONSENT_KEY) as ConsentStatus;
    if (!consent) {
      // Small delay to prevent banner from showing immediately on page load
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
          dir="rtl"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="relative bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-elevated p-4 md:p-6">
              {/* Close button */}
              <button
                onClick={handleDecline}
                className="absolute top-3 left-3 p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 pl-8 md:pl-0">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    نحن نستخدم ملفات تعريف الارتباط 🍪
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل استخدام الموقع. 
                    يمكنك قراءة المزيد في{' '}
                    <a 
                      href="/cookie-policy" 
                      className="text-primary hover:underline font-medium"
                    >
                      سياسة ملفات الارتباط
                    </a>
                    .
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDecline}
                    className="flex-1 md:flex-none"
                  >
                    رفض
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleAccept}
                    className="flex-1 md:flex-none"
                  >
                    قبول الكل
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;
