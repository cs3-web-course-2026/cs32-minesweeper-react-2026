import { COUNTER_LIMITS } from '../constants/game';

export function formatCounter(value) {
  const clampedValue = Math.max(
    COUNTER_LIMITS.MIN,
    Math.min(COUNTER_LIMITS.MAX, value),
  );

  if (clampedValue < 0) {
    const formattedMagnitude = String(Math.abs(clampedValue)).padStart(
      COUNTER_LIMITS.NEGATIVE_PAD_LENGTH,
      '0',
    );

    return `-${formattedMagnitude}`;
  }

  return String(clampedValue).padStart(COUNTER_LIMITS.PAD_LENGTH, '0');
}

