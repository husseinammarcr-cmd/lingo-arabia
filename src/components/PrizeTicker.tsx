import { Trophy, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const TickerContent = ({ text }: { text: string }) => (
  <>
    {[...Array(4)].map((_, i) => (
      <span key={i} className="inline-flex items-center gap-2 text-sm font-bold px-8 shrink-0">
        <Trophy className="w-4 h-4 shrink-0" />
        {text}
        <DollarSign className="w-4 h-4 shrink-0" />
      </span>
    ))}
  </>
);

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
      <div className="flex items-center h-9 w-max animate-marquee-loop">
        <TickerContent text={text} />
        <TickerContent text={text} />
      </div>
    </div>
  );
};

export default PrizeTicker;
