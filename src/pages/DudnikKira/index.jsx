import React, { useState, useEffect, useCallback } from 'react';
import GameHeader from './components/GameHeader/GameHeader';
import GameStatus from './components/GameStatus/GameStatus';
import Board from './components/Board/Board';
import styles from './DudnikKira.module.css';

const ROWS = 10;
const COLS = 10;
const MINES_COUNT = 15;

const generateEmptyBoard = (rows, cols) => {
    const newBoard = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push({
                row: r,
                col: c,
                type: 'empty',
                state: 'closed',
                neighborMines: 0,
                isExploded: false
            });
        }
        newBoard.push(row);
    }
    return newBoard;
};

export default function DudnikKira() {
    const [board, setBoard] = useState(() => generateEmptyBoard(ROWS, COLS));
    const [gameState, setGameState] = useState({
        rows: ROWS,
        cols: COLS,
        minesCount: MINES_COUNT,
        status: 'process',
        gameTime: 0,
        flagsLeft: MINES_COUNT,
        isFirstClick: true
    });

    const handleReset = useCallback(() => {
        setBoard(generateEmptyBoard(ROWS, COLS));
        setGameState({
            rows: ROWS,
            cols: COLS,
            minesCount: MINES_COUNT,
            status: 'process',
            gameTime: 0,
            flagsLeft: MINES_COUNT,
            isFirstClick: true
        });
    }, []);

    useEffect(() => {
        let timerId = null;
        if (gameState.status === 'process' && !gameState.isFirstClick) {
            timerId = setInterval(() => {
                setGameState((prev) => ({ ...prev, gameTime: prev.gameTime + 1 }));
            }, 1000);
        }
        return () => clearInterval(timerId);
    }, [gameState.status, gameState.isFirstClick]);

    const populateMines = (excludeRow, excludeCol) => {
        const newBoard = generateEmptyBoard(ROWS, COLS);
        let placedMines = 0;

        while (placedMines < MINES_COUNT) {
            const r = Math.floor(Math.random() * ROWS);
            const c = Math.floor(Math.random() * COLS);

            if ((r !== excludeRow || c !== excludeCol) && newBoard[r][c].type !== 'mine') {
                newBoard[r][c].type = 'mine';
                placedMines++;
            }
        }

        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (newBoard[r][c].type === 'mine') continue;
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                            if (newBoard[nr][nc].type === 'mine') count++;
                        }
                    }
                }
                newBoard[r][c].neighborMines = count;
            }
        }

        return newBoard;
    };

    const revealEmptyNeighbors = (currentBoard, startRow, startCol) => {
        const queue = [[startRow, startCol]];
        currentBoard[startRow][startCol].state = 'opened';

        while (queue.length > 0) {
            const [r, c] = queue.shift();

            if (currentBoard[r][c].neighborMines === 0) {
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                            const neighbor = currentBoard[nr][nc];
                            if (neighbor.state === 'closed') {
                                neighbor.state = 'opened';
                                if (neighbor.neighborMines === 0) {
                                    queue.push([nr, nc]);
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    const handleCellClick = (row, col) => {
        if (gameState.status !== 'process') return;

        let currentBoard = board.map(r => r.map(cell => ({ ...cell })));
        let isFirst = gameState.isFirstClick;

        if (isFirst) {
            currentBoard = populateMines(row, col);
            setGameState(prev => ({ ...prev, isFirstClick: false }));
        }

        const cell = currentBoard[row][col];
        if (cell.state === 'opened' || cell.state === 'flagged') return;

        if (cell.type === 'mine') {
            cell.state = 'opened';
            cell.isExploded = true;

            currentBoard.forEach(r => r.forEach(c => {
                if (c.type === 'mine') c.state = 'opened';
            }));

            setBoard(currentBoard);
            setGameState(prev => ({ ...prev, status: 'lose' }));
            return;
        }

        if (cell.neighborMines === 0) {
            revealEmptyNeighbors(currentBoard, row, col);
        } else {
            cell.state = 'opened';
        }

        let hasWon = true;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const item = currentBoard[r][c];
                if (item.type === 'empty' && item.state !== 'opened') {
                    hasWon = false;
                    break;
                }
            }
        }

        setBoard(currentBoard);

        if (hasWon) {
            setGameState(prev => ({ ...prev, status: 'win' }));
        }
    };

    const handleCellContextMenu = (e, row, col) => {
        e.preventDefault();
        if (gameState.status !== 'process') return;

        const currentBoard = board.map(r => r.map(cell => ({ ...cell })));
        const cell = currentBoard[row][col];

        if (cell.state === 'opened') return;

        if (cell.state === 'closed' && gameState.flagsLeft > 0) {
            cell.state = 'flagged';
            setGameState(prev => ({ ...prev, flagsLeft: prev.flagsLeft - 1 }));
        } else if (cell.state === 'flagged') {
            cell.state = 'closed';
            setGameState(prev => ({ ...prev, flagsLeft: prev.flagsLeft + 1 }));
        }

        setBoard(currentBoard);
    };

    return (
      <div className={styles.container}>
          <div className={styles['minesweeper-box']}>
              <GameHeader
                flagsLeft={gameState.flagsLeft}
                gameTime={gameState.gameTime}
                onReset={handleReset}
              />
              <GameStatus status={gameState.status} />
              <Board
                board={board}
                onCellClick={handleCellClick}
                onCellContextMenu={handleCellContextMenu}
              />
          </div>
      </div>
    );
}