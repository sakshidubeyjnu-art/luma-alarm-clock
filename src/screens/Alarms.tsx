import { useEffect, useState } from 'react';
import { Plus, Copy, Trash2, Bell, ChevronRight, Play, Pause, Lock } from 'lucide-react';
import { ScreenHeader, PrimaryButton, GhostButton, SectionLabel, Row } from '@/components/ui';
import { Sheet } from '@/components/Sheet';
import { TimePicker } from '@/components/TimePicker';
import { Toggle } from '@/components/Toggle';
import { formatTimeShort } from '@/lib/time';
import { sounds } from '@/lib/sounds';
import { getAudioManager, subscribeAudio, type AudioStatus } from '@/lib/audio';
import { getAlarmEngine } from '@/lib/alarmEngine';
import { themes } from '@/lib/themes';
import { hapticSoft, hapticMedium } from '@/lib/haptic';
import type { Alarm, RepeatMode, SoundId, ThemeId, MissionType, AppState } from '@/lib/types';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const REPEATS: { id: RepeatMode; label: string }[] = [
  { id: 'once', label: 'Once' },
  { id: 'daily', label: 'Every day' },
  { id: 'weekdays', label: 'Weekdays' },
  { id: 'weekends', label: 'Weekends' },
  { id: 'custom', label: 'Custom' },
];
const MISSIONS: { id: MissionType; label: string; desc: string }[] = [
  { id: 'none', label: 'None', desc: 'Just dismiss' },
  { id: 'math', label: 'Math Mission', desc: 'Solve a problem' },
  { id: 'memory', label: 'Memory Mission', desc: 'Repeat a sequence' },
  { id: 'qr', label: 'QR / Barcode', desc: 'Scan a code' },
  { id: 'photo', label: 'Photo Mission', desc: 'Take a photo' },
  { id: 'movement', label: 'Movement', desc: 'Gentle movement' },
];

interface Props {
  state: AppState;
  onAdd: (a: Alarm) => void;
  onUpdate: (id: string, patch: Partial<Alarm>) => void;
  onRemove: (id: string) => void;
  onPreviewRing: () => void;
  onPremium: () => void;
}

export function Alarms({ state, onAdd, onUpdate, onRemove, onPreviewRing, onPremium }: Props) {
  const [editing, setEditing] = useState<Alarm | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [audioStatus, setAudioStatus] = useState<AudioStatus>(getAudioManager().getStatus());

  useEffect(() => subscribeAudio(setAudioStatus), []);

  const openNew = () => {
    hapticSoft();
    setEditing({
      id: `a${Date.now()}`,
      time: '08:00',
      label: 'Alarm',
      enabled: true,
      repeat: 'weekdays',
      days: [1, 2, 3, 4, 5],
      sound: 'luma-ringing-alarm',
      snooze: 10,
      vibration: true,
      gradualVolume: true,
      theme: state.theme,
      mission: 'none',
      missionDifficulty: 'easy',
    });
    setIsNew(true);
  };

  const openEdit = (a: Alarm) => {
    hapticSoft();
    setEditing({ ...a });
    setIsNew(false);
  };

  const save = () => {
    if (!editing) return;
    hapticMedium();
    if (isNew) onAdd(editing);
    else onUpdate(editing.id, editing);
    setEditing(null);
  };

  const duplicate = (a: Alarm) => {
    hapticSoft();
    onAdd({ ...a, id: `a${Date.now()}`, label: `${a.label} copy` });
  };

  const repeatLabel = (a: Alarm): string => {
    if (a.repeat === 'once') return 'Once';
    if (a.repeat === 'daily') return 'Every day';
    if (a.repeat === 'weekdays') return 'Mon–Fri';
    if (a.repeat === 'weekends') return 'Sat–Sun';
    return a.days.map((d) => DAY_FULL[d]).join(' ');
  };

  return (
    <div className="app-shell bg-paper-warm">
      <ScreenHeader title="Alarms" subtitle={`${state.alarms.length} alarms`} right={
        <button onClick={openNew} className="press-sm flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white">
          <Plus className="h-5 w-5" />
        </button>
      } />
      <div className="scroll-area pb-24">
        {state.alarms.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-8 pt-32 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-paper-fog">
              <Bell className="h-8 w-8 text-ink/30" strokeWidth={1.5} />
            </div>
            <p className="mt-6 font-display text-xl font-medium text-ink">Nothing scheduled yet.</p>
            <p className="mt-1 text-ink/50">Create your first peaceful morning.</p>
            <div className="mt-6 w-full max-w-xs">
              <PrimaryButton onClick={openNew}>+ Add alarm</PrimaryButton>
            </div>
          </div>
        ) : (
          <div className="space-y-3 px-4 pt-4">
            {state.alarms.map((a) => (
               <div key={a.id} className="overflow-hidden rounded-3xl bg-white shadow-soft">
                 <div role="button" tabIndex={0} onClick={() => openEdit(a)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openEdit(a); }} className="press flex w-full cursor-pointer items-center justify-between px-5 py-4 text-left">
                  <div>
                    <p className={`font-display text-3xl font-medium ${a.enabled ? 'text-ink' : 'text-ink/35'}`}>{formatTimeShort(a.time)}</p>
                    <p className={`text-sm ${a.enabled ? 'text-ink/60' : 'text-ink/30'}`}>{a.label} · {repeatLabel(a)}</p>
                  </div>
                   <span onClick={(event) => event.stopPropagation()}>
                     <Toggle on={a.enabled} onChange={(v) => onUpdate(a.id, { enabled: v })} />
                   </span>
                 </div>
                {a.enabled && (
                  <div className="flex border-t border-paper-fog px-5 py-1">
                    <button onClick={() => duplicate(a)} className="press-sm flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium text-ink/50">
                      <Copy className="h-3.5 w-3.5" /> Duplicate
                    </button>
                    <div className="w-px bg-paper-fog" />
                     <button onClick={() => { if (window.confirm(`Delete “${a.label}”?`)) { hapticMedium(); onRemove(a.id); } }} className="press-sm flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium text-blush-500">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button onClick={onPreviewRing} className="press mx-auto mt-2 flex items-center gap-1.5 px-4 py-2 text-xs text-ink/40">
              Preview alarm screen <ChevronRight className="h-3 w-3" />
            </button>
             <button aria-label="Test alarm in 3 seconds" onClick={() => {
              hapticSoft();
              const testAlarm = state.alarms.find((a) => a.enabled) ?? state.alarms[0];
              if (testAlarm) getAlarmEngine().snooze(testAlarm, 0.05);
            }} className="press mx-auto mt-1 flex items-center gap-1.5 px-4 py-2 text-xs text-ink/40">
              Test alarm (3 sec) <Play className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Edit sheet */}
      <Sheet open={!!editing} onClose={() => setEditing(null)} title={isNew ? 'New alarm' : 'Edit alarm'}>
        {editing && (
          <div className="space-y-1">
            <div className="py-4">
              <TimePicker value={editing.time} onChange={(v) => setEditing({ ...editing, time: v })} />
               <p className="mt-4 text-center text-sm font-medium text-ink/60">
                 Alarm set for <span className="text-ink">{formatTimeShort(editing.time)}</span>
               </p>
            </div>

            <div className="rounded-2xl bg-white px-4 py-3">
              <input
                value={editing.label}
                onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                placeholder="Label"
                className="w-full bg-transparent text-[15px] font-medium text-ink outline-none"
              />
            </div>

            <SectionLabel>Repeat</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {REPEATS.map((r) => (
                <button key={r.id} onClick={() => {
                  hapticSoft();
                  let days = editing.days;
                  if (r.id === 'weekdays') days = [1, 2, 3, 4, 5];
                  else if (r.id === 'weekends') days = [0, 6];
                  else if (r.id === 'daily') days = [0, 1, 2, 3, 4, 5, 6];
                  setEditing({ ...editing, repeat: r.id, days });
                }}
                  className={`press-sm rounded-full px-4 py-2 text-sm font-medium ${editing.repeat === r.id ? 'bg-ink text-white' : 'bg-paper-fog text-ink/60'}`}>
                  {r.label}
                </button>
              ))}
            </div>
            {editing.repeat === 'custom' && (
              <div className="mt-3 flex justify-between rounded-2xl bg-white p-3">
                {DAYS.map((d, i) => (
                  <button key={i} onClick={() => {
                    hapticSoft();
                    const days = editing.days.includes(i) ? editing.days.filter((x) => x !== i) : [...editing.days, i];
                    setEditing({ ...editing, days });
                  }}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${editing.days.includes(i) ? 'bg-ink text-white' : 'text-ink/40'}`}>
                    {d}
                  </button>
                ))}
              </div>
            )}

            <SectionLabel>Sound</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {sounds.map((s) => (
                <div key={s.id} className={`flex items-center gap-2 rounded-2xl px-3 py-3 ${editing.sound === s.id ? 'bg-ink text-white' : 'bg-white text-ink'} ${s.premium && state.premium === 'free' ? 'opacity-60' : ''}`}>
                  <button onClick={() => {
                    hapticSoft();
                    if (s.premium && state.premium === 'free') onPremium();
                    else setEditing({ ...editing, sound: s.id as SoundId });
                  }} className="flex-1 text-left">
                    <p className="text-sm font-medium">{s.name}</p>
                    {s.premium && <p className="text-[10px] opacity-50">Premium</p>}
                  </button>
                  <button onClick={() => {
                    hapticSoft();
                    if (s.premium && state.premium === 'free') { onPremium(); return; }
                    const mgr = getAudioManager();
                    const status = mgr.getStatus();
                    if (status.currentId === s.id && status.state === 'playing') mgr.pause();
                    else if (status.currentId === s.id && status.state === 'paused') mgr.resume();
                    else mgr.play(s.id, false);
                  }} className={`press-sm flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${editing.sound === s.id ? 'bg-white/15' : 'bg-paper-fog'}`}>
                      {s.premium && state.premium === 'free' ? <Lock className="h-3 w-3" /> : audioStatus.currentId === s.id && audioStatus.state === 'playing' ? <Pause className="h-3 w-3" fill="currentColor" /> : <Play className="h-3 w-3" fill="currentColor" />}
                  </button>
                </div>
              ))}
            </div>

            <SectionLabel>Theme</SectionLabel>
            <div className="grid grid-cols-3 gap-2">
              {themes.filter((t) => !t.premium).map((t) => (
                <button key={t.id} onClick={() => { hapticSoft(); setEditing({ ...editing, theme: t.id as ThemeId }); }}
                  className={`press-sm overflow-hidden rounded-2xl ${editing.theme === t.id ? 'ring-2 ring-ink' : ''}`}>
                  <div className="h-16" style={{ background: `linear-gradient(135deg, ${t.swatch}, ${t.swatch2})` }} />
                  <p className="px-2 py-1 text-[11px] font-medium text-ink">{t.name}</p>
                </button>
              ))}
            </div>

            <SectionLabel>Options</SectionLabel>
            <div className="overflow-hidden rounded-2xl bg-white">
              <Row label="Snooze" sublabel={`${editing.snooze} min`}
                right={
                  <div className="flex gap-1">
                    {[5, 10, 15].map((m) => (
                      <button key={m} onClick={() => { hapticSoft(); setEditing({ ...editing, snooze: m }); }}
                        className={`press-sm rounded-full px-3 py-1 text-xs font-medium ${editing.snooze === m ? 'bg-ink text-white' : 'bg-paper-fog text-ink/60'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                }
              />
              <div className="border-t border-paper-fog" />
              <Row label="Vibration" right={<Toggle on={editing.vibration} onChange={(v) => setEditing({ ...editing, vibration: v })} />} />
              <div className="border-t border-paper-fog" />
              <Row label="Gradual volume" sublabel="Gently increase" right={<Toggle on={editing.gradualVolume} onChange={(v) => setEditing({ ...editing, gradualVolume: v })} />} />
            </div>

            <div className="space-y-2 pt-5">
              <PrimaryButton onClick={save}>Save alarm</PrimaryButton>
            </div>

            <SectionLabel>Wake mission {state.premium === 'free' && <span className="text-blush-500">· Premium</span>}</SectionLabel>
            <div className="space-y-1.5">
              {MISSIONS.map((m) => {
                const locked = m.id !== 'none' && state.premium === 'free';
                return (
                  <button key={m.id} onClick={() => { if (!locked) { hapticSoft(); setEditing({ ...editing, mission: m.id }); } }}
                    className={`press flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left ${editing.mission === m.id ? 'bg-ink text-white' : 'bg-white text-ink'} ${locked ? 'opacity-50' : ''}`}>
                    <div>
                      <p className="text-sm font-medium">{m.label}</p>
                      <p className={`text-xs ${editing.mission === m.id ? 'text-white/60' : 'text-ink/45'}`}>{m.desc}</p>
                    </div>
                    {locked && <span className="text-[10px] font-semibold uppercase tracking-wide text-blush-500">Premium</span>}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 pt-5">
               {!isNew && <GhostButton onClick={() => { if (window.confirm(`Delete “${editing.label}”?`)) { hapticMedium(); onRemove(editing.id); setEditing(null); } }} className="text-blush-500">Delete alarm</GhostButton>}
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
