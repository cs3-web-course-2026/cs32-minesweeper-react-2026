import { memo } from 'react';

import { CELL_VIEW } from '../constants/game';
import { getCellView } from '../utils/cellView';
import styles from './CellButton.module.css';

const VIEW_CLASS = {
  [CELL_VIEW.CLOSED]: styles.closed,
  [CELL_VIEW.FLAGGED]: styles.flagged,
  [CELL_VIEW.EMPTY]: styles.opened,
  [CELL_VIEW.NUMBER]: styles.opened,
  [CELL_VIEW.MINE]: styles.mine,
  [CELL_VIEW.EXPLODED]: styles.exploded,
  [CELL_VIEW.WRONG_FLAG]: styles.wrongFlag,
};


function CellButton({ cell, row, col, isGameLost, isDisabled, onReveal, onFlag }) {
  const cellView = getCellView(cell, isGameLost);
  const className = [
    styles.cell,
    VIEW_CLASS[cellView.view],
    cellView.view === CELL_VIEW.NUMBER ? styles[`number${cell.neighborMines}`] : '',
    isDisabled ? styles.finished : '',
  ]
    .filter(Boolean)
    .join(' ');

  function handleClick() {
    onReveal(row, col);
  }

  function handleContextMenu(event) {
    event.preventDefault();
    onFlag(row, col);
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={`Рядок ${row + 1}, стовпець ${col + 1}, ${cellView.description}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {cellView.text}
    </button>
  );
}

export default memo(CellButton);
