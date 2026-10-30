import { CELL_STATE, CELL_TYPE, GAME_STATUS } from '../constants/game';


/** Перемога: усі клітинки, крім мін, відкриті. */
export function checkWinCondition(board) {
  return board
    .flat()
    .every(
      (cell) =>
        cell.type === CELL_TYPE.MINE || cell.state === CELL_STATE.OPENED,
    );
}


export function countFlaggedCells(board) {
  return board.flat().filter((cell) => cell.state === CELL_STATE.FLAGGED)
    .length;
}


/** Повертає нове поле, де на всіх мінах стоять прапорці (після перемоги). */
export function flagAllMines(board) {
  return board.map((cells) =>
    cells.map((cell) =>
      cell.type === CELL_TYPE.MINE
        ? { ...cell, state: CELL_STATE.FLAGGED }
        : cell,
    ),
  );
}


export function isGameOver(status) {
  return status === GAME_STATUS.WON || status === GAME_STATUS.LOST;
}
