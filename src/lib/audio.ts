import type { SoundId } from './types';
import { getSoundFile } from './sounds';

export type PlaybackState = 'idle' | 'playing' | 'paused';

export interface AudioStatus {
  currentId: SoundId | null;
  state: PlaybackState;
  currentTime: number;
  duration: number;
  volume: number;
  error: string | null;
}

type Listener = (status: AudioStatus) => void;

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private currentId: SoundId | null = null;
  private state: PlaybackState = 'idle';
  private volume = 0.7;
  private loop = false;
  private error: string | null = null;
  private listeners: Set<Listener> = new Set();
  private rafId: number | null = null;

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.volume = this.volume;

    this.audio.addEventListener('loadedmetadata', () => this.notify());
    this.audio.addEventListener('timeupdate', () => this.startRaf());
    this.audio.addEventListener('ended', () => {
      if (this.loop) {
        this.audio!.currentTime = 0;
        this.audio!.play().catch(() => this.fail('Unable to loop this sound.'));
      } else {
        this.state = 'idle';
        this.currentId = null;
        this.notify();
      }
    });
    this.audio.addEventListener('error', () => {
      this.fail('Unable to play this sound. Please try again.');
    });
    this.audio.addEventListener('canplaythrough', () => this.notify());
  }

  private fail(msg: string) {
    this.error = msg;
    this.state = 'idle';
    this.notify();
  }

  private startRaf() {
    if (this.rafId !== null) return;
    const tick = () => {
      this.notify();
      if (this.state === 'playing') {
        this.rafId = requestAnimationFrame(tick);
      } else {
        this.rafId = null;
      }
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private notify() {
    const status: AudioStatus = {
      currentId: this.currentId,
      state: this.state,
      currentTime: this.audio?.currentTime ?? 0,
      duration: this.audio?.duration ?? 0,
      volume: this.volume,
      error: this.error,
    };
    this.listeners.forEach((l) => l(status));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => { this.listeners.delete(listener); };
  }

  getStatus(): AudioStatus {
    return {
      currentId: this.currentId,
      state: this.state,
      currentTime: this.audio?.currentTime ?? 0,
      duration: this.audio?.duration ?? 0,
      volume: this.volume,
      error: this.error,
    };
  }

  play(id: SoundId, loop = false): void {
    this.error = null;
    const file = getSoundFile(id);
    const encoded = file.split('/').map((segment) => encodeURIComponent(segment)).join('/');

    if (this.currentId === id && this.state === 'paused') {
      this.loop = loop;
      this.audio!.loop = false;
      this.audio!.play().catch(() => this.fail('Unable to play this sound. Please try again.'));
      this.state = 'playing';
      this.notify();
      return;
    }

    if (this.currentId !== id) {
      this.currentId = id;
      this.audio!.src = encoded;
      this.audio!.load();
    }

    this.loop = loop;
    this.audio!.play()
      .then(() => { this.state = 'playing'; this.notify(); })
      .catch(() => this.fail('Unable to play this sound. Please try again.'));
  }

  pause(): void {
    if (this.state !== 'playing') return;
    this.audio!.pause();
    this.state = 'paused';
    this.notify();
  }

  resume(): void {
    if (this.state !== 'paused') return;
    this.audio!.play()
      .then(() => { this.state = 'playing'; this.notify(); })
      .catch(() => this.fail('Unable to play this sound. Please try again.'));
  }

  stop(): void {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.state = 'idle';
    this.currentId = null;
    this.audio.removeAttribute('src');
    this.audio.load();
    if (this.rafId !== null) { cancelAnimationFrame(this.rafId); this.rafId = null; }
    this.notify();
  }

  setVolume(v: number): void {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.audio) this.audio.volume = this.volume;
    this.notify();
  }

  seek(time: number): void {
    if (this.audio) this.audio.currentTime = time;
  }

  isPlaying(id?: SoundId): boolean {
    if (id !== undefined) return this.currentId === id && this.state === 'playing';
    return this.state === 'playing';
  }

  getCurrentId(): SoundId | null {
    return this.currentId;
  }

  clearError(): void {
    this.error = null;
    this.notify();
  }
}

let manager: AudioManager | null = null;

export function getAudioManager(): AudioManager {
  if (!manager) manager = new AudioManager();
  return manager;
}

export function playSound(id: SoundId, loop = false): void {
  getAudioManager().play(id, loop);
}

export function pauseSound(): void {
  getAudioManager().pause();
}

export function resumeSound(): void {
  getAudioManager().resume();
}

export function stopSound(): void {
  getAudioManager().stop();
}

export function setVolume(v: number): void {
  getAudioManager().setVolume(v);
}

export function subscribeAudio(listener: Listener): () => void {
  return getAudioManager().subscribe(listener);
}

export type { AudioStatus };
