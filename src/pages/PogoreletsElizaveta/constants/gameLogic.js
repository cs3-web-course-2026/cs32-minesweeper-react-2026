import { CELL_STATE, CELL_TYPE } from "./game";

export function revealCell(board, row, col) {
  const newBoard = board.map((boardRow) =>
    boardRow.map((cell) => ({ ...cell }))
  );

  const rows = newBoard.length;
  const cols = newBoard[0]?.length ?? 0;

  const reveal = (currentRow, currentCol) => {
    if (
      currentRow < 0 ||
      currentRow >= rows ||
      currentCol < 0 ||
      currentCol >= cols
    ) {
      return;
    }

    const cell = newBoard[currentRow][currentCol];

    if (
      cell.state !== CELL_STATE.CLOSED ||
      cell.type === CELL_TYPE.MINE
    ) {
      return;
    }

    cell.state = CELL_STATE.OPENED;

    if (cell.neighborMines === 0) {
      for (let deltaRow = -1; deltaRow <= 1; deltaRow += 1) {
        for (let deltaCol = -1; deltaCol <= 1; deltaCol += 1) {
          if (deltaRow === 0 && deltaCol === 0) continue;

          reveal(
            currentRow + deltaRow,
            currentCol + deltaCol
          );
        }
      }
    }
  };

  reveal(row, col);

  return newBoard;
}

export function checkWinCondition(board) {
  const flatBoard = board.flat();
  
  // Победа, если все ячейки, которые НЕ являются минами, открыты
  return flatBoard.every((cell) => {
    if (cell.type === CELL_TYPE.MINE) {
      return true; // Мины не обязательно должны быть зафлажкованы
    }
    return cell.state === CELL_STATE.OPENED;
  });
}

export function toggleFlagOnCell(board, row, col, flagsCount) {
  const cell = board[row][col];

  if (cell.state === CELL_STATE.OPENED) {
    return { board, flagsCount };
  }

  if (
    cell.state === CELL_STATE.CLOSED &&
    flagsCount <= 0
  ) {
    return { board, flagsCount };
  }

  if (
    cell.state !== CELL_STATE.CLOSED &&
    cell.state !== CELL_STATE.FLAGGED
  ) {
    return { board, flagsCount };
  }

  const newBoard = board.map((boardRow) =>
    boardRow.map((currentCell) => ({ ...currentCell }))
  );

  const newCell = newBoard[row][col];

  if (newCell.state === CELL_STATE.FLAGGED) {
    newCell.state = CELL_STATE.CLOSED;

    return {
      board: newBoard,
      flagsCount: flagsCount + 1,
    };
  }

  newCell.state = CELL_STATE.FLAGGED;

  return {
    board: newBoard,
    flagsCount: flagsCount - 1,
  };
}