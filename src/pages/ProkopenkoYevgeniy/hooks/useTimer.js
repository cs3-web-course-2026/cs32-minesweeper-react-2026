import { useEffect, useState } from 'react';

import { GAME_STATUS, TIMER_INTERVAL_MS } from '../constants/game';

export function useTimer(gameStatus, gameNumber) {
  const [timerState, setTimerState] = useState({
    gameNumber,
    seconds: 0,
  });

  useEffect(() => {
    if (gameStatus !== GAME_STATUS.PLAYING) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setTimerState((previousState) => ({
        gameNumber,
        seconds:
          previousState.gameNumber === gameNumber
            ? previousState.seconds + 1
            : 1,
      }));
    }, TIMER_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [gameStatus, gameNumber]);

  return timerState.gameNumber === gameNumber ? timerState.seconds : 0;
}

