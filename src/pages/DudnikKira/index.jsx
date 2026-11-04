import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Board from './components/Board/Board';
import { createBoard, revealCell } from './utils/gameLogic';
import styles from './Minesweeper.module.css';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

export default function DudnikKiraGame() {
    const [board, setBoard] = useState([]);
    const [status, setStatus] = useState('idle'); // 'idle' | 'playing' | 'won' | 'lost'
    const [flagsLeft, setFlagsLeft] = useState(MINES);
    const [timer, setTimer] = useState(0);

    const initGame = () => {
        setBoard(createBoard(ROWS, COLS, MINES));
        setStatus('idle');
        setFlagsLeft(MINES);
        setTimer(0);
    };

    useEffect(() => {
        initGame();
    }, []);

    useEffect(() => {
        let interval = null;
        if (status === 'playing') {
            interval = setInterval(() => setTimer(prev => prev + 1), 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [status]);

    const handleCellClick = (r, c) => {
        if (status === 'won' || status === 'lost') return;
        const cell = board[r][c];
        if (cell.isFlagged || cell.isOpen) return;

        if (status === 'idle') setStatus('playing');

        if (cell.isMine) {
            const revealedBoard = board.map(row =>
                row.map(cell => (cell.isMine ? { ...cell, isOpen: true } : cell))
            );
            setBoard(revealedBoard);
            setStatus('lost');
            return;
        }

        const newBoard = revealCell(board, r, c);
        setBoard(newBoard);

        let unrevealedSafeCells = 0;
        newBoard.forEach(row =>
            row.forEach(cell => {
                if (!cell.isMine && !cell.isOpen) unrevealedSafeCells++;
            })
        );
        if (unrevealedSafeCells === 0) setStatus('won');
    };

    const handleCellContextMenu = (r, c) => {
        if (status === 'won' || status === 'lost') return;
        const cell = board[r][c];
        if (cell.isOpen) return;

        if (status === 'idle') setStatus('playing');

        const newBoard = board.map((row, rIdx) =>
            row.map((cell, cIdx) => {
                if (rIdx === r && cIdx === c) {
                    const nextFlagState = !cell.isFlagged;
                    setFlagsLeft(prev => (nextFlagState ? prev - 1 : prev + 1));
                    return { ...cell, isFlagged: nextFlagState };
                }
                return cell;
            })
        );

        setBoard(newBoard);
    };

    if (!board.length) return null;

    return (
        <div className={styles.gameContainer}>
            <div className={styles.card}>
                <h2 className={styles.title}>Minesweeper</h2>
                <Header
                    flagsLeft={flagsLeft}
                    timer={timer}
                    status={status}
                    onRestart={initGame}
                />
                <Board
                    board={board}
                    onCellClick={handleCellClick}
                    onCellContextMenu={handleCellContextMenu}
                />
            </div>
        </div>
    );
}