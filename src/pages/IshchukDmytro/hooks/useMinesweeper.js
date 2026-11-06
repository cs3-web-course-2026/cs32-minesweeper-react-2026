import { useCallback, useEffect, useReducer } from 'react';
import { CONFIG, countFlags, createBoard, createGame, gameReducer } from '../game';

function initializeGame() {
  return createGame(createBoard());
}

export function useMinesweeper() {
  const [game, dispatch] = useReducer(gameReducer, undefined, initializeGame);

  useEffect(() => {
    if (game.status !== 'playing') return undefined;

    const timerId = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(timerId);
  }, [game.status, game.round]);

  const openCell = useCallback(
    (row, col) => dispatch({ type: 'open', row, col }),
    [],
  );
  const toggleFlag = useCallback(
    (row, col) => dispatch({ type: 'flag', row, col }),
    [],
  );
  const restart = useCallback(
    () => dispatch({ type: 'restart', board: createBoard() }),
    [],
  );

  return {
    ...game,
    flagsLeft: CONFIG.minesCount - countFlags(game.board),
    openCell,
    toggleFlag,
    restart,
  };
}
