import { getTheme } from '@/lib/themes';
import type { ThemeId } from '@/lib/types';

export function ThemeBackground({ themeId, dim = false }: { themeId: ThemeId; dim?: boolean }) {
  const t = getTheme(themeId);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {t.id === 'sf-fog' && <SFFog dim={dim} />}
      {t.id === 'golden-gate' && <GoldenGate dim={dim} />}
      {t.id === 'pacific' && <Pacific dim={dim} />}
      {t.id === 'clouds' && <Clouds dim={dim} />}
      {t.id === 'forest' && <Forest dim={dim} />}
      {t.id === 'blush' && <Blush dim={dim} />}
      {t.id === 'night' && <Night dim={dim} />}
      {t.id === 'cozy-morning' && <CozyMorning dim={dim} />}
      {t.id === 'paris-coffee' && <ParisCoffee dim={dim} />}
      {t.id === 'malibu' && <Malibu dim={dim} />}
      {t.id === 'rainy-window' && <RainyWindow dim={dim} />}
      {t.id === 'japanese-garden' && <JapaneseGarden dim={dim} />}
      {t.id === 'alpine' && <Alpine dim={dim} />}
      {t.id === 'botanical' && <Botanical dim={dim} />}
      {t.id === 'midnight-pacific' && <MidnightPacific dim={dim} />}
    </div>
  );
}

function SFFog({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #d8dde3 0%, #e8ecf0 40%, #f0f2f4 100%)' }}>
      <div className="absolute -left-1/4 top-1/4 h-2/3 w-3/2 rounded-full bg-white/60 blur-3xl animate-fog-drift" />
      <div className="absolute -right-1/4 top-1/3 h-1/2 w-3/2 rounded-full bg-white/50 blur-3xl animate-fog-drift" style={{ animationDelay: '-8s' }} />
      <div className="absolute left-0 bottom-0 h-1/3 w-full bg-white/40 blur-2xl animate-fog-drift" style={{ animationDelay: '-16s' }} />
      {dim && <div className="absolute inset-0 bg-white/30" />}
    </div>
  );
}

function GoldenGate({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #f9e6c8 0%, #f4d2b5 30%, #e2995a 70%, #c66f58 100%)' }}>
      <div className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-gradient-to-b from-yellow-200/80 to-orange-300/40 blur-2xl animate-sun-glow" />
      <div className="absolute bottom-0 left-0 right-0 h-1/4" style={{ background: 'linear-gradient(180deg, transparent, #a85838)' }} />
      {dim && <div className="absolute inset-0 bg-white/25" />}
    </div>
  );
}

function Pacific({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #cfe7ee 0%, #a8d0dd 40%, #6ba8c0 100%)' }}>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-ocean-300/40 to-ocean-500/60 animate-wave" />
      <div className="absolute bottom-1/4 left-0 right-0 h-px bg-white/30 animate-wave" style={{ animationDelay: '-4s' }} />
      {dim && <div className="absolute inset-0 bg-white/25" />}
    </div>
  );
}

function Clouds({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #eef2f5 0%, #dfe6ec 100%)' }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="absolute rounded-full bg-white/70 blur-2xl animate-cloud-drift"
          style={{
            top: `${15 + i * 20}%`,
            left: `${i * 10 - 10}%`,
            width: `${50 + i * 10}%`,
            height: `${20 + i * 5}%`,
            animationDelay: `${-i * 6}s`,
            animationDuration: `${24 + i * 6}s`,
          }}
        />
      ))}
      {dim && <div className="absolute inset-0 bg-white/25" />}
    </div>
  );
}

function Forest({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #d4e3d5 0%, #a8c8aa 40%, #7e9a82 100%)' }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="absolute rounded-full bg-sage-300/40 blur-2xl animate-leaf-sway"
          style={{ bottom: `${i * 8}%`, left: `${i * 25}%`, width: '60%', height: '30%', animationDelay: `${-i * 3}s` }}
        />
      ))}
      {dim && <div className="absolute inset-0 bg-white/25" />}
    </div>
  );
}

function Blush({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #f9ede9 0%, #f0d9d2 50%, #e4b3a4 100%)' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="absolute rounded-full bg-blush-200/50 blur-md animate-petal-float"
          style={{ top: `${10 + i * 18}%`, left: `${15 + i * 18}%`, width: '12px', height: '12px', animationDelay: `${-i * 1.5}s` }}
        />
      ))}
      {dim && <div className="absolute inset-0 bg-white/25" />}
    </div>
  );
}

function Night({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0d0f1a 0%, #1c2133 50%, #262c42 100%)' }}>
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white animate-star-twinkle"
          style={{
            top: `${(i * 37) % 80}%`,
            left: `${(i * 53) % 100}%`,
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
            animationDelay: `${-i * 0.5}s`,
          }}
        />
      ))}
      <div className="absolute -right-1/4 top-1/4 h-1/2 w-3/2 opacity-30 blur-3xl animate-cloud-drift" style={{ background: 'radial-gradient(ellipse, #4a5170, transparent)' }} />
      {dim && <div className="absolute inset-0 bg-night-800/40" />}
    </div>
  );
}

function CozyMorning({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #fdf0e0 0%, #f5d8b8 40%, #e2995a 100%)' }}>
      <div className="absolute right-0 top-0 h-1/2 w-2/3 rounded-full bg-yellow-200/60 blur-3xl animate-sun-glow" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-amber-200/30 blur-2xl" />
      {dim && <div className="absolute inset-0 bg-white/25" />}
    </div>
  );
}

function ParisCoffee({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #e8d9c9 0%, #d4c0a8 40%, #b8a088 100%)' }}>
      {/* Parisian rooftops silhouette */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 440 200" preserveAspectRatio="none" style={{ height: '45%' }}>
        <path d="M0,200 L0,140 L40,140 L40,100 L80,100 L80,130 L120,130 L120,90 L145,90 L145,70 L155,70 L155,90 L180,90 L180,120 L220,120 L220,80 L260,80 L260,110 L300,110 L300,95 L340,95 L340,130 L380,130 L380,100 L420,100 L420,140 L440,140 L440,200 Z"
          fill="#9a8270" opacity="0.6" />
        <path d="M0,200 L0,160 L60,160 L60,130 L100,130 L100,150 L160,150 L160,120 L200,120 L200,145 L260,145 L260,125 L320,125 L320,140 L380,140 L380,130 L440,130 L440,200 Z"
          fill="#7d6855" opacity="0.5" />
      </svg>
      {/* Coffee steam */}
      <div className="absolute bottom-1/3 left-1/3 flex gap-2 opacity-40">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 w-1 rounded-full bg-white/40 blur-sm animate-steam" style={{ animationDelay: `${-i * 1.5}s` }} />
        ))}
      </div>
      {/* Curtain hint */}
      <div className="absolute right-0 top-0 h-full w-1/4 bg-gradient-to-l from-cream/40 to-transparent animate-cloud-drift opacity-50" />
      {dim && <div className="absolute inset-0 bg-white/25" />}
    </div>
  );
}

function Malibu({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #f9e6c8 0%, #f0c89a 35%, #85b8cc 100%)' }}>
      <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-yellow-200/70 blur-2xl animate-sun-glow" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-ocean-300/50 animate-wave" />
      {dim && <div className="absolute inset-0 bg-white/25" />}
    </div>
  );
}

function RainyWindow({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #2a3540 0%, #3a4a55 50%, #4a5170 100%)' }}>
      {[...Array(30)].map((_, i) => (
        <div key={i} className="absolute w-px bg-ocean-100/30 animate-pulse-soft"
          style={{
            top: `${(i * 31) % 100}%`,
            left: `${(i * 17) % 100}%`,
            height: `${10 + (i % 4) * 6}px`,
            animationDelay: `${-i * 0.3}s`,
            animationDuration: '1.5s',
          }}
        />
      ))}
      {dim && <div className="absolute inset-0 bg-night-800/30" />}
    </div>
  );
}

function JapaneseGarden({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #d8e8d9 0%, #b0c8b2 50%, #88a88a 100%)' }}>
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-sage-400/30 blur-2xl animate-leaf-sway" />
      <div className="absolute top-1/4 right-1/4 h-20 w-20 rounded-full bg-sage-200/40 blur-xl animate-leaf-sway" style={{ animationDelay: '-3s' }} />
      {dim && <div className="absolute inset-0 bg-white/25" />}
    </div>
  );
}

function Alpine({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #dfe8ee 0%, #b8c8d8 50%, #8a9aaa 100%)' }}>
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 440 200" preserveAspectRatio="none" style={{ height: '40%' }}>
        <path d="M0,200 L0,120 L80,40 L140,120 L200,60 L280,130 L340,80 L440,140 L440,200 Z" fill="#9aa0b2" opacity="0.6" />
        <path d="M0,200 L0,150 L60,80 L120,150 L180,100 L260,160 L320,120 L440,170 L440,200 Z" fill="#7a8090" opacity="0.5" />
      </svg>
      <div className="absolute top-1/4 right-1/3 h-24 w-24 rounded-full bg-white/60 blur-2xl animate-sun-glow" />
      {dim && <div className="absolute inset-0 bg-white/25" />}
    </div>
  );
}

function Botanical({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #e3ebe4 0%, #c7d6c9 50%, #7e9a82 100%)' }}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="absolute rounded-full bg-sage-300/40 blur-2xl animate-leaf-sway"
          style={{ top: `${i * 22}%`, left: `${i * 20}%`, width: '40%', height: '25%', animationDelay: `${-i * 2}s` }}
        />
      ))}
      {dim && <div className="absolute inset-0 bg-white/25" />}
    </div>
  );
}

function MidnightPacific({ dim }: { dim?: boolean }) {
  return (
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0d0f1a 0%, #141826 40%, #243f50 100%)' }}>
      {[...Array(12)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-ocean-100/40 animate-star-twinkle"
          style={{ top: `${(i * 29) % 60}%`, left: `${(i * 41) % 100}%`, width: '2px', height: '2px', animationDelay: `${-i * 0.4}s` }}
        />
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-b from-ocean-700/40 to-ocean-900/60 animate-wave" />
      {dim && <div className="absolute inset-0 bg-night-900/40" />}
    </div>
  );
}
