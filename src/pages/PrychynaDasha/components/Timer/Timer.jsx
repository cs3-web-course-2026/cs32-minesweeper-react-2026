import { useEffect } from 'react';
import styles from './Timer.module.css';

export function Timer({ seconds, setSeconds, isActive }) {
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, setSeconds]);

  return <div className={styles.timer}>⏱️ Час: {seconds} с</div>;
}