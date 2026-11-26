export const CELL_TYPE = {
  EMPTY: 'empty',
  MINE: 'mine',
};

export const CELL_STATE = {
  CLOSED: 'closed',
  OPENED: 'opened',
  FLAGGED: 'flagged',
};

export const GAME_STATUS = {
  IDLE: 'idle',
  PROCESS: 'process',
  WIN: 'win',
  LOSE: 'lose',
};

export const CELL_VIEW = {
  CLOSED: 'closed',
  FLAGGED: 'flagged',
  EMPTY: 'empty',
  NUMBER: 'number',
  MINE: 'mine',
  EXPLODED: 'exploded',
  WRONG_FLAG: 'wrongFlag',
};

export const CELL_ICON = {
  FLAG: '🚩',
  MINE: '💣',
};

export const GAME_ACTION = {
  REVEAL_CELL: 'REVEAL_CELL',
  TOGGLE_FLAG: 'TOGGLE_FLAG',
  TICK: 'TICK',
  RESTART: 'RESTART',
};

export const DEFAULT_CONFIG = {
  rows: 10,
  cols: 10,
  minesCount: 15,
};

export const TIMER_INTERVAL_MS = 1000;

export const COUNTER_DIGITS = 3;

export const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
