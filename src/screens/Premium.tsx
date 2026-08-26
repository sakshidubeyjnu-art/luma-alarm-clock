import { useState } from 'react';
import { Check, Crown, Star } from 'lucide-react';
import { ScreenHeader, PrimaryButton, GhostButton } from '@/components/ui';
import { hapticSoft, hapticMedium } from '@/lib/haptic';
import type { AppState, PremiumPlan } from '@/lib/types';

const features = [
  'Advanced Wake Missions',
  'Extra Activities',
  'Premium Sounds',
  'Premium Themes',
  'Custom Themes',
  'Advanced Alarm Customization',
  'Sound Mixing',
  'Ad-Free Luma',
];

const plans: { id: PremiumPlan; label: string; price: string; period: string; badge?: string }[] = [
  { id: 'monthly', label: 'Monthly', price: '$3.99', period: 'per month' },
  { id: 'yearly', label: 'Yearly', price: '$29.99', period: 'per year', badge: 'Best Value' },
  { id: 'lifetime', label: 'Lifetime', price: '$79.99', period: 'one-time' },
];

interface Props {
  state: AppState;
  onUpdate: (patch: Partial<AppState>) => void;
  onBack: () => void;
}

export function Premium({ state, onUpdate, onBack }: Props) {
  const [selected, setSelected] = useState<PremiumPlan>('yearly');

  const subscribe = () => {
    hapticMedium();
    onUpdate({ premium: selected });
  };

  return (
    <div className="app-shell bg-paper-warm">
      <ScreenHeader title="Luma Premium" subtitle="Make your mornings more personal" onBack={onBack} />
      <div className="scroll-area pb-24">
        <div className="px-5 pt-6">
          <div className="flex flex-col items-center text-center animate-fade-up">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold-200 to-gold-400 shadow-card">
              <Crown className="h-7 w-7 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="mt-4 font-display text-2xl font-medium text-ink">Luma Premium</h1>
            <p className="mt-1 text-sm text-ink/55 max-w-xs">More personalization, more variety, advanced functionality.</p>
          </div>

          <div className="mt-8 space-y-2">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-soft">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sage-100">
                  <Check className="h-3.5 w-3.5 text-sage-600" strokeWidth={2.5} />
                </div>
                <p className="text-[15px] font-medium text-ink">{f}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 px-1 pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">Choose a plan</p>
          <div className="space-y-2.5">
            {plans.map((p) => (
              <button key={p.id} onClick={() => { hapticSoft(); setSelected(p.id); }}
                className={`press flex w-full items-center justify-between rounded-3xl bg-white px-5 py-4 shadow-soft transition-all ${selected === p.id ? 'ring-2 ring-ink' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected === p.id ? 'border-ink bg-ink' : 'border-ink/20'}`}>
                    {selected === p.id && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-[15px] font-medium text-ink">{p.label}</p>
                      {p.badge && <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-semibold text-gold-400"><Star className="h-2.5 w-2.5" /> {p.badge}</span>}
                    </div>
                    <p className="text-xs text-ink/45">{p.period}</p>
                  </div>
                </div>
                <p className="font-display text-xl font-medium text-ink">{p.price}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <PrimaryButton onClick={subscribe}>Continue with {plans.find((p) => p.id === selected)?.label}</PrimaryButton>
            <GhostButton onClick={onBack}>Restore purchases</GhostButton>
          </div>

           <div className="mt-5 flex justify-center gap-4 text-xs text-ink/40">
             <span>Terms</span>
             <span aria-hidden="true">·</span>
             <span>Privacy</span>
             <span aria-hidden="true">·</span>
             <span>Manage subscription</span>
          </div>

          <p className="mt-4 text-center text-xs text-ink/35">Cancel anytime. No fake scarcity, no pressure.</p>

          {state.premium !== 'free' && (
            <div className="mt-6 rounded-2xl bg-sage-50 p-4 text-center">
              <p className="text-sm font-medium text-sage-700">You have Luma Premium ({state.premium}).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
