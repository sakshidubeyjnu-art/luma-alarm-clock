import type { SoundId, SoundCategory } from './types';

export interface SoundDef {
  id: SoundId;
  name: string;
  category: SoundCategory;
  premium: boolean;
  file: string;
  description: string;
  isAlarm: boolean;
}

export const sounds: SoundDef[] = [
  // ALARMS
  { id: 'luma-digital-alarm', name: 'Luma Digital Alarm', category: 'alarms', premium: false, file: 'audio/Luma Digital Alarm.mp3', description: 'A clean digital alarm tone', isAlarm: true },
  { id: 'luma-ringing-alarm', name: 'Luma Ringing Alarm', category: 'alarms', premium: false, file: 'audio/Luma Ringing Alarm.mp3', description: 'A bright ringing alarm', isAlarm: true },
  { id: 'rooster-at-dawn', name: 'Rooster at Dawn', category: 'alarms', premium: false, file: 'audio/Rooster at Dawn.mp3', description: 'A rooster greeting the morning', isAlarm: true },

  // MORNING & LIFESTYLE
  { id: 'coffee-house', name: 'Coffee House', category: 'morning', premium: false, file: 'audio/Coffee House.mp3', description: 'Warm coffee shop ambience', isAlarm: false },
  { id: 'afternoon-tea-time', name: 'Afternoon Tea Time', category: 'morning', premium: false, file: 'audio/Afternoon Tea Time.mp3', description: 'A gentle afternoon tea mood', isAlarm: false },
  { id: 'slow-morning', name: 'Slow Morning', category: 'morning', premium: false, file: 'audio/Slow Morning.mp3', description: 'A calm, unhurried start', isAlarm: false },
  { id: 'dawn-chime', name: 'Dawn Chime', category: 'morning', premium: false, file: 'audio/Dawn Chime.mp3', description: 'Soft chimes at first light', isAlarm: false },
  { id: 'old-fashioned-bell', name: 'Old-Fashioned Bell', category: 'morning', premium: false, file: 'audio/Old-Fashioned Bell.mp3', description: 'A classic bell ring', isAlarm: false },
  { id: 'early-riser', name: 'Early Riser', category: 'morning', premium: false, file: 'audio/Early Riser.mp3', description: 'For those who wake before the sun', isAlarm: false },
  { id: 'wake-and-smile', name: 'Wake & Smile', category: 'morning', premium: false, file: 'audio/Wake & Smile.mp3', description: 'A cheerful way to rise', isAlarm: false },
  { id: 'wake-up', name: 'Wake Up', category: 'morning', premium: false, file: 'audio/Wake Up.mp3', description: 'A simple wake-up call', isAlarm: false },
  { id: 'pineapple-chill', name: 'Pineapple Chill', category: 'morning', premium: false, file: 'audio/Pineapple Chill.mp3', description: 'A relaxed tropical mood', isAlarm: false },
  { id: 'cocoa-comfort', name: 'Cocoa Comfort', category: 'cozy', premium: false, file: 'audio/Cocoa Comfort.mp3', description: 'Warm and comforting', isAlarm: false },

  // NATURE & CALM
  { id: 'calming-ocean', name: 'Calming Ocean', category: 'nature', premium: false, file: 'audio/Calming Ocean.mp3', description: 'Gentle ocean waves', isAlarm: false },
  { id: 'ocean-waves', name: 'Ocean Waves', category: 'nature', premium: false, file: 'audio/Ocean Waves.mp3', description: 'Rolling waves on the shore', isAlarm: false },
  { id: 'serene-meadow', name: 'Serene Meadow', category: 'nature', premium: false, file: 'audio/Serene Meadow.mp3', description: 'A peaceful open meadow', isAlarm: false },
  { id: 'zen-meditation', name: 'Zen Meditation', category: 'nature', premium: false, file: 'audio/Zen Meditation.mp3', description: 'A deep meditative calm', isAlarm: false },

  // STUDY & FOCUS
  { id: 'instrumental', name: 'Instrumental', category: 'focus', premium: false, file: 'audio/Instrumental.mp3', description: 'Gentle instrumental for focus', isAlarm: false },
  { id: 'schooltime', name: 'Schooltime', category: 'focus', premium: false, file: 'audio/Schooltime.mp3', description: 'A focused study atmosphere', isAlarm: false },
];

export function getSound(id: SoundId): SoundDef {
  return sounds.find((s) => s.id === id) ?? sounds[0];
}

export function getSoundFile(id: SoundId): string {
  return getSound(id).file;
}

export const soundCategories: { id: SoundCategory; label: string }[] = [
  { id: 'alarms', label: 'Alarms' },
  { id: 'morning', label: 'Morning & Lifestyle' },
  { id: 'nature', label: 'Nature & Calm' },
  { id: 'focus', label: 'Study & Focus' },
  { id: 'cozy', label: 'Cozy' },
];

export const alarmSounds = sounds.filter((s) => s.isAlarm);
export const meditationSounds = sounds.filter((s) => s.category === 'nature');
