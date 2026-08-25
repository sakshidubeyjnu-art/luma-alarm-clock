import { useEffect, useState, useRef } from 'react';
import { Play, Pause, Heart, Check, Lock, Volume2, Square } from 'lucide-react';
import { ScreenHeader, SectionLabel } from '@/components/ui';
import { getSound, soundCategories, sounds } from '@/lib/sounds';
import { getAudioManager, subscribeAudio, type AudioStatus } from '@/lib/audio';
import { hapticSoft, hapticMedium } from '@/lib/haptic';
import type { AppState, SoundCategory, SoundId } from '@/lib/types';

interface Props {
  state: AppState;
  onUpdate: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onPremium: () => void;
}

function fmtTime(s: number): string {
  if (!s || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function Sounds({ state, onUpdate, onBack, onPremium }: Props) {
  const [category, setCategory] = useState<SoundCategory>('morning');
  const [status, setStatus] = useState<AudioStatus>(getAudioManager().getStatus());
  const [volume, setVolume] = useState(Math.round(status.volume * 100));
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    unsubRef.current = subscribeAudio(setStatus);
    return () => { unsubRef.current?.(); };
  }, []);

  useEffect(() => () => { getAudioManager().stop(); }, []);

  const toggle = (id: SoundId, premium: boolean) => {
    if (premium && state.premium === 'free') { onPremium(); return; }
    hapticSoft();
    const mgr = getAudioManager();
    if (status.currentId === id && status.state === 'playing') {
      mgr.pause();
    } else if (status.currentId === id && status.state === 'paused') {
      mgr.resume();
    } else {
      mgr.play(id, false);
    }
  };

  const stop = () => { hapticSoft(); getAudioManager().stop(); };

  const favorite = (id: SoundId) => {
    hapticSoft();
    const favs = state.favoriteSounds.includes(id) ? state.favoriteSounds.filter((x) => x !== id) : [...state.favoriteSounds, id];
    onUpdate({ favoriteSounds: favs });
  };

  const setMorningSound = () => {
    if (!status.currentId) return;
    hapticMedium();
    onUpdate({ morningSound: status.currentId });
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    getAudioManager().setVolume(v / 100);
  };

  const list = sounds.filter((s) => s.category === category);
  const currentDef = status.currentId ? getSound(status.currentId) : null;
  const progressPct = status.duration > 0 ? (status.currentTime / status.duration) * 100 : 0;

  return (
    <div className="app-shell bg-paper-warm">
      <ScreenHeader title="Sounds" subtitle="Find your atmosphere" onBack={onBack} />
      <div className="scroll-area pb-24">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pt-4 pb-2">
          {soundCategories.map((c) => (
            <button key={c.id} onClick={() => { hapticSoft(); setCategory(c.id); }}
              className={`press-sm whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${category === c.id ? 'bg-ink text-white' : 'bg-white text-ink/55 shadow-soft'}`}>
              {c.label}
            </button>
          ))}
        </div>

        {status.error && (
          <div className="mx-4 mt-4 rounded-2xl bg-blush-50 p-4 text-center animate-fade-in">
            <p className="text-sm font-medium text-blush-500">{status.error}</p>
            <button onClick={() => getAudioManager().clearError()} className="press-sm mt-2 text-xs text-blush-500/70">Dismiss</button>
          </div>
        )}

        {currentDef && status.state !== 'idle' && (
          <div className="mx-4 mt-4 rounded-3xl bg-ink p-4 text-white shadow-card animate-scale-in">
            <div className="flex items-center gap-3">
              <button onClick={() => status.state === 'playing' ? getAudioManager().pause() : getAudioManager().resume()}
                className="press-sm flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink">
                {status.state === 'playing' ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="ml-0.5 h-4 w-4" fill="currentColor" />}
              </button>
              <div className="flex-1">
                <p className="text-sm font-medium">{currentDef.name}</p>
                <p className="text-xs text-white/50">{status.state === 'playing' ? 'Now playing' : 'Paused'}</p>
              </div>
              <button onClick={stop} className="press-sm flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80">
                <Square className="h-3.5 w-3.5" fill="currentColor" />
              </button>
            </div>
            <div className="mt-4">
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-white/70 transition-[width] duration-200" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] text-white/40">
                <span>{fmtTime(status.currentTime)}</span>
                <span>{fmtTime(status.duration)}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Volume2 className="h-3.5 w-3.5 text-white/50" />
              <input type="range" min="0" max="100" value={volume} onChange={(e) => handleVolume(Number(e.target.value))} className="h-1 flex-1 accent-white" />
            </div>
          </div>
        )}

        <SectionLabel>{soundCategories.find((c) => c.id === category)?.label}</SectionLabel>
        <div className="space-y-2 px-4">
          {list.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow-soft">
              <p className="font-display text-lg text-ink">No sounds in this category yet.</p>
              <p className="mt-1 text-sm text-ink/50">Try another category.</p>
            </div>
          ) : list.map((s) => {
            const isCurrent = status.currentId === s.id;
            const isPlayingNow = isCurrent && status.state === 'playing';
            const isPaused = isCurrent && status.state === 'paused';
            const fav = state.favoriteSounds.includes(s.id);
            const locked = s.premium && state.premium === 'free';
            return (
              <div key={s.id} className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-soft ${locked ? 'opacity-60' : ''} ${isCurrent ? 'ring-1 ring-ink/15' : ''}`}>
                <button onClick={() => toggle(s.id, s.premium)} className={`press-sm flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isPlayingNow ? 'bg-ink text-white' : 'bg-paper-fog text-ink/60'}`}>
                  {locked ? <Lock className="h-4 w-4" /> : isPlayingNow ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="ml-0.5 h-4 w-4" fill="currentColor" />}
                </button>
                <button onClick={() => toggle(s.id, s.premium)} className="flex-1 text-left">
                  <p className="text-[15px] font-medium text-ink">{s.name}</p>
                  <p className="text-xs text-ink/45">{isPaused ? 'Paused' : s.description}</p>
                </button>
                <button onClick={() => favorite(s.id)} className="press-sm p-2">
                  <Heart className={`h-4 w-4 ${fav ? 'fill-blush-400 text-blush-400' : 'text-ink/25'}`} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mx-4 mt-6 rounded-3xl bg-sage-50 p-5">
          <p className="font-display text-lg font-medium text-sage-800">A sound for every moment.</p>
          <p className="mt-1 text-sm leading-relaxed text-sage-700">Set a favorite as your morning sound, or let a calm atmosphere carry you through focus.</p>
          <button onClick={setMorningSound} disabled={!status.currentId}
            className="press mt-4 inline-flex items-center gap-2 rounded-full bg-sage-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40">
            <Check className="h-4 w-4" /> {status.currentId ? `Set ${getSound(status.currentId).name} as morning sound` : `Set ${getSound(state.morningSound).name} as morning sound`}
          </button>
        </div>
      </div>
    </div>
  );
}
