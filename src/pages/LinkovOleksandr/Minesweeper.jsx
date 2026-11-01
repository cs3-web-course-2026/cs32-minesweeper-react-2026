import React, { useState, useEffect, useCallback } from 'react';
import styles from './Minesweeper.module.css';
import Board from './components/Board';
import Timer from './components/Timer';
import GameStatus from './components/GameStatus';
import RestartButton from './components/RestartButton';

const ROWS = 10;
const COLS = 10;
const MINES_COUNT = 10;

// функція для генерації початкового стану поля гри
const generateInitialBoard = () => {
    const newBoard = Array(ROWS).fill(null).map(() => 
        Array(COLS).fill(null).map(() => ({
            type: 'empty',
            neighborMines: 0,
            state: 'closed',
        }))
    );

    let placedMines = 0;
    while (placedMines < MINES_COUNT) {
        const r = Math.floor(Math.random() * ROWS);
        const c = Math.floor(Math.random() * COLS);
        if (newBoard[r][c].type !== 'mine') {
            newBoard[r][c].type = 'mine';
            placedMines++;
        }
    }
    return newBoard;
};

export default function Minesweeper() {
    const [board, setBoard] = useState(generateInitialBoard);
    const [status, setStatus] = useState('idle'); // idle, process, win, lose
    const [flagsUsed, setFlagsUsed] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [clickedMine, setClickedMine] = useState(null);

    // Ініціалізація поля
    const initGame = useCallback(() => {
        setBoard(generateInitialBoard());
        setStatus('idle');
        setFlagsUsed(0);
        setGameTime(0);
        setClickedMine(null);
    }, []);

    // Таймер
    useEffect(() => {
        let timerId;
        if (status === 'process') {
            timerId = setInterval(() => {
                setGameTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timerId);
    }, [status]);

    const countMines = (grid) => {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (grid[r][c].type === 'mine') continue;
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                            if (grid[nr][nc].type === 'mine') count++;
                        }
                    }
                }
                grid[r][c].neighborMines = count;
            }
        }
    };

    const handleCellClick = (r, c) => {
        if (status === 'win' || status === 'lose') return;

        const newBoard = board.map(row => row.map(cell => ({ ...cell })));
        let currentStatus = status;

        if (currentStatus === 'idle') {
            currentStatus = 'process';
            setStatus('process');
            
            // Безпечний перший клік
            if (newBoard[r][c].type === 'mine') {
                newBoard[r][c].type = 'empty';
                let moved = false;
                while (!moved) {
                    const newR = Math.floor(Math.random() * ROWS);
                    const newC = Math.floor(Math.random() * COLS);
                    if (newBoard[newR][newC].type !== 'mine' && (newR !== r || newC !== c)) {
                        newBoard[newR][newC].type = 'mine';
                        moved = true;
                    }
                }
            }
            countMines(newBoard);
        } else {
            // Перестраховка для рендерів, де countMines вже міг виконатися
            if (newBoard[0][0].neighborMines === 0 && newBoard[0][0].type !== 'mine') {
                countMines(newBoard);
            }
        }

        const cell = newBoard[r][c];
        if (cell.state === 'opened' || cell.state === 'flagged') return;

        // Flood-fill відкриття
        const reveal = (row, col) => {
            if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
            const target = newBoard[row][col];
            if (target.state !== 'closed') return;
            
            target.state = 'opened';
            
            if (target.type === 'mine') return;
            if (target.neighborMines === 0) {
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        reveal(row + dr, col + dc);
                    }
                }
            }
        };

        if (cell.type === 'mine') {
            // Поразка
            newBoard.forEach(row => row.forEach(cl => {
                if (cl.type === 'mine' && cl.state !== 'flagged') cl.state = 'opened';
            }));
            cell.state = 'opened';
            setStatus('lose');
            setClickedMine({ r, c });
        } else {
            reveal(r, c);
            
            // Перевірка на перемогу
            let closedCount = 0;
            newBoard.forEach(row => row.forEach(cl => {
                if (cl.state !== 'opened') closedCount++;
            }));
            
            if (closedCount === MINES_COUNT) {
                setStatus('win');
            }
        }
        setBoard(newBoard);
    };

    const handleContextMenu = (e, r, c) => {
        e.preventDefault();
        if (status !== 'process') return;

        const newBoard = board.map(row => row.map(cell => ({ ...cell })));
        const cell = newBoard[r][c];

        if (cell.state === 'opened') return;

        if (cell.state === 'closed' && flagsUsed < MINES_COUNT) {
            cell.state = 'flagged';
            setFlagsUsed(prev => prev + 1);
        } else if (cell.state === 'flagged') {
            cell.state = 'closed';
            setFlagsUsed(prev => prev - 1);
        }
        setBoard(newBoard);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.minesweeperContainer}>
                <header className={styles.gameHeader}>
                    <Timer time={gameTime} />
                    <RestartButton status={status} onRestart={initGame} />
                    <div className={styles.flagCounter}>
                        🚩 {String(Math.max(0, MINES_COUNT - flagsUsed)).padStart(3, '0')}
                    </div>
                </header>

                <GameStatus status={status} />

                <Board 
                    board={board}
                    onCellClick={handleCellClick}
                    onContextMenu={handleContextMenu}
                    status={status}
                    clickedMine={clickedMine}
                    rows={ROWS}
                    cols={COLS}
                />
            </div>
        </div>
    );
}