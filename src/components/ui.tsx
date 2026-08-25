import { ChevronLeft } from 'lucide-react';
import { hapticSoft } from '@/lib/haptic';

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-20 glass safe-top">
      <div className="flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={() => { hapticSoft(); onBack(); }} className="press-sm -ml-1.5 rounded-full p-1.5 text-ink/60">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="font-display text-lg font-medium leading-tight text-ink">{title}</h1>
            {subtitle && <p className="text-xs text-ink/45">{subtitle}</p>}
          </div>
        </div>
        {right}
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  className = '',
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`press w-full rounded-2xl bg-ink py-3.5 text-center font-medium text-white shadow-soft disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`press w-full rounded-2xl bg-paper-fog py-3.5 text-center font-medium text-ink ${className}`}
    >
      {children}
    </button>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="px-1 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/40">{children}</p>;
}

export function Row({
  label,
  sublabel,
  right,
  onClick,
}: {
  label: string;
  sublabel?: string;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} disabled={!onClick} className="press flex w-full items-center justify-between px-4 py-3.5 text-left">
      <div>
        <p className="text-[15px] font-medium text-ink">{label}</p>
        {sublabel && <p className="text-xs text-ink/45">{sublabel}</p>}
      </div>
      {right}
    </button>
  );
}
