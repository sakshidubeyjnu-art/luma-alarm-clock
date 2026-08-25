import { useState } from 'react';
import { ScreenHeader, PrimaryButton, GhostButton } from '@/components/ui';
import { hapticSoft, hapticMedium } from '@/lib/haptic';
import type { AppState } from '@/lib/types';
import { Apple, Mail, ShieldCheck } from 'lucide-react';

interface Props {
  state: AppState;
  onUpdate: (patch: Partial<AppState>) => void;
  onBack: () => void;
}

export function Auth({ state, onUpdate, onBack }: Props) {
  const [email, setEmail] = useState('');

  const signIn = (method: string) => {
    hapticMedium();
    onUpdate({ authed: true });
    onBack();
  };

  return (
    <div className="app-shell bg-paper-warm">
      <ScreenHeader title="Sign in" onBack={onBack} />
      <div className="scroll-area pb-24">
        <div className="flex flex-col items-center px-6 pt-16 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-white shadow-card" />
            <svg viewBox="0 0 96 96" className="h-16 w-16">
              <path d="M48 14 a34 34 0 0 1 0 68" fill="none" stroke="#1a1a1f" strokeWidth="3" strokeLinecap="round" />
              <line x1="48" y1="48" x2="48" y2="24" stroke="#1a1a1f" strokeWidth="4" strokeLinecap="round" />
              <line x1="48" y1="48" x2="64" y2="48" stroke="#1a1a1f" strokeWidth="3" strokeLinecap="round" />
              <circle cx="48" cy="48" r="3" fill="#1a1a1f" />
            </svg>
          </div>
          <h1 className="mt-6 font-display text-2xl font-medium text-ink">Luma Alarm Clock</h1>
          <p className="mt-2 text-sm text-ink/55 max-w-xs">Sign in to sync your alarms, routines and preferences across devices.</p>
        </div>

        <div className="px-5 mt-10 space-y-2.5">
          <button onClick={() => signIn('apple')} className="press flex w-full items-center justify-center gap-2.5 rounded-2xl bg-ink py-3.5 font-medium text-white shadow-soft">
            <Apple className="h-5 w-5" /> Continue with Apple
          </button>
          <button onClick={() => signIn('google')} className="press flex w-full items-center justify-center gap-2.5 rounded-2xl bg-white py-3.5 font-medium text-ink shadow-soft">
            <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </div>

        <div className="px-5 mt-6">
          <div className="rounded-3xl bg-white p-5 shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">Continue with email</p>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              className="mt-2 w-full rounded-xl bg-paper-fog px-4 py-3 text-[15px] text-ink outline-none focus:ring-2 focus:ring-sage-300"
            />
            <div className="mt-3">
              <PrimaryButton onClick={() => signIn('email')}>Continue</PrimaryButton>
            </div>
          </div>
        </div>

        <div className="px-5 mt-4">
          <button onClick={() => { hapticSoft(); onBack(); }} className="press w-full py-3 text-center text-sm font-medium text-ink/50">
            Continue without an account
          </button>
        </div>

        <div className="px-5 mt-6 flex items-center justify-center gap-2 text-xs text-ink/40">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>By continuing you agree to our Terms & Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}
