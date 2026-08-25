import { useState } from 'react';
import { ThemeBackground } from '@/components/ThemeBackground';
import { AnalogClock } from '@/components/Clock';
import { Toggle } from '@/components/Toggle';
import { Sheet } from '@/components/Sheet';
import { PrimaryButton, GhostButton } from '@/components/ui';
import { formatTimeShort, todayLabel, greeting, minutesToNextAlarm, nextAlarmLabel } from '@/lib/time';
import { factOfDay } from '@/lib/facts';
import { getTheme } from '@/lib/themes';
import { hapticSoft, hapticMedium } from '@/lib/haptic';
import type { AppState, GratitudeEntry } from '@/lib/types';
import { Sun, Bell, CheckCircle2, Circle, Sparkles, ArrowRight, Heart } from 'lucide-react';

interface Props {
  state: AppState;
  onNavigate: (s: 'alarms' | 'focus' | 'tasks' | 'sounds' | 'themes' | 'facts' | 'boring' | 'meditation' | 'editorial' | 'premium') => void;
  onToggleRoutine: (id: string) => void;
  onAddGratitude: (text: string) => void;
}

export function Home({ state, onNavigate, onToggleRoutine, onAddGratitude }: Props) {
  const [gratitudeOpen, setGratitudeOpen] = useState(false);
  const [gratitudeText, setGratitudeText] = useState('');
  const theme = getTheme(state.theme);
  const fact = factOfDay();
  const enabledAlarms = state.alarms.filter((a) => a.enabled);
  const nextAlarm = enabledAlarms[0];
  const nextIn = nextAlarm ? minutesToNextAlarm(nextAlarm.time, nextAlarm.days, nextAlarm.repeat) : 0;

  const routineDone = state.routine.filter((r) => r.done).length;
  const routineTotal = state.routine.length;

  return (
    <div className="app-shell">
      <ThemeBackground themeId={state.theme} dim={theme.dark} />
      <div className="relative scroll-area" style={{ color: theme.textOn }}>
        <div className="safe-top px-6 pt-10 pb-24">
          {/* Clock */}
          <div className="flex flex-col items-center animate-fade-in">
            <div className={`rounded-full p-2 shadow-card ${theme.dark ? 'bg-white' : 'bg-white/60 backdrop-blur-sm'}`}>
              <AnalogClock size={140} showSeconds={false} />
            </div>
            <p className="mt-5 text-sm font-medium tracking-wide opacity-60">{todayLabel()}</p>
            <h1 className="mt-1 font-display text-2xl font-medium">{greeting()}</h1>
          </div>

          {/* Next alarm */}
          {nextAlarm && (
            <button onClick={() => onNavigate('alarms')} className="press mt-6 w-full overflow-hidden rounded-3xl glass border border-white/40 shadow-soft">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
                    <Bell className="h-4 w-4 text-ink" strokeWidth={1.8} />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-wider opacity-50" style={{ color: theme.textOn }}>Next alarm</p>
                    <p className="font-display text-lg font-medium" style={{ color: theme.textOn }}>{formatTimeShort(nextAlarm.time)} · {nextAlarm.label}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Toggle on={nextAlarm.enabled} onChange={() => onNavigate('alarms')} />
                  <p className="mt-1 text-[11px] opacity-50">{nextAlarmLabel(nextIn)}</p>
                </div>
              </div>
            </button>
          )}

          {/* Gratitude */}
          <button onClick={() => { hapticSoft(); setGratitudeOpen(true); }}
            className="press mt-3 w-full rounded-3xl glass border border-white/40 px-5 py-4 text-left shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-100">
                <Heart className="h-4 w-4 text-blush-500" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider opacity-50" style={{ color: theme.textOn }}>Gratitude</p>
                <p className="font-display text-base font-medium" style={{ color: theme.textOn }}>Be grateful to God for another morning.</p>
              </div>
            </div>
          </button>

          {/* Today's priority */}
          <div className="mt-6 rounded-3xl glass border border-white/40 p-5 shadow-soft">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 opacity-60" strokeWidth={1.8} />
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-50" style={{ color: theme.textOn }}>Today's priority</p>
            </div>
            <p className="mt-2 font-display text-xl font-medium leading-snug" style={{ color: theme.textOn }}>{state.priority}</p>
            <button onClick={() => onNavigate('tasks')} className="press-sm mt-3 inline-flex items-center gap-1 text-sm font-medium opacity-70" style={{ color: theme.textOn }}>
              View tasks <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Morning routine */}
          <div className="mt-3 rounded-3xl glass border border-white/40 p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-50" style={{ color: theme.textOn }}>Morning routine</p>
              <p className="text-xs opacity-50" style={{ color: theme.textOn }}>{routineDone}/{routineTotal}</p>
            </div>
            <div className="mt-3 space-y-1">
              {state.routine.slice(0, 5).map((r) => (
                <button key={r.id} onClick={() => { hapticSoft(); onToggleRoutine(r.id); }}
                  className="press-sm flex w-full items-center gap-3 py-1.5 text-left">
                  {r.done ? <CheckCircle2 className="h-5 w-5 text-sage-500" strokeWidth={1.8} /> : <Circle className="h-5 w-5 opacity-30" strokeWidth={1.8} />}
                  <span className={`flex-1 text-[15px] ${r.done ? 'line-through opacity-40' : ''}`} style={{ color: theme.textOn }}>{r.label}</span>
                  <span className="text-xs opacity-40" style={{ color: theme.textOn }}>{r.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Focus */}
          <button onClick={() => onNavigate('focus')}
            className="press mt-3 flex w-full items-center justify-between rounded-3xl bg-ink px-5 py-4 text-left shadow-card">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">Focus</p>
              <p className="font-display text-lg font-medium text-white">{state.focusDuration} minutes</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <span className="text-sm font-medium text-white">Start focus</span>
              <ArrowRight className="h-4 w-4 text-white" />
            </div>
          </button>

          {/* Luma Fact */}
          <button onClick={() => onNavigate('facts')}
            className="press mt-3 w-full rounded-3xl glass border border-white/40 p-5 text-left shadow-soft">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 opacity-60" strokeWidth={1.8} />
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-50" style={{ color: theme.textOn }}>{fact.type}</p>
            </div>
            <p className="mt-2 font-display text-lg font-medium leading-snug" style={{ color: theme.textOn }}>{fact.title}</p>
            <p className="mt-1 text-sm opacity-60" style={{ color: theme.textOn }}>{fact.body}</p>
          </button>

          {/* Quick actions */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button onClick={() => onNavigate('boring')} className="press rounded-3xl glass border border-white/40 p-4 text-left shadow-soft">
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-50" style={{ color: theme.textOn }}>Slightly boring</p>
              <p className="mt-1 font-display text-base font-medium" style={{ color: theme.textOn }}>Do one ordinary thing</p>
            </button>
            <button onClick={() => onNavigate('meditation')} className="press rounded-3xl glass border border-white/40 p-4 text-left shadow-soft">
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-50" style={{ color: theme.textOn }}>Breathe</p>
              <p className="mt-1 font-display text-base font-medium" style={{ color: theme.textOn }}>A quiet moment</p>
            </button>
          </div>

          {/* Editorial */}
          <button onClick={() => onNavigate('editorial')}
            className="press mt-3 w-full rounded-3xl glass border border-white/40 p-5 text-left shadow-soft">
            <p className="text-[11px] font-semibold uppercase tracking-wider opacity-50" style={{ color: theme.textOn }}>What you consume matters</p>
            <p className="mt-2 font-display text-base font-medium leading-snug" style={{ color: theme.textOn }}>
              "Is this something I chose, or something that chose me?"
            </p>
          </button>
        </div>
      </div>

      {/* Gratitude sheet */}
      <Sheet open={gratitudeOpen} onClose={() => setGratitudeOpen(false)} title="Gratitude">
        <div className="py-2">
          <p className="font-display text-lg text-ink/70">Be grateful to God for another morning.</p>
          <p className="mt-1 text-sm text-ink/50">Optional. One thing I'm grateful for...</p>
          <textarea
            value={gratitudeText}
            onChange={(e) => setGratitudeText(e.target.value)}
            placeholder="One thing I'm grateful for..."
            className="mt-4 w-full resize-none rounded-2xl bg-paper-fog p-4 text-[15px] text-ink outline-none focus:ring-2 focus:ring-sage-300"
            rows={4}
          />
          <div className="mt-4 space-y-2">
            <PrimaryButton onClick={() => { if (gratitudeText.trim()) { onAddGratitude(gratitudeText.trim()); hapticMedium(); } setGratitudeText(''); setGratitudeOpen(false); }}>
              Save
            </PrimaryButton>
            <GhostButton onClick={() => { setGratitudeText(''); setGratitudeOpen(false); }}>Skip</GhostButton>
          </div>
          {state.gratitude.length > 0 && (
            <div className="mt-6">
              <p className="pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">Recent</p>
              <div className="space-y-2">
                {state.gratitude.slice(0, 3).map((g: GratitudeEntry) => (
                  <div key={g.id} className="rounded-2xl bg-paper-fog p-3">
                    <p className="text-sm text-ink/70">{g.text}</p>
                    <p className="mt-1 text-xs text-ink/35">{g.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Sheet>
    </div>
  );
}
