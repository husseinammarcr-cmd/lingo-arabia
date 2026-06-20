import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface CallFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenario?: string;
}

export default function CallFeedbackDialog({ open, onOpenChange, scenario }: CallFeedbackDialogProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setRating(0);
    setHover(0);
    setNote('');
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (rating < 1) {
      toast({ title: 'تنبيه', description: 'يرجى اختيار تقييم من 1 إلى 5 نجوم', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('ai_call_feedback').insert({
      user_id: user.id,
      rating,
      note: note.trim() || null,
      scenario: scenario || null,
      user_name: (user.user_metadata as any)?.name || (user.user_metadata as any)?.display_name || null,
      user_email: user.email || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: 'خطأ', description: 'تعذر حفظ التقييم، حاول مرة أخرى', variant: 'destructive' });
      return;
    }
    toast({ title: 'شكراً لك! 💚', description: 'تم إرسال تقييمك بنجاح' });
    reset();
    onOpenChange(false);
  };

  const handleSkip = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">كيف كانت المكالمة؟</DialogTitle>
          <DialogDescription className="text-center">
            قيّم تجربتك مع المعلم الذكي وشاركنا ملاحظاتك
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-2 py-4" dir="ltr">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110"
              aria-label={`${n} نجوم`}
            >
              <Star
                className={`w-10 h-10 ${
                  (hover || rating) >= n ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>

        <Textarea
          placeholder="اكتب ملاحظتك هنا (اختياري)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          maxLength={1000}
          className="resize-none"
        />

        <div className="flex gap-2 mt-2">
          <Button variant="ghost" onClick={handleSkip} disabled={submitting} className="flex-1">
            تخطي
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || rating < 1} className="flex-1">
            {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
