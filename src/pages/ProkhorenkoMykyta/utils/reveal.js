import { CELL_STATE, CELL_TYPE } from '../constants/game';
import { getNeighbourPositions } from './board';


function cloneBoard(board) {
  return board.map((boardRow) => boardRow.map((cell) => ({ ...cell })));
}


function revealArea(board, row, col) {
  const cell = board[row][col];

  if (cell.state !== CELL_STATE.CLOSED || cell.type === CELL_TYPE.MINE) {
    return;
  }

  cell.state = CELL_STATE.OPENED;

  if (cell.neighborMines > 0) {
    return;
  }

  for (const position of getNeighbourPositions(board, row, col)) {
    revealArea(board, position.row, position.col);
  }
}


export function openCell(board, row, col) {
  const nextBoard = cloneBoard(board);
  const cell = nextBoard[row][col];

  if (cell.type === CELL_TYPE.MINE) {
    cell.state = CELL_STATE.OPENED;

    return nextBoard;
  }

  revealArea(nextBoard, row, col);

  return nextBoard;
}


export function toggleFlag(board, row, col) {
  const cell = board[row][col];
  const nextState =
    cell.state === CELL_STATE.FLAGGED ? CELL_STATE.CLOSED : CELL_STATE.FLAGGED;

  return board.map((boardRow, rowIndex) =>
    boardRow.map((boardCell, colIndex) =>
      rowIndex === row && colIndex === col
        ? { ...boardCell, state: nextState }
        : boardCell,
    ),
  );
}
