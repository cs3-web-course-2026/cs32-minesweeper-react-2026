import React from 'react';
import styles from '../Minesweeper.module.css';

export default function Cell({ cell, row, col, onClick, onContextMenu, gameStatus, clickedMine }) {
    // Визначаємо текстовий опис стану для screen-reader (accessibility)
    let stateDescription = 'closed cell';
    if (cell.state === 'flagged') {
        stateDescription = 'flagged cell';
    } else if (cell.state === 'open') {
        if (cell.type === 'mine') {
            stateDescription = 'revealed mine';
        } else if (cell.neighborMines > 0) {
            stateDescription = `revealed number ${cell.neighborMines}`;
        } else {
            stateDescription = 'empty revealed cell';
        }
    }

    const getNumberColor = (num) => {
        const colors = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080'];
        return colors[num] || '#000';
    };

    let content = null;
    let dataNumber = null;

    if (cell.state === 'flagged') {
        content = '🚩';
    } else if (cell.state === 'open') {
        if (cell.type === 'mine') {
            content = '💣';
        } else if (cell.neighborMines > 0) {
            content = cell.neighborMines;
            dataNumber = cell.neighborMines;
        }
    }

    const isClickedMine = clickedMine && clickedMine.r === row && clickedMine.c === col;

    return (
        <button
            type="button"
            className={`${styles.cell} ${cell.state === 'open' ? styles.cellOpen : ''} ${cell.type === 'mine' && cell.state === 'open' ? styles.cellMine : ''} ${isClickedMine ? styles.cellClicked : ''} ${cell.state === 'flagged' && gameStatus === 'lose' && cell.type !== 'mine' ? styles.wrongFlag : ''}`}
            onClick={() => onClick(row, col)}
            onContextMenu={(e) => onContextMenu(e, row, col)}
            style={{ color: dataNumber ? getNumberColor(dataNumber) : 'inherit' }}
            aria-label={`Row ${row + 1}, Column ${col + 1}, ${stateDescription}`}
        >
            {content}
        </button>
    );
}