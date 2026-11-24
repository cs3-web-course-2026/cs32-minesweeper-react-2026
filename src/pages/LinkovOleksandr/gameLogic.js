export const ROWS = 10;
export const COLS = 10;
export const MINES_COUNT = 10;

export const createEmptyBoard = () => {
    return Array(ROWS).fill(null).map(() =>
        Array(COLS).fill(null).map(() => ({
            type: 'empty',
            neighborMines: 0,
            state: 'closed', // closed, open, flagged
        }))
    );
};

export const generateBoardWithMines = (excludeRow, excludeCol) => {
    const board = createEmptyBoard();
    let placedMines = 0;

    while (placedMines < MINES_COUNT) {
        const r = Math.floor(Math.random() * ROWS);
        const c = Math.floor(Math.random() * COLS);

        // Уникаємо розміщення міни на першому кліці користувача (безпечний старт)
        if ((r === excludeRow && c === excludeCol) || board[r][c].type === 'mine') {
            continue;
        }

        board[r][c].type = 'mine';
        placedMines++;
    }

    // Підрахунок сусідніх мін
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c].type === 'mine') continue;
            
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].type === 'mine') {
                        count++;
                    }
                }
            }
            board[r][c].neighborMines = count;
        }
    }

    return board;
};

export const checkWinCondition = (board) => {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = board[r][c];
            if (cell.type !== 'mine' && cell.state !== 'open') {
                return false;
            }
        }
    }
    return true;
};