import { CELL_STATE, CELL_TYPE, GAME_STATUS } from './constants';

export const CONFIG = { rows: 10, cols: 10, minesCount: 15 };

export function getNeighbours(board, row, col) {
  const positions = [];

  for (let r = row - 1; r <= row + 1; r += 1) {
    for (let c = col - 1; c <= col + 1; c += 1) {
      if ((r !== row || c !== col) && board[r]?.[c]) {
        positions.push([r, c]);
      }
    }
  }

  return positions;
}

export function createBoard({ rows, cols, minesCount } = CONFIG) {
  if (
    !Number.isInteger(rows) ||
    rows < 1 ||
    !Number.isInteger(cols) ||
    cols < 1 ||
    !Number.isInteger(minesCount) ||
    minesCount < 0 ||
    minesCount >= rows * cols
  ) {
    throw new RangeError('Invalid board dimensions or mine count');
  }

  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: CELL_TYPE.EMPTY,
      neighbourMines: 0,
      state: CELL_STATE.CLOSED,
    })),
  );
  let placed = 0;

  while (placed < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    if (board[row][col].type !== CELL_TYPE.MINE) {
      board[row][col].type = CELL_TYPE.MINE;
      placed += 1;
    }
  }

  return board.map((rowCells, row) =>
    rowCells.map((cell, col) => ({
      ...cell,
      neighbourMines: getNeighbours(board, row, col).filter(
        ([r, c]) => board[r][c].type === CELL_TYPE.MINE,
      ).length,
    })),
  );
}

export function countFlags(board) {
  return board.flat().filter((cell) => cell.state === CELL_STATE.FLAGGED).length;
}

export function createGame(board, round = 0) {
  return { board, status: GAME_STATUS.PLAYING, seconds: 0, round };
}

function revealCells(board, row, col) {
  const nextBoard = board.map((rowCells) => [...rowCells]);
  const pending = [[row, col]];

  while (pending.length > 0) {
    const [r, c] = pending.pop();
    const cell = nextBoard[r][c];

    if (cell.state !== CELL_STATE.CLOSED) continue;

    nextBoard[r][c] = { ...cell, state: CELL_STATE.OPENED };

    if (cell.type !== CELL_TYPE.MINE && cell.neighbourMines === 0) {
      pending.push(...getNeighbours(nextBoard, r, c));
    }
  }

  return nextBoard;
}

export function gameReducer(state, action) {
  if (action.type === 'restart') {
    return createGame(action.board, state.round + 1);
  }

  if (state.status !== GAME_STATUS.PLAYING) return state;

  if (action.type === 'tick') {
    return { ...state, seconds: state.seconds + 1 };
  }

  if (action.type !== 'open' && action.type !== 'flag') return state;

  const { row, col } = action;
  const cell = state.board[row]?.[col];

  if (!cell || cell.state === CELL_STATE.OPENED) return state;

  if (action.type === 'flag') {
    if (cell.state === CELL_STATE.CLOSED && countFlags(state.board) >= CONFIG.minesCount) {
      return state;
    }

    const board = state.board.map((rowCells, r) =>
      rowCells.map((item, c) =>
        r === row && c === col
          ? {
              ...item,
              state: item.state === CELL_STATE.FLAGGED
                ? CELL_STATE.CLOSED
                : CELL_STATE.FLAGGED,
            }
          : item,
      ),
    );

    return { ...state, board };
  }

  if (cell.state === CELL_STATE.FLAGGED) return state;

  if (cell.type === CELL_TYPE.MINE) {
    const board = state.board.map((rowCells) =>
      rowCells.map((item) =>
        item.type === CELL_TYPE.MINE ? { ...item, state: CELL_STATE.OPENED } : item,
      ),
    );

    return { ...state, board, status: GAME_STATUS.LOST };
  }

  const board = revealCells(state.board, row, col);
  const won = board.flat().every(
    (item) => item.type === CELL_TYPE.MINE || item.state === CELL_STATE.OPENED,
  );

  return { ...state, board, status: won ? GAME_STATUS.WON : GAME_STATUS.PLAYING };
}
