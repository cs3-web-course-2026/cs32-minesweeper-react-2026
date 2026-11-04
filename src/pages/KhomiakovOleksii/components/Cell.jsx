import {
  CELL_STATE,
  CELL_TYPE,
  GAME_STATUS,
} from '../constants/gameConstants';
import styles from '../KhomiakovOleksii.module.css';

export default function Cell({ cell, gameStatus, onOpen, onToggleFlag }) {
  const { row, col, state, type, neighborMines, exploded } = cell;
  const coordText = `рядок ${row + 1}, стовпець ${col + 1}`;

  const classNames = [styles.cell];
  let content = '';
  let ariaLabelText = `Закрита клітинка, ${coordText}`;

  if (state === CELL_STATE.OPENED) {
    classNames.push(styles.open);

    if (type === CELL_TYPE.MINE) {
      classNames.push(styles.mine);
      content = '💣';
      if (exploded) {
        classNames.push(styles.exploded);
        ariaLabelText = `Міна, на яку натиснули, ${coordText}`;
      } else {
        ariaLabelText = `Клітинка з міною, ${coordText}`;
      }
    } else if (neighborMines > 0) {
      classNames.push(styles[`number${neighborMines}`]);
      content = neighborMines;
      ariaLabelText = `Відкрита клітинка, ${neighborMines}, ${coordText}`;
    } else {
      ariaLabelText = `Порожня відкрита клітинка, ${coordText}`;
    }
  } else if (state === CELL_STATE.FLAGGED) {
    classNames.push(styles.flagged);
    ariaLabelText = `Клітинка з прапорцем, ${coordText}`;
    if (gameStatus === GAME_STATUS.LOSE && type === CELL_TYPE.MINE) {
      classNames.push(styles.mine);
    }
  } else if (gameStatus === GAME_STATUS.LOSE && type === CELL_TYPE.MINE) {
    classNames.push(styles.open, styles.mine);
    content = '💣';
    ariaLabelText = `Клітинка з міною, ${coordText}`;
  }

  const handleContextMenu = (event) => {
    event.preventDefault();
    onToggleFlag(row, col);
  };

  return (
    <button
      type="button"
      className={classNames.join(' ')}
      aria-label={ariaLabelText}
      onClick={() => onOpen(row, col)}
      onContextMenu={handleContextMenu}
    >
      {content}
    </button>
  );
}