import { memo } from 'react';

import {
  CELL_STATE,
  CELL_TYPE,
  FLAG_TRIGGER_KEYS,
} from '../constants/game';

import styles from './CellButton.module.css';

const NUMBER_CLASS_BY_COUNT = {
  1: styles.number1,
  2: styles.number2,
  3: styles.number3,
  4: styles.number4,
  5: styles.number5,
  6: styles.number6,
  7: styles.number7,
  8: styles.number8,
};

function getCellContent(cell) {
  if (cell.state === CELL_STATE.OPEN) {
    if (cell.type === CELL_TYPE.MINE) {
      return '💣';
    }

    return cell.neighborMines > 0 ? String(cell.neighborMines) : '';
  }

  if (cell.state === CELL_STATE.FLAGGED) {
    return '🚩';
  }

  return '';
}


function getCellStateDescription(cell, isExploded, isFalseFlag) {
  if (cell.state === CELL_STATE.OPEN) {
    if (cell.type === CELL_TYPE.MINE) {
      return isExploded ? 'підірвана міна' : 'відкрита міна';
    }

    if (cell.neighborMines > 0) {
      return `${cell.neighborMines} мін поруч`;
    }

    return 'порожня відкрита клітинка';
  }

  if (cell.state === CELL_STATE.FLAGGED) {
    return isFalseFlag ? 'помилковий прапорець' : 'прапорець';
  }

  return 'закрита клітинка';
}


function CellButton({
  cell,
  row,
  col,
  isExploded,
  isLost,
  onReveal,
  onFlag,
}) {
  const isFalseFlag =
    isLost &&
    cell.state === CELL_STATE.FLAGGED &&
    cell.type !== CELL_TYPE.MINE;

  const isOpen = cell.state === CELL_STATE.OPEN;
  const isMine = cell.type === CELL_TYPE.MINE;

  const cellClassName = [
    styles.cell,
    isOpen ? styles.open : '',
    isOpen && isMine ? styles.mine : '',
    isOpen && isMine && isExploded ? styles.exploded : '',
    isOpen && !isMine && cell.neighborMines > 0
      ? NUMBER_CLASS_BY_COUNT[cell.neighborMines]
      : '',
    cell.state === CELL_STATE.FLAGGED ? styles.flagged : '',
    isFalseFlag ? styles.falseFlag : '',
  ]
    .filter(Boolean)
    .join(' ');

  const stateDescription = getCellStateDescription(
    cell,
    isExploded,
    isFalseFlag,
  );
  const ariaLabel = `Рядок ${row + 1}, стовпець ${col + 1}, ${stateDescription}`;

  const handleClick = () => {
    onReveal(row, col);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    onFlag(row, col);
  };

  const handleKeyDown = (event) => {
    if (FLAG_TRIGGER_KEYS.has(event.key)) {
      event.preventDefault();
      onFlag(row, col);
    }
  };

  return (
    <button
      type="button"
      className={cellClassName}
      aria-label={ariaLabel}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
    >
      {getCellContent(cell)}
    </button>
  );
}

export default memo(CellButton);

