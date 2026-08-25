import { ScreenHeader, Row, SectionLabel, GhostButton, PrimaryButton } from '@/components/ui';
import { getTheme } from '@/lib/themes';
import { getSound } from '@/lib/sounds';
import { hapticSoft } from '@/lib/haptic';
import type { AppState } from '@/lib/types';
import { Bell, Moon, Sun, Palette, Volume2, Clock, Sparkles, Heart, Crown, ChevronRight } from 'lucide-react';

interface Props {
  state: AppState;
  onNavigate: (s: 'themes' | 'sounds' | 'premium' | 'settings' | 'auth') => void;
}

export function Profile({ state, onNavigate }: Props) {
  const theme = getTheme(state.theme);
  const morningSound = getSound(state.morningSound);
  const focusSound = getSound(state.focusSound);

  return (
    <div className="app-shell bg-paper-warm">
      <ScreenHeader title="Profile" />
      <div className="scroll-area pb-24">
        {/* Avatar */}
        <div className="flex flex-col items-center pt-6 pb-8 px-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sage-300 to-ocean-300 shadow-card">
            <span className="font-display text-2xl font-medium text-white">L</span>
          </div>
          <p className="mt-4 font-display text-xl font-medium text-ink">Good to see you.</p>
          {state.premium !== 'free' && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-xs font-medium text-gold-400">
              <Crown className="h-3 w-3" /> Luma Premium
            </span>
          )}
        </div>

        {/* Routine */}
        <SectionLabel>Your routine</SectionLabel>
        <div className="mx-4 overflow-hidden rounded-3xl bg-white shadow-soft">
          <Row label="Wake" sublabel={state.wakeTime} right={<Sun className="h-4 w-4 text-ink/30" />} />
          <div className="border-t border-paper-fog" />
          <Row label="Focus" sublabel={`${state.focusDuration} minutes`} right={<Clock className="h-4 w-4 text-ink/30" />} />
          <div className="border-t border-paper-fog" />
          <Row label="Sleep" sublabel="11:00 PM" right={<Moon className="h-4 w-4 text-ink/30" />} />
        </div>

        {/* Preferences */}
        <SectionLabel>Preferences</SectionLabel>
        <div className="mx-4 overflow-hidden rounded-3xl bg-white shadow-soft">
          <Row label="Theme" sublabel={theme.name} onClick={() => onNavigate('themes')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
          <div className="border-t border-paper-fog" />
          <Row label="Morning sound" sublabel={morningSound.name} onClick={() => onNavigate('sounds')} right={<Volume2 className="h-4 w-4 text-ink/30" />} />
          <div className="border-t border-paper-fog" />
          <Row label="Focus duration" sublabel={`${state.focusDuration} minutes`} onClick={() => onNavigate('settings')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
          <div className="border-t border-paper-fog" />
          <Row label="Quiet Morning" sublabel={state.quietMorning ? `${state.quietMorning} min` : 'Off'} onClick={() => onNavigate('settings')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
          <div className="border-t border-paper-fog" />
          <Row label="Notifications" sublabel={state.notifications ? 'On' : 'Off'} onClick={() => onNavigate('settings')} right={<Bell className="h-4 w-4 text-ink/30" />} />
        </div>

        {/* Your Luma */}
        <SectionLabel>Your Luma</SectionLabel>
        <div className="mx-4 overflow-hidden rounded-3xl bg-white shadow-soft">
          <Row label="Saved sounds" sublabel={`${state.favoriteSounds.length} sounds`} onClick={() => onNavigate('sounds')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
          <div className="border-t border-paper-fog" />
          <Row label="Saved themes" sublabel={`${state.favoriteThemes.length} themes`} onClick={() => onNavigate('themes')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
          <div className="border-t border-paper-fog" />
          <Row label="Saved activities" sublabel={`${state.savedActivities.length} activities`} onClick={() => onNavigate('settings')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
          <div className="border-t border-paper-fog" />
          <Row label="Gratitude entries" sublabel={`${state.gratitude.length} entries`} onClick={() => onNavigate('settings')} right={<Heart className="h-4 w-4 text-ink/30" />} />
        </div>

        {/* Premium */}
        {state.premium === 'free' && (
          <>
            <SectionLabel>Luma Premium</SectionLabel>
            <div className="mx-4 overflow-hidden rounded-3xl bg-ink p-5 text-white shadow-card">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-gold-300" />
                <p className="font-display text-lg font-medium">Make your mornings more personal</p>
              </div>
              <p className="mt-2 text-sm text-white/60">Wake Missions, premium sounds, themes, and ad-free Luma.</p>
              <div className="mt-4">
                <button onClick={() => { hapticSoft(); onNavigate('premium'); }}
                  className="press w-full rounded-2xl bg-white py-3 text-center font-medium text-ink">
                  Explore Premium
                </button>
              </div>
            </div>
          </>
        )}

        <SectionLabel>About</SectionLabel>
        <div className="mx-4 overflow-hidden rounded-3xl bg-white shadow-soft">
          <Row label="Settings" onClick={() => onNavigate('settings')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
          <div className="border-t border-paper-fog" />
          <Row label="Sign in" onClick={() => onNavigate('auth')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
        </div>

        <div className="px-4 pt-6">
          <p className="text-center text-xs text-ink/35">Luma Alarm Clock</p>
          <p className="mt-1 text-center text-xs text-ink/25">Beautiful enough to love. Calm enough to leave.</p>
        </div>
      </div>
    </div>
  );
}
