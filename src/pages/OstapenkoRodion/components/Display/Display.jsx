import React from 'react';
import styles from './Display.module.css';

const Display = ({ icon, value }) => {
  let formattedValue;
  if (value < 0) {
    formattedValue = '-' + String(Math.abs(value)).padStart(2, '0');
  } else {
    formattedValue = String(Math.min(value, 999)).padStart(3, '0');
  }
  
  return (
    <div className={styles.display} role="status" aria-live="polite">
      {icon}{formattedValue}
    </div>
  );
};

export default Display;