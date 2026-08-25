import { useEffect, useState, useCallback } from 'react';
import type { AppState } from './types';

const KEY = 'luma-state-v1';

export const defaultState: AppState = {
  onboarded: false,
  authed: false,
  wakeTime: '07:00',
  theme: 'sf-fog',
  clockStyle: 'analog',
  darkMode: false,
  reducedMotion: false,
  quietMorning: null,
  focusDuration: 45,
  breakDuration: 10,
  focusSound: 'instrumental',
  morningSound: 'cocoa-comfort',
  notifications: true,
  premium: 'free',
  alarms: [
    {
      id: 'a1',
      time: '07:00',
      label: 'Wake Up',
      enabled: true,
      repeat: 'weekdays',
      days: [1, 2, 3, 4, 5],
      sound: 'luma-ringing-alarm',
      snooze: 10,
      vibration: true,
      gradualVolume: true,
      theme: 'golden-gate',
      mission: 'none',
      missionDifficulty: 'easy',
    },
  ],
  tasks: [
    { id: 't1', title: 'Mathematics Chapter 4', category: 'study', completed: false, date: '' },
    { id: 't2', title: 'Complete assignment', category: 'assignment', completed: false, date: '' },
    { id: 't3', title: 'Review notes', category: 'study', completed: true, date: '' },
  ],
  routine: [
    { id: 'r1', time: '07:00', label: 'Wake', done: true },
    { id: 'r2', time: '07:05', label: 'Gratitude + water', done: true },
    { id: 'r3', time: '07:10', label: 'Make bed', done: true },
    { id: 'r4', time: '07:15', label: 'Shower', done: false },
    { id: 'r5', time: '07:30', label: 'Breakfast', done: false },
    { id: 'r6', time: '07:45', label: 'Prepare study desk', done: false },
    { id: 'r7', time: '08:00', label: 'Focus', done: false },
  ],
  gratitude: [],
  priority: 'Finish Mathematics Chapter 4',
  favoriteSounds: ['cocoa-comfort', 'calming-ocean'],
  favoriteThemes: ['sf-fog', 'golden-gate'],
  savedActivities: [],
  completedRoutines: 0,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...defaultState, ...JSON.parse(raw) };
    } catch { /* ignore */ }
    return defaultState;
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const update = useCallback((patch: Partial<AppState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const updateAlarm = useCallback((id: string, patch: Partial<Alarm>) => {
    setState((s) => ({
      ...s,
      alarms: s.alarms.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  }, []);

  const addAlarm = useCallback((alarm: Alarm) => {
    setState((s) => ({ ...s, alarms: [...s.alarms, alarm] }));
  }, []);

  const removeAlarm = useCallback((id: string) => {
    setState((s) => ({ ...s, alarms: s.alarms.filter((a) => a.id !== id) }));
  }, []);

  const addTask = useCallback((task: Task) => {
    setState((s) => ({ ...s, tasks: [task, ...s.tasks] }));
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }, []);

  const removeTask = useCallback((id: string) => {
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
  }, []);

  const toggleRoutine = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      routine: s.routine.map((r) => (r.id === id ? { ...r, done: !r.done } : r)),
    }));
  }, []);

  const addGratitude = useCallback((text: string) => {
    const entry = {
      id: `g${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      text,
    };
    setState((s) => ({ ...s, gratitude: [entry, ...s.gratitude].slice(0, 60) }));
  }, []);

  return {
    state,
    update,
    updateAlarm,
    addAlarm,
    removeAlarm,
    addTask,
    updateTask,
    removeTask,
    toggleRoutine,
    addGratitude,
  };
}

import type { Alarm, Task } from './types';
