export function formatTime(date: Date, twelve = true): string {
  let h = date.getHours();
  const m = date.getMinutes();
  if (twelve) {
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
  }
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function formatTimeShort(time: string): string {
  const [hStr, m] = time.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

export function formatHour(time: string): string {
  const [hStr] = time.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h} ${ampm}`;
}

export function todayLabel(date = new Date()): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[date.getDay()]} · ${months[date.getMonth()]} ${date.getDate()}`;
}

export function greeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return 'Good morning.';
  if (h < 17) return 'Good afternoon.';
  if (h < 21) return 'Good evening.';
  return 'Good night.';
}

export function minutesToNextAlarm(time: string, days: number[], repeat: string): number {
  const now = new Date();
  const [h, m] = time.split(':').map(Number);
  const target = new Date(now);
  target.setHours(h, m, 0, 0);

  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  if (repeat === 'once') {
    return Math.round((target.getTime() - now.getTime()) / 60000);
  }

  for (let i = 0; i < 7; i++) {
    const d = new Date(target);
    d.setDate(target.getDate() + i);
    const dow = d.getDay();
    if (days.includes(dow)) {
      return Math.round((d.getTime() - now.getTime()) / 60000);
    }
  }
  return Math.round((target.getTime() - now.getTime()) / 60000);
}

export function nextAlarmLabel(minutes: number): string {
  if (minutes < 1) return 'Now';
  if (minutes < 60) return `in ${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h < 24) return m > 0 ? `in ${h}h ${m}m` : `in ${h}h`;
  const days = Math.floor(h / 24);
  const remH = h % 24;
  return remH > 0 ? `in ${days}d ${remH}h` : `in ${days}d`;
}

export function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function msToHMS(ms: number): { h: string; m: string; s: string } {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { h: pad(h), m: pad(m), s: pad(s) };
}
