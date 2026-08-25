import { useEffect, useState } from 'react';

export function Splash({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(onDone, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="app-shell flex flex-col items-center justify-center bg-paper-warm">
      <div className="relative flex flex-col items-center">
        <div className={`transition-all duration-1000 ease-out ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 rounded-full bg-white shadow-card" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 96 96" className="h-20 w-20">
                <path d="M48 14 a34 34 0 0 1 0 68" fill="none" stroke="#1a1a1f" strokeWidth="3" strokeLinecap="round" />
                <line x1="48" y1="48" x2="48" y2="24" stroke="#1a1a1f" strokeWidth="4" strokeLinecap="round" />
                <line x1="48" y1="48" x2="64" y2="48" stroke="#1a1a1f" strokeWidth="3" strokeLinecap="round" />
                <circle cx="48" cy="48" r="3" fill="#1a1a1f" />
              </svg>
            </div>
          </div>
        </div>
        <h1 className={`mt-8 font-display text-2xl font-medium tracking-tight text-ink transition-all duration-1000 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          Luma Alarm Clock
        </h1>
      </div>
      <div className={`absolute bottom-20 transition-opacity duration-1000 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-1 w-24 overflow-hidden rounded-full bg-ink/10">
          <div className="h-full w-1/2 rounded-full bg-sage-400 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        </div>
      </div>
    </div>
  );
}
