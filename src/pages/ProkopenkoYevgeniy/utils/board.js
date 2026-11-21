import { CELL_STATE, CELL_TYPE, DIRECTIONS } from '../constants/game';

export function isInBounds(row, col, rows, cols) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}


export function getNeighbors(row, col, rows, cols) {
  const neighbors = [];

  for (const [directionalRow, directionalCol] of DIRECTIONS) {
    const neighborRow = row + directionalRow;
    const neighborCol = col + directionalCol;

    if (isInBounds(neighborRow, neighborCol, rows, cols)) {
      neighbors.push([neighborRow, neighborCol]);
    }
  }

  return neighbors;
}


export function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: CELL_TYPE.EMPTY,
      state: CELL_STATE.CLOSED,
      neighborMines: 0,
    })),
  );
}


export function calculateNeighborMines(board) {
  const rows = board.length;
  const cols = rows > 0 ? board[0].length : 0;

  return board.map((boardRow, row) =>
    boardRow.map((cell, col) => {
      if (cell.type === CELL_TYPE.MINE) {
        return { ...cell, neighborMines: 0 };
      }

      const neighbors = getNeighbors(row, col, rows, cols);
      let adjacentMineCount = 0;

      for (const [neighborRow, neighborCol] of neighbors) {
        if (board[neighborRow][neighborCol].type === CELL_TYPE.MINE) {
          adjacentMineCount += 1;
        }
      }

      return { ...cell, neighborMines: adjacentMineCount };
    }),
  );
}


export function placeMines(board, minesCount, excludedRow, excludedCol) {
  const rows = board.length;
  const cols = rows > 0 ? board[0].length : 0;
  const candidatePositions = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (row === excludedRow && col === excludedCol) {
        continue;
      }

      candidatePositions.push([row, col]);
    }
  }

  for (let index = candidatePositions.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const temporaryPosition = candidatePositions[index];
    candidatePositions[index] = candidatePositions[randomIndex];
    candidatePositions[randomIndex] = temporaryPosition;
  }

  const actualMinesCount = Math.min(minesCount, candidatePositions.length);
  const mineKeys = new Set();

  for (let mineIndex = 0; mineIndex < actualMinesCount; mineIndex += 1) {
    const [mineRow, mineCol] = candidatePositions[mineIndex];
    mineKeys.add(`${mineRow}-${mineCol}`);
  }

  const boardWithMines = board.map((boardRow, row) =>
    boardRow.map((cell, col) => {
      if (mineKeys.has(`${row}-${col}`)) {
        return { ...cell, type: CELL_TYPE.MINE };
      }

      return { ...cell, type: CELL_TYPE.EMPTY };
    }),
  );

  return calculateNeighborMines(boardWithMines);
}

