import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';
import { cn } from '@/lib/utils';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  variant?: 'ghost' | 'outline' | 'secondary';
}

/**
 * A button that plays audio pronunciation of the given text
 * Uses the Web Speech API with American English (en-US)
 */
export const AudioButton = ({ 
  text, 
  size = 'sm', 
  className,
  variant = 'ghost'
}: AudioButtonProps) => {
  const { speak, isSupported } = useSpeech();

  if (!isSupported) {
    return null; // Fail gracefully - don't show button if not supported
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click handlers
    speak(text);
  };

  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <Button
      type="button"
      variant={variant}
      size="icon"
      onClick={handleClick}
      className={cn(
        "rounded-full transition-all hover:scale-110 active:scale-95",
        size === 'sm' && "h-8 w-8",
        size === 'default' && "h-10 w-10",
        size === 'lg' && "h-12 w-12",
        className
      )}
      title="استمع للنطق"
      aria-label={`Listen to pronunciation of: ${text}`}
    >
      <Volume2 className={iconSize} />
    </Button>
  );
};
