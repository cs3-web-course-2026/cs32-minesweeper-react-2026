import { useCallback, useReducer } from 'react';

import {
  CELL_STATE,
  CELL_TYPE,
  DEFAULT_CONFIG,
  GAME_ACTION,
  GAME_STATUS,
} from '../constants/game';
import { createBoard } from '../utils/board';
import {
  checkWinCondition,
  countFlaggedCells,
  flagAllMines,
  isGameOver,
} from '../utils/checks';
import { revealCell, toggleFlag, updateCell } from '../utils/reveal';


function createInitialState(config) {
  return {
    config,
    board: createBoard(config),
    status: GAME_STATUS.IDLE,
    gameTime: 0,
  };
}


function openCellInState(state, row, col) {
  const cell = state.board[row][col];

  if (isGameOver(state.status)) return state;
  if (cell.state !== CELL_STATE.CLOSED) return state;

  if (cell.type === CELL_TYPE.MINE) {
    // Єдина відкрита міна на полі — та, на якій стався підрив
    const board = updateCell(state.board, row, col, {
      state: CELL_STATE.OPENED,
    });

    return { ...state, board, status: GAME_STATUS.LOST };
  }

  const board = revealCell(state.board, row, col);

  if (checkWinCondition(board)) {
    return { ...state, board: flagAllMines(board), status: GAME_STATUS.WON };
  }

  return { ...state, board, status: GAME_STATUS.PLAYING };
}


function toggleFlagInState(state, row, col) {
  if (isGameOver(state.status)) return state;

  return { ...state, board: toggleFlag(state.board, row, col) };
}


function gameReducer(state, action) {
  switch (action.type) {
    case GAME_ACTION.RESTART:
      return createInitialState(state.config);
    case GAME_ACTION.OPEN_CELL:
      return openCellInState(state, action.row, action.col);
    case GAME_ACTION.TOGGLE_FLAG:
      return toggleFlagInState(state, action.row, action.col);
    case GAME_ACTION.TICK:
      if (state.status !== GAME_STATUS.PLAYING) return state;

      return { ...state, gameTime: state.gameTime + 1 };
    default:
      return state;
  }
}


/** Увесь змінний стан гри та дії над ним. */
export function useGameState(config = DEFAULT_CONFIG) {
  const [state, dispatch] = useReducer(gameReducer, config, createInitialState);

  const openCell = useCallback(
    (row, col) => dispatch({ type: GAME_ACTION.OPEN_CELL, row, col }),
    [],
  );
  const flagCell = useCallback(
    (row, col) => dispatch({ type: GAME_ACTION.TOGGLE_FLAG, row, col }),
    [],
  );
  const restart = useCallback(
    () => dispatch({ type: GAME_ACTION.RESTART }),
    [],
  );
  const tick = useCallback(() => dispatch({ type: GAME_ACTION.TICK }), []);

  return {
    board: state.board,
    status: state.status,
    gameTime: state.gameTime,
    // Зайві прапорці не роблять лічильник від'ємним,
    // тож табло й aria-label показують однакове число
    flagsLeft: Math.max(
      0,
      state.config.minesCount - countFlaggedCells(state.board),
    ),
    isFinished: isGameOver(state.status),
    openCell,
    flagCell,
    restart,
    tick,
  };
}
