
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
  const pendingFocusRef = useRef(null);

  function handleOpen(row, col) {
    pendingFocusRef.current = row * board[0].length + col;
    onOpen(row, col);
  }

  useLayoutEffect(() => {
    const openedIndex = pendingFocusRef.current;

    if (openedIndex === null) {
      return;
    }

    pendingFocusRef.current = null;

    if (disabled) {
      return;
    }

    const cells = Array.from(
      boardRef.current?.querySelectorAll('button') ?? [],
    );

    const nextCell =
      cells.slice(openedIndex + 1).find((cell) => !cell.disabled) ??
      cells.find((cell) => !cell.disabled);

    nextCell?.focus();
  }, [board, disabled]);

  return (
    <div
      ref={boardRef}
      className={styles.board}
      style={{ '--board-columns': board[0]?.length ?? 9 }}
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
