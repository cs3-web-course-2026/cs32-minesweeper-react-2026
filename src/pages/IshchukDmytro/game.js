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
      type: 'empty',
      neighbourMines: 0,
      state: 'closed',
    })),
  );
  let placed = 0;

  while (placed < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    if (board[row][col].type !== 'mine') {
      board[row][col].type = 'mine';
      placed += 1;
    }
  }

  return board.map((rowCells, row) =>
    rowCells.map((cell, col) => ({
      ...cell,
      neighbourMines: getNeighbours(board, row, col).filter(
        ([r, c]) => board[r][c].type === 'mine',
      ).length,
    })),
  );
}

export function countFlags(board) {
  return board.flat().filter((cell) => cell.state === 'flagged').length;
}

export function createGame(board, round = 0) {
  return { board, status: 'playing', seconds: 0, round };
}

function revealCells(board, row, col) {
  const nextBoard = board.map((rowCells) => [...rowCells]);
  const pending = [[row, col]];

  while (pending.length > 0) {
    const [r, c] = pending.pop();
    const cell = nextBoard[r][c];

    if (cell.state !== 'closed') continue;

    nextBoard[r][c] = { ...cell, state: 'opened' };

    if (cell.type !== 'mine' && cell.neighbourMines === 0) {
      pending.push(...getNeighbours(nextBoard, r, c));
    }
  }

  return nextBoard;
}

export function gameReducer(state, action) {
  if (action.type === 'restart') {
    return createGame(action.board, state.round + 1);
  }

  if (state.status !== 'playing') return state;

  if (action.type === 'tick') {
    return { ...state, seconds: state.seconds + 1 };
  }

  if (action.type !== 'open' && action.type !== 'flag') return state;

  const { row, col } = action;
  const cell = state.board[row]?.[col];

  if (!cell || cell.state === 'opened') return state;

  if (action.type === 'flag') {
    if (cell.state === 'closed' && countFlags(state.board) >= CONFIG.minesCount) {
      return state;
    }

    const board = state.board.map((rowCells, r) =>
      rowCells.map((item, c) =>
        r === row && c === col
          ? { ...item, state: item.state === 'flagged' ? 'closed' : 'flagged' }
          : item,
      ),
    );

    return { ...state, board };
  }

  if (cell.state === 'flagged') return state;

  if (cell.type === 'mine') {
    const board = state.board.map((rowCells) =>
      rowCells.map((item) =>
        item.type === 'mine' ? { ...item, state: 'opened' } : item,
      ),
    );

    return { ...state, board, status: 'lost' };
  }

  const board = revealCells(state.board, row, col);
  const won = board.flat().every(
    (item) => item.type === 'mine' || item.state === 'opened',
  );

  return { ...state, board, status: won ? 'won' : 'playing' };
}
