import styles from './GameStatus.module.css';

export const GameStatus = ({ status }) => {
  return (
    <p className={styles.gameMessage} role="status" aria-live="polite">
      {status === 'win' && 'Перемога! Ви знайшли всі безпечні клітинки!'}
      {status === 'lose' && 'Поразка! Ви натрапили на міну.'}
    </p>
  );
};
