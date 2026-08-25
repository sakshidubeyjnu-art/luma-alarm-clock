import { useEffect, useState } from 'react';
import { AlarmClock, Bell, RotateCcw, Heart } from 'lucide-react';
import { ThemeBackground } from '@/components/ThemeBackground';
import { formatTimeShort } from '@/lib/time';
import { getSound } from '@/lib/sounds';
import { getAudioManager } from '@/lib/audio';
import { hapticMedium, hapticStrong } from '@/lib/haptic';
import type { Alarm } from '@/lib/types';

interface Props {
  alarm: Alarm;
  onStop: () => void;
  onSnooze: () => void;
  onStartMorning: () => void;
}

export function AlarmRinging({ alarm, onStop, onSnooze, onStartMorning }: Props) {
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const mgr = getAudioManager();
    mgr.play(alarm.sound, true);
    hapticStrong();

    const unsub = mgr.subscribe((status) => {
      if (status.error) setError(true);
    });

    return () => {
      unsub();
      mgr.stop();
    };
  }, [alarm.sound]);

  const dismiss = (action: () => void) => {
    hapticMedium();
    action();
  };

  const soundName = getSound(alarm.sound).name;
  const [timeStr, ampm] = formatTimeShort(alarm.time).split(' ');

  return (
    <div className="app-shell">
      <ThemeBackground themeId={alarm.theme} />
      <div className="relative flex h-full flex-col items-center px-6 pb-10 pt-16 safe-top safe-bottom">
        <div className="flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink/60 backdrop-blur-sm">
          <Bell className="h-3.5 w-3.5" /> Alarm
        </div>
        <div className="mt-12 text-center">
          <p className="font-display text-7xl font-medium tracking-tight text-ink">{timeStr}</p>
          <p className="mt-1 font-display text-2xl text-ink/60">{ampm}</p>
          <p className="mt-5 font-display text-2xl font-medium text-ink">Good morning.</p>
          <p className="mt-1 text-ink/55">{alarm.label}</p>
          <p className="mt-3 text-xs uppercase tracking-wider text-ink/40">{soundName}</p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl bg-white/70 px-4 py-3 text-center backdrop-blur-sm">
            <p className="text-sm text-blush-500">Unable to play this sound. Please try again.</p>
          </div>
        )}

        <div className="mt-auto w-full max-w-sm space-y-3">
          {!started && (
            <button onClick={() => { hapticMedium(); setStarted(true); onStartMorning(); }} className="press flex w-full items-center justify-center gap-2 rounded-2xl bg-white/70 py-3.5 font-medium text-ink shadow-soft backdrop-blur-sm">
              <Heart className="h-4 w-4" /> Start morning
            </button>
          )}
          <div className="flex gap-3">
            <button onClick={() => dismiss(onSnooze)} className="press flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/70 py-4 font-medium text-ink shadow-soft backdrop-blur-sm">
              <RotateCcw className="h-4 w-4" /> Snooze {alarm.snooze}m
            </button>
            <button onClick={() => dismiss(onStop)} className="press flex flex-1 items-center justify-center gap-2 rounded-2xl bg-ink py-4 font-medium text-white shadow-card">
              <AlarmClock className="h-4 w-4" /> Stop
            </button>
          </div>
          <p className="text-center text-xs text-ink/40">Take a moment before reaching for your phone.</p>
        </div>
      </div>
    </div>
  );
}
