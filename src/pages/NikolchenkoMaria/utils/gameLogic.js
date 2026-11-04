
// Створення порожнього ігрового поля
export function createEmptyField(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      type: 'empty',
      state: 'closed',
      neighborMines: 0,
    })),
  );
}

// Генерація поля з мінами
export function generateField(rows, cols, minesCount, safeCell = null) {
  if (
    rows <= 0 ||
    cols <= 0 ||
    minesCount < 0 ||
    minesCount >= rows * cols
  ) {
    throw new Error('Некоректні параметри ігрового поля');
  }

  const field = createEmptyField(rows, cols);
  let placedMines = 0;

  while (placedMines < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    // Перша відкрита клітинка не повинна містити міну
    if (safeCell && safeCell.row === row && safeCell.col === col) {
      continue;
    }

    if (field[row][col].type === 'empty') {
      field[row][col].type = 'mine';
      placedMines++;
    }
  }

  countNeighbourMines(field);
  return field;
}

// Підрахунок мін навколо кожної клітинки
export function countNeighbourMines(field) {
  const rows = field.length;
  const cols = field[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = field[row][col];

      if (cell.type === 'mine') {
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
            field[neighborRow][neighborCol].type === 'mine'
          ) {
            count++;
          }
        }
      }

      cell.neighborMines = count;
    }
  }
}

// Відкриття клітинки та порожніх сусідніх клітинок
export function revealCell(field, row, col) {
  const rows = field.length;
  const cols = field[0].length;

  if (
    row < 0 ||
    row >= rows ||
    col < 0 ||
    col >= cols
  ) {
    return false;
  }

  const cell = field[row][col];

  if (cell.state !== 'closed') {
    return false;
  }

  cell.state = 'opened';

  if (cell.type === 'mine') {
    return true;
  }

  if (cell.neighborMines === 0) {
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        if (rowOffset === 0 && colOffset === 0) {
          continue;
        }

        revealCell(
          field,
          row + rowOffset,
          col + colOffset,
        );
      }
    }
  }

  return false;
}

// Перевірка перемоги
export function checkWin(field) {
  return field.every((row) =>
    row.every(
      (cell) =>
        cell.type === 'mine' ||
        cell.state === 'opened',
    ),
  );
}
