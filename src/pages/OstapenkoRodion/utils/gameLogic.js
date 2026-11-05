import { DIRECTIONS, CELL_TYPE, CELL_STATE } from '../constants';

export const cloneBoard = (board) => board.map(row => row.map(cell => ({ ...cell })));

export const generateEmptyBoard = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: CELL_TYPE.EMPTY,
      state: CELL_STATE.CLOSED,
      neighborMines: 0,
      exploded: false,
    }))
  );
};

export const placeMinesAndCalculate = (board, rows, cols, minesCount, firstClickRow, firstClickCol) => {
  const nextBoard = cloneBoard(board);
  let placedMines = 0;
  
  while (placedMines < minesCount) {
    let row = Math.floor(Math.random() * rows);
    let col = Math.floor(Math.random() * cols);
    
    if (nextBoard[row][col].type !== CELL_TYPE.MINE && !(row === firstClickRow && col === firstClickCol)) {
      nextBoard[row][col].type = CELL_TYPE.MINE;
      placedMines++;
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (nextBoard[row][col].type === CELL_TYPE.MINE) continue;
      let count = 0;
      for (let [directionRow, directionCol] of DIRECTIONS) {
        let neighborRow = row + directionRow;
        let neighborCol = col + directionCol;
        if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols && nextBoard[neighborRow][neighborCol].type === CELL_TYPE.MINE) {
          count++;
        }
      }
      nextBoard[row][col].neighborMines = count;
    }
  }
  return nextBoard;
};

export const revealEmptyCells = (board, row, col) => {
  const nextBoard = cloneBoard(board);
  const rows = nextBoard.length;
  const cols = nextBoard[0].length;
  
  const floodFill = (currentRow, currentCol) => {
    for (let [directionRow, directionCol] of DIRECTIONS) {
      let neighborRow = currentRow + directionRow;
      let neighborCol = currentCol + directionCol;
      if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols) {
        const cell = nextBoard[neighborRow][neighborCol];
        if (cell.state === CELL_STATE.CLOSED && cell.type !== CELL_TYPE.MINE) {
          cell.state = CELL_STATE.OPENED;
          if (cell.neighborMines === 0) {
            floodFill(neighborRow, neighborCol);
          }
        }
      }
    }
  };

  floodFill(row, col);
  return nextBoard;
};

export const revealMinesOnLoss = (board) => {
  const nextBoard = cloneBoard(board);
  nextBoard.forEach(row => row.forEach(cell => {
    if (cell.type === CELL_TYPE.MINE && cell.state !== CELL_STATE.FLAGGED) {
      cell.state = CELL_STATE.OPENED;
    }
    if (cell.state === CELL_STATE.FLAGGED && cell.type !== CELL_TYPE.MINE) {
      cell.state = CELL_STATE.WRONG_FLAG;
    }
  }));
  return nextBoard;
};

export const flagMinesOnWin = (board) => {
  const nextBoard = cloneBoard(board);
  nextBoard.forEach(row => row.forEach(cell => {
    if (cell.type === CELL_TYPE.MINE) {
      cell.state = CELL_STATE.FLAGGED;
    }
  }));
  return nextBoard;
};

export const toggleFlagStatus = (board, row, col) => {
  const nextBoard = cloneBoard(board);
  const cell = nextBoard[row][col];
  if (cell.state === CELL_STATE.CLOSED) {
    cell.state = CELL_STATE.FLAGGED;
  } else if (cell.state === CELL_STATE.FLAGGED) {
    cell.state = CELL_STATE.CLOSED;
  }
  return nextBoard;
};

export const checkWinCondition = (board) => {
  for (let row of board) {
    for (let cell of row) {
      if (cell.type === CELL_TYPE.EMPTY && cell.state !== CELL_STATE.OPENED) {
        return false;
      }
    }
  }
  return true;
};