import { CELL_STATE, DIRECTIONS, ICONS, STATUS } from '../constants/gameConfig';

export function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (__, col) => ({
      row,
      col,
      type: 'empty',
      state: CELL_STATE.CLOSED,
      neighborMines: 0,
    }))
  );
}

export function isInside(row, col, rows, cols) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

function forEachNeighbour(row, col, rows, cols, callback) {
  DIRECTIONS.forEach(([dRow, dCol]) => {
    const nRow = row + dRow;
    const nCol = col + dCol;
    if (isInside(nRow, nCol, rows, cols)) {
      callback(nRow, nCol);
    }
  });
}

export function generateMinesOnBoard(currentBoard, minesCount, excludeRow, excludeCol) {
  const rows = currentBoard.length;
  const cols = currentBoard[0].length;

  if (minesCount > rows * cols - 1) {
    throw new RangeError('Кількість мін перевищує доступну кількість клітинок');
  }

  // Глибока копія зі збереженням уже встановлених прапорців
  const nextBoard = currentBoard.map((row) =>
    row.map((cell) => ({
      ...cell,
      type: 'empty',
      neighborMines: 0,
    }))
  );

  let minesPlaced = 0;
  while (minesPlaced < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    if (row === excludeRow && col === excludeCol) continue;

    if (nextBoard[row][col].type !== 'mine') {
      nextBoard[row][col].type = 'mine';
      minesPlaced += 1;
    }
  }

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (nextBoard[row][col].type === 'mine') continue;

      let count = 0;
      forEachNeighbour(row, col, rows, cols, (nRow, nCol) => {
        if (nextBoard[nRow][nCol].type === 'mine') {
          count += 1;
        }
      });
      nextBoard[row][col].neighborMines = count;
    }
  }

  return nextBoard;
}

export function revealCells(currentBoard, startRow, startCol) {
  const rows = currentBoard.length;
  const cols = currentBoard[0].length;
  const nextBoard = currentBoard.map((row) => row.map((cell) => ({ ...cell })));

  function floodFill(row, col) {
    if (!isInside(row, col, rows, cols)) return;

    const cell = nextBoard[row][col];
    if (cell.state !== CELL_STATE.CLOSED) return;

    cell.state = CELL_STATE.OPENED;

    if (cell.neighborMines === 0) {
      forEachNeighbour(row, col, rows, cols, floodFill);
    }
  }

  floodFill(startRow, startCol);
  return nextBoard;
}

export function checkWin(board, minesCount) {
  const rows = board.length;
  const cols = board[0].length;
  const totalSafeCells = rows * cols - minesCount;
  const openedCells = board.flat().filter((cell) => cell.state === CELL_STATE.OPENED).length;
  return openedCells === totalSafeCells;
}

export function pluralizeMines(count) {
  const lastTwo = count % 100;
  const last = count % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return 'мін';
  if (last === 1) return 'міна';
  if (last >= 2 && last <= 4) return 'міни';
  return 'мін';
}

export function getCellView(cell, gameStatus) {
  const position = `рядок ${cell.row + 1}, стовпець ${cell.col + 1}`;
  const isGameOver = gameStatus !== STATUS.PROCESS;

  switch (cell.state) {
    case CELL_STATE.EXPLODED:
      return {
        isOpen: true,
        isMine: true,
        isExploded: true,
        isFlagged: false,
        isFalseFlag: false,
        text: ICONS.MINE,
        number: null,
        label: `Вибухнула міна, ${position}`,
      };

    case CELL_STATE.OPENED:
      return {
        isOpen: true,
        isMine: false,
        isExploded: false,
        isFlagged: false,
        isFalseFlag: false,
        text: cell.neighborMines > 0 ? String(cell.neighborMines) : '',
        number: cell.neighborMines > 0 ? cell.neighborMines : null,
        label:
          cell.neighborMines > 0
            ? `${cell.neighborMines} ${pluralizeMines(cell.neighborMines)} поруч, ${position}`
            : `Порожня відкрита клітинка, ${position}`,
      };

    case CELL_STATE.FLAGGED: {
      const isFalseFlag = gameStatus === STATUS.LOSE && cell.type !== 'mine';
      return {
        isOpen: false,
        isMine: false,
        isExploded: false,
        isFlagged: true,
        isFalseFlag,
        text: ICONS.FLAG,
        number: null,
        label: isFalseFlag
          ? `Хибний прапорець, ${position}`
          : `Клітинка з прапорцем, ${position}`,
      };
    }

    default:
      if (isGameOver && cell.type === 'mine') {
        if (gameStatus === STATUS.WIN) {
          return {
            isOpen: false,
            isMine: false,
            isExploded: false,
            isFlagged: true,
            isFalseFlag: false,
            text: ICONS.FLAG,
            number: null,
            label: `Клітинка з прапорцем, ${position}`,
          };
        }
        return {
          isOpen: true,
          isMine: true,
          isExploded: false,
          isFlagged: false,
          isFalseFlag: false,
          text: ICONS.MINE,
          number: null,
          label: `Міна, ${position}`,
        };
      }

      return {
        isOpen: false,
        isMine: false,
        isExploded: false,
        isFlagged: false,
        isFalseFlag: false,
        text: '',
        number: null,
        label: `Закрита клітинка, ${position}`,
      };
  }
}