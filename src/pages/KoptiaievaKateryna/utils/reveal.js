import { CELL_STATE, CELL_TYPE } from '../constants/game';
import { getNeighbourPositions } from './board';


// Opens the cell and flood-fills through cells with no neighbouring mines.
export function revealCell(board, row, col) {
  const nextBoard = board.map((rowCells) => [...rowCells]);
  const pendingPositions = [[row, col]];

  while (pendingPositions.length > 0) {
    const [currentRow, currentCol] = pendingPositions.pop();
    const cell = nextBoard[currentRow][currentCol];

    if (cell.state !== CELL_STATE.CLOSED) {
      continue;
    }

    nextBoard[currentRow][currentCol] = { ...cell, state: CELL_STATE.OPENED };

    if (cell.type === CELL_TYPE.EMPTY && cell.neighbourMines === 0) {
      pendingPositions.push(
        ...getNeighbourPositions(nextBoard, currentRow, currentCol),
      );
    }
  }

  return nextBoard;
}


export function toggleFlag(board, row, col) {
  const cell = board[row][col];
  const state =
    cell.state === CELL_STATE.FLAGGED ? CELL_STATE.CLOSED : CELL_STATE.FLAGGED;

  return board.map((rowCells, currentRow) =>
    currentRow === row
      ? rowCells.map((rowCell, currentCol) =>
          currentCol === col ? { ...rowCell, state } : rowCell,
        )
      : rowCells,
  );
}


export function flagAllMines(board) {
  return board.map((rowCells) =>
    rowCells.map((cell) =>
      cell.type === CELL_TYPE.MINE
        ? { ...cell, state: CELL_STATE.FLAGGED }
        : cell,
    ),
  );
}
