import { useCallback, useRef, useState } from 'react';

import CellButton from './CellButton';

import styles from './Board.module.css';


const INITIAL_TAB_STOP = { row: 0, col: 0 };


function Board({ board, status, onOpenCell, onFlagCell }) {
  const boardRef = useRef(null);
  const [tabStop, setTabStop] = useState(INITIAL_TAB_STOP);
  const rowsCount = board.length;
  const colsCount = board[0].length;

  const handleCellFocus = useCallback(
    (row, col) => setTabStop({ row, col }),
    [],
  );

  // Focusing the cell also moves the Tab stop through handleCellFocus.
  const handleMoveFocus = useCallback(
    (row, col) => {
      const isInsideBoard =
        row >= 0 && row < rowsCount && col >= 0 && col < colsCount;

      if (isInsideBoard) {
        boardRef.current.children[row * colsCount + col].focus();
      }
    },
    [rowsCount, colsCount],
  );

  return (
    <section
      ref={boardRef}
      className={styles.board}
      style={{ '--board-columns': colsCount }}
      aria-label="Minefield"
    >
      {board.map((rowCells, row) =>
        rowCells.map((cell, col) => (
          <CellButton
            key={`${row}-${col}`}
            cell={cell}
            row={row}
            col={col}
            status={status}
            isTabStop={tabStop.row === row && tabStop.col === col}
            onOpen={onOpenCell}
            onFlag={onFlagCell}
            onFocusCell={handleCellFocus}
            onMoveFocus={handleMoveFocus}
          />
        )),
      )}
    </section>
  );
}


export default Board;
