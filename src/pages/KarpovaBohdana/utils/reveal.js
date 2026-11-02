import { CELL_STATE } from '../constants/game';
import { getNeighbours } from './board';


function toPositionKey(row, col) {
  return `${row}-${col}`;
}


/** Повертає нове поле, у якому лише клітинка (row, col) отримала зміни changes. */
export function updateCell(board, row, col, changes) {
  return board.map((cells, rowIndex) =>
    rowIndex === row
      ? cells.map((cell, colIndex) =>
          colIndex === col ? { ...cell, ...changes } : cell,
        )
      : cells,
  );
}


/**
 * Flood fill: збирає координати клітинок, які треба відкрити. Якщо навколо
 * клітинки немає мін, рекурсивно додає її закритих сусідів. Поле не змінює.
 */
function floodFillReveal(board, row, col, positionsToOpen) {
  const positionKey = toPositionKey(row, col);
  const cell = board[row][col];

  if (positionsToOpen.has(positionKey)) return positionsToOpen;
  if (cell.state !== CELL_STATE.CLOSED) return positionsToOpen;

  positionsToOpen.add(positionKey);

  if (cell.neighborMines > 0) return positionsToOpen;

  for (const neighbour of getNeighbours(board, row, col)) {
    floodFillReveal(board, neighbour.row, neighbour.col, positionsToOpen);
  }

  return positionsToOpen;
}


/** Повертає нове поле з відкритою клітинкою (row, col) і, за потреби, її порожніми сусідами. */
export function revealCell(board, row, col) {
  const positionsToOpen = floodFillReveal(board, row, col, new Set());

  return board.map((cells, rowIndex) =>
    cells.map((cell, colIndex) =>
      positionsToOpen.has(toPositionKey(rowIndex, colIndex))
        ? { ...cell, state: CELL_STATE.OPENED }
        : cell,
    ),
  );
}


/** Ставить або знімає прапорець; відкриту клітинку не змінює. */
export function toggleFlag(board, row, col) {
  const cell = board[row][col];

  if (cell.state === CELL_STATE.OPENED) return board;

  const nextState =
    cell.state === CELL_STATE.FLAGGED ? CELL_STATE.CLOSED : CELL_STATE.FLAGGED;

  return updateCell(board, row, col, { state: nextState });
}
