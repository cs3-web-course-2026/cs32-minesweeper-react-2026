import { memo } from 'react';

import {
  CELL_STATE,
  CELL_TYPE,
  FLAG_KEY,
  GAME_STATUS,
} from '../constants/game';

import styles from './CellButton.module.css';


function getCellView(cell, status) {
  const isMine = cell.type === CELL_TYPE.MINE;
  const isGameLost = status === GAME_STATUS.LOST;

  if (cell.state === CELL_STATE.OPENED && isMine) {
    return {
      classNames: [styles.mine, styles.exploded],
      description: 'exploded mine',
    };
  }

  if (cell.state === CELL_STATE.OPENED && cell.neighbourMines === 0) {
    return { classNames: [styles.opened], description: 'empty' };
  }

  if (cell.state === CELL_STATE.OPENED) {
    const mineWord = cell.neighbourMines === 1 ? 'mine' : 'mines';

    return {
      classNames: [styles.opened],
      description: `${cell.neighbourMines} adjacent ${mineWord}`,
      minesNearby: cell.neighbourMines,
    };
  }

  if (cell.state === CELL_STATE.FLAGGED && isGameLost && !isMine) {
    return {
      classNames: [styles.flagged, styles.wrongFlag],
      description: 'wrong flag',
    };
  }

  if (cell.state === CELL_STATE.FLAGGED) {
    return { classNames: [styles.flagged], description: 'flagged' };
  }

  if (isGameLost && isMine) {
    return { classNames: [styles.mine], description: 'mine' };
  }

  return { classNames: [], description: 'closed' };
}


function isFlagShortcut(event) {
  return (
    event.key.toLowerCase() === FLAG_KEY &&
    !event.repeat &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey
  );
}


function CellButton({ cell, row, col, status, onOpen, onFlag }) {
  const { classNames, description, minesNearby } = getCellView(cell, status);

  function handleContextMenu(event) {
    event.preventDefault();
    onFlag(row, col);
  }

  function handleKeyDown(event) {
    if (isFlagShortcut(event)) {
      onFlag(row, col);
    }
  }

  return (
    <button
      type="button"
      className={[styles.cell, ...classNames].join(' ')}
      data-mines={minesNearby}
      aria-label={`Row ${row + 1}, column ${col + 1}, ${description}`}
      onClick={() => onOpen(row, col)}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
    >
      {minesNearby}
    </button>
  );
}


export default memo(CellButton);
