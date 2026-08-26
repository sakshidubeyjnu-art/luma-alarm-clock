import { hapticSoft } from '@/lib/haptic';

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? 'On' : 'Off'}
      onClick={() => { hapticSoft(); onChange(!on); }}
      className={`relative h-7 w-12 cursor-pointer rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500/50 focus-visible:ring-offset-2 ${on ? 'bg-sage-500' : 'bg-ink/15'}`}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}
