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
    <div
      className={`
        ${styles.cell}
        ${cell.state === 'opened' ? styles.opened : ''}
        ${cell.exploded ? styles.exploded : ''}
      `}
      onClick={() => onOpen(row, col)}
      onContextMenu={handleContextMenu}
    >
      {content}
    </div>
  );
}
