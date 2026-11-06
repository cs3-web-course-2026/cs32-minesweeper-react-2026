import { memo } from 'react';

import {
  ARROW_KEY_DIRECTION,
  CELL_STATE,
  CELL_TYPE,
  FLAG_KEY,
  GAME_STATUS,
} from '../constants/game';
import { isGameOver } from '../utils/checks';

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


function CellButton({
  cell,
  row,
  col,
  status,
  isTabStop,
  onOpen,
  onFlag,
  onFocusCell,
  onMoveFocus,
}) {
  const { classNames, description, minesNearby } = getCellView(cell, status);

  function handleContextMenu(event) {
    event.preventDefault();
    onFlag(row, col);
  }

  function handleKeyDown(event) {
    const direction = ARROW_KEY_DIRECTION[event.key];

    if (direction) {
      const [directionalRow, directionalCol] = direction;

      event.preventDefault();
      onMoveFocus(row + directionalRow, col + directionalCol);

      return;
    }

    if (isFlagShortcut(event)) {
      onFlag(row, col);
    }
  }

  return (
    <button
      type="button"
      className={[styles.cell, ...classNames].join(' ')}
      tabIndex={isTabStop ? 0 : -1}
      data-mines={minesNearby}
      aria-label={`Row ${row + 1}, column ${col + 1}, ${description}`}
      aria-disabled={isGameOver(status)}
      onClick={() => onOpen(row, col)}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      onFocus={() => onFocusCell(row, col)}
    >
      {minesNearby}
    </button>
  );
}


export default memo(CellButton);
