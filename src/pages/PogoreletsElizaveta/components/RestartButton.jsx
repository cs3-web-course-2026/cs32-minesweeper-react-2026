import styles from "./RestartButton.module.css";

export default function RestartButton({ onRestart, status }) {
  let face = "🤓";

  if (status === "win") {
    face = "😎";
  } else if (status === "lose") {
    face = "😵";
  }

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