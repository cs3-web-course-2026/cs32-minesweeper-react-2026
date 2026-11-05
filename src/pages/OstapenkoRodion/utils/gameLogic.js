import { DIRECTIONS } from '../constants';

export const generateEmptyBoard = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: 'empty',
      state: 'closed',
      neighborMines: 0,
      exploded: false,
    }))
  );
};

export const placeMinesAndCalculate = (board, rows, cols, minesCount, firstClickR, firstClickC) => {
  let placedMines = 0;
  
  while (placedMines < minesCount) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);
    
    // Уникаємо мінування клітинки першого кліку та вже замінованих
    if (board[r][c].type !== 'mine' && !(r === firstClickR && c === firstClickC)) {
      board[r][c].type = 'mine';
      placedMines++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].type === 'mine') continue;
      let count = 0;
      for (let [dr, dc] of DIRECTIONS) {
        let nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].type === 'mine') {
          count++;
        }
      }
      board[r][c].neighborMines = count;
    }
  }
  return board;
};

export const revealEmptyCells = (board, r, c) => {
  const rows = board.length;
  const cols = board[0].length;
  
  for (let [dr, dc] of DIRECTIONS) {
    let nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      const cell = board[nr][nc];
      if (cell.state === 'closed' && cell.type !== 'mine') {
        cell.state = 'opened';
        if (cell.neighborMines === 0) {
          revealEmptyCells(board, nr, nc);
        }
      }
    }
  }
};

export const checkWinCondition = (board) => {
  for (let row of board) {
    for (let cell of row) {
      if (cell.type === 'empty' && cell.state !== 'opened') {
        return false;
      }
    }
  }
  return true;
};