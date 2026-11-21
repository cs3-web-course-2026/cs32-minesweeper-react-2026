export const CELL_TYPE = {
  EMPTY: 'empty',
  MINE: 'mine',
};

export const CELL_STATE = {
  CLOSED: 'closed',
  OPEN: 'open',
  FLAGGED: 'flagged',
};

export const GAME_STATUS = {
  IDLE: 'idle',
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
};

export const GAME_ACTION = {
  REVEAL_CELL: 'REVEAL_CELL',
  TOGGLE_FLAG: 'TOGGLE_FLAG',
  RESTART: 'RESTART',
};

export const GAME_CONFIG = {
  ROWS: 16,
  COLS: 16,
  MINES_COUNT: 40,
};

export const COUNTER_LIMITS = {
  MIN: -99,
  MAX: 999,
  PAD_LENGTH: 3,
  NEGATIVE_PAD_LENGTH: 2,
};

export const TIMER_INTERVAL_MS = 1000;

export const FLAG_TRIGGER_KEYS = new Set(['f', 'F', 'а', 'А']);

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

export const STATUS_EMOJI = {
  [GAME_STATUS.IDLE]: '🙂',
  [GAME_STATUS.PLAYING]: '🙂',
  [GAME_STATUS.WON]: '😎',
  [GAME_STATUS.LOST]: '😵',
};

