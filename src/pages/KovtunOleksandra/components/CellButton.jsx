import React from 'react';
import styles from '../Game.module.css';

export default function CellButton({ cell, rIdx, cIdx, gameState, clickedMine, activeCell, openCell, toggleFlag }) {
  let content = '';
  let cellClass = styles.cell;

  if (cell.state === 'opened') {
    cellClass += ` ${styles.open}`;
    if (cell.type === 'mine') {
      cellClass += ` ${styles.mine}`;
      if (clickedMine && clickedMine.row === rIdx && clickedMine.col === cIdx) {
        cellClass += ` ${styles.clicked}`;
      }
      content = '🐈‍'; 
    } else if (cell.neighborMines > 0) {
      cellClass += ` ${styles[`num-${cell.neighborMines}`]}`;
      content = cell.neighborMines;
    }
  } else if (cell.state === 'flagged') {
    content = '🐾'; 
  }

  const isFocused = activeCell && activeCell.row === rIdx && activeCell.col === cIdx;

  return (
    <button
      type="button"
      className={cellClass}
      onClick={() => openCell(rIdx, cIdx, true)}
      onContextMenu={(e) => toggleFlag(e, rIdx, cIdx)}
      onKeyDown={(e) => {
        if (e.key === 'f' || e.key === 'F') {
          toggleFlag(e, rIdx, cIdx);
        }
      }}
      ref={(node) => {
        if (isFocused && node) node.focus();
      }}
      aria-label={`Клітинка ${rIdx + 1}, ${cIdx + 1}`}
    >
      {content}
    </button>
  );
}