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
  EXPLODED: 'exploded',
};

export const GAME_STATUS = {
  IDLE: 'idle',
  PROCESS: 'process',
  WIN: 'win',
  GAMEOVER: 'gameover',
};

export const createEmptyBoard = (rowCount, colCount) => {
  const newBoard = [];
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    newBoard[rowIndex] = [];
    for (let colIndex = 0; colIndex < colCount; colIndex++) {
      newBoard[rowIndex][colIndex] = {
        row: rowIndex,
        col: colIndex,
        type: CELL_TYPE.EMPTY,
        state: CELL_STATE.CLOSED,
        neighborMines: 0,
      };
    }
  }
  return newBoard;
};

export const placeMinesAndCalculate = (rowCount, colCount, minesCount, clickedRow, clickedCol, currentBoard) => {
  const newBoard = currentBoard.map((row) => row.map((cell) => ({ ...cell })));
  let planted = 0;

  while (planted < minesCount) {
    const randomRow = Math.floor(Math.random() * rowCount);
    const randomCol = Math.floor(Math.random() * colCount);

    const isNearStart = Math.abs(randomRow - clickedRow) <= 1 && Math.abs(randomCol - clickedCol) <= 1;

    if (newBoard[randomRow][randomCol].type !== CELL_TYPE.MINE && !isNearStart) {
      newBoard[randomRow][randomCol].type = CELL_TYPE.MINE;
      planted++;
    }
  }

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    for (let colIndex = 0; colIndex < colCount; colIndex++) {
      if (newBoard[rowIndex][colIndex].type === CELL_TYPE.MINE) continue;
      let counter = 0;
      const left = Math.max(0, colIndex - 1);
      const right = Math.min(colCount - 1, colIndex + 1);
      const high = Math.max(0, rowIndex - 1);
      const low = Math.min(rowCount - 1, rowIndex + 1);

      for (let neighborRow = high; neighborRow <= low; neighborRow++) {
        for (let neighborCol = left; neighborCol <= right; neighborCol++) {
          if (newBoard[neighborRow][neighborCol].type === CELL_TYPE.MINE) {
            counter++;
          }
        }
      }
      newBoard[rowIndex][colIndex].neighborMines = counter;
    }
  }

  return newBoard;
};

export const applyFloodFill = (board, startRow, startCol, rowCount, colCount) => {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  const stack = [[startRow, startCol]];

  while (stack.length > 0) {
    const [currentRow, currentCol] = stack.pop();
    const cell = newBoard[currentRow][currentCol];

    if (cell.state === CELL_STATE.CLOSED) {
      cell.state = CELL_STATE.OPEN;
      if (cell.neighborMines === 0) {
        for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
          for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
            const neighborRow = currentRow + deltaRow;
            const neighborCol = currentCol + deltaCol;
            if (
              neighborRow >= 0 &&
              neighborRow < rowCount &&
              neighborCol >= 0 &&
              neighborCol < colCount &&
              newBoard[neighborRow][neighborCol].state === CELL_STATE.CLOSED
            ) {
              stack.push([neighborRow, neighborCol]);
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