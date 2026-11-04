export const ROWS = 9;
export const COLS = 9;
export const MINES_COUNT = 10;

export const GAME_STATUS = Object.freeze({
  PROCESS: 'process',
  WIN: 'win',
  LOSE: 'lose',
});

export const CELL_TYPE = Object.freeze({
  EMPTY: 'empty',
  MINE: 'mine',
});

export const CELL_STATE = Object.freeze({
  CLOSED: 'closed',
  OPENED: 'opened',
  FLAGGED: 'flagged',
});

export const DIRECTIONS = Object.freeze([
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
]);
