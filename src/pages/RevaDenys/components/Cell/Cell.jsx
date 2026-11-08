import React from 'react';
import styles from './Cell.module.css';

export const Cell = ({
  cell,
  row,
  col,
  gameStatus,
  onClick,
  onContextMenu,
}) => {
  const getCellClasses = () => {
    const classes = [styles.vCell];

    if (gameStatus === 'lose' && cell.type === 'mine') {
      classes.push(styles.vCellRevealed, styles.vCellTrap);
      if (cell.state === 'opened') classes.push(styles.vCellExploded);
    } else if (
      gameStatus === 'lose' &&
      cell.state === 'flagged' &&
      cell.type === 'empty'
    ) {
      classes.push(styles.vCellFlaggedWrong);
    } else if (cell.state === 'flagged') {
      classes.push(styles.vCellFlagged);
    } else if (cell.state === 'opened') {
      classes.push(styles.vCellRevealed);
      if (cell.type === 'mine') {
        classes.push(styles.vCellTrap, styles.vCellExploded);
      } else if (cell.neighborMines > 0) {
        classes.push(styles[`vCell${cell.neighborMines}`]);
      }
    }
    return classes.join(' ');
  };

  const getContent = () => {
    if (
      cell.state === 'opened' &&
      cell.type === 'empty' &&
      cell.neighborMines > 0
    ) {
      return cell.neighborMines;
    }
    return '';
  };

  // Generate accessible description for screen readers
  const getAriaLabel = () => {
    const coords = `Рядок ${row + 1}, колонка ${col + 1}`;

    if (cell.state === 'flagged') {
      if (gameStatus === 'lose' && cell.type === 'empty') {
        return `${coords}: позначено прапорцем неправильно`;
      }
      return `${coords}: позначено прапорцем`;
    }

    if (
      cell.state === 'opened' ||
      (gameStatus === 'lose' && cell.type === 'mine')
    ) {
      if (cell.type === 'mine') {
        return `${coords}: міна`;
      }
      if (cell.neighborMines > 0) {
        return `${coords}: відкрито, ${cell.neighborMines} мін поруч`;
      }
      return `${coords}: відкрито, порожня клітинка`;
    }

    return `${coords}: закрито`;
  };

  return (
    <button
      type="button"
      className={getCellClasses()}
      onClick={() => onClick(row, col)}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(row, col);
      }}
      role="gridcell"
      aria-rowindex={row + 1}
      aria-colindex={col + 1}
      aria-label={getAriaLabel()}
    >
      {getContent()}
    </button>
  );
};
