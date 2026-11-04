import { memo } from 'react';

import { CELL_ICON, CELL_STATE, CELL_VIEW } from '../constants/game';
import { formatCellLabel, getCellView } from '../utils/view';

import styles from './CellButton.module.css';


function getCellContent(cellView, neighborMines) {
  if (cellView === CELL_VIEW.NUMBER) return neighborMines;

  return CELL_ICON[cellView] ?? null;
}


/**
 * Одна клітинка поля. aria-disabled замість disabled: неактивна кнопка
 * «ковтає» contextmenu, і браузерне меню перестало б блокуватися.
 */
function CellButton({ cell, row, col, isFinished, onOpen, onFlag }) {
  const cellView = getCellView(cell, isFinished);
  const isInactive = isFinished || cell.state === CELL_STATE.OPENED;

  const handleClick = () => onOpen(row, col);

  const handleContextMenu = (event) => {
    event.preventDefault();
    onFlag(row, col);
  };

  return (
    <button
      type="button"
      className={[styles.cell, styles[cellView]].join(' ')}
      data-count={cellView === CELL_VIEW.NUMBER ? cell.neighborMines : undefined}
      aria-label={formatCellLabel(row, col, cellView, cell.neighborMines)}
      aria-disabled={isInactive}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {getCellContent(cellView, cell.neighborMines)}
    </button>
  );
}

export default memo(CellButton);
