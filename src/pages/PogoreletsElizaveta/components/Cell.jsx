import styles from "./Cell.module.css";
import { CELL_STATE, CELL_TYPE } from "../constants/game";

export default function Cell({ cell, row, col, onOpen, onToggleFlag, disabled }) {
  const classes = [styles.cell];

  let content = "";
  let ariaLabel = "Закрытая клетка";

  if (cell.state === CELL_STATE.OPENED) {
    classes.push(styles.reveal);
    ariaLabel = "Открытая клетка";

    if (cell.type === CELL_TYPE.MINE) {
      classes.push(styles.mine);
      if (cell.exploded) classes.push(styles.exploded);
      content = "💣";
      ariaLabel = "Мина";
    } else if (cell.neighborMines > 0) {
      classes.push(styles[`num${cell.neighborMines}`]);
      content = cell.neighborMines;
      ariaLabel = `Рядом ${cell.neighborMines} мин`;
    }
  } else if (cell.state === CELL_STATE.FLAGGED) {
    classes.push(styles.flag);
    content = "🚩";
    ariaLabel = "Флажок";
  }

  const handleContextMenu = (event) => {
    event.preventDefault();
    if (!disabled) onToggleFlag(row, col);
  };

  return (
    <button
      type="button"
      className={classes.join(" ")}
      onClick={() => onOpen(row, col)}
      onContextMenu={handleContextMenu}
      disabled={disabled || cell.state === CELL_STATE.OPENED}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
