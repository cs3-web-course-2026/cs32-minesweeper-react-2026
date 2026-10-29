import { CELL_STATE, CELL_TYPE, GAME_STATUS } from '../constants/game';
import styles from './CellButton.module.css';

function CellButton({
  cell,
  row,
  col,
  gameStatus,
  isExploded,
  onClick,
  onContextMenu,
  onKeyDown,
}) {
  const isLoss = gameStatus === GAME_STATUS.LOSE;

  let cellClass = styles.cell;
  let content = '';
  let ariaLabel = '';
  let title = '';

  if (cell.state === CELL_STATE.CLOSED) {
    cellClass += ` ${styles.closed}`;
    ariaLabel = `Закрита клітинка, рядок ${row + 1}, колонка ${col + 1}`;
  } else if (cell.state === CELL_STATE.FLAGGED) {
    if (isLoss && cell.type !== CELL_TYPE.MINE) {
      cellClass += ` ${styles.flaggedWrong}`;
      content = '❌';
      title = 'Помилковий прапорець (без міни)';
      ariaLabel = `Помилковий прапорець, рядок ${row + 1}, колонка ${col + 1}`;
    } else {
      cellClass += ` ${styles.flagged}`;
      content = '🚩';
      title = 'Прапорець';
      ariaLabel = `Прапорець, рядок ${row + 1}, колонка ${col + 1}`;
    }
  } else if (cell.state === CELL_STATE.OPENED) {
    if (cell.type === CELL_TYPE.MINE) {
      if (isExploded) {
        cellClass += ` ${styles.mineExploded}`;
        content = '💥';
        title = 'Міна, на яку наступив гравець';
        ariaLabel = `Підірвана міна, рядок ${row + 1}, колонка ${col + 1}`;
      } else {
        cellClass += ` ${styles.mine}`;
        content = '💣';
        title = 'Відкрита міна';
        ariaLabel = `Міна, рядок ${row + 1}, колонка ${col + 1}`;
      }
    } else {
      cellClass += ` ${styles.open}`;
      if (cell.neighborMines > 0) {
        cellClass += ` ${styles[`num${cell.neighborMines}`]}`;
        content = cell.neighborMines;
        ariaLabel = `${cell.neighborMines} мін навколо, рядок ${row + 1}, колонка ${col + 1}`;
      } else {
        ariaLabel = `Порожня клітинка, рядок ${row + 1}, колонка ${col + 1}`;
      }
    }
  }

  return (
    <button
      type="button"
      className={cellClass}
      title={title}
      aria-label={ariaLabel}
      data-row={row}
      data-col={col}
      onClick={() => onClick(row, col)}
      onContextMenu={(event) => onContextMenu(event, row, col)}
      onKeyDown={(event) => onKeyDown(event, row, col)}
    >
      {content}
    </button>
  );
}

export default CellButton;
