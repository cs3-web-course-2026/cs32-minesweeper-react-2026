
import { CELL_STATE } from '../constants/game';

import styles from '../Minesweeper.module.css';

export default function CellButton({
                                     cell,
                                     row,
                                     col,
                                     onReveal,
                                     onFlag,
                                   }) {
  const classNames = [
    styles.cell,
    cell.opened ? styles.revealed : '',
    cell.opened && cell.mine ? styles.mine : '',
    cell.flagged ? styles.flagged : '',
  ].filter(Boolean).join(' ');

  let cellState = CELL_STATE.CLOSED;
  let description = 'Закрита клітинка';
  let content = '';

  if (cell.opened) {
    cellState = CELL_STATE.OPEN;

    if (cell.mine) {
      description = 'Відкрита міна';
      content = '💣';
    } else {
      description = `Відкрито, сусідніх мін: ${cell.count}`;
      content = cell.count || '';
    }
  } else if (cell.flagged) {
    cellState = CELL_STATE.FLAGGED;
    description = 'Позначено прапорцем';
    content = '🚩';
  }

  function handleContextMenu(event) {
    event.preventDefault();
    onFlag(row, col);
  }

  function handleKeyDown(event) {
    if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      onFlag(row, col);
    }
  }

  return (
    <button
      type="button"
      className={classNames}
      data-state={cellState}
      onClick={() => onReveal(row, col)}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      aria-label={`Рядок ${row + 1}, стовпець ${col + 1}. ${description}`}
    >
      {content}
    </button>
  );
}
