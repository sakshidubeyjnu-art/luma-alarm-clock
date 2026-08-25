import { useState } from 'react';
import { RefreshCw, Check, Sparkles } from 'lucide-react';
import { ScreenHeader, PrimaryButton, GhostButton } from '@/components/ui';
import { boringActivities } from '@/lib/activities';
import { hapticSoft, hapticMedium } from '@/lib/haptic';

export function Boring({ onBack }: { onBack: () => void }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * boringActivities.length));
  const [done, setDone] = useState(false);

  const another = () => { hapticSoft(); setIndex((i) => (i + 1) % boringActivities.length); setDone(false); };
  return (
    <div className="app-shell bg-paper-warm">
      <ScreenHeader title="Slightly boring" subtitle="A small ordinary thing" onBack={onBack} />
      <div className="scroll-area pb-24">
        <div className="flex flex-col items-center px-6 pt-16 text-center">
          <div className={`flex h-28 w-28 items-center justify-center rounded-full transition-colors duration-500 ${done ? 'bg-sage-100' : 'bg-peach-100'}`}>
            {done ? <Check className="h-10 w-10 text-sage-600" strokeWidth={1.5} /> : <Sparkles className="h-10 w-10 text-peach-500" strokeWidth={1.5} />}
          </div>
          <p className="mt-10 max-w-xs font-display text-xl leading-relaxed text-ink/70">You don't have to entertain your brain every minute.</p>
          <div className="mt-12 rounded-3xl bg-white px-8 py-10 shadow-card">
            <p className={`font-display text-3xl font-medium leading-snug text-ink transition-all ${done ? 'line-through opacity-35' : ''}`}>{boringActivities[index]}</p>
          </div>
          {done && <p className="mt-5 text-sm text-sage-600 animate-fade-up">That was enough. Ordinary is okay.</p>}
          <div className="mt-8 w-full max-w-xs space-y-2">
            {!done && <PrimaryButton onClick={() => { hapticMedium(); setDone(true); }}>Done</PrimaryButton>}
            <GhostButton onClick={another}><span className="inline-flex items-center gap-2"><RefreshCw className="h-4 w-4" /> Another idea</span></GhostButton>
          </div>
        </div>
      </div>
    </div>
  );
}
