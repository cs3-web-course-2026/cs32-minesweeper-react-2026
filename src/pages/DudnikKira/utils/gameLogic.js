export function createBoard(rows, cols, mines) {
    let board = Array(rows).fill(null).map((_, r) =>
        Array(cols).fill(null).map((_, c) => ({
            row: r,
            col: c,
            isMine: false,
            isOpen: false,
            isFlagged: false,
            neighborMines: 0,
        }))
    );

    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!board[r][c].isMine) {
            board[r][c].isMine = true;
            minesPlaced++;
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].isMine) continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        if (board[nr][nc].isMine) count++;
                    }
                }
            }
            board[r][c].neighborMines = count;
        }
    }

    return board;
}

export function revealCell(board, r, c) {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    const rows = newBoard.length;
    const cols = newBoard[0].length;

    function floodFill(row, col) {
        if (row < 0 || row >= rows || col < 0 || col >= cols) return;
        const cell = newBoard[row][col];
        if (cell.isOpen || cell.isFlagged) return;

        cell.isOpen = true;

        if (cell.neighborMines === 0 && !cell.isMine) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr !== 0 || dc !== 0) {
                        floodFill(row + dr, col + dc);
                    }
                }
            }
        }
    }

    floodFill(r, c);
    return newBoard;
}