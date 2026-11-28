
import { useEffect, useState } from 'react';

import { GAME_CONFIG, GAME_STATUS } from '../constants/game';

export function useTimer(gameStatus, gameNumber) {
  const [timerState, setTimerState] = useState({
    gameNumber,
    seconds: 0,
  });

  const seconds = timerState.gameNumber === gameNumber
    ? timerState.seconds
    : 0;

  useEffect(() => {
    if (gameStatus !== GAME_STATUS.PLAYING) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimerState(previousState => ({
        gameNumber,
        seconds: Math.min(
          (previousState.gameNumber === gameNumber
            ? previousState.seconds
            : 0) + 1,
          GAME_CONFIG.MAX_SECONDS
        ),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus, gameNumber]);

  return seconds;
}
