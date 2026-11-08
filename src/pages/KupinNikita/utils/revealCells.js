function revealCells(board, row, col) {
  const SIZE = board.length;

  const next = board.map((line) =>
    line.map((cell) => ({ ...cell }))
  );

  function reveal(r, c) {
    if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) {
      return;
    }

    const cell = next[r][c];

    if (cell.revealed || cell.flagged || cell.isMine) {
      return;
    }

    cell.revealed = true;

    if (cell.adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            reveal(r + dr, c + dc);
          }
        }
      }
    }
  }

  reveal(row, col);

  return next;
}

export default revealCells;