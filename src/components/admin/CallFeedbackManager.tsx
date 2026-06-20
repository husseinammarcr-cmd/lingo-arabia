import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Trash2, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Feedback {
  id: string;
  user_id: string;
  rating: number;
  note: string | null;
  scenario: string | null;
  user_name: string | null;
  user_email: string | null;
  created_at: string;
}

const SCENARIO_LABEL: Record<string, string> = {
  restaurant: 'مطعم 🍽️',
  airport: 'مطار ✈️',
  hotel: 'فندق 🏨',
  shopping: 'تسوق 🛍️',
};

export default function CallFeedbackManager() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ai_call_feedback')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) {
      toast({ title: 'خطأ', description: 'تعذر تحميل التقييمات', variant: 'destructive' });
      return;
    }
    setItems((data as Feedback[]) || []);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذا التقييم؟')) return;
    const { error } = await supabase.from('ai_call_feedback').delete().eq('id', id);
    if (error) {
      toast({ title: 'خطأ', description: 'تعذر الحذف', variant: 'destructive' });
      return;
    }
    setItems((prev) => prev.filter((x) => x.id !== id));
    toast({ title: 'تم الحذف' });
  };

  const avg = items.length > 0
    ? (items.reduce((s, x) => s + x.rating, 0) / items.length).toFixed(1)
    : '—';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>تقييمات المكالمات الصوتية</span>
          <div className="flex items-center gap-3 text-sm font-normal">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {avg}
            </span>
            <Badge variant="secondary">{items.length}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">لا توجد تقييمات بعد</p>
        ) : (
          <div className="space-y-3">
            {items.map((f) => (
              <div key={f.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{f.user_name || 'مستخدم'}</span>
                      {f.user_email && (
                        <span className="text-xs text-muted-foreground">{f.user_email}</span>
                      )}
                      {f.scenario && (
                        <Badge variant="outline">{SCENARIO_LABEL[f.scenario] || f.scenario}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 mt-1" dir="ltr">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-4 h-4 ${n <= f.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(f.created_at).toLocaleString('ar-EG')}
                    </span>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(f.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                {f.note && (
                  <p className="text-sm bg-muted/50 rounded-md p-3 whitespace-pre-wrap">{f.note}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
