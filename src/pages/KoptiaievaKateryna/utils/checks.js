import { CELL_STATE, CELL_TYPE, GAME_STATUS } from '../constants/game';


export function countFlagsLeft(board, minesCount) {
  const flaggedCount = board
    .flat()
    .filter((cell) => cell.state === CELL_STATE.FLAGGED).length;

  return minesCount - flaggedCount;
}


export function hasOpenedCells(board) {
  return board.flat().some((cell) => cell.state === CELL_STATE.OPENED);
}


export function isEverySafeCellOpened(board) {
  return board
    .flat()
    .every(
      (cell) =>
        cell.type === CELL_TYPE.MINE || cell.state === CELL_STATE.OPENED,
    );
}


export function isGameOver(status) {
  return status === GAME_STATUS.WON || status === GAME_STATUS.LOST;
}

