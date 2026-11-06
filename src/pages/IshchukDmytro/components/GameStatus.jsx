import { GAME_STATUS } from '../constants';
import styles from '../Game.module.css';

const MESSAGES = {
  [GAME_STATUS.PLAYING]: '',
  [GAME_STATUS.WON]: 'Перемога!',
  [GAME_STATUS.LOST]: 'Гру завершено',
};

export default function GameStatus({ status }) {
  return (
    <p className={styles.message} role="status">
      {MESSAGES[status]}
    </p>
  );
}
