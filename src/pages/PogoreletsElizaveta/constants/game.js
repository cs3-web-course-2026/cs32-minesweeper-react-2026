export const GAME_STATUS = {
  PROCESS: "process",
  WIN: "win",
  LOSE: "lose",
};

export const CELL_STATE = {
  CLOSED: "closed",
  OPENED: "opened",
  FLAGGED: "flagged",
};

export const CELL_TYPE = {
  EMPTY: "empty",
  MINE: "mine",
};

export const BOARD_ROWS = 10;
export const BOARD_COLS = 10;
export const MINES_COUNT = 15;
export const TIMER_INTERVAL_MS = 1000;

export const formatNumber = (number) =>
  String(Math.max(0, number)).padStart(3, "0");

export function createEmptyBoard(rows = BOARD_ROWS, cols = BOARD_COLS) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: CELL_TYPE.EMPTY,
      neighborMines: 0,
      state: CELL_STATE.CLOSED,
      exploded: false,
    }))
  );
}

export function countNeighbourMines(board) {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;

  return board.map((boardRow, row) =>
    boardRow.map((cell, col) => {
      if (cell.type === CELL_TYPE.MINE) {
        return { ...cell, neighborMines: 0 };
      }

      let count = 0;

      for (let deltaRow = -1; deltaRow <= 1; deltaRow += 1) {
        for (let deltaCol = -1; deltaCol <= 1; deltaCol += 1) {
          if (deltaRow === 0 && deltaCol === 0) continue;

          const neighborRow = row + deltaRow;
          const neighborCol = col + deltaCol;

          if (
            neighborRow >= 0 &&
            neighborRow < rows &&
            neighborCol >= 0 &&
            neighborCol < cols &&
            board[neighborRow][neighborCol].type === CELL_TYPE.MINE
          ) {
            count += 1;
          }
        }
      }

      return { ...cell, neighborMines: count };
    })
  );
}

export function generateField(
  rows,
  cols,
  minesCount,
  safeRow,
  safeCol
) {
  const board = createEmptyBoard(rows, cols);
  let placedMines = 0;

  while (placedMines < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    const isNearSafeSpot =
      Math.abs(row - safeRow) <= 1 &&
      Math.abs(col - safeCol) <= 1;

    if (!isNearSafeSpot && board[row][col].type !== CELL_TYPE.MINE) {
      board[row][col].type = CELL_TYPE.MINE;
      placedMines += 1;
    }
  }

  return countNeighbourMines(board);
}

export function revealAllMines(board) {
  return board.map((row) =>
    row.map((cell) => {
      if (cell.type !== CELL_TYPE.MINE || cell.state === CELL_STATE.FLAGGED) {
        return cell;
      }

      return { ...cell, state: CELL_STATE.OPENED };
    })
  );
}