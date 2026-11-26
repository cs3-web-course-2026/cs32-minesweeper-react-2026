import { useEffect, useRef, useState } from 'react';
import { MODAL_DELAY_MS, STATUS } from '../constants/gameConfig';
import styles from './GameModal.module.css';

function GameModalDialog({ gameStatus, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const confirmBtnRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, MODAL_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
      previousFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      confirmBtnRef.current?.focus();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      confirmBtnRef.current?.focus();
    }
  };

  const handleButtonBlur = () => {
    setTimeout(() => {
      confirmBtnRef.current?.focus();
    }, 0);
  };

  const isWinner = gameStatus === STATUS.WIN;
  const title = isWinner ? 'Перемога! 🎉' : 'Поразка! 💥';
  const message = isWinner
    ? 'Перемога! Всі безпечні клітинки відкриті.'
    : 'Поразка! Ви натрапили на міну.';

  return (
    <div
      className={styles.modal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="minesweeper-modal-title"
      aria-describedby="minesweeper-modal-text"
    >
      <div className={styles.modalContent}>
        <div role="status" aria-live="polite" className={styles.srOnly}>
          {message}
        </div>
        <h2 id="minesweeper-modal-title" className={styles.title}>
          {title}
        </h2>
        <p id="minesweeper-modal-text" className={styles.text}>
          {message}
        </p>
        <button
          ref={confirmBtnRef}
          type="button"
          className={styles.modalBtn}
          onClick={onClose}
          onKeyDown={handleKeyDown}
          onBlur={handleButtonBlur}
        >
          Зрозуміло
        </button>
      </div>
    </div>
  );
}

export default function GameModal({ gameStatus, isOpen, onClose }) {
  if (!isOpen) return null;

  return <GameModalDialog gameStatus={gameStatus} onClose={onClose} />;
}