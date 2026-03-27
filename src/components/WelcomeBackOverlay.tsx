import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LazyLottieAnimation } from '@/components/animations/LazyLottieAnimation';
import sayHiAnimation from '@/assets/say-hi.json';
import { ChevronLeft } from 'lucide-react';

const WelcomeBackOverlay = ({ onContinue }: { onContinue: () => void }) => {
  const [visible, setVisible] = useState(true);

  const handleContinue = () => {
    setVisible(false);
    setTimeout(onContinue, 400);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="flex flex-col items-center text-center px-6 max-w-sm"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200 }}
          >
            {/* Lottie Animation */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 mb-4">
              <LazyLottieAnimation
                animationData={sayHiAnimation}
                loop
                autoplay
                rootMargin="0px"
                className="w-full h-full"
              />
            </div>

            {/* Greeting Text */}
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-foreground mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              مرحباً بعودتك! 👋
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-base sm:text-lg mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              اشتقنا لك، هيا نكمل رحلة التعلم!
            </motion.p>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                variant="hero"
                size="xl"
                onClick={handleContinue}
                className="text-lg gap-2 px-10"
              >
                متابعة
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeBackOverlay;
