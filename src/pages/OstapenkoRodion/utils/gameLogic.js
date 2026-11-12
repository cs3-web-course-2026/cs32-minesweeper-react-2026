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

export const generateMineCoordinates = (rows, cols, minesCount, firstClickRow, firstClickCol) => {
  const coordinates = [];
  const placed = new Set();
  
  // Prevent placing a mine on the first clicked cell
  placed.add(`${firstClickRow},${firstClickCol}`);

  while (coordinates.length < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    const key = `${row},${col}`;

    if (!placed.has(key)) {
      placed.add(key);
      coordinates.push({ row, col });
    }
  }

  return coordinates;
};

export const placeMinesAndCalculate = (board, mineCoordinates) => {
  const nextBoard = cloneBoard(board);
  const rows = nextBoard.length;
  const cols = nextBoard[0].length;

  // 1. Place mines from provided coordinates
  for (const { row, col } of mineCoordinates) {
    nextBoard[row][col].type = CELL_TYPE.MINE;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (nextBoard[row][col].type === CELL_TYPE.MINE) continue;
      
      let count = 0;
      for (const [directionRow, directionCol] of DIRECTIONS) {
        const neighborRow = row + directionRow;
        const neighborCol = col + directionCol;
        
        if (
          neighborRow >= 0 && 
          neighborRow < rows && 
          neighborCol >= 0 && 
          neighborCol < cols && 
          nextBoard[neighborRow][neighborCol].type === CELL_TYPE.MINE
        ) {
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
    for (const [directionRow, directionCol] of DIRECTIONS) {
      const neighborRow = currentRow + directionRow;
      const neighborCol = currentCol + directionCol;
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
  for (const row of board) {
    for (const cell of row) {
      if (cell.type === CELL_TYPE.EMPTY && cell.state !== CELL_STATE.OPENED) {
        return false;
      }
    }
  }
  return true;
};