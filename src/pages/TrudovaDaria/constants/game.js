export const GAME_CONFIG = {
  ROWS: 10,
  COLS: 10,
  MINE_COUNT: 15,
};

export const CELL_STATE = {
  CLOSED: "closed",
  OPEN: "open",
  FLAGGED: "flagged",
};

export const CELL_CONTENT = {
  MINE: "mine",
  EMPTY: "empty",
};

export const GAME_STATUS = {
  IDLE: "idle",
  PLAYING: "playing",
  WON: "won",
  LOST: "lost",
};

export const ACTION_TYPE = {
  REVEAL_CELL: "REVEAL_CELL",
  TOGGLE_FLAG: "TOGGLE_FLAG",
  TOGGLE_FLAG_MODE: "TOGGLE_FLAG_MODE",
  RESTART: "RESTART",
};

export const NEIGHBOUR_OFFSETS = [
  { rowOffset: -1, colOffset: -1 },
  { rowOffset: -1, colOffset: 0 },
  { rowOffset: -1, colOffset: 1 },
  { rowOffset: 0, colOffset: -1 },
  { rowOffset: 0, colOffset: 1 },
  { rowOffset: 1, colOffset: -1 },
  { rowOffset: 1, colOffset: 0 },
  { rowOffset: 1, colOffset: 1 },
];

export const CELL_SYMBOL = {
  FLAG: "🚩",
  MINE: "💣",
};

export const TIMER_INTERVAL_MS = 1000;
export const TIMER_DIGITS = 3;

export const MESSAGES = {
  DEFAULT:
    "Відкрий клітинку, щоб почати гру. Правий клік — поставити прапорець.",
  FLAG_LIMIT:
    "Усі прапорці вже використані. Зніми один, щоб поставити інший.",
  LOST: "Гру завершено: ти натрапив(ла) на міну ☹️. Спробуй ще раз!",
};
