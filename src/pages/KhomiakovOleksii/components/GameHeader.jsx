import Counter from './Counter';
import RestartButton from './RestartButton';
import styles from '../KhomiakovOleksii.module.css';

export default function GameHeader({
  minesLeft,
  gameTime,
  status,
  onRestart,
}) {
  return (
    <header className={styles.gameHeader}>
      <Counter value={minesLeft} ariaLabel="Кількість мін" isPolite={true} />
      <RestartButton status={status} onRestart={onRestart} />
      <Counter value={gameTime} ariaLabel="Час гри" />
    </header>
  );
}