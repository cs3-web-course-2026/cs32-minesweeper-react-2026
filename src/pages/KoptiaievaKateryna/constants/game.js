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
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
};

export const GAME_ACTION = {
  RESTART: 'restart',
  OPEN_CELL: 'openCell',
  TOGGLE_FLAG: 'toggleFlag',
  TICK: 'tick',
};

export const DEFAULT_CONFIG = {
  rows: 10,
  cols: 10,
  minesCount: 15,
};

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

const ACTIVE_GAME_FACE = '😈';
const FLAG_HINT = 'Right-click or press F to place a flag.';

export const RESTART_BUTTON_FACE = {
  [GAME_STATUS.IDLE]: ACTIVE_GAME_FACE,
  [GAME_STATUS.PLAYING]: ACTIVE_GAME_FACE,
  [GAME_STATUS.WON]: '😎',
  [GAME_STATUS.LOST]: '😵',
};

export const GAME_MESSAGE = {
  [GAME_STATUS.IDLE]: FLAG_HINT,
  [GAME_STATUS.PLAYING]: FLAG_HINT,
  [GAME_STATUS.WON]: 'You win! Press 😎 to play again.',
  [GAME_STATUS.LOST]: 'Game over — press 😵 to play again.',
};

export const TIMER_INTERVAL_MS = 1000;
export const SECONDS_PER_MINUTE = 60;
export const FLAG_KEY = 'f';
