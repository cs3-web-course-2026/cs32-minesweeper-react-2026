import { CELL_STATE, CELL_TYPE } from '../utils/gameLogic';

import styles from './Cell.module.css';

function Cell({
  cell,
  row,
  col,
  onOpen,
  onFlag,
  exploded,
  disabled,
}) {
  const isOpen = cell.state === CELL_STATE.OPENED;
  const isFlagged = cell.state === CELL_STATE.FLAGGED;

  const classNames = [
    styles.cell,
    isOpen && styles.open,
    isFlagged && styles.flagged,
    cell.type === CELL_TYPE.MINE && isOpen && styles.mine,
    exploded && styles.exploded,
    cell.isWrongFlag && styles.wrongFlag,
  ]
    .filter(Boolean)
    .join(' ');

  let content = '';

  if (isOpen) {
    if (cell.type === CELL_TYPE.MINE) {
      content = exploded ? '💥' : '💣';
    } else if (cell.neighborMines > 0) {
      content = cell.neighborMines;
    }
  } else if (isFlagged) {
    content = cell.isWrongFlag ? '❌' : '🚩';
  }

  // Describe the cell state for screen readers
  let stateLabel = 'closed';
  if (isFlagged) {
    stateLabel = cell.isWrongFlag ? 'incorrect flag' : 'flagged';
  } else if (isOpen) {
    if (cell.type === CELL_TYPE.MINE) {
      stateLabel = exploded ? 'exploded mine' : 'mine';
    } else {
      stateLabel = cell.neighborMines > 0 ? `${cell.neighborMines} adjacent mines` : 'empty';
    }
  }

  return (
    <button
      type="button"
      className={classNames}
      data-value={
        isOpen && cell.neighborMines > 0
          ? cell.neighborMines
          : undefined
      }
      onClick={() => {
        if (!isOpen) onOpen(row, col);
      }}
      onContextMenu={event => {
        event.preventDefault();
        if (!isOpen) onFlag(row, col);
      }}
      disabled={disabled}
      aria-label={`Row ${row + 1}, column ${col + 1}, ${stateLabel}`}
    >
      {content}
    </button>
  );
}

export default Cell;
