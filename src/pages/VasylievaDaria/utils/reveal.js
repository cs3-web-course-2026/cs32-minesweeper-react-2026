
import { GAME_CONFIG } from '../constants/game';

export function revealCell(board, row, col) {
  const nextBoard = board.map(boardRow =>
    boardRow.map(cell => ({ ...cell }))
  );

  function revealAdjacentCells(currentRow, currentCol) {
    if (
      currentRow < 0 ||
      currentRow >= GAME_CONFIG.ROWS ||
      currentCol < 0 ||
      currentCol >= GAME_CONFIG.COLS
    ) {
      return;
    }

    const cell = nextBoard[currentRow][currentCol];

    if (cell.opened || cell.flagged || cell.mine) {
      return;
    }

    cell.opened = true;

    if (cell.count !== 0) {
      return;
    }

    for (let directionalRow = -1; directionalRow <= 1; directionalRow++) {
      for (let directionalCol = -1; directionalCol <= 1; directionalCol++) {
        if (directionalRow === 0 && directionalCol === 0) {
          continue;
        }

        revealAdjacentCells(
          currentRow + directionalRow,
          currentCol + directionalCol
        );
      }
    }
  }

  revealAdjacentCells(row, col);

  return nextBoard;
}
