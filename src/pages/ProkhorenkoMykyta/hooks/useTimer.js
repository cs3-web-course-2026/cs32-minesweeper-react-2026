import { useEffect } from 'react';

import { TIMER_INTERVAL_MS } from '../constants/game';


export function useTimer(isRunning, onTick) {
  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const timerId = setInterval(onTick, TIMER_INTERVAL_MS);

    return () => clearInterval(timerId);
  }, [isRunning, onTick]);
}
