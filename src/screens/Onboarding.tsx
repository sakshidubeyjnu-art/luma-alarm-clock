import { useState } from 'react';
import { ThemeBackground } from '@/components/ThemeBackground';
import { PrimaryButton } from '@/components/ui';
import { TimePicker } from '@/components/TimePicker';
import { themes } from '@/lib/themes';
import type { ThemeId } from '@/lib/types';
import { hapticSoft } from '@/lib/haptic';

interface Props {
  onComplete: (wakeTime: string, theme: ThemeId) => void;
}

const slides = [
  { type: 'intro', theme: 'golden-gate' as ThemeId, title: 'Meet Luma Alarm Clock', body: 'A calmer way to start your day.' },
  { type: 'gratitude', theme: 'cozy-morning' as ThemeId, title: 'Start with gratitude', body: 'Be grateful to God for another morning.' },
  { type: 'focus', theme: 'forest' as ThemeId, title: 'Do what matters first', body: 'Protect your best hours for meaningful work.' },
  { type: 'consume', theme: 'pacific' as ThemeId, title: 'Choose what enters your mind', body: 'Use the internet intentionally.' },
];

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [wakeTime, setWakeTime] = useState('07:00');
  const [theme, setTheme] = useState<ThemeId>('sf-fog');

  const next = () => { hapticSoft(); setStep((s) => s + 1); };
  const back = () => { hapticSoft(); setStep((s) => s - 1); };

  if (step < 4) {
    const slide = slides[step];
    return (
      <div className="app-shell">
        <ThemeBackground themeId={slide.theme} />
        <div className="relative flex h-full flex-col">
          <div className="flex justify-center gap-1.5 pt-12 safe-top">
            {slides.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-6 bg-ink/70' : 'w-1.5 bg-ink/20'}`} />
            ))}
          </div>
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <h1 className="font-display text-4xl font-medium leading-tight text-ink text-balance animate-fade-up">{slide.title}</h1>
            <p className="mt-4 max-w-xs text-lg leading-relaxed text-ink/65 text-pretty animate-fade-up" style={{ animationDelay: '0.1s' }}>{slide.body}</p>
          </div>
          <div className="px-6 pb-10 safe-bottom">
            <PrimaryButton onClick={step < 3 ? next : () => setStep(4)}>{step < 3 ? 'Continue' : 'Next'}</PrimaryButton>
            {step > 0 && <button onClick={back} className="press mt-3 w-full py-2 text-sm text-ink/50">Back</button>}
          </div>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="app-shell bg-paper-warm">
        <div className="scroll-area">
          <div className="safe-top px-6 pt-16 pb-10 text-center">
            <h1 className="font-display text-3xl font-medium text-ink">When do you wake up?</h1>
            <p className="mt-2 text-ink/55">We'll help you protect your mornings.</p>
          </div>
          <div className="px-4 py-6">
            <TimePicker value={wakeTime} onChange={setWakeTime} />
          </div>
          <div className="px-6 pb-10">
            <PrimaryButton onClick={() => setStep(5)}>Continue</PrimaryButton>
            <button onClick={back} className="press mt-3 w-full py-2 text-sm text-ink/50">Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell bg-paper-warm">
      <div className="scroll-area">
        <div className="safe-top px-6 pt-16 pb-6 text-center">
          <h1 className="font-display text-3xl font-medium text-ink">Choose your morning atmosphere</h1>
          <p className="mt-2 text-ink/55">You can change this anytime.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 px-5 pb-6">
          {themes.filter((t) => !t.premium).map((t) => (
            <button key={t.id} onClick={() => { hapticSoft(); setTheme(t.id); }}
              className={`press relative overflow-hidden rounded-3xl shadow-soft transition-all ${theme === t.id ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper-warm' : ''}`}>
              <div className="h-28 w-full" style={{ background: `linear-gradient(135deg, ${t.swatch}, ${t.swatch2})` }} />
              <div className="px-3 py-2.5 text-left">
                <p className="text-sm font-medium text-ink">{t.name}</p>
                <p className="text-[11px] text-ink/45">{t.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="px-6 pb-10">
          <PrimaryButton onClick={() => onComplete(wakeTime, theme)}>Start using Luma</PrimaryButton>
          <button onClick={() => setStep(4)} className="press mt-3 w-full py-2 text-sm text-ink/50">Back</button>
          <p className="mt-4 text-center text-xs text-ink/40">By continuing you agree to our Terms & Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
