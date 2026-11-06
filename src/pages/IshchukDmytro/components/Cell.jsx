import { memo } from 'react';
import styles from './Cell.module.css';

function Cell({ cell, row, col, onOpen, onFlag }) {
  const opened = cell.state === 'opened';
  const flagged = cell.state === 'flagged';
  const mine = opened && cell.type === 'mine';
  let content = '';

  if (flagged) {
    content = '⚑';
  } else if (mine) {
    content = '✹';
  } else if (opened) {
    content = cell.neighbourMines || '';
  }

  function handleContextMenu(event) {
    event.preventDefault();
    onFlag(row, col);
  }

  return (
    <button
      type="button"
      className={[
        styles.cell,
        opened && styles.open,
        flagged && styles.flag,
        mine && styles.mine,
      ].filter(Boolean).join(' ')}
      data-mines={opened && !mine ? cell.neighbourMines : undefined}
      aria-label={`Рядок ${row + 1}, стовпець ${col + 1}`}
      onClick={() => onOpen(row, col)}
      onContextMenu={handleContextMenu}
    >
      {content}
    </button>
  );
}

export default memo(Cell);
