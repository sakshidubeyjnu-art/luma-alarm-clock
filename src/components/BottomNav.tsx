import { Home, AlarmClock, Timer, CheckSquare, User } from 'lucide-react';
import type { Tab } from '@/lib/types';
import { hapticSoft } from '@/lib/haptic';

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'alarms', label: 'Alarms', icon: AlarmClock },
    { id: 'focus', label: 'Focus', icon: Timer },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 glass border-t border-black/5 safe-bottom">
      <div className="flex items-stretch justify-around px-2 pt-2 pb-1">
        {items.map((item) => {
          const isActive = active === item.id;
          const Icon = item.icon;
          return (
            <button key={item.id}
              onClick={() => { hapticSoft(); onChange(item.id); }}
              className="press-sm flex flex-1 flex-col items-center gap-1 py-1.5"
            >
              <Icon className={`nav-ico transition-colors ${isActive ? 'text-ink' : 'text-ink/35'}`}
                strokeWidth={isActive ? 2 : 1.6} />
              <span className={`text-[10px] font-medium tracking-wide transition-colors ${isActive ? 'text-ink' : 'text-ink/35'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
