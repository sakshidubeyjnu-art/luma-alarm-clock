import type { Alarm } from './types';

export type AlarmCallback = (alarm: Alarm) => void;

const DAY_MS = 86400000;

function nextOccurrence(alarm: Alarm, from = new Date()): number {
  const [h, m] = alarm.time.split(':').map(Number);
  const now = new Date(from);
  now.setSeconds(0, 0);

  const target = new Date(now);
  target.setHours(h, m, 0, 0);

  if (alarm.repeat === 'once') {
    if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
    return target.getTime();
  }

  for (let i = 0; i < 8; i++) {
    const d = new Date(target);
    d.setDate(target.getDate() + i);
    const dow = d.getDay();
    if (alarm.days.includes(dow) && d.getTime() > now.getTime()) {
      return d.getTime();
    }
  }
  return target.getTime() + DAY_MS;
}

class AlarmEngine {
  private timers: Map<string, number> = new Map();
  private alarms: Alarm[] = [];
  private callback: AlarmCallback | null = null;
  private snoozeTimer: number | null = null;

  setCallback(cb: AlarmCallback): void {
    this.callback = cb;
  }

  setAlarms(alarms: Alarm[]): void {
    this.alarms = alarms;
    this.reschedule();
  }

  reschedule(): void {
    this.clearAll();
    const now = Date.now();
    for (const alarm of this.alarms) {
      if (!alarm.enabled) continue;
      const fireAt = nextOccurrence(alarm, new Date(now));
      const delay = fireAt - now;
      if (delay > 0 && delay < 8 * DAY_MS) {
        const id = window.setTimeout(() => this.fire(alarm), delay);
        this.timers.set(alarm.id, id);
      }
    }
  }

  private fire(alarm: Alarm): void {
    this.timers.delete(alarm.id);
    if (this.callback) this.callback(alarm);
    if (alarm.repeat !== 'once') {
      const updated = { ...alarm };
      const fireAt = nextOccurrence(updated, new Date());
      const delay = fireAt - Date.now();
      if (delay > 0) {
        const id = window.setTimeout(() => this.fire(updated), delay);
        this.timers.set(alarm.id, id);
      }
    }
  }

  snooze(alarm: Alarm, minutes: number): void {
    if (this.snoozeTimer) { clearTimeout(this.snoozeTimer); this.snoozeTimer = null; }
    const delay = minutes * 60000;
    this.snoozeTimer = window.setTimeout(() => {
      this.snoozeTimer = null;
      if (this.callback) this.callback(alarm);
    }, delay);
  }

  cancelSnooze(): void {
    if (this.snoozeTimer) { clearTimeout(this.snoozeTimer); this.snoozeTimer = null; }
  }

  clearAll(): void {
    this.timers.forEach((id) => clearTimeout(id));
    this.timers.clear();
  }

  restoreOnVisible(): void {
    if (document.visibilityState !== 'visible') return;
    this.reschedule();
  }

  getNextAlarm(): { alarm: Alarm; fireAt: number } | null {
    const enabled = this.alarms.filter((a) => a.enabled);
    if (enabled.length === 0) return null;
    let earliest: { alarm: Alarm; fireAt: number } | null = null;
    for (const alarm of enabled) {
      const fireAt = nextOccurrence(alarm);
      if (!earliest || fireAt < earliest.fireAt) {
        earliest = { alarm, fireAt };
      }
    }
    return earliest;
  }

  minutesUntilNext(): number | null {
    const next = this.getNextAlarm();
    if (!next) return null;
    return Math.round((next.fireAt - Date.now()) / 60000);
  }
}

let engine: AlarmEngine | null = null;

export function getAlarmEngine(): AlarmEngine {
  if (!engine) engine = new AlarmEngine();
  return engine;
}

export { nextOccurrence };
