import { useCallback, useReducer } from 'react';

import {
  CELL_STATE,
  CELL_TYPE,
  GAME_ACTION,
  GAME_CONFIG,
  GAME_STATUS,
} from '../constants/game';
import { createEmptyBoard, isInBounds, placeMines } from '../utils/board';
import { checkWinCondition, countPlacedFlags } from '../utils/checks';
import {
  flagRemainingMines,
  revealAllMines,
  revealCell,
  toggleCellFlag,
} from '../utils/reveal';

function createInitialState(gameNumber = 0) {
  return {
    board: createEmptyBoard(GAME_CONFIG.ROWS, GAME_CONFIG.COLS),
    gameStatus: GAME_STATUS.IDLE,
    hasMinesPlaced: false,
    explodedCell: null,
    gameNumber,
  };
}


function isGameOver(gameStatus) {
  return gameStatus === GAME_STATUS.WON || gameStatus === GAME_STATUS.LOST;
}


function handleRevealAction(state, row, col) {
  if (isGameOver(state.gameStatus)) {
    return state;
  }

  if (!isInBounds(row, col, GAME_CONFIG.ROWS, GAME_CONFIG.COLS)) {
    return state;
  }

  const currentCell = state.board[row][col];

  if (
    currentCell.state === CELL_STATE.OPEN ||
    currentCell.state === CELL_STATE.FLAGGED
  ) {
    return state;
  }

  const workingBoard = state.hasMinesPlaced
    ? state.board
    : placeMines(state.board, GAME_CONFIG.MINES_COUNT, row, col);

  if (workingBoard[row][col].type === CELL_TYPE.MINE) {
    return {
      ...state,
      board: revealAllMines(workingBoard, row, col),
      gameStatus: GAME_STATUS.LOST,
      hasMinesPlaced: true,
      explodedCell: { row, col },
    };
  }

  const revealedBoard = revealCell(workingBoard, row, col);

  if (checkWinCondition(revealedBoard)) {
    return {
      ...state,
      board: flagRemainingMines(revealedBoard),
      gameStatus: GAME_STATUS.WON,
      hasMinesPlaced: true,
    };
  }

  return {
    ...state,
    board: revealedBoard,
    gameStatus: GAME_STATUS.PLAYING,
    hasMinesPlaced: true,
  };
}


function handleToggleFlagAction(state, row, col) {
  if (isGameOver(state.gameStatus)) {
    return state;
  }

  const nextBoard = toggleCellFlag(
    state.board,
    row,
    col,
    GAME_CONFIG.MINES_COUNT,
  );

  if (nextBoard === state.board) {
    return state;
  }

  const nextStatus =
    state.gameStatus === GAME_STATUS.IDLE
      ? GAME_STATUS.PLAYING
      : state.gameStatus;

  return {
    ...state,
    board: nextBoard,
    gameStatus: nextStatus,
  };
}


function gameReducer(state, action) {
  switch (action.type) {
    case GAME_ACTION.REVEAL_CELL:
      return handleRevealAction(state, action.row, action.col);

    case GAME_ACTION.TOGGLE_FLAG:
      return handleToggleFlagAction(state, action.row, action.col);

    case GAME_ACTION.RESTART:
      return createInitialState(state.gameNumber + 1);

    default:
      return state;
  }
}


export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, 0, createInitialState);

  const placedFlags = countPlacedFlags(state.board);
  const remainingMines = GAME_CONFIG.MINES_COUNT - placedFlags;

  const handleCellClick = useCallback((row, col) => {
    dispatch({ type: GAME_ACTION.REVEAL_CELL, row, col });
  }, []);

  const handleCellFlag = useCallback((row, col) => {
    dispatch({ type: GAME_ACTION.TOGGLE_FLAG, row, col });
  }, []);

  const handleRestart = useCallback(() => {
    dispatch({ type: GAME_ACTION.RESTART });
  }, []);

  return {
    board: state.board,
    gameStatus: state.gameStatus,
    explodedCell: state.explodedCell,
    gameNumber: state.gameNumber,
    remainingMines,
    handleCellClick,
    handleCellFlag,
    handleRestart,
  };
}

