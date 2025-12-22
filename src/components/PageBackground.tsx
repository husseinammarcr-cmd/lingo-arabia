import { cn } from '@/lib/utils';

interface PageBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const PageBackground = ({ children, className }: PageBackgroundProps) => {
  return (
    <div
      className={cn(
        "min-h-screen bg-cover bg-center bg-no-repeat relative",
        className
      )}
      style={{ backgroundImage: "url('/images/learning-bg.png')" }}
    >
      {/* White overlay for text readability */}
      <div className="absolute inset-0 bg-white/70 dark:bg-background/85" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PageBackground;
