import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VerifiedBadge = ({ className, size = 'md' }: VerifiedBadgeProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <BadgeCheck 
      className={cn(
        sizeClasses[size],
        "text-blue-500 fill-blue-500",
        className
      )} 
    />
  );
};
