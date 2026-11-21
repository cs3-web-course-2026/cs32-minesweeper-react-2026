import { CELL_STATE, CELL_TYPE } from '../constants/game';

export function countPlacedFlags(board) {
  let flagCount = 0;

  for (const boardRow of board) {
    for (const cell of boardRow) {
      if (cell.state === CELL_STATE.FLAGGED) {
        flagCount += 1;
      }
    }
  }

  return flagCount;
}


export function checkWinCondition(board) {
  let hasSafeCell = false;

  for (const boardRow of board) {
    for (const cell of boardRow) {
      if (cell.type === CELL_TYPE.EMPTY) {
        hasSafeCell = true;

        if (cell.state !== CELL_STATE.OPEN) {
          return false;
        }
      }
    }
  }

  return hasSafeCell;
}

