import { CELL_STATE, CELL_TYPE, NEIGHBOUR_OFFSETS } from '../constants/game';


function createCell() {
  return { type: CELL_TYPE.EMPTY, state: CELL_STATE.CLOSED, neighborMines: 0 };
}


/** Повертає координати сусідів клітинки, що лежать у межах поля. */
export function getNeighbours(board, row, col) {
  return NEIGHBOUR_OFFSETS.map(([directionalRow, directionalCol]) => ({
    row: row + directionalRow,
    col: col + directionalCol,
  })).filter(
    (neighbour) => board[neighbour.row]?.[neighbour.col] !== undefined,
  );
}


/** Вибирає випадкові унікальні позиції мін (без повторів). */
function pickMinePositions(rows, cols, minesCount) {
  const positions = new Set();
  const minesToPlace = Math.min(minesCount, rows * cols);

  while (positions.size < minesToPlace) {
    positions.add(Math.floor(Math.random() * rows * cols));
  }

  return positions;
}


/** Створює поле rows × cols із розставленими мінами. */
export function generateField(rows, cols, minesCount) {
  const minePositions = pickMinePositions(rows, cols, minesCount);

  return Array.from({ length: rows }, (_row, row) =>
    Array.from({ length: cols }, (_col, col) => {
      const cell = createCell();
      const isMine = minePositions.has(row * cols + col);

      return isMine ? { ...cell, type: CELL_TYPE.MINE } : cell;
    }),
  );
}


/** Повертає нове поле, де кожна безпечна клітинка знає кількість мін поруч. */
export function countNeighbourMines(board) {
  return board.map((cells, row) =>
    cells.map((cell, col) => {
      if (cell.type === CELL_TYPE.MINE) return cell;

      const neighborMines = getNeighbours(board, row, col).filter(
        (neighbour) =>
          board[neighbour.row][neighbour.col].type === CELL_TYPE.MINE,
      ).length;

      return { ...cell, neighborMines };
    }),
  );
}


export function createBoard({ rows, cols, minesCount }) {
  return countNeighbourMines(generateField(rows, cols, minesCount));
}
