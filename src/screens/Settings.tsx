import { ScreenHeader, Row, SectionLabel, GhostButton } from '@/components/ui';
import { Toggle } from '@/components/Toggle';
import { hapticSoft } from '@/lib/haptic';
import { getSound } from '@/lib/sounds';
import { getTheme } from '@/lib/themes';
import type { AppState } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

interface Props {
  state: AppState;
  onUpdate: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onNavigate: (s: 'editorial' | 'facts' | 'premium' | 'auth' | 'sounds' | 'themes' | 'alarms') => void;
}

export function Settings({ state, onUpdate, onBack, onNavigate }: Props) {
  const quietOptions = [null, 15, 30, 45, 60];

  return (
    <div className="app-shell bg-paper-warm">
      <ScreenHeader title="Settings" onBack={onBack} />
      <div className="scroll-area pb-24">
        <div className="px-4 pt-4">

          <SectionLabel>Morning</SectionLabel>
          <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
            <Row label="Alarm" sublabel={`${state.alarms.length} alarms`} onClick={() => onNavigate('alarms')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
            <div className="border-t border-paper-fog" />
            <Row label="Morning sound" sublabel={getSound(state.morningSound).name} onClick={() => onNavigate('sounds')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
            <div className="border-t border-paper-fog" />
            <Row label="Gratitude" sublabel={state.gratitude.length > 0 ? `${state.gratitude.length} entries` : 'On'} right={<Toggle on={true} onChange={() => {}} />} />
            <div className="border-t border-paper-fog" />
            <Row label="Tasks" sublabel={`${state.tasks.length} tasks`} right={<Toggle on={state.notifications} onChange={(v) => onUpdate({ notifications: v })} />} />
            <div className="border-t border-paper-fog" />
            <Row label="Reminders" right={<Toggle on={state.notifications} onChange={(v) => onUpdate({ notifications: v })} />} />
            <div className="border-t border-paper-fog" />
            <Row label="Quiet Morning" sublabel={state.quietMorning ? `${state.quietMorning} min` : 'Off'}
              right={
                <div className="flex gap-1">
                  {quietOptions.map((q) => (
                    <button key={q ?? 'off'} onClick={() => { hapticSoft(); onUpdate({ quietMorning: q }); }}
                      className={`press-sm rounded-full px-2.5 py-1 text-xs font-medium ${state.quietMorning === q ? 'bg-ink text-white' : 'bg-paper-fog text-ink/50'}`}>
                      {q === null ? 'Off' : `${q}`}
                    </button>
                  ))}
                </div>
              }
            />
          </div>

          <SectionLabel>Focus</SectionLabel>
          <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
            <Row label="Focus duration" sublabel={`${state.focusDuration} minutes`}
              right={
                <div className="flex gap-1">
                  {[25, 45, 60, 90].map((d) => (
                    <button key={d} onClick={() => { hapticSoft(); onUpdate({ focusDuration: d }); }}
                      className={`press-sm rounded-full px-2.5 py-1 text-xs font-medium ${state.focusDuration === d ? 'bg-ink text-white' : 'bg-paper-fog text-ink/50'}`}>{d}</button>
                  ))}
                </div>
              }
            />
            <div className="border-t border-paper-fog" />
            <Row label="Break duration" sublabel={`${state.breakDuration} minutes`}
              right={
                <div className="flex gap-1">
                  {[5, 10, 15].map((d) => (
                    <button key={d} onClick={() => { hapticSoft(); onUpdate({ breakDuration: d }); }}
                      className={`press-sm rounded-full px-2.5 py-1 text-xs font-medium ${state.breakDuration === d ? 'bg-ink text-white' : 'bg-paper-fog text-ink/50'}`}>{d}</button>
                  ))}
                </div>
              }
            />
            <div className="border-t border-paper-fog" />
            <Row label="Focus sounds" sublabel={getSound(state.focusSound).name} onClick={() => onNavigate('sounds')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
          </div>

          <SectionLabel>Appearance</SectionLabel>
          <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
            <Row label="Theme" sublabel={getTheme(state.theme).name} onClick={() => onNavigate('themes')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
            <div className="border-t border-paper-fog" />
            <Row label="Dark mode" right={<Toggle on={state.darkMode} onChange={(v) => onUpdate({ darkMode: v })} />} />
            <div className="border-t border-paper-fog" />
            <Row label="Clock style" sublabel={state.clockStyle}
              right={
                <div className="flex gap-1">
                  {(['analog', 'digital'] as const).map((c) => (
                    <button key={c} onClick={() => { hapticSoft(); onUpdate({ clockStyle: c }); }}
                      className={`press-sm rounded-full px-3 py-1 text-xs font-medium capitalize ${state.clockStyle === c ? 'bg-ink text-white' : 'bg-paper-fog text-ink/50'}`}>{c}</button>
                  ))}
                </div>
              }
            />
          </div>

          <SectionLabel>Notifications</SectionLabel>
          <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
            <Row label="Alarms" right={<Toggle on={state.notifications} onChange={(v) => onUpdate({ notifications: v })} />} />
          </div>

          <SectionLabel>Account</SectionLabel>
          <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
            <Row label="Profile" onClick={() => onNavigate('auth')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
            <div className="border-t border-paper-fog" />
            <Row label="Sign in" onClick={() => onNavigate('auth')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
            <div className="border-t border-paper-fog" />
            <Row label="Privacy" onClick={() => onNavigate('auth')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
            <div className="border-t border-paper-fog" />
            <Row label="Security" onClick={() => onNavigate('auth')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
          </div>

          <SectionLabel>About</SectionLabel>
          <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
            <Row label="Why Luma" onClick={() => onNavigate('editorial')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
            <div className="border-t border-paper-fog" />
            <Row label="Dopamine & Stimulation" onClick={() => onNavigate('editorial')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
            <div className="border-t border-paper-fog" />
            <Row label="Internet Consumption" onClick={() => onNavigate('editorial')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
            <div className="border-t border-paper-fog" />
            <Row label="Feed Your Mind Well" onClick={() => onNavigate('editorial')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
            <div className="border-t border-paper-fog" />
            <Row label="Luma Facts" onClick={() => onNavigate('facts')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
            <div className="border-t border-paper-fog" />
            <Row label="Digital Wellbeing" onClick={() => onNavigate('editorial')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
            <div className="border-t border-paper-fog" />
            <Row label="Terms" onClick={() => onNavigate('auth')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
            <div className="border-t border-paper-fog" />
            <Row label="Privacy Policy" onClick={() => onNavigate('auth')} right={<ChevronRight className="h-4 w-4 text-ink/30" />} />
          </div>

          <div className="mt-6">
            <GhostButton onClick={() => onNavigate('premium')}>Luma Premium</GhostButton>
          </div>

          <p className="mt-6 text-center text-xs text-ink/30">Luma Alarm Clock · v1.0</p>
        </div>
      </div>
    </div>
  );
}
