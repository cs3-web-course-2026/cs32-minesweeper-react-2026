
import { useLayoutEffect, useRef } from 'react';

import Cell from './Cell';
import styles from '../Game.module.css';

function Board({
  board,
  onOpen,
  onFlag,
  disabled = false,
  status,
  explodedCell,
}) {
  const boardRef = useRef(null);
  const pendingFocusRef = useRef(false);

  function handleOpen(row, col) {
    pendingFocusRef.current = true;
    onOpen(row, col);
  }

  useLayoutEffect(() => {
    if (!pendingFocusRef.current) {
      return;
    }

    pendingFocusRef.current = false;

    if (disabled) {
      return;
    }

    const nextCell = boardRef.current?.querySelector(
      'button:not(:disabled)',
    );

    nextCell?.focus();
  }, [board, disabled]);

  return (
    <div
      ref={boardRef}
      className={styles.board}
      role="group"
      aria-label="Ігрове поле Сапера"
    >
      {board.map((cells, row) =>
        cells.map((cell, col) => (
          <Cell
            key={`${row}-${col}`}
            cell={cell}
            row={row}
            col={col}
            onOpen={handleOpen}
            onFlag={onFlag}
            disabled={disabled}
            status={status}
            isExploded={
              explodedCell?.row === row &&
              explodedCell?.col === col
            }
          />
        )),
      )}
    </div>
  );
}

export default Board;
