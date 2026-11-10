import { memo } from "react";

import { CELL_CONTENT, CELL_STATE } from "../constants/game";
import { getCellLabel, getCellSymbol } from "../utils/cellView";

import styles from "./CellButton.module.css";

function getCellClassName(cell) {
  const isOpen = cell.state === CELL_STATE.OPEN;
  const isMine = cell.content === CELL_CONTENT.MINE;

  return [
    styles.cell,
    isOpen ? styles.open : "",
    cell.state === CELL_STATE.FLAGGED ? styles.flagged : "",
    isOpen && isMine ? styles.mine : "",
    cell.isExploded ? styles.exploded : "",
    isOpen && !isMine && cell.adjacentMines > 0
      ? styles[`number${cell.adjacentMines}`]
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function CellButton({ cell, row, col, isDisabled, onReveal, onFlag }) {
  const handleClick = () => onReveal(row, col);

  const handleContextMenu = (event) => {
    event.preventDefault();
    onFlag(row, col);
  };

  return (
    <button
      type="button"
      className={getCellClassName(cell)}
      aria-label={getCellLabel(cell, row, col)}
      disabled={isDisabled}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {getCellSymbol(cell)}
    </button>
  );
}

export default memo(CellButton);
