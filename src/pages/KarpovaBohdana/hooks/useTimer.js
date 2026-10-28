import { useEffect } from 'react';

import { TIMER_INTERVAL_MS } from '../constants/game';


/** Поки isRunning === true, викликає onTick щосекунди; зупиняється й прибирає інтервал сам. */
export function useTimer(isRunning, onTick) {
  useEffect(() => {
    if (!isRunning) return undefined;

    const timerId = setInterval(onTick, TIMER_INTERVAL_MS);

    return () => clearInterval(timerId);
  }, [isRunning, onTick]);
}
