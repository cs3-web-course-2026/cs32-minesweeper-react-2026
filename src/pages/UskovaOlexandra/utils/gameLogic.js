// Game status constants
export const GAME_STATUS = {
  PROCESS: 'process',
  WIN: 'win',
  LOSE: 'lose',
};

// Cell state constants
export const CELL_STATE = {
  CLOSED: 'closed',
  OPENED: 'opened',
  FLAGGED: 'flagged',
};

// Cell type constants
export const CELL_TYPE = {
  EMPTY: 'empty',
  MINE: 'mine',
};

// Creates an empty game board
export function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: CELL_TYPE.EMPTY,
      state: CELL_STATE.CLOSED,
      neighborMines: 0,
      isWrongFlag: false,
    }))
  );
}

// Generates a board and places mines
export function generateBoard(rows, cols, minePositions, safeRow = -1, safeCol = -1) {
  const newBoard = createEmptyBoard(rows, cols);

  for (const [mineRow, mineCol] of minePositions) {
    if (mineRow === safeRow && mineCol === safeCol) {
      continue;
    }
    if (newBoard[mineRow][mineCol].type !== CELL_TYPE.MINE) {
      newBoard[mineRow][mineCol].type = CELL_TYPE.MINE;
    }
  }

  return newBoard;
}

// Counts neighboring mines for each cell
export function countNeighborMines(board) {
  const rows = board.length;
  const cols = board[0].length;

  const newBoard = board.map(row =>
    row.map(cell => ({ ...cell }))
  );

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (newBoard[row][col].type === CELL_TYPE.MINE) {
        continue;
      }

      let count = 0;

      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          if (rowOffset === 0 && colOffset === 0) {
            continue;
          }

          const neighborRow = row + rowOffset;
          const neighborCol = col + colOffset;

          if (
            neighborRow >= 0 &&
            neighborRow < rows &&
            neighborCol >= 0 &&
            neighborCol < cols &&
            newBoard[neighborRow][neighborCol].type === CELL_TYPE.MINE
          ) {
            count++;
          }
        }
      }

      newBoard[row][col].neighborMines = count;
    }
  }

  return newBoard;
}

// Opens a cell and automatically reveals empty neighboring areas
export function revealCells(board, row, col) {
  const newBoard = board.map(boardRow =>
    boardRow.map(cell => ({ ...cell }))
  );

  const rows = newBoard.length;
  const cols = newBoard[0].length;

  const stack = [[row, col]];
  let explodedMine = null;

  while (stack.length > 0) {
    const [currentRow, currentCol] = stack.pop();

    if (
      currentRow < 0 ||
      currentRow >= rows ||
      currentCol < 0 ||
      currentCol >= cols
    ) {
      continue;
    }

    const cell = newBoard[currentRow][currentCol];

    if (
      cell.state === CELL_STATE.OPENED ||
      cell.state === CELL_STATE.FLAGGED
    ) {
      continue;
    }

    cell.state = CELL_STATE.OPENED;

    if (cell.type === CELL_TYPE.MINE) {
      explodedMine = {
        row: currentRow,
        col: currentCol,
      };

      break;
    }

    if (cell.neighborMines === 0) {
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          if (rowOffset !== 0 || colOffset !== 0) {
            stack.push([
              currentRow + rowOffset,
              currentCol + colOffset,
            ]);
          }
        }
      }
    }
  }

  return {
    newBoard,
    explodedMine,
  };
}

// Checks whether all safe cells have been opened
export function checkWinCondition(board, minesCount) {
  const rows = board.length;
  const cols = board[0].length;

  let openedCells = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = board[row][col];

      if (
        cell.state === CELL_STATE.OPENED &&
        cell.type !== CELL_TYPE.MINE
      ) {
        openedCells++;
      }
    }
  }

  return openedCells === rows * cols - minesCount;
}

// Prepares the board after winning or losing
export function finalizeBoard(board, status) {
  return board.map(row =>
    row.map(cell => {
      const updatedCell = { ...cell };

      if (status === GAME_STATUS.LOSE) {
        if (
          updatedCell.type === CELL_TYPE.MINE &&
          updatedCell.state !== CELL_STATE.FLAGGED
        ) {
          updatedCell.state = CELL_STATE.OPENED;
        }

        if (
          updatedCell.type !== CELL_TYPE.MINE &&
          updatedCell.state === CELL_STATE.FLAGGED
        ) {
          updatedCell.isWrongFlag = true;
        }
      }

      if (status === GAME_STATUS.WIN) {
        if (updatedCell.type === CELL_TYPE.MINE) {
          updatedCell.state = CELL_STATE.FLAGGED;
        }
      }

      return updatedCell;
    })
  );
}

export function generateMinePositions(rows, cols, minesCount, safeRow, safeCol) {
  const minePositionsSet = new Set();
  
  while (minePositionsSet.size < minesCount) {
    const mineRow = Math.floor(Math.random() * rows);
    const mineCol = Math.floor(Math.random() * cols);

    if (!(mineRow === safeRow && mineCol === safeCol)) {
      minePositionsSet.add(`${mineRow},${mineCol}`);
    }
  }

  return Array.from(minePositionsSet).map(pos =>
    pos.split(',').map(Number)
  );
}