import styles from "./StatBox.module.css";
import { formatNumber } from "../constants/game";

export default function FlagCounter({ count }) {
  return (
    <div className={styles.statBox} role="status" aria-live="polite">
      <span className={styles.statLabel}>🚩</span>
      <span>{formatNumber(count)}</span>
    </div>
  );
}
