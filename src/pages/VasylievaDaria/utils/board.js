
import { GAME_CONFIG } from '../constants/game';

export function createBoard() {
  return Array.from({ length: GAME_CONFIG.ROWS }, () =>
    Array.from({ length: GAME_CONFIG.COLS }, () => ({
      mine: false,
      opened: false,
      flagged: false,
      count: 0,
    }))
  );
}

export function countAdjacentMines(board, row, col) {
  let count = 0;

  for (let directionalRow = -1; directionalRow <= 1; directionalRow++) {
    for (let directionalCol = -1; directionalCol <= 1; directionalCol++) {
      const neighbourRow = row + directionalRow;
      const neighbourCol = col + directionalCol;

      if (
        neighbourRow >= 0 &&
        neighbourRow < GAME_CONFIG.ROWS &&
        neighbourCol >= 0 &&
        neighbourCol < GAME_CONFIG.COLS &&
        board[neighbourRow][neighbourCol].mine
      ) {
        count++;
      }
    }
  }

  return count;
}

export function updateCounts(board) {
  return board.map((boardRow, row) =>
    boardRow.map((cell, col) => ({
      ...cell,
      count: cell.mine ? 0 : countAdjacentMines(board, row, col),
    }))
  );
}

export function placeMines(board, safeRow, safeCol) {
  const nextBoard = board.map(boardRow =>
    boardRow.map(cell => ({ ...cell }))
  );

  let placed = 0;

  while (placed < GAME_CONFIG.MINES) {
    const row = Math.floor(Math.random() * GAME_CONFIG.ROWS);
    const col = Math.floor(Math.random() * GAME_CONFIG.COLS);

    if (
      !nextBoard[row][col].mine &&
      (row !== safeRow || col !== safeCol)
    ) {
      nextBoard[row][col].mine = true;
      placed++;
    }
  }

  return updateCounts(nextBoard);
}
