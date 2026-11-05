import { CELL_STATE, CELL_TYPE, GAME_STATUS } from '../constants/gameConstants';
import styles from '../KhomiakovOleksii.module.css';

export default function Cell({
  cellData,
  gameStatus,
  onOpen,
  onToggleFlag,
}) {
  const { row, col, type, neighborMines, state, exploded } = cellData;

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (gameStatus !== GAME_STATUS.PROCESS) return;
    onToggleFlag(row, col);
  };

  const handleKeyDown = (e) => {
    if (gameStatus !== GAME_STATUS.PROCESS) return;
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      onToggleFlag(row, col);
    }
  };

  let content = '';
  let className = styles.cell;
  let ariaLabel = `Клітинка ряд ${row + 1} колонка ${col + 1}`;

  if (state === CELL_STATE.FLAGGED) {
    content = '🚩';
    className = `${styles.cell} ${styles.cellFlagged}`;
    ariaLabel += ', містить прапорець';
  } else if (state === CELL_STATE.OPENED) {
    className = `${styles.cell} ${styles.cellOpened}`;
    
    if (type === CELL_TYPE.MINE) {
      content = '💣';
      ariaLabel += ', міна';
      if (exploded) {
        className += ` ${styles.cellExploded}`;
        ariaLabel += ' вибухнула';
      }
    } else if (neighborMines > 0) {
      content = neighborMines;
      className += ` ${styles[`number${neighborMines}`] || ''}`;
      ariaLabel += `, поруч ${neighborMines} мін`;
    } else {
      ariaLabel += ', порожня';
    }
  } else {
    if (gameStatus === GAME_STATUS.LOSE && type === CELL_TYPE.MINE) {
      content = '💣';
      className = `${styles.cell} ${styles.cellOpened}`;
    }
  }

  if (
    gameStatus === GAME_STATUS.LOSE &&
    state === CELL_STATE.FLAGGED &&
    type !== CELL_TYPE.MINE
  ) {
    content = '❌';
    className = `${styles.cell} ${styles.cellOpened}`;
  }

  const isInteractive =
    gameStatus === GAME_STATUS.PROCESS && state !== CELL_STATE.OPENED;

  return (
    <button
      type="button"
      className={className}
      disabled={!isInteractive}
      onClick={() => onOpen(row, col)}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-pressed={state === CELL_STATE.OPENED}
    >
      {content}
    </button>
  );
}