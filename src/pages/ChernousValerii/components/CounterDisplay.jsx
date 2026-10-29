import styles from './CounterDisplay.module.css';

function CounterDisplay({
  icon,
  value,
  title,
  variant = 'timer',
  role,
  ariaLive,
}) {
  const valueColorClass =
    variant === 'flag' ? styles.flagValue : styles.timerValue;

  return (
    <div
      className={styles.statBox}
      title={title}
      role={role}
      aria-live={ariaLive}
    >
      <span className={styles.statIcon} aria-hidden="true">
        {icon}
      </span>
      <span className={`${styles.statValue} ${valueColorClass}`}>{value}</span>
    </div>
  );
}

export default CounterDisplay;
