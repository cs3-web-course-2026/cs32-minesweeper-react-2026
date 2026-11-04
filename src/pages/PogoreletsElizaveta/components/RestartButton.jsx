import styles from "./RestartButton.module.css";

export default function RestartButton({ onRestart, status }) {
  const face = status === "win" ? "😎" : status === "lose" ? "😵" : "🤓";

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onRestart}
      title="Начать новую игру"
      aria-label="Перезапустить игру"
    >
      {face}
    </button>
  );
}
