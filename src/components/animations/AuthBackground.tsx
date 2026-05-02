import { motion } from 'framer-motion';

const AuthBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-[#0d0d0d]">
      {/* Purple radial glow top-right */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 75% 15%, rgba(139, 47, 248, 0.25) 0%, transparent 45%)',
        }}
      />
      {/* Subtle bottom-left purple wash */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 90%, rgba(139, 47, 248, 0.10) 0%, transparent 40%)',
        }}
      />

      {/* Curved flowing lines (top-right) */}
      <svg
        className="absolute top-0 right-0 w-[80%] h-[60%] opacity-40"
        viewBox="0 0 800 600"
        fill="none"
        preserveAspectRatio="xMaxYMin slice"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.path
            key={i}
            d={`M ${100 + i * 10},${250 + i * 8} Q ${400 - i * 5},${50 + i * 6} ${800},${180 + i * 12}`}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="0.6"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2.5, delay: i * 0.08, ease: 'easeOut' }}
          />
        ))}
      </svg>

      {/* Glowing orb */}
      <motion.div
        className="absolute"
        style={{ top: '18%', right: '8%' }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: 1,
          y: [0, -10, 0],
        }}
        transition={{
          scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 1 },
        }}
      >
        <div
          className="w-32 h-32 md:w-40 md:h-40 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 35% 30%, #ffffff 0%, #c4b5fd 20%, #8B2FF8 55%, #4c1d95 100%)',
            boxShadow:
              '0 0 60px 20px rgba(139, 47, 248, 0.5), 0 0 120px 40px rgba(139, 47, 248, 0.25), inset -10px -10px 30px rgba(0,0,0,0.4)',
          }}
        />
      </motion.div>
    </div>
  );
};

export default AuthBackground;
