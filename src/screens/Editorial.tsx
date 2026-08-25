import { ScreenHeader } from '@/components/ui';
import { hapticSoft } from '@/lib/haptic';
import { Brain, Eye, Coffee, Sun, Moon, Heart } from 'lucide-react';
import type { AppState } from '@/lib/types';

export function Editorial({ state, onBack }: { state: AppState; onBack: () => void }) {
  return (
    <div className="app-shell bg-paper-warm">
      <ScreenHeader title="What you consume matters" subtitle="Intentional internet use" onBack={onBack} />
      <div className="scroll-area pb-24">
        <div className="px-5 pt-6 space-y-4">
          <article className="rounded-3xl bg-white p-6 shadow-soft animate-fade-up">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-peach-500" strokeWidth={1.8} />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">What you consume matters</p>
            </div>
            <p className="mt-3 font-display text-xl font-medium leading-snug text-ink text-balance">The internet can be wonderful for learning, education, research, communication, creativity, work and inspiration.</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/60">But it can also provide endless novelty, short-form content, notifications, social comparison, emotional content, advertising, recommendations and distractions.</p>
            <div className="mt-5 rounded-2xl bg-paper-fog p-4">
              <p className="font-display text-lg font-medium text-ink">"Is this something I chose, or something that chose me?"</p>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/60">Open with a purpose. Do the thing. Leave.</p>
            <p className="mt-3 text-sm font-medium text-sage-600">Use the internet intentionally instead of letting it use your attention.</p>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-soft animate-fade-up" style={{ animationDelay: '0.05s' }}>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-ocean-500" strokeWidth={1.8} />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">Feed your mind well</p>
            </div>
            <p className="mt-3 font-display text-xl font-medium leading-snug text-ink text-balance">Don't feed your mind a diet of trash.</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/60">Your mind constantly takes in videos, conversations, books, social media, news, images, opinions, advertising and the people you follow.</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/60">What you repeatedly consume can influence what you notice, what interests you, what you expect, your mood, your habits and your attention.</p>
            <div className="mt-4 rounded-2xl bg-paper-fog p-4">
              <p className="text-sm leading-relaxed text-ink/70">Your mind learns from repeated patterns. What you repeatedly watch, read and listen to can influence what you notice, prefer and expect.</p>
            </div>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-soft animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-sage-600" strokeWidth={1.8} />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">Your brain note</p>
            </div>
            <p className="mt-3 font-display text-xl font-medium leading-snug text-ink text-balance">If you don't like how your mind feels lately, look at your inputs.</p>
            <div className="mt-4 space-y-2">
              {['What have I been watching?', 'What have I been reading?', 'What am I thinking about all day?', 'What does my phone show me every time I open it?', 'What have I been training my attention to expect?'].map((q) => (
                <div key={q} className="rounded-2xl bg-paper-fog px-4 py-3">
                  <p className="text-[15px] text-ink/70">{q}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm font-medium text-sage-600">The purpose is awareness, not judgment.</p>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-soft animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-gold-400" strokeWidth={1.8} />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/40">Did you know?</p>
            </div>
            <p className="mt-3 font-display text-xl font-medium leading-snug text-ink text-balance">Constant novelty can make ordinary activities feel less immediately interesting.</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/60">Studying may feel boring. Reading may feel boring. Walking may feel boring. Sitting quietly may feel uncomfortable.</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/60">You do not have to immediately fix that feeling.</p>
            <div className="mt-4 rounded-2xl bg-paper-fog p-4">
              <p className="font-display text-lg font-medium text-ink">You don't need every moment to be exciting.</p>
            </div>
          </article>

          <article className="rounded-3xl bg-ink p-6 text-white shadow-card animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-white/50" strokeWidth={1.8} />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">The ideal Luma day</p>
            </div>
            <div className="mt-4 space-y-2.5">
              {['Wake', 'Be grateful to God', 'Do something ordinary or slightly boring', 'Avoid immediate high-stimulation content', 'Prepare yourself', 'Study or work deeply', 'Take calm, non-scrolling breaks', 'Eat lunch without the phone', 'Continue working', 'Enjoy your afternoon and evening', 'Wind down', 'Sleep'].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="font-display text-sm text-white/40">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[15px] text-white/80">{step}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-white/10 p-4">
              <p className="font-display text-lg font-medium text-white">Beautiful enough to love. Calm enough to leave.</p>
            </div>
          </article>

          <article className="rounded-3xl bg-blush-50 p-6 shadow-soft animate-fade-up" style={{ animationDelay: '0.25s' }}>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-blush-500" strokeWidth={1.8} />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blush-500/60">Entertainment isn't bad</p>
            </div>
            <p className="mt-3 font-display text-xl font-medium leading-snug text-ink text-balance">Timing and intention matter.</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink/60">Do the difficult thing before the rewarding thing.</p>
          </article>
        </div>
      </div>
    </div>
  );
}
