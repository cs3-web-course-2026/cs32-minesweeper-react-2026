import styles from "./IconButton.module.css";

function IconButton({ label, isPressed, onClick, children }) {
  const className = [styles.button, isPressed ? styles.active : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      aria-pressed={isPressed}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default IconButton;
