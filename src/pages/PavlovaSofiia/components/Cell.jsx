import styles from './Cell.module.css';

export default function Cell({ cell, row, col, onOpen, onFlag }) {
  const handleContextMenu = (e) => {
    e.preventDefault();
    onFlag(row, col);
  };

  let content = '';

  if (cell.state === 'flagged') {
    content = '🚩';
  }

  if (cell.state === 'opened' && cell.type === 'mine') {
    content = cell.exploded ? '💥' : '💣';
  }

  if (
    cell.state === 'opened' &&
    cell.type !== 'mine' &&
    cell.neighborMines > 0
  ) {
    content = cell.neighborMines;
  }

  return (
    <button
      className={`
        ${styles.cell}
        ${cell.state === 'opened' ? styles.opened : ''}
        ${cell.exploded ? styles.exploded : ''}
      `}
      aria-label={`Row ${row + 1}, Column ${col + 1}, ${cell.state}`}
      onClick={() => onOpen(row, col)}
      onContextMenu={handleContextMenu}
    >
      {content}
    </button>
  );
}
