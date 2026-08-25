import { Lock, Check, Heart } from 'lucide-react';
import { ScreenHeader, SectionLabel } from '@/components/ui';
import { themes } from '@/lib/themes';
import { ThemeBackground } from '@/components/ThemeBackground';
import { hapticSoft } from '@/lib/haptic';
import type { AppState, ThemeId } from '@/lib/types';

interface Props {
  state: AppState;
  onUpdate: (patch: Partial<AppState>) => void;
  onBack: () => void;
  onPremium: () => void;
}

export function Themes({ state, onUpdate, onBack, onPremium }: Props) {
  const free = themes.filter((t) => !t.premium);
  const premium = themes.filter((t) => t.premium);

  const select = (id: ThemeId, locked: boolean) => {
    if (locked && state.premium === 'free') { onPremium(); return; }
    hapticSoft();
    onUpdate({ theme: id, favoriteThemes: state.favoriteThemes.includes(id) ? state.favoriteThemes : [...state.favoriteThemes, id] });
  };

  const ThemeCard = ({ t }: { t: typeof themes[number] }) => {
    const selected = state.theme === t.id;
    const fav = state.favoriteThemes.includes(t.id);
    const locked = t.premium && state.premium === 'free';
    return (
      <button onClick={() => select(t.id, locked)} className={`press relative overflow-hidden rounded-3xl bg-white text-left shadow-soft transition-all ${selected ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper-warm' : ''} ${locked ? 'opacity-70' : ''}`}>
        <div className="relative h-32 overflow-hidden">
          <ThemeBackground themeId={t.id} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {selected && <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white"><Check className="h-4 w-4 text-ink" /></div>}
          {locked && <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/30"><Lock className="h-3.5 w-3.5 text-white" /></div>}
        </div>
        <div className="flex items-start justify-between px-3.5 py-3">
          <div>
            <p className="text-sm font-medium text-ink">{t.name}</p>
            <p className="mt-0.5 text-[11px] text-ink/45">{t.subtitle}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); hapticSoft(); onUpdate({ favoriteThemes: fav ? state.favoriteThemes.filter((x) => x !== t.id) : [...state.favoriteThemes, t.id] }); }} className="press-sm p-1">
            <Heart className={`h-4 w-4 ${fav ? 'fill-blush-400 text-blush-400' : 'text-ink/20'}`} />
          </button>
        </div>
      </button>
    );
  };

  return (
    <div className="app-shell bg-paper-warm">
      <ScreenHeader title="Themes" subtitle="Choose your atmosphere" onBack={onBack} />
      <div className="scroll-area pb-24">
        <SectionLabel>Free themes</SectionLabel>
        <div className="grid grid-cols-2 gap-3 px-4">
          {free.map((t) => <ThemeCard key={t.id} t={t} />)}
        </div>
        <SectionLabel>Premium themes</SectionLabel>
        <div className="grid grid-cols-2 gap-3 px-4 pb-6">
          {premium.map((t) => <ThemeCard key={t.id} t={t} />)}
        </div>
      </div>
    </div>
  );
}
