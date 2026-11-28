const getRndInteger = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

export const generateField = (rows, cols, minesCount) => {
  if (minesCount >= rows * cols) {
    throw new Error('Количество мин превышает размер поля!');
  }

  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: 'empty',
      state: 'closed',
      neighborMines: 0,
    })),
  );

  let minesPlaced = 0;
  while (minesPlaced < minesCount) {
    const randRow = getRndInteger(0, rows);
    const randCol = getRndInteger(0, cols);

    if (board[randRow][randCol].type === 'empty') {
      board[randRow][randCol].type = 'mine';
      minesPlaced++;
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col].type === 'mine') continue;

      let mineCount = 0;
      for (let dRow = -1; dRow <= 1; dRow++) {
        for (let dCol = -1; dCol <= 1; dCol++) {
          if (dRow === 0 && dCol === 0) continue;

          const nRow = row + dRow;
          const nCol = col + dCol;

          if (
            nRow >= 0 &&
            nRow < rows &&
            nCol >= 0 &&
            nCol < cols &&
            board[nRow][nCol].type === 'mine'
          ) {
            mineCount++;
          }
        }
      }
      board[row][col].neighborMines = mineCount;
    }
  }

  return board;
};

export const checkWinCondition = (board, rows, cols, minesCount) => {
  let openedSafeCells = 0;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (
        board[row][col].type === 'empty' &&
        board[row][col].state === 'opened'
      ) {
        openedSafeCells++;
      }
    }
  }

  return openedSafeCells === rows * cols - minesCount;
};