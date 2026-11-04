import React from 'react';
import styles from './Cell.module.css';

export default function Cell({ cellData, onClick, onContextMenu }) {
    const { isMine, isOpen, isFlagged, neighborMines } = cellData;

    const renderContent = () => {
        if (isFlagged) return '🚩';
        if (!isOpen) return '';
        if (isMine) return '💣';
        return neighborMines > 0 ? neighborMines : '';
    };

    const getCellClass = () => {
        let classes = [styles.cell];
        if (isOpen) {
            classes.push(styles.open);
            if (isMine) classes.push(styles.mine);
        } else if (isFlagged) {
            classes.push(styles.flagged);
        }
        return classes.join(' ');
    };

    return (
        <button
            className={getCellClass()}
            onClick={onClick}
            onContextMenu={onContextMenu}
            data-count={isOpen && neighborMines > 0 ? neighborMines : undefined}
        >
            {renderContent()}
        </button>
    );
}