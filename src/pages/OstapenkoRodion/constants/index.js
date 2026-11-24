export const GAME_CONFIG = {
  ROWS: 10,
  COLS: 10,
  MINES_COUNT: 15,
};

export const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1]
];

export const TIMER_INTERVAL = 1000;

export const CELL_TYPE = {
  EMPTY: 'empty',
  MINE: 'mine'
};

export const CELL_STATE = {
  CLOSED: 'closed',
  OPENED: 'opened',
  FLAGGED: 'flagged',
  WRONG_FLAG: 'wrong-flag'
};

export const GAME_STATUS = {
  PROCESS: 'process',
  WIN: 'win',
  LOSE: 'lose'
};