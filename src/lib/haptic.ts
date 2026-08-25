export function haptic(ms: number | number[] = 10) {
  try {
    if ('vibrate' in navigator) navigator.vibrate(ms);
  } catch { /* ignore */ }
}

export function hapticSoft() { haptic(8); }
export function hapticMedium() { haptic(15); }
export function hapticStrong() { haptic([0, 20, 10, 20]); }
