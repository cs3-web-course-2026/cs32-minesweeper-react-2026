import { CELL_CONTENT, CELL_STATE, GAME_STATUS } from "../constants/game";

export function isInBounds(board, row, col) {
  return row >= 0 && row < board.length && col >= 0 && col < board[0].length;
}

export function isGameOver(gameStatus) {
  return gameStatus === GAME_STATUS.WON || gameStatus === GAME_STATUS.LOST;
}

export function checkWinCondition(board) {
  return board
    .flat()
    .every(
      (cell) =>
        cell.content === CELL_CONTENT.MINE || cell.state === CELL_STATE.OPEN,
    );
}

export function checkLossCondition(board) {
  return board
    .flat()
    .some(
      (cell) =>
        cell.content === CELL_CONTENT.MINE && cell.state === CELL_STATE.OPEN,
    );
}