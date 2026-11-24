import styles from "./StatBox.module.css";
import { formatNumber } from "../constants/game";

export default function Timer({ seconds }) {
  return (
    <div className={styles.statBox} aria-label="Время игры">
      <span className={styles.statLabel}>⏱️</span>
      <span>{formatNumber(seconds)}</span>
    </div>
  );
}
