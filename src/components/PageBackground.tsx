import { cn } from '@/lib/utils';

interface PageBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const PageBackground = ({ children, className }: PageBackgroundProps) => {
  return (
    <div
      className={cn(
        "min-h-screen bg-no-repeat relative",
        // Desktop: cover and centered
        "bg-cover bg-center",
        // Mobile: position top to show the main artwork
        "max-md:bg-top max-md:bg-[length:100%_auto]",
        className
      )}
      style={{ backgroundImage: "url('/images/learning-bg.png')" }}
    >
      {/* White overlay for text readability - slightly more transparent on mobile */}
      <div className="absolute inset-0 bg-white/60 md:bg-white/70 dark:bg-background/80 md:dark:bg-background/85" />
      
      {/* Content - extra top padding on mobile to avoid overlapping key artwork */}
      <div className="relative z-10 pt-0 md:pt-0">
        {children}
      </div>
    </div>
  );
};

export default PageBackground;
