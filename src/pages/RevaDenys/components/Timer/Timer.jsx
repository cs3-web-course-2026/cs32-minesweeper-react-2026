import styles from './Timer.module.css';

export const Timer = ({ value }) => {
  const formattedTime = String(value).padStart(3, '0');

  return (
    <div className={styles.stoneTracker} title="Час випробування">
      <span className={styles.trackerIcon} aria-hidden="true">
        ⏳
      </span>
      <time
        className={styles.trackerValue}
        role="timer"
        aria-live="off"
        aria-label={`Минуло секунд: ${value}`}
      >
        {formattedTime}
      </time>
    </div>
  );
};
