import {
  CELL_LABEL,
  CELL_STATE,
  CELL_TYPE,
  CELL_VIEW,
  DISPLAY_DIGITS,
  DISPLAY_MAX_VALUE,
} from '../constants/game';


/** Формат табло: обмежує значення діапазоном 0…999 і доповнює нулями. */
export function formatDisplay(value) {
  const clampedValue = Math.max(0, Math.min(value, DISPLAY_MAX_VALUE));

  return String(clampedValue).padStart(DISPLAY_DIGITS, '0');
}


/** Визначає, як показати клітинку з урахуванням того, чи завершилась гра. */
export function getCellView(cell, isFinished) {
  const isMine = cell.type === CELL_TYPE.MINE;

  if (cell.state === CELL_STATE.FLAGGED) {
    if (!isFinished) return CELL_VIEW.FLAGGED;

    return isMine ? CELL_VIEW.FLAGGED_MINE : CELL_VIEW.WRONG_FLAG;
  }

  if (isMine && cell.state === CELL_STATE.OPENED) return CELL_VIEW.EXPLODED;
  if (isMine && isFinished) return CELL_VIEW.MINE;
  if (cell.state === CELL_STATE.CLOSED) return CELL_VIEW.CLOSED;

  return cell.neighborMines > 0 ? CELL_VIEW.NUMBER : CELL_VIEW.EMPTY;
}


export function formatCellLabel(row, col, cellView, neighborMines) {
  const description =
    cellView === CELL_VIEW.NUMBER
      ? `${neighborMines} мін поруч`
      : CELL_LABEL[cellView];

  return `Рядок ${row + 1}, стовпець ${col + 1}: ${description}`;
}
