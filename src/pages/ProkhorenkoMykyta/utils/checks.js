import { CELL_STATE, CELL_TYPE } from '../constants/game';


export function isWinCondition(board) {
  return board.every((boardRow) =>
    boardRow.every(
      (cell) =>
        cell.type === CELL_TYPE.MINE || cell.state === CELL_STATE.OPENED,
    ),
  );
}


export function countFlags(board) {
  return board
    .flat()
    .filter((cell) => cell.state === CELL_STATE.FLAGGED).length;
}


export function getFlagsLeft(board, minesCount) {
  return minesCount - countFlags(board);
}
