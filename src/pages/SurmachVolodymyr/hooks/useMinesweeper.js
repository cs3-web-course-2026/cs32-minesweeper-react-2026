import { useCallback, useEffect, useReducer } from 'react';
import { createInitialState, gameReducer } from '../utils/gameLogic.js';

export function useMinesweeper() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  useEffect(() => {
    if (state.status !== 'playing') return undefined;
    const timer = window.setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => window.clearInterval(timer);
  }, [state.status]);

  const reveal = useCallback((index) => dispatch({ type: 'REVEAL', index }), []);
  const toggleFlag = useCallback((index) => dispatch({ type: 'TOGGLE_FLAG', index }), []);
  const restart = useCallback(() => dispatch({ type: 'RESET' }), []);
  const flagsPlaced = state.board.filter((cell) => cell.flagged).length;
  return { ...state, flagsPlaced, reveal, toggleFlag, restart };
}
