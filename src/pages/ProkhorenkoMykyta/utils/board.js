import { CELL_STATE, CELL_TYPE, DIRECTIONS } from '../constants/game';


function createEmptyCell() {
  return {
    type: CELL_TYPE.EMPTY,
    state: CELL_STATE.CLOSED,
    neighborMines: 0,
  };
}


function getRandomIndex(length) {
  return Math.floor(Math.random() * length);
}


export function isInBounds(board, row, col) {
  return row >= 0 && row < board.length && col >= 0 && col < board[0].length;
}


export function getNeighbourPositions(board, row, col) {
  const neighbourPositions = [];

  for (const [directionalRow, directionalCol] of DIRECTIONS) {
    const neighbourRow = row + directionalRow;
    const neighbourCol = col + directionalCol;

    if (isInBounds(board, neighbourRow, neighbourCol)) {
      neighbourPositions.push({ row: neighbourRow, col: neighbourCol });
    }
  }

  return neighbourPositions;
}


export function countNeighbourMines(board) {
  return board.map((boardRow, row) =>
    boardRow.map((cell, col) => {
      if (cell.type === CELL_TYPE.MINE) {
        return cell;
      }

      const neighborMines = getNeighbourPositions(board, row, col).filter(
        (position) =>
          board[position.row][position.col].type === CELL_TYPE.MINE,
      ).length;

      return { ...cell, neighborMines };
    }),
  );
}


export function generateField(rows, cols, minesCount) {
  const field = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, createEmptyCell),
  );
  const minesToPlace = Math.min(minesCount, rows * cols - 1);
  let placedMines = 0;

  while (placedMines < minesToPlace) {
    const row = getRandomIndex(rows);
    const col = getRandomIndex(cols);

    if (field[row][col].type !== CELL_TYPE.MINE) {
      field[row][col] = { ...field[row][col], type: CELL_TYPE.MINE };
      placedMines++;
    }
  }

  return countNeighbourMines(field);
}
