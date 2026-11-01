import React from 'react';
import styles from '../Minesweeper.module.css';
import Cell from './Cell';

export default function Board({ board, onCellClick, onContextMenu, status, clickedMine, rows, cols }) {
    return (
        <main
            className={styles.gameBoard}
            style={{
                gridTemplateColumns: `repeat(${cols}, 40px)`,
                gridTemplateRows: `repeat(${rows}, 40px)`
            }}
        >
            {board.map((row, r) =>
                row.map((cell, c) => (
                    <Cell
                        key={`${r}-${c}`}
                        cell={cell}
                        row={r}
                        col={c}
                        onClick={onCellClick}
                        onContextMenu={onContextMenu}
                        gameStatus={status}
                        clickedMine={clickedMine}
                    />
                ))
            )}
        </main>
    );
}