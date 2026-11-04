import { GAME_STATUS, RESTART_LABEL } from '../constants/game';
import bombHappy from '../assets/bomb-happy.webp';
import bombDizzy from '../assets/bomb-dizzy.webp';

import styles from './RestartButton.module.css';

/** Бомба на кнопці: після поразки — перелякана, в інших станах — усміхнена. */
const MASCOT_IMAGE = {
  [GAME_STATUS.IDLE]: bombHappy,
  [GAME_STATUS.PLAYING]: bombHappy,
  [GAME_STATUS.WON]: bombHappy,
  [GAME_STATUS.LOST]: bombDizzy,
};


function RestartButton({ status, isFinished, onRestart }) {
  return (
    <button
      type="button"
      className={styles.restart}
      aria-label={isFinished ? RESTART_LABEL.PLAY_AGAIN : RESTART_LABEL.NEW_GAME}
      onClick={onRestart}
    >
      <img
        key={status}
        className={[styles.mascot, styles[status]].join(' ')}
        src={MASCOT_IMAGE[status]}
        alt=""
      />
    </button>
  );
}

export default RestartButton;
