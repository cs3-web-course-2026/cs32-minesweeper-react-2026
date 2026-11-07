import styles from './Cell.module.css';

function Cell({ cell, onClick, onContextMenu }) {
  const getContent = () => {
    if (cell.flagged) return '🚩';
    if (!cell.revealed) return '';
    if (cell.isMine) return '💣';
    if (cell.adjacentMines === 0) return '';

    return cell.adjacentMines;
  };

  return (
    <button
  type="button"
  className={`${styles.cell} ${cell.revealed ? styles.revealed : ''}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      disabled={cell.revealed}
      aria-label={
        cell.revealed
          ? `Відкрита клітинка: ${getContent()}`
          : 'Закрита клітинка'
      }
    >
      {getContent()}
    </button>
  );
}

export default Cell;