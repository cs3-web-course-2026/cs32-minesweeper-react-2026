import IconButton from "./IconButton";

function FlagModeButton({ isFlagMode, onToggle }) {
  return (
    <IconButton
      label="Режим прапорця"
      isPressed={isFlagMode}
      onClick={onToggle}
    >
      🚩
    </IconButton>
  );
}

export default FlagModeButton;
