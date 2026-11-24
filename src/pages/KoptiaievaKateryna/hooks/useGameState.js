import { useCallback, useReducer } from 'react';

import {
  CELL_STATE,
  CELL_TYPE,
  DEFAULT_CONFIG,
  GAME_ACTION,
  GAME_STATUS,
} from '../constants/game';
import { createBoard, moveMineAwayFrom } from '../utils/board';
import {
  countFlagsLeft,
  hasOpenedCells,
  isEverySafeCellOpened,
  isGameOver,
} from '../utils/checks';
import { flagAllMines, revealCell, toggleFlag } from '../utils/reveal';
import { useTimer } from './useTimer';


function createInitialState(config) {
  return {
    config,
    board: createBoard(config),
    status: GAME_STATUS.IDLE,
    gameTime: 0,
  };
}


function openCellInState(state, row, col) {
  if (
    isGameOver(state.status) ||
    state.board[row][col].state !== CELL_STATE.CLOSED
  ) {
    return state;
  }

  const safeBoard = hasOpenedCells(state.board)
    ? state.board
    : moveMineAwayFrom(state.board, row, col);
  const board = revealCell(safeBoard, row, col);

  if (board[row][col].type === CELL_TYPE.MINE) {
    return { ...state, board, status: GAME_STATUS.LOST };
  }

  if (isEverySafeCellOpened(board)) {
    return { ...state, board: flagAllMines(board), status: GAME_STATUS.WON };
  }

  return { ...state, board, status: GAME_STATUS.PLAYING };
}


function toggleFlagInState(state, row, col) {
  const cell = state.board[row][col];

  if (isGameOver(state.status) || cell.state === CELL_STATE.OPENED) {
    return state;
  }

  const isOutOfFlags =
    cell.state === CELL_STATE.CLOSED &&
    countFlagsLeft(state.board, state.config.minesCount) === 0;

  if (isOutOfFlags) {
    return state;
  }

  return {
    ...state,
    board: toggleFlag(state.board, row, col),
    status: GAME_STATUS.PLAYING,
  };
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
      if (state.status !== GAME_STATUS.PLAYING) {
        return state;
      }

      return { ...state, gameTime: state.gameTime + 1 };
    default:
      return state;
  }
}


export function useGameState() {
  const [state, dispatch] = useReducer(
    gameReducer,
    DEFAULT_CONFIG,
    createInitialState,
  );

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

  useTimer(state.status === GAME_STATUS.PLAYING, tick);

  return {
    board: state.board,
    status: state.status,
    gameTime: state.gameTime,
    flagsLeft: countFlagsLeft(state.board, state.config.minesCount),
    openCell,
    flagCell,
    restart,
  };
}
