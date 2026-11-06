import { memo } from 'react';
import { CELL_STATE, CELL_TYPE } from '../constants';
import styles from './Cell.module.css';

function Cell({ cell, row, col, onOpen, onFlag }) {
  const opened = cell.state === CELL_STATE.OPENED;
  const flagged = cell.state === CELL_STATE.FLAGGED;
  const mine = opened && cell.type === CELL_TYPE.MINE;
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

  function handleKeyDown(event) {
    if (
      event.key.toLowerCase() === 'f' &&
      !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey
    ) {
      event.preventDefault();
      onFlag(row, col);
    }
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
      onKeyDown={handleKeyDown}
    >
      {content}
    </button>
  );
}

export default memo(Cell);
