import React from 'react';
import styles from './Display.module.css';

const Display = ({ icon, value }) => {
  const formattedValue = String(Math.max(0, Math.min(value, 999))).padStart(3, '0');
  
  return (
    <div className={styles.display} role="status" aria-live="polite">
      {icon}{formattedValue}
    </div>
  );
};

export default Display;