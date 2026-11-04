import React from 'react';
import Cell from '../Cell/Cell';
import styles from './Board.module.css';

export default function Board({ board, onCellClick, onCellContextMenu }) {
    return (
        <div
            className={styles.board}
            style={{ gridTemplateColumns: `repeat(${board[0].length}, 36px)` }}
        >
            {board.map((row, rIdx) =>
                row.map((cell, cIdx) => (
                    <Cell
                        key={`${rIdx}-${cIdx}`}
                        cellData={cell}
                        onClick={() => onCellClick(rIdx, cIdx)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            onCellContextMenu(rIdx, cIdx);
                        }}
                    />
                ))
            )}
        </div>
    );
}