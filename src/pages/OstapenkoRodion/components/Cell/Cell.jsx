import React from 'react';
import styles from './Cell.module.css';

const Cell = ({ data, onClick, onContextMenu }) => {
  const { state, type, neighborMines, exploded } = data;
  const isOpened = state === 'opened';
  const isFlagged = state === 'flagged';

  let content = '';
  let cssClass = styles.cell;

  if (isOpened) {
    cssClass += ` ${styles.open}`;
    if (type === 'mine') {
      content = '💣';
      cssClass += ` ${styles.mine}`;
      if (exploded) cssClass += ` ${styles.exploded}`;
    } else if (neighborMines > 0) {
      content = neighborMines;
      cssClass += ` ${styles[`num${neighborMines}`]}`;
    }
  } else if (isFlagged) {
    content = '🚩';
    cssClass += ` ${styles.flag}`;
    if (state === 'wrong-flag') cssClass += ` ${styles.wrongFlag}`;
  }

  return (
    <button
      type="button"
      className={cssClass}
      onClick={onClick}
      onContextMenu={onContextMenu}
      disabled={isOpened}
    >
      {content}
    </button>
  );
};

export default Cell;