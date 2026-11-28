import { RESTART_BUTTON_FACE } from '../constants/game';

import styles from './RestartButton.module.css';


function RestartButton({ status, onRestart }) {
  return (
    <button
      type="button"
      className={styles.restartButton}
      aria-label="Start new game"
      title="Start new game"
      onClick={onRestart}
    >
      {RESTART_BUTTON_FACE[status]}
    </button>
  );
}


export default RestartButton;
