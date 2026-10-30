import { STATUS_MESSAGE } from '../constants/game';

import styles from './GameStatus.module.css';


/** Повідомлення про стан гри у вигляді інтертитру німого кіно. */
function GameStatus({ status, isFinished }) {
  return (
    <p
      className={[styles.status, isFinished ? styles.finale : ''].join(' ')}
      role="status"
      aria-live="polite"
    >
      {STATUS_MESSAGE[status]}
    </p>
  );
}

export default GameStatus;
