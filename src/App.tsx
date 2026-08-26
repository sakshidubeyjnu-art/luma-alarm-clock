import { useCallback, useEffect, useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { Splash } from '@/screens/Splash';
import { Onboarding } from '@/screens/Onboarding';
import { Home } from '@/screens/Home';
import { Alarms } from '@/screens/Alarms';
import { Focus } from '@/screens/Focus';
import { Tasks } from '@/screens/Tasks';
import { Profile } from '@/screens/Profile';
import { Sounds } from '@/screens/Sounds';
import { Themes } from '@/screens/Themes';
import { Meditation } from '@/screens/Meditation';
import { Boring } from '@/screens/Boring';
import { Facts } from '@/screens/Facts';
import { Editorial } from '@/screens/Editorial';
import { Premium } from '@/screens/Premium';
import { Settings } from '@/screens/Settings';
import { Auth } from '@/screens/Auth';
import { AlarmRinging } from '@/screens/AlarmRinging';
import { useAppState } from '@/lib/store';
import { getAlarmEngine } from '@/lib/alarmEngine';
import type { Screen, Tab, ThemeId, Alarm } from '@/lib/types';

function App() {
  const store = useAppState();
  const { state } = store;
  const [screen, setScreen] = useState<Screen>('splash');
  const [ringingAlarmId, setRingingAlarmId] = useState<string | null>(null);
  const [snoozedAlarm, setSnoozedAlarm] = useState<Alarm | null>(null);

  const go = useCallback((next: Screen) => setScreen(next), []);
  const goTab = useCallback((tab: Tab) => setScreen(tab), []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
    return () => document.documentElement.classList.remove('dark');
  }, [state.darkMode]);

  const startAfterSplash = useCallback(() => {
    setScreen(state.onboarded ? 'home' : 'onboarding');
  }, [state.onboarded]);

  const completeOnboarding = (wakeTime: string, theme: ThemeId) => {
    store.update({ onboarded: true, wakeTime, theme });
    setScreen('home');
  };

  // Alarm engine integration
  useEffect(() => {
    const engine = getAlarmEngine();
    engine.setCallback((alarm) => {
      if (alarm.repeat === 'once') {
        store.updateAlarm(alarm.id, { enabled: false });
      }
      setSnoozedAlarm(alarm);
      setRingingAlarmId(alarm.id);
      setScreen('ringing');
    });
    engine.setAlarms(state.alarms);
  }, [state.alarms]);

  // Recalculate on visibility change
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        getAlarmEngine().restoreOnVisible();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, []);

  const ring = (id?: string) => {
    const alarm = id ? state.alarms.find((a) => a.id === id) : state.alarms.find((a) => a.enabled);
    if (alarm) { setRingingAlarmId(alarm.id); setScreen('ringing'); }
  };

  const stopRinging = () => {
    setRingingAlarmId(null);
    setSnoozedAlarm(null);
    getAlarmEngine().cancelSnooze();
    setScreen('home');
  };

  const snooze = () => {
    const alarm = state.alarms.find((a) => a.id === ringingAlarmId);
    if (alarm) {
      getAlarmEngine().snooze(alarm, alarm.snooze);
      setSnoozedAlarm(alarm);
    }
    setRingingAlarmId(null);
    setScreen('home');
  };

  const startMorning = () => {
    setRingingAlarmId(null);
    setScreen('home');
  };

  const backTo = (fallback: Screen = 'home') => setScreen(fallback);

  if (screen === 'splash') return <Splash onDone={startAfterSplash} />;
  if (screen === 'onboarding') return <Onboarding onComplete={completeOnboarding} />;

  if (screen === 'ringing' && ringingAlarmId) {
    const alarm = state.alarms.find((a) => a.id === ringingAlarmId) ?? snoozedAlarm;
    if (alarm) return <AlarmRinging alarm={alarm} onStop={stopRinging} onSnooze={snooze} onStartMorning={startMorning} />;
  }

  let content: React.ReactNode;
  switch (screen) {
    case 'alarms':
      content = <Alarms state={state} onAdd={store.addAlarm} onUpdate={store.updateAlarm} onRemove={store.removeAlarm} onPreviewRing={() => ring()} onPremium={() => go('premium')} />;
      break;
    case 'focus':
      content = <Focus state={state} onUpdate={store.update} onNavigate={(s) => go(s)} />;
      break;
    case 'tasks':
      content = <Tasks state={state} onAdd={store.addTask} onUpdate={store.updateTask} onRemove={store.removeTask} onUpdatePriority={(priority) => store.update({ priority })} />;
      break;
    case 'profile':
      content = <Profile state={state} onNavigate={(s) => go(s)} onUpdate={store.update} />;
      break;
    case 'sounds':
      content = <Sounds state={state} onUpdate={store.update} onBack={() => backTo('profile')} onPremium={() => go('premium')} />;
      break;
    case 'themes':
      content = <Themes state={state} onUpdate={store.update} onBack={() => backTo('profile')} onPremium={() => go('premium')} />;
      break;
    case 'meditation':
      content = <Meditation state={state} onBack={() => backTo('home')} />;
      break;
    case 'boring':
      content = <Boring onBack={() => backTo('home')} />;
      break;
    case 'facts':
      content = <Facts onBack={() => backTo('home')} />;
      break;
    case 'editorial':
      content = <Editorial state={state} onBack={() => backTo('home')} />;
      break;
    case 'premium':
      content = <Premium state={state} onUpdate={store.update} onBack={() => backTo('profile')} />;
      break;
    case 'settings':
      content = <Settings state={state} onUpdate={store.update} onBack={() => backTo('profile')} onNavigate={(s) => go(s)} />;
      break;
    case 'auth':
      content = <Auth state={state} onUpdate={store.update} onBack={() => backTo('profile')} />;
      break;
    case 'home':
    default:
      content = <Home state={state} onNavigate={(s) => go(s)} onToggleRoutine={store.toggleRoutine} onToggleAlarm={(id, enabled) => store.updateAlarm(id, { enabled })} onAddGratitude={store.addGratitude} />;
      break;
  }

  const tabScreens: Screen[] = ['home', 'alarms', 'focus', 'tasks', 'profile'];
  const showNav = tabScreens.includes(screen);
  const activeTab: Tab = tabScreens.includes(screen) ? screen as Tab : 'home';

  return (
    <div className="noise min-h-screen bg-[#d9d5cb]">
      <div className="relative mx-auto h-[100dvh] w-full max-w-[440px]">
        {content}
        {showNav && <BottomNav active={activeTab} onChange={goTab} />}
      </div>
    </div>
  );
}

export default App;
