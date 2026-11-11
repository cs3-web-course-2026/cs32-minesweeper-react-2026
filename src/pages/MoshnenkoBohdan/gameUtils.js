// Константи та правила гри
export const DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10, label: 'Easy' },
  medium: { rows: 16, cols: 16, mines: 40, label: 'Medium' },
  hard: { rows: 16, cols: 30, mines: 99, label: 'Hard' },
};

export const CELL_TYPE = {
  EMPTY: 'empty',
  MINE: 'mine',
};

export const CELL_STATE = {
  CLOSED: 'closed',
  OPEN: 'open',
  FLAGGED: 'flagged',
};

export const GAME_STATUS = {
  IDLE: 'idle',
  PROCESS: 'process',
  WIN: 'win',
  GAMEOVER: 'gameover',
};

// Створення порожньої ігрової дошки
export const createEmptyBoard = (rows, cols) => {
  const newBoard = [];
  for (let r = 0; r < rows; r++) {
    newBoard[r] = [];
    for (let c = 0; c < cols; c++) {
      newBoard[r][c] = {
        row: r,
        col: c,
        type: CELL_TYPE.EMPTY,
        state: CELL_STATE.CLOSED,
        neighborMines: 0,
      };
    }
  }
  return newBoard;
};

// Розміщення мін та підрахунок сусідніх значень після першого кліку
export const placeMinesAndCalculate = (rows, cols, minesCount, clickedRow, clickedCol, currentBoard) => {
  const newBoard = currentBoard.map((row) => row.map((cell) => ({ ...cell })));
  let planted = 0;

  while (planted < minesCount) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);

    // Безпечний перший клік (не ставимо міну навколо кліку)
    const isNearStart = Math.abs(randomRow - clickedRow) <= 1 && Math.abs(randomCol - clickedCol) <= 1;

    if (newBoard[randomRow][randomCol].type !== CELL_TYPE.MINE && !isNearStart) {
      newBoard[randomRow][randomCol].type = CELL_TYPE.MINE;
      planted++;
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (newBoard[row][col].type === CELL_TYPE.MINE) continue;
      let counter = 0;
      const left = Math.max(0, col - 1);
      const right = Math.min(cols - 1, col + 1);
      const high = Math.max(0, row - 1);
      const low = Math.min(rows - 1, row + 1);

      for (let nr = high; nr <= low; nr++) {
        for (let nc = left; nc <= right; nc++) {
          if (newBoard[nr][nc].type === CELL_TYPE.MINE) {
            counter++;
          }
        }
      }
      newBoard[row][col].neighborMines = counter;
    }
  }

  return newBoard;
};

// Рекурсивне відкриття порожніх клітинок (Flood fill)
export const applyFloodFill = (board, rowIdx, colIdx, rows, cols) => {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  const stack = [[rowIdx, colIdx]];

  while (stack.length > 0) {
    const [curR, curC] = stack.pop();
    const cell = newBoard[curR][curC];

    if (cell.state === CELL_STATE.CLOSED) {
      cell.state = CELL_STATE.OPEN;
      if (cell.neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = curR + dr;
            const nc = curC + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].state === CELL_STATE.CLOSED) {
              stack.push([nr, nc]);
            }
          }
        }
      }
    }
  }

  return newBoard;
};

export const checkGameWon = (board) => {
  return board.flat().every(
    (cell) => cell.type === CELL_TYPE.MINE || cell.state === CELL_STATE.OPEN
  );
};