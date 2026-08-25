import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { ScreenHeader, PrimaryButton } from '@/components/ui';
import { meditationSounds, getSound } from '@/lib/sounds';
import { getAudioManager, subscribeAudio, type AudioStatus } from '@/lib/audio';
import { hapticSoft, hapticMedium } from '@/lib/haptic';
import type { AppState, SoundId } from '@/lib/types';

interface Props {
  state: AppState;
  onBack: () => void;
}

export function Meditation({ state, onBack }: Props) {
  const [duration, setDuration] = useState(5);
  const [remaining, setRemaining] = useState(5 * 60 * 1000);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const [selectedTrack, setSelectedTrack] = useState<SoundId>(state.focusSound && meditationSounds.some((s) => s.id === state.focusSound) ? state.focusSound : 'calming-ocean');
  const [audioStatus, setAudioStatus] = useState<AudioStatus>(getAudioManager().getStatus());
  const endTimeRef = useRef<number>(0);
  const tickRef = useRef<number | null>(null);
  const phaseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const unsub = subscribeAudio(setAudioStatus);
    return () => unsub();
  }, []);

  useEffect(() => () => { getAudioManager().stop(); }, []);

  useEffect(() => {
    if (!running) return;
    endTimeRef.current = Date.now() + remaining;
    const tick = () => {
      const left = endTimeRef.current - Date.now();
      if (left <= 0) {
        getAudioManager().stop();
        setRunning(false);
        setRemaining(0);
        hapticMedium();
        return;
      }
      setRemaining(left);
      tickRef.current = requestAnimationFrame(tick);
    };
    tickRef.current = requestAnimationFrame(tick);
    phaseTimerRef.current = window.setInterval(() => {
      setPhase((p) => p === 'in' ? 'out' : 'in');
    }, 4000);
    return () => {
      if (tickRef.current) cancelAnimationFrame(tickRef.current);
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current);
    };
  }, [running]);

  const begin = () => {
    hapticSoft();
    setRemaining(duration * 60 * 1000);
    setPhase('in');
    setRunning(true);
    getAudioManager().play(selectedTrack, true);
  };

  const togglePlayPause = () => {
    hapticSoft();
    if (running) {
      getAudioManager().pause();
      setRunning(false);
    } else {
      if (remaining <= 0) { setRemaining(duration * 60 * 1000); endTimeRef.current = Date.now() + duration * 60 * 1000; }
      else { endTimeRef.current = Date.now() + remaining; }
      setRunning(true);
      getAudioManager().resume();
    }
  };

  const reset = () => {
    hapticSoft();
    getAudioManager().stop();
    setRunning(false);
    setRemaining(duration * 60 * 1000);
    setPhase('in');
  };

  const selectTrack = (id: SoundId) => {
    hapticSoft();
    setSelectedTrack(id);
    if (running) getAudioManager().play(id, true);
  };

  const mins = Math.floor(remaining / 60000).toString().padStart(2, '0');
  const secs = Math.floor((remaining % 60000) / 1000).toString().padStart(2, '0');

  const isIdle = !running && remaining === duration * 60 * 1000;
  const isDone = remaining <= 0;
  const isActive = !isIdle && !isDone;

  return (
    <div className="app-shell bg-paper-warm">
      <ScreenHeader title="Meditation" subtitle="A quiet moment" onBack={onBack} />
      <div className="scroll-area pb-24">
        {isIdle ? (
          <div className="px-5 pt-10">
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-64 w-64 items-center justify-center">
                <div className="absolute inset-4 rounded-full bg-sage-100 animate-breathe" />
                <div className="absolute inset-12 rounded-full bg-sage-200/50" />
                <div className="relative">
                  <p className="font-display text-2xl font-medium text-sage-800">Breathe</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-sage-700/50">when you are ready</p>
                </div>
              </div>
              <p className="mt-8 max-w-xs text-center font-display text-lg text-ink/60">Give your attention a quiet place to land.</p>
            </div>

            <p className="mt-10 px-1 pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">Duration</p>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((d) => (
                <button key={d} onClick={() => { hapticSoft(); setDuration(d); setRemaining(d * 60 * 1000); }} className={`press-sm flex-1 rounded-2xl py-3 text-sm font-medium ${duration === d ? 'bg-ink text-white' : 'bg-white text-ink/60 shadow-soft'}`}>{d} min</button>
              ))}
            </div>

            <p className="mt-8 px-1 pb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">Sound</p>
            <div className="space-y-2">
              {meditationSounds.map((s) => (
                <button key={s.id} onClick={() => selectTrack(s.id)} className={`press flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left ${selectedTrack === s.id ? 'bg-ink text-white shadow-card' : 'bg-white text-ink shadow-soft'}`}>
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className={`text-xs ${selectedTrack === s.id ? 'text-white/50' : 'text-ink/45'}`}>{s.description}</p>
                  </div>
                  {selectedTrack === s.id && <span className="text-sm">✓</span>}
                </button>
              ))}
            </div>

            <div className="mt-6"><PrimaryButton onClick={begin}>Begin</PrimaryButton></div>
          </div>
        ) : isDone ? (
          <div className="flex flex-col items-center px-8 pt-32 text-center animate-scale-in">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sage-100"><span className="font-display text-3xl text-sage-700">✓</span></div>
            <h2 className="mt-6 font-display text-3xl font-medium text-ink">Well done.</h2>
            <p className="mt-2 text-ink/50">You made space for a little quiet.</p>
            <div className="mt-8 w-full"><PrimaryButton onClick={reset}>Again</PrimaryButton></div>
          </div>
        ) : (
          <div className="flex flex-col items-center px-5 pt-16 text-center animate-fade-in">
            <div className={`relative flex h-72 w-72 items-center justify-center transition-transform duration-[4000ms] ease-in-out ${running && phase === 'in' ? 'scale-110' : 'scale-90'}`}>
              <div className="absolute inset-0 rounded-full bg-sage-100/70" />
              <div className="absolute inset-8 rounded-full bg-sage-200/50" />
              <div className="absolute inset-16 rounded-full bg-sage-300/40" />
              <div className="relative"><p className="font-display text-2xl font-medium text-sage-800">Breathe {phase === 'in' ? 'in' : 'out'}</p></div>
            </div>
            <p className="mt-10 font-display text-4xl font-medium tracking-tight text-ink">{mins}:{secs}</p>
            <p className="mt-2 text-xs text-ink/40">{getSound(selectedTrack).name}</p>
            <div className="mt-8 flex items-center gap-3">
              <button onClick={togglePlayPause} className="press flex h-16 w-16 items-center justify-center rounded-full bg-ink text-white">
                {running ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}
              </button>
              <button onClick={reset} className="press flex h-14 w-14 items-center justify-center rounded-full bg-paper-fog text-ink/60">
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>
            {audioStatus.error && <p className="mt-4 text-sm text-blush-500">Unable to play this sound. Please try again.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
