import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Coffee, Volume2 } from 'lucide-react';
import { ScreenHeader, PrimaryButton } from '@/components/ui';
import { msToHMS } from '@/lib/time';
import { getSound, sounds } from '@/lib/sounds';
import { getAudioManager, subscribeAudio, type AudioStatus } from '@/lib/audio';
import { hapticSoft, hapticMedium } from '@/lib/haptic';
import type { AppState, SoundId } from '@/lib/types';

interface Props {
  state: AppState;
  onUpdate: (patch: Partial<AppState>) => void;
  onNavigate: (s: 'boring' | 'tasks' | 'home') => void;
}

type Phase = 'idle' | 'running' | 'paused' | 'break' | 'done';

export function Focus({ state, onUpdate, onNavigate }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [remaining, setRemaining] = useState(state.focusDuration * 60 * 1000);
  const [breakRemaining, setBreakRemaining] = useState(state.breakDuration * 60 * 1000);
  const [label, setLabel] = useState('Mathematics');
  const [soundOn, setSoundOn] = useState(false);
  const [soundPickerOpen, setSoundPickerOpen] = useState(false);
  const [audioStatus, setAudioStatus] = useState<AudioStatus>(getAudioManager().getStatus());
  const endTimeRef = useRef<number>(0);
  const breakEndRef = useRef<number>(0);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    const unsub = subscribeAudio(setAudioStatus);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (soundOn && phase === 'running') {
      getAudioManager().play(state.focusSound, true);
    } else if (phase !== 'running') {
      getAudioManager().stop();
    }
    return () => { if (phase !== 'running') getAudioManager().stop(); };
  }, [soundOn, phase, state.focusSound]);

  useEffect(() => {
    if (phase === 'running') {
      endTimeRef.current = Date.now() + remaining;
      const tick = () => {
        const left = endTimeRef.current - Date.now();
        if (left <= 0) {
          hapticMedium();
          getAudioManager().stop();
          setPhase('done');
          setRemaining(0);
          return;
        }
        setRemaining(left);
        tickRef.current = requestAnimationFrame(tick);
      };
      tickRef.current = requestAnimationFrame(tick);
    } else if (phase === 'break') {
      breakEndRef.current = Date.now() + breakRemaining;
      const tick = () => {
        const left = breakEndRef.current - Date.now();
        if (left <= 0) {
          hapticSoft();
          setPhase('idle');
          setBreakRemaining(state.breakDuration * 60 * 1000);
          return;
        }
        setBreakRemaining(left);
        tickRef.current = requestAnimationFrame(tick);
      };
      tickRef.current = requestAnimationFrame(tick);
    }
    return () => { if (tickRef.current) cancelAnimationFrame(tickRef.current); };
  }, [phase, state.breakDuration]);

  const start = () => { hapticSoft(); setRemaining(state.focusDuration * 60 * 1000); setPhase('running'); };
  const pause = () => { hapticSoft(); setPhase('paused'); };
  const resume = () => { hapticSoft(); setPhase('running'); };
  const reset = () => { hapticSoft(); getAudioManager().stop(); setPhase('idle'); setRemaining(state.focusDuration * 60 * 1000); };
  const takeBreak = () => { hapticSoft(); setBreakRemaining(state.breakDuration * 60 * 1000); setPhase('break'); };

  const progress = phase === 'break'
    ? 1 - breakRemaining / (state.breakDuration * 60 * 1000)
    : 1 - remaining / (state.focusDuration * 60 * 1000);

  const time = phase === 'break' ? msToHMS(breakRemaining) : msToHMS(remaining);
  const total = phase === 'break' ? state.breakDuration * 60 : state.focusDuration * 60;
  const elapsed = total - (phase === 'break' ? breakRemaining / 1000 : remaining / 1000);
  const pct = total > 0 ? (elapsed / total) * 100 : 0;

  const focusSounds = sounds.filter((s) => s.category === 'focus' || s.category === 'nature');

  return (
    <div className="app-shell bg-paper-warm">
      <ScreenHeader title="Focus" subtitle="Do what matters" />
      <div className="scroll-area pb-24">
        {phase === 'idle' && (
          <div className="flex flex-col px-5 pt-4 animate-fade-up">
            <div className="rounded-3xl bg-white p-5 shadow-soft">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">What are you focusing on?</p>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Mathematics"
                className="mt-2 w-full bg-transparent font-display text-2xl font-medium text-ink outline-none"
              />
            </div>

            <div className="mt-4 rounded-3xl bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink/60">Focus duration</p>
                <div className="flex gap-1.5">
                  {[25, 45, 60, 90].map((d) => (
                    <button key={d} onClick={() => { hapticSoft(); onUpdate({ focusDuration: d }); setRemaining(d * 60 * 1000); }}
                      className={`press-sm rounded-full px-3 py-1.5 text-xs font-medium ${state.focusDuration === d ? 'bg-ink text-white' : 'bg-paper-fog text-ink/60'}`}>
                      {d}m
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-paper-fog pt-3">
                <p className="text-sm font-medium text-ink/60">Break duration</p>
                <div className="flex gap-1.5">
                  {[5, 10, 15].map((d) => (
                    <button key={d} onClick={() => { hapticSoft(); onUpdate({ breakDuration: d }); }}
                      className={`press-sm rounded-full px-3 py-1.5 text-xs font-medium ${state.breakDuration === d ? 'bg-ink text-white' : 'bg-paper-fog text-ink/60'}`}>
                      {d}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-3xl bg-white p-5 shadow-soft">
              <button onClick={() => setSoundPickerOpen(!soundPickerOpen)} className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-ink/50" strokeWidth={1.8} />
                  <p className="text-sm font-medium text-ink/60">Focus sound</p>
                </div>
                <p className="text-sm text-ink/50">{getSound(state.focusSound).name}</p>
              </button>
              {soundPickerOpen && (
                <div className="mt-3 space-y-1.5 border-t border-paper-fog pt-3 animate-fade-in">
                  {focusSounds.map((s) => (
                    <button key={s.id} onClick={() => { hapticSoft(); onUpdate({ focusSound: s.id as SoundId }); }}
                      className={`press-sm flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left ${state.focusSound === s.id ? 'bg-ink text-white' : 'bg-paper-fog text-ink/70'}`}>
                      <span className="text-sm font-medium">{s.name}</span>
                      {state.focusSound === s.id && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-paper-fog pt-3">
                <p className="text-sm font-medium text-ink/60">Play during focus</p>
                <button onClick={() => { hapticSoft(); setSoundOn(!soundOn); }}
                  className={`press-sm rounded-full px-4 py-1.5 text-xs font-medium ${soundOn ? 'bg-sage-500 text-white' : 'bg-paper-fog text-ink/60'}`}>
                  {soundOn ? 'On' : 'Off'}
                </button>
              </div>
              {soundOn && audioStatus.state === 'playing' && audioStatus.currentId === state.focusSound && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-paper-fog">
                    <div className="h-full rounded-full bg-sage-400" style={{ width: `${audioStatus.duration > 0 ? (audioStatus.currentTime / audioStatus.duration) * 100 : 0}%` }} />
                  </div>
                  <span className="text-[11px] text-ink/40">Looping</span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <PrimaryButton onClick={start}>Start focus</PrimaryButton>
            </div>

            <div className="mt-4 rounded-2xl bg-sage-50 p-4">
              <p className="text-sm leading-relaxed text-sage-700">Protect your first 4 hours for meaningful work. Avoid highly stimulating content during this period.</p>
            </div>
          </div>
        )}

        {(phase === 'running' || phase === 'paused') && (
          <div className="flex h-full flex-col items-center justify-center px-5 animate-fade-in">
            <p className="font-display text-lg text-ink/50">{label}</p>
            <div className="relative my-8 flex h-64 w-64 items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 256 256">
                <circle cx="128" cy="128" r="120" fill="none" stroke="#eef0f2" strokeWidth="4" />
                <circle cx="128" cy="128" r="120" fill="none" stroke="#5d7a61" strokeWidth="4"
                  strokeLinecap="round" strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={2 * Math.PI * 120 * (1 - pct / 100)}
                />
              </svg>
              <div className="text-center">
                <p className="font-display text-6xl font-medium tracking-tight text-ink">{time.m}:{time.s}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-ink/40">{phase === 'paused' ? 'Paused' : 'Focusing'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {phase === 'running' ? (
                <button onClick={pause} className="press flex h-16 w-16 items-center justify-center rounded-full bg-ink text-white shadow-card">
                  <Pause className="h-6 w-6" fill="currentColor" />
                </button>
              ) : (
                <button onClick={resume} className="press flex h-16 w-16 items-center justify-center rounded-full bg-ink text-white shadow-card">
                  <Play className="h-6 w-6" fill="currentColor" />
                </button>
              )}
              <button onClick={reset} className="press flex h-16 w-16 items-center justify-center rounded-full bg-paper-fog text-ink/60">
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
            {soundOn && phase === 'running' && (
              <p className="mt-4 text-xs text-ink/40">{getSound(state.focusSound).name} · looping</p>
            )}
            <p className="mt-8 max-w-xs text-center text-sm text-ink/45">Put your phone away. Focus on what matters.</p>
          </div>
        )}

        {phase === 'done' && (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center animate-scale-in">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sage-100">
              <Coffee className="h-10 w-10 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="mt-6 font-display text-3xl font-medium text-ink">Focus complete.</h2>
            <p className="mt-2 text-ink/55">Take a short break.</p>
            <div className="mt-8 w-full max-w-xs space-y-2">
              <PrimaryButton onClick={takeBreak}>Take a {state.breakDuration} min break</PrimaryButton>
              <button onClick={reset} className="press w-full py-2.5 text-sm text-ink/50">Done</button>
            </div>
            <button onClick={() => onNavigate('boring')} className="press mt-6 text-sm text-sage-600">
              Do something slightly boring instead
            </button>
          </div>
        )}

        {phase === 'break' && (
          <div className="flex h-full flex-col items-center justify-center px-5 animate-fade-in">
            <p className="font-display text-lg text-ink/50">Calm break</p>
            <div className="relative my-8 flex h-64 w-64 items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 256 256">
                <circle cx="128" cy="128" r="120" fill="none" stroke="#eef0f2" strokeWidth="4" />
                <circle cx="128" cy="128" r="120" fill="none" stroke="#367490" strokeWidth="4"
                  strokeLinecap="round" strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={2 * Math.PI * 120 * (1 - progress)}
                />
              </svg>
              <div className="text-center">
                <p className="font-display text-6xl font-medium tracking-tight text-ink">{msToHMS(breakRemaining).m}:{msToHMS(breakRemaining).s}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-ink/40">Break</p>
              </div>
            </div>
            <button onClick={() => { hapticSoft(); setPhase('idle'); setBreakRemaining(state.breakDuration * 60 * 1000); }}
              className="press flex h-14 w-14 items-center justify-center rounded-full bg-paper-fog text-ink/60">
              <RotateCcw className="h-5 w-5" />
            </button>
            <p className="mt-8 max-w-xs text-center text-sm text-ink/45">Give your attention a chance to settle.</p>
          </div>
        )}
      </div>
    </div>
  );
}
