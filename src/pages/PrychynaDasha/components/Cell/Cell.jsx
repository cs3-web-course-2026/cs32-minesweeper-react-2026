import styles from './Cell.module.css';

export function Cell({ data, onClick, onContextMenu }) {
  const renderContent = () => {
    if (data.isFlagged) return '🚩';
    if (!data.isRevealed) return '';
    if (data.isMine) return '💣';
    if (data.neighborMines > 0) return data.neighborMines;
    return '';
  };

  const className = `${styles.cell} ${data.isRevealed ? styles.revealed : ''}`;

  return (
    <button 
      className={className} 
      onClick={onClick} 
      onContextMenu={onContextMenu}
    >
      {renderContent()}
    </button>
  );
}