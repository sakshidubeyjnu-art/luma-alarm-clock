import { useEffect } from 'react';
import { X } from 'lucide-react';
import { hapticSoft } from '@/lib/haptic';

export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/30 animate-fade-in" onClick={onClose} />
      <div className="relative animate-sheet-up rounded-t-[2rem] bg-paper-warm shadow-float max-h-[88%] overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="mx-auto h-1 w-10 rounded-full bg-ink/15" />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 pb-3">
            <h2 className="font-display text-xl font-medium text-ink">{title}</h2>
            <button onClick={() => { hapticSoft(); onClose(); }} className="press-sm rounded-full p-1.5 text-ink/40 hover:text-ink">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="scroll-area max-h-[75vh] px-5 pb-8 pt-1">
          {children}
        </div>
      </div>
    </div>
  );
}
