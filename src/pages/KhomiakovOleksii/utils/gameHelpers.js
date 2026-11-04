import { CELL_STATE, CELL_TYPE, NEIGHBOR_OFFSETS } from '../constants/gameConstants';

export function createInitialBoard(rows, cols, minesCount) {
  const board = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: cols }, (__, colIndex) => ({
      id: `${rowIndex}-${colIndex}`,
      row: rowIndex,
      col: colIndex,
      type: CELL_TYPE.EMPTY,
      neighborMines: 0,
      state: CELL_STATE.CLOSED,
      exploded: false,
    }))
  );

  let placedMines = 0;
  while (placedMines < minesCount) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);

    if (board[randomRow][randomCol].type !== CELL_TYPE.MINE) {
      board[randomRow][randomCol].type = CELL_TYPE.MINE;
      placedMines++;
    }
  }

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    for (let colIndex = 0; colIndex < cols; colIndex++) {
      if (board[rowIndex][colIndex].type === CELL_TYPE.MINE) continue;

      let count = 0;
      for (const [rowOffset, colOffset] of NEIGHBOR_OFFSETS) {
        const neighborRow = rowIndex + rowOffset;
        const neighborCol = colIndex + colOffset;

        if (
          neighborRow >= 0 &&
          neighborRow < rows &&
          neighborCol >= 0 &&
          neighborCol < cols &&
          board[neighborRow][neighborCol].type === CELL_TYPE.MINE
        ) {
          count++;
        }
      }
      board[rowIndex][colIndex].neighborMines = count;
    }
  }
  return board;
}

export function cloneBoard(board) {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

export function revealCellRecursive(initialBoard, startRow, startCol) {
  const nextBoard = cloneBoard(initialBoard);
  const rows = nextBoard.length;
  const cols = nextBoard[0].length;

  function floodFill(rowIndex, colIndex) {
    const cell = nextBoard[rowIndex][colIndex];

    if (cell.state === CELL_STATE.OPENED || cell.state === CELL_STATE.FLAGGED) return;

    cell.state = CELL_STATE.OPENED;

    if (cell.type === CELL_TYPE.MINE || cell.neighborMines > 0) return;

    for (const [rowOffset, colOffset] of NEIGHBOR_OFFSETS) {
      const neighborRow = rowIndex + rowOffset;
      const neighborCol = colIndex + colOffset;

      if (
        neighborRow >= 0 &&
        neighborRow < rows &&
        neighborCol >= 0 &&
        neighborCol < cols &&
        nextBoard[neighborRow][neighborCol].state === CELL_STATE.CLOSED
      ) {
        floodFill(neighborRow, neighborCol);
      }
    }
  }

  floodFill(startRow, startCol);
  return nextBoard;
}

export function checkIsWin(board) {
  for (const row of board) {
    for (const cell of row) {
      if (cell.type === CELL_TYPE.EMPTY && cell.state !== CELL_STATE.OPENED) return false;
    }
  }
  return true;
}

export function processCellOpen(initialBoard, rowIndex, colIndex) {
  const targetCell = initialBoard[rowIndex][colIndex];

  if (targetCell.type === CELL_TYPE.MINE) {
    const nextBoard = cloneBoard(initialBoard);
    nextBoard[rowIndex][colIndex].state = CELL_STATE.OPENED;
    nextBoard[rowIndex][colIndex].exploded = true;
    return { nextBoard, isLose: true, isWin: false };
  }

  const nextBoard = revealCellRecursive(initialBoard, rowIndex, colIndex);
  const isWin = checkIsWin(nextBoard);
  return { nextBoard, isLose: false, isWin };
}