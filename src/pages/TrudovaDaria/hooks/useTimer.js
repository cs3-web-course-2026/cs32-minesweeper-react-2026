import { useCallback, useEffect, useState } from "react";

import { TIMER_INTERVAL_MS } from "../constants/game";

export function useTimer(isRunning) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setElapsedSeconds((previousSeconds) => previousSeconds + 1);
    }, TIMER_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const resetTimer = useCallback(() => setElapsedSeconds(0), []);

  return { elapsedSeconds, resetTimer };
}
