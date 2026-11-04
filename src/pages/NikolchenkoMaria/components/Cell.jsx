import styles from '../Game.module.css';
import { GAME_STATUS } from '../utils/constants';

function Cell({
  cell,
  row,
  col,
  onOpen,
  onFlag,
  disabled = false,
  status,
  isExploded = false,
}) {
  const isOpened = cell.state === 'opened';
  const isFlagged = cell.state === 'flagged';
  const isMine = cell.type === 'mine';
  const isLost = status === GAME_STATUS.LOSE;

  const isWrongFlag = isLost && isFlagged && !isMine;
  const showMine = isMine && (isOpened || (isLost && !isFlagged));

  let content = '';

  if (isWrongFlag) {
    content = '❌';
  } else if (isFlagged) {
    content = '🚩';
  } else if (showMine) {
    content = '💣';
  } else if (isOpened && cell.neighborMines > 0) {
    content = cell.neighborMines;
  }


  let cellDescription = ', закрита';

  if (isWrongFlag) {
    cellDescription = ', неправильний прапорець';
  } else if (isFlagged) {
    cellDescription = ', прапорець';
  } else if (showMine) {
    cellDescription = ', міна';
  } else if (isOpened && cell.neighborMines > 0) {
    cellDescription = `, відкрита, мін поруч: ${cell.neighborMines}`;
  } else if (isOpened) {
    cellDescription = ', відкрита, мін поруч немає';
  }


  function handleContextMenu(event) {
    event.preventDefault();

    if (!disabled) {
      onFlag(row, col);
    }
  }

  return (
    <button
      type="button"
      className={[
        styles.cell,
        isOpened ? styles.cellOpened : '',
        !isOpened && !isFlagged ? styles.cellClosed : '',
        isFlagged ? styles.cellFlagged : '',
        showMine && !isExploded ? styles.cellMine : '',
        isExploded ? styles.cellExploded : '',
        isWrongFlag ? styles.cellWrongFlag : '',
        isOpened && !isMine && cell.neighborMines > 0
          ? styles[`cell${cell.neighborMines}`]
          : '',
      ].filter(Boolean).join(' ')}
      onClick={() => onOpen(row, col)}
      onContextMenu={handleContextMenu}
      disabled={disabled || isOpened}
      aria-label={`Клітинка ${row + 1}, ${col + 1}${cellDescription}`}
    >
      {content}
    </button>
  );
}

export default Cell;
