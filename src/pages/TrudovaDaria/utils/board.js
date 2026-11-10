import { CELL_CONTENT, CELL_STATE, NEIGHBOUR_OFFSETS } from "../constants/game";

import { isInBounds } from "./checks";

function createCell() {
  return {
    content: CELL_CONTENT.EMPTY,
    state: CELL_STATE.CLOSED,
    adjacentMines: 0,
    isExploded: false,
  };
}

export function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => createCell()),
  );
}

function shufflePositions(positions) {
  const shuffled = [...positions];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

// Випадково обирає унікальні позиції, тому дві міни не потраплять в одну клітинку
export function placeMines(board, mineCount) {
  const allPositions = board.flatMap((boardRow, row) =>
    Array.from(boardRow.keys(), (col) => ({ row, col })),
  );
  const minePositions = new Set(
    shufflePositions(allPositions)
      .slice(0, mineCount)
      .map(({ row, col }) => `${row}-${col}`),
  );

  return board.map((boardRow, row) =>
    boardRow.map((cell, col) =>
      minePositions.has(`${row}-${col}`)
        ? { ...cell, content: CELL_CONTENT.MINE }
        : cell,
    ),
  );
}

export function getNeighbourPositions(board, row, col) {
  return NEIGHBOUR_OFFSETS.map(({ rowOffset, colOffset }) => ({
    row: row + rowOffset,
    col: col + colOffset,
  })).filter((neighbour) => isInBounds(board, neighbour.row, neighbour.col));
}

export function calculateAdjacency(board) {
  return board.map((boardRow, row) =>
    boardRow.map((cell, col) => {
      if (cell.content === CELL_CONTENT.MINE) {
        return cell;
      }

      const adjacentMines = getNeighbourPositions(board, row, col).filter(
        (neighbour) =>
          board[neighbour.row][neighbour.col].content === CELL_CONTENT.MINE,
      ).length;

      return { ...cell, adjacentMines };
    }),
  );
}

export function createBoard(rows, cols, mineCount) {
  return calculateAdjacency(placeMines(createEmptyBoard(rows, cols), mineCount));
}

export function setCellState(board, targetRow, targetCol, nextState) {
  return board.map((boardRow, row) =>
    boardRow.map((cell, col) =>
      row === targetRow && col === targetCol
        ? { ...cell, state: nextState }
        : cell,
    ),
  );
}

export function countFlags(board) {
  return board.flat().filter((cell) => cell.state === CELL_STATE.FLAGGED)
    .length;
}
