import IconButton from "./IconButton";

function RestartButton({ onRestart }) {
  return (
    <IconButton label="Почати нову гру" onClick={onRestart}>
      🔁
    </IconButton>
  );
}

export default RestartButton;
