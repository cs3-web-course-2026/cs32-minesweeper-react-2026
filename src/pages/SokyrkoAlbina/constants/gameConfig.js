export const GAME_CONFIG = {
    rows: 8,
    cols: 8,
    minesCount: 10,
  };
  
  export const MAX_TIME = 999;
  export const MODAL_DELAY_MS = 300;
  
  export const STATUS = {
    PROCESS: 'process',
    WIN: 'win',
    LOSE: 'lose',
  };
  
  export const CELL_STATE = {
    CLOSED: 'closed',
    OPENED: 'opened',
    FLAGGED: 'flagged',
    EXPLODED: 'exploded',
  };
  
  export const ICONS = {
    MINE: '💣',
    FLAG: '🏴‍☠️',
  };
  
  export const START_BTN_ICONS = {
    [STATUS.PROCESS]: '🧭',
    [STATUS.WIN]: '😎',
    [STATUS.LOSE]: '😵',
  };
  
  export const DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];