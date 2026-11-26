import { CELL_ICON, CELL_STATE, CELL_TYPE, CELL_VIEW } from '../constants/game';


function getMinesWord(count) {
  if (count === 1) {
    return 'міна';
  }

  if (count >= 2 && count <= 4) {
    return 'міни';
  }

  return 'мін';
}


export function getCellView(cell, isGameLost) {
  const isMine = cell.type === CELL_TYPE.MINE;

  if (cell.state === CELL_STATE.OPENED && isMine) {
    return {
      view: CELL_VIEW.EXPLODED,
      text: CELL_ICON.MINE,
      description: 'підірвана міна',
    };
  }

  if (cell.state === CELL_STATE.OPENED && cell.neighborMines > 0) {
    return {
      view: CELL_VIEW.NUMBER,
      text: String(cell.neighborMines),
      description: `відкрита, ${cell.neighborMines} ${getMinesWord(cell.neighborMines)} поруч`,
    };
  }

  if (cell.state === CELL_STATE.OPENED) {
    return {
      view: CELL_VIEW.EMPTY,
      text: '',
      description: 'відкрита, порожня',
    };
  }

  if (isGameLost && isMine && cell.state === CELL_STATE.CLOSED) {
    return {
      view: CELL_VIEW.MINE,
      text: CELL_ICON.MINE,
      description: 'міна',
    };
  }

  if (isGameLost && !isMine && cell.state === CELL_STATE.FLAGGED) {
    return {
      view: CELL_VIEW.WRONG_FLAG,
      text: CELL_ICON.FLAG,
      description: 'помилковий прапорець',
    };
  }

  if (cell.state === CELL_STATE.FLAGGED) {
    return {
      view: CELL_VIEW.FLAGGED,
      text: CELL_ICON.FLAG,
      description: 'прапорець',
    };
  }

  return {
    view: CELL_VIEW.CLOSED,
    text: '',
    description: 'закрита',
  };
}
