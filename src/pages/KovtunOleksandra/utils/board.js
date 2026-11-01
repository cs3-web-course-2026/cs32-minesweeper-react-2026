import { DIRECTIONS } from '../constants/game';

export function createInitialBoard(rows, cols, minesCount) {
  let board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: 'empty',
      state: 'closed',
      neighborMines: 0
    }))
  );

  let minesPlaced = 0;
  while (minesPlaced < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (board[r][c].type !== 'mine') {
      board[r][c].type = 'mine';
      minesPlaced++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].type === 'mine') continue;
      let mines = 0;
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (board[nr][nc].type === 'mine') mines++;
        }
      }
      board[r][c].neighborMines = mines;
    }
  }

  return board;
}