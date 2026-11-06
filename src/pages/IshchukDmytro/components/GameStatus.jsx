import styles from '../Game.module.css';

const MESSAGES = {
  playing: '',
  won: 'Перемога!',
  lost: 'Гру завершено',
};

export default function GameStatus({ status }) {
  return (
    <p className={styles.message} role="status">
      {MESSAGES[status]}
    </p>
  );
}
