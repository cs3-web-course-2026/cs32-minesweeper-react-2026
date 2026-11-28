import { CELL_STATE, CELL_TYPE } from '../constants/game';
import { getNeighbors, isInBounds } from './board';
import { countPlacedFlags } from './checks';

export function revealCell(board, targetRow, targetCol) {
  const rows = board.length;
  const cols = rows > 0 ? board[0].length : 0;

  if (!isInBounds(targetRow, targetCol, rows, cols)) {
    return board;
  }

  const startCell = board[targetRow][targetCol];

  if (
    startCell.state === CELL_STATE.OPEN ||
    startCell.state === CELL_STATE.FLAGGED
  ) {
    return board;
  }

  const cellsToOpen = new Set();
  const queue = [[targetRow, targetCol]];
  let queueIndex = 0;

  cellsToOpen.add(`${targetRow}-${targetCol}`);

  while (queueIndex < queue.length) {
    const [currentRow, currentCol] = queue[queueIndex];
    queueIndex += 1;

    const currentCell = board[currentRow][currentCol];

    if (
      currentCell.type === CELL_TYPE.EMPTY &&
      currentCell.neighborMines === 0
    ) {
      const neighbors = getNeighbors(currentRow, currentCol, rows, cols);

      for (const [neighborRow, neighborCol] of neighbors) {
        const neighborKey = `${neighborRow}-${neighborCol}`;
        const neighborCell = board[neighborRow][neighborCol];

        if (
          !cellsToOpen.has(neighborKey) &&
          neighborCell.state === CELL_STATE.CLOSED &&
          neighborCell.type !== CELL_TYPE.MINE
        ) {
          cellsToOpen.add(neighborKey);
          queue.push([neighborRow, neighborCol]);
        }
      }
    }
  }

  return board.map((boardRow, row) =>
    boardRow.map((cell, col) => {
      if (cellsToOpen.has(`${row}-${col}`)) {
        return { ...cell, state: CELL_STATE.OPEN };
      }

      return cell;
    }),
  );
}


export function toggleCellFlag(board, targetRow, targetCol, maxFlags) {
  const rows = board.length;
  const cols = rows > 0 ? board[0].length : 0;

  if (!isInBounds(targetRow, targetCol, rows, cols)) {
    return board;
  }

  const targetCell = board[targetRow][targetCol];

  if (targetCell.state === CELL_STATE.OPEN) {
    return board;
  }

  if (
    targetCell.state === CELL_STATE.CLOSED &&
    countPlacedFlags(board) >= maxFlags
  ) {
    return board;
  }

  const nextState =
    targetCell.state === CELL_STATE.FLAGGED
      ? CELL_STATE.CLOSED
      : CELL_STATE.FLAGGED;

  return board.map((boardRow, row) =>
    boardRow.map((cell, col) => {
      if (row === targetRow && col === targetCol) {
        return { ...cell, state: nextState };
      }

      return cell;
    }),
  );
}


export function revealAllMines(board, explodedRow, explodedCol) {
  return board.map((boardRow, row) =>
    boardRow.map((cell, col) => {
      if (row === explodedRow && col === explodedCol) {
        return { ...cell, state: CELL_STATE.OPEN };
      }

      if (cell.type === CELL_TYPE.MINE && cell.state === CELL_STATE.CLOSED) {
        return { ...cell, state: CELL_STATE.OPEN };
      }

      return cell;
    }),
  );
}


export function flagRemainingMines(board) {
  return board.map((boardRow) =>
    boardRow.map((cell) => {
      if (cell.type === CELL_TYPE.MINE && cell.state !== CELL_STATE.FLAGGED) {
        return { ...cell, state: CELL_STATE.FLAGGED };
      }

      return cell;
    }),
  );
}

