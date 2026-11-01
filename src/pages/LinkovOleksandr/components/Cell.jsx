import React from 'react';
import styles from '../Minesweeper.module.css';

export default function Cell({ cell, row, col, onClick, onContextMenu, gameStatus, clickedMine }) {
    let cellClass = styles.cell;
    let content = '';
    let dataNumber = null;

    if (cell.state === 'opened') {
        cellClass += ` ${styles.cellOpen}`;
        if (cell.type === 'mine') {
            cellClass += ` ${styles.cellMine}`;
            content = '💣';
            if (clickedMine?.r === row && clickedMine?.c === col) {
                cellClass += ` ${styles.cellClicked}`;
            }
        } else if (cell.neighborMines > 0) {
            content = cell.neighborMines;
            dataNumber = cell.neighborMines;
        }
    } else if (cell.state === 'flagged') {
        content = '🚩';
        if (gameStatus === 'lose' && cell.type !== 'mine') {
            cellClass += ` ${styles.wrongFlag}`;
        }
    }

    // Встановлення кольору тексту залежно від кількості мін
    const getNumberColor = (num) => {
        const colors = { 1: 'blue', 2: 'green', 3: 'red', 4: 'darkblue', 5: 'brown', 6: 'cyan', 7: 'black', 8: 'gray' };
        return colors[num] || 'inherit';
    };

    return (
        <button
            type="button"
            className={cellClass}
            onClick={() => onClick(row, col)}
            onContextMenu={(e) => onContextMenu(e, row, col)}
            style={{ color: dataNumber ? getNumberColor(dataNumber) : 'inherit' }}
            aria-label={`Row ${row + 1}, Column ${col + 1}`}
        >
            {content}
        </button>
    );
}