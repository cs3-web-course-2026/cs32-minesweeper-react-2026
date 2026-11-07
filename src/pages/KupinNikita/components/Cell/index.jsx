import styles from './Cell.module.css';

function Cell({ cell, onClick, onContextMenu }) {
  const getContent = () => {
    if (cell.flagged) return '🚩';
    if (!cell.revealed) return '';
    if (cell.isMine) return '💣';
    if (cell.adjacentMines === 0) return '';

    return cell.adjacentMines;
  };

  const getLabel = () => {
    if (cell.flagged) return 'Закрита клітинка, встановлено прапорець';
    if (!cell.revealed) return 'Закрита клітинка';

    return `Відкрита клітинка: ${getContent()}`;
  };

  return (
    <button
      type="button"
      className={`${styles.cell} ${cell.revealed ? styles.revealed : ''}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      disabled={cell.revealed}
      aria-label={getLabel()}
    >
      {getContent()}
    </button>
  );
}

export default Cell;