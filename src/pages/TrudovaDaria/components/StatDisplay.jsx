import styles from "./StatDisplay.module.css";

function StatDisplay({ label, value }) {
  return (
    <div className={styles.stat}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

export default StatDisplay;
