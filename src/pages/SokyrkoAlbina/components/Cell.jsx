import { getCellView } from '../utils/boardUtils';
import styles from './Cell.module.css';

export default function Cell({ cell, gameStatus, onOpen, onToggleFlag }) {
  const view = getCellView(cell, gameStatus);

  const cellClasses = [
    styles.cell,
    view.isOpen ? styles.open : '',
    view.isExploded ? styles.exploded : '',
    view.isFalseFlag ? styles.falseFlag : '',
    view.number ? styles[`number${view.number}`] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleContextMenu = (event) => {
    event.preventDefault();
    onToggleFlag(cell.row, cell.col);
  };

  return (
    <button
      type="button"
      className={cellClasses}
      onClick={() => onOpen(cell.row, cell.col)}
      onContextMenu={handleContextMenu}
      aria-label={view.label}
    >
      {view.text}
    </button>
  );
}