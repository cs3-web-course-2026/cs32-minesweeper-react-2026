import { GAME_MESSAGE } from '../constants/game';

import styles from './GameStatus.module.css';


function GameStatus({ status }) {
  return (
    <p className={styles.message} role="status" aria-live="polite">
      {GAME_MESSAGE[status]}
    </p>
  );
}


export default GameStatus;
