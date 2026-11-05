import React from 'react';
import styles from './Cell.module.css';
import { CELL_STATE, CELL_TYPE } from '../../constants';

const Cell = ({ data, row, col, onClick, onContextMenu }) => {
  const { state, type, neighborMines, exploded } = data;
  const isOpened = state === CELL_STATE.OPENED;
  const isFlagged = state === CELL_STATE.FLAGGED || state === CELL_STATE.WRONG_FLAG;

  let content = '';
  let cssClass = styles.cell;
  let stateText = 'closed';

  if (isOpened) {
    cssClass += ` ${styles.open}`;
    if (type === CELL_TYPE.MINE) {
      content = '💣';
      stateText = exploded ? 'mine exploded' : 'mine';
      cssClass += ` ${styles.mine}`;
      if (exploded) cssClass += ` ${styles.exploded}`;
    } else {
      stateText = neighborMines > 0 ? `${neighborMines} mines nearby` : 'empty';
      if (neighborMines > 0) {
        content = neighborMines;
        cssClass += ` ${styles[`num${neighborMines}`]}`;
      }
    }
  } else if (isFlagged) {
    content = '🚩';
    stateText = state === CELL_STATE.WRONG_FLAG ? 'wrong flag' : 'flagged';
    cssClass += ` ${styles.flag}`;
    if (state === CELL_STATE.WRONG_FLAG) cssClass += ` ${styles.wrongFlag}`;
  }

  const ariaLabel = `Row ${row}, Column ${col}, ${stateText}`;

  return (
    <button
      type="button"
      className={cssClass}
      onClick={onClick}
      onContextMenu={onContextMenu}
      aria-disabled={isOpened}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
};

export default Cell;