import { ROWS, COLS, MINES_COUNT, CELL_TYPE, CELL_STATE, DIRECTIONS } from '../constants/game';

export function createCell() {
  return {
    type: CELL_TYPE.EMPTY,
    state: CELL_STATE.CLOSED,
    neighborMines: 0,
  };
}

export function generateField(rows = ROWS, cols = COLS, minesCount = MINES_COUNT) {
  const totalCells = rows * cols;
  const actualMines = Math.min(minesCount, totalCells);

  const field = [];
  for (let row = 0; row < rows; row++) {
    const rowCells = [];
    for (let col = 0; col < cols; col++) {
      rowCells.push(createCell());
    }
    field.push(rowCells);
  }

  let minesPlaced = 0;
  while (minesPlaced < actualMines) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);

    if (field[randomRow][randomCol].type !== CELL_TYPE.MINE) {
      field[randomRow][randomCol].type = CELL_TYPE.MINE;
      minesPlaced++;
    }
  }

  return field;
}

export function countNeighbourMines(field) {
  const rowCount = field.length;
  if (rowCount === 0) return field;
  const colCount = field[0].length;

  const newField = field.map((rowCells) =>
    rowCells.map((cell) => ({ ...cell })),
  );

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      if (newField[row][col].type === CELL_TYPE.MINE) continue;

      let count = 0;
      for (const [offsetRow, offsetCol] of DIRECTIONS) {
        const neighborRow = row + offsetRow;
        const neighborCol = col + offsetCol;
        if (
          neighborRow >= 0 &&
          neighborRow < rowCount &&
          neighborCol >= 0 &&
          neighborCol < colCount &&
          newField[neighborRow][neighborCol].type === CELL_TYPE.MINE
        ) {
          count++;
        }
      }
      newField[row][col].neighborMines = count;
    }
  }

  return newField;
}

export function floodFillReveal(board, startRow, startCol) {
  const rowCount = board.length;
  const colCount = board[0].length;
  const newBoard = board.map((rowCells) =>
    rowCells.map((cell) => ({ ...cell })),
  );

  function cascadeOpen(targetRow, targetCol) {
    const cellToOpen = newBoard[targetRow][targetCol];
    cellToOpen.state = CELL_STATE.OPENED;

    if (cellToOpen.neighborMines === 0) {
      for (const [offsetRow, offsetCol] of DIRECTIONS) {
        const nextRow = targetRow + offsetRow;
        const nextCol = targetCol + offsetCol;

        if (
          nextRow >= 0 &&
          nextRow < rowCount &&
          nextCol >= 0 &&
          nextCol < colCount
        ) {
          const neighbor = newBoard[nextRow][nextCol];
          if (
            neighbor.state === CELL_STATE.CLOSED &&
            neighbor.type !== CELL_TYPE.MINE
          ) {
            cascadeOpen(nextRow, nextCol);
          }
        }
      }
    }
  }

  cascadeOpen(startRow, startCol);
  return newBoard;
}

export function checkWinCondition(board, minesCount = MINES_COUNT) {
  const rowCount = board.length;
  const colCount = board[0].length;
  let openedSafeCells = 0;
  const totalSafeCells = rowCount * colCount - minesCount;

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      const cell = board[row][col];
      if (cell.type !== CELL_TYPE.MINE && cell.state === CELL_STATE.OPENED) {
        openedSafeCells++;
      }
    }
  }

  return openedSafeCells === totalSafeCells;
}

export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
