import { CELL_STATE, CELL_TYPE, DIRECTIONS } from '../constants/game';


function createCell(type) {
  return {
    type,
    state: CELL_STATE.CLOSED,
    neighbourMines: 0,
  };
}


function getRandomIndex(length) {
  return Math.floor(Math.random() * length);
}


function isInBounds(board, row, col) {
  return row >= 0 && row < board.length && col >= 0 && col < board[0].length;
}


export function getNeighbourPositions(board, row, col) {
  return DIRECTIONS.map(([directionalRow, directionalCol]) => [
    row + directionalRow,
    col + directionalCol,
  ]).filter(([neighbourRow, neighbourCol]) =>
    isInBounds(board, neighbourRow, neighbourCol),
  );
}


function countNeighbourMines(board) {
  return board.map((rowCells, row) =>
    rowCells.map((cell, col) => {
      if (cell.type === CELL_TYPE.MINE) {
        return cell;
      }

      const neighbourMines = getNeighbourPositions(board, row, col).filter(
        ([neighbourRow, neighbourCol]) =>
          board[neighbourRow][neighbourCol].type === CELL_TYPE.MINE,
      ).length;

      return { ...cell, neighbourMines };
    }),
  );
}


function pickMineIndexes(cellsCount, minesCount) {
  const mineIndexes = new Set();

  while (mineIndexes.size < minesCount) {
    mineIndexes.add(getRandomIndex(cellsCount));
  }

  return mineIndexes;
}


export function createBoard({ rows, cols, minesCount }) {
  if (minesCount >= rows * cols) {
    throw new RangeError('minesCount must be less than the number of cells');
  }

  const mineIndexes = pickMineIndexes(rows * cols, minesCount);
  const board = Array.from({ length: rows }, (_emptyRow, row) =>
    Array.from({ length: cols }, (_emptyCell, col) =>
      createCell(
        mineIndexes.has(row * cols + col) ? CELL_TYPE.MINE : CELL_TYPE.EMPTY,
      ),
    ),
  );

  return countNeighbourMines(board);
}


// Keeps the first opened cell safe: a mine under it moves to a random empty cell.
export function moveMineAwayFrom(board, row, col) {
  if (board[row][col].type !== CELL_TYPE.MINE) {
    return board;
  }

  const emptyPositions = board.flatMap((rowCells, currentRow) =>
    rowCells.flatMap((cell, currentCol) =>
      cell.type === CELL_TYPE.EMPTY ? [[currentRow, currentCol]] : [],
    ),
  );
  const [targetRow, targetCol] =
    emptyPositions[getRandomIndex(emptyPositions.length)];

  const movedBoard = board.map((rowCells, currentRow) =>
    rowCells.map((cell, currentCol) => {
      if (currentRow === row && currentCol === col) {
        return { ...cell, type: CELL_TYPE.EMPTY };
      }

      if (currentRow === targetRow && currentCol === targetCol) {
        return { ...cell, type: CELL_TYPE.MINE };
      }

      return cell;
    }),
  );

  return countNeighbourMines(movedBoard);
}
