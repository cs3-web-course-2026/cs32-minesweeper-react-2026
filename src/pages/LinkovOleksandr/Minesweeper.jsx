import React, { useState, useEffect, useCallback } from 'react';
import styles from './Minesweeper.module.css';
import Board from './components/Board';
import Timer from './components/Timer';
import GameStatus from './components/GameStatus';
import RestartButton from './components/RestartButton';
import { 
    ROWS, 
    COLS, 
    MINES_COUNT, 
    createEmptyBoard, 
    generateBoardWithMines, 
    checkWinCondition 
} from './gameLogic';

export default function Minesweeper() {
    // Ініціалізація стану: перше поле порожнє до першого кліку (безпечний старт)
    const [board, setBoard] = useState(createEmptyBoard);
    const [status, setStatus] = useState('idle'); // idle, process, win, lose
    const [flagsUsed, setFlagsUsed] = useState(0);
    const [gameTime, setGameTime] = useState(0);
    const [clickedMine, setClickedMine] = useState(null);
    const [isFirstClick, setIsFirstClick] = useState(true);

    // Таймер гри
    useEffect(() => {
        let interval = null;
        if (status === 'process') {
            interval = setInterval(() => {
                setGameTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [status]);

    // Рестарт гри
    const initGame = useCallback(() => {
        setBoard(createEmptyBoard());
        setStatus('idle');
        setFlagsUsed(0);
        setGameTime(0);
        setClickedMine(null);
        setIsFirstClick(true);
    }, []);

    // Рекурсивне відкриття порожніх клітинок (Flood-fill)
    const revealEmptyCells = (currentBoard, row, col) => {
        const queue = [[row, col]];
        while (queue.length > 0) {
            const [r, c] = queue.shift();
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                        const neighbor = currentBoard[nr][nc];
                        if (neighbor.state === 'closed' && neighbor.type !== 'mine') {
                            neighbor.state = 'open';
                            if (neighbor.neighborMines === 0) {
                                queue.push([nr, nc]);
                            }
                        }
                    }
                }
            }
        }
    };

    // Обробник лівого кліку (відкриття клітинки)
    const handleCellClick = (row, col) => {
        if (status === 'win' || status === 'lose') return;
        const cell = board[row][col];
        if (cell.state === 'open' || cell.state === 'flagged') return;

        let currentBoard = board;
        let currentStatus = status;

        // На першому кліці генеруємо міни так, щоб клітинка та її сусіди були безпечними
        if (isFirstClick) {
            currentBoard = generateBoardWithMines(row, col);
            setIsFirstClick(false);
            currentStatus = 'process';
            setStatus('process');
        } else if (status === 'idle') {
            currentStatus = 'process';
            setStatus('process');
        }

        // Копіюємо дошку для збереження імутабельності стану React
        const newBoard = currentBoard.map(r => r.map(c => ({ ...c })));
        const target = newBoard[row][col];

        if (target.type === 'mine') {
            // Гра програна: відкриваємо всі міни
            target.state = 'open';
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    if (newBoard[r][c].type === 'mine') {
                        newBoard[r][c].state = 'open';
                    }
                }
            }
            setBoard(newBoard);
            setStatus('lose');
            setClickedMine({ r: row, c: col });
            return;
        }

        // Відкриваємо клітинку
        target.state = 'open';
        if (target.neighborMines === 0) {
            revealEmptyCells(newBoard, row, col);
        }

        // Перевірка на перемогу
        if (checkWinCondition(newBoard)) {
            setBoard(newBoard);
            setStatus('win');
        } else {
            setBoard(newBoard);
            if (currentStatus === 'process' && status === 'idle') {
                setStatus('process');
            }
        }
    };

    // Обробник правого кліку (встановлення/знімання прапорця)
    const handleContextMenu = (e, row, col) => {
        e.preventDefault();
        if (status === 'win' || status === 'lose') return;

        const cell = board[row][col];
        if (cell.state === 'open') return;

        const newBoard = board.map(r => r.map(c => ({ ...c })));
        const target = newBoard[row][col];

        if (target.state === 'closed') {
            target.state = 'flagged';
            setFlagsUsed(prev => prev + 1);
        } else if (target.state === 'flagged') {
            target.state = 'closed';
            setFlagsUsed(prev => prev - 1);
        }

        setBoard(newBoard);
    };

    const flagsLeft = MINES_COUNT - flagsUsed;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.minesweeperContainer}>
                <Header 
                    time={gameTime} 
                    flagsLeft={flagsLeft} 
                    status={status} 
                    onRestart={initGame} 
                />
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
                <RestartButton onRestart={initGame} />
            </div>
        </div>
    );
}