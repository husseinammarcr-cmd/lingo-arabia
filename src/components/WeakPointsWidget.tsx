import { Link } from 'react-router-dom';
import { Brain, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeakPoints } from '@/hooks/useWeakPoints';

export const WeakPointsWidget = () => {
  const { data: items = [] } = useWeakPoints(true);
  const top = items.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-cyan-400/5 to-transparent p-4"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">نقاط الضعف</h3>
            <p className="text-[11px] text-muted-foreground">
              {items.length === 0 ? 'لا أخطاء حالياً 🎉' : `${items.length} عنصر يحتاج مراجعة`}
            </p>
          </div>
        </div>
        <Link
          to="/app/weak-points"
          className="text-xs text-[#cdff4f] hover:underline flex items-center gap-1"
        >
          عرض الكل <ChevronLeft className="w-3 h-3" />
        </Link>
      </div>
      {top.length > 0 && (
        <ul className="space-y-1.5">
          {top.map((w) => (
            <li
              key={w.id}
              className="flex items-center gap-2 text-sm rounded-lg bg-white/5 px-3 py-1.5"
            >
              <span dir="ltr" className="font-medium truncate flex-1">
                {w.item_data.english || w.item_key}
              </span>
              <span className="text-xs text-red-400">{w.mistakes_count}×</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default WeakPointsWidget;
