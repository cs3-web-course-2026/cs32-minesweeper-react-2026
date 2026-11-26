import { useCallback, useReducer } from 'react';

import {
  CELL_STATE,
  CELL_TYPE,
  DEFAULT_CONFIG,
  GAME_ACTION,
  GAME_STATUS,
} from '../constants/game';
import { generateField } from '../utils/board';
import { getFlagsLeft, isWinCondition } from '../utils/checks';
import { openCell, toggleFlag } from '../utils/reveal';


function createInitialState(config) {
  return {
    config,
    board: generateField(config.rows, config.cols, config.minesCount),
    status: GAME_STATUS.IDLE,
    gameTime: 0,
  };
}


function isGameOver(status) {
  return status === GAME_STATUS.WIN || status === GAME_STATUS.LOSE;
}


function revealCellReducer(state, row, col) {
  const cell = state.board[row][col];

  if (isGameOver(state.status) || cell.state !== CELL_STATE.CLOSED) {
    return state;
  }

  const board = openCell(state.board, row, col);

  if (cell.type === CELL_TYPE.MINE) {
    return { ...state, board, status: GAME_STATUS.LOSE };
  }

  const status = isWinCondition(board) ? GAME_STATUS.WIN : GAME_STATUS.PROCESS;

  return { ...state, board, status };
}


function toggleFlagReducer(state, row, col) {
  const cell = state.board[row][col];

  if (isGameOver(state.status) || cell.state === CELL_STATE.OPENED) {
    return state;
  }

  const isPlacingFlag = cell.state === CELL_STATE.CLOSED;
  const flagsLeft = getFlagsLeft(state.board, state.config.minesCount);

  if (isPlacingFlag && flagsLeft === 0) {
    return state;
  }

  return {
    ...state,
    board: toggleFlag(state.board, row, col),
    status: GAME_STATUS.PROCESS,
  };
}


function gameReducer(state, action) {
  switch (action.type) {
    case GAME_ACTION.REVEAL_CELL:
      return revealCellReducer(state, action.row, action.col);
    case GAME_ACTION.TOGGLE_FLAG:
      return toggleFlagReducer(state, action.row, action.col);
    case GAME_ACTION.TICK:
      return { ...state, gameTime: state.gameTime + 1 };
    case GAME_ACTION.RESTART:
      return createInitialState(state.config);
    default:
      return state;
  }
}


export function useGameState(config = DEFAULT_CONFIG) {
  const [state, dispatch] = useReducer(gameReducer, config, createInitialState);

  const revealCell = useCallback(
    (row, col) => dispatch({ type: GAME_ACTION.REVEAL_CELL, row, col }),
    [],
  );
  const flagCell = useCallback(
    (row, col) => dispatch({ type: GAME_ACTION.TOGGLE_FLAG, row, col }),
    [],
  );
  const tick = useCallback(() => dispatch({ type: GAME_ACTION.TICK }), []);
  const restart = useCallback(
    () => dispatch({ type: GAME_ACTION.RESTART }),
    [],
  );

  return {
    board: state.board,
    status: state.status,
    gameTime: state.gameTime,
    flagsLeft: getFlagsLeft(state.board, state.config.minesCount),
    config: state.config,
    revealCell,
    flagCell,
    tick,
    restart,
  };
}
