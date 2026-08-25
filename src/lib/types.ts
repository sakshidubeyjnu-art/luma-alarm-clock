export type Screen =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'alarms'
  | 'focus'
  | 'tasks'
  | 'profile'
  | 'sounds'
  | 'themes'
  | 'meditation'
  | 'boring'
  | 'facts'
  | 'editorial'
  | 'premium'
  | 'settings'
  | 'ringing'
  | 'auth';

export type Tab = 'home' | 'alarms' | 'focus' | 'tasks' | 'profile';

export type ThemeId =
  | 'sf-fog'
  | 'golden-gate'
  | 'pacific'
  | 'clouds'
  | 'forest'
  | 'blush'
  | 'night'
  | 'cozy-morning'
  | 'paris-coffee'
  | 'malibu'
  | 'rainy-window'
  | 'japanese-garden'
  | 'alpine'
  | 'botanical'
  | 'midnight-pacific';

export type SoundId = string;

export type SoundCategory = 'alarms' | 'morning' | 'nature' | 'focus' | 'cozy';

export type TaskCategory = 'study' | 'assignment' | 'exam' | 'reading' | 'personal' | 'health';

export type RepeatMode = 'once' | 'daily' | 'weekdays' | 'weekends' | 'custom';

export type MissionType = 'math' | 'memory' | 'qr' | 'photo' | 'movement' | 'none';

export type PremiumPlan = 'free' | 'monthly' | 'yearly' | 'lifetime';

export interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  repeat: RepeatMode;
  days: number[];
  sound: SoundId;
  snooze: number;
  vibration: boolean;
  gradualVolume: boolean;
  theme: ThemeId;
  mission: MissionType;
  missionDifficulty: 'easy' | 'medium' | 'hard';
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  completed: boolean;
  date: string;
}

export interface RoutineItem {
  id: string;
  time: string;
  label: string;
  done: boolean;
}

export interface GratitudeEntry {
  id: string;
  date: string;
  text: string;
}

export interface SoundFavorite {
  id: SoundId;
}

export interface AppState {
  onboarded: boolean;
  authed: boolean;
  wakeTime: string;
  theme: ThemeId;
  clockStyle: 'analog' | 'digital';
  darkMode: boolean;
  reducedMotion: boolean;
  quietMorning: number | null;
  focusDuration: number;
  breakDuration: number;
  focusSound: SoundId;
  morningSound: SoundId;
  notifications: boolean;
  premium: PremiumPlan;
  alarms: Alarm[];
  tasks: Task[];
  routine: RoutineItem[];
  gratitude: GratitudeEntry[];
  priority: string;
  favoriteSounds: SoundId[];
  favoriteThemes: ThemeId[];
  savedActivities: string[];
  completedRoutines: number;
}
