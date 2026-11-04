
const NEIGHBOR_OFFSETS = [-1, 0, 1];

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

    // Забезпечення безпечного першого ходу
    if (safeCell && safeCell.row === row && safeCell.col === col) {
      continue;
    }

    if (field[row][col].type === 'empty') {
      field[row][col].type = 'mine';
      placedMines += 1;
    }
  }

  return countNeighbourMines(field);
}

// Підрахунок мін без зміни вхідного поля
export function countNeighbourMines(field) {
  const rows = field.length;
  const cols = field[0]?.length ?? 0;

  return field.map((cells, row) =>
    cells.map((cell, col) => {
      if (cell.type === 'mine') {
        return { ...cell };
      }

      let count = 0;

      for (const rowOffset of NEIGHBOR_OFFSETS) {
        for (const colOffset of NEIGHBOR_OFFSETS) {
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
            count += 1;
          }
        }
      }

      return { ...cell, neighborMines: count };
    }),
  );
}

// Відкриття клітинок без зміни вхідного поля
export function revealCell(field, row, col) {
  const nextField = field.map((cells) =>
    cells.map((cell) => ({ ...cell })),
  );

  const rows = nextField.length;
  const cols = nextField[0]?.length ?? 0;

  if (
    row < 0 ||
    row >= rows ||
    col < 0 ||
    col >= cols ||
    nextField[row][col].state !== 'closed'
  ) {
    return { field: nextField, hitMine: false };
  }

  const hitMine = nextField[row][col].type === 'mine';
  const cellsToOpen = [[row, col]];

  while (cellsToOpen.length > 0) {
    const [currentRow, currentCol] = cellsToOpen.pop();
    const cell = nextField[currentRow][currentCol];

    if (cell.state !== 'closed') {
      continue;
    }

    // Не відкриваємо сусідні міни автоматично
    if (cell.type === 'mine' && !hitMine) {
      continue;
    }

    cell.state = 'opened';

    if (cell.type === 'mine' || cell.neighborMines !== 0) {
      continue;
    }

    for (const rowOffset of NEIGHBOR_OFFSETS) {
      for (const colOffset of NEIGHBOR_OFFSETS) {
        if (rowOffset === 0 && colOffset === 0) {
          continue;
        }

        const neighborRow = currentRow + rowOffset;
        const neighborCol = currentCol + colOffset;

        if (
          neighborRow >= 0 &&
          neighborRow < rows &&
          neighborCol >= 0 &&
          neighborCol < cols
        ) {
          cellsToOpen.push([neighborRow, neighborCol]);
        }
      }
    }
  }

  return { field: nextField, hitMine };
}

// Перевірка перемоги
export function checkWin(field) {
  return field.every((cells) =>
    cells.every(
      (cell) =>
        cell.type === 'mine' ||
        cell.state === 'opened',
    ),
  );
}
 
// Перемикання прапорця без зміни початкового поля
export function toggleFlag(field, row, col, minesCount) {
  const cell = field[row]?.[col];

  if (!cell || cell.state === 'opened') {
    return field;
  }

  const flagsCount = field.flat().filter(
    (currentCell) => currentCell.state === 'flagged',
  ).length;

  if (cell.state === 'closed' && flagsCount >= minesCount) {
    return field;
  }

  return field.map((cells, currentRow) =>
    cells.map((currentCell, currentCol) => {
      if (currentRow !== row || currentCol !== col) {
        return { ...currentCell };
      }

      return {
        ...currentCell,
        state: currentCell.state === 'flagged'
          ? 'closed'
          : 'flagged',
      };
    }),
  );
}

// Позначення всіх мін прапорцями після перемоги
export function flagAllMines(field) {
  return field.map((cells) =>
    cells.map((cell) => ({
      ...cell,
      state: cell.type === 'mine' ? 'flagged' : cell.state,
    })),
  );
}
