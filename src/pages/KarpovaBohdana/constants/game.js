export const CELL_TYPE = {
  EMPTY: 'empty',
  MINE: 'mine',
};

export const CELL_STATE = {
  CLOSED: 'closed',
  OPENED: 'opened',
  FLAGGED: 'flagged',
};

/** IDLE — поле створене, але ще жодної клітинки не відкрито (таймер стоїть). */
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

export const TIMER_INTERVAL_MS = 1000;

/** Табло в шапці показує рівно три цифри: 0 → "000", 42 → "042". */
export const DISPLAY_DIGITS = 3;
export const DISPLAY_MAX_VALUE = 10 ** DISPLAY_DIGITS - 1;

/** Зсуви до восьми сусідніх клітинок у форматі [Δрядок, Δстовпець]. */
export const NEIGHBOUR_OFFSETS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

/** Як клітинка має виглядати після врахування стану гри. */
export const CELL_VIEW = {
  CLOSED: 'closed',
  EMPTY: 'empty',
  NUMBER: 'number',
  FLAGGED: 'flagged',
  FLAGGED_MINE: 'flaggedMine',
  WRONG_FLAG: 'wrongFlag',
  MINE: 'mine',
  EXPLODED: 'exploded',
};

export const CELL_ICON = {
  [CELL_VIEW.FLAGGED]: '🚩',
  [CELL_VIEW.FLAGGED_MINE]: '🚩',
  [CELL_VIEW.WRONG_FLAG]: '🚩',
  [CELL_VIEW.MINE]: '💣',
  [CELL_VIEW.EXPLODED]: '💥',
};

export const CELL_LABEL = {
  [CELL_VIEW.CLOSED]: 'закрита',
  [CELL_VIEW.EMPTY]: 'порожня',
  [CELL_VIEW.FLAGGED]: 'прапорець',
  [CELL_VIEW.FLAGGED_MINE]: 'прапорець на міні',
  [CELL_VIEW.WRONG_FLAG]: 'помилковий прапорець',
  [CELL_VIEW.MINE]: 'міна',
  [CELL_VIEW.EXPLODED]: 'міна, що вибухнула',
};

export const STATUS_MESSAGE = {
  [GAME_STATUS.IDLE]: 'Відкрийте будь-яку клітинку, щоб почати',
  [GAME_STATUS.PLAYING]: 'Обережно, під полем ховаються міни…',
  [GAME_STATUS.WON]: 'Перемога! Усі безпечні клітинки відкрито',
  [GAME_STATUS.LOST]: 'Бабах! Гру завершено',
};

export const RESTART_LABEL = {
  NEW_GAME: 'Почати нову гру',
  PLAY_AGAIN: 'Зіграти ще раз',
};
