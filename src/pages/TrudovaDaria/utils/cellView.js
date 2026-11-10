import { CELL_CONTENT, CELL_STATE, CELL_SYMBOL } from "../constants/game";

export function getCellSymbol(cell) {
  if (cell.state === CELL_STATE.FLAGGED) {
    return CELL_SYMBOL.FLAG;
  }

  if (cell.state !== CELL_STATE.OPEN) {
    return "";
  }

  if (cell.content === CELL_CONTENT.MINE) {
    return CELL_SYMBOL.MINE;
  }

  return cell.adjacentMines > 0 ? String(cell.adjacentMines) : "";
}

// Текст для скрінрідерів з урахуванням стану клітинки
export function getCellLabel(cell, row, col) {
  const position = `Рядок ${row + 1}, стовпець ${col + 1}`;

  if (cell.state === CELL_STATE.FLAGGED) {
    return `${position}, прапорець`;
  }

  if (cell.state === CELL_STATE.CLOSED) {
    return `${position}, закрита клітинка`;
  }

  if (cell.content === CELL_CONTENT.MINE) {
    return `${position}, міна`;
  }

  if (cell.adjacentMines > 0) {
    return `${position}, відкрита клітинка, мін поруч: ${cell.adjacentMines}`;
  }

  return `${position}, відкрита порожня клітинка`;
}