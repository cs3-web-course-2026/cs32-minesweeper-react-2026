import { GAME_CONFIG } from "../constants/game";

import CellButton from "./CellButton";

import styles from "./Board.module.css";

function Board({ board, isDisabled, onCellClick, onCellFlag }) {
  return (
    <section
      className={styles.board}
      style={{ "--board-columns": GAME_CONFIG.COLS }}
      aria-label="Ігрове поле сапера"
    >
      {board.map((boardRow, row) =>
        boardRow.map((cell, col) => (
          <CellButton
            key={`${row}-${col}`}
            cell={cell}
            row={row}
            col={col}
            isDisabled={isDisabled}
            onReveal={onCellClick}
            onFlag={onCellFlag}
          />
        )),
      )}
    </section>
  );
}

export default Board;
