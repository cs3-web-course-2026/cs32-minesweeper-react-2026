import { useCallback, useReducer } from "react";

import {
  ACTION_TYPE,
  CELL_STATE,
  GAME_CONFIG,
  GAME_STATUS,
} from "../constants/game";
import { countFlags, createBoard, setCellState } from "../utils/board";
import {
  checkLossCondition,
  checkWinCondition,
  isGameOver,
  isInBounds,
} from "../utils/checks";
import { revealAllMines, revealCell } from "../utils/reveal";

import { useTimer } from "./useTimer";

function createInitialState() {
  return {
    board: createBoard(
      GAME_CONFIG.ROWS,
      GAME_CONFIG.COLS,
      GAME_CONFIG.MINE_COUNT,
    ),
    gameStatus: GAME_STATUS.IDLE,
    isFlagMode: false,
    isFlagLimitReached: false,
  };
}

function reduceReveal(state, { row, col }) {
  const { board, gameStatus } = state;

  if (isGameOver(gameStatus) || !isInBounds(board, row, col)) {
    return state;
  }

  if (board[row][col].state !== CELL_STATE.CLOSED) {
    return state;
  }

  let nextBoard = revealCell(board, row, col);
  let nextStatus = GAME_STATUS.PLAYING;

  if (checkLossCondition(nextBoard)) {
    nextBoard = revealAllMines(nextBoard);
    nextStatus = GAME_STATUS.LOST;
  } else if (checkWinCondition(nextBoard)) {
    nextStatus = GAME_STATUS.WON;
  }

  return {
    ...state,
    board: nextBoard,
    gameStatus: nextStatus,
    isFlagLimitReached: false,
  };
}

function reduceToggleFlag(state, { row, col }) {
  const { board, gameStatus } = state;

  if (isGameOver(gameStatus) || !isInBounds(board, row, col)) {
    return state;
  }

  const { state: cellState } = board[row][col];

  if (cellState === CELL_STATE.OPEN) {
    return state;
  }

  if (
    cellState === CELL_STATE.CLOSED &&
    countFlags(board) >= GAME_CONFIG.MINE_COUNT
  ) {
    return { ...state, isFlagLimitReached: true };
  }

  const nextCellState =
    cellState === CELL_STATE.FLAGGED ? CELL_STATE.CLOSED : CELL_STATE.FLAGGED;

  return {
    ...state,
    board: setCellState(board, row, col, nextCellState),
    gameStatus: GAME_STATUS.PLAYING,
    isFlagLimitReached: false,
  };
}

function gameReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPE.REVEAL_CELL:
      return reduceReveal(state, action);
    case ACTION_TYPE.TOGGLE_FLAG:
      return reduceToggleFlag(state, action);
    case ACTION_TYPE.TOGGLE_FLAG_MODE:
      return { ...state, isFlagMode: !state.isFlagMode };
    case ACTION_TYPE.RESTART:
      return createInitialState();
    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialState,
  );
  const { board, gameStatus, isFlagMode, isFlagLimitReached } = state;

  const { elapsedSeconds, resetTimer } = useTimer(
    gameStatus === GAME_STATUS.PLAYING,
  );

  const minesRemaining = GAME_CONFIG.MINE_COUNT - countFlags(board);

  const handleCellClick = useCallback(
    (row, col) => {
      dispatch({
        type: isFlagMode ? ACTION_TYPE.TOGGLE_FLAG : ACTION_TYPE.REVEAL_CELL,
        row,
        col,
      });
    },
    [isFlagMode],
  );

  const handleCellFlag = useCallback((row, col) => {
    dispatch({ type: ACTION_TYPE.TOGGLE_FLAG, row, col });
  }, []);

  const handleToggleFlagMode = useCallback(() => {
    dispatch({ type: ACTION_TYPE.TOGGLE_FLAG_MODE });
  }, []);

  const handleRestart = useCallback(() => {
    dispatch({ type: ACTION_TYPE.RESTART });
    resetTimer();
  }, [resetTimer]);

  return {
    board,
    gameStatus,
    elapsedSeconds,
    minesRemaining,
    isFlagMode,
    isFlagLimitReached,
    handleCellClick,
    handleCellFlag,
    handleToggleFlagMode,
    handleRestart,
  };
}
