import { hapticSoft } from '@/lib/haptic';

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => { hapticSoft(); onChange(!on); }}
      className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${on ? 'bg-sage-500' : 'bg-ink/15'}`}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}
