import { Trophy, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const PrizeTicker = ({ className }: { className?: string }) => {
  const navigate = useNavigate();
  const text = '🏆 جائزة أسبوعية 25$ لصاحب أعلى نقاط أسبوعية كل يوم جمعة! تنافس الآن وكن الأول! 💰';

  return (
    <div
      className={cn(
        "w-full bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground overflow-hidden relative cursor-pointer",
        className
      )}
      onClick={() => navigate('/weekly-prize')}
    >
      <div className="flex items-center h-9">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm font-bold px-4">
              <Trophy className="w-4 h-4 flex-shrink-0" />
              {text}
              <DollarSign className="w-4 h-4 flex-shrink-0" />
            </span>
          ))}
        </div>
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-sm font-bold px-4">
              <Trophy className="w-4 h-4 flex-shrink-0" />
              {text}
              <DollarSign className="w-4 h-4 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrizeTicker;
