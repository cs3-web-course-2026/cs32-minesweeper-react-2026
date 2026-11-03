import React from 'react';
import styles from './Cell.module.css';

export default function Cell({ cellData, onClick, onContextMenu }) {
    const { row, col, type, state, neighborMines, isExploded } = cellData;

    const getCellClasses = () => {
        const classes = [styles.cell];

        if (state === 'opened') {
            classes.push(styles.open);
            if (type === 'mine') {
                classes.push(styles.mine);
                if (isExploded) classes.push(styles.exploded);
            } else if (neighborMines > 0) {
                classes.push(styles[`number-${neighborMines}`]);
            }
        } else if (state === 'flagged') {
            classes.push(styles.flagged);
        }

        return classes.join(' ');
    };

    const renderContent = () => {
        if (state === 'opened') {
            if (type === 'mine') return '💣';
            if (neighborMines > 0) return neighborMines;
        } else if (state === 'flagged') {
            return '🚩';
        }
        return '';
    };

    return (
        <button
            type="button"
            className={getCellClasses()}
            onClick={onClick}
            onContextMenu={onContextMenu}
            aria-label={`Клітинка рядок ${row + 1}, колонка ${col + 1}`}
        >
            {renderContent()}
        </button>
    );
}