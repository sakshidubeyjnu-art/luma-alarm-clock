import { useState } from 'react';
import { ScreenHeader, PrimaryButton } from '@/components/ui';
import { lumaFacts } from '@/lib/facts';
import { hapticSoft } from '@/lib/haptic';
import { Brain, Lightbulb, Eye, Sparkles, BookOpen, HelpCircle, Info } from 'lucide-react';
import type { LumaFact } from '@/lib/facts';

const iconFor: Record<LumaFact['type'], typeof Brain> = {
  'BRAIN FACTS': Brain,
  'STRANGE BUT TRUE': Lightbulb,
  'QUICK FACT': Info,
  'YOUR BRAIN NOTE': Eye,
  'LUMA FACTS': Sparkles,
  'DID YOU KNOW?': HelpCircle,
  'FYI': BookOpen,
};

const accentFor: Record<LumaFact['type'], string> = {
  'BRAIN FACTS': 'bg-ocean-100 text-ocean-600',
  'STRANGE BUT TRUE': 'bg-gold-100 text-gold-400',
  'QUICK FACT': 'bg-sage-100 text-sage-600',
  'YOUR BRAIN NOTE': 'bg-blush-100 text-blush-500',
  'LUMA FACTS': 'bg-peach-100 text-peach-500',
  'DID YOU KNOW?': 'bg-ocean-100 text-ocean-600',
  'FYI': 'bg-sage-100 text-sage-600',
};

export function Facts({ onBack }: { onBack: () => void }) {
  const [index, setIndex] = useState(0);
  const fact = lumaFacts[index];
  const Icon = iconFor[fact.type];

  const next = () => { hapticSoft(); setIndex((i) => (i + 1) % lumaFacts.length); };

  return (
    <div className="app-shell bg-paper-warm">
      <ScreenHeader title="Luma Facts" subtitle="Small discoveries" onBack={onBack} />
      <div className="scroll-area pb-24">
        <div className="px-5 pt-6">
          <div key={index} className="animate-fade-up">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${accentFor[fact.type]}`}>
              <Icon className="h-3.5 w-3.5" /> {fact.type}
            </div>
            <div className="mt-5 rounded-3xl bg-white p-7 shadow-card">
              <p className="font-display text-2xl font-medium leading-snug text-ink text-balance">{fact.title}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/60 text-pretty">{fact.body}</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-1.5">
            {lumaFacts.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-ink' : 'w-1.5 bg-ink/20'}`} />
            ))}
          </div>

          <div className="mt-8">
            <PrimaryButton onClick={next}>Another fact</PrimaryButton>
          </div>

          <div className="mt-6 rounded-2xl bg-sage-50 p-5">
            <p className="text-sm leading-relaxed text-sage-700">Dopamine is a neurotransmitter involved in several functions including motivation, learning, reward and movement. It is not simply a "pleasure chemical," and it is not a fuel supply that gets emptied whenever you enjoy something.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
