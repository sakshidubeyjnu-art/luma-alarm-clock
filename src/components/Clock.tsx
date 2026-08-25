import { useEffect, useState } from 'react';

export function AnalogClock({ size = 180, showSeconds = true }: { size?: number; showSeconds?: boolean }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);
  const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
  const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);

  const hourLen = r * 0.5;
  const minuteLen = r * 0.72;
  const secondLen = r * 0.8;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm">
      <circle cx={cx} cy={cy} r={r} fill="#ffffff" stroke="#1a1a1f" strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r - 6} fill="none" stroke="#1a1a1f" strokeWidth={0.5} opacity={0.15} />

      {/* Tick marks */}
      {Array.from({ length: 60 }).map((_, i) => {
        const angle = (i * 6 - 90) * (Math.PI / 180);
        const isHour = i % 5 === 0;
        const inner = isHour ? r - 10 : r - 5;
        const outer = r - 3;
        return (
          <line key={i}
            x1={cx + inner * Math.cos(angle)} y1={cy + inner * Math.sin(angle)}
            x2={cx + outer * Math.cos(angle)} y2={cy + outer * Math.sin(angle)}
            stroke="#1a1a1f" strokeWidth={isHour ? 1.5 : 0.5} opacity={isHour ? 0.9 : 0.4}
          />
        );
      })}

      {/* Numbers */}
      {[12, 3, 6, 9].map((n, i) => {
        const angle = (i * 90 - 90) * (Math.PI / 180);
        const nr = r - 22;
        return (
          <text key={n}
            x={cx + nr * Math.cos(angle)} y={cy + nr * Math.sin(angle)}
            textAnchor="middle" dominantBaseline="central"
            fontSize={size * 0.085} fontFamily="Fraunces, Georgia, serif" fill="#1a1a1f" fontWeight={500}
          >{n}</text>
        );
      })}

      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={cx + hourLen * Math.cos(hourAngle)} y2={cy + hourLen * Math.sin(hourAngle)}
        stroke="#1a1a1f" strokeWidth={4} strokeLinecap="round" />
      {/* Minute hand */}
      <line x1={cx} y1={cy} x2={cx + minuteLen * Math.cos(minuteAngle)} y2={cy + minuteLen * Math.sin(minuteAngle)}
        stroke="#1a1a1f" strokeWidth={2.5} strokeLinecap="round" />
      {/* Second hand */}
      {showSeconds && (
        <line x1={cx} y1={cy} x2={cx + secondLen * Math.cos(secondAngle)} y2={cy + secondLen * Math.sin(secondAngle)}
          stroke="#1a1a1f" strokeWidth={1} strokeLinecap="round" opacity={0.7} />
      )}

      <circle cx={cx} cy={cy} r={3.5} fill="#1a1a1f" />
    </svg>
  );
}

export function DigitalClock({ size = 'normal' }: { size?: 'normal' | 'large' | 'xl' }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  let h = now.getHours();
  const m = now.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;

  const cls = size === 'xl' ? 'text-clock' : size === 'large' ? 'text-clock-sm' : 'text-6xl';

  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-display font-medium tracking-tight text-ink ${cls}`}>{h}:{m.toString().padStart(2, '0')}</span>
      <span className="font-display text-2xl text-ink/60">{ampm}</span>
    </div>
  );
}
