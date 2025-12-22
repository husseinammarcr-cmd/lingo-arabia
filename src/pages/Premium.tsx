import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Check, ArrowRight } from 'lucide-react';

const Premium = () => {
  const navigate = useNavigate();
  const features = ['بدون إعلانات', 'قلوب غير محدودة', 'محتوى حصري', 'دعم أولوية'];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="bg-gradient-accent p-6 text-center">
          <Crown className="w-16 h-16 mx-auto text-accent-foreground mb-4" />
          <h1 className="text-3xl font-bold text-accent-foreground">LingoArab Premium</h1>
        </div>
        <CardContent className="p-6 space-y-6">
          <ul className="space-y-3">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-3"><Check className="w-5 h-5 text-success" /><span>{f}</span></li>
            ))}
          </ul>
          <Button variant="accent" size="xl" className="w-full">اشترك الآن - $9.99/شهر</Button>
          <Button variant="ghost" className="w-full" onClick={() => navigate(-1)}><ArrowRight className="w-4 h-4" /> العودة</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Premium;
