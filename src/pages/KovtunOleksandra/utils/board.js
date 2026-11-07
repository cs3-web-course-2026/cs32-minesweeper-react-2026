import { DIRECTIONS } from '../constants/game';

export function createInitialBoard(rows, cols, minesCount) {
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: 'empty',
      state: 'closed',
      neighborMines: 0
    }))
  );

  let minesPlaced = 0;
  while (minesPlaced < minesCount) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);
    if (board[randomRow][randomCol].type !== 'mine') {
      board[randomRow][randomCol].type = 'mine';
      minesPlaced++;
    }
  }

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    for (let colIndex = 0; colIndex < cols; colIndex++) {
      if (board[rowIndex][colIndex].type === 'mine') continue;
      let mines = 0;
      for (const [rowOffset, colOffset] of DIRECTIONS) {
        const neighborRow = rowIndex + rowOffset;
        const neighborCol = colIndex + colOffset;
        if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols) {
          if (board[neighborRow][neighborCol].type === 'mine') mines++;
        }
      }
      board[rowIndex][colIndex].neighborMines = mines;
    }
  }

  return board;
}

export function revealEmptyCells(board, startRow, startCol, rows, cols) {
  const newBoard = board.map(rowArray => rowArray.map(cell => ({ ...cell })));
  const cell = newBoard[startRow][startCol];

  if (cell.state === 'opened' || cell.state === 'flagged') {
    return newBoard;
  }

  cell.state = 'opened';

  if (cell.type === 'empty' && cell.neighborMines === 0) {
    const queue = [[startRow, startCol]];
    const visited = new Set([`${startRow},${startCol}`]);

    while (queue.length > 0) {
      const [currentRow, currentCol] = queue.shift();

      for (const [rowOffset, colOffset] of DIRECTIONS) {
        const neighborRow = currentRow + rowOffset;
        const neighborCol = currentCol + colOffset;

        if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols) {
          const neighbor = newBoard[neighborRow][neighborCol];
          const key = `${neighborRow},${neighborCol}`;

          if (!visited.has(key) && neighbor.state === 'closed') {
            visited.add(key);
            neighbor.state = 'opened';

            if (neighbor.type === 'empty' && neighbor.neighborMines === 0) {
              queue.push([neighborRow, neighborCol]);
            }
          }
        }
      }
    }
  }

  return newBoard;
}