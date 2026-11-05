import { memo } from 'react';
import styles from './Cell.module.css';

const NUMBER_STYLES = [
  '', styles.n1, styles.n2, styles.n3, styles.n4,
  styles.n5, styles.n6, styles.n7, styles.n8,
];

function Cell({ cell, cols, finished, lost, onReveal, onToggleFlag }) {
  const wrongFlag = lost && cell.flagged && !cell.isMine;
  const mineIsVisible = cell.revealed && cell.isMine && !cell.flagged;
  let content = '';
  if (!wrongFlag) {
    if (cell.flagged) {
      content = '🚩';
    } else if (mineIsVisible) {
      content = '💣';
    } else if (cell.revealed && cell.adjacent > 0) {
      content = cell.adjacent;
    }
  }

  const className = [
    styles.cell,
    cell.revealed && !cell.flagged ? styles.open : styles.closed,
    cell.exploded ? styles.exploded : '',
    wrongFlag ? styles.wrongFlag : '',
    cell.revealed && !cell.isMine ? NUMBER_STYLES[cell.adjacent] : '',
  ].filter(Boolean).join(' ');

  let description = `${cell.adjacent} neighboring mines`;
  if (cell.flagged) {
    description = 'flagged cell';
  } else if (!cell.revealed) {
    description = 'closed cell';
  } else if (cell.isMine) {
    description = 'mine';
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={`Row ${Math.floor(cell.id / cols) + 1}, column ${cell.id % cols + 1}, ${description}`}
      aria-pressed={cell.flagged}
      disabled={finished || cell.revealed}
      onClick={(event) => (event.shiftKey ? onToggleFlag(cell.id) : onReveal(cell.id))}
      onContextMenu={(event) => {
        event.preventDefault();
        onToggleFlag(cell.id);
      }}
      onKeyDown={(event) => {
        if ((event.key === 'f' || event.key === 'F') && !event.repeat) {
          event.preventDefault();
          onToggleFlag(cell.id);
        }
      }}
    >
      <span aria-hidden="true">{content}</span>
      {wrongFlag && <span className={styles.wrongMark} aria-hidden="true">×</span>}
    </button>
  );
}

export default memo(Cell);
