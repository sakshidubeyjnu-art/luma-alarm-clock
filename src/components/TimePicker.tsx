import { useEffect, useRef, useState } from 'react';
import { hapticSoft } from '@/lib/haptic';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const hours = Array.from({ length: 12 }, (_, index) => index + 1);
const minutes = Array.from({ length: 60 }, (_, index) => index);

function parseTime(value: string): { hour: number; minute: number; period: 'AM' | 'PM' } {
  const [rawHour, rawMinute] = value.split(':').map(Number);
  const hour24 = Number.isFinite(rawHour) ? rawHour : 8;
  const minute = Number.isFinite(rawMinute) ? Math.max(0, Math.min(59, rawMinute)) : 0;
  return {
    hour: hour24 % 12 || 12,
    minute,
    period: hour24 >= 12 ? 'PM' : 'AM',
  };
}

export function TimePicker({ value, onChange }: Props) {
  const parsed = parseTime(value);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState<'AM' | 'PM'>(parsed.period);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const next = parseTime(value);
    setHour(next.hour);
    setMinute(next.minute);
    setPeriod(next.period);
  }, [value]);

  useEffect(() => {
    hourRef.current?.scrollTo({ top: (hour - 1) * 44, behavior: 'auto' });
    minuteRef.current?.scrollTo({ top: minute * 44, behavior: 'auto' });
  }, [hour, minute]);

  const commit = (nextHour: number, nextMinute: number, nextPeriod: 'AM' | 'PM') => {
    const hour24 = nextPeriod === 'PM' ? (nextHour % 12) + 12 : nextHour % 12;
    onChange(`${hour24.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`);
  };

  const selectHour = (nextHour: number) => {
    hapticSoft();
    setHour(nextHour);
    commit(nextHour, minute, period);
  };

  const selectMinute = (nextMinute: number) => {
    hapticSoft();
    setMinute(nextMinute);
    commit(hour, nextMinute, period);
  };

  const selectPeriod = (nextPeriod: 'AM' | 'PM') => {
    hapticSoft();
    setPeriod(nextPeriod);
    commit(hour, minute, nextPeriod);
  };

  const handleScroll = (type: 'hour' | 'minute', element: HTMLDivElement) => {
    const max = type === 'hour' ? 11 : 59;
    const index = Math.max(0, Math.min(max, Math.round(element.scrollTop / 44)));
    if (type === 'hour' && index + 1 !== hour) selectHour(index + 1);
    if (type === 'minute' && index !== minute) selectMinute(index);
  };

  const renderWheel = (type: 'hour' | 'minute', items: number[], selected: number, onSelect: (v: number) => void, ref: React.RefObject<HTMLDivElement>) => (
    <div
      ref={ref}
      onScroll={(e) => handleScroll(type, e.currentTarget)}
      className="no-scrollbar h-[220px] w-20 overflow-y-auto snap-y snap-mandatory"
    >
      <div className="h-[88px]" />
      {items.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onSelect(item)}
          className="flex h-11 w-full snap-center items-center justify-center"
        >
          <span className={`font-display text-2xl transition-all ${selected === item ? 'scale-100 font-medium text-ink' : 'scale-90 text-ink/25'}`}>
            {item.toString().padStart(2, '0')}
          </span>
        </button>
      ))}
      <div className="h-[88px]" />
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-11 w-40 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-paper-fog/60" />
        {renderWheel('hour', hours, hour, selectHour, hourRef)}
        <span className="font-display text-2xl text-ink/40">:</span>
        {renderWheel('minute', minutes, minute, selectMinute, minuteRef)}
      </div>
      <div className="mt-3 flex rounded-xl bg-paper-fog/80 p-1">
        {(['AM', 'PM'] as const).map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => selectPeriod(option)}
            className={`press-sm rounded-lg px-5 py-2 text-sm font-medium transition-colors ${period === option ? 'bg-ink text-white shadow-soft' : 'text-ink/40'}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
