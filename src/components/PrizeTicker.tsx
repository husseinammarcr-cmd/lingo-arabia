import { Trophy, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useCallback } from 'react';

const PrizeTicker = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const text = '🏆 جائزة أسبوعية 25$ لصاحب أعلى نقاط أسبوعية كل يوم جمعة! تنافس الآن وكن الأول! 💰';
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    // Get the width of the first half (original content)
    const halfWidth = el.scrollWidth / 2;
    
    // Current position
    const style = getComputedStyle(el);
    const matrix = new DOMMatrix(style.transform);
    let x = matrix.m41;
    
    // Move left by 1px per frame (~60px/s)
    x -= 1;
    
    // Reset when first half has scrolled out
    if (Math.abs(x) >= halfWidth) {
      x = 0;
    }
    
    el.style.transform = `translateX(${x}px)`;
    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  const items = [...Array(8)].map((_, i) => (
    <span key={i} className="inline-flex items-center gap-2 text-sm font-bold px-8 whitespace-nowrap shrink-0">
      <Trophy className="w-4 h-4 shrink-0" />
      {text}
      <DollarSign className="w-4 h-4 shrink-0" />
    </span>
  ));

  return (
    <div
      className={cn(
        "w-full bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground overflow-hidden relative cursor-pointer",
        className
      )}
      onClick={() => navigate('/weekly-prize')}
    >
      <div className="flex items-center h-9 overflow-hidden">
        <div ref={scrollRef} className="flex items-center shrink-0" style={{ willChange: 'transform' }}>
          {items}
        </div>
      </div>
    </div>
  );
};

export default PrizeTicker;
