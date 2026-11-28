import styles from './RestartButton.module.css';

export const RestartButton = ({ status, onClick }) => {
  const getAvatar = () => {
    if (status === 'lose') return '💀';
    if (status === 'win') return '👑';
    return '🛡️';
  };

  return (
    <button
      type="button"
      className={styles.valhallaBtn}
      onClick={onClick}
      aria-label="Розпочати нову битву"
    >
      <span className={styles.vikingAvatar} aria-hidden="true">
        {getAvatar()}
      </span>
    </button>
  );
};
