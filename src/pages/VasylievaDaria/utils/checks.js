
export function checkWinCondition(board) {
  return board.every(boardRow =>
    boardRow.every(cell => cell.mine || cell.opened)
  );
}

export function revealAllMines(board) {
  return board.map(boardRow =>
    boardRow.map(cell => ({
      ...cell,
      opened: cell.mine ? true : cell.opened,
    }))
  );
}
