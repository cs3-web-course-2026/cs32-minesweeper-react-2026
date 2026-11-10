import { CELL_CONTENT, CELL_STATE } from "../constants/game";

import { getNeighbourPositions } from "./board";

function copyBoard(board) {
  return board.map((boardRow) => boardRow.map((cell) => ({ ...cell })));
}

// Працює лише з локальною копією поля, яку створив revealCell
function floodFillReveal(boardCopy, startRow, startCol) {
  const pendingPositions = [{ row: startRow, col: startCol }];

  while (pendingPositions.length > 0) {
    const { row, col } = pendingPositions.pop();
    const cell = boardCopy[row][col];

    if (cell.state !== CELL_STATE.CLOSED) {
      continue;
    }

    cell.state = CELL_STATE.OPEN;

    if (cell.adjacentMines === 0) {
      pendingPositions.push(...getNeighbourPositions(boardCopy, row, col));
    }
  }
}

export function revealCell(board, row, col) {
  if (board[row][col].state !== CELL_STATE.CLOSED) {
    return board;
  }

  const boardCopy = copyBoard(board);
  const targetCell = boardCopy[row][col];

  if (targetCell.content === CELL_CONTENT.MINE) {
    targetCell.state = CELL_STATE.OPEN;
    targetCell.isExploded = true;

    return boardCopy;
  }

  floodFillReveal(boardCopy, row, col);

  return boardCopy;
}

// Після поразки показуємо всі міни, крім тих, що позначені прапорцем
export function revealAllMines(board) {
  return board.map((boardRow) =>
    boardRow.map((cell) =>
      cell.content === CELL_CONTENT.MINE && cell.state === CELL_STATE.CLOSED
        ? { ...cell, state: CELL_STATE.OPEN }
        : cell,
    ),
  );
}