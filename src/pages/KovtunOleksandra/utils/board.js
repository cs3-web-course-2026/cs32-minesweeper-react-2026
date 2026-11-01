import { DIRECTIONS } from '../constants/game';

export function createInitialBoard(rows, cols, minesCount) {
  const board = Array.from({ length: rows }, () =>
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

export function revealEmptyCells(board, startR, startC, rows, cols) {
  const newBoard = board.map(r => r.map(cell => ({ ...cell })));
  const cell = newBoard[startR][startC];

  if (cell.state === 'opened' || cell.state === 'flagged') {
    return newBoard;
  }

  cell.state = 'opened';

  if (cell.type === 'empty' && cell.neighborMines === 0) {
    const queue = [[startR, startC]];
    const visited = new Set([`${startR},${startC}`]);

    while (queue.length > 0) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const neighbor = newBoard[nr][nc];
          const key = `${nr},${nc}`;

          if (!visited.has(key) && neighbor.state === 'closed') {
            visited.add(key);
            neighbor.state = 'opened';

            if (neighbor.type === 'empty' && neighbor.neighborMines === 0) {
              queue.push([nr, nc]);
            }
          }
        }
      }
    }
  }

  return newBoard;
}