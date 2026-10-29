import styles from './GameStatus.module.css';

export function GameStatus({ status }) {
  const getMessage = () => {
    if (status === 'won') return '🎉 Перемога!';
    if (status === 'lost') return '💥 Поразка!';
    return '🎮 Гра триває';
  };

  return <div className={styles.status}>{getMessage()}</div>;
}